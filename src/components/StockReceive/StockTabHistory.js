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
import numberFormat from '../../helpers/numberFormat'
import ArrowUp from 'material-ui/svg-icons/navigation/arrow-upward'
import ArrowDown from 'material-ui/svg-icons/navigation/arrow-downward'
import stockTypeFormat from '../../helpers/stockTypeFormat'

const listHeader = [
    {
        sorting: true,
        name: 'product',
        title: 'Товар',
        xs: 4
    },
    {
        name: 'amount',
        title: 'Кол-во',
        xs: 1
    },
    {
        sorting: true,
        name: 'date',
        title: 'Дата',
        xs: 1
    },
    {
        name: 'fromTo',
        title: 'От кого / Кому',
        xs: 4
    },
    {
        sorting: true,
        name: 'type',
        title: 'Тип',
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

const StockTabHistory = enhance((props) => {
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
        const product = _.get(item, ['product', 'name'])
        const amount = numberFormat(_.get(item, 'amount'))
        const measurement = _.get(item, ['product', 'measurement', 'name'])
        const date = moment(_.get(item, 'createdDate')).format('DD.MM.YYYY')
        const genericType = stockTypeFormat(_.get(item, ['generic', 'type']))
        const type = _.get(item, 'type')

        return (
            <Row key={id}>
                <Col xs={4}>
                    {(type === 'Out') ? <ArrowUp color="#e57373"/> : <ArrowDown color="#81c784"/>} {product}
                </Col>
                <Col xs={1}>{amount} {measurement}</Col>
                <Col xs={1}>{date}</Col>
                <Col xs={4}>asdasd / asdasd</Col>
                <Col xs={2}>{genericType}</Col>
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

StockTabHistory.propTypes = {
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

export default StockTabHistory
