/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		colors: {
			transparent: 'transparent',
			current: 'currentColor',
			black: colors.black,
			white: colors.white,
			gray: colors.neutral,
			red: colors.red,
			yellow: colors.amber,
			green: colors.green,
			blue: colors.blue,
			indigo: colors.indigo,
			purple: colors.purple,
		},
		extend: {},
	},
	plugins: [
		require('@tailwindcss/typography')
	],
}
