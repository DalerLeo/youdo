import _ from 'lodash'import React from 'react'import PropTypes from 'prop-types'import {compose} from 'recompose'import injectSheet from 'react-jss'import IconButton from 'material-ui/IconButton'import Paper from 'material-ui/Paper'import Loader from '../Loader'import CloseIcon from 'material-ui/svg-icons/navigation/close'export const PRODUCT_SHOW_PHOTO_OPEN = 'openShowBigImg'const enhance = compose(    injectSheet({        loader: {            width: '120px',            height: '120px',            background: '#fff !important',            alignItems: 'center',            zIndex: '999',            justifyContent: 'center',            display: 'flex'        },        imagePopup: {            background: 'rgba(0,0,0, 0.75)',            display: 'flex',            alignItems: 'flex-start',            justifyContent: 'center',            position: 'fixed',            overflowY: 'auto',            top: '0',            left: '0',            right: '0',            bottom: '0',            zIndex: '2000'        },        loadingWrapper: {            alignSelf: 'center'        },        imgWrapper: {            margin: '60px 0',            '& img': {                display: 'block'            }        },        closeBtn: {            position: 'fixed !important',            right: '7px',            top: '7px'        }    }),)const ProductShowPhotoDialog = enhance((props) => {    const {open, loading, onClose, classes, detailData} = props    const image = _.get(detailData, ['data', 'image', 'file'])    return open    ? (        <div className={classes.imagePopup}>            <Paper zDepth={3} className={loading ? classes.loadingWrapper : classes.imgWrapper}>                <IconButton onTouchTap={onClose} className={classes.closeBtn}>                    <CloseIcon color="#f0f0f0"/>                </IconButton>                {loading                    ? <div className={classes.loader}>                        <Loader size={0.75}/>                    </div>                    : <img src={image}/>}            </Paper>        </div>    )    : null})ProductShowPhotoDialog.propTyeps = {    open: PropTypes.bool.isRequired,    onClose: PropTypes.func.isRequired,    loading: PropTypes.bool.isRequired,    detailData: PropTypes.object}export default ProductShowPhotoDialog