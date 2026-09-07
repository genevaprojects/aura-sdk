#!/usr/bin/env node
import { Client } from '@modelcontextprotocol/client'
import { getDefaultEnvironment, StdioClientTransport } from '@modelcontextprotocol/client/stdio'
import { writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const textOf = (r) => JSON.parse(r.content.find((b) => b.type === 'text')?.text ?? '{}')

const transport = new StdioClientTransport({
  command: 'npx',
  args: ['-y', 'github:aurafhe-official/mcp'],
  env: getDefaultEnvironment(),
  stderr: 'pipe',
})
const client = new Client({ name: 'deck-host', version: '1.0.0' })
await client.connect(transport, { timeout: 180_000 })

const started = new Date().toISOString()
const status = textOf(await client.callTool({ name: 'fhe_status', arguments: {} }))
const a = textOf(await client.callTool({ name: 'fhe_encrypt', arguments: { domain: 'int', value: 40 } }, { timeout: 120_000 }))
const b = textOf(await client.callTool({ name: 'fhe_encrypt', arguments: { domain: 'int', value: 2 } }, { timeout: 120_000 }))
const sum = textOf(
  await client.callTool(
    { name: 'fhe_compute', arguments: { domain: 'int', op: 'add', inputs: [a.handle, b.handle] } },
    { timeout: 120_000 },
  ),
)
const opened = textOf(await client.callTool({ name: 'fhe_decrypt', arguments: { handle: sum.handle } }, { timeout: 120_000 }))
await client.close()

const session = {
  started,
  finished: new Date().toISOString(),
  via: 'npx -y github:aurafhe-official/mcp',
  status: { ok: status.ok, network: status.network, coprocessor: status.coprocessor },
  encrypt: [
    { handle: a.handle, domain: a.domain, value: 40 },
    { handle: b.handle, domain: b.domain, value: 2 },
  ],
  compute: sum,
  decrypt: opened,
}
writeFileSync(path.join(here, 'hello.json'), JSON.stringify(session, null, 2))
console.log(JSON.stringify(session, null, 2))
if (opened.plaintext !== '42') process.exit(1)
