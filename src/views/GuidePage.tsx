import { useState } from 'react'
import { HomeNavbar } from '../ui/HomeNavbar'
import { HomeFooter } from '../ui/HomeFooter'
import { Background } from '../ui/Background'
import styles from './guidePage.module.css'

function Section({ id, title, icon, children }: { id?: string; title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className={styles.section} id={id}>
      <div className={styles.sectionHeader}>
        {icon && <span className={styles.sectionIcon}>{icon}</span>}
        <h2 className={styles.h2}>{title}</h2>
        <div className={styles.sectionLine} />
      </div>
      {children}
    </section>
  )
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={styles.subSection}>
      <h3 className={styles.h3}>{title}</h3>
      {children}
    </div>
  )
}

function Step({ num, title, children }: { num: number; title: string; children: React.ReactNode }) {
  return (
    <div className={styles.step}>
      <div className={styles.stepNum}>{num}</div>
      <div className={styles.stepBody}>
        <h4 className={styles.stepTitle}>{title}</h4>
        {children}
      </div>
    </div>
  )
}

function Note({ children }: { children: React.ReactNode }) {
  return <div className={styles.note}>{children}</div>
}

function Warn({ children }: { children: React.ReactNode }) {
  return <div className={styles.warn}>{children}</div>
}

function Kbd({ children }: { children: React.ReactNode }) {
  return <kbd className={styles.kbd}>{children}</kbd>
}

function PermCard({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className={styles.permCard}>
      <strong>{title}</strong>
      {lines.map((l, i) => <p key={i} className={styles.permText}>{l}</p>)}
    </div>
  )
}

const tocItems = [
  { id: 'features', label: '核心功能', icon: '⚡' },
  { id: 'install', label: '安装说明', icon: '📦' },
  { id: 'usage', label: '使用界面', icon: '🖥️' },
  { id: 'settings', label: '重要设置', icon: '⚙️' },
  { id: 'ending', label: '结语', icon: '🚀' },
]

export function GuidePage() {
  const [activeToc, setActiveToc] = useState('')

  return (
    <div className={styles.page}>
      <Background />
      <HomeNavbar />
      <header className={styles.header}>
        <div className={styles.headerBadge}>使用指南</div>
        <h1 className={styles.title}>LUCENCIA 使用说明</h1>
        <p className={styles.subtitle}>从安装到上手，一站式完整指南</p>
      </header>

      <nav className={styles.toc}>
        <div className={styles.tocTitle}>快速导航</div>
        {tocItems.map(item => (
          <a
            key={item.id}
            className={`${styles.tocLink} ${activeToc === item.id ? styles.tocActive : ''}`}
            href={`#${item.id}`}
            onClick={() => setActiveToc(item.id)}
          >
            <span className={styles.tocIcon}>{item.icon}</span>
            {item.label}
          </a>
        ))}
      </nav>

      <main className={styles.main}>
        <Section id="features" title="核心功能" icon={
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
        }>
          <SubSection title="强大的 AI 内核">
            <ul className={styles.list}>
              <li><strong>多模型支持：</strong>
                <ul className={styles.subList}>
                  <li>文本模型：默认搭载 Qwen3-Max，阿里云 Qwen3.5-Plus 暂不稳定</li>
                  <li>视觉模型：集成 Qwen3-VL-Plus，精准识别屏幕代码与图表</li>
                  <li>语音识别：采用 Qwen3-ASR-Flash，毫秒级实时语音转文字</li>
                </ul>
              </li>
              <li><strong>智能上下文管理：</strong>
                <ul className={styles.subList}>
                  <li>多轮对话：支持连续追问，AI 记住上下文</li>
                  <li>单轮模式：可关闭上下文记忆，解决 Token 消耗过快问题</li>
                </ul>
              </li>
            </ul>
          </SubSection>

          <SubSection title="多语种实时语音转写">
            <ul className={styles.list}>
              <li>🎤 <strong>实时语音捕获：</strong>毫秒级语音识别与转写，支持 50+ 语种</li>
              <li>📝 <strong>高精度识别：</strong>专业术语库定制，确保识别准确性</li>
              <li>📊 <strong>会议纪要生成：</strong>自动记录会议要点，生成结构化摘要</li>
              <li>👥 <strong>无障碍协作：</strong>为听障人士提供实时字幕支持</li>
            </ul>
          </SubSection>

          <SubSection title="便捷管理">
            <ul className={styles.list}>
              <li>💾 <strong>配置持久化：</strong>模型选择、Token 限制、API Key 等设置自动保存</li>
              <li>🔑 <strong>License Key 系统：</strong>一次激活，自动验证</li>
            </ul>
          </SubSection>
        </Section>

        <Section id="install" title="安装说明" icon={
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        }>
          <SubSection title="Windows 安装">
            <p className={styles.text}>双击 <code>Lucencia.Setup.exe</code> 安装包即可下载软件。</p>
            <Note>如果某个功能无法使用，请尝试安装 ffmpeg</Note>
          </SubSection>

          <SubSection title="macOS 安装">
            <Note>macOS 安装较为复杂，烦请按以下步骤操作。如有问题请联系管理员。</Note>

            <Step num={1} title="安装应用程序">
              <p className={styles.text}>双击 <code>Lucencia.dmg</code> 安装包开始安装。将应用图标拖拽到"应用程序"文件夹。</p>
            </Step>

            <Step num={2} title="移除隔离属性 (Quarantine)">
              <p className={styles.text}>苹果 Gatekeeper 会拦截未签名应用，需手动移除隔离属性：</p>
              <ol className={styles.orderedList}>
                <li>打开终端（Terminal），快捷键 <Kbd>Command (⌘)</Kbd> + <Kbd>空格键</Kbd> 搜索"终端"</li>
                <li>输入以下命令（<strong>末尾必须保留一个空格</strong>）：</li>
              </ol>
              <div className={styles.codeBlock}><code>xattr -rd com.apple.quarantine&nbsp;</code></div>
              <ol className={styles.orderedList} start={3}>
                <li>将 <code>Lucencia.app</code> 从 Finder 拖拽到终端窗口中</li>
                <li>按下 <Kbd>Enter</Kbd> 执行，然后重新双击打开应用即可</li>
              </ol>
              <Note>如果提示找不到应用，请确认路径是否正确，默认路径为 <code>/Applications/Lucencia.app</code></Note>
            </Step>

            <Step num={3} title="安装 ffmpeg">
              <p className={styles.text}>推荐使用 Homebrew 安装：<code>brew install ffmpeg</code></p>
            </Step>

            <Step num={4} title="配置系统权限">
              <div className={styles.permGrid}>
                <PermCard title="屏幕录制权限" lines={[
                  '"系统设置" → "隐私与安全性" → "屏幕录制"',
                  "点击左下角锁图标解锁",
                  "找到 Lucencia 并勾选"
                ]} />
                <PermCard title="麦克风权限" lines={[
                  '"系统设置" → "隐私与安全性" → "麦克风"',
                  "找到 Lucencia 并勾选"
                ]} />
                <PermCard title="辅助功能权限" lines={[
                  '"系统设置" → "隐私与安全性" → "辅助功能"',
                  "找到 Lucencia 并勾选"
                ]} />
              </div>
              <Warn>⚠️ 重要提示：设置权限后需要<strong>完全退出</strong>应用，然后重新打开才能生效</Warn>
            </Step>
          </SubSection>
        </Section>

        <Section id="usage" title="使用界面" icon={
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
        }>
          <SubSection title="文本输入">
            <p className={styles.text}>在文本框中输入问题或指令，按 <Kbd>Enter</Kbd> 键发送。Lucencia 会结合会议上下文为您提供精准回答。</p>
            <div className={styles.featureBox}>
              <strong>智能功能：</strong>
              <ul className={styles.list}>
                <li>使用 <Kbd>Ctrl</Kbd> + <Kbd>C</Kbd> 复制屏幕内容，Lucencia 会自动识别并解析</li>
                <li>使用 <Kbd>Ctrl</Kbd> + <Kbd>;</Kbd> 启用屏幕 OCR，自动提取并识别屏幕上的文字</li>
              </ul>
            </div>
          </SubSection>

          <SubSection title="屏幕识别">
            <p className={styles.text}>快捷键 <Kbd>Ctrl</Kbd>/<Kbd>Cmd</Kbd> + <Kbd>Enter</Kbd> 截取屏幕内容并自动识别。</p>
            <p className={styles.text}>系统会自动识别屏幕上的文字、图表和代码，并提供精准的识别结果。支持多种语言，包括中英日韩等主流语言。</p>
            <Note>提示：为获得最佳识别效果，建议将屏幕上的文字适当放大</Note>
          </SubSection>

          <SubSection title="系统音频录制">
            <p className={styles.text}>快捷键 <Kbd>Ctrl</Kbd>/<Kbd>Cmd</Kbd> + <Kbd>L</Kbd> 开始录制，再次按下停止录制。</p>
            <p className={styles.text}>Lucencia 可以捕获系统音频，实时转写会议中的语音内容。支持识别多种语言，自动区分说话人，并生成结构化的会议纪要。</p>
          </SubSection>

          <SubSection title="麦克风录制">
            <p className={styles.text}>快捷键 <Kbd>Ctrl</Kbd>/<Kbd>Cmd</Kbd> + <Kbd>K</Kbd> 开始录制麦克风声音，再次按下停止录制。</p>
            <p className={styles.text}>通过麦克风捕获您的语音，Lucencia 会实时转写并提供内容解析支持。适用于需要记录个人发言或进行语音输入的场景。</p>
          </SubSection>

          <SubSection title="智能屏幕解析">
            <p className={styles.text}>一键捕获屏幕内容，自动识别 PPT、图表和文档。</p>
            <p className={styles.text}>Lucencia 的智能屏幕解析功能可以识别屏幕上的文字、表格、图表等多种内容形式，并提供结构化的识别结果。支持实时更新，让您随时掌握屏幕上的最新信息。</p>
          </SubSection>

          <SubSection title="清理上下文">
            <p className={styles.text}>对话界面，快捷键 <Kbd>Ctrl</Kbd>/<Kbd>Cmd</Kbd> + <Kbd>'</Kbd> 清理上下文，防止上下文累积。</p>
            <p className={styles.text}>定期清理上下文可以释放内存，提高响应速度，并确保 AI 助手专注于当前对话内容。</p>
          </SubSection>
        </Section>

        <Section id="settings" title="重要设置" icon={
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
        }>
          <SubSection title="账号与计费">
            <p className={styles.text}>设置中第一栏可以查看用户余额。一次对话大约消耗 1,000 tokens，建议在重要会议前预留足够额度。</p>
            <p className={styles.text}>您可以在设置页面查看当前账户的 token 余额、使用历史和订阅状态。系统会在余额不足时提前提醒您充值。</p>
          </SubSection>

          <SubSection title="默认用户提示词">
            <p className={styles.text}>此处编辑用户提示词，针对不同的场景个性化编辑。</p>
            <p className={styles.text}>您可以为不同类型的会议（如技术讨论、商务谈判、项目汇报等）设置专属的提示词模板，让 AI 助手更好地理解您的需求并提供更精准的回答。</p>
          </SubSection>

          <SubSection title="界面设置 - 透明度与字体大小">
            <p className={styles.text}>调整悬浮窗的透明度和字体大小，以适应不同的使用环境和个人偏好。</p>
          </SubSection>

          <SubSection title="界面优化配置">
            <p className={styles.text}>根据您的使用习惯，调整界面显示效果和性能设置。包括窗口置顶、点击穿透、防录屏保护等高级功能。</p>
            <Note>Ctrl+M 穿透模式下，软件将不再显示在任务栏，但是此时仍然可以点击界面按钮。</Note>
          </SubSection>

          <SubSection title="模型设置">
            <ul className={styles.list}>
              <li>文本模型建议使用 <strong>Qwen3-Max</strong>，也可选择 Deepseek、Minimax 或 Kimi</li>
              <li>视觉模型建议使用默认的 <strong>Qwen3-VL-Plus</strong>，精准识别屏幕内容</li>
              <li>最大回复 Tokens 越大回复越长，响应速度越慢</li>
              <li>多轮对话默认开启，保持上下文连贯性</li>
              <li>智能追问可预判会议中的后续问题，按需开启</li>
            </ul>
          </SubSection>

          <SubSection title="更换 License Key">
            <p className={styles.text}>在设置页面可以更换您的 License Key。输入新的 License Key 后，系统会自动验证并激活。</p>
          </SubSection>
        </Section>

        <Section id="ending" title="结语" icon={
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        }>
          <div className={styles.ending}>
            <div className={styles.endingIcon}>🚀</div>
            <p className={styles.endingText}>让每一场会议都高效、无障碍、充满价值</p>
            <p className={styles.endingSub}>LUCENCIA 致力于提升信息获取效率，增强协作能力</p>
            <div className={styles.ctaWrap}>
              <a href="/lucencia" className={styles.ctaBtn}>返回首页</a>
            </div>
          </div>
        </Section>
      </main>
      <HomeFooter />
    </div>
  )
}
