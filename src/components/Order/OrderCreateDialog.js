import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import {Field, Fields, reduxForm} from 'redux-form'
import Dialog from 'material-ui/Dialog'
import Loader from '../Loader'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import * as ROUTES from '../../constants/routes'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import {
    TextField,
    ClientSearchField,
    OrderListProductField,
    DateField,
    UsersSearchField,
    DeliveryManSearchField,
    PriceListSearchField,
    UserCurrenciesSearchField,
    DeliveryTypeSearchField
} from '../ReduxForm'
import numberFormat from '../../helpers/numberFormat'
import checkPermission from '../../helpers/checkPermission'
import OrderDealTypeRadio from '../ReduxForm/Order/OrderDealTypeRadio'
import OrderPaymentTypeRadio from '../ReduxForm/Order/OrderPaymentTypeRadio'
import MarketSearchField from '../ReduxForm/ClientBalance/MarketSearchField'
import CheckBox from '../ReduxForm/Basic/CheckBox'
import t from '../../helpers/translate'
import {
    ORDER_GIVEN,
    ORDER_DELIVERED,
    ORDER_CANCELED
} from '../../constants/backendConstants'
import formValidate from '../../helpers/formValidate'

export const ORDER_CREATE_DIALOG_OPEN = 'openCreateDialog'
const SHOP_CREATE_DIALOG_OPEN = 'openCreateDialog'
const CLIENT_CREATE_DIALOG_OPEN = 'openCreateDialog'

const enhance = compose(
    injectSheet({
        loader: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: '#fff',
            zIndex: '999',
            display: 'flex',
            justifyContent: 'center'
        },
        popUp: {
            overflow: 'unset !important',
            fontSize: '13px !important',
            position: 'relative',
            padding: '0 !important',
            height: '100%',
            maxHeight: 'inherit !important',
            marginBottom: '64px'
        },
        titleContent: {
            background: '#fff',
            color: '#333',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #efefef',
            padding: '0 10px 0 30px',
            height: '60px',
            zIndex: '999'
        },
        inContent: {
            display: 'flex',
            color: '#333',
            minHeight: '450px'
        },
        bodyContent: {
            color: '#333',
            width: '100%'
        },
        form: {
            position: 'relative'
        },
        field: {
            width: '100%'
        },
        subTitleOrder: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '5px !important',
            justifyContent: 'space-between',
            fontWeight: '600',
            padding: '0 !important',
            '& span': {
                fontWeight: '600 !important'
            }
        },
        subTitleOrderNoPad: {
            extend: 'subTitleOrder',
            padding: '0'
        },
        radioButton: {
            marginTop: '10px',
            '&>div': {
                marginBottom: '10px'
            }
        },
        condition: {
            marginTop: '20px',
            '&>div:first-child': {
                marginBottom: '-20px'
            }
        },
        commentField: {
            padding: '5px 20px',
            fontSize: '16px !important',
            textAlign: 'left',
            width: '50%',
            float: 'left'
        },
        bottomButton: {
            bottom: '0',
            left: '0',
            right: '0',
            padding: '10px',
            zIndex: '999',
            borderTop: '1px solid #efefef',
            background: '#fff',
            textAlign: 'right',
            '& span': {
                fontSize: '13px !important',
                fontWeight: '600 !important',
                color: '#129fdd',
                verticalAlign: 'inherit !important'
            }
        },
        actionButton: {
            fontSize: '13px !important',
            margin: '0 !important'
        },
        leftOrderPart: {
            width: '280px',
            padding: '20px 30px 5px',
            borderRight: '1px #efefef solid',
            '& .Select-menu-outer': {
                minWidth: 'unset !important'
            }
        },
        rightOrderPart: {
            width: 'calc(100% - 280px)',
            padding: '20px 30px',
            overflowY: 'auto',
            maxHeight: '800px'
        },
        inputFieldCustom: {
            height: '45px !important',
            marginTop: '7px',
            '& label': {
                top: '20px !important',
                lineHeight: '5px !important'
            },
            '& input': {
                marginTop: '0 !important'
            }
        },
        inputDateCustom: {
            marginTop: '7px',
            '& label': {
                top: '20px !important',
                lineHeight: '5px !important'
            },
            '& input': {
                marginTop: '0 !important'
            },
            '& div:first-child': {
                height: '45px !important'
            }
        },
        inputFieldDis: {
            fontSize: '13px !important',
            paddingTop: '24px',
            '& div': {
                color: 'rgb(229, 115, 115) !important'
            }
        },
        podlojkaScroll: {
            overflowY: 'auto !important',
            '& > div:first-child > div:first-child': {
                transform: 'translate(0px, 0px) !important'
            }
        },
        notEnough: {
            padding: '20px 30px',
            color: '#ff2626',
            margin: '10px -30px -15px',
            background: '#ffecec'
        }
    }),
    reduxForm({
        form: 'OrderCreateForm',
        enableReinitialize: true
    }),
    connect((state) => {
        const orderProducts = _.get(state, ['form', 'OrderCreateForm', 'values', 'products'])
        const currencyItem = _.get(state, ['form', 'OrderCreateForm', 'values', 'currency', 'text'])
        const deliveryType = _.get(state, ['form', 'OrderCreateForm', 'values', 'deliveryType', 'value'])
        const isConfirmed = _.get(state, ['form', 'OrderCreateForm', 'values', 'isConfirmed'])
        const dealType = _.get(state, ['form', 'OrderCreateForm', 'values', 'dealType'])
        const paymentDate = _.get(state, ['form', 'OrderCreateForm', 'values', 'paymentDate'])
        return {
            orderProducts,
            currencyItem,
            deliveryType,
            isConfirmed,
            dealType,
            paymentDate
        }
    }),
    withState('closed', 'setClosed', false)
)

const OrderCreateDialog = enhance((props) => {
    const {
        open,
        handleSubmit,
        onClose,
        classes,
        shortageDialog,
        isUpdate,
        products,
        status,
        canChangeAnyPrice,
        canChangePrice,
        clientId,
        loading,
        orderProducts,
        currencyItem,
        isSuperUser,
        editProductsLoading,
        handleOpenAddProduct,
        deliveryType,
        hasMarket,
        isConfirmed,
        dealType,
        paymentDate,
        closed,
        setClosed,
        dispatch
    } = props

    const formNames = [
        'client',
        'market',
        'paymentType',
        'currency',
        'priceList',
        'user',
        'paymentDate',
        'dealType',
        'nextPaymentDate',
        'contract',
        'deliveryType',
        'products'
    ]
    const onSubmit = handleSubmit(() => props.onSubmit()
        .catch((error) => {
            formValidate(formNames, dispatch, error)
        }))

    const customContentStyle = {
        width: loading ? '800px' : '1000px',
        maxWidth: 'none',
        height: '100%'
    }
    const canSetDeliveryMan = checkPermission('can_set_delivery_man')
    const totalCost = _.sumBy(orderProducts, (item) => {
        const amount = _.toNumber(_.get(item, 'amount'))
        const cost = _.toNumber(_.get(item, 'cost'))
        return (amount * cost)
    })
    const notEnough = _.includes(_.map(products, (item) => {
        const amount = _.toNumber(_.get(item, 'amount'))
        const balance = _.toNumber(_.get(item, ['product', 'value', 'balance']))
        return (!editProductsLoading && amount > balance)
    }), true)

    const selectFieldScroll = {
        scrollable: true,
        maxHeight: '150px'
    }
    const maxDate = moment(paymentDate).toDate()

    return (
        <Dialog
            modal={true}
            className={classes.podlojkaScroll}
            contentStyle={customContentStyle}
            open={open}
            onRequestClose={onClose}
            bodyClassName={classes.popUp}
            autoScrollBodyContent={true}>
            <div className={classes.titleContent}>
                <span>{isUpdate ? t('Изменение заказа') : t('Добавление заказа')}</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <form onSubmit={onSubmit} className={classes.form}>
                    {loading && <div className={classes.loader}>
                        <Loader size={0.75}/>
                    </div>}
                        <div className={classes.innerWrap}>
                            <div style={{minHeight: '470px'}} className={classes.inContent}>
                                <div className={classes.leftOrderPart}>
                                    <div className={classes.subTitleOrder}>
                                        {hasMarket && <span>{t('Выбор магазина')}</span>}
                                        {!hasMarket && <span>{t('Выбор клиента')}</span>}
                                        {hasMarket &&
                                        <Link style={{color: '#12aaeb'}}
                                              target="_blank"
                                              to={{
                                                  pathname: [ROUTES.SHOP_LIST_URL],
                                                  query: {[SHOP_CREATE_DIALOG_OPEN]: true}
                                              }}>
                                            + {t('добавить')}
                                        </Link>}
                                        {!hasMarket &&
                                        <Link style={{color: '#12aaeb'}}
                                              target="_blank"
                                              to={{
                                                  pathname: [ROUTES.CLIENT_LIST_URL],
                                                  query: {[CLIENT_CREATE_DIALOG_OPEN]: true}
                                              }}>
                                            + {t('добавить')}
                                        </Link>}
                                    </div>
                                    <div>
                                        <Field
                                            name="client"
                                            component={ClientSearchField}
                                            className={classes.inputFieldCustom}
                                            label={t('Клиент')}
                                            closed={closed}
                                            fullWidth={true}/>
                                        {hasMarket && <Field
                                            name="market"
                                            component={MarketSearchField}
                                            className={classes.inputFieldCustom}
                                            label={t('Название магазина')}
                                            clientId={clientId}
                                            fullWidth={true}/>}
                                    </div>

                                    {notEnough && <div className={classes.notEnough}>{t('Недостаточно товаров на складе')}</div>}
                                    <div className={classes.condition}>
                                        <div className={classes.subTitleOrderNoPad}>{t('Оплата')}</div>
                                        <Field
                                            name="paymentType"
                                            component={OrderPaymentTypeRadio}
                                            isUpdate={isUpdate}
                                        />
                                        <Field
                                            name="currency"
                                            component={UserCurrenciesSearchField}
                                            className={classes.inputFieldCustom}
                                            label={t('Валюта')}
                                            fullWidth={true}/>
                                        <Field
                                            name="priceList"
                                            component={PriceListSearchField}
                                            className={classes.inputFieldCustom}
                                            label={t('Прайс лист')}
                                            fullWidth={true}/>
                                        {isSuperUser && <Field
                                            name="user"
                                            component={UsersSearchField}
                                            className={classes.inputFieldCustom}
                                            closed={closed}
                                            label={t('Агент')}
                                            selectFieldScroll={selectFieldScroll}
                                            fullWidth={true}/>}
                                        <Field
                                            name="paymentDate"
                                            component={DateField}
                                            className={classes.inputDateCustom}
                                            floatingLabelText={t('Дата окончательной оплаты')}
                                            errorStyle={{bottom: 2}}
                                            container="inline"
                                            fullWidth={true}/>
                                    </div>
                                    <div className={classes.condition}>
                                        <div className={classes.subTitleOrderNoPad}>{t('Условия договора')}</div>
                                        <Field
                                            name="dealType"
                                            isUpdate={isUpdate}
                                            component={OrderDealTypeRadio}/>
                                        {dealType === 'consignment' &&
                                        <Field
                                            name="nextPaymentDate"
                                            component={DateField}
                                            className={classes.inputDateCustom}
                                            floatingLabelText={t('Дата следующей оплаты')}
                                            maxDate={maxDate}
                                            container="inline"
                                            fullWidth={true}/>}
                                        <Field
                                            name="contract"
                                            component={TextField}
                                            className={classes.inputFieldCustom}
                                            label={t('Номер договора')}
                                            fullWidth={true}/>
                                    </div>
                                    {status !== ORDER_GIVEN &&
                                    <div className={classes.condition}>
                                        <div className={classes.subTitleOrderNoPad}>{t('Условия доставки')}</div>
                                        <Field
                                            name="deliveryType"
                                            component={DeliveryTypeSearchField}
                                            className={classes.inputDateCustom}
                                            label={t('Тип доставки')}
                                            fullWidth={true}/>
                                        {deliveryType === 'delivery' && canSetDeliveryMan &&
                                        <Field
                                            name="deliveryMan"
                                            component={DeliveryManSearchField}
                                            className={classes.inputDateCustom}
                                            label={t('Доставщик')}
                                            fullWidth={true}/>}
                                        {deliveryType === 'delivery' &&
                                        <Field
                                            name="deliveryDate"
                                            component={DateField}
                                            className={classes.inputDateCustom}
                                            floatingLabelText={t('Дата доставки')}
                                            container="inline"
                                            fullWidth={true}/>}
                                        <Field
                                            name="isConfirmed"
                                            component={CheckBox}
                                            disabled={status === ORDER_DELIVERED || status === ORDER_GIVEN}
                                            label={t('Подтвержденный')}/>
                                    </div>}
                                </div>
                                <div className={classes.rightOrderPart}>
                                    <Fields
                                        names={['products', 'product', 'amount', 'cost', 'type', 'editAmount', 'editCost']}
                                        editOnlyCost={status === ORDER_DELIVERED || status === ORDER_GIVEN}
                                        canChangeAnyPrice={canChangeAnyPrice}
                                        canChangePrice={canChangePrice}
                                        component={OrderListProductField}
                                        editProductsLoading={editProductsLoading}
                                        isUpdate={isUpdate}
                                        handleOpenAddProduct={handleOpenAddProduct}
                                    />
                                </div>
                            </div>
                        </div>
                    <div className={classes.bottomButton}>
                        <div className={classes.commentField}>
                            {t('Общая сумма заказа')}: <b>{numberFormat(totalCost, currencyItem)}</b>
                        </div>
                        {(notEnough && isConfirmed && (status !== ORDER_GIVEN && status !== ORDER_DELIVERED && status !== ORDER_CANCELED))
                            ? <FlatButton
                                label={t('Далее')}
                                labelStyle={{fontSize: '13px'}}
                                className={classes.actionButton}
                                primary={true}
                                onTouchTap={shortageDialog.handleOpenShortageDialog}/>

                            : <FlatButton
                                label={isUpdate ? t('Изменить заказ') : t('Оформить заказ')}
                                labelStyle={{fontSize: '13px'}}
                                className={classes.actionButton}
                                onClick={() => setClosed(true)}
                                primary={true}
                                type="submit"/>
                        }
                    </div>
                </form>
            </div>
        </Dialog>
    )
})
OrderCreateDialog.propTyeps = {
    products: PropTypes.array,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    shortageDialog: PropTypes.shape({
        shortageLoading: PropTypes.bool.isRequired,
        openShortageDialog: PropTypes.bool.isRequired,
        handleOpenShortageDialog: PropTypes.func.isRequired,
        handleCloseShortageDialog: PropTypes.func.isRequired
    }).isRequired,
    createClientDialog: PropTypes.shape({
        createClientLoading: PropTypes.bool.isRequired,
        openCreateClientDialog: PropTypes.bool.isRequired,
        handleOpenCreateClientDialog: PropTypes.func.isRequired,
        handleCloseCreateClientDialog: PropTypes.func.isRequired,
        handleSubmitCreateClientDialog: PropTypes.func.isRequired
    }).isRequired
}
OrderCreateDialog.defaultProps = {
    isUpdate: false
}
export default OrderCreateDialog
