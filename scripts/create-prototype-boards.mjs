import { mkdir } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const require = createRequire('/Users/wangtongyan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/package.json')
const sharp = require('sharp')

const outputDir = new URL('../public/assets/projects/mobile/homestead-assistant/', import.meta.url)
await mkdir(outputDir, { recursive: true })

const boards = [
  {
    input: '/var/folders/ct/rg_mxw_x7r945_h76r5zbg6m0000gn/T/codex-clipboard-3d2cbbc0-fdec-42c0-9b37-a001fa6d365f.png',
    output: new URL('prototype-dynamic-inspection.png', outputDir),
    title: '动态巡查业务流程',
    subtitle: 'DYNAMIC INSPECTION FLOW',
    index: '01',
    innerWidth: 3600,
  },
  {
    input: '/var/folders/ct/rg_mxw_x7r945_h76r5zbg6m0000gn/T/codex-clipboard-a0f04057-a931-4b89-9cc5-fede49e306d4.png',
    output: new URL('prototype-approval-flow.png', outputDir),
    title: '审批与综合监管流程',
    subtitle: 'APPROVAL & SUPERVISION FLOW',
    index: '02',
    innerWidth: 3000,
  },
]

const escapeXml = value => value.replace(/[<>&'"]/g, char => ({
  '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;',
}[char]))

for (const board of boards) {
  const source = sharp(board.input)
  const metadata = await source.metadata()
  const innerHeight = Math.round(metadata.height * board.innerWidth / metadata.width)
  const side = 104
  const header = 270
  const footer = 90
  const width = board.innerWidth + side * 2
  const height = header + innerHeight + footer
  const frameX = side
  const frameY = header

  const backdrop = `
  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="glow" cx="78%" cy="0%" r="78%">
        <stop offset="0" stop-color="#7f2b12" stop-opacity=".34"/>
        <stop offset=".42" stop-color="#26130d" stop-opacity=".16"/>
        <stop offset="1" stop-color="#070706" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="line" x1="0" x2="1">
        <stop offset="0" stop-color="#ff5a26" stop-opacity="0"/>
        <stop offset=".45" stop-color="#ff6b2c"/>
        <stop offset=".7" stop-color="#ffc06a"/>
        <stop offset="1" stop-color="#ff5a26" stop-opacity="0"/>
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="150%">
        <feDropShadow dx="0" dy="34" stdDeviation="34" flood-color="#000" flood-opacity=".72"/>
      </filter>
      <pattern id="grid" width="88" height="88" patternUnits="userSpaceOnUse">
        <path d="M88 0H0V88" fill="none" stroke="#fff" stroke-opacity=".028" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="#070706"/>
    <rect width="100%" height="100%" fill="url(#grid)"/>
    <rect width="100%" height="100%" fill="url(#glow)"/>
    <rect x="${frameX - 16}" y="${frameY - 16}" width="${board.innerWidth + 32}" height="${innerHeight + 32}" rx="48"
      fill="#100d0b" stroke="#ff8746" stroke-opacity=".28" stroke-width="2" filter="url(#shadow)"/>
    <rect x="${frameX}" y="${frameY}" width="${board.innerWidth}" height="${innerHeight}" rx="36" fill="#fff"/>
    <rect x="${side}" y="80" width="54" height="54" rx="27" fill="#ff6429"/>
    <text x="${side + 27}" y="116" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="#140b07">${board.index}</text>
    <text x="${side + 86}" y="107" font-family="PingFang SC, Noto Sans SC, sans-serif" font-size="48" font-weight="650" fill="#f4f0e9">${escapeXml(board.title)}</text>
    <text x="${side + 88}" y="145" font-family="Arial, sans-serif" font-size="18" font-weight="600" letter-spacing="4" fill="#ff8b50">${escapeXml(board.subtitle)}</text>
    <text x="${width - side}" y="109" text-anchor="end" font-family="Arial, sans-serif" font-size="16" font-weight="600" letter-spacing="3" fill="#817a72">MOBILE PRODUCT · UX FLOW</text>
    <rect x="${side}" y="202" width="${width - side * 2}" height="2" fill="url(#line)"/>
    <text x="${side}" y="${height - 34}" font-family="Arial, sans-serif" font-size="14" font-weight="600" letter-spacing="3" fill="#665f58">PROCESS ARCHITECTURE / 2026 PORTFOLIO</text>
    <text x="${width - side}" y="${height - 34}" text-anchor="end" font-family="Arial, sans-serif" font-size="14" font-weight="600" letter-spacing="3" fill="#ff7d41">HUOHUO DESIGN</text>
  </svg>`

  const resized = await source.resize({ width: board.innerWidth }).png().toBuffer()
  await sharp(Buffer.from(backdrop))
    .composite([{ input: resized, left: frameX, top: frameY }])
    .png({ compressionLevel: 9 })
    .toFile(fileURLToPath(board.output))
}
