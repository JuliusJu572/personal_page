/**
 * Post-build prerender script
 * Generates static HTML for public routes so search engines can index content
 * without executing JavaScript.
 *
 * Usage: node scripts/prerender.mjs
 * Requires: puppeteer (devDependency)
 */

import { launch } from 'puppeteer'
import { createServer } from 'http'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DIST = join(__dirname, '..', 'dist')

// Public routes that search engines should index
const ROUTES = [
  '/lucencia',
  '/features',
  '/pricing',
  '/guide',
  '/brand-story',
  '/knowledge-cards',
  '/terms',
  '/privacy',
  '/register',
  '/login',
]

// Minimal static file server for the dist folder
function startServer(port) {
  const mime = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.woff2': 'font/woff2',
    '.ico': 'image/x-icon',
  }
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      let filePath = join(DIST, req.url === '/' ? '/index.html' : req.url)
      // SPA fallback: if file doesn't exist, serve index.html
      if (!existsSync(filePath)) filePath = join(DIST, 'index.html')
      const ext = '.' + filePath.split('.').pop()
      try {
        const data = readFileSync(filePath)
        res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' })
        res.end(data)
      } catch {
        res.writeHead(404)
        res.end()
      }
    })
    server.listen(port, () => resolve(server))
  })
}

async function prerender() {
  const PORT = 4173
  console.log('🚀 Starting local server...')
  const server = await startServer(PORT)

  console.log('🌐 Launching headless browser...')
  const browser = await launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  for (const route of ROUTES) {
    const url = `http://localhost:${PORT}${route}`
    console.log(`  📄 Rendering ${route}`)
    const page = await browser.newPage()
    try {
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })
      // Wait a bit more for any animations / lazy renders
      await new Promise((r) => setTimeout(r, 500))

      const html = await page.content()

      // Write to dist/{route}/index.html
      const outDir = join(DIST, route)
      if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })
      writeFileSync(join(outDir, 'index.html'), html, 'utf-8')
    } catch (err) {
      console.error(`  ⚠️  Failed to render ${route}: ${err.message}`)
    } finally {
      await page.close()
    }
  }

  await browser.close()
  server.close()
  console.log(`\n✅ Prerendered ${ROUTES.length} routes into dist/`)
}

prerender().catch((err) => {
  console.error('Prerender failed:', err)
  // Don't fail the build — prerendering is an enhancement, not a requirement
  process.exit(0)
})
