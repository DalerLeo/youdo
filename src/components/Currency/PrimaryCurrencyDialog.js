import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import CircularProgress from 'material-ui/CircularProgress'
import {Field, reduxForm, SubmissionError} from 'redux-form'
import toCamelCase from '../../helpers/toCamelCase'
import {CurrencySearchField} from '../ReduxForm'

export const PRIMARY_CURRENCY_DIALOG_OPEN = 'openPrimaryDialog'

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
            display: ({loading}) => !loading ? 'flex' : 'none'
        },

        body: {
            maxHeight: '600px !important',
            padding: '0 0 0 15px !important',
            overflow: 'hidden !important'
        }
    }),
    reduxForm({
        form: 'BaseCurrencyCreateForm',
        enableReinitialize: true
    })
)

const PrimaryCurrencyDialog = enhance((props) => {
    const {classes, open, onClose, handleSubmit, loading} = props
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
                    <Field
                        name="currency"
                        component={CurrencySearchField}
                        label="Валюта"
                        fullWidth={true}
                    />
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
            </form>
        </Dialog>
    )
})

PrimaryCurrencyDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired
}

PrimaryCurrencyDialog.defaultProps = {
    isUpdate: false
}

export default PrimaryCurrencyDialog
