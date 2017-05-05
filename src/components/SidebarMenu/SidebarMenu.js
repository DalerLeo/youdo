import React from 'react'
import {Link} from 'react-router'
import _ from 'lodash'
import injectSheet from 'react-jss'
import IconButton from 'material-ui/IconButton'
import SettingsPower from 'material-ui/svg-icons/action/settings-power'
import ToolTip from '../ToolTip'
import {MenuItems} from './MenuItems'

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
    const {classes, handleSignOut} = props
    const items = _.map(MenuItems, (item, index) => {
        return (
            <Link to={item.url} key={index}>
                <ToolTip position="right" text={item.name}>
                    <IconButton
                        iconStyle={style.iconStyle}
                        style={style.style}
                        touch={touch}>
                        {item.icon}
                    </IconButton>
                </ToolTip>
            </Link>
        )
    })

    return (
        <div className={classes.wrapper}>
            <div className={classes.logo}>
            </div>
            <div className={classes.items}>
                {items}

                <div className={classes.logout}>
                    <ToolTip position="right" text="Log out">
                        <IconButton
                            iconStyle={style.iconStyle}
                            style={style.style}
                            touch={touch}
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
        padding: '40px 0'
    },

    items: {
        position: 'relative',
        width: '100%',
        '& button': {
            width: '100% !important',
            height: '65px !important'
        },
        '& svg': {
            color: '#abacb0 !important',
            width: '25px !important',
            height: '25px !important'
        }
    },

    logout: {
        position: 'absolute',
        bottom: '0',
        left: '0',
        right: '0'
    }
})(SideBarMenu)
