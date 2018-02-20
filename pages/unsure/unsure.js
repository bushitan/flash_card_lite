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
        level: UNSURE,
    },

    // 翻转卡片
    changeFace(e) {
        var card_id = e.currentTarget.dataset.card_id
        actionCard.ChangeFace(card_id, GP.data.level)
    },

    // 分类或删除
    setLevelOrDelete(e) {
        var itemList = ['栏目：陌生', '栏目：巩固●', '栏目：牢记', "删除"]
        actionCard.OnMenu(e, itemList)
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        GP = this
        actionCard = new ACTION_CARD.Card(GP, GP.data.level)
        if (APP.globalData.isLogin == true)
            GP.onInit(options)
        else
            APP.login(options)
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        if (APP.globalData.isUnsuerChange == true) {
            actionCard.Init()
            APP.globalData.UNSURE = false
            console.log("更新成")
        }
    }   ,
     /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})