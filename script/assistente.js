async function carregarChat() {
    const response = await fetch(`${API_URL}/assistente-virtual`, {
        headers: getAuthHeaders()
    });

    const data = await response.json();

    const chat = document.getElementById("chat");
    chat.innerHTML = "";

    data.forEach(item => {
        chat.innerHTML += `
            <div>Você: ${item.mensagemUsuario}</div>
            <div>IA: ${item.mensagemIa}</div>
            <hr>
        `;
    });
}
function scrollToBottom() {
    const chat = document.getElementById("chat");
    chat.scrollTop = chat.scrollHeight;
}

function mostrarLoading() {
    document.getElementById("loading").style.display = "block";
}

function esconderLoading() {
    document.getElementById("loading").style.display = "none";
}

async function enviar() {
    const input = document.getElementById("mensagem");
    const pergunta = input.value;

    if (!pergunta) return;
    mostrarLoading();
    await fetch(`${API_URL}/assistente-virtual`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ pergunta })
    });

    input.value = "";

   await carregarChat();
   esconderLoading();
    scrollToBottom();
}