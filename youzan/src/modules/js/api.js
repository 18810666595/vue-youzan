let url = {
  hotLists: '/index/hotLists'
}

//开发环境和真实环境的切换
let host = 'http://rapapi.org/mockjsdata/23334';

for (let key in url) {
  if (url.hasOwnProperty(key)) {
    url[key] = host + url[key]
  }
}

export default url
