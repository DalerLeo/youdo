import React from 'react'
import injectSheet from 'react-jss'
import {compose} from 'recompose'

const enhance = compose(
    injectSheet({

        statisticsContent: {
        }
    })
)

const SupplyDetailsStatistics = enhance((props) => {
    const {classes} = props

    return (
        <div className={classes.imgContent}>
            Supply Details Statistics content
        </div>
    )
})
SupplyDetailsStatistics.propTypes = {

}

export default SupplyDetailsStatistics

