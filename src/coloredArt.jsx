// Parses inline color markup inside ASCII-art strings, e.g.:
//   `{r}this part is red{/r} and {w}this part is white{/w}`
// Supported tags: {r}=red, {w}=white, {m}=mint, {a}=amber
// Tags can wrap any span of text, including across multiple lines.
export function renderColoredArt(str) {
  const parts = str.split(/(\{\/?[a-z]+\})/g)
  const nodes = []
  let currentClass = null

  const classFor = { r: 'red', w: 'white', m: 'mint-text', a: 'amber-text', g: 'nvidia-green' }

  for (const part of parts) {
    const openMatch = part.match(/^\{([a-z]+)\}$/)
    const closeMatch = part.match(/^\{\/([a-z]+)\}$/)

    if (openMatch) {
      currentClass = classFor[openMatch[1]] ?? null
    } else if (closeMatch) {
      currentClass = null
    } else if (part) {
      nodes.push(
        currentClass
          ? <span key={nodes.length} className={currentClass}>{part}</span>
          : <span key={nodes.length}>{part}</span>
      )
    }
  }

  return nodes
}
