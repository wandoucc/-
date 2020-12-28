// pages/my/fankui/fankui.js
import {
  add
} from "../../../utils/db.js"

import {
  fankui
} from "../../../utils/tablename.js"

Page({
  data: {
    information: ""
  },

  async submit(e) {
    if (this.data.information === "") {
      wx.showToast({
        title: "请输入问题",
        image: "/icon/shibai.png",
        mask: true
      })
    } else {
      console.log(this.data.information)
      let r = await add(fankui, {
        "data": this.data.information
      })
      if (r._id) {
        wx.showToast({
          title: "提交成功",
        })
        wx.switchTab({
          url: '/pages/index/index',
        })
      }
    }
  },

  _input(e) {
    if (e.detail.value != "") {
      this.setData({
        information: e.detail.value
      })
    }
  },
  onShow:function(){
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  }
})