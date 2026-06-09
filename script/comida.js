


async function unidades(){
    try{
        
        const response = await fetch(`${API_URL}/unidade`, {
            method: "GET",
            headers: getAuthHeaders()
        });
        const data = await response.json();
          const select = document.getElementById("unidade");
        select.innerHTML = "";
         if (!select) {
        return;
         }
        data.forEach(unidade => {
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
        SALADA: "🥗"
};
async function icones(){
    try{
        const response = await fetch(`${API_URL}/icone`, {
            method: "GET",
            headers: getAuthHeaders()
        });

        const data = await response.json();

        const select = document.getElementById("icone");
        select.innerHTML = "";
  if (!select) {
        return;
    }
        data.forEach(icone => {
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

async function salvarDados(event){
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
        unidadeId: unidade
    };

    try {
        const response = await fetch(`${API_URL}/comida`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(dados)
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

async function irParaEditar(id) {
    window.location.href = `editarComida.html?id=${id}`;
}
async function irParaLista(){
    window.location.href = `comidas.html`;
}

async function editarComida(event){
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
        unidadeId: unidade
    };

    try {
        const response = await fetch(`${API_URL}/comida/${id}`, {
            method: "PUT",
            headers:getAuthHeaders(),
            body: JSON.stringify(dados)
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

async function deletarComida(id){
        if(!confirm("Tem certeza que deseja deletar esta comida?")) {
            return;
        }
    try {
        const response = await fetch(`${API_URL}/comida/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders()
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
            headers: getAuthHeaders()
        });

        const data = await response.json();
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

        for (const comida of data) {

            const responseUnidade = await fetch(
                `${API_URL}/unidade/${comida.unidadeId}`,
                {
                    headers: getAuthHeaders()
                }
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
                        <button onclick="abrirConsumo('${comida.id}', '${comida.origem}', '${comida.nome}')">
                            Consumir
                        </button>

                        ${podeEditar ? `
                            <button onclick="irParaEditar('${comida.id}')">
                                Editar
                            </button>
                            <button onclick="deletarComida('${comida.id}')">
                                Deletar
                            </button>
                        ` : ""}
                    </td>
                </tr>
            `;
        }

        table.innerHTML = linhas;

    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao listar comidas.");
    }
}

