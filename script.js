const botaoIniciar = document.querySelector(".btn");
const tabelaJogos = document.querySelector(".tabelaJogos");
const formUsuario = document.getElementById("formUsuario");
const inputNome = document.getElementById("nomeUsuario");
const formMensagem = document.querySelector(".form-mensagem");
const btnMensagem = document.querySelector(".btn-mensagem");
const nomeMensagem = document.getElementById("nomeMensagem");
const btnEnviar = document.querySelector(".enviar");
const emailUsuario = document.getElementById("emailUsuario");
const mensagemUsuario = document.getElementById("mensagemUsuario");

botaoIniciar.setAttribute(
  "aria-expanded",
  formUsuario.classList.contains("escondido") ? "false" : "true",
);

botaoIniciar.addEventListener("click", () => {
  const isHidden = formUsuario.classList.toggle("escondido");
  botaoIniciar.setAttribute("aria-expanded", isHidden ? "false" : "true");
  botaoIniciar.textContent = isHidden ? "Iniciar Palpites" : "";
});

const esconder = async () => {
  document.querySelector(".btn").style.display = "none";
};

btnMensagem.addEventListener("click", () => {
  const isHidden = formMensagem.classList.toggle("escondido");
  btnMensagem.setAttribute("aria-expanded", isHidden ? "false" : "true");
  btnMensagem.textContent = isHidden ? "Fale Conosco" : "Cancelar Envio";
});

formUsuario.addEventListener("submit", (event) => {
  event.preventDefault();

  const nome = inputNome.value.trim();

  if (!nome) {
    return;
  }

  localStorage.setItem("nomeUsuario", nome);

  formUsuario.classList.add("escondido");

  tabelaJogos.classList.remove("escondido");
});

const nomeSalvo = localStorage.getItem("nomeUsuario");

if (nomeSalvo) {
  formUsuario.classList.add("escondido");
  tabelaJogos.classList.remove("escondido");
  botaoIniciar.classList.add("escondido");
  nomeMensagem.value = nomeSalvo;
}

const form = document.getElementById("id-mensagem");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (
    nomeMensagem.value.trim() === "" ||
    emailUsuario.value.trim() === "" ||
    mensagemUsuario.value.trim() === ""
  ) {
    alert("Preencha todos os campos!");
    return;
  }

  const formDados = new FormData(form);

  const resposta = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    body: formDados,
  });

  const resultado = await resposta.json();

  if (resultado.success) {
    alert("Mensagem enviada com Sucesso!");
    form.reset();
    formMensagem.classList.add("escondido");
    btnMensagem.setAttribute("aria-expanded", "false");
    btnMensagem.textContent = "Fale Conosco";
  } else {
    alert("Erro ao Enviar");
  }
});
