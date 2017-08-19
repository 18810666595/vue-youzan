<template lang="html">
  <div class="swiper-container">
    <div class="swiper-wrapper">
      <div class="swp-page swiper-slide" v-for="item in lists">
        <a class="js-no-follow" :href="item.clickUrl">
          <img class="goods-main-photo fadeIn" :src="item.image">
        </a>
      </div>
    </div>
    <!-- Add Pagination -->
    <div class="swiper-pagination"></div>
    <!-- Add Arrows -->
    <div class="swiper-button-next"></div>
    <div class="swiper-button-prev"></div>
  </div>
</template>

<script>
/**
 * swipe是对DOM节点进行操作的，DOM节点什么时候生成？
 * 处理异步的方法之一，对异步获取数据渲染的 DOM 节点，用 v-if 判断
 */
import Swiper from 'swiper';
import 'swiper/dist/css/swiper.css';

export default {
  name: 'swipe',
  props: {
    lists: {
      type: Array,
      required: true
    }
  },
  data() {
    return {

    }
  },
  methods: {

  },
  mounted() {
    //3D轮播
    new Swiper('.swiper-container', {
      pagination: '.swiper-pagination',
      nextButton: '.swiper-button-next',
      prevButton: '.swiper-button-prev',
      paginationClickable: true,
      spaceBetween: 30,
      centeredSlides: true,
      autoplay: 2500,
      autoplayDisableOnInteraction: false,
      effect: 'coverflow',
      grabCursor: true,
      slidesPerView: 'auto',
      loop: true,
      coverflow: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true
      }
    });
  }
}
</script>

<style lang="css">
.swp-page img {
  width: 100%;
  height: 100%;
}
</style>
