import { createSSRApp, h } from 'vue';
import { createMassApp } from '../../bak/src/lib';

createMassApp({
	resolve: (name) => {
		const pages = import.meta.glob('./Pages/**/*.vue', { eager: true });
		return pages[`./Pages/${name}.vue`];
	},
	setup({ el, App, props }) {
		return createSSRApp({ render: () => h(App, props) }).mount(el);
	}
});
