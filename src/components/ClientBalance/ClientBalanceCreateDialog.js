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
import normalizeNumber from '../ReduxForm/normalizers/normalizeNumber'
import getConfig from '../../helpers/getConfig'
import numberFormat from '../../helpers/numberFormat'
import Loader from '../Loader'
import {DivisionSearchField, PaymentTypeSearchField} from '../ReduxForm'

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
        },
        bodyContent: {
            '& > .row': {
                '& > div:last-child': {
                    textAlign: 'right'
                }
            }
        },
        default: {
            fontWeight: '600',
            padding: '0 5px'
        },
        red: {
            extend: 'default'
        },
        green: {
            extend: 'default'
        }
    })),
    reduxForm({
        form: 'ClientBalanceCreateForm',
        enableReinitialize: true
    })
)
const ZERO = 0
const ClientBalanceCreateDialog = enhance((props) => {
    const {classes, open, onClose, handleSubmit, loading, name, detailData, listData, addDialog, superUser} = props
    const data = _.find(_.get(listData, 'data'), {'id': _.get(detailData, 'id')})
    let balanceArr = []
    const currency = getConfig('PRIMARY_CURRENCY')
    const divisionStatus = getConfig('DIVISIONS')

    _.map(_.get(data, 'divisions'), (item) => {
        balanceArr.push({amount: _.get(item, 'cash'), name: _.get(item, 'name'), type: 'нал.'})
        balanceArr.push({amount: _.get(item, 'bank'), name: _.get(item, 'name'), type: 'переч.'})
    })
    const balanceInfo = _.map(balanceArr, (balance, index) => {
        const balanceName = _.get(balance, 'name')
        const amount = _.toNumber(_.get(balance, 'amount'))
        const type = _.get(balance, 'type')
        return (
            <div key={index} style={{padding: '5px 30px'}}>
                    <span>{balanceName + ' ' + type}</span>
                    <span className={(amount < ZERO) ? classes.red : (amount > ZERO) ? classes.green : classes.default}>{numberFormat(amount, currency)}</span>
            </div>
        )
    })

    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))
    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '500px'} : {width: '500px'}}
            bodyClassName={classes.popUp}>
            <div className={classes.titleContent}>
                <span>{addDialog ? 'Добавить приход клиенту' : 'Добавить расход клиенту'}</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon color="#666666"/>
                </IconButton>
            </div>
            {loading
                ? <div className={classes.loader}>
                    <Loader size={0.75}/>
                </div>
                : <div className={classes.bodyContent}>
                    <div style={{padding: '10px 30px'}}>Клиент: <strong>{name}</strong></div>
                    {!superUser && <div style={{display: 'flex', flexWrap: 'wrap'}}>
                        {balanceInfo}
                    </div>}
                    <form onSubmit={onSubmit} className={classes.form}>
                        <div className={classes.inContent} style={{minHeight: '100px'}}>
                            <div style={{width: '100%'}}>
                                <Field
                                    name="paymentType"
                                    component={PaymentTypeSearchField}
                                    label="Тип оплаты"
                                    className={classes.inputFieldCustom}
                                    fullWidth={true}/>
                                <Field
                                    name="amount"
                                    component={TextField}
                                    label="Сумма"
                                    normalize={normalizeNumber}
                                    className={classes.inputFieldCustom}
                                    fullWidth={true}/>
                                {divisionStatus && <Field
                                    name="division"
                                    component={DivisionSearchField}
                                    label="Подразделение"
                                    className={classes.inputFieldCustom}
                                    fullWidth={true}/>}
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
                                labelStyle={{fontSize: '13px'}}
                                type="submit"
                            />
                        </div>
                    </form>
                </div>}
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
