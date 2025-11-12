import { useState } from 'react'
import { Scale, Calculator, CheckCircle, ArrowRight } from 'lucide-react'

export default function Exchange() {
  const [selectedType, setSelectedType] = useState('')
  const [weight, setWeight] = useState('')
  const [location, setLocation] = useState('')
  const [notes, setNotes] = useState('')
  const [estimatedPoints, setEstimatedPoints] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)

  const wasteTypes = [
    { id: 'plastic', name: 'Plastik', rate: 100, unit: 'kg', icon: '♻️', color: 'bg-blue-500' },
    { id: 'paper', name: 'Kertas', rate: 80, unit: 'kg', icon: '📄', color: 'bg-yellow-500' },
    { id: 'metal', name: 'Logam', rate: 150, unit: 'kg', icon: '🔧', color: 'bg-neutral-500' },
    { id: 'glass', name: 'Kaca', rate: 120, unit: 'kg', icon: '🍾', color: 'bg-green-500' },
    { id: 'electronics', name: 'Elektronik', rate: 200, unit: 'kg', icon: '💻', color: 'bg-purple-500' },
    { id: 'organic', name: 'Organik', rate: 50, unit: 'kg', icon: '🌿', color: 'bg-primary-500' }
  ]

  const calculatePoints = (type, weight) => {
    const wasteType = wasteTypes.find(w => w.id === type)
    if (wasteType && weight) {
      return Math.round(parseFloat(weight) * wasteType.rate)
    }
    return 0
  }

  const handleCalculate = () => {
    const points = calculatePoints(selectedType, weight)
    setEstimatedPoints(points)
  }

  const handleSubmit = () => {
    if (selectedType && weight && estimatedPoints > 0 && location) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
      
      // Save to transactions for admin approval
      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]')
      const newTransaction = {
        id: Date.now().toString(),
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        userPhone: currentUser.phone,
        wasteType: wasteTypes.find(w => w.id === selectedType).name,
        weight: parseFloat(weight),
        points: estimatedPoints,
        location: location,
        notes: notes || '-',
        date: new Date().toISOString(),
        status: 'pending'
      }
      transactions.push(newTransaction)
      localStorage.setItem('transactions', JSON.stringify(transactions))

      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        setSelectedType('')
        setWeight('')
        setLocation('')
        setNotes('')
        setEstimatedPoints(0)
      }, 3000)
    } else {
      alert('Mohon lengkapi semua field yang wajib diisi!')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl pb-20 md:pb-8">
      <h2 className="text-3xl font-bold text-neutral-800 mb-6">Tukar Sampah Jadi Poin</h2>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-xl font-bold text-neutral-800 mb-4 flex items-center">
          <Scale className="h-6 w-6 text-primary-600 mr-2" />
          Kalkulator Nilai Tukar
        </h3>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-3">
              Pilih Jenis Sampah
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {wasteTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => {
                    setSelectedType(type.id)
                    setEstimatedPoints(0)
                  }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedType === type.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-neutral-200 hover:border-primary-300'
                  }`}
                >
                  <div className="text-3xl mb-2">{type.icon}</div>
                  <div className="font-semibold text-neutral-800">{type.name}</div>
                  <div className="text-xs text-neutral-600">{type.rate} poin/{type.unit}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Berat Sampah (kg)
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => {
                setWeight(e.target.value)
                setEstimatedPoints(0)
              }}
              placeholder="Masukkan berat sampah"
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              min="0"
              step="0.1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Lokasi Pengambilan
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Contoh: Jl. Narotama No. 10, Surabaya"
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Catatan Tambahan
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Informasi tambahan tentang sampah (opsional)"
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows="3"
            />
          </div>

          <button
            onClick={handleCalculate}
            disabled={!selectedType || !weight}
            className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-neutral-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors"
          >
            <Calculator className="h-5 w-5" />
            <span>Hitung Estimasi</span>
          </button>

          {estimatedPoints > 0 && (
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl p-6 text-center">
              <div className="text-lg mb-2">Estimasi Poin yang Didapat</div>
              <div className="text-5xl font-bold mb-4">{estimatedPoints.toLocaleString('id-ID')}</div>
              <button
                onClick={handleSubmit}
                className="bg-white text-primary-600 px-8 py-3 rounded-full font-bold hover:bg-primary-50 transition-colors inline-flex items-center space-x-2"
              >
                <span>Kirim Sampah Sekarang</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {wasteTypes.slice(0, 3).map((type, index) => (
          <div key={index} className="bg-white rounded-lg p-4 shadow-md border border-neutral-100">
            <div className={`${type.color} w-10 h-10 rounded-lg flex items-center justify-center text-2xl mb-3`}>
              {type.icon}
            </div>
            <h4 className="font-bold text-neutral-800">{type.name}</h4>
            <p className="text-sm text-neutral-600">
              {type.rate} poin per {type.unit}
            </p>
          </div>
        ))}
      </div>

      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md text-center animate-bounce">
            <CheckCircle className="h-16 w-16 text-primary-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-neutral-800 mb-2">Menunggu Konfirmasi Admin</h3>
            <p className="text-neutral-600">
              Sampahmu telah terkirim dan menunggu konfirmasi dari admin.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}