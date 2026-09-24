import assert from 'node:assert/strict'
import { test } from 'node:test'
import { Client } from '@modelcontextprotocol/client'
import { InMemoryTransport } from '@modelcontextprotocol/server'
import { FUNCTIONS } from '../src/contracts.ts'
import type { Coprocessor } from '../src/coprocessor.ts'
import { FheSession } from '../src/fhe.ts'
import { createFheServer } from '../src/server.ts'
import type { ResultBundle } from '../src/contracts.ts'

const bundle = {
  version: 1 as const,
  keyId: 'test-key',
  inputs: [
    { domain: 'int' as const, ciphertext: 'cipher-a' },
    { domain: 'int' as const, ciphertext: 'cipher-b' },
    { domain: 'float' as const, ciphertext: 'cipher-c' },
  ],
}

function fixture() {
  let now = Date.now()
  let health: Record<string, unknown> = {
    status: 'ok',
    role: 'compute',
    secretKeyLoaded: false,
    keyId: bundle.keyId,
  }
  const calls: { fn: string; args: string[] }[] = []
  const results: ResultBundle[] = []
  const remote: Coprocessor = {
    health: async () => health as never,
    functions: async () => ({
      arity1: ['DecryptInt'],
      arity2: Object.values(FUNCTIONS).flatMap(Object.values),
      arity3: [],
    }),
    call: async (fn, args) => {
      calls.push({ fn, args })
      return 'cipher-result'
    },
  }
  const session = new FheSession(remote, {
    bundle,
    writeResult: async (r) => {
      results.push(r)
    },
    now: () => now,
  })
  return { session, remote, calls, results, setHealth: (value: typeof health) => { health = value }, advance: (n: number) => { now += n } }
}

test('inputs -> remote computation -> encrypted artifact; no raw values in tool results', async () => {
  const f = fixture()
  const inputs = await f.session.inputs()
  const handles = inputs.inputs.slice(0, 2).map((x) => x.handle)
  const sum = await f.session.compute('add', handles)
  const exported = await f.session.exportResult(sum.handle)
  assert.deepEqual(f.calls[0], { fn: 'AddCipherInt', args: ['cipher-a', 'cipher-b'] })
  assert.equal(f.results[0].ciphertext, 'cipher-result')
  assert.ok(!JSON.stringify({ inputs, sum, exported }).includes('cipher-'))
  assert.equal(exported.encrypted, true)
})

test('demo mode advertises backend-keyed synthetic context', () => {
  const f = fixture()
  const demo = new FheSession(f.remote, { demo: async () => bundle, writeResult: async () => {} })
  assert.equal(demo.context().mode, 'fixed-synthetic-demo')
  assert.equal(demo.context().keyCustodyModel, 'backend-keyed')
  assert.equal(demo.context().confidentialityClaimed, false)
})

test('bundle and demo cannot be combined', () => {
  const f = fixture()
  assert.throws(
    () => new FheSession(f.remote, { bundle, demo: async () => bundle, writeResult: async () => {} }),
    /DEMO_AND_BUNDLE_CONFLICT/,
  )
})

test('a beginner can follow nextAction through a real MCP conversation', async () => {
  const f = fixture()
  const session = new FheSession(f.remote, {
    demo: async () => bundle,
    writeResult: async (r) => {
      f.results.push(r)
    },
  })
  const server = createFheServer(session)
  const client = new Client({ name: 'beginner', version: '1' })
  const [a, b] = InMemoryTransport.createLinkedPair()
  await Promise.all([server.connect(a), client.connect(b)])
  const call = async (name: string, args: Record<string, unknown> = {}) => {
    const r = await client.callTool({ name, arguments: args })
    assert.ok(!r.isError)
    return JSON.parse((r.content as { text: string }[])[0].text)
  }
  try {
    assert.ok(client.getInstructions()?.includes('never heard of FHE'))
    assert.ok((await client.listPrompts()).prompts.some((p) => p.name === 'aura_demo'))
    let response = await call('aura_start')
    assert.equal(response.guide.step, 1)
    for (const step of [2, 3, 4]) {
      const action = response.guide.nextAction
      response = await call(action.tool, action.arguments)
      assert.equal(response.guide.step, step)
    }
    assert.equal(f.calls.length, 1)
    assert.equal(response.encrypted, true)
  } finally {
    await client.close()
    await server.close()
  }
})

test('MCP rejects plaintext, reveal flags and path arguments', async () => {
  const f = fixture()
  const server = createFheServer(f.session)
  const client = new Client({ name: 'test', version: '1' })
  const [a, b] = InMemoryTransport.createLinkedPair()
  await Promise.all([server.connect(a), client.connect(b)])
  try {
    assert.deepEqual(
      (await client.listTools()).tools.map((x) => x.name).sort(),
      ['aura_proof', 'aura_roadmap', 'aura_start', 'fhe_compute', 'fhe_export', 'fhe_inputs', 'fhe_ops', 'fhe_release', 'fhe_status'],
    )
    for (const args of [{ value: 25 }, { path: '/secret' }, { reveal: true }]) {
      assert.equal((await client.callTool({ name: 'fhe_inputs', arguments: args })).isError, true)
    }
  } finally {
    await client.close()
    await server.close()
  }
})
