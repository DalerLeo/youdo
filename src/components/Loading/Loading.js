import React from 'react'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import CircularProgress from 'material-ui/CircularProgress'

const enhance = compose(
    injectSheet({
        loader: {
            width: '100%',
            background: '#fff',
            height: '400px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }
    })
)

const ShopDetailsImg = enhance((props) => {
    const {classes} = props
    return (
        <div className={classes.loader}>
            <div>
                <CircularProgress size={100} thickness={6} />
            </div>
        </div>
    )
})
ShopDetailsImg.propTypes = {}

export default ShopDetailsImg

