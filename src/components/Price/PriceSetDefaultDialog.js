import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withHandlers} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import Loader from '../Loader'
import {Field, reduxForm, SubmissionError} from 'redux-form'
import toCamelCase from '../../helpers/toCamelCase'
import {
    TextField,
    normalizeNumber
} from '../ReduxForm'

import CloseIcon from 'material-ui/svg-icons/navigation/close'
import MainStyles from '../Styles/MainStyles'
import {openErrorAction} from '../../actions/error'
import t from '../../helpers/translate'

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
        }
    })),
    reduxForm({
        form: 'PriceSetDefaultForm',
        enableReinitialize: true
    }),
    withHandlers({
        validate: props => (data) => {
            const errors = toCamelCase(data)
            const nonFieldErrors = _.get(errors, 'nonFieldErrors')
            props.dispatch(openErrorAction({
                message: <div>{nonFieldErrors}</div>
            }))
            throw new SubmissionError({
                ...errors,
                _error: nonFieldErrors
            })
        }
    })
)
const PriceSetDefaultDialog = enhance((props) => {
    const {
        open,
        loading,
        handleSubmit,
        onClose,
        classes,
        isUpdate
    } = props
    const onSubmit = handleSubmit(() => props.onSubmit().catch(props.validate))
    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '300px'} : {width: '400px'}}
            bodyClassName={classes.popUp}>
            <div className={classes.titleContent}>
                <span>{!isUpdate ? t('Добавить себестоимость') : t('Изменить себестоимость')}</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <form onSubmit={onSubmit} className={classes.form}>
                    <div className={classes.inContent} style={{minHeight: 'unset', display: 'block'}}>
                        <div className={classes.loader}>
                            <Loader size={0.75}/>
                        </div>
                        <Field
                            name="amount"
                            component={TextField}
                            label={t('Сумма')}
                            normalize={normalizeNumber}
                            className={classes.inputFieldCustom}
                            fullWidth={true}/>
                    </div>
                    <div className={classes.bottomButton}>
                        <FlatButton
                            label={t('Сохранить')}
                            className={classes.actionButton}
                            labelStyle={{fontSize: '13px'}}
                            primary={true}
                            type="submit"
                        />
                    </div>
                </form>
            </div>
        </Dialog>
    )
})

PriceSetDefaultDialog.propTyeps = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}
PriceSetDefaultDialog.defaultProps = {
    isUpdate: false
}

export default PriceSetDefaultDialog
