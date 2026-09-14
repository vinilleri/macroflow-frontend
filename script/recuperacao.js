async function enviarEmailRecuperacao() {
  const email = document.getElementById("email").value;
  try {
    const response = await fetch(`${API_URL}/usuario/recuperacao`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: email,
    });

    if (!response.ok) {
      throw new Error("Erro ao enviar email de recuperação.");
    }
    alert("Verifique seu email para redefinir sua senha.");
  } catch (error) {
    console.error("Erro ao enviar email de recuperação:", error);
    alert("Erro ao enviar email de recuperação.");
  }
}
function validarSenha() {
  const senha = document.getElementById("novaSenha").value;

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
function mostrarSenha() {
  const senhaInput = document.getElementById("novaSenha");
  const tipo =
    senhaInput.getAttribute("type") === "password" ? "text" : "password";
  senhaInput.setAttribute("type", tipo);
}
async function redefinirSenha() {
  const token = new URLSearchParams(window.location.search).get("token");
  const novaSenha = document.getElementById("novaSenha").value;
  try {
    const response = await fetch(
      `${API_URL}/usuario/recuperacao/alterarSenha`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ senha: novaSenha, codigo: token }),
      },
    );
    alert("Senha redefinida com sucesso.");
    window.location.href = "login.html";
  } catch (error) {
    console.error("Erro ao redefinir senha:", error);
    alert("Erro ao redefinir senha.");
  }
}
document.getElementById("novaSenha").addEventListener("input", validarSenha);
