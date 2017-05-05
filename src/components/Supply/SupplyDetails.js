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
import MainStyles from '../Styles/MainStyles'

const colorBlue = '#12aaeb !important'
const enhance = compose(
    injectSheet(_.merge(MainStyles, {
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
            alignItems: 'center',
            width: '100%',
            padding: '20px 0',
            margin: '-20px 0 0'
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
                padding: '60px 28px 20px',
                top: '-24px',
                left: '50%',
                zIndex: '9',
                minWidth: '300px',
                transform: 'translate(-50%, 0)',
                '& .detailsWrap': {
                    position: 'relative',
                    paddingTop: '10px',
                    '&:before': {
                        content: '""',
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
            paddingRight: '15px',
            zIndex: '10',
            '&:after': {
                top: '8px',
                right: '0',
                content: '""',
                position: 'absolute',
                borderTop: '5px solid',
                borderLeft: '5px solid transparent',
                borderRight: '5px solid transparent'
            }
        },
        details: {
            extend: 'title',
            background: '#f2f5f8',
            padding: '23px 30px',
            margin: '0 -30px'
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
                width: '100%'
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
                padding: '20px 30px',
                margin: '0 -30px',
                borderBottom: '1px #efefef solid',
                '& .addExpense': {
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'space-between',
                    fontWeight: 'bold',
                    paddingBottom: '30px',
                    '& .expenseButton > div > span ': {
                        color: 'red !important',
                        textTransform: 'inherit !important'
                    }
                }
            },
            '& .expenseInfo': {
                marginBottom: '20px',
                '&:last-child': {
                    margin: '0'
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
        }
    })),
    withState('openDetails', 'setOpenDetails', false)
)

const iconStyle = {
    icon: {
        color: '#666',
        width: 18,
        height: 18
    },
    button: {
        width: 30,
        height: 30,
        padding: 0
    }
}

const tooltipPosition = 'bottom-center'

const SupplyDetails = enhance((props) => {
    const {classes, loading, data, setOpenDetails, openDetails} = props
    const id = _.get(data, 'id')
    const provider = _.get(data, ['provider', 'name'])
    const products = _.get(data, 'products')
    const stock = _.get(data, ['stock', 'name'])
    const currency = _.get(data, 'currency') || 'N/A'
    const contact = _.get(data, 'contact')
    const contactPerson = _.get(contact, 'name')
    const contactEmail = _.get(contact, 'email')
    const contactPhone = _.get(contact, 'phone')
    const dataDelivery = _.get(data, 'dataDelivery') || 'N/A'
    const acceptedTime = _.get(data, 'acceptedTime') || 'N/A'
    const finishedTime = _.get(data, 'finishedTime') || 'N/A'
    const totalCost = _.get(data, 'totalCost')
    const comment = _.get(data, 'comment')

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
                    <IconButton
                        iconStyle={iconStyle.icon}
                        style={iconStyle.button}
                        touch={true}
                        tooltipPosition={tooltipPosition}
                        tooltip="Изменить">
                        <Edit />
                    </IconButton>
                    <IconButton
                        iconStyle={iconStyle.icon}
                        style={iconStyle.button}
                        touch={true}
                        tooltipPosition={tooltipPosition}
                        tooltip="Удалить">
                        <Delete />
                    </IconButton>
                </div>
            </div>

            <div className={classes.details}>
                <div className={classes.storeInfo}>
                    <div className={classes.store}>Склад: <span
                        style={{color: '#999', fontWeight: 'bold'}}>{stock}</span></div>
                    <div className={classes.supplyDate} style={{marginLeft: '45px'}}>Дата поставки: <span
                        style={{color: '#e57373', fontWeight: 'bold'}}>{dataDelivery}</span></div>
                </div>
                <div className={classes.dateInfo}>
                    <div>Начало приемки: <span style={{fontWeight: '600'}}>{acceptedTime}</span></div>
                    <div>Конец приемки: <span style={{fontWeight: '600'}}>{finishedTime}</span></div>
                </div>
            </div>

            <div className={classes.data}>
                <div className="dataHeader">
                    <Row>
                        <Col xs={6}>Товар</Col>
                        <Col xs={1}>Количество</Col>
                        <Col xs={1}>Принято</Col>
                        <Col xs={1}>Брак</Col>
                        <Col xs={1}>
                            <div>Стоимость</div>
                        </Col>
                        <Col xs={2}>
                            <div style={{textAlign: 'right'}}>Итог</div>
                        </Col>
                    </Row>
                </div>
                <div>
                    {_.map(products, (item) => {
                        const product = _.get(item, 'product')
                        const productName = _.get(product, 'name')
                        const price = _.get(product, 'price')
                        const cost = _.get(item, 'cost')
                        const amount = _.get(item, 'amount')
                        const postedAmount = _.get(item, 'postedAmount')
                        const defectAmount = _.get(item, 'defectAmount')
                        const measurement = _.get(product, ['measurement', 'name'])
                        return (
                            <Row className="dataInfo" key={item}>
                                <Col xs={6}>{productName}</Col>
                                <Col xs={1}>{amount} {measurement}</Col>
                                <Col xs={1}>{postedAmount} {measurement}</Col>
                                <Col xs={1}>{defectAmount} {measurement}</Col>
                                <Col xs={1}>
                                    <div>{price} {currency}</div>
                                </Col>
                                <Col xs={2}>
                                    <div style={{textAlign: 'right'}}>{cost} {currency}</div>
                                </Col>
                            </Row>
                        )
                    })}
                </div>
                <div className="summary">
                    <div>Сумма заказа <span style={{marginLeft: '40px'}}>{totalCost} {currency}</span></div>
                </div>
                <div className="addExpenses">
                    <div className="addExpense">
                        <div>Дополнительные расходы по заказу</div>
                        <div>
                            <FlatButton
                                className="expenseButton"
                                label="+ добавить доп. расход"/>
                        </div>
                    </div>
                    <div className="expenseInfo">
                        <Row>
                            <Col xs={10}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Mollitia, nostrum,
                                quas. Ad aliquid asperiores beatae debitis ex facere, id ipsa ipsam iste iure, iusto
                                labore maxime minus neque perferendis perspiciatis placeat, quam repellendus similique
                                sunt totam veniam vitae! Doloremque expedita in inventore, laborum perferendis placeat
                                repellendus reprehenderit suscipit temporibus voluptatibus!</Col>
                            <Col xs={2}>
                                <div style={{textAlign: 'right'}}>2000 USD</div>
                            </Col>
                        </Row>
                    </div>
                </div>
                <div className="comment">
                    <div className="personImage">
                        <img src={Person} alt=""/>
                    </div>
                    <div className="personText">
                        {comment}
                    </div>
                </div>
            </div>
        </div>
    )
})

SupplyDetails.propTypes = {
    data: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    confirmDialog: PropTypes.shape({
        openConfirmDialog: PropTypes.bool.isRequired,
        handleOpenConfirmDialog: PropTypes.func.isRequired,
        handleCloseConfirmDialog: PropTypes.func.isRequired,
        handleSendConfirmDialog: PropTypes.func.isRequired
    }).isRequired,
    handleOpenUpdateDialog: PropTypes.func.isRequired
}

export default SupplyDetails
