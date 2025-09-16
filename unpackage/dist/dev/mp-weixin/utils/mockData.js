"use strict";
const common_vendor = require("../common/vendor.js");
function insertMultipleTestResidents() {
  return common_vendor.__awaiter(this, void 0, void 0, function* () {
    const db = common_vendor.er.databaseForJQL();
    const testResidents = [
      new UTSJSONObject(
        // 栋1住户
        { building: 1, unit: 37, floor: 1, door: 1, nickname: "张三", phone: "13800138001", openid: "openid_1_1", credit_level: 1, is_super_admin: false, is_unit_admin: false, is_family_owner: true, owner_type: "owner" }
      ),
      new UTSJSONObject({ building: 1, unit: 37, floor: 1, door: 2, nickname: "李四", phone: "13800138002", openid: "openid_1_2", credit_level: 2, is_super_admin: false, is_unit_admin: false, is_family_owner: true, owner_type: "owner" }),
      new UTSJSONObject({ building: 1, unit: 37, floor: 2, door: 1, nickname: "王五", phone: "13800138003", openid: "openid_1_3", credit_level: 1, is_super_admin: false, is_unit_admin: false, is_family_owner: false, owner_type: "tenant" }),
      new UTSJSONObject({ building: 1, unit: 37, floor: 2, door: 2, nickname: "赵六", phone: "13800138004", openid: "openid_1_4", credit_level: 1, is_super_admin: false, is_unit_admin: false, is_family_owner: true, owner_type: "owner" }),
      new UTSJSONObject({ building: 1, unit: 37, floor: 3, door: 1, nickname: "钱七", phone: "13800138005", openid: "openid_1_5", credit_level: 2, is_super_admin: false, is_unit_admin: false, is_family_owner: false, owner_type: "tenant" }),
      new UTSJSONObject(
        // 栋2住户
        { building: 2, unit: 37, floor: 1, door: 1, nickname: "孙八", phone: "13800138006", openid: "openid_2_1", credit_level: 1, is_super_admin: false, is_unit_admin: true, is_family_owner: true, owner_type: "owner" }
      ),
      new UTSJSONObject({ building: 2, unit: 37, floor: 1, door: 2, nickname: "周九", phone: "13800138007", openid: "openid_2_2", credit_level: 2, is_super_admin: false, is_unit_admin: false, is_family_owner: false, owner_type: "tenant" }),
      new UTSJSONObject({ building: 2, unit: 37, floor: 2, door: 1, nickname: "吴十", phone: "13800138008", openid: "openid_2_3", credit_level: 1, is_super_admin: false, is_unit_admin: false, is_family_owner: true, owner_type: "owner" }),
      new UTSJSONObject({ building: 2, unit: 37, floor: 2, door: 2, nickname: "郑十一", phone: "13800138009", openid: "openid_2_4", credit_level: 1, is_super_admin: false, is_unit_admin: false, is_family_owner: false, owner_type: "tenant" }),
      new UTSJSONObject({ building: 2, unit: 37, floor: 3, door: 1, nickname: "王十二", phone: "13800138010", openid: "openid_2_5", credit_level: 2, is_super_admin: false, is_unit_admin: false, is_family_owner: true, owner_type: "owner" }),
      new UTSJSONObject({ building: 2, unit: 37, floor: 3, door: 2, nickname: "李十三", phone: "13800138011", openid: "openid_2_6", credit_level: 1, is_super_admin: false, is_unit_admin: false, is_family_owner: false, owner_type: "tenant" }),
      new UTSJSONObject(
        // 栋3住户
        { building: 3, unit: 37, floor: 1, door: 1, nickname: "张十四", phone: "13800138012", openid: "openid_3_1", credit_level: 2, is_super_admin: false, is_unit_admin: false, is_family_owner: true, owner_type: "owner" }
      ),
      new UTSJSONObject({ building: 3, unit: 37, floor: 1, door: 2, nickname: "刘十五", phone: "13800138013", openid: "openid_3_2", credit_level: 1, is_super_admin: false, is_unit_admin: false, is_family_owner: false, owner_type: "tenant" }),
      new UTSJSONObject({ building: 3, unit: 37, floor: 2, door: 1, nickname: "陈十六", phone: "13800138014", openid: "openid_3_3", credit_level: 1, is_super_admin: false, is_unit_admin: false, is_family_owner: true, owner_type: "owner" }),
      new UTSJSONObject({ building: 3, unit: 37, floor: 2, door: 2, nickname: "杨十七", phone: "13800138015", openid: "openid_3_4", credit_level: 2, is_super_admin: false, is_unit_admin: false, is_family_owner: false, owner_type: "tenant" }),
      new UTSJSONObject(
        // 栋4住户
        { building: 4, unit: 37, floor: 1, door: 1, nickname: "黄十八", phone: "13800138016", openid: "openid_4_1", credit_level: 1, is_super_admin: false, is_unit_admin: false, is_family_owner: true, owner_type: "owner" }
      ),
      new UTSJSONObject({ building: 4, unit: 37, floor: 1, door: 2, nickname: "林十九", phone: "13800138017", openid: "openid_4_2", credit_level: 2, is_super_admin: false, is_unit_admin: false, is_family_owner: false, owner_type: "tenant" }),
      new UTSJSONObject({ building: 4, unit: 37, floor: 2, door: 1, nickname: "徐二十", phone: "13800138018", openid: "openid_4_3", credit_level: 1, is_super_admin: false, is_unit_admin: false, is_family_owner: true, owner_type: "owner" }),
      new UTSJSONObject(
        // 栋5住户
        { building: 5, unit: 37, floor: 1, door: 1, nickname: "朱二一", phone: "13800138019", openid: "openid_5_1", credit_level: 2, is_super_admin: false, is_unit_admin: false, is_family_owner: true, owner_type: "owner" }
      ),
      new UTSJSONObject({ building: 5, unit: 37, floor: 1, door: 2, nickname: "马二二", phone: "13800138020", openid: "openid_5_2", credit_level: 1, is_super_admin: false, is_unit_admin: false, is_family_owner: false, owner_type: "tenant" })
    ];
    try {
      const result = yield db.collection("residents").add(testResidents);
      common_vendor.index.__f__("log", "at utils/mockData.uts:40", "批量插入测试住户成功:", result);
      return result;
    } catch (error) {
      common_vendor.index.__f__("error", "at utils/mockData.uts:43", "批量插入测试住户失败:", error);
      throw error;
    }
  });
}
function getBuildingResidentCounts() {
  return common_vendor.__awaiter(this, void 0, void 0, function* () {
    const db = common_vendor.er.databaseForJQL();
    try {
      const result = yield db.collection("residents").groupBy("building").groupField("count(*) as residentCount").get();
      const buildingCounts = new UTSJSONObject({});
      result.data.forEach((item = null) => {
        buildingCounts[item.building] = item.residentCount;
      });
      common_vendor.index.__f__("log", "at utils/mockData.uts:63", "各栋楼住户数量:", buildingCounts);
      return buildingCounts;
    } catch (error) {
      common_vendor.index.__f__("error", "at utils/mockData.uts:66", "获取各栋楼住户数量失败:", error);
      throw error;
    }
  });
}
function getUserOpenid() {
  return common_vendor.__awaiter(this, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
      common_vendor.index.login(new UTSJSONObject({
        provider: "weixin",
        success: (loginRes) => {
          resolve(loginRes.code);
        },
        fail: (error) => {
          reject(error);
        }
      }));
    });
  });
}
exports.getBuildingResidentCounts = getBuildingResidentCounts;
exports.getUserOpenid = getUserOpenid;
exports.insertMultipleTestResidents = insertMultipleTestResidents;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/mockData.js.map
