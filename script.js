/* ===== EJEMPLO 1: Modo oscuro / modo claro ===== */

// 1. Seleccionamos los elementos del DOM
const themeBtn = document.getElementById('themeBtn');
const bodyElement = document.body;

// 2. Escuchamos el evento click
themeBtn.addEventListener('click', () => {
  // 3. Alternamos la clase CSS en el body usando classList
  bodyElement.classList.toggle('dark-mode');
});


/* ===== EJEMPLO 2: Filtrado de favoritos / juegos ===== */

function filtrar(categoria) {
  // 1. Seleccionamos todas las tarjetas de juegos con querySelectorAll
  const tarjetas = document.querySelectorAll('#juegos .card');

  // 2. Recorremos cada tarjeta para leer su atributo data-categoria
  tarjetas.forEach(card => {
    const catCard = card.dataset.categoria;

    // 3. Manipulamos la propiedad style.display directamente en el DOM
    if (categoria === 'todos' || catCard === categoria) {
      card.style.display = 'block';   // Hace visible el elemento
    } else {
      card.style.display = 'none';    // Oculta el elemento
    }
  });
}


/* ===== EJEMPLO 3: Menú desplegable hamburguesa ===== */

const burguerBtn = document.getElementById('burguerBtn');
const navMenu = document.getElementById('navMenu');

burguerBtn.addEventListener('click', () => {
  navMenu.classList.toggle('show');
});


/* ===== EJEMPLO 4: Validación de alerta dinámica en formulario ===== */

const form = document.getElementById('contactForm');
const nombreInput = document.getElementById('nombre');
const correoInput = document.getElementById('correo');
const mensajeInput = document.getElementById('mensaje');
const alertaBox = document.getElementById('alertaBox');

form.addEventListener('submit', (e) => {
  e.preventDefault();   // Detiene la recarga automática

  if (nombreInput.value.trim() === '') {
    alertaBox.innerHTML = '<p class="msg-error">⚠️ Por favor, ingresa tu nombre.</p>';
  } else if (!correoInput.value.includes('@')) {
    alertaBox.innerHTML = '<p class="msg-error">⚠️ Ingresa un correo válido.</p>';
  } else if (mensajeInput.value.trim() === '') {
    alertaBox.innerHTML = '<p class="msg-error">⚠️ Escribe un mensaje.</p>';
  } else {
    alertaBox.innerHTML = '<p class="msg-exito">✅ ¡Formulario enviado con éxito!</p>';
    form.reset();       // Limpia los tres campos
  }
});