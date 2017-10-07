import axios from 'axios';

function fetch(url, data) {
  return new Promise((resolve, reject) => {
    axios.post(url, data).then(res => {
      // console.log(res);
      // let status = res.data.status
      resolve(res)
      // if (status === 200 || res.status === 200) {
      //   resolve(res)
      // }
      // if (status === 300) {
      //   location.href = 'login.html'
      //   resolve(res)
      // }
      // reject(res)
    }).catch(error => {
      console.log(error);
      reject(error)
    })
  })
}

export default fetch
