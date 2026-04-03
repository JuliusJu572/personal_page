import { HomeNavbar } from '../ui/HomeNavbar'
import { HeroSection } from './HeroSection'
import { DistortionWaveSection } from './DistortionWaveSection'
import { HomeFeaturesSection } from './HomeFeaturesSection'
import { PrivacySecuritySection } from './PrivacySecuritySection'
import { GetStartedSection } from './GetStartedSection'
import styles from './homePage.module.css'

export function HomePage() {
  return (
    <div className={styles.homePage}>
      <HomeNavbar />
      <HeroSection />
      <DistortionWaveSection />
      <HomeFeaturesSection />
      <PrivacySecuritySection />
      <GetStartedSection />
    </div>
  )
}
