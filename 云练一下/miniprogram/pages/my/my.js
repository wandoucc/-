import {
  add,
  getwhere
} from "../../utils/db.js"

import {
  user,
  collection
} from "../../utils/tablename.js"


Page({

  /**
   * 页面的初始数据
   */

  data: {
    show: false,
    image: "",
    name: "",
    id:"",
    _openid:"填写自己的openid",
    list: [{
        icon: "/icon/shengming.png",
        title: "声明",
        path: "./shengming/shengming"
      },
      {
        icon: "/icon/fankui.png",
        title: "反馈",
        path: "./fankui/fankui"
      }, {
        icon: "/icon/zanzhu.png",
        title: "我的收藏",
        path: "./collection/collection"
      },
      // {
      //   icon: "/icon/zanzhu.png",
      //   title: "赞助",
      //   path: "./zanzhu/zanzhu"
      // },
    ],
    admin:[
      {
        icon: "/icon/zanzhu.png",
        title: "添加",
        path: "./edit/edit"
      },
      {
        icon: "/icon/zanzhu.png",
        title: "添加经验",
        path: "./expedit/expedit"
      }
    ]
  },

  async _getUser(res) {

    wx.showLoading({
      title: '请求中~',
    })

    let userinfo = res.detail.userInfo
    // console.log(userinfo)
    // 点击授权之后 进行判断 没有没 cloudID 有的话 就证明 已经 授权了
    // 授权了之后进行本地存储 状态 并且更改 show 的值 
    let openidInfo = await wx.cloud.callFunction({
      name: "Login"
    })

    // 用户的唯一标识
    let _openid = openidInfo.result.openid
    // 添加用户表用户信息
    let isUser = await getwhere(user, {
      _openid
    })
    // 如果用户 是第一次登录的话 那就 将用户信息存储到 user 表S
    if (isUser.data.length == 0) {
     let r = await add(user, {
        userinfo,
      })
      wx.setStorageSync('id', r._openid)
    }else{
      wx.setStorageSync('id', isUser.data[0]._openid)
    }

    // 存储到本地缓存中进行渲染数据

    wx.setStorageSync("image", res.detail.userInfo.avatarUrl);
    wx.setStorageSync("name", res.detail.userInfo.nickName);

    this.setData({
      show: true,
      image: wx.getStorageSync("image"),
      name: wx.getStorageSync("name")
    });

    wx.hideLoading()
    wx.showToast({
      title: '授权成功啦',
    })
    
  },

  clear() {
    wx.clearStorage();
    this.setData({
      show: false,
    });
    wx.showToast({
      title: '退出成功',
    })
  },


  onShow: function() {
    this.setData({
      show: wx.getStorageSync("name") || false,
      image: wx.getStorageSync("image"),
      name: wx.getStorageSync("name"),
      id:wx.getStorageSync("id")
    })
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  }
})