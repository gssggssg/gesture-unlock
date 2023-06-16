# gesture-unlock

适用于H5，移动端的Vue2组件，手势输入组件。

## 安装

```bash
npm i gesture-unlock
```

## 使用方法

* 引入

```javascript
import GestureUnlock from 'gesture-unlock';

Vue.use(GestureUnlock);
```

* 使用

```vue
<!-- 无需import组件，直接全局使用即可。-->
<gesture-unlock ref="gesturePassword"/>
```

## API配置项

### props

| 属性          | 类型     | 默认                                                                                 | 说明     |
|-------------|--------|------------------------------------------------------------------------------------|--------|
| pointRadius | Number |                                                                                    | 每个点位半径 |
| option      | Object | ctxOption: { strokeStyle: '#11b8ff', lineWidth: 2, centerCircleStyle: '#11b8ff', } | 一些选项   |

### 方法

> 需要使用ref配合调用

| 名称             | 说明     | 参数                              |
|----------------|--------|---------------------------------|
| drawPointStyle | 修改点位样式 | `ctx.strokeStyle`的参数(String)需要用 |

### 事件

| 名称            | 说明               | 	回调参数           |
|---------------|------------------|-----------------|
| checkPassword | 校验手势密码密码，当手势已完成后 | `<Number>` 结果数组 |
| touchstart    | 手指触摸屏幕           | `Even` Dom事件    |
| touchmove     | 手指在屏幕上滑动         | `Even` Dom事件    |
| touchend      | 手指从屏幕上离开         |                 |

### 示例

#### 改变颜色

```javascript
this.$refs.gesturePassword.drawPointStyle('##00ff22');   // 变为红色
```

## 本地构建

[仓库地址](https://github.com/gssggssg/gesture-unlock)

```bash
# 拉取代码
git clone git@github.com:gssggssg/gesture-unlock.git

# 安装依赖包
npm install

# 启动项目
npm start
# or
npm run dev
```
