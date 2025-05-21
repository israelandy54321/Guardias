// Admin form save
const form = document.getElementById('admin-form');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = {};
    formData.forEach((val, key) => data[key] = val);

    const response = await fetch('/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    alert(result.message);
    form.reset();
  });
}

async function buscarPlaca() {
  let placa = document.getElementById('placaInput').value.trim().replace(/\s+/g, '').toUpperCase();
  if (!placa) return;

  const response = await fetch(`/buscar/${placa}`);
  const result = await response.json();

  const resultadoDiv = document.getElementById('resultado');
  resultadoDiv.innerHTML = '';

  if (result.status === 'verificado') {
    const data = result.data;
    resultadoDiv.innerHTML = `
      <table>
        <tr><th>Dueño</th><td>${data.dueno}</td></tr>
        <tr><th>Marca</th><td>${data.marca}</td></tr>
        <tr><th>Color</th><td>${data.color}</td></tr>
        <tr><th>Tipo</th><td>${data.tipo}</td></tr>
        <tr><th>Placa</th><td>${data.placa}</td></tr>
        <tr><th>Número de Casa</th><td>${data.numeroCasa}</td></tr>
        <tr><th>Dirección</th><td>${data.direccion}</td></tr>
      </table>
      <p style="color:green;">✅ Verificado</p>
    `;
    hablar("Verificado");
  } else {
    resultadoDiv.innerHTML = `<p style="color:red;">❌ No registrado</p>`;
    hablar("No registrado");
  }
}

function hablar(mensaje) {
  const synth = window.speechSynthesis;
  const voz = new SpeechSynthesisUtterance(mensaje);
  voz.lang = 'es-ES';
  voz.volume = 1;     // volumen máximo
  voz.rate = 1;       // velocidad normal
  voz.pitch = 1;      // tono normal
  synth.cancel();     // detener voces anteriores si hay
  synth.speak(voz);
}

// Reconocimiento de voz
function reconocerVoz() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'es-ES';
  recognition.start();

  recognition.onresult = function (event) {
    const texto = event.results[0][0].transcript;
    
    document.getElementById('placaInput').value = texto.trim();
    buscarPlaca();
  };

  recognition.onerror = function () {
    alert("Error al reconocer la voz");
  };
}

function hablar(mensaje) {
  if ('speechSynthesis' in window) {
    const synth = window.speechSynthesis;
    synth.cancel(); // Detiene cualquier voz en curso
    const voz = new SpeechSynthesisUtterance(mensaje);
    voz.lang = 'es-ES';
    synth.speak(voz);
  } else {
    console.warn("Tu navegador no soporta síntesis de voz.");
  }
}


function reiniciar() {
  document.getElementById('placaInput').value = '';
  document.getElementById('resultado').innerHTML = '';
  hablar("Limpiado");
}

