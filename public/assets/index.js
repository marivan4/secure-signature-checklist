
// Script for Track'n'Me application initialization
console.log("Track'n'Me application is initializing...");

// Error handling for script loading issues
window.onerror = function(msg, url, line, col, error) {
  console.error("Error caught:", error);
  applyFallbackInterface();
  return false;
};

// Function to apply fallback interface if React doesn't load
function applyFallbackInterface() {
  const root = document.getElementById("root");
  
  if (root && root.childElementCount === 0) {
    console.log("Applying fallback interface...");
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
        <svg width="100" height="100" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-bottom: 20px;">
          <rect width="64" height="64" rx="12" fill="#5D3FD3"/>
          <path d="M19 32L28 41L45 24" stroke="white" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h1 style="color: #5D3FD3; margin-bottom: 20px;">Track'n'Me</h1>
        <p style="max-width: 600px; margin-bottom: 20px;">
          O sistema Track'n'Me está carregando. Se esta página continuar aparecendo,
          verifique se os arquivos de build do React foram corretamente implementados.
        </p>
        <div style="display: flex; gap: 10px;">
          <a href="/public/" style="
            background-color: #5D3FD3;
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            text-decoration: none;
          ">Tentar Novamente</a>
          <a href="/public/verify-build.php" style="
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
}

// Execute fallback check when DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
  // Give React some time to load and render
  setTimeout(function() {
    const root = document.getElementById("root");
    if (root && root.childElementCount === 0) {
      applyFallbackInterface();
    }
  }, 2000); // Wait 2 seconds for React to load
});
