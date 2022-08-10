// Handler for signup button
const signupHandler = async (e) => {
    e.preventDefault();

    // Grabs input text and 'status' element
    const username = document.querySelector('#signup-username').value.trim();
    const email = document.querySelector('#signup-email').value.trim();
    const password = document.querySelector('#signup-password').value.trim();
    const confirmPassword = document.querySelector('#signup-confirm').value.trim();
    const status = document.getElementById("status");

    // Checks if password is entered correctly
    if (password !== confirmPassword) {
        status.innerHTML = `
        <div>
          <p>Passwords don't match</p>
        </div>`;
        return;
    }

    // Checks for non-empty input
    if (username && email && password && confirmPassword) {
        // Gets current date
        const currentDate = Date.now();

        // Sends a POST request to the server to create a new user and login
        const res = await fetch("/api/users/", {
            method: "POST",
            body: JSON.stringify({ username, email, password, character_limit: 100, delete_limit: 10, last_logged_in: currentDate }),
            headers: { "Content-Type": "application/json" }
        });

        // Redirects to homepage if successful
        if (res.ok) {
            document.location.replace("/");
        } else {
            // Otherwise, handle Sequelize errors and display error message to the page
            const body = await res.json();
            if (body.name === "SequelizeUniqueConstraintError") {
                status.innerHTML = `
                <div>
                  <p>"${body.errors[0].value}" is already taken</p>
                </div>`;
                return;
            } else if (body.name === "SequelizeValidationError") {
                status.innerHTML = `
                <div>
                  <p>"${body.errors[0].value}" is not valid</p>
                </div>`;
                return;
            }
        }
    }
};

// Event listener for signup button
document.querySelector('#signup-btn').addEventListener('click', signupHandler);