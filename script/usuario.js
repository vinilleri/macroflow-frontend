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
listarAtividadeFisica();






async function salvarDados(event){
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const atividadeFisica = document.getElementById("atividadeFisica").value;

    const dados = {
        nome,
        email,
        senha,
        atividadeFisicaId: atividadeFisica
    };

    try {
        const response = await fetch(`${API_URL}/usuario`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        if (response.ok) {
            alert("Usuário registrado com sucesso!");

            document.getElementById("nome").value = "";
            document.getElementById("email").value = "";
            document.getElementById("senha").value = "";
            document.getElementById("atividadeFisica").value = "";
        } else {
            alert("Erro ao registrar usuário.");
        }
    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao registrar usuário.");
    }
}

    
