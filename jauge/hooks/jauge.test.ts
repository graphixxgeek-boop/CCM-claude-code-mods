import { expect, test } from 'claude-code/testing'

// Dans un test, rien ne répond à la place du moteur : on lui fait rendre une mesure fixe.
const usage = {
  startedAt: 0,
  context: { percent: 42 },
  rateLimits: [{ kind: 'five_hour', percentUsed: 3 }, { kind: 'seven_day', percentUsed: 50 }],
}

// L'outil de réponse des fils a changé de nom (reply, puis post_message) : les deux doivent porter la ligne.
for (const outil of ['mcp__hearthbot__post_message', 'mcp__hearthbot__reply']) {
  test(`ajoute la ligne de jauge aux messages des fils (${outil})`, async ($, on) => {
    on('session.usage', () => ({ value: usage }) as never)
    on('clock.now', () => ({ value: 60_000 }) as never)
    let envoye = ''
    on('tool.call', { tool: outil }, (_$, e) => {
      envoye = String((e as { text?: unknown }).text)
      return { result: 'ok' }
    })
    await $.tool.call({ tool: outil, text: 'Bonjour' } as never)
    expect(envoye.startsWith('Bonjour')).toBe(true)
    expect(envoye.includes('🚨 _fil rempli à 42 % · quota 5 h : 3 % · quota 7 j : 50 %')).toBe(true)
  })
}

test('laisse intact le texte de la liste des étapes', async ($, on) => {
  on('session.usage', () => ({ value: usage }) as never)
  let envoye = ''
  on('tool.call', { tool: 'mcp__hearthbot__update_progress_checklist' }, (_$, e) => {
    envoye = String((e as { text?: unknown }).text)
    return { result: 'ok' }
  })
  await $.tool.call({ tool: 'mcp__hearthbot__update_progress_checklist', text: 'Étapes' } as never)
  expect(envoye).toBe('Étapes')
})
