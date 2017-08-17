import React from 'react'
import _ from 'lodash'
import moment from 'moment'
import PropTypes from 'prop-types'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import CloseIcon2 from '../CloseIcon2'
import IconButton from 'material-ui/IconButton'
import Paper from 'material-ui/Paper'
import {Row, Col} from 'react-flexbox-grid'
import CircularProgress from 'material-ui/CircularProgress'
import getConfig from '../../helpers/getConfig'
import numberFormat from '../../helpers/numberFormat'

const enhance = compose(
    injectSheet({
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
        popUp: {
            color: '#333 !important',
            overflowY: 'hidden !important',
            fontSize: '13px !important',
            position: 'relative',
            padding: '0 !important',
            overflowX: 'hidden',
            height: '100%',
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
        content: {
            width: '100%',
            display: 'flex'
        },
        link: {
            borderBottom: '1px dashed',
            fontWeight: '600'
        },
        leftSide: {
            maxWidth: '30%',
            flexBasis: '30%',
            padding: '20px 30px',
            borderRight: '1px #efefef solid'
        },
        subtitle: {
            display: 'flex',
            justifyContent: 'space-between',
            fontWeight: '600',
            marginBottom: '10px'
        },
        block: {
            marginBottom: '20px',
            '& ul': {
                display: 'inline-block',
                width: '50%',
                '& li': {
                    lineHeight: '25px'
                }
            }
        },
        rightSide: {
            maxWidth: '70%',
            flexBasis: '70%',
            padding: '20px 30px'
        },
        tableWrapper: {
            '& .row': {
                padding: '0',
                height: '40px',
                '& > div': {
                    textAlign: 'right',
                    '&:first-child': {
                        textAlign: 'left'
                    }
                },
                '&:first-child': {
                    fontWeight: '600'
                },
                '&:last-child:after': {
                    display: 'none'
                }
            }
        }
    }),
    withState('openInfo', 'setOpenInfo', false)
)

const ONE = 1
const StatDebtorsDialog = enhance((props) => {
    const {open, loading, onClose, classes, data, setOpenInfo, openInfo} = props

    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    const id = _.get(data, 'id')
    const client = _.get(data, ['client', 'name'])
    const paymentDate = moment(_.get(data, 'paymentDate')).format('LL')
    const totalPrice = numberFormat(_.get(data, 'totalPrice'), primaryCurrency)
    const totalPaid = numberFormat(_.get(data, 'totalPaid'), primaryCurrency)
    const totalBalance = numberFormat(_.get(data, 'totalBalance'), primaryCurrency)
    const discountPrice = numberFormat(_.get(data, 'discountPrice'), primaryCurrency)
    const status = _.toInteger(_.get(data, 'status')) === ONE ? 'Доставлен' : 'Недоставлен'
    const contactName = _.get(data, ['client', 'name'])
    const contactEmail = _.get(data, ['client', 'email'])
    const contactPhone = _.get(data, ['client', 'telephone'])

    const productList = _.map(_.get(data, 'products'), (item, index) => {
        const name = _.get(item, ['product', 'name'])
        const amount = _.get(item, 'amount')
        const price = numberFormat(_.get(item, 'price'), primaryCurrency)
        const measurement = _.get(item, ['product', 'measurement', 'name'])

        return (
            <Row key={index} className="dottedList">
                <Col xs={7}>{name}</Col>
                <Col xs={2}>{amount} {measurement}</Col>
                <Col xs={3}>{price}</Col>
            </Row>
        )
    })

    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '400px'} : {width: '950px', maxWidth: 'none'}}
            bodyStyle={{minHeight: 'auto'}}
            bodyClassName={classes.popUp}>
            <div className={classes.titleContent}>
                <span>Детализация задолжности</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon2 color="#666666"/>
                </IconButton>
            </div>
            {loading ? <div style={{textAlign: 'center'}}>
                <CircularProgress size={40} thickness={4}/>
            </div>
                : <div className={classes.content}>
                    <div className={classes.leftSide}>
                        <div className={classes.block}>
                            <div className={classes.subtitle}>
                                <div>Клиент</div>
                                <span className={classes.link}
                                   onMouseEnter={() => { setOpenInfo(true) }}
                                   onMouseLeave={() => {
                                       if (openInfo) {
                                           setOpenInfo(false)
                                       }
                                   }}>
                                    <span>контакты</span>
                                    <Paper zDepth={1} style={openInfo && {opacity: '1', zIndex: '2', top: '0'}}>
                                        <li>
                                            <span>Контактное лицо:</span>
                                            <span>{contactName}</span>
                                        </li>
                                        <li>
                                            <span>Телефон:</span>
                                            <span>{contactPhone}</span>
                                        </li>
                                        <li>
                                            <span>Email:</span>
                                            <span>{contactEmail}</span>
                                        </li>
                                    </Paper>
                                </span>
                            </div>
                            <div>{client}</div>
                        </div>
                        <div className={classes.block}>
                            <div className={classes.subtitle}>
                                <div>Заказ</div>
                                <div>{id}</div>
                            </div>
                            <ul>
                                <li>Тип оплаты</li>
                                <li>Дата оплаты</li>
                                <li>Стоимость</li>
                                <li>Скидка (0%)</li>
                                <li>Оплачено</li>
                                <li>Остаток</li>
                                <li>Статус</li>
                            </ul>
                            <ul>
                                <li>Перечисление</li>
                                <li>{paymentDate}</li>
                                <li>{totalPrice}</li>
                                <li>{discountPrice}</li>
                                <li>{totalPaid}</li>
                                <li>{totalBalance}</li>
                                <li>{status}</li>
                            </ul>
                        </div>
                    </div>
                    <div className={classes.rightSide}>
                        <div className={classes.tableWrapper}>
                            <Row className="dottedList">
                                <Col xs={7}>Наименование</Col>
                                <Col xs={2}>Кол-во</Col>
                                <Col xs={3}>Сумма</Col>
                            </Row>
                            {productList}
                        </div>
                    </div>
                </div>}
        </Dialog>
    )
})

StatDebtorsDialog.propTyeps = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    loading: PropTypes.bool
}

export default StatDebtorsDialog
