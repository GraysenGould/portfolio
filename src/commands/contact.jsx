import { contact } from '../content.js'

export default function Contact() {
  return (
    <div className="output-block">
      <div className="bullet-list">
        <div className="bullet-item">
          <span className="dim">·</span>
          <span><span className="accent">email:</span> <a href={`mailto:${contact.email}`} className="contact-link">{contact.email}</a></span>
        </div>
        <div className="bullet-item">
          <span className="dim">·</span>
          <span><span className="accent">linkedin:</span> <a href={`https://${contact.linkedin}`} target="_blank" rel="noreferrer" className="contact-link">{contact.linkedin}</a></span>
        </div>
        <div className="bullet-item">
          <span className="dim">·</span>
          <span><span className="accent">github:</span> <a href={`https://${contact.github}`} target="_blank" rel="noreferrer" className="contact-link">{contact.github}</a></span>
        </div>
      </div>
    </div>
  )
}
