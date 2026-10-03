[10/3/2026 9:41 PM] Zak Uu: (() => {
  const C = window.ZS_CONTENT || { projects: [], social: {} };
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[m]));

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* projects */
  const grid = $('#grid');

  C.projects.forEach(p => {
    const b = document.createElement('button');

    b.className = 'proj rv';
    b.type = 'button';
    b.setAttribute('aria-label', 'Open project: ' + p.name);

    const letter = p.name.trim().charAt(0).toUpperCase();

    const media = p.image
      ? <img src="${esc(p.image)}" alt="${esc(p.alt || p.name)}" loading="lazy" decoding="async">
      : '';

    const meta = [p.category, p.year].filter(Boolean).join(' — ');

    b.innerHTML = 
      <div class="vis" data-l="${esc(letter)}">
        ${media}
        <div class="cover"></div>
      </div>

      <div class="meta">
        <h3>${esc(p.name)}</h3>
        <span>${esc(meta)}</span>
      </div>

      ${p.description ? <p>${esc(p.description)}</p> : ''}
    ;

    b.onclick = () => openCase(p);
    grid.appendChild(b);
  });

  /* case study */
  const dlg = $('#case');

  function openCase(p) {
    $('#cc').textContent = [p.category, p.year]
      .filter(Boolean)
      .join(' — ');

    $('#ct').textContent = p.name;

    const stages = p.case &&
      Object.entries(p.case).filter(([, v]) => v);

    $('#cb').innerHTML = stages && stages.length
      ? stages.map(([k, v]) => 
          <article>
            <h4>${esc(k)}</h4>
            <p>${esc(v)}</p>
          </article>
        ).join('')
      : 
          <article>
            <h4>Overview</h4>
            <p>${esc(
              p.description ||
              'A ' + p.category.toLowerCase() +
              ' project by ZS Creative. Get in touch to see the full story and the work behind it.'
            )}</p>
          </article>

          <button class="btn solid" type="button" id="more">
            Discuss a similar project
          </button>
        ;

    const more = $('#more');

    if (more) {
      more.onclick = () => {
        dlg.close();
        location.hash = '#contact';
      };
    }

    dlg.showModal();
    dlg.scrollTop = 0;
    document.body.classList.add('lock');
  }

  dlg.addEventListener('close', () => {
    document.body.classList.remove('lock');
  });

  $('#close').onclick = () => dlg.close();

  dlg.addEventListener('click', e => {
    if (e.target === dlg) dlg.close();
  });

  /* mobile menu */
  const nav = $('#nav');
  const mb = $('.menu');

  const setMenu = o => {
    nav.classList.toggle('open', o);
    mb.setAttribute('aria-expanded', o);
    mb.textContent = o ? 'CLOSE' : 'MENU';
    document.body.classList.toggle('lock', o);
  };

  mb.onclick = () => {
    setMenu(!nav.classList.contains('open'));
  };

  nav.addEventListener('click', e => {
    if (e.target.tagName === 'A') setMenu(false);
  });

  addEventListener('keydown', e => {
    if (e.key === 'Escape') setMenu(false);
  });

  matchMedia('(min-width: 901px)').addEventListener('change', () => {
    setMenu(false);
  });

  /* reveal */
  const io = new IntersectionObserver(
    es => es.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    }),
    { threshold: 0.12 }
  );

  document.querySelectorAll('.rv').forEach(el => io.observe(el));

  /* active nav link + scroll progress */
  const links = [...document.querySelectorAll('nav a')];

  const spy = new IntersectionObserver(
    es => es.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(a =>
          a.classList.toggle(
            'active',
            a.getAttribute('href') === '#' + e.target.id
          )
        );
      }
    }),
    { rootMargin: '-45% 0px -50% 0px' }
  );

  links.forEach(a => {
    const s = $(a.getAttribute('href'));
    if (s) spy.observe(s);
  });
[10/3/2026 9:41 PM] Zak Uu: const prog = document.createElement('div');
  prog.className = 'prog';
  prog.setAttribute('aria-hidden', 'true');
  document.body.appendChild(prog);

  let tick = false;

  addEventListener(
    'scroll',
    () => {
      if (tick) return;

      tick = true;

      requestAnimationFrame(() => {
        const m =
          document.documentElement.scrollHeight - innerHeight;

        prog.style.transform =
          scaleX(${m > 0 ? scrollY / m : 0});

        tick = false;
      });
    },
    { passive: true }
  );

  /* cursor + magnetic buttons */
  if (!reduce && matchMedia('(hover: hover)').matches) {
    const c = $('.cur');

    let x = 0;
    let y = 0;
    let tx = 0;
    let ty = 0;

    addEventListener('pointermove', e => {
      tx = e.clientX - 18;
      ty = e.clientY - 18;
      c.style.opacity = 1;
    });

    (function loop() {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;

      c.style.transform = translate(${x}px, ${y}px);

      requestAnimationFrame(loop);
    })();

    document.addEventListener('pointerover', e => {
      c.classList.toggle(
        'big',
        !!e.target.closest('a,button')
      );
    });

    document.querySelectorAll('.mag').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();

        el.style.transform =
          translate(${(e.clientX - r.left - r.width / 2) * 0.25}px,
          ${(e.clientY - r.top - r.height / 2) * 0.35}px);
      });

      el.addEventListener('pointerleave', () => {
        el.style.transform = '';
      });
    });
  }

  /* contact links */
  const items = [];

  Object.entries(C.social || {}).forEach(([n, u]) => {
    if (u) {
      items.push(
        <li>
          <a href="${esc(u)}" target="_blank" rel="noopener noreferrer">
            ${esc(n)}
          </a>
        </li>
      );
    }
  });

  if (C.email) {
    items.push(
      <li>
        <a href="mailto:${esc(C.email)}">
          Email
        </a>
      </li>
    );
  }

  $('#social').innerHTML = items.join('');
  $('#direct').innerHTML = items.join('');

  if (!items.length) {
    $('#social').remove();
    $('#direct').remove();
  }

  /* Netlify form */
  const form = $('#form');

  if (form) {
    const st = form.querySelector('.status');
    const btn = form.querySelector('button');

    form.addEventListener('submit', async e => {
      e.preventDefault();

      btn.disabled = true;
      st.className = 'status';
      st.textContent = 'Sending…';

      try {
        const r = await fetch('/', {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams(
            new FormData(form)
          ).toString()
        });

        if (!r.ok) throw new Error();

        form.reset();

        st.className = 'status ok';
        st.textContent =
          'Thank you. We will get back to you soon.';

      } catch {
        st.textContent =
          'Something went wrong. Please try again.';
      }

      btn.disabled = false;
    });
  }

  /* year */
  $('#yr').textContent = new Date().getFullYear();

})();
