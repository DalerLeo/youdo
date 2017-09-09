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
        xs: 2
    },
    {
        sorting: false,
        name: 'type',
        title: 'Описание',
        xs: 5
    },
    {
        sorting: false,
        name: 'brand',
        title: 'Дата',
        xs: 2
    },
    {
        sorting: true,
        name: 'amount',
        alignRight: true,
        title: 'Сумма',
        xs: 2
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
        const supplyNo = _.get(item, 'supply')
        const comment = _.get(item, 'comment')
        const createdDate = dateTimeFormat(_.get(item, 'createdDate'))
        const summary = numberFormat(_.get(item, 'amount'))
        const currency = _.get(item, ['currency', 'name'])
        return (
            <Row key={id}>
                <Col xs={2}>{supplyNo}</Col>
                <Col xs={5}>{comment}</Col>
                <Col xs={2} style={{whiteSpace: 'nowrap'}}>{createdDate}</Col>
                <Col xs={2} style={{textAlign: 'right'}}>{summary} {currency}</Col>
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

    return (
        <Container>
            <SubMenu url={ROUTES.PENDING_EXPENSES_LIST_URL}/>

            <GridList
                filter={filter}
                list={list}
                detail={pendingExpensesDetail}
                filterDialog={pendingExpensesFilterDialog}
            />

            <PendingExpensesCreateDialog
                initialValues={updateDialog.initialValues}
                open={updateDialog.openUpdateDialog}
                detailData={detailData}
                loading={updateDialog.updateLoading}
                onClose={updateDialog.handleCloseUpdateDialog}
                onSubmit={updateDialog.handleSubmitUpdateDialog}
            />
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
