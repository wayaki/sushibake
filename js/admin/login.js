import {
  supabase
} from "../supabase-config.js";


async function handleLogin() {
  const email =
    document.getElementById(
      "admin-email"
    ).value.trim();

  const password =
    document.getElementById(
      "admin-password"
    ).value;

  const message =
    document.getElementById(
      "login-message"
    );

  message.textContent = "";

  if (!email || !password) {
    message.textContent =
      "Please enter your email and password.";

    return;
  }

  const {
    data,
    error
  } =
    await supabase.auth
      .signInWithPassword({
        email,
        password
      });

  if (error) {
    console.error(
      "Login error:",
      error
    );

    message.textContent =
      error.message ||
      "Unable to log in.";

    return;
  }

  if (!data.session) {
    message.textContent =
      "Unable to start admin session.";

    return;
  }

  window.location.href =
    "./orders.html";
}


document.addEventListener(
  "DOMContentLoaded",
  async () => {
    const loginButton =
      document.getElementById(
        "admin-login-btn"
      );

    const passwordInput =
      document.getElementById(
        "admin-password"
      );

    loginButton?.addEventListener(
      "click",
      handleLogin
    );

    passwordInput?.addEventListener(
      "keydown",
      (event) => {
        if (event.key === "Enter") {
          handleLogin();
        }
      }
    );

    const {
      data: {
        session
      }
    } =
      await supabase.auth.getSession();

    if (session) {
      window.location.href =
        "./orders.html";
    }
  }
);