#!/usr/bin/env node
import { Client } from '@modelcontextprotocol/client'
import { getDefaultEnvironment, StdioClientTransport } from '@modelcontextprotocol/client/stdio'
import { writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const github = process.argv.includes('--github')
const started = new Date().toISOString()
const lines = []
const log = (line) => {
  lines.push(line)
  console.log(line)
}

const transport = new StdioClientTransport({
  command: github ? 'npx' : process.execPath,
  args: github ? ['-y', 'github:aurafhe-official/mcp'] : [path.resolve(here, '../../../dist/index.js')],
  env: getDefaultEnvironment(),
  stderr: 'pipe',
})
const client = new Client({ name: 'deck-host', version: '1.0.0' })
await client.connect(transport, { timeout: github ? 180_000 : 20_000 })

const info = client.getServerVersion()
const { tools } = await client.listTools()
const statusRaw = await client.callTool({ name: 'fhe_status', arguments: {} })
const statusText = statusRaw.content.find((b) => b.type === 'text')?.text ?? '{}'
const status = JSON.parse(statusText)
const evalRaw = await client.callTool(
  { name: 'fhe_private_eval', arguments: { domain: 'int', op: 'add', values: [25, 17], reveal: true } },
  { timeout: 120_000 },
)
const evalText = evalRaw.content.find((b) => b.type === 'text')?.text ?? '{}'
const result = JSON.parse(evalText)
await client.close()

const via = github ? 'npx -y github:aurafhe-official/mcp' : 'node dist/index.js'
log(`$ ${via}`)
log(`initialize  ${info?.name} ${info?.version}`)
log(`tools       ${tools.map((t) => t.name).join('  ')}`)
log(`fhe_status  ${status.coprocessor}  ${status.network}`)
log(`call        fhe_private_eval  add  [25, 17]  reveal`)
log(`plaintext   ${result.plaintext}`)

const session = {
  started,
  finished: new Date().toISOString(),
  via,
  server: info,
  tools: tools.map((t) => t.name),
  status,
  result,
  transcript: lines,
}
writeFileSync(path.join(here, 'session.json'), JSON.stringify(session, null, 2))
if (result.plaintext !== '42') process.exit(1)
