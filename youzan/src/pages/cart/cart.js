import './cart_base.css';
import './cart_trade.css';
import './cart.css';

import Vue from 'vue';
import axios from 'axios';
import url from 'js/api.js';
import mixin from 'js/mixin.js'

new Vue({
  el: '.container',
  data: {
    cartLists: null, //购物车列表
    total: 0,
    editingShop: null,
    editingShopIndex: -1,
    removePopup: false,
    removeData: null
  },
  computed: {
    allSelected: {
      get() {
        if(this.cartLists && this.cartLists.length){
          return this.cartLists.every(shop=>{
            return shop.checked===true
          }) //every() 方法测试数组的所有元素是否都通过了指定函数的测试。
        }
        return false
      },
      set(newVal) {
        console.log(newVal);
        this.cartLists.forEach(shop=>{
          shop.checked = newVal
          shop.goodsList.forEach(good=>{
            good.checked = newVal
          })
        })
      }
    },
    allRemoveSelected: {
      get() {
        if (this.editingShop) {
          return this.editingShop.removeChecked
        }
        return false
      },
      set(newVal) {
        if (this.editingShop) {
          this.editingShop.removeChecked = newVal
          this.editingShop.goodsList.forEach(good => {
            good.removeChecked = newVal
          })
        }
      }
    },
    selectLists() {
      if (this.cartLists && this.cartLists.length) {
        let arr = []
        let total = 0
        this.cartLists.forEach(shop=>{
          shop.goodsList.forEach(goods=>{
            if (goods.checked) {
              arr.push(goods)
              total += goods.price * goods.number
            }
          })
        })
        this.total = total
        return arr
      }
      return []
    },
    removeLists() {
      if (this.editingShop) {
        let arr = []
        this.editingShop.goodsList.forEach(goods => {
          if (goods.removeChecked) {
            arr.push(goods)
          }
        })
        return arr
      }
      return []
    }
  },
  created() {
    this.getLists()
  },
  methods: {
    //获取购物车列表
    getLists() {
      axios.post(url.cartLists).then(res=>{
        // console.log(res.data.cartList);
        let lists = res.data.cartList
        lists.forEach(shop=>{
          shop.checked = true
          shop.removeChecked = false
          shop.editing = false
          shop.editingMsg = '编辑'
          shop.goodsList.forEach(goods=>{
            goods.checked = true
            goods.removeChecked = false
          })
        })
        this.cartLists = lists
      })
    },
    selectGoods(shop,goods) {
      let attr = this.editingShop ? 'removeChecked' : 'checked'
      goods[attr] = !goods[attr]
      shop[attr] = shop.goodsList.every(goods=>{
        return goods[attr] === true
      }) //every() 方法测试数组的所有元素是否都通过了指定函数的测试。
    },
    selectShop(shop) {
      let attr = this.editingShop ? 'removeChecked' : 'checked'
      shop[attr] = !shop[attr]
      shop.goodsList.forEach(goods=>{
        goods[attr] = shop[attr]
      })
    },
    selectAll() {
      let attr = this.editingShop ? 'allRemoveSelected' : 'allSelected'
      this[attr] = !this[attr]
    },
    edit(shop, shopIndex) {
      shop.editing = !shop.editing
      shop.editingMsg = shop.editing ? '完成':'编辑'
      this.cartLists.forEach((item,index)=>{
        if (shopIndex !== index) {
          item.editing = false
          item.editingMsg = shop.editing ? '': '编辑'
        }
      })
      this.editingShop = shop.editing ? shop : null
      this.editingShopIndex = shop.editing ? shopIndex : -1
    },
    reduce(goods) {
      if (goods.number === 1) return;
      axios.post(url.cartReduce, {
        id: goods.id,
        number: 1
      }).then(res=>{
        goods.number--
      })
    },
    add(goods) {
      axios.post(url.cartAdd, {
        id: goods.id,
        number: 1
      }).then(res=>{
        goods.number++
      })
    },
    remove(shop,shopIndex,goods,goodsIndex) {
      this.removePopup = true
      this.removeData = {shop,shopIndex,goods,goodsIndex}
    },
    removeConfirm() {
      //es6解构赋值
      let {shop,shopIndex,goods,goodsIndex} = this.removeData
      axios.post(url.cartRemove, {
        id: goods.id
      }).then(res=>{
        shop.goodsList.splice(goodsIndex,1)
        //如果店铺下面没有商品，则把店铺也删除
        if (shop.goodsList.length===0) {
          this.cartLists.splice(shopIndex,1)
          this.removeShop()
        }
        this.removePopup = false
      })
    },
    removeShop() { //如果店铺下面没有商品，则把店铺也删除
      this.editingShop = null
      this.editingShopIndex = -1
      this.cartLists.forEach(shop=>{
        shop.editing = false
        shop.editingMsg = '编辑'
      })
    }
  },
  mixins: [mixin]

})

// /**
//  * 使用Mockjs模拟数据
//  */
// import Mock from 'mockjs';
// let Random = Mock.Random
//
// let data = Mock.mock({
//   'cartList|3': [{
//     'goodsList|1-2': [{
//       id: Random.integer(10000,100000),
//       image: Mock.mock('@img(90x90,@color)')
//     }]
//   }]
// })
//
// console.log(data);
