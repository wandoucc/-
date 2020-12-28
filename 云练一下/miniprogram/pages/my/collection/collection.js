import {
  getwhere,
} from "../../../utils/db.js"
import {
  collection,
  list
} from "../../../utils/tablename.js"

Page({
  data: {
    itemdetail: [],
    url: "/pages/detail/detail",
    pages: 1,
    isShow: true,
    list1: []
  },

  async _collectionlist() {
    wx.showLoading({
      title: '获取收藏中~',
    })

    // 获取到都收藏了哪些题 找到对应的second_id
    let r = await getwhere(collection, {
      _openid: wx.getStorageSync('id'),
    },10,
    this.data.pages)

    if(r.data.length==0){
      this.setData({
        isShow:false
      })
      wx.hideLoading({
        success: (res) => {
          wx.showToast({
            title: '没有数据啦~',
            icon:"none",
            mask:true
          })
        },
      })
      return
    }

    r.data.forEach(item => {
      let listdetail = getwhere(list, {
          "second_id": Number(item.second_id)
        })

      this.setData({
        list1:[...this.data.list1,listdetail]
      })
    })

    let rr = await Promise.all(this.data.list1)
    // 回来之后把day中的数据也存一份到 list 中 
    // 还有分页 

    this.setData({
      itemdetail: rr
    })

    wx.hideLoading({
      success: (res) => {
        wx.showToast({
          title: "获取成功",
          mask: true
        })
      },
    })
  },

  onLoad: function () {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    this._collectionlist()
  },

  onReachBottom: function () {
    if (this.data.isShow) {
      this.data.pages++
      this._collectionlist()
    }
  }
})