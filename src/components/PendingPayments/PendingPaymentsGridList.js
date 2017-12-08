import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import * as ROUTES from '../../constants/routes'
import GridList from '../GridList'
import Container from '../Container'
import PendingPaymentsFilterForm from './PendingPaymentsFilterForm'
import PendingPaymentsCreateDialog from './PendingPaymentsCreateDialog'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import AddPayment from 'material-ui/svg-icons/av/playlist-add-check'
import numberFormat from '../../helpers/numberFormat'
import dateTimeFormat from '../../helpers/dateTimeFormat'

const listHeader = [
    {
        sorting: true,
        name: 'id',
        title: '№ зак.',
        xs: 1
    },
    {
        sorting: false,
        name: 'clientName',
        title: 'Клиент',
        xs: 2
    },
    {
        sorting: false,
        name: 'marketName',
        title: 'Магазин',
        xs: 2
    },
    {
        sorting: true,
        name: 'created_date',
        title: 'Дата созд.',
        xs: 2
    },
    {
        sorting: false,
        name: 'paymentType',
        title: 'Тип опл.',
        xs: 1
    },
    {
        sorting: true,
        name: 'total_price',
        alignRight: true,
        title: 'Сумма заказа',
        xs: 2
    },
    {
        sorting: true,
        name: 'totalBalance',
        alignRight: true,
        title: 'Остаток',
        xs: 1
    },
    {
        sorting: false,
        xs: 1
    }
]
const listHeaderHasMarket = [
    {
        sorting: true,
        name: 'id',
        title: '№ зак.',
        xs: 1
    },
    {
        sorting: false,
        name: 'clientName',
        title: 'Клиент',
        xs: 3
    },
    {
        sorting: true,
        name: 'created_date',
        title: 'Дата созд.',
        xs: 2
    },
    {
        sorting: false,
        name: 'paymentType',
        title: 'Тип опл.',
        xs: 2
    },
    {
        sorting: true,
        name: 'total_price',
        alignRight: true,
        title: 'Сумма заказа',
        xs: 2
    },
    {
        sorting: true,
        name: 'totalBalance',
        alignRight: true,
        title: 'Остаток',
        xs: 1
    },
    {
        sorting: false,
        xs: 1
    }
]
const enhance = compose(
    injectSheet({
        addButton: {
            '& button': {
                backgroundColor: '#275482 !important'
            }
        },
        addButtonWrapper: {
            position: 'absolute',
            top: '10px',
            right: '0',
            marginBottom: '0px'
        }
    })
)

const iconStyle = {
    icon: {
        color: '#12aaeb',
        width: 24,
        height: 24
    },
    button: {
        width: 48,
        height: 48,
        padding: 0
    }
}
const ONE = 1
const TWO = 2
const THREE = 3
const PendingPaymentsGridList = enhance((props) => {
    const {
        filter,
        updateDialog,
        filterDialog,
        listData,
        detailData,
        convert,
        hasMarket
    } = props
    const pendingPaymentsFilterDialog = (
        <PendingPaymentsFilterForm
            initialValues={filterDialog.initialValues}
            filter={filter}
            filterDialog={filterDialog}
            hasMarket={hasMarket}
        />
    )
    const pendingPaymentsDetail = (
        <span>a</span>
    )
    const pendingPaymentsList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const client = _.get(item, 'client')
        const market = _.get(item, ['market', 'name'])
        const currency = _.get(item, ['currency', 'name'])
        const paymentType = _.get(item, 'paymentType') === 'cash' ? 'наличный' : 'банковский счет'
        const clientName = _.get(client, 'name')
        const createdDate = dateTimeFormat(_.get(item, 'createdDate'))
        const totalPrice = numberFormat(_.get(item, 'totalPrice'), currency)
        const totalBalance = numberFormat(_.get(item, 'totalBalance'), currency)
        return (
            <Row key={id}>
                <Col xs={1}>{id}</Col>
                <Col xs={hasMarket ? TWO : THREE}>{clientName}</Col>
                {hasMarket && <Col xs={2}>{market}</Col>}
                <Col xs={2}>{createdDate}</Col>
                <Col xs={hasMarket ? ONE : TWO}>{paymentType}</Col>
                <Col xs={2} style={{textAlign: 'right'}}>{totalPrice}</Col>
                <Col xs={1} style={{textAlign: 'right'}}>{totalBalance}</Col>
                <Col xs={1} style={{textAlign: 'right', padding: '0'}}>
                    <IconButton
                        iconStyle={iconStyle.icon}
                        style={iconStyle.button}
                        touch={true}
                        onTouchTap={() => {
                            updateDialog.handleOpenUpdateDialog(id)
                        }}>
                        <AddPayment/>
                    </IconButton>
                </Col>
            </Row>
        )
    })

    const list = {
        header: hasMarket ? listHeader : listHeaderHasMarket,
        list: pendingPaymentsList,
        loading: _.get(listData, 'listLoading')
    }

    return (
        <Container>
            <SubMenu url={ROUTES.PENDING_PAYMENTS_LIST_URL}/>

            <GridList
                filter={filter}
                list={list}
                detail={pendingPaymentsDetail}
                filterDialog={pendingPaymentsFilterDialog}
            />

            <PendingPaymentsCreateDialog
                initialValues={updateDialog.initialValues}
                open={updateDialog.openUpdateDialog}
                detailData={detailData}
                loading={updateDialog.updateLoading}
                onClose={updateDialog.handleCloseUpdateDialog}
                onSubmit={updateDialog.handleSubmitUpdateDialog}
                convert={convert}
                hasMarket={hasMarket}
            />
        </Container>
    )
})

PendingPaymentsGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    updateDialog: PropTypes.shape({
        updateLoading: PropTypes.bool.isRequired,
        openUpdateDialog: PropTypes.bool.isRequired,
        handleOpenUpdateDialog: PropTypes.func.isRequired,
        handleCloseUpdateDialog: PropTypes.func.isRequired,
        handleSubmitUpdateDialog: PropTypes.func.isRequired
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

export default PendingPaymentsGridList
