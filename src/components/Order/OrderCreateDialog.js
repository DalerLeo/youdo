
import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {Field, Fields, reduxForm, SubmissionError} from 'redux-form'
import Dialog from 'material-ui/Dialog'
import CircularProgress from 'material-ui/CircularProgress'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import CloseIcon2 from '../CloseIcon2'
import * as ROUTES from '../../constants/routes'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import {
    ClientSearchField,
    OrderListProductField,
    DateField,
    UsersSearchField
} from '../ReduxForm'
import toCamelCase from '../../helpers/toCamelCase'
import numberFormat from '../../helpers/numberFormat'
import getConfig from '../../helpers/getConfig'
import OrderDealTypeRadio from '../ReduxForm/Order/OrderDealTypeRadio'
import OrderPaymentTypeRadio from '../ReduxForm/Order/OrderPaymentTypeRadio'
import MarketSearchField from '../ReduxForm/ClientBalance/MarketSearchField'

export const ORDER_CREATE_DIALOG_OPEN = 'openCreateDialog'
const CLIENT_CREATE_DIALOG_OPEN = 'openCreateDialog'

const validate = (data) => {
    const errors = toCamelCase(data)
    const nonFieldErrors = _.get(errors, 'nonFieldErrors')
    throw new SubmissionError({
        ...errors,
        _error: nonFieldErrors
    })
}
const enhance = compose(
    injectSheet({
        loader: {
            position: 'absolute',
            width: '100%',
            height: '300px',
            background: '#fff',
            alignItems: 'center',
            zIndex: '999',
            textAlign: 'center',
            justifyContent: 'center',
            display: 'flex'
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
            padding: '20px 30px',
            zIndex: '999',
            '& button': {
                right: '13px',
                padding: '0 !important',
                position: 'absolute !important'
            }
        },
        inContent: {
            display: 'flex',
            color: '#333',
            minHeight: '450px'
        },
        innerWrap: {
            maxHeight: '100vh'
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
            flexBasis: '25%',
            padding: '20px 30px',
            borderRight: '1px #efefef solid',
            '& .Select-menu-outer': {
                minWidth: 'unset !important'
            }
        },
        rightOrderPart: {
            flexBasis: '75%',
            maxWidth: '75%',
            padding: '20px 30px',
            overflowY: 'auto',
            maxHeight: '800px'
        },
        inputFieldCustom: {
            fontSize: '13px !important',
            height: '45px !important',
            marginTop: '7px',
            '& div': {
                fontSize: '13px !important'
            },
            '& label': {
                top: '20px !important',
                lineHeight: '5px !important'
            },
            '& input': {
                marginTop: '0 !important'
            }
        },
        inputDateCustom: {
            fontSize: '13px !important',
            height: '45px !important',
            marginTop: '7px',
            '& div': {
                fontSize: '13px !important'
            },
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
            margin: '0 -30px',
            background: '#ffecec'
        }
    }),
    reduxForm({
        form: 'OrderCreateForm',
        enableReinitialize: true
    }),
    connect((state) => {
        const orderProducts = _.get(state, ['form', 'OrderCreateForm', 'values', 'products'])
        return {
            orderProducts
        }
    }),
)

const customContentStyle = {
    width: '1000px',
    maxWidth: 'none'
}
const OrderCreateDialog = enhance((props) => {
    const {
        open,
        handleSubmit,
        initialValues,
        onClose,
        classes,
        shortageDialog,
        isUpdate,
        products,
        status,
        canChangeAnyPrice,
        filter,
        clientId,
        loading,
        orderProducts
    } = props
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))
    const totalCost = _.sumBy(orderProducts, (item) => {
        const amount = _.toNumber(_.get(item, 'amount'))
        const cost = _.toNumber(_.get(item, 'cost'))
        return (amount * cost)
    })
    let notEnough = false
    _.map(products, (item) => {
        const amount = _.toNumber(_.get(item, 'amount'))
        const balance = _.toNumber(_.get(item, ['product', 'value', 'balance']))
        if (amount > balance) {
            notEnough = true
        }
    })

    const GIVEN = 2
    const DELIVERED = 3

    const selectFieldScroll = {
        scrollable: true,
        maxHeight: '150px'
    }
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
                <span>{isUpdate ? 'Изменение заказа' : 'Добавление заказа'}</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon2 color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <form onSubmit={onSubmit} scrolling="auto" className={classes.form}>
                    {loading ? <div className={classes.loader}>
                        <CircularProgress size={40} thickness={4}/>
                    </div>
                    : <div className={classes.innerWrap}>
                        <div style={{minHeight: '470px'}} className={classes.inContent}>
                            <div className={classes.leftOrderPart}>
                                <div className={classes.subTitleOrder}>
                                    <span>Выбор клиента</span>
                                    <Link style={{color: '#12aaeb'}}
                                          target="_blank"
                                          to={{pathname: [ROUTES.SHOP_LIST_URL],
                                              query: filter.getParams({[CLIENT_CREATE_DIALOG_OPEN]: true})}}>
                                     + добавить
                                    </Link>
                                </div>
                                <div>
                                    <Field
                                        name="client"
                                        component={ClientSearchField}
                                        className={classes.inputFieldCustom}
                                        label="Клиент"
                                        fullWidth={true}/>
                                    <Field
                                        name="market"
                                        component={MarketSearchField}
                                        className={classes.inputFieldCustom}
                                        label="Название магазина"
                                        clientId={clientId}
                                        initialVal={_.get(initialValues, ['market', 'value', 'id'])}
                                        disabled={!clientId}
                                        fullWidth={true}/>
                                </div>

                                {(!notEnough) ? <div className={classes.condition} style={isUpdate ? {margin: '0'} : {}}>
                                    <div className={classes.subTitleOrder} style={{padding: '0 !important'}}>Условия
                                        доставки
                                    </div>
                                    <Field
                                        name="dealType"
                                        component={OrderDealTypeRadio}
                                    />
                                    <Field
                                        name="deliveryDate"
                                        component={DateField}
                                        className={classes.inputDateCustom}
                                        floatingLabelText="Дата доставки"
                                        container="inline"
                                        fullWidth={true}/>
                                </div>
                                    : <div className={classes.notEnough}>Недостаточно товаров на складе</div>}

                                <div className={classes.condition}>
                                    <div className={classes.subTitleOrder} style={{padding: '0 !important'}}>Оплата
                                    </div>
                                    <Field
                                        name="paymentType"
                                        component={OrderPaymentTypeRadio}
                                    />
                                    <Field
                                        name="user"
                                        component={UsersSearchField}
                                        className={classes.inputFieldCustom}
                                        label="Агент"
                                        selectFieldScroll={selectFieldScroll}
                                        fullWidth={true}/>
                                    <Field
                                        name="paymentDate"
                                        component={DateField}
                                        className={classes.inputDateCustom}
                                        floatingLabelText="Дата оплаты"
                                        container="inline"
                                        fullWidth={true}/>
                                </div>
                            </div>
                            <div className={classes.rightOrderPart}>
                                <Fields
                                    names={['products', 'product', 'amount', 'cost', 'type', 'editAmount', 'editCost']}
                                    editOnlyCost={status === DELIVERED || status === GIVEN}
                                    canChangeAnyPrice={canChangeAnyPrice}
                                    component={OrderListProductField}
                                    isUpdate={isUpdate}
                                />
                            </div>
                        </div>
                    </div>}
                    <div className={classes.bottomButton}>
                        <div className={classes.commentField}>
                            Общая сумма заказа: <b>{numberFormat(totalCost, getConfig('PRIMARY_CURRENCY'))}</b>
                        </div>
                        {(notEnough) ? <FlatButton
                            label="Далее"
                            labelStyle={{fontSize: '13px'}}
                            className={classes.actionButton}
                            primary={true}
                            onTouchTap={shortageDialog.handleOpenShortageDialog}/>

                            : <FlatButton
                                label={isUpdate ? 'Изменить заказ' : 'Оформить заказ'}
                                labelStyle={{fontSize: '13px'}}
                                className={classes.actionButton}
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
