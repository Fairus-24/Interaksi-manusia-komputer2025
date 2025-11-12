import { useState, useEffect } from 'react'
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react'

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([])
  const [userRank, setUserRank] = useState(null)

  useEffect(() => {
    const loadData = () => {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]')
      
      // Hitung total poin dari transaksi yang disetujui
      const userTransactions = transactions.filter(t => t.userId === currentUser.id && t.status === 'approved')
      const currentPoints = userTransactions.reduce((sum, t) => sum + t.points, 0)
      const currentWaste = userTransactions.reduce((sum, t) => sum + parseFloat(t.weight), 0)
      
      const mockData = [
        { id: 1, name: 'Budi Santoso', points: 15420, waste: 154.2, avatar: '👨' },
        { id: 2, name: 'Siti Nurhaliza', points: 12850, waste: 128.5, avatar: '👩' },
        { id: 3, name: 'Ahmad Rizki', points: 11230, waste: 112.3, avatar: '👨' },
        { id: 4, name: 'Dewi Lestari', points: 9870, waste: 98.7, avatar: '👩' },
        { id: 5, name: 'Andi Wijaya', points: 8560, waste: 85.6, avatar: '👨' },
        { id: 6, name: currentUser.name || 'Anda', points: currentPoints, waste: currentWaste, avatar: '🙋' },
        { id: 7, name: 'Linda Kusuma', points: 7240, waste: 72.4, avatar: '👩' },
        { id: 8, name: 'Rizal Firmansyah', points: 6890, waste: 68.9, avatar: '👨' },
        { id: 9, name: 'Maya Sari', points: 5670, waste: 56.7, avatar: '👩' },
        { id: 10, name: 'Eko Prasetyo', points: 4520, waste: 45.2, avatar: '👨' }
      ]

      const sorted = mockData.sort((a, b) => b.points - a.points)
      setLeaderboardData(sorted)

      const userIndex = sorted.findIndex(user => user.name === (currentUser.name || 'Anda'))
      if (userIndex !== -1) {
        setUserRank(userIndex + 1)
      }
    }
    
    loadData()
    
    // Reload data setiap 3 detik untuk sinkronisasi real-time
    const interval = setInterval(loadData, 3000)
    return () => clearInterval(interval)
  }, [])

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-8 w-8 text-yellow-500" />
      case 2:
        return <Medal className="h-8 w-8 text-neutral-400" />
      case 3:
        return <Medal className="h-8 w-8 text-amber-700" />
      default:
        return <div className="w-8 h-8 flex items-center justify-center font-bold text-neutral-600">{rank}</div>
    }
  }

  const getRankBadge = (rank) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600'
    if (rank === 2) return 'bg-gradient-to-r from-neutral-300 to-neutral-500'
    if (rank === 3) return 'bg-gradient-to-r from-amber-600 to-amber-800'
    return 'bg-white'
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl pb-20 md:pb-8">
      <h2 className="text-3xl font-bold text-neutral-800 mb-6">Leaderboard</h2>

      {userRank && (
        <div className="bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl p-6 mb-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-primary-100 mb-1">Peringkat Anda</div>
              <div className="text-4xl font-bold">#{userRank}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-primary-100 mb-1">Total Poin</div>
              <div className="text-3xl font-bold">
                {leaderboardData.find(u => u.id === 6)?.points.toLocaleString('id-ID') || '0'}
              </div>
            </div>
            <TrendingUp className="h-16 w-16 text-primary-200" />
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-md text-center">
          <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
          <div className="text-lg font-bold text-neutral-800">Penghargaan</div>
          <div className="text-sm text-neutral-600">Dapatkan badge eksklusif</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md text-center">
          <Award className="h-8 w-8 text-primary-600 mx-auto mb-2" />
          <div className="text-lg font-bold text-neutral-800">Hadiah Bulanan</div>
          <div className="text-sm text-neutral-600">Top 3 dapat bonus poin</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md text-center">
          <Medal className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <div className="text-lg font-bold text-neutral-800">Kompetisi</div>
          <div className="text-sm text-neutral-600">Event mingguan</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-primary-600 to-primary-500 text-white p-6">
          <h3 className="text-xl font-bold">Top Pengguna Aktif</h3>
          <p className="text-primary-100 text-sm mt-1">Pengguna dengan poin terbanyak bulan ini</p>
        </div>

        <div className="divide-y divide-neutral-200">
          {leaderboardData.map((user, index) => {
            const rank = index + 1
            const isCurrentUser = user.id === 6

            return (
              <div
                key={user.id}
                className={`p-4 flex items-center space-x-4 transition-colors ${
                  isCurrentUser ? 'bg-primary-50 border-l-4 border-primary-600' : 'hover:bg-neutral-50'
                } ${rank <= 3 ? getRankBadge(rank) + ' text-white' : ''}`}
              >
                <div className="flex-shrink-0 w-12 flex justify-center">
                  {getRankIcon(rank)}
                </div>

                <div className="text-4xl">{user.avatar}</div>

                <div className="flex-1">
                  <div className={`font-bold ${rank <= 3 ? 'text-white' : 'text-neutral-800'}`}>
                    {user.name}
                    {isCurrentUser && (
                      <span className="ml-2 text-xs bg-primary-600 text-white px-2 py-1 rounded-full">
                        Anda
                      </span>
                    )}
                  </div>
                  <div className={`text-sm ${rank <= 3 ? 'text-white/80' : 'text-neutral-600'}`}>
                    {user.waste.toFixed(1)} kg sampah terkumpul
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-2xl font-bold ${rank <= 3 ? 'text-white' : 'text-primary-600'}`}>
                    {user.points.toLocaleString('id-ID')}
                  </div>
                  <div className={`text-xs ${rank <= 3 ? 'text-white/80' : 'text-neutral-500'}`}>
                    poin
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-6 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-6 border border-yellow-200">
        <h4 className="text-lg font-bold text-amber-900 mb-3">🏆 Hadiah Leaderboard</h4>
        <div className="space-y-2 text-sm text-amber-800">
          <div className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            <span className="font-semibold">Juara 1:</span>
            <span>Voucher Rp 500.000 + Trophy Emas</span>
          </div>
          <div className="flex items-center space-x-2">
            <Medal className="h-5 w-5 text-neutral-400" />
            <span className="font-semibold">Juara 2:</span>
            <span>Voucher Rp 300.000 + Trophy Perak</span>
          </div>
          <div className="flex items-center space-x-2">
            <Medal className="h-5 w-5 text-amber-700" />
            <span className="font-semibold">Juara 3:</span>
            <span>Voucher Rp 200.000 + Trophy Perunggu</span>
          </div>
        </div>
      </div>
    </div>
  )
}
