import React from 'react'
import injectSheet from 'react-jss'
import {compose} from 'recompose'

const enhance = compose(
    injectSheet({

        imgContent: {
            '& img': {
                width: '33%',
                margin: '1px'
            },
            height: '390px',
            boxSizing: 'border-box',
            overflowY: 'scroll'
        }
    })
)

const ShopDetailsMap = enhance((props) => {
    const {classes} = props
    return (
        <div className={classes.imgContent}>
            Shop Details Map content
        </div>
    )
})
ShopDetailsMap.propTypes = {
    // data: React.PropTypes.object.isRequired,
    // loading: React.PropTypes.bool.isRequired
}

export default ShopDetailsMap
