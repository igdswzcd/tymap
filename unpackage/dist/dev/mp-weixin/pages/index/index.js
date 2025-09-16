"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_buildingData = require("../../utils/buildingData.js");
const utils_mockData = require("../../utils/mockData.js");
if (!Math) {
  common_vendor.unref(Dice3D)();
}
const Dice3D = () => "../../components/Dice3D.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const currentArea = common_vendor.ref("flat");
    const touchStartX = common_vendor.ref(0);
    const touchStartTime = common_vendor.ref(0);
    const isAnimating = common_vendor.ref(false);
    const buildingResidentCounts = common_vendor.ref({});
    const buildingDoorCounts = common_vendor.ref({});
    const buildingCapacities = common_vendor.ref({});
    const allBuildings = utils_buildingData.generateBuildings();
    const flatBuildings = allBuildings.filter((b = null) => {
      return b.type === "flat";
    });
    const villaBuildings = allBuildings.filter((b = null) => {
      return b.type === "villa";
    });
    const flatRows = common_vendor.computed(() => {
      const rows = [];
      const maxRow = Math.max(...flatBuildings.map((b = null) => {
        return b.row;
      }));
      for (let i = 0; i <= maxRow; i++) {
        const rowBuildings = flatBuildings.filter((b = null) => {
          return b.row === i;
        });
        if (rowBuildings.length > 0) {
          rows.push({
            number: i,
            buildings: rowBuildings.sort((a = null, b = null) => {
              return a.building - b.building;
            })
          });
        }
      }
      return rows;
    });
    const villaRows = common_vendor.computed(() => {
      const rows = [];
      const maxRow = Math.max(...villaBuildings.map((b = null) => {
        return b.row;
      }));
      for (let i = 0; i <= maxRow; i++) {
        const rowBuildings = villaBuildings.filter((b = null) => {
          return b.row === i;
        });
        if (rowBuildings.length > 0) {
          rows.push({
            number: i,
            buildings: rowBuildings.sort((a = null, b = null) => {
              return a.building - b.building;
            })
          });
        }
      }
      return rows;
    });
    const handleTouchStart = (e = null) => {
      if (e.touches && e.touches[0]) {
        touchStartX.value = e.touches[0].clientX;
        touchStartTime.value = Date.now();
      }
    };
    const handleTouchEnd = (e = null) => {
      const touchEndTime = Date.now();
      const touchDuration = touchEndTime - touchStartTime.value;
      if (e.changedTouches && e.changedTouches[0]) {
        const touchEndX = e.changedTouches[0].clientX;
        const deltaX = touchEndX - touchStartX.value;
        if (Math.abs(deltaX) > 50 && touchDuration < 500) {
          if (deltaX > 0 && currentArea.value === "villa") {
            currentArea.value = "flat";
          } else if (deltaX < 0 && currentArea.value === "flat") {
            currentArea.value = "villa";
          }
        }
      }
    };
    const onBuildingTap = (building = null) => {
      common_vendor.index.__f__("log", "at pages/index/index.uvue:180", "点击楼栋:", building);
      if (!building.isOpen) {
        common_vendor.index.showToast({
          title: `${building.building}栋 (未开放)`,
          icon: "none"
        });
      } else {
        common_vendor.index.showToast({
          title: `${building.building}栋`,
          icon: "none"
        });
      }
    };
    const switchArea = () => {
      isAnimating.value = true;
      currentArea.value = currentArea.value === "flat" ? "villa" : "flat";
      setTimeout(() => {
        isAnimating.value = false;
      }, 1e3);
    };
    const initializeTestData = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          yield utils_mockData.insertMultipleTestResidents();
          common_vendor.index.__f__("log", "at pages/index/index.uvue:219", "测试数据初始化成功");
        } catch (error) {
          common_vendor.index.__f__("log", "at pages/index/index.uvue:222", "测试数据初始化跳过:", error.message);
        }
      });
    };
    const loadBuildingResidentCounts = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          const counts = yield utils_mockData.getBuildingResidentCounts();
          buildingResidentCounts.value = counts;
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/index/index.uvue:232", "获取住户数量失败:", error);
        }
      });
    };
    const loadBuildingDoorCounts = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          const counts = yield utils_mockData.getBuildingDoorCounts();
          buildingDoorCounts.value = counts;
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/index/index.uvue:242", "获取door数量失败:", error);
        }
      });
    };
    const loadBuildingCapacities = () => {
      try {
        const capacities = {};
        allBuildings.forEach((building = null) => {
          capacities[building.building] = utils_buildingData.calculateBuildingCapacity(building.building);
        });
        buildingCapacities.value = capacities;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/index.uvue:255", "计算建筑容量失败:", error);
      }
    };
    common_vendor.onMounted(() => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        common_vendor.index.__f__("log", "at pages/index/index.uvue:261", "楼栋视图初始化");
        yield initializeTestData();
        loadBuildingResidentCounts();
        loadBuildingDoorCounts();
        loadBuildingCapacities();
      });
    });
    return (_ctx = null, _cache = null) => {
      const __returned__ = {
        a: common_vendor.f(flatRows.value, (row = null, k0 = null, i0 = null) => {
          return {
            a: common_vendor.f(row.buildings, (building = null, k1 = null, i1 = null) => {
              return {
                a: "6f36ccca-0-" + i0 + "-" + i1,
                b: common_vendor.p({
                  disabled: !building.isOpen,
                  buildingNumber: building.building,
                  residentCount: buildingResidentCounts.value[building.building] || 0,
                  doorCount: buildingDoorCounts.value[building.building] || 0,
                  totalCapacity: buildingCapacities.value[building.building] || 1
                }),
                c: building.building,
                d: common_vendor.o(($event = null) => {
                  return onBuildingTap(building);
                }, building.building)
              };
            }),
            b: row.number
          };
        }),
        b: currentArea.value === "villa" ? 1 : "",
        c: currentArea.value === "villa" ? 1 : "",
        d: isAnimating.value ? 1 : "",
        e: common_vendor.o(switchArea),
        f: currentArea.value === "villa" ? 1 : "",
        g: common_vendor.f(villaRows.value, (row = null, k0 = null, i0 = null) => {
          return {
            a: common_vendor.f(row.buildings, (building = null, k1 = null, i1 = null) => {
              return {
                a: "6f36ccca-1-" + i0 + "-" + i1,
                b: common_vendor.p({
                  disabled: !building.isOpen,
                  buildingNumber: building.building,
                  residentCount: buildingResidentCounts.value[building.building] || 0,
                  doorCount: buildingDoorCounts.value[building.building] || 0,
                  totalCapacity: buildingCapacities.value[building.building] || 1
                }),
                c: building.building,
                d: common_vendor.o(($event = null) => {
                  return onBuildingTap(building);
                }, building.building)
              };
            }),
            b: row.number
          };
        }),
        h: currentArea.value === "flat" ? 1 : "",
        i: `translateX(${currentArea.value === "flat" ? "0" : "-50%"})`,
        j: common_vendor.o(handleTouchStart),
        k: common_vendor.o(handleTouchEnd),
        l: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      };
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
