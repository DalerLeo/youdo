import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import CircularProgress from 'material-ui/CircularProgress'
import FlatButton from 'material-ui/FlatButton'
import {Field, reduxForm, SubmissionError} from 'redux-form'
import toCamelCase from '../../helpers/toCamelCase'
import {TextField} from '../ReduxForm'

export const CASHBOX_CREATE_DIALOG_OPEN = 'openCreateDialog'

const validate = (data) => {
    const errors = toCamelCase(data)
    const nonFieldErrors = _.get(errors, 'nonFieldErrors')
    const latLng = (_.get(errors, 'lat') || _.get(errors, 'lon')) && 'Location is required.'

    throw new SubmissionError({
        ...errors,
        latLng,
        _error: nonFieldErrors
    })
}

const enhance = compose(
    injectSheet({
        dialog: {
            '& div:last-child': {
                textAlign: 'left !important',
                '& button': {
                    marginLeft: '50px !important',
                    marginBottom: '5px !important',
                    color: '#12aaeb !important'
                }
            }
        },

        loader: {
            width: '120px',
            margin: '0 auto',
            padding: '15px',
            textAlign: 'center',
            display: ({loading}) => loading ? 'flex' : 'none',
            flexDirection: 'center'
        },

        fields: {
            display: ({loading}) => !loading ? 'block' : 'none'
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
    }),
    reduxForm({
        form: 'CashboxCreateForm',
        enableReinitialize: true
    })
)

const CashboxCreateDialog = enhance((props) => {
    const {open, loading, handleSubmit, onClose, classes, isUpdate} = props
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))

    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '135px'} : {}}
            bodyClassName={classes.body}>
            <form onSubmit={onSubmit} className={classes.form}>
                <div className={classes.loader}>
                    <CircularProgress size={80} thickness={5}/>
                </div>
                <div className={classes.fields}>
                    <div>
                        <h4 className={classes.title}> {isUpdate ? 'Изменить категорию' : 'Добавить категорию'}</h4>
                    </div>
                    <div>
                        <div>
                            <Field
                                name="name"
                                component={TextField}
                                label="Наимование"
                                fullWidth={true}
                            />
                        </div>
                        <div>
                            <FlatButton
                                label="Отменить"
                                primary={true}
                                onTouchTap={onClose}
                            />

                            <FlatButton
                                label="Отправить"
                                primary={true}
                                type="submit"
                                keyboardFocused={true}
                            />
                        </div>
                    </div>
                </div>
            </form>
        </Dialog>
    )
})

CashboxCreateDialog.propTyeps = {
    isUpdate: PropTypes.bool.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}

CashboxCreateDialog.defaultProps = {
    isUpdate: false
}
export default CashboxCreateDialog
