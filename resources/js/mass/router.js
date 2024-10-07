import { reactive } from 'vue';
import { hrefToUrl, mergeDataIntoQueryString } from './url';

export const pageList = reactive([]);

class Router {
	init({ initialPage, resolveComponent, swapComponent }) {
		this.resolveComponent = resolveComponent;
		window.addEventListener('popstate', this.handlePopstateEvent.bind(this));
	}

	handlePopstateEvent(event) {
		if (event.state !== null) {
			const page = event.state;
			const visitId = this.createVisitId();
			Promise.resolve(this.resolveComponent(page.component)).then((component) => {
				if (visitId === this.visitId) {
					this.page = page;
					this.swapComponent({ component, page, preserveState: false });
				}
			});
		} else {
			const url = hrefToUrl(this.page.url);
			url.hash = window.location.hash;
			this.replaceState({ ...this.page, url: url.href });
		}
	}

	visit(href, { method = 'get', data = {}, replace = false, queryStringArrayFormat = 'brackets' }) {
		let url = typeof href === 'string' ? hrefToUrl(href) : href;

		if (!(data instanceof FormData)) {
			const [_href, _data] = mergeDataIntoQueryString(method, url, data, queryStringArrayFormat);
			url = hrefToUrl(_href);
			data = _data;
		}
	}
	reload() {}
	get() {}
	navigateTo() {}
	navigateBack() {}
	replace() {}
	redirectTo() {}
	reLaunch() {}
}
export const router = new Router();

export function usePage() {
	const { page } = pageList[pageList.length - 1];
	return page;
}
