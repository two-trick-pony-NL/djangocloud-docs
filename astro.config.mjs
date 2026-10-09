// @ts-check
import { readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// Where the site is served. The defaults are the GitHub Pages project address; with a custom domain such as
// docs.djangocloud.dev set DOCS_SITE=https://docs.djangocloud.dev and DOCS_BASE=/ (see README.md).
const site = process.env.DOCS_SITE || 'https://two-trick-pony-nl.github.io';
const base = process.env.DOCS_BASE || '/djangocloud-docs';

// The sidebar follows the old SUMMARY.md: sections and their pages, in order.
const sidebar = JSON.parse(readFileSync(new URL('./sidebar.json', import.meta.url), 'utf-8'));

// https://astro.build/config
export default defineConfig({
	site,
	base,
	integrations: [
		starlight({
			title: 'DjangoCloud',
			description: 'Deploy your Django project to AWS with one command.',
			logo: { src: './src/assets/logo.png', alt: 'DjangoCloud' },
			favicon: '/favicon.svg',
			customCss: ['./src/styles/custom.css'],
			// Dark on a first visit, like the website; whoever picks light keeps it (Starlight remembers the choice).
			head: [
				{
					tag: 'script',
					content: "try{if(!localStorage.getItem('starlight-theme')){localStorage.setItem('starlight-theme','dark');document.documentElement.dataset.theme='dark'}}catch(e){}",
				},
			],
			sidebar,
		}),
	],
});
