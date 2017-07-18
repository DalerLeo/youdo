import _ from 'lodash'
import React from 'react'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {connect} from 'react-redux'
import Dialog from 'material-ui/Dialog'
import IconButton from 'material-ui/IconButton'
import CloseIcon2 from '../CloseIcon2'
import Error from 'material-ui/svg-icons/alert/error-outline'
import FlatButton from 'material-ui/FlatButton'
import {closeErrorAction} from '../../actions/error'

const enhance = compose(
    injectSheet({
        popUp: {
            overflowY: 'hidden !important',
            fontSize: '13px !important',
            position: 'relative',
            padding: '0 !important',
            overflowX: 'hidden',
            height: '100%'
        },
        inContent: {
            background: '#ff6663',
            padding: '40px 0',
            width: '100%',
            color: '#fff',
            textAlign: 'center',
            '& svg': {
                margin: 'auto'
            },
            '& > div': {
                margin: '25px 0 20px',
                fontWeight: '600'
            },
            '& > button': {
                '& > div': {
                    lineHeight: 'normal !important'
                }
            }
        },
        bodyContent: {
            position: 'relative',
            '& > button': {
                top: '3px',
                right: '3px',
                padding: '0 !important',
                position: 'absolute !important'
            }
        }
    }),
    connect((state) => {
        const open = _.get(state, ['error', 'open'])
        const message = _.get(state, ['error', 'message'])

        return {
            open,
            message
        }
    })
)

const buttonStyle = {
    border: '1px #fff solid',
    height: '34px',
    lineHeight: '34px'
}

const ErrorDialog = ({dispatch, message, open, classes, ...defaultProps}) => {
    const close = () => dispatch(closeErrorAction())
    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={close}
            contentStyle={{width: '350px'}}
            className={classes.dialog}
            bodyClassName={classes.popUp}
            overlayStyle={{background: 'rgba(0,0,0,0.45)'}}
            style={{zIndex: '9999999999'}}
            paperClassName="ffff"
            {...defaultProps}>
            <div className={classes.bodyContent}>
                <IconButton onTouchTap={close}>
                    <CloseIcon2 color="#fff"/>
                </IconButton>
                <div className={classes.inContent}>
                    <Error color="#fff" style={{width: '55px', height: '55px'}}/>
                    <div>{message}</div>
                    <FlatButton
                        label="Обновить"
                        backgroundColor="transparent"
                        style={buttonStyle}
                        rippleColor="#ff6663"
                        hoverColor="rgba(255,255,255,0.3)"
                        labelStyle={{textTransform: 'none', color: '#fff'}}
                        />
                </div>
            </div>
        </Dialog>
    )
}

export default enhance(ErrorDialog)
