/* ============================================
   PWA: capturar el evento de instalación lo antes posible
   (puede dispararse antes de que el DOM esté listo)
   ============================================ */
let promptInstalacion = null;

window.addEventListener('beforeinstallprompt', function (e) {
  e.preventDefault();               // evita el mini-banner automático
  promptInstalacion = e;            // lo guardamos para usarlo con nuestro botón
  if (window.mostrarBotonInstalar) window.mostrarBotonInstalar();
});

$(document).ready(function () {

  /* ============================================
     EJECUCIÓN ÚNICA: evita registrar todo dos veces
     ============================================ */
  if (window.__appInicializada) return;
  window.__appInicializada = true;

  /* ============================================
     1. DETECCIÓN MÓVIL / TABLET
     ============================================ */
  const esMovil = window.innerWidth <= 768 || /Android|iPhone|iPad/i.test(navigator.userAgent);
  $('body').addClass(esMovil ? 'modo-movil' : 'modo-escritorio');

  /* ============================================
     2. AVISOS VISUALES DE HIDRATACIÓN
     Pon MOSTRAR_HIDRATACION en false para la versión final
     ============================================ */
  const MOSTRAR_HIDRATACION = true;
  $('body').toggleClass('ver-hidratacion', MOSTRAR_HIDRATACION);

  function avisarHidratacion($el, nombre) {
    // Destello verde en el botón que se acaba de hidratar
    $el.addClass('hid-flash');
    setTimeout(function () { $el.removeClass('hid-flash'); }, 1300);

    // Mensaje emergente (uno por módulo, para no llenar la pantalla)
    if ($('#toastHid [data-n="' + nombre + '"]').length) return;
    $('<div class="toast-item">')
      .attr('data-n', nombre)
      .text('💧 Hidratado: ' + nombre)
      .hide()
      .appendTo('#toastHid')
      .fadeIn(200).delay(1800).fadeOut(300, function () { $(this).remove(); });
  }

  /* ============================================
     3. NÚCLEO DE HIDRATACIÓN MODULAR
     El HTML nace estático con:
       data-modulo="nombre"  data-cuando="momento"  data-hidratado="false"
     Cada módulo se registra con una función que adjunta
     los eventos SOLO a ese elemento, y solo cuando toca.
     ============================================ */
  const H = {
    modulos: {},

    registrar: function (nombre, fn) { this.modulos[nombre] = fn; },

    // Hidrata UN elemento (si no estaba hidratado)
    hidratar: function (el) {
      const $el = $(el);
      if ($el.attr('data-hidratado') !== 'false') return;
      const nombre = $el.attr('data-modulo');
      const fn = this.modulos[nombre];
      if (!fn) return;
      fn($el);
      $el.attr('data-hidratado', 'true');
      console.log('💧 Hidratado:', nombre, '(' + $el.attr('data-cuando') + ')');
      if (MOSTRAR_HIDRATACION) avisarHidratacion($el, nombre);
    },

    // Hidrata todo lo pendiente que espere ese momento (opcional: solo dentro de un contexto)
    disparar: function (cuando, $contexto) {
      const self = this;
      const sel = '[data-modulo][data-hidratado="false"]';
      const $raiz = $contexto || $(document);
      $raiz.find(sel).addBack(sel)
        .filter(function () { return $(this).attr('data-cuando') === cuando; })
        .each(function () { self.hidratar(this); });
    },

    // "interaccion": se hidrata con el primer toque/mouse/foco (antes del clic)
    esperarInteraccion: function () {
      const self = this;
      $('[data-modulo][data-cuando="interaccion"]').each(function () {
        const el = this;
        $(el).off('.hidratar')
          .on('pointerdown.hidratar touchstart.hidratar mouseenter.hidratar focusin.hidratar', function () {
            $(el).off('.hidratar');
            self.hidratar(el);
          });
      });
    },

    iniciar: function () {
      this.esperarInteraccion();
      const self = this;
      setTimeout(function () { self.disparar('carga'); }, 500);
    }
  };

  /* ============================================
     4. FUNCIONES DE APOYO (no registran eventos solas)
     ============================================ */
  const PAGINAS = ['inicio', 'sobre-mi', 'horario', 'musica', 'redes'];

  function mostrarPagina(nombre) {
    if (PAGINAS.indexOf(nombre) === -1) nombre = 'inicio';

    $('[data-pagina]').removeClass('activo').filter('[data-pagina="' + nombre + '"]').addClass('activo');

    const $destino = $('#v-' + nombre);
    $('.vista').not($destino).stop(true, true).hide();
    if (!$destino.is(':visible')) $destino.fadeIn(300);   // evita parpadeo en Inicio
    $destino.scrollTop(0);
  }

  function abrirModal(id) {
    $('#navMenu').slideUp(200);
    $('.modal-app').not('#' + id).removeClass('abierto').hide();
    const $m = $('#' + id);
    H.disparar('modal', $m);                 // hidrata solo lo que hay dentro de ESA ventana
    $m.addClass('abierto').hide().fadeIn(250);
  }

  function cerrarModal() {
    $('.modal-app.abierto').fadeOut(200, function () { $(this).removeClass('abierto'); });
  }

  function filtrar(categoria) {
    $('#juegos .card').each(function () {
      const mostrar = categoria === 'todos' || $(this).data('categoria') === categoria;
      if (mostrar) { $(this).fadeIn(250); } else { $(this).hide(); }
    });
  }

  /* ---------- Validación del formulario ---------- */
  const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const regexTelefono = /^[67]\d{7}$/;

  const reglas = {
    nombre:     function (v) { return v.length >= 3 ? '' : 'Ingresa tu nombre completo (mínimo 3 letras).'; },
    correo:     function (v) { return regexCorreo.test(v) ? '' : 'Ingresa un correo válido (ej. nombre@correo.com).'; },
    telefono:   function (v) { return regexTelefono.test(v) ? '' : 'Celular de 8 dígitos que empiece con 6 o 7.'; },
    motivo:     function (v) { return v ? '' : 'Selecciona un motivo.'; },
    mensaje:    function (v) { return v.length >= 10 ? '' : 'Escribe un mensaje de al menos 10 caracteres.'; },
    sugerencia: function (v) { return (v === '' || v.length >= 5) ? '' : 'Si escribes una sugerencia, que tenga al menos 5 caracteres.'; }
  };

  const CAMPOS = ['nombre', 'correo', 'telefono', 'motivo', 'mensaje', 'sugerencia'];

  function validar(id) {
    const $campo = $('#' + id);
    const valor = $campo.val().trim();
    const msg = reglas[id](valor);
    const $err = $('#err-' + id);

    const neutro = (id === 'sugerencia' && valor === '');
    $campo.toggleClass('is-invalid', !!msg).toggleClass('is-valid', !msg && !neutro);

    if (msg) { $err.text(msg).fadeIn(150); } else { $err.fadeOut(150); }
    return !msg;
  }

  /* ============================================
     5. MÓDULOS DE HIDRATACIÓN
     Cada uno usa .off() antes de .on() (sin fugas)
     ============================================ */

  // --- Botón ☰ (cuando: carga) ---
  H.registrar('menu-boton', function ($b) {
    $b.text('☰')
      .off('click.menu')
      .on('click.menu', function () {
        $('#navMenu').stop(true, true).slideToggle(300);
        H.disparar('menu', $('#navMenu'));     // hidrata el contenido del menú al abrirlo
      });
  });

  // --- Contenido del menú (cuando: menu) ---
  H.registrar('menu-lista', function ($nav) {
    $nav.find('a').off('click.menu').on('click.menu', function () {
      $nav.slideUp(250);
    });
  });

  // --- Botón de tema (cuando: interaccion) ---
  H.registrar('tema', function ($b) {
    $b.off('click.tema').on('click.tema', function () {
      $('body').toggleClass('dark-mode');
      $(this).text($('body').hasClass('dark-mode') ? '☀️' : '🌙');
    });
  });

  // --- Menú inferior / navegación por vistas (cuando: carga) ---
  H.registrar('navegacion', function () {
    $(window).off('hashchange.nav').on('hashchange.nav', function () {
      mostrarPagina(location.hash.replace('#', ''));
    });
    mostrarPagina(location.hash.replace('#', ''));
  });

  // --- Botones que abren una ventana (cuando: interaccion / menu) ---
  H.registrar('abrir-modal', function ($b) {
    $b.off('click.modal').on('click.modal', function () {
      abrirModal($(this).data('modal'));
    });
  });

  // --- Ventana flotante: fondo, botones de cerrar y Escape (cuando: modal) ---
  H.registrar('modal', function ($m) {
    $m.off('click.modal').on('click.modal', function (e) {
      if (e.target === this) cerrarModal();
    });
    $m.find('[data-cerrar]').off('click.cerrar').on('click.cerrar', cerrarModal);
    $(document).off('keyup.modal').on('keyup.modal', function (e) {
      if (e.key === 'Escape') cerrarModal();
    });
  });

  // --- Botones del filtro de juegos (cuando: modal) ---
  H.registrar('filtro-juego', function ($b) {
    $b.off('click.filtro').on('click.filtro', function () {
      filtrar($(this).data('filtro'));
    });
  });

  // --- Formulario de contacto (cuando: modal) ---
  H.registrar('formulario', function ($f) {
    $('#telefono').off('input.form').on('input.form', function () {
      this.value = this.value.replace(/\D/g, '');
    });

    $('#sugerencia').off('input.contador').on('input.contador', function () {
      $('#contador').text(this.value.length + '/200');
    });

    $f.off('.form')
      .on('input.form blur.form change.form', 'input, textarea, select', function () {
        validar(this.id);
      })
      .on('submit.form', function (e) {
        e.preventDefault();

        let valido = true;
        let primero = null;
        CAMPOS.forEach(function (id) {
          if (!validar(id)) {
            valido = false;
            if (!primero) primero = id;
          }
        });

        if (!valido) { $('#' + primero).focus(); return; }

        $('#alertaBox')
          .html('<p class="msg-exito">✅ ¡Gracias, ' + $('#nombre').val().trim().split(' ')[0] + '! Tu mensaje fue enviado.</p>')
          .stop(true, true).slideDown(300).delay(2000).slideUp(300, cerrarModal);

        this.reset();
        $('#contactForm .form-control, #contactForm .form-select').removeClass('is-valid is-invalid');
        $('.error-msg').hide();
        $('#contador').text('0/200');
      });
  });

  /* ============================================
     6. PWA: BOTÓN DE INSTALAR (cuando: instalable)
     ============================================ */
  const esIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const esStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

  H.registrar('instalar', function ($b) {
    $b.off('click.instalar').on('click.instalar', async function () {
      if (promptInstalacion) {
        promptInstalacion.prompt();                    // muestra el cuadro nativo de instalación
        const eleccion = await promptInstalacion.userChoice;
        console.log('Instalación:', eleccion.outcome);  // "accepted" o "dismissed"
        promptInstalacion = null;
        $b.prop('hidden', true);
      } else if (esIOS) {
        abrirModal('m-instalar');                      // iOS no tiene prompt: se explican los pasos
      }
    });
  });

  function mostrarBotonInstalar() {
    if (esStandalone) return;                          // ya está instalada y abierta como app
    $('#installBtn').prop('hidden', false);
    H.disparar('instalable');
  }
  window.mostrarBotonInstalar = mostrarBotonInstalar;

  window.addEventListener('appinstalled', function () {
    promptInstalacion = null;
    $('#installBtn').prop('hidden', true);
  });

  /* ============================================
     7. PWA: SERVICE WORKER
     ============================================ */
  if ('serviceWorker' in navigator) {
    const registrarSW = function () {
      navigator.serviceWorker.register('sw.js')
        .then(function () { console.log('Service Worker registrado: PWA lista'); })
        .catch(function (err) { console.log('Error al registrar el Service Worker:', err); });
    };
    if (document.readyState === 'complete') registrarSW();
    else window.addEventListener('load', registrarSW);
  }

  /* ============================================
     8. INICIO: arranca la hidratación (una sola vez)
     ============================================ */
  H.iniciar();
  if (promptInstalacion || (esIOS && !esStandalone)) mostrarBotonInstalar();

});
