import './cart_base.css';
import './cart_trade.css';
import './cart.css';

import Vue from 'vue';
// import axios from 'axios';
// import url from 'js/api.js';
import mixin from 'js/mixin.js';
import Volecity from 'velocity-animate';
import Cart from 'js/cartService.js'

new Vue({
  el: '.container',
  data: {
    cartLists: null, //购物车列表
    total: 0,
    editingShop: null,
    editingShopIndex: -1,
    removePopup: false,  //控制确认删除的弹框
    removeData: null,
    removeMsg: ''
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
    removeLists() {  //存储要删除的商品列表
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
      // axios.post(url.cartLists)
      Cart.getLists()
      .then(res=>{
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
      if (goods.number <= 1) return;
      // axios.post(url.cartReduce, {
      //   id: goods.id,
      //   number: 1
      // }).then(res=>{
      //   goods.number--
      // })
      Cart.reduce(goods.id).then(res => {
        goods.number--
      })
    },
    add(goods) {
      // axios.post(url.cartAdd, {
      //   id: goods.id,
      //   number: 1
      // }).then(res=>{
      //   goods.number++
      // })
      Cart.add(goods.id).then(res => {
        goods.number++
      })
    },
    remove(shop,shopIndex,goods,goodsIndex) {
      this.removePopup = true
      this.removeData = {shop,shopIndex,goods,goodsIndex} //对象的简洁写法
      this.removeMsg = '确定要删除该商品吗？'
    },
    removeList(){
      this.removePopup = true
      this.removeMsg = `确定将所选 ${this.removeLists.length} 个商品删除？`
    },
    removeConfirm() {
      if (this.removeMsg === '确定要删除该商品吗？') { //if逻辑走删除单个商品
        //es6解构赋值
        let {shop,shopIndex,goods,goodsIndex} = this.removeData

        // axios.post(url.cartRemove, {
        //   id: goods.id
        // })
        Cart.remove(goods.id)
        .then(res=>{
          shop.goodsList.splice(goodsIndex,1)
          //如果店铺下面没有商品，则把店铺也删除
          if (shop.goodsList.length===0) {
            this.cartLists.splice(shopIndex,1)
            this.removeShop() //把其他店铺还原回正常状态
          }
          this.removePopup = false
        })
      } else { //else逻辑走删除多个商品
        let ids = [] //存储要删除多个商品的id
        this.removeLists.forEach(goods=>{
          ids.push(goods.id)
        })
        //发送请求，在数据库中删除选中的商品列表
        // axios.post(url.cartMremove, {
        //   ids
        // })
        Cart.mremove(ids)
        .then(res=>{
          let arr = [] //存储剩余的商品列表
          //遍历编辑的商店里的商品列表，看里面的每一个
          //商品goods是否为要删除的商品。如果不是，则存到arr数组中
          this.editingShop.goodsList.forEach(goods=>{
            let index = this.removeLists.findIndex(item=>{
              return item.id ===goods.id
            })
            if(index === -1) {
              arr.push(goods)
            }
          })
          //如果 arr 存储了商品，则覆盖掉店铺的原来商品的列表
          if (arr.length) {
            this.editingShop.goodsList = arr
          } else {
            //如果arr的长度不存在了，说明该店铺下没有商品了，就把店铺也删除
            this.cartLists.splice(this.editingShopIndex, 1)
            this.removeShop() //把其他店铺还原回正常状态
          }
          this.removePopup = false //去除确认删除的弹框
        })
      }
    },
    removeShop() { //如果店铺下面没有商品，则把店铺也删除
      this.editingShop = null     //把其他的店铺还原回正常状态
      this.editingShopIndex = -1  //把其他的店铺还原回正常状态
      this.cartLists.forEach(shop=>{
        shop.editing = false
        shop.editingMsg = '编辑'
      })
    },
    start(e,goods){
      goods.startX= e.changedTouches[0].clientX
    },
    end(e,shopIndex,goods,goodsIndex){
      let endX = e.changedTouches[0].clientX //滑动结束的X坐标
      let startX = goods.startX //滑动开始的X坐标
      let slideDOM = this.$refs[`goods-${shopIndex}-${goodsIndex}`] //取到滑动的DOM节点
      let left = '0'
      if (startX - endX > 100) {
        left = '-60px'
      }
      if (endX - startX > 100) {
        left = '0px'
      }
      Volecity(slideDOM, {
        left
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
