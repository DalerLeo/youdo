import React from 'react'

import SideBarMenu from '../SidebarMenu'

import './Layout.css'

const Layout = (props) => {
    const {visible, setVisible, handleSignOut} = props
    return (
        <div className="layout">
            <div className="layout__sidenav">
                <SideBarMenu handleSignOut={handleSignOut} />
            </div>
            <div className="layout__content">
                {props.children}
            </div>
        </div>
    )
}

export default Layout
