// . import {compose} from 'redux'
import {userIsAuth} from '../permissions'
import * as ROUTES from '../constants/routes'
import AppLayout from '../containers/App/AppLayout'
import {MainList} from '../containers/Main'
import {AccessList} from '../containers/Access'
import SignIn from '../containers/SignIn'
import PlanList from '../containers/Plan'
import NotFound from '../containers/NotFound'
import {PermissionList} from '../containers/Permission'
import {CompanyTypeList} from '../containers/CompanyType'
import NewsList from '../containers/News'
import CustomerList from '../containers/Customer'
import FeedbackList from '../containers/Feedback'
import OrderList from '../containers/Order'
import ProjectList from '../containers/Project'
import BrandList from '../containers/Brand'
import PerformerList from '../containers/Performer'
import StatDistrict from '../containers/StatDistrict'
import StatService from '../containers/StatService'
import {
  SkillsList,
  PostList,
  UsersList,
  JobSearch
} from '../containers/Settings'

import {RoleList} from '../containers/Settings/Role'
// .const userIsAdminChain = compose(userIsAuth, visibleOnlyAdmin)

export default {
  path: '/',
  component: AppLayout,
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
    // Permission
    {
      path: ROUTES.PERMISSION_LIST_URL,
      component: userIsAuth(PermissionList),
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
      component: userIsAuth(UsersList),
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
      component: userIsAuth(NewsList),
      childRoutes: [
        {
          path: ROUTES.ARTICLES_ITEM_URL,
          component: userIsAuth(NewsList)
        }
      ]
    },

    // Skills
    {
      path: ROUTES.SKILLS_LIST_URL,
      component: userIsAuth(SkillsList),
      childRoutes: [
        {
          path: ROUTES.SKILLS_ITEM_URL,
          component: userIsAuth(SkillsList)
        }
      ]
    },

    // Roles
    {
      path: ROUTES.ROLE_LIST_URL,
      component: userIsAuth(RoleList),
      childRoutes: [
        {
          path: ROUTES.ROLE_ITEM_URL,
          component: userIsAuth(RoleList)
        },
        {

        }
      ]
    },

    // Post
    {
      path: ROUTES.POST_LIST_URL,
      component: userIsAuth(PostList),
      childRoutes: [
        {
          path: ROUTES.POST_ITEM_URL,
          component: userIsAuth(PostList)
        },
        {

        }
      ]
    },
    // COMPANY TYPE
    {
      path: ROUTES.COMPANY_TYPE_LIST_URL,
      component: userIsAuth(CompanyTypeList),
      childRoutes: [
        {
          path: ROUTES.COMPANY_TYPE_ITEM_URL,
          component: userIsAuth(CompanyTypeList)
        }
      ]
    },

    // APPLICANT
    {
      path: ROUTES.APPLICANT_LIST_URL,
      component: userIsAuth(PerformerList),
      childRoutes: [
        {
          path: ROUTES.APPLICANT_ITEM_URL,
          component: userIsAuth(PerformerList)
        }
      ]
    },

    // PLAN TYPE
    {
      path: ROUTES.PLAN_LIST_URL,
      component: userIsAuth(PlanList),
      childRoutes: [
        {
          path: ROUTES.PLAN_ITEM_URL,
          component: userIsAuth(PlanList)
        }
      ]
    },
    // PLAN TYPE
    {
      path: ROUTES.JOB_SEARCH_LIST_URL,
      component: userIsAuth(JobSearch),
      childRoutes: [
        {
          path: ROUTES.JOB_SEARCH_ITEM_URL,
          component: userIsAuth(JobSearch)
        }
      ]
    },
    // PROJECT TYPE
    {
      path: ROUTES.PROJECT_LIST_URL,
      component: userIsAuth(ProjectList),
      childRoutes: [
        {
          path: ROUTES.PROJECT_ITEM_URL,
          component: userIsAuth(ProjectList)
        }
      ]
    },

    // CUSTOMER
    {
      path: ROUTES.CUSTOMER_LIST_URL,
      component: userIsAuth(CustomerList),
      childRoutes: [
        {
          path: ROUTES.CUSTOMER_ITEM_URL,
          component: userIsAuth(CustomerList)
        }
      ]
    },
    // CUSTOMER
    {
      path: ROUTES.FEEDBACK_LIST_URL,
      component: userIsAuth(FeedbackList),
      childRoutes: [
        {
          path: ROUTES.FEEDBACK_ITEM_URL,
          component: userIsAuth(FeedbackList)
        }
      ]
    },

    // ORDER
    {
      path: ROUTES.ORDER_LIST_URL,
      component: userIsAuth(OrderList),
      childRoutes: [
        {
          path: ROUTES.ORDER_ITEM_URL,
          component: userIsAuth(OrderList)
        }
      ]
    },

    // BRAND
    {
      path: ROUTES.BRAND_LIST_URL,
      component: userIsAuth(BrandList),
      childRoutes: [
        {
          path: ROUTES.BRAND_ITEM_URL,
          component: userIsAuth(BrandList)
        }
      ]
    },
    // StatService
    {
      path: ROUTES.STAT_DISTRICT_LIST_URL,
      component: userIsAuth(StatDistrict),
      childRoutes: [
        {
          path: ROUTES.STAT_DISTRICT_LIST_URL,
          component: userIsAuth(StatDistrict)
        }
      ]
    },
    // StatService
    {
      path: ROUTES.STAT_SERVICE_LIST_URL,
      component: userIsAuth(StatService),
      childRoutes: [
        {
          path: ROUTES.STAT_SERVICE_ITEM_URL,
          component: userIsAuth(StatService)
        }
      ]
    },

    {
      path: '*',
      component: NotFound
    }
  ]
}

