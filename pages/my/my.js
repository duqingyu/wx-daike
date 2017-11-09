// pages/my/my.js
const AV = require('../../utils/av-live-query-weapp-min.js')
Page({

  data: {
   tologin:'登陆/授权',
   avatar:'../../images/4.png',
   islogin: true,
   name: false,
   username:'',
   gender:'',//用户性别
   neartest:'1',
   result:'',//第二次进入附近的人获得第一次进入的数据
   loading:false,
   disabled:false,
  },
  
  onShow:function(){
    this.setData({
      loading:false,
      disabled:false
    })
  },
  //判断用户是否已经登录过
  onReady:function(){
    var that = this;
    
   wx.getStorage({
     key:'user',   
     success:function(res){
       console.log(res)
       //判断性别
       if(res.data.gender == '1' || res.data.gender == '0'){
          that.setData({
            gender:'../../images/male.png'
          })
       }
       else if(res.data.gender == '2'){
         that.setData({
           gender:'../../images/female.png'
         })
       }
       //设置当前用户头像
       that.setData({
         avatar: res.data.avatarUrl,
         islogin:false,
         username:res.data.nickName,
         name:true
       })
     
     }
   })
  },
  //我发布的订单
  sendlist:function(){
  wx.navigateTo({
    url:'../mysendorder/mysendorder'
  })
  },
  //我接收的订单
  relist: function () {
    wx.navigateTo({
      url: '../myreorder/myreorder'
    })
  },
  //附近的人
  near:function(){
    var that = this;
    that.setData({
      loading: true,
      disabled: true
    })
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        //存储地理位置
        try {
          wx.setStorage({
            key: 'location',
            data: res
          })
        }
        catch (e) {
        }
        //位置
        var point = new AV.GeoPoint(latitude, longitude);
        //用户每次进入附近的人都更新当前地理位置
            //leadcloud
            var near = AV.Object.extend('near');
            var orders = new near();
            orders.set('whereCreated', point);
            orders.set('username',that.data.username)
            orders.set('avatar',that.data.avatar)
            orders.set('gender',that.data.gender)
            orders.save().then(function (res) {
              //查询
              var query = new AV.Query('near');
              query.withinKilometers('whereCreated', point, 100.0);
              query.find().then(function (results) {
                that.setData({
                  result:results
                })
                //结果传递过去附近的人页面
            var model = JSON.stringify(results);
                wx.navigateTo({
                  url: '../nearby/nearby?result='+model
                })     
              }, function (error) {
              });
           
            }, function (error) {
              // 异常处理
              console.log('存储失败！')
            }); 
  
      },
      fail:function(){
        wx.showModal({
          title: '提示',
          content: '必须授权登陆之后才查看附近的人,是否重新授权？',
          confirmText: '是',
          cancelText: '否',
             //二次授权
            success:function(res){
              //如果用户点击'是'允许授权
              if (res.confirm) {
                wx.openSetting({
                  success: (res) => {
                    if (res.authSetting["scope.userLocation"]) {
                      wx.showToast({
                        title: '点击附近即可',
                      })
                    }
                    else {
                      wx.showToast({
                        title: '请重新授权',
                        icon: 'loading'
                      })
                    }
                  }
                })
              }
              //如何用户点击'否'再次拒绝授权
              else if (res.cancel) {
                wx.showToast({
                  title: '授权失败',
                  icon: 'loading'
                })
              }
            },
            fail:function(){

            }
        })
      }
    })
  },
  //登录授权
  Tologin:function(){
    var that = this;
    wx.login({
  success:function(res){
    console.log(res)
         wx.getUserInfo({
            //如果用户同意授权
             success:function(res){
               wx.showToast({
                 title: 'Loading...',
                 duration: 2000,
                 icon: 'loading'
               })
               //设置当前用户头像
              that.setData({
                avatar:res.userInfo.avatarUrl,
                tologin:res.userInfo.nickName
              })
               //获得用户数据存储
                try{
                   wx.setStorage({
                     key:'user',
                     data:res.userInfo
                   })
                 }
                 catch(e){

                 }
             },
             //如果用户拒绝授权
            fail:function(){
              //弹框提示
              wx.showModal({
                title: '提示',
                content: '必须授权登陆之后才能操作,是否重新授权？',
                confirmText:'是',
                cancelText:'否',
               //二次授权
               success:function(res){
                 //如果用户点击'是'允许授权
                 if(res.confirm){
                   wx.openSetting({
                     success: (res) => {
                      if(res.authSetting["scope.userInfo"]){
                        wx.showToast({
                          title: '点击登陆即可',
                        })
                      }
                      else{
                        wx.showToast({
                          title: '请重新授权',
                          icon:'loading'
                        })
                      }
                     }
                   })
                 }
                 //如何用户点击'否'再次拒绝授权
                else if(res.cancel){
                   wx.showToast({
                     title: '授权失败',
                     icon:'loading'
                   })
                }
               } 
              })
           
            },
         })
      },
    })
   }

})