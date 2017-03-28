import React from 'react'
import {Link} from 'react-router'
import * as ROUTES from '../../constants/routes'
import IconButton from 'material-ui/IconButton'
import TrendingUp from 'material-ui/svg-icons/action/trending-up'
import AttachMoney from 'material-ui/svg-icons/editor/attach-money'
import Home from 'material-ui/svg-icons/action/home'
import TV from 'material-ui/svg-icons/hardware/tv'
import AccountBalanceWallet from 'material-ui/svg-icons/action/account-balance-wallet'
import Settings from 'material-ui/svg-icons/action/settings'

import './SidebarMenu.css'

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

const SideBarMenu = () => {
    return (
        <div className="sidebar_menu">
            <div className="sidebar_menu__logo">
            </div>
            <div className="sidebar_menu__items">
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
        </div>
    )
}

export default SideBarMenu
