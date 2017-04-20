import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'

const enhance = compose(
    injectSheet({
        dialog: {
            '& div:last-child': {
                textAlign: 'left !important',
                width: '500px',
                maxWidth: 'none',
                '& button': {
                    marginTop: '20px !important',
                    marginRight: '20px !important',
                    marginBottom: '5px !important',
                    maxWidth: '100px !important',
                    color: '#12aaeb !important'
                }
            }
        },

        body: {
            maxHeight: '600px !important',
            padding: '0 0 0 15px !important',
            overflow: 'hidden !important'
        },

        title: {
            width: '220px',
            margin: '0 auto',
            padding: '10px 0',
            textAlign: 'center',
            background: '#12aaeb',
            color: '#fff',
            position: 'relative'
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
            className={classes.dialog}
            bodyClassName={classes.body}>
            <div>
                <h4 className={classes.title}>{title}</h4>
            </div>
            {message}
            <div>
                <div>
                    <FlatButton
                        label="Отменить"
                        primary={true}
                        onTouchTap={onClose}
                        keyboardFocused={true}
                    />
                    <FlatButton
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
    type: PropTypes.oneOf(['delete']).isRequired,
    message: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
}

export default ConfirmDialog
