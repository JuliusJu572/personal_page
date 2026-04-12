import { HomeNavbar } from '../ui/HomeNavbar'
import { HomeFooter } from '../ui/HomeFooter'
import { Background } from '../ui/Background'
import styles from './legalPage.module.css'

export function TermsPage() {
  return (
    <div className={styles.page}>
      <Background />
      <HomeNavbar />
      <header className={styles.header}>
        <div className={styles.headerBadge}>服务条款</div>
        <h1 className={styles.title}>用户服务协议</h1>
        <p className={styles.subtitle}>最后更新日期：2026年4月1日</p>
      </header>

      <main className={styles.main}>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </span>
            <h2 className={styles.h2}>协议范围</h2>
            <div className={styles.sectionLine} />
          </div>
          <p className={styles.text}>本协议是您与 LUCENCIA（以下简称"我们"）之间关于使用 LUCENCIA AI 会议辅助助手服务的法律协议。请您仔细阅读并理解本协议的全部条款。</p>
          <p className={styles.text}>使用我们的服务即表示您同意受本协议的约束。如果您不同意本协议的任何条款，请勿使用我们的服务。</p>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6v6H9z"/></svg>
            </span>
            <h2 className={styles.h2}>服务描述</h2>
            <div className={styles.sectionLine} />
          </div>
          <p className={styles.text}>LUCENCIA 是一款专为企业打造的 AI 会议辅助工具，提供以下核心功能：</p>
          <ul className={styles.list}>
            <li>多语种实时语音转写 — 支持 50+ 语言，毫秒级响应</li>
            <li>屏幕内容智能识别与解析 — OCR + AI 识别一体化</li>
            <li>企业知识库集成与问答 — 构建专属知识库，智能检索回答</li>
            <li>会议纪要自动生成 — 结构化摘要，一键导出</li>
          </ul>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </span>
            <h2 className={styles.h2}>账户注册</h2>
            <div className={styles.sectionLine} />
          </div>
          <ul className={styles.list}>
            <li>您需要注册账户才能使用我们的服务。注册时，您应提供真实、准确、完整的信息。</li>
            <li>您应妥善保管账户信息和密码，因您保管不善导致的损失由您自行承担。</li>
            <li>您不得将账户转让、出售或出借给他人使用。</li>
          </ul>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </span>
            <h2 className={styles.h2}>使用规范</h2>
            <div className={styles.sectionLine} />
          </div>
          <p className={styles.text}>您在使用我们的服务时，应遵守以下规范：</p>
          <ul className={styles.list}>
            <li>遵守中华人民共和国相关法律法规</li>
            <li>尊重他人的知识产权和隐私权</li>
            <li>不利用服务从事违法违规活动</li>
            <li>不干扰或破坏服务的正常运行</li>
          </ul>

          <div className={styles.highlightBox}>
            <p className={styles.highlightTitle}>⚠️ 特别声明</p>
            <p className={styles.text}>此会议辅助软件仅用于合法会议及办公场景，严禁用于笔试、面试等违规场景。违反此规定使用本软件所产生的一切后果由用户自行承担。</p>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </span>
            <h2 className={styles.h2}>知识产权</h2>
            <div className={styles.sectionLine} />
          </div>
          <ul className={styles.list}>
            <li>我们的服务及其所有内容（包括但不限于软件、技术、程序、界面设计、版面框架、数据资料等）的知识产权归我们所有。</li>
            <li>未经我们书面许可，您不得复制、修改、传播或使用我们的知识产权。</li>
          </ul>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
            </span>
            <h2 className={styles.h2}>服务费用</h2>
            <div className={styles.sectionLine} />
          </div>
          <ul className={styles.list}>
            <li>我们提供免费试用和付费订阅两种模式。具体收费标准以我们公布的价格为准。</li>
            <li>付费服务的订阅周期、续费规则和退款政策将在购买页面明确说明。</li>
            <li>我们保留调整服务价格的权利，价格调整前会提前通知用户。</li>
          </ul>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            </span>
            <h2 className={styles.h2}>免责声明</h2>
            <div className={styles.sectionLine} />
          </div>
          <ul className={styles.list}>
            <li>我们的服务按"现状"提供，我们不对服务的准确性、完整性、可靠性作任何明示或暗示的保证。</li>
            <li>因不可抗力、网络故障、系统维护等原因导致的服务中断，我们不承担责任。</li>
            <li>因您违反本协议或法律法规导致的任何损失，由您自行承担。</li>
            <li>AI 识别结果仅供参考，我们不保证识别内容在所有场景下的绝对准确性。</li>
          </ul>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </span>
            <h2 className={styles.h2}>协议更新</h2>
            <div className={styles.sectionLine} />
          </div>
          <p className={styles.text}>我们可能会不时更新本协议。更新后的协议将在本页面发布，并注明更新日期。继续使用我们的服务即表示您接受更新后的协议。</p>
        </section>

        <div className={styles.updatedAt}>最后更新：2026 年 4 月 1 日</div>
      </main>
      <HomeFooter />
    </div>
  )
}
