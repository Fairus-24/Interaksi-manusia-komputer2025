
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Phone, Award, Calendar, LogOut, Trophy } from 'lucide-react'

export default function Profile() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(null)
  const [userStats, setUserStats] = useState({
    totalTransactions: 0,
    approvedTransactions: 0,
    pendingTransactions: 0,
    rejectedTransactions: 0
  })

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}')
    setCurrentUser(user)

    // Calculate user statistics
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]')
    const userTransactions = transactions.filter(t => t.userId === user.id)
    
    setUserStats({
      totalTransactions: userTransactions.length,
      approvedTransactions: userTransactions.filter(t => t.status === 'approved').length,
      pendingTransactions: userTransactions.filter(t => t.status === 'pending').length,
      rejectedTransactions: userTransactions.filter(t => t.status === 'rejected').length
    })
  }, [])

  const handleLogout = () => {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('currentUser')
      navigate('/auth')
    }
  }

  if (!currentUser || !currentUser.id) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl pb-20 md:pb-8">
        <p className="text-center text-neutral-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl pb-20 md:pb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-8">Profil Saya</h2>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-primary-600 via-blue-600 to-purple-600 p-8 text-white">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <User className="h-10 w-10" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl md:text-3xl font-bold mb-1">{currentUser.name}</h3>
                <p className="text-primary-100">Member sejak {new Date(currentUser.createdAt).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</p>
              </div>
              <div className="text-right hidden md:block">
                <div className="text-sm text-primary-100 mb-1">Total Poin</div>
                <div className="text-4xl font-bold">{currentUser.points}</div>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="flex items-center space-x-3 p-4 bg-neutral-50 rounded-xl">
                <Mail className="h-6 w-6 text-primary-600" />
                <div>
                  <div className="text-xs text-neutral-500 mb-1">Email</div>
                  <div className="font-semibold text-neutral-800">{currentUser.email}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-neutral-50 rounded-xl">
                <Phone className="h-6 w-6 text-primary-600" />
                <div>
                  <div className="text-xs text-neutral-500 mb-1">No. Telepon</div>
                  <div className="font-semibold text-neutral-800">{currentUser.phone}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-neutral-50 rounded-xl">
                <Calendar className="h-6 w-6 text-primary-600" />
                <div>
                  <div className="text-xs text-neutral-500 mb-1">Bergabung</div>
                  <div className="font-semibold text-neutral-800">
                    {new Date(currentUser.createdAt).toLocaleDateString('id-ID')}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl border border-primary-200">
                <Award className="h-6 w-6 text-primary-600" />
                <div>
                  <div className="text-xs text-primary-700 mb-1">Total Poin</div>
                  <div className="font-bold text-2xl text-primary-700">{currentUser.points}</div>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="mb-6">
              <h4 className="text-lg font-bold text-neutral-800 mb-4 flex items-center">
                <Trophy className="h-5 w-5 text-primary-600 mr-2" />
                Statistik Transaksi
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl text-center border border-blue-200">
                  <div className="text-3xl font-bold text-blue-600 mb-1">{userStats.totalTransactions}</div>
                  <div className="text-xs text-blue-700">Total Transaksi</div>
                </div>
                <div className="bg-green-50 p-4 rounded-xl text-center border border-green-200">
                  <div className="text-3xl font-bold text-green-600 mb-1">{userStats.approvedTransactions}</div>
                  <div className="text-xs text-green-700">Disetujui</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-xl text-center border border-yellow-200">
                  <div className="text-3xl font-bold text-yellow-600 mb-1">{userStats.pendingTransactions}</div>
                  <div className="text-xs text-yellow-700">Pending</div>
                </div>
                <div className="bg-red-50 p-4 rounded-xl text-center border border-red-200">
                  <div className="text-3xl font-bold text-red-600 mb-1">{userStats.rejectedTransactions}</div>
                  <div className="text-xs text-red-700">Ditolak</div>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-xl font-bold hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center space-x-2"
            >
              <LogOut className="h-5 w-5" />
              <span>Keluar dari Akun</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
