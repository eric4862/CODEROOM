import { useState, useEffect } from 'react'
import axios from '../../utils/axios'
import Badge from '../../components/Badge'

function TentativasView() {
  const [tentativas, setTentativas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTentativas()
  }, [])

  const loadTentativas = async () => {
    try {
      const response = await axios.get('/aluno/tentativas')
      setTentativas(response.data)
    } catch (error) {
      alert('Erro ao carregar tentativas')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center">Carregando...</div>
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Histórico de Tentativas</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Problema</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resultado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feedback</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tentativas.map((tentativa) => (
              <tr key={tentativa.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tentativa.problema_titulo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <Badge variant={tentativa.resultado === 'correto' ? 'success' : 'danger'}>
                    {tentativa.resultado === 'correto' ? 'Correto' : 'Incorreto'}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{tentativa.feedback}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(tentativa.created_at).toLocaleString('pt-BR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TentativasView

