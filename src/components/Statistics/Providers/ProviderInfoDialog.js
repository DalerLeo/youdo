import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import {Row} from 'react-flexbox-grid'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import Loader from '../../Loader'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import IconButton from 'material-ui/IconButton'
import Pagination from '../../ReduxForm/Pagination'
import getConfig from '../../../helpers/getConfig'
import numberFormat from '../../../helpers/numberFormat'
import dateTimeFormat from '../../../helpers/dateTimeFormat'
import NotFound from '../../Images/not-found.png'
import ProviderTransactionFormat from './ProviderTransactionFormat'
import {Field, reduxForm} from 'redux-form'
import {CurrencySearchField, DivisionSearchField, PaymentTypeSearchField} from '../../ReduxForm'
import t from '../../../helpers/translate'

const enhance = compose(
    injectSheet({
        loader: {
            width: '100%',
            height: '300px',
            background: '#fff',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex'
        },
        infoLoader: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '50px 0'
        },
        dialog: {
            overflowY: 'auto !important',
            '& > div:first-child > div:first-child': {
                transform: 'translate(0px, 0px) !important'
            }
        },
        red: {
            color: '#e57373 !important',
            fontWeight: '600'
        },
        green: {
            color: '#81c784 !important',
            fontWeight: '600'
        },
        popUp: {
            color: '#333 !important',
            overflowY: 'unset !important',
            fontSize: '13px !important',
            position: 'relative',
            padding: '0 !important',
            overflowX: 'unset',
            height: '100%',
            marginBottom: '64px',
            maxHeight: 'none !important'
        },
        titleContent: {
            background: '#fff',
            color: '#333',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px 30px',
            zIndex: '999',
            '& button': {
                right: '13px',
                padding: '0 !important',
                position: 'absolute !important',
                '& > div': {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }
            }
        },
        subtitle: {
            fontWeight: '600',
            marginBottom: '20px'
        },
        bodyContent: {
            width: '100%'
        },
        infoBlock: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
            borderBottom: '1px #efefef solid'
        },
        info: {
            display: 'flex',
            width: '45%',
            justifyContent: 'space-between',
            '& span': {
                fontWeight: '400'
            }
        },
        content: {
            maxHeight: '445px',
            overflowY: 'auto',
            overflowX: 'hidden',
            width: '100%',
            padding: '0 30px',
            '& span': {
                fontWeight: '600'
            },
            '& > .row': {
                '& svg': {
                    width: '20px !important',
                    height: '20px !important'
                },
                '&:hover > div:last-child': {
                    opacity: '1'
                },
                '& > div:last-child': {
                    zIndex: ({stat}) => stat && '-1'
                },
                margin: '0',
                padding: '15px 0',
                alignItems: 'center',
                position: 'relative',
                '& > div': {
                    padding: '0 0.5rem',
                    '& a': {
                        fontWeight: '600'
                    }
                },
                '& > div:first-child': {
                    display: 'flex',
                    '& > svg': {
                        width: '18px !important',
                        height: '18px !important'
                    }
                }
            },
            '& > .row:first-child': {
                fontWeight: '600',
                borderBottom: 'solid 1px #efefef'
            },
            '& .row:last-child:after': {
                display: 'none'
            }
        },
        iconBtn: {
            display: 'flex',
            position: 'absolute',
            right: '-15px',
            opacity: '0',
            transition: 'all 200ms ease-out'
        },
        emptyQuery: {
            background: 'url(' + NotFound + ') no-repeat center center',
            backgroundSize: '180px',
            padding: '150px 0 0',
            textAlign: 'center',
            marginBottom: '20px',
            fontSize: '13px',
            fontWeight: '600',
            color: '#666',
            '& svg': {
                width: '50px !important',
                height: '50px !important',
                color: '#999 !important'
            }
        },
        filters: {
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0 30px',
            '& > div': {
                width: 'calc((100% / 4) - 15px)'
            }
        },
        paymentsWrapper: {
            borderTop: '1px #efefef solid',
            padding: '10px 30px',
            display: 'flex',
            width: '100%'
        },
        payment: {

        },
        division: {
            marginRight: '20px',
            paddingRight: '20px',
            borderRight: '1px #efefef solid'
        },
        divisionTitle: {
            marginBottom: '5px',
            fontWeight: '600'
        },
        paymentType: {
            marginBottom: '10px',
            lineHeight: '1.5',
            '&:last-child': {
                marginBottom: '0'
            }
        }
    }),
    reduxForm({
        form: 'ProviderBalanceForm',
        enableReinitialize: true
    }),
)

const iconStyle = {
    icon: {
        color: '#666666',
        width: 24,
        height: 24,
        lineHeight: 'normal'
    },
    button: {
        width: 38,
        height: 38,
        padding: 0
    }
}
const ProviderInfoDialog = enhance((props) => {
    const {open, filterItem, onClose, classes, detailData, name, info, infoLoading} = props
    //  ..const isSuperUser = _.get(superUser, 'isSuperUser')
    const totalPayments = _.groupBy(info, (item) => _.get(item, ['division', 'name']))
    const ZERO = 0
    const currentCurrency = getConfig('PRIMARY_CURRENCY')
    const currentCurrencyId = _.toInteger(getConfig('PRIMARY_CURRENCY_ID'))
    const loading = _.get(detailData, 'detailLoading')
    const detailList = _.map(_.get(detailData, ['data', 'results']), (item, index) => {
        const createdDate = dateTimeFormat(_.get(item, 'createdDate'), true)
        const comment = _.get(item, 'comment')
        const currency = _.get(item, ['currency', 'name'])
        const currencyId = _.get(item, ['currency', 'id'])
        const market = _.get(item, ['market', 'name'])
        const amount = _.toNumber(_.get(item, 'amount'))
        const internal = _.toNumber(_.get(item, 'internal'))
        const customRate = _.get(item, 'customRate') ? _.toNumber(_.get(item, 'customRate')) : _.toInteger(amount / internal)
        const user = _.get(item, 'user') ? (_.get(item, ['user', 'firstName']) + ' ' + _.get(item, ['user', 'secondName'])) : 'Система'
        const type = _.get(item, 'type')
        const supply = _.get(item, 'supply')

        // ..const openEditDialog = (thisItem) => {
        // ..    superUser.handleOpenSuperUserDialog(thisItem.id)
        // ..    setItem(thisItem)
        // ..}

        return (
            <Row key={index} className='dottedList'>
                <div style={{width: '20%'}}>{createdDate}</div>
                <div style={{width: '20%'}}>{user}</div>
                <div style={{width: '40%'}}>
                    {market && <div>{t('Магазин')}: <span>{market}</span></div>}
                    {comment && <div>{t('Комментарии')}: <span>{comment}</span></div>}
                    <ProviderTransactionFormat type={type} supply={supply}/>
                </div>
                <div style={{width: '20%', textAlign: 'right'}}>
                    <div className={amount > ZERO ? classes.green : classes.red}>{numberFormat(amount, currency)}</div>
                    {currencyId !== currentCurrencyId &&
                    <div>
                        <div>{numberFormat(internal, currentCurrency)} <span
                            style={{fontSize: 11, color: '#666'}}>({customRate})</span></div>
                    </div>}
                </div>
            </Row>)
    })

    return (
        <Dialog
            modal={true}
            open={open}
            className={classes.dialog}
            onRequestClose={onClose}
            contentStyle={loading ? {width: '500px'} : {width: '1000px', maxWidth: 'unset'}}
            bodyStyle={{minHeight: 'auto'}}
            bodyClassName={classes.popUp}>
            <div className={classes.titleContent}>
                <span>Информация по балансу поставщика {name}</span>
                <IconButton
                    iconStyle={iconStyle.icon}
                    style={iconStyle.button}
                    onTouchTap={onClose}>
                    <CloseIcon/>
                </IconButton>
            </div>
            {loading
                ? <div className={classes.loader}>
                    <Loader size={0.75}/>
                </div>
                : <div className={classes.bodyContent}>
                    <div className={classes.infoBlock}>
                        {infoLoading
                            ? <div className={classes.infoLoader}>
                                <Loader size={0.75}/>
                            </div>
                            : !_.isEmpty(totalPayments) &&
                            <div className={classes.paymentsWrapper}>
                                {_.map(totalPayments, (item, index) => {
                                    const division = index
                                    const cashTransactions = _.filter(item, {'paymentType': 'cash'})
                                    const bankTransactions = _.filter(item, {'paymentType': 'bank'})
                                    const cash = _.map(cashTransactions, (child, i) => {
                                        const currency = _.get(child, ['currency', 'name'])
                                        const totalAmount = _.toNumber(_.get(child, ['totalAmount']))
                                        return (
                                            <div key={i} className={classes.payment}>
                                                <span className={totalAmount > ZERO ? classes.green : totalAmount < ZERO ? classes.red : ''}>
                                                    {numberFormat(totalAmount, currency)}
                                                </span>
                                            </div>
                                        )
                                    })
                                    const bank = _.map(bankTransactions, (child, i) => {
                                        const currency = _.get(child, ['currency', 'name'])
                                        const totalAmount = _.toNumber(_.get(child, ['totalAmount']))
                                        return (
                                            <div key={i} className={classes.payment}>
                                                <span className={totalAmount > ZERO ? classes.green : totalAmount < ZERO ? classes.red : ''}>
                                                    {numberFormat(totalAmount, currency)}
                                                </span>
                                            </div>
                                        )
                                    })
                                    return (
                                        <div key={index} className={classes.division}>
                                            <div className={classes.divisionTitle}>{division}</div>
                                            {!_.isEmpty(cash) &&
                                            <div className={classes.paymentType}>
                                                <i>Наличными:</i>
                                                {cash}
                                            </div>}
                                            {!_.isEmpty(bank) &&
                                            <div className={classes.paymentType}>
                                                <i>Перечислением:</i>
                                                {bank}
                                            </div>}
                                        </div>
                                    )
                                })}
                            </div>}
                    </div>
                    <div className={classes.filters}>
                        <Field
                            name={'division'}
                            component={DivisionSearchField}
                            label={'Организация'}/>
                        <Field
                            name={'currency'}
                            component={CurrencySearchField}
                            label={'Валюта'}/>
                        <Field
                            name={'paymentType'}
                            component={PaymentTypeSearchField}
                            label={'Тип оплаты'}/>
                        <Pagination filter={filterItem}/>
                    </div>
                    <div className={classes.content}>
                        <Row>
                            <div style={{width: '20%'}}>{t('Дата')}</div>
                            <div style={{width: '20%'}}>{t('Кто')}</div>
                            <div style={{width: '40%'}}>{t('Описание')}</div>
                            <div style={{width: '20%', textAlign: 'right'}}>{t('Сумма')}</div>
                        </Row>

                        {!_.isEmpty(_.get(detailData, 'data'))
                            ? detailList
                            : <div className={classes.emptyQuery}>{t('Пока транзакции нет')}</div>}
                    </div>
                </div>
            }
        </Dialog>
    )
})

ProviderInfoDialog.propTyeps = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}

export default ProviderInfoDialog
