
async function salvarDados(event){
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const dados = {
        nome: nome
    };

    try {
        const response = await fetch(`${API_URL}/receita`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(dados)
        });
       
        if (response.ok) {
            alert("Receita registrada com sucesso!");
             const receita = await response.json();
            irParaLista();
        } else {
            alert("Erro ao registrar receita.");
        }
    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao registrar receita.");
    }
}
function irParaEditar(id) {
    window.location.href = `editarReceita.html?id=${id}`;
}

function irParaLista(){
    window.location.href = `receitas.html`;
}



async function editarReceita(event) {
    event.preventDefault();
    const id = new URLSearchParams(window.location.search).get("id");
  

    const dados = {
        nome: document.getElementById("nome").value
    };
    try{
    const response = await fetch(
        `${API_URL}/receita/${id}`,
        {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(dados)
        }
    );

    if (response.ok) {
        alert("Receita atualizada!");
        irParaLista();
    }
    else{
        alert("Erro ao atualizar receita.");
    }
    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao atualizar receita.");
    }
}


async function deletarReceita(id) {
    if (!confirm("Tem certeza que deseja deletar esta receita?")) {
        return;
    }

    try {
        const response = await fetch(
        `${API_URL}/receita/${id}`,
        {
            method: "DELETE",
            headers: getAuthHeaders()
        }
    );

    if (response.ok) {
        alert("Receita deletada!");
        listarReceitas();
    }
    else{
        alert("Erro ao deletar receita.");
    }
    }catch (error) {
        console.error("Erro:", error);
        alert("Erro ao deletar receita.");
    }

}


async function listarReceitas() {
    try {
        const response = await fetch(`${API_URL}/receita`, {
            headers: getAuthHeaders()
        });

        const data = await response.json();

        const table = document.getElementById("tableReceitas");
        if (!table) return;

        let lista = `
            <tr>
                <th>Nome</th>
                <th>Ações</th>
            </tr>
        `;

        data.forEach(receita => {
            lista += `
                <tr>
                    <td>${receita.nome}</td>
                    <td>
                        <button onclick="irParaEditar('${receita.id}')">Editar</button>
                        <button onclick="consumirReceita('${receita.id}', '${receita.nome}')">Consumir</button>
                        <button onclick="deletarReceita('${receita.id}')">Deletar</button>
                    </td>
                </tr>
            `;
        });

        table.innerHTML = lista;

    } catch (error) {
        console.error("Erro:", error);
    }
}