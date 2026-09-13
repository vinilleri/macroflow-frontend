const API_URL = "http://localhost:8080/api";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

async function verificarLogin() {
  const token = localStorage.getItem("token");

  const paginaAtual = window.location.pathname;

  if (
    !token &&
    !paginaAtual.includes("login.html") &&
    !paginaAtual.includes("codigoEmail.html") &&
    !paginaAtual.includes("cadastro.html") &&
    !paginaAtual.includes("recuperarConta.html") &&
    !paginaAtual.includes("recuperarSenha.html")
  ) {
    sessionStorage.setItem("mensagemLogin", "Faça login para continuar.");

    window.location.href = "login.html";
    return;
  }
  try {
    const response = await fetch(`${API_URL}/auth`, {
      headers: getAuthHeaders(),
    });

    if (
      response.status === 403 &&
      !paginaAtual.includes("login.html") &&
      !paginaAtual.includes("codigoEmail.html") &&
      !paginaAtual.includes("cadastro.html") &&
      !paginaAtual.includes("recuperarConta.html") &&
      !paginaAtual.includes("recuperarSenha.html")
    ) {
      sessionStorage.setItem(
        "mensagemLogin",
        "Sessão expirada, logue novamente para continuar.",
      );

      localStorage.removeItem("token");
      window.location.href = "login.html";
    }
  } catch (e) {
    console.error(e);
  }
}

async function verificarCompletude() {
  try {
    const response = await fetch(`${API_URL}/usuario/completude`, {
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    console.log("COMPLETUDE:", data);
    const cadastro = {
      objetivo: data.possuiObjetivo,
      medidas: data.possuiMedidas,
      meta: data.possuiMeta,
    };
    if (data.possuiObjetivo) {
      const etapaObjetivo = document.getElementById("etapaObjetivo");
      const linkObjetivo = document.getElementById("linkObjetivo");

      if (etapaObjetivo) etapaObjetivo.style.display = "none";
      if (linkObjetivo) linkObjetivo.style.display = "none";
    }

    if (data.possuiMedidas) {
      const etapaMedidas = document.getElementById("etapaMedidas");
      const linkMedidas = document.getElementById("linkMedidas");

      if (etapaMedidas) etapaMedidas.style.display = "none";
      if (linkMedidas) linkMedidas.style.display = "none";
    }

    if (data.possuiMeta) {
      const etapaMeta = document.getElementById("etapaMeta");
      const linkMeta = document.getElementById("linkMeta");

      if (etapaMeta) etapaMeta.style.display = "none";
      if (linkMeta) linkMeta.style.display = "none";
    }

    const falsos = [];

    for (const [chave, valor] of Object.entries(cadastro)) {
      if (!valor) {
        falsos.push(chave);
      }
    }
    console.log("FALSOS:", falsos);
    console.log("PÁGINA:", window.location.pathname);
    if (
      falsos.length > 0 &&
      !window.location.pathname.includes("onboarding.html") &&
      !window.location.pathname.includes("login.html") &&
      !window.location.pathname.includes("codigoEmail.html") &&
      !window.location.pathname.includes("cadastro.html") &&
      !window.location.pathname.includes("meta.html") &&
      !window.location.pathname.includes("medidasCorporais.html") &&
      !window.location.pathname.includes("cadastrarObjetivo.html")
    ) {
      window.location.href = "onboarding.html";
      return;
    }
  } catch (e) {
    console.error(e);
  }
}
document.addEventListener("DOMContentLoaded", () => {
  verificarLogin();
  verificarCompletude();
});
