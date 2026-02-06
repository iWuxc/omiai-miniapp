// 提醒相关 API
import http from '@/utils/request'

/**
 * 获取提醒列表
 */
export function getReminderList(params) {
  return http.get('/reminders/list', { params })
}

/**
 * 获取今日提醒
 */
export function getTodayReminders() {
  return http.get('/reminders/today')
}

/**
 * 获取待处理提醒
 */
export function getPendingReminders() {
  return http.get('/reminders/pending')
}

/**
 * 获取提醒统计
 */
export function getReminderStats() {
  return http.get('/reminders/stats')
}

/**
 * 标记提醒为已读
 */
export function markReminderAsRead(id) {
  return http.post('/reminders/read', { id })
}

/**
 * 标记提醒为已完成
 */
export function markReminderAsDone(id) {
  return http.post('/reminders/done', { id })
}

/**
 * 删除提醒
 */
export function deleteReminder(id) {
  return http.delete('/reminders/delete', { params: { id } })
}
