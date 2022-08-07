const signupHandler = async (e) => {
  e.preventDefault();

  const username = document.querySelector('#signup-username').value.trim();
  const email = document.querySelector('#signup-email').value.trim();
  const password = document.querySelector('#signup-password').value.trim();
  const confirmPassword = document.querySelector('#signup-confirm').value.trim();
  const status = document.getElementById("status");

  if(!(password === confirmPassword)) {
      status.innerHTML = `<div>
      <p>Passwords don't match</p>
    </div>`
    return;
  }

  if(username && email && password && confirmPassword) {
    const currentDate = Date.now()
    console.log(currentDate)
    const res = await fetch("/api/users/", {
      method: "POST",
      body: JSON.stringify({username, email, password, character_limit:100, delete_limit:10, last_logged_in:currentDate}),
      headers: {"Content-Type": "application/json"}
    });
    console.log(res);

    if(res.ok) {
      document.location.replace("/");
    } else {
      const body = await res.json();
      console.log(body)
      if(body.name === "SequelizeUniqueConstraintError") {
        status.innerHTML = `
        <div>
          <p>"${body.errors[0].value}" is already taken</p>
        </div>`
        return;
      } else if(body.name === "SequelizeValidationError") {
        status.innerHTML = `
        <div>
          <p>"${body.errors[0].value}" is not valid</p>
        </div>`
        return;
      }
      
    }
  }
}

document.querySelector('#signup-btn').addEventListener('click', signupHandler);