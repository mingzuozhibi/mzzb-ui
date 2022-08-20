import { RootState } from '#A/store'
import { connect } from 'react-redux'

export interface InjectRole {
  isAdmin: boolean
  isBasic: boolean
}

export const injectRole = connect(function (state: RootState) {
  return {
    isAdmin: state.session.userRoles.includes('ROLE_ADMIN'),
    isBasic: state.session.userRoles.includes('ROLE_BASIC'),
  }
})
