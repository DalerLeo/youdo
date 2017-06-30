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
            textAlign: 'center',
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
            maxHeight: '50vh',
            minHeight: '184px',
            position: 'relative'
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
        color: '#ddd',
        width: 50,
        height: 50
    },
    button: {
        width: 70,
        height: 70,
        padding: 0
    }
}

const SlideShowDialog = enhance((props) => {
    const {open, onClose, classes} = props

    return (
        <Dialog
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={{width: '800px'}}
            bodyStyle={{minHeight: 'auto'}}
            bodyClassName={classes.popUp}>
            <div className={classes.bodyContent}>
                <div className={classes.titleContent}>
                    <IconButton>
                        <Star color="#ffad36"/>
                    </IconButton>
                </div>
                <div className={classes.inContent} style={{minHeight: '250px'}}>
                    <div className={classes.loader}>
                        <CircularProgress size={80} thickness={5}/>
                    </div>
                    <div className={classes.navLeft}>
                        <IconButton
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            disableTouchRipple={true}>
                            <ArrowLeft/>
                        </IconButton>
                    </div>
                    <div className={classes.navRight}>
                        <IconButton
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            disableTouchRipple={true}>
                            <ArrowRight/>
                        </IconButton>
                    </div>
                </div>
            </div>
        </Dialog>
    )
})

SlideShowDialog.propTyeps = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
}

export default SlideShowDialog
