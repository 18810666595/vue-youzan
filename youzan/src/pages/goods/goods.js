import './goods_common.css';
import './goods_custom.css';
import './goods.css';
import './goods_theme.css';
import './goods_mars.css';
import './goods_sku.css';
import './goods_transition.css';

import Vue from 'vue';
import axios from 'axios';
import url from 'js/api.js';
import mixin from 'js/mixin.js'
import qs from 'qs';
import Swipe from 'components/swipe.vue';

let {id} = qs.parse(location.search.substr(1))

let detailTab = ['商品详情', '本店成交']

new Vue({
  el: '#app',
  data: {
    id,
    details: null, //商品详情
    detailTab, //tab切换
    tabIndex: 0,
    dealLists: null, //本店成交列表
    bannerLists: null,
    skuType: 1,
    showSku: false,
    skuNum: 1,
    isAddCart: false,
    showAddMessage: false
  },
  created() {
    this.getDetails()
  },
  methods: {
    //获取商品详情
    getDetails() {
      axios.post(url.details, {id}).then(res => {
        // console.log(res.data.data);
        this.details = res.data.data
        this.bannerLists = []
        this.details.imgs.forEach((item)=>{
          this.bannerLists.push({
            clickUrl: 'javascript: void(0)', //禁止跳转
            image: item
          })
        })
        // console.log(this.bannerLists);
      })
    },
    //切换tab
    changeTab(index) {
      this.tabIndex = index
      if(index===1) { //点击本店成交的tab时候再获取数据
        this.getDeal()
      }
    },
    //获取本店成交
    getDeal() {
      axios.post(url.deal,{id}).then(res=>{
        // console.log(res.data.data.lists);
        this.dealLists = res.data.data.lists
      })
    },
    chooseSku(type) {
      this.skuType = type
      this.showSku = true
    },
    cancelSku() {
      this.showSku = false
    },
    changeSkuNum(num) {
      if (num<0 && this.skuNum===1) return;
      this.skuNum += num
    },
    addCart() {
      axios.post(url.cartAdd,{
        id,
        number: this.skuNum
      }).then(res=>{
        if(res.data.status === 200) {
          this.showSku = false
          this.isAddCart = true
          this.showAddMessage = true;

          window.setTimeout(()=>{
            this.showAddMessage = false
          }, 1000)
        }
      })
    }
  },
  mixins: [mixin],
  components: {Swipe},
  watch: {
    showSku(val, oldVal) {
      document.body.style.overflow = val ? 'hidden':'auto'
      document.querySelector('html').style.overflow = val ? 'hidden':'auto'
      document.body.style.height = val ? '100%':'auto'
      document.querySelector('html').style.height = val ? '100%':'auto'
    }
  }
})
