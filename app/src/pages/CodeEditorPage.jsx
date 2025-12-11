import { useState } from 'react'
import { Code as CodeIcon, Play, Trash2, Edit, Terminal, Moon, Sun } from 'lucide-react'
import CodeMirror from '@uiw/react-codemirror'
import { python } from '@codemirror/lang-python'
import { oneDark } from '@codemirror/theme-one-dark'
import axios from '../utils/axios'
import Button from '../components/Button'
import Card from '../components/Card'

function CodeEditorPage() {
  const [code, setCode] = useState('')
  const [terminalHistory, setTerminalHistory] = useState([])
  const [currentInput, setCurrentInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [darkTheme, setDarkTheme] = useState(true)
  const [pendingInputs, setPendingInputs] = useState([])
  const [needsMoreInput, setNeedsMoreInput] = useState(false)

  const executeCode = async (inputLines = [], showCommand = true) => {
    if (loading || !code.trim()) return
    
    setLoading(true)
    
    if (showCommand) {
      const commandEntry = {
        type: 'command',
        content: `python script.py`,
        timestamp: new Date()
      }
      setTerminalHistory(prev => [...prev, commandEntry])
    }

    try {
      const inputText = inputLines.join('\n')
      const response = await axios.post('/api/execute-code', { 
        code,
        input: inputText 
      })
      
      if (response.data.success) {
        if (response.data.output && response.data.output.trim()) {
          const outputLines = response.data.output.split('\n')
          outputLines.forEach((line, idx) => {
            if (idx === outputLines.length - 1 && !line.trim()) return
            setTerminalHistory(prev => [...prev, {
              type: 'output',
              content: line,
              timestamp: new Date()
            }])
          })
        }
      } else {
        const errorMsg = response.data.error || 'Erro desconhecido'
        if (response.data.output && response.data.output.trim()) {
          const outputLines = response.data.output.split('\n')
          outputLines.forEach((line, idx) => {
            if (idx === outputLines.length - 1 && !line.trim()) return
            setTerminalHistory(prev => [...prev, {
              type: 'output',
              content: line,
              timestamp: new Date()
            }])
          })
        }
        
        if (errorMsg.includes('EOFError') || errorMsg.includes('EOF when reading')) {
          const inputCount = (code.match(/input\(/g) || []).length
          const providedCount = inputLines.length
          const missing = inputCount - providedCount
          
          if (missing > 0) {
            setNeedsMoreInput(true)
            setPendingInputs([...inputLines])
          }
        } else if (errorMsg.includes('Timeout') && response.data.output && response.data.output.trim()) {
          const inputCount = (code.match(/input\(/g) || []).length
          const providedCount = inputLines.length
          if (inputCount > providedCount) {
            setNeedsMoreInput(true)
            setPendingInputs([...inputLines])
          }
        } else {
          setTerminalHistory(prev => [...prev, {
            type: 'error',
            content: errorMsg,
            timestamp: new Date()
          }])
        }
      }
    } catch (error) {
      setTerminalHistory(prev => [...prev, {
        type: 'error',
        content: 'Erro na comunicação: ' + (error.response?.data?.error || error.message),
        timestamp: new Date()
      }])
    } finally {
      setLoading(false)
      if (!needsMoreInput) {
        setCurrentInput('')
        setPendingInputs([])
      }
      setTimeout(() => {
        const terminal = document.getElementById('terminal-output')
        if (terminal) {
          terminal.scrollTop = terminal.scrollHeight
        }
      }, 100)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      
      if (loading && !needsMoreInput) return
      
      const inputValue = currentInput.trim()
      
      if (needsMoreInput && code.trim()) {
        const inputToAdd = currentInput
        setCurrentInput('')
        
        setTerminalHistory(prev => [...prev, {
          type: 'input',
          content: inputToAdd,
          timestamp: new Date()
        }])
        
        const newInputs = [...pendingInputs, inputValue]
        setPendingInputs(newInputs)
        setNeedsMoreInput(false)
        executeCode(newInputs, false)
      } else if (code.trim()) {
        const inputToAdd = currentInput
        setCurrentInput('')
        executeCode(inputValue ? [inputValue] : [], true)
      } else if (inputValue) {
        const inputToAdd = currentInput
        setCurrentInput('')
        setTerminalHistory(prev => [...prev, {
          type: 'command',
          content: inputToAdd,
          timestamp: new Date()
        }])
      }
    }
  }

  const handleInputChange = (e) => {
    if (!loading || needsMoreInput) {
      setCurrentInput(e.target.value)
    }
  }

  const handleExecuteButton = () => {
    if (!loading && code.trim()) {
      const inputValue = currentInput.trim()
      if (inputValue) {
        setTerminalHistory(prev => [...prev, {
          type: 'input',
          content: currentInput,
          timestamp: new Date()
        }])
      }
      setCurrentInput('')
      executeCode(inputValue ? [inputValue] : [])
    }
  }

  const clearCode = () => {
    setCode('')
    setCurrentInput('')
    setTerminalHistory([])
    setPendingInputs([])
    setNeedsMoreInput(false)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/4">
          <Card
            header={
              <h3 className="text-lg font-semibold flex items-center">
                <CodeIcon className="w-4 h-4 mr-2" />
                Interpretador Python
              </h3>
            }
          >
            <p className="mb-4 text-gray-600">Execute código Python em tempo real.</p>
            
            <Button
              onClick={handleExecuteButton}
              disabled={loading}
              className="w-full mb-3"
            >
              <Play className="w-4 h-4 mr-2 inline" />
              Executar Código
            </Button>
            
            <Button
              onClick={clearCode}
              variant="outline"
              className="w-full"
            >
              <Trash2 className="w-4 h-4 mr-2 inline" />
              Limpar
            </Button>
            
            <div className="mt-6 pt-6 border-t">
              <h6 className="font-semibold mb-2">Dicas:</h6>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Use <code className="bg-gray-100 px-1 rounded">print()</code> para ver resultados</li>
                <li>• Para <code className="bg-gray-100 px-1 rounded">input()</code>: digite no terminal e pressione Enter</li>
                <li>• O terminal funciona como um terminal real</li>
                <li>• Imports automáticos: <code className="bg-gray-100 px-1 rounded">sys, os, math, random, datetime</code></li>
                <li>• Timeout de 10 segundos</li>
                <li>• Apenas Python 3</li>
              </ul>
            </div>
          </Card>
        </div>
        
        <div className="lg:w-3/4">
          <div className="space-y-6">
            <Card
              header={
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Edit className="w-4 h-4 mr-2" />
                    Editor de Código
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setDarkTheme(!darkTheme)}
                      className="p-1.5 hover:bg-gray-100 rounded transition"
                      title={darkTheme ? 'Tema claro' : 'Tema escuro'}
                    >
                      {darkTheme ? <Sun className="w-4 h-4 text-gray-600" /> : <Moon className="w-4 h-4 text-gray-600" />}
                    </button>
                    <span className="text-sm text-gray-300">Python 3</span>
                  </div>
                </div>
              }
            >
              <div className="border border-gray-300 rounded-md overflow-hidden">
                <CodeMirror
                  value={code}
                  height="400px"
                  theme={darkTheme ? oneDark : null}
                  extensions={[python()]}
                  onChange={(value) => setCode(value)}
                  placeholder="# Digite seu código Python aqui&#10;print('Olá, mundo!')"
                  basicSetup={{
                    lineNumbers: true,
                    foldGutter: true,
                    dropCursor: false,
                    allowMultipleSelections: false,
                    indentOnInput: true,
                    bracketMatching: true,
                    closeBrackets: true,
                    autocompletion: true,
                    highlightSelectionMatches: false,
                  }}
                />
              </div>
            </Card>
            
            <Card
              header={
                <h3 className="text-lg font-semibold flex items-center">
                  <Terminal className="w-4 h-4 mr-2" />
                  Terminal
                </h3>
              }
            >
              <div 
                id="terminal-output"
                className="w-full h-96 p-4 bg-gray-900 text-green-400 font-mono text-sm overflow-auto rounded-md"
                style={{ fontFamily: 'Consolas, Monaco, "Courier New", monospace' }}
                onClick={() => {
                  const input = document.querySelector('#terminal-input-hidden')
                  if (input) input.focus()
                }}
              >
                {terminalHistory.length === 0 && (
                  <div className="text-gray-500">
                    Execute o código para ver os resultados aqui...<br/>
                    <span className="text-xs block mt-2">💡 Digite diretamente no terminal e pressione Enter</span>
                  </div>
                )}
                {terminalHistory.map((entry, index) => (
                  <div 
                    key={index} 
                    className={`
                      ${entry.type === 'command' ? 'text-yellow-400' : ''}
                      ${entry.type === 'output' ? 'text-green-400' : ''}
                      ${entry.type === 'error' ? 'text-red-400' : ''}
                      ${entry.type === 'input' ? 'text-blue-400' : ''}
                      ${entry.type === 'output' || entry.type === 'error' ? 'whitespace-pre-wrap' : ''}
                      mb-1
                    `}
                  >
                    {entry.type === 'command' && <span className="text-gray-400">$ </span>}
                    {entry.type === 'input' && <span className="text-gray-400"></span>}
                    {entry.content}
                  </div>
                ))}
                {loading && !needsMoreInput && (
                  <div className="text-yellow-400 animate-pulse">
                    <span className="text-gray-400">$ </span>                    Executando...
                  </div>
                )}
                {!loading && (
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-1">
                      {needsMoreInput ? '' : '$'}
                    </span>
                    <span className="text-green-400">
                      {currentInput}
                      <span className="animate-pulse bg-green-400 inline-block w-2 h-4 ml-0.5">|</span>
                    </span>
                  </div>
                )}
                <input
                  id="terminal-input-hidden"
                  type="text"
                  value={currentInput}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  className="absolute opacity-0 pointer-events-none"
                  autoFocus
                  tabIndex={-1}
                  style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px' }}
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CodeEditorPage

