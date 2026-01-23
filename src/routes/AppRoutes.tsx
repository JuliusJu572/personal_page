import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '../ui/AppLayout'
import { CheatingBuddyPage } from '../views/CheatingBuddyPage'
import { HomePage } from '../views/HomePage'
import { NotFoundPage } from '../views/NotFoundPage'
import { TarotPage } from '../views/TarotPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="cheating-buddy" element={<CheatingBuddyPage />} />
        <Route path="tarot" element={<TarotPage />} />
        <Route path="home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

