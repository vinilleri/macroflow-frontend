let objetivoAtualCache = null;

async function objetivoAtual() {
    if (objetivoAtualCache) return objetivoAtualCache;

    const response = await fetch(`${API_URL}/objetivo`, {
        headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error("Erro ao buscar objetivo");

    objetivoAtualCache = await response.json();
    return objetivoAtualCache;
}

function carregarObjetivoAtual() {
    objetivoAtual()
        .then(data => console.log("Objetivo:", data))
        .catch(err => console.error(err));
}

function toggleManualFields() {
    const tipoMeta = document.getElementById("tipoMeta")?.value;
    const manualFields = document.getElementById("manualFields");

    if (manualFields) {
        manualFields.style.display = tipoMeta === "MANUAL" ? "block" : "none";
    }
}

function initMetaPage() {
    const form = document.getElementById("metaForm");
    const tipoMetaSelect = document.getElementById("tipoMeta");

    if (form) form.addEventListener("submit", salvarDadosMeta);
    if (tipoMetaSelect) tipoMetaSelect.addEventListener("change", toggleManualFields);

    toggleManualFields();
    carregarObjetivoAtual();
    metaAtual();
}

window.addEventListener("DOMContentLoaded", initMetaPage);

async function salvarDadosMeta(event) {
    event.preventDefault();

    try {
        const objetivo = await objetivoAtual();
        const tipoMeta = document.getElementById("tipoMeta").value.toUpperCase();

        if (!objetivo?.id) {
            alert("Nenhum objetivo encontrado.");
            return;
        }

        let dados = {
            tipoMeta,
            objetivoId: objetivo.id
        };

        if (tipoMeta === "MANUAL") {
            dados = {
                tipoMeta,
                objetivoId: objetivo.id,
                calorias: document.getElementById("calorias").value,
                proteinas: document.getElementById("proteinas").value,
                carboidrato: document.getElementById("carboidrato").value,
                gordura: document.getElementById("gordura").value
            };
        }

        const response = await fetch(`${API_URL}/meta`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(dados)
        });

        if (response.ok) {
            alert("Meta salva!");
        } else {
            alert("Erro ao salvar meta.");
        }

    } catch (err) {
        console.error(err); 
    }
}

function metaAtual() {
    fetch(`${API_URL}/meta`, { headers: getAuthHeaders() })
        .then(r => r.json())
        .then(data => {
            console.log(data.proteinas);
            document.getElementById("calorias").textContent = data.calorias;
            document.getElementById("carboidrato").textContent = data.carboidrato;
            document.getElementById("proteina").textContent = data.proteinas;
            document.getElementById("gordura").textContent = data.gordura;
        })
        .catch(console.error);
}

function irParaCriarMeta() {
    window.location.href = "meta.html";
}

async function desativarMeta() {
    await fetch(`${API_URL}/meta/desativar`, {
        method: "PATCH",
        headers: getAuthHeaders()
    });

    irParaCriarMeta();
}

async function editarDados(event) {
    event.preventDefault();

    const objetivo = await objetivoAtual();
    const tipoMeta = document.getElementById("tipoMeta").value.toUpperCase();

    if (!objetivo?.id || !objetivo?.ativo) {
        alert("Objetivo inválido ou inativo");
        return;
    }

    let dados = {
        tipoMeta,
        objetivoId: objetivo.id
    };

    if (tipoMeta === "MANUAL") {
        dados = {
            tipoMeta,
            objetivoId: objetivo.id,
            calorias: document.getElementById("calorias").value,
            proteinas: document.getElementById("proteinas").value,
            carboidrato: document.getElementById("carboidrato").value,
            gordura: document.getElementById("gordura").value
        };
    }

    await fetch(`${API_URL}/meta`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(dados)
    });
}

async function listarMetasAntigas() {
    const response = await fetch(`${API_URL}/meta/historico`, {
        headers: getAuthHeaders()
    });

    const metas = await response.json();
    const table = document.getElementById("metaTable");

    let html = `
        <tr>
            <th>Tipo</th>
            <th>Calorias</th>
            <th>Proteínas</th>
            <th>Carboidrato</th>
            <th>Gordura</th>
            <th>Data</th>
            <th>Ação</th>
        </tr>
    `;

    metas.forEach(meta => {
        html += `
            <tr>
                <td>${meta.tipoMeta}</td>
                <td>${meta.calorias}</td>
                <td>${meta.proteinas}</td>
                <td>${meta.carboidrato}</td>
                <td>${meta.gordura}</td>
                <td>${new Date(meta.dataCriacao).toLocaleDateString()}</td>
                <td>
                    <button onclick="deletarMeta(${meta.id})">Deletar</button>
                </td>
            </tr>
        `;
    });

    table.innerHTML = html;
}

async function deletarMeta(id) {
    await fetch(`${API_URL}/meta/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
    });

    listarMetasAntigas();
}
