import { useState, useEffect, useRef, useCallback } from 'react'
import Help from './commands/help.jsx'
import Education from './commands/education.jsx'
import Experience from './commands/experience.jsx'
import Skills from './commands/skills.jsx'
import Projects from './commands/projects.jsx'
import Activities from './commands/activities.jsx'
import Nvidia from './commands/nvidia.jsx'
import Welcome from './commands/welcome.jsx'
import { contact } from './content.js'

const COMMANDS = {
  help: <Help />,
  education: <Education />,
  experience: <Experience />,
  skills: <Skills />,
  projects: <Projects />,
  activities: <Activities />,
  nvidia: <Nvidia />,
  welcome: <Welcome />,
}

const PROMPT_USER = 'visitor'
const PROMPT_HOST = 'graysens-portfolio'
const BOOT_COMMAND = 'welcome'

function Prompt() {
  return (
    <span className="prompt">
      <span className="prompt-user">{PROMPT_USER}</span>
      <span className="prompt-punct">@</span>
      <span className="prompt-host">{PROMPT_HOST}</span>
      <span className="prompt-punct">:~$ </span>
    </span>
  )
}

const startup = [
  { type: 'banner', content: null },
  { type: 'input', content: BOOT_COMMAND },
  { type: 'output', content: COMMANDS[BOOT_COMMAND] },
  { type: 'hint', content: null },
]

export default function Terminal() {
  const [history, setHistory] = useState(startup)
  const [inputValue, setInputValue] = useState('')
  const [cmdHistory, setCmdHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  const focusInput = useCallback(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', focusInput)
    focusInput()
    return () => document.removeEventListener('keydown', focusInput)
  }, [focusInput])

  function runCommand(raw) {
    const cmd = raw.trim().toLowerCase()
    const inputEntry = { type: 'input', content: cmd }

    if (cmd === 'clear') {
      setHistory(startup)
      setCmdHistory(prev => [raw, ...prev])
      setHistoryIndex(-1)
      setInputValue('')
      return
    }

    let outputEntry
    if (cmd === '') {
      outputEntry = null
    } else if (COMMANDS[cmd]) {
      outputEntry = { type: 'output', content: COMMANDS[cmd] }
    } else {
      outputEntry = { type: 'error', content: cmd }
    }

    setHistory(prev => [
      ...prev,
      inputEntry,
      ...(outputEntry ? [outputEntry] : []),
    ])
    setCmdHistory(prev => [raw, ...prev])
    setHistoryIndex(-1)
    setInputValue('')
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
    <div className="terminal" onClick={focusInput}>
      {history.map((entry, i) => {
        if (entry.type === 'banner') {
          return (
            <div key={i} className="banner">
              <div className="banner-contact">
                <a href={`mailto:${contact.email}`} className="contact-link">{contact.email}</a>
                <span className="dim"> · </span>
                <a href={`https://${contact.linkedin}`} target="_blank" rel="noreferrer" className="contact-link">{contact.linkedin}</a>
                <span className="dim"> · </span>
                <a href={`https://${contact.github}`} target="_blank" rel="noreferrer" className="contact-link">{contact.github}</a>
              </div>
            </div>
          )
        }
        if (entry.type === 'hint') {
          return (
            <div key={i} className="hint">
              for a list of available commands, type <span className="accent">help</span>.
            </div>
          )
        }
        if (entry.type === 'input') {
          return (
            <div key={i} className="history-input">
              <Prompt />
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
        if (entry.type === 'output') {
          return <div key={i}>{entry.content}</div>
        }
        return null
      })}

      <div className="input-line">
        <Prompt />
        <span className="typed-text">{inputValue}</span>
        <span className="cursor-block" aria-hidden="true">▌</span>
        <input
          ref={inputRef}
          className="terminal-input-hidden"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      </div>
      <div ref={bottomRef} />
    </div>
  )
}
