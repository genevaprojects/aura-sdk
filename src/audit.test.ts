import { describe, test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (path: string) => readFileSync(join(root, path), 'utf8')

describe('repo audit — Encrypted MCP product surface', () => {
  test('root package is @aurafhe/mcp on github.com/aurafhe/mcp', () => {
    const pkg = JSON.parse(read('package.json')) as {
      name: string
      author: string
      repository: { url: string }
      homepage: string
    }
    assert.equal(pkg.name, '@aurafhe/mcp')
    assert.match(pkg.repository.url, /github\.com\/aurafhe\/mcp/)
    assert.match(pkg.author, /Mochi Labs/)
    assert.match(pkg.author, /gen@afhe\.io/)
    assert.equal(pkg.homepage, 'https://afhe.io')
  })

  test('story matches the deck: moat, distribution, three-step flow', () => {
    const story = read('docs/STORY.md')
    assert.match(story, /FHE is the moat/i)
    assert.match(story, /MCP is the distribution/i)
    assert.match(story, /Encrypt at the owner/i)
    assert.match(story, /Compute on ciphertext/i)
    assert.match(story, /Decrypt only at the recipient/i)
    assert.match(story, /assistants/i)
    assert.match(story, /Mochi Labs/)
    assert.match(story, /roadmap/i)
  })

  test('README does not ship SQL or inference as live capabilities', () => {
    const readme = read('README.md')
    assert.doesNotMatch(readme, /encrypted retrieval,\s*SQL,\s*inference/)
    assert.match(readme, /Encrypt at the owner/)
    assert.match(readme, /FHE is the moat/)
    assert.match(readme, /@aurafhe\/mcp/)
    assert.match(readme, /github\.com\/aurafhe\/mcp/)
  })

  test('canonical files point at aurafhe/mcp, not leftover product names', () => {
    assert.match(read('server.json'), /github\.com\/aurafhe\/mcp/)
    assert.match(read('clients/go/go.mod'), /^module github\.com\/aurafhe\/mcp\/clients\/go/m)
    assert.match(
      (JSON.parse(read('clients/typescript/package.json')) as { repository: { url: string } }).repository.url,
      /aurafhe\/mcp/,
    )
    assert.match(
      (JSON.parse(read('clients/cli/package.json')) as { repository: { url: string } }).repository.url,
      /aurafhe\/mcp/,
    )
    assert.match(read('clients/python/pyproject.toml'), /github\.com\/aurafhe\/mcp/)
    assert.doesNotMatch(read('clients/typescript/CONTRIBUTING.md'), /shield-sdk/)
    assert.doesNotMatch(read('clients/typescript/SECURITY.md'), /shield-sdk/)
    assert.doesNotMatch(read('clients/typescript/CHANGELOG.md'), /shield-sdk/)
    assert.match(read('LICENSE'), /Mochi Labs/)
  })
})
