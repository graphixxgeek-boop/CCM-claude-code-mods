import type { Register } from 'claude-code'

// Au-delà de ce seuil, on suppose que la personne est partie faire autre chose.
const SEUIL_MS = 60_000

export const register: Register = on => {
  let debut = 0

  on('prompt.submit', async ($, e, next) => {
    debut = await $.clock.now()
    return next(e)
  }).catch(($, e, next) => next(e))

  on('turn.complete', async ($, e, next) => {
    const ran = await next(e)
    const duree = debut > 0 ? (await $.clock.now()) - debut : 0
    if (duree >= SEUIL_MS) {
      const minutes = Math.round(duree / 60_000)
      const fin = e.reason === 'answer' ? 'Claude a fini' : 'Claude s\'est arrêté'
      $.ui.toast(`🔔 ${fin}, après ${minutes} min de travail.`)
    }
    return ran
  })
}
