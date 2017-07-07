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
import StockReceiveDetails from './StockReceiveDetails'
import CreateDialog from './StockReceiveCreateDialog'
import Pagination from '../GridList/GridListNavPagination'

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

const StockTabReceive = enhance((props) => {
    const {
        listData,
        detailData,
        filter,
        classes,
        createDialog,
        handleCloseDetail
    } = props
    const detailId = _.get(detailData, 'id')
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
                    <Col xs={2}>№ заказа</Col>
                    <Col xs={4}>От кого</Col>
                    <Col xs={2}>Дата приемки</Col>
                    <Col xs={2}>Статус</Col>
                </Row>
            </div>
            {_.map(_.get(listData, 'data'), (item) => {
                const id = _.get(item, 'id')
                const provider = _.get(item, ['provider', 'name'])
                const acceptedDate = moment(_.get(item, 'acceptedTime')).format('DD.MM.YYYY')
                const status = _.toInteger(_.get(item, 'status'))
                const PENDING = 0
                const IN_PROGRESS = 1
                const COMPLETED = 2

                if (id === detailId) {
                    return (
                        <Paper key={id} zDepth={1} className={classes.expandedList}>
                            <div className={classes.wrapper}>
                                <Row className={classes.semibold}>
                                    <Col xs={2}>{id}</Col>
                                    <Col xs={4} onClick={handleCloseDetail}>{provider}</Col>
                                    <Col xs={2}>{acceptedDate}</Col>
                                    <Col xs={2}>{status === PENDING ? (<span className={classes.waiting}>Ожидает</span>)
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
                            <StockReceiveDetails
                                key={detailId}
                                detailData={detailData}
                                createDialog={createDialog}
                            />
                        </Paper>
                    )
                }
                return (
                    <Paper key={id} zDepth={1} className={classes.list}>
                        <Link to={{
                            pathname: sprintf(ROUTES.STOCK_RECEIVE_ITEM_PATH, id),
                            query: filter.getParams()
                        }}>
                            <div className={classes.wrapper}>
                                <Row>
                                    <Col xs={2}>{id}</Col>
                                    <Col xs={4}>{provider}</Col>
                                    <Col xs={2}>{acceptedDate}</Col>
                                    <Col xs={2}>{status === PENDING ? (<span className={classes.waiting}>Ожидает</span>)
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
