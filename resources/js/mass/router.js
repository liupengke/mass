import { markRaw, reactive } from 'vue';
import Axios from 'axios';
import { hrefToUrl, mergeDataIntoQueryString, urlWithoutHash } from './url';

export const pageList = reactive([]);
let pageIndex = 0;
function appendPageId(page) {
	pageIndex++;
	page.id = '_mass_' + pageIndex;
	page.index = pageIndex;
}
class Router {
	version = '';

	init({ page, component, resolveComponent }) {
		const isServer = typeof window === 'undefined';
		pageList.length = 0;
		appendPageId(page);
		pageList.push({
			component,
			page
		});
		this.version = page?.version;
		this.resolveComponent = resolveComponent;
		if (!isServer) {
			window.addEventListener('popstate', this.handlePopstateEvent.bind(this));
		}
	}

	handlePopstateEvent(event) {
		/**
		 * 浏览器的backwards和forwards都会触发popstate
		 * 我们根据event.state中的index和当前页面state值来判断，是前进，还是后退
		 */
		console.log('state:', event.state, pageList[pageList.length - 1]);
		if (event.state && event.state.index > pageList[pageList.length - 1].page.index) {
			// 前进
			this.setPage(event.state);
		} else {
			if (pageList.length < 2) return;
			pageList[pageList.length - 1].lifeState = 'out';
			pageList[pageList.length - 2].lifeState = 'pop';
		}
	}

	async visit(
		href,
		{ mode = 'visit', data = {}, replace = false, queryStringArrayFormat = 'brackets' } = {}
	) {
		let url = typeof href === 'string' ? hrefToUrl(href) : href;

		if (!(data instanceof FormData)) {
			const [_href, _data] = mergeDataIntoQueryString('get', url, data, queryStringArrayFormat);
			url = hrefToUrl(_href);
			data = _data;
		}

		/**
		 * 接下来要做的事儿，（默认replace为false，就是打开新页面）
		 * 1. 如果当前跳转是visit模式，发起ajax请求，获得页面数；
		 * 2. 创建页面，加入pageList。
		 * 3. 启动页面转场动画
		 * 4. 判断当前pageList的深度是不是超过上限，移除掉过老的页面
		 */
		let pageResponse = {
			component: '',
			url: '',
			props: {}
		};
		if (mode == 'visit') {
			pageResponse = await this._getInertiaPage({ url, data });
			this.version = pageResponse.version;
		}
		this.setPage(pageResponse);
	}
	_getInertiaPage({ url, data = {} }) {
		return Axios({
			method: 'get',
			url: urlWithoutHash(url).href,
			data: {},
			params: data,
			headers: {
				Accept: 'text/html, application/xhtml+xml',
				'X-Requested-With': 'XMLHttpRequest',
				'X-Inertia': true,
				...(this.version ? { 'X-Inertia-Version': this.version } : {})
			}
		}).then((response) => {
			const pageResponse = response.data;
			const requestUrl = url;
			const responseUrl = hrefToUrl(pageResponse.url);
			if (
				requestUrl.hash &&
				!responseUrl.hash &&
				urlWithoutHash(requestUrl).href === responseUrl.href
			) {
				responseUrl.hash = requestUrl.hash;
				pageResponse.url = responseUrl.href;
			}
			return pageResponse;
		});
	}
	setPage(page, { replace = false } = {}) {
		return Promise.resolve(this.resolveComponent(page.component)).then((component) => {
			appendPageId(page);
			replace = replace || hrefToUrl(page.url).href === window.location.href;
			replace ? this.replaceState(page) : this.pushState(page);
			if (pageList.length > 0) {
				pageList[pageList.length - 1].lifeState = 'push';
			}

			pageList.push({
				component: markRaw(component),
				page,
				lifeState: 'in'
			});
		});
	}

	pushState(page) {
		window.history.pushState(page, '', page.url);
	}

	replaceState(page) {
		window.history.replaceState(page, '', page.url);
	}

	reload() {}
	get() {}
	navigateTo() {}
	navigateBack() {
		window.history.back();
	}
	replace() {}
	redirectTo() {}
	reLaunch() {}
}
export const router = new Router();

export function usePage() {
	const { page } = pageList[pageList.length - 1];
	return page;
}
