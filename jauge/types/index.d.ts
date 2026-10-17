export type Mesure = { percent: number | null; quota: number | null; alerte: boolean }

declare module 'claude-code' {
  interface PluginState {
    jauge: { mesure: Mesure | null; cachee: boolean }
  }
}
