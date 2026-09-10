const SECTIONS = ['welcome', 'about', 'contact', 'news', 'work', 'education', 'research', 'projects', 'personal']

export default function NavBar({ onSelect, disabled }) {
  return (
    <nav className="nav-bar">
      {SECTIONS.map(section => (
        <button
          key={section}
          type="button"
          className="nav-link"
          disabled={disabled}
          onClick={() => onSelect(section)}
        >
          <span className="nav-bracket">[</span>
          {section}
          <span className="nav-bracket">]</span>
        </button>
      ))}
    </nav>
  )
}
