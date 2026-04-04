import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '../ui/AppLayout'
import { HomePage } from '../views/HomePage'

import { BrandStoryPage } from '../views/BrandStoryPage'
import { FeaturesPage } from '../views/FeaturesPage'
import { GuidePage } from '../views/GuidePage'
import { KnowledgeCardEditorPage } from '../views/KnowledgeCardEditorPage'
import { KnowledgeCardsPage } from '../views/KnowledgeCardsPage'
import { PrivacyPage } from '../views/PrivacyPage'
import { TermsPage } from '../views/TermsPage'
import { NotFoundPage } from '../views/NotFoundPage'
import { RegisterPage } from '../views/RegisterPage'
import { LoginPage } from '../views/LoginPage'
import { PricingPage } from '../views/PricingPage'
import { DashboardPage } from '../views/DashboardPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/lucencia" replace />} />

      <Route path="/lucencia" element={<HomePage />} />
      <Route path="/guide" element={<GuidePage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />

      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/lucencia" replace />} />
        <Route path="brand-story" element={<BrandStoryPage />} />
        <Route path="features" element={<FeaturesPage />} />
        <Route path="knowledge-cards" element={<KnowledgeCardsPage />} />
        <Route path="knowledge-cards/editor" element={<KnowledgeCardEditorPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="pricing" element={<PricingPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
