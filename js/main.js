document.addEventListener("DOMContentLoaded", function () {
    // Update header on page load
    updateHeader();

    // "Login" button in header
    document.addEventListener('click', function(e) {
        if(e.target && e.target.id === 'loginHeaderBtn') {
            e.preventDefault();
            showLoginModal();
        }
    });

    // Close modal buttons
    document.querySelector(".closeLogin")?.addEventListener("click", function () {
        document.getElementById("modal").style.display = "none";
    });

    document.querySelector(".closeRegister")?.addEventListener("click", function () {
        document.getElementById("modal").style.display = "none";
    });

    // Toggle between login and register forms
    const registerToggleBtn = document.getElementById("registerBtn");
    const loginToggleBtn = document.getElementById("loginBtn");
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    function switchForms(hideForm, showForm) {
        hideForm.classList.add("flip-out-hor-top");
        hideForm.addEventListener("animationend", function onAnimationEnd() {
            hideForm.classList.remove("flip-out-hor-top");
            hideForm.style.display = "none";
            showForm.style.display = "block";
            showForm.classList.add("flip-in-hor-bottom");
            showForm.addEventListener("animationend", function onShowAnimationEnd() {
                showForm.classList.remove("flip-in-hor-bottom");
                showForm.removeEventListener("animationend", onShowAnimationEnd);
            });
            hideForm.removeEventListener("animationend", onAnimationEnd);
        });
    }

    registerToggleBtn.addEventListener("click", function () {
        switchForms(loginForm, registerForm);
    });

    loginToggleBtn.addEventListener("click", function () {
        switchForms(registerForm, loginForm);
    });

    // Login submit button
    document.getElementById("btnLoginSubmit").addEventListener("click", handleLogin);

    // Register submit button (placeholder)
    document.getElementById("btnRegisterSubmit")?.addEventListener("click", function() {
        const userCode = document.getElementById("registerCode").value;
        const password = document.getElementById("registerPassword").value;
        const confirmPassword = document.getElementById("registerConfirmPassword").value;
        const email = document.getElementById("registerEmail").value;
        const firstName = document.getElementById("registerName").value;
        const lastName = document.getElementById("registerLastName").value;

        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }
        registerStudent(userCode, password, email, firstName, lastName);
    });
});

function showLoginModal() {
    document.getElementById("modal").style.display = "flex";
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("registerForm").style.display = "none";
}

async function handleLogin() {
    const userCode = document.getElementById("userInput").value;
    const password = document.getElementById("passwordInput").value;

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ codigo: userCode, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Credenciales inválidas");
        }

        // Save to localStorage
        localStorage.setItem("userType", data.user.id_tipo_usuario);
        localStorage.setItem("username", data.user.nombre);
        localStorage.setItem("userCode", data.user.codigo);

        // Close modal and update header
        document.getElementById("modal").style.display = "none";
        updateHeader();

    } catch (err) {
        console.error("Login error:", err);
        alert(err.message || "Error del servidor");
    }

    // Reset input fields
    resetInputFields();
}

async function registerStudent(userCode, password, email, firstName, lastName) {
    try{
        const response = await fetch("/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                codigo: userCode,
                correo: email,
                password: password,
                nombre: firstName,
                apellido: lastName,
                tipo_usuario: 2
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Error en el registro");
        }

        alert("Registro exitoso. Puedes iniciar sesión ahora.");
        document.getElementById("modal").style.display = "none";
    }catch (err) {
        console.error("Registro error:", err);
        alert(err.message || "Error del servidor");
    }

    // Close modal and update header
    document.getElementById("modal").style.display = "none";
    updateHeader();
    resetInputFields();
}

function updateHeader() {
    const header = document.querySelector("header");
    const userType = localStorage.getItem("userType") || "guest";

    let headerContent = `
    <div id="logoContainer">
        <img id="logo" src="resources/img/logo-umagdalena.svg" alt="Institution Logo">
    </div>
    <div id="institutionNameContainer">
        <h2 id="institutionName">UNIVERSIDAD DEL MAGDALENA</h2>
    </div>
    `;

    if (userType === "guest") {
        headerContent += `
        <div id="loginBtnContainer">
            <button id="loginHeaderBtn" class="button-header">Ingresar</button>
        </div>
        `;
    } else {
        const username = localStorage.getItem("username") || "Usuario";
        headerContent += `
        <div id="userSection" class="user-header">
            <button id="myEventsBtn" class="button-header">Mis Eventos</button>
        `;

        if (userType === "1") {
            headerContent += `<button id="createEventBtn" class="button-header">Crear Evento</button>`;
        }

        headerContent += `
            <button id="logoutBtn" class="button-header">Cerrar Sesión</button>
            <img src="./resources/img/user-solid.svg" alt="Profile Picture" id="userPic">
        </div>
        `;
    }

    header.innerHTML = headerContent;

    // Reattach event listeners
    document.getElementById("logoutBtn")?.addEventListener("click", handleLogout);
    document.getElementById("loginHeaderBtn")?.addEventListener("click", function(e) {
        e.preventDefault();
        showLoginModal();
    });
}

function resetInputFields() {
    document.getElementById("userInput").value = "";
    document.getElementById("passwordInput").value = "";
    document.getElementById("registerCode").value = "";
    document.getElementById("registerPassword").value = "";
    document.getElementById("registerConfirmPassword").value = "";
    document.getElementById("registerEmail").value = "";
    document.getElementById("registerName").value = "";
    document.getElementById("registerLastName").value = "";
}

function handleLogout() {
    localStorage.removeItem("userType");
    localStorage.removeItem("username");
    localStorage.removeItem("userCode");
    updateHeader();
}
