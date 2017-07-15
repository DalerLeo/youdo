import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import CircularProgress from 'material-ui/CircularProgress'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import Edit from 'material-ui/svg-icons/image/edit'
import Delete from 'material-ui/svg-icons/action/delete'
import {Row, Col} from 'react-flexbox-grid'
import Person from '../Images/person.png'
import Dot from '../Images/dot.png'
import CloseIcon from '../CloseIcon'
import numberFormat from '../../helpers/numberFormat'
import Tooltip from '../ToolTip'
import moment from 'moment'

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
            fontWeight: '600',
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
            textAlign: 'right'
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

const SupplyDetails = enhance((props) => {
    const {
        classes,
        loading,
        data,
        setOpenDetails,
        openDetails,
        handleSupplyExpenseOpenCreateDialog,
        supplyListData,
        defectDialog,
        updateDialog,
        confirmDialog,
        confirmExpenseDialog,
        handleCloseDetail
    } = props
    const id = _.get(data, 'id')
    const provider = _.get(data, ['provider', 'name'])
    const products = _.get(data, 'products')
    const stock = _.get(data, ['stock', 'name'])
    const currency = _.get(data, ['currency', 'name']) || 'N/A'
    const contact = _.get(data, 'contact')
    const contactPerson = _.get(contact, 'name')
    const contactEmail = _.get(contact, 'email')
    const contactPhone = _.get(contact, 'phone')
    const dateDelivery = _.get(data, 'dateDelivery') || 'Не указано'
    const acceptedTime = (_.get(data, 'acceptedTime')) ? moment(_.get(data, 'acceptedTime')).format('DD.MM.YYYY HH:mm:ss') : 'Не начался'
    const finishedTime = (_.get(data, 'finishedTime')) ? moment(_.get(data, 'finishedTime')).format('DD.MM.YYYY HH:mm:ss') : 'Не закончилась'

    const totalCost = _.get(data, 'totalCost')
    const comment = _.get(data, 'comment')

    const supplyExpenseList = _.get(supplyListData, 'data')
    const supplyExpenseListLoading = _.get(supplyListData, 'supplyExpenseListLoading')

    if (loading) {
        return (
            <div className={classes.loader}>
                <div>
                    <CircularProgress size={40} thickness={4}/>
                </div>
            </div>
        )
    }

    return (
        <div className={classes.wrapper}>
            <div className={classes.title}>
                <div className={classes.titleLabel}>Поставка № {id}</div>
                <div className={classes.closeDetail}
                     onClick={handleCloseDetail}>
                </div>
                <div className={classes.titleSupplier}>
                    <a className={classes.dropdown} onMouseEnter={() => {
                        setOpenDetails(true)
                    }}>{provider}</a>
                    {openDetails &&
                    <div className="supplierDetails" onMouseLeave={() => {
                        setOpenDetails(false)
                    }}>
                        <div className="detailsWrap">
                            <Row className="detailsList">
                                <Col xs={6}>Контактное лицо</Col>
                                <Col xs={6}>{contactPerson}</Col>
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
                    <Tooltip position="bottom" text="Изменить">
                        <IconButton
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            touch={true}
                            onTouchTap={updateDialog.handleOpenUpdateDialog}>
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
                    <div className={classes.store}>Склад: <span
                        style={{color: '#999', fontWeight: 'bold'}}>{stock}</span></div>
                    <div className={classes.supplyDate} style={{marginLeft: '45px'}}>Дата поставки: <span
                        style={{color: '#e57373', fontWeight: 'bold'}}>{dateDelivery}</span></div>
                </div>
                <div className={classes.dateInfo}>
                    <div>Начало приемки: <span style={{fontWeight: '600'}}>{acceptedTime}</span></div>
                    <div>Конец приемки: <span style={{fontWeight: '600'}}>{finishedTime}</span></div>
                </div>
            </div>

            <div className={classes.data}>
                <div className="dataHeader">
                    <Row>
                        <Col xs={4}>Товар</Col>
                        <Col xs={1}>Кол-во</Col>
                        <Col xs={1}>Принято</Col>
                        <Col xs={1}>Брак</Col>
                        <Col xs={1}>Недостача</Col>
                        <Col xs={2}>
                            <div style={{textAlign: 'right'}}>Стоимость</div>
                        </Col>
                        <Col xs={2}>
                            <div style={{textAlign: 'right'}}>Итог</div>
                        </Col>
                    </Row>
                </div>
                <div>
                    {_.map(products, (item) => {
                        const ZERO = 0
                        const product = _.get(item, 'product')
                        const defId = _.get(item, 'id')
                        const productId = _.get(product, 'id')
                        const productName = _.get(product, 'name')
                        const cost = _.toInteger(_.get(item, 'cost'))
                        const amount = _.toInteger(_.get(item, 'amount'))
                        const itemPrice = cost / amount
                        const postedAmount = _.get(item, 'postedAmount')
                        const defectAmount = _.get(item, 'defectAmount')
                        const measurement = _.get(product, ['measurement', 'name'])
                        const notAccepted = amount - (postedAmount + defectAmount)
                        return (
                            <Row className="dataInfo dottedList" key={productId}>
                                <Col xs={4}>{productName}</Col>
                                <Col xs={1}>{numberFormat(amount, measurement)}</Col>
                                <Col xs={1}>{numberFormat(postedAmount, measurement)}</Col>
                                <Col xs={1}>
                                    {(defectAmount > ZERO) ? <a onClick={ () => { defectDialog.handleOpenDefectDialog(defId) } }
                                                                className={classes.defect}>{numberFormat(defectAmount, measurement)}</a>
                                    : <span>{numberFormat(defectAmount, measurement)}</span>}
                                    </Col>
                                <Col xs={1}>{notAccepted}</Col>
                                <Col xs={2}>
                                    <div style={{textAlign: 'right'}}>{numberFormat(itemPrice, currency)}</div>
                                </Col>
                                <Col xs={2}>
                                    <div style={{textAlign: 'right'}}>{numberFormat(cost, currency)}</div>
                                </Col>
                            </Row>
                        )
                    })}
                </div>
                <div className="summary">
                    <div>Сумма заказа <span style={{marginLeft: '40px'}}>{numberFormat(totalCost, currency)}</span></div>
                </div>
                <div className="addExpenses">
                    <div className="addExpense">
                        <div>Дополнительные расходы по заказу</div>
                        <div>
                            <FlatButton
                                onTouchTap={() => { handleSupplyExpenseOpenCreateDialog(id) }}
                                className="expenseButton"
                                label="+ добавить доп. расход"/>
                        </div>
                    </div>
                    {supplyExpenseListLoading && <div className={classes.expenseLoader}>
                        <div>
                            <CircularProgress size={40} thickness={4}/>
                        </div>
                    </div>}
                    {!supplyExpenseListLoading && _.map(supplyExpenseList, (item) => {
                        const expId = _.get(item, 'id')
                        const expComment = _.get(item, 'comment')
                        const expAmount = numberFormat(_.get(item, 'amount'))
                        const expCurrency = _.get(item, ['currency', 'name'])
                        return (
                            <div className="expenseInfo dottedList" key={expId}>
                                <Row key={expId}>
                                    <Col xs={9}>{expComment}</Col>
                                    <Col xs={3} className={classes.expenseSum}>
                                        <div style={{textAlign: 'right'}}>{expAmount} {expCurrency}</div>
                                        <IconButton
                                            iconStyle={{color: '#666'}}
                                            onTouchTap={() => { confirmExpenseDialog.handleOpenConfirmExpenseDialog(expId) }}>
                                            <CloseIcon/>
                                        </IconButton>
                                    </Col>
                                </Row>
                            </div>
                        )
                    })}
                </div>
                {comment && <div className="comment">
                    <div className="personImage">
                        <img src={Person} alt=""/>
                    </div>
                    <div className="personText">
                        {comment}
                    </div>
                </div>
                }

            </div>
        </div>
    )
})

SupplyDetails.propTypes = {
    defectDialog: PropTypes.shape({
        openDefectDialog: PropTypes.bool.isRequired,
        handleOpenDefectDialog: PropTypes.func.isRequired,
        handleCloseDefectDialog: PropTypes.func.isRequired
    }).isRequired
}

export default SupplyDetails
