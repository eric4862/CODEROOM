import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import axios from '../../utils/axios'
import Button from '../../components/Button'
import Card from '../../components/Card'

function CriarProblemaView() {
  const [titulo, setTitulo] = useState('')
  const [enunciado, setEnunciado] = useState('')
  const [entrada, setEntrada] = useState('')
  const [saida, setSaida] = useState('')
  const [restricoes, setRestricoes] = useState('')
  const [respostaEsperada, setRespostaEsperada] = useState('')
  const [linguagem, setLinguagem] = useState('python')
  const [loading, setLoading] = useState(false)
  
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  
  const turmaId = searchParams.get('turma')
  const turmaNome = searchParams.get('nome') || ''

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!titulo.trim() || !enunciado.trim() || !respostaEsperada.trim()) {
      alert('Preencha todos os campos obrigatórios!')
      return
    }

    setLoading(true)
    
    try {
      await axios.post(`/professor/turmas/${turmaId}/problemas`, {
        titulo,
        enunciado,
        entrada: entrada || null,
        saida: saida || null,
        restricoes: restricoes || null,
        resposta_esperada: respostaEsperada,
        linguagem
      })
      
      alert('Problema criado com sucesso!')
      navigate(`/painel/problemas?turma=${turmaId}&nome=${encodeURIComponent(turmaNome)}`)
    } catch (error) {
      alert('Erro ao criar problema: ' + (error.response?.data?.error || 'Erro desconhecido'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Novo Problema - {turmaNome}</h2>
        <Button variant="secondary" onClick={() => navigate(`/painel/problemas?turma=${turmaId}&nome=${encodeURIComponent(turmaNome)}`)}>
          <ArrowLeft className="w-4 h-4 mr-2 inline" />Voltar
        </Button>
      </div>
      
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ex: Soma de dois números"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enunciado <span className="text-red-500">*</span>
            </label>
            <textarea
              value={enunciado}
              onChange={(e) => setEnunciado(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows="5"
              placeholder="Descreva o problema..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Entrada de Exemplo
              </label>
              <textarea
                value={entrada}
                onChange={(e) => setEntrada(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                rows="4"
                placeholder="Ex:&#10;5&#10;3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Saída Esperada <span className="text-red-500">*</span>
              </label>
              <textarea
                value={respostaEsperada}
                onChange={(e) => setRespostaEsperada(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                rows="4"
                placeholder="Ex:&#10;8"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Saída de Exemplo (Opcional)
            </label>
            <textarea
              value={saida}
              onChange={(e) => setSaida(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
              rows="3"
              placeholder="Descrição ou exemplo de saída formatada"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Restrições (Opcional)
            </label>
            <textarea
              value={restricoes}
              onChange={(e) => setRestricoes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows="3"
              placeholder="Ex: 1 ≤ n ≤ 100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Linguagem
            </label>
            <select
              value={linguagem}
              onChange={(e) => setLinguagem(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="python">Python</option>
            </select>
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={loading} className="flex-1">
              <Save className="w-4 h-4 mr-2 inline" />
              {loading ? 'Criando...' : 'Criar Problema'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate(`/painel/problemas?turma=${turmaId}&nome=${encodeURIComponent(turmaNome)}`)}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default CriarProblemaView

