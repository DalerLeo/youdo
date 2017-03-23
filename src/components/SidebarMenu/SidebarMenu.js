import React from 'react'
import {Link} from 'react-router'
import * as ROUTES from '../../constants/routes'
import {Sidebar, Divider, Menu, Icon} from 'semantic-ui-react'

const SideBarMenu = ({visible}) => {
    return (
        <Sidebar as={Menu}
                 animation="push"
                 className="left_sidebar"
                 visible={visible}
                 width="thin"
                 icon="labeled"
                 vertical
                 inverted>
            <Link to={ROUTES.DASHBOARD_URL}>
                <Menu.Item name="Dashboard">
                    <Icon name="dashboard"/>
                    Dashboard
                </Menu.Item>
            </Link>
            <Divider />
            <Link to={ROUTES.SHOP_LIST_URL}>
                <Menu.Item name="Shop">
                    <Icon name="shop"/>
                    Shop
                </Menu.Item>
            </Link>
            <Divider />
            <Link to={ROUTES.DAILY_ENTRY_LIST_URL}>
                <Menu.Item name="Daily entry">
                    <Icon name="wait"/>
                    Daily entry
                </Menu.Item>
            </Link>
            <Divider />
            <Link to={ROUTES.DAILY_REPORT_LIST_URL}>
                <Menu.Item name="Daily report">
                    <Icon name="archive"/>
                    Daily report
                </Menu.Item>
            </Link>
            <Divider />

            <Link to={ROUTES.MONTHLY_REPORT_LIST_URL}>
                <Menu.Item name="Monthly report">
                    <Icon name="calendar"/>
                    Monthly report
                </Menu.Item>
            </Link>
            <Divider />

            <Link to={ROUTES.CLIENT_LIST}>
                <Menu.Item name="Client">
                    <Icon name="user"/>
                    Client
                </Menu.Item>
            </Link>
            <Divider />
            <Link to={ROUTES.BROKER_LIST_URL}>
                <Menu.Item name="Broker">
                    <Icon name="spy"/>
                    Broker
                </Menu.Item>
            </Link>
            <Divider />
            <Link to={ROUTES.FUND_MANAGER_LIST_URL}>
                <Menu.Item name="Fund Manager">
                    <Icon name="travel"/>
                    Fund Manager
                </Menu.Item>
            </Link>
            <Divider />
        </Sidebar>
    )
}

export default SideBarMenu
