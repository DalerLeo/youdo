import React from 'react'
import {Link} from 'react-router'
import injectSheet from 'react-jss'
import IconButton from 'material-ui/IconButton'
import TrendingUp from 'material-ui/svg-icons/action/trending-up'
import AttachMoney from 'material-ui/svg-icons/editor/attach-money'
import Home from 'material-ui/svg-icons/action/home'
import TV from 'material-ui/svg-icons/hardware/tv'
import AccountBalanceWallet from 'material-ui/svg-icons/action/account-balance-wallet'
import Settings from 'material-ui/svg-icons/action/settings'
import SettingsPower from 'material-ui/svg-icons/action/settings-power'
import * as ROUTES from '../../constants/routes'

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
const tooltipPosition = 'top-right'

const SideBarMenu = (props) => {
    const {classes, handleSignOut} = props

    return (
        <div className={classes.wrapper}>
            <div className={classes.logo}>
            </div>
            <div className={classes.items}>
                <Link to={ROUTES.SHOP_LIST_URL}>
                    <IconButton
                        iconStyle={style.iconStyle}
                        style={style.style}
                        touch={touch}
                        tooltipPosition={tooltipPosition}
                        tooltip="Metrics">
                        <TrendingUp />
                    </IconButton>
                </Link>

                <IconButton
                    iconStyle={style.iconStyle}
                    style={style.style}
                    touch={touch}
                    tooltipPosition={tooltipPosition}
                    tooltip="Sales">
                    <AttachMoney />
                </IconButton>

                <IconButton
                    iconStyle={style.iconStyle}
                    style={style.style}
                    touch={touch}
                    tooltipPosition={tooltipPosition}
                    tooltip="Warehouse">
                    <Home />
                </IconButton>

                <IconButton
                    iconStyle={style.iconStyle}
                    style={style.style}
                    touch={touch}
                    tooltipPosition={tooltipPosition}
                    tooltip="Ads">
                    <TV />
                </IconButton>

                <IconButton
                    iconStyle={style.iconStyle}
                    style={style.style}
                    touch={touch}
                    tooltipPosition={tooltipPosition}
                    tooltip="Accounting">
                    <AccountBalanceWallet />
                </IconButton>

                <IconButton
                    iconStyle={style.iconStyle}
                    style={style.style}
                    touch={touch}
                    tooltipPosition={tooltipPosition}
                    tooltip="Settings">
                    <Settings />
                </IconButton>

            </div>

            <div className={classes.logout}>
                <IconButton
                    iconStyle={style.iconStyle}
                    style={style.style}
                    touch={touch}
                    tooltipPosition={tooltipPosition}
                    tooltip="Log out"
                    onClick={handleSignOut}>
                    <SettingsPower />
                </IconButton>
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
        '& svg': {
            fontSize: '24px',
            color: '#abacb0 !important'
        }
    },

    logout: {
        position: 'absolute',
        bottom: 0,

        '& svg': {
            fontSize: '24px',
            color: '#abacb0 !important'
        }
    }
})(SideBarMenu)
