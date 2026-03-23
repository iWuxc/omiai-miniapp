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
  },
  // 实名认证
  verifyRealName: (data: { real_name: string, id_card_no: string }) => {
    return uni.request({
      url: '/api/c/profile/verify_realname',
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
  },
  // 谁喜欢我
  getReceivedLikes: () => {
    return uni.request({
      url: '/api/c/interact/received_likes',
      method: 'GET'
    })
  },
  // 互相心动
  getMutualMatches: () => {
    return uni.request({
      url: '/api/c/interact/mutual_matches',
      method: 'GET'
    })
  }
}

export const cPay = {
  // 充值红豆
  recharge: (amount: number) => {
    return uni.request({
      url: '/api/c/pay/recharge',
      method: 'POST',
      data: { amount }
    })
  },
  // 开通VIP
  buyVip: () => {
    return uni.request({
      url: '/api/c/pay/vip',
      method: 'POST'
    })
  },
  // 解锁用户资料
  unlockProfile: (targetId: string | number) => {
    return uni.request({
      url: '/api/c/pay/unlock',
      method: 'POST',
      data: {
        target_client_id: Number(targetId)
      }
    })
  }
}

export const cEvent = {
  // 获取活动列表
  getList: (page = 1, size = 10) => {
    return uni.request({
      url: `/api/c/event/list?page=${page}&size=${size}`,
      method: 'GET'
    })
  },
  // 报名活动
  register: (eventId: number) => {
    return uni.request({
      url: '/api/c/event/register',
      method: 'POST',
      data: {
        event_id: eventId
      }
    })
  }
}
