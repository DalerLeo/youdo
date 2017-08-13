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
import CloseIcon2 from '../CloseIcon2'
import IconButton from 'material-ui/IconButton'
import MainStyles from '../Styles/MainStyles'
import normalizeNumber from '../ReduxForm/normalizers/normalizeNumber'
import getConfig from '../../helpers/getConfig'
import numberFormat from '../../helpers/numberFormat'

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
        form: 'ClientBalanceCreateForm',
        enableReinitialize: true
    })
)
const ZERO = 0

const ClientBalanceCreateDialog = enhance((props) => {
    const {classes, open, onClose, handleSubmit, loading, name, balance} = props
    const currentCurrency = getConfig('PRIMARY_CURRENCY')

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
                <span>Добавить расход к клиенту </span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon2 color="#666666"/>
                </IconButton>
            </div>
            {loading ? <div className={classes.loader}>
                    <CircularProgress size={40} thickness={4}/>
                </div>
                : <div className={classes.bodyContent}>
                    <div >
                        <div className={classes.info}>
                            <div>
                                <span><b>Клиент:</b> {name} </span>
                            </div>
                            <div>
                                <b>Баланс:</b>
                                <span className={(balance >= ZERO) ? classes.green : classes.red}>{numberFormat(balance, currentCurrency)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            }
            <div className={classes.bodyContent}>
                <form onSubmit={onSubmit} className={classes.form}>
                    <div className={classes.inContent} style={{minHeight: '100px', paddingTop: '25px'}}>
                        <div className={classes.fields}>
                            <div className={classes.flex} style={{alignItems: 'baseline'}}>
                                <Field
                                    name="amount"
                                    component={TextField}
                                    label="Сумма"
                                    normalize={normalizeNumber}
                                    className={classes.inputFieldCustom}
                                    style={{width: '50%'}}
                                    fullWidth={false}/>
                                <div style={{marginLeft: '20px'}}>
                                </div>
                            </div>
                            <Field
                                name="comment"
                                style={{top: '-20px', lineHeight: '20px', fontSize: '13px'}}
                                component={TextField}
                                label="Комментарий..."
                                multiLine={true}
                                rows={1}
                                rowsMax={3}
                                fullWidth={true}/>
                        </div>
                    </div>
                    <div className={classes.bottomButton}>
                        <FlatButton
                            label="Сохранить"
                            type="submit"
                        />
                    </div>
                </form>
            </div>
        </Dialog>
    )
})

ClientBalanceCreateDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
}

ClientBalanceCreateDialog.defaultProps = {
    isUpdate: false
}

export default ClientBalanceCreateDialog
