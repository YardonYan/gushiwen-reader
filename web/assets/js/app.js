import { renderPiece } from './reader.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const norm = s => String(s ?? '').toLowerCase().replace(/\s+/g, '');

const store = {
  get(k, d) { try { const v = localStorage.getItem('duben.' + k); return v === null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem('duben.' + k, JSON.stringify(v)); } catch { /* 隐私模式下忽略 */ } }
};

const state = {
  catalog: [], source: null, cache: new Map(),
  q: '', grade: '', genre: '', syllabus: '', catalogVersion: 0,
  route: { name: 'catalog', id: null }
};

const TYPE_LABEL = ['小', '稍小', '标准', '大', '特大'];

/* ---------- 抬头控件 ---------- */
function applyPrefs() {
  const theme = store.get('theme', 'xuanzhi');
  const py = store.get('pinyin', 'hard');
  const ty = store.get('type', 2);
  setTheme(theme, false);
  setPinyin(py, false);
  setType(ty, false);
}
function setTheme(v, save = true) {
  document.documentElement.dataset.theme = v;
  $$('[data-theme-set]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.themeSet === v)));
  const meta = $('meta[name="theme-color"]');
  if (meta) meta.content = v === 'xuanzhi' ? '#f4f0e6' : '#101614';
  if (save) store.set('theme', v);
}
function setPinyin(v, save = true) {
  document.documentElement.dataset.pinyin = v;
  $$('[data-pinyin]').forEach(b => { if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', String(b.dataset.pinyin === v)); });
  if (save) store.set('pinyin', v);
}
function setType(v, save = true) {
  const t = Math.max(0, Math.min(4, v));
  document.documentElement.dataset.type = String(t);
  $('#type-out').textContent = TYPE_LABEL[t];
  $('#type-down').disabled = t === 0;
  $('#type-up').disabled = t === 4;
  if (save) store.set('type', t);
}

let toastTimer;
export function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
}

/* ---------- 搜索 ---------- */
function hl(text, q) {
  const t = String(text ?? '');
  if (!q) return esc(t);
  const i = norm(t).indexOf(norm(q));
  if (i < 0) return esc(t);
  const raw = t.toLowerCase();
  const j = raw.indexOf(q.toLowerCase());
  if (j < 0) return esc(t);
  return esc(t.slice(0, j)) + '<mark>' + esc(t.slice(j, j + q.length)) + '</mark>' + esc(t.slice(j + q.length));
}

async function loadSource() {
  if (state.source) return state.source;
  try {
    const r = await fetch('data/source.json');
    state.source = await r.json();
  } catch { state.source = {}; }
  return state.source;
}

function matchCatalog(p, q) {
  if (!q) return 0;
  const nq = norm(q);
  const t = norm(p.title), a = norm(p.author), k = norm(p.keys), f = norm(p.first);
  if (t === nq) return 100;
  if (t.startsWith(nq)) return 80;
  if (t.includes(nq)) return 65;
  if (a.includes(nq)) return 50;
  if (k.includes(nq)) return 40;
  if (f.includes(nq)) return 34;
  if (norm(p.dynasty).includes(nq) || norm(p.grade).includes(nq)) return 20;
  return 0;
}

function snippet(text, q) {
  const i = text.indexOf(q);
  if (i < 0) return '';
  const s = Math.max(0, i - 12);
  return (s > 0 ? '…' : '') + text.slice(s, Math.min(text.length, i + q.length + 18)).replace(/\n/g, ' ');
}

async function computeResults(version = state.catalogVersion) {
  const q = state.q.trim();
  let list = state.catalog.filter(p =>
    (!state.grade || p.grade === state.grade) &&
    (!state.genre || p.genre === state.genre) &&
    (!state.syllabus || (state.syllabus === 'exam' ? !!p.exam : p.syllabus === state.syllabus))
  );

  if (!q) return { list: list.map(p => ({ p, score: 0, snip: '' })), total: list.length, byText: 0 };

  const scored = [];
  let byText = 0;
  for (const p of list) {
    const s = matchCatalog(p, q);
    if (s > 0) scored.push({ p, score: s, snip: '' });
  }
  if (q) {
    const src = await loadSource();
    if (version !== state.catalogVersion) return null;
    const have = new Set(scored.map(x => x.p.id));
    for (const p of list) {
      if (have.has(p.id)) continue;
      const text = src[p.id];
      if (typeof text === 'string' && text.includes(q)) {
        scored.push({ p, score: 30, snip: snippet(text, q) });
        byText++;
      }
    }
  }
  scored.sort((a, b) => b.score - a.score || (a.p.no || 999) - (b.p.no || 999));
  return { list: scored, total: scored.length, byText };
}

function cardHTML(p, q, snip) {
  const tags = [];
  tags.push(`<span class="tag">${esc(p.grade)}</span>`);
  tags.push(`<span class="tag">${esc(p.genre)}</span>`);
  tags.push(p.syllabus === '课标'
    ? `<span class="tag tag-ke">课标${p.no ? ' No.' + String(p.no).padStart(2, '0') : ''}</span>`
    : '<span class="tag tag-jiao">教材增补</span>');
  if (p.exam) tags.push(`<span class="tag tag-exam" title="广东卷：${esc(p.exam)}">广东卷 ${esc(p.exam)}</span>`);
  return `<a class="card index-card" href="#/p/${esc(p.id)}" data-id="${esc(p.id)}">
    <span class="work-number">${p.no ? String(p.no).padStart(2, '0') : '补'}</span>
    <span class="work-name">
      <span class="card-title">${hl(p.title, q)}</span>
      <span class="card-meta">${hl(p.author, q)}<i></i>${esc(p.dynasty)}</span>
    </span>
    <span class="card-first">${snip ? hl(snip, q) : hl(p.first, q)}</span>
    <span class="card-tags">${tags.join('')}</span>
    <span class="work-enter" aria-hidden="true">↗</span>
  </a>`;
}

async function renderCatalog() {
  const body = $('#catalog-body');
  const version = ++state.catalogVersion;
  const result = await computeResults(version);
  if (!result || version !== state.catalogVersion || state.route.name !== 'catalog') return;
  const { list, total, byText } = result;
  const q = state.q.trim();
  const filtering = !!(q || state.grade || state.genre || state.syllabus);

  $('#result-line').innerHTML = filtering
    ? `找到 <b>${total}</b> 篇${byText ? `，其中 <b>${byText}</b> 篇是按原文诗句匹配到的` : ''}`
    : '按年级排列。点任意一篇，独占整页解读。';
  $('#catalog-empty').hidden = total > 0;
  $('#q-clear').hidden = !q;
  $('#search-hint').textContent = q
    ? (total ? '回车或点卡片进入整页解读。' : '换个词试试：篇名、作者，或诗文中的字词。')
    : '试试：曹操 / 月 / 先天下之忧而忧 / 岳阳楼';

  if (!total) { body.innerHTML = ''; return; }

  if (q || state.genre || state.syllabus) {
    body.innerHTML = `<div class="cards index-list">${list.map(x => cardHTML(x.p, q, x.snip)).join('')}</div>`;
  } else {
    const groups = new Map();
    for (const x of list) {
      const g = x.p.grade;
      if (!groups.has(g)) groups.set(g, []);
      groups.get(g).push(x);
    }
    const order = ['七上', '七下', '八上', '八下', '九上', '九下', '课标推荐'];
    const gradeNote = {
      '七上': '四时景物 · 天伦亲情 · 学习之道',
      '七下': '家国担当 · 人物风骨 · 山林之乐',
      '八上': '山川名胜 · 史传文采 · 诗中有画',
      '八下': '民生疾苦 · 君子之志 · 大道之行',
      '九上': '迁谪与行旅 · 议论文脉 · 历史现场',
      '九下': '家国天下 · 英雄抱负 · 读书明理',
      '课标推荐': '教材之外 · 课标要求背诵'
    };
    body.innerHTML = [...groups.entries()]
      .sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]))
      .map(([g, items]) => `<section class="grade-group">
        <header class="grade-head"><h2>${esc(g)}</h2><p>${esc(gradeNote[g] || '')}</p><span>${items.length} 篇</span></header>
        <div class="cards index-list">${items.map(x => cardHTML(x.p, '', '')).join('')}</div>
      </section>`).join('');
  }
}

/* ---------- 路由 ---------- */
function parseHash() {
  const h = location.hash.replace(/^#/, '');
  const m = h.match(/^\/p\/([a-z0-9-]+)$/i);
  if (m) return { name: 'piece', id: m[1] };
  return { name: 'catalog', id: null };
}

async function route() {
  const r = parseHash();
  state.route = r;
  const cat = $('#view-catalog'), piece = $('#view-piece');
  if (r.name === 'catalog') {
    piece.hidden = true; piece.innerHTML = '';
    cat.hidden = false;
    document.title = '古诗文读本 · 广东中考必背篇目逐字逐词完全解读';
    await renderCatalog();
    window.scrollTo({ top: 0, behavior: 'auto' });
  } else {
    cat.hidden = true;
    piece.hidden = false;
    await openPiece(r.id);
  }
}

async function openPiece(id) {
  const host = $('#view-piece');
  const meta = state.catalog.find(p => p.id === id);
  if (!meta) {
    host.innerHTML = `<div class="piece"><div class="load-error"><b>没有找到这一篇</b><p>目录里没有这个篇目。</p><a class="btn" href="#/">回到目录</a></div></div>`;
    return;
  }
  host.innerHTML = `<div class="piece"><div class="loading"><span class="dot"></span><span class="dot"></span><span class="dot"></span><p style="margin-top:14px">正在取《${esc(meta.title)}》的解读</p></div></div>`;
  window.scrollTo({ top: 0, behavior: 'auto' });

  let data = state.cache.get(id);
  if (!data) {
    try {
      const res = await fetch(`data/pieces/${encodeURIComponent(id)}.json`);
      if (!res.ok) throw new Error(String(res.status));
      data = await res.json();
      state.cache.set(id, data);
    } catch (err) {
      if (state.route.id !== id) return;
      host.innerHTML = `<div class="piece"><div class="load-error"><b>《${esc(meta.title)}》的解读还没就位</b>
        <p>这一篇的逐字解读数据暂时取不到（${esc(err.message)}）。可以先读其他篇目。</p>
        <a class="btn" href="#/">回到目录</a></div></div>`;
      document.title = `${meta.title} · 古诗文读本`;
      return;
    }
  }
  if (state.route.id !== id) return;

  const idx = state.catalog.findIndex(p => p.id === id);
  const prev = state.catalog[idx - 1] || null;
  const next = state.catalog[idx + 1] || null;
  document.title = `${data.title} · ${data.author} · 古诗文读本`;
  renderPiece(host, data, meta, { prev, next, toast });
}

/* ---------- 事件 ---------- */
function bind() {
  $$('[data-theme-set]').forEach(b => b.addEventListener('click', () => setTheme(b.dataset.themeSet)));
  $$('button[data-pinyin]').forEach(b => b.addEventListener('click', () => setPinyin(b.dataset.pinyin)));
  $('#type-down').addEventListener('click', () => setType(Number(document.documentElement.dataset.type) - 1));
  $('#type-up').addEventListener('click', () => setType(Number(document.documentElement.dataset.type) + 1));

  const q = $('#q');
  let t;
  q.addEventListener('input', () => {
    state.catalogVersion++;
    state.q = q.value;
    clearTimeout(t);
    t = setTimeout(() => { if (state.route.name === 'catalog') renderCatalog(); }, 130);
  });
  q.addEventListener('keydown', e => {
    if (e.key === 'Escape') { q.value = ''; state.q = ''; state.catalogVersion++; renderCatalog(); }
    if (e.key === 'Enter') {
      const first = $('.card');
      if (first) { e.preventDefault(); location.hash = first.getAttribute('href'); }
    }
  });
  $('#q-clear').addEventListener('click', () => { q.value = ''; state.q = ''; state.catalogVersion++; renderCatalog(); q.focus(); });
  $('#reset-filters').addEventListener('click', () => {
    state.q = ''; state.grade = ''; state.genre = ''; state.syllabus = ''; state.catalogVersion++;
    q.value = '';
    $$('.filter-row').forEach(row => $$('button', row).forEach((b, i) => b.setAttribute('aria-pressed', String(i === 0))));
    renderCatalog();
  });

  $$('.filter-row').forEach(row => {
    const key = row.dataset.filter;
    row.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b) return;
      $$('button', row).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      state[key] = b.dataset.val;
      state.catalogVersion++;
      renderCatalog();
    });
  });

  const settings = $('#read-settings');
  if (settings) {
    const closeSettings = () => { settings.open = false; };
    settings.addEventListener('toggle', () => {
      $('.settings-trigger', settings)?.setAttribute('aria-label', settings.open ? '关闭阅读设置' : '打开阅读设置');
    });
    document.addEventListener('click', e => {
      if (settings.open && !settings.contains(e.target)) closeSettings();
    });
  }

  window.addEventListener('hashchange', route);

  document.addEventListener('keydown', e => {
    if (e.key === '/' && state.route.name === 'catalog' && document.activeElement !== q) {
      e.preventDefault(); q.focus(); q.select();
    }
    if (e.key === 'Escape') {
      settings?.removeAttribute('open');
      if (state.route.name !== 'piece') return;
      $$('.gloss.open').forEach(g => {
        g.classList.remove('open');
        g.previousElementSibling?.querySelector('.verse-no')?.setAttribute('aria-expanded', 'false');
        $$('.tok.active', g.previousElementSibling).forEach(t => {
          t.classList.remove('active');
          $('.tok-ring', t)?.remove();
          $('.tok-bloom', t)?.remove();
        });
      });
      const expand = $('.piece [data-act="expand-all"]');
      if (expand) {
        expand.setAttribute('aria-pressed', 'false');
        expand.textContent = '展开全部句解';
      }
    }
  });

  let printDetails = [];
  window.addEventListener('beforeprint', () => {
    printDetails = $$('.author-panel:not([open])');
    printDetails.forEach(d => { d.open = true; });
  });
  window.addEventListener('afterprint', () => {
    printDetails.forEach(d => { d.open = false; });
    printDetails = [];
  });
}

/* ---------- 启动 ---------- */
async function init() {
  applyPrefs();
  bind();
  try {
    const res = await fetch('data/catalog.json');
    if (!res.ok) throw new Error(String(res.status));
    const cat = await res.json();
    state.catalog = cat.pieces;
  } catch (err) {
    $('#catalog-body').innerHTML = `<div class="load-error"><b>目录加载失败</b><p>${esc(err.message)}</p></div>`;
    return;
  }
  await route();
}
init();