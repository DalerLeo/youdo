import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import {Row, Col} from 'react-flexbox-grid'
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
import CircularProgress from 'material-ui/CircularProgress'
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
        }
    })),
    reduxForm({
        form: 'ClientBalanceCreateForm',
        enableReinitialize: true
    })
)
const ZERO = 0

const ClientBalanceCreateDialog = enhance((props) => {
    const {classes, open, onClose, handleSubmit, loading, name, detailData, listData} = props
    const data = _.find(_.get(listData, 'data'), {'id': _.get(detailData, 'id')})
    const cosmBalance = _.toNumber(_.get(data, 'cosmeticsBalance'))
    const shammBalance = _.toNumber(_.get(data, 'shampooBalance'))
    const shampooBank = _.toNumber(_.get(data, 'shampooBank'))
    const currency = getConfig('PRIMARY_CURRENCY')

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
                <span>Добавить расход клиенту</span>
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
                    <Row style={{padding: '10px 30px'}}>
                        <Col xs={6}>Баланс Косметика:</Col>
                        <Col xs={6}>
                            <span className={(cosmBalance <= ZERO) ? classes.red : classes.green}>{numberFormat(cosmBalance, currency)}</span>
                        </Col>
                    </Row>
                    <Row style={{padding: '10px 30px'}}>
                        <Col xs={6}>Баланс Шампунь Нал.:</Col>
                        <Col xs={6}>
                            <span className={(shammBalance <= ZERO) ? classes.red : classes.green}>{numberFormat(shammBalance, currency)}</span>
                        </Col>
                    </Row>
                    <Row style={{padding: '10px 30px'}}>
                        <Col xs={6}>Баланс Шампунь Переч.:</Col>
                        <Col xs={6}>
                            <span className={(shampooBank <= ZERO) ? classes.red : classes.green}>{numberFormat(shampooBank, currency)}</span>
                        </Col>
                    </Row>
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
                                <Field
                                    name="division"
                                    component={DivisionSearchField}
                                    label="Подразделение"
                                    className={classes.inputFieldCustom}
                                    fullWidth={true}/>
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
