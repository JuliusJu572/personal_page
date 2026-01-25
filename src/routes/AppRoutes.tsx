import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '../ui/AppLayout'
import { CheatingBuddyPage } from '../views/CheatingBuddyPage'
import { HomePage } from '../views/HomePage'
import { KnowledgeCardEditorPage } from '../views/KnowledgeCardEditorPage'
import { KnowledgeCardsPage } from '../views/KnowledgeCardsPage'
import { NotFoundPage } from '../views/NotFoundPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="cheating-buddy" element={<CheatingBuddyPage />} />
        <Route path="knowledge-cards" element={<KnowledgeCardsPage />} />
        <Route path="knowledge-cards/editor" element={<KnowledgeCardEditorPage />} />
        <Route path="home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
