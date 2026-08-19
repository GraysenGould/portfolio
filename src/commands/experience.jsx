import { experience } from '../content.js'

export default function Experience() {
  return (
    <div className="output-block">
      {experience.map((job, i) => (
        <div key={i} className="entry">
          <div className="entry-header">
            <span className="entry-title">{job.company}</span>
            <span className="entry-meta">{job.location}</span>
          </div>
          <div className="entry-subheader">
            <span className="entry-role">{job.role}</span>
            <span className="entry-dates">{job.dates}</span>
          </div>
          <div className="bullet-list">
            {job.bullets.map((b, j) => (
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
