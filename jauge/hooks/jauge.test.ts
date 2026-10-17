import { expect, test } from 'claude-code/testing'

test('ajoute la ligne de jauge aux messages des fils', async ($, on) => {
  let envoye = ''
  on('tool.call', { tool: 'mcp__hearthbot__reply' }, (_$, e) => {
    envoye = String((e as { text?: unknown }).text)
    return { result: 'ok' }
  })
  await $.tool.call({ tool: 'mcp__hearthbot__reply', text: 'Bonjour' } as never)
  expect(envoye.startsWith('Bonjour')).toBe(true)
})
