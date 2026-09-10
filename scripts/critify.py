#!/usr/bin/env python3
"""
crtify — bake a CRT-monitor look into an image so it belongs on a terminal page.

    pip install pillow numpy
    ./crtify.py headshot.jpg -o out/
    ./crtify.py photos/*.jpg -o out/ --size 640 --curve 0.10
    ./crtify.py shot.png -o out/ --tint-amount 0.55 --highlight '#05ce91'

Everything is a dial. Defaults are tuned for the slate-blue terminal palette
(#1d2a35 ground, #cbd5e1 text). Run with --contact-sheet to compare settings
side by side before you commit.

Pipeline, in order — each stage can be turned off with its dial at 0:
    resize -> grade (saturation/contrast/brightness) -> duotone tint
    -> bloom -> chromatic aberration -> scanlines -> shadow mask
    -> barrel curve -> vignette -> grain
"""

import argparse
import glob
import os
import sys

import numpy as np
from PIL import Image, ImageFilter, ImageOps

# ---------------------------------------------------------------- helpers

def hex2rgb(s):
    s = s.lstrip("#")
    if len(s) == 3:
        s = "".join(c * 2 for c in s)
    return np.array([int(s[i:i + 2], 16) for i in (0, 2, 4)], dtype=np.float32)


def to_arr(im):
    """PIL RGB -> float array in 0..1"""
    return np.asarray(im.convert("RGB"), dtype=np.float32) / 255.0


def to_img(a):
    return Image.fromarray((np.clip(a, 0, 1) * 255 + 0.5).astype(np.uint8))


def luma(a):
    return a @ np.array([0.2126, 0.7152, 0.0722], dtype=np.float32)


def screen(base, top):
    """Screen blend — how phosphor bloom actually adds light."""
    return 1 - (1 - base) * (1 - top)


# ---------------------------------------------------------------- stages

def grade(a, saturation, contrast, brightness, black_lift):
    l = luma(a)[..., None]
    a = l + (a - l) * saturation
    a = (a - 0.5) * contrast + 0.5
    a = a * brightness
    # CRTs never reach true black; lift the floor so shadows read as glass
    return a * (1 - black_lift) + black_lift


def duotone(a, shadow, highlight, amount):
    """Pull the image toward a two-point ramp built from the page palette."""
    if amount <= 0:
        return a
    l = np.clip(luma(a), 0, 1)[..., None]
    ramp = shadow + (highlight - shadow) * l
    return a * (1 - amount) + ramp * amount


def bloom(a, radius, amount, threshold):
    if amount <= 0:
        return a
    l = luma(a)
    mask = np.clip((l - threshold) / max(1e-6, 1 - threshold), 0, 1)[..., None]
    bright = to_img(a * mask).filter(ImageFilter.GaussianBlur(radius))
    return screen(a, to_arr(bright) * amount)


def aberration(a, px):
    """Shift R and B apart by a pixel or two — beam misconvergence."""
    if px <= 0:
        return a
    out = a.copy()
    out[..., 0] = np.roll(a[..., 0], px, axis=1)
    out[..., 2] = np.roll(a[..., 2], -px, axis=1)
    return out


def scanlines(a, pitch, depth, thickness):
    if depth <= 0:
        return a
    h = a.shape[0]
    y = np.arange(h)
    dark = ((y % pitch) < thickness).astype(np.float32)
    return a * (1 - dark * depth)[:, None, None]


def shadow_mask(a, depth):
    """Aperture-grille stripes: dim R/G/B on a 3px horizontal cycle."""
    if depth <= 0:
        return a
    w = a.shape[1]
    x = np.arange(w) % 3
    mask = np.ones((w, 3), dtype=np.float32)
    for c in range(3):
        mask[x != c, c] = 1 - depth
    return a * mask[None, :, :]


def barrel(a, k, edge):
    """Bulge the glass. k=0 flat, 0.08–0.15 is a believable curve."""
    if k <= 0:
        return a
    h, w = a.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    cx, cy = (w - 1) / 2, (h - 1) / 2
    nx, ny = (xx - cx) / cx, (yy - cy) / cy
    r2 = nx * nx + ny * ny
    # scale so the corners land exactly on the corners — otherwise the bulge
    # samples past the edge and you get a band of background around the frame
    f = (1 + k * r2) / (1 + 2 * k)
    sx = nx * f * cx + cx
    sy = ny * f * cy + cy
    inside = (sx >= 0) & (sx <= w - 1) & (sy >= 0) & (sy <= h - 1)
    sx = np.clip(sx, 0, w - 1)
    sy = np.clip(sy, 0, h - 1)
    x0, y0 = np.floor(sx).astype(int), np.floor(sy).astype(int)
    x1, y1 = np.minimum(x0 + 1, w - 1), np.minimum(y0 + 1, h - 1)
    fx, fy = (sx - x0)[..., None], (sy - y0)[..., None]
    out = (a[y0, x0] * (1 - fx) * (1 - fy) + a[y0, x1] * fx * (1 - fy)
           + a[y1, x0] * (1 - fx) * fy + a[y1, x1] * fx * fy)
    return np.where(inside[..., None], out, edge[None, None, :])


def vignette(a, amount, falloff):
    if amount <= 0:
        return a
    h, w = a.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    nx = (xx - (w - 1) / 2) / ((w - 1) / 2)
    ny = (yy - (h - 1) / 2) / ((h - 1) / 2)
    r = np.sqrt(nx * nx + ny * ny) / np.sqrt(2)
    v = 1 - amount * np.clip((r - falloff) / max(1e-6, 1 - falloff), 0, 1) ** 1.6
    return a * v[..., None]


def grain(a, amount, seed=7):
    if amount <= 0:
        return a
    rng = np.random.default_rng(seed)
    return a + rng.normal(0, amount, a.shape).astype(np.float32)


# ---------------------------------------------------------------- pipeline

def crtify(im, o):
    if o.size:
        im = (ImageOps.fit(im, (o.size, o.size), Image.LANCZOS) if o.square
              else ImageOps.contain(im, (o.size, o.size), Image.LANCZOS))
    if o.autocontrast:
        im = ImageOps.autocontrast(im.convert("RGB"), cutoff=1)

    shadow = hex2rgb(o.shadow) / 255.0
    highlight = hex2rgb(o.highlight) / 255.0

    a = to_arr(im)
    a = grade(a, o.saturation, o.contrast, o.brightness, o.black_lift)
    a = duotone(a, shadow, highlight, o.tint_amount)
    a = bloom(a, o.bloom_radius, o.bloom, o.bloom_threshold)
    a = aberration(a, o.aberration)
    a = scanlines(a, o.scan_pitch, o.scan_depth, o.scan_thickness)
    a = shadow_mask(a, o.mask_depth)
    a = barrel(a, o.curve, shadow)
    a = vignette(a, o.vignette, o.vignette_falloff)
    a = grain(a, o.grain)
    return to_img(a)


PRESETS = {
    # name:        overrides
    "slate":   dict(),                                        # the default look
    "soft":    dict(scan_depth=0.14, curve=0.0, bloom=0.22, vignette=0.30),
    "heavy":   dict(scan_depth=0.34, curve=0.14, aberration=2, mask_depth=0.10,
                    grain=0.014, vignette=0.55),
    "amber":   dict(shadow="#1a1206", highlight="#ffcf87", tint_amount=0.55,
                    saturation=0.25),
    "green":   dict(shadow="#08120e", highlight="#9dffcb", tint_amount=0.60,
                    saturation=0.20),
    # screenshots are already flat-field: autocontrast would crush the terminal
    # background to black, so it stays off here
    "screenshot": dict(size=0, square=False, saturation=0.9, tint_amount=0.12,
                       autocontrast=False, black_lift=0.0, scan_depth=0.16,
                       curve=0.0, bloom=0.15, vignette=0.22),
}


def build_parser(suppress=False):
    """suppress=True builds the same parser with no defaults, so we can tell
    which options the user actually typed and let those beat the preset."""
    p = argparse.ArgumentParser(description="Bake a CRT look into images.",
                                formatter_class=argparse.ArgumentDefaultsHelpFormatter,
                                )
    p.add_argument("inputs", nargs="+", help="image files or globs")
    p.add_argument("-o", "--outdir", default="crt-out")
    p.add_argument("--suffix", default="-crt")
    p.add_argument("--format", default="png", choices=["png", "jpg", "webp"])
    p.add_argument("--quality", type=int, default=86)
    p.add_argument("--preset", choices=sorted(PRESETS), default="slate")
    p.add_argument("--contact-sheet", action="store_true",
                   help="write one image with every preset side by side")

    g = p.add_argument_group("geometry")
    g.add_argument("--size", type=int, default=560, help="longest side / square edge; 0 keeps original")
    g.add_argument("--square", action="store_true", default=True)
    g.add_argument("--no-square", dest="square", action="store_false")

    g = p.add_argument_group("grade")
    g.add_argument("--saturation", type=float, default=0.45)
    g.add_argument("--contrast", type=float, default=1.12)
    g.add_argument("--brightness", type=float, default=0.98)
    g.add_argument("--black-lift", type=float, default=0.045)
    g.add_argument("--autocontrast", action="store_true", default=True)
    g.add_argument("--no-autocontrast", dest="autocontrast", action="store_false")

    g = p.add_argument_group("palette")
    g.add_argument("--shadow", default="#1d2a35", help="page background")
    g.add_argument("--highlight", default="#cbd5e1", help="page foreground")
    g.add_argument("--tint-amount", type=float, default=0.38, help="0 keeps full color, 1 is pure duotone")

    g = p.add_argument_group("tube")
    g.add_argument("--bloom", type=float, default=0.30)
    g.add_argument("--bloom-radius", type=float, default=7.0)
    g.add_argument("--bloom-threshold", type=float, default=0.62)
    g.add_argument("--aberration", type=int, default=1, help="pixels of R/B separation")
    g.add_argument("--scan-pitch", type=int, default=3, help="scanline period in px")
    g.add_argument("--scan-thickness", type=int, default=1)
    g.add_argument("--scan-depth", type=float, default=0.24)
    g.add_argument("--mask-depth", type=float, default=0.06, help="aperture-grille strength")
    g.add_argument("--curve", type=float, default=0.08, help="barrel distortion")
    g.add_argument("--vignette", type=float, default=0.45)
    g.add_argument("--vignette-falloff", type=float, default=0.35)
    g.add_argument("--grain", type=float, default=0.008)
    if suppress:
        for action in p._actions:          # strip defaults: only typed flags land
            action.default = argparse.SUPPRESS
    return p


def main(argv=None):
    p = build_parser()
    o = p.parse_args(argv)
    given = vars(build_parser(True).parse_args(argv))
    for k, v in PRESETS[o.preset].items():
        setattr(o, k, v)
    for k, v in given.items():          # explicit flags win over the preset
        setattr(o, k, v)

    files = []
    for pat in o.inputs:
        files.extend(sorted(glob.glob(pat)) or ([pat] if os.path.exists(pat) else []))
    if not files:
        p.error("no input files matched")

    os.makedirs(o.outdir, exist_ok=True)
    ext = "jpg" if o.format == "jpg" else o.format

    for f in files:
        im = Image.open(f)
        stem = os.path.splitext(os.path.basename(f))[0]

        if o.contact_sheet:
            tiles = []
            for name in sorted(PRESETS):
                opts = argparse.Namespace(**vars(o))
                for k, v in PRESETS[name].items():
                    setattr(opts, k, v)
                opts.size = 260
                opts.square = True
                tiles.append((name, crtify(im, opts)))
            w = 260 * len(tiles)
            sheet = Image.new("RGB", (w, 260), tuple(hex2rgb(o.shadow).astype(int)))
            for i, (_, t) in enumerate(tiles):
                sheet.paste(t, (i * 260, 0))
            out = os.path.join(o.outdir, f"{stem}-presets.{ext}")
            sheet.save(out, quality=o.quality)
            print(out, "  order:", " ".join(n for n, _ in tiles))
            continue

        out = os.path.join(o.outdir, f"{stem}{o.suffix}.{ext}")
        res = crtify(im, o)
        res.save(out, quality=o.quality, optimize=True)
        print(f"{out}  {res.width}x{res.height}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
