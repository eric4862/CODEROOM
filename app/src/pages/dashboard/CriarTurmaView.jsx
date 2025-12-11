import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import axios from '../../utils/axios'
import Input from '../../components/Input'
import Textarea from '../../components/Textarea'
import Button from '../../components/Button'
import Card from '../../components/Card'

function CriarTurmaView() {
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await axios.post('/professor/turmas', { nome, descricao })
      alert(`Turma criada com sucesso! Código: ${response.data.codigo}`)
      setNome('')
      setDescricao('')
      navigate('/painel/turmas')
    } catch (error) {
      alert('Erro ao criar turma: ' + (error.response?.data?.error || 'Erro desconhecido'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-2xl">
        <Card
          header={<h3 className="text-lg font-semibold">Criar Nova Turma</h3>}
        >
          <form onSubmit={handleSubmit}>
            <Input
              label="Nome da Turma"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
            <Textarea
              label="Descrição"
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={3}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              <Plus className="w-4 h-4 mr-2 inline" />
              {loading ? 'Criando...' : 'Criar Turma'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default CriarTurmaView

