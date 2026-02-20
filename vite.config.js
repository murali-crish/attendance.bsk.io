import { defineConfig } from "vite";

export default defineConfig({
    base: '/attendance.bsk.io/',
    build: {
        rollupOptions: {
            input: {
                parent: 'parent-app/index.html',
                teacher: 'teacher-app/index.html',
            }
        }
    }
});