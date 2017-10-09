//试用vuex插件
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
// console.log(Vuex);
import Address from 'js/addressService.js';

//创建store实例
const store = new Vuex.Store({
  state: {
    addressLists: null
  },
  mutations: {
    init(state, addressLists){
      state.addressLists = addressLists
    },
    add(state, instance){
      state.addressLists.push(instance)
    },
    remove(state, id) {
      let index = state.addressLists.findIndex(item=>{
        return item.id === id
      })
      state.addressLists.splice(index,1)
    },
    update(state, instance){
      let index = state.addressLists.findIndex(item=>{
        return item.id === instance.id
      })
      // state.addressLists[index] = instance   //此方法不能被普通watch监听到
      state.addressLists.splice(index, 1, instance)
    },
    setDefault(state, id){
      state.addressLists.forEach(item => {
        item.isDefault = item.id === id ? true : false
      })
    }
  },
  actions: {
    getLists({commit}){
      Address.list().then(res => {
        // console.log('res',res);
        // this.addressLists = res.data.lists
        commit('init', res.data.lists)
      })
    },
    addAction({commit}, instance){
      instance.id = parseInt(Math.random()*10000)
      Address.add(instance).then(res => {
        commit('add', instance)
      })
    },
    removeAction({commit}, id){
      Address.remove(id).then(res => {
        commit('remove', id)
      })
    },
    updateAction({commit}, instance){
      Address.update(instance).then(res => {
        commit('update', instance)
      })
    },
    setDefaultAction({commit}, id){
      Address.setDefault(id).then(res => {
        commit('setDefault', id)
      })
    }
  }
})

export default store
