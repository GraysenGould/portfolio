import { activities } from '../content.js'

export default function Activities() {
  return (
    <div className="output-block">
      {activities.map((item, i) => (
        <div key={i} className="entry">
          <div className="entry-header">
            <span className="entry-title">{item.name}</span>
            <span className="entry-dates">{item.dates}</span>
          </div>
          <div className="entry-role">{item.role}</div>
          <div className="bullet-list">
            {item.bullets.map((b, j) => (
              <div key={j} className="bullet-item">
                <span className="dim">·</span>
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
