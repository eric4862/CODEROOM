import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Code, Users } from 'lucide-react'
import axios from '../../utils/axios'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Badge from '../../components/Badge'

function TurmasView() {
  const [turmas, setTurmas] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    loadUserInfo()
  }, [])

  const loadUserInfo = async () => {
    try {
      const response = await axios.get('/profile')
      setCurrentUser(response.data)
      loadTurmas(response.data)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const loadTurmas = async (user) => {
    try {
      let response
      if (user.tipo_usuario === 'professor') {
        response = await axios.get('/professor/turmas')
      } else if (user.tipo_usuario === 'aluno') {
        response = await axios.get('/aluno/turmas')
      } else {
        response = await axios.get('/admin/turmas')
      }
      setTurmas(response.data)
    } catch (error) {
      alert('Erro ao carregar turmas')
    }
  }

  if (loading) {
    return <div className="text-center">Carregando turmas...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Minhas Turmas</h2>
      </div>
      
      {turmas.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
          Nenhuma turma encontrada.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {turmas.map((turma) => (
            <Card key={turma.id}>
              <div className="bg-indigo-600 text-white px-4 py-3 rounded-t-lg -m-6 mb-4">
                <h3 className="font-semibold">{turma.nome}</h3>
              </div>
              <div className="flex-grow">
                <p className="text-gray-600 mb-2">{turma.descricao || 'Sem descrição'}</p>
                <p className="text-sm text-gray-500">Código: <strong>{turma.codigo}</strong></p>
                <p className="text-sm text-gray-500">Criada em: {new Date(turma.created_at).toLocaleDateString('pt-BR')}</p>
              </div>
              <div className="mt-4 pt-4 border-t">
                {currentUser?.tipo_usuario === 'professor' ? (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => navigate(`/painel/problemas?turma=${turma.id}&nome=${encodeURIComponent(turma.nome)}`)}
                    >
                      <Code className="w-4 h-4 mr-1 inline" />Problemas
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => navigate(`/painel/alunos?turma=${turma.id}&nome=${encodeURIComponent(turma.nome)}`)}
                    >
                      <Users className="w-4 h-4 mr-1 inline" />Alunos
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => navigate(`/painel/problemas?turma=${turma.id}&nome=${encodeURIComponent(turma.nome)}`)}
                  >
                    <Code className="w-4 h-4 mr-2 inline" />Ver Problemas
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default TurmasView

