import {compose} from 'redux'
import {userIsAuth, visibleOnlyAdmin} from '../permissions'
import * as ROUTES from '../constants/routes'
import App from '../containers/App'
import {MainList} from '../containers/Main'
import {AccessList} from '../containers/Access'
import SignIn from '../containers/SignIn'
import {ClientList} from '../containers/Client'
import NotFound from '../containers/NotFound'
import {PermissionList} from '../containers/Permission'
import {
    ArticlesList,
    CompaniesList,
    UsersList
} from '../containers/Administration'
import {
    SkillsList
} from '../containers/Settings'

const userIsAdminChain = compose(userIsAuth, visibleOnlyAdmin)

export default {
    path: '/',
    component: App,
    indexRoute: {
        component: userIsAuth(MainList)
    },
    childRoutes: [
        {
            path: ROUTES.SIGN_IN_URL,
            component: SignIn
        },

        // Access Denied
        {
            path: ROUTES.ACCESS_DENIED_URL,
            component: userIsAuth(AccessList),
            childRoutes: []
        },
        // Client
        {
            path: ROUTES.CLIENT_LIST_URL,
            component: userIsAdminChain(ClientList),
            childRoutes: [
                {
                    path: ROUTES.CLIENT_ITEM_URL,
                    component: userIsAuth(ClientList)
                }
            ]
        },
        // Permission
        {
            path: ROUTES.PERMISSION_LIST_URL,
            component: userIsAdminChain(PermissionList),
            childRoutes: [
                {
                    path: ROUTES.PERMISSION_ITEM_URL,
                    component: userIsAuth(PermissionList)
                }
            ]
        },

        /* ADMINISTRATION */

        // Users
        {
            path: ROUTES.USERS_LIST_URL,
            component: userIsAdminChain(UsersList),
            childRoutes: [
                {
                    path: ROUTES.USERS_ITEM_URL,
                    component: userIsAuth(UsersList)
                }
            ]
        },
        // Articles
        {
            path: ROUTES.ARTICLES_LIST_URL,
            component: userIsAdminChain(ArticlesList),
            childRoutes: [
                {
                    path: ROUTES.ARTICLES_ITEM_URL,
                    component: userIsAuth(ArticlesList)
                }
            ]
        },
        // Companies
        {
            path: ROUTES.COMPANIES_LIST_URL,
            component: userIsAdminChain(CompaniesList),
            childRoutes: [
                {
                    path: ROUTES.COMPANIES_ITEM_URL,
                    component: userIsAuth(CompaniesList)
                }
            ]
        },

        /* SETTINGS */

        // Skills
        {
            path: ROUTES.SKILLS_LIST_URL,
            component: userIsAdminChain(SkillsList),
            childRoutes: [
                {
                    path: ROUTES.SKILLS_ITEM_URL,
                    component: userIsAuth(SkillsList)
                }
            ]
        },

        {
            path: '*',
            component: NotFound
        }
    ]
}

