/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'electric-blue': '#007BFF',
                'gym-black': '#121212',
                'gym-gray': '#F5F5F7',
            },
            fontFamily: {
                'sans': ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
