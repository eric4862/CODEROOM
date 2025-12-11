import { Routes, Route } from 'react-router-dom'
import Layout from './layouts/Layout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import CodeEditorPage from './pages/CodeEditorPage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="entrar" element={<LoginPage />} />
          <Route path="cadastrar" element={<RegisterPage />} />
          <Route
            path="painel/*"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="editor-codigo" element={<CodeEditorPage />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
