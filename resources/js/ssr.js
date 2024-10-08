import createServer from '@inertiajs/vue3/server';
import { renderToString } from '@vue/server-renderer';
import { createSSRApp, h } from 'vue';
import { createMassApp } from './mass';

createServer((page) =>
	createMassApp({
		page,
		render: renderToString,
		resolve: (name) => {
			const pages = import.meta.glob('./Pages/**/*.vue', { eager: true });
			return pages[`./Pages/${name}.vue`];
		},
		setup({ App, props }) {
			return createSSRApp({
				render: () => h(App, props)
			});
		}
	})
);
