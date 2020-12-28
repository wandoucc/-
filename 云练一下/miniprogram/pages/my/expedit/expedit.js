// pages/my/expedit/expedit.js

import {
  add,
} from "../../../utils/db.js"
import {
  explist
} from "../../../utils/tablename.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    input: "",
    text: ""
  },

  // 标题
  bindinput(e) {
    this.setData({
      input: e.detail.value
    })
  },

  // 输入框
  textinput(e) {
    this.setData({
      text: e.detail.html
    })
  },

  async submit() {
    let time = Number(new Date())
    let day = new Date(time).toLocaleDateString().replace(/\//g, "-")
    
    let data = {
      time: time,
      title: this.data.input,
      textinput: this.data.text,
      day:day
    }
    let r = await add(explist, data)

  }

})