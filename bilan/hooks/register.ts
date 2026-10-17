import type { Register } from 'claude-code'

const NOMS: Record<string, string> = { five_hour: 'quota 5 h', seven_day: 'quota 7 jours', spend_limit: 'plafond de dépense' }

export const register: Register = on => {
  let outils = 0

  on('session.start', async ($, e, next) => {
    await $.command.register({ name: 'bilan', description: 'Coût, durée, remplissage du fil et quotas de cette session' })
    return next(e)
  })

  on('tool.call', ($, e, next) => {
    outils += 1
    return next(e)
  }).catch(($, e, next) => next(e))

  on('command.run', { command: 'bilan' }, async $ => {
    const { startedAt, context, rateLimits, cost } = await $.session.usage()
    const minutes = Math.round(((await $.clock.now()) - startedAt) / 60_000)
    const lignes = [
      `Bilan de la session (chiffres lus sur le moteur, pas estimés)`,
      `- Durée : ${minutes} min`,
      `- Fil rempli à ${context.percent ?? '?'} % (${context.tokens ?? '?'} sur ${context.window} tokens)`,
      `- Appels d'outils depuis le chargement : ${outils}`,
      ...(cost ? [`- Coût : ${cost.usd.toFixed(2)} $`] : []),
      ...rateLimits.map(r => `- ${NOMS[r.kind] ?? r.kind} : ${r.percentUsed} %${r.resetsAt ? `, remis à zéro le ${r.resetsAt}` : ''}`),
    ]
    return { text: lignes.join('\n') }
  })
}
