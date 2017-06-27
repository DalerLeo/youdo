import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import CircularProgress from 'material-ui/CircularProgress'
import Edit from 'material-ui/svg-icons/image/edit'
import Delete from 'material-ui/svg-icons/action/delete'
import OrderTransactionsDialog from './OrderTransactionsDialog'
import OrderReturnDialog from './OrderReturnDialog'
import OrderItemReturnDialog from './OrderItemReturnDialog'
import IconButton from 'material-ui/IconButton'
import Return from 'material-ui/svg-icons/content/reply'
import File from 'material-ui/svg-icons/editor/insert-drive-file'
import {Row, Col} from 'react-flexbox-grid'
import Tooltip from '../ToolTip'
import Dot from '../Images/dot.png'
import moment from 'moment'
import numberFormat from '../../helpers/numberFormat'
import {PRIMARY_CURRENCY_NAME} from '../../constants/primaryCurrency'
import {Tabs, Tab} from 'material-ui/Tabs'
import * as TAB from '../../constants/orderTab'
import NotFound from '../Images/not-found.png'

const enhance = compose(
    injectSheet({
        dottedList: {
            padding: '20px 0'
        },
        wrapper: {
            color: '#333 !important',
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap'
        },
        dropdown: {
            position: 'relative',
            paddingRight: '18px',
            zIndex: '4',
            '&:after': {
                top: '10px',
                right: '0',
                content: '""',
                position: 'absolute',
                borderTop: '5px solid',
                borderLeft: '5px solid transparent',
                borderRight: '5px solid transparent'
            }
        },
        link: {
            extend: 'blue',
            borderBottom: '1px dashed',
            fontWeight: '600'
        },
        red: {
            color: '#e57373 !important'
        },
        blue: {
            color: '#12aaeb !important'
        },
        green: {
            color: '#81c784 !important'
        },
        yellow: {
            color: '#f0ad4e !important'
        },
        loader: {
            width: '100%',
            background: '#fff',
            height: '400px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        title: {
            display: 'flex',
            justifyContent: 'space-between',
            borderBottom: '1px #efefef solid',
            alignItems: 'center',
            width: '100%',
            height: '65px',
            padding: '0 30px'
        },
        titleLabel: {
            fontSize: '18px',
            color: '#333',
            fontWeight: '600',
            cursor: 'pointer'
        },
        titleSupplier: {
            fontSize: '18px',
            position: 'relative',
            '& .supplierDetails': {
                background: '#fff',
                boxShadow: '0 2px 5px 0px rgba(0, 0, 0, 0.16)',
                fontSize: '13px',
                position: 'absolute',
                padding: '64px 28px 20px',
                top: '-21px',
                left: '50%',
                zIndex: '3',
                minWidth: '300px',
                transform: 'translate(-50%, 0)',
                '& .detailsWrap': {
                    position: 'relative',
                    paddingTop: '10px',
                    '&:before': {
                        content: '""',
                        background: 'url(' + Dot + ')',
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        right: '0',
                        height: '2px'
                    }
                },
                '& .detailsList': {
                    padding: '10px 0',
                    '&:last-child': {
                        paddingBottom: '0'
                    },
                    '& div:first-child': {
                        color: '#666'
                    }
                }
            }
        },
        titleClient: {
            '& span': {
                fontWeight: '600'
            }
        },
        titleButtons: {
            display: 'flex',
            justifyContent: 'flex-end'
        },
        content: {
            display: 'flex',
            width: '100%'
        },
        padding: {
            padding: '20px 30px'
        },
        leftSide: {
            flexBasis: '30%',
            maxWidth: '30%',
            borderRight: '1px #efefef solid'
        },
        subBlock: {
            extend: 'padding',
            borderBottom: '1px #efefef solid',
            '&:last-child': {
                border: 'none'
            }
        },
        rightSide: {
            flexBasis: '70%',
            maxWidth: '70%',
            padding: '0 30px 20px'
        },
        subtitle: {
            fontWeight: '600',
            textTransform: 'uppercase',
            marginBottom: '10px'
        },
        dataBox: {
            '& li': {
                display: 'flex',
                justifyContent: 'space-between',
                lineHeight: '25px',
                width: '100%',
                '& span:last-child': {
                    fontWeight: '600',
                    textAlign: 'right'
                }
            }
        },
        tabNav: {
            padding: '15px 0',
            borderBottom: '1px #f2f5f8 solid',
            '& a': {
                margin: '-15px 0',
                padding: '15px 0',
                marginRight: '40px',
                color: '#9b9b9b',
                '&.active': {
                    color: '#12aaeb',
                    borderBottom: '1px solid'
                }
            }
        },
        tabContent: {
            '& .row:first-child': {
                fontWeight: '600'
            },
            '& .row': {
                '& > div': {
                    textAlign: 'right'
                },
                '& > div:first-child': {
                    textAlign: 'left'
                }
            }
        },
        tabWrapper: {
            maxHeight: '232px',
            overflowY: 'auto',
            overflowX: 'hidden',
            paddingRight: '30px'
        },
        summary: {
            fontWeight: '600',
            marginTop: '20px',
            paddingRight: '30px',
            textTransform: 'uppercase',
            textAlign: 'right'
        },
        personOrder: {
            '& div:first-child': {
                width: '30px',
                height: '30px',
                display: 'inline-block',
                overflow: 'hidden',
                marginRight: '10px',
                borderRadius: '50%',
                '& img': {
                    width: '30px'
                }
            },
            '& div:last-child': {
                verticalAlign: 'top',
                display: 'inline-block'
            }
        },
        colorCat: {
            marginBottom: '0',
            width: '100%',
            '& > div': {
                width: '40% !important',
                paddingRight: '60%',
                background: 'transparent !important'
            },
            '& > div:first-child': {
                borderBottom: '1px #f2f5f8 solid'
            },
            '& > div:last-child': {
                width: '100% !important',
                padding: '0'
            },
            '& > div:nth-child(2) > div': {
                marginTop: '0px !important',
                marginBottom: '-1px',
                backgroundColor: '#12aaeb !important',
                height: '1px !important'
            },
            '& button': {
                color: '#333 !important',
                backgroundColor: '#fefefe !important'
            },
            '& button > span:first-line': {
                color: '#a6dff7'
            },
            '& button div div': {
                textTransform: 'initial'
            }
        },
        noReturn: {
            padding: '100px 0',
            color: '#999'
        },
        emptyQuery: {
            background: 'url(' + NotFound + ') no-repeat center center',
            backgroundSize: '215px',
            padding: '215px 0 0',
            textAlign: 'center',
            color: '#999'
        }
    }),
        withState('openDetails', 'setOpenDetails', false)
)

const iconStyle = {
    icon: {
        color: '#666',
        width: 20,
        height: 20
    },
    button: {
        width: 48,
        height: 48,
        padding: 0
    }
}
withState('openDetails', 'setOpenDetails', false)

const OrderDetails = enhance((props) => {
    const {classes,
        loading,
        data,
        setOpenDetails,
        openDetails,
        transactionsDialog,
        returnDialog,
        returnListData,
        returnDataLoading,
        itemReturnDialog,
        confirmDialog,
        handleOpenUpdateDialog,
        tabData,
        paymentData,
        getDocument,
        returnData,
        handleCloseDetail
    } = props
    const tab = _.get(tabData, 'tab')

    const id = _.get(data, 'id')
    const products = _.get(data, 'products')
    const contact = _.get(data, 'contact')
    const contactName = _.get(contact, 'name')
    const contactEmail = _.get(contact, 'email') || 'N/A'
    const contactPhone = _.get(contact, 'telephone') || 'N/A'

    const client = _.get(data, 'client')
    const clientPerson = _.get(client, 'name')
    const deliveryType = _.get(data, 'deliveryType')
    const dateDelivery = moment(_.get(data, 'dateDelivery')).format('DD.MM.YYYY')

    const REQUESTED = 0
    const READY = 1
    const DELIVERED = 2
    const status = _.toInteger(_.get(data, 'status'))

    const percent = 100
    const zero = 0
    const deliveryPrice = _.toNumber(_.get(data, 'deliveryPrice'))
    const discountPrice = _.toNumber(_.get(data, 'discountPrice'))
    const totalPrice = _.toNumber(_.get(data, 'totalPrice'))
    const totalPaid = _.get(data, 'totalPaid')
    const totalBalance = _.get(data, 'totalBalance')
    const discount = (discountPrice / (discountPrice + totalPrice)) * percent

    if (loading) {
        return (
            <div className={classes.loader}>
                <div>
                    <CircularProgress size={100} thickness={6}/>
                </div>
            </div>
        )
    }

    return (
        <div className={classes.wrapper}>
            <div className={classes.title}>
                <div className={classes.titleLabel}
                     onTouchTap={handleCloseDetail}>Заказ №{id}</div>
                <div className={classes.titleSupplier}>
                    <a className={classes.dropdown} onMouseEnter={() => {
                        setOpenDetails(true)
                    }}>{clientPerson}</a>
                    {openDetails &&
                    <div className="supplierDetails" onMouseLeave={() => {
                        setOpenDetails(false)
                    }}>
                        <div className="detailsWrap">
                            <Row className="detailsList">
                                <Col xs={6}>Контактное лицо</Col>
                                <Col xs={6}>{contactName}</Col>
                            </Row>
                            <Row className="detailsList">
                                <Col xs={6}>Телефон</Col>
                                <Col xs={6}>{contactPhone}</Col>
                            </Row>
                            <Row className="detailsList">
                                <Col xs={6}>Email</Col>
                                <Col xs={6}>{contactEmail}</Col>
                            </Row>
                        </div>
                    </div>
                    }
                </div>
                <div className={classes.titleButtons}>
                    <Tooltip position="bottom" text="Добавить возврат">
                        <IconButton
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            touch={true}
                            onTouchTap={returnDialog.handleOpenReturnDialog}>
                            <Return />
                        </IconButton>
                    </Tooltip>
                    <Tooltip position="bottom" text="Скачать договор">
                        <IconButton
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            touch={true}
                            onTouchTap={() => { getDocument.handleGetDocument(id) }}>
                            <File />
                        </IconButton>
                    </Tooltip>
                    <Tooltip position="bottom" text="Изменить">
                        <IconButton
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            touch={true}
                            onTouchTap={handleOpenUpdateDialog}>
                            <Edit />
                        </IconButton>
                    </Tooltip>
                    <Tooltip position="bottom" text="Отменить">
                        <IconButton
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            touch={true}
                            onTouchTap={() => { confirmDialog.handleOpenConfirmDialog(id) }}>
                            <Delete />
                        </IconButton>
                    </Tooltip>
                </div>
            </div>

            <div className={classes.content}>
                <div className={classes.leftSide}>
                    <div className={classes.subBlock}>
                        <div className={classes.subtitle}>Баланс</div>
                        <div className={classes.dataBox}>
                            <ul>
                                <li>
                                    <span>Дата оплаты:</span>
                                    <span>22.05.2017</span>
                                </li>
                                <li>
                                    <span>Стоимость доставки:</span>
                                    <span>{numberFormat(deliveryPrice)} {PRIMARY_CURRENCY_NAME}</span>
                                </li>
                                <li>
                                    <span>Скидка({discount}%):</span>
                                    <span>{numberFormat(discountPrice)} {PRIMARY_CURRENCY_NAME}</span>
                                </li>
                                <li>
                                    <span>Оплачено:</span>
                                    {(totalPaid !== zero) ? <span>
                                        <a onClick={transactionsDialog.handleOpenTransactionsDialog} className={classes.link}>{numberFormat(totalPaid)} {PRIMARY_CURRENCY_NAME}</a>
                                    </span>
                                        : <span>{totalPaid} {PRIMARY_CURRENCY_NAME}</span>}
                                </li>
                                <li>
                                    <span>Остаток:</span>
                                    <span className={totalBalance > zero ? classes.red : classes.green}>{numberFormat(totalBalance)} {PRIMARY_CURRENCY_NAME}</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className={classes.subBlock}>
                        <div className={classes.subtitle}>Исполнение</div>
                        <div className={classes.dataBox}>
                            <ul>
                                <li>
                                    <span>Текущий статус:</span>
                                    {(status === REQUESTED) ? <span className={classes.yellow}>Запрос отправлен</span>
                                        : (status === READY) ? <span className={classes.green}>Готов</span>
                                            : (status === DELIVERED) ? <span className={classes.green}>Доставлен</span>
                                                : <span className={classes.red}>Отменен</span>
                                    }
                                </li>
                                <li>
                                    <span>Тип передачи:</span>
                                    <span>{deliveryType > zero ? 'Доставка' : 'Самовывоз'}</span>
                                </li>
                                <li>
                                    <span>Дата передачи:</span>
                                    <span>{dateDelivery}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className={classes.rightSide}>
                    <Tabs
                        value={tab}
                        className={classes.colorCat}
                        onChange={(value) => tabData.handleTabChange(value, id)}>
                        <Tab label="Список товаров" value={TAB.ORDER_TAB_PRODUCT_LIST}>
                            <div className={classes.tabContent}>
                                <div className={classes.tabWrapper}>
                                    <Row className="dottedList">
                                        <Col xs={6}>Товар</Col>
                                        <Col xs={2}>Количество</Col>
                                        <Col xs={2}>Цена {PRIMARY_CURRENCY_NAME}</Col>
                                        <Col xs={2}>Сумма {PRIMARY_CURRENCY_NAME}</Col>
                                    </Row>

                                    {_.map(products, (item, index) => {
                                        const product = _.get(item, 'product')
                                        const productName = _.get(product, 'name')
                                        const price = _.get(item, 'price')
                                        const productTotal = _.get(item, 'totalPrice')
                                        const amount = _.get(item, 'amount')
                                        const measurement = _.get(product, ['measurement', 'name'])
                                        return (
                                            <Row className="dottedList" key={index}>
                                                <Col xs={6}>{productName}</Col>
                                                <Col xs={2}>{numberFormat(amount)} {measurement}</Col>
                                                <Col xs={2}>{numberFormat(price)}</Col>
                                                <Col xs={2}>{numberFormat(productTotal)}</Col>
                                            </Row>
                                        )
                                    })}
                                </div>
                                <div className={classes.summary}>Итого: {numberFormat(totalPrice)} {PRIMARY_CURRENCY_NAME}</div>
                            </div>
                        </Tab>
                        <Tab label="Возврат" value={TAB.ORDER_TAB_RETURN}>
                            {!_.isEmpty(returnData) ? <div className={classes.tabContent}>
                                    {!returnDataLoading ? <div className={classes.tabWrapper}>
                                            <Row className="dottedList">
                                                <Col xs={2}>Код</Col>
                                                <Col xs={6} style={{textAlign: 'left'}}>Причина возврата</Col>
                                                <Col xs={2}>Дата возврата</Col>
                                                <Col xs={2}>Сумма {PRIMARY_CURRENCY_NAME}</Col>
                                            </Row>
                                            {_.map(returnData, (item, index) => {
                                                const returnId = _.get(item, 'id')
                                                const comment = _.get(item, 'comment')
                                                const dateReturn = moment(_.get(item, 'createdDate')).format('DD.MM.YYYY')
                                                const totalSum = numberFormat(_.get(item, 'totalPrice'))
                                                return (
                                                    <Row className="dottedList" key={index}>
                                                        <Col xs={2}><a
                                                            onClick={() => { itemReturnDialog.handleOpenItemReturnDialog(returnId) }}
                                                            className={classes.link}>
                                                            {returnId}
                                                        </a>
                                                        </Col>
                                                        <Col style={{textAlign: 'left'}} xs={6}>{comment}</Col>
                                                        <Col xs={2}>{dateReturn}</Col>
                                                        <Col xs={2}>{totalSum}</Col>
                                                    </Row>
                                                )
                                            })}
                                        </div>
                                        : <div className={classes.loader} style={{height: '265px', marginTop: '1px'}}>
                                            <div>
                                                <CircularProgress size={70} thickness={4}/>
                                            </div>
                                        </div>
                                    }
                            </div>
                            : <div className={classes.emptyQuery}>
                                    <div>В данном заказе нет возвратов</div>
                                </div>}
                        </Tab>
                        <Tab label="Исполнение" value={TAB.ORDER_TAB_PERFORMANCE}>3</Tab>
                    </Tabs>
                </div>
            </div>
            <OrderTransactionsDialog
                open={transactionsDialog.openTransactionsDialog}
                loading={transactionsDialog.transactionsLoading}
                onClose={transactionsDialog.handleCloseTransactionsDialog}
                paymentData={paymentData}
            />
            <OrderReturnDialog
                open={returnDialog.openReturnDialog}
                loading={returnDialog.returnLoading}
                onClose={returnDialog.handleCloseReturnDialog}
                onSubmit={returnDialog.handleSubmitReturnDialog}
                orderData={data}
            />
            <OrderItemReturnDialog
                returnListData={returnListData}
                open={itemReturnDialog.openOrderItemReturnDialog}
                loading={itemReturnDialog.returnDialogLoading}
                onClose={itemReturnDialog.handleCloseItemReturnDialog}
            />
        </div>
    )
})

OrderDetails.propTypes = {
    paymentData: PropTypes.object,
    returnListData: PropTypes.object,
    tabData: PropTypes.shape({
        tab: PropTypes.string.isRequired,
        handleTabChange: PropTypes.func.isRequired
    }),
    data: PropTypes.object.isRequired,
    returnData: PropTypes.array,
    loading: PropTypes.bool.isRequired,
    returnDialog: PropTypes.shape({
        returnLoading: PropTypes.bool.isRequired,
        openReturnDialog: PropTypes.bool.isRequired,
        handleOpenReturnDialog: PropTypes.func.isRequired,
        handleCloseReturnDialog: PropTypes.func.isRequired
    }).isRequired,
    itemReturnDialog: PropTypes.shape({
        returnDialogLoading: PropTypes.bool.isRequired,
        openOrderItemReturnDialog: PropTypes.bool.isRequired,
        handleOpenItemReturnDialog: PropTypes.func.isRequired,
        handleCloseItemReturnDialog: PropTypes.func.isRequired
    }).isRequired,
    handleOpenUpdateDialog: PropTypes.func.isRequired,
    orderListData: PropTypes.object,
    getDocument: PropTypes.shape({
        handleGetDocument: PropTypes.func.isRequired
    }),
    returnDataLoading: PropTypes.bool
}

export default OrderDetails
