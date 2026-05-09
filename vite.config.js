import { defineConfig } from "vite";

export default defineConfig(({ command, mode }) => {
  const isProd = mode === "production";

  return {
    server: {
      open: true,
      host: true,
      port: 5173,
    },
    base: isProd ? "/Frontend-Mentor-Todo-app/" : "/",
  };
});
