$(document).ready(function () {

  /* ============================================
     DATOS Y CONSTANTES
     ============================================ */
  const ETIQUETA     = { ps5: 'PS5', pc: 'PC', arcade: 'Arcade' };
  const PLAZO        = 300;  // 5 min para confirmar (constante)
  const TIEMPO_MODAL = 30;   // 30 s del modal
  const KEY          = 'levelup_v5';
  const VISTAS       = ['inicio', 'todos', 'ps5', 'pc', 'arcade', 'reserva'];
  const CAMPOS       = ['nombre', 'ci', 'tel', 'email', 'personas', 'fecha', 'hora', 'terms'];

  // stock = máquinas disponibles de ese tipo | img = archivo dentro de img/
  // IMPORTANTE: cada id debe ser único
  const estaciones = [

    /* ---------- PS5 ---------- */
    { id: 'ps5-fifa',  nombre: 'PS5 · Sala FIFA',        tipo: 'ps5', icono: '⚽',  img: 'ps5-fifa.jpg',
      precio: 25, stock: 3, det: ['2 controles DualSense', 'TV 55" 4K 120Hz', 'FIFA 24, UFC 5'] },
    { id: 'ps5-aven',  nombre: 'PS5 · Sala Aventura',    tipo: 'ps5', icono: '🕷️', img: 'ps5-aventura.jpg',
      precio: 25, stock: 3, det: ['Control DualSense', 'TV 50" 4K', 'Spider-Man 2, God of War'] },
    { id: 'ps5-race',  nombre: 'PS5 · Sala Carreras',    tipo: 'ps5', icono: '🏎️', img: 'ps5-carreras.jpg',
      precio: 28, stock: 2, det: ['Volante con pedales', 'TV 55" 4K', 'Gran Turismo 7, F1 24'] },
    { id: 'ps5-coop',  nombre: 'PS5 · Sala Cooperativo', tipo: 'ps5', icono: '🤝',  img: 'ps5-coop.jpg',
      precio: 25, stock: 3, det: ['4 controles DualSense', 'Sofá para grupos', 'It Takes Two, Overcooked'] },
    { id: 'ps5-fight', nombre: 'PS5 · Sala Peleas',      tipo: 'ps5', icono: '🥋',  img: 'ps5-peleas.jpg',
      precio: 25, stock: 2, det: ['Arcade stick opcional', 'TV 50" 4K', 'Tekken 8, Mortal Kombat 1'] },
    { id: 'ps5-vip',   nombre: 'PS5 · Sala VIP',         tipo: 'ps5', icono: '👑',  img: 'ps5-vip.jpg',
      precio: 40, stock: 1, det: ['Sala privada con A/C', 'TV 65" OLED', 'Sofá + mesa de snacks'] },

    /* ---------- PC GAMER ---------- */
    { id: 'pc-pro',    nombre: 'PC Gamer · Pro',         tipo: 'pc', icono: '🎯',  img: 'pc-pro.jpg',
      precio: 30, stock: 6, det: ['Ryzen 7 + RTX 4060', 'Monitor 144Hz', 'Teclado mecánico'] },
    { id: 'pc-std',    nombre: 'PC Gamer · Estándar',    tipo: 'pc', icono: '🔫',  img: 'pc-estandar.jpg',
      precio: 20, stock: 8, det: ['Ryzen 5 + GTX 1660', 'Monitor 75Hz', 'Audífonos gamer'] },
    { id: 'pc-stream', nombre: 'PC Gamer · Streaming',   tipo: 'pc', icono: '🎥',  img: 'pc-streaming.jpg',
      precio: 38, stock: 2, det: ['Ryzen 9 + RTX 4070', 'Micrófono y cámara', 'OBS instalado'] },
    { id: 'pc-moba',   nombre: 'PC Gamer · MOBA / LoL',  tipo: 'pc', icono: '⚔️', img: 'pc-moba.jpg',
      precio: 22, stock: 5, det: ['Ryzen 5 + RTX 3050', 'Monitor 144Hz', 'League of Legends, Dota 2'] },
    { id: 'pc-fps',    nombre: 'PC Gamer · FPS Competitivo', tipo: 'pc', icono: '🎯', img: 'pc-fps.jpg',
      precio: 32, stock: 4, det: ['Monitor 240Hz', 'Mouse ultraligero', 'Valorant, CS2, Apex'] },
    { id: 'pc-team',   nombre: 'PC Gamer · Zona Equipos', tipo: 'pc', icono: '👥', img: 'pc-equipos.jpg',
      precio: 28, stock: 5, det: ['Mesa para 5 jugadores', 'Voz por equipo', 'Ideal para torneos'] },

    /* ---------- ARCADE ---------- */
    { id: 'arc-sf',    nombre: 'Arcade · Street Fighter', tipo: 'arcade', icono: '🥊', img: 'arcade-sf.jpg',
      precio: 10, stock: 2, det: ['500+ juegos clásicos', '2 jugadores', 'Joysticks originales'] },
    { id: 'arc-pac',   nombre: 'Arcade · Pac-Man',       tipo: 'arcade', icono: '👻', img: 'arcade-pacman.jpg',
      precio: 10, stock: 2, det: ['Máquina vintage', '1–2 jugadores', 'Ranking de puntajes'] },
    { id: 'arc-moto',  nombre: 'Arcade · Motos y Carreras', tipo: 'arcade', icono: '🏍️', img: 'arcade-motos.jpg',
      precio: 12, stock: 2, det: ['Asiento simulador', 'Pantalla 42"', 'Daytona USA'] },
    { id: 'arc-dance', nombre: 'Arcade · Baile',         tipo: 'arcade', icono: '💃', img: 'arcade-baile.jpg',
      precio: 12, stock: 1, det: ['Plataforma de baile', '2 jugadores', 'Dance Dance Revolution'] },
    { id: 'arc-air',   nombre: 'Arcade · Air Hockey',    tipo: 'arcade', icono: '🏒', img: 'arcade-airhockey.jpg',
      precio: 8,  stock: 2, det: ['Mesa profesional', '1 vs 1', 'Marcador digital'] },
    { id: 'arc-bask',  nombre: 'Arcade · Basketball',    tipo: 'arcade', icono: '🏀', img: 'arcade-basket.jpg',
      precio: 8,  stock: 2, det: ['Aros con marcador', 'Competencia de tiros', 'Ranking diario'] },
    { id: 'arc-claw',  nombre: 'Arcade · Peluches',      tipo: 'arcade', icono: '🧸', img: 'arcade-peluches.jpg',
      precio: 5,  stock: 2, det: ['Máquina de garra', 'Premios variados', 'Para todas las edades'] },
    { id: 'arc-shoot', nombre: 'Arcade · Pistolas',      tipo: 'arcade', icono: '🔫', img: 'arcade-pistolas.jpg',
      precio: 12, stock: 1, det: ['2 pistolas de luz', 'Modo cooperativo', 'House of the Dead'] }
  ];

  const temas = {
    todos:   { clase: 'theme-todos',   icono: '📚', titulo: 'Catálogo completo', sub: 'Todas las estaciones. Ocupa las que necesite tu grupo.' },
    ps5:     { clase: 'theme-ps5',     icono: '🎮', titulo: 'PlayStation 5',     sub: 'Solo estaciones PS5.' },
    pc:      { clase: 'theme-pc',      icono: '💻', titulo: 'PC Gamer',          sub: 'Solo estaciones PC Gamer.' },
    arcade:  { clase: 'theme-arcade',  icono: '👾', titulo: 'Arcade Retro',      sub: 'Solo máquinas Arcade.' },
    reserva: { clase: 'theme-reserva', icono: '🧾', titulo: 'Tu reserva',        sub: 'Completa tus datos y confirma antes de que termine el plazo.' }
  };

  let pedido        = {};    // { idEstacion: cantidad }
  let deadline      = null;  // plazo global (timestamp)
  let modalDeadline = null;  // plazo del modal (timestamp)
  let vistaActual   = 'inicio';

  /* ============================================
     UTILIDADES
     ============================================ */
  function porId(id) { return estaciones.find(e => e.id === id); }
  function totalMaquinas() { return Object.values(pedido).reduce((a, b) => a + b, 0); }
  function fmt(n) { return Number(n.toFixed(2)); }
  function imgTag(f) { return '<img src="img/' + f + '" alt="" loading="lazy" onerror="this.remove()">'; }

  /* ============================================
     1. RENDER DE TARJETAS (con imagen y contador)
     ============================================ */
  estaciones.forEach(function (e) {
    const lista = e.det.map(d => '<li>' + d + '</li>').join('');
    $('#games').append(`
      <article class="game-card" data-type="${e.tipo}" data-id="${e.id}">
        <div class="media img-${e.tipo}">
          <span class="emoji">${e.icono}</span>
          ${imgTag(e.img)}
          <span class="badge">${ETIQUETA[e.tipo]}</span>
          <span class="stock ${e.stock <= 2 ? 'low' : ''}">${e.stock} disp.</span>
        </div>
        <div class="game-body">
          <h3>${e.nombre}</h3>
          <p class="game-price">${e.precio} BOB / hora por máquina</p>
          <div class="accordion-btn">📌 Ver detalles</div>
          <div class="accordion-panel" style="display:none;"><ul>${lista}</ul></div>
          <div class="qty-row">
            <span>Máquinas</span>
            <div class="counter">
              <button class="st-minus">−</button>
              <span class="st-qty">0</span>
              <button class="st-plus">+</button>
            </div>
          </div>
        </div>
      </article>`);
  });

  // Datos del inicio calculados desde el arreglo
  $('#stat-total').text(estaciones.reduce((a, e) => a + e.stock, 0));
  $('#stat-min').text(Math.min.apply(null, estaciones.map(e => e.precio)));

  // Fecha mínima = hoy
  (function () {
    const h = new Date();
    $('#fecha').attr('min', h.getFullYear() + '-' + String(h.getMonth() + 1).padStart(2, '0') + '-' + String(h.getDate()).padStart(2, '0'));
  })();

  /* ============================================
     2. MENÚ HAMBURGUESA
     ============================================ */
  $('#burger').click(function () {
    const abierto = $('#main-nav').toggleClass('open').hasClass('open');
    $(this).toggleClass('open', abierto).attr('aria-expanded', abierto);
  });
  function cerrarMenu() {
    $('#main-nav').removeClass('open');
    $('#burger').removeClass('open').attr('aria-expanded', false);
  }
  $('#main-nav').on('click', '.nav-link', cerrarMenu);

  /* ============================================
     3. NAVEGACIÓN POR PÁGINAS (hash)
     ============================================ */
  function route(nombre) {
    if (VISTAS.indexOf(nombre) === -1) nombre = 'inicio';
    vistaActual = nombre;

    $('.nav-link').removeClass('active').filter('[data-view="' + nombre + '"]').addClass('active');

    // Hero compacto (en Inicio se usa la portada grande)
    $('#hero').toggleClass('hidden', nombre === 'inicio');
    if (temas[nombre]) {
      const t = temas[nombre];
      $('#hero').removeClass('theme-todos theme-ps5 theme-pc theme-arcade theme-reserva').addClass(t.clase);
      $('#hero-icon').html(t.icono);
      $('#hero-title').text(t.titulo);
      $('#hero-sub').text(t.sub);
    }

    $('.view').addClass('hidden');
    if (nombre === 'inicio') {
      $('#view-inicio').stop(true, true).hide().removeClass('hidden').fadeIn(350);
    } else if (nombre === 'reserva') {
      $('#view-reserva').stop(true, true).hide().removeClass('hidden').fadeIn(350);
    } else {
      $('#view-catalogo').removeClass('hidden');
      $('.game-card').stop(true, true).hide();
      const sel = nombre === 'todos' ? '.game-card' : '.game-card[data-type="' + nombre + '"]';
      $(sel).fadeIn(400);
    }
    actualizarBarra();
    window.scrollTo(0, 0);
  }
  $(window).on('hashchange', function () { route(location.hash.replace('#', '')); });

  /* ============================================
     4. ACORDEÓN (delegado)
     ============================================ */
  $('#games').on('click', '.accordion-btn', function () {
    $(this).next('.accordion-panel').slideToggle('slow');
  });

  /* ============================================
     5. CONTADOR DE MÁQUINAS (reserva grupal)
     ============================================ */
  function setQty(id, q) {
    const e = porId(id);
    q = Math.max(0, Math.min(e.stock, q));
    if (q > 0) pedido[id] = q; else delete pedido[id];

    // El plazo arranca con la primera máquina y se cancela si el grupo queda vacío
    if (totalMaquinas() > 0) { if (!deadline) deadline = Date.now() + PLAZO * 1000; }
    else deadline = null;

    syncCards();
    renderResumen();
    tick();
  }

  $('#games').on('click', '.st-plus', function () {
    const id = $(this).closest('.game-card').data('id');
    const e = porId(id), actual = pedido[id] || 0;
    if (actual >= e.stock) {
      toast('⚠️ Solo hay ' + e.stock + ' máquina(s) de "' + e.nombre + '"', 'error');
      return;
    }
    setQty(id, actual + 1);
  });
  $('#games').on('click', '.st-minus', function () {
    const id = $(this).closest('.game-card').data('id');
    setQty(id, (pedido[id] || 0) - 1);
  });

  function syncCards() {
    $('.game-card').each(function () {
      const q = pedido[$(this).data('id')] || 0;
      $(this).find('.st-qty').text(q);
      $(this).toggleClass('selected', q > 0);
    });
  }

  /* ============================================
     6. CALCULADOR + COMBOS
     ============================================ */
  $('#hrs').on('input', renderResumen);
  $('#hrs').on('change', function () {
    $(this).val(Math.min(12, Math.max(1, parseInt($(this).val()) || 1)));
    renderResumen();
  });
  $('#rate').on('change', renderResumen);

  $('.plus').click(function () {
    const q = $(this).siblings('.qty');
    q.text(Number(q.text()) + 1);
    renderResumen();
  });
  $('.minus').click(function () {
    const q = $(this).siblings('.qty');
    if (Number(q.text()) > 0) q.text(Number(q.text()) - 1);
    renderResumen();
  });

  function calcular() {
    const horas  = Math.min(12, Math.max(1, parseInt($('#hrs').val()) || 1));
    const factor = Number($('#rate').val());

    const items = [];
    let bruto = 0;
    Object.keys(pedido).forEach(function (id) {
      const e = porId(id), q = pedido[id];
      const sub = e.precio * q * horas;
      items.push({ e: e, q: q, sub: sub });
      bruto += sub;
    });
    const desc = bruto * (1 - factor);

    const combos = [];
    let totalCombos = 0;
    $('.combo').each(function () {
      const q = Number($(this).find('.qty').text());
      if (q > 0) {
        const sub = q * Number($(this).data('price'));
        combos.push({ nombre: $(this).data('name'), q: q, sub: sub });
        totalCombos += sub;
      }
    });
    return { horas, factor, items, bruto, desc, combos, total: bruto - desc + totalCombos };
  }

  /* ============================================
     7. RESUMEN DE PEDIDO + BARRA FLOTANTE
     ============================================ */
  function renderResumen() {
    const c = calcular();
    const lista = $('#order-list').empty();

    if (c.items.length === 0 && c.combos.length === 0) {
      lista.append('<li class="empty">Aún no seleccionas nada<a href="#todos">Elegir máquinas →</a></li>');
    }
    c.items.forEach(function (it) {
      lista.append(`<li><span>🎮 ${it.q}× ${it.e.nombre} × ${c.horas} h</span><b>${fmt(it.sub)} BOB</b></li>`);
    });
    if (c.desc > 0) {
      lista.append(`<li class="disc"><span>⚡ Tarifa Flash −15%</span><b>−${fmt(c.desc)} BOB</b></li>`);
    }
    c.combos.forEach(function (k) {
      lista.append(`<li><span>🍔 ${k.nombre} × ${k.q}</span><b>${fmt(k.sub)} BOB</b></li>`);
    });

    $('#total-price').text(fmt(c.total) + ' BOB')
      .stop(true, true)
      .animate({ fontSize: '1.5rem' }, 120)
      .animate({ fontSize: '1.2rem' }, 120);

    $('#nav-dot').toggleClass('hidden', totalMaquinas() === 0);

    // Si ya escribió personas, revalidar contra el número de máquinas
    if ($('#personas').val()) validarCampo('personas');

    actualizarBarra();
    guardar();
  }

  function actualizarBarra() {
    const n = totalMaquinas();
    let porHora = 0;
    Object.keys(pedido).forEach(id => { porHora += porId(id).precio * pedido[id]; });
    $('#cb-count').text(n);
    $('#cb-total').text(porHora);
    $('#cart-bar').toggleClass('hidden', n === 0 || vistaActual === 'reserva');
  }

  /* ============================================
     8. VALIDACIÓN DEL FORMULARIO
     ============================================ */
  const LETRAS = 'A-Za-zÁÉÍÓÚÜáéíóúüÑñ';
  const reglas = {
    nombre:   v => new RegExp('^[' + LETRAS + ']{2,}(\\s+[' + LETRAS + ']{2,})+$').test(v.trim()) ? '' : 'Ingresa nombre y apellido (solo letras).',
    ci:       v => /^\d{6,9}$/.test(v) ? '' : 'La CI debe tener entre 6 y 9 dígitos.',
    tel:      v => /^[67]\d{7}$/.test(v) ? '' : 'Celular de 8 dígitos que empiece con 6 o 7.',
    email:    v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Ingresa un correo válido.',
    personas: function (v) {
      const n = parseInt(v);
      if (!n || n < 1 || n > 40) return 'Entre 1 y 40 personas.';
      if (totalMaquinas() > n) return 'Tienes ' + totalMaquinas() + ' máquinas para ' + n + ' persona(s).';
      return '';
    },
    fecha:    v => !v ? 'Elige una fecha.' : (v < $('#fecha').attr('min') ? 'La fecha no puede ser pasada.' : ''),
    hora:     v => v ? '' : 'Elige un horario.',
    terms:    v => v ? '' : 'Debes aceptar las condiciones.'
  };

  function validarCampo(id) {
    const el  = $('#' + id);
    const val = el.is(':checkbox') ? el.is(':checked') : el.val();
    const msg = reglas[id](val);
    const box = el.closest('.field');
    box.toggleClass('invalid', !!msg).toggleClass('valid', !msg);
    box.find('.err').text(msg);
    return !msg;
  }

  $('#ci, #tel').on('input', function () { this.value = this.value.replace(/\D/g, ''); });
  $('#client-form').on('input change focusout', 'input, select', function () {
    validarCampo(this.id);
    guardar();
  });

  /* ============================================
     9. CONFIRMAR → valida y abre el modal
     ============================================ */
  $('#btn-confirm').click(function () {
    if (totalMaquinas() === 0) {
      toast('⚠️ Primero elige al menos una máquina', 'error');
      location.hash = 'todos';
      return;
    }
    let primero = null;
    CAMPOS.forEach(function (id) { if (!validarCampo(id) && !primero) primero = id; });
    if (primero) {
      toast('⚠️ Revisa los datos de quien reserva', 'error');
      $('#' + primero).focus();
      return;
    }
    abrirModal();
  });

  /* ============================================
     10. MODAL (30 s)
     ============================================ */
  function abrirModal() {
    const c = calcular();
    const detalle = c.items.map(it => it.q + '× ' + it.e.nombre).join(', ');
    const combosTxt = c.combos.length ? ' + ' + c.combos.length + ' combo(s)' : '';

    $('#m-client').text($('#nombre').val().trim() + ' (CI ' + $('#ci').val() + ')');
    $('#m-group').text($('#personas').val() + ' persona(s) · ' + totalMaquinas() + ' máquina(s)');
    $('#m-when').text($('#fecha').val().split('-').reverse().join('/') + ' · ' + $('#hora').val());
    $('#m-service').text(detalle + combosTxt);
    $('#m-amount').text(fmt(c.total) + ' BOB (' + c.horas + (c.horas === 1 ? ' Hora' : ' Horas') + ')');

    modalDeadline = Date.now() + TIEMPO_MODAL * 1000;
    $('#timer-fill').css('transition', 'none').css('width', '100%');
    setTimeout(function () { $('#timer-fill').css('transition', 'width 1s linear'); }, 30);
    pintarTimer(TIEMPO_MODAL);
    $('#modal-overlay').fadeIn(200);
  }

  function pintarTimer(s) {
    $('#m-timer').text(String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0')).toggleClass('danger', s <= 10);
    $('#timer-fill').css('width', (s / TIEMPO_MODAL * 100) + '%');
  }

  function cerrarModal() {
    modalDeadline = null;
    $('#modal-overlay').fadeOut(300);
  }
  $('#modal-close, #m-cancel').click(cerrarModal);
  $('#modal-overlay').click(function (e) { if (e.target === this) cerrarModal(); });
  $(document).keyup(function (e) {
    if (e.key === 'Escape' && $('#modal-overlay').is(':visible')) cerrarModal();
  });

  /* ============================================
     11. PROCESAR PAGO
     ============================================ */
  $('#m-pay').click(function () {
    const total  = $('#m-amount').text();
    const nombre = $('#nombre').val().trim().split(' ')[0];
    const codigo = 'LU-' + Date.now().toString(36).toUpperCase().slice(-5);

    cerrarModal();
    reiniciarPedido(true);
    toast('✅ ¡Reserva confirmada, ' + nombre + '! Código ' + codigo + ' · ' + total, 'success');
    location.hash = 'inicio';
  });

  function reiniciarPedido(limpiarForm) {
    pedido   = {};
    deadline = null;
    $('#hrs').val(1);
    $('#rate').val('1');
    $('.qty').text(0);
    syncCards();

    if (limpiarForm) {
      CAMPOS.forEach(function (id) {
        const el = $('#' + id);
        if (el.is(':checkbox')) el.prop('checked', false); else el.val('');
        el.closest('.field').removeClass('valid invalid').find('.err').text('');
      });
    }
    renderResumen();
    pintarPlazo(null);
  }

  /* ============================================
     12. TEMPORIZADOR CONSTANTE
     ============================================ */
  function tick() {
    if (deadline) {
      const r = Math.ceil((deadline - Date.now()) / 1000);
      if (r <= 0) {
        cerrarModal();
        reiniciarPedido(false);
        toast('⏰ Tarifa Flash Expirada: se agotó tu plazo', 'error');
      } else {
        pintarPlazo(r);
      }
    } else {
      pintarPlazo(null);
    }

    if (modalDeadline) {
      const m = Math.ceil((modalDeadline - Date.now()) / 1000);
      if (m <= 0) {
        cerrarModal();
        toast('⏰ Tarifa Flash Expirada', 'error');
      } else {
        pintarTimer(m);
      }
    }
  }

  function pintarPlazo(r) {
    const activo = r !== null;
    $('#hold-chip, #hold-box').toggleClass('hidden', !activo);
    if (!activo) return;
    const txt = String(Math.floor(r / 60)).padStart(2, '0') + ':' + String(r % 60).padStart(2, '0');
    $('#hold-chip-time, #hold-timer').text(txt);
    $('#hold-chip, #hold-timer, #hold-fill').toggleClass('danger', r <= 60);
    $('#hold-fill').css('width', (r / PLAZO * 100) + '%');
  }

  setInterval(tick, 1000);

  /* ============================================
     13. PERSISTENCIA (localStorage)
     ============================================ */
  function leerCombos() {
    const o = {};
    $('.combo').each(function () { o[$(this).data('name')] = Number($(this).find('.qty').text()); });
    return o;
  }
  function leerForm() {
    const o = {};
    CAMPOS.forEach(function (id) {
      const el = $('#' + id);
      o[id] = el.is(':checkbox') ? el.is(':checked') : el.val();
    });
    return o;
  }
  function guardar() {
    try {
      localStorage.setItem(KEY, JSON.stringify({
        pedido: pedido, deadline: deadline,
        hrs: $('#hrs').val(), rate: $('#rate').val(),
        combos: leerCombos(), form: leerForm()
      }));
    } catch (e) {}
  }
  function restaurar() {
    let s = null;
    try { s = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
    if (!s) return;

    if (s.form) {
      CAMPOS.forEach(function (id) {
        const el = $('#' + id);
        if (el.is(':checkbox')) el.prop('checked', !!s.form[id]); else el.val(s.form[id] || '');
      });
    }
    const hayPedido = s.pedido && Object.keys(s.pedido).length > 0;
    if (hayPedido && s.deadline && s.deadline > Date.now()) {
      Object.keys(s.pedido).forEach(function (id) {
        const e = porId(id);
        if (e) pedido[id] = Math.min(e.stock, s.pedido[id]);
      });
      deadline = s.deadline;
      $('#hrs').val(s.hrs || 1);
      $('#rate').val(s.rate || '1');
      $('.combo').each(function () {
        $(this).find('.qty').text((s.combos || {})[$(this).data('name')] || 0);
      });
      syncCards();
    } else if (hayPedido) {
      setTimeout(function () { toast('⏰ Tu plazo anterior expiró. Vuelve a elegir', 'error'); }, 600);
    }
  }

  /* ============================================
     14. TOAST
     ============================================ */
  function toast(mensaje, tipo) {
    $('<div class="toast ' + (tipo || '') + '"></div>')
      .text(mensaje)
      .appendTo('#toast-box')
      .slideDown(300)
      .delay(3000)
      .fadeOut(400, function () { $(this).remove(); });
  }

  /* ============================================
     15. TEMA CLARO / OSCURO
     ============================================ */
  $('#theme-toggle').click(function () {
    $('body').toggleClass('light');
    $('#theme-indicator').text($('body').hasClass('light') ? 'Claro' : 'Neón');
  });

  /* ============================================
     INICIO
     ============================================ */
  restaurar();
  renderResumen();
  route(location.hash.replace('#', ''));
  tick();

});
