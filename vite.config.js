import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  base: "https://jswest.github.io/after-ross",
  plugins: [sveltekit()],
});
