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
import numberFormat from '../../helpers/numberFormat'
const ZERO = 0
const enhance = compose(
    injectSheet({
        loader: {
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            background: '#fff'
        },
        dialog: {
            padding: '0!important',
            '& .row': {
                alignItems: 'center',
                '& > div': {
                    lineHeight: '50px'
                }
            }
        },
        title: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
            height: '50px',
            fontWeight: '600',
            borderBottom: '1px #efefef solid',
            margin: '0',
            boxSizing: 'border-box',
            padding: '0 30px'

        },
        content: {
            width: '100%',
            padding: '0 30px',
            boxSizing: 'border-box',
            '& > .row': {
                margin: '0',
                padding: '0',
                '& > div': {},
                '& > div:first-child': {
                    display: 'flex',
                    '& > svg': {
                        width: '20px !important',
                        height: '20px !important'
                    }
                }
            },
            '& > .row:first-child': {
                fontWeight: '600',
                lineHeight: '20px',
                borderBottom: 'solid 1px #efefef'
            },
            '& .dottedList:last-child:after': {
                content: '""',
                backgroundImage: 'none'
            }
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
            boxSizing: 'border-box',
            padding: '0 30px'
        },
        info: {
            display: 'flex',
            width: '45%',
            justifyContent: 'space-between',
            '& span': {
                fontWeight: '500'
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

const ClientBalanceCreateDialog = enhance((props) => {
    const {open, loading, filter, onClose, classes, detailData, name, balance} = props
    const balanceColor = Number(balance) > ZERO ? '#81c784' : '#e57373'

    const detailList = _.map(_.get(detailData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const createdDate = moment(_.get(item, 'createdDate')).format('DD-MM-YYYY')
        const comment = _.get(item, 'comment')
        const amountType = Number(_.get(item, 'amount'))
        const amountColor = amountType > ZERO ? '#81c784' : '#e57373'
        const amount = numberFormat(_.get(item, 'amount'), _.get(item, ['currency', 'name']))
        const order = _.get(item, 'order') || '0'
        const transaction = _.get(item, 'transaction') || '0'

        return (
            <Row key={id} className='dottedList'>
                <div style={{flexBasis: '5%', maxWidth: '5%'}}>{amountType >= ZERO ? <ArrowUpIcon color='#81c784' />
                                                                                    : <ArrowDownIcon color="#e57373"/> }
                </div>
                <div style={{flexBasis: '25%', maxWidth: '25%'}}>Z-{id} / {transaction} / {order}</div>
                <div style={{flexBasis: '15%', maxWidth: '15%'}}>{createdDate}</div>
                <div style={{flexBasis: '40%', maxWidth: '40%'}}>{comment}</div>
                <div style={{flexBasis: '15%', maxWidth: '15%', textAlign: 'right', color: amountColor}}>{amount}</div>
            </Row>)
    })
    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            contentStyle={loading ? {width: '1000px'} : {width: '1000px', minWidth: 'auto', maxWidth: 'auto'}}
            bodyStyle={{minHeight: 'auto'}}
            bodyClassName={classes.dialog}>
            <Row className={classes.title}>
                <div>ИНФОРМАЦИЯ ПО БОЛАНСУ КЛИЕНТА</div>
                <IconButton
                    iconStyle={iconStyle.icon}
                    style={iconStyle.button}
                    onTouchTap={onClose}>
                    <CloseIcon2/>
                </IconButton>
            </Row>
            <div className={classes.infoBlock}>
                <div className={classes.info}>
                    <div>
                        <span>Клиент</span>
                        <div>{name}</div>
                    </div>
                    <div>
                        <span>Баланс</span>
                        <div style={{color: balanceColor}}>{numberFormat(balance)}</div>
                    </div>
                </div>
                <Pagination filter={filter}/>
            </div>
            <div className={classes.content}>
                <Row>
                    <div style={{flexBasis: '5%', maxWidth: '5%'}}></div>
                    <div style={{flexBasis: '25%', maxWidth: '25%'}}>Транзакция / Заказ</div>
                    <div style={{flexBasis: '15%', maxWidth: '15%'}}>Дата</div>
                    <div style={{flexBasis: '40%', maxWidth: '40%'}}>Описание</div>
                    <div style={{flexBasis: '15%', maxWidth: '15%', textAlign: 'right'}}>Сумма</div>
                </Row>
                {loading
                    ? <div style={{textAlign: 'center'}}>
                        <CircularProgress size={40} thickness={4}/>
                    </div> : detailList}
            </div>
        </Dialog>
    )
})

ClientBalanceCreateDialog.propTyeps = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}

export default ClientBalanceCreateDialog
