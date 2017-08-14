import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import * as ROUTES from '../../constants/routes'
import GridList from '../GridList'
import Container from '../Container'
import ClientBalanceInfoDialog from './ClientBalanceInfoDialog'
import ClientBalanceCreateDialog from './ClientBalanceCreateDialog'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import numberFormat from '../../helpers/numberFormat'
import getConfig from '../../helpers/getConfig'
import IconButton from 'material-ui/IconButton'
import Cancel from 'material-ui/svg-icons/content/remove-circle'

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
        name: 'created_date',
        title: 'Дата создания',
        xs: 2
    },
    {
        sorting: true,
        name: 'number_of_orders',
        title: 'Кол-во заказов',
        xs: 1
    },
    {
        sorting: true,
        alignRight: true,
        name: 'cashBalance',
        title: 'Баланс косметика',
        xs: 2
    },
    {
        sorting: true,
        alignRight: true,
        name: 'balance',
        title: 'Баланс шампунь',
        xs: 2
    },
    {
        sorting: true,
        alignRight: true,
        title: 'Списать',
        xs: 2
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
        }
    })
)
const iconStyle = {
    icon: {
        color: '#f44336',
        width: 24,
        height: 24
    },
    button: {
        width: 48,
        height: 48
    }
}
const ClientBalanceGridList = enhance((props) => {
    const {
        classes,
        filter,
        createDialog,
        filterItem,
        infoDialog,
        listData,
        detailData
    } = props

    const clientBalanceDetail = (
        <span>a</span>
    )
    const clientBalanceList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const createdDate = moment(_.get(item, 'createdDate')).format('DD.MM.YYYY')
        const cosmeticsBalance = _.toNumber(_.get(item, 'cosmeticsBalance'))
        const shampooBalance = _.toNumber(_.get(item, 'shampooBalance'))
        const currentCurrency = getConfig('PRIMARY_CURRENCY')
        const orders = numberFormat(_.get(item, 'orders'))
        const clientName = _.get(item, 'name')

        return (
            <Row key={id} className={classes.listRow}>
                <Col xs={3}>{clientName}</Col>

                <Col xs={2}>{createdDate}</Col>
                <Col xs={1}>{orders}</Col>
                <Col xs={2}
                     className={classes.rightAlign}>
                    <span onClick={() => { infoDialog.handleOpenInfoDialog(id, DIVISION.KOSMETIKA) }}>
                        {numberFormat(cosmeticsBalance, currentCurrency)}
                    </span>
                </Col>
                <Col xs={2}
                     className={classes.rightAlign}>
                    <span onClick={() => { infoDialog.handleOpenInfoDialog(id, DIVISION.SHAMPUN) }}>
                        {numberFormat(shampooBalance, currentCurrency)}
                    </span>
                </Col>
                <Col xs={2} className={classes.rightAlign}>
                    <IconButton
                        iconStyle={iconStyle.icon}
                        style={iconStyle.button}
                        touch={true}
                        onTouchTap={() => { createDialog.handleOpenCreateDialog(id) }}>
                        <Cancel />
                    </IconButton>
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
    const paymentType = _.get(infoDialog, 'division') === DIVISION.SHAMPUN ? 'шамнунь' : 'косметика'
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
    }).isRequired
}

export default ClientBalanceGridList
