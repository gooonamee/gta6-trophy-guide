import { guides, inferredMissable } from './data/guides.js';

const root = document.querySelector('#app');
const storageKey = 'leonida-field-guide-v1';
const tiers = ['platinum', 'gold', 'silver', 'bronze'];
// The supplied list has no hidden flag. These cryptic descriptions are treated as spoiler-sensitive.
const sensitive = new Set([37, 38, 44, 45, 46, 47, 48, 49, 50]);
let trophies = [];
let checked = new Set();
let revealed = new Set();
let selected = null;
let view = 'checklist';
let tier = 'all';
let status = 'all';
let query = '';
let safe = true;
let notice = '';

try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
  checked = new Set(Array.isArray(saved.checked) ? saved.checked : []);
  safe = saved.safe !== false;
} catch { /* A damaged save starts with a clean tracker. */ }

const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const title = value => value[0].toUpperCase() + value.slice(1);
const percent = (a, b) => b ? Math.round(a / b * 100) : 0;
const isHidden = t => safe && sensitive.has(t.id) && !revealed.has(t.id);
function save() { localStorage.setItem(storageKey, JSON.stringify({checked: [...checked], safe})); }
function stats(grade) {
  const items = grade ? trophies.filter(t => t.grade === grade) : trophies;
  const done = items.filter(t => checked.has(t.id)).length;
  return { done, total: items.length, pct: percent(done, items.length) };
}
function render() {
  const overall = stats();
  root.innerHTML = `
    <header class="topbar"><a class="brand" href="#top" aria-label="Leonida Field Guide home"><span class="brand-mark">L<span>✦</span></span><span>LEONIDA<small>FIELD GUIDE / VOL. 01</small></span></a><nav aria-label="Main navigation"><button class="nav-link ${view === 'checklist' ? 'active' : ''}" data-view="checklist">Trophy guide</button><button class="nav-link ${view === 'roadmap' ? 'active' : ''}" data-view="roadmap">Roadmap</button></nav><div class="top-progress"><span>YOUR PROGRESS</span><strong>${overall.done}<i>/</i>${overall.total}</strong><div class="mini-bar"><b style="width:${overall.pct}%"></b></div></div></header>
    <main id="top"><section class="hero"><div class="hero-copy"><div class="eyebrow"><span class="dot"></span> THE UNOFFICIAL PLATINUM COMPANION <span class="line"></span> PS5</div><h1>Welcome to<br><em>Leonida.</em></h1><p>The sun, the chaos, the 55 trophies. Your field guide to seeing it all and earning the platinum.</p><div class="hero-actions"><button class="button primary" data-view="checklist">Explore the trophies <span>↗</span></button><button class="button ghost" data-view="roadmap">View the roadmap <span>→</span></button></div></div><div class="hero-art" aria-hidden="true"><div class="sun"></div><div class="sun-lines"></div><div class="palm palm-one">✳</div><div class="palm palm-two">✳</div><div class="art-label">THE LONG ROAD TO PLATINUM <span>✦</span> LEONIDA, USA</div><div class="art-number">01 <span>/ 55</span></div></div><div class="hero-index">A FIELD GUIDE FOR THE AMBITIOUS <span>EST. 2026</span></div></section>
    <section class="dashboard"><div class="section-kicker">THE BIG PICTURE <span>✦</span> YOUR JOURNEY SO FAR</div><div class="dashboard-grid"><div class="overall"><div class="ring" style="--progress:${overall.pct}%"><div><strong>${overall.pct}<small>%</small></strong><span>COMPLETE</span></div></div><div><span class="overline">PLATINUM PROGRESS</span><h2>${overall.done} <span>/ ${overall.total}</span></h2><p>Trophies collected.<br>The rest is yours for the taking.</p></div></div><div class="tier-stats">${tiers.map(g => {const s=stats(g); return `<div class="tier-stat ${g}"><div class="tier-icon">✦</div><div><strong>${title(g)}</strong><span>${s.done} / ${s.total} earned · ${s.pct}%</span><div class="stat-bar"><b style="width:${s.pct}%"></b></div></div></div>`}).join('')}</div><div class="tracker-actions"><span class="overline">YOUR SAVE DATA</span><p>Progress stays on this device.</p><div><button data-action="export">Export ↗</button><label class="upload">Import ↙<input type="file" accept="application/json,.json" id="import-file"></label><button data-action="reset">Reset</button></div>${notice ? `<small role="status">${escapeHTML(notice)}</small>` : ''}</div></div></section>
    ${view === 'roadmap' ? roadmap() : checklist()}
    </main><footer><div><span class="footer-mark">L✦</span> LEONIDA FIELD GUIDE <small>AN UNOFFICIAL COMPANION</small></div><p>Made for the journey, not just the destination. <span>✦</span></p></footer>
    ${selected !== null ? detail() : ''}`;
  bind();
}
function checklist() {
  const visible = trophies.filter(t => (tier === 'all' || t.grade === tier) && (status === 'all' || (status === 'earned') === checked.has(t.id)) && (!query || (!isHidden(t) && `${t.name} ${t.description}`.toLowerCase().includes(query.toLowerCase()))));
  return `<section class="content" id="guide"><div class="section-heading"><div><div class="section-kicker">THE COLLECTION <span>✦</span> 01 — 55</div><h2>The trophy list<span>.</span></h2><p>Every milestone, one step closer to legendary.</p></div><div class="list-meta"><strong>${visible.length.toString().padStart(2,'0')}</strong><span> TROPHIES SHOWN</span></div></div><div class="toolbar"><label class="search"><span>⌕</span><input id="search" type="search" placeholder="Search trophies..." value="${escapeHTML(query)}" aria-label="Search trophies"><kbd>/</kbd></label><div class="select-wrap"><label for="tier">TIER</label><select id="tier"><option value="all">All tiers</option>${tiers.map(g=>`<option value="${g}" ${tier===g?'selected':''}>${title(g)}</option>`).join('')}</select></div><div class="select-wrap"><label for="status">STATUS</label><select id="status"><option value="all">All statuses</option><option value="unearned" ${status==='unearned'?'selected':''}>To do</option><option value="earned" ${status==='earned'?'selected':''}>Earned</option></select></div><label class="safe-toggle"><input type="checkbox" id="safe" ${safe?'checked':''}><span class="switch"></span><span>Spoiler safe<small>${safe?'ON':'OFF'}</small></span></label></div><div class="list-caption"><span>CHECK TO TRACK <span>↓</span></span><span>SELECT A TROPHY FOR THE GUIDE <span>↗</span></span></div>${visible.length ? tiers.map(g => {const items=visible.filter(t=>t.grade===g); if(!items.length)return ''; const s=stats(g); return `<div class="group"><div class="group-heading"><div><span class="group-gem ${g}">✦</span><h3>${title(g)}</h3><span class="group-count">${items.length.toString().padStart(2,'0')} SHOWN</span></div><span>${s.done} / ${s.total} EARNED</span></div>${items.map(row).join('')}</div>`}).join('') : '<div class="empty">No trophies match those filters. Try a different search.</div>'}</section>`;
}
function row(t) {
  const hidden=isHidden(t), done=checked.has(t.id);
  return `<article class="trophy-row ${done?'done':''}"><label class="check"><input type="checkbox" data-check="${t.id}" ${done?'checked':''} aria-label="Mark ${hidden?'spoiler trophy':escapeHTML(t.name)} earned"><span>✓</span></label><button class="row-main" data-open="${t.id}" ${hidden?'aria-label="Open spoiler trophy"':''}><span class="trophy-symbol ${t.grade}">✦</span><span class="trophy-text ${hidden?'blurred':''}" ${hidden?'aria-hidden="true"':''}><strong>${escapeHTML(t.name)}</strong><small>${escapeHTML(t.description)}</small></span>${hidden?'<span class="hidden-label">SPOILER · REVEAL</span>':''}<span class="row-arrow">↗</span></button></article>`;
}
function detail() {
  const t=trophies.find(x=>x.id===selected); if(!t)return '';
  const hidden=isHidden(t);
  return `<div class="modal-backdrop" data-close="true"><aside class="detail" role="dialog" aria-modal="true" aria-label="Trophy guide"><button class="close" data-close="true" aria-label="Close guide">×</button><div class="detail-top"><span class="group-gem ${t.grade}">✦</span><span>${t.grade.toUpperCase()} TROPHY</span><span class="detail-number">NO. ${String(t.id).padStart(2,'0')} / 55</span></div>${hidden?`<div class="detail-hidden"><div>✧</div><h2>Something to discover.</h2><p>This trophy has a cryptic description. Reveal it when you’re ready.</p><button class="button primary" data-reveal="${t.id}">Reveal trophy ↗</button></div>`:`<div class="detail-body"><span class="overline">THE OBJECTIVE</span><h2>${escapeHTML(t.name)}</h2><p class="official">${escapeHTML(t.description)}</p>${inferredMissable.has(t.id)?'<div class="warning">◈ &nbsp; POSSIBLY MISSABLE · INFERENCE<br><small>The description suggests caution; missability is not confirmed.</small></div>':''}<div class="detail-divider"></div><div class="section-kicker">FIELD NOTES <span>✦</span> THE APPROACH</div><h3>How to get there<span>.</span></h3><p class="guide-copy">${escapeHTML(guides[t.id] || 'Guide coming soon.')}</p><div class="note"><span>✳</span><p><strong>FIELD NOTE</strong>These are planning tips based on the trophy wording. Check in-game prompts for exact requirements.</p></div><button class="button ${checked.has(t.id)?'ghost':'primary'} detail-check" data-toggle="${t.id}">${checked.has(t.id)?'✓ &nbsp; Mark as not earned':'✓ &nbsp; Mark as earned'}</button></div>`}</aside></div>`;
}
function roadmap() {
  const steps=[['01','THE FIRST MILES','Story first','Follow the main missions through the finale, picking up nearby activities as they unlock. Keep separate saves before major choices and chapter finales; the descriptions do not establish which opportunities can be missed.'],['02','BACK ON THE ROAD','Clean up the map','Return to character strands, races, ranges and partner activities. Finish entire mission chains and track distinct wins. Check the in-game 100% list separately from this trophy checklist.'],['03','LEAVE NO STONE','Collect & explore','Travel region by region for meditation spots, card sets, WAiNK locations, vehicles and unexplored areas. Record each find as you go to avoid a long second lap.'],['04','THE LOOSE ENDS','Miscellaneous & online','Clear combat, robbery, spending and cryptic trophies. The supplied list does not specify online-only trophies; if online activities become relevant, verify their requirements in-game. Save before experimenting with uncertain triggers.'],['05','THE FINAL MILE','Claim the platinum','Compare your remaining trophies against your console, finish the last outstanding objective and let the trophy list sync. The platinum follows the other 54 trophies.']];
  return `<section class="content roadmap" id="guide"><div class="section-heading"><div><div class="section-kicker">THE GAME PLAN <span>✦</span> FIVE PHASES</div><h2>The road to platinum<span>.</span></h2><p>A little direction for a very big state. Make the journey your own.</p></div><div class="road-sign">55 <span>STOPS<br>ONE DESTINATION</span></div></div><div class="road-intro"><span>✳</span><p><strong>BEFORE YOU HIT THE ROAD</strong> This route is a planning aid based on the supplied trophy descriptions, not a guarantee about unknown game mechanics. Keep backup saves and check in-game requirements as you go.</p></div><div class="road-steps">${steps.map(([n,k,h,p])=>`<article class="road-step"><div class="step-number">${n}</div><div><span class="section-kicker">${k}</span><h3>${h}<span>.</span></h3><p>${p}</p></div><span class="step-arrow">↗</span></article>`).join('')}</div><button class="button primary" data-view="checklist">Back to the trophies ↗</button></section>`;
}
function bind() {
  document.querySelectorAll('[data-view]').forEach(el=>el.onclick=()=>{view=el.dataset.view; selected=null; render(); document.querySelector('#guide')?.scrollIntoView({behavior:'smooth'});});
  document.querySelectorAll('[data-check]').forEach(el=>el.onchange=()=>{const id=Number(el.dataset.check); el.checked?checked.add(id):checked.delete(id); save(); render();});
  document.querySelectorAll('[data-open]').forEach(el=>el.onclick=()=>{selected=Number(el.dataset.open); render(); document.querySelector('.close')?.focus();});
  document.querySelectorAll('[data-close]').forEach(el=>el.onclick=e=>{if(e.target===el){selected=null;render();}});
  document.querySelectorAll('[data-reveal]').forEach(el=>el.onclick=()=>{revealed.add(Number(el.dataset.reveal));render();});
  document.querySelectorAll('[data-toggle]').forEach(el=>el.onclick=()=>{const id=Number(el.dataset.toggle); checked.has(id)?checked.delete(id):checked.add(id);save();render();});
  const search=document.querySelector('#search'); if(search) search.oninput=e=>{const pos=e.target.selectionStart;query=e.target.value;render();const input=document.querySelector('#search');input.focus();input.setSelectionRange(pos,pos);};
  const tierEl=document.querySelector('#tier'); if(tierEl) tierEl.onchange=e=>{tier=e.target.value;render();};
  const statusEl=document.querySelector('#status'); if(statusEl) statusEl.onchange=e=>{status=e.target.value;render();};
  const safeEl=document.querySelector('#safe'); if(safeEl) safeEl.onchange=e=>{safe=e.target.checked;save();render();};
  document.querySelector('[data-action="reset"]').onclick=()=>{if(confirm('Reset all trophy progress?')){checked.clear();save();notice='Progress reset.';render();}};
  document.querySelector('[data-action="export"]').onclick=()=>{const blob=new Blob([JSON.stringify({version:1,checked:[...checked]},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='leonida-progress.json';a.click();URL.revokeObjectURL(url);};
  document.querySelector('#import-file').onchange=async e=>{try{const data=JSON.parse(await e.target.files[0].text());if(!Array.isArray(data.checked)||data.checked.some(id=>!Number.isInteger(id)||!trophies.some(t=>t.id===id)))throw Error();checked=new Set(data.checked);save();notice='Progress imported.';}catch{notice='Could not import that progress file.';}render();};
}
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&selected!==null){selected=null;render();}else if(e.key==='/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && view==='checklist'){e.preventDefault();document.querySelector('#search')?.focus();}});
fetch('./data/trophies.json').then(r=>{if(!r.ok)throw Error();return r.json();}).then(data=>{trophies=data.trophies;checked=new Set([...checked].filter(id=>trophies.some(t=>t.id===id)));render();}).catch(()=>{root.innerHTML='<div class="loading">Could not load the trophy list. Please run the local server and refresh.</div>';});
