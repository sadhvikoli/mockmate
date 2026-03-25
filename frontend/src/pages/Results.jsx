import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getSession } from '../api'

export default function Results() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

 useEffect(() => {
  let attempts = 0
  const fetchSession = async () => {
    try {
      const res = await getSession(id)
      if (res.data.status !== 'completed' && attempts < 10) {
        attempts++
        setTimeout(fetchSession, 2000)
      } else {
        setSession(res.data)
        setLoading(false)
      }
    } catch {
      navigate('/')
    }
  }
  fetchSession()
}, [id])

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center">
      <p className="text-white text-xl mb-2">Generating feedback...</p>
      <p className="text-gray-400 text-sm">AI is evaluating your answers</p>
    </div>
  )

  const feedback = session.feedback || []

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-2xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-bold">MockMate</h1>
          <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white text-sm">
            Back to dashboard
          </button>
        </div>

        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-8 text-center">
          <p className="text-gray-400 text-sm mb-2">{session.role} · {session.difficulty}</p>
          <p className="text-6xl font-bold text-blue-400 mb-2">{session.score}/10</p>
          <p className="text-gray-400">Overall Score</p>
        </div>

        <div className="space-y-6">
          {feedback.map((item, index) => (
            <div key={index} className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <p className="text-gray-400 text-sm mb-3">Question {index + 1}</p>
              <p className="font-medium mb-4">{session.questions[index]}</p>

              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl font-bold text-blue-400">{item.score}/10</span>
                <span className="text-gray-400 text-sm">score</span>
              </div>

              <div className="space-y-3">
                <div className="bg-green-900/30 rounded-xl p-4 border border-green-800/50">
                  <p className="text-green-400 text-sm font-medium mb-1">Strengths</p>
                  <p className="text-gray-300 text-sm">{item.strengths}</p>
                </div>
                <div className="bg-yellow-900/30 rounded-xl p-4 border border-yellow-800/50">
                  <p className="text-yellow-400 text-sm font-medium mb-1">Improvements</p>
                  <p className="text-gray-300 text-sm">{item.improvements}</p>
                </div>
                <div className="bg-blue-900/30 rounded-xl p-4 border border-blue-800/50">
                  <p className="text-blue-400 text-sm font-medium mb-1">Ideal answer</p>
                  <p className="text-gray-300 text-sm">{item.ideal_answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate('/')}
          className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
        >
          Start another interview
        </button>

      </div>
    </div>
  )
}