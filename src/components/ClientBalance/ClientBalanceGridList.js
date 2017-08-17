import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import * as ROUTES from '../../constants/routes'
import GridList from '../GridList'
import Container from '../Container'
import ClientBalanceInfoDialog from './ClientBalanceInfoDialog'
import ClientBalanceCreateDialog from './ClientBalanceCreateDialog'
import ClientBalanceReturnDialog from './ClientBalanceReturnDialog'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import numberFormat from '../../helpers/numberFormat'
import getConfig from '../../helpers/getConfig'
import IconButton from 'material-ui/IconButton'
import Cancel from 'material-ui/svg-icons/content/remove-circle'
import ReturnIcon from 'material-ui/svg-icons/content/reply'
import Tooltip from '../ToolTip'

const DIVISION = {
    SHAMPUN: 2,
    KOSMETIKA: 1
}

const listHeader = [
    {
        sorting: true,
        name: 'client',
        title: 'Клиент',
        xs: 3
    },
    {
        sorting: true,
        name: 'orders',
        title: 'Кол-во заказов',
        xs: 2
    },
    {
        sorting: true,
        name: 'cosmetics_balance',
        title: 'Баланс косметика',
        xs: 2
    },
    {
        sorting: true,
        name: 'shampoo_balance_nal',
        title: 'Баланс шампунь нал.',
        xs: 2
    },
    {
        sorting: true,
        name: 'created_date_perech',
        title: 'Баланс шампунь переч.',
        xs: 2
    },
    {
        sorting: false,
        alignRight: true,
        title: '',
        xs: 1
    }
]

const enhance = compose(
    injectSheet({
        listRow: {
            margin: '0 -30px !important',
            padding: '0 30px',
            width: 'auto !important',
            '&:hover button': {
                opacity: '1'
            }
        },
        rightAlign: {
            textAlign: 'right',
            '& button': {
                opacity: '0'
            },
            '& span': {
                cursor: 'pointer'
            }
        },
        red: {
            color: '#e27676',
            cursor: 'pointer'
        },
        green: {
            color: '#92ce95',
            cursor: 'pointer'
        },
        balance: {
            '& span': {
                cursor: 'pointer'
            }
        }
    })
)
const iconStyle = {
    icon: {
        width: 24,
        height: 24
    },
    button: {
        width: 48,
        height: 48
    }
}

const MINUS_ONE = -1
const ClientBalanceGridList = enhance((props) => {
    const {
        classes,
        filter,
        createDialog,
        filterItem,
        infoDialog,
        listData,
        detailData,
        clientReturnDialog
    } = props

    const clientBalanceDetail = (
        <span>a</span>
    )
    const clientBalanceList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const cosmeticsBalance = _.toNumber(_.get(item, 'cosmeticsBalance'))
        const shampooBalance = _.toNumber(_.get(item, 'shampooBalance'))
        const currentCurrency = getConfig('PRIMARY_CURRENCY')
        const orders = numberFormat(_.get(item, 'orders'))
        const clientName = _.get(item, 'name')

        return (
            <Row key={id} className={classes.listRow}>
                <Col xs={3}>{clientName}</Col>
                <Col xs={2}>{orders}</Col>
                <Col xs={2} className={classes.balance}>
                    <span onClick={() => {
                        infoDialog.handleOpenInfoDialog(id, DIVISION.KOSMETIKA)
                    }}>
                        {numberFormat(cosmeticsBalance, currentCurrency)}
                    </span>
                </Col>
                <Col xs={2} className={classes.balance}>
                    <span onClick={() => {
                        infoDialog.handleOpenInfoDialog(id, DIVISION.SHAMPUN)
                    }}>
                        {numberFormat(shampooBalance, currentCurrency)}
                    </span>
                </Col>
                <Col xs={2} className={classes.balance}>
                    <span onClick={() => {
                        infoDialog.handleOpenInfoDialog(id, DIVISION.SHAMPUN)
                    }}>
                        {numberFormat(shampooBalance, currentCurrency)}
                    </span>
                </Col>
                <Col xs={1} className={classes.rightAlign}>
                    <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                        <Tooltip position="bottom" text="Возврат с клиента">
                            <IconButton
                                iconStyle={iconStyle.icon}
                                style={iconStyle.button}
                                touch={true}
                                onTouchTap={() => {
                                    clientReturnDialog.handleOpenClientReturnDialog(id)
                                }}>
                                <ReturnIcon/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip position="bottom" text="Списать">
                            <IconButton
                                iconStyle={iconStyle.icon}
                                style={iconStyle.button}
                                touch={true}
                                onTouchTap={() => {
                                    createDialog.handleOpenCreateDialog(id)
                                }}>
                                <Cancel color='#f44336'/>
                            </IconButton>
                        </Tooltip>
                    </div>
                </Col>
            </Row>
        )
    })

    const list = {
        header: listHeader,
        list: clientBalanceList,
        loading: _.get(listData, 'listLoading')
    }

    const client = _.find(_.get(listData, 'data'), {'id': _.get(detailData, 'id')})
    const balance = _.get(infoDialog, 'division') === DIVISION.SHAMPUN
        ? _.get(client, 'shampooBalance')
        : _.get(client, 'cosmeticsBalance')
    const paymentType = _.get(infoDialog, 'division') === DIVISION.SHAMPUN ? 'шамнунь' : 'косметика'
    const clientName = _.find(_.get(listData, 'data'), {'id': _.toInteger(_.get(clientReturnDialog, 'openClientReturnDialog'))})
    return (
        <Container>
            <SubMenu url={ROUTES.CLIENT_BALANCE_LIST_URL}/>

            <GridList
                filter={filter}
                list={list}
                detail={clientBalanceDetail}
                loading={_.get(listData, 'listLoading')}
            />

            <ClientBalanceInfoDialog
                open={infoDialog.openInfoDialog}
                detailData={detailData}
                onClose={infoDialog.handleCloseInfoDialog}
                filterItem={filterItem}
                name={_.get(client, 'name')}
                paymentType={paymentType}
                balance={balance}
            />
            <ClientBalanceCreateDialog
                open={createDialog.openCreateDialog}
                listData={listData}
                detailData={detailData}
                loading={createDialog.createLoading}
                onClose={createDialog.handleCloseCreateDialog}
                onSubmit={createDialog.handleSubmitCreateDialog}
                name={_.get(client, 'name')}
            />
            <ClientBalanceReturnDialog
                name={_.get(clientName, 'name')}
                open={_.get(clientReturnDialog, 'openClientReturnDialog') && _.toInteger(_.get(clientReturnDialog, 'openClientReturnDialog')) !== MINUS_ONE}
                onClose={clientReturnDialog.handleCloseClientReturnDialog}
                onSubmit={clientReturnDialog.handleSubmitClientReturnDialog}
            />
        </Container>
    )
})

ClientBalanceGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    infoDialog: PropTypes.shape({
        updateLoading: PropTypes.bool.isRequired,
        openInfoDialog: PropTypes.bool.isRequired,
        handleOpenInfoDialog: PropTypes.func.isRequired,
        handleCloseInfoDialog: PropTypes.func.isRequired
    }).isRequired,
    createDialog: PropTypes.shape({
        createLoading: PropTypes.bool.isRequired,
        openCreateDialog: PropTypes.bool.isRequired,
        handleOpenCreateDialog: PropTypes.func.isRequired,
        handleCloseCreateDialog: PropTypes.func.isRequired,
        handleSubmitCreateDialog: PropTypes.func.isRequired
    }).isRequired,
    clientReturnDialog: PropTypes.shape({
        openClientReturnDialog: PropTypes.string.isRequired,
        handleOpenClientReturnDialog: PropTypes.func.isRequired,
        handleCloseClientReturnDialog: PropTypes.func.isRequired,
        handleSubmitClientReturnDialog: PropTypes.func.isRequired
    })
}

export default ClientBalanceGridList
