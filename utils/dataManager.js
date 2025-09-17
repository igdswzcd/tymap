// 数据管理工具类
class DataManager {
	constructor() {
		this.cacheKey = 'residents_data_cache'
		this.cacheTimestampKey = 'residents_data_timestamp'
		this.cacheExpireTime = 24 * 60 * 60 * 1000 // 24小时缓存过期
		this.data = null
		this.isInitialized = false
	}

	// 初始化数据管理器
	async init(uniCloudInstance = null) {
		if (this.isInitialized) {
			return this.data
		}

		try {
			// 保存传入的uniCloud实例
			if (uniCloudInstance) {
				this.uniCloud = uniCloudInstance
			}

			// 先尝试从缓存读取
			const cachedData = await this.getFromCache()
			if (cachedData) {
				this.data = cachedData
				this.isInitialized = true
				console.log('从缓存加载数据成功，住户数量:', this.data.length)
				return this.data
			}

			// 缓存中没有，从数据库加载
			await this.loadFromDatabase()
			this.isInitialized = true
			return this.data
		} catch (error) {
			console.error('初始化数据管理器失败:', error)
			throw error
		}
	}

	// 从缓存获取数据
	async getFromCache() {
		try {
			const timestamp = await uni.getStorageSync(this.cacheTimestampKey)
			const cachedData = await uni.getStorageSync(this.cacheKey)

			if (!timestamp || !cachedData) {
				return null
			}

			// 检查缓存是否过期
			const now = Date.now()
			if (now - timestamp > this.cacheExpireTime) {
				console.log('缓存已过期，清除缓存')
				await this.clearCache()
				return null
			}

			return cachedData
		} catch (error) {
			console.error('从缓存获取数据失败:', error)
			return null
		}
	}

	// 从数据库加载数据
	async loadFromDatabase() {
		try {
			console.log('从数据库加载residents数据...')

			// 使用类实例中的uniCloud或全局uniCloud
			const cloudInstance = this.uniCloud || uniCloud
			if (!cloudInstance) {
				throw new Error('uniCloud未初始化或不可用')
			}

			const db = cloudInstance.databaseForJQL()
			if (!db) {
				throw new Error('无法创建数据库连接')
			}

			const result = await db.collection('residents').limit(10000).get()

			if (result.data && result.data.length > 0) {
				this.data = result.data
				// 写入缓存
				await this.saveToCache(this.data)
				console.log('从数据库加载数据成功，住户数量:', this.data.length)
			} else {
				console.log('数据库中没有住户数据')
				this.data = []
			}

			return this.data
		} catch (error) {
			console.error('从数据库加载数据失败:', error)
			throw error
		}
	}

	// 保存数据到缓存
	async saveToCache(data) {
		try {
			await uni.setStorageSync(this.cacheKey, data)
			await uni.setStorageSync(this.cacheTimestampKey, Date.now())
			console.log('数据已保存到缓存')
		} catch (error) {
			console.error('保存数据到缓存失败:', error)
		}
	}

	// 清除缓存
	async clearCache() {
		try {
			await uni.removeStorageSync(this.cacheKey)
			await uni.removeStorageSync(this.cacheTimestampKey)
			console.log('缓存已清除')
		} catch (error) {
			console.error('清除缓存失败:', error)
		}
	}

	// 清理非持久化缓存数据（入住流程相关的临时缓存）
	async clearNonPersistentCache() {
		try {
			const cacheKeys = [
				'checkin_process_step',
				'checkin_selected_building',
				'checkin_selected_unit',
				'checkin_selected_floor',
				'checkin_selected_door',
				'checkin_user_info'
			]

			for (const key of cacheKeys) {
				await uni.removeStorageSync(key)
			}
			console.log('非持久化缓存数据已清理')
		} catch (error) {
			console.error('清理非持久化缓存失败:', error)
		}
	}

	// 强制刷新数据（从数据库重新加载）
	async refreshData() {
		try {
			await this.clearCache()
			await this.loadFromDatabase()
			return this.data
		} catch (error) {
			console.error('刷新数据失败:', error)
			throw error
		}
	}

	// 获取所有住户数据
	async getAllResidents() {
		if (!this.isInitialized) {
			await this.init()
		}
		return this.data || []
	}

	// 根据openid获取住户信息
	async getResidentByOpenid(openid) {
		if (!this.isInitialized) {
			await this.init()
		}

		if (!this.data) return null

		return this.data.find(resident => resident.openid === openid) || null
	}

	// 根据位置获取住户信息
	async getResidentByPosition(building, unit, floor, door) {
		if (!this.isInitialized) {
			await this.init()
		}

		if (!this.data) return null

		return this.data.find(resident =>
			resident.building === building &&
			resident.unit === unit &&
			resident.floor === floor &&
			resident.door === door
		) || null
	}

	// 获取指定楼栋的住户
	async getResidentsByBuilding(building) {
		if (!this.isInitialized) {
			await this.init()
		}

		if (!this.data) return []

		return this.data.filter(resident => resident.building === building)
	}

	// 获取指定单元的住户
	async getResidentsByUnit(building, unit) {
		if (!this.isInitialized) {
			await this.init()
		}

		if (!this.data) return []

		return this.data.filter(resident =>
			resident.building === building && resident.unit === unit
		)
	}

	// 获取指定状态的住户
	async getResidentsByStatus(status) {
		if (!this.isInitialized) {
			await this.init()
		}

		if (!this.data) return []

		return this.data.filter(resident => resident.apply_status === status)
	}

	// 获取超级管理员
	async getSuperAdmins() {
		if (!this.isInitialized) {
			await this.init()
		}

		if (!this.data) return []

		return this.data.filter(resident => resident.is_super_admin === true)
	}

	// 获取单元管理员
	async getUnitAdmins(building, unit) {
		if (!this.isInitialized) {
			await this.init()
		}

		if (!this.data) return []

		return this.data.filter(resident =>
			resident.building === building &&
			resident.unit === unit &&
			resident.is_unit_admin === true
		)
	}

	// 检查是否为可信住户
	async isTrustedResident(openid) {
		const resident = await this.getResidentByOpenid(openid)
		return resident && resident.apply_status === 'trusted'
	}

	// 检查是否为超级管理员
	async isSuperAdmin(openid) {
		const resident = await this.getResidentByOpenid(openid)
		return resident && resident.is_super_admin === true
	}

	// 获取统计信息
	async getStatistics() {
		if (!this.isInitialized) {
			await this.init()
		}

		if (!this.data) {
			return {
				total: 0,
				trusted: 0,
				verifying: 0,
				rejected: 0,
				superAdmins: 0,
				byBuilding: {}
			}
		}

		const stats = {
			total: this.data.length,
			trusted: 0,
			verifying: 0,
			rejected: 0,
			superAdmins: 0,
			byBuilding: {}
		}

		this.data.forEach(resident => {
			// 按状态统计
			if (resident.apply_status === 'trusted') stats.trusted++
			else if (resident.apply_status === 'verifying') stats.verifying++
			else if (resident.apply_status === 'rejected') stats.rejected++

			// 超级管理员统计
			if (resident.is_super_admin) stats.superAdmins++

			// 按楼栋统计
			const building = resident.building
			if (!stats.byBuilding[building]) {
				stats.byBuilding[building] = 0
			}
			stats.byBuilding[building]++
		})

		return stats
	}

	// 获取每栋楼的住户数量
	async getBuildingResidentCounts() {
		if (!this.isInitialized) {
			await this.init()
		}

		const buildingCounts = {}

		if (this.data) {
			this.data.forEach(resident => {
				if (!buildingCounts[resident.building]) {
					buildingCounts[resident.building] = 0
				}
				buildingCounts[resident.building]++
			})
		}

		console.log('各栋楼住户数量:', buildingCounts)
		return buildingCounts
	}

	// 获取每栋楼的门数量（有住户的门）
	async getBuildingDoorCounts() {
		if (!this.isInitialized) {
			await this.init()
		}

		const buildingDoorCounts = {}

		if (this.data) {
			// 按building, unit, floor, door分组计算有住户的门数量
			const uniqueDoors = new Set()
			this.data.forEach(resident => {
				const doorKey = `${resident.building}_${resident.unit}_${resident.floor}_${resident.door}`
				uniqueDoors.add(doorKey)
			})

			// 重新计算每个楼栋的唯一门数量
			const buildingUniqueDoors = {}
			uniqueDoors.forEach(doorKey => {
				const building = doorKey.split('_')[0]
				if (!buildingUniqueDoors[building]) {
					buildingUniqueDoors[building] = new Set()
				}
				buildingUniqueDoors[building].add(doorKey)
			})

			Object.keys(buildingUniqueDoors).forEach(building => {
				buildingDoorCounts[building] = buildingUniqueDoors[building].size
			})
		}

		console.log('各栋楼door数量:', buildingDoorCounts)
		return buildingDoorCounts
	}
}

// 创建单例实例
const dataManager = new DataManager()

// 导出实例
export default dataManager