"use client";
import { useEffect } from "react";

export default function HtmlThemeSync() {
  useEffect(() => {
    const theme = localStorage.getItem("theme") || "system";
    const html = document.documentElement;
    if (
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      html.classList.add("dark");
      html.style.colorScheme = "dark";
    } else {
      html.classList.remove("dark");
      html.style.colorScheme = "light";
    }
  }, []);
  return null;
}
