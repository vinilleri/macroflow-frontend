async function logar(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const dados = { email, senha };

    try {
        const response = await fetch(`${API_URL}/usuario/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Erro ao fazer login.");
        }

        localStorage.setItem("email", email);

        alert("Verifique seu email para confirmar o login!");
        window.location.href = "codigoEmail.html";
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        alert("Erro ao fazer login: " + (error.message || "Tente novamente mais tarde."));
    }
}

async function validarLogin(event) {
    event.preventDefault();
    const codigo = document.getElementById("codigo").value;
    const email = localStorage.getItem("email");
    try {
        const response = await fetch(`${API_URL}/usuario/login/confirmar`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ codigo: codigo, email: email })
        });
        if (response.ok) {
            const data = await response.json();
            const token = data.token;
            localStorage.setItem("token", token);

            alert("Login confirmado com sucesso!");
            window.location.href = "cadastrarObjetivo.html";
        } else {
            alert("Código de confirmação inválido. Por favor, tente novamente.");
        }
    } catch (error) {
        console.error("Erro:", error);
        alert("Ocorreu um erro ao confirmar o login. Por favor, tente novamente mais tarde.");
    }
}

function mensagem(){
    const mensagem = sessionStorage.getItem("mensagemLogin");

if (mensagem) {
    document.getElementById("mensagem").textContent = mensagem;
    sessionStorage.removeItem("mensagemLogin");
}
}
document.addEventListener("DOMContentLoaded", mensagem);
async function logout() {
    try {
        await fetch(`${API_URL}/usuario/deslogar`, {
            method: "POST",
            headers: getAuthHeaders()
        });
    } catch (error) {
        console.error(error);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("email");

    window.location.href = "login.html";
}
