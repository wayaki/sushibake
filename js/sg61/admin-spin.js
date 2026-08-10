import {
  supabase
} from "../supabase-config.js";


// ================================================
// Shared data
// ================================================

let allRewards = [];


// ================================================
// Helper functions
// ================================================

function normalizePhone(phone) {
  return String(phone || "")
    .replace(/\D/g, "");
}


function isValidPhone(phone) {
  return /^[689]\d{7}$/.test(phone);
}


function escapeHtml(value) {
  const element =
    document.createElement("div");

  element.textContent =
    String(value ?? "");

  return element.innerHTML;
}


function formatAdminDate(value) {
  if (!value) {
    return "—";
  }

  return new Date(value)
    .toLocaleString("en-SG", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
}


// ================================================
// Admin login
// ================================================

export async function loginAdmin() {
  const emailInput =
    document.getElementById(
      "admin-email"
    );

  const passwordInput =
    document.getElementById(
      "admin-password"
    );

  const button =
    document.getElementById(
      "admin-login-btn"
    );

  const message =
    document.getElementById(
      "login-message"
    );

  if (
    !emailInput ||
    !passwordInput ||
    !button ||
    !message
  ) {
    console.error(
      "Admin login elements are missing."
    );

    return false;
  }

  const email =
    emailInput.value.trim();

  const password =
    passwordInput.value;

  if (!email || !password) {
    message.textContent =
      "Please enter your email and password.";

    message.className =
      "admin-message is-error";

    return false;
  }

  button.disabled = true;
  button.textContent =
    "Logging In...";

  message.textContent = "";
  message.className =
    "admin-message";

  try {
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
      throw error;
    }

    if (!data.session) {
      throw new Error(
        "No login session was created."
      );
    }

    message.textContent = "";
    message.className =
      "admin-message";

    return true;
  } catch (error) {
    console.error(
      "Admin login error:",
      error
    );

    message.textContent =
      error.message ||
      "Unable to log in.";

    message.className =
      "admin-message is-error";

    return false;
  } finally {
    button.disabled = false;
    button.textContent =
      "Log In";
  }
}


// ================================================
// Add bonus spin
// ================================================

export async function addBonusSpin() {
  const phoneInput =
    document.getElementById(
      "bonus-phone"
    );

  const dateInput =
    document.getElementById(
      "bonus-date"
    );

  const button =
    document.getElementById(
      "add-bonus-btn"
    );

  const message =
    document.getElementById(
      "bonus-message"
    );

  if (
    !phoneInput ||
    !dateInput ||
    !button ||
    !message
  ) {
    console.error(
      "Bonus-spin form elements are missing."
    );

    return;
  }

  const phone =
    normalizePhone(
      phoneInput.value
    );

  const deliveryDate =
    dateInput.value;

  if (!isValidPhone(phone)) {
    message.textContent =
      "Enter a valid 8-digit mobile number.";

    message.className =
      "admin-message is-error";

    return;
  }

  if (!deliveryDate) {
    message.textContent =
      "Select a delivery date.";

    message.className =
      "admin-message is-error";

    return;
  }

  button.disabled = true;
  button.textContent =
    "Adding...";

  message.textContent =
    "Adding bonus spin...";

  message.className =
    "admin-message";

  try {
    const {
      error
    } = await supabase.rpc(
      "admin_add_bonus_spin",
      {
        target_phone: phone,
        target_delivery_date:
          deliveryDate
      }
    );

    if (error) {
      throw error;
    }

    message.textContent =
      `Bonus spin added for ${phone} on ${deliveryDate}.`;

    message.className =
      "admin-message is-success";

    phoneInput.value = "";
    dateInput.value = "";

    await loadBonusSpins();
  } catch (error) {
    console.error(
      "Add bonus spin error:",
      error
    );

    message.textContent =
      error.message ||
      "Unable to add bonus spin.";

    message.className =
      "admin-message is-error";
  } finally {
    button.disabled = false;
    button.textContent =
      "Add Bonus Spin";
  }
}


// ================================================
// Load bonus spins
// ================================================

export async function loadBonusSpins() {
  const tbody =
    document.getElementById(
      "bonus-body"
    );

  if (!tbody) {
    console.error(
      "Bonus-spin table body was not found."
    );

    return;
  }

  tbody.innerHTML = `
    <tr>
      <td colspan="4">
        Loading...
      </td>
    </tr>
  `;

  try {
    const {
      data,
      error
    } = await supabase
      .from("sg61_bonus_spins")
      .select(`
        id,
        phone,
        delivery_date,
        used,
        created_at,
        used_at
      `)
      .order("delivery_date", {
        ascending: false
      })
      .order("created_at", {
        ascending: false
      });

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4">
            No bonus spins found.
          </td>
        </tr>
      `;

      return;
    }

    tbody.innerHTML =
      data
        .map((spin) => {
          const status =
            spin.used
              ? "Used"
              : "Available";

          return `
            <tr>
              <td>
                ${escapeHtml(
                  spin.phone
                )}
              </td>

              <td>
                ${escapeHtml(
                  spin.delivery_date
                )}
              </td>

              <td>
                ${status}
              </td>

              <td>
                ${formatAdminDate(
                  spin.created_at
                )}
              </td>
            </tr>
          `;
        })
        .join("");
  } catch (error) {
    console.error(
      "Load bonus spins error:",
      error
    );

    tbody.innerHTML = `
      <tr>
        <td colspan="4">
          Unable to load bonus spins.
        </td>
      </tr>
    `;
  }
}


// ================================================
// Load rewards
// ================================================

export async function loadRewards() {
  const tbody =
    document.getElementById(
      "rewards-body"
    );

  if (!tbody) {
    console.error(
      "Rewards table body was not found."
    );

    return;
  }

  tbody.innerHTML = `
    <tr>
      <td colspan="7">
        Loading...
      </td>
    </tr>
  `;

  try {
    const {
      data,
      error
    } = await supabase
      .from("sg61_rewards")
      .select(`
        id,
        phone,
        spin_type,
        prize_id,
        prize_label,
        reward_code,
        delivery_date,
        redeemed,
        created_at,
        redeemed_at
      `)
      .order("created_at", {
        ascending: false
      });

    console.log("Rewards data:", data);
    console.log("Rewards error:", error);

    if (error) {
      throw error;
    }

    allRewards =
      Array.isArray(data)
        ? data
        : [];

    drawRewards(allRewards);
  } catch (error) {
    console.error(
      "Load rewards error:",
      error
    );

    tbody.innerHTML = `
      <tr>
        <td colspan="7">
          Unable to load rewards.
        </td>
      </tr>
    `;
  }
}


// ================================================
// Draw rewards table
// ================================================

function drawRewards(rewards) {
  const tbody =
    document.getElementById(
      "rewards-body"
    );

  if (!tbody) {
    return;
  }

  if (!rewards.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7">
          No rewards found.
        </td>
      </tr>
    `;

    return;
  }

  tbody.innerHTML =
    rewards
      .map((reward) => {
        const status =
          reward.redeemed
            ? "Redeemed"
            : "Available";

        const actionText =
          reward.redeemed
            ? "Undo"
            : "Redeem";

        const deliveryDate =
          reward.delivery_date
            ? escapeHtml(
                reward.delivery_date
              )
            : "—";

        return `
          <tr>
            <td>
              ${escapeHtml(
                reward.phone
              )}
            </td>

            <td>
              ${escapeHtml(
                reward.prize_label
              )}
            </td>

            <td>
              ${escapeHtml(
                reward.reward_code
              )}
            </td>

            <td>
              ${escapeHtml(
                reward.spin_type
              )}
            </td>

            <td>
              ${deliveryDate}
            </td>

            <td>
              ${status}
            </td>

            <td>
              <button
                type="button"
                class="reward-action-btn"
                data-reward-id="${reward.id}"
                data-redeemed="${reward.redeemed}"
              >
                ${actionText}
              </button>
            </td>
          </tr>
        `;
      })
      .join("");

  attachRewardActions();
}


// ================================================
// Update reward status
// ================================================

async function updateRewardStatus(
  rewardId,
  redeemed
) {
  try {
    const {
      error
    } = await supabase
      .from("sg61_rewards")
      .update({
        redeemed,
        redeemed_at:
          redeemed
            ? new Date().toISOString()
            : null
      })
      .eq("id", rewardId);

    if (error) {
      throw error;
    }

    await loadRewards();
  } catch (error) {
    console.error(
      "Update reward error:",
      error
    );

    alert(
      error.message ||
      "Unable to update reward."
    );
  }
}


// ================================================
// Connect reward action buttons
// ================================================

function attachRewardActions() {
  const buttons =
    document.querySelectorAll(
      ".reward-action-btn"
    );

  buttons.forEach((button) => {
    button.addEventListener(
      "click",
      async () => {
        const rewardId =
          Number(
            button.dataset.rewardId
          );

        const currentlyRedeemed =
          button.dataset.redeemed ===
          "true";

        if (
          !Number.isInteger(rewardId)
        ) {
          console.error(
            "Invalid reward ID."
          );

          return;
        }

        button.disabled = true;

        await updateRewardStatus(
          rewardId,
          !currentlyRedeemed
        );
      }
    );
  });
}


// ================================================
// Filter rewards
// ================================================

export function filterRewards() {
  const searchInput =
    document.getElementById(
      "reward-search"
    );

  if (!searchInput) {
    return;
  }

  const query =
    searchInput.value
      .trim()
      .toLowerCase();

  if (!query) {
    drawRewards(allRewards);
    return;
  }

  const filtered =
    allRewards.filter((reward) => {
      const searchableValues = [
        reward.phone,
        reward.prize_label,
        reward.reward_code,
        reward.spin_type,
        reward.delivery_date,
        reward.redeemed
          ? "redeemed"
          : "available"
      ];

      return searchableValues.some(
        (value) => {
          return String(value || "")
            .toLowerCase()
            .includes(query);
        }
      );
    });

  drawRewards(filtered);
}