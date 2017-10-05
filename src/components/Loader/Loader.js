import React from 'react'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import LoadeR from '../Images/loader.svg'

const enhance = compose(
    injectSheet({
        loader: {
            background: 'url(' + LoadeR + ') no-repeat center top',
            backgroundSize: '100%',
            width: '60px',
            height: '48px'
        }
    })
)
const Loader = enhance((props) => {
    const {classes} = props
    return (
        <div className={classes.loader}>
        </div>
    )
})

export default Loader
