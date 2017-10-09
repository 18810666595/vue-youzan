<template lang="html">
  <div class="container " style="min-height: 597px;">
    <div class="section section-first">
      <div class="block form js-form">
        <input class="js-id" name="id" type="hidden" value="">
        <div class="block-item" style="border-top:0;">
          <label>收货人</label>
          <input type="text" placeholder="请输入姓名" name="user_name" v-model.trim="name" maxlength="20">
        </div>
        <div class="block-item">
          <label>联系电话</label>
          <input type="tel" placeholder="联系电话" name="tel" v-model.trim="tel" maxlength="11">
        </div>
        <div class="block-item">
          <label>选择地区</label>
          <div class="select-group">
            <select class="js-province-selector" v-model="provinceValue">
              <option value="-1">选择省份</option>
              <option v-for="province in addressData.list" :value="province.value">{{province.label}}</option>

            </select>
            <select class="js-city-selector" v-model="cityValue">
              <option value="-1">选择城市</option>
              <option v-for="city in cityList" :value="city.value">{{city.label}}</option>
            </select>
            <select class="js-county-selector" name="area_code" data-code="" v-model="districtValue">
              <option value="-1">选择地区</option>
              <option v-for="district in districtList" :value="district.value">{{district.label}}</option>
            </select>
          </div>
        </div>
        <div class="block-item">
          <label>详细地址</label>
          <input type="text" placeholder="街道门牌信息" name="address_detail" v-model.trim="address" maxlength="100">
        </div>
      </div>
    </div>
    <div class="block section js-save block-control-btn" @click="add">
      <div class="block-item c-blue center">保存</div>
    </div>
    <div class="block section js-delete  block-control-btn" v-show="type === 'edit'" @click="remove">
      <div class="block-item c-red center">删除</div>
    </div>
    <div class="block stick-bottom-row center js-save-default" v-show="type === 'edit'" @click="setDefault">
      <button class="btn btn-standard js-save-default-btn">设为默认收货地址</button>
    </div>
  </div>
</template>

<script>
import Address from 'js/addressService.js';

export default {
  data() {
    return {
      name: '',
      tel: '',
      provinceValue: -1,
      cityValue: -1,
      districtValue: -1,
      address: '',
      id: '',
      type: '',
      instance: null,
      addressData: require('js/address.json'),
      cityList: null,
      districtList: null
    }
  },
  created() {
    let query = this.$route.query
    // console.log(query);
    this.type = query.type;
    this.instance = query.instance;
    if(this.type === 'edit') {
      let addressEdit = this.instance;
      this.provinceValue = parseInt(addressEdit.provinceValue)
      this.name = addressEdit.name;
      this.tel = addressEdit.tel;
      this.address = addressEdit.address;
      this.id = addressEdit.id;
    }
  },
  methods: {
    add(){
      //需要做非空与合法性校验
      let {name,tel,provinceValue,cityValue,districtValue,address} = this;
      let data = {name,tel,provinceValue,cityValue,districtValue,address}
      // console.log(data);
      if(this.type === 'add') {
        // Address.add(data).then(res => {
        //   // this.$router.go(-1); //路由回跳到上一层
        //   this.$router.push({name: 'all'})
        // })
        this.$store.dispatch('addAction', data)
      }
      if(this.type === 'edit') {
        data.id = this.id;
        // Address.update(data).then(res => {
        //   this.$router.go(-1)
        // })
        this.$store.dispatch('updateAction', data)
      }
    },
    remove() {
      if(window.confirm('确认删除吗？')) {
        // Address.remove(this.id).then(res=>{
        //   this.$router.go(-1);
        // })
        this.$store.dispatch('removeAction', this.id)
      }
    },
    setDefault() {
      // Address.setDefault(this.id).then(res=>{
      //   this.$router.go(-1);
      // })
      this.$store.dispatch('setDefaultAction', this.id)
    }
  },
  computed: {
    addressLists(){   //在计算属性中获取Vuex中的state中的数据
      return this.$store.state.addressLists
    }
  },
  watch: {
    // addressLists(){    //监听addressLists变化后，页面返回到所有地址列表
    //   this.$router.go(-1)
    // },
    addressLists: {     //深度监听，
      handler(){
        this.$router.push({name: 'all'})
      },
      deep: true
    },
    provinceValue(newValue, oldValue){      //监听省的value变化
      if(newValue === -1) return;
      let provinceList = this.addressData.list;
      let provinceIndex = provinceList.findIndex(item=>{  //找到选中省的下标index，以此来获取城市的列表
        return item.value === newValue
      })
      // console.log(index);
      this.cityList = provinceList[provinceIndex].children
      // console.log(this.cityList);
      this.cityValue = -1;        //每次重新选择省，则要把市和区还原会未选择状态
      this.districtValue = -1;
      if(this.type === 'edit') {
        this.cityValue = parseInt(this.instance.cityValue);
        // this.districtValue = parseInt(this.instance.districtValue);
      }
    },
    cityValue(newValue, oldValue){    //监听市的value变化
      if(newValue === -1) return;
      let cityList = this.cityList;
      let cityIndex = cityList.findIndex(item=>{    //找到选中市的下标index，以此来获取区的列表
        return item.value === newValue;
      })
      // console.log(cityIndex);
      // console.log(cityList);
      this.districtList = cityList[cityIndex].children;
      this.districtValue = -1;   //每次重新选择省，则要把市和区还原会未选择状态
      if(this.type === 'edit') {
        this.districtValue = parseInt(this.instance.districtValue);
      }
    }
  }
}
</script>

<style lang="css">
</style>
