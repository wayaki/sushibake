import {
  supabase
} from "./supabase-config.js";

document.addEventListener(
  "DOMContentLoaded",
  initialisePage
);

function initialisePage() {
  const testButton =
    document.getElementById(
      "test-supabase-btn"
    );

  testButton?.addEventListener(
    "click",
    testSupabaseFunction
  );
}

async function testSupabaseFunction() {
  const resultElement =
    document.getElementById(
      "test-result"
    );

  resultElement.textContent =
    "Testing...";

  try {
    const {
      data,
      error
    } = await supabase.functions.invoke(
      "sg61-spin"
    );

    if (error) {
      throw error;
    }

    console.log(
      "Edge Function response:",
      data
    );

    resultElement.textContent =
      data.message;
  } catch (error) {
    console.error(
      "Supabase test failed:",
      error
    );

    resultElement.textContent =
      `Error: ${error.message}`;
  }
}