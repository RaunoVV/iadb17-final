import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// export default defineConfig(({mode}) => {
//     plugins: [react()],
//     optimizeDeps: {
//         exclude: [], // Exclude react-native from Vite's dependency optimization
//     },
//     build: {
//         target: "es2022", // or 'esnext'
//         rollupOptions: {
//             external: [], // Exclude react-native from the bundle
//         },
//     },
// });
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    return {
        define: {
            "process.env.USE_MOCK": JSON.stringify(env.USE_MOCK),
        },
        plugins: [react()],
        build: {
            target: "es2022", // or 'esnext'
            rollupOptions: {
                external: [], // Exclude react-native from the bundle
            },
        },
    };
});
