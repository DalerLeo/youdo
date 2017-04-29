import React from 'react'
import SvgIcon from 'material-ui/SvgIcon'

const CloseIcon = (props) => {
    return (
        <SvgIcon {...props} fill="#000000" height="16" viewBox="0 0 24 24" width="16"
                 xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path
                d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
        </SvgIcon>
    )
}

export default CloseIcon
