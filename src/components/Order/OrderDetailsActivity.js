import React from 'react'import injectSheet from 'react-jss'import {compose} from 'recompose'const enhance = compose(    injectSheet({        activityContent: {}    }))const OrderDetailsActivity = enhance((props) => {    const {classes} = props    return (        <div className={classes.imgContent}>            Order details Activity content        </div>    )})export default OrderDetailsActivity