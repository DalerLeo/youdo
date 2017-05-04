import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import CloseIcon2 from '../CloseIcon2'
import IconButton from 'material-ui/IconButton'

const colorBlue = '#129fdd !important'
const enhance = compose(
    injectSheet({
        body: {
            overflowY: 'auto !important',
            fontSize: '13px !important',
            position: 'relative',
            padding: '20px !important'
        },
        title: {
            paddingTop: '15px',
            fontWeight: 'bold',
            color: '#333'
        },
        titleContent: {
            background: '#fff',
            color: '#333',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            borderBottom: '1px solid #efefef',
            padding: '20px 30px',
            zIndex: '999',
            '& button': {
                position: 'absolute !important',
                right: '10px',
                top: '50%',
                padding: '0 !important',
                marginTop: '-24px !important'
            }
        },
        form: {
            padding: '35px 10px 57px'
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
        bottomButton: {
            position: 'fixed',
            bottom: '0',
            left: '0',
            right: '0',
            padding: '20px',
            zIndex: '999',
            borderTop: '1px solid #efefef',
            background: '#fff',
            textAlign: 'right',
            '& span': {
                fontSize: '13px !important',
                fontWeight: '600 !important',
                color: colorBlue
            }
        },
        actionButton: {
            fontSize: '13px !important',
            margin: '0 !important'
        }
    })
)

const ConfirmDialog = enhance((props) => {
    const {open, onClose, classes, type, message, onSubmit} = props
    const typesList = {
        delete: {
            name: 'Подтверждение удаления', submitName: 'Удалить'
        }
    }
    const title = _.get(typesList, [type, 'name'])
    const buttonLabel = _.get(typesList, [type, 'submitName'])

    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            contentStyle={{width: '500px'}}
            className={classes.dialog}
            bodyClassName={classes.body}>
            <div className={classes.titleContent}>
                <span>{title}</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon2 color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.form}>
                <div className={classes.confirm}>
                    Вы уверены что хотите удалить эти данные?
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
        </Dialog>
    )
})

ConfirmDialog.propTypes = {
    type: PropTypes.oneOf(['delete']).isRequired,
    message: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
}

export default ConfirmDialog
