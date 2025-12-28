import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
	darkMode: "class",
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(8, 100%, 98%)', // #fff9f8
					foreground: 'hsl(14, 25%, 26%)', // #533932 (text-muted equivalent)
					primary: 'hsl(14, 85%, 50%)', // #ec4913
					'primary-foreground': 'hsl(0, 0%, 100%)',
					accent: 'hsl(14, 100%, 96%)', // #fff0eb
					'accent-foreground': 'hsl(14, 85%, 50%)',
					border: 'hsl(14, 30%, 92%)', // #f2e8e5
					ring: 'hsl(14, 85%, 50%)',
				},
				primary: {
					DEFAULT: 'hsl(14, 85%, 50%)', // #ec4913
					foreground: 'hsl(0, 0%, 100%)', // #ffffff
				},
				secondary: {
					DEFAULT: 'hsl(14, 100%, 97%)', // #fff2ef
					foreground: 'hsl(14, 85%, 50%)',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			}
		}
	},
	plugins: [tailwindcssAnimate],
};
export default config;
