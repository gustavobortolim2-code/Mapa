const gamesContainer = document.getElementById("gamesContainer");

//fase que inicia o mata-mata da copa
let faseAtual = "r32";
//pra pegar o id do jogo
let jogosId = {};
//pra pegar as fase
let copa = {
  r32: [],
  r16: [],
  qf: [],
  sf: [],
  third: [],
  final: [],
};

//traduzir os nomes que vem da API
const traducoes = {
  Brazil: "Brasil",
  Japan: "Japão",
  "South Africa": "África do Sul",
  Germany: "Alemanha",
  Paraguay: "Paraguai",
  Netherlands: "Holanda",
  Morocco: "Marrocos",
  "Ivory Coast": "Costa do Marfim",
  Norway: "Noruega",
  France: "França",
  Sweden: "Suécia",
  Mexico: "México",
  Ecuador: "Equador",
  England: "Inglaterra",
  "Democratic Republic of the Congo": "República Democrática do Congo",
  Belgium: "Bélgica",
  "United States": "Estados Unidos",
  "Bosnia and Herzegovina": "Bósnia e Herzegovina",
  Spain: "Espanha",
  Switzerland: "Suíça",
  Croatia: "Croácia",
  Algeria: "Argélia",
  Egypt: "Egito",
  "Cape Verde": "Cabo Verde",
  Ghana: "Gana",
};

//mudar as datas que vem da API
const dataJogos = {
  73: "28/06/2026 16:00",
  74: "29/06/2026 17:30",
  76: "29/06/2026 14:00",
  75: "29/06/2026 22:00",

  77: "30/06/2026 18:00",
  78: "30/06/2026 14:00",
  79: "30/06/2026 22:00",

  80: "01/07/2026 13:00",
  81: "01/07/2026 21:00",
  82: "01/07/2026 17:00",

  83: "02/07/2026 20:00",
  84: "02/07/2026 16:00",
  85: "03/07/2026 00:00",

  88: "03/07/2026 15:00",
  86: "03/07/2026 19:00",
  87: "03/07/2026 22:30",

  89: "04/07/2026 18:00",
  90: "04/07/2026 14:00",
  91: "05/07/2026 17:00",
  92: "05/07/2026 21:00",

  93: "06/07/2026 16:00",
  94: "06/07/2026 21:00",
  95: "07/07/2026 13:00",
  96: "07/07/2026 17:00",

  97: "09/07/2026 17:00",
  98: "10/07/2026 16:00",
  99: "11/07/2026 18:00",
  100: "11/07/2026 22:00",

  101: "14/07/2026 16:00",
  102: "15/07/2026 16:00",

  103: "18/07/2026 18:00",
  104: "19/07/2026 16:00",
};

//retorna faseFinalizada caso todos os jogos naquela fase estejam finalizados
const faseFinalizada = (jogos) => {
  return jogos.every((jogo) => jogo.finished === "TRUE");
};

const carregarJogos = async () => {
  try {
    gamesContainer.innerHTML = "<h2>Carregando Partidas</h2>";
    //pega informações na API
    const response = await fetch("https://worldcup26.ir/get/games");
    const response2 = await fetch("https://worldcup26.ir/get/teams");

    const jogos = await response.json();
    const flags = await response2.json();

    console.log(jogos);
    console.log(flags);

    //pega o ID de cada jogo na API
    jogos.games.forEach((jogo) => {
      jogosId[jogo.id] = jogo;
    });

    let botaoSalvar;
    //inicia tudo usando a primeira fase
    if (faseAtual === "r32") {
      copa.r32 = jogos.games.filter((j) => j.type === "r32");
      botaoSalvar = renderizarJogos(copa.r32, flags.teams);
    }

    return {
      jogos: jogos.games,
      botaoSalvar,
    };
  } catch (error) {
    console.error(error);

    gamesContainer.innerHTML = `<h2>Erro ao Carregar as Partidas</h2>
    <p>${error.message}</p>`;
  }
};

const renderizarJogos = (jogos, flags) => {
  gamesContainer.innerHTML = "";

  //se todos os jogos estiverem finalizados da a opção de avançar pra prómixa
  if (faseFinalizada(jogos)) {
    const topo = document.createElement("div");
    topo.className = "topo";
    topo.textContent = "Todos os jogos desta fase foram finalizados!";

    const botaoAvancar = document.createElement("button");
    botaoAvancar.textContent = "Avançar para a Próxima Fase";
    botaoAvancar.className = "avancar-btn";

    botaoAvancar.addEventListener("click", () => {
      avancarFase(flags);
    });
    topo.appendChild(botaoAvancar);
    gamesContainer.appendChild(topo);
  }

  //organiza por data
  jogos.sort((a, b) => {
    return new Date(a.local_date) - new Date(b.local_date);
  });

  //pega as bandeiras de cada seleção na API
  const bandeira = {};

  flags.forEach((flag) => {
    bandeira[flag.name_en] = flag.flag;
  });

  //pra cada jogo pega na API o time da casa e o de fora, com suas respectivas bandeiras
  jogos.forEach((jogo) => {
    const horario = dataJogos[jogo.id];
    const bandeiraCasa = bandeira[jogo.home_team_name_en] || "default.png";
    const casa = traducoes[jogo.home_team_name_en] || jogo.home_team_name_en;
    const bandeiraFora = bandeira[jogo.away_team_name_en] || "default.png";
    const fora = traducoes[jogo.away_team_name_en] || jogo.away_team_name_en;

    //salva palpite no localStorage
    const salvo = JSON.parse(localStorage.getItem(`palpite-${jogo.id}`));

    //cria div da partida
    const partida = document.createElement("div");
    partida.className = "partidaJogo";
    partida.dataset.id = jogo.id;

    const finalizado = jogo.finished === "TRUE";

    //se o jogo esta finalizado imprimi o horario, nome dos times, gols, bandeiras e status finalizado
    if (finalizado) {
      partida.innerHTML = `
        <div class="data">
          ${horario}
        </div>
        <div class="times">
        <img src="${bandeiraCasa}" alt="${casa}" />
        <h3 class="time">${casa}</h3>
        <span>${jogo.home_score} x ${jogo.away_score}</span>
        <h3 class="time">${fora}</h3>
        <img src="${bandeiraFora}" alt="${fora}" />
        </div>
        <div class="finalizado">Finalizado</div>`;
    } else {
      partida.innerHTML = `
      <div class="data">
          ${horario}
      </div>
      
      <div class="times">
        <img src="${bandeiraCasa}" alt="${casa}"/>
        <h3 class="time">${casa}</h3>
          <div class="x">
          x
          </div>
        <h3 class="time">${fora}</h3>
        <img src="${bandeiraFora}" alt="${fora}"/>
      </div>

      <div class="palpite">
          <input
              type="number"
              min="0"
              class="gols-casa"
              value="${salvo?.golsCasa ?? ""}"
          >

          <span>x</span>

          <input
              type="number"
              min="0"
              class="gols-fora"
              value="${salvo?.golsFora ?? ""}"
          >

      </div>
    `;

      //pega a quantidade de gols
      const golsCasa = partida.querySelector(".gols-casa");
      const golsFora = partida.querySelector(".gols-fora");

      //verifica empate e leva pros penaltis
      const verificarEmpate = () => {
        let penalti = partida.querySelector(".penalti");

        if (!golsCasa.value || !golsFora.value) return;

        if (golsCasa.value === golsFora.value) {
          if (!penalti) {
            penalti = document.createElement("div");
            penalti.className = "penalti";

            penalti.innerHTML = `<div class="penaltis">
        <span>Pênaltis</span>
            <div class="palpite-penalti">
        <input type="number" class="penaltis-casa">

        <span>x</span>

        <input type="number" class="penaltis-fora">
        </div>
      </div>`;

            partida.appendChild(penalti);
          }
        } else {
          if (penalti) penalti.remove();
        }
      };

      golsCasa.addEventListener("input", verificarEmpate);
      golsFora.addEventListener("input", verificarEmpate);

      verificarEmpate();
    }

    gamesContainer.appendChild(partida);
  });

  const avancarFase = (flags) => {
    const jogosAtuais =
      faseAtual === "r32"
        ? copa.r32
        : faseAtual === "r16"
          ? copa.r16
          : faseAtual === "qf"
            ? copa.qf
            : faseAtual === "sf"
              ? copa.sf
              : faseAtual === "third"
                ? copa.third
                : copa.final;

    //chama calcular vencedor
    const vencedores = calcularVencedor(jogosAtuais);

    //passa as fases mandando os times que ganharam
    if (faseAtual === "r32") {
      copa.r16 = gerarProximaFase(vencedores, faseAtual);
      faseAtual = "r16";
      renderizarJogos(copa.r16, flags);
    } else if (faseAtual === "r16") {
      copa.qf = gerarProximaFase(vencedores, faseAtual);
      faseAtual = "qf";
      renderizarJogos(copa.qf, flags);
    } else if (faseAtual === "qf") {
      copa.sf = gerarProximaFase(vencedores, faseAtual);
      faseAtual = "sf";
      renderizarJogos(copa.sf, flags);
    } else if (faseAtual === "sf") {
      copa.final = gerarProximaFase(vencedores, faseAtual);
      faseAtual = "final";
      renderizarJogos(copa.final, flags);
    } else if (faseAtual === "final") {
      alert("🏆 Campeão: " + vencedores[103]);
    }
  };

  //salva os palpites no localStorage
  const botaoSalvar = document.createElement("button");
  botaoSalvar.textContent = "Salvar todos os Palpites";
  botaoSalvar.className = "salvar-btn";

  botaoSalvar.addEventListener("click", () => {
    const partidas = document.querySelectorAll(".partidaJogo");

    partidas.forEach((partida) => {
      const golsCasa = partida.querySelector(".gols-casa");
      const golsFora = partida.querySelector(".gols-fora");
      const penaltiCasa = partida.querySelector(".penaltis-casa");
      const penaltiFora = partida.querySelector(".penaltis-fora");

      if (!golsCasa || !golsFora) return;

      localStorage.setItem(
        `palpite-${partida.dataset.id}`,
        JSON.stringify({
          golsCasa: golsCasa.value,
          golsFora: golsFora.value,
          penaltiCasa: penaltiCasa?.value ?? "",
          penaltiFora: penaltiFora?.value ?? "",
        }),
      );
    });

    botaoSalvar.textContent = "Todos os Palpites Salvos ✓";
    setTimeout(() => {
      botaoSalvar.textContent = "Salvar Palpite";
    }, 3000);

    avancarFase(flags);
  });

  //volta pro inicio
  const botaoVoltar = document.createElement("button");
  botaoVoltar.textContent = "Voltar ao Inicio";
  botaoVoltar.className = "voltar-btn";

  botaoVoltar.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  const botoesTabela = document.createElement("div");
  botoesTabela.className = "botoesTabela";

  botoesTabela.appendChild(botaoSalvar);
  botoesTabela.appendChild(botaoVoltar);

  gamesContainer.appendChild(botoesTabela);

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
  return botaoSalvar;
};

//verifica quem venceu o jogo
const getVencedor = (jogo, palpite) => {
  const casa = Number(palpite.golsCasa);
  const fora = Number(palpite.golsFora);
  const penCasa = Number(palpite.penaltiCasa);
  const penFora = Number(palpite.penaltiFora);

  if (casa > fora) return jogo.home_team_name_en;
  if (fora > casa) return jogo.away_team_name_en;
  if (casa === fora) {
    if (palpite.penaltiCasa === "" || palpite.penaltiFora === "") {
      return null;
    }
    if (penCasa > penFora) return jogo.home_team_name_en;
    if (penFora > penCasa) return jogo.away_team_name_en;
  }

  return null;
};

const calcularVencedor = (jogos) => {
  const vencedores = [];

  //verifica dentro da API quem venceu o jogo
  jogos.forEach((jogo) => {
    let vencedor;

    if (jogo.finished === "TRUE") {
      if (jogo.home_score > jogo.away_score) {
        vencedor = jogo.home_team_name_en;
      } else if (jogo.away_score > jogo.home_score) {
        vencedor = jogo.away_team_name_en;
      } else if (jogo.home_score == jogo.away_score) {
        if (jogo.away_penalty_score > jogo.home_penalty_score) {
          vencedor = jogo.away_team_name_en;
        } else if (jogo.home_penalty_score > jogo.away_penalty_score) {
          vencedor = jogo.home_team_name_en;
        }
      }
    } else {
      //senao pega o vencedor da função getVencedor
      const palpite = JSON.parse(localStorage.getItem(`palpite-${jogo.id}`));

      if (!palpite) return;

      vencedor = getVencedor(jogo, palpite);
    }

    if (vencedor) {
      vencedores[jogo.id] = vencedor;
    }
  });

  return vencedores.map((v) => String(v));
};

//cria as proximas fases
const gerarProximaFase = (vencedores, faseAtual) => {
  let fase = [];

  //cada fase contendo a ID do confronto da API e o confronto que será gerado na proxima fase
  if (faseAtual === "r32") {
    fase = [
      {
        ...jogosId[90],
        home_team_name_en: vencedores[73],
        away_team_name_en: vencedores[75],
      },
      {
        ...jogosId[89],
        home_team_name_en: vencedores[74],
        away_team_name_en: vencedores[77],

        //89
      },
      {
        ...jogosId[94],
        home_team_name_en: vencedores[81],
        away_team_name_en: vencedores[82],
      },
      {
        ...jogosId[93],
        home_team_name_en: vencedores[83],
        away_team_name_en: vencedores[84],
      },
      {
        ...jogosId[91],
        home_team_name_en: vencedores[76],
        away_team_name_en: vencedores[78],
      },
      {
        ...jogosId[92],
        home_team_name_en: vencedores[79],
        away_team_name_en: vencedores[80],
      },
      {
        ...jogosId[96],
        home_team_name_en: vencedores[85],
        away_team_name_en: vencedores[87],
      },
      {
        ...jogosId[95],
        home_team_name_en: vencedores[86],
        away_team_name_en: vencedores[88],
      },
    ];
  } else if (faseAtual === "r16") {
    fase = [
      {
        ...jogosId[97],
        home_team_name_en: vencedores[89],
        away_team_name_en: vencedores[90],
      },
      {
        ...jogosId[98],
        home_team_name_en: vencedores[93],
        away_team_name_en: vencedores[94],
      },
      {
        ...jogosId[99],
        home_team_name_en: vencedores[91],
        away_team_name_en: vencedores[92],
      },
      {
        ...jogosId[100],
        home_team_name_en: vencedores[95],
        away_team_name_en: vencedores[96],
      },
    ];
  } else if (faseAtual === "qf") {
    fase = [
      {
        ...jogosId[101],
        home_team_name_en: vencedores[97],
        away_team_name_en: vencedores[98],
      },
      {
        ...jogosId[102],
        home_team_name_en: vencedores[99],
        away_team_name_en: vencedores[100],
      },
    ];
  } else if (faseAtual === "sf") {
    fase = [
      {
        ...jogosId[103],
        home_team_name_en: vencedores[101],
        away_team_name_en: vencedores[102],
      },
    ];
  }
  return fase;
};

export { carregarJogos, renderizarJogos };
