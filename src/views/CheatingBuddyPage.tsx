import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { projects } from '../config/projects'
import type { GitHubRelease } from '../lib/github'
import { fetchLatestRelease, pickReleaseAsset } from '../lib/github'
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

type FocusSwitchTestHandle = {
  start: () => void
  stop: () => void
  clear: () => void
}

const FocusSwitchTest = forwardRef<FocusSwitchTestHandle>(function FocusSwitchTest(_props, ref) {
  const [isRunning, setIsRunning] = useState(false)
  const [events, setEvents] = useState<Array<{ t: number; type: string; detail?: string }>>([])
  const [startedAt, setStartedAt] = useState<number | null>(null)

  useImperativeHandle(
    ref,
    () => ({
      start: () => {
        const now = Date.now()
        setStartedAt(now)
        setEvents([{ t: now, type: 'start' }])
        setIsRunning(true)
      },
      stop: () => {
        setIsRunning(false)
        setStartedAt(null)
      },
      clear: () => setEvents([]),
    }),
    [],
  )

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
          <div className={styles.toolEmpty}>点击"开始检测"后尝试切换窗口/标签页。</div>
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
    </div>
  )
})

type ScreenShareVisibilityTestHandle = {
  start: () => Promise<void>
  stop: () => void
}

const ScreenShareVisibilityTest = forwardRef<ScreenShareVisibilityTestHandle>(function ScreenShareVisibilityTest(_props, ref) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [status, setStatus] = useState<'idle' | 'running' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string>('')

  const stopTracks = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
  }, [])

  const stop = useCallback(() => {
    stopTracks()
    setStatus('idle')
  }, [stopTracks])

  const start = useCallback(async () => {
    if (status === 'running') return
    setErrorMsg('')
    try {
      const mediaDevices = navigator.mediaDevices
      const getDisplayMedia = mediaDevices?.getDisplayMedia
      if (typeof getDisplayMedia !== 'function') {
        setStatus('error')
        setErrorMsg('当前浏览器/环境不支持屏幕共享预览。请使用最新版 Chrome/Edge，并确保在 https 或 localhost 下打开。')
        return
      }

      const stream = await getDisplayMedia.call(mediaDevices, {
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
  }, [status])

  useImperativeHandle(ref, () => ({ start, stop }), [start, stop])

  useEffect(() => () => stopTracks(), [stopTracks])

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
              await start()
            }}
          >
            {status === 'running' ? '停止预览' : '开始预览'}
          </Button>
        </div>
      </div>
      <p className={styles.toolDesc}>
        选择"整个屏幕"共享后，你会看到采集到的画面。可在同时打开 Cheating Buddy 主程序时观察：屏幕采集里是否会出现悬浮窗/提示等内容。
      </p>
      {status === 'error' ? <div className={styles.toolError}>{errorMsg}</div> : null}
      <div className={styles.videoBox}>
        <video ref={videoRef} autoPlay playsInline muted className={styles.video} />
        {status !== 'running' ? <div className={styles.videoMask}>点击"开始预览"并选择共享目标</div> : null}
      </div>
    </div>
  )
})

function InstallGuide(props: { os: 'windows' | 'mac' }) {
  if (props.os === 'windows') {
    return (
      <div className={styles.stepGroup}>
        <h4>步骤 1：安装应用程序</h4>
        <ul className={styles.list}>
          <li>双击下载的 <code>.exe</code> 文件</li>
          <li>
            如果出现"Windows 保护了你的电脑"提示：点击 <strong>更多信息</strong> → <strong>仍要运行</strong>
          </li>
          <li>按照安装向导完成安装</li>
        </ul>
        <h4>步骤 2：安装 ffmpeg</h4>
        <ul className={styles.list}>
          <li>
            <strong>推荐 (Scoop):</strong> <code>scoop install ffmpeg</code>
          </li>
          <li>
            <strong>或 (Chocolatey):</strong> <code>choco install ffmpeg</code>
          </li>
          <li>
            <strong>手动:</strong> 下载 <code>ffmpeg-release-essentials.zip</code>，解压到 <code>C:\ffmpeg</code> 并添加{' '}
            <code>bin</code> 到系统环境变量 PATH
          </li>
        </ul>
        <h4>步骤 3：配置权限与启动</h4>
        <ul className={styles.list}>
          <li>
            允许麦克风/屏幕录制权限（Win10/11 可能需在 <strong>设置 → 隐私</strong> 中手动授权）
          </li>
          <li>
            首次使用输入 License Key，在设置中选择使用档案和语言，点击 <strong>开始会话</strong>
          </li>
        </ul>
      </div>
    )
  }

  return (
    <div className={styles.stepGroup}>
      <div className={styles.callout} role="note">
        macOS 版本仅支持 Apple Silicon（M 系列）芯片
      </div>
      <h4>步骤 1：安装应用程序</h4>
      <ul className={styles.list}>
        <li>
          双击 <code>.dmg</code>，将应用图标拖拽到 <strong>应用程序</strong> 文件夹
        </li>
      </ul>
      <h4>步骤 2：移除隔离属性（必须操作）</h4>
      <ul className={styles.list}>
        <li>
          <code>sudo xattr -cr /Applications/Cheating\ Buddy.app</code>
        </li>
        <li>
          验证：<code>xattr -l /Applications/Cheating\ Buddy.app</code>（应无输出）
        </li>
      </ul>
      <h4>步骤 3：安装 ffmpeg 与配置权限</h4>
      <ul className={styles.list}>
        <li>
          <strong>推荐 (Homebrew):</strong> <code>brew install ffmpeg</code>
        </li>
        <li>
          在 <strong>系统设置 → 隐私与安全性</strong> 中授予 <strong>屏幕录制</strong> 与 <strong>麦克风</strong> 权限
        </li>
        <li>
          <strong>重要：</strong> 设置权限后需 <strong>完全退出</strong> 应用重新打开
        </li>
      </ul>
      <h4>步骤 4：启动</h4>
      <ul className={styles.list}>
        <li>
          若提示无法打开：右键点击图标 → 按住 <strong>Option</strong> 键 → 选择 <strong>打开</strong>
        </li>
      </ul>
    </div>
  )
}

export function CheatingBuddyPage() {
  const releaseState = useLatestRelease()

  const release = releaseState.status === 'loaded' ? releaseState.release : null
  const windowsAsset = useMemo(() => (release ? pickReleaseAsset(release, 'windows') : undefined), [release])
  const macAsset = useMemo(() => (release ? pickReleaseAsset(release, 'mac') : undefined), [release])
  const [selectedOs, setSelectedOs] = useState<'windows' | 'mac'>(() => {
    if (typeof navigator === 'undefined') return 'windows'
    const ua = navigator.userAgent.toLowerCase()
    return ua.includes('mac os') || ua.includes('macintosh') ? 'mac' : 'windows'
  })
  const [activeTab, setActiveTab] = useState<'overview' | 'shortcuts' | 'tests'>('overview')
  const focusTestRef = useRef<FocusSwitchTestHandle | null>(null)
  const shareTestRef = useRef<ScreenShareVisibilityTestHandle | null>(null)
  const focusTestBoxRef = useRef<HTMLDivElement | null>(null)
  const shareTestBoxRef = useRef<HTMLDivElement | null>(null)

  const releaseTitle = release?.tag_name ?? projects.cheatingBuddy.fallbackReleaseTag
  const repoUrl = `https://github.com/${projects.cheatingBuddy.owner}/${projects.cheatingBuddy.repo}`
  const releaseUrl = release?.html_url ?? `${repoUrl}/releases`

  return (
    <Container className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <h1 className={styles.title}>Cheating Buddy（作弊老铁）</h1>
            <p className={styles.subtitle}>
              一个实时 AI 助手：基于屏幕截图与音频分析，在视频通话、面试、演示与会议中提供上下文辅助与回答草稿。
            </p>
            <div className={styles.heroLinks}>
              <a href={repoUrl} target="_blank" rel="noreferrer">
                <Button variant="secondary">查看仓库</Button>
              </a>
              <a href={releaseUrl} target="_blank" rel="noreferrer">
                <Button variant="ghost">Release</Button>
              </a>
            </div>
          </div>

          <Card className={styles.downloadCard}>
            <div className={styles.releaseTop}>
              <div className={styles.releaseTitle}>最新版本</div>
              <span className={styles.releaseTag} aria-label="最新版本号">
                {releaseTitle}
              </span>
            </div>

            {releaseState.status === 'loading' ? <div className={styles.releaseMeta}>正在获取版本信息…</div> : null}
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
            <div
              className={[styles.downloadItem, selectedOs === 'windows' ? styles.downloadItemActive : '']
                .filter(Boolean)
                .join(' ')}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedOs('windows')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setSelectedOs('windows')
              }}
            >
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
              {windowsAsset ? (
                <a href={windowsAsset.browser_download_url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
                  <Button>下载 Windows</Button>
                </a>
              ) : null}
            </div>

            <div
              className={[styles.downloadItem, selectedOs === 'mac' ? styles.downloadItemActive : ''].filter(Boolean).join(' ')}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedOs('mac')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setSelectedOs('mac')
              }}
            >
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
              {macAsset ? (
                <a href={macAsset.browser_download_url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
                  <Button>下载 macOS</Button>
                </a>
              ) : null}
            </div>
          </div>

          <div className={styles.guide}>
            <div className={styles.guideTop}>
              <div className={styles.guideTitle}>安装与使用指引</div>
              <div className={styles.osToggle} role="tablist" aria-label="选择操作系统">
                <button
                  type="button"
                  className={[styles.osBtn, selectedOs === 'windows' ? styles.osBtnActive : ''].filter(Boolean).join(' ')}
                  aria-pressed={selectedOs === 'windows'}
                  onClick={() => setSelectedOs('windows')}
                >
                  Windows
                </button>
                <button
                  type="button"
                  className={[styles.osBtn, selectedOs === 'mac' ? styles.osBtnActive : ''].filter(Boolean).join(' ')}
                  aria-pressed={selectedOs === 'mac'}
                  onClick={() => setSelectedOs('mac')}
                >
                  macOS
                </button>
              </div>
            </div>
            <InstallGuide os={selectedOs} />
          </div>
          </Card>
        </div>
      </header>

      <nav className={styles.tabs} role="tablist" aria-label="页面导航">
        <button
          type="button"
          className={[styles.tabBtn, activeTab === 'overview' ? styles.tabBtnActive : ''].filter(Boolean).join(' ')}
          aria-pressed={activeTab === 'overview'}
          onClick={() => setActiveTab('overview')}
        >
          功能概览
        </button>
        <button
          type="button"
          className={[styles.tabBtn, activeTab === 'shortcuts' ? styles.tabBtnActive : ''].filter(Boolean).join(' ')}
          aria-pressed={activeTab === 'shortcuts'}
          onClick={() => setActiveTab('shortcuts')}
        >
          快捷键
        </button>
        <button
          type="button"
          className={[styles.tabBtn, activeTab === 'tests' ? styles.tabBtnActive : ''].filter(Boolean).join(' ')}
          aria-pressed={activeTab === 'tests'}
          onClick={() => setActiveTab('tests')}
        >
          使用前测试
        </button>
      </nav>

      {activeTab === 'overview' ? (
        <section className={styles.section}>
          <h2 className={styles.h2}>功能概览</h2>
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
                <li>选择使用档案，开始会话；建议模拟"面试官提问"场景</li>
              </ol>
            </Card>
          </div>

          <div className={styles.oneCol}>
            <Card className={styles.cardPad}>
              <details className={styles.details}>
                <summary className={styles.summary}>模型栈（项目说明）</summary>
                <ul className={styles.list}>
                  <li>Qwen (qwen3-max)：强大的文本对话能力</li>
                  <li>Qwen Vision (qwen3-vl-plus)：截图识别与图像理解</li>
                  <li>Qwen ASR (qwen3-asr-flash)：高精度语音识别</li>
                </ul>
              </details>
            </Card>
          </div>
        </section>
      ) : null}

      {activeTab === 'shortcuts' ? (
        <section className={styles.section}>
          <h2 className={styles.h2}>快捷键</h2>
          <Card className={styles.cardPad}>
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
        </section>
      ) : null}

      {activeTab === 'tests' ? (
        <section className={styles.section}>
          <h2 className={styles.h2}>使用前测试</h2>
          <p className={styles.sectionLead}>
            建议完成以下两项测试，提前暴露环境差异（系统版本、权限、屏幕共享可见性），减少"现场翻车"概率并优化体验。
          </p>
          <div className={styles.testActions}>
            <Button
              onClick={() => {
                focusTestBoxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                focusTestRef.current?.start()
              }}
            >
              开始切屏检测
            </Button>
            <Button
              variant="secondary"
              onClick={async () => {
                shareTestBoxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                await shareTestRef.current?.start()
              }}
            >
              开始屏幕共享预览
            </Button>
          </div>
          <div className={styles.toolsGrid}>
            <div ref={focusTestBoxRef}>
              <Card className={styles.cardPad}>
                <FocusSwitchTest ref={focusTestRef} />
              </Card>
            </div>
            <div ref={shareTestBoxRef}>
              <Card className={styles.cardPad}>
                <ScreenShareVisibilityTest ref={shareTestRef} />
              </Card>
            </div>
          </div>
        </section>
      ) : null}
    </Container>
  )
}
