import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Paper from 'material-ui/Paper'
import Loader from '../Loader'
import IconButton from 'material-ui/IconButton'
import Star from 'material-ui/svg-icons/toggle/star'
import StarBorder from 'material-ui/svg-icons/toggle/star-border'
import ArrowLeft from 'material-ui/svg-icons/navigation/chevron-left'
import ArrowRight from 'material-ui/svg-icons/navigation/chevron-right'

const enhance = compose(
    injectSheet({
        loader: {
            width: '500px',
            height: '500px',
            background: '#fff',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex'
        },
        dialog: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            zIndex: '1000'
        },
        popUp: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '10'
        },
        overlay: {
            position: 'fixed',
            background: 'rgba(0,0,0, 0.54)',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            cursor: 'pointer',
            zIndex: '5'
        },
        inContent: {
            display: 'flex',
            position: 'relative',
            minWidth: '500px',
            minHeight: '500px',
            '& img': {
                margin: 'auto',
                display: 'block'
            }
        },
        favourite: {
            right: '7px',
            top: '7px',
            padding: '0 !important',
            position: 'absolute !important'
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
        color: '#fff',
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
    const {
        loading,
        open,
        onClose,
        classes,
        image,
        images,
        prevBtn,
        nextBtn,
        handleSetPrimaryImage
    } = props

    const imgURL = _.get(image, 'file')
    const lastIndex = _.get(images, 'length')
    const currentIndex = _.findIndex(images, (o) => {
        const fileId = _.get(o, 'fileId')
        return fileId === _.get(image, 'id')
    })
    const isPrimary = _.get(_.find(images, {'fileId': _.get(image, 'id')}), 'isPrimary')
    if (open) {
        return (
            <div className={classes.dialog}>
                <div className={classes.overlay} onClick={onClose}>{null}</div>
                <div className={classes.popUp}>
                    <Paper zDepth={3} className={classes.inContent}>
                        {!loading &&
                        <div className={classes.navLeft}>
                            <IconButton
                                iconStyle={iconStyle.icon}
                                style={iconStyle.button}
                                disableTouchRipple={true}
                                onTouchTap={() => { prevBtn(currentIndex, lastIndex) }}>
                                <ArrowLeft/>
                            </IconButton>
                        </div>}

                        {loading
                            ? <div className={classes.loader}>
                                <Loader size={0.75}/>
                            </div>
                            : <img src={imgURL} alt=""/>}
                        <IconButton className={classes.favourite}>
                            {isPrimary ? <Star color="#ffad36"/>
                                : <StarBorder color="#e9e9e9" onTouchTap={handleSetPrimaryImage}/>}
                        </IconButton>

                        {!loading &&
                        <div className={classes.navRight}>
                            <IconButton
                                iconStyle={iconStyle.icon}
                                style={iconStyle.button}
                                disableTouchRipple={true}
                                onTouchTap={() => { nextBtn(currentIndex, lastIndex) }}>
                                <ArrowRight/>
                            </IconButton>
                        </div>}
                    </Paper>
                </div>
            </div>
        )
    }
    return null
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
