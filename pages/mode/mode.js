// pages/mode/mode.js
var APP = getApp()
var API = require('../../utils/api.js');
var KEY = require('../../utils/key.js');
var ACTION_CARD = require('../../action/a_card.js');
var actionCard
var GP
//静态变量
// var CARD_LIST = KEY.CARD_LIST

Page({

    /**
     * 页面的初始数据
     */
    data: {
        STRANGER : KEY.STRANGER,
        UNSURE : KEY.UNSURE,
        SURE : KEY.SURE,
        currentLevel: KEY.STRANGER, //当前模式等级
        currentLevelItemList: ['陌生●', '巩固', '牢记'], //当前模式的选择菜单
        storageCardList:[], //总共的单词
        cardList:[], //当前模式的单词   0,是第一张 ； 1是第二张
        firstCard:null,
        cardIndex:0,
        stepNum:0,
        // secondeCard:{},
    },

    clickYes() {
        actionCard.clickYes()
        // GP.setData({ stepNum: GP.data.stepNum + 1})
    },
    clickNo() { 
        // actionCard.changeLevel(GP.data.cardIndex, KEY.UNSURE)
        actionCard.clickNo()
        // GP.setData({ stepNum: GP.data.stepNum + 1 })
        // console.log("no")
    },
    clickDelete(){
        // console.log("delete")
        wx.showModal({
            title: '删除请确定',
            success: function (res) {
                if (res.confirm) {
                    actionCard.deleteCard()
                }
            }
        })
    },
    clickToPageMy() {
        wx.navigateTo({
            url: '/pages/my/my',
        }) 
    },
    clickToPageBank() {
        wx.navigateTo({
            url: '/pages/bank/bank',
        })
     },

    // STRANGER: KEY.STRANGER,
    // UNSURE: KEY.UNSURE,
    // SURE: KEY.SURE,
    // // 改变模式
    clickSetLevel(){
        wx.showActionSheet({
            itemList: GP.data.currentLevelItemList,
            success: function (res) {
                var _currentLevel = ""
                var _currentLevelItemList = []
                if (res.tapIndex == 0){
                    _currentLevel = KEY.STRANGER
                    _currentLevelItemList = ['陌生●', '巩固', '牢记']
                }
                else if (res.tapIndex == 1) {
                    _currentLevel = KEY.UNSURE
                    _currentLevelItemList = ['陌生', '巩固●', '牢记']
                }
                else if (res.tapIndex == 2) {
                    _currentLevel = KEY.SURE
                    _currentLevelItemList = ['陌生', '巩固', '牢记●']
                }
                GP.setData({
                    currentLevel: _currentLevel ,
                    currentLevelItemList: _currentLevelItemList
                })
                actionCard.setLevel(_currentLevel)
                actionCard.Init()
            }
        })
    },

    // 翻转卡片
    changeFace(e) {
        console.log("click face")
        var _firstCard = GP.data.firstCard
        _firstCard.is_face = !_firstCard.is_face
        GP.setData({ 
            firstCard: _firstCard
        })
        // var card_id = e.currentTarget.dataset.card_id
        // actionCard.ChangeFace(card_id, GP.data.level)
    },

    // 删除卡片
    deleteCard(){

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        GP = this 
        actionCard = new ACTION_CARD.Card(GP)
        actionCard.setLevel(KEY.STRANGER)
        actionCard.Init()
      
    },


    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onShow: function () {

        if ( wx.getStorageSync(KEY.MODE_SHOW_UPADTE) == true){
            actionCard.setLevel(KEY.STRANGER)
            actionCard.Init()
            wx.setStorageSync(KEY.MODE_SHOW_UPADTE, false)
        }
 
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