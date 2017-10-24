import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import {Field, reduxForm} from 'redux-form'
import CloseIcon2 from '../CloseIcon2'
import IconButton from 'material-ui/IconButton'
import MainStyles from '../Styles/MainStyles'
import normalizeNumber from '../ReduxForm/normalizers/normalizeNumber'
import CircularProgress from 'material-ui/CircularProgress'
import {
    DivisionSearchField,
    PaymentTypeSearchField,
    UsersSearchField,
    CurrencySearchField,
    TextField
} from '../ReduxForm'
import getConfig from '../../helpers/getConfig'
import {connect} from 'react-redux'

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
        }
    })),
    reduxForm({
        form: 'ClientBalanceUpdateForm',
        enableReinitialize: true
    }),
    connect((state) => {
        const chosenCurrency = _.get(state, ['form', 'ClientBalanceUpdateForm', 'values', 'currency', 'value'])
        return {chosenCurrency}
    })
)

const ClientBalanceUpdateDialog = enhance((props) => {
    const {classes, open, onClose, handleSubmit, loading, name, chosenCurrency} = props

    const onSubmit = handleSubmit(() => props.onSubmit())
    const primaryCurrency = _.toInteger(getConfig('PRIMARY_CURRENCY_ID'))
    const divisionStatus = getConfig('DIVISIONS')
    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '400px'} : {width: '400px'}}
            bodyClassName={classes.popUp}>
            <div className={classes.titleContent}>
                <span>Изменение баланса клиента</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon2 color="#666666"/>
                </IconButton>
            </div>
            {loading
                ? <div className={classes.loader}>
                    <CircularProgress size={40} thickness={4}/>
                </div>
                : <div className={classes.bodyContent}>
                    <div style={{padding: '10px 30px'}}>Клиент: <strong>{name}</strong></div>
                    <form onSubmit={onSubmit} className={classes.form}>
                        <div className={classes.inContent} style={{minHeight: '100px'}}>
                            <div style={{width: '100%'}}>
                                <Field
                                    name="user"
                                    component={UsersSearchField}
                                    label="Пользователь"
                                    className={classes.inputFieldCustom}
                                    fullWidth={true}/>
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
                                    className={classes.inputFieldCustom}
                                    fullWidth={true}/>
                                <Field
                                    name="currency"
                                    component={CurrencySearchField}
                                    label="Валюта"
                                    className={classes.inputFieldCustom}
                                    fullWidth={true}/>
                                {(chosenCurrency !== primaryCurrency && chosenCurrency) &&
                                <Field
                                    name="custom_rate"
                                    component={TextField}
                                    label="Курс"
                                    normalize={normalizeNumber}
                                    className={classes.inputFieldCustom}
                                    fullWidth={true}/>}
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

ClientBalanceUpdateDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
}

ClientBalanceUpdateDialog.defaultProps = {
    isUpdate: false
}

export default ClientBalanceUpdateDialog
