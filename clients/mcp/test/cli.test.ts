import assert from 'node:assert/strict'
import { test } from 'node:test'
import { execFile } from 'node:child_process'
import path from 'node:path'
import { promisify } from 'node:util'

const run = promisify(execFile)
const bin = path.resolve('dist/index.js')

test('--config cursor --demo prints Cursor mcpServers using this install', async () => {
  const { stdout } = await run(process.execPath, [bin, '--config', 'cursor', '--demo'], {
    env: { ...process.env, AURA_ACCESS_TOKEN: 'must-not-appear' },
  })
  const config = JSON.parse(stdout)
  const entry = config.mcpServers.aura
  assert.equal(entry.command, process.execPath)
  assert.equal(entry.args[0], bin)
  assert.deepEqual(entry.args.slice(1), ['--demo'])
  assert.equal(config.servers, undefined)
  assert.ok(!stdout.includes('must-not-appear'))
})

test('--config cursor without --demo omits the demo flag', async () => {
  const { stdout } = await run(process.execPath, [bin, '--config', 'cursor'])
  assert.deepEqual(JSON.parse(stdout).mcpServers.aura.args, [bin])
})

test('--config vscode --demo uses the VS Code servers key', async () => {
  const { stdout } = await run(process.execPath, [bin, '--config', 'vscode', '--demo'])
  const entry = JSON.parse(stdout).servers.aura
  assert.equal(entry.type, 'stdio')
  assert.equal(entry.args.at(-1), '--demo')
})

test('--config claude --demo prints mcpServers like Cursor', async () => {
  const { stdout } = await run(process.execPath, [bin, '--config', 'claude', '--demo'])
  assert.equal(JSON.parse(stdout).mcpServers.aura.args.at(-1), '--demo')
})

test('--help and --version need no credentials', async () => {
  assert.match((await run(process.execPath, [bin, '--help'])).stdout, /synthetic data only/)
  assert.match((await run(process.execPath, [bin, '--version'])).stdout, /\d+\.\d+\.\d+/)
})

test('unsupported options fail without starting a server', async () => {
  await assert.rejects(run(process.execPath, [bin, '--http']))
  await assert.rejects(run(process.execPath, [bin, '--config', 'unknown']))
})
