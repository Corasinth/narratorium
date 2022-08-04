const signupHandler = async (e) => {
  e.preventDefault();

  const username = document.querySelector('#signup-username').value.trim();
  const password = document.querySelector('#signup-password').value.trim();
  const confirmPassword = document.querySelector('#signup-confirm').value.trim();

  if(!(password === confirmPassword)) {
    const status = document.getElementById("status");
      status.innerHTML = `<div class="row p-2 bg-danger m-3 rounded">
      <p>Passwords don't match</p>
    </div>`
  }

  if(username && password) {
    const res = await fetch("/api/users/", {
      method: "POST",
      body: JSON.stringify({username, password}),
      headers: {"Content-Type": "application/json"}
    });
    console.log(res);

    if(res.ok) {
      document.location.replace("/");
    } else {
      console.log(res);
    }
  }
}

document.querySelector('#signup-form').addEventListener('submit', signupHandler);