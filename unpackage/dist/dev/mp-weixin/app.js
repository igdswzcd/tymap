"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/statistics/statistics.js";
}
const _sfc_main = common_vendor.defineComponent({
  name: "App",
  setup() {
    const onLaunch = () => {
      common_vendor.index.__f__("log", "at App.uvue:12", "App Launch");
    };
    const onShow = () => {
      common_vendor.index.__f__("log", "at App.uvue:16", "App Show");
    };
    const onHide = () => {
      common_vendor.index.__f__("log", "at App.uvue:20", "App Hide");
    };
    const onExit = () => {
      common_vendor.index.__f__("log", "at App.uvue:43", "App Exit");
    };
    return new UTSJSONObject({
      onLaunch,
      onShow,
      onHide,
      onExit
    });
  }
});
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
