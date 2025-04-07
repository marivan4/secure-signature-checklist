
// Script de fallback para quando o React não carregar
console.log("Track'n'Me application is initializing...");

document.addEventListener("DOMContentLoaded", function() {
  const root = document.getElementById("root");
  
  if (root && root.childElementCount === 0) {
    console.log("Aplicando fallback da interface...");
    root.innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        font-family: 'Inter', sans-serif;
        text-align: center;
        padding: 20px;
      ">
        <img src="/assets/logo.svg" alt="Track'n'Me Logo" style="width: 100px; height: auto; margin-bottom: 20px;" />
        <h1 style="color: #5D3FD3; margin-bottom: 20px;">Track'n'Me</h1>
        <p style="max-width: 600px; margin-bottom: 20px;">
          O sistema Track'n'Me está carregando. Se esta página continuar aparecendo,
          verifique se os arquivos de build do React foram corretamente implementados.
        </p>
        <div style="display: flex; gap: 10px;">
          <a href="/system-check.php" style="
            background-color: #5D3FD3;
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            text-decoration: none;
          ">Verificar Sistema</a>
          <a href="/verify-build.php" style="
            background-color: #e2e8f0;
            color: #4a5568;
            padding: 8px 16px;
            border-radius: 4px;
            text-decoration: none;
          ">Verificar Build</a>
        </div>
      </div>
    `;
  }
});
