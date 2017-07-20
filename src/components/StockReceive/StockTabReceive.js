import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import injectSheet from 'react-jss'
import moment from 'moment'
import {compose} from 'recompose'
import CircularProgress from 'material-ui/CircularProgress'
import Paper from 'material-ui/Paper'
import StockReceiveDetails from './StockReceiveDetails'
import Pagination from '../GridList/GridListNavPagination'
import stockTypeFormat from '../../helpers/stockTypeFormat'
import ConfirmDialog from '../ConfirmDialog'
import CreateDialog from './StockReceiveCreateDialog'
const ZERO = 0
const RETURN = 3
const APPROVE = 1
const CANCEL = 2
const enhance = compose(
    injectSheet({
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
        wrapper: {
            padding: '15px 30px',
            '& .row': {
                alignItems: 'center'
            }
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

const StockTabReceive = enhance((props) => {
    const {
        listData,
        detailData,
        filter,
        classes,
        confirmDialog,
        handleCloseDetail,
        createDialog
    } = props
    const detailId = _.get(detailData, 'id')
    const detailType = _.get(detailData, 'type')
    const listLoading = _.get(listData, 'listLoading')
    if (listLoading) {
        return (
            <div className={classes.loader}>
                <CircularProgress size={40} thickness={4}/>
            </div>
        )
    }

    return (
        <div className={classes.listWrapper}>
            <div className={classes.headers}>
                <Row>
                    <Col xs={1}>№ заказа</Col>
                    <Col xs={3}>От кого</Col>
                    <Col xs={2}>Тип</Col>
                    <Col xs={2}>Дата приемки</Col>
                    <Col xs={2}>Статус</Col>
                </Row>
            </div>
            {_.map(_.get(listData, 'data'), (item, index) => {
                const id = _.get(item, 'id')
                const by = _.get(item, ['by'])
                const type = _.get(item, ['type'])
                const formattedType = stockTypeFormat(type)
                const date = _.get(item, 'date') ? moment(_.get(item, 'date')).format('DD.MM.YYYY') : 'Не указана'
                const status = _.toInteger(_.get(item, 'status'))
                const PENDING = 0
                const IN_PROGRESS = 1
                const COMPLETED = 2

                if (id === detailId && type === detailType) {
                    return (
                        <Paper key={index} zDepth={1} className={classes.expandedList}>
                            <div className={classes.wrapper}>
                                <Row className={classes.semibold}>
                                    <Col xs={1}>{id}</Col>
                                    <Col xs={3} onClick={handleCloseDetail}>{by}</Col>
                                    <Col xs={2}>{formattedType}</Col>
                                    <Col xs={2}>{date}</Col>
                                    <Col xs={2}>
                                        {status === PENDING ? (<span className={classes.waiting}>Ожидает</span>)
                                            : ((status === IN_PROGRESS) ? (
                                                <span className={classes.begin}>В процессе</span>)
                                                : (status === COMPLETED) ? (<span className={classes.success}>Принят</span>)
                                                    : (<span className={classes.error}>Отменен</span>))}
                                    </Col>
                                    <Col xs={2}>
                                        {type === 'transfer'
                                            ? <a onClick={() => { confirmDialog.handleOpenConfirmDialog(APPROVE) }}
                                           className={classes.actionButton}>Выполнить</a>
                                            : (type === 'order_return') ? confirmDialog.handleOpenConfirmDialog(RETURN)
                                                : <a onClick={createDialog.handleOpenCreateDialog}
                                            className={classes.actionButton}>Выполнить</a> }

                                        {type === 'transfer' && <a onClick={() => { confirmDialog.handleOpenConfirmDialog(CANCEL) }}
                                                       className={classes.actionButton}>Отменить</a>}
                                    </Col>
                                </Row>
                            </div>
                            <StockReceiveDetails
                                key={detailId}
                                detailData={detailData}
                            />
                        </Paper>
                    )
                }
                return (
                    <Paper
                        key={index}
                        zDepth={1}
                        className={classes.list}
                        onClick={() => { listData.handleOpenDetail(id, type) }}>
                            <div className={classes.wrapper}>
                                <Row>
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
                            </div>
                    </Paper>
                )
            })}

            <ConfirmDialog
                type={confirmDialog.openConfirmDialog === CANCEL ? 'cancel' : 'submit' }
                message={'Запрос № ' + _.get(detailData, ['currentDetail', 'id'])}
                onClose={confirmDialog.handleCloseConfirmDialog}
                onSubmit={confirmDialog.handleSubmitReceiveConfirmDialog}
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
            <Pagination
                filter={filter}
                customPagination={true}/>
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
