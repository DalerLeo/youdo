import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import IconButton from 'material-ui/IconButton'
import CircularProgress from 'material-ui/CircularProgress'
import CloseIcon2 from '../CloseIcon2'

export const PRODUCT_SHOW_PHOTO_OPEN = 'openShowBigImg'

const enhance = compose(
    injectSheet({
        loader: {
            width: '100%',
            height: '100%',
            background: '#fff !important',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex'
        },
        imagePopup: {
            '& > div > div': {
                maxWidth: '500px !important'
            }
        },
        imgPopup: {
            padding: '0 !important',
            maxHeight: '500px !important'
        },
        imgWrapper: {
            width: '500px',
            height: '500px',
            '& img': {
                height: '100%',
                width: '100%'
            }
        },
        closeBtn: {
            position: 'absolute !important',
            right: '7px',
            top: '7px'
        }
    }),
)

const ProductShowPhotoDialog = enhance((props) => {
    const {open, loading, onClose, classes, detailData} = props
    const items = _.get(detailData, 'data')
    const image = _.get(items, ['image', 'file'])
    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.imagePopup}
            bodyStyle={{minHeight: 'auto'}}
            bodyClassName={classes.imgPopup}>

            <div className={classes.imgWrapper}>
                <IconButton onTouchTap={onClose} className={classes.closeBtn}>
                    <CloseIcon2 color="#f0f0f0"/>
                </IconButton>
                {loading ? <div className={classes.loader}>
                        <CircularProgress />
                    </div>
                    : <img src={image}/>}
            </div>
        </Dialog>
    )
})

ProductShowPhotoDialog.propTyeps = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    detailData: PropTypes.object
}

export default ProductShowPhotoDialog
