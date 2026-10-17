import type { Register } from 'claude-code'

// Une durée = l'écart de deux heures LUES sur l'horloge du moteur, jamais une impression.
const enClair = (ms: number) => {
  const s = Math.round(ms / 1000)
  return s < 60 ? `${s} s` : `${Math.floor(s / 60)} min ${String(s % 60).padStart(2, '0')} s`
}

export const register: Register = on => {
  let debut = 0
  let outils = 0

  on('prompt.submit', async ($, e, next) => {
    debut = await $.clock.now()
    outils = 0
    $.ui.status('Tour en cours…')
    return next(e)
  }).catch(($, e, next) => next(e))

  on('tool.call', ($, e, next) => {
    outils += 1
    return next(e)
  }).catch(($, e, next) => next(e))

  on('turn.complete', async ($, e, next) => {
    const ran = await next(e)
    if (debut > 0) {
      const duree = (await $.clock.now()) - debut
      $.ui.status(`Dernier tour : ${enClair(duree)}, ${outils} appel${outils > 1 ? 's' : ''} d'outil`)
    }
    return ran
  })
}
