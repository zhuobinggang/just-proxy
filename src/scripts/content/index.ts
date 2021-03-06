import store from "@/store";
import { toReport } from "@/actions/report";
import { each } from "lodash";

const trackPool = new Set();

function $(selectors: string): HTMLElement[] {
  return Array.prototype.slice.call(document.querySelectorAll(selectors));
}

function resultErrorListener(ev: ErrorEvent) {
  const target = ev.target;
  if (target) {
    const url = Reflect.get(target, "src");
    url && store.dispatch(toReport(url));
  }
}

function observeFn(mutations: MutationRecord[], observer: MutationObserver) {
  each($("[src]"), node => {
    if (!trackPool.has(node)) {
      trackPool.add(node);
      node.addEventListener("error", resultErrorListener);
    }
  });
}

each($("[src]"), node => {
  trackPool.add(node);
  node.addEventListener("error", resultErrorListener);
});

const observer = new MutationObserver(observeFn);

observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
  attributeFilter: ["src"]
});
