import _ from 'lodash'
import React from 'react'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import CircularProgress from 'material-ui/CircularProgress'
import IconButton from 'material-ui/IconButton'
import Edit from 'material-ui/svg-icons/image/edit'
import Delete from 'material-ui/svg-icons/action/delete'
import {Row, Col} from 'react-flexbox-grid'
import Dot from '../Images/dot.png'
import numberFormat from '../../helpers/numberFormat'
import getConfig from '../../helpers/getConfig'
import Tooltip from '../ToolTip'
import dateFormat from '../../helpers/dateFormat'

const colorBlue = '#12aaeb'
const enhance = compose(
    injectSheet({
        dottedList: {
            padding: '20px 0'
        },
        wrapper: {
            color: '#333 !important',
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            padding: '20px 30px',
            '& a': {
                color: colorBlue
            }
        },
        link: {
            borderBottom: '1px dashed',
            fontWeight: '600'
        },
        defect: {
            extend: 'link',
            color: '#e57373 !important'
        },
        loader: {
            width: '100%',
            background: '#fff',
            height: '400px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        expenseLoader: {
            extend: 'loader',
            height: 'auto',
            padding: '20px 0'
        },
        title: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            height: '65px',
            margin: '-20px 0 0',
            position: 'relative'
        },
        titleLabel: {
            fontSize: '18px',
            color: '#333',
            fontWeight: 'bold',
            cursor: 'pointer'
        },
        titleButtons: {
            display: 'flex',
            justifyContent: 'flex-end'
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
        details: {
            display: 'flex',
            justifyContent: 'space-between',
            boxSizing: 'content-box',
            alignItems: 'center',
            width: '100%',
            background: '#f2f5f8',
            padding: '0 30px',
            margin: '0 -30px',
            minHeight: '60px'
        },
        payInfo: {
            display: 'flex'
        },
        storeInfo: {
            display: 'flex'
        },
        dateInfo: {
            textAlign: 'right',
            display: 'flex',
            '& span': {
                fontWeight: 'bold',
                color: '#999'
            }
        },
        data: {
            width: '100%',
            '& .dataHeader': {
                fontWeight: 'bold',
                padding: '20px 0',
                width: '100%',
                borderBottom: '1px solid #efefef',
                '& .row': {
                    alignItems: 'center',
                    '& div': {
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }
                }
            },
            '& .summary': {
                fontWeight: 'bold',
                textTransform: 'uppercase',
                textAlign: 'right',
                padding: '20px 30px',
                margin: '0 -30px',
                borderBottom: '1px #efefef solid'
            },
            '& .dottedList': {
                '&:last-child:after': {
                    display: 'none'
                },
                '&:after': {
                    left: '0.5rem',
                    right: '0.5rem'
                }
            },
            '& .addExpenses': {
                padding: '20px 30px 0',
                margin: '0 -30px',
                borderBottom: '1px #efefef solid',
                '& .addExpense': {
                    display: 'flex',
                    alignItems: 'center',
                    paddingBottom: '20px',
                    width: '100%',
                    justifyContent: 'space-between',
                    fontWeight: 'bold',
                    '& .expenseButton > div > span ': {
                        color: '#12aaeb !important',
                        textTransform: 'inherit !important'
                    }
                }
            },
            '& .expenseInfo': {
                padding: '0 !important',
                display: 'block',
                '&:last-child': {
                    position: 'static'
                },
                '& .row': {
                    alignItems: 'center'
                }
            },
            '& .dataInfo': {
                height: '50px',
                padding: '0',
                '& > div': {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }
            },
            '& .comment': {
                display: 'flex',
                padding: '20px 0 0',
                alignItems: 'center',
                '& .personImage': {
                    borderRadius: '50%',
                    overflow: 'hidden',
                    flexBasis: '35px',
                    flexGrow: '1',
                    height: '35px',
                    width: '35px',
                    '& img': {
                        display: 'block',
                        height: '100%',
                        width: '100%'
                    }
                },
                '& .personText': {
                    background: '#f2f5f8',
                    borderRadius: '2px',
                    marginLeft: '15px',
                    padding: '15px',
                    position: 'relative',
                    width: 'calc(100% - 50px)',
                    '&:after': {
                        content: '""',
                        position: 'absolute',
                        borderRightColor: '#f2f5f8',
                        borderRightStyle: 'solid',
                        borderRightWidth: '7px',
                        borderTop: '7px solid transparent',
                        borderBottom: '7px solid transparent',
                        left: '-7px',
                        top: '50%',
                        marginTop: '-7px'
                    }
                }
            }
        },
        expenseSum: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end'
        },
        closeDetail: {
            position: 'absolute',
            left: '0',
            top: '0',
            right: '0',
            bottom: '0',
            cursor: 'pointer',
            zIndex: '1',
            margin: '0 -30px'
        }
    }),
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

const PricesDetails = enhance((props) => {
    const {
        classes,
        loading,
        data,
        updateDialog,
        confirmDialog,
        handleCloseDetail
    } = props
    const id = _.get(data, 'id')
    const name = _.get(data, 'name')
    const products = _.get(data, 'products')
    const beginDate = dateFormat(_.get(data, 'beginDate'))
    const tillDate = dateFormat(_.get(data, 'tillDate'))
    const discount = _.toNumber(_.get(data, 'discount'))
    const type = _.get(data, 'type')

    if (loading) {
        return (
            <div className={classes.loader}>
                <div>
                    <CircularProgress size={40} thickness={4}/>
                </div>
            </div>
        )
    }
    const currency = getConfig('PRIMARY_CURRENCY')
    return (
        <div className={classes.wrapper}>
            <div className={classes.title}>
                <div className={classes.titleLabel}>№ {id} | {name}</div>
                <div className={classes.closeDetail}
                     onClick={() => { handleCloseDetail() }}>
                </div>
                <div className={classes.titleButtons}>
                    <Tooltip position="bottom" text="Изменить">
                        <IconButton
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            touch={true}
                            onTouchTap={() => { updateDialog.handleOpenUpdateDialog() }}>
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

            <div className={classes.details}>
                <div className={classes.storeInfo}>
                    <div className={classes.store}>
                        {(type === 'discount') ? <span>Размер <b>акции - {discount}%</b></span>
                            : <span><b>Бонусная акция</b></span>}
                    </div>
                </div>
                <div className={classes.dateInfo}>
                    <div>Начало акции: <span style={{marginRight: '30px'}}>{beginDate}</span></div>
                    <div>Завершение акции: <span>{tillDate}</span></div>
                </div>
            </div>

            {(type === 'bonus')
                ? <div className={classes.data}>
                    <div className="dataHeader">
                        <Row>
                            <Col xs={4}>Товар</Col>
                            <Col xs={1}>Кол-во</Col>
                            <Col xs={4}>Подарок</Col>
                            <Col xs={1}>Кол-во</Col>
                        </Row>
                    </div>
                    <div>
                        {_.map(products, (item, index) => {
                            const product = _.get(item, ['product', 'name'])
                            const productMeasurement = _.get(item, ['product', 'measurement', 'name'])
                            const amount = _.toNumber(_.get(item, 'amount'))
                            const bonusProduct = _.get(item, ['bonusProduct', 'name']) || 'Не выбран'
                            const bonusProductMeasurement = _.get(item, ['bonusProduct', 'measurement', 'name'])
                            const bonusAmount = _.toNumber(_.get(item, 'bonusAmount'))
                            return (
                                <Row className="dataInfo dottedList" key={index}>
                                    <Col xs={4}>{product}</Col>
                                    <Col xs={1}>{amount ? numberFormat(amount, productMeasurement) : 'Не определено'}</Col>
                                    <Col xs={4}>{bonusProduct}</Col>
                                    <Col xs={1}>{bonusAmount ? numberFormat(bonusAmount, bonusProductMeasurement) : 'Не определено'}</Col>
                                    <Col xs={2} style={{textAlign: 'right'}}>
                                        <IconButton
                                            iconStyle={iconStyle.icon}
                                            style={iconStyle.button}
                                            touch={true}>
                                            <Delete />
                                        </IconButton>
                                    </Col>
                                </Row>
                            )
                        })}
                    </div>
                </div>
                : <div className={classes.data}>
                    <div className="dataHeader">
                        <Row>
                            <Col xs={5}>Товар</Col>
                            <Col xs={2}>Кол-во</Col>
                            <Col xs={2}>Реальная стоимость</Col>
                            <Col xs={2}>Стоимость по акции</Col>
                        </Row>
                    </div>
                    <div>
                        {_.map(products, (item) => {
                            const productId = _.get(item, ['product', 'id'])
                            const productName = _.get(item, ['product', 'name'])
                            const amount = _.get(item, 'amount')
                            const measurement = _.get(item, ['product', 'measurement', 'name'])
                            return (
                                <Row className="dataInfo dottedList" key={productId}>
                                    <Col xs={5}>{productName}</Col>
                                    <Col xs={2}>{numberFormat(amount, measurement)}</Col>
                                    <Col xs={2}>10 000 / 20 000 {currency}</Col>
                                    <Col xs={2}>7 000 / 14 000 {currency}</Col>
                                    <Col xs={1} style={{textAlign: 'right'}}>
                                        <IconButton
                                            iconStyle={iconStyle.icon}
                                            style={iconStyle.button}
                                            touch={true}>
                                            <Delete />
                                        </IconButton>
                                    </Col>
                                </Row>
                            )
                        })}
                    </div>
                </div>}
        </div>
    )
})

export default PricesDetails
