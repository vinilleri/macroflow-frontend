const params = new URLSearchParams(window.location.search);

const receitaId = params.get("id");
const itemIdAtual = params.get("itemId");
const origemItem = params.get("origem") || "USUARIO";


document.addEventListener("DOMContentLoaded", async () => {
    
    await listarComidas();
    await listarItens();

    document.getElementById("comida").addEventListener("change", async () => {
        const select = document.getElementById("comida");
        const opt = select.options[select.selectedIndex];

        const unidade = document.getElementById("unidade");

        unidade.disabled = false;

        if (opt?.dataset?.unidadeId) {
            unidade.value = await getUnidade(opt.dataset.unidadeId);
            unidade.disabled = true;
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

    const selectComida = document.getElementById("comida");
    selectComida.innerHTML = "";

    

    
    data.forEach(c => {
        const option = document.createElement("option");
        option.value = c.id;
        option.textContent = c.nome;
        option.dataset.origem = c.origem;
        option.dataset.unidadeId = c.unidadeId;
        

        selectComida.appendChild(option);
    });


}

async function getUnidade(unidadeId){
    
    const response = await fetch(`${API_URL}/unidade/${unidadeId}`, {
        headers: getAuthHeaders()
    });

    const data = await response.json();

    const unidade = data.nome;
    return unidade;
}


async function adicionarItem(event){
    event.preventDefault();

    const select = document.getElementById("comida");
    const opt = select.options[select.selectedIndex];

    const dados = {
        comidaId: opt.value,
        unidadeId: opt.dataset.unidadeId,
        quantidade: document.getElementById("quantidade").value,
        valor: document.getElementById("valor").value,
        origem: opt.dataset.origem
    };

    try {
        const response = await fetch(`${API_URL}/receita/${receitaId}/itens`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(dados)
        });

        if (response.ok) {
            alert("Item registrado com sucesso!");
            irParaLista();
        } else {
            alert("Erro ao registrar item.");
        }
    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao registrar item.");
    }

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