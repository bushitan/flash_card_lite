// pages/stranger/stranger.js
var APP = getApp()
var API = require('../../utils/api.js');
var KEY = require('../../utils/key.js');
var ACTION_CARD = require('../../action/a_card.js');
var actionCard
var GP
//静态变量
var STRANGER = KEY.STRANGER
var UNSURE = KEY.UNSURE
var SURE = KEY.SURE
var CARD_LIST = KEY.CARD_LIST

Page({
    /**
     * 页面的初始数据
     */
    data: {
        tagList:[
            {
                tag_name:"四六级",
            }
        ],
        tagIndex :0,
    },

    // 翻转卡片
    changeFace(e) {
        var card_id = e.currentTarget.dataset.card_id
        actionCard.ChangeFace(card_id, GP.data.level)
    },

    toAddPage() {
        wx.navigateTo({
            url: '../add/add',
        })
    },
    // 分类或删除
    add(e) {
        var card_id = e.currentTarget.dataset.card_id
        var face_title = e.currentTarget.dataset.face_title
        var back_explain = e.currentTarget.dataset.back_explain

        if (actionCard.Exist(card_id) == true){
            wx.showToast({
                title: '已经添加',
                icon: 'loading',
                duration: 500
            })
            return
        }
            
        // 时间戳当id
        var timestamp = new Date().getTime()
        var card_obj = {
            card_id: card_id,
            is_face: true,
            face_title: face_title,
            back_explain: back_explain,
            level: STRANGER,
            is_upload: false,
        }
        actionCard.Add(card_obj, STRANGER)
        //成功提示
        wx.showToast({
            title: '添加至"陌生"栏',
            icon: 'success',
            duration: 500
        })

        wx.setStorageSync(KEY.MODE_SHOW_UPADTE, true)
    },



    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        GP = this
        actionCard = new ACTION_CARD.Card(GP, null)

        //临时方法
        GP.setData({
            coverList: []
        })
        GP.onInit()  //获取生词库

        wx.setNavigationBarTitle({
            title: "生词库"
        })

        if ( wx.getStorageSync(KEY.FIRST_IN_ADD) != true )
            wx.showModal({
                title: '小提示',
                content: '点击卡片，可添加至"陌生"栏目',
                showCancel:false,
                confirmText:"知道了",
                success:function(res){
                    if (res.confirm) {
                        wx.setStorageSync(KEY.FIRST_IN_ADD,true)
                    } 
                },
            })

        // if (APP.globalData.isLogin == true)
        //     GP.onInit(options)
        // else
        //     APP.login(options)
    },

    onInit(){
        wx.request
        ({
            url: API.CARD_ALL,
            method: "POST",
            header:{
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                console.log(res)
                GP.setData({
                    coverList: res.data.card_list
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
    }
})