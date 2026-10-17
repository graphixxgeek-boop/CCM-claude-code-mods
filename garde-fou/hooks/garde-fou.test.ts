import { expect, test } from 'claude-code/testing'

test('refuse de changer l adresse distante git', async ($, on) => {
  on('tool.call', { tool: 'Bash' }, () => ({ result: 'ran' }))
  const r = await $.tool.call({ tool: 'Bash', command: 'git remote set-url origin https://x.y/z.git' })
  expect(JSON.stringify(r)).toContain('garde-fou')
})

test('laisse passer une commande ordinaire', async ($, on) => {
  on('tool.call', { tool: 'Bash' }, () => ({ result: 'ran' }))
  const r = await $.tool.call({ tool: 'Bash', command: 'git status' })
  expect(JSON.stringify(r)).not.toContain('garde-fou')
})

test('refuse une poussée forcée', async ($, on) => {
  on('tool.call', { tool: 'Bash' }, () => ({ result: 'ran' }))
  const r = await $.tool.call({ tool: 'Bash', command: 'git push --force origin claude/x' })
  expect(JSON.stringify(r)).toContain('garde-fou')
})
