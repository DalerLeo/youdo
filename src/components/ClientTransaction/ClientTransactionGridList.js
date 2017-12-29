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
import {
    REQUESTED,
    CONFIRMED,
    REJECTED,
    AUTO
} from './index'

const listHeader = [
    {
        sorting: false,
        name: 'icon',
        title: 'Статус',
        xs: 1
    },
    {
        sorting: true,
        name: 'client',
        title: 'Клиент',
        xs: 3
    },
    {
        sorting: true,
        name: 'user',
        title: 'Пользователь',
        xs: 3
    },
    {
        sorting: true,
        name: 'date',
        title: 'Дата',
        xs: 2
    },
    {
        sorting: true,
        alignRight: true,
        name: 'amount',
        title: 'Сумма',
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
            marginBottom: '15px'
        },
        summary: {
            '& > div:first-child': {},
            '& > div:last-child': {fontSize: '17px', fontWeight: '600'},
            '&:last-child': {
                textAlign: 'right'
            }
        },
        listRow: {
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

    const clientTransactionDetail = (
        <span>a</span>
    )

    const clientTransactionList = _.map(_.get(listData, 'data'), (item) => {
        const ZERO = 0
        const id = _.get(item, 'id')
        const client = _.get(item, ['client', 'name'])
        const user = _.get(item, 'user')
        const userName = user ? _.get(user, 'firstName') + ' ' + _.get(user, 'secondName') : 'Неизвестно'
        const type = _.get(item, 'amount') || 'N/A'
        const amount = _.toNumber(_.get(item, 'amount'))
        const createdDate = dateTimeFormat(_.get(item, 'createdDate'))
        const currency = _.get(item, ['currency', 'name'])
        const currencyID = _.get(item, ['currency', 'id'])
        const internal = _.toNumber(_.get(item, 'internal'))
        const customRate = _.get(item, 'customRate') ? _.toNumber(_.get(item, 'customRate')) : _.toInteger(amount / internal)
        const confirmation = _.get(item, 'clientConfirmation')
        const statusIcon = (status) => {
            switch (status) {
                case CONFIRMED: return <ToolTip position={'right'} text={'Подтвержден'}>
                    <Accepted color={'#81c784'}/>
                </ToolTip>
                case REJECTED: return <ToolTip position={'right'} text={'Отменен'}>
                    <Rejected color={'#e57373'}/>
                </ToolTip>
                case REQUESTED: return <ToolTip position={'right'} text={'В ожидании'}>
                    <Requested color={'#f0ad4e'}/>
                </ToolTip>
                case AUTO: return <ToolTip position={'right'} text={'Автоматически подтвержден системой'}>
                    <AutoAccepted color={'#12aaeb'}/>
                </ToolTip>
                default: return null
            }
        }
        return (
            <Row key={id} className={classes.listRow}>
                <Col xs={1}>{statusIcon(confirmation)}</Col>
                <Col xs={3}>{client}</Col>
                <Col xs={3}>{userName}</Col>
                <Col xs={2}>{createdDate}</Col>
                <Col style={{textAlign: 'right'}} className={type >= ZERO ? classes.green : classes.red} xs={2}>
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
                        <ToolTip position={'left'} text={'Переотправить запрос'}>
                            <IconButton
                                onTouchTap={() => { resendDialog.handleOpenResendDialog(id) }}
                                style={iconStyle.button}
                                iconStyle={iconStyle.icon}>
                                <ResendIcon/>
                            </IconButton>
                        </ToolTip>}
                        {isAdmin &&
                        <ToolTip position={'left'} text={'Удалить транзакцию'}>
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
                <div className={classes.summary}>
                    <div>Сумма принятых оплат</div>
                    <div>{numberFormat('145323', primaryCurrency)}</div>
                </div>
                <div className={classes.summary}>
                    <div>Сумма отклоненных оплат</div>
                    <div>{numberFormat('22451', primaryCurrency)}</div>
                </div>
                <div className={classes.summary}>
                    <div>Сумма ожидаемых оплат</div>
                    <div>{numberFormat('86541', primaryCurrency)}</div>
                </div>
                <div className={classes.summary}>
                    <div>Сумма автоматически принятых оплат</div>
                    <div>{numberFormat('6548', primaryCurrency)}</div>
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
                message={'Транзакция №' + transactionID}
                onClose={confirmDialog.handleCloseConfirmDialog}
                onSubmit={confirmDialog.handleSubmitConfirmDialog}
                open={confirmDialog.open}
            />
            <ConfirmDialog
                type="submit"
                message={'Транзакция №' + transactionID}
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
