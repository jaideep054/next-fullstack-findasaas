import Navbar from '@/components/Navbar'
import UserProfile from '@/components/UserProfile'

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <Navbar/>
      <UserProfile />
    </main>
  )
}
