import React from 'react'
import _ from 'lodash'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import {Link} from 'react-router'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {getMenus} from '../SidebarMenu/MenuItems'

const enhance = compose(
  injectSheet({
    leftPanel: {
      backgroundColor: '#f2f5f8',
      flexBasis: '225px',
      minWidth: '225px',
      position: 'relative'
    },
    wrapper: {
      padding: '30px 30px 20px',
      height: '100%',
      overflowY: 'auto',
      '&::-webkit-scrollbar': {
        width: '0'
      },
      '&:hover': {
        '&::-webkit-scrollbar': {
          width: '4px !important'
        }
      },
      '& ul': {
        fontWeight: 'bold',
        marginBottom: '20px'
      },
      '& li': {
        paddingLeft: '20px',
        paddingTop: '10px',
        fontWeight: '400',
        '&:last-child': {
          paddingBottom: '10px'
        }
      }
    },
    active: {
      color: '#12aaeb'
    },
    simple: {
      color: '#333'
    }
  }),
  connect((state) => {
    let perms = []
    const groups = _.get(state, ['authConfirm', 'data', 'groups'])
    _.map(groups, (item) => {
      _.map(_.get(item, 'permissions'), p => {
        perms.push(_.get(p, 'codename'))
      })
      return _.get(item, 'codename')
    })
    const isAdmin = _.get(state, ['authConfirm', 'data', 'isSuperuser'])
    return {
      permissions: perms,
      isAdmin
    }
  })
)

const SettingsSideMenu = enhance((props) => {
  const {classes, currentUrl, permissions, isAdmin} = props
  const MenuItems = _.find(getMenus(permissions, isAdmin), {'section': 'Settings'})
  const sortedMenu = _.groupBy(MenuItems.childs, 'section')
  return (
    <div className={classes.leftPanel}>
      <div className={classes.wrapper}>
        {_.map(sortedMenu, (item, index) => {
          return (
            <ul key={index}>
              {index}
              {_.map(item, (object, i) => {
                return (
                  <li key={i}>
                    <Link to={object.url}>
                      <span className={object.url === currentUrl ? classes.active : classes.simple}>
                        {object.name}
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )
        })}
      </div>
    </div>
  )
})

SettingsSideMenu.propTypes = {
  currentUrl: PropTypes.string.isRequired
}

export default SettingsSideMenu
