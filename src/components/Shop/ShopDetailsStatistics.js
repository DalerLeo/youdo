import React from 'react'
import injectSheet from 'react-jss'
import {compose} from 'recompose'

const enhance = compose(
    injectSheet({

        statisticsContent: {
        }
    })
)

const ShopDetailsStatistics = enhance((props) => {
    const {classes} = props

    return (
        <div className={classes.imgContent}>
            Shop Details Statistics content
        </div>
    )
})
ShopDetailsStatistics.propTypes = {

}

export default ShopDetailsStatistics

