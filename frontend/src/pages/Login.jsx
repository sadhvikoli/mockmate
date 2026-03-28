import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(email, password)
      navigate('/')
    } catch {
      setError('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #ecfdf5 100%)'}}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg" style={{background: '#0ea5e9'}}>
            <span style={{fontSize: 28}}>🎯</span>
          </div>
          <h1 className="text-4xl font-black mb-1" style={{fontFamily: 'Nunito', color: '#0c4a6e'}}>MockMate</h1>
          <p className="font-semibold" style={{color: '#64748b'}}>Practice interviews. Get better. 🚀</p>
        </div>
        <div className="bg-white rounded-3xl p-8 shadow-xl" style={{border: '2px solid #e0f2fe'}}>
          <h2 className="text-2xl font-black mb-6" style={{fontFamily: 'Nunito', color: '#0c4a6e'}}>Welcome back! 👋</h2>
          {error && (
            <div className="rounded-2xl p-3 mb-4" style={{background: '#fef2f2', border: '2px solid #fecaca'}}>
              <p className="text-sm font-semibold" style={{color: '#dc2626'}}>{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-bold block mb-2" style={{color: '#64748b'}}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl px-4 py-3 font-semibold transition focus:outline-none"
                style={{background: '#f0f9ff', border: '2px solid #bae6fd', color: '#0c4a6e'}}
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="text-sm font-bold block mb-2" style={{color: '#64748b'}}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl px-4 py-3 font-semibold transition focus:outline-none"
                style={{background: '#f0f9ff', border: '2px solid #bae6fd', color: '#0c4a6e'}}
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-black py-4 rounded-2xl transition text-lg disabled:opacity-50"
              style={{fontFamily: 'Nunito', background: '#0ea5e9', boxShadow: '0 4px 14px #bae6fd'}}
            >
              {loading ? 'Signing in... ⏳' : 'Sign in →'}
            </button>
          </form>
          <p className="text-sm text-center mt-4 font-semibold" style={{color: '#64748b'}}>
            New here?{' '}
            <Link to="/register" className="font-black" style={{color: '#0ea5e9'}}>Create account</Link>
          </p>
        </div>
      </div>
    </div>
  )
}