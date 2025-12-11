import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from '../utils/axios'
import Input from '../components/Input'
import Select from '../components/Select'
import Button from '../components/Button'

function RegisterPage() {
  const [formData, setFormData] = useState({
    nome_completo: '',
    apelido: '',
    email: '',
    tipo_usuario: '',
    senha: '',
    confirmar_senha: ''
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.senha !== formData.confirmar_senha) {
      alert('As senhas não coincidem!')
      return
    }

    setLoading(true)

    try {
      await axios.post('/register', {
        nome_completo: formData.nome_completo,
        apelido: formData.apelido,
        email: formData.email,
        tipo_usuario: formData.tipo_usuario,
        senha: formData.senha
      })

      alert('Conta criada com sucesso! Faça login para continuar.')
      navigate('/entrar')
    } catch (error) {
      alert('Erro ao criar conta: ' + (error.response?.data?.error || 'Erro desconhecido'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold mb-2">Criar Conta</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome Completo"
            id="nome_completo"
            value={formData.nome_completo}
            onChange={handleChange}
            required
          />
          <Input
            label="Apelido"
            id="apelido"
            value={formData.apelido}
            onChange={handleChange}
            required
          />
          <Input
            label="E-mail"
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Select
            label="Tipo de Usuário"
            id="tipo_usuario"
            value={formData.tipo_usuario}
            onChange={handleChange}
            required
            options={[
              { value: '', label: 'Selecione...' },
              { value: 'aluno', label: 'Aluno' },
              { value: 'professor', label: 'Professor' },
              { value: 'administrador', label: 'Administrador' },
            ]}
          />
          <Input
            label="Senha"
            type="password"
            id="senha"
            value={formData.senha}
            onChange={handleChange}
            required
          />
          <Input
            label="Confirmar Senha"
            type="password"
            id="confirmar_senha"
            value={formData.confirmar_senha}
            onChange={handleChange}
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Criando...' : 'Criar Conta'}
          </Button>
        </form>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Já tem conta?{' '}
            <Link to="/entrar" className="text-[#6C63FF] hover:underline">
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage

