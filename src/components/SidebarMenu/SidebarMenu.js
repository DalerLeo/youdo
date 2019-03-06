import React from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router'
import _ from 'lodash'
import classNames from 'classnames'
import {connect} from 'react-redux'
import {compose, lifecycle, shouldUpdate, pure} from 'recompose'
import injectSheet from 'react-jss'
import FlatButton from 'material-ui/FlatButton'
import Loader from '../Loader'
import SettingsPower from 'material-ui/svg-icons/action/power-settings-new'
import ToolTip from '../Utils/ToolTip'
import {getMenus} from './MenuItems'
import Logo from '../Images/logo.svg'
import CustomBadge from '../CustomBadge/CustomBadge'
import ArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down'
import ArrowUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up'
import * as ROUTE from '../../constants/routes'
import MenuList from './MenuList'
const menuWrapper = React.createRef()
const itemsRef = React.createRef()
const logoutBtn = React.createRef()
const downBlurRef = React.createRef()
const upBlurRef = React.createRef()

const style = {
  style: {
    color: '#fff',
    width: '100%',
    height: 50,
    minWidth: 'none'
  }
}

const enhance = compose(
  connect((state) => {
    const loading = _.get(state, ['authConfirm', 'loading'])
    return {
      loading
    }
  }),
  lifecycle({
    componentDidMount () {
      const show = '0'
      const hide = '-50px'
      const addToItemsHeight = 65

      const menu = menuWrapper.current
      const items = itemsRef.current
      const logout = logoutBtn.current
      const downBlur = downBlurRef.current
      const upBlur = upBlurRef.current
      const buttonHeight = logout.clientHeight
      const itemChildsHeight = _.sumBy(items.childNodes, (o) => {
        return o.clientHeight
      })
      items.style.minHeight = itemChildsHeight + addToItemsHeight + 'px'
      let sidebarHeight = items.clientHeight
      let defaultWindowHeight = window.innerHeight

      if (defaultWindowHeight < sidebarHeight) {
        downBlur.style.bottom = show
        upBlur.style.top = hide
      }

      window.addEventListener('resize', () => {
        const scrollVal = menu.scrollTop
        defaultWindowHeight = window.innerHeight
        sidebarHeight = items.clientHeight
        if (defaultWindowHeight < (sidebarHeight - buttonHeight)) {
          if (scrollVal < (sidebarHeight - defaultWindowHeight)) {
            downBlur.style.bottom = show
            upBlur.style.top = hide
          } else if (scrollVal < buttonHeight) {
            upBlur.style.top = hide
          } else {
            downBlur.style.bottom = hide
            upBlur.style.top = show
          }
        } else {
          downBlur.style.bottom = hide
        }
      })

      menu.addEventListener('scroll', () => {
        const scrollVal = menu.scrollTop
        if (scrollVal < (sidebarHeight - defaultWindowHeight)) {
          downBlur.style.bottom = show
          upBlur.style.top = hide
        } else {
          downBlur.style.bottom = hide
          upBlur.style.top = show
          if (scrollVal < buttonHeight) {
            upBlur.style.top = hide
          }
        }
      })

      upBlur.addEventListener('click', () => {
        const scrollIntoViewOptions = {
          behavior: 'smooth',
          block: 'start',
          inline: 'start'
        }
        items.scrollIntoView(scrollIntoViewOptions)
      })
      downBlur.addEventListener('click', () => {
        const scrollIntoViewOptions = {
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest'
        }
        logout.scrollIntoView(scrollIntoViewOptions)
      })
    }
  }),
  pure

)
/* eslint no-inline-comments: 0 */
/* eslint no-unused-vars: 0 */
const NOT_FOUND = -1
const SideBarMenu = enhance((props) => {
  const {
    classes,
    handleSignOut,
    handleOpenNotificationBar,
    loading
  } = props

  return (
    <div className={classes.wrapper} ref={menuWrapper}>
      {loading
        ? <div className={classes.menuLoading}>
          <Loader size={0.75}/>
        </div>
        : <div className={classes.items} ref={itemsRef}>
          <div className={classes.notifications}>
            {/* <CustomBadge */}
            {/* Dispatch={dispatch} */}
            {/* ClassBadge={classes.badge} */}
            {/* HandleOpen={handleOpenNotificationBar} */}
            {/* RippleColor={rippleColor} */}
            {/* Style={style.style}/> */}
          </div>
          <MenuList/>
        </div>}
      {!loading &&
            <a className={classes.menu} onClick={handleSignOut} ref={logoutBtn}>
              <SettingsPower/><span>Выйти</span>
            </a>}
      <div ref={downBlurRef} className={classes.downBlur}>
        <ArrowDown color="#fff"/>
      </div>
      <div ref={upBlurRef} className={classes.upBlur}>
        <ArrowUp color="#fff"/>
      </div>
    </div>
  )
})

export default injectSheet({
  wrapper: {
    paddingTop: '40px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    overflowY: 'auto',
    overflowX: 'hidden',
    backgroundColor: '#37464f',
    position: 'relative',
    boxShadow: '0 2px 2px 0 rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.2), 0 1px 5px 0 rgba(0,0,0,.12)',
    '& svg': {
      color: '#fafafa !important',
      width: '30px !important',
      height: '30px !important',
      '&:after': {
        content: '""',
        width: '3px',
        height: '3px',
        background: '#fff'
      }
    },
    '&::-webkit-scrollbar': {
      width: '0'
    }
  },

  '@keyframes sidebarArrow': {
    '0%': {top: 3},
    '50%': {top: -3},
    '100%': {top: 3}
  },

  downBlur: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    left: '0',
    bottom: '-50px',
    width: '84px',
    height: '50px',
    background: 'linear-gradient(to bottom, rgba(21, 24, 31, 0) 0%, rgba(21, 24, 31, 1)' +
        ' 100%, rgba(21, 24, 31, 1) 100%)',
    zIndex: '1',
    transition: 'all 250ms ease-out',
    fallbacks: [
      {display: '-webkit-flex'},
      {display: '-moz-flex'}
    ],
    '& svg': {
      position: 'relative',
      transition: 'all 300ms ease',
      opacity: '0.5',
      animation: 'sidebarArrow ease 700ms infinite'
    }
  },

  upBlur: {
    extend: 'downBlur',
    bottom: 'auto',
    top: '-50px',
    background: 'linear-gradient(to top, rgba(21, 24, 31, 0) 0%, rgba(21, 24, 31, 1)' +
        ' 100%, rgba(21, 24, 31, 1) 100%)'
  },

  menuLoading: {
    paddingTop: '100px',
    display: 'flex',
    justifyContent: 'center',
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0'
  },

  logo: {
    padding: '20px 75px 20px',
    '& div': {
      background: 'url(' + Logo + ') no-repeat center center',
      backgroundSize: '100%',
      height: '66px'
    }
  },

  items: {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
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
    color: '#78909C',
    '& svg': {
      verticalAlign: 'middle'
    }
  },
  activeMenu: {
    boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.35)',
    background: '#24262b !important',
    borderRadius: '0 !important',
    opacity: '1 !important'
  },

  bottom: {
    marginTop: '10px',
    paddingTop: '10px',
    borderTop: '1px rgba(255,255,255, 0.1) solid',
    position: 'relative',
    '&:before': {
      background: 'rgba(0,0,0, 0.25)',
      content: '""',
      position: 'absolute',
      height: '1px',
      top: '-2px',
      left: '0',
      right: '0'
    }
  },
  badge: {
    padding: '0 !important',
    width: '100%',
    '& > span': {
      fontSize: '11px !important',
      backgroundColor: '#009688 !important',
      color: '#fff !important',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }
})(SideBarMenu)
