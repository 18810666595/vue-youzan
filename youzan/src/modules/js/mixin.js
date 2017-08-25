import bottomNav from 'components/bottom-nav.vue';


let mixin = {
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
        priceArr[1] = priceArr[1].slice(0, 2);
      };
      let priceStr = priceArr.join('.') //把价格字符串的整数和小数部分用'.'拼接
      return priceStr;
    }
  },
  components: {
    bottomNav
  }
}

export default mixin;
