import { Container } from '../ui/Container'
import { Card } from '../ui/Card'
import styles from './brandStoryPage.module.css'

export function BrandStoryPage() {
  return (
    <Container className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            <span className={styles.titleEn}>Lucencia</span>
            <span className={styles.titleSep}> · </span>
            <span className={styles.titleCn}>露森西娅</span>
          </h1>
          <p className={styles.subtitle}>让沟通的每一个暗角，皆有光亮。</p>
        </div>
      </header>

      <section className={styles.section}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>名字释义</h2>
          <Card className={styles.definitionCard}>
            <div className={styles.definitionContent}>
              <div className={styles.etymology}>
                <span className={styles.latin}>Lucent</span>
                <span className={styles.meaning}>发光的、清澈的、带来光明的</span>
              </div>
              <p className={styles.definitionText}>
                Lucencia 词根源于拉丁语 Lucent，寓意着光明与清晰。我们相信，真正的沟通应该像光一样穿透迷雾，让每一个想法都能被清晰理解。
              </p>
            </div>
          </Card>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>品牌故事</h2>
          <div className={styles.storyGrid}>
            <Card className={styles.storyCard}>
              <div className={styles.storyIcon}>💡</div>
              <h3 className={styles.storyTitle}>起源</h3>
              <p className={styles.storyText}>
                在全球化协作日益频繁的今天，语言障碍和信息不对称成为团队效率的最大瓶颈。我们创建 Lucencia，正是为了解决这一痛点。
              </p>
            </Card>

            <Card className={styles.storyCard}>
              <div className={styles.storyIcon}>🌍</div>
              <h3 className={styles.storyTitle}>使命</h3>
              <p className={styles.storyText}>
                我们的使命是打破语言壁垒，让跨国团队能够像本地团队一样高效协作。通过 AI 技术，我们让沟通变得无障碍。
              </p>
            </Card>

            <Card className={styles.storyCard}>
              <div className={styles.storyIcon}>✨</div>
              <h3 className={styles.storyTitle}>愿景</h3>
              <p className={styles.storyText}>
                我们愿景是成为全球企业首选的会议协同工具，让每一次跨国会议都能产生最大价值，让每一个参与者都能充分表达。
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>我们的价值观</h2>
          <div className={styles.valuesGrid}>
            <div className={styles.valueItem}>
              <div className={styles.valueIcon}>🎯</div>
              <h3 className={styles.valueTitle}>精准</h3>
              <p className={styles.valueText}>毫秒级响应，高精度翻译，确保信息传递的准确性</p>
            </div>
            <div className={styles.valueItem}>
              <div className={styles.valueIcon}>🔒</div>
              <h3 className={styles.valueTitle}>安全</h3>
              <p className={styles.valueText}>企业级数据保护，所有处理仅在本地进行，保障商业机密</p>
            </div>
            <div className={styles.valueItem}>
              <div className={styles.valueIcon}>🚀</div>
              <h3 className={styles.valueTitle}>高效</h3>
              <p className={styles.valueText}>无缝集成现有工作流，提升团队协作效率 300%</p>
            </div>
            <div className={styles.valueItem}>
              <div className={styles.valueIcon}>🤝</div>
              <h3 className={styles.valueTitle}>包容</h3>
              <p className={styles.valueText}>支持 50+ 语种，让每个团队成员都能平等参与</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>技术实力</h2>
          <div className={styles.techGrid}>
            <Card className={styles.techCard}>
              <h3 className={styles.techTitle}>AI 驱动</h3>
              <p className={styles.techText}>
                基于最新的大语言模型和语音识别技术，提供行业领先的翻译准确率和响应速度。
              </p>
            </Card>
            <Card className={styles.techCard}>
              <h3 className={styles.techTitle}>实时处理</h3>
              <p className={styles.techText}>
                毫秒级延迟的实时翻译，让您几乎感觉不到语言转换的过程。
              </p>
            </Card>
            <Card className={styles.techCard}>
              <h3 className={styles.techTitle}>智能集成</h3>
              <p className={styles.techText}>
                无缝集成 Zoom、Teams、腾讯会议等主流会议平台，无需改变现有工作习惯。
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>准备好照亮您的跨国会议了吗？</h2>
          <p className={styles.ctaText}>
            加入全球数千家企业的行列，体验无障碍沟通的力量。
          </p>
          <div className={styles.ctaButtons}>
            <a href="/lucencia" className={styles.ctaPrimary}>
              了解更多
            </a>
            <a href="/guide" className={styles.ctaSecondary}>
              查看使用指南
            </a>
          </div>
        </div>
      </section>
    </Container>
  )
}