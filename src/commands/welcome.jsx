import headshot from '../../assets/headshot_crt.jpg'
import { renderColoredArt } from '../coloredArt.jsx'
import { contact } from '../content.js'

const name = ` ██████╗ ██████╗  █████╗ ██╗   ██╗███████╗███████╗███╗   ██╗     ██████╗  ██████╗ ██╗   ██╗██╗     ██████╗
██╔════╝ ██╔══██╗██╔══██╗╚██╗ ██╔╝██╔════╝██╔════╝████╗  ██║    ██╔════╝ ██╔═══██╗██║   ██║██║     ██╔══██╗
██║  ███╗██████╔╝███████║ ╚████╔╝ ███████╗█████╗  ██╔██╗ ██║    ██║  ███╗██║   ██║██║   ██║██║     ██║  ██║
██║   ██║██╔══██╗██╔══██║  ╚██╔╝  ╚════██║██╔══╝  ██║╚██╗██║    ██║   ██║██║   ██║██║   ██║██║     ██║  ██║
╚██████╔╝██║  ██║██║  ██║   ██║   ███████║███████╗██║ ╚████║    ╚██████╔╝╚██████╔╝╚██████╔╝███████╗██████╔╝
 ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚══════╝╚═╝  ╚═══╝     ╚═════╝  ╚═════╝  ╚═════╝ ╚══════╝╚═════╝`
export const ttu_logo = `
  {r}█████████████████████
  █████████████████████
  █████████████████████
         ███████{/r}
     {w}███████████████
     ███████████████{/w}
         {r}█{/r}{w}█████{/w}{r}█{/r}
         {r}█{/r}{w}█████{/w}{r}█{/r}
         {r}█{/r}{w}█████{/w}{r}█{/r}
         {r}█{/r}{w}█████{/w}{r}█{/r}
         {r}█{/r}{w}█████{/w}{r}█{/r}
        {r}██{/r}{w}█████{/w}{r}██{/r}
        {r}█████████{/r}`


export default function Welcome() {
  return (
    <div className="output-block welcome-block">
      <div className="welcome-left">
        <pre className="welcome-name">{renderColoredArt(name)}</pre>
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
      <img src={headshot} alt="Graysen Gould" className="welcome-photo" />
    </div>
  )
}



/*

  █████████████████████
  █████████████████████
  █████████████████████
         ███████
     ███████████████
     ███████████████
         ███████
         ███████
         ███████
        █████████
        █████████

*/
