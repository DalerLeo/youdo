import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import Product from '../Images/product.png'
import IconButton from 'material-ui/IconButton'
import CloseIcon2 from '../CloseIcon2'

export const PRODUCT_SHOW_PHOTO_OPEN = 'openShowBigImg'

const enhance = compose(
    injectSheet({
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
        popUp: {
            fontSize: '13px !important',
            position: 'relative',
            padding: '0 !important',
            height: '100%',
            minHeight: '300px !important',
            overflow: 'auto !important'
        },
        titleContent: {
            background: '#fff',
            color: '#333',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #efefef',
            padding: '20px 30px',
            border: 'none !important',
            zIndex: '999',
            '& button': {
                right: '13px',
                padding: '0 !important',
                position: 'absolute !important'
            }
        },
        inContent: {
            display: 'flex',
            maxHeight: '50vh',
            minHeight: '184px',
            overflow: 'auto',
            padding: '0 30px',
            color: '#333'
        },
        bodyContent: {
            width: '100%'
        },
        imagePopup: {
            '& div div': {
                background: 'transparent !important',
                boxShadow: 'none !important'
            }
        },
        imgPopup: {
            background: 'transparent !important',
            boxShadow: 'none !important',
            fontSize: '13px !important',
            position: 'relative',
            padding: '0 !important',
            height: '100%',
            minHeight: '300px !important',
            '& img': {
                margin: '0 auto',
                display: 'block',
                boxShadow: 'rgba(0, 0, 0, 0.25) 0px 14px 45px, rgba(0, 0, 0, 0.22) 0px 10px 18px'
            }
        }
    }),
)

const ProductShowPhotoDialog = enhance((props) => {
    const {open, loading, onClose, classes} = props

    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.imagePopup}
            contentStyle={loading ? {width: '300px'} : {}}
            bodyStyle={{minHeight: 'auto'}}
            bodyClassName={classes.imgPopup}>
            <div className={classes.titleContent}>
                <IconButton onTouchTap={onClose} style={{color: '#fff'}}>
                    <CloseIcon2 color="#fff"/>
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
