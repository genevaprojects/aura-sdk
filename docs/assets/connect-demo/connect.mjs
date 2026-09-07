#!/usr/bin/env node
import { Client } from '@modelcontextprotocol/client'
import { getDefaultEnvironment, StdioClientTransport } from '@modelcontextprotocol/client/stdio'

const transport = new StdioClientTransport({
  command: 'npx',
  args: ['-y', 'github:aurafhe-official/mcp'],
  env: getDefaultEnvironment(),
  stderr: 'pipe',
})
const client = new Client({ name: 'host', version: '1.0.0' })
await client.connect(transport, { timeout: 180_000 })
const info = client.getServerVersion()
const status = JSON.parse(
  (await client.callTool({ name: 'fhe_status', arguments: {} })).content.find((b) => b.type === 'text')?.text ?? '{}',
)
await client.close()
process.stdout.write(`connected  ${info?.name} ${info?.version}\n`)
process.stdout.write(`coprocessor  ${status.coprocessor}\n`)
process.stdout.write(`${status.network}\n`)
if (!status.ok) process.exit(1)
