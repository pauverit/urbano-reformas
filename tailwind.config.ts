import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    primary: "#0f172a",
                    accent: "#2563eb",
                    gray: "#f8fafc",
                },
            },
            fontFamily: {
                sans: ["Inter", "Outfit", "system-ui", "sans-serif"],
            },
            animation: {
                'fade-in': 'fade-in 0.7s ease-out',
                'slide-up': 'slide-up 0.7s ease-out',
            },
            keyframes: {
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'slide-up': {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [],
};
export default config;
