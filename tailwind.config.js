/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class",
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Roboto"', 'sans-serif'], // hoặc Roboto, Poppins, v.v.
            },
        },
    },
    plugins: [],
};
