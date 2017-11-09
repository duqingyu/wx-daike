const AV = require('../../utils/av-live-query-weapp-min.js')
Page({
  data:{
  dologin: false,
  neverlogin: true,
  reusername:'',//接单者的名字
  reavatar:'',//接单者的头像
  list:[],//快递数据
  list1:[],//快递数据
  currentTab:0,
  containerHeight:'',//放数据容器的高度
  containerHeight2:'',//用于备份快递的高度
  fesh:false,//下拉刷新
  foodlist:'',//外卖数据
  foodlist1: ''//外卖数据
  },
 //顶部导航改变
  bindChange: function (e) {
   
    var that = this;
    that.setData({ currentTab: e.detail.current });
    //点击外卖导航栏
    if(e.detail.current == "1"){
      //只加载状态为未被接单的数据给用户接单
      var query = new AV.Query('foodorder');
      query.equalTo('status', '未被接单');
      query.find().then(function (res) {
        //将最新数据放在最上面
        var data = res.reverse()
        //设置数据
        that.setData({
          foodlist:data,
          foodlist1:data,
          containerHeight: res.length * 170 + 55 + 40
        })
      }).then(function (res) {
        // 更新成功
        console.log('获取所有外卖订单成功')
      }, function (error) {
        // 异常处理
        console.log('获取所有外卖订单失败')
      });
    }
    else if (e.detail.current == "0"){
      that.setData({
        containerHeight:that.data.containerHeight2
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
  onShow:function(){
    var that = this;
    //先判断用户是否授权登陆
    wx.getStorage({
      key:'user',
      success:function(res){
        that.setData({
          dologin:true,
          neverlogin:false,
          reusername:res.data.nickName,
          reavatar:res.data.avatarUrl
        })
      }
    })
    //加载中..
    wx.showToast({
      title: '加载中...',
      duration: 1800,
      icon: 'loading'
    })
    //只加载状态为未被接单的数据给用户接单
    var query = new AV.Query('allorder');
    query.equalTo('status', '未被接单');
    query.find().then(function (res) {
      //将最新数据放在最上面
      var data = res.reverse()
     //设置数据
      that.setData({
        list:data,
        list1:data,
        containerHeight: res.length * 170 + 55 + 40,
        containerHeight2:res.length * 170 + 55 +40      //用于备份快递的高度
      })
    }).then(function (res) {
      // 更新成功
      console.log('获取所有快递订单成功')
    }, function (error) {
      // 异常处理
      console.log('获取所有快递订单失败')
    });
  },

  //搜索过滤
  search:function(e){
    var list1 = this.data.list1;
    var searchlist = this.data.list1;
    var value = e.detail.value;
    var that = this;
          //默认所有内容
      if(value == ""){
        that.setData({
          list:list1
        })
      }
      //搜索内容
     else{ 
       function check(k){
          return k.attributes.school == value;
         }
     var newsearch = searchlist.filter(check)
       that.setData({
         list:newsearch
       })
     }
  },
  //弹框备注
  remark:function(e){
    var remarks = '';
    if (this.data.currentTab == '0')
     { 
      remarks = this.data.list[e.target.id].attributes.remark
      }
     else{
       remarks = this.data.foodlist[e.target.id].attributes.remark
     }
     wx.showModal({
       title: '备注',
       content: remarks,
       success: function (res) {
       
       }
     })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    var that = this;
    if(that.data.currentTab == '0'){
    //刷新状态为未被接单的数据给用户接单
    var query = new AV.Query('allorder');
    query.equalTo('status', '未被接单');
    query.find().then(function (res) {
      //将最新数据放在最上面
      var data = res.reverse()
      //设置数据
      that.setData({
        list: data,
        list1:data,
        fesh: true,
        containerHeight: res.length * 170 + 55 + 40,
        containerHeight2: res.length * 170 + 55 + 40
      })
    }).then(function (res) {
      // 更新成功
      console.log('获取所有订单成功')
    }, function (error) {
      // 异常处理
      console.log('获取所有订单失败')
    });
       }
     else if(that.data.currentTab == '1'){
       console.log(555)
      //刷新状态为未被接单的数据给用户接单
      var query = new AV.Query('foodorder');
      query.equalTo('status', '未被接单');
      query.find().then(function (res) {
        //设置数据
        that.setData({
          foodlist: res,
          foodlist1: res,
          fesh: true,
          containerHeight: res.length * 170 + 55 + 40
        })
      }).then(function (res) {
        // 更新成功
        console.log('获取所有订单成功')
      }, function (error) {
        // 异常处理
        console.log('获取所有订单失败')
      });
     }  
    //刷新显示状态是否显示
    setTimeout(function(){
      wx.stopPullDownRefresh()
      that.setData({
        fesh: false
      })
    },2000)
  },
  //快递-接单
  relist:function(e){
    var that = this;
    //设置自己不能接自己单
     if(that.data.list[e.target.id].attributes.avatar == that.data.reavatar){
      wx.showToast({
        title:'不能接自己单哦',
        icon:'loading'
      })
      return false;
    }
    wx.showModal({
      title:'提示',
      content:'是否确定接单？',
      success:function(res){
        if(res.confirm){
          //获取当前订单的leancloud的id
          var id = that.data.list[e.target.id].id;
          var reusername = that.data.reusername;
          var reavatar = that.data.reavatar
          console.log(reavatar)
          //通过指定id去更新数据
  var cql = 'update allorder set status="订单交易中",'+'reusername='+'"'+reusername+'",'+'reavatar='+'"'+reavatar+'"' + ' where objectId='+'"'+id+'"';
        //console.log(cql)
          AV.Query.doCloudQuery(cql)
            .then(function (data) {
              console.log('数据更新更改，订单交易中')
              wx.showToast({
                title: '接单成功！',
                duration:2000
              })
            }, function (error) {
              // 异常处理
              console.error(error);
            });
        }
        else if(res.cancel){
          console.log('取消接单')
        }
      }
    })
  },
  //外卖-接单
  relist1:function(e){
    var that = this;
    if (that.data.foodlist[e.target.id].attributes.avatar == that.data.reavatar) {
      wx.showToast({
        title: '不能接自己单哦',
        icon: 'loading'
      })
      return false;
    }
    wx.showModal({
      title: '提示',
      content: '是否确定接单？',
      success: function (res) {

      if(res.confirm){
        var id = that.data.foodlist[e.target.id].id;
        var reusername = that.data.reusername;
        var reavatar = that.data.reavatar;
        var cql = 'update foodorder set status="订单交易中",' + 'reusername=' + '"' + reusername + '",' + 'reavatar=' + '"' + reavatar + '"' + ' where objectId=' + '"' + id + '"';
        AV.Query.doCloudQuery(cql)
          .then(function (data) {
            console.log('数据更新更改，订单交易中')
            wx.showToast({
              title: '接单成功！',
              duration: 2000
            })
          }, function (error) {
            // 异常处理
            console.error(error);
          });
      }
      else if(res.cancel){
        console.log('取消接单')
      }

      }
    })
  },
  //搜索过滤
  search1: function (e) {
    var foodlist = this.data.foodlist1;
    var searchlist = this.data.foodlist1;
    var value = e.detail.value;
    var that = this;
    //默认所有内容
    if (value == "") {
      that.setData({
        foodlist: foodlist
      })
    }
    //搜索内容
    else {
      function check(k) {
        return k.attributes.school == value;
      }
      var newsearch = searchlist.filter(check)
      that.setData({
        foodlist: newsearch
      })
    }
  },
})