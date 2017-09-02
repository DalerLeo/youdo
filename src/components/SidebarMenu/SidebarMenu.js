import React from 'react'
import {Link} from 'react-router'
import _ from 'lodash'
import {connect} from 'react-redux'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import FlatButton from 'material-ui/FlatButton'
import SettingsPower from 'material-ui/svg-icons/action/settings-power'
import ToolTip from '../ToolTip'
import {getMenus} from './MenuItems'
import Notification from 'material-ui/svg-icons/social/notifications'
import Badge from 'material-ui/Badge'
import Logo from '../Images/logo.png'

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
        const notificationData = _.get(state, ['notifications', 'timeInterval', 'data'])
        return {
            notificationData,
            isAdmin,
            sessionGroups
        }
    })
)

const SideBarMenu = enhance((props) => {
    const {classes, handleSignOut, handleOpenNotificationBar, count, sessionGroups, isAdmin} = props
    const menu = getMenus(sessionGroups, isAdmin)
    const items = _.map(menu, (item, index) => {
        const atBottom = _.get(item, 'bottom')
        if (atBottom) {
            return false
        }
        return (
            <Link to={item.url} key={index}>
                <ToolTip position="right" text={item.name}>
                    <FlatButton
                        rippleColor="#fff"
                        style={style.style}>
                        {item.icon}
                    </FlatButton>
                </ToolTip>
            </Link>
        )
    })
    const bottomItems = _.map(menu, (item, index) => {
        const atBottom = _.get(item, 'bottom')
        if (!atBottom) {
            return false
        }
        return (
            <Link to={item.url} key={index}>
                <ToolTip position="right" text={item.name}>
                    <FlatButton
                        rippleColor="#fff"
                        style={style.style}>
                        {item.icon}
                    </FlatButton>
                </ToolTip>
            </Link>
        )
    })

    return (
        <div className={classes.wrapper}>
            <div className={classes.items}>
                <div className={classes.logo}>
                    <img src={Logo}/>
                </div>
                <div className={classes.notifications}>
                    {count ? <Badge
                        className={classes.badge}
                        badgeContent={count}
                        badgeStyle={{top: 8, right: 10}}>
                        <ToolTip position="right" text="Уведомления">
                            <FlatButton
                                rippleColor="#fff"
                                style={style.style}
                                onTouchTap={() => {
                                    handleOpenNotificationBar(true)
                                }}>
                                <Notification />
                            </FlatButton>
                        </ToolTip>
                    </Badge>
                        : <ToolTip position="right" text="Уведомления">
                            <FlatButton
                                rippleColor="#fff"
                                style={style.style}
                                onTouchTap={() => {
                                    handleOpenNotificationBar(true)
                                }}>
                                <Notification />
                            </FlatButton>
                        </ToolTip>
                    }
                </div>
                {items}
                {!_.isEmpty(bottomItems) && <div className={classes.bottom}>
                    {bottomItems}
                </div>}

                <div className={classes.logout}>
                    <ToolTip position="right" text="Выйти">
                        <FlatButton
                            rippleColor="#fff"
                            style={style.style}
                            onClick={handleSignOut}>
                            <SettingsPower />
                        </FlatButton>
                    </ToolTip>
                </div>
            </div>
        </div>
    )
})

export default injectSheet({
    wrapper: {
        height: '100%',
        display: 'flex',
        backgroundColor: '#2d3037',
        boxShadow: '0 2px 2px 0 rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.2), 0 1px 5px 0 rgba(0,0,0,.12)'
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
        }
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

    logout: {
        position: 'absolute',
        bottom: '0',
        left: '0',
        right: '0'
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
