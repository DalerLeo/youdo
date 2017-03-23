import _ from 'lodash'
import {routerActions} from 'react-router-redux'
import {UserAuthWrapper as userAuthWrapper} from 'redux-auth-wrapper'

export const userIsAuth = userAuthWrapper({
    authSelector: state => _.get(state, 'signIn'),
    failureRedirectPath: '/sign-in',
    redirectAction: routerActions.replace,
    predicate: signIn => {
        const token = _.get(signIn, 'data')
        return !_.isEmpty(token)
    },
    wrapperDisplayName: 'UserIsAuthenticated'
})

export const visibleOnlyAdmin = userAuthWrapper({
    authSelector: state => state.user,
    wrapperDisplayName: 'VisibleOnlyAdmin',
    predicate: user => user.isAdmin,
    FailureComponent: null
})
