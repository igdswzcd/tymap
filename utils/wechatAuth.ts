/**
 * 微信登录工具类
 * 实现二步验证流程：
 * 1. 获取临时登录凭证code
 * 2. 调用服务端接口换取OpenID和session_key
 */
export interface WeChatLoginResult {
  code: string
  userInfo?: any
}

export interface SessionResult {
  openid: string
  unionid?: string
  session_key: string
  userinfo?: any
}

export interface AuthResult {
  success: boolean
  openid?: string
  unionid?: string
  session_key?: string
  userinfo?: any
  error?: string
}

class WeChatAuthService {
  private static instance: WeChatAuthService
  private sessionCache: Map<string, SessionResult> = new Map()

  static getInstance(): WeChatAuthService {
    if (!WeChatAuthService.instance) {
      WeChatAuthService.instance = new WeChatAuthService()
    }
    return WeChatAuthService.instance
  }

  /**
   * 第一步：获取微信登录临时凭证
   */
  async getLoginCode(): Promise<string> {
    return new Promise((resolve, reject) => {
      uni.login({
        provider: 'weixin',
        onlyAuthorize: true,
        success: (res) => {
          if (res.code) {
            resolve(res.code)
          } else {
            reject(new Error('获取登录凭证失败'))
          }
        },
        fail: (err) => {
          console.error('微信登录失败:', err)
          reject(new Error('微信登录失败'))
        }
      })
    })
  }

  /**
   * 第二步：通过code获取用户信息
   */
  async getUserInfo(): Promise<any> {
    return new Promise((resolve, reject) => {
      uni.getUserInfo({
        provider: 'weixin',
        withCredentials: true,
        lang: 'zh_CN',
        success: (res) => {
          resolve(res.userInfo)
        },
        fail: (err) => {
          console.error('获取用户信息失败:', err)
          resolve(null)
        }
      })
    })
  }

  /**
   * 调用服务端接口，换取OpenID和session_key
   * 注意：这里需要替换为实际的接口地址
   */
  async authCode2Session(code: string): Promise<SessionResult> {
    try {
      // 检查缓存
      const cached = this.sessionCache.get(code)
      if (cached) {
        return cached
      }

      // 调用后端接口 - 需要替换为实际的接口地址
      const response = await uni.request({
        url: 'https://your-domain.com/api/auth/code2session', // 替换为实际的接口地址
        method: 'POST',
        data: {
          code: code
        },
        header: {
          'content-type': 'application/json'
        }
      })

      if (response.statusCode === 200 && response.data) {
        const sessionResult: SessionResult = {
          openid: response.data.openid,
          unionid: response.data.unionid,
          session_key: response.data.session_key,
          userinfo: response.data.userinfo
        }

        // 缓存结果
        this.sessionCache.set(code, sessionResult)

        return sessionResult
      } else {
        throw new Error('服务端验证失败')
      }
    } catch (error) {
      console.error('调用code2Session接口失败:', error)

      // 如果接口调用失败，返回模拟数据（仅用于开发测试）
      // 生产环境中应该移除这部分代码
      const mockResult: SessionResult = {
        openid: `mock_openid_${code}_${Date.now()}`,
        unionid: `mock_unionid_${code}_${Date.now()}`,
        session_key: `mock_session_key_${code}`,
        userinfo: null
      }

      console.warn('使用模拟数据:', mockResult)
      return mockResult
    }
  }

  /**
   * 完整的登录流程
   */
  async completeLogin(): Promise<AuthResult> {
    try {
      console.log('开始微信登录流程...')

      // 第一步：获取登录凭证
      const code = await this.getLoginCode()
      console.log('获取到登录凭证:', code)

      // 第二步：获取用户信息（可选）
      const userInfo = await this.getUserInfo()
      console.log('获取到用户信息:', userInfo)

      // 第三步：调用服务端接口换取OpenID和session_key
      const sessionResult = await this.authCode2Session(code)
      console.log('服务端验证结果:', sessionResult)

      return {
        success: true,
        openid: sessionResult.openid,
        unionid: sessionResult.unionid,
        session_key: sessionResult.session_key,
        userinfo: sessionResult.userinfo || userInfo
      }
    } catch (error) {
      console.error('微信登录流程失败:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '登录失败'
      }
    }
  }

  /**
   * 检查登录状态
   */
  async checkLoginStatus(): Promise<boolean> {
    try {
      const openid = uni.getStorageSync('openid')
      const session_key = uni.getStorageSync('session_key')

      if (!openid || !session_key) {
        return false
      }

      // 可以在这里添加对session_key有效性的检查
      return true
    } catch (error) {
      console.error('检查登录状态失败:', error)
      return false
    }
  }

  /**
   * 保存登录状态
   */
  saveLoginState(result: SessionResult): void {
    try {
      uni.setStorageSync('openid', result.openid)
      uni.setStorageSync('unionid', result.unionid || '')
      uni.setStorageSync('session_key', result.session_key)

      console.log('登录状态已保存')
    } catch (error) {
      console.error('保存登录状态失败:', error)
    }
  }

  /**
   * 清除登录状态
   */
  clearLoginState(): void {
    try {
      uni.removeStorageSync('openid')
      uni.removeStorageSync('unionid')
      uni.removeStorageSync('session_key')

      // 清除缓存
      this.sessionCache.clear()

      console.log('登录状态已清除')
    } catch (error) {
      console.error('清除登录状态失败:', error)
    }
  }

  /**
   * 获取当前用户的OpenID
   */
  getCurrentOpenid(): string {
    try {
      return uni.getStorageSync('openid') || ''
    } catch (error) {
      console.error('获取OpenID失败:', error)
      return ''
    }
  }

  /**
   * 获取当前用户的UnionID
   */
  getCurrentUnionid(): string {
    try {
      return uni.getStorageSync('unionid') || ''
    } catch (error) {
      console.error('获取UnionID失败:', error)
      return ''
    }
  }
}

export default WeChatAuthService.getInstance()