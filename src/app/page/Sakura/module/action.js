import {ACTION_UPDATE_SAKURA} from './constant'

export function updateSakura(data) {
  return {
    type: ACTION_UPDATE_SAKURA,
    data: data
  }
}
