import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2, Code } from 'lucide-react'
import axios from '../../utils/axios'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Badge from '../../components/Badge'

function ProblemasView() {
  const [problemas, setProblemas] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const turmaId = searchParams.get('turma')
  const turmaNome = searchParams.get('nome') || ''

  useEffect(() => {
    loadUserInfo()
  }, [])

  const loadUserInfo = async () => {
    try {
      const response = await axios.get('/profile')
      setCurrentUser(response.data)
      if (turmaId) {
        loadProblemas(response.data)
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const loadProblemas = async (user) => {
    if (!turmaId) {
      setLoading(false)
      return
    }

    try {
      let response
      if (user.tipo_usuario === 'professor' || user.tipo_usuario === 'administrador') {
        response = await axios.get(`/professor/turmas/${turmaId}/problemas`)
      } else {
        response = await axios.get(`/aluno/turmas/${turmaId}/problemas`)
      }
      setProblemas(response.data)
    } catch (error) {
      alert('Erro ao carregar problemas')
    }
  }

  const deleteProblema = async (problemaId) => {
    if (!confirm('Tem certeza que deseja excluir este problema?')) return
    
    try {
      await axios.delete(`/professor/turmas/${turmaId}/problemas/${problemaId}`)
      alert('Problema excluído com sucesso')
      loadProblemas(currentUser)
    } catch (error) {
      alert('Erro ao excluir problema: ' + error.response?.data?.error)
    }
  }

  if (loading) {
    return <div className="text-center">Carregando...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Problemas - {turmaNome}</h2>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigate('/painel/turmas')}>
            <ArrowLeft className="w-4 h-4 mr-2 inline" />Voltar
          </Button>
          {currentUser?.tipo_usuario === 'professor' && (
            <Button onClick={() => navigate(`/painel/criar-problema?turma=${turmaId}&nome=${encodeURIComponent(turmaNome)}`)}>
              <Plus className="w-4 h-4 mr-2 inline" />Novo Problema
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {problemas.map((problema) => (
          <Card key={problema.id}>
            <div className="bg-indigo-600 text-white px-4 py-3 rounded-t-lg -m-6 mb-4 flex justify-between items-center">
              <h3 className="font-semibold">{problema.titulo}</h3>
              {problema.status && (
                <Badge variant={problema.status === 'resolvido' ? 'success' : 'warning'}>
                  {problema.status === 'resolvido' ? 'Resolvido' : 'Pendente'}
                </Badge>
              )}
            </div>
            <div className="flex-grow">
              <p className="text-gray-600 mb-2">{problema.enunciado?.substring(0, 100)}...</p>
              {problema.linguagem && (
                <p className="text-sm text-gray-500">Linguagem: {problema.linguagem}</p>
              )}
            </div>
            <div className="mt-4 pt-4 border-t">
              {currentUser?.tipo_usuario === 'professor' ? (
                <Button
                  variant="danger"
                  size="sm"
                  className="w-full"
                  onClick={() => deleteProblema(problema.id)}
                >
                  <Trash2 className="w-4 h-4 mr-1 inline" /> Excluir
                </Button>
              ) : (
                <Button
                  className="w-full"
                  disabled={problema.status === 'resolvido'}
                  onClick={() => navigate(`/painel/resolver-problema?problema=${problema.id}&turma=${turmaId}`)}
                >
                  <Code className="w-4 h-4 mr-2 inline" />
                  {problema.status === 'resolvido' ? 'Resolvido' : 'Resolver'}
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ProblemasView

