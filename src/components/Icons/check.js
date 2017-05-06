import React from 'react'
import SvgIcon from 'material-ui/SvgIcon'

const CheckIcon = (props) => {
    return (
        <SvgIcon {...props} style={{width: '24px', height: '24px'}}>
            <g>
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </g>
        </SvgIcon>
    )
}

export default CheckIcon
