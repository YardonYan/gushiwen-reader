const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const chars = s => Array.from(String(s ?? ''));
const icon = name => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#i-${name}"/></svg>`;

export function renderDictation(host, data, ctx) {
  const lines = data.lines || [];
  let scope = 'all';
  let hinted = 0;

  const hasKey = lines.some(l => l.key);
  const hasHard = lines.some(l => (l.t || []).some(t => t.hard));

  function cellsOf(line, li) {
    const out = [];
    const maskLine = scope === 'all' || (scope === 'key' && line.key) || scope === 'hard';
    let pos = 0;
    for (const tok of line.t || []) {
      const maskTok = maskLine && (scope !== 'hard' || tok.hard);
      const cs = chars(tok.w);
      for (let ci = 0; ci < cs.length; ci++) {
        pos++;
        const ps = String(tok.p || '').trim().split(/\s+/);
        out.push({
          c: cs[ci], li, pos,
          punct: !!tok.punct,
          masked: !tok.punct && maskTok,
          hard: !!tok.hard,
          py: ps[ci] || tok.p || ''
        });
      }
    }
    return out;
  }

  function lineHTML(line, li) {
    const cells = cellsOf(line, li);
    if (!cells.some(c => c.masked)) {
      return `<div class="dic-line-wrap"><div class="dic-line-head"><small>第 ${li + 1} 句 · 本范围不遮</small></div>
        <div class="dic-line">${cells.map(c => `<span class="dic-punct">${esc(c.c)}</span>`).join('')}</div></div>`;
    }
    const body = cells.map(c => {
      if (!c.masked) return `<span class="dic-punct">${esc(c.c)}</span>`;
      return `<span class="dic-cell"${c.hard ? ' data-hard' : ''}>
        <span class="py">${esc(c.py || '')}</span>
        <input type="text" maxlength="2" autocomplete="off" autocapitalize="off" spellcheck="false"
          data-exp="${esc(c.c)}" data-li="${li}" aria-label="第${li + 1}句第${c.pos}字，填一个字" placeholder="□">
      </span>`;
    }).join('');
    return `<div class="dic-line-wrap">
      <div class="dic-line-head"><small>第 ${li + 1} 句</small><button type="button" data-hint="${li}">${icon('hint')}<span>提示一字</span></button></div>
      <div class="dic-line" data-dline="${li}">${body}</div>
      ${line.tr ? `<p class="dic-hint">译文提示：${esc(line.tr)}</p>` : ''}
    </div>`;
  }

  host.innerHTML = `<div class="dictation">
    <div class="dic-bar">
      <div class="mode-switch" role="group" aria-label="默写范围">
        <button type="button" data-scope="all" aria-pressed="true">全篇</button>
        <button type="button" data-scope="key" aria-pressed="false"${hasKey ? '' : ' disabled'}>名句</button>
        <button type="button" data-scope="hard" aria-pressed="false"${hasHard ? '' : ' disabled'}>难字</button>
      </div>
      <div class="dic-progress" role="progressbar" aria-label="默写进度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i></i></div>
      <span class="dic-count"><b>0</b> / <span data-total>0</span> 字</span>
      <button type="button" class="tbtn" data-dact="reset">${icon('reset')}<span>重置</span></button>
      <button type="button" class="tbtn" data-dact="reveal">${icon('reveal')}<span>显示全文</span></button>
    </div>
    <div class="dic-lines">${lines.map(lineHTML).join('')}</div>
    <div class="dic-done" hidden>
      <div class="stamp">已成诵</div>
      <p data-done-text></p>
    </div>
  </div>`;

  const root = $('.dictation', host);
  const bar = $('.dic-progress i', root);
  const prog = $('.dic-progress', root);
  const countEl = $('.dic-count b', root);
  const totalEl = $('[data-total]', root);
  const done = $('.dic-done', root);
  const doneText = $('[data-done-text]', root);

  function inputs() { return $$('input[data-exp]', root); }
  function refresh() {
    const all = inputs();
    const ok = all.filter(i => i.parentElement.classList.contains('ok')).length;
    const rev = all.filter(i => i.parentElement.classList.contains('revealed')).length;
    const total = all.length;
    totalEl.textContent = String(total);
    countEl.textContent = String(ok);
    const pct = total ? Math.round((ok + rev) / total * 100) : 0;
    bar.style.width = pct + '%';
    prog.setAttribute('aria-valuenow', String(pct));
    if (total && ok + rev === total) {
      done.hidden = false;
      doneText.innerHTML = rev
        ? `全篇 <b>${total}</b> 字填完，其中 <b>${rev}</b> 字用过提示。再重置一次，试着不用提示背下来。`
        : `全篇 <b>${total}</b> 字一次填对，没有用提示。`;
    } else done.hidden = true;
  }

  function mark(input, kind) {
    const cell = input.parentElement;
    cell.classList.remove('ok', 'bad', 'revealed');
    if (kind) cell.classList.add(kind);
  }

  function nextInput(from) {
    const all = inputs();
    const i = all.indexOf(from);
    for (let k = i + 1; k < all.length; k++) if (!all[k].parentElement.classList.contains('ok')) return all[k];
    for (let k = 0; k < i; k++) if (!all[k].parentElement.classList.contains('ok')) return all[k];
    return null;
  }
  function prevInput(from) {
    const all = inputs();
    const i = all.indexOf(from);
    return i > 0 ? all[i - 1] : null;
  }

  function judge(input) {
    const v = input.value;
    if (!v) { mark(input, null); refresh(); return; }
    const c = chars(v).pop();
    input.value = c;
    if (c === input.dataset.exp) {
      mark(input, 'ok');
      refresh();
      const nx = nextInput(input);
      if (nx) nx.focus();
      else if (inputs().every(i => i.parentElement.classList.contains('ok') || i.parentElement.classList.contains('revealed'))) ctx.toast('这一篇填完了');
    } else {
      mark(input, 'bad');
      refresh();
    }
  }

  let composing = false;
  root.addEventListener('compositionstart', () => { composing = true; });
  root.addEventListener('compositionend', e => {
    composing = false;
    const input = e.target.closest?.('input[data-exp]');
    if (input) judge(input);
  });
  root.addEventListener('input', e => {
    const input = e.target.closest?.('input[data-exp]');
    if (!input || composing) return;
    judge(input);
  });
  root.addEventListener('keydown', e => {
    const input = e.target.closest?.('input[data-exp]');
    if (!input) return;
    if (e.key === 'Backspace' && !input.value) {
      const p = prevInput(input);
      if (p) { e.preventDefault(); p.focus(); p.value = ''; mark(p, null); refresh(); }
    } else if (e.key === 'Enter' || e.key === 'ArrowRight') {
      const nx = nextInput(input); if (nx) { e.preventDefault(); nx.focus(); }
    } else if (e.key === 'ArrowLeft') {
      const p = prevInput(input); if (p) { e.preventDefault(); p.focus(); }
    }
  });
  root.addEventListener('focusin', e => {
    const input = e.target.closest?.('input[data-exp]');
    if (input) input.select();
  });

  function reveal(input) {
    input.value = input.dataset.exp;
    mark(input, 'revealed');
    hinted++;
  }

  root.addEventListener('click', e => {
    const sc = e.target.closest('[data-scope]');
    if (sc && !sc.disabled) {
      scope = sc.dataset.scope;
      $$('[data-scope]', root).forEach(b => b.setAttribute('aria-pressed', String(b === sc)));
      hinted = 0;
      $('.dic-lines', root).innerHTML = lines.map(lineHTML).join('');
      done.hidden = true;
      refresh();
      const first = inputs()[0];
      if (first) first.focus();
      ctx.toast(scope === 'all' ? '默写全篇' : scope === 'key' ? '只默写名句' : '只默写疑难字');
      return;
    }
    const hint = e.target.closest('[data-hint]');
    if (hint) {
      const li = Number(hint.dataset.hint);
      const target = $$(`input[data-li="${li}"]`, root).find(i => !i.parentElement.classList.contains('ok') && !i.parentElement.classList.contains('revealed'));
      if (target) { reveal(target); refresh(); target.focus(); ctx.toast('已提示一字'); }
      else ctx.toast('这一句已经填完了');
      return;
    }
    const act = e.target.closest('[data-dact]')?.dataset.dact;
    if (act === 'reset') {
      hinted = 0;
      inputs().forEach(i => { i.value = ''; mark(i, null); });
      done.hidden = true; refresh();
      const first = inputs()[0]; if (first) first.focus();
      ctx.toast('已重置，重新默写');
    } else if (act === 'reveal') {
      inputs().forEach(i => { if (!i.parentElement.classList.contains('ok')) reveal(i); });
      refresh();
      ctx.toast('已显示全文');
    }
  });

  refresh();
}