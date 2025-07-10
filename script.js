const form = document.querySelector('.contato form');

form.addEventListener('submit', function(event) {
  event.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const mensagem = document.getElementById('mensagem').value.trim();

  if (!nome || !email || !mensagem) {
    alert('Por favor, preencha todos os campos!');
    return;
  }

  const numero = '5585996497608';

  const texto = 
    `Olá, meu nome é ${nome}.\n` +
    `Email: ${email}\n` +
    `Mensagem: ${mensagem}`;

  const url = `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;

  window.open(url, '_blank');

  form.reset();
});