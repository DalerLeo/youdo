import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import {Row} from 'react-flexbox-grid'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import CircularProgress from 'material-ui/CircularProgress'
import CloseIcon2 from '../CloseIcon2'
import IconButton from 'material-ui/IconButton'
import ArrowUpIcon from 'material-ui/svg-icons/navigation/arrow-upward'
import ArrowDownIcon from 'material-ui/svg-icons/navigation/arrow-downward'
import Pagination from '../ReduxForm/Pagination'
import getConfig from '../../helpers/getConfig'
import numberFormat from '../../helpers/numberFormat'
import dateFormat from '../../helpers/dateFormat'

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
        red: {
            color: '#e57373 !important'
        },
        green: {
            color: '#81c784 !important'
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
            height: '70px',
            fontWeight: '600',
            borderBottom: '1px #efefef solid',
            margin: '0',
            padding: '0 30px'
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
            maxHeight: '310px',
            overflowY: 'auto',
            overflowX: 'hidden',
            width: '100%',
            padding: '0 30px 10px',
            '& span': {
                fontWeight: '600'
            },
            '& > .row': {
                margin: '0',
                padding: '15px 0',
                '& > div': {
                    padding: '0 0.5rem'
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
        }
    })
)

const iconStyle = {
    icon: {
        color: '#666666',
        width: 24,
        height: 24,
        lineHeight: 'normal'
    },
    button: {
        width: 48,
        height: 48,
        '& > div': {
            lineHeight: 'none'
        }
    }
}

const ClientBalanceInfoDialog = enhance((props) => {
    const {open, filterItem, onClose, classes, detailData, name, balance, paymentType} = props
    const ZERO = 0
    const currentCurrency = getConfig('PRIMARY_CURRENCY')
    const loading = _.get(detailData, 'detailLoading')
    const detailList = _.map(_.get(detailData, 'data'), (item, index) => {
        const id = _.get(item, 'order') || _.get(item, 'transaction')
        const createdDate = dateFormat(_.get(item, 'createdDate')) + ' ' + moment(_.get(item, 'createdDate')).format('HH:MM')
        const comment = _.get(item, 'comment') || 'Комментариев нет'
        const currency = _.get(item, ['currency', 'name'])
        const market = _.get(item, ['market', 'name'])
        const amount = _.toNumber(_.get(item, 'amount'))
        const customRate = _.toNumber(_.get(item, 'customRate'))
        const internal = _.toNumber(_.get(item, 'internal'))
        const user = _.get(item, 'user') ? (_.get(item, ['user', 'firstName']) + ' ' + _.get(item, ['user', 'secondName'])) : 'Система'
        return (
            <Row key={index} className='dottedList'>
                <div style={{flexBasis: '4%', maxWidth: '4%'}}>
                    {(amount > ZERO) ? <ArrowUpIcon color="#92ce95"/> : <ArrowDownIcon color="#e27676"/>}
                </div>
                <div style={{flexBasis: '7%', maxWidth: '7%'}}>{(_.get(item, 'order')) ? 'З-' : 'Т-'}{id}</div>
                <div style={{flexBasis: '16%', maxWidth: '16%'}}>{createdDate}</div>
                <div style={{flexBasis: '18%', maxWidth: '18%'}}>{user}</div>
                <div style={{flexBasis: '40%', maxWidth: '40%'}}>
                    <div>Магазин: <span>{market}</span></div>
                    <div>Коментария: <span>{comment}</span></div>
                </div>
                <div style={{flexBasis: '15%', maxWidth: '15%', textAlign: 'right'}}>
                    <div>{numberFormat(amount, currency)}</div>
                    <div>{currency !== currentCurrency ? numberFormat(internal, currentCurrency) + '(' + customRate + ')' : null} </div>
                </div>
            </Row>)
    })

    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            contentStyle={loading ? {width: '500px'} : {width: '1000px', maxWidth: 'unset'}}
            bodyStyle={{minHeight: 'auto'}}
            bodyClassName={classes.popUp}>
            <div className={classes.titleContent}>
                <span>Информация по балансу клиента</span>
                <IconButton
                    iconStyle={iconStyle.icon}
                    style={iconStyle.button}
                    onTouchTap={onClose}>
                    <CloseIcon2/>
                </IconButton>
            </div>
            {loading ? <div className={classes.loader}>
                    <CircularProgress size={40} thickness={4}/>
                </div>
                : <div className={classes.bodyContent}>
                    <div className={classes.infoBlock}>
                        <div className={classes.info}>
                            <div>
                                <span>Клиент</span>
                                <div>{name}</div>
                            </div>
                            <div>
                                <span>Баланс {paymentType}</span>
                                <div className={(balance >= ZERO) ? classes.green : classes.red}>{numberFormat(balance, currentCurrency)}</div>
                            </div>
                        </div>
                        <Pagination filter={filterItem}/>
                    </div>
                    <div className={classes.content}>
                        <Row>
                            <div style={{flexBasis: '4%', maxWidth: '4%'}}>
                            </div>
                            <div style={{flexBasis: '7%', maxWidth: '7%'}}>Код</div>
                            <div style={{flexBasis: '16%', maxWidth: '16%'}}>Дата</div>
                            <div style={{flexBasis: '18%', maxWidth: '18%'}}>Кто</div>
                            <div style={{flexBasis: '40%', maxWidth: '40%'}}>Описание</div>
                            <div style={{flexBasis: '15%', maxWidth: '15%', textAlign: 'right'}}>Сумма</div>
                        </Row>

                        {balance ? detailList : <div style={{padding: '20px 30px', textAlign: 'center'}}>Пока транзакции нет</div>}
                    </div>
                </div>
            }
        </Dialog>
    )
})

ClientBalanceInfoDialog.propTyeps = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}

export default ClientBalanceInfoDialog
