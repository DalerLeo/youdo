import _ from 'lodash'
import {routerActions} from 'react-router-redux'
import {connectedRouterRedirect} from 'redux-auth-wrapper/history3/redirect'
import * as ROUTES from '../constants/routes'
import {getMenus} from '../components/SidebarMenu/MenuItems'

export const userIsAuth = connectedRouterRedirect({
    authenticatedSelector: state => {
        const token = _.get(state, ['signIn', 'data'])
        return !_.isEmpty(token)
    },
    redirectPath: ROUTES.SIGN_IN_URL,
    redirectAction: routerActions.replace,
    wrapperDisplayName: 'UserIsAuthenticated'
})

export const visibleOnlyAdmin = connectedRouterRedirect({
    authenticatedSelector: (state, ownProps) => {
        const currentPath = _.get(ownProps, ['location', 'pathname'])
        const groups = _.map(_.get(state, ['authConfirm', 'data', 'groups']), (item) => {
            return _.get(item, 'id')
        })
        const menus = getMenus(groups)
        const isSuperUser = _.get(state, ['authConfirm', 'data', 'isSuperuser'])
        if (isSuperUser) {
            return isSuperUser
        }
        const filter = _.filter(menus, (o) => {
            return _.get(o, 'url') === currentPath
        })
        return !_.isEmpty(filter)
    },
    wrapperDisplayName: 'VisibleOnlyAdmin',
    redirectPath: ROUTES.ACCESS_DENIED_URL
})
