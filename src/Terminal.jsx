import { useState, useEffect, useRef, useCallback } from 'react'
import Help from './commands/help.jsx'
import About from './commands/about.jsx'
import Contact from './commands/contact.jsx'
import News from './commands/news.jsx'
import Experience from './commands/experience.jsx'
import Education from './commands/education.jsx'
import Research from './commands/research.jsx'
import Skills from './commands/skills.jsx'
import Projects from './commands/projects.jsx'
import Activities from './commands/activities.jsx'
import Personal from './commands/personal.jsx'
import Nvidia from './commands/nvidia.jsx'
import Welcome from './commands/welcome.jsx'
import NavBar from './NavBar.jsx'
import { HOME_PATH, resolvePath, getNode, displayPath, baseName } from './filesystem.js'

const COMMANDS = {
  help: <Help />,
  welcome: <Welcome />,
  about: <About />,
  contact: <Contact />,
  news: <News />,
  work: <Experience />,
  education: <Education />,
  research: <Research />,
  projects: <Projects />,
  skills: <Skills />,
  misc: <Activities />,
  personal: <Personal />,
  nvidia: <Nvidia />,
}

const PROMPT_USER = 'visitor'
const PROMPT_HOST = 'graysens-portfolio'
const STARTUP_COMMANDS = ['welcome', 'about', 'news', 'work', 'education', 'research', 'projects', 'skills', 'misc', 'personal', 'help']

function Prompt({ cwd }) {
  return (
    <span className="prompt">
      <span className="prompt-user">{PROMPT_USER}</span>
      <span className="prompt-punct">@</span>
      <span className="prompt-host">{PROMPT_HOST}</span>
      <span className="prompt-punct">:{displayPath(cwd)}$ </span>
    </span>
  )
}

const startup = STARTUP_COMMANDS.flatMap((cmd, i) => [
  ...(i > 0 ? [{ type: 'rule' }] : []),
  { type: 'input', content: cmd },
  { type: 'output', content: COMMANDS[cmd] },
])

export default function Terminal() {
  const [history, setHistory] = useState(startup)
  const [inputValue, setInputValue] = useState('')
  const [cmdHistory, setCmdHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef(null)
  const bottomRef = useRef(null)
  const [scrollTick, setScrollTick] = useState(0)
  const [navBusy, setNavBusy] = useState(false)
  const [cwd, setCwd] = useState(HOME_PATH)

  useEffect(() => {
    if (scrollTick === 0) return
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [scrollTick])

  const focusInput = useCallback(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', focusInput)
    return () => document.removeEventListener('keydown', focusInput)
  }, [focusInput])

  function runCommand(raw) {
    const cmd = raw.trim().toLowerCase()
    const inputEntry = { type: 'input', content: cmd }

    if (cmd === 'clear') {
      setHistory([])
      setCmdHistory(prev => [raw, ...prev])
      setHistoryIndex(-1)
      setInputValue('')
      setScrollTick(t => t + 1)
      return
    }

    const argv = cmd.split(/\s+/).filter(Boolean)
    const base = argv[0]

    let outputEntry
    if (cmd === '') {
      outputEntry = null
    } else if (base === 'pwd') {
      outputEntry = { type: 'text', content: cwd }
    } else if (base === 'cd') {
      const target = argv[1]
      const path = !target || target === '~' ? HOME_PATH : resolvePath(cwd, target)
      const node = getNode(path)
      if (!node) {
        outputEntry = { type: 'fs-error', content: `cd: no such file or directory: ${target}` }
      } else if (node.type !== 'dir') {
        outputEntry = { type: 'fs-error', content: `cd: not a directory: ${target}` }
      } else {
        setCwd(path)
        outputEntry = null
      }
    } else if (base === 'ls') {
      const target = argv[1]
      const path = target ? resolvePath(cwd, target) : cwd
      const node = getNode(path)
      if (!node) {
        outputEntry = { type: 'fs-error', content: `ls: cannot access '${target}': No such file or directory` }
      } else if (node.type === 'file') {
        outputEntry = { type: 'text', content: baseName(path) }
      } else {
        const names = Object.entries(node.children)
          .map(([name, child]) => (child.type === 'dir' ? `${name}/` : name))
          .sort()
        outputEntry = { type: 'text', content: names.join('  ') }
      }
    } else if (base === 'cat') {
      const target = argv[1]
      if (!target) {
        outputEntry = { type: 'fs-error', content: 'cat: missing operand' }
      } else {
        const path = resolvePath(cwd, target)
        const node = getNode(path)
        if (!node) {
          outputEntry = { type: 'fs-error', content: `cat: ${target}: No such file or directory` }
        } else if (node.type === 'dir') {
          outputEntry = { type: 'fs-error', content: `cat: ${target}: Is a directory` }
        } else {
          outputEntry = { type: 'output', content: COMMANDS[node.command] }
        }
      }
    } else if (COMMANDS[cmd]) {
      outputEntry = { type: 'output', content: COMMANDS[cmd] }
    } else {
      outputEntry = { type: 'error', content: cmd }
    }

    setHistory(prev => [
      ...prev,
      { type: 'rule' },
      inputEntry,
      ...(outputEntry ? [outputEntry] : []),
    ])
    setCmdHistory(prev => [raw, ...prev])
    setHistoryIndex(-1)
    setInputValue('')
    setScrollTick(t => t + 1)
  }

  function navigate(section) {
    if (navBusy) return
    setNavBusy(true)
    focusInput()
    let i = 0
    const typeTimer = setInterval(() => {
      i += 1
      setInputValue(section.slice(0, i))
      if (i >= section.length) {
        clearInterval(typeTimer)
        setTimeout(() => {
          runCommand(section)
          setNavBusy(false)
        }, 200)
      }
    }, 45)
  }

  function handleKeyDown(e) {
    if (e.key === 'Tab') {
      e.preventDefault()
      const partial = inputValue.trim().toLowerCase()
      if (!partial) return
      const matches = Object.keys(COMMANDS).filter(c => c.startsWith(partial))
      if (matches.length === 1) {
        setInputValue(matches[0])
      } else if (matches.length > 1) {
        setHistory(prev => [
          ...prev,
          { type: 'input', content: inputValue },
          { type: 'tab-matches', content: matches },
        ])
        setScrollTick(t => t + 1)
      }
    } else if (e.key === 'Enter') {
      runCommand(inputValue)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(historyIndex + 1, cmdHistory.length - 1)
      setHistoryIndex(next)
      setInputValue(cmdHistory[next] ?? '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = historyIndex - 1
      if (next < 0) {
        setHistoryIndex(-1)
        setInputValue('')
      } else {
        setHistoryIndex(next)
        setInputValue(cmdHistory[next] ?? '')
      }
    }
  }

  return (
    <>
      <NavBar onSelect={navigate} disabled={navBusy} />
      <div className="terminal-window">
        <div className="terminal-titlebar">
          <span className="traffic-lights">
            <span className="traffic-light traffic-light-red" />
            <span className="traffic-light traffic-light-yellow" />
            <span className="traffic-light traffic-light-green" />
          </span>
          <span className="terminal-titlebar-label">{PROMPT_USER}@{PROMPT_HOST} — bash</span>
        </div>
        <div className="terminal" onClick={focusInput}>
      {history.map((entry, i) => {
        if (entry.type === 'rule') {
          return <div key={i} className="rule" />
        }
        if (entry.type === 'input') {
          return (
            <div key={i} className="history-input">
              <Prompt cwd={cwd} />
              <span>{entry.content}</span>
            </div>
          )
        }
        if (entry.type === 'tab-matches') {
          return (
            <div key={i} className="tab-matches">
              {entry.content.join('    ')}
            </div>
          )
        }
        if (entry.type === 'error') {
          return (
            <div key={i} className="error-line">
              command not found: <span className="accent">{entry.content}</span>. try <span className="accent">help</span>.
            </div>
          )
        }
        if (entry.type === 'fs-error') {
          return (
            <div key={i} className="error-line">
              {entry.content}
            </div>
          )
        }
        if (entry.type === 'text') {
          return (
            <div key={i} className="fs-text">
              {entry.content}
            </div>
          )
        }
        if (entry.type === 'output') {
          return <div key={i}>{entry.content}</div>
        }
        return null
      })}

      {history.length > 0 && <div className="rule" />}
      <div className="input-line">
        <Prompt cwd={cwd} />
        <span className="typed-text">{inputValue}</span>
        <span className="cursor-block" aria-hidden="true">▌</span>
        <input
          ref={inputRef}
          className="terminal-input-hidden"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          readOnly={navBusy}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      </div>
      <div ref={bottomRef} />
        </div>
      </div>
    </>
  )
}
