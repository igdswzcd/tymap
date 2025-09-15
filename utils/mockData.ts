import { ref } from 'vue'

// Mock数据初始化函数
export async function initializeMockData() {
	const db = uniCloud.databaseForJQL()
	
	try {
		// 检查是否已经有栋数据
		const buildingsRes = await db.collection('buildings').count()
		if (buildingsRes.total === 0) {
			// 插入Mock栋数据
			const mockBuildings = [
				{
					building: 1,
					type: 'flat',
					name: '1栋',
					floors: Array.from({length: 17}, (_, i) => i + 1)
				},
				{
					building: 2,
					type: 'flat',
					name: '2栋',
					floors: Array.from({length: 16}, (_, i) => i + 1)
				},
				{
					building: 3,
					type: 'villa',
					name: '3栋别墅区',
					floors: [1, 3, 5]
				},
				{
					building: 4,
					type: 'flat',
					name: '4栋',
					floors: Array.from({length: 18}, (_, i) => i + 1)
				}
			]
			
			for (const building of mockBuildings) {
				await db.collection('buildings').add(building)
			}
		}
		
		// 检查是否已经有单元数据
		const unitsRes = await db.collection('units').count()
		if (unitsRes.total === 0) {
			const units = []
			
			// 为平层生成单元数据
			for (const building of [1, 2, 4]) {
				for (let unit = 1; unit <= 4; unit++) {
					for (let floor = 1; floor <= (building === 1 ? 17 : building === 2 ? 16 : 18); floor++) {
						for (let door = 1; door <= 2; door++) {
							units.push({
								building: building,
								unit: unit,
								floor: floor,
								door: door,
								name: `${floor}${door === 1 ? '01' : '02'}`
							})
						}
					}
				}
			}
			
			// 为别墅生成单元数据
			for (const floor of [1, 3, 5]) {
				units.push({
					building: 3,
					unit: 1,
					floor: floor,
					door: 1,
					name: `${floor}号别墅`
				})
			}
			
			for (const unit of units) {
				await db.collection('units').add(unit)
			}
		}
		
		// 检查是否已经有住户数据
		const residentsRes = await db.collection('residents').count()
		if (residentsRes.total === 0) {
			const mockResidents = [
				{
					building: 1,
					unit: 1,
					floor: 1,
					door: 1,
					nickname: '张三',
					phone: '13800138000',
					openid: 'mock_openid_001',
					credit_level: 1,
					is_super_admin: false,
					is_unit_admin: false,
					is_family_owner: true,
					owner_type: 'owner'
				},
				{
					building: 1,
					unit: 2,
					floor: 2,
					door: 1,
					nickname: '李四',
					phone: '13900139000',
					openid: 'mock_openid_002',
					credit_level: 0,
					is_super_admin: false,
					is_unit_admin: true,
					is_family_owner: true,
					owner_type: 'owner'
				},
				{
					building: 3,
					unit: 1,
					floor: 1,
					door: 1,
					nickname: '王五',
					phone: '13700137000',
					openid: 'mock_openid_003',
					credit_level: 2,
					is_super_admin: true,
					is_unit_admin: false,
					is_family_owner: true,
					owner_type: 'owner'
				}
			]
			
			const timestamp = new Date().getTime()
			for (const resident of mockResidents) {
				await db.collection('residents').add({
					...resident,
					create_time: timestamp,
					update_time: timestamp
				})
			}
		}
		
		console.log('Mock数据初始化完成')
	} catch (error) {
		console.error('初始化Mock数据失败:', error)
	}
}

// 获取用户OpenID
export async function getUserOpenid(): Promise<string> {
	return new Promise((resolve, reject) => {
		// #ifdef MP-WEIXIN
		uni.login({
			provider: 'weixin',
			success: (loginRes) => {
				resolve(loginRes.code)
			},
			fail: (error) => {
				reject(error)
			}
		})
		// #endif
		
		// #ifndef MP-WEIXIN
		resolve('mock_openid_' + Date.now())
		// #endif
	})
}