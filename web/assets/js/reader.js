import { renderDictation } from './dictation.js';

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

function markChar(author) {
  const a = String(author || '');
  return a.startsWith('《') ? (a[1] || '文') : (a[0] || '文');
}
function lineText(line) { return (line.t || []).map(t => t.w).join(''); }

const PAINTINGS = [
  { src: 'assets/images/fan-kuan.webp', title: '溪山行旅图', artist: '范宽', w: 1200, h: 2400 },
  { src: 'assets/images/guo-xi.webp', title: '早春图', artist: '郭熙', w: 1200, h: 1745 },
  { src: 'assets/images/jiangshan-detail.webp', title: '千里江山图', artist: '王希孟', w: 1800, h: 92 }
];
function paintingFor(data, meta) {
  return PAINTINGS[(Array.from(data.title || '').length + (data.lines?.length || 0) + (meta.no || 0)) % PAINTINGS.length];
}

function tokenHTML(tok, li, ti) {
  if (tok.punct) return `<span class="tok" data-punct><span class="py"></span><span class="zi">${esc(tok.w)}</span></span>`;
  const hard = tok.hard ? ' data-hard' : '';
  return `<button type="button" class="tok" data-tok="${li}:${ti}"${hard} aria-label="${esc(tok.w)}，点击查看释义">
    <span class="py">${esc(tok.p || '')}</span><span class="zi">${esc(tok.w)}</span>
  </button>`;
}

function verseHTML(line, li) {
  const key = line.key ? ' is-key' : '';
  const exam = line.exam ? `<span class="verse-exam">${esc(line.exam)}</span>` : '';
  return `<div class="verse${key}" data-line="${li}"${line.key ? ' data-key' : ''}>
    <button type="button" class="verse-no" data-sent="${li}" aria-expanded="false" aria-label="第${li + 1}句，点击查看整句释义与译文">${li + 1}</button>
    ${(line.t || []).map((t, ti) => tokenHTML(t, li, ti)).join('')}${exam}
  </div>
  <div class="gloss" data-gloss="${li}"${line.key ? ' data-key' : ''}><div class="gloss-in"></div></div>`;
}

function wordGloss(tok) {
  const single = Array.from(tok.w).length === 1;
  const ch = tok.ch ? `<div class="gloss-ch">${Object.entries(tok.ch).map(([k, v]) => `<span><b>${esc(k)}</b>${esc(v)}</span>`).join('')}</div>` : '';
  const d = tok.d ? `<div class="gloss-d"><b>详解</b>${esc(tok.d)}</div>` : '';
  return `<div class="gloss-card">
    <div class="gloss-head">
      <span class="gloss-word">${esc(tok.w)}</span>
      ${tok.p ? `<span class="gloss-py">${esc(tok.p)}</span>` : ''}
      <span class="gloss-kind">${single ? '字' : '词'}</span>
    </div>
    <p class="gloss-g">${esc(tok.g || '')}</p>${ch}${d}
  </div>`;
}

function sentGloss(line) {
  const note = line.note ? `<div class="gloss-note"><b>句解</b>${esc(line.note)}</div>` : '';
  const exam = line.exam ? `<p class="gloss-exam">考点角度：${esc(line.exam)}</p>` : '';
  return `<div class="gloss-card">
    <div class="gloss-head"><span class="gloss-kind">整句</span>${line.key ? '<span class="gloss-kind">名句</span>' : ''}</div>
    <p class="gloss-sent">${esc(lineText(line))}</p>
    <p class="gloss-tr"><b>译文</b>${esc(line.tr || '')}</p>${note}${exam}
  </div>`;
}

function examPanel(data) {
  const panes = [];
  if (data.examPoints?.length) {
    panes.push({
      id: 'exam', name: '命题角度', n: data.examPoints.length,
      html: `<ul class="exam-list">${data.examPoints.map(e => `<li>
        <span class="exam-k" data-k="${esc(e.k || '默写')}">${esc(e.k || '默写')}</span>
        <span class="exam-q">${e.y ? `<b>${esc(e.y)}</b> ` : ''}${esc(e.q || '')}</span></li>`).join('')}</ul>`
    });
  }
  if (data.errors?.length) {
    panes.push({
      id: 'err', name: '易错字', n: data.errors.length,
      html: `<div class="err-grid">${data.errors.map(e => `<div class="err">
        <div class="err-c">${esc(e.c)}</div>
        <div class="err-w">易误作 <s>${esc(e.w)}</s></div>
        <div class="err-n">${esc(e.n)}</div></div>`).join('')}</div>`
    });
  }
  if (data.notes?.length) {
    panes.push({
      id: 'note', name: '文言知识', n: data.notes.length,
      html: `<ul class="note-list">${data.notes.map(x => `<li>
        <span class="note-k">${esc(x.k)}</span><span class="note-w">${esc(x.w)}</span>
        <span class="note-n">${esc(x.n)}</span></li>`).join('')}</ul>`
    });
  }
  if (!panes.length) return '';
  return `<section class="panel">
    <div class="panel-head"><span class="panel-index">03</span><h2>考点与辨误</h2><span class="rule"></span><span class="hint">默写命题角度 · 易错字形 · 文言知识</span></div>
    <div class="exam-tabs" role="tablist">${panes.map((p, i) =>
      `<button type="button" role="tab" id="tab-${p.id}" aria-controls="pane-${p.id}" aria-selected="${i === 0}" data-pane="${p.id}">${esc(p.name)}<span>${p.n}</span></button>`).join('')}</div>
    ${panes.map((p, i) => `<div class="exam-pane" role="tabpanel" id="pane-${p.id}" aria-labelledby="tab-${p.id}"${i ? ' hidden' : ''}>${p.html}</div>`).join('')}
  </section>`;
}

export function renderPiece(host, data, meta, ctx) {
  const genre = data.genre || meta.genre;
  const painting = paintingFor(data, meta);
  const sub = [
    `<b>${esc(data.author)}</b>`, esc(data.dynasty), esc(data.grade || meta.grade), esc(genre),
    data.syllabus === '课标' ? `课标推荐${meta.no ? ' No.' + String(meta.no).padStart(2, '0') : ''}` : '教材增补'
  ].filter(Boolean).join('<i></i>');

  host.innerHTML = `<article class="piece" data-genre="${esc(genre)}" data-id="${esc(data.id)}">
    <div class="piece-head">
      <h1 class="piece-title">${esc(data.title)}</h1>
      <div class="piece-head-main">
        <p class="piece-sub">${sub}</p>
        ${meta.exam ? `<span class="piece-exam">广东卷 ${esc(meta.exam)}</span>` : ''}
        <span class="title-seal" aria-hidden="true">${esc(genre)}</span>
      </div>
    </div>

    <figure class="motif-band painting-band sweep">
      <img src="${painting.src}" alt="意境配图：北宋${esc(painting.artist)}《${esc(painting.title)}》" width="${painting.w}" height="${painting.h}">
      <div class="motif-light"></div><div class="motif-sweep"></div>
      <figcaption><span>意境配图</span><b>${esc(painting.title)}</b><small>${esc(painting.artist)} · 北宋</small></figcaption>
    </figure>

    <div class="piece-toolbar">
      <div class="mode-switch" role="group" aria-label="阅读模式">
        <button type="button" data-mode="read" aria-pressed="true">解读</button>
        <button type="button" data-mode="dict" aria-pressed="false">默写</button>
      </div>
      <button type="button" class="tbtn" data-act="only-key" aria-pressed="false">只看名句</button>
      <button type="button" class="tbtn" data-act="expand">展开全部句解</button>
      <button type="button" class="tbtn" data-act="collapse">收起全部</button>
      <span class="toolbar-note">点字词看释义 · 点句首序号看整句译文</span>
    </div>

    <section class="author-panel">
      <div class="author-mark" aria-hidden="true">${esc(markChar(data.author))}</div>
      <div class="author-body">
        <div><h2>作者</h2><p>${esc(data.authorIntro || '')}</p></div>
        ${data.background ? `<p class="bg"><b>本事</b>${esc(data.background)}</p>` : ''}
      </div>
    </section>

    <div class="verse-block" data-block="read">${(data.lines || []).map(verseHTML).join('')}</div>
    <div class="verse-block" data-block="dict" hidden></div>

    ${data.translation ? `<section class="panel">
      <div class="panel-head"><span class="panel-index">01</span><h2>全文翻译</h2><span class="rule"></span></div>
      <div class="panel-body"><p>${esc(data.translation)}</p></div></section>` : ''}

    ${data.understanding?.length ? `<section class="panel">
      <div class="panel-head"><span class="panel-index">02</span><h2>整体理解</h2><span class="rule"></span><span class="hint">结构 · 手法 · 主旨 · 教学提示</span></div>
      <div class="panel-body understanding">${data.understanding.map(u => `<p>${esc(u)}</p>`).join('')}
        ${(data.themes?.length || data.technique?.length) ? `<div class="chips">
          ${(data.themes || []).map(t => `<span class="chip">${esc(t)}</span>`).join('')}
          ${(data.technique || []).map(t => `<span class="chip chip-tech">${esc(t)}</span>`).join('')}</div>` : ''}
      </div></section>` : ''}

    ${examPanel(data)}

    <nav class="piece-nav" aria-label="篇目导航">
      ${ctx.prev ? `<a class="nav-card" href="#/p/${esc(ctx.prev.id)}"><small>上一篇</small><b>${esc(ctx.prev.title)}</b></a>` : '<span></span>'}
      <a class="nav-back" href="#/">目录</a>
      ${ctx.next ? `<a class="nav-card next" href="#/p/${esc(ctx.next.id)}"><small>下一篇</small><b>${esc(ctx.next.title)}</b></a>` : '<span></span>'}
    </nav>
  </article>`;

  const piece = $('.piece', host);
  const readBlock = $('[data-block="read"]', piece);
  const dictBlock = $('[data-block="dict"]', piece);
  let dictMounted = false;

  /* --- 释义展开 --- */
  function closeGloss(li) {
    const g = $(`[data-gloss="${li}"]`, readBlock);
    if (!g) return;
    g.classList.remove('open');
    $(`[data-sent="${li}"]`, readBlock)?.setAttribute('aria-expanded', 'false');
    $$(`.tok.active`, g.previousElementSibling).forEach(t => {
      t.classList.remove('active');
      $('.tok-ring', t)?.remove();
      $('.tok-bloom', t)?.remove();
    });
  }
  function closeAll() {
    $$('.gloss.open', readBlock).forEach(g => closeGloss(Number(g.dataset.gloss)));
  }
  function openGloss(li, html, focusTok) {
    const g = $(`[data-gloss="${li}"]`, readBlock);
    const verse = $(`[data-line="${li}"]`, readBlock);
    if (!g || !verse) return;
    const inner = $('.gloss-in', g);
    const same = g.classList.contains('open') && inner.dataset.sig === html.sig;
    closeAll();
    if (same) return;
    inner.innerHTML = html.body;
    inner.dataset.sig = html.sig;
    g.classList.add('open');
    $(`[data-sent="${li}"]`, readBlock)?.setAttribute('aria-expanded', 'true');
    if (focusTok) {
      focusTok.classList.add('active');
      focusTok.insertAdjacentHTML('beforeend',
        '<svg class="tok-ring" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><ellipse cx="50" cy="50" rx="47" ry="45" pathLength="100"/></svg><span class="tok-bloom" aria-hidden="true"></span>');
    }
  }

  readBlock.addEventListener('click', e => {
    const tok = e.target.closest('.tok:not([data-punct])');
    if (tok) {
      const [li, ti] = tok.dataset.tok.split(':').map(Number);
      const t = data.lines[li]?.t[ti];
      if (!t) return;
      openGloss(li, { sig: 'w' + li + ':' + ti, body: wordGloss(t) }, tok);
      return;
    }
    const no = e.target.closest('.verse-no');
    if (no) {
      const li = Number(no.dataset.sent);
      openGloss(li, { sig: 's' + li, body: sentGloss(data.lines[li]) }, null);
    }
  });

  /* --- 工具条 --- */
  $('.piece-toolbar', piece).addEventListener('click', e => {
    const mode = e.target.closest('[data-mode]');
    if (mode) {
      const m = mode.dataset.mode;
      $$('[data-mode]', piece).forEach(b => b.setAttribute('aria-pressed', String(b === mode)));
      readBlock.hidden = m !== 'read';
      dictBlock.hidden = m !== 'dict';
      if (m === 'dict' && !dictMounted) {
        renderDictation(dictBlock, data, { toast: ctx.toast });
        dictMounted = true;
      }
      if (m === 'read') closeAll();
      return;
    }
    const act = e.target.closest('[data-act]')?.dataset.act;
    if (act === 'only-key') {
      const b = e.target.closest('[data-act]');
      const on = b.getAttribute('aria-pressed') !== 'true';
      b.setAttribute('aria-pressed', String(on));
      readBlock.classList.toggle('only-key', on);
      const keys = $$('.verse.is-key', readBlock).length;
      ctx.toast(on ? (keys ? `只看 ${keys} 句名句` : '这一篇没有标名句，已显示全部') : '已显示全部句子');
      if (on && !keys) { b.setAttribute('aria-pressed', 'false'); readBlock.classList.remove('only-key'); }
      return;
    }
    if (act === 'expand') {
      closeAll();
      data.lines.forEach((ln, li) => {
        const g = $(`[data-gloss="${li}"]`, readBlock);
        if (!g) return;
        $('.gloss-in', g).innerHTML = sentGloss(ln);
        $('.gloss-in', g).dataset.sig = 's' + li;
        g.classList.add('open');
        $(`[data-sent="${li}"]`, readBlock)?.setAttribute('aria-expanded', 'true');
      });
      ctx.toast('已展开全部句解');
      return;
    }
    if (act === 'collapse') { closeAll(); ctx.toast('已收起全部释义'); }
  });

  /* --- 考点分页 --- */
  const tabs = $('.exam-tabs', piece);
  if (tabs) {
    tabs.addEventListener('click', e => {
      const b = e.target.closest('[data-pane]');
      if (!b) return;
      $$('[data-pane]', tabs).forEach(x => x.setAttribute('aria-selected', String(x === b)));
      $$('.exam-pane', piece).forEach(p => { p.hidden = p.id !== 'pane-' + b.dataset.pane; });
    });
  }

  /* --- 入场扫光 --- */
  const band = $('.motif-band', piece);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce) {
    setTimeout(() => band.classList.remove('sweep'), 1600);
    const io = new IntersectionObserver(es => es.forEach(x => {
      if (x.isIntersecting) { band.classList.add('sweep'); setTimeout(() => band.classList.remove('sweep'), 1600); }
    }), { threshold: .4 });
    io.observe(band);
  } else band.classList.remove('sweep');
}