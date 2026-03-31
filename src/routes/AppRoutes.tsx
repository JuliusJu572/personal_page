import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '../ui/AppLayout'
import { CheatingBuddyPage } from '../views/CheatingBuddyPage'
import { GuidePage } from '../views/GuidePage'
import { KnowledgeCardEditorPage } from '../views/KnowledgeCardEditorPage'
import { KnowledgeCardsPage } from '../views/KnowledgeCardsPage'
import { NotFoundPage } from '../views/NotFoundPage'
import { RegisterPage } from '../views/RegisterPage'
import { LoginPage } from '../views/LoginPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/lucencia" replace />} />
        <Route path="lucencia" element={<CheatingBuddyPage />} />
        <Route path="guide" element={<GuidePage />} />
        <Route path="knowledge-cards" element={<KnowledgeCardsPage />} />
        <Route path="knowledge-cards/editor" element={<KnowledgeCardEditorPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
