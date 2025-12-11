import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, UserMinus } from 'lucide-react'
import axios from '../../utils/axios'
import Button from '../../components/Button'

function AlunosView() {
  const [alunos, setAlunos] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const turmaId = searchParams.get('turma')
  const turmaNome = searchParams.get('nome') || ''

  useEffect(() => {
    if (turmaId) {
      loadAlunos()
    } else {
      setLoading(false)
    }
  }, [turmaId])

  const loadAlunos = async () => {
    try {
      const response = await axios.get(`/professor/turmas/${turmaId}/alunos`)
      setAlunos(response.data)
    } catch (error) {
      alert('Erro ao carregar alunos')
    } finally {
      setLoading(false)
    }
  }

  const expulsarAluno = async (alunoId) => {
    if (!confirm('Tem certeza que deseja expulsar este aluno da turma?')) return
    
    try {
      await axios.delete(`/professor/turmas/${turmaId}/alunos/${alunoId}`)
      alert('Aluno expulso com sucesso')
      loadAlunos()
    } catch (error) {
      alert('Erro ao expulsar aluno: ' + error.response?.data?.error)
    }
  }

  if (loading) {
    return <div className="text-center">Carregando...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Alunos - {turmaNome}</h2>
        <Button variant="secondary" onClick={() => navigate('/painel/turmas')}>
          <ArrowLeft className="w-4 h-4 mr-2 inline" />Voltar
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apelido</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-mail</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Entrada</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {alunos.map((aluno) => (
              <tr key={aluno.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{aluno.nome_completo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{aluno.apelido}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{aluno.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(aluno.joined_at).toLocaleDateString('pt-BR')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => expulsarAluno(aluno.id)}
                  >
                    <UserMinus className="w-4 h-4 mr-1 inline" /> Expulsar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AlunosView

