import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import Paper from 'material-ui/Paper'
import * as ROUTES from '../../constants/routes'
import GridList from '../GridList'
import Container from '../Container'
import ClientTransactionFilterForm from './ClientTransactionFilterForm'
import ConfirmDialog from '../ConfirmDialog'
import SubMenu from '../SubMenu'
import ToolTip from '../ToolTip'
import Loader from '../Loader'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import numberFormat from '../../helpers/numberFormat'
import getConfig from '../../helpers/getConfig'
import dateTimeFormat from '../../helpers/dateTimeFormat'
import Accepted from 'material-ui/svg-icons/action/done-all'
import Rejected from 'material-ui/svg-icons/content/block'
import Requested from 'material-ui/svg-icons/action/schedule'
import AutoAccepted from 'material-ui/svg-icons/action/spellcheck'
import ResendIcon from 'material-ui/svg-icons/content/reply'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import {hashHistory} from 'react-router'
import {
    REQUESTED,
    CONFIRMED,
    REJECTED,
    AUTO
} from './index'
import t from '../../helpers/translate'
import ClientBalanceFormat from '../Statistics/ClientIncome/ClientBalanceFormat'

const listHeader = [
    {
        sorting: false,
        name: 'icon',
        title: t('Статус'),
        xs: 1
    },
    {
        sorting: true,
        name: 'client',
        title: t('Клиент'),
        xs: 2
    },
    {
        sorting: true,
        name: 'user',
        title: t('Пользователь'),
        xs: 2
    },
    {
        sorting: false,
        title: t('Описание'),
        xs: 2
    },
    {
        sorting: true,
        name: 'date',
        title: t('Дата'),
        xs: 2
    },
    {
        sorting: true,
        alignRight: true,
        name: 'amount',
        title: t('Сумма'),
        xs: 2
    },
    {
        sorting: false,
        name: 'actions',
        title: '',
        xs: 1
    }
]

const enhance = compose(
    injectSheet({
        flex: {
            display: 'flex',
            alignItems: 'center'
        },
        summaryWrapper: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 30px',
            marginBottom: '15px',
            position: 'relative'
        },
        summaryLoader: {
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            zIndex: '2'
        },
        summary: {
            cursor: 'pointer',
            '& > div:last-child': {fontSize: '17px', fontWeight: '600'},
            '&:last-child': {
                textAlign: 'right'
            }
        },
        listRow: {
            '& a': {
                color: '#12aaeb !important'
            },
            '& svg': {
                width: '20px !important',
                height: '20px !important'
            }
        },
        buttons: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end'
        }
    }),
)

const iconStyle = {
    icon: {
        color: '#666'
    },
    button: {
        width: 40,
        height: 40,
        padding: 10
    }
}

const ClientTransactionGridList = enhance((props) => {
    const {
        filter,
        filterDialog,
        confirmDialog,
        resendDialog,
        listData,
        sumData,
        transactionID,
        classes,
        isAdmin
    } = props

    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    const primaryCurrencyID = _.toInteger(getConfig('PRIMARY_CURRENCY_ID'))
    const actions = <div/>

    const clientTransactionFilterDialog = (
        <ClientTransactionFilterForm
            initialValues={filterDialog.initialValues}
            filter={filter}
            filterDialog={filterDialog}
        />
    )
    const clientTransactionDetail = <span/>

    const totalDataLoading = _.get(sumData, 'loading')
    const totalConfirmedSum = numberFormat(Math.abs(_.get(sumData, ['data', 'confirmed', 'sum'])), primaryCurrency)
    const totalRejectedSum = numberFormat(Math.abs(_.get(sumData, ['data', 'rejected', 'sum'])), primaryCurrency)
    const totalRequestedSum = numberFormat(Math.abs(_.get(sumData, ['data', 'requested', 'sum'])), primaryCurrency)
    const totalAutoSum = numberFormat(Math.abs(_.get(sumData, ['data', 'auto', 'sum'])), primaryCurrency)

    const totalConfirmedCount = numberFormat(_.get(sumData, ['data', 'confirmed', 'count']))
    const totalRejectedCount = numberFormat(_.get(sumData, ['data', 'rejected', 'count']))
    const totalRequestedCount = numberFormat(_.get(sumData, ['data', 'requested', 'count']))
    const totalAutoCount = numberFormat(_.get(sumData, ['data', 'auto', 'count']))

    const clientTransactionList = _.map(_.get(listData, 'data'), (item) => {
        const ZERO = 0
        const id = _.get(item, 'id')
        const client = _.get(item, ['client', 'name'])
        const user = _.get(item, 'user')
        const userName = user ? _.get(user, 'firstName') + ' ' + _.get(user, 'secondName') : t('Неизвестно')
        const type = _.get(item, 'type')
        const order = _.get(item, 'order')
        const orderReturn = _.get(item, 'orderReturn')
        const amount = _.toNumber(_.get(item, 'amount'))
        const createdDate = dateTimeFormat(_.get(item, 'createdDate'))
        const currency = _.get(item, ['currency', 'name'])
        const currencyID = _.get(item, ['currency', 'id'])
        const internal = _.toNumber(_.get(item, 'internal'))
        const customRate = _.get(item, 'customRate') ? _.toNumber(_.get(item, 'customRate')) : _.toInteger(amount / internal)
        const confirmation = _.get(item, 'clientConfirmation')
        const statusIcon = (status) => {
            switch (status) {
                case CONFIRMED: return <ToolTip position={'right'} text={t('Подтвержден')}>
                    <Accepted color={'#81c784'}/>
                </ToolTip>
                case REJECTED: return <ToolTip position={'right'} text={t('Отменен')}>
                    <Rejected color={'#e57373'}/>
                </ToolTip>
                case REQUESTED: return <ToolTip position={'right'} text={t('В ожидании')}>
                    <Requested color={'#f0ad4e'}/>
                </ToolTip>
                case AUTO: return <ToolTip position={'right'} text={t('Автоматически подтвержден системой')}>
                    <AutoAccepted color={'#12aaeb'}/>
                </ToolTip>
                default: return null
            }
        }
        return (
            <Row key={id} className={classes.listRow}>
                <Col xs={1}>{statusIcon(confirmation)}</Col>
                <Col xs={2}>{client}</Col>
                <Col xs={2}>{userName}</Col>
                <Col xs={2}>
                    <ClientBalanceFormat type={type} order={order} orderReturn={orderReturn}/>
                </Col>
                <Col xs={2}>{createdDate}</Col>
                <Col style={{textAlign: 'right'}} className={amount >= ZERO ? classes.green : classes.red} xs={2}>
                    <span style={amount > ZERO ? {color: '#81c784'} : {color: '#e57373'}}>{numberFormat(amount, currency)}</span>
                    {currencyID !== primaryCurrencyID &&
                    <div>
                        <div>{numberFormat(internal, primaryCurrency)} <span
                            style={{fontSize: 11, color: '#666'}}>({customRate})</span></div>
                    </div>}
                </Col>
                <Col xs={1} style={{textAlign: 'right'}}>
                    <div className={classes.buttons}>
                        {confirmation === REJECTED &&
                        <ToolTip position={'left'} text={t('Переотправить запрос')}>
                            <IconButton
                                onTouchTap={() => { resendDialog.handleOpenResendDialog(id) }}
                                style={iconStyle.button}
                                iconStyle={iconStyle.icon}>
                                <ResendIcon/>
                            </IconButton>
                        </ToolTip>}
                        {isAdmin &&
                        <ToolTip position={'left'} text={t('Удалить транзакцию')}>
                            <IconButton
                                onTouchTap={() => { confirmDialog.handleOpenConfirmDialog(id) }}
                                style={iconStyle.button}
                                iconStyle={iconStyle.icon}>
                                <DeleteIcon/>
                            </IconButton>
                        </ToolTip>}
                    </div>
                </Col>
            </Row>
        )
    })

    const list = {
        header: listHeader,
        list: clientTransactionList,
        loading: _.get(listData, 'listLoading')
    }

    return (
        <Container>
            <SubMenu url={ROUTES.CLIENT_TRANSACTION_LIST_URL}/>
            <Paper zDepth={1} className={classes.summaryWrapper}>
                {totalDataLoading &&
                <div className={classes.summaryLoader}>
                    <Loader size={0.75}/>
                </div>}
                <div className={classes.summary} onClick={() => { hashHistory.push(filter.createURL({status: CONFIRMED})) }}>
                    <div>{t('Сумма принятых оплат')} ({totalConfirmedCount})</div>
                    <div>{totalConfirmedSum}</div>
                </div>
                <div className={classes.summary} onClick={() => { hashHistory.push(filter.createURL({status: REJECTED})) }}>
                    <div>{t('Сумма отклоненных оплат')} ({totalRejectedCount})</div>
                    <div>{totalRejectedSum}</div>
                </div>
                <div className={classes.summary} onClick={() => { hashHistory.push(filter.createURL({status: REQUESTED})) }}>
                    <div>{t('Сумма ожидаемых оплат')} ({totalRequestedCount})</div>
                    <div>{totalRequestedSum}</div>
                </div>
                <div className={classes.summary} onClick={() => { hashHistory.push(filter.createURL({status: AUTO})) }}>
                    <div>{t('Сумма автоматически принятых оплат')} ({totalAutoCount})</div>
                    <div>{totalAutoSum}</div>
                </div>
            </Paper>

            <GridList
                filter={filter}
                list={list}
                detail={clientTransactionDetail}
                actionsDialog={actions}
                filterDialog={clientTransactionFilterDialog}
            />

            <ConfirmDialog
                type="delete"
                message={t('Транзакция') + ' №' + transactionID}
                onClose={confirmDialog.handleCloseConfirmDialog}
                onSubmit={confirmDialog.handleSubmitConfirmDialog}
                open={confirmDialog.open}
            />
            <ConfirmDialog
                type="submit"
                message={t('Транзакция') + ' №' + transactionID}
                onClose={resendDialog.handleCloseResendDialog}
                onSubmit={resendDialog.handleSubmitResendDialog}
                open={resendDialog.open}
            />
        </Container>
    )
})

ClientTransactionGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    clientData: PropTypes.object,
    detailData: PropTypes.object,
    confirmDialog: PropTypes.shape({
        open: PropTypes.bool.isRequired,
        handleOpenConfirmDialog: PropTypes.func.isRequired,
        handleCloseConfirmDialog: PropTypes.func.isRequired,
        handleSubmitConfirmDialog: PropTypes.func.isRequired
    }).isRequired,
    filterDialog: PropTypes.shape({
        initialValues: PropTypes.object,
        filterLoading: PropTypes.bool,
        openFilterDialog: PropTypes.bool.isRequired,
        handleOpenFilterDialog: PropTypes.func.isRequired,
        handleCloseFilterDialog: PropTypes.func.isRequired,
        handleSubmitFilterDialog: PropTypes.func.isRequired
    }).isRequired
}

export default ClientTransactionGridList
