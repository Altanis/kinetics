/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/**/*.{js,jsx,ts,tsx}",
	],
	theme: {
		extend: {
			colors: {
				"accent": "#f43f5e"
			}
		},
		fontFamily: {
			"mono": ["JetBrains Mono", "Fira Code", "Menlo", "Monaco", "monospace"],
		}
	},
	plugins: [],
};