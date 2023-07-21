import axios from "axios";

const service = axios.create({
  //封装axios
  baseURL: "http://localhost:3000/",
  timeout: 3000,
});

export default service; //导出实例

//因为这部分域名是获取api接口时全部都要在前面添加的，所以单独提出来，以便公共获取

// 参考下面：
// axios.get("http://localhost:3000/banner?type=2").then((res) => {
//   console.log("res:" + JSON.stringify(res));
//   state.images = res.data.banners;
//   console.log("state.images:" + state.images);
// });
