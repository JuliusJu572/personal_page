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
        <p className={styles.subtitle}>最后更新日期：2026年4月21日</p>
      </header>

      <main className={styles.main}>
        {/* 1. 协议范围 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </span>
            <h2 className={styles.h2}>协议范围</h2>
            <div className={styles.sectionLine} />
          </div>
          <p className={styles.text}>本《用户服务协议》（以下简称"本协议"）是您（以下简称"用户"或"您"）与<strong>上海岱达罗智信息科技有限公司</strong>（以下简称"我们"或"本公司"）之间关于使用 LUCENCIA AI 助手软件及相关服务（以下统称"本服务"）所订立的法律协议。</p>
          <p className={styles.text}>在您注册、登录、下载、安装或以任何方式使用本服务之前，请务必审慎阅读并充分理解本协议的全部条款，特别是<strong>免责声明、禁止行为、责任限制</strong>等加粗条款。如果您不同意本协议的任何内容，请立即停止使用本服务。</p>
          <p className={styles.text}>您通过网络页面点击确认、实际使用本服务等任何方式表示接受本协议的，即视为您已充分阅读、理解并同意接受本协议的约束。本协议自您确认接受之日起生效。</p>
        </section>

        {/* 2. 服务描述 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6v6H9z"/></svg>
            </span>
            <h2 className={styles.h2}>服务描述</h2>
            <div className={styles.sectionLine} />
          </div>
          <p className={styles.text}>LUCENCIA 是一款 AI 辅助工具，提供以下核心功能：</p>
          <ul className={styles.list}>
            <li><strong>多语种实时语音转写</strong> — 支持 50+ 语言的实时语音识别与文字转写</li>
            <li><strong>屏幕内容智能识别</strong> — 基于 OCR 与 AI 视觉模型的屏幕内容分析</li>
            <li><strong>AI 智能问答</strong> — 基于大语言模型的上下文理解与智能回答</li>
            <li><strong>知识库管理</strong> — 文档解析、知识卡片构建与智能检索</li>
          </ul>
          <p className={styles.text}>我们的服务可能会根据业务发展进行调整、升级或变更，具体功能以实际提供的版本为准。</p>
        </section>

        {/* 3. 账户注册与管理 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </span>
            <h2 className={styles.h2}>账户注册与管理</h2>
            <div className={styles.sectionLine} />
          </div>
          <ul className={styles.list}>
            <li>您需要注册账户方可使用本服务的全部功能。注册时，您应当提供真实、准确、完整的个人信息，并在信息变更时及时更新。</li>
            <li>您应当妥善保管账户凭证（包括但不限于用户名、密码、API Key），因您自身原因导致的账户信息泄露、被盗用或其他安全事件，由您自行承担全部责任。</li>
            <li>您不得将账户以任何方式转让、出售、出租、出借给第三方使用。多人共用同一账户的，我们有权视情节严重程度限制或封禁该账户。</li>
            <li>若您发现账户存在异常使用情况，应立即通知我们并配合处理。在我们采取措施之前，您需对账户下的一切活动负责。</li>
          </ul>
        </section>

        {/* 4. 禁止行为（重点） */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </span>
            <h2 className={styles.h2}>禁止行为</h2>
            <div className={styles.sectionLine} />
          </div>
          <p className={styles.text}>您在使用本服务时，必须遵守中华人民共和国相关法律法规，并承诺不从事以下行为：</p>

          <div className={styles.warningBox}>
            <p className={styles.warningTitle}>🚫 严禁将本产品用于以下场景</p>
            <ul className={styles.list}>
              <li><strong>各类考试作弊</strong> — 包括但不限于高考、中考、研究生入学考试、公务员考试、司法考试、注册会计师考试、医师资格考试、教师资格考试等国家级或地方级统一考试</li>
              <li><strong>职业资格考试作弊</strong> — 包括但不限于 PMP、CFA、CPA、FRM、ACCA、雅思、托福、GRE、GMAT、SAT 等国际/国内职业资格与语言能力测试</li>
              <li><strong>面试舞弊</strong> — 包括但不限于求职面试、升职面试、校园招聘面试、社会招聘面试中使用本产品获取不正当优势</li>
              <li><strong>在线测评作弊</strong> — 包括但不限于企业在线笔试、编程能力测试（如 LeetCode 竞赛、HackerRank 评估等）、人才测评、性格评估、心理测试等</li>
              <li><strong>学术不端</strong> — 包括但不限于课程考试、论文答辩、学位论文、学术竞赛、科研项目评审中利用本产品进行作弊或抄袭</li>
              <li><strong>竞赛作弊</strong> — 包括但不限于编程竞赛（ACM/ICPC、Codeforces 等）、数学竞赛、科创竞赛、辩论赛及其他明确禁止使用 AI 工具的赛事</li>
              <li><strong>认证考核作弊</strong> — 包括但不限于驾照考试、安全生产资格考试、特种作业操作证考试等行业认证考核</li>
              <li><strong>其他欺诈行为</strong> — 包括但不限于利用本产品冒充他人身份、进行虚假陈述、伪造工作成果、或在任何要求个人独立完成的评估中获取不正当协助</li>
            </ul>
          </div>

          <div className={styles.warningBox}>
            <p className={styles.warningTitle}>⚠️ 违规使用后果</p>
            <p className={styles.text}>用户违反上述禁止规定使用本产品所产生的<strong>一切法律后果</strong>（包括但不限于考试成绩取消、学位撤销、录用取消、行政处罚、民事赔偿、刑事责任等），<strong>由用户本人完全自行承担</strong>。本公司不承担任何连带责任或替代责任。</p>
            <p className={styles.text}>我们保留在发现或合理怀疑用户从事上述禁止行为时，<strong>立即终止服务、封禁账户且不退还已付费用</strong>的权利。</p>
          </div>

          <p className={styles.text}>此外，您还应遵守以下一般性使用规范：</p>
          <ul className={styles.list}>
            <li>不得利用本服务从事违法犯罪活动，包括但不限于诈骗、传播违禁信息、侵犯他人隐私</li>
            <li>不得利用本服务制作、传播、存储含有违法违规内容的信息</li>
            <li>不得对本服务进行反向工程、反编译、反汇编或其他试图获取源代码的行为</li>
            <li>不得通过技术手段干扰、破坏本服务的正常运行或绕过安全机制</li>
            <li>不得利用本服务进行任何侵犯他人知识产权、商业秘密或其他合法权益的行为</li>
            <li>不得超出合理使用范围恶意调用 API 接口，或利用自动化手段滥用服务资源</li>
          </ul>
        </section>

        {/* 5. 知识产权 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </span>
            <h2 className={styles.h2}>知识产权</h2>
            <div className={styles.sectionLine} />
          </div>
          <ul className={styles.list}>
            <li>本服务及其所有内容（包括但不限于软件代码、技术架构、用户界面设计、图标、文字、图像、商标、品牌标识等）的知识产权归本公司所有或经合法授权使用。</li>
            <li>未经本公司事先书面许可，您不得复制、修改、改编、翻译、传播、出版、展示或以其他方式使用本公司的知识产权。</li>
            <li>您在使用本服务过程中生成的 AI 回答内容，其知识产权按照适用法律法规确定归属。本公司不主张对 AI 生成内容享有知识产权。</li>
          </ul>
        </section>

        {/* 6. 服务费用与支付 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
            </span>
            <h2 className={styles.h2}>服务费用与支付</h2>
            <div className={styles.sectionLine} />
          </div>
          <ul className={styles.list}>
            <li>本服务提供免费试用与付费订阅两种模式。具体资费标准以官方网站或应用内公布的价格为准。</li>
            <li>付费服务的有效期、续费规则、退款政策等将在购买页面明确说明。付费后，除法律法规另有规定外，已支付的费用不予退还。</li>
            <li>我们保留根据运营成本和市场情况调整服务定价的权利，价格调整将提前以合理方式通知用户。调整后继续使用本服务即视为接受新的价格。</li>
            <li>因使用本服务所产生的第三方费用（如网络流量费、设备费用等）由您自行承担。</li>
          </ul>
        </section>

        {/* 7. 服务变更与中断 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
            </span>
            <h2 className={styles.h2}>服务变更与中断</h2>
            <div className={styles.sectionLine} />
          </div>
          <ul className={styles.list}>
            <li>我们有权根据业务发展需要，对本服务的功能、界面、定价等进行调整、升级或变更，并将以合理方式通知用户。</li>
            <li>因系统维护、技术升级或安全事件等原因，我们可能需要暂时中断部分或全部服务。我们将尽力提前通知，但不保证在所有情况下都能做到提前告知。</li>
            <li>因不可抗力（包括但不限于自然灾害、政府行为、网络攻击、电力故障等）导致的服务中断或终止，我们不承担任何责任。</li>
          </ul>
        </section>

        {/* 8. 免责声明与责任限制 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            </span>
            <h2 className={styles.h2}>免责声明与责任限制</h2>
            <div className={styles.sectionLine} />
          </div>
          <ul className={styles.list}>
            <li><strong>本服务按"现状"（AS IS）和"可得"（AS AVAILABLE）基础提供。</strong>我们不对服务的准确性、完整性、可靠性、持续性、及时性作任何明示或暗示的保证或承诺。</li>
            <li><strong>AI 生成的内容仅供参考，不构成专业建议。</strong>语音转写、OCR 识别、AI 问答等功能的输出结果可能存在偏差或错误，用户应自行核实并承担使用后果。</li>
            <li>因您违反本协议或适用法律法规导致的任何直接、间接、附带、特殊、惩罚性或后果性损失，由您自行承担。</li>
            <li>在适用法律允许的最大范围内，本公司对因使用或无法使用本服务而产生的任何损害赔偿责任，以您在发生损害前 12 个月内实际支付的服务费用为限。</li>
            <li>本公司不对任何第三方的行为、产品或服务承担责任，包括但不限于第三方 AI 模型提供商的服务质量或数据处理行为。</li>
          </ul>
        </section>

        {/* 9. 账户终止与注销 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </span>
            <h2 className={styles.h2}>账户终止与注销</h2>
            <div className={styles.sectionLine} />
          </div>
          <ul className={styles.list}>
            <li>您可以随时通过客户端设置或联系客服申请注销账户。账户注销后，我们将在合理时间内删除您的个人信息，但法律法规要求保留的信息除外。</li>
            <li>如您违反本协议的任何条款，我们有权立即暂停或终止您的账户及对本服务的访问，且无需事先通知，已付费用不予退还。</li>
            <li>账户终止后，您在本服务中的数据将按照我们的隐私政策进行处理。</li>
          </ul>
        </section>

        {/* 10. 适用法律与争议解决 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
            </span>
            <h2 className={styles.h2}>适用法律与争议解决</h2>
            <div className={styles.sectionLine} />
          </div>
          <ul className={styles.list}>
            <li>本协议的订立、效力、解释、履行、修改和终止均适用中华人民共和国法律（不包括港澳台地区法律）。</li>
            <li>因本协议引起的或与本协议有关的争议，双方应首先友好协商解决。协商不成的，任何一方有权向<strong>本公司所在地有管辖权的人民法院</strong>提起诉讼。</li>
          </ul>
        </section>

        {/* 11. 协议更新 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </span>
            <h2 className={styles.h2}>协议更新</h2>
            <div className={styles.sectionLine} />
          </div>
          <p className={styles.text}>我们可能会根据法律法规变化或业务调整不定期更新本协议。更新后的协议将在本页面发布并注明更新日期。对于重大变更，我们将通过应用内通知、弹窗提示或注册邮箱等方式提前告知。</p>
          <p className={styles.text}>协议更新后，您继续使用本服务即视为您已阅读并同意更新后的协议内容。如您不同意更新后的条款，请停止使用本服务。</p>
        </section>

        {/* 联系方式 */}
        <div className={styles.contactInfo}>
          <p className={styles.contactTitle}>联系我们</p>
          <p className={styles.contactText}>
            如您对本协议有任何疑问或建议，请通过以下方式联系我们：<br />
            <a className={styles.contactEmail} href="mailto:support@daedalustech.cn">support@daedalustech.cn</a>
          </p>
        </div>

        <div className={styles.updatedAt}>最后更新：2026 年 4 月 21 日 · 上海岱达罗智信息科技有限公司</div>
      </main>
      <HomeFooter />
    </div>
  )
}
