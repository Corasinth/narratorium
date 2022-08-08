const loginHandler = async (e) => {
  e.preventDefault();

  const username_email = document.querySelector('#login-username').value.trim();
  const password = document.querySelector('#login-password').value.trim();

  if(username_email && password) {
    const res = await fetch("/api/users/login", {
      method: "POST",
      body: JSON.stringify({username_email, password}),
      headers: {"Content-Type": "application/json"}
    });
    console.log(res);

    if(res.ok) {
      document.location.replace("/");
    } else {
      const body = await res.json();
      const status = document.getElementById("status");
      status.innerHTML = `<div>
      <p>${body.message}</p>
    </div>`
    }
  }
  document.getElementById('submit').disabled = false;
  document.getElementById('delete').disabled = false;
}

document.querySelector('#login-form').addEventListener('click', loginHandler);