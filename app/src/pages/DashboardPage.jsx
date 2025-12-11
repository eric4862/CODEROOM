import { Routes, Route, useParams, useSearchParams } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import TurmasView from './dashboard/TurmasView'
import CriarTurmaView from './dashboard/CriarTurmaView'
import EntrarTurmaView from './dashboard/EntrarTurmaView'
import ProblemasView from './dashboard/ProblemasView'
import CriarProblemaView from './dashboard/CriarProblemaView'
import AlunosView from './dashboard/AlunosView'
import ResolverProblemaView from './dashboard/ResolverProblemaView'
import TentativasView from './dashboard/TentativasView'
import UsuariosView from './dashboard/UsuariosView'
import PerfilView from './dashboard/PerfilView'

function DashboardPage() {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<TurmasView />} />
        <Route path="turmas" element={<TurmasView />} />
        <Route path="criar-turma" element={<CriarTurmaView />} />
        <Route path="entrar-turma" element={<EntrarTurmaView />} />
        <Route path="problemas" element={<ProblemasView />} />
        <Route path="criar-problema" element={<CriarProblemaView />} />
        <Route path="alunos" element={<AlunosView />} />
        <Route path="resolver-problema" element={<ResolverProblemaView />} />
        <Route path="tentativas" element={<TentativasView />} />
        <Route path="usuarios" element={<UsuariosView />} />
        <Route path="perfil" element={<PerfilView />} />
      </Routes>
    </DashboardLayout>
  )
}

export default DashboardPage

