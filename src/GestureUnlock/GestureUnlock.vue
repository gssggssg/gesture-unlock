<template>
  <div class="container-gesture-password">
    <canvas
      id="gesturePasswordCanvas"
      ref="gesturePassword"
      class="gesture-password-canvas"
      width="300"
      height="300"
      @touchstart.prevent="touchstart"
      @touchmove="touchmove"
      @touchend="touchend"
    />
  </div>
</template>

<script>
// 定时器时间
const TIMER_TIME = 500;

export default {
  name: "GestureUnlock",
  props: {
    password: {
      type: [String, Number],
    },
    pointRadius: {
      type: Number,
    },
    option: {
      type: Object,
    }
  },
  data() {
    return {
      selectedPoints: [],             // 选择的点位
      otherPoints: [],                // 其余没选中的点位
      allPoint: [],                   // 所有的点位
      touchFlag: false,               // 是否触摸
      canvas: null,
      ctx: null,
      horizontalVerticalNumber: 3,     // 横竖的点位数量
      // 选项配置
      ctxOption: {
        strokeStyle: '#11b8ff',        // 笔画样式
        lineWidth: 2,                  // 线段长度
        centerCircleStyle: '#11b8ff',  // 圆心样式
      }
    }
  },
  computed: {
    // 圆的半径
    radius() {
      return this.pointRadius || this.ctx.canvas.width / (2 + 4 * this.horizontalVerticalNumber);
    },
  },
  watch: {
    option: {
      handler(newValue) {
        this.ctxOption = {...this.ctxOption, ...newValue}
      },
      deep: true,
      immediate: true,
    }
  },
  methods: {
    /**
     * 校验密码
     * @method
     * @Description: 校验密码
     * @param{Array} result - 所有已经选中的点位数组
     * @author GSSG
     * @date 2023/06/15
     */
    checkPassword(result) {
      this.$emit('checkPassword', result.map(item => item.index))
    },
    /**
     * 当手指从屏幕上离开的时候触发
     * @method
     * @Description: 改变touchFlag，校验密码
     * @author GSSG
     * @date 2023/06/15
     */
    touchend() {
      if (this.touchFlag) {
        this.$emit('touchend')
        this.touchFlag = false;
        this.checkPassword(this.selectedPoints);
        let timeoutId = setTimeout(() => {
          clearTimeout(timeoutId);
          timeoutId = null;
          this.createCircle();
        }, TIMER_TIME);
      }
    },
    /**
     * 当手指在屏幕上滑动的时候连续地触发
     * @method
     * @Description: 实时判断是否经过可选中点位
     * @param{Object} even - 事件
     * @author GSSG
     * @date 2023/06/15
     */
    touchmove(even) {
      if (this.touchFlag) {
        this.$emit('touchmove', even)
        this.update(this.getCurrPosition(even));
      }
    },
    /**
     * 当手指触摸屏幕时候触发，
     * 即使已经有一个手指放在屏幕上也会触发。
     *
     * @method
     * @Description: 获取点击位置，然后判断是否处于可选中点位
     * @param{Object} even - 事件
     * @author GSSG
     * @date 2023/06/15
     */
    touchstart(even) {
      this.$emit('touchstart', even)
      const position = this.getCurrPosition(even);
      for (let i = 0; i < this.allPoint.length; i++) {
        // 判断当前点击位置，是否在某个点中
        if (Math.abs(position.x - this.allPoint[i].x) < this.radius && Math.abs(position.y - this.allPoint[i].y) < this.radius) {
          this.touchFlag = true;
          this.drawPointCenterCircle(this.allPoint[i].x, this.allPoint[i].y);
          this.selectedPoints.push(this.allPoint[i]);
          this.otherPoints.splice(i, 1);
          break;
        }
      }
    },
    /**
     * 获取当前点位
     * @method
     * @Description: 获取当前点位的位置
     * @param{Object} even - 事件
     * @return{{x: number, y: number}} 当前 x轴 与 y轴 的距离
     * @author GSSG
     * @date 2023/06/15
     */
    getCurrPosition(even) {
      const rect = even.currentTarget.getBoundingClientRect();
      return {x: even.touches[0].clientX - rect.left, y: even.touches[0].clientY - rect.top};
    },
    /**
     * 更新数据
     * @method
     * @Description: 更新数据
     * @param{{x: number, y: number}} currPosition - 当前位置
     * @author GSSG
     * @date 2023/06/15
     */
    update(currPosition) {
      this.drawAllCircles();
      this.drawPointCenterCircle(this.selectedPoints);
      this.drawPathLine(currPosition);
      for (let i = 0; i < this.otherPoints.length; i++) {
        // 判断currPosition是否在，任意Point半径内
        if (Math.abs(currPosition.x - this.otherPoints[i].x) < this.radius && Math.abs(currPosition.y - this.otherPoints[i].y) < this.radius) {
          this.drawPointCenterCircle(this.otherPoints[i].x, this.otherPoints[i].y);
          this.selectedPoints.push(this.otherPoints[i]);
          this.otherPoints.splice(i, 1);
          break;
        }
      }
    },
    /**
     * 绘画点位样式
     * @method
     * @Description: 绘画点位样式
     * @param{String} style - 样式【颜色】
     * @author GSSG
     * @date 2023/06/15
     */
    drawPointStyle(style) {
      this.ctx.strokeStyle = style;
      for (let i = 0; i < this.selectedPoints.length; i++) {
        this.ctx.beginPath();
        this.ctx.arc(this.selectedPoints[i].x, this.selectedPoints[i].y, this.radius, 0, Math.PI * 2, true);
        this.ctx.closePath();
        this.ctx.stroke();
      }
    },
    /**
     * 绘制路径
     * @method
     * @Description: 绘制路径线条
     * @param{{x: number, y: number}} currPosition
     * @author GSSG
     * @date 2023/06/15
     */
    drawPathLine(currPosition) {
      this.ctx.beginPath();
      this.ctx.lineWidth = this.ctxOption.lineWidth;
      this.ctx.moveTo(this.selectedPoints[0].x, this.selectedPoints[0].y);
      for (let i = 1; i < this.selectedPoints.length; i++) {
        this.ctx.lineTo(this.selectedPoints[i].x, this.selectedPoints[i].y);
      }
      this.ctx.lineTo(currPosition.x, currPosition.y);
      this.ctx.stroke();
      this.ctx.closePath();
    },
    /**
     * 绘制已选点位圆心
     * @method
     * @Description: 绘制点位圆心，当选中时候的圆心
     * @author GSSG
     * @date 2023/06/15
     */
    drawPointCenterCircle() {
      this.ctx.fillStyle = this.ctxOption.centerCircleStyle;
      for (let i = 0; i < this.selectedPoints.length; i++) {
        this.ctx.beginPath();
        // 绘制圆
        this.ctx.arc(this.selectedPoints[i].x, this.selectedPoints[i].y, this.radius / 3, 0, Math.PI * 2, true);
        this.ctx.fill();
      }
      this.ctx.closePath();
    },
    /**
     * 绘制所有圆
     * @method
     * @Description: 绘制所有圆，通过allPoint的数组，来循环绘画
     * @author GSSG
     * @date 2023/06/15
     */
    drawAllCircles() {
      // 清除画布所有内容
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      this.ctx.strokeStyle = this.ctxOption.centerCircleStyle;
      this.ctx.lineWidth = this.ctxOption.lineWidth;
      for (let i = 0; i < this.allPoint.length; i++) {
        const pointX = this.allPoint[i].x;
        const pointY = this.allPoint[i].y;
        this.ctx.beginPath();
        this.ctx.arc(pointX, pointY, this.radius, 0, Math.PI * 2, true);
        this.ctx.stroke();
      }
      this.ctx.closePath();
    },
    /**
     * 创建点位
     * @method
     * @Description: 创建点位，并绘画出点位样式
     * @author GSSG
     * @date 2023/06/15
     */
    createCircle() {
      let pointIndex = 0,         // 点位的索引值
        allPoint = [],            // 所有的点位
        otherPoints = [];         // 未选择点位
      this.selectedPoints = [];   // 已选中点位
      // 通过循环，绘制点位
      for (let i = 0; i < this.horizontalVerticalNumber; i++) {
        for (let j = 0; j < this.horizontalVerticalNumber; j++) {
          pointIndex++;
          const pointInfo = {
            x: j * 4 * this.radius + 3 * this.radius,  // x 距离
            y: i * 4 * this.radius + 3 * this.radius,  // y 距离
            index: pointIndex,
          };
          allPoint.push(pointInfo);
          otherPoints.push(pointInfo);
        }
      }
      this.allPoint = allPoint;
      this.otherPoints = otherPoints;
      this.drawAllCircles();
    },
    /**
     * 初始化
     * @method
     * @Description: 初始化，获取ctx的值，绘制初始点位
     * @author GSSG
     * @date 2023/06/15
     */
    init() {
      this.canvas = this.$refs.gesturePassword;
      this.ctx = this.$refs.gesturePassword.getContext('2d');
      this.createCircle();
    }
  },
  mounted() {
    this.init()
  }
};
</script>

<style>
.container-gesture-password {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>
