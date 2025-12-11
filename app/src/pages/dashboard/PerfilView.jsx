import { useState, useEffect } from 'react'
import { User, Mail, Calendar, Shield, Edit } from 'lucide-react'
import axios from '../../utils/axios'
import Card from '../../components/Card'
import Badge from '../../components/Badge'

function PerfilView() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const response = await axios.get('/profile')
      setProfile(response.data)
    } catch (error) {
      alert('Erro ao carregar perfil')
    } finally {
      setLoading(false)
    }
  }

  const getTipoUsuarioLabel = (tipo) => {
    const labels = {
      'aluno': 'Aluno',
      'professor': 'Professor',
      'administrador': 'Administrador'
    }
    return labels[tipo] || tipo
  }

  const getTipoUsuarioColor = (tipo) => {
    const colors = {
      'aluno': 'secondary',
      'professor': 'success',
      'administrador': 'danger'
    }
    return colors[tipo] || 'primary'
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Não disponível'
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return <div className="text-center">Carregando...</div>
  }

  if (!profile) {
    return <div className="text-center text-red-600">Erro ao carregar perfil</div>
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Meu Perfil</h2>
        <p className="text-gray-600 mt-1">Visualize e gerencie suas informações pessoais</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center">
              <User className="w-5 h-5 mr-2 text-indigo-600" />
              Informações Pessoais
            </h3>
            <Edit className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500 block mb-1">Nome Completo</label>
              <div className="text-gray-900 font-medium">{profile.nome_completo}</div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 block mb-1 flex items-center">
                <Mail className="w-4 h-4 mr-1" />
                E-mail
              </label>
              <div className="text-gray-900">{profile.email}</div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 block mb-1">Apelido</label>
              <div className="text-gray-900">@{profile.apelido}</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center">
              <Shield className="w-5 h-5 mr-2 text-indigo-600" />
              Informações da Conta
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500 block mb-1">ID do Usuário</label>
              <div className="text-gray-900 font-mono text-sm">#{profile.id}</div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 block mb-1">Tipo de Conta</label>
              <div className="mt-1">
                <Badge variant={getTipoUsuarioColor(profile.tipo_usuario)}>
                  {getTipoUsuarioLabel(profile.tipo_usuario)}
                </Badge>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 block mb-1 flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Data de Criação
              </label>
              <div className="text-gray-900">{formatDate(profile.created_at)}</div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Resumo</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-700 text-sm">
            Você está cadastrado como <strong>{getTipoUsuarioLabel(profile.tipo_usuario)}</strong> na plataforma CODEROOM.
            Sua conta foi criada em <strong>{formatDate(profile.created_at)}</strong>.
          </p>
          {profile.tipo_usuario === 'aluno' && (
            <p className="text-gray-700 text-sm mt-2">
              Como aluno, você pode participar de turmas, resolver exercícios e acompanhar seu progresso.
            </p>
          )}
          {profile.tipo_usuario === 'professor' && (
            <p className="text-gray-700 text-sm mt-2">
              Como professor, você pode criar turmas, adicionar exercícios e gerenciar seus alunos.
            </p>
          )}
          {profile.tipo_usuario === 'administrador' && (
            <p className="text-gray-700 text-sm mt-2">
              Como administrador, você tem acesso completo à plataforma e pode gerenciar todos os usuários.
            </p>
          )}
        </div>
      </Card>
    </div>
  )
}

export default PerfilView

