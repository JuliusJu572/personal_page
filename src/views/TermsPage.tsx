import { Container } from '../ui/Container'
import { Card } from '../ui/Card'
import styles from './legalPage.module.css'

export function TermsPage() {
  return (
    <Container className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>用户服务协议</h1>
        <p className={styles.subtitle}>最后更新日期：2026年4月1日</p>
      </header>

      <Card className={styles.contentCard}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. 协议范围</h2>
          <p className={styles.text}>
            本协议是您与 Lucencia（以下简称"我们"）之间关于使用 Lucencia AI 会议协同助手服务的法律协议。请您仔细阅读并理解本协议的全部条款。
          </p>
          <p className={styles.text}>
            使用我们的服务即表示您同意受本协议的约束。如果您不同意本协议的任何条款，请勿使用我们的服务。
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>2. 服务描述</h2>
          <p className={styles.text}>
            Lucencia 是一款专为企业打造的 AI 会议协同工具，提供以下核心功能：
          </p>
          <ul className={styles.list}>
            <li>多语种实时语音翻译</li>
            <li>屏幕内容智能识别与翻译</li>
            <li>企业知识库集成与问答</li>
            <li>会议纪要自动生成</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3. 账户注册</h2>
          <p className={styles.text}>
            3.1 您需要注册账户才能使用我们的服务。注册时，您应提供真实、准确、完整的信息。
          </p>
          <p className={styles.text}>
            3.2 您应妥善保管账户信息和密码，因您保管不善导致的损失由您自行承担。
          </p>
          <p className={styles.text}>
            3.3 您不得将账户转让、出售或出借给他人使用。
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>4. 使用规范</h2>
          <p className={styles.text}>
            您在使用我们的服务时，应遵守以下规范：
          </p>
          <ul className={styles.list}>
            <li>遵守中华人民共和国相关法律法规</li>
            <li>尊重他人的知识产权和隐私权</li>
            <li>不利用服务从事违法违规活动</li>
            <li>不干扰或破坏服务的正常运行</li>
          </ul>

          <div className={styles.warningBox}>
            <p className={styles.text}>
              <strong>特别声明：</strong>此会议软件仅用于跨国会议等会议场景，严禁用于笔试、面试等场景。违反此规定使用本软件所产生的一切后果由用户自行承担。
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>5. 知识产权</h2>
          <p className={styles.text}>
            5.1 我们的服务及其所有内容（包括但不限于软件、技术、程序、界面设计、版面框架、数据资料等）的知识产权归我们所有。
          </p>
          <p className={styles.text}>
            5.2 未经我们书面许可，您不得复制、修改、传播或使用我们的知识产权。
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>6. 服务费用</h2>
          <p className={styles.text}>
            6.1 我们提供免费试用和付费订阅两种模式。具体收费标准以我们公布的价格为准。
          </p>
          <p className={styles.text}>
            6.2 付费服务的订阅周期、续费规则和退款政策将在购买页面明确说明。
          </p>
          <p className={styles.text}>
            6.3 我们保留调整服务价格的权利，价格调整前会提前通知用户。
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>7. 服务变更与终止</h2>
          <p className={styles.text}>
            7.1 我们有权根据业务发展需要，变更、暂停或终止部分或全部服务。
          </p>
          <p className={styles.text}>
            7.2 如您违反本协议，我们有权暂停或终止您的服务使用权限。
          </p>
          <p className={styles.text}>
            7.3 您可以随时停止使用我们的服务并注销账户。
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>8. 免责声明</h2>
          <p className={styles.text}>
            8.1 我们的服务按"现状"提供，我们不对服务的准确性、完整性、可靠性作任何明示或暗示的保证。
          </p>
          <p className={styles.text}>
            8.2 因不可抗力、网络故障、系统维护等原因导致的服务中断，我们不承担责任。
          </p>
          <p className={styles.text}>
            8.3 因您违反本协议或法律法规导致的任何损失，由您自行承担。
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>9. 争议解决</h2>
          <p className={styles.text}>
            9.1 本协议的签订、履行、解释及争议解决均适用中华人民共和国法律。
          </p>
          <p className={styles.text}>
            9.2 因本协议引起的任何争议，双方应友好协商解决；协商不成的，任何一方均可向我们所在地有管辖权的人民法院提起诉讼。
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>10. 协议更新</h2>
          <p className={styles.text}>
            我们可能会不时更新本协议。更新后的协议将在本页面发布，并注明更新日期。继续使用我们的服务即表示您接受更新后的协议。
          </p>
        </section>
      </Card>
    </Container>
  )
}