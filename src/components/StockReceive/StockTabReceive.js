import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import injectSheet from 'react-jss'
import moment from 'moment'
import {compose} from 'recompose'
import CircularProgress from 'material-ui/CircularProgress'
import StockReceiveDetails from './StockReceiveDetails'
import stockTypeFormat from '../../helpers/stockTypeFormat'
import ConfirmDialog from '../ConfirmDialog'
import CreateDialog from './StockReceiveCreateDialog'
import HistoryFilterForm from './StockHistoryFilterForm'
import GridList from '../GridList'

const ZERO = 0
const RETURN = 3
const CANCEL = 2
const enhance = compose(
    injectSheet({
        wrapper: {
            marginTop: '20px',
            '& .row > div > svg': {
                position: 'relative',
                width: '16px !important',
                height: '16px !important',
                top: '3px',
                marginRight: '5px'
            }
        },
        loader: {
            position: 'absolute',
            background: '#fff',
            top: '100px',
            left: '0',
            width: '100%',
            minHeight: '400px',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex'
        },
        listWrapper: {
            position: 'relative',
            '& > div:nth-child(2)': {
                marginTop: '0 !important'
            }
        },
        list: {
            cursor: 'pointer',
            marginBottom: '5px',
            '& > a': {
                color: 'inherit'
            }
        },
        expandedList: {
            margin: '20px -15px',
            transition: 'all 400ms ease-out !important',
            position: 'relative',
            '& > a': {
                color: 'inherit'
            }
        },
        semibold: {
            fontWeight: '600',
            cursor: 'pointer'
        },
        headers: {
            color: '#666',
            fontWeight: '600',
            padding: '15px 30px',
            '& .row': {
                alignItems: 'center'
            }
        },
        actionButton: {
            background: '#12aaeb',
            borderRadius: '2px',
            color: '#fff',
            padding: '5px 10px'
        },
        success: {
            color: '#81c784'
        },
        begin: {
            color: '#f0ad4e'
        },
        error: {
            color: '#e57373'
        },
        waiting: {
            color: '#64b5f6'
        }
    })
)

const listHeader = [
    {
        name: 'id',
        sorting: true,
        title: '№ заказа',
        xs: 2
    },
    {
        name: 'market',
        sorting: true,
        title: 'От кого',
        xs: 3
    },
    {
        name: 'type',
        sorting: false,
        title: 'Тип',
        xs: 2
    },
    {
        name: 'date',
        sorting: true,
        title: 'Дата приемки',
        xs: 2
    },
    {
        name: 'stock',
        sorting: true,
        title: 'Склад',
        xs: 2
    }
]

const StockTabReceive = enhance((props) => {
    const {
        listData,
        detailData,
        filter,
        classes,
        confirmDialog,
        handleCloseDetail,
        createDialog,
        filterDialog,
        history
    } = props

    const listLoading = _.get(listData, 'listLoading')
    const stockReceiveFilterDialog = (
        <HistoryFilterForm
            initialValues={filterDialog.initialValues}
            filter={filter}
            filterDialog={filterDialog}
        />
    )

    const receiveDetails = (
        <StockReceiveDetails
            key={_.get(detailData, 'id') + '_' + _.get(detailData, 'type')}
            detailData={detailData}
            loading={_.get(detailData, 'detailLoading')}
            confirmDialog={confirmDialog}
            handleCloseDetail={handleCloseDetail}
            createDialog={createDialog}
            history={history}

        />
    )

    const stockReciveList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const by = _.get(item, ['by'])
        const type = _.get(item, ['type'])
        const formattedType = stockTypeFormat(type)
        const date = _.get(item, 'date') ? moment(_.get(item, 'date')).format('DD.MM.YYYY') : 'Не указана'
        const stockName = _.get(item, ['stock', 'name'])

        return (
            <Row
                key={id + '_' + type}
                onClick={() => { listData.handleOpenDetail(id, type) }}
                style={{cursor: 'pointer'}}>
                <Col xs={2}>{id}</Col>
                <Col xs={3}>{by}</Col>
                <Col xs={2}>
                    {formattedType}
                </Col>
                <Col xs={2}>{date}</Col>
                <Col xs={2}>
                    {stockName}
                </Col>
            </Row>
        )
    })

    const list = {
        header: listHeader,
        list: stockReciveList,
        loading: listLoading
    }

    if (listLoading) {
        return (
            <div className={classes.loader}>
                <CircularProgress size={40} thickness={4}/>
            </div>
        )
    }

    return (
        <div className={classes.wrapper}>
            <GridList
                filter={filter}
                filterDialog={stockReceiveFilterDialog}
                list={list}
                detail={receiveDetails}/>

            <ConfirmDialog
                type={confirmDialog.openConfirmDialog === CANCEL ? 'cancel' : 'submit' }
                message={'Запрос № ' + _.get(detailData, ['currentDetail', 'id'])}
                onClose={confirmDialog.handleCloseConfirmDialog}
                onSubmit={confirmDialog.openConfirmDialog === RETURN ? confirmDialog.handleSubmitOrderReturnDialog : confirmDialog.handleSubmitReceiveConfirmDialog}
                open={confirmDialog.openConfirmDialog > ZERO}
            />
            <CreateDialog
                loading={createDialog.createLoading}
                open={createDialog.openCreateDialog}
                isDefect={createDialog.isDefect}
                detailProducts={createDialog.detailProducts}
                listLoading={createDialog.detailLoading}
                onClose={createDialog.handleCloseCreateDialog}
                onSubmit={createDialog.handleSubmitCreateDialog}
            />
        </div>
    )
})

StockTabReceive.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    handleCloseDetail: PropTypes.func.isRequired,
    confirmDialog: PropTypes.shape({
        openConfirmDialog: PropTypes.number.isRequired,
        handleOpenConfirmDialog: PropTypes.func.isRequired,
        handleCloseConfirmDialog: PropTypes.func.isRequired,
        handleSubmitReceiveConfirmDialog: PropTypes.func.isRequired,
        handleSubmitOrderReturnDialog: PropTypes.func.isRequired
    }).isRequired,
    createDialog: PropTypes.shape({
        createLoading: PropTypes.bool.isRequired,
        openCreateDialog: PropTypes.bool.isRequired,
        isDefect: PropTypes.bool,
        detailProducts: PropTypes.object,
        detailLoading: PropTypes.bool,
        handleOpenCreateDialog: PropTypes.func.isRequired,
        handleCloseCreateDialog: PropTypes.func.isRequired,
        handleSubmitCreateDialog: PropTypes.func.isRequired
    }).isRequired
}

export default StockTabReceive
