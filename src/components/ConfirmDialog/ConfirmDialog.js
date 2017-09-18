import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import CircularProgress from 'material-ui/CircularProgress'
import CloseIcon2 from '../CloseIcon2'

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
            zIndex: '999',
            '& button': {
                right: '13px',
                padding: '0 !important',
                position: 'absolute !important'
            }
        },
        inContent: {
            maxHeight: '50vh',
            minHeight: '184px',
            overflow: 'auto',
            padding: '0 30px',
            color: '#333'
        },
        bodyContent: {
            width: '100%'
        },
        form: {
            position: 'relative'
        },
        field: {
            width: '100%'
        },
        inputFieldCustom: {
            fontSize: '13px !important',
            height: '45px !important',
            marginTop: '7px',
            '& div': {
                fontSize: '13px !important'
            },
            '& label': {
                top: '20px !important',
                lineHeight: '5px !important'
            },
            '& input': {
                marginTop: '0 !important'
            }
        },
        bottomButton: {
            bottom: '0',
            left: '0',
            right: '0',
            padding: '10px',
            zIndex: '999',
            borderTop: '1px solid #efefef',
            background: '#fff',
            textAlign: 'right',
            '& span': {
                fontSize: '13px !important',
                fontWeight: '600 !important',
                color: '#129fdd',
                verticalAlign: 'inherit !important'
            }
        },
        actionButton: {
            fontSize: '13px !important',
            margin: '0 !important'
        },
        background: {
            background: '#f1f5f8',
            boxSizing: 'content-box',
            fontWeight: '600',
            padding: '20px 30px',
            margin: '0 -30px',
            width: '100%'
        },
        confirm: {
            padding: '20px 0'
        },
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
        }
    })
)

const ConfirmDialog = enhance((props) => {
    const {open, onClose, classes, type, message, onSubmit, loading} = props
    const typesList = {
        delete: {
            name: 'Подтверждение удаления', submitName: 'Удалить', text: 'Вы уверены что хотите удалить эти данные?'
        },
        cancel: {
            name: 'Подтверждение отмены', submitName: 'Подтвердить', text: 'Вы уверены что хотите отменить эти данные?'
        },
        submit: {
            name: 'Выполнить', submitName: 'Да', text: 'Вы уверены что хотите подтвердить?'
        }
    }
    const title = _.get(typesList, [type, 'name'])
    const buttonLabel = _.get(typesList, [type, 'submitName'])
    const text = _.get(typesList, [type, 'text'])

    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            contentStyle={{width: '500px'}}
            className={classes.dialog}
            bodyClassName={classes.popUp}>
            <div className={classes.titleContent}>
                <span>{title}</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon2 color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <div className={classes.inContent}>
                    {loading &&
                    <div className={classes.loader}>
                        <CircularProgress size={40} thickness={4}/>
                    </div>}
                    <div className={classes.confirm}>
                        {text}
                    </div>
                    {message && <div className={classes.background}>
                        {message}
                    </div>}
                </div>
                <div className={classes.bottomButton}>
                    <FlatButton
                        className={classes.actionButton}
                        label={buttonLabel}
                        labelStyle={{fontSize: '13px'}}
                        primary={true}
                        onTouchTap={onSubmit}
                    />
                </div>
            </div>
        </Dialog>
    )
})

ConfirmDialog.propTypes = {
    type: PropTypes.oneOf(['delete', 'cancel', 'submit']).isRequired,
    message: PropTypes.string.isRequired,
    loading: PropTypes.bool,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
}

export default ConfirmDialog
