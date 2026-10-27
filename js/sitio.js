/* Clima Clara — interacciones de la demo */
(function () {
  'use strict';

  const WHATSAPP = '56955551234';

  /* Cabecera con sombra al hacer scroll */
  const cabecera = document.getElementById('cabecera');
  if (cabecera) {
    const sombra = () => cabecera.classList.toggle('scrolled', window.scrollY > 8);
    sombra();
    window.addEventListener('scroll', sombra, { passive: true });
  }

  /* Menú móvil */
  const menuBtn = document.getElementById('menu-btn');
  const nav = document.getElementById('nav');
  if (menuBtn && nav) {
    const cerrar = () => {
      nav.classList.remove('abierto');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.setAttribute('aria-label', 'Abrir menú');
    };
    menuBtn.addEventListener('click', () => {
      const abierto = nav.classList.toggle('abierto');
      menuBtn.setAttribute('aria-expanded', String(abierto));
      menuBtn.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', cerrar));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') cerrar();
    });
    document.addEventListener('click', e => {
      if (!nav.contains(e.target) && !menuBtn.contains(e.target)) cerrar();
    });
  }

  /* Revelado suave al entrar en pantalla */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const obs = new IntersectionObserver(
      entradas => {
        entradas.forEach(entrada => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add('visible');
            obs.unobserve(entrada.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach(el => obs.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }

  /* FAQ: dejar abierta solo una */
  const faqs = document.querySelectorAll('.faq');
  faqs.forEach(faq => {
    faq.addEventListener('toggle', () => {
      if (faq.open) {
        faqs.forEach(otro => {
          if (otro !== faq) otro.open = false;
        });
      }
    });
  });

  /* Filtros de proyectos */
  const filtros = document.querySelectorAll('.filtro');
  const proyectos = document.querySelectorAll('#galeria .proyecto-card');
  if (filtros.length && proyectos.length) {
    filtros.forEach(btn => {
      btn.addEventListener('click', () => {
        filtros.forEach(b => b.classList.remove('activo'));
        btn.classList.add('activo');
        const filtro = btn.dataset.filtro;
        proyectos.forEach(card => {
          const visible = filtro === 'Todos' || card.dataset.categoria === filtro;
          card.hidden = !visible;
        });
      });
    });
  }

  /* Formulario: arma un mensaje de WhatsApp, sin backend */
  const form = document.getElementById('form-presupuesto');
  const estado = document.getElementById('form-estado');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        if (estado) estado.textContent = 'Revisa los campos obligatorios y acepta el consentimiento.';
        return;
      }

      const datos = new FormData(form);
      const nombre = String(datos.get('nombre') || '').trim();
      const telefono = String(datos.get('telefono') || '').trim();
      const comuna = String(datos.get('comuna') || '').trim();
      const servicio = String(datos.get('servicio') || '').trim();
      const mensaje = String(datos.get('mensaje') || '').trim();

      const texto = [
        'Hola, quiero pedir un presupuesto de aire acondicionado.',
        '',
        `Nombre: ${nombre}`,
        `Teléfono: ${telefono}`,
        `Comuna: ${comuna}`,
        `Servicio: ${servicio}`,
        mensaje ? `Detalle: ${mensaje}` : ''
      ]
        .filter(Boolean)
        .join('\n');

      const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;
      if (estado) estado.textContent = 'Abriendo WhatsApp con tu solicitud…';

      const ventana = window.open(url, '_blank', 'noopener');
      if (!ventana) {
        window.location.href = url;
      } else if (estado) {
        estado.textContent = 'Listo. Si WhatsApp no se abrió, revisa el bloqueo de ventanas emergentes.';
      }
    });
  }
})();
