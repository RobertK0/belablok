export function initTheme(): void {
  // Check if we're in a browser environment
  if (
    typeof window === "undefined" ||
    typeof document === "undefined" ||
    typeof localStorage === "undefined"
  ) {
    return;
  }

  // Get saved theme or detect system preference
  const savedTheme = localStorage.getItem("theme");

  let theme: "light" | "dark";

  if (savedTheme === "light" || savedTheme === "dark") {
    theme = savedTheme;
  } else {
    // Detect system preference
    theme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    localStorage.setItem("theme", theme);
  }

  // Apply theme immediately to prevent flash
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(theme);
}
