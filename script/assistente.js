async function carregarChat() {
    const response = await fetch(`${API_URL}/assistente-virtual`, {
        headers: getAuthHeaders()
    });

    const data = await response.json();

    const chat = document.getElementById("chat");
    chat.innerHTML = "";

    data.forEach(item => {
        chat.innerHTML += `
          <div class="msg user">
        <strong>Você:</strong> ${item.mensagemUsuario}
    </div>

    <div class="msg ia">
        <strong>Magali:</strong> ${item.mensagemIa}
             <button onclick='falar(${JSON.stringify(item.mensagemIa)})'>
                🔊 Ouvir
             </button>
    </div>
`;
    });
}


async function deletarChat(){
    if(!confirm("Tem certeza que deseja deletar essa conversa?")){
        return;
    }
    try{
        const response = await fetch(`${API_URL}/assistente-virtual`, {
            method: "DELETE",
            headers: getAuthHeaders()
        });
        if (response.ok) {
            alert("Conversa deletada com sucesso!");
            await carregarChat();
        } else {
            alert("Erro ao deletar conversa.");
        }
    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao deletar conversa.");
    }
}


function falar(texto){

    const voz = new SpeechSynthesisUtterance(texto);

    voz.lang = "pt-BR";

    voz.rate = 3;

    voz.pitch = 1;

    speechSynthesis.speak(voz);
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