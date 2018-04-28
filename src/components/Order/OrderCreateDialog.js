import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import {Field, reduxForm, Fields} from 'redux-form'
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
    ClientContactsField,
    CheckBox,
    CheckBoxCustom
} from '../ReduxForm'
import ClientSearchField from '../ReduxForm/HR/Application/ClientSearchField'
import ApplicationListField from '../ReduxForm/HR/Application/ApplicationListField'
import numberFormat from '../../helpers/numberFormat'
import t from '../../helpers/translate'
import {
    ORDER_GIVEN,
    ORDER_DELIVERED,
    ORDER_CANCELED
} from '../../constants/backendConstants'
import formValidate from '../../helpers/formValidate'
import {Row, Col} from 'react-flexbox-grid'

export const ORDER_CREATE_DIALOG_OPEN = 'openCreateDialog'
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
            maxHeight: '800px',
            '& .row': {
                '&:first-child': {
                    fontWeight: '600'
                },
                padding: '0',
                position: 'relative',
                minHeight: '45px',
                alignItems: 'center'
            }
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
            display: ({openAppCreate}) => openAppCreate ? 'none' : 'block',
            '& > div:first-child > div:first-child': {
                transform: 'translate(0px, 0px) !important'
            }
        },
        notEnough: {
            padding: '20px 30px',
            color: '#ff2626',
            margin: '10px -30px -15px',
            background: '#ffecec'
        },
        serviceTitle: {
            fontWeight: '600',
            marginBotton: '10px'
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
        clientId,
        loading,
        orderProducts,
        currencyItem,
        editProductsLoading,
        isConfirmed,
        closed,
        setClosed,
        dispatch,
        handleOpenAppCreateDialog,
        openAppCreate
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
        width: loading ? '500px' : '750px',
        maxWidth: 'none',
        height: '100%'
    }
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
                                        <span>{t('Выбор клиента')}</span>
                                        <Link style={{color: '#12aaeb'}}
                                              target="_blank"
                                              to={{
                                                  pathname: [ROUTES.CLIENT_LIST_URL],
                                                  query: {[CLIENT_CREATE_DIALOG_OPEN]: true}
                                              }}>
                                            + {t('добавить')}
                                        </Link>
                                    </div>
                                    <div>
                                        <Field
                                            name="client"
                                            component={ClientSearchField}
                                            className={classes.inputFieldCustom}
                                            label={t('Клиент')}
                                            closed={closed}
                                            fullWidth={true}/>
                                        <Field
                                            name="clientContact"
                                            component={ClientContactsField}
                                            params={{client: clientId}}
                                            fullWidth={true}/>
                                        <Field
                                            name="discount"
                                            component={TextField}
                                            className={classes.inputFieldCustom}
                                            label={t('Скидка')}
                                            fullWidth={true}/>
                                        <Field
                                            name="isPaid"
                                            component={CheckBox}
                                            label={t('Оплачено')}/>
                                    </div>
                                </div>
                                <div className={classes.rightOrderPart}>
                                    <Fields
                                        names={['products', 'product', 'defect', 'amount', 'editDefect', 'editAmount']}
                                        component={ApplicationListField}
                                        handleOpenAppCreateDialog={handleOpenAppCreateDialog}
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
