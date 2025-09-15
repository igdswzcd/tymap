# 数据库结构说明

## 集合说明

### 1. buildings (栋表)
- **用途**: 存储小区栋号信息，区分平层和别墅
- **关键字段**:
  - `building`: 栋号(数字)
  - `type`: 类型(flat-平层, villa-别墅)
  - `floors`: 楼层配置数组

### 2. units (户表)
- **用途**: 存储具体房屋信息
- **关键字段**:
  - `building/unit/floor/door`: 房屋位置坐标
  - `name`: 显示名称(如"1501")

### 3. residents (住户表)
- **用途**: 存储住户信息和权限
- **关键字段**:
  - `openid`: 微信唯一标识
  - `credit_level`: 信用等级(0-未认证,1-已认证,2-高信用)
  - `is_super_admin`: 超级管理员
  - `is_unit_admin`: 单元管理员
  - `is_family_owner`: 家庭户主

### 4. certification_requests (认证申请表)
- **用途**: 处理各种认证申请
- **申请类型**:
  - `family_owner`: 申请成为家庭户主
  - `unit_admin`: 申请成为单元管理员
  - `certification`: 申请成员认证

## 索引说明
- `building_unique`: 栋号唯一索引
- `unit_location_unique`: 房屋位置唯一索引
- `openid_unique`: 微信openid唯一索引
- `resident_location`: 住户位置查询索引
- `credit_level_index`: 信用等级查询索引
- `unit_admin_index`: 单元管理员查询索引
- `super_admin_index`: 超级管理员查询索引
- `applicant_index`: 申请人查询索引
- `status_type_index`: 申请状态和类型查询索引

## 部署说明
1. 在uniCloud控制台创建对应集合
2. 导入schema文件到各集合
3. 创建索引文件中的索引