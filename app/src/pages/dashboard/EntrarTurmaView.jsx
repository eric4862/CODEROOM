import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import axios from '../../utils/axios'
import Input from '../../components/Input'
import Button from '../../components/Button'
import Card from '../../components/Card'

function EntrarTurmaView() {
  const [codigo, setCodigo] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await axios.post('/aluno/entrar-turma', { codigo })
      alert('Entrou na turma com sucesso!')
      setCodigo('')
      navigate('/painel/turmas')
    } catch (error) {
      alert('Erro ao entrar na turma: ' + (error.response?.data?.error || 'Erro desconhecido'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md">
        <Card
          header={<h3 className="text-lg font-semibold">Entrar em uma Turma</h3>}
        >
          <form onSubmit={handleSubmit}>
            <Input
              label="Código da Turma"
              id="codigo"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Digite o código de 6 dígitos"
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              <LogIn className="w-4 h-4 mr-2 inline" />
              {loading ? 'Entrando...' : 'Entrar na Turma'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default EntrarTurmaView

