import { Routes, Route, Navigate } from 'react-router-dom'
import Exercise1 from '@/pages/Exercise1'
import Exercise2 from '@/pages/Exercise2'
import NotFound from '@/pages/NotFound'
import NavBar from '@/components/NavBar/NavBar'
import { NAV_ITEMS } from '@/utils/constants'

const App = () => (
  <div className="min-h-screen flex flex-col">
    <NavBar items={NAV_ITEMS} />
    <main className="flex-1 flex items-center justify-center py-12 px-8">
      <Routes>
        <Route path="/" element={<Navigate to="/exercise1" replace />} />
        <Route path="/exercise1" element={<Exercise1 />} />
        <Route path="/exercise2" element={<Exercise2 />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  </div>
)

export default App
