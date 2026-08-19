# Terminal Portfolio — Design Spec
**Date:** 2026-08-18

## Overview

A terminal-themed interactive portfolio static site built with Vite + React, deployed via Cloudflare Workers Assets. Visitors type commands to navigate resume content. Replaces the current PDF iframe site.

## Tech Stack

- **Framework:** React 18 + Vite
- **Deployment:** Cloudflare Workers Assets (`wrangler deploy`)
- **Styling:** Plain CSS (no UI library)
- **Build output:** `dist/` — `wrangler.toml` updated from `./source` to `./dist`

## Color Scheme — Arch Linux Blue/Grey

| Role | Color |
|---|---|
| Background | `#0d0e0f` |
| Prompt & section headers | `#1793d1` (Arch blue) |
| Body text | `#d0d0d0` (light grey) |
| Secondary / meta text | `#6c6c6c` (dim grey) |
| Error text | `#e06c75` (soft red) |
| Font | Monospace (system-ui fallback: `'Courier New'`, `monospace`) |

## Prompt Style

```
λ :: ~ >> 
```

Matches the inspiration image aesthetic — clean, minimal, modern.

## File Structure

```
portfolio/
├── src/
│   ├── content.js              ← all resume data (single edit point for content updates)
│   ├── Terminal.jsx            ← core terminal: input capture, history, command dispatch
│   ├── commands/
│   │   ├── help.jsx            ← lists all commands in two-column layout
│   │   ├── education.jsx
│   │   ├── experience.jsx
│   │   ├── skills.jsx
│   │   ├── projects.jsx
│   │   └── activities.jsx
│   ├── App.jsx
│   └── index.css
├── dist/                       ← gitignored build output
├── wrangler.toml               ← assets directory updated to ./dist
└── package.json
```

## Commands

| Command | Description |
|---|---|
| `help` | List all commands with descriptions (two-column layout) |
| `education` | Texas Tech University — BS CS, GPA 4.0, coursework |
| `experience` | NVIDIA, TTU DISC Lab, Tyler Technologies |
| `skills` | Languages, Systems & Tools, Frameworks, Core Concepts |
| `projects` | Cocktail social platform |
| `activities` | Winter Invitational Cluster Competition, Google Developer Group TTU |
| `clear` | Wipe terminal history |

## Content (scrubbed)

**Contact info shown:** `graysen@graysengould.com`, `linkedin.com/in/graysengould`, `github.com/GraysenGould`

**Removed:** phone number, home address, personal Gmail address.

## Terminal Behavior

- **Startup:** Display `type help to start` with the prompt on load
- **Input:** Global keyboard capture — no clicking required
- **History:** Up/down arrow keys navigate command history
- **Unknown commands:** `command not found: <cmd>. Try 'help'.` in error color
- **clear:** Resets history array, returns to blank terminal with prompt
- **Output:** Each command appends styled JSX output to the history list; terminal auto-scrolls to bottom

## Deployment Steps (for reference)

One-time setup: `npm install`

Each deploy:
1. `npm run build`
2. `wrangler deploy`
