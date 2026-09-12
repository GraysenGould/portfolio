const SECTIONS = ['welcome', 'about', 'contact', 'news', 'work', 'education', 'research', 'projects', 'personal']

export default function NavBar({ onSelect, disabled }) {
  return (
    <nav className="menu-bar">
      <span className="menu-bar-brand">graysens-portfolio</span>
      {SECTIONS.map(section => (
        <button
          key={section}
          type="button"
          className="menu-bar-item"
          disabled={disabled}
          onClick={() => onSelect(section)}
        >
          {section}
        </button>
      ))}
    </nav>
  )
}
