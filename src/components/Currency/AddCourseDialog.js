import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import {Field, reduxForm, SubmissionError} from 'redux-form'
import toCamelCase from '../../helpers/toCamelCase'
import TextField from '../ReduxForm/Basic/TextField'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import IconButton from 'material-ui/IconButton'
import MainStyles from '../Styles/MainStyles'
import t from '../../helpers/translate'
import {openErrorAction} from '../../actions/error'

const enhance = compose(
    injectSheet(_.merge(MainStyles, {
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

        fields: {
            width: '100%'
        }
    })),
    reduxForm({
        form: 'AddCourseForm',
        enableReinitialize: true
    })
)

const PrimaryCurrencyDialog = enhance((props) => {
    const {classes, dispatch, open, onClose, handleSubmit, loading} = props
    const validate = (error) => {
        const errors = toCamelCase(error)
        const nonFieldErrors = _.get(errors, 'nonFieldErrors')
        if (!_.isEmpty(nonFieldErrors)) {
            return dispatch(openErrorAction({
                message: nonFieldErrors
            }))
        }

        throw new SubmissionError({
            ...errors,
            _error: nonFieldErrors
        })
    }
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))

    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '400px'} : {width: '400px'}}
            bodyClassName={classes.popUp}>
            <div className={classes.titleContent}>
                <span>{t('Установить курс')}</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <form onSubmit={onSubmit} className={classes.form}>
                    <div className={classes.inContent} style={{minHeight: '100px', paddingTop: '25px'}}>
                        <div className={classes.fields}>
                            <Field
                                name="rate"
                                component={TextField}
                                className={classes.inputFieldCustom}
                                label={t('Курс')}
                                fullWidth={true}
                            />
                        </div>
                    </div>
                    <div className={classes.bottomButton}>
                        <FlatButton
                            labelStyle={{fontSize: '13px'}}
                            label={t('Сохранить')}
                            type="submit"
                        />
                    </div>
                </form>
            </div>
        </Dialog>
    )
})

PrimaryCurrencyDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
}

PrimaryCurrencyDialog.defaultProps = {
    isUpdate: false
}

export default PrimaryCurrencyDialog
