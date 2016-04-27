"use strict"

let request = require('supertest')
  , cookieParser 	= require('cookie-parser')
  , bodyParser = require("body-parser")
  , express = require('express')
  , should  = require('chai').should
  , expect  = require('chai').expect
  , app     = express();



app.use(cookieParser());
app.use(bodyParser());

let wechat = express();
app.use("/wechat", wechat);

let fxxkWechat = require("../lib");

fxxkWechat(wechat, { });

describe("参数有效性", function(){
  it("授权接口的state参数长度应该小于128个字节", function(done){
    var wrongState = "";
    for(var i = 0; i < 129; i++){
      wrongState += "a";
    }
    console.log(wrongState);

    request(app)
      .get('/wechat/connect/oauth2/authorize')
      .query({
        appid: "abc1234567890"
         , redirect_uri: "http://wwww.baidu.com"
         , response_type: "code"
         , scope : "snsapi_userinfo" /* snsapi_base or snsapi_userinfo */
         , state : wrongState
      })
      .expect(500)
      .expect(function(res){
        console.log(res.body);
      })
      .end(done);
  });
});

describe("微信授权模拟API-非静默授权", function(){
  it("应该返回授权网页", function(done){
    request(app)
      .get('/wechat/connect/oauth2/authorize')
      .query({
        appid: "abc1234567890"
         , redirect_uri: "http://wwww.baidu.com"
         , response_type: "code"
         , scope : "snsapi_userinfo" /* snsapi_base or snsapi_userinfo */
         , state : "1234567890"
      })
      .expect(200)
      .expect(function(res){
        console.log(res.body);
      })
      .end(done);
  });

  it("应该在点击授权按钮后重定向到回调地址", function(done){
    request(app)
      .post('/wechat/connect/oauth2/authorize')
      .send({
        appid: "abc1234567890"
         , redirect_uri: "http://wwww.baidu.com"
         , response_type: "code"
         , scope : "snsapi_userinfo" /* snsapi_base or snsapi_userinfo */
         , state : "1234567890"
      })
      .expect(302)
      .expect(function(res){
        console.log(res.headers);
      })
      .end(done);
  });
});
//
// describe("微信授权模拟API-静默授权", function(){
//   it("应该重定向", function(done){
//
//   });
// });
