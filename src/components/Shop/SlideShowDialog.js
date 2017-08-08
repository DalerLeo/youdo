import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import CircularProgress from 'material-ui/CircularProgress'
import IconButton from 'material-ui/IconButton'
import Star from 'material-ui/svg-icons/toggle/star'
import StarBorder from 'material-ui/svg-icons/toggle/star-border'
import ArrowLeft from 'material-ui/svg-icons/navigation/chevron-left'
import ArrowRight from 'material-ui/svg-icons/navigation/chevron-right'

const enhance = compose(
    injectSheet({
        loader: {
            width: '900px',
            height: '900px',
            background: '#fff',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex'
        },
        dialog: {
            cursor: 'pointer'
        },
        popUp: {
            cursor: 'default',
            overflowY: 'hidden !important',
            fontSize: '13px !important',
            position: 'relative',
            padding: '0 !important',
            overflowX: 'hidden',
            height: '100%'
        },
        titleContent: {
            position: 'absolute',
            left: '0',
            right: '0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '30px',
            zIndex: '999',
            '& button': {
                right: '7px',
                top: '7px',
                padding: '0 !important',
                position: 'absolute !important'
            }
        },
        inContent: {
            display: 'flex',
            position: 'relative',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            zIndex: '1',
            '& img': {

            }
        },
        bodyContent: {
            width: '100%'
        },
        arrows: {
            position: 'absolute',
            top: '50%',
            transform: 'translate(0, -50%)',
            zIndex: '10'
        },
        navLeft: {
            extend: 'arrows',
            left: '0'
        },
        navRight: {
            extend: 'arrows',
            right: '0'
        }
    })
)
const iconStyle = {
    icon: {
        color: '#f0f0f0',
        width: 65,
        height: 65
    },
    button: {
        width: 70,
        height: 70,
        padding: 0
    }
}
const SlideShowDialog = enhance((props) => {
    const {loading, open, onClose, classes, image, images, prevBtn, nextBtn, handleSetPrimaryImage} = props
    const imgURL = _.get(image, 'file')
    const imgId = 'slide' + _.get(image, 'id')
    const lastIndex = _.get(images, 'length')
    const currentIndex = _.findIndex(images, (o) => {
        const fileId = _.get(o, 'fileId')
        return fileId === _.get(image, 'id')
    })
    const isPrimary = _.get(_.find(images, {'fileId': _.get(image, 'id')}), 'isPrimary')
    return (
        <Dialog
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={{width: '100%', maxWidth: '900px'}}
            bodyStyle={{minHeight: 'auto'}}
            bodyClassName={classes.popUp}>
            <div className={classes.titleContent}>
                <IconButton>
                    {isPrimary ? <Star color="#ffad36"/>
                        : <StarBorder color="#e9e9e9" onTouchTap={handleSetPrimaryImage}/>}
                </IconButton>
            </div>
            <div className={classes.inContent}>
                {loading ? <div className={classes.loader}>
                    <CircularProgress size={40} thickness={4}/>
                </div>
                : <img id={imgId} src={imgURL} alt=""/>}
                <div className={classes.navLeft}>
                    <IconButton
                        iconStyle={iconStyle.icon}
                        style={iconStyle.button}
                        disableTouchRipple={true}
                        onTouchTap={() => { prevBtn(currentIndex, lastIndex) }}>
                        <ArrowLeft/>
                    </IconButton>
                </div>
                <div className={classes.navRight}>
                    <IconButton
                        iconStyle={iconStyle.icon}
                        style={iconStyle.button}
                        disableTouchRipple={true}
                        onTouchTap={() => { nextBtn(currentIndex, lastIndex) }}>
                        <ArrowRight/>
                    </IconButton>
                </div>
            </div>
        </Dialog>
    )
})
SlideShowDialog.propTyeps = {
    images: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    open: PropTypes.bool.isRequired,
    image: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    prevBtn: PropTypes.func.isRequired,
    nextBtn: PropTypes.func.isRequired,
    handleSetPrimaryImage: PropTypes.func
}
export default SlideShowDialog
