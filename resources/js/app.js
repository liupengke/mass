import { createApp, h } from 'vue';
import { createMassApp } from './mass';

createMassApp({
	resolve: (name) => {
		const pages = import.meta.glob('./Pages/**/*.vue', { eager: true });
		return pages[`./Pages/${name}.vue`];
	},
	setup({ el, App, props }) {
		createApp({ render: () => h(App, props) }).mount(el);
	}
});
