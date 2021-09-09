<template>
  <div class="whole-page">
    <div class="image-box">
      <el-container>
        <el-main>
          <div align="center">
            <el-image :src="image_src"></el-image>
          </div>
          <div class="back-button">
            <el-button type="primary" @click="back()">返回</el-button>
          </div>
        </el-main>
      </el-container>
    </div>

    <div class="wechat">
      <el-link :underline="false" type="info"
        >关于我们@微信公众号Aplus实验室<i
          class="el-icon-view el-icon--right"
        ></i
      ></el-link>
    </div>
    <vue-particles
      color="#ffffff"
      :particleOpacity="0.7"
      linesColor="#ffffff"
      :particlesNumber="80"
      shapeType="circle"
      :particleSize="5"
      :linesWidth="2"
      :lineLinked="true"
      :lineOpacity="0.4"
      :linesDistance="150"
      :moveSpeed="3"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="push"
    >
    </vue-particles>
  </div>
</template>
<script>
export default {
  created() {
    const _this = this
    _this.back_position = this.$route.query.back_position
  },
  data() {
    return {
      back_position: '',
      image_src: 'http://47.98.201.222:8080/ingredients/img/aplus.jpg'
    }
  },
  methods: {
    back() {
      this.$router.replace(this.back_position)
    }
  }
}
</script>
<style>
.whole-page {
  background-image: url('../../assets/sky.jpg');
  background-size: cover;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 998;
}
.image-box {
  width: 480px;
  height: 380px;
  /* background-color: #fff; */
  background-color: #909399;
  border-radius: 80px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 40px 40px 40px 40px;
}
.back-button {
  margin-top: 45px;
}
.wechat {
  text-align: center;
  bottom: 15px;
  position: absolute;
  width: 100%;
}
</style>
