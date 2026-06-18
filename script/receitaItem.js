const params = new URLSearchParams(window.location.search);

const receitaId = params.get("id");
const itemIdAtual = params.get("itemId");
const origemItem = params.get("origem") || "USUARIO";

console.log(window.location.href);
console.log(window.location.search);

console.log("receitaId:", receitaId);
console.log("itemIdAtual:", itemIdAtual);
console.log("origem:", origemItem);

document.addEventListener("DOMContentLoaded", async () => {
    await unidades();
    await listarComidas();
    await listarItens();

    document.getElementById("comida").addEventListener("change", () => {
        const select = document.getElementById("comida");
        const opt = select.options[select.selectedIndex];

        const unidadeSelect = document.getElementById("unidade");

        unidadeSelect.disabled = false;

        if (opt?.dataset?.unidadeId) {
            unidadeSelect.value = opt.dataset.unidadeId;
            unidadeSelect.disabled = true;
        }
    });

    if (itemIdAtual) {
        await carregarItem();
    }
});

async function listarComidas() {
    const response = await fetch(`${API_URL}/comida/todos`, {
        headers: getAuthHeaders()
    });

    const data = await response.json();

    const select = document.getElementById("comida");
    select.innerHTML = "";

    data.forEach(c => {
        const option = document.createElement("option");
        option.value = c.id;
        option.textContent = c.nome;
        option.dataset.origem = c.origem;
        option.dataset.unidadeId = c.unidadeId;
        select.appendChild(option);
    });
}

async function unidades() {
    const response = await fetch(`${API_URL}/unidade`, {
        headers: getAuthHeaders()
    });

    const data = await response.json();

    const select = document.getElementById("unidade");
    select.innerHTML = "";

    data.forEach(u => {
        const option = document.createElement("option");
        option.value = u.id;
        option.textContent = u.nome;
        select.appendChild(option);
    });
}

function listarItens() {
    fetch(`${API_URL}/receita/${receitaId}/itens`, {
        headers: getAuthHeaders()
    })
        .then(r => r.json())
        .then(data => {
            const tabela = document.getElementById("tabelaItens");

            let html = `
                <tr>
                    <th>Nome</th>
                    <th>Quantidade</th>
                    <th>Valor</th>
                    <th>Ações</th>
                </tr>
            `;

            data.forEach(item => {
                html += `
                    <tr>
                        <td>${item.nome}</td>
                        <td>${item.quantidade}</td>
                        <td>${item.valor}</td>
                        <td>
                            <button onclick="irParaEditarItens('${item.id}', '${item.origem}')">Editar</button>
                            <button onclick="deletarItem('${item.id}', '${item.origem}')">Deletar</button>
                        </td>
                    </tr>
                `;
            });

            tabela.innerHTML = html;
        });
}

function irParaEditarItens(itemId, origem) {
    window.location.href = `editarItem.html?id=${receitaId}&itemId=${itemId}&origem=${origem}`;
}

async function carregarItem() {
    const response = await fetch(
        `${API_URL}/receita/${receitaId}/itens/${itemIdAtual}?origem=${origemItem}`,
        { headers: getAuthHeaders() }
    );

    const item = await response.json();

    document.getElementById("quantidade").value = item.quantidade || "";
    document.getElementById("valor").value = item.valor || "";
}

async function editarItem(event) {
    event.preventDefault();

    const dados = {
        quantidade: document.getElementById("quantidade").value,
        valor: document.getElementById("valor").value,
        origem: origemItem
    };

    const response = await fetch(
        `${API_URL}/receita/${receitaId}/itens/${itemIdAtual}`,
        {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(dados)
        }
    );

    if (response.ok) {
        window.location.href = "listaReceitas.html";
    } else {
        alert("Erro ao atualizar item");
        console.log("Item id:", itemIdAtual);
    }
}

async function deletarItem(id, origem) {
    if (!confirm("Tem certeza que deseja deletar este item?")) return;

    await fetch(
        `${API_URL}/receita/${receitaId}/itens/${id}?origem=${origem}`,
        {
            method: "DELETE",
            headers: getAuthHeaders()
        }
    );

    listarItens();
}