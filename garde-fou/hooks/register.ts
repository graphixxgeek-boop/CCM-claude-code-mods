import type { Register } from 'claude-code'

// Chaque règle porte sa raison : le refus l'affiche, pour que Claude et la personne la lisent.
const REGLES: { motif: RegExp; raison: string }[] = [
  { motif: /\bgit\s+remote\s+(set-url|add|remove|rm|rename)\b/, raison: "on ne change jamais l'adresse distante git" },
  { motif: /\bgit\s+push\b.*(\s--force\b|\s-f\b|--force-with-lease)/, raison: 'une poussée forcée efface du travail sur GitHub' },
  { motif: /\bgit\s+push\b.*\s(main|master)\b/, raison: 'on ne pousse jamais directement sur la branche principale' },
  { motif: /\brm\s+-[a-zA-Z]*r[a-zA-Z]*f?\s+(\/|~|\*|\.\s*$)/, raison: 'suppression massive de dossiers' },
  { motif: /\bgit\s+(reset\s+--hard|clean\s+-[a-zA-Z]*f)/, raison: 'efface des changements non sauvegardés' },
]

export const register: Register = on => {
  on('tool.call', { tool: 'Bash' }, ($, e, next) => {
    const regle = REGLES.find(r => r.motif.test(e.command))
    return regle ? { deny: `garde-fou : refusé, ${regle.raison}. Demandez d'abord à la personne responsable du projet.` } : next(e)
  }).catch(($, e, next) => (next.called ? next(e) : { deny: 'garde-fou : la vérification a échoué.' }))
}
