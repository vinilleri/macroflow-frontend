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
