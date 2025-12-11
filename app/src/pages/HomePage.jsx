import { Link } from 'react-router-dom'
import { LogIn, UserPlus } from 'lucide-react'
import logoImg from '../assets/logo.svg'

function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={logoImg} alt="CODEROOM" className="h-12 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Bem-vindo ao CodeRoom</h1>
          <p className="text-gray-600">Plataforma de ensino e avaliação de programação</p>
        </div>

        <div className="flex flex-col gap-3 mb-6">
          <Link
            to="/entrar"
            className="flex items-center justify-center gap-2 bg-[#6C63FF] text-white px-6 py-3 rounded-lg font-semibold transition-colors hover:bg-[#5a52e6]"
          >
            <LogIn className="w-5 h-5" />
            Fazer Login
          </Link>
          
          <Link
            to="/cadastrar"
            className="flex items-center justify-center gap-2 border-2 border-[#6C63FF] text-[#6C63FF] px-6 py-3 rounded-lg font-semibold transition-colors hover:bg-[#6C63FF] hover:text-white"
          >
            <UserPlus className="w-5 h-5" />
            Criar Conta
          </Link>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>Ao usar esta plataforma, você concorda com nossos termos de uso e política de privacidade.</p>
        </div>
      </div>
    </div>
  )
}

export default HomePage

