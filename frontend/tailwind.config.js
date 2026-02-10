/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            // Extending with the requested color palette if needed, 
            // but standard slate/blue/green/red exist in default theme.
        },
    },
    plugins: [],
}
