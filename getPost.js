
// import fs from 'fs';
// import path from 'path';
// import request from 'request';
// import axios from 'axios';
const fs = require('fs');
const path = require('path');
const request = require('request');
const axios = require('axios');
var top250 = require('./top250.json')

var moviesPostsDir = __dirname + '/posts';
//     exts     = ['.mkv', '.avi', '.mp4', '.rm', '.rmvb', '.wmv'];

// 获取Top250影片列表
// var getMovieList = function(){
  var getMovieList = function(start,count){
  // return axios.get('http://api.douban.com/v2/movie/top250?start=0&count=100').then(({ data:{subjects} }) => {
    return axios.get(`http://api.douban.com/v2/movie/top250?start=${start}&count=${count}`).then(({ data:{subjects} }) => {
    var mid = [];
    var counter = start;
    
    for(var movie of subjects){
      counter = counter + 1;

      let item = {
        index : counter,
        
        title : movie.title, //'海盗电台'
        original_title: movie.original_title, // The Boat That Rocked
        average : movie.rating.average,
        genres : movie.genres,// 多种类型
        movie_images_url : movie.images.large,
        
        casts: [],
        directors :[],// 多位导演。。。
      };

      movie.casts.forEach(function(el) {
        item.casts.push(el.name);
      });

      movie.directors.forEach(function(el) {
        item.directors.push(el.name);
      });

      
      // 渲染样式 ： 
      /*
        海盗电台（The Boat That Rocked）
        {{ title }}（ {{ original_title }} ）
        [类型："剧情" "喜剧" "音乐"]
        上映年份：2009 
        上映年份： {{ year }}
        海报
        {{ <img src="movie_images_url"> }}
      */
      mid.push(item);
    }
    return(mid);
  })
}


// (async () => {

//     var movieList = await axios.get('http://api.douban.com/v2/movie/top250?start=0&count=100').then(({ data:{subjects} }) => {
//       var mid = [];
//       for(var movie of subjects){
//         mid.push(movie.title);
//       }
//       return(mid);
//     })

//     console.log(movieList);
//   }
// )()

// 经测试，在axios中的return能被直接传递给变量


// 获取海报
var getPoster = function (movieName) {
    let url = `https://api.douban.com/v2/movie/search?q=${encodeURI(movieName)}`;

    return  axios.get(url,{json:true}).then(({data:{subjects}}) => {
      return(subjects[0].images.large);
    })
};

// 保存海报
var savePoster = function (movieName, url) {
    request.get(url).pipe(fs.createWriteStream(path.join(moviesPostsDir, movieName + '.jpg')));
};


(async () => {
  var movieList = top250.slice(99);
  console.log(movieList);
//   fs.writeFile(
//     "foo.json",
//     JSON.stringify(movieList),
//     {
//         flag: "a"
//     },
//     function(){ console.log("done!") }
// )
  // await只能使用在原生语法
  for (var file of movieList) {
    let name = `${file.index}.${file.title}`;

    console.log(`正在获取【${name}】的海报`);
    savePoster(name, await getPoster(name));
  }

  console.log('=== 获取海报完成 ===');
})();


