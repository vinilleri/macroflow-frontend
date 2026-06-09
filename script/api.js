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

function verificarLogin() {
    
    const token = localStorage.getItem("token");

       const paginaAtual = window.location.pathname;

    if (!token && !paginaAtual.includes("login.html")  && !paginaAtual.includes("codigoEmail.html")  && !paginaAtual.includes("cadastro.html")) {
         sessionStorage.setItem(
            "mensagemLogin",
            "Faça login para continuar."
        );

        window.location.href = "login.html";
    }

    const response = fetch(`${API_URL}/auth`, {
       headers: getAuthHeaders()
    });

    if (response.status === 401) {
        sessionStorage.setItem(
            "mensagemLogin",
            "Sessão expirada, logue novamente para continuar"
        );

        window.location.href = "login.html";
    }
}
document.addEventListener("DOMContentLoaded", verificarLogin);