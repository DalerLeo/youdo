import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import CircularProgress from 'material-ui/CircularProgress'
import IconButton from 'material-ui/IconButton'
import Star from 'material-ui/svg-icons/toggle/star'
import ArrowLeft from 'material-ui/svg-icons/navigation/chevron-left'
import ArrowRight from 'material-ui/svg-icons/navigation/chevron-right'

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
            justifyContent: 'center',
            display: ({loading}) => loading ? 'flex' : 'none'
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
            width: '500px',
            height: '500px',
            position: 'relative',
            '& img': {
                width: '100%',
                height: '100%'
            }
        },
        bodyContent: {
            width: '100%'
        },
        arrows: {
            position: 'absolute',
            top: '50%',
            transform: 'translate(0, -50%)'
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
        width: 60,
        height: 60
    },
    button: {
        width: 70,
        height: 70,
        padding: 0
    }
}

const SlideShowDialog = enhance((props) => {
    const {open, onClose, classes, image, images, prevBtn, nextBtn} = props
    const imgURL = _.get(image, 'file')
    const lastIndex = _.get(images, 'length')
    const currentIndex = _.findIndex(images, (o) => {
        return o.id === _.get(image, 'id')
    })
    return (
        <Dialog
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={{width: '500px'}}
            bodyStyle={{minHeight: 'auto'}}
            bodyClassName={classes.popUp}>
            <div className={classes.titleContent}>
                <IconButton>
                    <Star color="#ffad36"/>
                </IconButton>
            </div>
            <div className={classes.inContent} style={{backgroundImage: 'url(' + imgURL + ')'}}>
                <div className={classes.loader}>
                    <CircularProgress size={35} thickness={4}/>
                </div>
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
    nextBtn: PropTypes.func.isRequired
}

export default SlideShowDialog
