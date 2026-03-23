export const cAuth = {
  // C端微信登录
  wxLogin: (data: { code: string }) => {
    return uni.request({
      url: '/api/c/auth/wx_login',
      method: 'POST',
      data
    })
  }
}

export const cProfile = {
  // 获取当前C端用户资料
  getMine: () => {
    return uni.request({
      url: '/api/c/profile/mine',
      method: 'GET'
    })
  },
  // 更新资料
  updateMine: (data: any) => {
    return uni.request({
      url: '/api/c/profile/update',
      method: 'POST',
      data
    })
  }
}

export const cRecommend = {
  // 获取每日推荐
  getDaily: () => {
    return uni.request({
      url: '/api/c/recommend/daily',
      method: 'GET'
    })
  },
  // 获取详情和AI匹配度
  getDetail: (id: string | number) => {
    return uni.request({
      url: `/api/c/recommend/detail/${id}`,
      method: 'GET'
    })
  }
}

export const cInteract = {
  // 右滑心动
  like: (targetId: string | number) => {
    return uni.request({
      url: '/api/c/interact/like',
      method: 'POST',
      data: {
        target_client_id: Number(targetId)
      }
    })
  }
}
