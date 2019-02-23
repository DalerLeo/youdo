import React from 'react'
import _ from 'lodash'
import {getMenus} from './MenuItems'
import classNames from 'classnames'
import {compose, pure} from 'recompose'
import {connect} from 'react-redux'
import {Link, withRouter} from 'react-router'
import injectSheet from 'react-jss'

const enhance = compose(
  withRouter,
  connect((state, props) => {
    const permissions = _.map(_.get(state, ['authConfirm', 'data', 'permissions']), (item) => {
      return _.get(item, 'codename')
    })
    const isAdmin = _.get(state, ['authConfirm', 'data', 'isSuperuser'])
    const loading = _.get(state, ['authConfirm', 'loading'])
    return {
      isAdmin,
      permissions,
      loading
    }
  }),
  injectSheet({
    menu: {
      whiteSpace: 'nowrap',
      display: 'block',
      lineHeight: '60px',
      paddingLeft: '20px',
      opacity: '0.7',
      '&:hover': {
        background: 'rgba(255, 255, 255, 0.05)',
        opacity: '1',
        color: 'fff'
      },
      color: '#fff',
      fontWeight: '600  ',
      '& svg': {
        verticalAlign: 'middle'
      }
    },
    activeMenu: {
      color: '#fff',
      background: '#efefef47 !important',
      borderRadius: '0 !important',
      opacity: '1 !important'
    }

  }),
  pure
)

const noNumbersString = (text) => {
  if (text) {
    return _.trimEnd(_.trimStart(text.replace(/[0-9]/g, ''), '/'), '/')
  }
  return false
}

const NOT_FOUND = -1

const MenuList = props => {
  const {
    permissions,
    isAdmin,
    classes,
    location: {pathname}
  } = props

  const singIn = pathname === '/sign-in'

  if (singIn) {
    return null
  }
  const menu = getMenus(permissions, isAdmin)
  const parent = _
    .chain(menu)
    .find((item) => {
      return (_.findIndex(item.childs, (ch) => {
        const trimmedURL = noNumbersString(_.get(ch, 'url'))
        return trimmedURL === noNumbersString(pathname)
      }) > NOT_FOUND)
    })
    .value()

  const currentMenuURL = _.trimStart(_.get(parent, 'url'), '/')
  const getMenuIcon = (url, query, name, icon) => {
    return (
      <Link to={{pathname: url, query: query}}
        className={classNames({
          [classes.menu]: true,
          [classes.activeMenu]: noNumbersString(url) === currentMenuURL
        })}>
        {icon} <span>{name}</span>

      </Link>
    )
  }
  const items = _.map(menu, (item, index) => {
    const url = _.get(item, 'url')
    const query = _.get(item, 'query')
    const dynamic = _.get(item, 'dynamic') && !isAdmin
    const dynamicOnlyURL = _.get(item, 'dynamicOnlyURL') && !isAdmin
    const icon = dynamic && !dynamicOnlyURL
      ? _.get(_.first(_.get(item, 'childs')), 'icon')
      : _.get(item, 'icon')
    const tooltip = dynamic && !dynamicOnlyURL
      ? _.get(_.first(_.get(item, 'childs')), 'name')
      : _.get(item, 'name')

    return (
      <div key={index}>
        {getMenuIcon(url, query, tooltip, icon)}
      </div>
    )
  })

  return items
}

export default enhance(MenuList)
