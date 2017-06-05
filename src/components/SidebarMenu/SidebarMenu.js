import React from 'react'
import {Link} from 'react-router'
import _ from 'lodash'
import injectSheet from 'react-jss'
import IconButton from 'material-ui/IconButton'
import SettingsPower from 'material-ui/svg-icons/action/settings-power'
import ToolTip from '../ToolTip'
import {MenuItems} from './MenuItems'
import Notification from 'material-ui/svg-icons/social/notifications'
import Badge from 'material-ui/Badge'
import Logo from '../Images/logo.png'

const style = {
    iconStyle: {
        width: 30,
        height: 30
    },
    style: {
        width: 66,
        height: 66,
        padding: 16
    }
}

const touch = true

const SideBarMenu = (props) => {
    const {classes, handleSignOut, handleOpenNotificationBar} = props
    const items = _.map(MenuItems, (item, index) => {
        return (
            <Link to={item.url} key={index}>
                <ToolTip position="right" text={item.name}>
                    <IconButton
                        iconStyle={style.iconStyle}
                        style={style.style}
                        disableTouchRipple={true}
                        touch={touch}>
                        {item.icon}
                    </IconButton>
                </ToolTip>
            </Link>
        )
    })

    return (
        <div className={classes.wrapper}>
            <div className={classes.items}>
                <div className={classes.logo}>
                    <img src={Logo} />
                </div>
                <Badge
                    className={classes.badge}
                    badgeContent={5}
                    badgeStyle={{top: 8, right: 10}}>
                    <ToolTip position="right" text="Уведомления">
                        <IconButton
                            iconStyle={style.iconStyle}
                            style={style.style}
                            className="ass23"
                            touch={touch}
                            onTouchTap={() => { handleOpenNotificationBar(true) }}
                            disableTouchRipple={true}>
                            <Notification />
                        </IconButton>
                    </ToolTip>
                </Badge>

                {items}

                <div className={classes.logout}>
                    <ToolTip position="right" text="Выйти">
                        <IconButton
                            iconStyle={style.iconStyle}
                            style={style.style}
                            touch={touch}
                            disableTouchRipple={true}
                            onClick={handleSignOut}>
                            <SettingsPower />
                        </IconButton>
                    </ToolTip>
                </div>
            </div>
        </div>
    )
}

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
            width: '100% !important',
            height: '70px !important',
            opacity: '0.5',
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

    logout: {
        position: 'absolute',
        bottom: '0',
        left: '0',
        right: '0'
    },
    badge: {
        padding: '0 !important',
        width: '100%',
        '& span': {
            fontSize: '11px !important',
            backgroundColor: '#009688 !important',
            color: '#fff !important',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }
    }
})(SideBarMenu)
