// AI分析相关 API
import http from '@/utils/request'

/**
 * AI匹配分析
 * @param {number} clientAId 客户A ID
 * @param {number} clientBId 客户B ID
 */
export function aiAnalyzeMatch(clientAId, clientBId) {
  return http.post('/ai/analyze', {
    client_a_id: clientAId,
    client_b_id: clientBId
  })
}

/**
 * 获取破冰话题
 * @param {number} clientAId 客户A ID
 * @param {number} clientBId 客户B ID
 */
export function getIceBreakerTopics(clientAId, clientBId) {
  return http.post('/ai/ice-breaker', {
    client_a_id: clientAId,
    client_b_id: clientBId
  })
}
