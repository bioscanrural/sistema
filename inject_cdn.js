import fs from 'fs';

let html = fs.readFileSync('index.html', 'utf8');

// Remove the vite/react main.tsx script
html = html.replace('<script type="module" src="/src/main.tsx"></script>', '');

// Add the CDN script
const cdnScript = `
    <script type="module">
        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
        import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
        import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

        const firebaseConfig = {
            projectId: "gen-lang-client-0791183846",
            appId: "1:571155600389:web:2fb506360968463b76f86c",
            apiKey: "AIzaSyAQbkZ0ovcDXcbfuwbpH9D1bjBC0X6IahE",
            authDomain: "gen-lang-client-0791183846.firebaseapp.com",
            storageBucket: "gen-lang-client-0791183846.firebasestorage.app",
            messagingSenderId: "571155600389"
        };

        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const db = getFirestore(app, "ai-studio-35b92a0f-86aa-40a3-8e08-2efb1c783ada");
        const provider = new GoogleAuthProvider();

        const loginBtn = document.getElementById('login-btn');
        const logoutBtn = document.getElementById('logout-btn');
        const userInfo = document.getElementById('user-info');
        const userEmail = document.getElementById('user-email');

        if (loginBtn) {
            loginBtn.addEventListener('click', async () => {
                try {
                    await signInWithPopup(auth, provider);
                } catch (error) {
                    console.error("Error logging in", error);
                    alert("Error al iniciar sesión: " + error.message);
                }
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                try {
                    await signOut(auth);
                    window.location.reload();
                } catch (error) {
                    console.error("Error logging out", error);
                }
            });
        }

        onAuthStateChanged(auth, async (user) => {
            if (user) {
                if (loginBtn) loginBtn.style.display = 'none';
                if (userInfo) userInfo.style.display = 'flex';
                if (userEmail) userEmail.textContent = 'Sesión iniciada: ' + user.email;
                
                if (typeof window.cargarServiciosGuardados === 'function') {
                    await window.cargarServiciosGuardados();
                }
            } else {
                if (loginBtn) loginBtn.style.display = 'flex';
                if (userInfo) userInfo.style.display = 'none';
                if (userEmail) userEmail.textContent = '';
            }
        });

        window.firebaseCargarServicios = async () => {
            const user = auth.currentUser;
            if (!user) return null;

            try {
                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data && data.servicios) {
                        return JSON.parse(data.servicios);
                    }
                }
                return null;
            } catch (error) {
                console.error("Error loading from Firebase:", error);
                return null;
            }
        };

        window.firebaseGuardarServicios = async (servicios) => {
            const user = auth.currentUser;
            if (!user) return;

            try {
                const docRef = doc(db, 'users', user.uid);
                await setDoc(docRef, {
                    servicios: JSON.stringify(servicios)
                });
            } catch (error) {
                console.error("Error saving to Firebase:", error);
                alert("Error al guardar en la nube. Los datos se guardaron localmente.");
            }
        };
    </script>
</html>`;

html = html.replace('</html>', cdnScript);
fs.writeFileSync('index.html', html);
console.log('index.html updated with CDN script');
