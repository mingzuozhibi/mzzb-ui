import { UPDATE_SAKURA_DATA } from './constant'

export function updateSakuraData(sakuraLists) {
  return {
    type: UPDATE_SAKURA_DATA,
    data: sakuraLists
  }
}
