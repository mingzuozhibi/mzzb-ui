import { RootState } from '##/@reducer'
import { Disc } from '#P/@types'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'

export interface InjectRole {
  isAdmin: boolean
  isBasic: boolean
}

export const injectRole = connect(
  function (state: RootState) {
    return {
      isAdmin: state.session.userRoles.includes('ROLE_ADMIN'),
      isBasic: state.session.userRoles.includes('ROLE_BASIC'),
    }
  }
)

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
}

export const injectToAdds = connect(
  function (state: RootState) {
    return {
      toAdds: state.admin.toAdds,
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
    }
  }
)
