import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, Plus, LogIn, History, LogOut, User } from 'lucide-react'
import axios from '../utils/axios'

function DashboardLayout({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    loadUserInfo()
  }, [])

  const loadUserInfo = async () => {
    try {
      const response = await axios.get('/profile')
      setCurrentUser(response.data)
    } catch (error) {
      navigate('/entrar')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('tipo_usuario')
    navigate('/')
    window.location.reload()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Carregando...</div>
      </div>
    )
  }

  const tipoUsuario = currentUser?.tipo_usuario
  const currentPath = location.pathname

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-gray-50 min-h-screen sticky top-0">
        <div className="p-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/painel/turmas"
                className={`flex items-center px-4 py-2 rounded-md transition ${
                  currentPath.includes('/turmas') || currentPath === '/painel'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 mr-3" />
                Minhas Turmas
              </Link>
            </li>
            {tipoUsuario === 'administrador' && (
              <li>
                <Link
                  to="/painel/usuarios"
                  className={`flex items-center px-4 py-2 rounded-md transition ${
                    currentPath.includes('/usuarios')
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Users className="w-4 h-4 mr-3" />
                  Usuários
                </Link>
              </li>
            )}
            {tipoUsuario === 'professor' && (
              <li>
                <Link
                  to="/painel/criar-turma"
                  className={`flex items-center px-4 py-2 rounded-md transition ${
                    currentPath.includes('/criar-turma')
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Plus className="w-4 h-4 mr-3" />
                  Nova Turma
                </Link>
              </li>
            )}
            {tipoUsuario === 'aluno' && (
              <>
                <li>
                  <Link
                    to="/painel/entrar-turma"
                    className={`flex items-center px-4 py-2 rounded-md transition ${
                      currentPath.includes('/entrar-turma')
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <LogIn className="w-4 h-4 mr-3" />
                    Entrar em Turma
                  </Link>
                </li>
                <li>
                  <Link
                    to="/painel/tentativas"
                    className={`flex items-center px-4 py-2 rounded-md transition ${
                      currentPath.includes('/tentativas')
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <History className="w-4 h-4 mr-3" />
                    Histórico
                  </Link>
                </li>
              </>
            )}
            <li>
              <Link
                to="/painel/perfil"
                className={`flex items-center px-4 py-2 rounded-md transition ${
                  currentPath.includes('/perfil')
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <User className="w-4 h-4 mr-3" />
                Meu Perfil
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Sair
              </button>
            </li>
          </ul>
        </div>
      </aside>
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  )
}

export default DashboardLayout

