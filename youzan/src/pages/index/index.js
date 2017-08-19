import 'css/common.css';
import './index.css';

import url from 'js/api.js';
import Vue from 'vue';
import axios from 'axios';
import bottomNav from 'components/bottom-nav.vue';
import swipe from 'components/swipe.vue';

import {InfiniteScroll} from 'mint-ui';

Vue.use(InfiniteScroll);

new Vue({
  el: '#app',
  data: {
    lists: null, //最热商品推荐列表
    pageNum: 1, //当前的页码
    pageSize: 6, //每页请求多少条数据
    loading: false,
    allLoaded: false,
    bannerLists: null
  },
  methods: {
    // 获取最热商品
    getHotLists() {
      if (this.allLoaded) {
        return
      }
      this.loading = true //请求未到来，禁止继续请求
      axios.post(url.hotLists, {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(res => {
        // console.log(res.data);
        let curLists = res.data.lists
        if (curLists < this.pageSize) {
          this.allLoaded = true
        }
        if (this.lists) {
          this.lists = this.lists.concat(curLists)
          //这里不能用push方法，因为每次请求到的数据都是一个数组，要用数组的合并 concat 方法
        } else {
          //第一次请求数据
          this.lists = curLists
        }
        this.pageNum++;
        this.loading = false;
      })
    },
    getBanner() {
      axios.post(url.banner).then(res=>{
        // console.log(res.data.lists);
        this.bannerLists = res.data.lists
      })
    },
    loadMore() {
      this.loading = true;
      setTimeout(() => {
        let last = this.list[this.list.length - 1];
        for (let i = 1; i <= 10; i++) {
          this.list.push(last + i);
        }
        this.loading = false;
      }, 2500);
    }
  },
  created() {
    this.getHotLists() // 获取最热商品
    this.getBanner() // 获取首页轮播图
  },
  components: {
    bottomNav,
    swipe
  }
})
