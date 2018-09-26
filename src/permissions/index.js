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
    const permissions = _.map(_.get(state, ['authConfirm', 'data', 'permissions']), (item) => {
      return _.get(item, 'codename')
    })
    const isSuperUser = _.get(state, ['authConfirm', 'data', 'isSuperuser'])
    const menus = getMenus(permissions, isSuperUser)
    if (isSuperUser) {
      return isSuperUser
    }
    const filter = _.filter(menus, (o) => {
      const childURL = _.map(_.get(o, 'childs'), (child) => {
        const extra = _.get(child, 'extraURLs')
        const extraURL = _.map(extra, (url) => {
          return _.startsWith(_.trimStart(currentPath, '/'), _.trimStart(url, '/'))
        })
        if (_.startsWith(_.trimStart(currentPath, '/'), _.trimStart(child.url, '/'))) {
          return 'hasin'
        } else if (_.includes(extraURL, true)) {
          return 'hasin'
        }
        return ''
      })
      return childURL.includes('hasin')
    })
    return !_.isEmpty(filter)
  },
  wrapperDisplayName: 'VisibleOnlyAdmin',
  redirectPath: ROUTES.ACCESS_DENIED_URL
})
