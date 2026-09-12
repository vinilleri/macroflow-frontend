async function listarAtividadeFisica() {
  try {
    const response = await fetch(`${API_URL}/atividade-fisica`);
    const data = await response.json();

    const select = document.getElementById("atividadeFisica");
    select.innerHTML = "";

    data.forEach((atividade) => {
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

function validarSenha() {
  const senha = document.getElementById("senha").value;

  const tamanho = senha.length >= 8;
  const maiuscula = /[A-Z]/.test(senha);
  const numero = /[0-9]/.test(senha);
  const especial = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(senha);

  atualizarRegra("senha-tamanho", tamanho, "Pelo menos 8 caracteres");
  atualizarRegra("senha-maiuscula", maiuscula, "Uma letra maiúscula");
  atualizarRegra("senha-numero", numero, "Um número");
  atualizarRegra("senha-especial", especial, "Um caractere especial");

  return tamanho && maiuscula && numero && especial;
}
function atualizarRegra(id, valido, texto) {
  const elemento = document.getElementById(id);

  if (valido) {
    elemento.textContent = `✓ ${texto}`;
    elemento.classList.add("valido");
  } else {
    elemento.textContent = `❌ ${texto}`;
    elemento.classList.remove("valido");
  }
}

async function salvarDados(event) {
  event.preventDefault();

  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const atividadeFisica = document.getElementById("atividadeFisica").value;

  const dados = {
    nome,
    email,
    senha,
    atividadeFisicaId: atividadeFisica,
  };

  try {
    const response = await fetch(`${API_URL}/usuario`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
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
document.getElementById("senha").addEventListener("input", validarSenha);
