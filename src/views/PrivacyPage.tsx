import { HomeNavbar } from '../ui/HomeNavbar'
import { HomeFooter } from '../ui/HomeFooter'
import { Background } from '../ui/Background'
import styles from './legalPage.module.css'

export function PrivacyPage() {
  return (
    <div className={styles.page}>
      <Background />
      <HomeNavbar />
      <header className={styles.header}>
        <div className={styles.headerBadge}>隐私政策</div>
        <h1 className={styles.title}>隐私政策</h1>
        <p className={styles.subtitle}>最后更新日期：2026年4月1日</p>
      </header>

      <main className={styles.main}>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            </span>
            <h2 className={styles.h2}>信息收集</h2>
            <div className={styles.sectionLine} />
          </div>
          <p className={styles.text}>我们收集的信息仅用于提供和改进 LUCENCIA 服务。我们承诺：</p>
          <ul className={styles.list}>
            <li><strong>账户信息：</strong>用户名、邮箱地址等注册信息</li>
            <li><strong>使用数据：</strong>功能使用频率、错误日志等匿名统计数据</li>
            <li><strong>设备信息：</strong>操作系统版本、设备型号（用于兼容性优化）</li>
            <li><strong>对话内容：</strong>您的识别与问答内容，用于 AI 模型优化（可随时删除）</li>
          </ul>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </span>
            <h2 className={styles.h2}>信息安全</h2>
            <div className={styles.sectionLine} />
          </div>
          <ul className={styles.list}>
            <li>所有数据传输均采用 TLS 1.3 加密协议</li>
            <li>用户密码使用 bcrypt 哈希存储，不可逆还原</li>
            <li>API Key 和 License Key 采用 AES-256 加密存储</li>
            <li>服务器部署于安全的数据中心，定期进行安全审计</li>
            <li>对话内容默认保留 30 天，用户可手动清除或设置自动清理</li>
          </ul>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
            </span>
            <h2 className={styles.h2}>用户权利</h2>
            <div className={styles.sectionLine} />
          </div>
          <ul className={styles.list}>
            <li><strong>访问权：</strong>您可以随时查看我们收集的关于您的所有信息</li>
            <li><strong>更正权：</strong>您有权要求更正不准确或不完整的个人信息</li>
            <li><strong>删除权：</strong>您可以要求永久删除您的账户及所有关联数据</li>
            <li><strong>导出权：</strong>您可以导出您的个人数据（JSON 格式）</li>
            <li><strong>撤回同意：</strong>您可以随时撤回对数据处理活动的同意</li>
          </ul>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            </span>
            <h2 className={styles.h2}>Cookie 与追踪</h2>
            <div className={styles.sectionLine} />
          </div>
          <ul className={styles.list}>
            <li>LUCENCIA 客户端不使用任何第三方 Cookie 或追踪技术</li>
            <li>网站仅使用必要的会话 Cookie 用于登录状态维护</li>
            <li>我们不与任何第三方广告或分析服务共享用户数据</li>
          </ul>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </span>
            <h2 className={styles.h2}>第三方服务</h2>
            <div className={styles.sectionLine} />
          </div>
          <p className={styles.text}>我们的 AI 识别与转写功能依赖以下第三方 API 服务：</p>
          <ul className={styles.list}>
            <li><strong>阿里云通义千问 (Qwen)</strong> — 文本理解和生成模型</li>
            <li><strong>阿里云视觉模型 (Qwen-VL)</strong> — 屏幕内容识别与分析</li>
            <li><strong>阿里云语音识别 (Qwen-ASR)</strong> — 实时语音转文字</li>
          </ul>
          <p className={styles.text}>这些服务的使用受其各自隐私政策约束。我们确保在向这些服务发送数据时进行最小化处理。</p>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </span>
            <h2 className={styles.h2}>政策更新</h2>
            <div className={styles.sectionLine} />
          </div>
          <p className={styles.text}>我们可能会不时更新本隐私政策。重大变更将通过应用内通知或邮件告知您。继续使用服务即表示您接受更新后的政策。</p>
        </section>

        <div className={styles.updatedAt}>最后更新：2026 年 4 月 1 日</div>
      </main>
      <HomeFooter />
    </div>
  )
}
