import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from '../utils/axios'
import Input from '../components/Input'
import Button from '../components/Button'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await axios.post('/login', { email, senha })
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('tipo_usuario', response.data.tipo_usuario)
        navigate('/painel')
        window.location.reload()
      }
    } catch (error) {
      alert('Erro ao fazer login: ' + (error.response?.data?.error || 'Erro desconhecido'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold mb-2">Login</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="E-mail"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Senha"
            type="password"
            id="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Não tem conta?{' '}
            <Link to="/cadastrar" className="text-[#6C63FF] hover:underline">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

