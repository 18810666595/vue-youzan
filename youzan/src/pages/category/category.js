import 'css/common.css';
import './category.css';

import Vue from 'vue';
import axios from 'axios';
import url from 'js/api.js';

import mixin from 'js/mixin.js';


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
    },
    toSearch(item) {
      location.href = `search.html?keyword=${item.name}&id=${item.id}`
    }
  },
  mixins: [mixin]
})
