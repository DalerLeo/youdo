import _ from 'lodash'
import React from 'react'
import * as ROUTES from '../../constants/routes'
import t from '../../helpers/translate'

import Administration from 'material-ui/svg-icons/action/event'
import Settings from 'material-ui/svg-icons/action/settings'
import Widgets from 'material-ui/svg-icons/device/widgets'
import AccountIcon from 'material-ui/svg-icons/social/group'

import {getPageSize} from '../../helpers/storage'
const DEFAULT_PAGE_SIZE = getPageSize()
const defaultPageSizeQuery = {pageSize: DEFAULT_PAGE_SIZE}
const NOT_FOUND = -1

export const MenuItems = [

  {
    name: t('Пользователи'),
    icon: (<AccountIcon/>),
    url: ROUTES.APPLICANT_LIST_URL,
    query: defaultPageSizeQuery,
    childs: [
      {name: t('Исполнители'), url: ROUTES.APPLICANT_LIST_URL, query: defaultPageSizeQuery, permission: ''},
      {name: t('Заказчики'), url: ROUTES.CUSTOMER_LIST_URL, query: defaultPageSizeQuery, permission: ''}
    ]
  },

  {
    name: t('Сфера услуг'),
    icon: (<Widgets/>),
    url: ROUTES.COMPANY_TYPE_LIST_URL,
    query: defaultPageSizeQuery,
    childs: [
      {name: t('Сфера услуг'), url: ROUTES.COMPANY_TYPE_LIST_URL, permission: ''}
    ]
  },

  {
    name: t('Новости'),
    icon: (<Administration/>),
    section: 'Administration',
    url: ROUTES.ARTICLES_LIST_URL,
    childs: [
      {section: 'Основные', name: t('Новости'), url: ROUTES.ARTICLES_LIST_URL, permission: ''}
    ]
  },
  {
    name: t('Настройки'),
    icon: (<Settings/>),
    section: 'Settings',
    url: ROUTES.SKILLS_LIST_URL,
    bottom: true,
    childs: [
      {section: 'Основные', name: t('Навыки'), url: ROUTES.SKILLS_LIST_URL, permission: ''},
      {section: 'Основные', name: t('Пользователи'), url: ROUTES.USERS_LIST_URL, permission: ''},
      {section: 'Основные', name: t('Должности'), url: ROUTES.POST_LIST_URL, permission: ''},
      {section: 'Основные', name: t('Права доступа'), url: ROUTES.ROLE_LIST_URL, permission: ''},
      {section: 'Основные', name: t('Статус поиска работы'), url: ROUTES.JOB_SEARCH_LIST_URL, permission: ''}

    ]
  }
]

export const getNeedMenu = (userPermissions) => {
  const menus = []
  _.map(userPermissions, (perm) => {
    const parent = _
      .chain(MenuItems)
      .find((obj) => {
        const filteredChilds = _.filter(obj.childs, (child) => {
          return child.permission === perm
        })
        return (_.findIndex(filteredChilds, (ch) => {
          return ch.permission === perm
        }) > NOT_FOUND)
      })
      .value()
    let hasIn = false
    _.map(menus, (menu) => {
      _.map(menu.childs, (child) => {
        if (child.permission === perm) {
          hasIn = true
        }
      })
    })
    const filteredChilds = _.filter(_.get(parent, 'childs'), (child) => {
      return child.permission === perm
    })
    if (!hasIn) {
      const newParent = {
        name: _.get(parent, 'name'),
        query: _.get(parent, 'query'),
        icon: _.get(parent, 'icon'),
        section: _.get(parent, 'section') || '',
        dynamic: _.get(parent, 'dynamic'),
        dynamicOnlyURL: _.get(parent, 'dynamicOnlyURL'),
        bottom: _.get(parent, 'name') === 'Настройки',
        childs: _.filter(_.get(parent, 'childs'), (ch) => {
          return _.includes(userPermissions, ch.permission)
        }),
        url: _.get(_.first(filteredChilds), 'url')
      }
      menus.push(newParent)
    }
  })
  return _.uniqBy(_.filter(menus, (o) => {
    return _.get(o, 'url')
  }), 'url')
}

export const getMenus = (userPermissions, isAdmin) => {
  return MenuItems

  /* .if (isAdmin) {
        return MenuItems
    }
    return getNeedMenu(userPermissions) */
}

