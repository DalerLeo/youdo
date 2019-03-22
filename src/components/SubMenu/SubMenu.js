import _ from 'lodash'
import React from 'react'
import {Link} from 'react-router'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import HardwareKeyboardArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right'
import {getMenus} from '../SidebarMenu/MenuItems'
import ToolTip from '../Utils/ToolTip'
import {connect} from 'react-redux'

const NOT_FOUND = -1

const enhance = compose(
  injectSheet({
    wrapper: {
      position: 'relative',
      width: '100%',
      height: '60px',
      display: 'flex',
      alignItems: 'center'
    },
    transparentWrapper: {
      extend: 'wrapper',
      background: 'rgba(255, 255, 255, 0.7)',
      margin: '0 -28px',
      padding: '0 28px',
      borderBottom: '1px #efefef solid',
      zIndex: '2',
      width: 'auto'
    },
    item: {
      color: '#44637e',
      fontWeight: 'bold',
      marginRight: '25px',
      '&:hover': {
        cursor: 'pointer'
      }
    },
    active: {
      color: '#12aaeb !important',
      extend: 'item',
      borderBottom: '1px solid',
      fontWeight: 'bold'
    },
    subParentIco: {
      display: 'flex',
      paddingRight: '10px',
      paddingLeft: '2px',
      '& svg path': {
        fill: 'rgb(93, 100, 116) !important'
      }
    }
  }),
  connect((state) => {
    const permissions = _.map(_.get(state, ['authConfirm', 'data', 'permissions']), (item) => {
      return _.get(item, 'codename')
    })
    const isAdmin = _.get(state, ['authConfirm', 'data', 'isSuperuser'])
    return {
      permissions,
      isAdmin
    }
  }),
)

const SubMenu = enhance((props) => {
  const {classes, url, opacity, permissions, isAdmin} = props
  const MenuItems = getMenus(permissions, isAdmin)

  const parent = _
    .chain(MenuItems)
    .find((item) => {
      return (_.findIndex(item.childs, (ch) => ch.url === url) > NOT_FOUND)
    })
    .value()


  const items = _.map(_.get(parent,'childs'), (item, index) => {
    return (
      <Link to={{pathname: item.url, query: item.query}} key={index}>
        <span className={item.url === url ? classes.active : classes.item}> {item.name}</span>
      </Link>
    )
  })
  const dynamic = _.get(parent, 'dynamic') && !isAdmin
  const icon = dynamic
    ? _.get(_.first(_.get(parent, 'childs')), 'icon')
    : _.get(parent, 'icon')
  const tooltip = dynamic
    ? _.get(_.first(_.get(parent, 'childs')), 'name')
    : _.get(parent, 'name')

  return (
    <div className={opacity ? classes.transparentWrapper : classes.wrapper}>
      <ToolTip position="right" text={tooltip}>
        <div className={classes.subParentIco}>
          {icon}
        </div>
      </ToolTip>
      <HardwareKeyboardArrowRight style={{color: '#66696f', height: '12px', marginRight: '15px', width: 'auto'}} />
      {items}
    </div>
  )
})

SubMenu.propTypes = {
  url: PropTypes.string.isRequired
}

export default SubMenu
