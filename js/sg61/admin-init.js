import {
  supabase
} from "./supabase-config.js";

import {
  loginAdmin,
  addBonusSpin,
  loadBonusSpins,
  loadRewards,
  filterRewards
} from "./admin-spin.js";


// ================================================
// Display helpers
// ================================================

function showDashboard() {
  const loginSection =
    document.getElementById(
      "admin-login"
    );

  const dashboard =
    document.getElementById(
      "admin-dashboard"
    );

  loginSection?.classList.add(
    "hidden"
  );

  dashboard?.classList.remove(
    "hidden"
  );
}


function showLogin() {
  const loginSection =
    document.getElementById(
      "admin-login"
    );

  const dashboard =
    document.getElementById(
      "admin-dashboard"
    );

  loginSection?.classList.remove(
    "hidden"
  );

  dashboard?.classList.add(
    "hidden"
  );
}


// ================================================
// Load dashboard data
// ================================================

async function loadDashboard() {
  await Promise.all([
    loadBonusSpins(),
    loadRewards()
  ]);
}


// ================================================
// Handle login
// ================================================

async function handleLogin() {
  const success =
    await loginAdmin();

  if (!success) {
    return;
  }

  showDashboard();

  await loadDashboard();
}


// ================================================
// Handle logout
// ================================================

async function handleLogout() {
  const {
    error
  } = await supabase.auth.signOut();

  if (error) {
    console.error(
      "Logout error:",
      error
    );

    alert(
      error.message ||
      "Unable to log out."
    );

    return;
  }

  showLogin();
}


// ================================================
// Initialise admin page
// ================================================

document.addEventListener(
  "DOMContentLoaded",
  async () => {
    console.log(
      "WAYAKI admin page loaded."
    );

    const loginButton =
      document.getElementById(
        "admin-login-btn"
      );

    const logoutButton =
      document.getElementById(
        "admin-logout-btn"
      );

    const passwordInput =
      document.getElementById(
        "admin-password"
      );

    const addBonusButton =
      document.getElementById(
        "add-bonus-btn"
      );

    const refreshBonusButton =
      document.getElementById(
        "refresh-bonus-btn"
      );

    const refreshRewardsButton =
      document.getElementById(
        "refresh-rewards-btn"
      );

    const rewardSearch =
      document.getElementById(
        "reward-search"
      );

    loginButton?.addEventListener(
      "click",
      handleLogin
    );

    logoutButton?.addEventListener(
      "click",
      handleLogout
    );

    passwordInput?.addEventListener(
      "keydown",
      (event) => {
        if (event.key === "Enter") {
          handleLogin();
        }
      }
    );

    addBonusButton?.addEventListener(
      "click",
      addBonusSpin
    );

    refreshBonusButton
      ?.addEventListener(
        "click",
        loadBonusSpins
      );

    refreshRewardsButton
      ?.addEventListener(
        "click",
        loadRewards
      );

    rewardSearch?.addEventListener(
      "input",
      filterRewards
    );

    try {
      const {
        data: {
          session
        },
        error
      } =
        await supabase.auth
          .getSession();

      if (error) {
        throw error;
      }

      if (session) {
        showDashboard();

        await loadDashboard();
      } else {
        showLogin();
      }
    } catch (error) {
      console.error(
        "Session check error:",
        error
      );

      showLogin();
    }
  }
);