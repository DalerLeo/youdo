import _ from 'lodash'
import {routerActions} from 'react-router-redux'
import {UserAuthWrapper as userAuthWrapper} from 'redux-auth-wrapper'
import * as ROUTES from '../constants/routes'

export const userIsAuth = userAuthWrapper({
    authSelector: state => _.get(state, 'signIn'),
    failureRedirectPath: ROUTES.SIGN_IN_URL,
    redirectAction: routerActions.replace,
    predicate: signIn => {
        const token = _.get(signIn, 'data')
        return !_.isEmpty(token)
    },
    wrapperDisplayName: 'UserIsAuthenticated'
})

export const visibleOnlyAdmin = userAuthWrapper({
    authSelector: state => _.get(state, 'authConfirm'),
    wrapperDisplayName: 'VisibleOnlyAdmin',
    redirectAction: routerActions.replace,
    failureRedirectPath: ROUTES.ACCESS_DENIED_URL,
    predicate: state => {
        const isSuperUser = _.get(state, ['data', 'isSuperuser'])
        if (isSuperUser) {
            return isSuperUser
        }
        return isSuperUser
    }
})
