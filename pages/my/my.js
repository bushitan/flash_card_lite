

// pages/together/together.js
var API = require('../../utils/api.js');
var KEY = require('../../utils/key.js');
var APP = getApp()
var GP;
var KEY_SESSION = "session"
var KEY_LOGO = "logo"

//历史记录筛选方式
// var ROLE_NORMAL_ID 
// var ROLE_VIP_ID
// var ROLE_SUPER_VIP_ID

// var PAY_MODE_SINGLE = 3;
  
Page({
    data:{

        example: "",
        userInfo:"",

        exampleUrl:"http://img.12xiong.top/help_flash_example_1.gif",
        zanUrl:"http://img.12xiong.top/help_zan_qr.jpg",
        bushitanUrl:"http://img.12xiong.top/help_qr_bushitan.jpg",
    },
    preview_example() {
        wx.previewImage({
            urls: [GP.data.exampleUrl],
        })
    },
    preview_zan() {
        wx.previewImage({
            urls: [GP.data.zanUrl],
        })
    },
    preview_bushitan() {
        wx.previewImage({
            urls: [GP.data.bushitanUrl],
        })
    },
    
    //根据id获取节目信息
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        GP = this
        //更新缓存头像

        var user_info = wx.getStorageSync(KEY.USER_INFO)
        GP.setData({
            userInfo: user_info,
        })

        wx.request
        ({
            url: API.CARD_EXAMPLE,
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                console.log(res)
                GP.setData({
                    example: res.data.example
                })
            },
        })

    },

    clickLogin(){
        wx.getUserInfo({
            success: function (res) {
                var  data = res.userInfo
                var user_info = {
                    nickName: data.nickName,
                    avatarUrl: data.avatarUrl,
                    gender: data.gender, //性别 0：未知、1：男、2：女
                    province: data.province,
                    city: data.city,
                    country: data.country,
                }
                wx.setStorageSync(KEY.USER_INFO, user_info)
                GP.setData({
                    userInfo: user_info,
                })
            },
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: '仅需三分钟，受用一辈子',
            path: '/pages/mode/mode',
        }
    },















    previewImage(e){
        
        wx.previewImage({
            urls: [e.currentTarget.dataset.image_url],
        })
    },
    clockSwitch(e){
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            isOpenClock: e.detail.value
        })
    },
    timeChange(e){
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            time: e.detail.value
        })
    },





    SetUserInfo:() =>{
        wx.getUserInfo({
            success: function (res) {
                var userInfo = res.userInfo
                // var nickName = userInfo.nickName
                // var avatarUrl = userInfo.avatarUrl
                // var gender = userInfo.gender //性别 0：未知、1：男、2：女
                // var province = userInfo.province
                // var city = userInfo.city
                // var country = userInfo.country
                console.log(userInfo)
                wx.setStorageSync(KEY_LOGO, userInfo.avatarUrl)
                GP.setData({
                    logo: userInfo.avatarUrl,
                    name: userInfo.nickName,
                })
                wx.request
                ({
                    url: API.MY_SET_LOGO,
                    method: "GET",
                    data: {
                        session : wx.getStorageSync(KEY_SESSION),
                        logo_url : userInfo.avatarUrl,
                        nick_name : userInfo.nickName,
                    },
                    success: function (res) {
                    },
                    fail: function (res) {
                    },
                })
            },
        })
    },

  //更新用户的浏览记录，用户数据等
  getUserInfo:function(){
    wx.request
    ({  
        url: API.MY_INDEX, 
        method:"GET",
        data:{
            session: wx.getStorageSync(KEY_SESSION),
        },
        success: function(res)
        {
            var object = res.data
            console.log(object)
            if (object.status == "true") //登陆成功
            {
                // console.log(object.user.is_remain)
                var _logo = object.logo
                var _name = object.nick_name
                if (_logo == "" || _logo == undefined || _logo == 'undefined') {
                    // GP.userLogin()
                    _logo = '../../images/click_login.png'
                    _name = ""
                }
                GP.setData({
                    user_id: object.user_id,
                    logo: _logo,
                    name: _name,
                    adList:object.ad_list,
                })
                if (object.is_remain)
                    GP.AlertModal(object.user.level, object.user.vip_time)
                  
            }
            else{

            }        
        },
        fail:function(res) { 
        },
    })
  },
  
  


    userLogin: function () {
        wx.openSetting({
            success: (res) => {
                console.log("授权结果..")
                console.log(res)
                if (!res.authSetting["scope.userInfo"] || !res.authSetting["scope.userLocation"]) {
                    GP.SetUserInfo()
                }
            }
        })
    },
    //必须要登陆以后发起的请求，在这里完成
    onInit:function(option){
        GP.SetUserInfo()  //每一次进来都获取新头像
        GP.getUserInfo()
    },

    onReady:function(){
        // 页面渲染完成
    },
    onShow:function(){
        //   if (APP.globalData.isLogin == true){

            //   GP.getUserInfo()
        //   }
    },

//   onShareAppMessage: function () { 
//       return {
//           title: '叮叮看电视',
//           desc: '百万部视频，叮叮立即看',
//           path: '/pages/ware_out/ware_out?id=' + GP.data.id
//       }
//   },

})