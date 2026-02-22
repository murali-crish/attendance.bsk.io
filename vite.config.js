import { defineConfig } from "vite";

export default defineConfig({
    base: '/attendance.bsk.io/',
    build: {
        rollupOptions: {
            input: {
                parent: 'parent/index.html',
                teacher: 'teacher/index.html',
            }
        }
    }
});