import {alertError} from './window'

export function requestHandler(workName, {fetchCall, fetchDone}) {
  return async (dispatch) => {
    let result = await fetchCall()
    if (result.success) {
      fetchDone(result.data, dispatch)
    } else {
      alertError(`${workName}异常`, result.message)
    }
  }
}
