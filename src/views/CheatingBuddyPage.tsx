import { useEffect, useMemo, useRef, useState } from 'react'
import { projects } from '../config/projects'
import type { GitHubRelease } from '../lib/github'
import { fetchLatestRelease, pickReleaseAsset } from '../lib/github'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Container } from '../ui/Container'
import styles from './cheatingBuddyPage.module.css'

type ReleaseState =
  | { status: 'idle' | 'loading' }
  | { status: 'loaded'; release: GitHubRelease }
  | { status: 'error'; message: string }

function formatDate(iso: string) {
  const d = new Date(iso)
  return Number.isNaN(d.valueOf()) ? iso : d.toLocaleDateString()
}

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes)) return ''
  const units = ['B', 'KB', 'MB', 'GB']
  let v = bytes
  let i = 0
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024
    i += 1
  }
  return `${v.toFixed(v >= 10 || i === 0 ? 0 : 1)} ${units[i]}`
}

function useLatestRelease() {
  const [state, setState] = useState<ReleaseState>({ status: 'loading' })

  useEffect(() => {
    let alive = true
    fetchLatestRelease({ owner: projects.cheatingBuddy.owner, repo: projects.cheatingBuddy.repo })
      .then((release) => {
        if (!alive) return
        setState({ status: 'loaded', release })
      })
      .catch((err: unknown) => {
        if (!alive) return
        const message = err instanceof Error ? err.message : '无法获取最新 Release'
        setState({ status: 'error', message })
      })
    return () => {
      alive = false
    }
  }, [])

  return state
}

function FocusSwitchTest() {
  const [isRunning, setIsRunning] = useState(false)
  const [events, setEvents] = useState<Array<{ t: number; type: string; detail?: string }>>([])
  const [startedAt, setStartedAt] = useState<number | null>(null)

  useEffect(() => {
    if (!isRunning) return
    const push = (type: string, detail?: string) => {
      setEvents((prev) => [{ t: Date.now(), type, detail }, ...prev].slice(0, 200))
    }

    const onVisibility = () => push('visibilitychange', document.visibilityState)
    const onBlur = () => push('blur')
    const onFocus = () => push('focus')

    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('blur', onBlur)
    window.addEventListener('focus', onFocus)

    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('blur', onBlur)
      window.removeEventListener('focus', onFocus)
    }
  }, [isRunning])

  return (
    <div className={styles.tool}>
      <div className={styles.toolTop}>
        <div className={styles.toolTitle}>切屏检测（焦点/可见性）</div>
        <div className={styles.toolActions}>
          <Button
            variant={isRunning ? 'secondary' : 'primary'}
            onClick={() => {
              if (isRunning) {
                setIsRunning(false)
                setStartedAt(null)
                return
              }
              const now = Date.now()
              setStartedAt(now)
              setEvents([{ t: now, type: 'start' }])
              setIsRunning(true)
            }}
          >
            {isRunning ? '停止' : '开始检测'}
          </Button>
          <Button variant="ghost" onClick={() => setEvents([])} disabled={!events.length}>
            清空
          </Button>
        </div>
      </div>
      <p className={styles.toolDesc}>
        用于验证常见操作（Alt+Tab、点击其它窗口、切换桌面/标签页）是否会触发焦点或可见性变化，帮助你预判笔试/面试平台的切屏检测风险。
      </p>
      <div className={styles.toolLog} role="log" aria-label="检测日志">
        {events.length === 0 ? (
          <div className={styles.toolEmpty}>点击“开始检测”后尝试切换窗口/标签页。</div>
        ) : (
          events.map((e, idx) => (
            <div key={`${e.t}-${idx}`} className={styles.toolRow}>
              <span className={styles.toolTime}>
                {startedAt ? `${Math.max(0, Math.round((e.t - startedAt) / 1000))}s` : ''}
              </span>
              <span className={styles.toolType}>{e.type}</span>
              <span className={styles.toolDetail}>{e.detail ?? ''}</span>
            </div>
          ))
        )}
      </div>
      <div className={styles.toolHint}>
        参考灵感：<a href={projects.gankInterview.toolsUrl} target="_blank" rel="noreferrer">tools.gankinterview.cn</a>
      </div>
    </div>
  )
}

function ScreenShareVisibilityTest() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [status, setStatus] = useState<'idle' | 'running' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string>('')

  const stopTracks = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
  }

  const stop = () => {
    stopTracks()
    setStatus('idle')
  }

  useEffect(() => () => stopTracks(), [])

  return (
    <div className={styles.tool}>
      <div className={styles.toolTop}>
        <div className={styles.toolTitle}>视频共享可见检测（屏幕采集预览）</div>
        <div className={styles.toolActions}>
          <Button
            variant={status === 'running' ? 'secondary' : 'primary'}
            onClick={async () => {
              if (status === 'running') {
                stop()
                return
              }
              setErrorMsg('')
              try {
                const stream = await navigator.mediaDevices.getDisplayMedia({
                  video: { frameRate: 30 },
                  audio: false,
                })
                streamRef.current = stream
                if (videoRef.current) videoRef.current.srcObject = stream
                setStatus('running')
              } catch (err: unknown) {
                const msg = err instanceof Error ? err.message : '无法获取屏幕共享权限'
                setErrorMsg(msg)
                setStatus('error')
              }
            }}
          >
            {status === 'running' ? '停止预览' : '开始预览'}
          </Button>
        </div>
      </div>
      <p className={styles.toolDesc}>
        选择“整个屏幕”共享后，你会看到采集到的画面。可在同时打开 Cheating Buddy 主程序时观察：屏幕采集里是否会出现悬浮窗/提示等内容。
      </p>
      {status === 'error' ? <div className={styles.toolError}>{errorMsg}</div> : null}
      <div className={styles.videoBox}>
        <video ref={videoRef} autoPlay playsInline muted className={styles.video} />
        {status !== 'running' ? <div className={styles.videoMask}>点击“开始预览”并选择共享目标</div> : null}
      </div>
      <div className={styles.toolHint}>
        参考灵感：<a href={projects.gankInterview.toolsUrl} target="_blank" rel="noreferrer">tools.gankinterview.cn</a>
      </div>
    </div>
  )
}

function KeyboardEventTest() {
  const [isRunning, setIsRunning] = useState(false)
  const [items, setItems] = useState<
    Array<{ t: number; type: 'keydown' | 'keyup'; key: string; code: string; meta: string }>
  >([])

  useEffect(() => {
    if (!isRunning) return
    const push = (e: KeyboardEvent, type: 'keydown' | 'keyup') => {
      const meta = [
        e.ctrlKey ? 'Ctrl' : null,
        e.altKey ? 'Alt' : null,
        e.shiftKey ? 'Shift' : null,
        e.metaKey ? 'Meta' : null,
      ]
        .filter(Boolean)
        .join('+')
      setItems((prev) => [{ t: Date.now(), type, key: e.key, code: e.code, meta }, ...prev].slice(0, 200))
    }

    const onDown = (e: KeyboardEvent) => push(e, 'keydown')
    const onUp = (e: KeyboardEvent) => push(e, 'keyup')
    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    return () => {
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
    }
  }, [isRunning])

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `keyboard-events-${new Date().toISOString().slice(0, 19).replaceAll(':', '-')}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className={styles.tool}>
      <div className={styles.toolTop}>
        <div className={styles.toolTitle}>键盘事件检测（按键可观测性）</div>
        <div className={styles.toolActions}>
          <Button
            variant={isRunning ? 'secondary' : 'primary'}
            onClick={() => {
              setItems([])
              setIsRunning((v) => !v)
            }}
          >
            {isRunning ? '停止' : '开始检测'}
          </Button>
          <Button variant="ghost" onClick={() => setItems([])} disabled={!items.length}>
            清空
          </Button>
          <Button variant="ghost" onClick={exportJson} disabled={!items.length}>
            导出
          </Button>
        </div>
      </div>
      <p className={styles.toolDesc}>
        用于观察快捷键组合是否会暴露明显的按键特征（例如 Ctrl/Alt/Meta 组合），帮助你在不同平台上选择更稳妥的交互方式。
      </p>
      <div className={styles.toolLog} role="log" aria-label="按键日志">
        {items.length === 0 ? (
          <div className={styles.toolEmpty}>点击“开始检测”后按下任意按键或组合键。</div>
        ) : (
          items.map((e, idx) => (
            <div key={`${e.t}-${idx}`} className={styles.toolRow}>
              <span className={styles.toolTime}>{new Date(e.t).toLocaleTimeString()}</span>
              <span className={styles.toolType}>{e.type}</span>
              <span className={styles.toolDetail}>
                {e.meta ? `${e.meta} + ` : ''}
                {e.key} ({e.code})
              </span>
            </div>
          ))
        )}
      </div>
      <div className={styles.toolHint}>
        参考灵感：<a href={projects.gankInterview.toolsUrl} target="_blank" rel="noreferrer">tools.gankinterview.cn</a>
      </div>
    </div>
  )
}

function VisibilityConceptDemo() {
  const [pct, setPct] = useState(55)
  return (
    <div className={styles.demo}>
      <div className={styles.demoTop}>
        <div className={styles.demoTitle}>“双视角”概念演示（类比 gankinterview 的交互）</div>
        <div className={styles.demoRight}>
          <span className={styles.demoLabel}>切换</span>
          <input
            className={styles.demoRange}
            type="range"
            min={0}
            max={100}
            value={pct}
            onChange={(e) => setPct(Number(e.target.value))}
            aria-label="视角切换滑块"
          />
        </div>
      </div>
      <div className={styles.demoBox} style={{ ['--pct' as string]: `${pct}%` }}>
        <div className={styles.demoPanelA}>
          <div className={styles.demoPanelTitle}>面试者视角（你看到的辅助信息）</div>
          <div className={styles.demoPanelBody}>
            <div className={styles.demoLine} />
            <div className={styles.demoLine} />
            <div className={styles.demoLine} />
            <div className={styles.demoHint}>示例：答案要点、关键词提醒、截图解析结果等</div>
          </div>
        </div>
        <div className={styles.demoPanelB}>
          <div className={styles.demoPanelTitle}>面试官视角（对方看到的画面）</div>
          <div className={styles.demoPanelBody}>
            <div className={styles.demoLineSoft} />
            <div className={styles.demoLineSoft} />
            <div className={styles.demoLineSoft} />
            <div className={styles.demoHint}>示例：正常屏幕共享 / 正常对话，不暴露辅助内容</div>
          </div>
        </div>
        <div className={styles.demoDivider} aria-hidden="true" />
      </div>
      <p className={styles.demoDesc}>
        这个演示并不代表真实效果，只用于说明“辅助信息”和“对方画面”通常应当被严格区分。实际可见性取决于操作系统版本、屏幕共享方式与目标平台的采集策略。
      </p>
    </div>
  )
}

const scenarios = [
  {
    key: 'video',
    name: '视频面试',
    desc: '面试官语音 + 屏幕共享并存，强调“实时 + 低干扰”。',
    tips: ['先做“视频共享可见检测”', '悬浮窗位置尽量贴近摄像头区域以减少眼神漂移', '避免高频切换窗口'],
  },
  {
    key: 'coding',
    name: '在线笔试',
    desc: '常见平台包含焦点/切屏检测，强调“稳定操作习惯”。',
    tips: ['先做“切屏检测”确认你常用操作是否触发', '尽量使用单窗口工作流', '必要时准备第二屏/第二设备作为备选'],
  },
  {
    key: 'meeting',
    name: '会议/演示',
    desc: '强调“快速补全上下文 + 不打断表达”。',
    tips: ['提前准备场景档案（演示/会议）', '用截图提问快速获取要点', '复盘时整理关键问答与结论'],
  },
] as const

export function CheatingBuddyPage() {
  const releaseState = useLatestRelease()

  const release = releaseState.status === 'loaded' ? releaseState.release : null
  const windowsAsset = useMemo(() => (release ? pickReleaseAsset(release, 'windows') : undefined), [release])
  const macAsset = useMemo(() => (release ? pickReleaseAsset(release, 'mac') : undefined), [release])

  const releaseTitle = release?.tag_name ?? projects.cheatingBuddy.fallbackReleaseTag
  const releaseHref = release?.html_url ?? `${projects.cheatingBuddy.releasesUrl}/tag/${projects.cheatingBuddy.fallbackReleaseTag}`

  return (
    <Container>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.badges}>
            <Badge tone="success">AI 面试助手</Badge>
            <Badge tone="neutral">macOS / Windows</Badge>
          </div>
          <h1 className={styles.title}>Cheating Buddy（作弊老铁）</h1>
          <p className={styles.subtitle}>
            一个实时 AI 助手，通过屏幕截图与音频分析，在视频通话、面试、演示与会议中提供上下文辅助。
          </p>
          <div className={styles.links}>
            <a href={projects.cheatingBuddy.repoUrl} target="_blank" rel="noreferrer" className={styles.link}>
              项目仓库
            </a>
            <a href={projects.cheatingBuddy.releasesUrl} target="_blank" rel="noreferrer" className={styles.link}>
              Releases
            </a>
          </div>
        </div>

        <Card className={styles.releaseCard}>
          <div className={styles.releaseTop}>
            <div className={styles.releaseTitle}>最新版本</div>
            <a href={releaseHref} target="_blank" rel="noreferrer" className={styles.releaseTag}>
              {releaseTitle}
            </a>
          </div>

          {releaseState.status === 'loading' ? <div className={styles.releaseMeta}>正在获取 Release 信息…</div> : null}
          {releaseState.status === 'error' ? (
            <div className={styles.releaseError}>
              无法自动获取最新 Release：{releaseState.message}
              <div className={styles.releaseMeta}>可先使用 fallback 版本入口：{projects.cheatingBuddy.fallbackReleaseTag}</div>
            </div>
          ) : null}

          {release ? (
            <div className={styles.releaseMeta}>
              发布于 {formatDate(release.published_at)} · {release.assets.length} 个附件
            </div>
          ) : null}

          <div className={styles.downloadGrid}>
            <div className={styles.downloadItem}>
              <div className={styles.downloadK}>Windows</div>
              <div className={styles.downloadV}>
                {windowsAsset ? (
                  <>
                    <a href={windowsAsset.browser_download_url} className={styles.downloadName}>
                      {windowsAsset.name}
                    </a>
                    <span className={styles.downloadSize}>{formatBytes(windowsAsset.size)}</span>
                  </>
                ) : (
                  <span className={styles.downloadMissing}>未找到可识别的 Windows 安装包</span>
                )}
              </div>
              <a
                href={windowsAsset?.browser_download_url ?? projects.cheatingBuddy.releasesUrl}
                target="_blank"
                rel="noreferrer"
              >
                <Button disabled={!windowsAsset}>下载 Windows</Button>
              </a>
            </div>

            <div className={styles.downloadItem}>
              <div className={styles.downloadK}>macOS</div>
              <div className={styles.downloadV}>
                {macAsset ? (
                  <>
                    <a href={macAsset.browser_download_url} className={styles.downloadName}>
                      {macAsset.name}
                    </a>
                    <span className={styles.downloadSize}>{formatBytes(macAsset.size)}</span>
                  </>
                ) : (
                  <span className={styles.downloadMissing}>未找到可识别的 macOS 安装包</span>
                )}
              </div>
              <a href={macAsset?.browser_download_url ?? projects.cheatingBuddy.releasesUrl} target="_blank" rel="noreferrer">
                <Button disabled={!macAsset}>下载 macOS</Button>
              </a>
            </div>
          </div>

          {release && release.assets.length > 0 ? (
            <div className={styles.assets}>
              <div className={styles.assetsTitle}>全部附件（直链）</div>
              <div className={styles.assetsList}>
                {release.assets.map((a) => (
                  <a key={a.browser_download_url} href={a.browser_download_url} className={styles.assetItem}>
                    <span className={styles.assetName}>{a.name}</span>
                    <span className={styles.assetSize}>{formatBytes(a.size)}</span>
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </Card>
      </header>

      <section className={styles.section}>
        <h2 className={styles.h2}>核心功能</h2>
        <div className={styles.twoCol}>
          <Card className={styles.cardPad}>
            <h3 className={styles.h3}>多模态 + 多场景</h3>
            <ul className={styles.list}>
              <li>屏幕与音频捕获：结合屏幕内容与系统/麦克风音频进行多模态分析</li>
              <li>透明悬浮窗：始终置顶，可自由移动定位；支持点击穿透模式</li>
              <li>多档案配置：面试/销售/会议/演示/谈判等场景模板</li>
              <li>内容保护：防止屏幕录制软件捕获窗口内容（依赖系统与平台差异）</li>
            </ul>
          </Card>
          <Card className={styles.cardPad}>
            <h3 className={styles.h3}>使用方式（最短路径）</h3>
            <ol className={styles.list}>
              <li>下载并安装（Windows：.exe；macOS：.dmg）</li>
              <li>安装 ffmpeg（Windows：scoop/choco 或手动；macOS：brew install ffmpeg）</li>
              <li>首次启动输入 License Key，授予屏幕录制/麦克风权限</li>
              <li>选择使用档案，开始会话；建议模拟“面试官提问”场景</li>
            </ol>
          </Card>
        </div>

        <div className={styles.twoCol}>
          <Card className={styles.cardPad}>
            <h3 className={styles.h3}>模型栈（项目说明）</h3>
            <ul className={styles.list}>
              <li>Qwen (qwen3-max)：强大的文本对话能力</li>
              <li>Qwen Vision (qwen3-vl-plus)：截图识别与图像理解</li>
              <li>Qwen ASR (qwen3-asr-flash)：高精度语音识别</li>
            </ul>
          </Card>
          <Card className={styles.cardPad}>
            <h3 className={styles.h3}>快捷键说明</h3>
            <div className={styles.kbdGrid}>
              <div className={styles.kbdRow}>
                <span className={styles.kbdName}>📸 截屏提问</span>
                <span className={styles.kbdKeys}>Win: Ctrl + Enter · Mac: Cmd + Enter</span>
              </div>
              <div className={styles.kbdRow}>
                <span className={styles.kbdName}>🖱️ 点击穿透</span>
                <span className={styles.kbdKeys}>Win: Ctrl + M · Mac: Cmd + M</span>
              </div>
              <div className={styles.kbdRow}>
                <span className={styles.kbdName}>🪟 窗口移动</span>
                <span className={styles.kbdKeys}>Win: Ctrl + 方向键 · Mac: Cmd + 方向键</span>
              </div>
              <div className={styles.kbdRow}>
                <span className={styles.kbdName}>🔇 关闭/返回</span>
                <span className={styles.kbdKeys}>Win: Ctrl + \ · Mac: Cmd + \</span>
              </div>
              <div className={styles.kbdRow}>
                <span className={styles.kbdName}>🔊 系统录音</span>
                <span className={styles.kbdKeys}>Win: Ctrl + L · Mac: Cmd + L</span>
              </div>
              <div className={styles.kbdRow}>
                <span className={styles.kbdName}>🎤 麦克风录制</span>
                <span className={styles.kbdKeys}>Win: Ctrl + K · Mac: (暂不支持)</span>
              </div>
              <div className={styles.kbdRow}>
                <span className={styles.kbdName}>💬 发送文本</span>
                <span className={styles.kbdKeys}>Enter</span>
              </div>
              <div className={styles.kbdRow}>
                <span className={styles.kbdName}>🗑️ 删除历史</span>
                <span className={styles.kbdKeys}>Win: Ctrl + ' · Mac: Cmd + '</span>
              </div>
            </div>
          </Card>
        </div>

        <div className={styles.twoCol}>
          <Card className={styles.cardPad}>
            <h3 className={styles.h3}>Windows 详细安装教程</h3>
            <div className={styles.stepGroup}>
              <h4>步骤 1：安装应用程序</h4>
              <ul className={styles.list}>
                <li>双击下载的 <code>.exe</code> 文件</li>
                <li>如果出现"Windows 保护了你的电脑"提示：点击 <strong>"更多信息"</strong> → <strong>"仍要运行"</strong></li>
                <li>按照安装向导完成安装</li>
              </ul>
              <h4>步骤 2：安装 ffmpeg</h4>
              <ul className={styles.list}>
                <li><strong>推荐 (Scoop):</strong> <code>scoop install ffmpeg</code></li>
                <li><strong>或 (Chocolatey):</strong> <code>choco install ffmpeg</code></li>
                <li><strong>手动:</strong> 下载 <code>ffmpeg-release-essentials.zip</code> 解压到 <code>C:\ffmpeg</code> 并添加 <code>bin</code> 到系统环境变量 PATH</li>
              </ul>
              <h4>步骤 3：配置权限与启动</h4>
              <ul className={styles.list}>
                <li>允许麦克风/屏幕录制权限（Win10/11 可能需在 <strong>设置 → 隐私</strong> 中手动授权）</li>
                <li>首次使用输入 License Key，在设置中选择使用档案和语言，点击 <strong>"开始会话"</strong></li>
              </ul>
            </div>
          </Card>
          <Card className={styles.cardPad}>
            <h3 className={styles.h3}>macOS 详细安装教程</h3>
            <div className={styles.stepGroup}>
              <h4>步骤 1：安装应用程序</h4>
              <ul className={styles.list}>
                <li>双击 <code>.dmg</code>，将应用图标拖拽到 <strong>"应用程序"</strong> 文件夹</li>
              </ul>
              <h4>步骤 2：移除隔离属性（必须操作！）</h4>
              <ul className={styles.list}>
                <li><code>sudo xattr -cr /Applications/Cheating\ Buddy.app</code></li>
                <li>验证：<code>xattr -l /Applications/Cheating\ Buddy.app</code> (应无输出)</li>
              </ul>
              <h4>步骤 3：安装 ffmpeg 与配置权限</h4>
              <ul className={styles.list}>
                <li><strong>推荐 (Homebrew):</strong> <code>brew install ffmpeg</code></li>
                <li>在 <strong>系统设置 → 隐私与安全性</strong> 中授予 <strong>屏幕录制</strong> 与 <strong>麦克风</strong> 权限</li>
                <li><strong>⚠️ 重要：</strong> 设置权限后需 <strong>完全退出</strong> 应用重新打开</li>
              </ul>
              <h4>步骤 4：启动</h4>
              <ul className={styles.list}>
                <li>若提示"无法打开"：右键点击图标 → 按住 <strong>Option</strong> 键 → 选择 <strong>"打开"</strong></li>
              </ul>
            </div>
          </Card>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>使用前建议先做三项测试</h2>
        <p className={styles.sectionLead}>
          目的：在正式使用前尽量提前暴露环境差异（系统版本、权限、屏幕共享可见性、快捷键可观测性），减少“现场翻车”概率并优化体验。
        </p>
        <div className={styles.toolsGrid}>
          <Card className={styles.cardPad}>
            <FocusSwitchTest />
          </Card>
          <Card className={styles.cardPad}>
            <ScreenShareVisibilityTest />
          </Card>
        </div>
        <div className={styles.moreTools}>
          也可以直接访问原站工具集：{' '}
          <a href={projects.gankInterview.toolsUrl} target="_blank" rel="noreferrer">
            {projects.gankInterview.toolsUrl}
          </a>
        </div>
      </section>
    </Container>
  )
}

function ScenarioTabs() {
  const [active, setActive] = useState<(typeof scenarios)[number]['key']>('video')
  const scenario = scenarios.find((s) => s.key === active) ?? scenarios[0]

  return (
    <div className={styles.scenario}>
      <div className={styles.scenarioTabs} role="tablist" aria-label="使用场景切换">
        {scenarios.map((s) => (
          <button
            key={s.key}
            type="button"
            role="tab"
            aria-selected={active === s.key}
            className={[styles.scenarioTab, active === s.key ? styles.scenarioTabActive : undefined]
              .filter(Boolean)
              .join(' ')}
            onClick={() => setActive(s.key)}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className={styles.scenarioBody} role="tabpanel">
        <div className={styles.scenarioDesc}>{scenario.desc}</div>
        <div className={styles.scenarioTipsTitle}>建议</div>
        <ul className={styles.scenarioTips}>
          {scenario.tips.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <div className={styles.scenarioNote}>
          以上为通用建议，实际使用仍以系统权限、平台规则与个人习惯为准。
        </div>
      </div>
    </div>
  )
}
