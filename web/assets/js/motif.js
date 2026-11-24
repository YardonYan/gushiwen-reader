// 意象图形：20 种构图共用一套列位与基线，按篇目 seed 变化细节。
const COLS = [120, 360, 600, 840, 1080];
const HZ = 176;

function rng(seed) {
  let s = 0;
  for (let i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
const n = (v, d = 1) => Number(v.toFixed(d));
const INK = 'var(--site-fg)', ACC = 'var(--site-accent)', CEL = 'var(--celadon)', AMB = 'var(--amber)', MUT = 'var(--site-muted)';

function wave(y, amp, len, op, color, cls = '') {
  let d = `M-60 ${y}`;
  for (let x = -60; x <= 1260; x += len) d += ` q ${len / 4} ${-amp} ${len / 2} 0 t ${len / 2} 0`;
  return `<path class="ln ${cls}" d="${d}" stroke="${color}" stroke-width="2" opacity="${op}"/>`;
}
function stars(r, count, color) {
  let s = '';
  for (let i = 0; i < count; i++) {
    const c = COLS[i % 5] + (r() - 0.5) * 190;
    const y = 26 + r() * 104;
    s += `<circle class="pulse" cx="${n(c)}" cy="${n(y)}" r="${n(1.1 + r() * 2)}" fill="${color}" opacity=".7" style="animation-delay:${n(r() * 3, 2)}s"/>`;
  }
  return s;
}
function falls(r, count, color, kind = 'dot') {
  let s = '';
  for (let i = 0; i < count; i++) {
    const c = COLS[i % 5] + (r() - 0.5) * 230;
    const delay = n(r() * 4, 2), dur = n(3 + r() * 3, 2);
    if (kind === 'line') s += `<path class="fall" d="M${n(c)} 0 l-7 20" stroke="${color}" stroke-width="1.5" opacity=".6" style="animation-delay:${delay}s;animation-duration:${dur}s"/>`;
    else if (kind === 'petal') s += `<ellipse class="fall" cx="${n(c)}" cy="0" rx="4.6" ry="2.8" fill="${color}" opacity=".75" transform="rotate(${n(r() * 90)})" style="animation-delay:${delay}s;animation-duration:${dur}s"/>`;
    else s += `<circle class="fall" cx="${n(c)}" cy="0" r="${n(1.6 + r() * 2.4)}" fill="${color}" opacity=".8" style="animation-delay:${delay}s;animation-duration:${dur}s"/>`;
  }
  return s;
}
function bird(x, y, s, color) {
  return `<path class="ln bob" d="M${x} ${y} q${6 * s} ${-5 * s} ${12 * s} 0 q${6 * s} ${-5 * s} ${12 * s} 0" stroke="${color}" stroke-width="1.9" opacity=".8" style="animation-delay:${n(s)}s"/>`;
}
function disc(x, y, r, color, glow = true) {
  return `${glow ? `<circle cx="${x}" cy="${y}" r="${r * 2.1}" fill="${color}" opacity=".10"/>` : ''}
  <circle class="pulse" cx="${x}" cy="${y}" r="${r}" fill="${color}" opacity=".92"/>`;
}
function seal(ch) {
  return `<g opacity=".9"><rect x="1136" y="212" width="34" height="34" rx="2" fill="${ACC}"/>
  <text x="1153" y="237" font-size="20" text-anchor="middle" fill="var(--site-on-accent)" font-family="Kaiti SC,KaiTi,SimSun,serif">${ch}</text></g>`;
}
function ground(color = CEL, op = .16) {
  return `<path d="M0 ${HZ} H1200 V260 H0 Z" fill="${color}" opacity="${op}"/>
  <path class="ln" d="M0 ${HZ} H1200" stroke="${INK}" stroke-width="1.3" opacity=".3"/>`;
}
function peaks(list, color, op) {
  return list.map(([x, h, w]) => `<path d="M${x - w} ${HZ} L${x - w * .22} ${HZ - h * .72} L${x} ${HZ - h} L${x + w * .3} ${HZ - h * .6} L${x + w} ${HZ} Z" fill="${color}" opacity="${op}"/>`).join('');
}

const M = {
  sea(r) {
    return `${ground(CEL, .2)}
    ${peaks([[150, 62, 108]], CEL, .5)}
    ${disc(880, 74, 33, ACC)}
    <path class="ln" d="M880 112 V${HZ}" stroke="${ACC}" stroke-width="1.2" opacity=".3"/>
    ${[0, 1, 2, 3].map(i => `<path class="ln pulse" d="M${856 + i * 16} ${126 + i * 12} h${20 - i * 3}" stroke="${AMB}" stroke-width="2" opacity=".5" style="animation-delay:${i * .4}s"/>`).join('')}
    ${wave(192, 9, 96, .55, INK, 'drift')}
    ${wave(212, 12, 128, .4, CEL, 'drift-slow')}
    ${wave(234, 8, 80, .3, INK, 'drift')}`;
  },
  mountain(r) {
    return `${ground(CEL, .14)}
    ${peaks([[180, 74, 150], [600, 148, 210], [1010, 96, 165]], CEL, .42)}
    ${peaks([[400, 52, 120], [820, 66, 130]], INK, .16)}
    <path class="ln drift-slow" d="M120 108 q120 -16 240 0 t240 0" stroke="${INK}" stroke-width="1.4" opacity=".26"/>
    <path class="ln drift" d="M700 84 q100 -13 200 0 t200 0" stroke="${INK}" stroke-width="1.2" opacity=".2"/>
    ${bird(880, 62, 1, INK)}${bird(930, 78, .75, INK)}
    <path class="ln" d="M600 28 V${HZ - 148}" stroke="${ACC}" stroke-width="1.4" opacity=".45"/>`;
  },
  moon(r) {
    return `${ground(CEL, .12)}
    ${stars(r, 16, AMB)}
    <circle cx="856" cy="76" r="76" fill="${AMB}" opacity=".09"/>
    <circle class="pulse" cx="856" cy="76" r="40" fill="${AMB}" opacity=".9"/>
    <circle cx="874" cy="66" r="34" fill="var(--surface-2)" opacity=".55"/>
    <path class="ln drift-slow" d="M140 122 q160 -18 320 0 t320 0" stroke="${INK}" stroke-width="1.3" opacity=".22"/>
    ${wave(206, 5, 150, .3, AMB, 'drift-slow')}
    <path class="ln pulse" d="M836 196 h40 M828 212 h56 M844 228 h24" stroke="${AMB}" stroke-width="2" opacity=".45"/>`;
  },
  snow(r) {
    return `${ground(INK, .1)}
    <path d="M0 ${HZ} q160 -34 320 -6 t300 -14 t280 10 T1200 ${HZ} V260 H0 Z" fill="${INK}" opacity=".13"/>
    <g stroke="${INK}" stroke-width="2.2" fill="none" opacity=".62" stroke-linecap="round">
      <path d="M300 ${HZ} V104 M300 132 l-30 -26 M300 146 l32 -24 M300 116 l-20 -18 M300 120 l22 -16"/>
      <path d="M270 106 l-14 -10 M332 122 l16 -10"/>
    </g>
    ${peaks([[1020, 58, 150]], CEL, .3)}
    ${falls(r, 26, INK, 'dot')}
    <path class="ln" d="M0 240 H1200" stroke="${INK}" stroke-width="1" opacity=".18"/>`;
  },
  wind(r) {
    return `${ground(CEL, .1)}
    <g opacity=".78"><path d="M96 ${HZ} V132 L168 104 L240 132 V${HZ} Z" fill="none" stroke="${INK}" stroke-width="2.2"/>
    <path class="ln" d="M84 134 L168 100 L252 134" stroke="${ACC}" stroke-width="2.6"/>
    <path class="ln" d="M140 ${HZ} V152 h56 V${HZ}" stroke="${INK}" stroke-width="1.6" opacity=".6"/></g>
    ${[0, 1, 2, 3, 4].map(i => `<path class="ln drift" d="M${300 + i * 40} ${72 + i * 26} q180 ${-22 + i * 6} 380 ${-4 + i * 3} t400 ${10 - i * 2}" stroke="${i === 1 ? ACC : INK}" stroke-width="${2.4 - i * .25}" opacity="${.5 - i * .06}" style="animation-delay:${i * .5}s"/>`).join('')}
    ${falls(r, 12, AMB, 'petal')}`;
  },
  flower(r) {
    const bl = (x, y, s, c) => `<g class="bob" style="animation-delay:${n(s)}s">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="${x}" cy="${y - 9 * s}" rx="${4.6 * s}" ry="${9 * s}" fill="${c}" opacity=".82" transform="rotate(${a} ${x} ${y})"/>`).join('')}<circle cx="${x}" cy="${y}" r="${3.1 * s}" fill="${AMB}"/></g>`;
    return `${ground(CEL, .12)}
    <path class="ln" d="M40 250 Q220 200 360 140 T700 78" stroke="${INK}" stroke-width="3" opacity=".68"/>
    <path class="ln" d="M360 140 q40 -34 92 -30 M540 108 q34 -30 78 -26" stroke="${INK}" stroke-width="1.8" opacity=".5"/>
    ${bl(360, 138, 1.5, ACC)}${bl(556, 104, 1.15, ACC)}${bl(716, 76, 1.7, ACC)}${bl(238, 182, .95, ACC)}${bl(900, 120, 1.05, ACC)}
    ${falls(r, 12, ACC, 'petal')}
    ${wave(228, 4, 130, .22, CEL, 'drift-slow')}`;
  },
  river(r) {
    return `${ground(CEL, .2)}
    <path class="ln" d="M0 150 q200 16 420 6 t400 -10 T1200 148" stroke="${CEL}" stroke-width="2.4" opacity=".55"/>
    ${peaks([[120, 46, 130], [1080, 40, 140]], CEL, .34)}
    ${wave(198, 6, 110, .45, INK, 'drift')}
    ${wave(222, 8, 140, .3, CEL, 'drift-slow')}
    <g class="bob"><path d="M796 ${HZ - 4} h84 l-14 22 h-56 Z" fill="${INK}" opacity=".72"/>
    <path class="ln" d="M838 ${HZ - 4} V96" stroke="${INK}" stroke-width="2.2"/>
    <path d="M840 100 q40 22 4 44 Z" fill="${ACC}" opacity=".85"/></g>
    ${bird(330, 66, 1.1, INK)}${bird(382, 84, .8, INK)}${bird(286, 92, .7, INK)}`;
  },
  boat(r) {
    return `${ground(CEL, .18)}
    ${peaks([[140, 50, 160], [1060, 44, 170]], CEL, .26)}
    <g class="bob"><path d="M520 196 q80 30 168 0 l-22 26 h-124 Z" fill="${INK}" opacity=".8"/>
    <path class="ln" d="M604 196 V82" stroke="${INK}" stroke-width="2.6"/>
    <path d="M606 86 q56 34 6 76 Z" fill="${ACC}" opacity=".88"/>
    <path class="ln" d="M604 108 h-40" stroke="${INK}" stroke-width="1.6" opacity=".6"/></g>
    ${wave(226, 7, 104, .5, INK, 'drift')}
    ${wave(244, 5, 140, .3, CEL, 'drift-slow')}
    ${bird(900, 70, .9, INK)}`;
  },
  fortress(r) {
    let wall = `<path d="M0 ${HZ + 26} H1200 V260 H0 Z" fill="${INK}" opacity=".2"/>`;
    for (let x = 0; x < 1200; x += 62) wall += `<rect x="${x}" y="${HZ + 8}" width="38" height="20" fill="${INK}" opacity=".34"/>`;
    return `${ground(CEL, .1)}
    ${disc(900, 96, 34, ACC)}
    <path d="M286 ${HZ + 10} V96 h74 V${HZ + 10} Z" fill="${INK}" opacity=".55"/>
    <path class="ln" d="M276 96 h94 M300 96 V78 h46 V96" stroke="${INK}" stroke-width="2.4" opacity=".7"/>
    <path class="ln pulse" d="M323 74 V16" stroke="${AMB}" stroke-width="3.4" opacity=".65"/>
    <path class="ln drift-slow" d="M323 20 q26 -12 44 -4" stroke="${AMB}" stroke-width="2" opacity=".35"/>
    ${wall}
    ${peaks([[1080, 40, 150]], CEL, .26)}`;
  },
  tower(r) {
    const tier = (y, w, op) => `<path class="ln" d="M${600 - w} ${y} q${w} -22 ${w * 2} 0" stroke="${ACC}" stroke-width="2.6" opacity="${op}"/>
    <path d="M${600 - w + 22} ${y} h${(w - 22) * 2} v${30} h${-(w - 22) * 2} Z" fill="${INK}" opacity="${op * .5}"/>`;
    return `${ground(CEL, .14)}
    ${tier(150, 108, .9)}${tier(112, 86, .8)}${tier(78, 62, .7)}
    <path class="ln" d="M600 78 V44" stroke="${ACC}" stroke-width="2.4"/>
    <circle cx="600" cy="40" r="5" fill="${AMB}"/>
    <path class="ln drift-slow" d="M120 96 q120 -16 240 0" stroke="${INK}" stroke-width="1.3" opacity=".24"/>
    <path class="ln drift" d="M840 76 q110 -14 220 0" stroke="${INK}" stroke-width="1.2" opacity=".2"/>
    ${wave(216, 6, 120, .38, CEL, 'drift')}
    ${bird(260, 60, .9, INK)}`;
  },
  field(r) {
    let rows = '';
    for (let i = 0; i < 7; i++) rows += `<path class="ln" d="M${-120 + i * 60} 260 L${330 + i * 78} ${HZ}" stroke="${CEL}" stroke-width="1.5" opacity=".38"/>`;
    return `${ground(CEL, .18)}${rows}
    <path class="ln" d="M0 200 H1200 M0 226 H1200" stroke="${CEL}" stroke-width="1.2" opacity=".26"/>
    <g opacity=".8"><path d="M96 ${HZ} V140 L156 116 L216 140 V${HZ} Z" fill="none" stroke="${INK}" stroke-width="2.2"/>
    <path class="ln" d="M86 142 L156 112 L226 142" stroke="${ACC}" stroke-width="2.4"/></g>
    <g stroke="${INK}" stroke-width="2.4" fill="none" opacity=".6" stroke-linecap="round">
      <path d="M1040 ${HZ} V126"/><path d="M1040 148 q-28 -10 -34 -34 M1040 142 q28 -12 34 -36 M1040 126 q-16 -14 -14 -30"/>
    </g>
    <path class="ln" d="M420 260 q120 -50 200 -84" stroke="${AMB}" stroke-width="2.2" opacity=".5" stroke-dasharray="7 9"/>`;
  },
  lamp(r) {
    return `${ground(INK, .08)}
    <g opacity=".4" stroke="${INK}" stroke-width="1.6" fill="none">
      <rect x="72" y="52" width="180" height="124"/><path d="M132 52 V176 M192 52 V176 M72 114 H252"/>
    </g>
    <circle class="pulse" cx="600" cy="118" r="86" fill="${AMB}" opacity=".13"/>
    <circle class="pulse" cx="600" cy="118" r="46" fill="${AMB}" opacity=".16" style="animation-delay:.6s"/>
    <path d="M600 152 q-17 -22 0 -46 q17 24 0 46 Z" fill="${AMB}" opacity=".95"/>
    <path class="ln" d="M588 154 h24 l-5 26 h-14 Z" stroke="${INK}" stroke-width="2.2" opacity=".8"/>
    <path class="ln" d="M600 180 V${HZ}" stroke="${INK}" stroke-width="2.4" opacity=".7"/>
    <g opacity=".55" stroke="${INK}" stroke-width="1.8" fill="none">
      <path d="M880 150 h180 M880 162 h180 M880 174 h150"/><path d="M880 142 q90 -14 180 0"/>
    </g>
    ${stars(r, 5, AMB)}`;
  },
  sword(r) {
    return `${ground(CEL, .1)}
    <g class="bob"><path d="M430 224 L760 62" stroke="${INK}" stroke-width="7" opacity=".85" stroke-linecap="round"/>
    <path d="M430 224 L760 62" stroke="${AMB}" stroke-width="2" opacity=".8"/>
    <path class="ln" d="M470 196 l-34 34 M452 214 l-22 -22" stroke="${ACC}" stroke-width="4"/>
    <circle cx="418" cy="240" r="7" fill="${ACC}"/></g>
    ${[0, 1, 2, 3].map(i => `<path class="ln pulse" d="M${700 + i * 26} ${88 - i * 12} l${44 + i * 8} ${-20 - i * 4}" stroke="${AMB}" stroke-width="1.8" opacity=".5" style="animation-delay:${i * .35}s"/>`).join('')}
    <g opacity=".7"><path class="ln" d="M150 ${HZ} V70" stroke="${INK}" stroke-width="2.6"/>
    <path class="ln drift-slow" d="M152 74 q66 14 96 -6 q-30 34 -96 26 Z" fill="${ACC}" opacity=".8" stroke="none"/></g>
    ${peaks([[1040, 62, 170]], CEL, .3)}`;
  },
  horse(r) {
    return `${ground(CEL, .12)}
    ${peaks([[140, 66, 170], [1060, 58, 180]], CEL, .3)}
    <g class="bob" opacity=".88">
      <path d="M520 190 q26 -34 74 -34 q40 0 62 22 l26 -6 q14 -2 12 10 l-8 22 q-4 10 -16 8 l-20 -4 q-16 22 -50 22 q-40 0 -60 -22 Z" fill="${INK}"/>
      <path class="ln" d="M540 208 V240 M576 212 V240 M636 210 V240 M664 204 V240" stroke="${INK}" stroke-width="5"/>
      <path class="ln" d="M676 176 q22 -20 34 -4" stroke="${INK}" stroke-width="4"/>
      <path class="ln" d="M520 190 q-24 6 -30 26" stroke="${INK}" stroke-width="3.4"/>
    </g>
    ${[0, 1, 2, 3, 4].map(i => `<circle class="drift" cx="${430 - i * 34}" cy="${228 + (i % 2) * 8}" r="${4 - i * .5}" fill="${MUT}" opacity=".4" style="animation-delay:${i * .4}s"/>`).join('')}
    <path class="ln" d="M0 246 H1200" stroke="${INK}" stroke-width="1.2" opacity=".22"/>
    ${bird(900, 62, .85, INK)}`;
  },
  pine(r) {
    const trunk = (x, h, w, op) => `<g opacity="${op}"><path class="ln" d="M${x} ${HZ} V${HZ - h}" stroke="${INK}" stroke-width="${w}"/>
    ${[.3, .55, .78].map(f => `<path class="ln" d="M${x - 12} ${HZ - h * f} h24" stroke="${INK}" stroke-width="1.5" opacity=".6"/>`).join('')}
    ${[.42, .66, .88].map((f, i) => `<path class="ln" d="M${x} ${HZ - h * f} q${i % 2 ? 34 : -34} -12 ${i % 2 ? 52 : -52} -26 M${x} ${HZ - h * f} q${i % 2 ? 26 : -26} -22 ${i % 2 ? 40 : -40} -40" stroke="${CEL}" stroke-width="2.4"/>`).join('')}</g>`;
    return `${ground(CEL, .14)}
    ${trunk(150, 140, 5, .8)}${trunk(268, 108, 4, .6)}${trunk(1010, 128, 5, .72)}${trunk(1108, 92, 3.6, .5)}
    <path d="M700 ${HZ + 12} q40 -34 96 -14 q34 12 22 26 Z" fill="${INK}" opacity=".3"/>
    <path class="ln" d="M716 ${HZ + 4} q40 -18 78 -4" stroke="${INK}" stroke-width="1.4" opacity=".4"/>
    ${wave(234, 4, 140, .22, CEL, 'drift-slow')}
    ${bird(560, 66, .8, INK)}`;
  },
  lotus(r) {
    const petal = (x, y, s) => `<g class="bob" style="animation-delay:${n(s)}s">${[-46, -22, 0, 22, 46].map(a => `<path d="M${x} ${y} q${-7 * s} ${-22 * s} 0 ${-34 * s} q${7 * s} ${12 * s} 0 ${34 * s} Z" fill="${ACC}" opacity=".8" transform="rotate(${a} ${x} ${y})"/>`).join('')}<circle cx="${x}" cy="${y - 6 * s}" r="${4 * s}" fill="${AMB}"/></g>`;
    return `${ground(CEL, .2)}
    ${wave(200, 5, 120, .4, CEL, 'drift')}
    ${wave(226, 6, 150, .28, INK, 'drift-slow')}
    <ellipse cx="330" cy="192" rx="86" ry="24" fill="${CEL}" opacity=".55"/>
    <path class="ln" d="M330 192 V150" stroke="${CEL}" stroke-width="2.6" opacity=".7"/>
    <ellipse cx="880" cy="196" rx="70" ry="20" fill="${CEL}" opacity=".45"/>
    <path class="ln" d="M880 196 V162" stroke="${CEL}" stroke-width="2.4" opacity=".6"/>
    <path class="ln" d="M600 208 V138" stroke="${CEL}" stroke-width="3" opacity=".8"/>
    ${petal(600, 140, 1.5)}
    <path class="ln" d="M600 176 q-30 -8 -40 -30 M600 186 q32 -6 44 -26" stroke="${CEL}" stroke-width="2" opacity=".6"/>`;
  },
  rain(r) {
    return `${ground(CEL, .14)}
    <g opacity=".45" stroke="${INK}" stroke-width="1.6" fill="none">
      <rect x="86" y="56" width="164" height="118"/><path d="M140 56 V174 M194 56 V174 M86 116 H250"/>
    </g>
    <ellipse cx="620" cy="222" rx="230" ry="26" fill="${CEL}" opacity=".3"/>
    ${[0, 1, 2].map(i => `<ellipse class="pulse" cx="${560 + i * 62}" cy="${218 + i * 4}" rx="${20 + i * 12}" ry="${5 + i * 3}" fill="none" stroke="${INK}" stroke-width="1.3" opacity=".35" style="animation-delay:${i * .7}s"/>`).join('')}
    ${falls(r, 30, INK, 'line')}
    <path class="ln" d="M1020 ${HZ} V140" stroke="${INK}" stroke-width="2.4" opacity=".7"/>
    <path d="M1020 138 q-11 -16 0 -30 q11 15 0 30 Z" fill="${AMB}" opacity=".95"/>
    <circle class="pulse" cx="1020" cy="126" r="30" fill="${AMB}" opacity=".14"/>`;
  },
  city(r) {
    let cren = '';
    for (let x = 200; x < 1000; x += 56) cren += `<rect x="${x}" y="128" width="32" height="18" fill="${INK}" opacity=".4"/>`;
    return `${ground(CEL, .16)}
    <path d="M200 ${HZ} V146 H1000 V${HZ} Z" fill="${INK}" opacity=".26"/>
    ${cren}
    <path class="ln" d="M188 146 H1012" stroke="${INK}" stroke-width="2.4" opacity=".6"/>
    <path d="M540 ${HZ} V176 q60 -34 120 0 V${HZ} Z" fill="var(--site-bg)" opacity=".55"/>
    ${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<path class="ln" d="M${230 + i * 104} ${HZ + 22} q4 -18 10 -24 M${236 + i * 104} ${HZ + 22} q-2 -16 -8 -22" stroke="${CEL}" stroke-width="1.8" opacity=".55"/>`).join('')}
    <path class="ln pulse" d="M820 126 V52" stroke="${MUT}" stroke-width="3" opacity=".4"/>
    ${falls(r, 9, ACC, 'petal')}
    ${bird(300, 66, .9, INK)}`;
  },
  spring(r) {
    return `${ground(CEL, .18)}
    ${wave(212, 5, 130, .38, CEL, 'drift')}
    ${[0, 1, 2, 3, 4, 5].map(i => `<path class="ln bob" d="M${100 + i * 190} 0 q${i % 2 ? 16 : -16} 60 ${i % 2 ? 6 : -6} ${104 + (i % 3) * 22}" stroke="${CEL}" stroke-width="2" opacity=".55" style="animation-delay:${i * .35}s"/>`).join('')}
    ${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<circle cx="${118 + i * 152}" cy="${118 + (i % 3) * 26}" r="${4.4 - (i % 3)}" fill="${ACC}" opacity=".7"/>`).join('')}
    ${bird(430, 74, 1.15, INK)}${bird(760, 58, .95, INK)}${bird(880, 92, .7, INK)}
    <path class="ln" d="M0 ${HZ} H1200" stroke="${CEL}" stroke-width="1.6" opacity=".4"/>
    ${[0, 1, 2].map(i => `<path class="ln" d="M${300 + i * 300} ${HZ + 20} q10 -20 22 -24" stroke="${CEL}" stroke-width="2" opacity=".5"/>`).join('')}`;
  },
  autumn(r) {
    return `${ground(CEL, .1)}
    ${disc(1050, 104, 30, ACC)}
    <g stroke="${INK}" stroke-width="3" fill="none" opacity=".72" stroke-linecap="round">
      <path d="M170 ${HZ} V112 q-4 -22 14 -30"/><path d="M184 96 q26 -12 40 -34 M180 124 q-30 -8 -44 -30 M186 108 q30 4 48 -12"/>
      <path d="M150 140 q-40 12 -60 44 q34 -18 62 -12" stroke-width="2"/>
    </g>
    <g fill="${INK}" opacity=".8"><path d="M222 74 q12 -10 22 -2 q-6 10 -22 2 Z"/><circle cx="240" cy="70" r="3.4"/></g>
    <path class="ln" d="M420 ${HZ + 16} q90 -56 180 0" stroke="${INK}" stroke-width="3" opacity=".65"/>
    <path class="ln" d="M420 ${HZ + 16} H600" stroke="${INK}" stroke-width="1.6" opacity=".35"/>
    ${wave(222, 5, 110, .35, CEL, 'drift')}
    <path class="ln" d="M660 244 H1200" stroke="${MUT}" stroke-width="2" opacity=".4" stroke-dasharray="16 12"/>
    <g opacity=".8" class="bob"><path d="M800 216 q18 -22 46 -22 q26 0 38 14 l16 -4 q9 -1 8 7 l-6 14 q-3 6 -10 5 l-13 -3 q-10 14 -32 14 q-26 0 -38 -14 Z" fill="${INK}"/>
    <path class="ln" d="M812 228 V246 M836 230 V246 M872 228 V246 M890 224 V246" stroke="${INK}" stroke-width="3.4"/></g>
    ${bird(560, 54, .8, INK)}`;
  }
};

const ALIAS = { lake: 'sea', desert: 'fortress', road: 'horse', village: 'field', house: 'lamp', temple: 'pine', plum: 'flower', chrysanthemum: 'flower', mirror: 'lamp' };

export function motifSVG(motif, opts = {}) {
  const key = M[motif] ? motif : (ALIAS[motif] || 'mountain');
  const seed = opts.seed || key;
  const r = rng(seed);
  const body = M[key](r);
  const compact = !!opts.compact;
  const vb = compact ? '180 20 840 240' : '0 0 1200 260';
  return `<svg class="motif-svg" viewBox="${vb}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
    ${body}${compact ? '' : seal(opts.seal || '诗')}
  </svg>`;
}

export const MOTIF_NAMES = {
  sea: '沧海', mountain: '山岳', moon: '明月', snow: '风雪', wind: '秋风', flower: '花草',
  river: '江河', boat: '舟帆', fortress: '边塞', tower: '楼台', field: '田园', lamp: '灯窗',
  sword: '剑旗', horse: '车马', pine: '松竹', lotus: '莲荷', rain: '夜雨', city: '城郭',
  spring: '春景', autumn: '秋思'
};