import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import * as ROUTES from '../../constants/routes'
import GridList from '../GridList'
import Container from '../Container'
import PendingExpensesFilterForm from './PendingExpensesFilterForm'
import PendingExpensesCreateDialog from './PendingExpensesCreateDialog'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import AddPayment from 'material-ui/svg-icons/av/playlist-add-check'
import numberFormat from '../../helpers/numberFormat'
import dateTimeFormat from '../../helpers/dateTimeFormat'

const listHeader = [
    {
        sorting: true,
        name: 'supply',
        title: '№ поставки',
        xs: 1
    },
    {
        sorting: false,
        name: 'provider',
        title: 'Поставщик',
        xs: 2
    },
    {
        sorting: false,
        name: 'comment',
        title: 'Описание',
        xs: 2
    },
    {
        sorting: false,
        name: 'type',
        title: 'Тип',
        xs: 1
    },
    {
        sorting: false,
        name: 'type',
        title: 'Тип оплаты',
        xs: 2
    },
    {
        sorting: false,
        name: 'createdDate',
        title: 'Дата',
        xs: 1
    },
    {
        sorting: true,
        name: 'amount',
        alignRight: true,
        title: 'Сумма',
        xs: 1
    },
    {
        sorting: true,
        name: 'balance',
        alignRight: true,
        title: 'Остаток',
        xs: 1
    },
    {
        name: 'buttons'
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

const PendingExpensesGridList = enhance((props) => {
    const {
        filter,
        updateDialog,
        filterDialog,
        listData,
        detailData
    } = props

    const pendingExpensesFilterDialog = (
        <PendingExpensesFilterForm
            initialValues={filterDialog.initialValues}
            filter={filter}
            filterDialog={filterDialog}
        />
    )

    const pendingExpensesDetail = (
        <span>a</span>
    )

    const pendingExpensesList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const supplyNo = _.get(item, 'supplyId')
        const provider = _.get(item, ['provider', 'name'])
        const paymentType = _.get(item, 'paymentType') === 'cash' ? 'Наличный' : 'Банковский счет'
        const type = _.get(item, 'type') === 'supply' ? 'Поставка' : 'Доп. расход'
        const comment = _.get(item, 'comment')
        const createdDate = dateTimeFormat(_.get(item, 'createdDate'))
        const currency = _.get(item, ['currency', 'name'])
        const summary = _.get(item, 'totalAmount')
        const paidAmount = _.get(item, 'paidAmount')
        const balance = summary - paidAmount
        return (
            <Row key={id}>
                <Col xs={1}>{supplyNo}</Col>
                <Col xs={2}>{provider}</Col>
                <Col xs={2}>{comment}</Col>
                <Col xs={1}>{type}</Col>
                <Col xs={2}>{paymentType}</Col>
                <Col xs={1} style={{whiteSpace: 'nowrap'}}>{createdDate}</Col>
                <Col xs={1} style={{textAlign: 'right'}}>{numberFormat(summary)} {currency}</Col>
                <Col xs={1} style={{textAlign: 'right'}}>{numberFormat(balance)} {currency}</Col>
                <Col xs={1} style={{textAlign: 'right', padding: '0'}}>
                    <IconButton
                        iconStyle={iconStyle.icon}
                        style={iconStyle.button}
                        touch={true}
                        onTouchTap={() => { updateDialog.handleOpenUpdateDialog(id) }}>
                        <AddPayment />
                    </IconButton>
                </Col>
            </Row>
        )
    })

    const list = {
        header: listHeader,
        list: pendingExpensesList,
        loading: _.get(listData, 'listLoading')
    }

    const currentItem = _.find(_.get(listData, 'data'), {'id': _.get(detailData, 'id')})
    const itemBalance = _.get(currentItem, 'totalAmount') - _.get(currentItem, 'paidAmount')
    return (
        <Container>
            <SubMenu url={ROUTES.PENDING_EXPENSES_LIST_URL}/>

            <GridList
                filter={filter}
                list={list}
                detail={pendingExpensesDetail}
                filterDialog={pendingExpensesFilterDialog}
            />

            {detailData.data && <PendingExpensesCreateDialog
                initialValues={updateDialog.initialValues}
                open={updateDialog.openUpdateDialog}
                detailData={detailData}
                itemBalance={itemBalance}
                loading={updateDialog.updateLoading}
                onClose={updateDialog.handleCloseUpdateDialog}
                onSubmit={updateDialog.handleSubmitUpdateDialog}
            />}
        </Container>
    )
})

PendingExpensesGridList.propTypes = {
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

export default PendingExpensesGridList
