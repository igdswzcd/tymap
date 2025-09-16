"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "Dice3D",
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    buildingNumber: {
      type: Number,
      default: ""
    },
    residentCount: {
      type: Number,
      default: 0
    },
    doorCount: {
      type: Number,
      default: 0
    },
    totalCapacity: {
      type: Number,
      default: 0
    }
  },
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
      const __returned__ = common_vendor.e(new UTSJSONObject({
        a: !__props.disabled && __props.residentCount
      }), !__props.disabled && __props.residentCount ? new UTSJSONObject({}) : new UTSJSONObject({}), new UTSJSONObject({
        b: __props.disabled
      }), __props.disabled ? new UTSJSONObject({}) : common_vendor.e(new UTSJSONObject({
        c: common_vendor.t(__props.buildingNumber),
        d: __props.residentCount
      }), __props.residentCount ? new UTSJSONObject({
        e: common_vendor.t(__props.residentCount)
      }) : new UTSJSONObject({})), new UTSJSONObject({
        f: !__props.disabled && __props.residentCount
      }), !__props.disabled && __props.residentCount ? new UTSJSONObject({}) : new UTSJSONObject({}), new UTSJSONObject({
        g: `rotateY(90deg) translateZ(${rightTranslateZ.value})`,
        h: common_vendor.sei(common_vendor.gei(_ctx, "", "r0-5983e723"), "view", boxRef, new UTSJSONObject({
          "k": "boxRef"
        })),
        i: common_vendor.n("dice-" + componentId.value),
        j: common_vendor.n(new UTSJSONObject({
          "disabled": __props.disabled
        }))
      }));
      return __returned__;
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/Dice3D.js.map
