// components/common/userItem/userItem.js

var KEY = require('../../utils/key.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    userItem: {
        type: Object,
        value: {},
    },
    level: {
        type: Number,
        value: KEY.STRANGER,
        observer: '_changeLevel',
    },
    cardNum: {
        type: Number,
        value: 0,
        observer: '_changeCardNum',
    },
  },

  /**
   * 组件的初始数据
   */
    data: {

        STRANGER: KEY.STRANGER,
        UNSURE: KEY.UNSURE,
        SURE: KEY.SURE,

        level: KEY.STRANGER,
        cardNum:1,

        startLeft: 0,//滑动j开始left
        endLeft: 1, //滑动结束left
        startTop: 0, //记录上下偏移量，如果角度小于30度才算左右滑动
        endTop: 0,//记录上下偏移量
        offsetLeft: 0, //记录上一次的偏移量
        nowLeft: 0, //实时left偏移量
        isClick: true, //是单击还是滑动（不需要了）
        transitonDone: false, //过渡效果
        checked:false,
        isLock:false,
     },

  /**
   * 组件的方法列表
   */
  methods: {
    initData: function () {
      this.setData({
        startLeft: 0,
        endLeft: 1,
        startTop:0,
        endTop:0,
        offsetLeft: 0,
        nowLeft: 0,
        isClick: true,
        checked:false
      })
    },

    // 改变等级
    _changeLevel(newVal, oldVal){
        console.log(newVal, oldVal)
        this.setData({
            level:newVal
        })
    },

    _changeCardNum(newVal, oldVal){
        this.setData({
            cardNum: newVal,
        })
    },

    touchClick(e) {
        console.log("click")
        this.triggerEvent('touchClick', this.properties.userItem);
    },

    touchstartFn:function(e){
        this.setData({
            startLeft: e.touches[0].clientX,
            startTop: e.touches[0].clientY,
            isClick: true,
            transitonDone: false,
            checked: true
        })
    },
    touchmoveFn: function (e) {
        this.setData({
            isClick: false
        })
        let vx = e.touches[0].clientX - this.data.startLeft; //相对起始点X距离
        let vy = e.touches[0].clientY - this.data.startTop; //相对起始点Y距离
        this.setData({
            nowLeft: vx 
        })
        return 
    },
    touchendFn: function (e) {
        let id = this.properties.userItem.personId;

        let left = this.data.nowLeft;
        let inLeft = this.data.offsetLeft <= 0;

        var hack = this
        var moveRange = 50
        if (left > -moveRange && left <=0) 
            left = 0
        if (left > 0 && left < moveRange  )
            left = 0
        if (left <= -moveRange) {
            left = -1000
            setTimeout(function () {
                hack.triggerEvent('leftEvent', hack.properties.userItem);
                hack.reset()
            }, 500)
        }
        if (left >= moveRange){
            left = 1000
            setTimeout(function () {
                hack.triggerEvent('rightEvent', hack.properties.userItem);
                hack.reset()
            }, 500)
        }
        this.setData({
            startLeft: 0,
            endLeft: 0,
            offsetLeft: left,
            nowLeft: left,
            transitonDone: true,
            checked:false
        })

    },

    

    reset(){
        this.setData({
            startLeft: 0,
            endLeft: 1,
            startTop: 0,
            endTop: 0,
            offsetLeft: 0,
            nowLeft: 0,
            isClick: true,
            checked: false,
            transitonDone: false,
        })
    },
    editUser: function (e) {
      this.initData()
      wx.navigateTo({
        url: '/pages/contact/contactAdd/contactAdd?id=' + this.properties.userItem.personId,
      })
      //console.log(e.currentTarget.dataset.id)
    },

    deletEvent: function () {
      this.initData()
      this.triggerEvent('deletEvent', this.properties.userItem);
    },

  }
})
