/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: '#7360DF',
				secondary: '#F9FAFB',
				accent: '#F9FAFB',
				'dark-primary': '#040D12'
			}
		}
	},
	plugins: []
};
