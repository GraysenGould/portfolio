const logo = `
███╗   ██╗██╗   ██╗██╗██████╗ ██╗ █████╗
████╗  ██║██║   ██║██║██╔══██╗██║██╔══██╗
██╔██╗ ██║██║   ██║██║██║  ██║██║███████║
██║╚██╗██║╚██╗ ██╔╝██║██║  ██║██║██╔══██║
██║ ╚████║ ╚████╔╝ ██║██████╔╝██║██║  ██║
╚═╝  ╚═══╝  ╚═══╝  ╚═╝╚═════╝ ╚═╝╚═╝  ╚═╝
`.trim()

export default function Nvidia() {
  return (
    <div className="output-block nvidia-block">
      <pre className="nvidia-logo nvidia-text">{logo}</pre>
      <div className="nvidia-sub">Building the future</div>
    </div>
  )
}
