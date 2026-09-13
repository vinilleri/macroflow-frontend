let comidas = [];
let paginaAtual = 1;
let listaAtual = [];
const comidasPorPagina = 10;
async function unidades() {
  try {
    const response = await fetch(`${API_URL}/unidade`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    const select = document.getElementById("unidade");
    select.innerHTML = "";
    if (!select) {
      return;
    }
    data.forEach((unidade) => {
      const option = document.createElement("option");
      option.value = unidade.id;
      option.textContent = unidade.nome;
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Erro:", error);
  }
}

unidades();

const imagensIcones = {
  ARROZ: "🍚",
  CARNE: "🍗",
  BEBIDA: "🥤",
  GENERICO: "📦",
  SALADA: "🥗",
  COMIDA: "🍔",
  COMIDA_USUARIO: "🍔",
  RECEITA: "🍽",
};
async function icones() {
  try {
    const response = await fetch(`${API_URL}/icone`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    const select = document.getElementById("icone");
    select.innerHTML = "";
    if (!select) {
      return;
    }
    data.forEach((icone) => {
      const optionIcone = document.createElement("option");
      const imagem = imagensIcones[icone.toUpperCase()] || "📦";
      optionIcone.value = icone;
      optionIcone.textContent = `${imagem} ${icone}`;

      select.appendChild(optionIcone);
    });
  } catch (error) {
    console.error("Erro:", error);
  }
}
icones();

async function salvarDados(event) {
  event.preventDefault();

  const nome = document.getElementById("nome").value;
  const calorias = document.getElementById("calorias").value;
  const proteinas = document.getElementById("proteinas").value;
  const carboidrato = document.getElementById("carboidrato").value;
  const gordura = document.getElementById("gordura").value;
  const icone = document.getElementById("icone").value;
  const origem = "USUARIO";
  const valor = document.getElementById("valor").value;
  const unidade = document.getElementById("unidade").value;
  const dados = {
    nome: nome,
    calorias: calorias,
    proteinas: proteinas,
    carboidrato: carboidrato,
    gordura: gordura,
    icone: icone,
    origem: origem,
    valor: valor,
    unidadeId: unidade,
  };

  try {
    const response = await fetch(`${API_URL}/comida`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(dados),
    });

    if (response.ok) {
      alert("Comida registrada com sucesso!");
      irParaLista();
    } else {
      alert("Erro ao registrar comida.");
    }
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao registrar comida.");
  }
}

async function carregarComida() {
  const id = new URLSearchParams(window.location.search).get("id");
  const origem = new URLSearchParams(window.location.search).get("origem");
  try {
    const response = await fetch(`${API_URL}/comida/${id}?origem=${origem}`, {
      headers: getAuthHeaders(),
    });

    const comida = await response.json();

    document.getElementById("nome").value = comida.nome;
    document.getElementById("calorias").value = comida.calorias;
    document.getElementById("proteinas").value = comida.proteinas;
    document.getElementById("carboidrato").value = comida.carboidrato;
    document.getElementById("gordura").value = comida.gordura;
    document.getElementById("valor").value = comida.valor;
    document.getElementById("icone").value = comida.icone;
    document.getElementById("unidade").value = comida.unidadeId;
  } catch (erro) {
    console.error(erro);
    alert("Erro ao carregar comida.");
  }
}
async function comidasRecomendadas() {
  try {
    const response = await fetch(`${API_URL}/recomendado`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    document.getElementById("comidasRecomendadas").innerHTML = data
      .map((comida) => {
        const imagem = imagensIcones[comida.tipo.toUpperCase()] || "📦";

        let origem;
        let onclick;

        if (comida.tipo === "COMIDA") {
          origem = "SISTEMA";
          onclick = `abrirConsumo('${comida.id}', '${origem}', '${comida.nome}', 1, 'Base(g/ml/unidade)')`;
        } else if (comida.tipo === "COMIDA_USUARIO") {
          origem = "USUARIO";
          onclick = `abrirConsumo('${comida.id}', '${origem}', '${comida.nome}', 1, 'Base(g/ml/unidade)')`;
        } else if (comida.tipo === "RECEITA") {
          onclick = `consumirReceita('${comida.id}', '${comida.nome}')`;
        }

        return `
          <div class="card" onclick="${onclick}">
            <div class="mf-recommendation-icon">${imagem}</div>
            <h3>${comida.nome}</h3>
            <p>Calorias: ${comida.calorias}</p>
          </div>
        `;
      })
      .join("");
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao listar comidas recomendadas.");
  }
}
async function irParaEditar(id, origem) {
  window.location.href = `editarComida.html?id=${id}&origem=${origem}`;
}
async function irParaLista() {
  window.location.href = `comidas.html`;
}

async function renderizarComidas(lista) {
  const table = document.getElementById("comidasTable");

  let linhas = `
            <tr>
                <th>Ícone</th>
                <th>Nome</th>
                <th>Calorias</th>
                <th>Proteínas</th>
                <th>Carboidratos</th>
                <th>Gorduras</th>
                <th>Valor</th>
                <th>Unidade</th>
                <th>Ações</th>
            </tr>
        `;

  for (const comida of lista) {
    const responseUnidade = await fetch(
      `${API_URL}/unidade/${comida.unidadeId}`,
      {
        headers: getAuthHeaders(),
      },
    );

    const unidadeData = await responseUnidade.json();

    const podeEditar = comida.origem === "USUARIO";
    const imagem = imagensIcones[comida.icone.toUpperCase()] || "📦";
    linhas += `
                <tr>
                     <td>${imagem}</td>
                    <td>${comida.nome}</td>
                    <td>${comida.calorias}</td>
                    <td>${comida.proteinas}</td>
                    <td>${comida.carboidrato}</td>
                    <td>${comida.gordura}</td>
                    <td>${comida.valor}</td>
                    <td>${unidadeData.sigla}</td>
                    <td>
                        <button onclick="abrirConsumo('${comida.id}', '${comida.origem}', '${comida.nome}', ${comida.valor}, '${unidadeData.nome}')">
                            Consumir
                        </button>

                        ${
                          podeEditar
                            ? `
                            <button onclick="irParaEditar('${comida.id}', '${comida.origem}')">
                                Editar
                            </button>
                            <button onclick="deletarComida('${comida.id}')">
                                Deletar
                            </button>
                        `
                            : ""
                        }
                    </td>
                </tr>
            `;
  }

  table.innerHTML = linhas;
}

function renderizarPaginacao(lista, paginaAtual) {
  const inicio = (paginaAtual - 1) * comidasPorPagina;
  const fim = inicio + comidasPorPagina;
  const comidasPaginadas = lista.slice(inicio, fim);

  renderizarBotoesPaginacao(lista);
  renderizarComidas(comidasPaginadas);
}
async function editarComida(event) {
  event.preventDefault();

  const id = new URLSearchParams(window.location.search).get("id");
  const nome = document.getElementById("nome").value;
  const calorias = document.getElementById("calorias").value;
  const proteinas = document.getElementById("proteinas").value;
  const carboidrato = document.getElementById("carboidrato").value;
  const gordura = document.getElementById("gordura").value;
  const icone = document.getElementById("icone").value;
  const origem = "USUARIO";
  const valor = document.getElementById("valor").value;
  const unidade = document.getElementById("unidade").value;
  const dados = {
    nome: nome,
    calorias: calorias,
    proteinas: proteinas,
    carboidrato: carboidrato,
    gordura: gordura,
    icone: icone,
    origem: origem,
    valor: valor,
    unidadeId: unidade,
  };

  try {
    const response = await fetch(`${API_URL}/comida/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(dados),
    });

    if (response.ok) {
      alert("Comida atualizada com sucesso!");
      irParaLista();
    } else {
      alert("Erro ao atualizar comida.");
    }
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao atualizar comida.");
  }
}

async function deletarComida(id) {
  if (!confirm("Tem certeza que deseja deletar esta comida?")) {
    return;
  }
  try {
    const response = await fetch(`${API_URL}/comida/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (response.ok) {
      alert("Comida deletada com sucesso!");
      irParaLista();
    } else {
      alert("Erro ao deletar comida.");
    }
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao deletar comida.");
  }
}
async function listarComidas() {
  try {
    const response = await fetch(`${API_URL}/comida/todos`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    comidas = await response.json();
    comidas = comidas.sort((a, b) => a.nome.localeCompare(b.nome));
    listaAtual = comidas;
    renderizarPaginacao(listaAtual, paginaAtual);
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao listar comidas.");
  }
}
function renderizarBotoesPaginacao(lista) {
  const paginacao = document.getElementById("paginacao");

  const totalPaginas = Math.max(1, Math.ceil(lista.length / comidasPorPagina));

  const botaoAnterior = `
    <button onclick="decrementarPagina()" ${paginaAtual === 1 ? "disabled" : ""}>
      Anterior
    </button>
  `;

  const pagina = `
    <span>Página ${paginaAtual} de ${totalPaginas}</span>
  `;

  const botaoProximo = `
    <button onclick="incrementarPagina()" ${
      paginaAtual === totalPaginas ? "disabled" : ""
    }>
      Próximo
    </button>
  `;

  paginacao.innerHTML = botaoAnterior + pagina + botaoProximo;
}

function incrementarPagina() {
  const totalPaginas = Math.ceil(listaAtual.length / comidasPorPagina);
  if (paginaAtual < totalPaginas) {
    paginaAtual++;
    renderizarPaginacao(listaAtual, paginaAtual);
  }
}

function decrementarPagina() {
  if (paginaAtual > 1) {
    paginaAtual--;
    renderizarPaginacao(listaAtual, paginaAtual);
  }
}
function filtrarComidas() {
  const pesquisa = document.getElementById("pesquisa").value.toLowerCase();

  listaAtual = comidas
    .filter((comida) => comida.nome.toLowerCase().startsWith(pesquisa))
    .sort((a, b) => a.nome.localeCompare(b.nome));
  paginaAtual = 1;
  renderizarPaginacao(listaAtual, paginaAtual);
}
