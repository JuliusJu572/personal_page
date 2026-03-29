import { Container } from '../ui/Container'
import styles from './guidePage.module.css'

function Section({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section className={styles.section} id={id}>
      <h2 className={styles.h2}>{title}</h2>
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

function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={styles.step}>
      <h4 className={styles.h4}>{title}</h4>
      {children}
    </div>
  )
}

function Img({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <figure className={styles.figure}>
      <img src={src} alt={alt} className={styles.img} loading="lazy" />
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
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

export function GuidePage() {
  return (
    <Container className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>作弊老铁使用说明</h1>
        <p className={styles.subtitle}>从安装到使用，一站式完整指南</p>
      </header>

      <nav className={styles.toc}>
        <div className={styles.tocTitle}>目录</div>
        <a className={styles.tocLink} href="#features">功能特性</a>
        <a className={styles.tocLink} href="#download">下载说明</a>
        <a className={styles.tocLink} href="#install">安装说明</a>
        <a className={styles.tocLink} href="#login">登录界面</a>
        <a className={styles.tocLink} href="#usage">使用界面</a>
        <a className={styles.tocLink} href="#settings">重要设置</a>
        <a className={styles.tocLink} href="#ending">结语</a>
      </nav>

      <Section id="features" title="✨ 功能特性">
        <SubSection title="🧠 强大的 AI 内核">
          <ul className={styles.list}>
            <li><strong>多模型支持：</strong>
              <ul className={styles.subList}>
                <li>文本模型：默认搭载 Qwen3-Max，由于阿里云的 Qwen3.5-Plus 不稳定，暂时不建议使用</li>
                <li>视觉模型：集成 Qwen3-VL-Plus，精准识别屏幕代码与图表</li>
                <li>语音识别：采用 Qwen3-ASR-Flash，毫秒级实时语音转文字</li>
              </ul>
            </li>
            <li><strong>智能上下文管理：</strong>
              <ul className={styles.subList}>
                <li>多轮对话：支持连续追问，AI 记住上下文</li>
                <li>单轮模式：可关闭上下文记忆，解决 Token 消耗过快或消息累积问题</li>
              </ul>
            </li>
          </ul>
        </SubSection>

        <SubSection title="🛡️ 隐蔽与安全">
          <ul className={styles.list}>
            <li>🔲 <strong>透明悬浮窗：</strong>窗口始终置顶，背景透明度可调，完美融入桌面</li>
            <li>🖱️ <strong>点击穿透：</strong>一键让鼠标穿透窗口，不影响底层操作</li>
            <li>📹 <strong>防录屏保护：</strong>开启内容保护后，会议软件（如 OBS、腾讯会议、飞书）无法捕获悬浮窗内容</li>
            <li>👻 <strong>隐身模式：</strong>窗口在截图/录屏中完全不可见</li>
          </ul>
        </SubSection>

        <SubSection title="⚙️ 便捷管理">
          <ul className={styles.list}>
            <li>💾 <strong>配置持久化：</strong>模型选择、Token 限制、API Key 等设置自动保存，重启无需重配</li>
            <li>🔑 <strong>License Key 系统：</strong>一次激活，自动验证</li>
          </ul>
        </SubSection>
      </Section>

      <Section id="download" title="📥 下载说明">
        <p className={styles.text}>通过夸克网盘下载安装包。</p>
        <Img src="/guide-images/image_2.png" alt="下载说明截图" />
      </Section>

      <Section id="install" title="安装说明">
        <SubSection title="Windows 详细安装教程">
          <p className={styles.text}>Windows 安装较为简单，双击 <code>Cheating.Buddy.exe</code> 安装包即可下载软件。</p>
          <Note>如果某个功能无法使用，请尝试安装 ffmpeg</Note>
        </SubSection>

        <SubSection title="MacOS 详细安装教程">
          <Note>MacOS 安装较为复杂，烦请尝试如下内容，之后如果还有问题，请联系@雎，我会帮忙安装。</Note>

          <Step title="步骤 1：安装应用程序">
            <p className={styles.text}>双击 <code>Cheating.Buddy.dmg</code> 安装包即可开始安装软件。</p>
            <p className={styles.text}>双击打开，将应用图标拖拽到"应用程序"文件夹。</p>
          </Step>

          <Step title="步骤 2：移除隔离属性">
            <p className={styles.text}>由于应用未经 Apple 公证，需要手动移除隔离属性：</p>
            <Note>
              如下的 <code>/Applications/Cheating\ Buddy.app</code> 需要指向 Cheating Buddy 实际的目录
            </Note>
            <p className={styles.text}>打开终端 <Kbd>Command (⌘)</Kbd> + <Kbd>空格键</Kbd></p>
          </Step>

          <Step title="步骤 3：安装 ffmpeg">
            <p className={styles.text}>推荐使用 Homebrew 安装：<code>brew install ffmpeg</code></p>
          </Step>

          <Step title="步骤 4：配置系统权限">
            <div className={styles.permGroup}>
              <div className={styles.permItem}>
                <strong>屏幕录制权限</strong>
                <p className={styles.text}>打开"系统设置" → "隐私与安全性" → "屏幕录制"</p>
                <p className={styles.text}>点击左下角的锁图标解锁</p>
                <p className={styles.text}>找到"Cheating Buddy"并勾选</p>
              </div>
              <div className={styles.permItem}>
                <strong>麦克风权限</strong>
                <p className={styles.text}>在"系统设置" → "隐私与安全性" → "麦克风"</p>
                <p className={styles.text}>找到"Cheating Buddy"并勾选。</p>
              </div>
              <div className={styles.permItem}>
                <strong>辅助功能权限</strong>
                <p className={styles.text}>在"系统设置" → "隐私与安全性" → "辅助功能"</p>
                <p className={styles.text}>找到"Cheating Buddy"并勾选。</p>
              </div>
            </div>
            <Warn>⚠️ 重要提示：设置权限后需要<strong>完全退出</strong>应用，然后重新打开才能生效</Warn>
          </Step>
        </SubSection>
      </Section>

      <Section id="login" title="登录界面">
        <Step title="步骤 1：输入激活码">
          <Img src="/guide-images/image_1.png" alt="输入激活码" />
        </Step>

        <Step title="步骤 2：输入账户密码">
          <p className={styles.text}>输入发给你的邮箱，密码为邮箱的名字（@前的内容）</p>
          <Img src="/guide-images/image_0.png" alt="输入账户密码" />
        </Step>

        <Step title="步骤 3：登录成功">
          <Img src="/guide-images/image_10.png" alt="登录成功" />
          <Note>如果遇到账号冻结，额度不够。请联系@雎。</Note>
        </Step>
      </Section>

      <Section id="usage" title="使用界面">
        <Img src="/guide-images/image_19.png" alt="使用界面总览" />

        <SubSection title="文本">
          <p className={styles.text}>在下方文本框中输入后，敲击回车 <Kbd>Enter</Kbd> 键发送。</p>
          <div className={styles.newFeature}>
            <strong>新增功能：</strong>
            <ul className={styles.list}>
              <li>使用 <Kbd>Ctrl</Kbd> + <Kbd>C</Kbd> 复制电脑上的内容，Cheating Buddy 会随时读取剪切板然后获取答案。</li>
              <li>使用 <Kbd>Ctrl</Kbd> + <Kbd>;</Kbd> 使用 OCR 模型提取电脑屏幕上的文字，之后获取答案。</li>
            </ul>
          </div>
          <div className={styles.imgRow}>
            <Img src="/guide-images/image_9.png" alt="文本输入示例" />
            <Img src="/guide-images/image_8.png" alt="文本输入示例2" />
          </div>
        </SubSection>

        <SubSection title="截屏">
          <p className={styles.text}>快捷键 <Kbd>Ctrl</Kbd>/<Kbd>Cmd</Kbd> + <Kbd>Enter</Kbd></p>
          <Img src="/guide-images/image_11.png" alt="截屏功能" />
          <Note>注意：测评时，为了让 VLM 更好的理解内容，请尽可能的放大页面中的字体。</Note>
        </SubSection>

        <SubSection title="系统音频">
          <p className={styles.text}>快捷键 <Kbd>Ctrl</Kbd>/<Kbd>Cmd</Kbd> + <Kbd>L</Kbd> 开始录制，再次按下停止录制。</p>
          <Img src="/guide-images/image_12.png" alt="系统音频录制" />
          <Img src="/guide-images/image_18.png" alt="系统音频录制示例" />
        </SubSection>

        <SubSection title="麦克风录制">
          <p className={styles.text}>快捷键 <Kbd>Ctrl</Kbd>/<Kbd>Cmd</Kbd> + <Kbd>K</Kbd> 开始录制麦克风声音，再次按下停止录制。</p>
          <Img src="/guide-images/image_21.png" alt="麦克风录制" />
        </SubSection>

        <SubSection title="简历/JD 解析">
          <div className={styles.imgGrid}>
            <Img src="/guide-images/image_20.png" alt="简历解析1" />
            <Img src="/guide-images/image_22.png" alt="简历解析2" />
            <Img src="/guide-images/image_13.png" alt="简历解析3" />
            <Img src="/guide-images/image_17.png" alt="简历解析4" />
          </div>
        </SubSection>

        <SubSection title="清理上下文">
          <p className={styles.text}>对话界面，快捷键 <Kbd>Ctrl</Kbd>/<Kbd>Cmd</Kbd> + <Kbd>'</Kbd> 清理上下文，防止上下文累积。</p>
        </SubSection>
      </Section>

      <Section id="settings" title="重要设置">
        <SubSection title="账号与计费">
          <p className={styles.text}>设置中，第一栏可以查看用户余额，一次对话大约消耗 1,000 tokens，因此在面试前需要提前查看，预留出大约 30,000 tokens。</p>
          <Img src="/guide-images/image_14.png" alt="账号与计费" />
        </SubSection>

        <SubSection title="默认用户提示词">
          <p className={styles.text}>此处编辑用户提示词，针对不同的场景个性化编辑。</p>
          <Img src="/guide-images/image_23.png" alt="默认用户提示词" />
        </SubSection>

        <SubSection title="界面设置 - 透明度与字体大小">
          <Img src="/guide-images/image_24.png" alt="界面设置" />
        </SubSection>

        <SubSection title="隐身配置">
          <Warn>一定一定一定！！！要确保这里的选项是"平衡"。</Warn>
          <Img src="/guide-images/image_16.png" alt="隐身配置" />
        </SubSection>

        <SubSection title="模型设置">
          <ul className={styles.list}>
            <li>文本模型建议使用 <strong>Qwen3-Max</strong>，暂时不推荐使用 Qwen3.5plus（速度过慢，服务不稳定）。如果不想使用，可以更换为 Deepseek、Minimax 或 Kimi。</li>
            <li>视觉模型不建议更换，使用默认的 <strong>Qwen3-VL-Plus</strong>。</li>
            <li>最大回复 Tokens 越大回复越长，响应速度越慢。</li>
            <li>多轮对话默认开启，不建议关闭。</li>
            <li>追问增强可以预判面试官的追问，按需开启，会加大 tokens 的消耗。</li>
          </ul>
          <Img src="/guide-images/image_7.png" alt="模型设置" />

          <div className={styles.subSubSection}>
            <h4 className={styles.h4}>追问增强实例</h4>
            <div className={styles.imgRow}>
              <Img src="/guide-images/image_6.png" alt="追问增强实例1" />
              <Img src="/guide-images/image_15.png" alt="追问增强实例2" />
            </div>
          </div>
        </SubSection>

        <SubSection title="更换 License Key">
          <div className={styles.imgRow}>
            <Img src="/guide-images/image_5.png" alt="更换License Key 1" />
            <Img src="/guide-images/image_4.png" alt="更换License Key 2" />
          </div>
          <Img src="/guide-images/image_3.png" alt="更换License Key 3" />
        </SubSection>
      </Section>

      <Section id="ending" title="📌 结语">
        <div className={styles.ending}>
          <p>🎉 祝大家都能在 经济下行期 + AI 时代 找到满意的工作！</p>
          <p>💪 求职路上，愿这款工具能成为你的得力助手，助你在激烈的竞争中脱颖而出</p>
          <p>📮 联系我</p>
          <p>🟢 微信：jrb_572_</p>
          <p>✨ 祝求职顺利！</p>
        </div>
      </Section>
    </Container>
  )
}
