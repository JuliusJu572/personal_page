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
        <p className={styles.subtitle}>最后更新日期：2026年4月21日</p>
      </header>

      <main className={styles.main}>
        {/* 1. 引言 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </span>
            <h2 className={styles.h2}>引言</h2>
            <div className={styles.sectionLine} />
          </div>
          <p className={styles.text}><strong>上海岱达罗智信息科技有限公司</strong>（以下简称"我们"或"本公司"）深知个人信息对您的重要性，我们将按照法律法规的要求，采取相应安全保护措施，尽力保护您的个人信息安全可控。</p>
          <p className={styles.text}>本隐私政策适用于您通过 LUCENCIA 客户端、官方网站及相关服务（以下统称"本服务"）提供的个人信息的收集、使用、存储、共享和保护。请您在使用本服务前仔细阅读并理解本政策。</p>
        </section>

        {/* 2. 我们收集的信息 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            </span>
            <h2 className={styles.h2}>我们收集的信息</h2>
            <div className={styles.sectionLine} />
          </div>
          <p className={styles.text}>我们仅收集提供服务所必需的最少信息，具体包括：</p>
          <ul className={styles.list}>
            <li><strong>账户信息：</strong>注册时提供的用户名、邮箱地址、手机号码（如适用）及加密存储的登录密码</li>
            <li><strong>服务用量数据：</strong>API 调用次数、Token 消耗量、功能使用频率等匿名统计数据，用于计费和服务优化</li>
            <li><strong>设备信息：</strong>操作系统类型及版本、应用版本号，仅用于兼容性适配和问题排查</li>
            <li><strong>支付信息：</strong>订单号、支付金额、支付时间等交易记录（支付操作由第三方支付平台处理，我们不存储银行卡号或支付密码）</li>
          </ul>

          <div className={styles.highlightBox}>
            <p className={styles.highlightTitle}>🔒 核心隐私承诺</p>
            <p className={styles.text}><strong>我们的服务器仅保留账户信息和服务用量数据。</strong>我们<strong>不存储</strong>任何用户的对话记录、语音转写内容、截图图像、OCR 识别结果、AI 问答内容或上传的任何文件。</p>
            <p className={styles.text}>所有 AI 交互内容（包括语音输入、屏幕截图、文字对话等）均在您的本地设备上处理或直接发送至第三方 AI 模型提供商。这些内容<strong>不经过我们的服务器中转，不被我们记录或存储</strong>。</p>
          </div>
        </section>

        {/* 3. 信息的使用目的 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </span>
            <h2 className={styles.h2}>信息的使用目的</h2>
            <div className={styles.sectionLine} />
          </div>
          <p className={styles.text}>我们收集的信息仅用于以下明确目的：</p>
          <ul className={styles.list}>
            <li><strong>提供核心服务：</strong>验证身份、管理账户、处理订阅和计费</li>
            <li><strong>服务优化：</strong>分析匿名使用趋势、诊断技术问题、改进产品体验</li>
            <li><strong>安全保障：</strong>检测异常行为、防止欺诈、保护系统安全</li>
            <li><strong>合规义务：</strong>配合法律法规要求的信息保存和披露义务</li>
            <li><strong>客户支持：</strong>响应您的咨询、投诉和技术支持请求</li>
          </ul>
          <p className={styles.text}>我们<strong>不会</strong>将您的个人信息用于用户画像、精准广告投放或任何与上述目的无关的商业用途。</p>
        </section>

        {/* 4. 数据存储与安全 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </span>
            <h2 className={styles.h2}>数据存储与安全</h2>
            <div className={styles.sectionLine} />
          </div>
          <p className={styles.text}>我们采取业界标准的安全措施保护您的信息：</p>
          <ul className={styles.list}>
            <li><strong>传输加密：</strong>所有网络通信均采用 TLS 加密协议，防止数据在传输过程中被窃取或篡改</li>
            <li><strong>密码安全：</strong>用户密码使用 bcrypt 算法进行单向哈希处理后存储，即使数据库泄露也无法还原明文密码</li>
            <li><strong>密钥加密：</strong>API Key 和 License Key 在客户端使用系统级安全存储（如 macOS Keychain、Windows Credential Manager）加密保存</li>
            <li><strong>服务器安全：</strong>服务器部署于经认证的云计算数据中心，具备完善的物理安全和网络安全防护措施</li>
            <li><strong>访问控制：</strong>严格限制内部人员对用户数据的访问权限，遵循最小权限原则</li>
            <li><strong>本地数据：</strong>客户端本地存储的配置数据（如 License Key）使用 Electron safeStorage API 加密，跟随操作系统密钥保护</li>
          </ul>
        </section>

        {/* 5. 数据保留期限 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </span>
            <h2 className={styles.h2}>数据保留期限</h2>
            <div className={styles.sectionLine} />
          </div>
          <ul className={styles.list}>
            <li><strong>账户信息：</strong>在您的账户存续期间持续保留，账户注销后将在 30 个自然日内删除</li>
            <li><strong>用量数据：</strong>保留至相关计费周期结束后 90 天，之后匿名化处理或删除</li>
            <li><strong>交易记录：</strong>根据《电子商务法》和税务法规要求，保留不少于 3 年</li>
            <li><strong>对话内容：</strong>不适用 — 我们不收集、不存储任何对话内容</li>
          </ul>
        </section>

        {/* 6. 用户权利 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
            </span>
            <h2 className={styles.h2}>用户权利</h2>
            <div className={styles.sectionLine} />
          </div>
          <p className={styles.text}>根据《个人信息保护法》等相关法律法规，您享有以下权利：</p>
          <ul className={styles.list}>
            <li><strong>知情权：</strong>您有权了解我们收集、使用您个人信息的规则，本政策即为履行该义务</li>
            <li><strong>访问权：</strong>您可以随时登录账户查看我们收集的关于您的账户信息和用量数据</li>
            <li><strong>更正权：</strong>您有权要求更正不准确或不完整的个人信息</li>
            <li><strong>删除权：</strong>您可以申请注销账户并永久删除您的所有个人数据</li>
            <li><strong>导出权：</strong>您可以申请导出您的个人信息副本</li>
            <li><strong>撤回同意权：</strong>您可以随时撤回对本隐私政策的同意（撤回后将无法继续使用本服务）</li>
            <li><strong>投诉权：</strong>如您认为我们侵犯了您的个人信息权益，您有权向有关监管部门投诉举报</li>
          </ul>
          <p className={styles.text}>行使上述权利，请发送邮件至 <a href="mailto:support@daedalustech.cn">support@daedalustech.cn</a>，我们将在 15 个工作日内核实并处理您的请求。</p>
        </section>

        {/* 7. Cookie 与追踪 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            </span>
            <h2 className={styles.h2}>Cookie 与追踪技术</h2>
            <div className={styles.sectionLine} />
          </div>
          <ul className={styles.list}>
            <li>LUCENCIA 桌面客户端<strong>不使用</strong>任何 Cookie 或第三方追踪技术</li>
            <li>官方网站仅使用必要的会话 Cookie（Session Cookie）用于维持登录状态，不使用任何第三方分析或广告 Cookie</li>
            <li>我们<strong>不与</strong>任何第三方广告网络、数据经纪商或分析服务共享用户数据</li>
            <li>我们不进行跨站追踪或用户行为画像</li>
          </ul>
        </section>

        {/* 8. 第三方服务 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </span>
            <h2 className={styles.h2}>第三方服务</h2>
            <div className={styles.sectionLine} />
          </div>
          <p className={styles.text}>本服务的 AI 能力依赖以下第三方模型服务提供商：</p>
          <ul className={styles.list}>
            <li><strong>阿里云通义千问（Qwen）</strong> — 文本理解与生成</li>
            <li><strong>阿里云视觉模型（Qwen-VL）</strong> — 图像识别与内容分析</li>
            <li><strong>阿里云语音识别（Qwen-ASR）</strong> — 实时语音转文字</li>
            <li><strong>其他可选模型</strong> — 根据用户配置，可能使用 OpenRouter 等第三方模型服务</li>
          </ul>
          <p className={styles.text}>当您使用 AI 功能时，相关输入内容（如语音、截图、文字）将由客户端<strong>直接发送至</strong>上述第三方模型服务商处理，<strong>不经过我们的服务器</strong>。这些第三方服务受其各自隐私政策约束，我们建议您查阅其相关政策。</p>
          <p className={styles.text}>支付服务由第三方支付平台提供（如支付宝），支付过程中的信息由支付平台独立处理，我们仅接收支付结果通知。</p>
        </section>

        {/* 9. 信息共享与披露 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
            </span>
            <h2 className={styles.h2}>信息共享与披露</h2>
            <div className={styles.sectionLine} />
          </div>
          <p className={styles.text}>我们承诺不会主动将您的个人信息出售、出租或交换给任何第三方。仅在以下情形下，我们可能共享或披露您的信息：</p>
          <ul className={styles.list}>
            <li><strong>获得您的明确同意：</strong>在获得您的明确授权后共享</li>
            <li><strong>法律法规要求：</strong>根据适用的法律法规、法律程序、政府主管部门的强制性要求</li>
            <li><strong>保护权益：</strong>为保护本公司、用户或公众的人身安全、财产安全或其他合法权益所合理必需</li>
            <li><strong>企业交易：</strong>在涉及合并、收购、资产转让等交易中，我们将确保信息接收方继续遵守本隐私政策的约束</li>
          </ul>
        </section>

        {/* 10. 未成年人保护 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
            </span>
            <h2 className={styles.h2}>未成年人保护</h2>
            <div className={styles.sectionLine} />
          </div>
          <p className={styles.text}>本服务不面向不满 14 周岁的未成年人。我们不会故意收集不满 14 周岁未成年人的个人信息。如果您是未满 14 周岁未成年人的监护人，发现被监护人在未经您同意的情况下使用了本服务，请联系我们，我们将尽快删除相关信息。</p>
          <p className={styles.text}>已满 14 周岁但未满 18 周岁的未成年用户，应在监护人的指导和同意下使用本服务。</p>
        </section>

        {/* 11. 政策更新 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </span>
            <h2 className={styles.h2}>政策更新</h2>
            <div className={styles.sectionLine} />
          </div>
          <p className={styles.text}>我们可能会根据法律法规变化、业务调整或安全需要不定期更新本隐私政策。更新后的政策将在本页面发布并注明更新日期。</p>
          <p className={styles.text}>对于重大变更（如收集信息范围扩大、使用目的变更、第三方共享规则调整等），我们将通过应用内弹窗通知、官方网站公告或注册邮箱等显著方式提前告知。您继续使用本服务即视为接受更新后的隐私政策。</p>
        </section>

        {/* 联系方式 */}
        <div className={styles.contactInfo}>
          <p className={styles.contactTitle}>联系我们</p>
          <p className={styles.contactText}>
            如您对本隐私政策有任何疑问、意见或投诉，或希望行使个人信息权利，请通过以下方式联系我们：<br />
            <a className={styles.contactEmail} href="mailto:support@daedalustech.cn">support@daedalustech.cn</a>
          </p>
        </div>

        <div className={styles.updatedAt}>最后更新：2026 年 4 月 21 日 · 上海岱达罗智信息科技有限公司</div>
      </main>
      <HomeFooter />
    </div>
  )
}
