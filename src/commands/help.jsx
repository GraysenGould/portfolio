const commands = [
  ['about', 'About Me'],
  ['contact', 'Contact & Socials'],
  ['news', 'Latest Updates'],
  ['work', 'Work Experience'],
  ['education', 'My Education'],
  ['research', 'Research'],
  ['projects', 'My Projects'],
  ['skills', 'Technical Skills'],
  ['misc', 'Leadership & Competitions'],
  ['personal', 'Personal'],
  ['clear', 'Clear terminal'],
]

export default function Help() {
  return (
    <div className="output-block">
      <div className="help-grid">
        {commands.map(([cmd, desc]) => (
          <div key={cmd} className="help-row">
            <span className="help-cmd">{cmd}</span>
            <span className="help-desc">{desc}</span>
          </div>
        ))}
      </div>
      <p className="help-hint">type one of the above to view, e.g. <span className="accent">education</span></p>
    </div>
  )
}
