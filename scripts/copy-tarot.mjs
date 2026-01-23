import { cp, mkdir, rm } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const tarotDist = path.resolve(root, '..', 'Mystic_AI_Tarot', 'dist')
const out = path.resolve(root, 'dist', 'tarot')

await rm(out, { recursive: true, force: true })
await mkdir(path.dirname(out), { recursive: true })
await cp(tarotDist, out, { recursive: true })

