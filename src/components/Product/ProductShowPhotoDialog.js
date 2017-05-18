import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import MainStyles from '../Styles/MainStyles'
import Product from '../Images/product.png'
import IconButton from 'material-ui/IconButton'
import CloseIcon2 from '../CloseIcon2'

export const PRODUCT_SHOW_PHOTO_OPEN = 'openShowBigImg'

const enhance = compose(
    injectSheet(_.merge(MainStyles, {
        loader: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: '#fff',
            top: '0',
            left: '0',
            alignItems: 'center',
            zIndex: '999',
            textAlign: 'center',
            display: ({loading}) => loading ? 'flex' : 'none'
        },
        dialog: {
            '& div div div': {
                backgroundColor: 'transparent !important',
                boxShadow: 'none !important'
            }
        },
        titleContent: {
            border: 'none !important'
        },
        popUp: {
            '& img': {
                margin: '0 auto',
                display: 'block'
            }
        }
    })),
)

const ProductShowPhotoDialog = enhance((props) => {
    const {open, loading, onClose, classes} = props

    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '300px'} : {width: '50%', minWidth: '50px', maxWidth: '1500px'}}
            bodyStyle={{minHeight: 'auto'}}
            bodyClassName={classes.popUp}>
            <div className={classes.titleContent}>
                <IconButton onTouchTap={onClose} style={{color: '#fff'}}>
                    <CloseIcon2 color="#fff"/>
                    CLOSE
                </IconButton>
            </div>
            <img src={Product} />
        </Dialog>
    )
})

ProductShowPhotoDialog.propTyeps = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}

export default ProductShowPhotoDialog
