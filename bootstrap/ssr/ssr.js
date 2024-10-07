import { mergeProps, useSSRContext, reactive, markRaw, unref, createVNode, resolveDynamicComponent, createSSRApp, h } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderVNode } from "vue/server-renderer";
import createServer from "@inertiajs/vue3/server";
import { renderToString } from "@vue/server-renderer";
import "deepmerge";
const _sfc_main$1 = {
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
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "ms-4" }, _attrs))}><h1>${ssrInterpolate(__props.name)}</h1> Laravel v${ssrInterpolate(__props.laravelVersion)} (PHP v${ssrInterpolate(__props.phpVersion)}) </div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Welcome.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __vite_glob_0_0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$1
}, Symbol.toStringTag, { value: "Module" }));
const pageList = reactive([]);
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main = {
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
        resolveComponent: __props.resolveComponent,
        swapComponent: async (args) => {
        }
      });
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page-list" }, _attrs))} data-v-69316741><!--[-->`);
      ssrRenderList(unref(pageList), (page) => {
        _push(`<div class="page" data-v-69316741>`);
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
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/mass/App.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-69316741"]]);
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
createServer(
  (page) => createMassApp({
    page,
    render: renderToString,
    resolve: (name) => {
      const pages = /* @__PURE__ */ Object.assign({ "./Pages/Welcome.vue": __vite_glob_0_0 });
      return pages[`./Pages/${name}.vue`];
    },
    setup({ App: App2, props }) {
      return createSSRApp({
        render: () => h(App2, props)
      });
    }
  })
);
