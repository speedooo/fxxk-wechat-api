"use strict"

module.exports = function(app, options){
  var path = require('path');

  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');


  /**
    Authorization entry point

    appid	是	公众号的唯一标识
    redirect_uri	是	授权后重定向的回调链接地址，请使用urlencode对链接进行处理
    response_type	是	返回类型，请填写code
    scope	是	应用授权作用域，snsapi_base （不弹出授权页面，直接跳转，只能获取用户openid），
          snsapi_userinfo （弹出授权页面，可通过openid拿到昵称、性别、所在地。并且，
          即使在未关注的情况下，只要用户授权，也能获取其信息）
    state	否	重定向后会带上state参数，开发者可以填写a-zA-Z0-9的参数值，最多128字节
    #wechat_redirect	是	无论直接打开还是做页面302重定向时候，必须带此参数
   */
  app.use("/connect/oauth2/authorize", function(req, res, next){
    var appid = req.query.appid
      , redirect_uri = req.query.redirect_uri
      , response_type = req.query.response_type
      , scope = req.query.scope /* snsapi_base or snsapi_userinfo */
      , state = req.query.state;


    if(scope === 'snsapi_userinfo'){
      return res.render("authorize", { redirect_uri: redirect_uri, appid: appid, state: state, provider: "猎户座网络科技" });
    }else{
      return res.redirect(redirect_uri);
    }
  });
}
