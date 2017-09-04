import _ from 'lodash'
import {routerActions} from 'react-router-redux'
import {UserAuthWrapper as userAuthWrapper} from 'redux-auth-wrapper'
import * as ROUTES from '../constants/routes'
import {getMenus} from '../components/SidebarMenu/MenuItems'

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
    authSelector: (state, ownProps) => {
        return {
            key: _.get(state, 'authConfirm'),
            path: _.get(ownProps, ['location', 'pathname'])
        }
    },
    wrapperDisplayName: 'VisibleOnlyAdmin',
    failureRedirectPath: ROUTES.ACCESS_DENIED_URL,
    predicate: state => {
        const currentPath = _.get(state, 'path')
        const groups = _.map(_.get(state, ['key', 'data', 'groups']), (item) => {
            return _.get(item, 'id')
        })
        const menus = getMenus(groups)
        const isSuperUser = _.get(state, ['key', 'data', 'isSuperuser'])
        if (isSuperUser) {
            return isSuperUser
        }
        const filter = _.filter(menus, (o) => {
            return _.get(o, 'url') === currentPath
        })
        return !_.isEmpty(filter)
    }
})
