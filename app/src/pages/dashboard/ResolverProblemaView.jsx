import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Send, CheckCircle, XCircle, Terminal, Moon, Sun } from 'lucide-react'
import CodeMirror from '@uiw/react-codemirror'
import { python } from '@codemirror/lang-python'
import { oneDark } from '@codemirror/theme-one-dark'
import axios from '../../utils/axios'
import Button from '../../components/Button'
import Card from '../../components/Card'

function ResolverProblemaView() {
  const [problema, setProblema] = useState(null)
  const [codigo, setCodigo] = useState('')
  const [resultado, setResultado] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  
  const [terminalHistory, setTerminalHistory] = useState([])
  const [currentInput, setCurrentInput] = useState('')
  const [terminalLoading, setTerminalLoading] = useState(false)
  const [pendingInputs, setPendingInputs] = useState([])
  const [needsMoreInput, setNeedsMoreInput] = useState(false)
  const [darkTheme, setDarkTheme] = useState(true)

  const problemaId = searchParams.get('problema')
  const turmaId = searchParams.get('turma')

  useEffect(() => {
    if (turmaId && problemaId) {
      loadProblema()
    } else {
      setLoading(false)
    }
  }, [turmaId, problemaId])

  const loadProblema = async () => {
    try {
      const response = await axios.get(`/aluno/turmas/${turmaId}/problemas`)
      const problemaEncontrado = response.data.find(p => p.id == problemaId)
      setProblema(problemaEncontrado)
    } catch (error) {
      alert('Erro ao carregar problema')
    } finally {
      setLoading(false)
    }
  }

  const executeCode = async (inputLines = [], showCommand = true) => {
    if (terminalLoading || !codigo.trim()) return Promise.resolve()
    
    setTerminalLoading(true)
    
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
        code: codigo,
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
          const inputCount = (codigo.match(/input\(/g) || []).length
          const providedCount = inputLines.length
          const missing = inputCount - providedCount
          
          if (missing > 0) {
            setNeedsMoreInput(true)
            setPendingInputs([...inputLines])
          }
        } else if (errorMsg.includes('Timeout') && response.data.output && response.data.output.trim()) {
          const inputCount = (codigo.match(/input\(/g) || []).length
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
      setTerminalLoading(false)
      if (!needsMoreInput) {
        setCurrentInput('')
        setPendingInputs([])
      }
      setTimeout(() => {
        const terminal = document.getElementById('terminal-output-problema')
        if (terminal) {
          terminal.scrollTop = terminal.scrollHeight
        }
      }, 100)
    }
    return Promise.resolve()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      
      if (terminalLoading && !needsMoreInput) return
      
      const inputValue = currentInput.trim()
      
      if (needsMoreInput && codigo.trim()) {
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
      } else if (codigo.trim()) {
        const inputToAdd = currentInput
        setCurrentInput('')
        executeCode(inputValue ? [inputValue] : [], true)
      }
    }
  }

  const handleInputChange = (e) => {
    if (!terminalLoading || needsMoreInput) {
      setCurrentInput(e.target.value)
    }
  }

  const enviarResposta = async () => {
    if (!codigo.trim()) {
      alert('Digite seu código antes de enviar!')
      return
    }

    if (!terminalLoading) {
      setTerminalHistory(prev => [...prev, {
        type: 'command',
        content: `python script.py`,
        timestamp: new Date()
      }])
      
      executeCode([], false).then(() => {
        enviarParaCorrecao()
      })
    } else {
      enviarParaCorrecao()
    }
  }

  const enviarParaCorrecao = async () => {
    try {
      const response = await axios.post(`/aluno/problemas/${problemaId}/enviar`, {
        codigo
      })
      setResultado(response.data)
      
      setTerminalHistory(prev => [...prev, {
        type: 'output',
        content: `--- Resultado da Correção ---`,
        timestamp: new Date()
      }])
      setTerminalHistory(prev => [...prev, {
        type: response.data.resultado === 'correto' ? 'output' : 'error',
        content: response.data.feedback,
        timestamp: new Date()
      }])
      
      if (response.data.resultado === 'correto') {
        setTimeout(() => {
          alert('Parabéns! Você acertou!')
          navigate(`/painel/problemas?turma=${turmaId}`)
        }, 1000)
      }
    } catch (error) {
      setTerminalHistory(prev => [...prev, {
        type: 'error',
        content: 'Erro ao enviar resposta: ' + (error.response?.data?.error || 'Erro desconhecido'),
        timestamp: new Date()
      }])
    }
  }

  if (loading || !problema) {
    return <div className="text-center">Carregando...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Resolver Problema</h2>
        <Button variant="secondary" onClick={() => navigate(`/painel/problemas?turma=${turmaId}`)}>
          <ArrowLeft className="w-4 h-4 mr-2 inline" />Voltar
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          header={<h3 className="text-lg font-semibold">{problema.titulo}</h3>}
        >
          <div>
            <strong className="block mt-3 mb-2">Enunciado:</strong>
            <p className="mb-4">{problema.enunciado}</p>
            
            {problema.entrada && (
              <div className="mb-4">
                <strong className="block mb-2">Entrada:</strong>
                <pre className="bg-gray-100 p-2 rounded text-sm">{problema.entrada}</pre>
              </div>
            )}
            
            {problema.saida && (
              <div className="mb-4">
                <strong className="block mb-2">Saída:</strong>
                <pre className="bg-gray-100 p-2 rounded text-sm">{problema.saida}</pre>
              </div>
            )}
            
            {problema.restricoes && (
              <div>
                <strong className="block mb-2">Restrições:</strong>
                <p>{problema.restricoes}</p>
              </div>
            )}
          </div>
        </Card>
        
        <div className="space-y-6">
          <Card
            header={
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Seu Código</h3>
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
            <div className="border border-gray-300 rounded-md overflow-hidden mb-4">
              <CodeMirror
                value={codigo}
                height="400px"
                theme={darkTheme ? oneDark : null}
                extensions={[python()]}
                onChange={(value) => setCodigo(value)}
                placeholder="# Digite seu código Python aqui..."
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
            <Button onClick={enviarResposta} className="w-full" disabled={terminalLoading || !codigo.trim()}>
              <Send className="w-4 h-4 mr-2 inline" />Enviar Resposta
            </Button>
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
              id="terminal-output-problema"
              className="w-full h-96 p-4 bg-gray-900 text-green-400 font-mono text-sm overflow-auto rounded-md"
              style={{ fontFamily: 'Consolas, Monaco, "Courier New", monospace' }}
              onClick={() => {
                const input = document.querySelector('#terminal-input-problema')
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
              {terminalLoading && !needsMoreInput && (
                <div className="text-yellow-400 animate-pulse">
                  <span className="text-gray-400">$ </span>Executando...
                </div>
              )}
              {!terminalLoading && (
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
                id="terminal-input-problema"
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
      
      {resultado && (
        <Card className="mt-6">
          <div className={`p-4 mb-4 rounded ${
            resultado.resultado === 'correto' 
              ? 'bg-green-50 border border-green-500 text-green-700' 
              : 'bg-red-50 border border-red-500 text-red-700'
          }`}>
            {resultado.resultado === 'correto' ? (
              <CheckCircle className="w-5 h-5 mr-2 inline" />
            ) : (
              <XCircle className="w-5 h-5 mr-2 inline" />
            )}
            <strong>{resultado.feedback}</strong>
          </div>
          <div>
            <strong className="block mb-2">Saída obtida:</strong>
            <pre className="bg-gray-100 p-2 rounded text-sm">{resultado.saida_obtida || '(sem saída)'}</pre>
          </div>
        </Card>
      )}
    </div>
  )
}

export default ResolverProblemaView

