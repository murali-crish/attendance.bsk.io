import { defineConfig } from "vite";

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                parent: 'parent-app/index.html',
                teacher: 'teacher-app/index.html',
            }
        }
    }
});