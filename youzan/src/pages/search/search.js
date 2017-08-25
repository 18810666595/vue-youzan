import 'css/common.css';
import './search.css';

import Vue from 'vue';
import axios from 'axios';
import url from 'js/api.js';
import qs from 'qs';
import mixin from 'js/mixin.js';
import Velocity from 'velocity-animate';

let {keyword, id} = qs.parse(location.search.substr(1))
// console.log(location);
// console.log(qs.parse(location));
new Vue({
  el: '.container',
  data: {
    searchList: null,
    keyword,
    isShow: false,
    loading: false
  },
  created() {
    this.getSearchList()
  },
  methods: {
    getSearchList() {
      axios.post(url.searchList, {keyword, id}).then(res => {
        this.searchList = res.data.lists
      })
    },
    move() {
      //滑动展示回到顶部组件
      if (document.body.scrollTop > 100) {
        this.isShow = true
      } else {
        this.isShow = false
      }
    },
    toTop() {
      //回到顶部
      Velocity(document.body, 'scroll', {duration: 600});
      this.isShow = false
    },
  },
  mixins: [mixin]
})
