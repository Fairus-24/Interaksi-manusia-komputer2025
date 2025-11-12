import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Map from './pages/Map'
import Exchange from './pages/Exchange'
import History from './pages/History'
import Leaderboard from './pages/Leaderboard'
import Education from './pages/Education'
import Admin from './pages/Admin'
import Auth from './pages/Auth'
import MyQRCode from './pages/MyQRCode'
import Profile from './pages/Profile'

function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
  return isLoggedIn ? children : <Navigate to="/auth" />
}

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/*" element={
        <ProtectedRoute>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/map" element={<Map />} />
              <Route path="/exchange" element={<Exchange />} />
              <Route path="/history" element={<History />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/education" element={<Education />} />
              <Route path="/qrcode" element={<MyQRCode />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </Layout>
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default App