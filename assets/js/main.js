(() => {
const C = window.ZS_CONTENT || { projects: [], social: {} };
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;

/* projects */
const grid = $('#grid');
C.projects.forEach((p, i) => {
  const b = document.createElement('button');
  b.className = 'proj rv' + (p.wide ? ' wide' : ''); b.type = 'button';
  b.setAttribute('aria-label', 'Open project: ' + p.name);
  const letter = p.name.trim().charAt(0).toUpperCase();
  const media = p.image ? `<img src="${esc(p.image)}" alt="${esc(p.alt || p.name)}" loading="lazy" decoding="async" style="object-position:${esc(p.position || '50% 50%')}">` : '';
  const meta = [p.category, p.year].filter(Boolean).join(' — ');
  b.innerHTML = `<div class="vis${p.image ? ' has-img' : ''}" data-l="${esc(letter)}">${media}<div class="cover"></div></div>
    <div class="meta"><div><small>ZS / 00${i + 1}</small><h3>${esc(p.name)}</h3></div><span>${esc(meta)}</span></div>${p.description ? `<p>${esc(p.description)}</p>` : ''}`;
  b.onclick = () => openCase(p);
  grid.appendChild(b);
});

/* case study */
const dlg = $('#case');
function openCase(p) {
  $('#cc').textContent = [p.category, p.year].filter(Boolean).join(' — ');
  $('#ct').textContent = p.name;
  const imgs = p.images && p.images.length ? p.images : (p.image ? [{ src: p.image, alt: p.alt || p.name }] : []);
  const gal = imgs.length ? `<div class="gal">${imgs.map(i => `<img src="${esc(i.src)}" alt="${esc(i.alt || p.name)}" loading="lazy" decoding="async">`).join('')}</div>` : '';
  $('#cb').className = gal ? 'has-gal' : '';
  const stages = p.case && Object.entries(p.case).filter(([, v]) => v);
  $('#cb').innerHTML = gal + (stages && stages.length
    ? stages.map(([k, v], n) => `<article><h4>0${n + 1} — ${esc(k)}</h4><p>${esc(v)}</p></article>`).join('')
    : `<article><h4>Overview</h4><p>${esc(p.description || 'A ' + p.category.toLowerCase() + ' project by ZS Creative. Get in touch to see the full story and the work behind it.')}</p></article>
       <button class="btn solid" type="button" id="more">Discuss a similar project</button>`);
  const more = $('#more');
  if (more) more.onclick = () => { dlg.close(); location.hash = '#contact'; };
  dlg.showModal(); dlg.scrollTop = 0; document.body.classList.add('lock');
}
dlg.addEventListener('close', () => document.body.classList.remove('lock'));
$('#close').onclick = () => dlg.close();
dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });

/* mobile menu */
const nav = $('#nav'), mb = $('.menu');
const setMenu = o => { nav.classList.toggle('open', o); mb.setAttribute('aria-expanded', o); mb.textContent = o ? 'CLOSE' : 'MENU'; document.body.classList.toggle('lock', o); };
mb.onclick = () => setMenu(!nav.classList.contains('open'));
nav.addEventListener('click', e => { if (e.target.tagName === 'A') setMenu(false); });
addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
matchMedia('(min-width:901px)').addEventListener('change', () => setMenu(false));

/* reveal */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
function splitWords(el){let n=0;(function walk(node){[...node.childNodes].forEach(c=>{if(c.nodeType===3){const f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(t=>{if(!t.trim()){f.appendChild(document.createTextNode(t));return}const w=document.createElement('span');w.className='w';const i=document.createElement('i');i.textContent=t;if(!reduce)i.style.transitionDelay=(n++*60)+'ms';w.appendChild(i);f.appendChild(w)});c.replaceWith(f)}else if(c.nodeType===1&&c.tagName!=='BR')walk(c)})})(el)}
document.querySelectorAll('.split').forEach(splitWords);
document.querySelectorAll('.rv,.split').forEach(el => io.observe(el));

/* active nav link + scroll progress */
const links = [...document.querySelectorAll('nav a')];
const spy = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
}), { rootMargin: '-45% 0px -50% 0px' });
links.forEach(a => { const s = $(a.getAttribute('href')); if (s) spy.observe(s); });
const prog = document.createElement('div'); prog.className = 'prog'; prog.setAttribute('aria-hidden', 'true'); document.body.appendChild(prog);
let tick = false;
addEventListener('scroll', () => {
  if (tick) return; tick = true;
  requestAnimationFrame(() => { document.querySelector('header').classList.toggle('scrolled', scrollY > 40); if (!reduce) document.documentElement.style.setProperty('--sy', scrollY); const m = document.documentElement.scrollHeight - innerHeight; prog.style.transform = `scaleX(${m > 0 ? scrollY / m : 0})`; tick = false; });
}, { passive: true });

/* cursor + magnetic buttons */
if (!reduce && matchMedia('(hover:hover)').matches) {
  const c = $('.cur'); let x = 0, y = 0, tx = 0, ty = 0;
  addEventListener('pointermove', e => { tx = e.clientX - 18; ty = e.clientY - 18; c.style.opacity = 1; });
  (function loop() { x += (tx - x) * .18; y += (ty - y) * .18; c.style.transform = `translate(${x}px,${y}px)`; requestAnimationFrame(loop); })();
  document.addEventListener('pointerover', e => { const v = !!e.target.closest('.proj'); c.classList.toggle('view', v); c.classList.toggle('big', !v && !!e.target.closest('a,button')); });
  document.querySelectorAll('.mag').forEach(el => {
    el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(); el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px,${(e.clientY - r.top - r.height / 2) * .35}px)`; });
    el.addEventListener('pointerleave', () => el.style.transform = '');
  });
}

/* contact links (rendered into #social and #direct) */
const items = [];
Object.entries(C.social || {}).forEach(([n, u]) => { if (u) items.push(`<li><a href="${esc(u)}" target="_blank" rel="noopener noreferrer">${esc(n)}</a></li>`); });
if (C.email) items.push(`<li><a href="mailto:${esc(C.email)}">Email</a></li>`);
const social = $('#social'), direct = $('#direct');
if (items.length) {
  if (social) social.innerHTML = items.join('');
  if (direct) direct.innerHTML = items.join('');
} else {
  if (social) social.remove();
  if (direct) direct.remove();
}

/* Netlify form via fetch */
const form = $('#form');
if (form) {
  const st = form.querySelector('.status'), btn = form.querySelector('button');
  form.addEventListener('submit', async e => {
    e.preventDefault(); btn.disabled = true; st.className = 'status'; st.textContent = 'Sending…';
    try {
      const r = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(new FormData(form)).toString() });
      if (!r.ok) throw new Error('form');
      form.reset(); st.className = 'status ok'; st.textContent = 'Thank you. We will get back to you soon.';
    } catch { st.textContent = 'Something went wrong. Please try again.'; }
    btn.disabled = false;
  });
}

requestAnimationFrame(() => requestAnimationFrame(() => $('.hero').classList.add('in')));
const cl = $('#collab'); if (cl) cl.innerHTML = C.projects.map(p => `<li>${esc(p.name)}</li>`).join('');
$('#yr').textContent = new Date().getFullYear();
})();
