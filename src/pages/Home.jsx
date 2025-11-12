import { Link } from 'react-router-dom'
import { Recycle, MapPin, Award, BookOpen, TrendingUp, Users } from 'lucide-react'

export default function Home() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
  const userPoints = currentUser.points || 0
  const userName = currentUser.name || 'Pengguna'

  const features = [
    {
      icon: MapPin,
      title: 'Peta Dropbox',
      description: 'Temukan titik pengumpulan sampah terdekat',
      link: '/map',
      color: 'bg-blue-500'
    },
    {
      icon: Recycle,
      title: 'Tukar Sampah',
      description: 'Hitung nilai tukar sampahmu',
      link: '/exchange',
      color: 'bg-primary-500'
    },
    {
      icon: Award,
      title: 'Leaderboard',
      description: 'Lihat peringkat pengguna teratas',
      link: '/leaderboard',
      color: 'bg-yellow-500'
    },
    {
      icon: BookOpen,
      title: 'Edukasi',
      description: 'Pelajari cara daur ulang yang benar',
      link: '/education',
      color: 'bg-purple-500'
    }
  ]

  const stats = [
    { label: 'Total Poin', value: userPoints.toLocaleString('id-ID'), icon: Award },
    { label: 'Sampah Ditukar', value: '0 kg', icon: TrendingUp },
    { label: 'Peringkat', value: '-', icon: Users }
  ]

  return (
    <div className="pb-20 lg:pb-0">
      <section className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-green-600 text-white py-12 md:py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
        <div className="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <div className="inline-block bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6">
            <p className="text-sm font-semibold text-primary-50">🌍 Platform Daur Ulang Terpercaya</p>
          </div>
          
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
            Tukar Sampahmu,<br/>
            <span className="text-yellow-300">Raih Hadiah! 🌱</span>
          </h2>
          
          <p className="text-lg md:text-xl lg:text-2xl mb-8 md:mb-10 text-primary-50 max-w-3xl mx-auto">
            Bergabunglah dengan gerakan daur ulang dan dapatkan poin yang bisa ditukar dengan hadiah menarik
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/exchange"
              className="inline-flex items-center space-x-2 bg-white text-primary-600 px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-bold hover:bg-primary-50 transition-all transform hover:scale-105 shadow-2xl w-full sm:w-auto justify-center"
            >
              <Recycle className="h-5 w-5 md:h-6 md:w-6" />
              <span>Kirim Sampah Sekarang</span>
            </Link>
            <Link
              to="/map"
              className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md text-white px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-bold hover:bg-white/20 transition-all border-2 border-white/30 w-full sm:w-auto justify-center"
            >
              <MapPin className="h-5 w-5 md:h-6 md:w-6" />
              <span>Lihat Peta</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        <div className="grid grid-cols-3 gap-3 md:gap-6 mb-10 md:mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all text-center border border-neutral-100 hover:scale-105 transform">
              <stat.icon className="h-8 w-8 md:h-10 md:w-10 text-primary-600 mx-auto mb-2 md:mb-3" />
              <div className="text-xl md:text-3xl font-bold text-neutral-800 mb-1">{stat.value}</div>
              <div className="text-xs md:text-sm text-neutral-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h3 className="text-2xl md:text-3xl font-bold text-neutral-800">Fitur Unggulan</h3>
          <div className="h-1 flex-1 bg-gradient-to-r from-primary-500 to-transparent rounded ml-4"></div>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <Link
              key={index}
              to={feature.link}
              className="bg-white rounded-2xl p-5 md:p-6 shadow-lg hover:shadow-2xl transition-all border border-neutral-100 hover:scale-105 transform group"
            >
              <div className={`${feature.color} w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                <feature.icon className="h-7 w-7 md:h-8 md:w-8 text-white" />
              </div>
              <h4 className="text-lg md:text-xl font-bold text-neutral-800 mb-2">{feature.title}</h4>
              <p className="text-sm md:text-base text-neutral-600">{feature.description}</p>
            </Link>
          ))}
        </div>

        <div className="mt-8 md:mt-10 bg-gradient-to-r from-primary-100 via-green-50 to-primary-50 rounded-2xl p-6 md:p-8 border-2 border-primary-200 shadow-lg">
          <div className="flex items-start space-x-3">
            <div className="bg-primary-500 rounded-full p-3 flex-shrink-0">
              <span className="text-2xl">💡</span>
            </div>
            <div>
              <h4 className="text-xl md:text-2xl font-bold text-primary-800 mb-3">Tahukah Kamu?</h4>
              <p className="text-sm md:text-base text-primary-700 leading-relaxed">
                Dengan mendaur ulang 1 ton kertas, kamu bisa menyelamatkan 17 pohon, menghemat 7.000 galon air, 
                dan mengurangi emisi gas rumah kaca hingga 1 ton CO2!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
