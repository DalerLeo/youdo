import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import * as ROUTES from '../../constants/routes'
import GridList from '../GridList'
import Container from '../Container'
import ClientBalanceFilterForm from './ClientBalanceFilterForm'
import ClientBalanceCreateDialog from './ClientBalanceInfoDialog'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import numberFormat from '../../helpers/numberFormat'
import getConfig from '../../helpers/getConfig'

const listHeader = [
    {
        sorting: true,
        name: 'client',
        title: 'Клиент',
        xs: 2
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
        xs: 2
    },
    {
        sorting: true,
        alignRight: true,
        name: 'cashBalance',
        title: 'Баланс нал',
        xs: 2
    },
    {
        sorting: true,
        alignRight: true,
        name: 'transferBalance',
        title: 'Баланс переч.',
        xs: 2
    },
    {
        sorting: true,
        alignRight: true,
        name: 'balance',
        title: 'Баланс',
        xs: 2
    }
]

const enhance = compose(
    injectSheet({
        rightAlign: {
            textAlign: 'right'
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

const ClientBalanceGridList = enhance((props) => {
    const {
        classes,
        filter,
        filterDialog,
        filterItem,
        infoDialog,
        listData,
        detailData
    } = props
    const ZERO = 0
    const ONE = 1
    const clientBalanceFilterDialog = (
        <ClientBalanceFilterForm
            initialValues={filterDialog.initialValues}
            filter={filter}
            filterDialog={filterDialog}
        />
    )

    const clientBalanceDetail = (
        <span>a</span>
    )
    const clientBalanceList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const createdDate = moment(_.get(item, 'createdDate')).format('DD.MM.YYYY')
        const transferBalance = _.toNumber(_.get(item, 'transferBalance'))
        const cashBalance = _.toNumber(_.get(item, 'cashBalance'))
        const balance = transferBalance + cashBalance
        const currentCurrency = getConfig('PRIMARY_CURRENCY')
        const orders = numberFormat(_.get(item, 'orders'))
        const clientName = _.get(item, 'name')

        return (
            <Row key={id}>
                <Col xs={2}>{clientName}</Col>
                <Col xs={2}>{createdDate}</Col>
                <Col xs={2}>{orders}</Col>
                <Col xs={2}
                     className={classes.rightAlign}>
                    <span
                        className={cashBalance >= ZERO ? classes.green : classes.red}
                        onClick={() => { infoDialog.handleOpenInfoDialog(id, ZERO) }}>
                        {numberFormat(cashBalance, currentCurrency)}
                    </span>
                </Col>
                <Col xs={2}
                     className={classes.rightAlign}>
                    <span
                        className={transferBalance >= ZERO ? classes.green : classes.red}
                        onClick={() => { infoDialog.handleOpenInfoDialog(id, ONE) }}>
                        {numberFormat(transferBalance, currentCurrency)}
                    </span>
                </Col>
                <Col xs={2}
                     className={classes.rightAlign}>
                    <span onClick={() => { infoDialog.handleOpenInfoDialog(id) }}>
                        {numberFormat(balance)}
                    </span>
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
    const balance = _.get(infoDialog, 'type')
        ? (_.get(infoDialog, 'type') === ZERO
            ? _.get(client, 'cashBalance')
            : _.get(client, 'transferBalance'))
        : _.toNumber(_.get(client, 'cashBalance')) + _.toNumber(_.get(client, 'transferBalance'))
    const paymentType = _.get(infoDialog, 'type') === ZERO ? 'Нал' : 'Переч.'
    return (
        <Container>
            <SubMenu url={ROUTES.CLIENT_BALANCE_LIST_URL}/>

            <GridList
                filter={filter}
                list={list}
                detail={clientBalanceDetail}
                filterDialog={clientBalanceFilterDialog}
                loading={_.get(listData, 'listLoading')}
            />

            <ClientBalanceCreateDialog
                open={infoDialog.openInfoDialog}
                detailData={detailData}
                onClose={infoDialog.handleCloseInfoDialog}
                filterItem={filterItem}
                name={_.get(client, 'name')}
                balance={balance}
                paymentType={paymentType}
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
    filterDialog: PropTypes.shape({
        initialValues: PropTypes.object,
        filterLoading: PropTypes.bool,
        openFilterDialog: PropTypes.bool.isRequired,
        handleOpenFilterDialog: PropTypes.func.isRequired,
        handleCloseFilterDialog: PropTypes.func.isRequired,
        handleSubmitFilterDialog: PropTypes.func.isRequired
    }).isRequired
}

export default ClientBalanceGridList
