// pages/mysendorder/mysendorder.js
const AV = require('../../utils/av-live-query-weapp-min.js')
Page({

  data: {
  mysendorder:'',//快递数据
  mysendorder1:'',//外卖数据
  avatar:'',//方便查询和刷新数据
  username:'',
  currentTab:0,
  containerHeight: '',//放数据容器的高度
  containerHeight1: '',//放数据容器的高度
  },
  //顶部导航改变
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
    //点击外卖导航栏
    if (e.detail.current == "1") {
      //只加载状态为未被接单的数据给用户接单
      var query = new AV.Query('foodorder');
      query.equalTo('avatar',that.data.avatar);
      query.find().then(function (res) {
        //将最新的数据放在最上面
        var data = res.reverse();
        //设置数据
        that.setData({
          mysendorder1: data,
          containerHeight:res.length * 480
        })
      }).then(function (res) {
        // 更新成功
        console.log('获取所有外卖订单成功')
      }, function (error) {
        // 异常处理
        console.log('获取所有外卖订单失败')
      });
    }
    else if (e.detail.current == "0") {
       that.setData({
         containerHeight:that.data.containerHeight1
       })
    }


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
  onReady: function () {
     var that = this;
     //加载中..
     wx.showToast({
       title: '加载中...',
       duration: 2000,
       icon: 'loading'
     })
    wx.getStorage({
      key:'user',
      success:function(res){
      var avatar = res.data.avatarUrl;
      that.setData({
        username:res.data.nickName
      })
      //根据唯一头像查询
      that.getdata(avatar);
      }
    })
  },
  //获取数据-刷新数据-快递
   getdata:function(avatar){
     var that = this;
     //快递订单
     var query = new AV.Query('allorder');
     query.equalTo('avatar', avatar);
     query.find().then(function (results) {
       //将最新发布的订单放在最上面
       var data = results.reverse();
       that.setData({
         mysendorder: data,
         containerHeight:results.length * 480,
         containerHeight1:results.length * 480,
         avatar:avatar
       })
     }, function (error) {
     });
   },
   //获取数据-刷新数据-外卖
  // getdata1: function (avatar) {
   //  var that = this;
    // //快递订单
    // var query = new AV.Query('foodorder');
    // query.equalTo('avatar', avatar);
    // query.find().then(function (results) {
      // that.setData({
      //   mysendorder1: results,
      // })
    // }, function (error) {
    // });
   //},
  //结单-快递
  tojiedan: function (e) {
    var that = this;
    if (that.data.mysendorder[e.target.id].attributes.status != "订单交易中"){
      wx.showModal({
        title:'Hi,'+that.data.username,
        content:'只有交易中的订单才能结单哦'
      })
       return false;
    }
    wx.showModal({
      title: '提示',
      content: '是否确定结单？',
      success:function(res){
        if(res.confirm){
             //确定结单
          //获取相应唯一id去更改状态
          var id = that.data.mysendorder[e.target.id].id
          var cql = 'update allorder set status="订单已完成" where objectId =' + '"' + id + '"';
          AV.Query.doCloudQuery(cql)
            .then(function (data) {
              console.log('数据更新更改，订单已完成')
              wx.showToast({
                title: '订单已完成！',
                duration: 2000
              })
              that.getdata(that.data.avatar);
            }, function (error) {
              // 异常处理
              console.error(error);
            });
        }
        else if(res.cancel){
         console.log('取消结单')
        }
      }
    })
  },
  //撤销订单-快递
  revoke:function(e){
 console.log(e)
 var that = this;
       //只有未被接单的单子才能被撤销订单
 if (that.data.mysendorder[e.target.id].attributes.status != "未被接单") {
   wx.showModal({
     title: 'Hi,' + that.data.username,
     content: '只有未被接单的订单才能撤销订单哦'
   })
   return false;
 }
   wx.showModal({
     title: 'Hi,' + that.data.username,
     content:'是否确定撤销订单?',
     success:function(res){
       //确定撤销订单
      if(res.confirm){
        var id = that.data.mysendorder[e.target.id].id;
        AV.Query.doCloudQuery('delete from allorder where objectId=' + '"' + id + '"').then(function () {
          console.log('快递-撤销订单成功')
          wx.showToast({
            title: '订单已撤销'
          })
        }, function (error) {
          // 异常处理
        });
      }
 else if(res.cancel){
   console.log('外卖-取消撤销订单')
 }
     }
   })
  },
  //结单-外卖
  tojiedan1: function (e) {
    var that = this;
    if (that.data.mysendorder1[e.target.id].attributes.status != "订单交易中") {
      wx.showModal({
        title: 'Hi,' + that.data.username,
        content: '只有交易中的订单才能结单哦'
      })
      return false;
    }
    wx.showModal({
      title: '提示',
      content: '是否确定结单？',
      success: function (res) {
        if (res.confirm) {
          //确定结单
          //获取相应唯一id去更改状态
          var id = that.data.mysendorder1[e.target.id].id
          var cql = 'update foodorder set status="订单已完成" where objectId =' + '"' + id + '"';
          AV.Query.doCloudQuery(cql)
            .then(function (data) {
              console.log('数据更新更改，订单已完成')
              wx.showToast({
                title: '订单已完成！',
                duration: 2000
              })
              that.getdata1(that.data.avatar);
            }, function (error) {
              // 异常处理
              console.error(error);
            });
        }
        else if (res.cancel) {
          console.log('取消结单')
        }
      }
    })
  },
  //撤销订单-外卖
  revoke1: function (e) {
    var that = this;
    //只有未被接单的单子才能被撤销订单
    if (that.data.mysendorder1[e.target.id].attributes.status != "未被接单") {
      wx.showModal({
        title: 'Hi,' + that.data.username,
        content: '只有未被接单的订单才能撤销订单哦'
      })
      return false;
    }
    wx.showModal({
      title: 'Hi,' + that.data.username,
      content: '是否确定撤销订单?',
      success: function (res) {
        //确定撤销订单
        if (res.confirm) {
          var id = that.data.mysendorder1[e.target.id].id;
          AV.Query.doCloudQuery('delete from foodorder where objectId=' + '"' + id + '"').then(function () {
            console.log('外卖-撤销订单成功')
            wx.showToast({
              title:'订单已撤销'
            })
          }, function (error) {
            // 异常处理
          });
        }
        else if (res.cancel) {
          console.log('外卖-取消撤销订单')
        }
      }
    })
  },
  tomap:function(e){
    var currentTab = this.data.currentTab
    if(currentTab == 0){
      var id = this.data.mysendorder[e.target.id].id;
      wx.navigateTo({
        url: '../lookmap/lookmap?id=' + id + '&currentTab=' + currentTab,
      })
    }
    else if(currentTab == 1){
      var id = this.data.mysendorder1[e.target.id].id;
      wx.navigateTo({
        url: '../lookmap/lookmap?id=' + id + '&currentTab=' + currentTab,
      })
    }
  },
})