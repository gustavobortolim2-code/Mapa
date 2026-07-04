const botaoIniciar = document.querySelector(".btn");
const tabelaJogos = document.querySelector(".tabelaJogos");
const formUsuario = document.getElementById("formUsuario");
const inputNome = document.getElementById("nomeUsuario");
const formMensagem = document.querySelector(".form-mensagem");
const btnMensagem = document.querySelector(".btn-mensagem");
const nomeMensagem = document.getElementById("nomeMensagem");

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
//

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
