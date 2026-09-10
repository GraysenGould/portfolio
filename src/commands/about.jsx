import { education } from '../content.js'

export default function About() {
  return (
    <div className="output-block">
      <p className="placeholder-text">full bio coming soon — for now, here's where I study.</p>
      <div className="entry">
        <div className="entry-header">
          <span className="entry-title">{education.school}</span>
          <span className="entry-meta">{education.location}</span>
        </div>
        <div className="entry-subheader">
          <span className="entry-role">{education.degree}</span>
          <span className="entry-dates">GPA: {education.gpa} · {education.graduation}</span>
        </div>
      </div>
    </div>
  )
}
