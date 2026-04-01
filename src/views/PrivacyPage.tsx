import { Container } from '../ui/Container'
import { Card } from '../ui/Card'
import styles from './legalPage.module.css'

export function PrivacyPage() {
  return (
    <Container className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>隐私政策</h1>
        <p className={styles.subtitle}>最后更新日期：2026年4月1日</p>
      </header>

      <Card className={styles.contentCard}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. 引言</h2>
          <p className={styles.text}>
            Lucencia（以下简称"我们"）深知隐私对您的重要性，并致力于保护您的个人信息。本隐私政策旨在向您说明我们如何收集、使用、存储和保护您的信息。
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>2. 信息收集</h2>
          <p className={styles.text}>
            <strong>2.1 您主动提供的信息</strong>
          </p>
          <ul className={styles.list}>
            <li>账户信息：用户名、邮箱地址、密码</li>
            <li>支付信息：支付方式、账单地址</li>
            <li>通信信息：您通过客服或反馈渠道提供的信息</li>
          </ul>

          <p className={styles.text}>
            <strong>2.2 自动收集的信息</strong>
          </p>
          <ul className={styles.list}>
            <li>设备信息：设备型号、操作系统版本、唯一设备标识符</li>
            <li>日志信息：IP地址、访问时间、使用时长</li>
            <li>使用数据：功能使用频率、错误日志</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3. 音频与屏幕数据处理</h2>
          <div className={styles.highlightBox}>
            <p className={styles.text}>
              <strong>重要说明：</strong>Lucencia 的音频捕获与屏幕识别功能仅在用户主动开启会议模式时运行。所有数据仅作即时处理，不进行云端持久化存储，充分保障企业机密与个人隐私。
            </p>
          </div>
          <p className={styles.text}>
            具体而言：
          </p>
          <ul className={styles.list}>
            <li>音频数据：仅在用户主动开启录音功能时捕获，用于实时语音转写和翻译</li>
            <li>屏幕数据：仅在用户主动触发屏幕捕获时获取，用于OCR识别和翻译</li>
            <li>处理方式：所有数据在本地设备或临时内存中处理，处理完成后立即删除</li>
            <li>存储策略：不进行云端持久化存储，不保留历史记录</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>4. 信息使用</h2>
          <p className={styles.text}>
            我们使用收集的信息用于：
          </p>
          <ul className={styles.list}>
            <li>提供、维护和改进我们的服务</li>
            <li>处理您的交易和发送相关通知</li>
            <li>发送技术通知、更新、安全警报</li>
            <li>响应您的评论、问题和客户服务请求</li>
            <li>监控和分析使用趋势，改善用户体验</li>
            <li>检测、调查和防止欺诈行为</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>5. 信息共享</h2>
          <p className={styles.text}>
            我们不会将您的个人信息出售给第三方。仅在以下情况下共享您的信息：
          </p>
          <ul className={styles.list}>
            <li>经您明确同意</li>
            <li>为遵守法律法规、法律程序或政府要求</li>
            <li>为保护我们的权利、财产或安全</li>
            <li>与为我们提供服务的合作伙伴（如支付处理商）</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>6. 数据安全</h2>
          <p className={styles.text}>
            我们采取合理的技术和管理措施来保护您的个人信息，包括：
          </p>
          <ul className={styles.list}>
            <li>使用加密技术保护数据传输</li>
            <li>实施访问控制和权限管理</li>
            <li>定期进行安全审计和漏洞扫描</li>
            <li>对员工进行隐私保护培训</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>7. 您的权利</h2>
          <p className={styles.text}>
            根据适用法律，您可能享有以下权利：
          </p>
          <ul className={styles.list}>
            <li>访问、更正或删除您的个人信息</li>
            <li>限制或反对处理您的个人信息</li>
            <li>数据可携带性</li>
            <li>撤回同意</li>
          </ul>
          <p className={styles.text}>
            如需行使这些权利，请通过 support@lucencia.com 与我们联系。
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>8. 使用限制</h2>
          <div className={styles.warningBox}>
            <p className={styles.text}>
              <strong>重要声明：</strong>此会议软件仅用于跨国会议等会议场景，严禁用于笔试、面试等场景，请合理使用，否则后果自负。
            </p>
          </div>
          <p className={styles.text}>
            您同意不会将我们的服务用于：
          </p>
          <ul className={styles.list}>
            <li>任何形式的考试、面试作弊</li>
            <li>侵犯他人隐私或知识产权</li>
            <li>违反法律法规的活动</li>
            <li>干扰或破坏服务的正常运行</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>9. 儿童隐私</h2>
          <p className={styles.text}>
            我们的服务不面向16岁以下的儿童。我们不会故意收集儿童的个人信息。如果我们发现收集了儿童的个人信息，我们会立即删除。
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>10. 政策更新</h2>
          <p className={styles.text}>
            我们可能会不时更新本隐私政策。更新后的政策将在本页面发布，并注明更新日期。重大变更时，我们会通过应用内通知或电子邮件通知您。
          </p>
        </section>

      </Card>
    </Container>
  )
}