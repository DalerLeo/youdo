import _ from 'lodash'
import sprintf from 'sprintf'
import injectSheet from 'react-jss'
import React from 'react'
import moment from 'moment'
import {compose} from 'recompose'
import PropTypes from 'prop-types'
import IconButton from 'material-ui/IconButton'
import MapsLocalShipping from 'material-ui/svg-icons/maps/local-shipping'
import Home from 'material-ui/svg-icons/action/home'
import AccountBalanceWallet from 'material-ui/svg-icons/action/account-balance-wallet'
import CircularProgress from 'material-ui/CircularProgress'
import Dialog from 'material-ui/Dialog'
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

const listHeader = [
    {
        sorting: true,
        name: 'name',
        xs: 6,
        title: 'Клиент'
    },
    {
        sorting: true,
        name: 'sum',
        xs: 3,
        title: 'Сумма долга'
    },
    {
        sorting: true,
        xs: 3,
        name: 'time',
        title: 'Прошло дней'
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
        }
    })),
)

const StatDebtorsGridList = enhance((props) => {
    const {
        filter,
        createDialog,
        updateDialog,
        confirmDialog,
        filterDialog,
        listData,
        detailData,
        classes,
        orderData
    } = props

    const actions = (
        <div>

        </div>
    )

    const iconStyle = {
        icon: {
            color: '#666',
            width: 20,
            height: 20
        },
        button: {
            width: 48,
            height: 48,
            padding: 0
        }
    }
    const tooltipPosition = 'bottom-center'

    const orderListHeader = (
        <Row>
            <Col xs={1}>Заказ №</Col>
            <Col xs={2}>Клиент</Col>
            <Col xs={2}>Инициатор</Col>
            <Col xs={2}>Дата доставки</Col>
            <Col xs={2}>Сумма заказа</Col>
            <Col xs={2}>Дата создания</Col>
            <Col xs={2}>Статус</Col>
        </Row>
    )

    const orderList = _.map(_.get(orderData, ['orderList', 'results']), (item) => {
        const id = _.get(item, 'id')
        const client = _.get(item, ['client', 'name'])
        const user = _.get(item, ['user', 'firstName']) + _.get(item, ['user', 'secondName']) || 'N/A'
        const dateDelivery = _.get(item, 'dateDelivery') || 'N/A'
        const createdDate = moment(_.get(item, 'createdDate')).format('DD.MM.YYYY HH:MM')
        const totalBalance = _.toInteger(_.get(item, 'totalBalance'))
        const totalPrice = numberFormat(_.get(item, 'totalPrice'), 'SUM')
        const ZERO = 0
        return (
            <Row key={id}>
                <Col xs={1}>{id}</Col>
                <Col xs={2} onTouchTap={ () => { orderData.handleOrderClick(id) }}>
                    {client}
                </Col>
                <Col xs={2}>{user}</Col>
                <Col xs={2}>{dateDelivery}</Col>
                <Col xs={1}>{totalPrice}</Col>
                <Col xs={2} style={{textAlign: 'right'}}>{createdDate}</Col>
                <Col xs={2} style={{textAlign: 'right'}}>
                    <IconButton
                        iconStyle={iconStyle.icon}
                        style={iconStyle.button}
                        touch={true}
                        tooltipPosition={tooltipPosition}
                        tooltip="Есть на складе">
                        <Home color="#4db6ac"/>
                    </IconButton>
                    <IconButton
                        iconStyle={iconStyle.icon}
                        style={iconStyle.button}
                        touch={true}
                        tooltipPosition={tooltipPosition}
                        tooltip="Есть долг">
                        <AccountBalanceWallet color={totalBalance > ZERO ? '#e57373' : '#4db6ac'}/>
                    </IconButton>
                    <IconButton
                        iconStyle={iconStyle.icon}
                        style={iconStyle.button}
                        touch={true}
                        tooltipPosition={tooltipPosition}
                        tooltip="Не забрали товар">
                        <MapsLocalShipping />
                    </IconButton>

                </Col>
            </Row>
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
        const id = _.get(item, 'id')
        const name = 'Наименование фирмы клиента или его имя'
        const debt = '3 000 000 UZS'
        const time = '25 дней'
        return (
            <Row key={id}>
                <Col xs={6}>
                    <Link to={{
                        pathname: sprintf(ROUTES.STATDEBTORS_ITEM_PATH, id),
                        query: filter.getParams()
                    }}>{name}</Link>
                </Col>
                <Col xs={3}>{debt}</Col>
                <Col xs={3}>{time}</Col>
            </Row>
        )
    })

    const statDebtorsDetail = (
        <div key={_.get(detailData, 'id')}>
            { _.get(orderData, 'orderLoading')
                ? <CircularProgress size={100} thickness={6}/>
                : <div>
                    <div>{orderListHeader}</div>
                    {orderList}
                </div>
            }
        </div>
    )
    const list = {
        header: listHeader,
        list: statDebtorsList,
        loading: _.get(listData, 'listLoading')
    }
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
                    &nbsp;
                </Col>
                <Col xs={9} style={{textAlign: 'right'}}>
                    <div className={classes.infoBlock}>
                        Всего должников:<br />
                        <span>100</span>
                    </div>
                    <div className={classes.infoBlock}>
                        Общий долг:<br />
                        <span>1 000 000 UZS</span>
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

            <Dialog
                open={_.get(orderData, 'orderDetailOpen')}
                modal={true}
                onRequestClose={orderData.handleOrderDetailClose}
                bodyClassName={classes.popUp}
                autoScrollBodyContent={true}>
                <StatDebtorsOrderDetails
                    key={_.get(orderData, 'id')}
                    data={_.get(orderData, 'orderDetail') || {}}
                    loading={_.get(orderData, 'detailLoading')}
                    handleOrderClick={orderData.handleOrderClick}
                    close={orderData.handleOrderDetailClose}
                />
            </Dialog>

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
