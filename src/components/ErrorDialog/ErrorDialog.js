import _ from 'lodash'
import React from 'react'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {connect} from 'react-redux'
import Dialog from 'material-ui/Dialog'
import IconButton from 'material-ui/IconButton'
import CloseIcon2 from '../CloseIcon2'
import Error from 'material-ui/svg-icons/alert/error-outline'
import {closeErrorAction} from '../../actions/error'

const enhance = compose(
    injectSheet({
        popUp: {
            overflowY: 'hidden !important',
            fontSize: '13px !important',
            position: 'relative',
            padding: '0 !important',
            overflowX: 'hidden',
            height: '100%',
            marginBottom: '64px'
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
        const arrMessage = _.get(state, ['error', 'arrMessage'])

        return {
            open,
            message,
            arrMessage
        }
    })
)

const ErrorDialog = ({dispatch, message, open, classes, arrMessage, ...defaultProps}) => {
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
            {...defaultProps}>
            <div className={classes.bodyContent}>
                <IconButton onTouchTap={close}>
                    <CloseIcon2 color="#fff"/>
                </IconButton>
                <div className={classes.inContent}>
                    <Error color="#fff" style={{width: '55px', height: '55px'}}/>
                    <div>{message}</div>
                    {_.map(arrMessage, (item, index) => {
                        return (
                            <p key={index}>{(index !== 'non_field_errors') && <b style={{textTransform: 'uppercase'}}>{index}: </b>}{item}</p>
                        )
                    })}

                </div>
            </div>
        </Dialog>
    )
}

export default enhance(ErrorDialog)
