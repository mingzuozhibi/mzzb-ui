import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { RootState } from '../@reducer'
import { Disc } from './@types'

export interface InjectAdminMode {
  isAdminMode: boolean
  setAdminMode: (adminMode: boolean) => void
}

export const injectAdminMode = connect(
  function (state: RootState) {
    return {
      isAdminMode: state.admin.isAdminMode,
    }
  },
  function (dispatch: Dispatch) {
    return {
      setAdminMode(adminMode: boolean) {
        dispatch({ type: 'setAdminMode', adminMode })
      }
    }
  }
)

export interface InjectToAdds {
  toAdds: Disc[]
  pushToAdds: (disc: Disc) => void
  dropToAdds: (disc: Disc) => void
  fetchCount?: number
  setFetchCount: (fetchCount: number) => void
}

export const injectToAdds = connect(
  function (state: RootState) {
    return {
      toAdds: state.admin.toAdds,
      fetchCount: state.admin.fetchCount,
    }
  },
  function (dispatch: Dispatch) {
    return {
      pushToAdds(disc: Disc) {
        dispatch({ type: 'pushToAdds', disc })
      },
      dropToAdds(disc: Disc) {
        dispatch({ type: 'dropToAdds', disc })
      },
      setFetchCount(fetchCount: number) {
        dispatch({ type: 'setFetchCount', fetchCount })
      }
    }
  }
)
