import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getSession, submitAnswer, completeSession } from '../api'

export default function Interview() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    getSession(id).then(res => setSession(res.data)).catch(() => navigate('/'))
  }, [id])

  if (!session) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-white">Loading...</p>
    </div>
  )

  const questions = session.questions || []
  const isLast = currentIndex === questions.length - 1

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) return
    setSubmitting(true)
    try {
      await submitAnswer(id, { question_index: currentIndex, answer })
      setAnswer('')
      if (isLast) {
        setLoading(true)
        await completeSession(id)
        navigate(`/results/${id}`)
      } else {
        setCurrentIndex(currentIndex + 1)
      }
    } catch {
      alert('Failed to submit answer. Try again.')
    } finally {
      setSubmitting(false)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-2xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-bold">MockMate</h1>
          <span className="text-gray-400 text-sm">
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>

        <div className="w-full bg-gray-800 rounded-full h-1 mb-8">
          <div
            className="bg-blue-500 h-1 rounded-full transition-all"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-6">
          <p className="text-sm text-blue-400 font-medium mb-3">
            {session.role} · {session.difficulty}
          </p>
          <p className="text-lg leading-relaxed">{questions[currentIndex]}</p>
        </div>

        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full bg-gray-900 text-white rounded-2xl px-5 py-4 border border-gray-800 focus:outline-none focus:border-blue-500 resize-none mb-4"
          placeholder="Type your answer here..."
          rows={6}
        />

        <button
          onClick={handleSubmitAnswer}
          disabled={submitting || loading || !answer.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
        >
          {loading ? 'Generating feedback...' : submitting ? 'Submitting...' : isLast ? 'Finish & Get Feedback' : 'Next Question'}
        </button>

      </div>
    </div>
  )
}