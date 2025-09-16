"use strict";
const common_vendor = require("../common/vendor.js");
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
exports.getUserOpenid = getUserOpenid;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/mockData.js.map
