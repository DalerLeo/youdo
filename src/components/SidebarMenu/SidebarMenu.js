import React from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router'
import _ from 'lodash'
import {connect} from 'react-redux'
import {compose, lifecycle} from 'recompose'
import injectSheet from 'react-jss'
import FlatButton from 'material-ui/FlatButton'
import Loader from '../Loader'
import SettingsPower from 'material-ui/svg-icons/action/settings-power'
import ToolTip from '../ToolTip'
import {getMenus} from './MenuItems'
import Logo from '../Images/logo.svg'
import CustomBadge from '../CustomBadge/CustomBadge'
import ArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down'
import ArrowUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up'
import * as ROUTE from '../../constants/routes'

const style = {
    style: {
        width: 84,
        height: 60,
        minWidth: 'none'
    }
}

const enhance = compose(
    connect((state) => {
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
    lifecycle({
        componentDidMount () {
            const show = '0'
            const hide = '-50px'
            const addToItemsHeight = 65

            const menu = ReactDOM.findDOMNode(this.refs.menuWrapper)
            const items = ReactDOM.findDOMNode(this.refs.items)
            const logout = ReactDOM.findDOMNode(this.refs.logoutBtn)
            const downBlur = ReactDOM.findDOMNode(this.refs.down_blur)
            const upBlur = ReactDOM.findDOMNode(this.refs.up_blur)
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
    })
)

const NOT_FOUND = -1
const SideBarMenu = enhance((props) => {
    const {
        classes,
        handleSignOut,
        handleOpenNotificationBar,
        permissions,
        isAdmin,
        loading,
        dispatch,
        pathname
    } = props

    const trimmedPathname = _.trimStart(pathname, '/')
    const menu = getMenus(permissions, isAdmin)
    const parent = _
        .chain(menu)
        .find((item) => {
            return (_.findIndex(item.childs, (ch) => {
                const trimmedURL = _.trimStart(_.get(ch, 'url'), '/')
                return _.includes(trimmedPathname, trimmedURL)
            }) > NOT_FOUND)
        })
        .value()
    const currentMenuURL = _.trimStart(_.get(parent, 'url'), '/')
    const rippleColor = 'rgba(255, 255, 255, 0.05)'
    const getMenuIcon = (url, query, name, icon) => {
        return (
            <Link to={{pathname: url, query: query}}>
                <ToolTip position="right" text={name}>
                    <FlatButton
                        hoverColor={_.trimStart(url, '/') === currentMenuURL ? 'transparent' : rippleColor}
                        rippleColor={_.trimStart(url, '/') === currentMenuURL ? 'transparent' : rippleColor}
                        className={_.trimStart(url, '/') === currentMenuURL ? classes.activeMenu : ''}
                        style={style.style}>
                        {icon}
                    </FlatButton>
                </ToolTip>
            </Link>
        )
    }
    const items = _.map(menu, (item, index) => {
        const atBottom = _.get(item, 'bottom')
        const url = _.get(item, 'url')
        const query = _.get(item, 'query')
        const dynamic = _.get(item, 'dynamic') && !isAdmin
        const icon = dynamic
            ? _.get(_.first(_.get(item, 'childs')), 'icon')
            : _.get(item, 'icon')
        const tooltip = dynamic
            ? _.get(_.first(_.get(item, 'childs')), 'name')
            : _.get(item, 'name')
        if (atBottom) {
            return null
        }
        return (
            <div key={index}>
                {getMenuIcon(url, query, tooltip, icon)}
            </div>
        )
    })
    const bottomItems = _.filter(menu, (o) => {
        return o.bottom
    })
    const afterLine = _.map(bottomItems, (item, index) => {
        const url = _.get(item, 'url')
        const query = _.get(item, 'query')
        return (
            <div key={index}>
                {getMenuIcon(url, query, item.name, item.icon)}
            </div>
        )
    })

    return (
        <div className={classes.wrapper} ref="menuWrapper">
        {loading
            ? <div className={classes.menuLoading}>
                <Loader size={0.75}/>
            </div>
            : <div className={classes.items} ref="items">
                <div className={classes.logo}>
                    <Link to={ROUTE.DASHBOARD_URL}>
                        <div>{null}</div>
                    </Link>
                </div>
                <div className={classes.notifications}>
                    <CustomBadge
                        dispatch={dispatch}
                        classBadge={classes.badge}
                        handleOpen={handleOpenNotificationBar}
                        style={style.style}/>

                </div>
                {items}
                {!_.isEmpty(afterLine) &&
                <div className={classes.bottom}>
                    {afterLine}
                </div>}
            </div>}
            {!loading &&
            <div ref="logoutBtn">
                <ToolTip position="right" text="Выйти">
                    <FlatButton
                        rippleColor={rippleColor}
                        style={style.style}
                        onClick={handleSignOut}>
                        <SettingsPower/>
                    </FlatButton>
                </ToolTip>
            </div>}
            <div ref="down_blur" className={classes.downBlur}>
                <ArrowDown color="#fff"/>
            </div>
            <div ref="up_blur" className={classes.upBlur}>
                <ArrowUp color="#fff"/>
            </div>
        </div>
    )
})

export default injectSheet({
    wrapper: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflowY: 'auto',
        overflowX: 'hidden',
        backgroundColor: '#2d3037',
        position: 'relative',
        boxShadow: '0 2px 2px 0 rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.2), 0 1px 5px 0 rgba(0,0,0,.12)',
        '& button': {
            opacity: '0.5',
            '& > div': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                width: '100%'
            },
            '&:hover': {
                opacity: '1'
            }
        },
        '& svg': {
            color: '#fff !important',
            width: '25px !important',
            height: '25px !important',
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
        padding: '20px 10px 30px',
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
