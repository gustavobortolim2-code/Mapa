//importa informações de carregarJogo em tabela.js
import { carregarJogos } from "./tabela.js";

const { jogos, botaoSalvar } = await carregarJogos();

//função para calcular pontos feitos pelo usuário
const calcularPontos = (jogo, palpite) => {
  //se nao tiver palpite retorna 0
  if (!palpite || palpite.golsCasa === "" || palpite.golsFora === "") return 0;

  //compara o resultado real com o palpite do usuario
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

  //se for diferente retorna 0, se for exatamente igual retorna 3 e se apenas o vencedor for igual retorna 1;
  if (resultadoReal !== resultadoPalpite) return 0;

  const placar =
    jogo.home_score === palpite.golsCasa &&
    jogo.away_score === palpite.golsFora;

  return placar ? 3 : 1;
};

const atualizarRanking = (totalPontos) => {
  //ranking para comparação, guarda e busca informação no localStorage
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

  //coloca o ranking em ordem
  ranking.sort((a, b) => b.pontos - a.pontos);
  localStorage.setItem("ranking", JSON.stringify(ranking));
  return ranking;
};

//pega o ranking em imprimi as informações dele na tela
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

  //verifica e soma o total de Pontos de todos os jogos
  jogos.forEach((jogo) => {
    if (jogo.finished !== "TRUE") return;

    const palpite = JSON.parse(localStorage.getItem(`palpite-${jogo.id}`));
    totalPontos += calcularPontos(jogo, palpite);
  });

  atualizarRanking(totalPontos);
  mostrarRanking();
};

//Salva palpite e recarrega ranking
botaoSalvar.addEventListener("click", () => {
  verificarAcertos();
});

//recarrega Ranking
const botaoRecarregar = document.getElementById("btnRanking");
botaoRecarregar.addEventListener("click", () => {
  verificarAcertos();
});

mostrarRanking();
