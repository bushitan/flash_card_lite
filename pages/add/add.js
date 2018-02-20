// pages/add/add.js
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
        face_title:"",
        back_explain:"",
    },

    inputFaceTitle(e){
        GP.setData({
            face_title : e.detail.value
        })    
    },
    inputBackExplain(e) {
        GP.setData({
            back_explain: e.detail.value
        })    
    },

    // 增加卡片
    add(){
        // 检查空位
        if (GP.data.face_title == "") {
            wx.showToast({
                title: '请输入"生词"',
                icon:'none',
                duration: 1000
            })
            return
        } 
        if (GP.data.back_explain == "") {
            wx.showToast({
                title: '请输入"解释"',
                icon: 'none',
                duration: 1000
            })
            return
        }

        // 时间戳当id
        var timestamp = new Date().getTime() 
        var card_obj = {
            card_id: timestamp,
            is_face: true,
            face_title: GP.data.face_title,
            back_explain: GP.data.back_explain,
            level: STRANGER,
            is_upload:false,
        }
        actionCard.Add(card_obj, STRANGER)

        //成功提示
        wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 1000
        })
        //延时退出
        setTimeout(function () { GP.back()} , 1000)
    },

    //返回上一级
    back() {
        wx.navigateBack({
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        GP = this
        actionCard = new ACTION_CARD.Card(GP, STRANGER)
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})