// Handler for login button
const loginHandler = async (e) => {
    e.preventDefault();

    // Grabs text input
    const username_email = document.querySelector('#login-username').value.trim();
    const password = document.querySelector('#login-password').value.trim();

    // Checks for non-empty input
    if (username_email && password) {
        // Sends a login request to server
        const res = await fetch("/api/users/login", {
            method: "POST",
            body: JSON.stringify({ username_email, password }),
            headers: { "Content-Type": "application/json" }
        });

        // Redirects to homepage if successful
        if (res.ok) {
            document.location.replace("/");
        } else {
            // Otherwise, display error message from the server on the page
            const body = await res.json();
            const status = document.getElementById("status");
            status.innerHTML = `
            <div>
                <p>${body.message}</p>
            </div>`;
        }
    }
};

// Event listener for login button
document.querySelector('#login-btn').addEventListener('click', loginHandler);