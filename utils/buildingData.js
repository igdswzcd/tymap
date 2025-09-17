/**
 * 小区静态数据生成器
 * 根据配置生成固定的建筑、单元、楼层数据
 */

// 简化的建筑配置
const FLAT_BUILDINGS = [
	[1, [], 17, 0],
	[5, [], 16, 0],
	[2, [37, 36], 17, 1],
	[3, [24, 23], 17, 2],
	[4, [9, 8],17, 3],
	[6, [], 16, 0],
	[10, [], 17, 0],
	[9, [35, 34], 17, 1],
	[8, [22, 21], 16, 2],
	[7, [7, 6], 17, 3]
]

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
]

/**
 * 生成建筑列表
 * @returns {Array} 建筑数组
 */
export function generateBuildings() {
    const flatBuildings = FLAT_BUILDINGS.map(([building, units, maxFloor, row]) => ({
        building,
        type: 'flat',
        unitCount: units.length,
        maxFloor,
        doorsPerUnit: 2,
        row,
        isOpen: units.length > 0, // 根据单元数组长度判断是否开放
        floors: Array.from({ length: maxFloor }, (_, i) => i + 1),
        units: generateFlatUnits(building, units, maxFloor)
    }))

    const villaBuildings = VILLA_BUILDINGS.map(([building, units, row]) => ({
        building,
        type: 'villa',
        unitCount: units.length,
        maxFloor: 3,
        doorsPerUnit: 1,
        row,
        isOpen: units.length > 0, // 根据单元数组长度判断是否开放
        floors: [1, 3, 5],
        units: generateVillaUnits(building, units)
    }))

    return [...flatBuildings, ...villaBuildings]
}

/**
 * 获取已开放的楼栋列表
 * @returns {Array} 已开放的楼栋数组
 */
export function getOpenBuildings() {
    return generateBuildings().filter(building => building.isOpen)
}

/**
 * 获取所有楼栋（包括未开放的，用于可视化显示）
 * @returns {Array} 所有楼栋数组
 */
export function getAllBuildingsForVisualization() {
    return generateBuildings()
}

/**
 * 按排数分组获取楼栋
 * @param {number} row 排数
 * @returns {Array} 该排的楼栋数组
 */
export function getBuildingsByRow(row) {
    return generateBuildings().filter(building => building.row === row)
}

/**
 * 获取所有排数
 * @returns {Array} 排数数组
 */
export function getAllRows() {
    const buildings = generateBuildings()
    const rows = new Set(buildings.map(b => b.row))
    return Array.from(rows).sort((a, b) => a - b)
}

/**
 * 获取最大排数
 * @returns {number} 最大排数
 */
export function getMaxRow() {
    const buildings = generateBuildings()
    return Math.max(...buildings.map(b => b.row))
}

/**
 * 生成平层建筑的单元列表
 * @param {number} building 建筑编号
 * @param {Array} units 单元号数组
 * @param {number} maxFloor 最高楼层
 * @returns {Array} 单元数组
 */
function generateFlatUnits(building, units, maxFloor) {
    return units.map(unitNum => {
        const unitDoors = []
        for (let floor = 1; floor <= maxFloor; floor++) {
            for (let door = 1; door <= 2; door++) {
                unitDoors.push({
                    building,
                    unit: unitNum,
                    floor,
                    door,
                    name: `${floor}${door === 1 ? '01' : '02'}`,
                    fullName: `${building}${floor}层${unitNum}单元${door}号`
                })
            }
        }

        return {
            building,
            unit: unitNum,
            name: `${unitNum}单元`,
            type: 'flat',
            floors: Array.from({ length: maxFloor }, (_, i) => i + 1),
            doors: unitDoors
        }
    })
}

/**
 * 生成别墅建筑的单元列表
 * @param {number} building 建筑编号
 * @param {Array} units 单元号数组
 * @returns {Array} 单元数组
 */
function generateVillaUnits(building, units) {
    return units.map(unitNum => ({
        building,
        unit: unitNum,
        name: `${unitNum}单元`,
        type: 'villa',
        floors: [1, 3, 5],
        doors: [1, 3, 5].map(floor => ({
            building,
            unit: unitNum,
            floor,
            door: 1,
            name: `${floor}层${unitNum}号别墅`,
            fullName: `${building}别墅区${floor}层${unitNum}号别墅`
        }))
    }))
}

/**
 * 获取所有单元列表
 * @returns {Array} 所有单元数组
 */
export function getAllUnits() {
    const buildings = generateBuildings()
    const allUnits = []

    buildings.forEach(building => {
        allUnits.push(...building.units)
    })

    return allUnits
}

/**
 * 获取所有门牌列表
 * @returns {Array} 所有门牌数组
 */
export function getAllDoors() {
    const units = getAllUnits()
    const allDoors = []

    units.forEach(unit => {
        allDoors.push(...unit.doors)
    })

    return allDoors
}

/**
 * 根据建筑编号获取建筑信息
 * @param {number} buildingNumber 建筑编号
 * @returns {Object|null} 建筑信息
 */
export function getBuildingByNumber(buildingNumber) {
    const buildings = generateBuildings()
    return buildings.find(b => b.building === buildingNumber) || null
}

/**
 * 根据建筑编号获取单元列表
 * @param {number} buildingNumber 建筑编号
 * @returns {Array} 单元数组
 */
export function getUnitsByBuilding(buildingNumber) {
    const building = getBuildingByNumber(buildingNumber)
    return building ? building.units : []
}

/**
 * 根据建筑和单元获取门牌列表
 * @param {number} buildingNumber 建筑编号
 * @param {number} unitNumber 单元编号
 * @returns {Array} 门牌数组
 */
export function getDoorsByUnit(buildingNumber, unitNumber) {
    const building = getBuildingByNumber(buildingNumber)
    if (!building) return []

    const unit = building.units.find(u => u.unit === unitNumber)
    return unit ? unit.doors : []
}

/**
 * 获取指定位置的详细信息
 * @param {number} building 建筑编号
 * @param {number} unit 单元编号
 * @param {number} floor 楼层
 * @param {number} door 门牌号
 * @returns {Object|null} 位置信息
 */
export function getLocationInfo(building, unit, floor, door) {
    const doors = getAllDoors()
    return doors.find(d =>
        d.building === building &&
        d.unit === unit &&
        d.floor === floor &&
        d.door === door
    ) || null
}

/**
 * 计算建筑总户数
 * @param {number} buildingNumber 建筑编号
 * @returns {number} 总户数
 */
export function calculateBuildingCapacity(buildingNumber) {
    const building = getBuildingByNumber(buildingNumber)
    if (!building) return 0

    // 直接统计所有门牌数量
    let totalDoors = 0
    building.units.forEach(unit => {
        totalDoors += unit.doors.length
    })
    return totalDoors
}

/**
 * 计算小区总容量
 * @returns {Object} 统计信息
 */
export function getCommunityStats() {
    const buildings = generateBuildings()
    const allDoors = getAllDoors()

    return {
        totalBuildings: buildings.length,
        totalUnits: getAllUnits().length,
        totalDoors: allDoors.length,
        flatBuildings: buildings.filter(b => b.type === 'flat').length,
        villaBuildings: buildings.filter(b => b.type === 'villa').length
    }
}

/**
 * 生成建筑选择器数据（用于下拉选择）
 * @returns {Array} 选择器数组
 */
export function generateBuildingOptions() {
    const buildings = generateBuildings()
    return buildings.map(b => ({
        label: b.name,
        value: b.building,
        type: b.type
    }))
}

/**
 * 生成单元选择器数据
 * @param {number} buildingNumber 建筑编号
 * @returns {Array} 选择器数组
 */
export function generateUnitOptions(buildingNumber) {
    const units = getUnitsByBuilding(buildingNumber)
    return units.map(u => ({
        label: u.name,
        value: u.unit
    }))
}

/**
 * 生成楼层选择器数据
 * @param {number} buildingNumber 建筑编号
 * @returns {Array} 选择器数组
 */
export function generateFloorOptions(buildingNumber) {
    const building = getBuildingByNumber(buildingNumber)
    if (!building) return []

    return building.floors.map(floor => ({
        label: `${floor}层`,
        value: floor
    }))
}

/**
 * 生成门牌选择器数据
 * @param {number} buildingNumber 建筑编号
 * @param {number} unitNumber 单元编号
 * @param {number} floor 楼层
 * @returns {Array} 选择器数组
 */
export function generateDoorOptions(buildingNumber, unitNumber, floor) {
    const doors = getDoorsByUnit(buildingNumber, unitNumber)
    const floorDoors = doors.filter(d => d.floor === floor)

    return floorDoors.map(d => ({
        label: `${d.door}号`,
        value: d.door,
        name: d.name
    }))
}