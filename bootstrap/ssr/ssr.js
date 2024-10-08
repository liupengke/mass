var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderVNode } from "vue/server-renderer";
import { useSSRContext, reactive, markRaw, mergeProps, unref, createVNode, resolveDynamicComponent, createSSRApp, h } from "vue";
import Axios from "axios";
import deepmerge from "deepmerge";
import * as qs from "qs";
import createServer from "@inertiajs/vue3/server";
import { renderToString } from "@vue/server-renderer";
const _sfc_main$2 = {
  __name: "Goods",
  __ssrInlineRender: true,
  props: ["pid", "pname", "img", "price"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}> pid: ${ssrInterpolate(__props.pid)} <hr> pname: ${ssrInterpolate(__props.pname)} <hr><img${ssrRenderAttr("src", __props.img)} width="64"><hr> price: $${ssrInterpolate(_ctx.pirce)}</div>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Goods.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __vite_glob_0_0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$2
}, Symbol.toStringTag, { value: "Module" }));
function hrefToUrl(href) {
  return new URL(href.toString(), window.location.toString());
}
function mergeDataIntoQueryString(method, href, data, qsArrayFormat) {
  const hasHost = /^https?:\/\//.test(href.toString());
  const hasAbsolutePath = hasHost || href.toString().startsWith("/");
  const hasRelativePath = !hasAbsolutePath && !href.toString().startsWith("#") && !href.toString().startsWith("?");
  const hasSearch = href.toString().includes("?") || Object.keys(data).length;
  const hasHash = href.toString().includes("#");
  const url = new URL(href.toString(), "http://localhost");
  if (Object.keys(data).length) {
    url.search = qs.stringify(deepmerge(qs.parse(url.search, { ignoreQueryPrefix: true }), data), {
      encodeValuesOnly: true,
      arrayFormat: qsArrayFormat
    });
    data = {};
  }
  return [
    [
      hasHost ? `${url.protocol}//${url.host}` : "",
      hasAbsolutePath ? url.pathname : "",
      hasRelativePath ? url.pathname.substring(1) : "",
      hasSearch ? url.search : "",
      hasHash ? url.hash : ""
    ].join(""),
    data
  ];
}
function urlWithoutHash(url) {
  url = new URL(url.href);
  url.hash = "";
  return url;
}
const pageList = reactive([]);
class Router {
  constructor() {
    __publicField(this, "version", "");
  }
  init({ initialPage, resolveComponent, swapComponent }) {
    console.log({ initialPage });
    this.version = initialPage == null ? void 0 : initialPage.version;
    this.resolveComponent = resolveComponent;
    window.addEventListener("popstate", this.handlePopstateEvent.bind(this));
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
  async visit(href, { mode = "visit", data = {}, replace = false, queryStringArrayFormat = "brackets" } = {}) {
    let url = typeof href === "string" ? hrefToUrl(href) : href;
    if (!(data instanceof FormData)) {
      const [_href, _data] = mergeDataIntoQueryString("get", url, data, queryStringArrayFormat);
      url = hrefToUrl(_href);
      data = _data;
    }
    let pageResponse = {
      component: "",
      url: "",
      props: {}
    };
    if (mode == "visit") {
      pageResponse = await this._getInertiaPage({ url, data });
      this.version = pageResponse.version;
    }
    this.setPage(pageResponse);
  }
  _getInertiaPage({ url, data = {} }) {
    return Axios({
      method: "get",
      url: urlWithoutHash(url).href,
      data: {},
      params: data,
      headers: {
        Accept: "text/html, application/xhtml+xml",
        "X-Requested-With": "XMLHttpRequest",
        "X-Inertia": true,
        ...this.version ? { "X-Inertia-Version": this.version } : {}
      }
    }).then((response) => {
      const pageResponse = response.data;
      const requestUrl = url;
      const responseUrl = hrefToUrl(pageResponse.url);
      if (requestUrl.hash && !responseUrl.hash && urlWithoutHash(requestUrl).href === responseUrl.href) {
        responseUrl.hash = requestUrl.hash;
        pageResponse.url = responseUrl.href;
      }
      return pageResponse;
    });
  }
  setPage(page, { replace = false } = {}) {
    return Promise.resolve(this.resolveComponent(page.component)).then((component) => {
      replace = replace || hrefToUrl(page.url).href === window.location.href;
      replace ? this.replaceState(page) : this.pushState(page);
      this.swapComponent({ component, page });
    });
  }
  pushState(page) {
    window.history.pushState(page, "", page.url);
  }
  replaceState(page) {
    window.history.replaceState(page, "", page.url);
  }
  reload() {
  }
  get() {
  }
  navigateTo() {
  }
  navigateBack() {
  }
  replace() {
  }
  redirectTo() {
  }
  reLaunch() {
  }
}
const router = new Router();
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$1 = {
  __name: "App",
  __ssrInlineRender: true,
  props: [
    "initialPage",
    "initialComponent",
    "resolveComponent"
  ],
  setup(__props) {
    pageList.length = 0;
    pageList.push({
      component: __props.initialComponent ? markRaw(__props.initialComponent) : null,
      page: __props.initialPage,
      id: Math.random()
    });
    const isServer = typeof window === "undefined";
    if (!isServer) {
      router.init({
        initialPage: __props.initialPage,
        resolveComponent: __props.resolveComponent
      });
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page-list" }, _attrs))} data-v-7edb9e76><!--[-->`);
      ssrRenderList(unref(pageList), (page) => {
        _push(`<div class="page" data-v-7edb9e76>`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(page.component), mergeProps({
          name: "poker",
          ref_for: true
        }, page.page.props), null), _parent);
        _push(`</div>`);
      });
      _push(`<!--]--></div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/mass/App.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const App = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-7edb9e76"]]);
async function createMassApp({ id = "app", resolve, setup, page, render }) {
  const isServer = typeof window === "undefined";
  const el = isServer ? null : document.getElementById(id);
  const initialPage = page || JSON.parse(el.dataset.page);
  const resolveComponent = (name) => Promise.resolve(resolve(name)).then((module) => module.default || module);
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
        render: () => h("div", {
          id,
          "data-page": JSON.stringify(initialPage),
          innerHTML: vueApp ? render(vueApp) : ""
        })
      })
    );
    return { head: [], body };
  }
}
const _sfc_main = {
  __name: "Welcome",
  __ssrInlineRender: true,
  props: {
    laravelVersion: {
      type: String,
      required: true
    },
    phpVersion: {
      type: String,
      required: true
    },
    name: String
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "ms-4" }, _attrs))}><h1>${ssrInterpolate(__props.name)}</h1> Laravel v${ssrInterpolate(__props.laravelVersion)} (PHP v${ssrInterpolate(__props.phpVersion)}) <button>Greet</button></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Welcome.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __vite_glob_0_1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main
}, Symbol.toStringTag, { value: "Module" }));
createServer(
  (page) => createMassApp({
    page,
    render: renderToString,
    resolve: (name) => {
      const pages = /* @__PURE__ */ Object.assign({ "./Pages/Goods.vue": __vite_glob_0_0, "./Pages/Welcome.vue": __vite_glob_0_1 });
      return pages[`./Pages/${name}.vue`];
    },
    setup({ App: App2, props }) {
      return createSSRApp({
        render: () => h(App2, props)
      });
    }
  })
);
