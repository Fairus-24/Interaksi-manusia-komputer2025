
import { useState, useEffect, useRef } from 'react'
import { CheckCircle, XCircle, Clock, Package, Calendar, QrCode, Camera, User, Phone, Mail } from 'lucide-react'
import { Html5Qrcode } from 'html5-qrcode'

export default function Admin() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [password, setPassword] = useState('')
  const [pendingTransactions, setPendingTransactions] = useState([])
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [scannerMode, setScannerMode] = useState('camera')
  const [qrInput, setQrInput] = useState('')
  const html5QrCodeRef = useRef(null)

  // Check if admin is already logged in on mount
  useEffect(() => {
    const adminLoggedIn = localStorage.getItem('isAdminLoggedIn')
    if (adminLoggedIn === 'true') {
      setIsAdmin(true)
    }
  }, [])

  useEffect(() => {
    if (isAdmin) {
      loadPendingTransactions()
    }
  }, [isAdmin])

  useEffect(() => {
    if (showQRScanner && scannerMode === 'camera' && !html5QrCodeRef.current) {
      const scanner = new Html5Qrcode("qr-reader")
      html5QrCodeRef.current = scanner
      
      scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        (decodedText) => {
          handleQRScan(decodedText)
          scanner.stop().then(() => {
            html5QrCodeRef.current = null
          })
        },
        (errorMessage) => {
          // Ignore errors during scanning
        }
      ).catch(err => {
        console.error("Camera error:", err)
      })
    }

    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(() => {})
        html5QrCodeRef.current = null
      }
    }
  }, [showQRScanner, scannerMode])

  const loadPendingTransactions = () => {
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]')
    const pending = transactions.filter(t => t.status === 'pending')
    setPendingTransactions(pending)
  }

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === 'admin123') {
      setIsAdmin(true)
      localStorage.setItem('isAdminLoggedIn', 'true')
    } else {
      alert('Password salah!')
    }
  }

  const handleApprove = (transactionId) => {
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]')
    const transaction = transactions.find(t => t.id === transactionId)
    
    if (transaction) {
      // Update user points
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const updatedUsers = users.map(u => {
        if (u.id === transaction.userId) {
          return { ...u, points: (u.points || 0) + transaction.points }
        }
        return u
      })
      localStorage.setItem('users', JSON.stringify(updatedUsers))
      
      // Update currentUser if it's the same user
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
      if (currentUser.id === transaction.userId) {
        currentUser.points = (currentUser.points || 0) + transaction.points
        localStorage.setItem('currentUser', JSON.stringify(currentUser))
      }
      
      // Update transaction status
      const updatedTransactions = transactions.map(t => {
        if (t.id === transactionId) {
          return { ...t, status: 'approved', approvedAt: new Date().toISOString() }
        }
        return t
      })
      localStorage.setItem('transactions', JSON.stringify(updatedTransactions))
      loadPendingTransactions()
      alert(`✅ Transaksi berhasil disetujui!\n+${transaction.points} poin telah ditambahkan ke akun ${transaction.userName}`)
    }
  }

  const handleReject = (transactionId, reason) => {
    const rejectionReason = reason || prompt('Alasan penolakan:')
    if (!rejectionReason) return

    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]')
    const updatedTransactions = transactions.map(t => {
      if (t.id === transactionId) {
        return { 
          ...t, 
          status: 'rejected', 
          rejectedAt: new Date().toISOString(),
          rejectionReason
        }
      }
      return t
    })
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions))
    loadPendingTransactions()
    alert('❌ Transaksi ditolak')
  }

  const handleQRScan = (result) => {
    if (result) {
      try {
        const userData = JSON.parse(result)
        alert(`✅ Pengguna Terverifikasi:\n\nNama: ${userData.name}\nEmail: ${userData.email}\nPhone: ${userData.phone}`)
        setShowQRScanner(false)
        setScannerMode('camera')
      } catch (e) {
        alert('❌ QR Code tidak valid!')
      }
    }
  }

  const handleManualVerify = () => {
    try {
      const userData = JSON.parse(qrInput)
      alert(`✅ Pengguna Terverifikasi:\n\nNama: ${userData.name}\nEmail: ${userData.email}\nPhone: ${userData.phone}`)
      setShowQRScanner(false)
      setQrInput('')
      setScannerMode('camera')
    } catch (e) {
      alert('❌ QR Code tidak valid!')
    }
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-primary-50 to-purple-50 px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-neutral-200">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Package className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-neutral-800 mb-2">Admin Login</h2>
            <p className="text-neutral-600">Masuk ke panel admin</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label className="block text-neutral-700 font-semibold mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="Masukkan password admin"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary-600 to-blue-600 text-white py-4 rounded-xl font-bold hover:from-primary-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              Masuk ke Admin Panel
            </button>
          </form>
          <p className="text-sm text-neutral-500 mt-6 text-center bg-neutral-50 rounded-lg p-3">
            🔑 Demo password: <span className="font-mono font-bold">admin123</span>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl pb-20 md:pb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-2">Panel Admin</h2>
            <p className="text-neutral-600">Kelola transaksi penukaran sampah</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowQRScanner(true)}
              className="flex-1 md:flex-none px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 flex items-center justify-center space-x-2 shadow-lg transition-all transform hover:scale-105"
            >
              <QrCode className="h-5 w-5" />
              <span>Scan QR</span>
            </button>
            <button
              onClick={() => {
                if (confirm('Apakah Anda yakin ingin logout dari admin panel?')) {
                  setIsAdmin(false)
                  localStorage.removeItem('isAdminLoggedIn')
                }
              }}
              className="flex-1 md:flex-none px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 shadow-lg transition-all transform hover:scale-105"
            >
              Logout
            </button>
          </div>
        </div>

        {showQRScanner && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <h3 className="text-2xl font-bold text-neutral-800 mb-4">Scan QR Code User</h3>
              
              <div className="flex space-x-2 mb-4">
                <button
                  onClick={() => setScannerMode('camera')}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all ${
                    scannerMode === 'camera' 
                      ? 'bg-gradient-to-r from-primary-600 to-blue-600 text-white shadow-lg' 
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  <Camera className="h-5 w-5" />
                  <span>Kamera</span>
                </button>
                <button
                  onClick={() => setScannerMode('manual')}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all ${
                    scannerMode === 'manual' 
                      ? 'bg-gradient-to-r from-primary-600 to-blue-600 text-white shadow-lg' 
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  <QrCode className="h-5 w-5" />
                  <span>Manual</span>
                </button>
              </div>

              {scannerMode === 'camera' ? (
                <div className="mb-4">
                  <div id="qr-reader" className="bg-neutral-100 rounded-xl overflow-hidden border-2 border-neutral-300"></div>
                  <p className="text-sm text-neutral-600 mt-3 text-center">
                    📷 Arahkan kamera ke QR code pengguna
                  </p>
                </div>
              ) : (
                <div className="mb-4">
                  <p className="text-neutral-600 mb-2 font-medium">Paste data QR code:</p>
                  <textarea
                    value={qrInput}
                    onChange={(e) => setQrInput(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows="4"
                    placeholder='{"userId":"...","name":"...","email":"...","phone":"..."}'
                  />
                </div>
              )}

              <div className="flex space-x-2">
                {scannerMode === 'manual' && (
                  <button
                    onClick={handleManualVerify}
                    className="flex-1 bg-gradient-to-r from-primary-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-blue-700 shadow-lg"
                  >
                    Verifikasi Manual
                  </button>
                )}
                <button
                  onClick={() => {
                    if (html5QrCodeRef.current) {
                      html5QrCodeRef.current.stop().then(() => {
                        html5QrCodeRef.current = null
                        setShowQRScanner(false)
                        setQrInput('')
                        setScannerMode('camera')
                      }).catch(() => {
                        setShowQRScanner(false)
                        setQrInput('')
                        setScannerMode('camera')
                      })
                    } else {
                      setShowQRScanner(false)
                      setQrInput('')
                      setScannerMode('camera')
                    }
                  }}
                  className="flex-1 bg-neutral-200 text-neutral-700 py-3 rounded-xl font-semibold hover:bg-neutral-300"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 shadow-lg border border-yellow-200">
            <Clock className="h-10 w-10 text-yellow-600 mb-3" />
            <div className="text-4xl font-bold text-yellow-900 mb-1">{pendingTransactions.length}</div>
            <div className="text-sm font-medium text-yellow-700">Menunggu Konfirmasi</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 shadow-lg border border-green-200">
            <CheckCircle className="h-10 w-10 text-green-600 mb-3" />
            <div className="text-4xl font-bold text-green-900 mb-1">
              {JSON.parse(localStorage.getItem('transactions') || '[]').filter(t => t.status === 'approved').length}
            </div>
            <div className="text-sm font-medium text-green-700">Disetujui</div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 shadow-lg border border-red-200">
            <XCircle className="h-10 w-10 text-red-600 mb-3" />
            <div className="text-4xl font-bold text-red-900 mb-1">
              {JSON.parse(localStorage.getItem('transactions') || '[]').filter(t => t.status === 'rejected').length}
            </div>
            <div className="text-sm font-medium text-red-700">Ditolak</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-neutral-200">
          <div className="bg-gradient-to-r from-primary-600 via-blue-600 to-purple-600 text-white p-6">
            <h3 className="text-xl md:text-2xl font-bold">Transaksi Menunggu Konfirmasi</h3>
            <p className="text-primary-100 mt-1">Review dan setujui transaksi penukaran sampah</p>
          </div>

          {pendingTransactions.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-10 w-10 text-neutral-400" />
              </div>
              <p className="text-xl font-semibold text-neutral-600 mb-2">Tidak ada transaksi pending</p>
              <p className="text-neutral-500">Semua transaksi sudah diproses</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-200">
              {pendingTransactions.map((transaction) => (
                <div key={transaction.id} className="p-4 md:p-6 hover:bg-neutral-50 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center flex-wrap gap-2 mb-3">
                        <Package className="h-5 w-5 text-primary-600" />
                        <span className="font-bold text-lg md:text-xl text-neutral-800">
                          {transaction.wasteType}
                        </span>
                        <span className="px-3 py-1 bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 rounded-full text-xs font-semibold">
                          ⏳ Pending
                        </span>
                      </div>
                      
                      <div className="mb-3 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                        <div className="text-xs text-blue-700 font-semibold mb-2 flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          Informasi Pengguna:
                        </div>
                        <div className="grid md:grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center text-blue-900">
                            <User className="h-4 w-4 mr-2 text-blue-600" />
                            <strong>{transaction.userName}</strong>
                          </div>
                          <div className="flex items-center text-blue-800">
                            <Mail className="h-4 w-4 mr-2 text-blue-600" />
                            {transaction.userEmail}
                          </div>
                          <div className="flex items-center text-blue-800 md:col-span-2">
                            <Phone className="h-4 w-4 mr-2 text-blue-600" />
                            {transaction.userPhone}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-neutral-700">
                        <div className="bg-neutral-50 p-3 rounded-lg">
                          <div className="text-xs text-neutral-500 mb-1">Tanggal</div>
                          <div className="font-semibold">{new Date(transaction.date).toLocaleDateString('id-ID')}</div>
                        </div>
                        <div className="bg-neutral-50 p-3 rounded-lg">
                          <div className="text-xs text-neutral-500 mb-1">Berat</div>
                          <div className="font-semibold">{transaction.weight} kg</div>
                        </div>
                        <div className="bg-neutral-50 p-3 rounded-lg">
                          <div className="text-xs text-neutral-500 mb-1">Lokasi</div>
                          <div className="font-semibold truncate">{transaction.location}</div>
                        </div>
                        <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-3 rounded-lg border border-primary-200">
                          <div className="text-xs text-primary-700 mb-1">Estimasi Poin</div>
                          <div className="font-bold text-primary-700">{transaction.points} poin</div>
                        </div>
                      </div>
                      
                      {transaction.notes && (
                        <div className="mt-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                          <div className="text-xs text-neutral-500 mb-1">💬 Catatan:</div>
                          <div className="text-sm text-neutral-700">{transaction.notes}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => handleApprove(transaction.id)}
                      className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center space-x-2"
                    >
                      <CheckCircle className="h-5 w-5" />
                      <span>Setujui Transaksi</span>
                    </button>
                    <button
                      onClick={() => handleReject(transaction.id)}
                      className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center space-x-2"
                    >
                      <XCircle className="h-5 w-5" />
                      <span>Tolak Transaksi</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
