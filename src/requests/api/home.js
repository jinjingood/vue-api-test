import service from ".."; //..表示request下的index.js文件

//首页轮播图api
export const getBanner = () => {
  return service({
    method: "GET",
    url: "banner?type=2",
  });
};

//推荐歌单api
export const getPersonalized = () => {
  return service({
    method: "GET",
    url: "personalized",
  });
};

//获取歌单详情
export function getPlaylist(data) {
  //另一种写法
  return service({
    method: "GET",
    url: `playlist/detail?id=${data}`, //注意必须用反引号，不然报400，无法获取。反引号是数字1左边那个键
  });
}

//获取歌单详情里的全部歌曲
export const getAllMusic = (data) => {
  return service({
    method: "GET",
    url: `song/detail?ids=${data}`,
  });
};

//获取单个歌曲url
export const getSongdetail = (data) => {
  return service({
    method: "GET",
    url: `song/detail?ids=${data}`,
  });
};

//获取歌词
export const getLyrics = (data) => {
  return service({
    method: "GET",
    url: `lyric?id=${data}`,
  });
};
