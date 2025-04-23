import type {Config} from "tailwindcss";
// import colors from "tailwindcss/colors";

export default {
    darkMode: "selector",
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {}
    },
    plugins: [],
} satisfies Config;
