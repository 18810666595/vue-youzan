import 'css/common.css';
import './category.css';

import Vue from 'vue';
import axios from 'axios';
import url from 'js/api.js';

import bottomNav from 'components/bottom-nav.vue';

new Vue({
  el: '#app',
  data() {
    return {topLists: null, topIndex: 0, subData: null, rankData: null}
  },
  created() {
    this.getTopList();
    this.getSubList(undefined, 0);
  },
  methods: {
    getTopList() {
      axios.post(url.topList).then(res => {
        // console.log(res.data.lists);
        this.topLists = res.data.lists;
      }).catch(res => {
        //请求失败的处理
      })
    },
    getSubList(id, index) {
      this.topIndex = index;
      if (index === 0) {
        this.getRankData()
      } else {
        this.$nextTick(() => {
          axios.post(url.subList, {id}).then(res => {
            // console.log(res.data.data);
            this.subData = res.data.data
          }).catch(res => {
            //请求失败的处理
          })
        })
      }
    },
    getRankData() {
      this.$nextTick(() => {
        axios.post(url.rank).then(res => {
          // console.log(res.data.data);
          this.rankData = res.data.data;
        })
      })
    }
  },
  components: {
    bottomNav
  },
  filters: {
    currency(price) {
      price += ''; // Number类型转化成String类型
      let priceArr = price.split('.')
      if (!priceArr[1]) { //小数部分不存在，则补全00
        priceArr[1] = '00'
      };
      if (priceArr[1].length === 1) { //小数部分只有1位，则补一个 0
        priceArr[1] += '0'
      };
      if (priceArr[1].length > 1) { // 小数部分有2位及以上，则截取前 2 位
        priceArr[1] = priceArr[1].slice(0,2);
      };
      let priceStr = priceArr.join('.') //把价格字符串的整数和小数部分用'.'拼接
      return priceStr;
    }
  }
})
