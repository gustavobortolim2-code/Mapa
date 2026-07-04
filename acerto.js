import { carregarJogos } from "./tabela.js";

const { jogos, botaoSalvar } = await carregarJogos();

const calcularPontos = (jogo, palpite) => {
  if (!palpite || palpite.golsCasa === "" || palpite.golsFora === "") return 0;

  const resultadoReal =
    jogo.home_score > jogo.away_score
      ? "casa"
      : jogo.home_score < jogo.away_score
        ? "fora"
        : "empate";

  const resultadoPalpite =
    palpite.golsCasa > palpite.golsFora
      ? "casa"
      : palpite.golsCasa < palpite.golsFora
        ? "fora"
        : "empate";

  if (resultadoReal !== resultadoPalpite) return 0;

  const placar =
    jogo.home_score === palpite.golsCasa &&
    jogo.away_score === palpite.golsFora;

  return placar ? 3 : 1;
};

const atualizarRanking = (totalPontos) => {
  const ranking = JSON.parse(localStorage.getItem("ranking") || "[]");
  const nome = localStorage.getItem("nomeUsuario") || "";

  const posicao = ranking.findIndex((item) => item.nome === nome);
  const registro = {
    nome,
    pontos: totalPontos,
  };

  if (posicao >= 0) {
    ranking[posicao] = registro;
  } else {
    ranking.push(registro);
  }

  ranking.sort((a, b) => b.pontos - a.pontos);
  localStorage.setItem("ranking", JSON.stringify(ranking));
  return ranking;
};

const mostrarRanking = () => {
  const ranking = JSON.parse(localStorage.getItem("ranking"));
  const mostrarRanking = document.getElementById("ranking");

  mostrarRanking.innerHTML = ranking.length
    ? ranking
        .map(
          (item, index) =>
            `<div>${index + 1}. ${item.nome}: ${item.pontos} pts</div>`,
        )
        .join("")
    : `<div>Nenhum ranking ainda</div>`;
};

const verificarAcertos = () => {
  let totalPontos = 0;

  jogos.forEach((jogo) => {
    if (jogo.finished !== "TRUE") return;

    const palpite = JSON.parse(localStorage.getItem(`palpite-${jogo.id}`));
    totalPontos += calcularPontos(jogo, palpite);
  });

  atualizarRanking(totalPontos);
  mostrarRanking();
};

botaoSalvar.addEventListener("click", () => {
  verificarAcertos();
});

const botaoRecarregar = document.getElementById("btnRanking");
botaoRecarregar.addEventListener("click", () => {
  verificarAcertos();
});

mostrarRanking();
