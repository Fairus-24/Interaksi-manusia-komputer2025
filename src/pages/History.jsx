import { useState, useEffect } from 'react'
import { TrendingUp, Calendar, Award, Package } from 'lucide-react'

export default function History() {
  const [history, setHistory] = useState([])
  const [totalPoints, setTotalPoints] = useState(0)
  const [totalWeight, setTotalWeight] = useState(0)

  useEffect(() => {
    const loadData = () => {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]')
      
      // Filter transaksi user saat ini
      const userTransactions = transactions.filter(t => t.userId === currentUser.id)
      setHistory(userTransactions)

      // Filter hanya transaksi yang disetujui untuk menghitung total poin dan berat
      const approvedTransactions = userTransactions.filter(t => t.status === 'approved');
      const points = approvedTransactions.reduce((sum, t) => sum + t.points, 0);
      setTotalPoints(points);

      const weight = approvedTransactions.reduce((sum, t) => sum + parseFloat(t.weight), 0);
      setTotalWeight(weight);
    }
    
    loadData()
    
    // Reload data setiap 2 detik untuk sinkronisasi real-time
    const interval = setInterval(loadData, 2000)
    return () => clearInterval(interval)
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  

  const stats = [
    { label: 'Total Poin', value: totalPoints.toLocaleString('id-ID'), icon: Award, color: 'bg-yellow-500' },
    { label: 'Total Sampah', value: `${totalWeight.toFixed(1)} kg`, icon: Package, color: 'bg-primary-500' },
    { label: 'Transaksi', value: history.length, icon: TrendingUp, color: 'bg-blue-500' }
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl pb-20 md:pb-8">
      <h2 className="text-3xl font-bold text-neutral-800 mb-6">Riwayat Penukaran</h2>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-md">
            <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-neutral-800 mb-1">{stat.value}</div>
            <div className="text-sm text-neutral-600">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-primary-600 to-primary-500 text-white p-6">
          <h3 className="text-xl font-bold mb-2">Progres Poin Anda</h3>
          <div className="flex items-end space-x-4">
            <div>
              <div className="text-4xl font-bold">{totalPoints.toLocaleString('id-ID')}</div>
              <div className="text-primary-100">Poin Terkumpul</div>
            </div>
            <div className="flex-1 mb-2">
              <div className="bg-white/30 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-white h-full transition-all duration-500"
                  style={{ width: `${Math.min((totalPoints / 10000) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="text-sm text-primary-100 mt-1">Target: 10.000 poin</div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-bold text-neutral-800 mb-4 flex items-center">
            <Calendar className="h-5 w-5 text-primary-600 mr-2" />
            Riwayat Transaksi
          </h3>

          {history.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-500">Belum ada riwayat penukaran</p>
              <p className="text-sm text-neutral-400 mt-2">
                Mulai tukar sampahmu dan dapatkan poin!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-200 hover:border-primary-300 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="font-semibold text-neutral-800">{item.wasteType}</div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        item.status === 'approved' ? 'bg-green-100 text-green-800' :
                        item.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.status === 'approved' ? 'Disetujui' : 
                         item.status === 'rejected' ? 'Ditolak' : 'Menunggu'}
                      </span>
                    </div>
                    <div className="text-sm text-neutral-600">{formatDate(item.date)}</div>
                    <div className="text-sm text-neutral-500 mt-1">{item.weight} kg • {item.location}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      item.status === 'approved' ? 'text-primary-600' : 'text-neutral-400'
                    }`}>
                      +{item.points.toLocaleString('id-ID')}
                    </div>
                    <div className="text-xs text-neutral-500">poin</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 bg-gradient-to-r from-blue-50 to-primary-50 rounded-xl p-6 border border-primary-200">
        <h4 className="text-lg font-bold text-primary-800 mb-3">🎁 Tukar Poin Anda</h4>
        <p className="text-primary-700 mb-4">
          Poin yang terkumpul dapat ditukar dengan berbagai hadiah menarik:
        </p>
        <ul className="space-y-2 text-sm text-primary-700">
          <li>• 1.000 poin = Voucher belanja Rp 10.000</li>
          <li>• 5.000 poin = Voucher belanja Rp 50.000</li>
          <li>• 10.000 poin = Voucher belanja Rp 100.000 + Tas belanja ramah lingkungan</li>
        </ul>
      </div>
    </div>
  )
}