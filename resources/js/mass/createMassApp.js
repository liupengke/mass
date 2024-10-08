import { createSSRApp, h } from 'vue';
import App from './App.vue';
import './mass.css';

export default async function createMassApp({ id = 'app', resolve, setup, page, render }) {
	const isServer = typeof window === 'undefined';
	const el = isServer ? null : document.getElementById(id);

	const initialPage = page || JSON.parse(el.dataset.page);
	const resolveComponent = (name) =>
		Promise.resolve(resolve(name)).then((module) => module.default || module);
	const vueApp = await resolveComponent(initialPage.component).then(async (initialComponent) => {
		return setup({
			el,
			App,
			props: {
				initialPage,
				initialComponent,
				resolveComponent
			}
		});
	});

	if (isServer) {
		const body = await render(
			createSSRApp({
				render: () =>
					h('div', {
						id,
						'data-page': JSON.stringify(initialPage),
						innerHTML: vueApp ? render(vueApp) : ''
					})
			})
		);

		return { head: [], body };
	}
}
