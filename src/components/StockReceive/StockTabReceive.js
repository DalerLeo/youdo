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
        xs: 1
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
        sorting: false,
        title: 'Дата приемки',
        xs: 2
    },
    {
        name: 'status',
        sorting: false,
        title: 'Статус',
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
        const status = _.toInteger(_.get(item, 'status'))
        const PENDING = 0
        const IN_PROGRESS = 1
        const COMPLETED = 2

        return (
            <Row
                key={id + '_' + type}
                onClick={() => { listData.handleOpenDetail(id, type) }}>
                <Col xs={1}>{id}</Col>
                <Col xs={3}>{by}</Col>
                <Col xs={2}>
                    {formattedType}
                </Col>
                <Col xs={2}>{date}</Col>
                <Col xs={2}>
                    {status === PENDING ? (<span className={classes.waiting}>Ожидает</span>)
                        : ((status === IN_PROGRESS) ? (
                            <span className={classes.begin}>В процессе</span>)
                            : (status === COMPLETED) ? (<span className={classes.success}>Принят</span>)
                                : (<span className={classes.error}>Отменен</span>))}
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

    // Return (
    //     <div className={classes.listWrapper}>
    //         <div className={classes.headers}>
    //             <Row>
    //                 {_.map(headerItems, (item, index) => {
    //                     Const name = _.get(item, 'name')
    //                     Const title = _.get(item, 'title')
    //                     Const size = _.get(item, 'xs')
    //                     Const sorting = _.get(item, 'sorting')
    //                     If (sorting) {
    //                         Return (
    //                             <Col
    //                                 Key={index}
    //                                 Xs={size}
    //                                 Style={{cursor: 'pointer'}}
    //                                 OnClick={() => hashHistory.push(filter.sortingURL(name))}>
    //                                 {title}
    //                             </Col>
    //                         )
    //                     }
    //                     Return (
    //                         <Col key={index} xs={size}>
    //                             {title}
    //                         </Col>
    //                     )
    //                 })}
    //             </Row>
    //         </div>
    //         {_.map(_.get(listData, 'data'), (item, index) => {
    //             Const id = _.get(item, 'id')
    //             Const by = _.get(item, ['by'])
    //             Const type = _.get(item, ['type'])
    //             Const formattedType = stockTypeFormat(type)
    //             Const date = _.get(item, 'date') ? moment(_.get(item, 'date')).format('DD.MM.YYYY') : 'Не указана'
    //             Const status = _.toInteger(_.get(item, 'status'))
    //             Const PENDING = 0
    //             Const IN_PROGRESS = 1
    //             Const COMPLETED = 2
    //
    //             If (id === detailId && type === detailType) {
    //                 Return (
    //                     <Paper key={index} zDepth={1} className={classes.expandedList}>
    //                         <div className={classes.wrapper}>
    //                             <Row className={classes.semibold}>
    //                                 <Col xs={1}>{id}</Col>
    //                                 <Col xs={3} onClick={handleCloseDetail}>{by}</Col>
    //                                 <Col xs={2}>{formattedType}</Col>
    //                                 <Col xs={2}>{date}</Col>
    //                                 <Col xs={2}>
    //                                     {status === PENDING ? (<span className={classes.waiting}>Ожидает</span>)
    //                                         : ((status === IN_PROGRESS) ? (
    //                                             <span className={classes.begin}>В процессе</span>)
    //                                             : (status === COMPLETED) ? (<span className={classes.success}>Принят</span>)
    //                                                 : (<span className={classes.error}>Отменен</span>))}
    //                                 </Col>
    //                                 <Col xs={2}>
    //                                     {type === 'transfer'
    //                                         ? <a onClick={() => { confirmDialog.handleOpenConfirmDialog(APPROVE) }}
    //                                        ClassName={classes.actionButton}>Выполнить</a>
    //                                             : (type === 'order_return')
    //                                                 ? <a onClick={() => { confirmDialog.handleOpenConfirmDialog(RETURN) }}
    //                                                                              ClassName={classes.actionButton}>Выполнить</a>
    //                                                     : <a onClick={createDialog.handleOpenCreateDialog}
    //                                                              ClassName={classes.actionButton}>Выполнить</a> }
    //
    //                                     {type === 'transfer' && <a onClick={() => { confirmDialog.handleOpenConfirmDialog(CANCEL) }}
    //                                                    ClassName={classes.actionButton}>Отменить</a>}
    //                                 </Col>
    //                             </Row>
    //                         </div>
    //                         <StockReceiveDetails
    //                             Key={detailId}
    //                             DetailData={detailData}
    //                         />
    //                     </Paper>
    //                 )
    //             }
    //             Return (
    //                 <Paper
    //                     Key={index}
    //                     ZDepth={1}
    //                     ClassName={classes.list}
    //                     OnClick={() => { listData.handleOpenDetail(id, type) }}>
    //                         <div className={classes.wrapper}>
    //                             <Row>
    //                                 <Col xs={1}>{id}</Col>
    //                                 <Col xs={3}>{by}</Col>
    //                                 <Col xs={2}>
    //                                     {formattedType}
    //                                 </Col>
    //                                 <Col xs={2}>{date}</Col>
    //                                 <Col xs={2}>
    //                                     {status === PENDING ? (<span className={classes.waiting}>Ожидает</span>)
    //                                         : ((status === IN_PROGRESS) ? (
    //                                             <span className={classes.begin}>В процессе</span>)
    //                                             : (status === COMPLETED) ? (<span className={classes.success}>Принят</span>)
    //                                                 : (<span className={classes.error}>Отменен</span>))}
    //                                 </Col>
    //                             </Row>
    //                         </div>
    //                 </Paper>
    //             )
    //         })}
    //
    //         <ConfirmDialog
    //             Type={confirmDialog.openConfirmDialog === CANCEL ? 'cancel' : 'submit' }
    //             Message={'Запрос № ' + _.get(detailData, ['currentDetail', 'id'])}
    //             OnClose={confirmDialog.handleCloseConfirmDialog}
    //             OnSubmit={confirmDialog.openConfirmDialog === RETURN ? confirmDialog.handleSubmitOrderReturnDialog : confirmDialog.handleSubmitReceiveConfirmDialog}
    //             Open={confirmDialog.openConfirmDialog > ZERO}
    //         />
    //         <CreateDialog
    //             Loading={createDialog.createLoading}
    //             Open={createDialog.openCreateDialog}
    //             IsDefect={createDialog.isDefect}
    //             DetailProducts={createDialog.detailProducts}
    //             ListLoading={createDialog.detailLoading}
    //             OnClose={createDialog.handleCloseCreateDialog}
    //             OnSubmit={createDialog.handleSubmitCreateDialog}
    //         />
    //         <Pagination
    //             Filter={filter}
    //             CustomPagination={true}/>
    //     </div>
    // )
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
