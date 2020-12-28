// pages/detail/detail.js

import {
  getwhere,
  add,
  del
} from "../../utils/db.js"

import {
  collection,
  list,
  user,
  day
} from "../../utils/tablename.js"

Page({

  /**
   * 页面的初始数据
   */

  data: {
    data: {},
    detail: {},
    flag: true,
    top: {},
    isShoucang: false,
    isShoucangTit: false,
    isLogin: false,
    tagStyle:{}
  },

  // 此函数 控制 显示隐藏答案的
  _changeFlag() {
    this.setData({
      flag: false
    })
  },

  async _login(res) {
    wx.showLoading({
      title: '授权中~',
      maks: true
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
        // 收藏字段
        collection: []
      })
      wx.setStorageSync('id', r._openid)
    } else {
      wx.setStorageSync('id', isUser.data[0]._openid)
    }

    // 存储到本地缓存中进行渲染数据

    wx.setStorageSync("image", res.detail.userInfo.avatarUrl);
    wx.setStorageSync("name", res.detail.userInfo.nickName);

    if (wx.getStorageSync('id')) {
      wx.hideLoading({
        success: (res) => {
          this.setData({
            isLogin: false
          })
        },
      })
    }
  },

  async _shouchang() {
    let r = await getwhere(collection, {
      second_id: this.data.detail.second_id,
      _openid: wx.getStorageSync('id')
    })

    if (r.data.length == 1) {
      del(collection, {
        second_id: this.data.detail.second_id
      })
      wx.showLoading({
        title: '取消中~',
        success: function () {
          wx.showToast({
            title: '取消成功',
          })
        }
      })

      this.setData({
        isShoucang: false,
        isShoucangTit: false
      })
      return
    }

    wx.showLoading({
      title: '收藏中~',
    })

    await add(collection, {
      "second_id": this.data.detail.second_id,
      "shouchangtime": Number(new Date())
    })

    wx.hideLoading({
      success: (res) => {
        wx.showToast({
          title: '收藏成功',
          mask: true
        })
        this.setData({
          isShoucang: true,
          isShoucangTit: true
        })
      },
    })
  },

  // 请求 数据库进行获取答案
  async getdetail(second_id) {
    wx.showLoading({
      title: "转圈圈",
      mask: true
    })

    let r = await getwhere(list, {
      "second_id": Number(second_id)
    })

    //控制 转圈圈消失
    if (r) {
      wx.hideLoading()
    }

    if (r.data.length != 0) {
      this.setData({
        detail: r.data[0],
        top: {
          title: r.data[0].type,
          company: r.data[0].company
        }
      })
    }
  },

  // 请求每日数据
  async daydetail(second_id) {
    let r = await getwhere(day, {
      "second_id": Number(second_id)
    })

    this.setData({
      detail: r.data[0],
      top: {
        title: r.data[0].type,
        company: r.data[0].company
      }
    })

  },

  // 上一题
  async red() {
    wx.showLoading({
      title: '转圈圈',
      mask: true
    })

    if (this.data.detail.id == 1) {
      wx.showToast({
        title: '第一题了啊',
        mask: true
      })
      return
    }

    let i = this.data.detail.id
    i = i - 1
    let r = await getwhere(list, {
      id: i,
      fister_id: this.data.detail.fister_id
    }, 0)
    this.setData({
      detail: r.data[0],
      top: {
        title: r.data[0].type,
        company: r.data[0].company
      },
      flag: true,
    })

    wx.hideLoading()
    this._isshouchang()

  },

  //  下一题
  async next() {
    wx.showLoading({
      title: '转圈圈',
      mask: true
    })

    let a = await getwhere(list, {
      fister_id: this.data.detail.fister_id
    }, 0)
    if (this.data.detail.id == a.data.length) {
      wx.showToast({
        title: '最后一题了啊',
        mask: true
      })
      return
    }

    let i = this.data.detail.id
    i = i + 1
    let r = await getwhere(list, {
      id: i,
      fister_id: this.data.detail.fister_id
    }, 0)
    this.setData({
      detail: r.data[0],
      top: {
        title: r.data[0].type,
        company: r.data[0].company
      },
      flag: true,
    })
    wx.hideLoading()
    this._isshouchang()

  },

  async _isshouchang() {
    if (wx.getStorageSync('id') === "") {
      this.setData({
        isLogin: true
      })
      return
    }

    // 获取到用户所有关注的数据 然后进行遍历进行比较
    let r = await getwhere(collection, {
      "_openid": wx.getStorageSync('id')
    }, 0)

    // 进行匹配是否有数据 有数据就证明此用户收藏过了 
    let a = r.data.filter(item => {
      return item.second_id == this.data.detail.second_id
    })

    if (a.length == 0) {
      // 已经收藏的状态
      this.setData({
        isShoucang: false,
        isShoucangTit: false
      })
    } else {
      // 没有收藏的状态
      this.setData({
        isShoucang: true,
        isShoucangTit: true
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    if (options.tt) {
      this.daydetail(options.id)
    } else {
      // 调用进行获取数据的函数
      this.getdetail(options.id)
    }

    var tagStyle = {
      pre: `
            padding:1em 1em 0 1em;
            margin:.5em 0;
            border-radius:0.3em;
            background:#272822;
            color:#f8f8f2;
            line-height: 1.5;
            text-shadow:0 1px rgba(0,0,0,0.3);`,
      code: `
             font-size:85%;
             padding:2px 5px 2px 5px;
             border-radius:2px;`
    }
    
    this.setData({
      tagStyle
    })
  },

  onShow: function () {
    this._isshouchang()
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  }
})