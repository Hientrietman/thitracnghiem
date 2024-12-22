import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
    plugins: [react()],
    server: {
        host: '0.0.0.0', // Thay vì true, dùng '0.0.0.0' để đảm bảo bind đến tất cả các network interfaces
        port: 3000,
        watch: {
            usePolling: true
        },
        proxy: {
            '/api': {
                target: 'http://backend:8080',
                changeOrigin: true,
                secure: false // Thêm option này để tránh các vấn đề với HTTPS
            },
        },
    },
});