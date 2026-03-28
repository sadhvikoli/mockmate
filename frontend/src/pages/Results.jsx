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
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background:
          'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #ecfdf5 100%)'
      }}
    >
      <div className="text-center">
        <p style={{ fontSize: 40 }}>🤖</p>
        <p
          className="font-bold mt-2"
          style={{ color: '#64748b' }}
        >
          Generating feedback...
        </p>
        <p
          className="text-sm mt-1"
          style={{ color: '#94a3b8' }}
        >
          AI is evaluating your answers
        </p>
      </div>
    </div>
  )

  const feedback = session.feedback || []

  return (
    <div
      className="min-h-screen p-6"
      style={{
        background:
          'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #ecfdf5 100%)'
      }}
    >
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow"
              style={{ background: '#0ea5e9' }}
            >
              <span style={{ fontSize: 18 }}>🏆</span>
            </div>

            <h1
              className="text-xl font-black"
              style={{
                fontFamily: 'Nunito',
                color: '#0c4a6e'
              }}
            >
              MockMate
            </h1>
          </div>

          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 rounded-xl font-black text-sm transition"
            style={{
              background: '#e0f2fe',
              color: '#0369a1'
            }}
          >
            Back to dashboard
          </button>
        </div>

        {/* Score Card */}
        <div
          className="bg-white rounded-3xl p-6 shadow-lg mb-6 text-center"
          style={{ border: '2px solid #e0f2fe' }}
        >
          <div className="flex justify-center gap-2 mb-3">
            <span
              className="text-xs font-black px-3 py-1 rounded-lg"
              style={{
                background: '#e0f2fe',
                color: '#0369a1'
              }}
            >
              {session.role}
            </span>

            <span
              className="text-xs font-black px-3 py-1 rounded-lg capitalize"
              style={{
                background: '#ecfdf5',
                color: '#065f46'
              }}
            >
              {session.difficulty}
            </span>
          </div>

          <p
            className="text-6xl font-black mb-2"
            style={{
              color: '#0ea5e9',
              fontFamily: 'Nunito'
            }}
          >
            {session.score}/10
          </p>

          <p
            className="font-semibold"
            style={{ color: '#64748b' }}
          >
            Overall Score 🎯
          </p>
        </div>

        {/* Feedback */}
        <div className="space-y-6">
          {feedback.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-6 shadow-lg"
              style={{ border: '2px solid #e0f2fe' }}
            >
              <p
                className="text-sm font-black mb-2"
                style={{ color: '#0369a1' }}
              >
                Question {index + 1}
              </p>

              <p
                className="font-semibold mb-4"
                style={{ color: '#0c4a6e' }}
              >
                {session.questions[index]}
              </p>

              {/* Score */}
              <div className="flex items-center gap-2 mb-4">
                <span
                  className="text-2xl font-black"
                  style={{ color: '#0ea5e9' }}
                >
                  {item.score}/10
                </span>

                <span
                  className="text-sm font-semibold"
                  style={{ color: '#64748b' }}
                >
                  score
                </span>
              </div>

              {/* Feedback sections */}
              <div className="space-y-3">

                <div
                  className="rounded-xl p-4"
                  style={{
                    background: '#ecfdf5',
                    border: '2px solid #bbf7d0'
                  }}
                >
                  <p
                    className="text-sm font-black mb-1"
                    style={{ color: '#065f46' }}
                  >
                    Strengths ✅
                  </p>

                  <p
                    className="text-sm"
                    style={{ color: '#374151' }}
                  >
                    {item.strengths}
                  </p>
                </div>

                <div
                  className="rounded-xl p-4"
                  style={{
                    background: '#fef9c3',
                    border: '2px solid #fde68a'
                  }}
                >
                  <p
                    className="text-sm font-black mb-1"
                    style={{ color: '#92400e' }}
                  >
                    Improvements ⚡
                  </p>

                  <p
                    className="text-sm"
                    style={{ color: '#374151' }}
                  >
                    {item.improvements}
                  </p>
                </div>

                <div
                  className="rounded-xl p-4"
                  style={{
                    background: '#e0f2fe',
                    border: '2px solid #bae6fd'
                  }}
                >
                  <p
                    className="text-sm font-black mb-1"
                    style={{ color: '#0369a1' }}
                  >
                    Ideal answer 💡
                  </p>

                  <p
                    className="text-sm"
                    style={{ color: '#374151' }}
                  >
                    {item.ideal_answer}
                  </p>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate('/')}
          className="w-full mt-8 text-white font-black py-4 rounded-2xl transition text-lg"
          style={{
            fontFamily: 'Nunito',
            background: '#0ea5e9',
            boxShadow: '0 4px 14px #bae6fd'
          }}
        >
          Start another interview 🚀
        </button>

      </div>
    </div>
  )
}