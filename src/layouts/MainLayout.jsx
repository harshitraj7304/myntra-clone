import { Outlet } from 'react-router-dom'
import Footer from '../components/common/Footer/Footer'
import Navbar from '../components/common/Navbar/Navbar'

function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout
