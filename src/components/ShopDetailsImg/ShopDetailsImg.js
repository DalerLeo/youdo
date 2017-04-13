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

const ShopDetailsImg = enhance((props) => {
    const {classes} = props
    return (
        <div className={classes.imgContent}>
            Detail Img content
            <img alt="" onLoad={console.log('img load')}/>
        </div>
    )
})

export default ShopDetailsImg
