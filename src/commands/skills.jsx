import { skills } from '../content.js'

export default function Skills() {
  return (
    <div className="output-block">
      <div className="bullet-list">
        {Object.entries(skills).map(([category, items]) => (
          <div key={category} className="bullet-item">
            <span className="dim">·</span>
            <span><span className="accent">{category}:</span> {items}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
