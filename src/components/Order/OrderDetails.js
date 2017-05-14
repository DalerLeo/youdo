import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import CircularProgress from 'material-ui/CircularProgress'
import OrderTransactionsDialog from './OrderTransactionsDialog'
import OrderReturnDialog from './OrderReturnDialog'
import IconButton from 'material-ui/IconButton'
import Return from 'material-ui/svg-icons/content/reply'
import File from 'material-ui/svg-icons/editor/insert-drive-file'
import {Row, Col} from 'react-flexbox-grid'
import Dot from '../Images/dot.png'

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
            zIndex: '10',
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
            fontWeight: '600'
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
                zIndex: '9',
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
        content: {
            display: 'flex',
            width: '100%'
        },
        padding: {
            padding: '20px 30px'
        },
        leftSide: {
            flexBasis: '30%',
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
            padding: '0 30px 20px'
        },
        subtitle: {
            fontWeight: '600',
            textTransform: 'uppercase',
            marginBottom: '10px'
        },
        dataBox: {
            display: 'flex',
            justifyContent: 'space-between',
            '& ul:last-child': {
                fontWeight: '600',
                marginLeft: '30px',
                textAlign: 'right'
            },
            '& li': {
                lineHeight: '25px'
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

const tooltipPosition = 'bottom-center'

const OrderDetails = enhance((props) => {
    const {classes, loading, data, setOpenDetails, openDetails, transactionsDialog, returnDialog} = props
    const id = _.get(data, 'id')
    const products = _.get(data, 'products')
    const contact = _.get(data, 'contact')
    const contactName = _.get(contact, 'name')
    const contactEmail = _.get(contact, 'email') || 'N/A'
    const contactPhone = _.get(contact, 'telephone') || 'N/A'

    const client = _.get(data, 'client')
    const clientPerson = _.get(client, 'name')
    const deliveryType = _.get(data, 'deliveryType')

    const percent = 100
    const zero = 0
    const deliveryPrice = _.get(data, 'deliveryPrice')
    const discount = _.get(data, 'discountPrice')
    const totalPrice = _.get(data, 'totalPrice')
    const totalBalance = _.get(data, 'totalBalance')
    const discountPrice = deliveryPrice * (discount / percent)

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
                <div className={classes.titleLabel}>Заказ №{id}</div>
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
                    <IconButton
                        iconStyle={iconStyle.icon}
                        style={iconStyle.button}
                        touch={true}
                        tooltipPosition={tooltipPosition}
                        onTouchTap={returnDialog.handleOpenReturnDialog}
                        tooltip="Добавить возврат">
                        <Return />
                    </IconButton>
                    <IconButton
                        iconStyle={iconStyle.icon}
                        style={iconStyle.button}
                        touch={true}
                        tooltipPosition={tooltipPosition}
                        tooltip="Скачать договор">
                        <File />
                    </IconButton>
                </div>
            </div>

            <div className={classes.content}>
                <div className={classes.leftSide}>
                    <div className={classes.subBlock}>
                        <div className={classes.subtitle}>Баланс</div>
                        <div className={classes.dataBox}>
                            <ul>
                                <li>Тип оплаты:</li>
                                <li>Дата оплаты:</li>
                                <li>Стоимость доставки:</li>
                                <li>Скидка({discount}%):</li>
                                <li>Оплачено:</li>
                                <li>Остаток:</li>
                            </ul>
                            <ul>
                                <li>Перечисление</li>
                                <li>22.05.2017</li>
                                <li>{deliveryPrice}</li>
                                <li>{discountPrice}</li>
                                <li>
                                    <a onClick={transactionsDialog.handleOpenTransactionsDialog} className={classes.link}>500 000 UZS</a>
                                </li>
                                <li className={totalBalance > zero ? classes.red : classes.green}>{totalBalance}</li>
                            </ul>
                        </div>
                    </div>

                    <div className={classes.subBlock}>
                        <div className={classes.subtitle}>Передача</div>
                        <div className={classes.dataBox}>
                            <ul>
                                <li>Тип передачи:</li>
                                <li>Статус передачи:</li>
                            </ul>
                            <ul>
                                <li>{deliveryType > zero ? 'Доставка' : 'Самовывоз'}</li>
                                <li className={classes.red}>не доставлен</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className={classes.rightSide}>
                    <div className={classes.tab}>
                        <div className={classes.tabNav}>
                            <a className="active">Список товаров</a>
                            <a>Возврат</a>
                        </div>
                        <div className={classes.tabContent}>
                            <div className={classes.tabWrapper}>
                                <Row className="dottedList">
                                    <Col xs={6}>Товар</Col>
                                    <Col xs={2}>Количество</Col>
                                    <Col xs={2}>Цена (UZS)</Col>
                                    <Col xs={2}>Сумма (UZS)</Col>
                                </Row>

                                {_.map(products, (item) => {
                                    const product = _.get(item, 'product')
                                    const productId = _.get(product, 'id')
                                    const productName = _.get(product, 'name')
                                    const price = _.get(item, 'price')
                                    const cost = _.get(item, 'cost')
                                    const amount = _.get(item, 'amount')
                                    const measurement = _.get(product, ['measurement', 'name'])
                                    return (
                                        <Row className="dottedList" key={productId}>
                                            <Col xs={6}>{productName}</Col>
                                            <Col xs={2}>{amount} {measurement}</Col>
                                            <Col xs={2}>{price}</Col>
                                            <Col xs={2}>{cost}</Col>
                                        </Row>
                                    )
                                })}
                            </div>

                            <div className={classes.summary}>Итого: {totalPrice} UZS</div>
                        </div>
                    </div>
                </div>
            </div>
            <OrderTransactionsDialog
                open={transactionsDialog.openTransactionsDialog}
                loading={transactionsDialog.transactionsLoading}
                onClose={transactionsDialog.handleCloseTransactionsDialog}
            />
            <OrderReturnDialog
                open={returnDialog.openReturnDialog}
                loading={returnDialog.returnLoading}
                onClose={returnDialog.handleCloseReturnDialog}
                onSubmit={returnDialog.handleSubmitReturnDialog}
            />
        </div>
    )
})

OrderDetails.propTypes = {
    data: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    confirmDialog: PropTypes.shape({
        openConfirmDialog: PropTypes.bool.isRequired,
        handleOpenConfirmDialog: PropTypes.func.isRequired,
        handleCloseConfirmDialog: PropTypes.func.isRequired,
        handleSendConfirmDialog: PropTypes.func.isRequired
    }).isRequired,
    returnDialog: PropTypes.shape({
        returnLoading: PropTypes.bool.isRequired,
        openReturnDialog: PropTypes.bool.isRequired,
        handleOpenReturnDialog: PropTypes.func.isRequired,
        handleCloseReturnDialog: PropTypes.func.isRequired
    }).isRequired,
    handleOpenUpdateDialog: PropTypes.func.isRequired,
    orderListData: PropTypes.object
}

export default OrderDetails
