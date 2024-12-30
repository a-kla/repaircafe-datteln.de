// import { PUBLIC_SITE_NAME } from '$env/static/public';
import { testWebsite, defaultConfig } from './basicTest';

testWebsite(
	{
		criticalStrings: ['Fehler', ...defaultConfig.criticalStrings],
		logLevel: 2
	},
	{
		url: 'https://localhost:5173/',
		name: 'Repair Café Datteln', // no $env: PUBLIC_SITE_NAME,
		hl: 'Reparieren statt wegwerfen',
		burgerNav: false,
	},
	[
		{
			slug: 'impressum',
			countString: {'@': 2}
		},
		{
			slug: 'datenschutz',
		},
		{
			slug: 'hausordnung',
		},
		{
			slug: 'faq',
			linkText: 'Fragen & Antworten',
			expectedHeadline: 'Fragen und Antworten',
			countString: {'Fehler': 2}
		}
	]
);
