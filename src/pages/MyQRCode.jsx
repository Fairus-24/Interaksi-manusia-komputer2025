
import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Download, User } from 'lucide-react'

export default function MyQRCode() {
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}')
    setCurrentUser(user)
  }, [])

  const downloadQR = () => {
    const svg = document.getElementById('user-qr-code')
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL('image/png')
      
      const downloadLink = document.createElement('a')
      downloadLink.download = `QR-${currentUser?.name}.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
  }

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl pb-20 md:pb-8">
        <p className="text-center text-neutral-600">Loading...</p>
      </div>
    )
  }

  const qrData = JSON.stringify({
    userId: currentUser.id,
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone
  })

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl pb-20 md:pb-8">
      <h2 className="text-3xl font-bold text-neutral-800 mb-6">QR Code Saya</h2>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <User className="h-8 w-8 text-primary-600" />
          </div>
          <h3 className="text-xl font-bold text-neutral-800">{currentUser.name}</h3>
          <p className="text-neutral-600">{currentUser.email}</p>
        </div>

        <div className="flex justify-center mb-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <QRCodeSVG
              id="user-qr-code"
              value={qrData}
              size={256}
              level="H"
              includeMargin={true}
            />
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={downloadQR}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 inline-flex items-center space-x-2"
          >
            <Download className="h-5 w-5" />
            <span>Download QR Code</span>
          </button>
        </div>

        <div className="mt-8 bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h4 className="font-bold text-blue-800 mb-2">ℹ️ Cara Menggunakan</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Tunjukkan QR code ini kepada admin saat konfirmasi</li>
            <li>• Admin akan scan QR code untuk memverifikasi identitas Anda</li>
            <li>• Pastikan QR code dalam kondisi jelas dan tidak rusak</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
