import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, LogOut } from 'lucide-react'
import axios from '../utils/axios'
import logoImg from '../assets/logo.svg'

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token')
      setIsLoggedIn(!!token)
      if (token) {
        loadUserInfo()
      }
    }
    
    checkAuth()
    window.addEventListener('storage', checkAuth)
    
    return () => {
      window.removeEventListener('storage', checkAuth)
    }
  }, [])

  const loadUserInfo = async () => {
    try {
      const response = await axios.get('/profile')
      setUserName(response.data.nome_completo || response.data.email)
    } catch (error) {
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('tipo_usuario')
    setIsLoggedIn(false)
    setUserName('')
    navigate('/')
    window.location.reload()
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <img src={logoImg} alt="CODEROOM" className="h-8" />
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Início
              </Link>
              <Link
                to="/editor-codigo"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Interpretador
              </Link>
              {isLoggedIn && (
                <Link
                  to="/painel"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Painel
                </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {!isLoggedIn ? (
              <div className="flex space-x-4">
                <Link
                  to="/entrar"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium"
                >
                  Entrar
                </Link>
                <Link
                  to="/cadastrar"
                  className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Cadastrar
                </Link>
              </div>
            ) : (
              <div className="relative ml-3">
                <div className="flex items-center text-sm">
                  <User className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-gray-700">{userName || 'Usuário'}</span>
                  <button
                    onClick={handleLogout}
                    className="ml-4 text-gray-500 hover:text-gray-700"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

