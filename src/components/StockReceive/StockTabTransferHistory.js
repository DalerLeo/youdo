import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import GridList from '../GridList'
import HistoryFilterForm from './StockHistoryFilterForm'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import moment from 'moment'
import CircularProgress from 'material-ui/CircularProgress'

const listHeader = [
    {
        sorting: true,
        name: 'product',
        title: '№ запроса',
        xs: 2
    },
    {
        name: 'amount',
        title: 'Дата запроса',
        xs: 3
    },
    {
        sorting: true,
        name: 'date',
        title: 'Вид передачи',
        xs: 2
    },
    {
        name: 'stock',
        title: 'Кому',
        xs: 3
    },
    {
        sorting: true,
        name: 'type',
        title: 'Дата передачи',
        xs: 2
    }
]

const enhance = compose(
    injectSheet({
        loader: {
            position: 'absolute',
            background: '#fff',
            top: '72px',
            left: '0',
            width: '100%',
            minHeight: '400px',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex'
        },
        wrapper: {
            marginTop: '20px',
            '& .row > div > svg': {
                position: 'relative',
                width: '16px !important',
                height: '16px !important',
                top: '3px',
                marginRight: '5px'
            }
        }
    })
)

const StockTabTransferHistory = enhance((props) => {
    const {
        filter,
        filterDialog,
        listData,
        classes
    } = props

    const usersFilterDialog = (
        <HistoryFilterForm
            initialValues={filterDialog.initialValues}
            filter={filter}
            filterDialog={filterDialog}
        />
    )

    const historyDetail = (
        <span>a</span>
    )
    const listLoading = _.get(listData, 'listLoading')
    const historyList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const dateRequest = moment(_.get(item, 'dateRequest')).format('DD.MM.YYYY')
        const dateDelivery = moment(_.get(item, 'dateDelivery')).format('DD.MM.YYYY')
        const receiver = _.get(item, ['receiver'])

        return (
            <Row key={id}>
                <Col xs={2}>{id}</Col>
                <Col xs={3}>{dateRequest}</Col>
                <Col xs={2}>Заказ</Col>
                <Col xs={3}>{receiver}</Col>
                <Col xs={2}>{dateDelivery}</Col>
            </Row>
        )
    })

    const list = {
        header: listHeader,
        list: historyList,
        loading: _.get(listData, 'historyListLoading')
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
                list={list}
                detail={historyDetail}
                filterDialog={usersFilterDialog}
            />
        </div>
    )
})

StockTabTransferHistory.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    filterDialog: PropTypes.shape({
        initialValues: PropTypes.object,
        filterLoading: PropTypes.bool,
        openFilterDialog: PropTypes.bool.isRequired,
        handleOpenFilterDialog: PropTypes.func.isRequired,
        handleCloseFilterDialog: PropTypes.func.isRequired,
        handleSubmitFilterDialog: PropTypes.func.isRequired
    }).isRequired
}

export default StockTabTransferHistory
