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

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-3xl mx-auto">

        <div className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-bold">MockMate</h1>
          <button onClick={logout} className="text-gray-400 hover:text-white text-sm">Logout</button>
        </div>

        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-8">
          <h2 className="text-lg font-semibold mb-4">Start a new interview</h2>
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm block mb-1">Role</label>
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:border-blue-500"
                placeholder="e.g. Software Engineer Intern"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm block mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:border-blue-500"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <button
              onClick={handleStart}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Generating questions...' : 'Start Interview'}
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Past sessions</h2>
          {sessions.length === 0 ? (
            <p className="text-gray-500">No sessions yet. Start your first interview above.</p>
          ) : (
            <div className="space-y-3">
              {sessions.map(session => (
                <div
                  key={session.id}
                  onClick={() => navigate(`/results/${session.id}`)}
                  className="bg-gray-900 rounded-xl p-4 border border-gray-800 cursor-pointer hover:border-gray-600 transition flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{session.role}</p>
                    <p className="text-gray-400 text-sm">{session.difficulty} · {session.status}</p>
                  </div>
                  {session.score !== null && (
                    <span className="text-2xl font-bold text-blue-400">{session.score}/10</span>
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