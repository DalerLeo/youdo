import React from 'react'
import injectSheet from 'react-jss'
import {compose} from 'recompose'

const enhance = compose(
    injectSheet({
        activityContent: {}
    })
)

const SupplyDetailsActivity = enhance((props) => {
    const {classes} = props
    return (
        <div className={classes.imgContent}>
            Supply details Activity content
        </div>
    )
})

export default SupplyDetailsActivity
