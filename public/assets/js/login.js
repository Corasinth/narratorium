const loginHandler = async (e) => {
  e.preventDefault();

  const username = document.querySelector('#login-username').value.trim();
  const password = document.querySelector('#login-password').value.trim();

  if(username && password) {
    const res = await fetch("/api/users/login", {
      method: "POST",
      body: JSON.stringify({username, password}),
      headers: {"Content-Type": "application/json"}
    });
    console.log(res);

    if(res.ok) {
      document.location.replace("/");
    } else {
      const status = document.getElementById("status");
      status.innerHTML = `<div class="row p-2 bg-danger m-3 rounded">
      <p>Invalid username or password</p>
    </div>`
    }
  }
}

document.querySelector('#login-form').addEventListener('submit', loginHandler);