export const HOME_PATH = '/home/graysen'

export const ROOT_DIR = {
  type: 'dir',
  children: {
    bin: { type: 'dir', children: {} },
    etc: { type: 'dir', children: {} },
    usr: { type: 'dir', children: {} },
    var: { type: 'dir', children: {} },
    tmp: { type: 'dir', children: {} },
    root: { type: 'dir', children: {} },
    home: {
      type: 'dir',
      children: {
        graysen: {
          type: 'dir',
          children: {
            about: { type: 'file', command: 'about' },
          },
        },
      },
    },
  },
}

export function resolvePath(cwd, input) {
  if (!input) return cwd

  let base
  let rest

  if (input.startsWith('/')) {
    base = []
    rest = input
  } else if (input === '~') {
    return HOME_PATH
  } else if (input.startsWith('~/')) {
    base = HOME_PATH.split('/').filter(Boolean)
    rest = input.slice(2)
  } else {
    base = cwd.split('/').filter(Boolean)
    rest = input
  }

  for (const part of rest.split('/')) {
    if (!part || part === '.') continue
    if (part === '..') base.pop()
    else base.push(part)
  }

  return '/' + base.join('/')
}

export function getNode(path) {
  if (path === '/' || path === '') return ROOT_DIR
  const parts = path.split('/').filter(Boolean)
  let node = ROOT_DIR
  for (const part of parts) {
    if (node.type !== 'dir') return null
    node = node.children[part]
    if (!node) return null
  }
  return node
}

export function displayPath(path) {
  if (path === HOME_PATH) return '~'
  if (path.startsWith(HOME_PATH + '/')) return '~' + path.slice(HOME_PATH.length)
  return path
}

export function baseName(path) {
  const parts = path.split('/').filter(Boolean)
  return parts[parts.length - 1] ?? '/'
}
