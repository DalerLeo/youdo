import _ from 'lodash'
import sprintf from 'sprintf'
import injectSheet from 'react-jss'
import React from 'react'
import {compose, withState} from 'recompose'
import PropTypes from 'prop-types'
import CircularProgress from 'material-ui/CircularProgress'
import {Row, Col} from 'react-flexbox-grid'
import StatDebtorsFilterForm from './StatDebtorsFilterForm'
import GridList from '../GridList'
import Container from '../Container'
import StatDebtorsOrderDetails from './StatDebtorsOrderDetails'
import ConfirmDialog from '../ConfirmDialog'
import SubMenu from '../SubMenu'
import * as ROUTES from '../../constants/routes'
import StatDebtorsCreateDialog from './StatDebtorsCreateDialog'
import MainStyles from '../Styles/MainStyles'
import {Link} from 'react-router'
import numberFormat from '../../helpers/numberFormat'
import {PRIMARY_CURRENCY_NAME} from '../../constants/primaryCurrency'

const listHeaderClient = [
    {
        sorting: true,
        name: 'name',
        xs: 5,
        title: 'Клиент'
    },
    {
        sorting: true,
        name: 'щквукы',
        xs: 2,
        title: 'Заказы'
    },
    {
        sorting: true,
        name: 'sum',
        xs: 3,
        title: 'Сумма долга'
    },
    {
        sorting: true,
        xs: 2,
        name: 'time',
        title: 'Прошло дней'
    }
]

const listHeaderOrder = [
    {
        sorting: true,
        name: 'orderNumber',
        xs: 1,
        title: 'Заказ №'
    },
    {
        sorting: true,
        name: 'name',
        xs: 4,
        title: 'Наименование'
    },
    {
        sorting: true,
        name: 'sum1',
        xs: 2,
        title: 'Дата доставки'
    },
    {
        sorting: true,
        name: 'sum1',
        xs: 2,
        title: 'Сумма заказа'
    },
    {
        sorting: true,
        name: 'sum2',
        xs: 3,
        title: 'Сумма долга'
    }
]

const enhance = compose(
    injectSheet(_.merge(MainStyles, {
        infoBlock: {
            width: '25%',
            display: 'inline-block',
            color: '#999',
            fontWeight: '400',
            fontSize: '13px',
            lineHeight: '1.3',
            borderLeft: '1px solid #efefef',
            padding: '12px 15px 12px 15px',
            alignItems: 'center',
            '& span': {
                color: '#333',
                fontWeight: '700',
                fontSize: '24px !important'
            },
            '&:first-child': {
                border: 'none'
            }
        },
        typeListStock: {
            width: '100px',
            height: 'calc(100% + 16px)',
            marginTop: '-8px',
            float: 'left',
            display: 'flex',
            alignItems: 'center',
            textAlign: 'center',
            borderRight: '1px solid #fff',
            backgroundColor: '#eceff5',
            '& a': {
                display: 'block',
                width: '100%',
                fontWeight: '600'
            },
            '& a.active': {
                color: '#333',
                cursor: 'text'
            },
            '&:last-child': {
                border: 'none'
            },
            '&:first-child': {

                marginLeft: '-38px'
            }
        },
        titleLabel: {
            fontSize: '18px',
            color: '#333',
            fontWeight: '700'
        },
        bodyTitle: {
            fontWeight: '600',
            marginBottom: '10px'
        },
        loader: {
            background: '#fff',
            height: '400px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        subTitle: {
            fontWeight: '600',
            '& div': {
                display: 'inline-block'
            },
            '& div:last-child': {
                marginLeft: '30px'
            },
            '& span': {
                fontWeight: '800'
            }
        }
    })),
    withState('showByClient', 'setShowByClient', true)
)

const StatDebtorsGridList = enhance((props) => {
    const {
        filter,
        createDialog,
        sumData,
        updateDialog,
        confirmDialog,
        filterDialog,
        listData,
        setShowByClient,
        showByClient,
        detailData,
        classes,
        orderData
    } = props

    const actions = (
        <div>

        </div>
    )

    const orderListHeader = (
        <Row style={{padding: '20px 30px 10px', fontWeight: '600'}}>
            <Col xs={2}>Заказ №</Col>
            <Col xs={2}>Кол-во товаров</Col>
            <Col xs={2}>Дата доставки</Col>
            <Col xs={3}>Сумма заказа</Col>
            <Col xs={3}>Долг</Col>
        </Row>
    )

    const orderList = _.map(_.get(orderData, ['orderList', 'results']), (item) => {
        const id = _.get(item, 'id')
        const dateDelivery = _.get(item, 'dateDelivery') || 'N/A'
        const totalPrice = numberFormat(_.get(item, 'totalPrice'), 'SUM')
        return (
            <div className="dottedListSpec">
                <Row key={id} style={{padding: '0 30px'}}>
                    <Col xs={2}><a onClick={ () => { orderData.handleOrderClick(id) }} >{id}</a></Col>
                    <Col xs={2}> 10 </Col>
                    <Col xs={2}>{dateDelivery}</Col>
                    <Col xs={3}>{totalPrice}</Col>
                    <Col xs={3}>100 000 UZS</Col>
                </Row>
            </div>
        )
    })

    const statDebtorsFilterDialog = (
        <StatDebtorsFilterForm
            initialValues={filterDialog.initialValues}
            filter={filter}
            filterDialog={filterDialog}
        />
    )
    const statDebtorsList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, ['client', 'id'])
        const name = _.get(item, ['client', 'name'])
        const order = numberFormat(_.get(item, ['orders']), 'заказа')
        const debt = numberFormat(_.get(item, ['totalBalance']), PRIMARY_CURRENCY_NAME)
        const time = numberFormat(_.get(item, ['expiredDays']), 'дней')
        return (
            <Row key={id}>
                <Col xs={5}>
                    <Link to={{
                        pathname: sprintf(ROUTES.STATDEBTORS_ITEM_PATH, id),
                        query: filter.getParams()
                    }}>{name}</Link>
                </Col>
                <Col xs={2}>{order}</Col>
                <Col xs={3}>{debt}</Col>
                <Col xs={2}>{time}</Col>
            </Row>
        )
    })
    const statDebtorsListByOrder = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, ['client', 'id'])
        const name = 'Наименование фирмы клиента'
        const order = '0254'
        const date = '22 Апр, 2017'
        const orderSum = '3 000 000 UZS'
        const debt = '2 000 000 UZS'
        return (
            <Row key={id}>
                <Col xs={1}>{order}</Col>
                <Col xs={4}>
                    <Link to={{
                        pathname: sprintf(ROUTES.STATDEBTORS_ITEM_PATH, id),
                        query: filter.getParams()
                    }}>{name}</Link>
                </Col>
                <Col xs={2}>{date}</Col>
                <Col xs={2}>{orderSum}</Col>
                <Col xs={3}>{debt}</Col>
            </Row>
        )
    })

    const statDebtorsDetail = (
        <div key={_.get(detailData, 'id')} style={{width: '100%'}}>
            <div className={classes.title} style={{width: 'initial'}}>
                <div className={classes.titleLabel}>sdsdfsdf</div>
                <div className={classes.subTitle}>
                    <div>
                        Прошло: <span>25 дней</span>
                    </div>
                    <div>
                        Сумма долга: <span>5 555 005 UZS</span>
                    </div>
                </div>
            </div>
            { _.get(orderData, 'orderLoading')
                ? <CircularProgress size={100} thickness={6}/>
                : <div style={{paddingBottom: '20px'}}>
                    <div>{orderListHeader}</div>
                    {orderList}
                </div>
            }
        </div>
    )
    const list = (showByClient) ? {
        header: listHeaderClient,
        list: statDebtorsList,
        loading: _.get(listData, 'listLoading')
    } : {
        header: listHeaderOrder,
        list: statDebtorsListByOrder,
        loading: _.get(listData, 'listLoading')
    }

    const totalDebtors = numberFormat(_.get(sumData, ['data', 'debtors']))
    const totalOrders = numberFormat(_.get(sumData, ['data', 'orders']))
    const totalBalance = numberFormat(_.get(sumData, ['data', 'totalBalance']), PRIMARY_CURRENCY_NAME)

    return (
        <Container>
            <SubMenu url={ROUTES.STATDEBTORS_LIST_URL}/>
            <Row style={{
                margin: '0 0 20px',
                padding: '8px 30px',
                background: '#fff',
                boxShadow: 'rgba(0, 0, 0, 0.1) 0 3px 10px'
            }}>
                <Col xs={3}>
                    <div className={classes.typeListStock}>
                        <a onClick={() => { setShowByClient(true) }} className={showByClient && 'active'}>Вид<br/>по клиенту</a>
                    </div>
                    <div className={classes.typeListStock}>
                        <a onClick={() => { setShowByClient(false) }} className={!showByClient && 'active'}>Вид<br/>по заказу</a>
                    </div>
                </Col>
                <Col xs={9} style={{textAlign: 'right'}}>
                    <div className={classes.infoBlock}>
                        Всего должников:<br />
                        <span>{totalDebtors}</span>
                    </div>
                    <div className={classes.infoBlock}>
                        Всего заказов:<br />
                        <span>{totalOrders}</span>
                    </div>
                    <div className={classes.infoBlock}>
                        Общий долг:<br />
                        <span>{totalBalance}</span>
                    </div>
                </Col>
            </Row>

            <GridList
                filter={filter}
                filterDialog={statDebtorsFilterDialog}
                list={list}
                detail={statDebtorsDetail}
                actionsDialog={actions}
            />
            <StatDebtorsCreateDialog
                isUpdate={true}
                initialValues={updateDialog.initialValues}
                open={updateDialog.openUpdateDialog}
                loading={updateDialog.updateLoading}
                onClose={updateDialog.handleCloseUpdateDialog}
                onSubmit={updateDialog.handleSubmitUpdateDialog}
            />

            <StatDebtorsCreateDialog
                open={createDialog.openCreateDialog}
                loading={createDialog.createLoading}
                onClose={createDialog.handleCloseCreateDialog}
                onSubmit={createDialog.handleSubmitCreateDialog}
            />

            <StatDebtorsOrderDetails
                open={_.get(orderData, 'orderDetailOpen')}
                data={_.get(orderData, 'orderDetail') || {}}
                loading={_.get(orderData, 'detailLoading')}
                handleOrderClick={orderData.handleOrderClick}
                close={orderData.handleOrderDetailClose}
            />

            {detailData.data && <ConfirmDialog
                type="delete"
                message="adfdasf"
                onClose={confirmDialog.handleCloseConfirmDialog}
                onSubmit={confirmDialog.handleSendConfirmDialog}
                open={confirmDialog.openConfirmDialog}
            />}
        </Container>
    )
})

StatDebtorsGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    createDialog: PropTypes.shape({
        createLoading: PropTypes.bool.isRequired,
        openCreateDialog: PropTypes.bool.isRequired,
        handleOpenCreateDialog: PropTypes.func.isRequired,
        handleCloseCreateDialog: PropTypes.func.isRequired,
        handleSubmitCreateDialog: PropTypes.func.isRequired
    }).isRequired,
    confirmDialog: PropTypes.shape({
        openConfirmDialog: PropTypes.bool.isRequired,
        handleOpenConfirmDialog: PropTypes.func.isRequired,
        handleCloseConfirmDialog: PropTypes.func.isRequired,
        handleSendConfirmDialog: PropTypes.func.isRequired
    }).isRequired,
    updateDialog: PropTypes.shape({
        updateLoading: PropTypes.bool.isRequired,
        openUpdateDialog: PropTypes.bool.isRequired,
        handleOpenUpdateDialog: PropTypes.func.isRequired,
        handleCloseUpdateDialog: PropTypes.func.isRequired,
        handleSubmitUpdateDialog: PropTypes.func.isRequired
    }).isRequired,
    orderData: PropTypes.object
}

export default StatDebtorsGridList
