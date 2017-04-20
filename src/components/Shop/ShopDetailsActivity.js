import React from 'react'
import injectSheet from 'react-jss'
import {compose} from 'recompose'

const enhance = compose(
    injectSheet({
        activityContent: {}
    })
)

const ShopDetailsActivity = enhance((props) => {
    const {classes} = props
    return (
        <div className={classes.imgContent}>
            Shop details Activity content
        </div>
    )
})

export default ShopDetailsActivity
