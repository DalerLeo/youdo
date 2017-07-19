import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import * as ROUTES from '../../constants/routes'
import {Link} from 'react-router'
import injectSheet from 'react-jss'
import sprintf from 'sprintf'
import moment from 'moment'
import {compose} from 'recompose'
import CircularProgress from 'material-ui/CircularProgress'
import Paper from 'material-ui/Paper'
import StockTransferDetails from './StockTransferDetails'
import Pagination from '../GridList/GridListNavPagination'
import ConfirmDialog from '../ConfirmDialog'

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
            marginBottom: '5px',
            '& > a': {
                color: 'inherit'
            }
        },
        expandedList: {
            margin: '20px -15px',
            transition: 'all 400ms ease-out !important',
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
            padding: '5px 20px'
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

const StockTabTransfer = enhance((props) => {
    const {
        listData,
        detailData,
        filter,
        classes,
        createDialog
    } = props
    const currentDetail = _.find(_.get(listData, 'data'), {'id': _.toInteger(_.get(detailData, 'id'))})
    const detailId = _.get(detailData, 'id')
    const listLoading = _.get(listData, 'transferListLoading')
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
                    <Col xs={1}>№ запроса</Col>
                    <Col xs={2}>Дата запроса</Col>
                    <Col xs={2}>Вид передачи</Col>
                    <Col xs={2}>Кому</Col>
                    <Col xs={2}>Дата передачи</Col>
                    <Col xs={1}>Статус</Col>
                </Row>
            </div>
            {_.map(_.get(listData, 'data'), (item, index) => {
                const id = _.get(item, 'id')
                const dateRequest = moment(_.get(item, 'dateRequest')).format('DD.MM.YYYY')
                const dateDelivery = moment(_.get(item, 'dateDelivery')).format('DD.MM.YYYY')
                const receiver = _.get(item, ['receiver'])
                const status = _.toInteger(_.get(item, 'status'))
                const PENDING = 0
                const IN_PROGRESS = 1
                const COMPLETED = 2

                if (id === detailId) {
                    return (
                        <Paper key={index} zDepth={1} className={classes.expandedList}>
                            <div className={classes.wrapper}>
                                <Row className={classes.semibold}>
                                    <Col xs={1}>{id}</Col>
                                    <Col xs={2}>{dateRequest}</Col>
                                    <Col xs={2}>Заказ</Col>
                                    <Col xs={2}>{receiver}</Col>
                                    <Col xs={2}>{dateDelivery}</Col>
                                    <Col xs={1}>{status === PENDING ? (<span className={classes.waiting}>Ожидает</span>)
                                        : ((status === IN_PROGRESS) ? (
                                            <span className={classes.begin}>В процессе</span>)
                                            : (status === COMPLETED) ? (<span className={classes.success}>Принят</span>)
                                                : (<span className={classes.error}>Отменен</span>))}</Col>
                                    <Col xs={2} style={{textAlign: 'right'}}>
                                        <a onClick={createDialog.handleOpenCreateDialog}
                                           className={classes.actionButton}>Выполнить</a>
                                    </Col>
                                </Row>
                            </div>
                            <StockTransferDetails
                                key={detailId}
                                detailData={detailData}
                            />
                        </Paper>
                    )
                }
                return (
                    <Paper key={index} zDepth={1} className={classes.list}>
                        <Link to={{
                            pathname: sprintf(ROUTES.STOCK_RECEIVE_ITEM_PATH, id),
                            query: filter.getParams()
                        }}>
                            <div className={classes.wrapper}>
                                <Row>
                                    <Col xs={1}>{id}</Col>
                                    <Col xs={2}>{dateRequest}</Col>
                                    <Col xs={2}>Заказ</Col>
                                    <Col xs={2}>{receiver}</Col>
                                    <Col xs={2}>{dateDelivery}</Col>
                                    <Col xs={1}>{status === PENDING ? (<span className={classes.waiting}>Ожидает</span>)
                                        : ((status === IN_PROGRESS) ? (
                                            <span className={classes.begin}>В процессе</span>)
                                            : (status === COMPLETED) ? (<span className={classes.success}>Принят</span>)
                                                : (<span className={classes.error}>Отменен</span>))}</Col>
                                </Row>
                            </div>
                        </Link>
                    </Paper>
                )
            })}
            <ConfirmDialog
                type="submit"
                message={'Заказ ' + _.get(currentDetail, 'receiver')}
                loading={createDialog.createLoading}
                onClose={createDialog.handleCloseCreateDialog}
                onSubmit={createDialog.handleSubmitCreateDialog}
                open={createDialog.openCreateDialog}
            />
            <Pagination
                filter={filter}
                customPagination={true}/>
        </div>
    )
})

StockTabTransfer.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    handleCloseDetail: PropTypes.func.isRequired,
    createDialog: PropTypes.shape({
        createLoading: PropTypes.bool.isRequired,
        openCreateDialog: PropTypes.bool.isRequired,
        isDefect: PropTypes.bool,
        handleOpenCreateDialog: PropTypes.func.isRequired,
        handleCloseCreateDialog: PropTypes.func.isRequired,
        handleSubmitCreateDialog: PropTypes.func.isRequired
    }).isRequired
}

export default StockTabTransfer
