import {
  supabase
} from "../supabase-config.js";


// ================================================
// REQUIRE ADMIN
// Redirect to login if no session exists
// ================================================

export async function requireAdmin() {
  const {
    data: {
      session
    },
    error
  } =
    await supabase.auth.getSession();

  if (error) {
    console.error(
      "Session check error:",
      error
    );

    window.location.href =
      "../admin/login.html";

    return null;
  }

  if (!session) {
    window.location.href =
      "../admin/login.html";

    return null;
  }

  return session;
}


// ================================================
// LOG OUT ADMIN
// ================================================

export async function logoutAdmin() {
  const {
    error
  } =
    await supabase.auth.signOut();

  if (error) {
    console.error(
      "Logout error:",
      error
    );

    throw error;
  }

  window.location.href =
    "../admin/login.html";
}