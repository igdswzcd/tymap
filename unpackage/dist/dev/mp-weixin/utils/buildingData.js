"use strict";
const FLAT_BUILDINGS = [
  [1, [], 17, 0],
  [5, [], 16, 0],
  [2, [37, 36], 17, 1],
  [3, [24, 23], 17, 2],
  [4, [9, 8], 17, 3],
  [6, [], 16, 0],
  [10, [], 17, 0],
  [9, [35, 34], 17, 1],
  [8, [22, 21], 16, 2],
  [7, [7, 6], 17, 3]
];
const VILLA_BUILDINGS = [
  [11, [], 0],
  [12, [], 1],
  [13, [], 2],
  [14, [28, 27], 3],
  [15, [20, 19], 4],
  [16, [14, 13], 5],
  [17, [5, 4], 6],
  [24, [], 0],
  [23, [], 1],
  [22, [], 2],
  [21, [26, 25], 3],
  [20, [18, 17], 4],
  [19, [12, 11, 10], 5],
  [18, [3, 2, 1], 6]
];
function generateBuildings() {
  const flatBuildings = FLAT_BUILDINGS.map(([building, units, maxFloor, row]) => ({
    building,
    name: `${building}栋`,
    type: "flat",
    unitCount: units.length,
    maxFloor,
    doorsPerUnit: 2,
    row,
    isOpen: units.length > 0,
    // 根据单元数组长度判断是否开放
    floors: Array.from({ length: maxFloor }, (_, i) => i + 1),
    units: generateFlatUnits(building, units, maxFloor)
  }));
  const villaBuildings = VILLA_BUILDINGS.map(([building, units, row]) => ({
    building,
    name: `${building}栋别墅区`,
    type: "villa",
    unitCount: units.length,
    maxFloor: 3,
    doorsPerUnit: 1,
    row,
    isOpen: units.length > 0,
    // 根据单元数组长度判断是否开放
    floors: [1, 3, 5],
    units: generateVillaUnits(building, units)
  }));
  return [...flatBuildings, ...villaBuildings];
}
function generateFlatUnits(building, units, maxFloor) {
  return units.map((unitNum) => {
    const unitDoors = [];
    for (let floor = 1; floor <= maxFloor; floor++) {
      for (let door = 1; door <= 2; door++) {
        unitDoors.push({
          building,
          unit: unitNum,
          floor,
          door,
          name: `${floor}${door === 1 ? "01" : "02"}`,
          fullName: `${building}栋${floor}层${unitNum}单元${door}号`
        });
      }
    }
    return {
      building,
      unit: unitNum,
      name: `${unitNum}单元`,
      type: "flat",
      floors: Array.from({ length: maxFloor }, (_, i) => i + 1),
      doors: unitDoors
    };
  });
}
function generateVillaUnits(building, units) {
  return units.map((unitNum) => ({
    building,
    unit: unitNum,
    name: `${unitNum}单元`,
    type: "villa",
    floors: [1, 3, 5],
    doors: [1, 3, 5].map((floor) => ({
      building,
      unit: unitNum,
      floor,
      door: 1,
      name: `${floor}层${unitNum}号别墅`,
      fullName: `${building}栋别墅区${floor}层${unitNum}号别墅`
    }))
  }));
}
function getAllUnits() {
  const buildings = generateBuildings();
  const allUnits = [];
  buildings.forEach((building) => {
    allUnits.push(...building.units);
  });
  return allUnits;
}
function getAllDoors() {
  const units = getAllUnits();
  const allDoors = [];
  units.forEach((unit) => {
    allDoors.push(...unit.doors);
  });
  return allDoors;
}
function getCommunityStats() {
  const buildings = generateBuildings();
  const allDoors = getAllDoors();
  return {
    totalBuildings: buildings.length,
    totalUnits: getAllUnits().length,
    totalDoors: allDoors.length,
    flatBuildings: buildings.filter((b) => b.type === "flat").length,
    villaBuildings: buildings.filter((b) => b.type === "villa").length
  };
}
exports.generateBuildings = generateBuildings;
exports.getCommunityStats = getCommunityStats;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/buildingData.js.map
