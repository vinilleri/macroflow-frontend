async function listarAtividadeFisica() {
    try {
        const response = await fetch(`${API_URL}/atividade-fisica`);
        const data = await response.json();

        const select = document.getElementById("atividadeFisica");
        select.innerHTML = "";

        data.forEach(atividade => {
            const option = document.createElement("option");
            option.value = atividade.id;
            option.textContent = atividade.descricao;
            select.appendChild(option);
        });
    } catch (error) {
        console.error(error);
        alert("Erro ao carregar atividades físicas.");
    }
}

async function carregarUsuario() {
    try {
        const response = await fetch(`${API_URL}/usuario`, {
            headers: getAuthHeaders()
        });

        const usuario = await response.json();

        document.getElementById("nome").value = usuario.nome;
        document.getElementById("email").value = usuario.email;
        document.getElementById("atividadeFisica").value = usuario.atividadeFisica.id;
    } catch (error) {
        console.error(error);
    }
}

async function editarUsuario(event) {
    event.preventDefault();

    const dados = {
        nome: document.getElementById("nome").value,
        email: document.getElementById("email").value,
        senha: document.getElementById("senha").value,
        atividadeFisicaId: document.getElementById("atividadeFisica").value
    };

    try {
        const response = await fetch(`${API_URL}/usuario`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(dados)
        });

        if (response.ok) {
            alert("Usuário atualizado com sucesso!");
        } else {
            alert("Erro ao atualizar usuário.");
        }
    } catch (error) {
        console.error(error);
        alert("Erro ao atualizar usuário.");
    }
}

async function atualizarAtividadeFisica() {
    const atividadeFisicaId = document.getElementById("atividadeFisica").value;

    try {
        const response = await fetch(
            `${API_URL}/usuario/atividadeFisica?atividadeFisicaId=${atividadeFisicaId}`,
            {
                method: "PATCH",
                headers: getAuthHeaders()
            }
        );

        if (response.ok) {
            alert("Atividade física atualizada!");
        } else {
            alert("Erro ao atualizar atividade física.");
        }
    } catch (error) {
        console.error(error);
        alert("Erro ao atualizar atividade física.");
    }
}

async function deletarUsuario() {
    const confirmar = confirm("Tem certeza que deseja excluir sua conta?");

    if (!confirmar) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/usuario`, {
            method: "DELETE",
            headers: getAuthHeaders()
        });

        if (response.ok) {
            localStorage.clear();
            alert("Conta excluída com sucesso!");
            window.location.href = "login.html";
        } else {
            alert("Erro ao excluir conta.");
        }
    } catch (error) {
        console.error(error);
        alert("Erro ao excluir conta.");
    }
}

async function iniciarPagina() {
    await listarAtividadeFisica();
    await carregarUsuario();
}

iniciarPagina();
