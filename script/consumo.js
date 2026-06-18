function consumoDia() {
    fetch(`${API_URL}/consumo/soma/dia`, {
        headers: getAuthHeaders()
    })
        .then(r => r.json())
        .then(data => {
            document.getElementById("caloriasDia").textContent = data.calorias;
            document.getElementById("proteinasDia").textContent = data.proteinas;
            document.getElementById("carboidratoDia").textContent = data.carboidrato;
            document.getElementById("gorduraDia").textContent = data.gordura;
        })
        .catch(console.error);
}

async function graficoPeriodo() {
    const inicioRaw = document.getElementById("dataInicio").value;
    const fimRaw = document.getElementById("dataFim").value;

    const inicio = inicioRaw + "T00:00:00";
    const fim = fimRaw + "T23:59:59";

    const response = await fetch(
        `${API_URL}/consumo/soma/periodo?inicio=${inicio}&fim=${fim}`,
        {
            headers: getAuthHeaders()
        }
    );

    const data = await response.json();

    const canvas = document.getElementById("graficoPeriodo");
    const graficoExistente = Chart.getChart(canvas);

    if (graficoExistente) {
        graficoExistente.destroy();
    }

    new Chart(canvas, {
        type: "pie",
        data: {
            labels: ["Proteínas", "Carboidratos", "Gorduras"],
            datasets: [{
                data: [
                    data.proteinas,
                    data.carboidrato,
                    data.gordura
                ],
            }]
        }
    });
}
function abrirConsumo(id, origem, nome) {

    const tipo =
        origem === "SISTEMA"
            ? "COMIDA"
            : "COMIDA_USUARIO";

    window.location.href =
       `novoConsumo.html?id=${id}&tipo=${tipo}&nome=${nome}`;
}
function consumirReceita(id, nome) {
    window.location.href =
        `novoConsumo.html?id=${id}&tipo=RECEITA&nome=${nome}`;
}
async function listarConsumosDia() {
    try {
        const response = await fetch(`${API_URL}/consumo/dia`, {
            headers: getAuthHeaders()
        });

        const data = await response.json();

        const tabela = document.getElementById("consumosTable");

        let linhas = `
            <tr>
                <th>Nome</th>
                <th>Quantidade</th>
                <th>Calorias</th>
                <th>Proteínas</th>
                <th>Carboidratos</th>
                <th>Gorduras</th>
                <th>Data</th>
                <th>Ações</th>
            </tr>
        `;

        data.forEach(consumo => {
            linhas += `
                <tr>
                    <td>${consumo.nome}</td>
                    <td>${consumo.quantidade}</td>
                    <td>${consumo.calorias}</td>
                    <td>${consumo.proteinas}</td>
                    <td>${consumo.carboidrato}</td>
                    <td>${consumo.gordura}</td>
                    <td>${consumo.dataHora}</td>
                    <td>
                        <button onclick="deletarConsumo(${consumo.id})">
                            Deletar
                        </button>
                    </td>
                </tr>
            `;
        });

        tabela.innerHTML = linhas;

    } catch (erro) {
        console.error(erro);
    }
}

async function deletarConsumo(id) {

    if (!confirm("Deseja realmente deletar?")) {
        return;
    }

    try {

        const response = await fetch(`${API_URL}/consumo/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders()
        });

        if (response.ok) {
            alert("Consumo deletado.");
            listarConsumosDia();
        } else {
            alert("Erro ao deletar.");
        }

    } catch (erro) {
        console.error(erro);
    }
}

async function consumir(event) {

    event.preventDefault();

    const dados = {
        idReceitaOuComida: document.getElementById("idItem").value,
        tipoConsumo: document.getElementById("tipo").value,
        nome: document.getElementById("nome").value,
        quantidade: document.getElementById("quantidade").value,
        valor: document.getElementById("valor").value
    };

    try {

        const response = await fetch(`${API_URL}/consumo`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(dados)
        });

        if (response.ok) {
            alert("Consumo registrado.");
            window.location.href =
       `consumoDia.html`;

        } else {
            alert("Erro ao registrar.");
        }

    } catch (erro) {
        console.error(erro);
    }
}

async function carregarConsumo() {

    const id = new URLSearchParams(window.location.search).get("id");

    try {

        const response = await fetch(`${API_URL}/consumo/${id}`, {
            headers: getAuthHeaders()
        });

        const consumo = await response.json();

        document.getElementById("nome").value = consumo.nome;
        document.getElementById("quantidade").value = consumo.quantidade;

    } catch (erro) {
        console.error(erro);
        alert("Erro ao carregar consumo.");
    }
}
