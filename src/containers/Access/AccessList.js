import React from 'react'
import injectSheet from 'react-jss'
import {compose} from 'recompose'

const enhance = compose(
    injectSheet({
        wrapper: {
            background: '#2d3037',
            width: '100%',
            height: '100%'
        }
    })
)

const AccessList = enhance((props) => {
    const {classes} = props
    return (
        <div className={classes.wrapper}>
            Access Denied!!!
        </div>
    )
})

export default AccessList
