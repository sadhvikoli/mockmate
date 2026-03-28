import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { startInterview, getSessions } from '../api'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sessions, setSessions] = useState([])
  const [role, setRole] = useState('')
  const [difficulty, setDifficulty] = useState('medium')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getSessions().then(res => setSessions(res.data)).catch(() => {})
  }, [])

  const handleStart = async () => {
    if (!role.trim()) return setError('Please enter a role')
    setLoading(true)
    setError('')
    try {
      const res = await startInterview({ role, difficulty })
      navigate(`/interview/${res.data.id}`)
    } catch {
      setError('Failed to start interview. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const difficultyColors = {
    easy: { bg: '#ecfdf5', text: '#065f46', border: '#a7f3d0' },
    medium: { bg: '#fffbeb', text: '#92400e', border: '#fde68a' },
    hard: { bg: '#fef2f2', text: '#991b1b', border: '#fecaca' }
  }

  const scoreColor = (score) => {
    if (score >= 8) return '#0ea5e9'
    if (score >= 6) return '#f59e0b'
    return '#ef4444'
  }

  return (
    <div className="min-h-screen p-6" style={{background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #ecfdf5 100%)'}}>
      <div className="max-w-2xl mx-auto">

        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow" style={{background: '#0ea5e9'}}>
              <span style={{fontSize: 18}}>🎯</span>
            </div>
            <h1 className="text-2xl font-black" style={{fontFamily: 'Nunito', color: '#0c4a6e'}}>MockMate</h1>
          </div>
          <button onClick={logout} className="text-sm font-bold px-4 py-2 rounded-xl transition" style={{color: '#64748b', background: '#e0f2fe'}}>
            Logout
          </button>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg mb-8" style={{border: '2px solid #e0f2fe'}}>
          <h2 className="text-xl font-black mb-1" style={{fontFamily: 'Nunito', color: '#0c4a6e'}}>Start a new interview 🚀</h2>
          <p className="text-sm font-semibold mb-5" style={{color: '#64748b'}}>AI will generate 5 questions tailored to your role</p>
          {error && (
            <div className="rounded-2xl p-3 mb-4" style={{background: '#fef2f2', border: '2px solid #fecaca'}}>
              <p className="text-sm font-semibold" style={{color: '#dc2626'}}>{error}</p>
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold block mb-2" style={{color: '#64748b'}}>Role</label>
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-2xl px-4 py-3 font-semibold focus:outline-none transition"
                style={{background: '#f0f9ff', border: '2px solid #bae6fd', color: '#0c4a6e'}}
                placeholder="e.g. Software Engineer Intern"
              />
            </div>
            <div>
              <label className="text-sm font-bold block mb-2" style={{color: '#64748b'}}>Difficulty</label>
              <div className="flex gap-3">
                {['easy', 'medium', 'hard'].map(d => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className="flex-1 py-3 rounded-2xl font-black text-sm capitalize transition"
                    style={{
                      background: difficulty === d ? difficultyColors[d].bg : '#f8fafc',
                      border: `2px solid ${difficulty === d ? difficultyColors[d].border : '#e2e8f0'}`,
                      color: difficulty === d ? difficultyColors[d].text : '#94a3b8'
                    }}
                  >
                    {d === 'easy' ? '😊 Easy' : d === 'medium' ? '🔥 Medium' : '💀 Hard'}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={handleStart}
              disabled={loading}
              className="w-full text-white font-black py-4 rounded-2xl transition text-lg disabled:opacity-50"
              style={{fontFamily: 'Nunito', background: '#0ea5e9', boxShadow: '0 4px 14px #bae6fd'}}
            >
              {loading ? 'Generating questions... ⏳' : 'Start Interview →'}
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-black mb-4" style={{fontFamily: 'Nunito', color: '#0c4a6e'}}>Past sessions 📋</h2>
          {sessions.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center shadow" style={{border: '2px solid #e0f2fe'}}>
              <p style={{fontSize: 40}}>🎤</p>
              <p className="font-bold mt-2" style={{color: '#64748b'}}>No sessions yet. Start your first interview above!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map(session => (
                <div
                  key={session.id}
                  onClick={() => navigate(`/results/${session.id}`)}
                  className="bg-white rounded-2xl p-4 shadow cursor-pointer transition hover:shadow-md flex justify-between items-center"
                  style={{border: '2px solid #e0f2fe'}}
                >
                  <div>
                    <p className="font-black" style={{color: '#0c4a6e'}}>{session.role}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold px-2 py-1 rounded-lg capitalize"
                        style={{
                          background: difficultyColors[session.difficulty]?.bg || '#f0f9ff',
                          color: difficultyColors[session.difficulty]?.text || '#0c4a6e'
                        }}>
                        {session.difficulty}
                      </span>
                      <span className="text-xs font-semibold" style={{color: '#94a3b8'}}>{session.status}</span>
                    </div>
                  </div>
                  {session.score !== null && (
                    <div className="text-right">
                      <span className="text-3xl font-black" style={{color: scoreColor(session.score)}}>{session.score}</span>
                      <span className="text-sm font-bold" style={{color: '#94a3b8'}}>/10</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}