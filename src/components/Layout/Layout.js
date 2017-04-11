import React from 'react'
import injectSheet from 'react-jss'
import SideBarMenu from '../SidebarMenu'
import AddMarketAndListMarket from '../AddMarketAndListMarket'

const Layout = ({classes, handleSignOut, children}) => {
    return (
        <div className={classes.wrapper}>
            <div className={classes.sidenav}>
                <SideBarMenu handleSignOut={handleSignOut} />
            </div>
            <div className={classes.content}>
                <AddMarketAndListMarket/>
                {children}
            </div>
        </div>
    )
}

export default injectSheet({
    wrapper: {
        height: '100%',
        width: '100%',
        display: 'flex'
    },
    sidenav: {
        width: '84px'
    },
    content: {
        background: '#f2f5f8',
        width: '100%',
        padding: '28px',
        overflow: 'auto'
    }
})(Layout)
