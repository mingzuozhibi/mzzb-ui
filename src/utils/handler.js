import {alertError} from './window'

export function requestHandler({fetchCall, fetchDone}) {
  return async (dispatch) => {
    try {
      fetchDone(await fetchCall(), dispatch)
    } catch (err) {
      alertError('网络请求失败', err.message)
    }
  }
}
