import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import IconButton from 'material-ui/IconButton'
import Loader from '../Loader'
import CloseIcon from 'material-ui/svg-icons/navigation/close'

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
            justifyContent: 'center',
            display: ({loading}) => loading ? 'flex' : 'none'
        },
        popUp: {
            fontSize: '13px !important',
            position: 'relative',
            padding: '0 !important',
            height: '100%',
            overflow: 'auto !important',
            marginBottom: '64px'
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
            overflow: 'initial !important',
            textAlign: 'center',
            minHeight: '300px !important',
            '& img': {
                margin: '0 auto',
                display: 'block',
                boxShadow: 'rgba(0, 0, 0, 0.25) 0px 14px 45px, rgba(0, 0, 0, 0.22) 0px 10px 18px'
            }
        },
        imgWrapper: {
            display: 'inline-block',
            position: 'relative'
        },
        closeBtn: {
            position: 'absolute !important',
            right: '-48px',
            top: '-48px'
        }
    }),
)

const PriceShowPhotoDialog = enhance((props) => {
    const {open, loading, onClose, classes, detailData} = props
    const items = _.get(detailData, 'data')
    const image = _.get(items, ['image', 'file'])
    if (loading) {
        return (
            <div>
                <div className={classes.loader}>
                    <Loader size={0.75}/>
                </div>
            </div>
        )
    }
    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.imagePopup}
            contentStyle={loading ? {width: '300px'} : {}}
            bodyStyle={{minHeight: 'auto'}}
            bodyClassName={classes.imgPopup}>

            <div className={classes.imgWrapper}>
                <IconButton onTouchTap={onClose} style={{color: '#fff'}} className={classes.closeBtn}>
                    <CloseIcon color="#fff"/>
                </IconButton>
                <img src={image}/>
            </div>
        </Dialog>
    )
})

PriceShowPhotoDialog.propTyeps = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    detailData: PropTypes.object
}

export default PriceShowPhotoDialog
