const commands = [
  ['education', 'My Education'],
  ['experience', 'Work Experience'],
  ['skills', 'Technical Skills'],
  ['projects', 'My Projects'],
  ['activities', 'Leadership & Competitions'],
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
