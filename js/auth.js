let users = [];

async function register(e) {
  e.preventDefault();
  let nameInput = document.querySelector('input[name="register-name"]'),
    usernameInput = document.querySelector('input[name="register-username"]'),
    passwordInput = document.querySelector('input[name="register-password"]');

  if (localStorage.users) {
    let existingUsernames = [];
    const storedUsers = JSON.parse(localStorage.users);
    users = [...storedUsers];

    storedUsers.map((storedUser) => {
      existingUsernames.push(storedUser.username);
    });

    if (existingUsernames.includes(usernameInput.value)) {
      usernameInput.style.borderColor = "#f43f5e";
      document.querySelector(".error-msg").classList.add("show");
    } else {
      const { encoded: hashedPassword } = await argon2.hash({
        pass: passwordInput.value,
        salt: "thisismysalt",
      });

      const user = {
        id: users.length + 1,
        name: nameInput.value,
        username: usernameInput.value,
        password: hashedPassword,
      };

      users.push(user);

      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("loggedUser", JSON.stringify(user));
      window.location.href = "/home.html";
    }
  } else {
    // no item in localstorage which means this is the first user
    const { encoded: hashedPassword } = await argon2.hash({
      pass: passwordInput.value,
      salt: "thisismysalt",
    });

    const user = {
      id: 1,
      name: nameInput.value,
      username: usernameInput.value,
      password: hashedPassword,
    };

    users.push(user);

    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("loggedUser", JSON.stringify(user));
    window.location.href = "/home.html";
  }
}

function login(e) {
  e.preventDefault();
  let usernameInput = document.querySelector('input[name="login-username"]'),
    passwordInput = document.querySelector('input[name="login-password"]');

  const storedUsers = JSON.parse(localStorage.users);
  const userObj = storedUsers.find((storedUser) => storedUser.username === usernameInput.value);

  if (!userObj) {
    usernameInput.style.borderColor = "#f43f5e";
    document.querySelector(".error-msg.username").classList.add("show");
  } else {
    usernameInput.style.borderColor = "var(--gray-300)";
    document.querySelector(".error-msg.username").classList.remove("show");
    argon2
      .verify({
        pass: passwordInput.value,
        encoded: userObj.password,
      })
      .then(() => {
        localStorage.setItem("loggedUser", JSON.stringify(userObj));
        window.location.href = "/home.html";
      })
      .catch(() => {
        passwordInput.style.borderColor = "#f43f5e";
        document.querySelector(".error-msg.password").classList.add("show");
      });
  }
}

function logout() {
  localStorage.removeItem("loggedUser");
  window.location.href = "/login.html";
}

function getLoggedInUser() {
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

  return loggedUser;
}
