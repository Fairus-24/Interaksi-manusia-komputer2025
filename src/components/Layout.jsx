import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, MapPin, Repeat, History, Trophy, BookOpen, Leaf, QrCode, LogOut, User } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Layout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState({ name: 'Pengguna', points: 0 })

  useEffect(() => {
    const updateUser = () => {
      const user = JSON.parse(localStorage.getItem('currentUser') || '{}')
      setCurrentUser({
        name: user.name || 'Pengguna',
        points: user.points || 0
      })
    }
    
    updateUser()
    
    // Update setiap 2 detik untuk sinkronisasi
    const interval = setInterval(updateUser, 2000)
    return () => clearInterval(interval)
  }, [location])

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('currentUser')
    navigate('/auth')
  }

  const navItems = [
    { path: '/', icon: Home, label: 'Beranda' },
    { path: '/map', icon: MapPin, label: 'Peta' },
    { path: '/exchange', icon: Repeat, label: 'Tukar' },
    { path: '/history', icon: History, label: 'Riwayat' },
    { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { path: '/education', icon: BookOpen, label: 'Edukasi' },
    { path: '/qrcode', icon: QrCode, label: 'QR Code' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-neutral-50 via-primary-50/20 to-neutral-50">
      <header className="bg-gradient-to-r from-primary-600 via-primary-500 to-green-500 text-white shadow-2xl sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 md:space-x-3 group">
              <div className="bg-white/20 p-2 rounded-xl group-hover:bg-white/30 transition-all">
                <Leaf className="h-6 w-6 md:h-8 md:w-8" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold">SampahBijak</h1>
                <p className="text-xs text-primary-100 hidden md:block">Tukar Sampah Jadi Poin</p>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map(({ path, icon: Icon, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`px-3 xl:px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
                    location.pathname === path
                      ? 'bg-white/20 font-semibold shadow-lg'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <Icon className="h-4 w-4 xl:h-5 xl:w-5" />
                  <span className="text-sm xl:text-base">{label}</span>
                </Link>
              ))}
            </div>

            {/* User Info - Desktop */}
            <div className="hidden md:flex items-center space-x-3">
              <Link
                to="/profile"
                className="bg-white/10 rounded-lg px-4 py-2 backdrop-blur-sm hover:bg-white/20 transition-all cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <div className="text-left">
                    <p className="text-sm font-semibold">{currentUser.name}</p>
                    <p className="text-xs text-primary-100">{currentUser.points} poin</p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Mobile User Info */}
            <div className="md:hidden flex items-center space-x-2">
              <Link
                to="/profile"
                className="bg-white/10 rounded-lg px-3 py-1.5 backdrop-blur-sm hover:bg-white/20 transition-all"
              >
                <div className="flex items-center space-x-1.5">
                  <User className="h-4 w-4" />
                  <div className="text-left">
                    <p className="text-xs font-semibold truncate max-w-[80px]">{currentUser.name}</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-neutral-200 shadow-2xl z-50">
        <div className="flex justify-around items-center">
          {navItems.slice(0, 5).map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center py-3 px-2 flex-1 transition-all ${
                location.pathname === path
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-neutral-500 hover:text-primary-500 hover:bg-neutral-50'
              }`}
            >
              <div className={`${location.pathname === path ? 'scale-110' : ''} transition-transform`}>
                <Icon className="h-6 w-6" />
              </div>
              <span className="text-xs mt-1 font-medium">{label}</span>
            </Link>
          ))}
          <Link
            to="/qrcode"
            className={`flex flex-col items-center py-3 px-2 flex-1 transition-all ${
              location.pathname === '/qrcode'
                ? 'text-primary-600 bg-primary-50'
                : 'text-neutral-500 hover:text-primary-500 hover:bg-neutral-50'
            }`}
          >
            <div className={`${location.pathname === '/qrcode' ? 'scale-110' : ''} transition-transform`}>
              <QrCode className="h-6 w-6" />
            </div>
            <span className="text-xs mt-1 font-medium">QR Code</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
