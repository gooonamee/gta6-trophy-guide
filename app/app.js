import { guides } from './data/guides.js';

const root = document.querySelector('#app');
const key = 'leonida-field-guide-v1';
const tiers = ['platinum', 'gold', 'silver', 'bronze'];
const symbols = { platinum: '✦', gold: '◆', silver: '◆', bronze: '◆' };
let trophies = [];
let checked = new Set();
let revealed = new Set();
let state = { tier: 'all', status: 'all', query: '', safe: false, view: 'checklist', selected: null };

try { checked = new Set(JSON.parse(localStorage.getItem(key) || '[]').map(Number)); } catch { checked = new Set(); }
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const count = list => list.filter(t => checked.has(t.id)).length;
const percent = (n, total) => total ? Math.round(n / total * 100) : 0;
const hidden = t => state.safe && t.id !== 1 && !revealed.has(t.id);
function save() { localStorage.setItem(key, JSON.stringify([...checked])); }
function mark(id, value) { value ? checked.add(id) : checked.delete(id); save(); render(); }
function filtered() {
  const q = state.query.trim().toLowerCase();
  return trophies.filter(t => (state.tier === 'all' || t.grade === state.tier) && (state.status === 'all' || (state.status === 'done') === checked.has(t.id)) && (!q || (!hidden(t) && `${t.name} ${t.description}`.toLowerCase().includes(q))));
}
function header() {
  const done = count(trophies), pct = percent(done, trophies.length);
  return `<header class="topbar"><a class="brand" href="#" data-action="home"><span class="brand-mark">L<span>✦</span></span><span>LEONIDA <b>FIELD GUIDE</b><small>THE UNOFFICIAL TROPHY COMPANION</small></span></a><nav><button class="nav-link ${state.view === 'checklist' ? 'active' : ''}" data-action="checklist">The checklist</button><button class="nav-link ${state.view === 'roadmap' ? 'active' : ''}" data-action="roadmap">Roadmap</button></nav><div class="top-progress"><span>YOUR PROGRESS</span><strong>${pct}%</strong><div class="mini-track"><i style="width:${pct}%"></i></div></div></header>`;
}
function summary() {
  const done = count(trophies), pct = percent(done, trophies.length);
  return `<section class="summary"><div class="summary-heading"><div><p class="eyebrow"><span class="pulse"></span> YOUR PLATINUM JOURNEY</p><h2>Every legend starts somewhere.</h2><p>Keep track of your road to 100%. Your progress is saved on this device.</p></div><div class="overall"><strong>${done}<span> / ${trophies.length}</span></strong><small>TROPHIES EARNED</small></div></div><div class="progress-line"><i style="width:${pct}%"></i></div><div class="summary-bottom"><span>${pct}% COMPLETE</span><span>${trophies.length - done} TO GO <b>↗</b></span></div><div class="tier-stats">${tiers.map(tier => { const list = trophies.filter(t => t.grade === tier), n = count(list); return `<button class="tier-stat ${state.tier === tier ? 'chosen' : ''}" data-tier="${tier}"><span class="gem ${tier}">${symbols[tier]}</span><span><b>${tier}</b><small>${n} / ${list.length} earned · ${percent(n, list.length)}%</small></span><span class="stat-arrow">↗</span></button>`; }).join('')}</div></section>`;
}
function controls() {
  return `<div class="section-title"><div><p class="eyebrow pink">THE COLLECTION <span> / 01</span></p><h2>Trophy checklist<span class="title-dot">.</span></h2><p>All 55 trophies. One very good reason to explore.</p></div><div class="utility"><button data-action="export">↑ Export</button><label class="upload">↓ Import<input type="file" accept="application/json,.json" id="import-file"></label><button data-action="reset">Reset</button></div></div><div class="filters"><label class="search"><span>⌕</span><input id="search" type="search" placeholder="Search trophies..." value="${esc(state.query)}" aria-label="Search trophies"><kbd>/</kbd></label><label class="select-wrap"><span>RANK</span><select id="tier" aria-label="Filter by tier"><option value="all">All tiers</option>${tiers.map(t => `<option value="${t}" ${state.tier === t ? 'selected' : ''}>${t[0].toUpperCase()+t.slice(1)}</option>`).join('')}</select></label><label class="select-wrap"><span>STATUS</span><select id="status" aria-label="Filter by status"><option value="all">All trophies</option><option value="remaining" ${state.status === 'remaining' ? 'selected' : ''}>To do</option><option value="done" ${state.status === 'done' ? 'selected' : ''}>Earned</option></select></label><label class="spoiler"><input id="safe" type="checkbox" ${state.safe ? 'checked' : ''}><span class="switch"></span><span>Spoiler safe<small>Hide trophy details</small></span></label></div>`;
}
function row(t) {
  const isHidden = hidden(t), done = checked.has(t.id);
  return `<article class="trophy-row ${done ? 'is-done' : ''}"><button class="check ${done ? 'checked' : ''}" data-check="${t.id}" aria-label="${done ? 'Mark incomplete' : 'Mark complete'}: ${isHidden ? 'hidden trophy ' + t.id : esc(t.name)}" aria-pressed="${done}">${done ? '✓' : ''}</button><button class="trophy-main" data-open="${t.id}" ${isHidden ? 'aria-label="Open hidden trophy ' + t.id + '"' : ''}><span class="trophy-icon ${t.grade}">${symbols[t.grade]}</span><span class="trophy-copy" ${isHidden ? 'aria-hidden="true"' : ''}><strong class="${isHidden ? 'blur' : ''}">${esc(t.name)}</strong><small class="${isHidden ? 'blur' : ''}">${esc(t.description)}</small></span><span class="row-tag">${t.grade}</span><span class="row-arrow">↗</span></button></article>`;
}
function checklist() {
  const list = filtered();
  return `${summary()}${controls()}<div class="list-meta"><span>SHOWING ${list.length} OF ${trophies.length} TROPHIES</span><span>SELECT A TROPHY FOR FIELD NOTES ↓</span></div><div class="trophy-list">${tiers.map(tier => { const group = list.filter(t => t.grade === tier); if (!group.length) return ''; return `<div class="group-heading"><span class="gem ${tier}">${symbols[tier]}</span><strong>${tier}</strong><span>${group.length.toString().padStart(2,'0')}</span><i></i></div>${group.map(row).join('')}`; }).join('') || '<div class="empty">No trophies match these filters. <button class="text-button" data-action="clear">Clear filters →</button></div>'}</div>`;
}
const phases = [
  ['01', 'Get your bearings', 'STORY FIRST', 'Follow the main story through the final mission to open up Leonida. Stock up between jobs, try new activities as they appear, and keep separate saves at major turning points. The finale’s effects on cleanup are not established, so a backup is a sensible precaution.'],
  ['02', 'Take the scenic route', 'CLEANUP', 'Finish character mission strands and sample every activity type. Work through races, the shooting range and challenges in manageable batches; keep a note of distinct wins and completed strands.'],
  ['03', 'Leave no stone unturned', 'COLLECTIBLES', 'Sweep the map region by region for meditation spots, cards and WAiNK locations. Combine each trip with exploration and vehicle discovery, recording finds as you go to avoid a second full tour.'],
  ['04', 'Make some noise', 'ONLINE / MISC', 'Clean up partner actions, robberies, spending and the more cryptic miscellaneous trophies. No trophy in the supplied list explicitly requires online play; check the game’s own requirements before planning a session.'],
  ['05', 'A Leonida legend', 'PLATINUM', 'Check the in-game 100% completion list, finish any remaining trophy requirements and sync your platform list. Once the other 54 are earned, the platinum is yours.']
];
function roadmap() { return `<section class="roadmap-intro"><p class="eyebrow pink">THE GAME PLAN <span> / 02</span></p><h1>The road to <em>legend.</em></h1><p>One state, 55 trophies, countless stories. Here’s a flexible route through it all.</p></section><div class="roadmap-layout"><aside><span class="aside-label">YOUR ITINERARY</span><h3>Five phases.<br>One platinum.</h3><p>There’s no rush. Follow the story, then make Leonida your own.</p><button data-action="checklist">← Back to checklist</button></aside><div class="phases">${phases.map(([n,title,label,body]) => `<article class="phase"><span class="phase-number">${n}</span><div><p class="eyebrow pink">${label}</p><h2>${title}</h2><p>${body}</p></div><span class="phase-star">✦</span></article>`).join('')}</div></div>`; }
function modal() {
  const t = trophies.find(x => x.id === state.selected); if (!t) return '';
  const secret = hidden(t);
  return `<div class="modal-backdrop" data-action="backdrop"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button class="close" data-action="close" aria-label="Close guide">×</button><p class="eyebrow pink">FIELD NOTE <span> / ${String(t.id).padStart(2,'0')}</span></p><div class="modal-title"><span class="trophy-icon large ${t.grade}">${symbols[t.grade]}</span><div><span class="modal-rank">${t.grade} TROPHY</span><h2 id="modal-title" class="${secret ? 'blur' : ''}">${esc(t.name)}</h2></div></div>${secret ? `<div class="secret"><span>✦</span><h3>Spoilers ahead</h3><p>This trophy is hidden while spoiler-safe mode is on.</p><button class="primary" data-action="reveal">Reveal this trophy</button></div>` : `<p class="official">${esc(t.description)}</p><div class="guide-label">THE STRATEGY <span>✳</span></div><p class="guide-text">${esc(guides[t.id] || 'Explore at your own pace and check the in-game requirements.')}</p><p class="note">FIELD NOTE · Strategies and inferred conditions are guidance, not confirmed unlock requirements.</p><button class="primary" data-action="toggle">${checked.has(t.id) ? '✓  Mark as not earned' : '＋  Mark as earned'}</button>`}</section></div>`;
}
function render() { root.innerHTML = `${header()}<main><div class="hero"><div class="hero-copy"><p class="eyebrow"><span class="pulse"></span> YOUR COMPANION TO LEONIDA</p><h1>Platinum,<br><em>mapped out.</em></h1><p>From the first score to the final trophy.<br>Every step of your Leonida story, in one place.</p><div class="hero-actions"><button class="primary" data-action="checklist">EXPLORE THE GUIDE <span>↗</span></button><button class="text-button" data-action="roadmap">VIEW ROADMAP <span>→</span></button></div></div><div class="hero-art" aria-hidden="true"><div class="sun"></div><div class="sun-lines"></div><div class="art-grid"></div><span class="art-cross one">✳</span><span class="art-cross two">✦</span><span class="art-caption">PARADISE IS A WORK IN PROGRESS <b>↗</b></span><span class="art-coordinate">25° 46' N<br>80° 12' W</span></div><div class="hero-index">THE LEONIDA FIELD GUIDE <span>✦</span> VOL. 01</div></div><div class="content">${state.view === 'roadmap' ? roadmap() : checklist()}</div></main><footer><div><span class="footer-logo">L✦</span><strong>LEONIDA FIELD GUIDE</strong><p>An unofficial companion for the journey.</p></div><span>MADE FOR THE LONG WAY AROUND <b>✦</b></span><span>YOUR PROGRESS STAYS WITH YOU</span></footer>${modal()}`; }
root.addEventListener('click', event => {
  const check = event.target.closest('[data-check]'); if (check) { const id = Number(check.dataset.check); mark(id, !checked.has(id)); return; }
  const open = event.target.closest('[data-open]'); if (open) { state.selected = Number(open.dataset.open); render(); return; }
  const tier = event.target.closest('[data-tier]'); if (tier) { state.tier = state.tier === tier.dataset.tier ? 'all' : tier.dataset.tier; render(); return; }
  const button = event.target.closest('[data-action]'); if (!button) return;
  const action = button.dataset.action;
  if (action === 'backdrop' && event.target !== button) return;
  if (action === 'close' || action === 'backdrop') state.selected = null;
  if (action === 'reveal') revealed.add(state.selected);
  if (action === 'toggle') { mark(state.selected, !checked.has(state.selected)); return; }
  if (action === 'checklist' || action === 'home') { event.preventDefault(); state.view = 'checklist'; }
  if (action === 'roadmap') state.view = 'roadmap';
  if (action === 'clear') { state.tier = 'all'; state.status = 'all'; state.query = ''; }
  if (action === 'reset' && confirm('Reset all trophy progress on this device?')) { checked.clear(); save(); }
  if (action === 'export') { const blob = new Blob([JSON.stringify({ version: 1, checked: [...checked] }, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'leonida-progress.json'; a.click(); URL.revokeObjectURL(url); }
  render();
  if (action === 'checklist' || action === 'roadmap') document.querySelector('.content').scrollIntoView({ behavior: 'smooth' });
});
root.addEventListener('change', async event => {
  const target = event.target;
  if (target.id === 'tier') state.tier = target.value;
  if (target.id === 'status') state.status = target.value;
  if (target.id === 'safe') state.safe = target.checked;
  if (target.id === 'import-file' && target.files[0]) { try { const data = JSON.parse(await target.files[0].text()); if (!Array.isArray(data.checked) || data.checked.some(id => !Number.isInteger(id) || !trophies.some(t => t.id === id))) throw Error('Invalid trophy IDs'); checked = new Set(data.checked); save(); } catch { alert('Could not import progress. Choose a valid Leonida progress export.'); } }
  render();
});
root.addEventListener('input', event => { if (event.target.id === 'search') { const pos = event.target.selectionStart; state.query = event.target.value; render(); const input = document.querySelector('#search'); input.focus(); input.setSelectionRange(pos, pos); } });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && state.selected) { state.selected = null; render(); } if (event.key === '/' && !/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName) && state.view === 'checklist') { event.preventDefault(); document.querySelector('#search')?.focus(); } });
fetch('./data/trophies.json').then(response => { if (!response.ok) throw Error('Unable to load trophy data'); return response.json(); }).then(data => { trophies = data.trophies; checked = new Set([...checked].filter(id => trophies.some(t => t.id === id))); render(); }).catch(() => { root.innerHTML = '<div class="loading">Could not load the trophy list. Please run the guide through a local web server and refresh.</div>'; });
