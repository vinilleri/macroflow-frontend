function salvarDados(event) {
    event.preventDefault();

    let percentualGordura;
    let circuferenciaCintura;
    const peso = document.getElementById("peso").value;
    const altura = document.getElementById("altura").value;
    const sexo = document.getElementById("sexo").value.toUpperCase();
    const dataNascimento = document.getElementById("dataNascimento").value;

    if (document.getElementById("percentualGordura").value) {
        percentualGordura = document.getElementById("percentualGordura").value;
    }
    if (document.getElementById("circuferenciaCintura").value) {
        circuferenciaCintura = document.getElementById("circuferenciaCintura").value;
    }

    const dados = {
        peso: peso,
        altura: altura,
        sexo: sexo,
        dataNascimento: dataNascimento,
        percentualGordura: percentualGordura,
        circuferenciaCintura: circuferenciaCintura
    };

    fetch(`${API_URL}/medidas-corporais`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(dados)
    }).then(response => {
        if (response.ok) {
            alert("Medidas corporais registradas com sucesso!");
            document.getElementById("peso").value = "";
            document.getElementById("altura").value = "";
            document.getElementById("sexo").value = "";
            document.getElementById("dataNascimento").value = "";
            document.getElementById("percentualGordura").value = "";
            document.getElementById("circuferenciaCintura").value = "";
        } else {
            alert("Erro ao registrar medidas corporais.");
        }
    }).catch(error => {
        console.error("Erro:", error);
        alert("Erro ao registrar medidas corporais.");
    });
}

function formatarDataParaBr(isoDate) {
    if (!isoDate) return "";
    const [ano, mes, dia] = isoDate.split("-");
    return `${dia}/${mes}/${ano}`;
}

function mostrarDataNascimento() {
    const dataNascimento = document.getElementById("dataNascimento").value;
    const dataNascimentoBr = formatarDataParaBr(dataNascimento);
    const elemento = document.getElementById("dataNascimentoTexto");
    if (elemento) {
        elemento.textContent = dataNascimentoBr;
    }
}

let medidasId = null;

async function editarMedidas(event) {
    event.preventDefault();

    let percentualGordura;
    let circuferenciaCintura;

    if (document.getElementById("percentualGordura").value) {
        percentualGordura = document.getElementById("percentualGordura").value;
    }

    if (document.getElementById("circuferenciaCintura").value) {
        circuferenciaCintura = document.getElementById("circuferenciaCintura").value;
    }

    const dados = {
        peso: document.getElementById("peso").value,
        altura: document.getElementById("altura").value,
        sexo: document.getElementById("sexo").value.toUpperCase(),
        dataNascimento: document.getElementById("dataNascimento").value,
        percentualGordura,
        circuferenciaCintura
    };

    if (!medidasId) {
        alert("ID das medidas não encontrado.");
        return;
    }

    const response = await fetch(`${API_URL}/medidas-corporais/${medidasId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(dados)
    });

    if (response.ok) {
        alert("Medidas atualizadas!");
    } else {
        alert("Erro ao atualizar medidas.");
    }
}

function medidaAtual() {
    fetch(`${API_URL}/medidas-corporais`, {
        headers: getAuthHeaders()
    })
        .then(response => response.json())
        .then(data => {
            if (data.id) {
                medidasId = data.id;
            }

            const peso = data.peso;
            const altura = data.altura;
            const sexo = data.sexo;
            const dataNascimento = data.dataNascimento;
            const percentualGordura = data.percentualGordura ?? "Não informado";
            const circuferenciaCintura = data.circuferenciaCintura ?? "Não informado";

            document.getElementById("peso").textContent = peso;
            document.getElementById("altura").textContent = altura;
            document.getElementById("sexo").textContent = sexo;
            document.getElementById("dataNascimentoTexto").textContent = dataNascimento;
            document.getElementById("percentualGordura").textContent = percentualGordura;
            document.getElementById("circuferenciaCintura").textContent = circuferenciaCintura;
        })
        .catch(error => {
            console.log("Erro:", error);
        });
}

document.addEventListener("DOMContentLoaded", medidaAtual);

async function listarMedidasPorPeriodo() {
    const dataInicio = document.getElementById("dataInicio").value;
    const dataFinal = document.getElementById("dataFinal").value;

    if (!dataInicio || !dataFinal) {
        alert("Selecione o período");
        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/medidas-corporais/periodo?inicio=${dataInicio}&fim=${dataFinal}`,
            {
                headers: getAuthHeaders()
            }
        );

        if (!response.ok) {
            alert("Erro ao listar medidas corporais por período.");
            return;
        }

        const medidas = await response.json();

        const tabela = document.getElementById("tabelaMedidas");

        let linhas = `
            <tr>
                <th>Data</th>
                <th>Peso</th>
                <th>Altura</th>
                <th>Sexo</th>
                <th>Gordura</th>
                <th>Cintura</th>
            </tr>
        `;

        medidas.forEach(medida => {
            linhas += `
                <tr>
                    <td>${medida.data}</td>
                    <td>${medida.peso}</td>
                    <td>${medida.altura}</td>
                    <td>${medida.sexo}</td>
                    <td>${medida.percentualGordura || "Não informado"}</td>
                    <td>${medida.circuferenciaCintura || "Não informado"}</td>
                </tr>
            `;
        });

        tabela.innerHTML = linhas;

    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao listar medidas corporais por período.");
    }
}

async function gerarGraficoPeso() {
    const dataInicio = document.getElementById("dataInicio").value;
    const dataFinal = document.getElementById("dataFinal").value;

    if (!dataInicio || !dataFinal) {
        alert("Selecione o período");
        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/medidas-corporais/periodo?inicio=${dataInicio}&fim=${dataFinal}`,
            {
                headers: getAuthHeaders()
            }
        );

        if (!response.ok) {
            alert("Erro ao carregar medidas.");
            return;
        }

        const medidas = await response.json();

        const labels = medidas.map(m => m.data);
        const pesos = medidas.map(m => m.peso);

        const canvas = document.getElementById("graficoPeso");
        const graficoExistente = Chart.getChart(canvas);

        if (graficoExistente) {
            graficoExistente.destroy();
        }

        new Chart(canvas, {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    label: "Peso (kg)",
                    data: pesos,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });

    } catch (error) {
        console.error(error);
        alert("Erro ao gerar gráfico.");
    }
}
