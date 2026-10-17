import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { Mesure } from '../types'

const mesure = atom({ plugin: 'jauge', key: 'mesure' } as const, null)
const cachee = atom({ plugin: 'jauge', key: 'cachee' } as const, false)

const SEUIL_ALERTE = 85
const CASES = 10

// Relit la vraie mesure du moteur, jamais une estimation (heures et chiffres lus, jamais tapés).
async function mesurer($: EngineInterface) {
  const { context, rateLimits } = await $.session.usage()
  const percent = context.percent ?? null
  const cinqHeures = rateLimits.find(r => r.kind === 'five_hour')
  const avant = await read($, mesure)
  const alerte = percent !== null && percent >= SEUIL_ALERTE
  const m: Mesure = { percent, quota: cinqHeures?.percentUsed ?? null, alerte }
  await update($, mesure, () => m)
  if (alerte && !avant?.alerte) {
    $.ui.toast(`Jauge : le fil est plein à ${percent} %. Pensez à résumer ou à ouvrir un fil neuf.`)
  }
}

export const register: Register = on => {
  on('turn.complete', async ($, e, next) => {
    const ran = await next(e)
    await mesurer($)
    return ran
  })

  on('tool.call', async ($, e, next) => {
    const ran = await next(e)
    await mesurer($)
    return ran
  }).catch(($, e, next) => next(e))

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const m = await read($, mesure)
    if (e.props.hasSurvey || m === null || m.percent === null || (await read($, cachee))) {
      return next(e)
    }

    const { Box, Button, Text } = $.ui.resolve(e)
    const pleines = Math.round((m.percent / 100) * CASES)
    const barre = '█'.repeat(pleines) + '░'.repeat(CASES - pleines)
    const couleur = m.percent >= SEUIL_ALERTE ? 'red' : m.percent >= 60 ? 'yellow' : 'green'

    return (
      <Box>
        <Text>Jauge </Text>
        <Text color={couleur}>{barre}</Text>
        <Text> {m.percent} % du fil</Text>
        {m.quota !== null && <Text dimColor> · quota 5 h : {m.quota} %</Text>}
        <Text> </Text>
        <Button key="cacher" label="Cacher" onPress={() => update($, cachee, () => true)} />
      </Box>
    )
  })
}
