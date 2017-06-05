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
            height: '100%'
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
        inputField: {
            fontSize: '13px !important'
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
            name: 'Подтверждение отмены', submitName: 'Отменить', text: 'Вы уверены что хотите отменить эти данные?'
        }
    }
    const title = _.get(typesList, [type, 'name'])
    const buttonLabel = _.get(typesList, [type, 'submitName'])
    const text = _.get(typesList, [type, 'text'])
    if (loading) {
        return (
            <div>
                <div className={classes.loader}>
                    <CircularProgress/>
                </div>
            </div>
        )
    }
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
                    <div className={classes.confirm}>
                        {text}
                    </div>
                    <div className={classes.background}>
                        {message}
                    </div>
                </div>
                <div className={classes.bottomButton}>
                    <FlatButton
                        className={classes.actionButton}
                        label={buttonLabel}
                        primary={true}
                        onTouchTap={onSubmit}
                    />
                </div>
            </div>
        </Dialog>
    )
})

ConfirmDialog.propTypes = {
    type: PropTypes.oneOf(['delete', 'cancel']).isRequired,
    message: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
}

export default ConfirmDialog
