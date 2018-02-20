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
        level: STRANGER,
        itemData:[
            {id:1,left:200,},
        ],
    },


    // 翻转卡片
    changeFace(e) {
        var card_id = e.currentTarget.dataset.card_id
        actionCard.ChangeFace(card_id,GP.data.level)
    },
    // 分类或删除
    setLevelOrDelete(e) {
        var itemList = ['栏目：陌生●', '栏目：巩固', '栏目：牢记', "删除"]
        actionCard.OnMenu(e, itemList)
    },

    addCard(){
        wx.navigateTo({
            url: '../add/add',
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
        })
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



    showDialog() {
        this.dialog.showDialog();
    },

    //取消事件
    _cancelEvent() {
        console.log('你点击了取消');
        this.dialog.hideDialog();
    },
    //确认事件
    _confirmEvent() {
        console.log('你点击了确定');
        this.dialog.hideDialog();
    },


    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

        this.dialog = this.selectComponent("#dialog");
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        if (APP.globalData.isStrangerChange == true){
            actionCard.Init()
            APP.globalData.isStrangerChange = false
            console.log("更新成")
        }
            
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
    
    },







    touchS: function (e) {  // touchstart
        let startX = App.Touches.getClientX(e)
        startX && this.setData({ startX })
    },
    touchM: function (e) {  // touchmove
        let itemData = App.Touches.touchM(e, this.data.itemData, this.data.startX)
        itemData && this.setData({ itemData })

    },
    touchE: function (e) {  // touchend
        const width = 150  // 定义操作列表宽度
        let itemData = App.Touches.touchE(e, this.data.itemData, this.data.startX, width)
        itemData && this.setData({ itemData })
    },
    itemDelete: function (e) {  // itemDelete
        let itemData = App.Touches.deleteItem(e, this.data.itemData)
        itemData && this.setData({ itemData })
    },
})








// coverList: [
//     {
//         card_id: 1,
//         is_face: true,
//         face_title: "face",
//         back_explain: "脸部",
//         back_des: "正面、前方",
//         level: 1,
//     },
//     {
//         card_id: 2,
//         is_face: true,
//         face_title: "back",
//         back_explain: "背后",
//         back_des: "背面",
//         level: 2,
//     },
//     {
//         card_id: 3,
//         is_face: true,
//         face_title: "power point",
//         back_explain: "PPT",
//         back_des: "微软的产品",
//         level: 1,
//     },
//     {
//         card_id: 4,
//         is_face: true,
//         face_title: "navigate",
//         back_explain: "导航",
//         back_des: "",
//         level: 1,
//     }
// ]