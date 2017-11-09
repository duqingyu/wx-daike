// pages/home/home.js
const unit = require("../../utils/util.js")
const AV = require('../../utils/av-live-query-weapp-min.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
  dologin:false,
  neverlogin:true,
  currentTab: 0,
  containerHeight: '700',//放数据容器的高度
  school:'', //快递-学校
  position: '',//快递-代拿地点
  destin: '',//快递-目的地
  time: '',//快递、课程-发单时间
  phone: '',//快递-手机
  RMB: '',//快递-回报
  remark: '',//快递-备注
  list: [],//快递-快递数据
  avatar: '',//发单人头像
  username: '',//发单人微信名
  reavatar: '../../images/4.png',//默认图片路径
  moneytip:false,//快递-代拿费用提示
  phonetip:false,//快递-手机号码提示
  moneytip1: false,//外卖-代课费用提示
  phonetip1: false,//外卖-手机号码提示
  school1: '', //外卖-学校
  position1: '',//外卖-代拿地点
  destin1: '',//外卖-送达地点
  phone1: '',//外卖-手机
  RMB1: '',//外卖-回报
  remark1: '',//外卖-备注
  },
  onShow:function(){
    var that = this;
   wx.getStorage({
     key:'user',
     success:function(res){
       //获取当前用户头像
       that.setData({
         avatar: res.data.avatarUrl,
         username: res.data.nickName,
         dologin:true,
         neverlogin:false
       })
     },
     fail:function(){
      console.log('用户未授权登录')
     }
   })
  },
  //顶部导航改变
  bindChange: function (e) {

    var that = this;
    that.setData({ currentTab: e.detail.current });

  },
  //点击顶部导航改变
  swichNav: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  }, 
  information:function(e){
  //学校
  if(e.target.id == 'school'){
    this.setData({
      school: e.detail.value
    })
  }
  //代拿地点
  if (e.target.id == 'position') {
    this.setData({
      position: e.detail.value
    })
  }
  //目的地
  if (e.target.id == 'destin') {
    this.setData({
      destin: e.detail.value
    })
  }
  //手机
  if (e.target.id == 'phone') {
    if ((/^1[34578]\d{9}$/.test(e.detail.value))) {
      this.setData({
        phonetip: false
      })
    }
    else {
      this.setData({
        phone:e.detail.value,
        phonetip: true
      })
    }
  }
  //RMB-只能输入数字
  if (e.target.id == 'money') {
    if (isNaN(e.detail.value)) {
      this.setData({
        moneytip: true
      })
    }
    else {
      this.setData({
        RMB:e.detail.value,
        moneytip: false
      })
    }
  }
  //备注
  if(e.target.id == 'remark'){
    this.setData({
      remark: e.detail.value
    })
   
  }
  },
  //提交数据
  sendlist:function(){
    //全都必须要输入
    if (this.data.school == "" || this.data.position == "" || this.data.destin == "" || this.data.phone == "" || this.data.RMB == "" || this.data.remark == ""||this.data.moneytip == true || this.data.phonetip == true){
      wx.showToast({
        title: '信息必须填完',
        image:'../../images/4.png'
      })
      return false;
    }
    
    //发单时间
    let time = unit.formatTime(new Date)
    this.setData({
      time:time
    })
   
     //leadcloud
     var allorder = AV.Object.extend('allorder');  
     var orders = new allorder();
     orders.set('school', this.data.school);
     orders.set('position', this.data.position);
     orders.set('destin', this.data.destin);
     orders.set('time', this.data.time);
     orders.set('phone', this.data.phone);
     orders.set('RMB', this.data.RMB);
     orders.set('avatar', this.data.avatar);
     orders.set('username', this.data.username);
     orders.set('remark',this.data.remark)
     orders.set('sta', '接单')
     orders.set('status','未被接单')
     orders.set('reusername','暂无')
     orders.set('type', '快递')
     orders.set('reavatar',this.data.reavatar)
     orders.save().then(function (res) {
       // 成功保存之后，执行其他逻辑.
     }, function (error) {
       // 异常处理
       console.log('存储失败！')
     }); 
     
    //弹框成功
     wx.showToast({
       title: '发单成功！',
     })
     //重置
  },
    

        //外卖
 information1:function(e){
   //学校
   if (e.target.id == 'school1') {
     this.setData({
       school1: e.detail.value
     })
   }
   //代拿地点
   if (e.target.id == 'position1') {
     this.setData({
       position1: e.detail.value
     })
   }
   //送达地点
   if (e.target.id == 'destin1') {
     this.setData({
       destin1: e.detail.value
     })
   }
   //输入金额只能输入数字
    if(e.target.id == 'money1'){
      if(isNaN(e.detail.value)){
        this.setData({
          moneytip1:true
        })
      }
      else{
        this.setData({
          RMB1:e.detail.value,
          moneytip1:false
        })
      }
    }
   //正确的手机格式
   if(e.target.id == 'phone1'){
    if((/^1[34578]\d{9}$/.test(e.detail.value))){
      this.setData({
        phonetip1: false
      })
    }
    else {
      this.setData({
        phone1:e.detail.value,
        phonetip1: true
      })
    }
   }
   //代课备注
   if (e.target.id == 'remark1') {
     this.setData({
       remark1: e.detail.value
     })
   }
 },
  sendlist1:function(){
    //全都必须要输入
    if (this.data.school1 == "" || this.data.position1 == "" || this.data.absenttime1 == "" || this.data.phone1 == "" || this.data.RMB1 == "" || this.data.remark1 == "" || this.data.moneytip1 == true || this.data.phonetip1 == true) {
      wx.showToast({
        title: '信息须正确填完！',
        image: '../../images/4.png'
      })
      return false;
    }
    //发单时间
    let time = unit.formatTime(new Date)
    this.setData({
      time: time
    })
    
     //leadcloud
    var foodorder = AV.Object.extend('foodorder');
    var orders = new foodorder();
    orders.set('school', this.data.school1);
    orders.set('position', this.data.position1);
    orders.set('destin', this.data.destin1);
    orders.set('time', this.data.time);
    orders.set('phone', this.data.phone1);
    orders.set('RMB', this.data.RMB1);
    orders.set('avatar', this.data.avatar);
    orders.set('username', this.data.username);
    orders.set('remark', this.data.remark1)
    orders.set('sta', '接单')
    orders.set('status', '未被接单')
    orders.set('reusername', '暂无')
    orders.set('type', '外卖')
    orders.set('reavatar', this.data.reavatar)
    orders.save().then(function (res) {
      // 成功保存之后，执行其他逻辑.
    }, function (error) {
      // 异常处理
      console.log('存储失败！')
    }); 
    //弹框成功
    wx.showToast({
      title: '发单成功！',
    })
  },


})