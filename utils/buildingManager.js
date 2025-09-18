// Building数据管理器 - 单例模式
// 户型尺寸常量
const SIZE_141 = 0;
const SIZE_160 = 1;
const SIZE_190 = 2;
const SIZE_251 = 3;
const SIZE_Villa = 4;

// 户型颜色映射
const COLOR = ['#F3F9A780', '#6dd5ed80', '#FBD78680', '#FF000080', '#67b26f80'];

// 单元-户型映射表（单元号: [2号门户型, 1号门户型]）
const UNIT_SIZE_MAP = {
    37: [SIZE_141, SIZE_160],
    24: [SIZE_141, SIZE_160],
    9: [SIZE_141, SIZE_141],
    8: [SIZE_141, SIZE_141],
    7: [SIZE_141, SIZE_141],
    6: [SIZE_141, SIZE_141],
    36: [SIZE_160, SIZE_190],
    23: [SIZE_160, SIZE_190],
    35: [SIZE_190, SIZE_160],
    22: [SIZE_190, SIZE_160],
    34: [SIZE_160, SIZE_160],
    21: [SIZE_160, SIZE_160],
}

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

class BuildingManager {
	constructor() {
		this.buildingsData = null
		this.isInitialized = false
	}

	// 初始化building数据
	async init() {
		if (this.isInitialized) {
			return this.buildingsData
		}

		try {
			await this.loadBuildingsData()
			this.isInitialized = true
			return this.buildingsData
		} catch (error) {
			console.error('初始化Building管理器失败:', error)
			throw error
		}
	}

	// 加载building数据（使用内部定义的静态数据）
	async loadBuildingsData() {
		// FLAT_BUILDINGS格式: [building, units, maxFloor, row]
		// VILLA_BUILDINGS格式: [building, units, row]

		this.buildingsData = [
			...FLAT_BUILDINGS.map(([building, units, maxFloor, row]) => ({
				building,
				type: 'flat',
				floors: Array.from({ length: maxFloor }, (_, i) => i + 1),
				units,
				row,
				isOpen: units.length > 0
			})),
			...VILLA_BUILDINGS.map(([building, units, row]) => ({
				building,
				type: 'villa',
				floors: [1, 3, 5], // 别墅固定3层
				units,
				row,
				isOpen: units.length > 0
			}))
		]

		console.log('Building数据加载完成，楼栋数量:', this.buildingsData.length)
		return this.buildingsData
	}

	// 获取所有楼栋数据
	async getAllBuildings() {
		if (!this.isInitialized) {
			await this.init()
		}
		return this.buildingsData || []
	}

	// 根据楼栋号获取楼栋信息
	async getBuilding(buildingNumber) {
		if (!this.isInitialized) {
			await this.init()
		}

		if (!this.buildingsData) return null

		return this.buildingsData.find(building => building.building === buildingNumber) || null
	}

	// 获取指定楼栋的层数
	async getFloors(buildingNumber) {
		const building = await this.getBuilding(buildingNumber)
		return building ? building.floors : []
	}

	// 获取指定楼栋的最高层
	async getMaxFloor(buildingNumber) {
		const floors = await this.getFloors(buildingNumber)
		return floors.length > 0 ? Math.max(...floors) : 0
	}

	// 获取指定楼栋的最低层
	async getMinFloor(buildingNumber) {
		const floors = await this.getFloors(buildingNumber)
		return floors.length > 0 ? Math.min(...floors) : 0
	}

	// 检查指定楼栋是否存在某层
	async hasFloor(buildingNumber, floorNumber) {
		const floors = await this.getFloors(buildingNumber)
		return floors.includes(floorNumber)
	}

	// 获取楼栋类型
	async getBuildingType(buildingNumber) {
		const building = await this.getBuilding(buildingNumber)
		return building ? building.type : null
	}

	// 获取楼栋显示名称
	async getBuildingName(buildingNumber) {
		const building = await this.getBuilding(buildingNumber)
		return buildingNumber
	}

	// 获取所有单元数量（根据buildingData中的units数组长度）
	async getUnitCount(buildingNumber) {
		const building = await this.getBuilding(buildingNumber)
		if (!building) return 0

		// 直接返回units数组的长度
		return building.units ? building.units.length : 0
	}

	// 获取指定楼栋的所有门牌号（每层固定为1、2号门）
	async getDoors(buildingNumber, floorNumber) {
		const hasFloor = await this.hasFloor(buildingNumber, floorNumber)
		return hasFloor ? [1, 2] : []
	}

	// 检查位置是否有效
	async isValidPosition(buildingNumber, unitNumber, floorNumber, doorNumber) {
		// 检查楼栋是否存在
		const building = await this.getBuilding(buildingNumber)
		if (!building) return false

		// 检查单元是否有效
		const maxUnits = await this.getUnitCount(buildingNumber)
		if (unitNumber < 1 || unitNumber > maxUnits) return false

		// 检查楼层是否存在
		const hasFloor = await this.hasFloor(buildingNumber, floorNumber)
		if (!hasFloor) return false

		// 检查门牌号是否有效
		return doorNumber === 1 || doorNumber === 2
	}

	// 获取楼栋统计信息
	async getBuildingStatistics() {
		if (!this.isInitialized) {
			await this.init()
		}

		if (!this.buildingsData) return null

		const stats = {
			totalBuildings: this.buildingsData.length,
			flatBuildings: 0,
			villaBuildings: 0,
			totalUnits: 0,
			totalFloors: 0,
			totalDoors: 0,
			byBuilding: {}
		}

		this.buildingsData.forEach(building => {
			// 按类型统计
			if (building.type === 'flat') {
				stats.flatBuildings++
			} else if (building.type === 'villa') {
				stats.villaBuildings++
			}

			// 计算单元数
			const unitCount = this.getUnitCountSync(building.building)
			stats.totalUnits += unitCount

			// 计算楼层数
			stats.totalFloors += building.floors.length

			// 计算门牌数（每层2个门）
			const doorCount = building.floors.length * 2 * unitCount
			stats.totalDoors += doorCount

			// 按楼栋统计
			stats.byBuilding[building.building] = {
				name: building.name,
				type: building.type,
				units: unitCount,
				floors: building.floors.length,
				doors: doorCount
			}
		})

		return stats
	}

	// 同步版本的方法（供内部使用）
	getUnitCountSync(buildingNumber) {
		if (!this.buildingsData) return 0

		const building = this.buildingsData.find(b => b.building === buildingNumber)
		if (!building) return 0

		return building.units ? building.units.length : 0
	}

	// 获取指定楼栋的统计信息（包括住户数、门数等）
	async getBuildingStatistics(buildingNumber) {
		if (!this.isInitialized) {
			await this.init()
		}

		if (!this.buildingsData) return null

		const building = this.buildingsData.find(b => b.building === buildingNumber)
		if (!building) return null

		// 返回基础统计信息
		return {
			building: building.building,
			type: building.type,
			units: building.units || [],
			floors: building.floors || [],
			isOpen: building.isOpen || false
		}
	}

	// 通过单元号查找所属楼栋
	async getBuildingByUnit(unitNumber) {
		if (!this.isInitialized) {
			await this.init()
		}

		if (!this.buildingsData) return null

		// 遍历所有楼栋，找到包含该单元的楼栋
		const building = this.buildingsData.find(b =>
			b.units && b.units.includes(unitNumber)
		)

		return building || null
	}

	// 获取指定单元的统计信息（通过单元号）
	async getUnitStatisticsByUnit(unitNumber) {
		try {
			// 先找到所属楼栋
			const building = await this.getBuildingByUnit(unitNumber)
			if (!building) return null

			return {
				building: building.building,
				unit: unitNumber,
				floorCount: building.floors?.length || 1,
				totalCapacity: (building.floors?.length || 1) * 2,
				isOpen: true
			}
		} catch (error) {
			console.error('通过单元号获取统计信息失败:', error)
			return null
		}
	}

	// 获取指定单元的统计信息
	async getUnitStatistics(buildingNumber, unitNumber) {
		try {
			// 获取楼栋信息
			const building = await this.getBuilding(buildingNumber)
			if (!building) return null

			// 检查单元是否存在
			if (!building.units || !building.units.includes(unitNumber)) {
				return null
			}

			// 获取该楼栋的所有住户数据（需要dataManager）
			// 这里返回基础信息，详细数据需要dataManager配合
			return {
				building: buildingNumber,
				unit: unitNumber,
				floorCount: building.floors?.length || 1,
				totalCapacity: (building.floors?.length || 1) * 2,
				isOpen: true
			}
		} catch (error) {
			console.error('获取单元统计信息失败:', error)
			return null
		}
	}

	// 获取单元双色映射（用于UnitDice3D组件）
	// 返回格式: { leftColor: string, rightColor: string }
	getUnitColors(unitNumber) {
		// 默认颜色（当单元未在UNIT_SIZE_MAP中定义时）
		const defaultColors = {
			leftColor: COLOR[4],
			rightColor: COLOR[4]
		}

		// 检查单元是否有户型映射
		const unitSizes = UNIT_SIZE_MAP[unitNumber]
		if (!unitSizes || unitSizes.length !== 2) {
			console.warn(`单元 ${unitNumber} 未找到户型映射，使用默认颜色`)
			return defaultColors
		}

		try {
			// unitSizes[0] = 2号门颜色（左侧）, unitSizes[1] = 1号门颜色（右侧）
			const leftSizeIndex = unitSizes[0]
			const rightSizeIndex = unitSizes[1]

			return {
				leftColor: COLOR[leftSizeIndex] || defaultColors.leftColor,
				rightColor: COLOR[rightSizeIndex] || defaultColors.rightColor
			}
		} catch (error) {
			console.error(`获取单元 ${unitNumber} 颜色映射失败:`, error)
			return defaultColors
		}
	}

	// 获取单元户型信息（详细版本）
	getUnitSizeInfo(unitNumber) {
		const unitSizes = UNIT_SIZE_MAP[unitNumber]
		if (!unitSizes || unitSizes.length !== 2) {
			return null
		}

		const sizeNames = ['141㎡', '160㎡', '190㎡', '251㎡', '别墅']

		return {
			unit: unitNumber,
			leftDoor: {
				door: 2, // 2号门在左侧
				size: unitSizes[0],
				sizeName: sizeNames[unitSizes[0]] || '未知户型',
				color: COLOR[unitSizes[0]] || '#F3F9A780'
			},
			rightDoor: {
				door: 1, // 1号门在右侧
				size: unitSizes[1],
				sizeName: sizeNames[unitSizes[1]] || '未知户型',
				color: COLOR[unitSizes[1]] || '#F3F9A780'
			}
		}
	}

	// 重置数据（用于测试或强制重新加载）
	reset() {
		this.buildingsData = null
		this.isInitialized = false
		console.log('Building管理器已重置')
	}

	// 获取户型常量（供外部使用）
	getSizeConstants() {
		return {
			SIZE_141,
			SIZE_160,
			SIZE_190,
			SIZE_251,
			SIZE_Villa
		}
	}

	// 获取颜色数组
	getColors() {
		return COLOR
	}

	// 获取单元户型映射表
	getUnitSizeMap() {
		return UNIT_SIZE_MAP
	}

	// 获取户型名称
	getSizeName(sizeIndex) {
		const sizeNames = ['141㎡', '160㎡', '190㎡', '251㎡', '别墅']
		return sizeNames[sizeIndex] || '未知户型'
	}
}

// 创建单例实例
const buildingManager = new BuildingManager()

// 导出实例
export default buildingManager