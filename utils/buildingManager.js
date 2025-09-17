// Building数据管理器 - 单例模式
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

	// 加载building数据（硬编码的静态数据）
	async loadBuildingsData() {
		// 这里写死building数据，这些静态数据来自buildingData.js的定义
		// FLAT_BUILDINGS格式: [building, units, maxFloor, row]
		// VILLA_BUILDINGS格式: [building, units, row]

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

	// 重置数据（用于测试或强制重新加载）
	reset() {
		this.buildingsData = null
		this.isInitialized = false
		console.log('Building管理器已重置')
	}
}

// 创建单例实例
const buildingManager = new BuildingManager()

// 导出实例
export default buildingManager