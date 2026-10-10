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

// Analytics, the same two tools as the website. Both are optional build-time settings (repository variables in the
// deploy workflow): without a value that script is simply left out. Mixpanel project tokens are public by design.
const clarityId = process.env.CLARITY_PROJECT_ID || '';
const mixpanelToken = process.env.MIXPANEL_TOKEN || '';
const mixpanelHost = process.env.MIXPANEL_API_HOST || 'https://api-eu.mixpanel.com';
const mixpanelLoader = readFileSync(new URL('./src/analytics-mixpanel-loader.js', import.meta.url), 'utf-8');

const analytics = [];
if (clarityId) {
	analytics.push({
		tag: 'script',
		content: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script",${JSON.stringify(clarityId)});`,
	});
}
if (mixpanelToken) {
	analytics.push({ tag: 'script', content: mixpanelLoader });
	analytics.push({
		tag: 'script',
		content: `mixpanel.init(${JSON.stringify(mixpanelToken)},{api_host:${JSON.stringify(mixpanelHost)},autocapture:true,record_sessions_percent:100,track_pageview:true,persistence:"localStorage"});`,
	});
}

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
				...analytics,
			],
			sidebar,
		}),
	],
});
