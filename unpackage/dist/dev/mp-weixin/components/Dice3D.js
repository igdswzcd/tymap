"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "Dice3D",
  setup(__props) {
    const instance = common_vendor.getCurrentInstance();
    const boxRef = common_vendor.ref(null);
    const rightTranslateZ = common_vendor.ref("133px");
    const componentId = common_vendor.ref(Math.random().toString(36).substr(2, 9));
    common_vendor.onMounted(() => {
      const query = common_vendor.index.createSelectorQuery().in(instance.proxy);
      query.select(`.dice-${componentId.value} .front`).boundingClientRect(function(data = null) {
        if (data) {
          const rightZ = (data.width - 25) / Math.cos(16 * Math.PI / 180);
          rightTranslateZ.value = `${rightZ}px`;
        }
      }).exec();
    });
    return (_ctx = null, _cache = null) => {
      const __returned__ = {
        a: `rotateY(90deg) translateZ(${rightTranslateZ.value})`,
        b: common_vendor.sei(common_vendor.gei(_ctx, "", "r0-5983e723"), "view", boxRef, {
          "k": "boxRef"
        }),
        c: common_vendor.n("dice-" + componentId.value)
      };
      return __returned__;
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/Dice3D.js.map
