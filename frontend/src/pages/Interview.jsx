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
    <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #ecfdf5 100%)'}}>
      <div className="text-center">
        <p style={{fontSize: 40}}>⏳</p>
        <p className="font-bold mt-2" style={{color: '#64748b'}}>Loading your interview...</p>
      </div>
    </div>
  )

  const questions = session.questions || []
  const isLast = currentIndex === questions.length - 1
  const progress = ((currentIndex + 1) / questions.length) * 100

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
    <div className="min-h-screen p-6" style={{background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #ecfdf5 100%)'}}>
      <div className="max-w-2xl mx-auto">

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow" style={{background: '#0ea5e9'}}>
              <span style={{fontSize: 18}}>🎯</span>
            </div>
            <h1 className="text-xl font-black" style={{fontFamily: 'Nunito', color: '#0c4a6e'}}>MockMate</h1>
          </div>
          <div className="px-4 py-2 rounded-xl font-black text-sm" style={{background: '#e0f2fe', color: '#0369a1'}}>
            {currentIndex + 1} / {questions.length}
          </div>
        </div>

        <div className="w-full rounded-full h-3 mb-6 overflow-hidden" style={{background: '#e0f2fe'}}>
          <div
            className="h-3 rounded-full transition-all duration-500"
            style={{width: `${progress}%`, background: 'linear-gradient(90deg, #0ea5e9, #67e8f9)'}}
          />
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg mb-4" style={{border: '2px solid #e0f2fe'}}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-black px-3 py-1 rounded-lg" style={{background: '#e0f2fe', color: '#0369a1'}}>
              {session.role}
            </span>
            <span className="text-xs font-black px-3 py-1 rounded-lg capitalize" style={{background: '#ecfdf5', color: '#065f46'}}>
              {session.difficulty}
            </span>
          </div>
          <p className="text-lg font-semibold leading-relaxed" style={{color: '#0c4a6e'}}>{questions[currentIndex]}</p>
        </div>

        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full rounded-3xl px-5 py-4 font-semibold focus:outline-none resize-none mb-4 transition"
          style={{background: '#fff', border: '2px solid #bae6fd', color: '#0c4a6e', minHeight: 160}}
          placeholder="Type your answer here... 💭"
        />

        <button
          onClick={handleSubmitAnswer}
          disabled={submitting || loading || !answer.trim()}
          className="w-full text-white font-black py-4 rounded-2xl transition text-lg disabled:opacity-50"
          style={{fontFamily: 'Nunito', background: '#0ea5e9', boxShadow: '0 4px 14px #bae6fd'}}
        >
          {loading ? 'Generating feedback... 🤖' : submitting ? 'Submitting... ⏳' : isLast ? 'Finish & Get Feedback 🎉' : 'Next Question →'}
        </button>

      </div>
    </div>
  )
}