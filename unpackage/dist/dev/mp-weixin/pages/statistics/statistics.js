"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_buildingData = require("../../utils/buildingData.js");
const utils_mockData = require("../../utils/mockData.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "statistics",
  setup(__props) {
    const communityStats = common_vendor.ref(utils_buildingData.getCommunityStats());
    const statistics = common_vendor.reactive(new UTSJSONObject({
      totalResidents: 0,
      totalCapacity: communityStats.value.totalDoors,
      occupancyRate: 0
    }));
    const userInfo = common_vendor.ref(new UTSJSONObject({
      nickname: "",
      phone: "",
      credit_level: 0,
      is_super_admin: false,
      is_unit_admin: false
    }));
    const isRegistered = common_vendor.ref(false);
    const hasHighCredit = common_vendor.ref(false);
    const isAdmin = common_vendor.ref(false);
    const calculateOccupancyRate = (residentCount) => {
      const totalCapacity = statistics.totalCapacity || communityStats.value.totalDoors;
      return totalCapacity > 0 ? Math.round(residentCount / totalCapacity * 100) : 0;
    };
    const loadResidentStatistics = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          const db = common_vendor.er.databaseForJQL();
          const totalRes = yield db.collection("residents").count();
          statistics.totalResidents = totalRes.total || 0;
          statistics.occupancyRate = calculateOccupancyRate(totalRes.total || 0);
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/statistics/statistics.uvue:72", "加载住户统计数据失败:", error);
        }
      });
    };
    const loadUserInfo = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          const openid = yield utils_mockData.getUserOpenid();
          const db = common_vendor.er.databaseForJQL();
          const res = yield db.collection("residents").where(new UTSJSONObject({
            openid
          })).get();
          if (res.data && res.data.length > 0) {
            const userData = res.data[0];
            userInfo.value = {
              nickname: userData.nickname || "",
              phone: userData.phone || "",
              credit_level: userData.credit_level || 0,
              is_super_admin: userData.is_super_admin || false,
              is_unit_admin: userData.is_unit_admin || false
            };
            isRegistered.value = true;
            hasHighCredit.value = (userData.credit_level || 0) > 0;
            isAdmin.value = !!(userData.is_super_admin || userData.is_unit_admin);
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/statistics/statistics.uvue:102", "加载用户信息失败:", error);
        }
      });
    };
    const loadData = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        loadResidentStatistics();
        loadUserInfo();
      });
    };
    common_vendor.onMounted(() => {
      loadData();
    });
    return (_ctx = null, _cache = null) => {
      const __returned__ = common_vendor.e(new UTSJSONObject({
        a: common_vendor.t(statistics.totalResidents || 0),
        b: common_vendor.t(statistics.totalCapacity || 0),
        c: common_vendor.t(statistics.occupancyRate || 0),
        d: common_vendor.t(userInfo.value.nickname || "未注册"),
        e: common_vendor.t(userInfo.value.phone || ""),
        f: isRegistered.value
      }), isRegistered.value ? new UTSJSONObject({}) : new UTSJSONObject({}), new UTSJSONObject({
        g: hasHighCredit.value
      }), hasHighCredit.value ? new UTSJSONObject({}) : new UTSJSONObject({}), new UTSJSONObject({
        h: isAdmin.value
      }), isAdmin.value ? new UTSJSONObject({}) : new UTSJSONObject({}), new UTSJSONObject({
        i: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      }));
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/statistics/statistics.js.map
