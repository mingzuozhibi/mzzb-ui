import request from '../utils/request'

export default {
  listSakura(discColumns) {
    return request(`/api/sakuras?discColumns=${discColumns.join(',')}`)
  }
}
