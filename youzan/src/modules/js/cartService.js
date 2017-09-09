import url from 'js/api.js';
import fetch from 'js/fetch.js';

class Cart {
  static getLists() {
    return fetch(url.cartLists)
  }
  static add(id) {
    return fetch(url.cartAdd, {
      id,
      number: 1
    })
  }
  static reduce(id) {
    return fetch(url.cartReduce, {
      id,
      number: 1
    })
  }
  static remove(arr) {
    let ids = [] //存储要删除多个商品的id
    arr.forEach(goods=>{
      ids.push(goods.id)
    })

    return fetch(url.cartRemove, {
      id
    })
  }
  static mremove(ids) {
    return fetch(url.cartMremove, {
      ids
    })
  }
}

export default Cart
