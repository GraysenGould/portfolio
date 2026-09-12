import { education } from '../content.js'
import { ttu_logo } from '../logos.jsx'
import { renderColoredArt } from '../coloredArt.jsx'

export default function Education() {
  return (
    <div className="output-block">
      <div className="entry-logo-row">
        <pre className="entry-logo entry-logo-ttu">{renderColoredArt(ttu_logo)}</pre>
        <div className="entry-body">
          <div className="entry-header">
            <span className="entry-title">{education.school}</span>
            <span className="entry-meta">{education.location}</span>
          </div>
          <div className="entry-subheader">
            <span className="entry-role">{education.degree}</span>
            <span className="entry-dates">GPA: {education.gpa} · {education.graduation}</span>
          </div>
          <div className="bullet-list">
            {Object.entries(education.coursework).map(([area, courses]) => (
              <div key={area} className="bullet-item">
                <span className="dim">·</span>
                <span><span className="accent">{area}:</span> {courses}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
