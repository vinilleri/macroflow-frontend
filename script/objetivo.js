async function listarTipoObjetivo() {
    const response = await fetch(`${API_URL}/objetivo/tipos`, {
        headers: getAuthHeaders()
    });
    const data = await response.json();
    const select = document.getElementById("tipoObjetivo");
    select.innerHTML = "";
    data.forEach(tipo => {
        const option = document.createElement("option");
        option.value = tipo.id;
        option.textContent = tipo.tipo;
        select.appendChild(option);
    });
}

let objetivoAtualCache = null;

async function salvarDados(event) {
    event.preventDefault();

    let dataFim;
    if (document.getElementById("dataFinal").value) {
        dataFim = document.getElementById("dataFinal").value;
    }
    const tipoObjetivo = document.getElementById("tipoObjetivo").value;

    const dados = {
        dataFim: dataFim,
        tipoObjetivoId: tipoObjetivo
    };
    try {
        const response = await fetch(`${API_URL}/objetivo`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(dados)
        });
        if (response.ok) {
            alert("Objetivo registrado com sucesso!");
            objetivoAtualCache = null;
            carregarObjetivoAtual();
            listarObjetivosAntigos();
            document.getElementById("dataFinal").value = "";
            document.getElementById("tipoObjetivo").value = "";
        } else {
            alert("Erro ao registrar objetivo.");
        }
    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao registrar objetivo.");
    }
}

async function editarObjetivo(event) {
    event.preventDefault();

    let dataFim;
    if (document.getElementById("dataFinal").value) {
        dataFim = document.getElementById("dataFinal").value;
    }

    const objetivo = await objetivoAtual();

    if (!objetivo || !objetivo.id) {
        alert("Nenhum objetivo ativo encontrado.");
        return;
    }

    const dados = {
        dataFim: dataFim,
        tipoObjetivoId: document.getElementById("tipoObjetivo").value
    };
    try {
        const response = await fetch(`${API_URL}/objetivo/${objetivo.id}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(dados)
        });

        if (response.ok) {
            alert("Objetivo editado com sucesso!");
            objetivoAtualCache = null;
            document.getElementById("dataFinal").value = "";
            document.getElementById("tipoObjetivo").value = "";
            carregarObjetivoAtual();
            listarObjetivosAntigos();
        } else {
            alert("Erro ao editar objetivo.");
        }
    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao editar objetivo.");
    }
}

async function desativarObjetivo() {
    if (!confirm("Deseja realmente desativar este objetivo?")) {
        return;
    }
    const objetivo = await objetivoAtual();

    if (!objetivo || objetivo.id == null) {
        alert("Nenhum objetivo ativo encontrado para desativar.");
        return;
    }

    try {
        const patch = await fetch(`${API_URL}/objetivo/desativar/${objetivo.id}`, {
            method: "PATCH",
            headers: getAuthHeaders()
        });

        if (patch.ok) {
            alert("Objetivo desativado com sucesso!");
            objetivoAtualCache = null;
            carregarObjetivoAtual();
            listarObjetivosAntigos();
        } else {
            alert("Erro ao desativar objetivo.");
        }
    } catch (error) {
        console.error(error);
        alert("Erro ao desativar objetivo.");
    }
}

async function objetivoAtual() {
    if (objetivoAtualCache) {
        return objetivoAtualCache;
    }

    const response = await fetch(`${API_URL}/objetivo`, {
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        throw new Error("Não foi possível obter o objetivo atual");
    }

    const data = await response.json();
    objetivoAtualCache = data;
    if (data && (data.id || data.objetivoId)) {
        const idToSave = data.id || data.objetivoId;
        localStorage.setItem("objetivoId", idToSave);
    }
    return data;
}

function carregarObjetivoAtual() {
    objetivoAtual()
        .then(data => {
            const tipoObjetivo = data.tipoObjetivo?.tipo ?? "Não informado";
            const dataInicio = data.dataInicio;

            if (data.dataFinal) {
                document.getElementById("dataFinalAtual").textContent = data.dataFinal;
            }

            document.getElementById("tipoObjetivoAtual").textContent = tipoObjetivo;
            document.getElementById("dataInicioAtual").textContent = dataInicio;
        })
        .catch(error => {
            console.log("Erro:", error);
        });
}

document.addEventListener("DOMContentLoaded", () => {
    carregarObjetivoAtual();
    listarObjetivosAntigos();
    listarTipoObjetivo();
});

function listarObjetivosAntigos() {
    fetch(`${API_URL}/objetivo/historico`, {
        headers: getAuthHeaders()
    })
        .then(response => response.json())
        .then(data => {
            const tabela = document.getElementById("tabelaObjetivos");
            tabela.innerHTML = "";

            data.forEach(objetivo => {
                const linha = document.createElement("tr");

                linha.innerHTML = `
                    <td>${objetivo.id}</td>
                    <td>${objetivo.tipoObjetivo.tipo}</td>
                    <td>${objetivo.dataInicio}</td>
                    <td>${objetivo.dataFinal}</td>
                    <td>
                        <button onclick="deletarObjetivoAntigo(${objetivo.id})">
                        Excluir
                        </button>
                    </td>
                `;

                tabela.appendChild(linha);
            });
        })
        .catch(error => {
            console.log("Erro:", error);
        });
}

async function deletarObjetivoAntigo(id) {
    if (!confirm("Deseja realmente deletar este objetivo?")) {
        return;
    }
    try {
        const response = await fetch(`${API_URL}/objetivo/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders()
        });

        if (response.ok) {
            alert("Objetivo deletado com sucesso!");
            listarObjetivosAntigos();
        } else {
            alert("Erro ao deletar objetivo.");
        }
    } catch (error) {
        console.error(error);
        alert("Erro ao deletar objetivo.");
    }
}
