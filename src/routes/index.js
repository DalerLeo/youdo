import {compose} from 'redux'
import {userIsAuth, visibleOnlyAdmin} from '../permissions'
import * as ROUTES from '../constants/routes'
import App from '../containers/App'
import {MainList} from '../containers/Main'
import {AccessList} from '../containers/Access'
import SignIn from '../containers/SignIn'
import {UsersList} from '../containers/Users'
import {ClientList} from '../containers/Client'
import NotFound from '../containers/NotFound'
import {PermissionList} from '../containers/Permission'
import {
    ApplicationList,
    ResumeList
} from '../containers/HR'
import {
    ArticlesList,
    CompaniesList
} from '../containers/Administration'

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
        // HR Application
        {
            path: ROUTES.HR_APPLICATION_LIST_URL,
            component: userIsAdminChain(ApplicationList),
            childRoutes: [
                {
                    path: ROUTES.HR_APPLICATION_ITEM_URL,
                    component: userIsAuth(ApplicationList)
                }
            ]
        },
        // HR Resume
        {
            path: ROUTES.HR_RESUME_LIST_URL,
            component: userIsAdminChain(ResumeList),
            childRoutes: [
                {
                    path: ROUTES.HR_RESUME_ITEM_URL,
                    component: userIsAuth(ResumeList)
                }
            ]
        },
        // Administration - Articles
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
        // Administration - Articles
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
        {
            path: '*',
            component: NotFound
        }
    ]
}

