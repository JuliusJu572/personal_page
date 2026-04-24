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

function GuideFigure({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return (
    <figure className={styles.guideFigure}>
      <img className={styles.guideImage} src={src} alt={alt} loading="lazy" />
      <figcaption className={styles.guideCaption}>{caption}</figcaption>
    </figure>
  )
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
  { id: 'usage', label: '使用说明', icon: '🖥️' },
  { id: 'shortcuts', label: '快捷键总览', icon: '⌨️' },
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
              <p className={styles.text}>苹果 Gatekeeper 会拦截未签名应用，需手动移除隔离属性。以下两种方式任选其一：</p>
              <p className={styles.text}><strong>方式一：拖拽法</strong></p>
              <ol className={styles.orderedList}>
                <li>打开终端（Terminal），快捷键 <Kbd>Command (⌘)</Kbd> + <Kbd>空格键</Kbd> 搜索"终端"</li>
                <li>输入以下命令（<strong>末尾必须保留一个空格</strong>）：</li>
              </ol>
              <div className={styles.codeBlock}><code>sudo xattr -rd com.apple.quarantine&nbsp;</code></div>
              <ol className={styles.orderedList} start={3}>
                <li>将 <code>Lucencia.app</code> 从 Finder 拖拽到终端窗口中</li>
                <li>按下 <Kbd>Enter</Kbd>，输入电脑登录密码（输入时不会显示字符，这是正常现象），回车执行</li>
                <li>重新双击打开应用即可</li>
              </ol>
              <p className={styles.text}><strong>方式二：直接输入完整路径</strong></p>
              <p className={styles.text}>如果应用安装在默认位置，也可以直接复制粘贴以下命令一步完成：</p>
              <div className={styles.codeBlock}><code>sudo xattr -rd com.apple.quarantine /Applications/Lucencia.app</code></div>
              <p className={styles.text}>按下 <Kbd>Enter</Kbd> 后输入电脑登录密码即可。</p>
              <Note>sudo 命令需要输入你的 Mac 登录密码，输入过程中屏幕不会显示任何字符，直接输完回车即可。如果提示找不到应用，请确认路径是否正确。</Note>
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

        <Section id="usage" title="使用说明（含操作截图）" icon={
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
        }>
          <SubSection title="步骤 1：登录界面与入口定位">
            <p className={styles.text}>登录后，顶部右侧提供两个核心入口：<strong>文档解析</strong>与<strong>设置</strong>。建议首次使用时优先进入设置完成模型与快捷键确认，再开始会议。</p>
            <GuideFigure src="/guide-images/guide-login-entry.png" alt="登录界面：文档解析和设置入口" caption="登录页顶部右侧：文档解析入口 + 设置入口" />
            <div className={styles.featureBox}>
              <strong>此页建议完成：</strong>
              <ul className={styles.list}>
                <li>确认账号已登录且可以开始会话</li>
                <li>进入设置检查默认模型、截图模式、提示词模板</li>
                <li>熟悉主操作区按钮位置，减少会议中切换成本</li>
              </ul>
            </div>
          </SubSection>

          <SubSection title="步骤 2：主对话面板与穿透模式（Ctrl + M）">
            <p className={styles.text}>主面板包含清空会话、加载文档到上下文、截屏、OCR、系统音录制、麦克风录制、文本输入与发送/暂停。会议时建议将常用按钮保持在可见区域。</p>
            <GuideFigure src="/guide-images/guide-panel-shortcut.png" alt="主对话面板按钮说明" caption="主面板常用能力：文档、截图、OCR、录音、输入与发送" />
            <Note>按 <Kbd>Ctrl</Kbd> + <Kbd>M</Kbd> 可进入穿透模式：软件从任务栏隐藏，但悬浮区按钮仍可使用，适合避免遮挡演示内容。</Note>
            <ul className={styles.list}>
              <li><Kbd>Ctrl</Kbd> + <Kbd>C</Kbd>：监听剪切板并快速读取复制内容，用于追问或补充上下文</li>
              <li><Kbd>Ctrl</Kbd>/<Kbd>Cmd</Kbd> + <Kbd>Enter</Kbd>：执行截图识别</li>
              <li><Kbd>Ctrl</Kbd>/<Kbd>Cmd</Kbd> + <Kbd>L</Kbd>：系统音录制开/关</li>
              <li><Kbd>Ctrl</Kbd>/<Kbd>Cmd</Kbd> + <Kbd>K</Kbd>：麦克风录制开/关</li>
              <li><Kbd>Ctrl</Kbd>/<Kbd>Cmd</Kbd> + <Kbd>'</Kbd>：清理上下文</li>
            </ul>
          </SubSection>

          <SubSection title="步骤 3：模型选择与两点截图">
            <p className={styles.text}>在设置页中可配置文本模型与视觉模型，推荐默认组合先稳定使用，再按需求切换高能力模型。截图模式建议使用<strong>两点截图</strong>，在屏幕上点击两次即可完成局部区域框选。</p>
            <GuideFigure src="/guide-images/guide-model-screenshot.png" alt="模型选择与两点截图说明" caption="模型配置页：选择模型 + 两点截图（鼠标两次点击完成局部截图）" />
            <Warn>两点截图流程：第一次点击确定起点，第二次点击确定终点。为提升识别效果，建议覆盖完整题干与选项区域。</Warn>
          </SubSection>

          <SubSection title="步骤 4：提示词模板与自定义指令">
            <p className={styles.text}>设置中的提示词模板决定 AI 在不同场景下的行为方式。你可以先选模板，再在“自定义 AI 指令”中补充你的个人偏好或岗位上下文，形成稳定输出风格。</p>
            <GuideFigure src="/guide-images/guide-prompt-template.png" alt="提示词模板与自定义提示词" caption="模板决定基础风格，自定义指令用于强化场景化表达" />
            <div className={styles.featureBox}>
              <strong>推荐模板维护方式：</strong>
              <ul className={styles.list}>
                <li>先选择最接近的模板（如答辩/会议/讲解）</li>
                <li>将你的固定表达写成短句，避免过长提示词</li>
                <li>每次修改后做一次小样本验证，保留效果最佳版本</li>
              </ul>
            </div>
          </SubSection>

          <SubSection title="步骤 5：实时转录与连续监听（进阶版 / 高级版专享）">
            <p className={styles.text}>进阶版与高级版用户专享<strong>连续监听模式</strong>，支持同时捕获系统音频与麦克风双通道，实时转录并分段显示，随时选中片段交由 AI 分析——适合长时间会议与多轮对话场景。</p>
            <GuideFigure src="/guide-images/live-transcript.png" alt="实时转录与连续监听界面" caption="连续监听模式：双通道实时转录，双击片段即可获取 AI 回答" />
            <div className={styles.featureBox}>
              <strong>操作方式：</strong>
              <ul className={styles.list}>
                <li><strong>启动连续监听：</strong>在设置中开启「连续监听」，或在录音结束后自动进入（仅进阶版及以上可用）</li>
                <li><strong>双通道捕获：</strong>系统音频（对方说话）与麦克风（你的发言）分两列独立显示，互不干扰</li>
                <li><strong>单击片段：</strong>选中 / 取消选中某一段转录文本</li>
                <li><strong>Shift + 单击：</strong>多选模式，可同时选中多个片段</li>
                <li><strong>双击片段：</strong>直接将该段文字发送给 AI，立即获取分析回答</li>
                <li><strong>「发送」按钮：</strong>将当前选中的片段发送给 AI</li>
                <li><strong>「全部发送」按钮：</strong>一键将所有已捕获的转录内容发送给 AI</li>
                <li><strong>清除转录：</strong>按 <Kbd>Ctrl</Kbd> + <Kbd>Shift</Kbd> + <Kbd>L</Kbd> 清空当前转录记录</li>
                <li><strong>切换预设模式：</strong>按 <Kbd>Ctrl</Kbd> + <Kbd>I</Kbd> 在快速 / 性能模式间切换（仅进阶版及以上）</li>
              </ul>
            </div>
            <div className={styles.featureBox}>
              <strong>与普通版的区别：</strong>
              <ul className={styles.list}>
                <li><strong>普通版 / 免费版：</strong>仅支持单次录音转写——按 <Kbd>Ctrl</Kbd> + <Kbd>L</Kbd> 开始录制，再按一次停止并自动提交 AI。无法连续监听，无法分段选择</li>
                <li><strong>进阶版 / 高级版：</strong>支持连续监听模式，双通道同步采集，实时分段显示，可逐段选择或双击直接获取回答；同时解锁更多模型选项与更高 Token 上限</li>
              </ul>
            </div>
            <Note>连续监听模式下，系统会通过 VAD（语音活动检测）自动将音频流切分为独立片段，每段显示时间戳与时长，方便快速定位关键信息。</Note>
          </SubSection>
        </Section>

        <Section id="shortcuts" title="快捷键总览" icon={
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 8V5a2 2 0 114 0v3"/><rect x="4" y="8" width="16" height="12" rx="2"/><path d="M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/></svg>
        }>
          <SubSection title="完整快捷键列表（Windows）">
            <p className={styles.text}>以下为当前版本可用的全量快捷键。建议在会议前先熟悉窗口控制、采集与回放三类操作，实战时切换更顺手。</p>
            <div className={styles.shortcutTable}>
              <div className={styles.shortcutRow}>
                <div className={styles.shortcutAction}>窗口上移</div>
                <div className={styles.shortcutDesc}>将窗口向上移动</div>
                <div className={styles.shortcutKey}>Ctrl+Up</div>
              </div>
              <div className={styles.shortcutRow}>
                <div className={styles.shortcutAction}>窗口下移</div>
                <div className={styles.shortcutDesc}>将窗口向下移动</div>
                <div className={styles.shortcutKey}>Ctrl+Down</div>
              </div>
              <div className={styles.shortcutRow}>
                <div className={styles.shortcutAction}>窗口左移</div>
                <div className={styles.shortcutDesc}>将窗口向左移动</div>
                <div className={styles.shortcutKey}>Ctrl+Left</div>
              </div>
              <div className={styles.shortcutRow}>
                <div className={styles.shortcutAction}>窗口右移</div>
                <div className={styles.shortcutDesc}>将窗口向右移动</div>
                <div className={styles.shortcutKey}>Ctrl+Right</div>
              </div>
              <div className={styles.shortcutRow}>
                <div className={styles.shortcutAction}>切换窗口可见性</div>
                <div className={styles.shortcutDesc}>快速显示或隐藏窗口</div>
                <div className={styles.shortcutKey}>Ctrl+\</div>
              </div>
              <div className={styles.shortcutRow}>
                <div className={styles.shortcutAction}>切换穿透模式</div>
                <div className={styles.shortcutDesc}>启用或关闭窗口点击穿透</div>
                <div className={styles.shortcutKey}>Ctrl+M</div>
              </div>
              <div className={styles.shortcutRow}>
                <div className={styles.shortcutAction}>截图并追问下一步</div>
                <div className={styles.shortcutDesc}>截图后直接触发 AI 分析</div>
                <div className={styles.shortcutKey}>Ctrl+Enter</div>
              </div>
              <div className={styles.shortcutRow}>
                <div className={styles.shortcutAction}>上一条响应</div>
                <div className={styles.shortcutDesc}>查看上一条 AI 响应</div>
                <div className={styles.shortcutKey}>Ctrl+[</div>
              </div>
              <div className={styles.shortcutRow}>
                <div className={styles.shortcutAction}>下一条响应</div>
                <div className={styles.shortcutDesc}>查看下一条 AI 响应</div>
                <div className={styles.shortcutKey}>Ctrl+]</div>
              </div>
              <div className={styles.shortcutRow}>
                <div className={styles.shortcutAction}>向上滚动响应</div>
                <div className={styles.shortcutDesc}>滚动 AI 响应内容向上</div>
                <div className={styles.shortcutKey}>Ctrl+Shift+Up</div>
              </div>
              <div className={styles.shortcutRow}>
                <div className={styles.shortcutAction}>向下滚动响应</div>
                <div className={styles.shortcutDesc}>滚动 AI 响应内容向下</div>
                <div className={styles.shortcutKey}>Ctrl+Shift+Down</div>
              </div>
              <div className={styles.shortcutRow}>
                <div className={styles.shortcutAction}>实时转写</div>
                <div className={styles.shortcutDesc}>开始实时语音转写，再次按下停止</div>
                <div className={styles.shortcutKey}>Ctrl+L</div>
              </div>
              <div className={styles.shortcutRow}>
                <div className={styles.shortcutAction}>麦克风录制</div>
                <div className={styles.shortcutDesc}>录制麦克风声音并转写</div>
                <div className={styles.shortcutKey}>Ctrl+K</div>
              </div>
              <div className={styles.shortcutRow}>
                <div className={styles.shortcutAction}>删除历史对话</div>
                <div className={styles.shortcutDesc}>清空当前会话历史记录</div>
                <div className={styles.shortcutKey}>Ctrl+'</div>
              </div>
              <div className={styles.shortcutRow}>
                <div className={styles.shortcutAction}>OCR 识别并回答</div>
                <div className={styles.shortcutDesc}>截图后先 OCR，再交由模型回答</div>
                <div className={styles.shortcutKey}>Ctrl+;</div>
              </div>
              <div className={styles.shortcutRow}>
                <div className={styles.shortcutAction}>监听剪切板</div>
                <div className={styles.shortcutDesc}>读取最新复制内容并加入输入流程</div>
                <div className={styles.shortcutKey}>Ctrl+C</div>
              </div>
              <div className={styles.shortcutRow}>
                <div className={styles.shortcutAction}>清除实时转录</div>
                <div className={styles.shortcutDesc}>清空当前连续监听的转录记录</div>
                <div className={styles.shortcutKey}>Ctrl+Shift+L</div>
              </div>
              <div className={styles.shortcutRow}>
                <div className={styles.shortcutAction}>切换预设模式</div>
                <div className={styles.shortcutDesc}>在快速/性能模式间切换（进阶版+）</div>
                <div className={styles.shortcutKey}>Ctrl+I</div>
              </div>
            </div>
            <Note>建议先记住 <strong>Ctrl+M、Ctrl+Enter、Ctrl+L、Ctrl+K、Ctrl+C</strong> 这 5 个高频键位，能覆盖大多数会议场景。</Note>
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
            <p className={styles.text}>此处用于设置“模板 + 自定义指令”的最终提示词效果，建议按场景维护多套版本，例如技术答辩、项目周会、客户沟通。</p>
            <p className={styles.text}>当输出风格不稳定时，优先缩短自定义指令并提高约束清晰度（角色、目标、输出格式），能明显提升回答一致性。</p>
          </SubSection>

          <SubSection title="界面设置 - 透明度与字体大小">
            <p className={styles.text}>调整悬浮窗的透明度和字体大小，以适应不同的使用环境和个人偏好。</p>
          </SubSection>

          <SubSection title="界面优化配置">
            <p className={styles.text}>根据您的使用习惯，调整界面显示效果和性能设置。包括窗口置顶、点击穿透、防录屏保护等高级功能。</p>
            <Note><Kbd>Ctrl</Kbd> + <Kbd>M</Kbd> 穿透模式下，软件将不再显示在任务栏，但悬浮区按钮依然可点击使用。</Note>
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
