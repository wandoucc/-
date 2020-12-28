
App({
  onLaunch: function () {
    wx.cloud.init({
      env: 'test-xyz2q',
      traceUser: true,
    })
  }
})