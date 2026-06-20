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
    <button class="tts-button" data-texto="${encodeURIComponent(item.mensagemIa)}">
        🔊
    </button>
    </div>
`;
    });
   document.querySelectorAll('.tts-button').forEach(btn => {
    btn.addEventListener('click', () => {
        const texto = decodeURIComponent(btn.dataset.texto);
        falar(texto, btn);
    });
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

let vozFeminina = null;


function carregarVozes(){
    const vozes = window.speechSynthesis.getVoices();

    vozFeminina = vozes.find(v =>
        v.lang.startsWith('pt') &&
        /female|mulher|maria|luciana|fernanda|google português do brasil/i.test(v.name)
    );

    if(!vozFeminina){
        vozFeminina = vozes.find(v => v.lang.startsWith('pt'));
    }
}

window.speechSynthesis.onvoiceschanged = carregarVozes;
carregarVozes();

function falar(texto, btn){
    const synth = window.speechSynthesis;
    const avatar = document.querySelector('.magali-avatar');

    if(synth.speaking && btn.classList.contains('playing')){
        synth.cancel();
        btn.classList.remove('playing');
        btn.innerHTML = '🔊 Ouvir';
        avatar.classList.remove('speaking');
        return;
    }

    if(synth.speaking){
        synth.cancel();
        document.querySelectorAll('.tts-button.playing').forEach(b => {
            b.classList.remove('playing');
            b.innerHTML = '🔊';
        });
    }

    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = 'pt-BR';
    utterance.rate = 1;
    utterance.pitch = 1.1;

    if(vozFeminina){
        utterance.voice = vozFeminina;
    }

    utterance.onstart = () => {
        btn.classList.add('playing');
        btn.innerHTML = '⏸';
        avatar.classList.add('speaking');
    };

    utterance.onend = () => {
        btn.classList.remove('playing');
        btn.innerHTML = '🔊';
        avatar.classList.remove('speaking');
    };

    utterance.onerror = () => {
        btn.classList.remove('playing');
        btn.innerHTML = '🔊';
        avatar.classList.remove('speaking');
    };

    synth.speak(utterance);
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