<template lang="html">
  <div class="container " style="min-height: 597px;">
    <div class="block-list address-list section section-first js-no-webview-block">
      <a v-for="addressItem in addressLists" :key="addressItem.id" v-if="addressLists && addressLists.length" class="block-item js-address-item address-item " :class="{'address-item-default': addressItem.isDefault}" @click="toEdit(addressItem)">
        <div class="address-title">{{addressItem.name}} {{addressItem.tel}}</div>
        <p>{{addressItem.provinceName}} {{addressItem.cityName}} {{addressItem.districtName}} {{addressItem.address}}</p>
      </a>
    </div>;
    <div v-if="addressLists && !addressLists.length" class="">
      <p>没有地址，请添加</p>
    </div>
    <div class="block stick-bottom-row center">
      <router-link class="btn btn-blue js-no-webview-block js-add-address-btn" :to="{name: 'form', query: {type: 'add'}}">
          新增地址
      </router-link>
    </div>
  </div>

</template>

<script>
// import Address from 'js/addressService.js';
// import store from '../vuex/index.js';

export default {
  // data() {
  //   return {
  //     addressLists: null,
  //
  //   }
  // },
  computed: {
    addressLists(){  //在计算属性中获取Vuex中的state中的数据
      return this.$store.state.addressLists
    }
  },
  created() {
    // Address.list().then(res => {
    //   // console.log('res',res);
    //   this.addressLists = res.data.lists
    // })
    if(!this.addressLists){
      this.$store.dispatch('getLists');
    }

  },
  methods: {
    toEdit(addressItem) {
      //编程式导航
      this.$router.push({
        name: 'form',
        query: {
          type: 'edit',
          instance: addressItem
        }
      })
    }
  }
}
</script>

<style lang="css">
</style>
