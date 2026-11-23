import type { Register, ThemeSetArgs, ThemeStyle, ThemeSound } from 'claude-code'

import { makeColors } from './make-colors.js'

// Holographic HUD: deep navy glass, bright cyan light, a touch of amber.
const { theme, problems } = makeColors({
  label: 'HUD holográfico',
  only: 'dark',
  roles: { accent: '#22d3ee', danger: '#f43f5e', success: '#34d399', warning: '#fbbf24', pro: '#a78bfa' },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#050d16',
        'surface-1': '#08141f',
        'surface-2': '#0b1a28',
        'surface-3': '#0e2031',
        'text-primary': '#e0f7ff',
        'text-secondary': '#a9d8e8',
        'text-muted': '#7fb3c6',
      },
    },
  },
})

// Drifting motes, placed once so the scene is the same on every load.
const MOTES = Array.from({ length: 26 }, (_, i) => {
  const x = (i * 137) % 1600
  const y = 200 + ((i * 251) % 800)
  const r = 1 + (i % 3) * 0.6
  const dur = 26 + (i % 7) * 5
  const delay = -((i * 3.7) % dur)
  return `<circle class="mote" cx="${x}" cy="${y}" r="${r}" style="animation-duration:${dur}s;animation-delay:${delay.toFixed(1)}s"/>`
}).join('')

// Equalizer bars for the data panel.
const BARS = Array.from({ length: 12 }, (_, i) => {
  const dur = 3 + (i % 5) * 0.9
  return `<rect class="bar" x="${i * 9}" y="0" width="5" height="34" style="animation-duration:${dur.toFixed(1)}s;animation-delay:-${(i * 0.7).toFixed(1)}s"/>`
}).join('')

// Ticks around the big ring, every 6 degrees, longer every 30.
const TICKS = Array.from({ length: 60 }, (_, i) => {
  const long = i % 5 === 0
  return `<line x1="0" y1="-118" x2="0" y2="${long ? -106 : -112}" transform="rotate(${i * 6})" stroke-opacity="${long ? 0.7 : 0.3}"/>`
}).join('')

const SCENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
<style>
  .spin { animation: spin 80s linear infinite; }
  .spinr { animation: spin 120s linear infinite reverse; }
  .spinf { animation: spin 36s linear infinite; }
  .sweep { animation: spin 9s linear infinite; }
  .core { animation: core 7s ease-in-out infinite; opacity: 0.6; }
  .blip { animation: blip 9s ease-out infinite; opacity: 0.2; }
  .scan { animation: scan 16s linear infinite; opacity: 0.22; }
  .mote { fill: #67e8f9; opacity: 0.35; animation: rise 30s linear infinite; }
  .bar { fill: #22d3ee; fill-opacity: 0.45; transform-box: fill-box; transform-origin: 50% 100%; transform: scaleY(0.5); animation: eq 4s ease-in-out infinite alternate; }
  .wave { stroke-dasharray: 8 6; animation: flow 6s linear infinite; }
  .hexes { animation: breathe 18s ease-in-out infinite; opacity: 0.5; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes core { 0%, 100% { opacity: 0.45; } 50% { opacity: 0.85; } }
  @keyframes blip { 0% { opacity: 0.9; } 60% { opacity: 0.15; } 100% { opacity: 0.15; } }
  @keyframes scan { from { transform: translateY(-140px); } to { transform: translateY(1140px); } }
  @keyframes rise { from { transform: translateY(0); } to { transform: translateY(-700px); } }
  @keyframes eq { from { transform: scaleY(0.25); } to { transform: scaleY(1); } }
  @keyframes flow { to { stroke-dashoffset: -140; } }
  @keyframes breathe { 0%, 100% { opacity: 0.35; } 50% { opacity: 0.65; } }
</style>
<defs>
  <radialGradient id="bg" cx="55%" cy="35%" r="80%">
    <stop offset="0" stop-color="#0b2740"/>
    <stop offset="0.55" stop-color="#061322"/>
    <stop offset="1" stop-color="#02060b"/>
  </radialGradient>
  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
    <path d="M40 0H0V40" fill="none" stroke="#22d3ee" stroke-opacity="0.05"/>
  </pattern>
  <pattern id="hex" width="56" height="97" patternUnits="userSpaceOnUse">
    <path d="M28 0L56 16V48L28 64L0 48V16Z M28 64V97 M0 97L0 81 M56 97V81" fill="none" stroke="#22d3ee" stroke-opacity="0.07"/>
  </pattern>
  <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#22d3ee" stop-opacity="0"/>
    <stop offset="0.5" stop-color="#22d3ee" stop-opacity="0.3"/>
    <stop offset="1" stop-color="#22d3ee" stop-opacity="0"/>
  </linearGradient>
  <radialGradient id="coreg">
    <stop offset="0" stop-color="#e0fbff" stop-opacity="0.9"/>
    <stop offset="0.35" stop-color="#22d3ee" stop-opacity="0.5"/>
    <stop offset="1" stop-color="#22d3ee" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="wedge" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#22d3ee" stop-opacity="0"/>
    <stop offset="1" stop-color="#22d3ee" stop-opacity="0.35"/>
  </linearGradient>
  <radialGradient id="vig" cx="50%" cy="50%" r="75%">
    <stop offset="0.6" stop-color="#000000" stop-opacity="0"/>
    <stop offset="1" stop-color="#000000" stop-opacity="0.55"/>
  </radialGradient>
</defs>
<rect width="1600" height="1000" fill="url(#bg)"/>
<rect class="hexes" width="1600" height="1000" fill="url(#hex)"/>
<rect width="1600" height="1000" fill="url(#grid)"/>
<g>${MOTES}</g>
<rect class="scan" x="0" y="0" width="1600" height="110" fill="url(#beam)"/>

<!-- reactor rings, top right -->
<svg x="0" y="0" width="1600" height="1000" viewBox="0 0 520 520" preserveAspectRatio="xMaxYMin meet">
  <g transform="translate(380 140)" fill="none" stroke="#22d3ee">
    <circle r="150" stroke-opacity="0.1"/>
    <circle r="134" stroke-opacity="0.22" stroke-dasharray="2 4"/>
    <g class="spinr">${TICKS}</g>
    <g class="spin">
      <path d="M0 -96A96 96 0 0 1 83 -48" stroke-width="4" stroke-opacity="0.75"/>
      <path d="M83 48A96 96 0 0 1 0 96" stroke-width="4" stroke-opacity="0.45"/>
      <path d="M-83 48A96 96 0 0 1 -83 -48" stroke-width="4" stroke-opacity="0.6"/>
    </g>
    <circle class="spinf" r="78" stroke-opacity="0.4" stroke-width="10" stroke-dasharray="3 9"/>
    <circle r="62" stroke-opacity="0.55"/>
    <g class="spinr">
      <path d="M0 -48L41.5 24L-41.5 24Z" stroke-opacity="0.35" stroke-width="1.5"/>
      <circle r="48" stroke-opacity="0.3" stroke-dasharray="24 8"/>
    </g>
    <circle class="core" r="36" fill="url(#coreg)" stroke="none"/>
    <circle r="12" fill="#cffafe" fill-opacity="0.55" stroke-opacity="0.9"/>
    <path d="M-170 0H-155 M155 0H170 M0 -170V-155 M0 155V170" stroke-opacity="0.5"/>
  </g>
</svg>

<!-- radar, bottom left -->
<svg x="0" y="0" width="1600" height="1000" viewBox="0 0 520 520" preserveAspectRatio="xMinYMax meet">
  <g transform="translate(120 400)" fill="none" stroke="#22d3ee">
    <circle r="90" stroke-opacity="0.35"/>
    <circle r="60" stroke-opacity="0.2"/>
    <circle r="30" stroke-opacity="0.2"/>
    <path d="M-90 0H90 M0 -90V90" stroke-opacity="0.15"/>
    <g class="sweep"><path d="M0 0L90 0A90 90 0 0 0 63.6 -63.6Z" fill="url(#wedge)" stroke="none"/><path d="M0 0H90" stroke-opacity="0.8"/></g>
    <circle class="blip" cx="38" cy="-52" r="3.5" fill="#fbbf24" stroke="none" style="animation-delay:-2s"/>
    <circle class="blip" cx="-46" cy="22" r="3" fill="#22d3ee" stroke="none" style="animation-delay:-5s"/>
    <circle class="blip" cx="58" cy="40" r="2.5" fill="#22d3ee" stroke="none" style="animation-delay:-7s"/>
    <path d="M-104 -104H-84 M-104 -104V-84 M104 104H84 M104 104V84" stroke-opacity="0.6" stroke-width="2"/>
  </g>
</svg>

<!-- data panel, top left -->
<svg x="0" y="0" width="1600" height="1000" viewBox="0 0 520 520" preserveAspectRatio="xMinYMin meet">
  <g transform="translate(36 40)" fill="none" stroke="#22d3ee">
    <path d="M0 14V0H14 M150 0H164V14 M164 96V110H150 M14 110H0V96" stroke-opacity="0.7" stroke-width="2"/>
    <path d="M12 18H90" stroke-opacity="0.6" stroke-width="3"/>
    <path d="M12 28H60" stroke="#fbbf24" stroke-opacity="0.5" stroke-width="2"/>
    <g transform="translate(14 50)" stroke="none">${BARS}</g>
    <path d="M12 96H152" stroke-opacity="0.2"/>
  </g>
</svg>

<!-- signal trace, bottom right -->
<svg x="0" y="0" width="1600" height="1000" viewBox="0 0 520 520" preserveAspectRatio="xMaxYMax meet">
  <g transform="translate(300 440)" fill="none" stroke="#22d3ee">
    <path d="M0 30H190" stroke-opacity="0.15"/>
    <path class="wave" d="M0 30L20 30L28 10L36 48L44 22L52 30L90 30L98 18L106 40L114 30L190 30" stroke-opacity="0.7" stroke-width="1.5"/>
    <path d="M0 0V8 M190 0V8 M0 60V52 M190 60V52" stroke-opacity="0.5"/>
  </g>
</svg>

<rect width="1600" height="1000" fill="url(#vig)"/>
</svg>`

// Message frames, drawn as nine-slice vectors so they fit any size.
const PANEL = '#0b2234'
const PANEL_SOFT = '#071622'

const STYLE: ThemeStyle = {
  Text: { fontFamily: ['mono'], fontSize: 14, lineHeight: 22, letterSpacing: 0.3 },
  Heading: { fontFamily: ['mono'], color: '#67e8f9', fontWeight: 'semibold', letterSpacing: 2 },
  // Your messages: a chamfered glass panel with a glowing edge and bright corners.
  UserMessage: {
    color: '#e0f7ff',
    backgroundColor: PANEL,
    paddingX: 18,
    paddingY: 14,
    shadow: { x: 0, y: 0, blur: 16, color: '#22d3ee55' },
    fill: {
      vector: {
        viewBox: 64,
        slice: 14,
        paths: [
          { d: 'M10 0H64V54L54 64H0V10Z', color: PANEL },
          { d: 'M10 0.75H63.25V53.7L53.7 63.25H0.75V10.3Z', strokeWidth: 1, color: '#22d3ee99' },
          { d: 'M0.75 10.3L10.3 0.75H26 M63.25 38V53.7L53.7 63.25', strokeWidth: 2.5, color: '#67e8f9' },
          { d: 'M58 3H61V6H58Z', color: '#fbbf24' },
        ],
      },
    },
  },
  // Replies: a darker pane with corner brackets and a cyan rail on the left.
  AssistantMessage: {
    color: '#e0f7ff',
    backgroundColor: PANEL_SOFT,
    padding: 16,
    paddingLeft: 20,
    shadow: { x: 0, y: 0, blur: 8, color: '#22d3ee22' },
    fill: {
      vector: {
        viewBox: 64,
        slice: 14,
        paths: [
          { d: 'M0 0H64V64H0Z', color: PANEL_SOFT },
          { d: 'M0 0H3V64H0Z', color: '#22d3eecc' },
          { d: 'M6 1H14 M50 1H63V12 M63 52V63H50', strokeWidth: 1.5, color: '#22d3ee88' },
          { d: 'M6 63H14', strokeWidth: 1.5, color: '#22d3ee55' },
        ],
      },
    },
  },
  ToolUse: {
    color: '#67e8f9',
    fontFamily: ['mono'],
    backgroundColor: '#081a27',
    borderColor: '#155e75',
    borderWidth: 1,
    radius: [0, 6, 0, 6],
    paddingX: 10,
  },
}

// Quiet hum of machinery, with an occasional soft chirp. Off until the person presses the speaker.
const SOUND: ThemeSound = {
  ambience: {
    layers: [
      { wave: 'sine', notes: ['A1', 'E2'], drone: true, gain: 0.18, filter: { type: 'lowpass', hz: 300 }, tremolo: { hz: 0.1, depth: 0.3 } },
      { wave: 'brown', drone: true, gain: 0.06, filter: { type: 'lowpass', hz: 500, to: 900 } },
      { wave: 'bell', notes: ['E6', 'B6', 'F#6', 'A6'], scatter: 0.05, gain: 0.06, release: 1.2, pan: 0.4 },
    ],
    reverb: 0.4,
  },
  cues: {
    send: { layers: [{ wave: 'triangle', notes: ['A5'], glide: 7, gain: 0.25, release: 0.15 }] },
    tool: { layers: [{ wave: 'sine', notes: ['E6'], gain: 0.12, release: 0.06 }] },
    done: { layers: [{ wave: 'bell', notes: ['E5', 'B5', 'E6'], step: 0.09, gain: 0.3, release: 0.8 }], reverb: 0.3 },
    ask: { layers: [{ wave: 'triangle', notes: ['C6', 'G5'], step: 0.12, gain: 0.25, release: 0.25 }] },
    error: { layers: [{ wave: 'square', notes: ['E3'], glide: -5, gain: 0.15, release: 0.4, filter: { type: 'lowpass', hz: 1200 } }] },
    click: { layers: [{ wave: 'bell', notes: ['C6', 'D6', 'E6', 'G6', 'A6'], gain: 0.2, release: 0.5 }] },
  },
}

const BASE: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'hud', glass: { blur: 3, tint: '#03080e', opacity: 0.4 } },
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }
    // Try the whole look, then without sound, then without style.
    const attempts: ThemeSetArgs[] = [{ ...BASE, style: STYLE, sound: SOUND }, { ...BASE, style: STYLE }, BASE]
    for (const look of attempts) {
      try {
        const set = await $.theme.set(look)
        if (!set.isDrawn) {
          $.ui.status(set.reason)
        }
        break
      } catch (error) {
        $.ui.log(String(error))
      }
    }

    return next(e)
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if (e.surface !== 'desktop' && e.surface !== 'mobile') {
      return next(e)
    }
    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Panel holográfico: reactor de anillos, radar, barras de datos y partículas cian" />
  })
}
