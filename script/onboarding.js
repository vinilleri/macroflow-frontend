document.addEventListener("DOMContentLoaded", async () => {
  const response = await fetch(`${API_URL}/usuario/completude`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  const linkMedidas = document.getElementById("linkMedidas");
  const linkObjetivo = document.getElementById("linkObjetivo");
  const linkMeta = document.getElementById("linkMeta");

  if (!data.possuiMedidas) {
    linkObjetivo.addEventListener("click", (event) => {
      event.preventDefault();
    });

    linkMeta.addEventListener("click", (event) => {
      event.preventDefault();
    });

    return;
  }

  if (!data.possuiObjetivo) {
    linkMeta.addEventListener("click", (event) => {
      event.preventDefault();
    });

    return;
  }
});
