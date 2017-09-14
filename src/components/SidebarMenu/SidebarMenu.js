import React from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router'
import _ from 'lodash'
import {connect} from 'react-redux'
import {compose, lifecycle, withState} from 'recompose'
import injectSheet from 'react-jss'
import FlatButton from 'material-ui/FlatButton'
import CircularProgress from 'material-ui/CircularProgress'
import SettingsPower from 'material-ui/svg-icons/action/settings-power'
import ToolTip from '../ToolTip'
import {getMenus} from './MenuItems'
import Logo from '../Images/logo.png'
import CustomBadge from '../CustomBadge/CustomBadge'
import Arrow from 'material-ui/svg-icons/hardware/keyboard-arrow-down'

const style = {
    style: {
        width: 84,
        height: 60,
        minWidth: 'none'
    }
}

const enhance = compose(
    connect((state) => {
        const sessionGroups = _.map(_.get(state, ['authConfirm', 'data', 'groups']), (item) => {
            return _.get(item, 'id')
        })
        const isAdmin = _.get(state, ['authConfirm', 'data', 'isSuperuser'])
        const loading = _.get(state, ['authConfirm', 'loading'])
        return {
            isAdmin,
            sessionGroups,
            loading
        }
    }),
    withState('blurIsHere', 'updateBlur', true),
    lifecycle({
        componentDidMount () {
            const show = '0'
            const hide = '-50px'

            const menu = ReactDOM.findDOMNode(this.refs.menuWrapper)
            const items = ReactDOM.findDOMNode(this.refs.items)
            const logout = ReactDOM.findDOMNode(this.refs.logoutBtn)
            const blur = ReactDOM.findDOMNode(this.refs.blur)
            const buttonHeight = logout.clientHeight
            const sidebarHeight = items.clientHeight
            let defaultWindowHeight = window.innerHeight

            if (defaultWindowHeight < sidebarHeight) {
                blur.style.bottom = show
            }

            window.addEventListener('resize', () => {
                const scrollVal = menu.scrollTop
                defaultWindowHeight = window.innerHeight
                if (defaultWindowHeight < (sidebarHeight - buttonHeight)) {
                    if (scrollVal < (sidebarHeight - defaultWindowHeight)) {
                        blur.style.bottom = show
                    } else {
                        blur.style.bottom = hide
                    }
                } else {
                    blur.style.bottom = hide
                }
            })

            menu.addEventListener('scroll', () => {
                const scrollVal = menu.scrollTop
                if (scrollVal < (sidebarHeight - defaultWindowHeight)) {
                    blur.style.bottom = show
                } else {
                    blur.style.bottom = hide
                }
            })

            blur.addEventListener('click', () => {
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

const SideBarMenu = enhance((props) => {
    const {classes, handleSignOut, handleOpenNotificationBar, sessionGroups, isAdmin, loading} = props
    const menu = getMenus(sessionGroups, isAdmin)
    const items = _.map(menu, (item, index) => {
        const atBottom = _.get(item, 'bottom')
        if (atBottom) {
            return false
        }
        return (
            <div key={index}>
                <Link to={item.url}>
                    <ToolTip position="right" text={item.name}>
                        <FlatButton
                            rippleColor="#fff"
                            style={style.style}>
                            {item.icon}
                        </FlatButton>
                    </ToolTip>
                </Link>
            </div>
        )
    })
    const bottomItems = _.filter(menu, (o) => {
        return o.bottom
    })
    const afterLine = _.map(bottomItems, (item, index) => {
        return (
            <div key={index}>
                <Link to={item.url}>
                    <ToolTip position="right" text={item.name}>
                        <FlatButton
                            rippleColor="#fff"
                            style={style.style}>
                            {item.icon}
                        </FlatButton>
                    </ToolTip>
                </Link>
            </div>
        )
    })

    return (
        <div className={classes.wrapper} ref="menuWrapper">
        {loading
            ? <div className={classes.menuLoading}>
                <CircularProgress size={40} thickness={4} color="#efefef"/>
            </div>
            : <div className={classes.items} ref="items">
                <div className={classes.logo}>
                    <img src={Logo}/>
                </div>
                <div className={classes.notifications}>
                    <CustomBadge
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
            {!loading && <div className={classes.logout} ref="logoutBtn">
                <ToolTip position="right" text="Выйти">
                    <FlatButton
                        rippleColor="#fff"
                        style={style.style}
                        onClick={handleSignOut}>
                        <SettingsPower/>
                    </FlatButton>
                </ToolTip>
            </div>}
            <div ref="blur" className={classes.blur}>
                <Arrow color="#fff" ref="arrow"/>
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
            height: '25px !important'
        },
        '&::-webkit-scrollbar': {
            width: '0'
        }
    },

    '@keyframes animation': {
        '0%': {top: 3},
        '50%': {top: -3},
        '100%': {top: 3}
    },

    blur: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed',
        left: '0',
        bottom: '-50px',
        width: '84px',
        height: '40px',
        background: 'linear-gradient(to bottom, rgba(21, 24, 31, 0) 0%, rgba(21, 24, 31, 1)' +
        ' 100%, rgba(21, 24, 31, 1) 100%)',
        zIndex: '1',
        transition: 'all 250ms ease-out',
        '& svg': {
            position: 'relative',
            transition: 'all 300ms ease',
            opacity: '0.5',
            animation: 'animation ease 700ms infinite'
        }
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
        '& img': {
            width: '100%'
        }
    },

    items: {
        position: 'relative',
        width: '100%',
        minHeight: '800px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
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
