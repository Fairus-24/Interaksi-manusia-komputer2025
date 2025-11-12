import { useState } from 'react'
import { BookOpen, Video, HelpCircle, Lightbulb, CheckCircle, XCircle } from 'lucide-react'

export default function Education() {
  const [selectedQuiz, setSelectedQuiz] = useState(null)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)

  const videos = [
    {
      id: 1,
      title: 'Cara Memilah Sampah yang Benar',
      thumbnail: '🗑️',
      duration: '5:30',
      description: 'Pelajari cara memilah sampah organik dan anorganik dengan tepat'
    },
    {
      id: 2,
      title: 'Proses Daur Ulang Plastik',
      thumbnail: '♻️',
      duration: '8:15',
      description: 'Lihat bagaimana plastik didaur ulang menjadi produk baru'
    },
    {
      id: 3,
      title: 'Manfaat Kompos dari Sampah Organik',
      thumbnail: '🌱',
      duration: '6:45',
      description: 'Cara membuat kompos berkualitas dari sampah dapur'
    }
  ]

  const tips = [
    {
      icon: '♻️',
      title: 'Pisahkan Sampah dari Rumah',
      description: 'Sediakan 3 tempat sampah berbeda: organik, anorganik yang bisa didaur ulang, dan residu'
    },
    {
      icon: '🧼',
      title: 'Bersihkan Kemasan Plastik',
      description: 'Cuci dan keringkan kemasan plastik sebelum didaur ulang untuk hasil optimal'
    },
    {
      icon: '📦',
      title: 'Lipat Kardus dengan Rapi',
      description: 'Kardus yang dilipat menghemat ruang dan memudahkan transportasi'
    },
    {
      icon: '🔋',
      title: 'Pisahkan Baterai & Elektronik',
      description: 'Sampah elektronik memerlukan penanganan khusus karena mengandung bahan berbahaya'
    }
  ]

  const quizzes = [
    {
      id: 1,
      question: 'Berapa lama waktu yang dibutuhkan plastik untuk terurai secara alami?',
      options: ['10-20 tahun', '50-100 tahun', '200-500 tahun', '1000+ tahun'],
      correct: 2,
      explanation: 'Plastik membutuhkan 200-500 tahun untuk terurai! Itulah mengapa daur ulang sangat penting.'
    },
    {
      id: 2,
      question: 'Apa yang TIDAK termasuk sampah organik?',
      options: ['Sisa sayuran', 'Styrofoam', 'Daun kering', 'Kulit buah'],
      correct: 1,
      explanation: 'Styrofoam adalah sampah anorganik yang sulit terurai dan sebaiknya dihindari.'
    },
    {
      id: 3,
      question: 'Manakah cara terbaik mengurangi sampah plastik?',
      options: [
        'Membakar plastik',
        'Menggunakan tas belanja sendiri',
        'Membuang ke laut',
        'Menimbun di tanah'
      ],
      correct: 1,
      explanation: 'Menggunakan tas belanja sendiri mengurangi penggunaan kantong plastik sekali pakai.'
    }
  ]

  const handleQuizAnswer = (quizId, answerIndex) => {
    setQuizAnswers({ ...quizAnswers, [quizId]: answerIndex })
  }

  const calculateScore = () => {
    let correct = 0
    quizzes.forEach(quiz => {
      if (quizAnswers[quiz.id] === quiz.correct) {
        correct++
      }
    })
    return correct
  }

  const submitQuiz = () => {
    setShowResults(true)
    const score = calculateScore()
    const points = score * 50
    
    if (score === quizzes.length) {
      const currentPoints = parseInt(localStorage.getItem('userPoints') || '0')
      localStorage.setItem('userPoints', (currentPoints + points).toString())
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl pb-20 md:pb-8">
      <h2 className="text-3xl font-bold text-neutral-800 mb-6">Pusat Edukasi</h2>

      <section className="mb-12">
        <h3 className="text-2xl font-bold text-neutral-800 mb-4 flex items-center">
          <Video className="h-6 w-6 text-primary-600 mr-2" />
          Video Edukasi
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div key={video.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 h-40 flex items-center justify-center text-6xl">
                {video.thumbnail}
              </div>
              <div className="p-4">
                <div className="text-xs text-primary-600 font-semibold mb-1">{video.duration}</div>
                <h4 className="font-bold text-neutral-800 mb-2">{video.title}</h4>
                <p className="text-sm text-neutral-600">{video.description}</p>
                <button className="mt-3 text-primary-600 font-semibold text-sm hover:text-primary-700">
                  Tonton Sekarang →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h3 className="text-2xl font-bold text-neutral-800 mb-4 flex items-center">
          <Lightbulb className="h-6 w-6 text-primary-600 mr-2" />
          Tips Daur Ulang
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {tips.map((tip, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-md border border-neutral-100">
              <div className="text-4xl mb-3">{tip.icon}</div>
              <h4 className="font-bold text-lg text-neutral-800 mb-2">{tip.title}</h4>
              <p className="text-neutral-600">{tip.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-2xl font-bold text-neutral-800 mb-4 flex items-center">
          <HelpCircle className="h-6 w-6 text-primary-600 mr-2" />
          Kuis Interaktif
        </h3>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="mb-6 bg-primary-50 rounded-lg p-4 border border-primary-200">
            <p className="text-primary-800 font-semibold">
              🎯 Jawab semua pertanyaan dengan benar dan dapatkan 150 poin bonus!
            </p>
          </div>

          <div className="space-y-6">
            {quizzes.map((quiz, index) => (
              <div key={quiz.id} className="border border-neutral-200 rounded-lg p-5">
                <h4 className="font-bold text-lg text-neutral-800 mb-4">
                  {index + 1}. {quiz.question}
                </h4>
                <div className="space-y-2">
                  {quiz.options.map((option, optionIndex) => {
                    const isSelected = quizAnswers[quiz.id] === optionIndex
                    const isCorrect = optionIndex === quiz.correct
                    const showAnswer = showResults

                    return (
                      <button
                        key={optionIndex}
                        onClick={() => !showResults && handleQuizAnswer(quiz.id, optionIndex)}
                        disabled={showResults}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          showAnswer && isCorrect
                            ? 'border-green-500 bg-green-50'
                            : showAnswer && isSelected && !isCorrect
                            ? 'border-red-500 bg-red-50'
                            : isSelected
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-neutral-200 hover:border-primary-300'
                        } ${showResults ? 'cursor-default' : 'cursor-pointer'}`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option}</span>
                          {showAnswer && isCorrect && <CheckCircle className="h-5 w-5 text-green-600" />}
                          {showAnswer && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-red-600" />}
                        </div>
                      </button>
                    )
                  })}
                </div>
                {showResults && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                      <strong>Penjelasan:</strong> {quiz.explanation}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {!showResults ? (
            <button
              onClick={submitQuiz}
              disabled={Object.keys(quizAnswers).length !== quizzes.length}
              className="mt-6 w-full bg-primary-600 text-white py-4 rounded-lg font-bold hover:bg-primary-700 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors"
            >
              Kirim Jawaban
            </button>
          ) : (
            <div className="mt-6 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl p-6 text-center">
              <h4 className="text-2xl font-bold mb-2">
                Nilai Anda: {calculateScore()} / {quizzes.length}
              </h4>
              <p className="text-primary-100">
                {calculateScore() === quizzes.length
                  ? '🎉 Sempurna! +150 poin telah ditambahkan ke akun Anda!'
                  : 'Terus belajar dan coba lagi!'}
              </p>
              <button
                onClick={() => {
                  setQuizAnswers({})
                  setShowResults(false)
                }}
                className="mt-4 bg-white text-primary-600 px-6 py-2 rounded-full font-semibold hover:bg-primary-50"
              >
                Coba Lagi
              </button>
            </div>
          )}
        </div>
      </section>

      <div className="mt-8 bg-gradient-to-r from-primary-100 to-green-100 rounded-xl p-6 border border-primary-200">
        <h4 className="text-xl font-bold text-primary-900 mb-3 flex items-center">
          <BookOpen className="h-6 w-6 mr-2" />
          Fakta Menarik Daur Ulang
        </h4>
        <ul className="space-y-2 text-primary-800">
          <li>• Mendaur ulang 1 ton kertas = Menyelamatkan 17 pohon</li>
          <li>• 1 botol plastik didaur ulang = Menghemat energi untuk menyalakan lampu 6 jam</li>
          <li>• Aluminium bisa didaur ulang tanpa batas tanpa kehilangan kualitas</li>
          <li>• Indonesia menghasilkan 64 juta ton sampah per tahun</li>
        </ul>
      </div>
    </div>
  )
}
