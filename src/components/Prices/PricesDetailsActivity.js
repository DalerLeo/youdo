import React from 'react'
import injectSheet from 'react-jss'
import {compose} from 'recompose'

const enhance = compose(
    injectSheet({
        activityContent: {}
    })
)

const PricesDetailsActivity = enhance((props) => {
    const {classes} = props
    return (
        <div className={classes.imgContent}>
            Prices details Activity content
        </div>
    )
})

export default PricesDetailsActivity
