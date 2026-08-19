import { projects } from '../content.js'

export default function Projects() {
  return (
    <div className="output-block">
      {projects.map((project, i) => (
        <div key={i} className="entry">
          <div className="entry-header">
            <span className="entry-title">{project.name}</span>
            <span className="entry-dates">{project.dates}</span>
          </div>
          <div className="entry-role">{project.description}</div>
          <div className="bullet-list">
            {project.bullets.map((b, j) => (
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
