/* Filtrado de juegos (lo usan los onclick del HTML) */
function filtrar(categoria) {
  $('#juegos .card').each(function () {
    const mostrar = categoria === 'todos' || $(this).data('categoria') === categoria;
    if (mostrar) {
      $(this).fadeIn(250);
    } else {
      $(this).hide();
    }
  });
}

$(document).ready(function () {

  /* 1. DETECCIÓN MÓVIL / TABLET */
  const esMovil = window.innerWidth <= 768 || /Android|iPhone|iPad/i.test(navigator.userAgent);
  $('body').addClass(esMovil ? 'modo-movil' : 'modo-escritorio');

  /* 2. MODO OSCURO / CLARO */
  $('#themeBtn').click(function () {
    $('body').toggleClass('dark-mode');
  });

  /* 3. MENÚ HAMBURGUESA con slideToggle */
  $('#burguerBtn').click(function () {
    $('#navMenu').stop(true, true).slideToggle(300);
  });

  /* 4. NAVEGACIÓN POR "PÁGINAS" (sin anclas) */
  const PAGINAS = ['sobre-mi', 'gustos', 'proyectos', 'horario', 'musica', 'juegos', 'contacto'];

  function mostrarPagina(nombre) {
    if (PAGINAS.indexOf(nombre) === -1) nombre = 'sobre-mi';

    $('#navMenu a').removeClass('activo').filter('[data-pagina="' + nombre + '"]').addClass('activo');

    $('.pagina').stop(true, true).hide();
    $('#pg-' + nombre).fadeIn(300);

    $('body').toggleClass('pagina-interna', nombre !== 'sobre-mi');
    window.scrollTo(0, 0);
  }

  $(window).on('hashchange', function () {
    mostrarPagina(location.hash.replace('#', ''));
  });

  $('#navMenu a').click(function () {
    if ($('#burguerBtn').css('visibility') !== 'hidden') {
      $('#navMenu').slideUp(250);
    }
  });

  /* 5. FORMULARIO: VALIDACIÓN EN TIEMPO REAL */
  const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const regexTelefono = /^[67]\d{7}$/;   // celular boliviano: 8 dígitos, empieza con 6 o 7

  const reglas = {
    nombre:     function (v) { return v.length >= 3 ? '' : 'Ingresa tu nombre completo (mínimo 3 letras).'; },
    correo:     function (v) { return regexCorreo.test(v) ? '' : 'Ingresa un correo válido (ej. nombre@correo.com).'; },
    telefono:   function (v) { return regexTelefono.test(v) ? '' : 'Celular de 8 dígitos que empiece con 6 o 7.'; },
    motivo:     function (v) { return v ? '' : 'Selecciona un motivo.'; },
    mensaje:    function (v) { return v.length >= 10 ? '' : 'Escribe un mensaje de al menos 10 caracteres.'; },
    // la sugerencia es opcional: solo se valida si escribió algo
    sugerencia: function (v) { return (v === '' || v.length >= 5) ? '' : 'Si escribes una sugerencia, que tenga al menos 5 caracteres.'; }
  };

  const CAMPOS = ['nombre', 'correo', 'telefono', 'motivo', 'mensaje', 'sugerencia'];

  function validar(id) {
    const $campo = $('#' + id);
    const valor = $campo.val().trim();
    const msg = reglas[id](valor);
    const $err = $('#err-' + id);

    // la sugerencia vacía no se marca ni en verde ni en rojo
    const neutro = (id === 'sugerencia' && valor === '');
    $campo.toggleClass('is-invalid', !!msg).toggleClass('is-valid', !msg && !neutro);

    if (msg) { $err.text(msg).fadeIn(150); } else { $err.fadeOut(150); }
    return !msg;
  }

  // Solo números en el teléfono
  $('#telefono').on('input', function () {
    this.value = this.value.replace(/\D/g, '');
  });

  // Contador de caracteres de la sugerencia
  $('#sugerencia').on('input', function () {
    $('#contador').text(this.value.length + '/200');
  });

  // Mientras escribe, al salir del campo y al cambiar el select
  $('#contactForm').on('input blur change', 'input, textarea, select', function () {
    validar(this.id);
  });

  $('#contactForm').submit(function (e) {
    e.preventDefault();

    let valido = true;
    let primero = null;
    CAMPOS.forEach(function (id) {
      if (!validar(id)) {
        valido = false;
        if (!primero) primero = id;
      }
    });

    if (!valido) {
      $('#' + primero).focus();
      return;
    }

    $('#alertaBox')
      .html('<p class="msg-exito">✅ ¡Gracias, ' + $('#nombre').val().trim().split(' ')[0] + '! Tu mensaje fue enviado.</p>')
      .stop(true, true).slideDown(300).delay(3500).slideUp(300);

    this.reset();
    $('#contactForm .form-control, #contactForm .form-select').removeClass('is-valid is-invalid');
    $('.error-msg').hide();
    $('#contador').text('0/200');
  });

  /* INICIO */
  mostrarPagina(location.hash.replace('#', ''));

});
