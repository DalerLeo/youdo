import _ from 'lodash'
import React from 'react'
import * as ROUTES from '../../constants/routes'
import Application from 'material-ui/svg-icons/action/receipt'
import Clients from 'material-ui/svg-icons/social/group'
import Resume from 'material-ui/svg-icons/action/assignment'
import Tasks from 'material-ui/svg-icons/editor/format-list-bulleted'
import {getPageSize} from '../../helpers/storage'
import t from '../../helpers/translate'

const NOT_FOUND = -1

const DEFAULT_PAGE_SIZE = getPageSize()
const defaultPageSizeQuery = {pageSize: DEFAULT_PAGE_SIZE}
export const MenuItems = [
    {
        name: t('Анкеты'),
        icon: (<Resume/>),
        url: ROUTES.HR_RESUME_LIST_URL,
        childs: []
    },
    {
        name: t('Заявки'),
        icon: (<Application/>),
        url: ROUTES.HR_APPLICATION_LIST_URL,
        childs: []
    },
    {
        name: t('Задания'),
        icon: (<Tasks/>),
        url: ROUTES.HR_TASKS_LIST_URL,
        childs: []
    },
    {
        name: t('Клиенты'),
        url: ROUTES.CLIENT_LIST_URL,
        query: defaultPageSizeQuery,
        permission: 'frontend_clients',
        icon: (<Clients/>),
        childs: [
            {name: t('Клиенты'), url: ROUTES.CLIENT_LIST_URL, query: defaultPageSizeQuery, permission: 'frontend_clients', icon: (<Clients/>)}
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
    if (isAdmin) {
        return MenuItems
    }
    return getNeedMenu(userPermissions)
}

