//const API_URL = "http://137.131.183.148:8080/api";
const API_URL = "http://localhost:8080/api";
function getAuthHeaders() {
    const token = localStorage.getItem("token");
    const headers = {
        "Content-Type": "application/json"
    };
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    return headers;
}

 async function verificarLogin() {
    
    const token = localStorage.getItem("token");

       const paginaAtual = window.location.pathname;

    if (!token && !paginaAtual.includes("login.html")  && !paginaAtual.includes("codigoEmail.html")  && !paginaAtual.includes("cadastro.html")) {
         sessionStorage.setItem(
            "mensagemLogin",
            "Faça login para continuar."
        );

        window.location.href = "login.html";
    }
   try {
        const response = await fetch(`${API_URL}/auth`, {
            headers: getAuthHeaders()
        });

        if (response.status === 403 && !paginaAtual.includes("login.html")  && !paginaAtual.includes("codigoEmail.html")  
            && !paginaAtual.includes("cadastro.html")) {
            sessionStorage.setItem(
                "mensagemLogin",
                "Sessão expirada, logue novamente para continuar."
            );

            localStorage.removeItem("token");
            window.location.href = "login.html";
        }
    } catch (e) {
        console.error(e);
    }
}
document.addEventListener("DOMContentLoaded", verificarLogin);