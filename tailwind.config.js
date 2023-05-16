/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                current: {
                    500: "#faa200",
                },
            },
            fontFamily: {
                main: ["Montserrat", "sans-serif"],
            },
        },
    },
    plugins: [],
};
