import fs from 'fs';
import { execSync } from 'child_process';

const originalHtml = execSync('npx -y tsx fetch_original.js').toString();

// Add the login button to the header
let modifiedHtml = originalHtml.replace(
  '<p>Sistema de escaneo continuo para caravanas electrónicas</p>',
  `<p>Sistema de escaneo continuo para caravanas electrónicas</p>
            <div id="auth-container" style="margin-top: 15px; display: flex; flex-direction: column; align-items: center; gap: 10px;">
                <button id="login-btn" class="btn btn-secondary btn-small" style="margin: 0 auto; display: flex; align-items: center; gap: 8px;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                    Iniciar sesión con Google para guardar en la nube
                </button>
                <div id="user-info" style="display: none; align-items: center; gap: 10px;">
                    <span id="user-email" style="color: var(--text-muted); font-size: 0.9rem;"></span>
                    <button id="logout-btn" class="btn btn-danger btn-small" style="padding: 4px 8px; font-size: 0.8rem;">Cerrar sesión</button>
                </div>
            </div>`
);

// Add the module script at the end of body
modifiedHtml = modifiedHtml.replace(
  '</body>',
  `    <script type="module" src="/src/main.tsx"></script>
</body>`
);

// Modify the storage functions to use Firebase
modifiedHtml = modifiedHtml.replace(
  `        // Cargar servicios guardados del localStorage
        function cargarServiciosGuardados() {
            const guardados = localStorage.getItem('serviciosCaravanas');
            if (guardados) {
                serviciosGuardados = JSON.parse(guardados);
                actualizarHistorial();
            }
        }

        // Guardar en localStorage
        function guardarEnStorage() {
            localStorage.setItem('serviciosCaravanas', JSON.stringify(serviciosGuardados));
        }`,
  `        // Cargar servicios guardados del localStorage
        async function cargarServiciosGuardados() {
            if (window.firebaseCargarServicios) {
                const data = await window.firebaseCargarServicios();
                if (data) {
                    serviciosGuardados = data;
                    actualizarHistorial();
                    return;
                }
            }
            const guardados = localStorage.getItem('serviciosCaravanas');
            if (guardados) {
                serviciosGuardados = JSON.parse(guardados);
                actualizarHistorial();
            }
        }

        // Guardar en localStorage
        async function guardarEnStorage() {
            localStorage.setItem('serviciosCaravanas', JSON.stringify(serviciosGuardados));
            if (window.firebaseGuardarServicios) {
                await window.firebaseGuardarServicios(serviciosGuardados);
            }
        }`
);

fs.writeFileSync('index.html', modifiedHtml);
console.log('index.html updated successfully');
