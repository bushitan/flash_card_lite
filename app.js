//app.js
var API = require('utils/api.js');
var KEY = require('utils/key.js');
var GP
App({
    KEY:{  //storageKey

    },
    globalData:{
        windowWidth:null,
        windowHeight:null,
        isLogin: false,
        // 三个级别的页面是否有改变，level改变时触发
        isStrangerChange: false,
        isUnsuerChange: false,
        isSureChange: false,
    }, 
    setLevelChange(current_level) {
        if (current_level == KEY.STRANGER)
            GP.globalData.isStrangerChange = true
        if (current_level == KEY.UNSURE)
            GP.globalData.isUnsuerChange = true
        if (current_level == KEY.SURE)
            GP.globalData.isSureChange = true
    },

    onLaunch: function () {
        GP = this        
        wx.getSystemInfo({
            success: function (res) { //设置屏幕宽/高
                GP.globalData.windowWidth = res.windowWidth
                GP.globalData.windowHeight = res.windowHeight
                console.log(res.windowWidth,res.windowHeight,res.pixelRatio)
          }
        })
    },

    // App登陆
    login:function(option){
        return
        console.log("session:", wx.getStorageSync('session') )
        wx.login
        ({
            success: function (res) 
            {
              var _session = wx.getStorageSync('session') 
              if (! _session  ) //检查session,不存在，为false
                    _session = "false"
              var url = API.USER_LOGIN
              console.log(res.code)
              wx.request
              ({  
                    url: url, 
                    method:"GET",
                    data:{
                        js_code:res.code,
                        session:_session,
                    },
                    success: function(res)
                    {
                        GP.NetSuccess(res)                             
                    },
                    fail:function(res) { 
                        GP.NetFail(res)
                    },
              })
            }
        });
    },

    NetSuccess(res){
        console.log("success:")
        console.log(res)
        wx.setStorageSync('session', res.data.session) //存储session
        getCurrentPages()[0].onInit(option) //Todo 初始化页面、目录
        GP.globalData.isLogin = true //登陆成功
    },

    NetFail(res){
        wx.showModal({
            title: '网络连接失败，是否重新登陆？',
            content: '请确认网络是否正常',
            confirmText: "重新登陆",
            success: function (res) {
                if (res.confirm) {
                    GP.login()
                }
            }
        })
    }
})

// "window":{
//     "backgroundTextStyle":"light",
//         "navigationBarBackgroundColor": "#fff",
//             "navigationBarTitleText": "翻牌背单词",
//                 "navigationBarTextStyle":"white",
//                     "enablePullDownRefresh":"false",
//                         "navigationStyle": "custom"
// },
// "tabBar": {
//     "backgroundColor":"#fff",
//         "color":"#bbb",
//             "selectedColor":"#000",
//                 "borderStyle":"white",
//                     "list": [
//                         {
//                             "pagePath": "pages/bank/bank",
//                             "text": "生词库"
//                         }, {
//                             "pagePath": "pages/stranger/stranger",
//                             "text": "陌生"
//                         },
//                         {
//                             "pagePath": "pages/unsure/unsure",
//                             "text": "巩固"
//                         },
//                         {
//                             "pagePath": "pages/sure/sure",
//                             "text": "牢记"
//                         },
//                         {
//                             "pagePath": "pages/my/my",
//                             "text": "小技巧"
//                         }]
// },