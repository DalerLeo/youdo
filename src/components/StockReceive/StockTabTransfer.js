import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import injectSheet from 'react-jss'
import moment from 'moment'
import {compose} from 'recompose'
import CircularProgress from 'material-ui/CircularProgress'
import Paper from 'material-ui/Paper'
import StockTransferDetails from './StockTransferDetails'
import Pagination from '../GridList/GridListNavPagination'
import ConfirmDialog from '../ConfirmDialog'
import PrintIcon from 'material-ui/svg-icons/action/print'
import CheckCircleIcon from 'material-ui/svg-icons/action/check-circle'
import Tooltip from '../ToolTip'
import IconButton from 'material-ui/IconButton'

const ZERO = 0
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
            },
            cursor: 'pointer'
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
            position: 'relative',
            padding: '15px 30px',
            '& .row': {
                alignItems: 'center'
            }
        },
        titleButtons: {
            display: 'flex',
            zIndex: '3',
            justifyContent: 'flex-end'
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
            zIndex: '2',
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
        },
        printer: {
            position: 'absolute',
            top: '-15px'
        },
        closeDetail: {
            position: 'absolute',
            left: '0',
            top: '0',
            right: '0',
            bottom: '0',
            cursor: 'pointer',
            zIndex: '1'
        }
    })
)

const iconStyle = {
    icon: {
        color: '#666',
        width: 25,
        height: 25
    },
    button: {
        width: 40,
        height: 40,
        padding: 0
    }
}
const StockTabTransfer = enhance((props) => {
    const {
        listData,
        detailData,
        filter,
        classes,
        handleCloseDetail,
        confirmDialog
    } = props
    const detailId = _.get(detailData, 'id')
    const listLoading = _.get(listData, 'transferListLoading')
    const detailType = _.toInteger(_.get(detailData, 'type'))
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
                    <Col xs={2} style={{textAlign: 'end'}}>Дата передачи</Col>
                    <Col xs={2} style={{textAlign: 'end'}}>Статус</Col>
                </Row>
            </div>
            {_.map(_.get(listData, 'data'), (item, index) => {
                const id = _.get(item, 'id')
                const dateRequest = moment(_.get(item, 'dateRequest')).format('DD.MM.YYYY')
                const dateDelivery = moment(_.get(item, 'dateDelivery')).format('DD.MM.YYYY')
                const receiver = _.get(item, ['receiver'])
                const status = _.toInteger(_.get(item, 'status'))
                const stock = _.toInteger(_.get(item, 'stock'))
                const PENDING = 0
                const IN_PROGRESS = 1
                const COMPLETED = 2
                const tooltipText = 'Подтвердить Запрос № ' + id
                if (id === detailId && detailType === stock) {
                    return (
                        <Paper key={index} zDepth={1} className={classes.expandedList}>
                            <div className={classes.wrapper}>

                                <Row className={classes.semibold}>

                                    <Col xs={1}>{id}</Col>
                                    <Col xs={2}>{dateRequest}</Col>
                                    <Col xs={2}>Заказ</Col>
                                    <Col xs={2}>{receiver}</Col>
                                    <Col xs={2} style={{textAlign: 'end'}}>{dateDelivery}</Col>
                                    <Col xs={2} style={{textAlign: 'end'}}>
                                        {status === PENDING ? (<span className={classes.waiting}>Ожидает</span>)
                                                                : ((status === IN_PROGRESS) ? (
                                                                    <span className={classes.begin}>В процессе</span>)
                                                                    : (status === COMPLETED) ? (<span className={classes.success}>Принят</span>)
                                                                        : (<span className={classes.error}>Отменен</span>))}</Col>
                                    <Col xs={1} style={{textAlign: 'right', display: 'flex'}}>
                                        <div className={classes.titleButtons}>
                                            <Tooltip position="right" text="Распечатать накладную">
                                                <IconButton
                                                    iconStyle={iconStyle.icon}
                                                    style={iconStyle.button}
                                                    touch={true}
                                                    /*                                    onTouchTap={() => { getDocument.handleGetDocument(id) }}*/>
                                                    <PrintIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip position="right" text={tooltipText}>
                                                <IconButton
                                                    iconStyle={iconStyle.icon}
                                                    style={iconStyle.button}
                                                    touch={true}
                                                    onTouchTap={() => { confirmDialog.handleOpenConfirmDialog(IN_PROGRESS) }}>
                                                    <CheckCircleIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </div>
                                    </Col>
                                </Row>
                                <div className={classes.closeDetail}
                                     onClick={handleCloseDetail}>
                                </div>
                            </div>
                            <StockTransferDetails
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
                        onClick={() => { listData.handleOpenDetail(id, stock) }}>
                            <div className={classes.wrapper}>
                                <Row onClick={() => { listData.handleOpenDetail(id, stock) }}>
                                    <Col xs={1}>{id}</Col>
                                    <Col xs={2}>{dateRequest}</Col>
                                    <Col xs={2}>Заказ</Col>
                                    <Col xs={2}>{receiver}</Col>
                                    <Col xs={2} style={{textAlign: 'end'}}>{dateDelivery}</Col>
                                    <Col xs={2} style={{textAlign: 'end'}}>{status === PENDING ? (<span className={classes.waiting}>Ожидает</span>)
                                        : ((status === IN_PROGRESS) ? (
                                            <span className={classes.begin}>В процессе</span>)
                                            : (status === COMPLETED) ? (<span className={classes.success}>Принят</span>)
                                                : (<span className={classes.error}>Отменен</span>))}</Col>
                                </Row>
                            </div>
                    </Paper>
                )
            })}
            <ConfirmDialog
                type="submit"
                message={'Запрос № ' + _.get(detailData, ['currentTransferDetail', 'id'])}
                onClose={confirmDialog.handleCloseConfirmDialog}
                onSubmit={confirmDialog.handleSubmitTransferAcceptDialog}
                open={confirmDialog.openConfirmDialog > ZERO}
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
    confirmDialog: PropTypes.shape({
        openConfirmDialog: PropTypes.number.isRequired,
        handleOpenConfirmDialog: PropTypes.func.isRequired,
        handleCloseConfirmDialog: PropTypes.func.isRequired,
        handleSubmitTransferAcceptDialog: PropTypes.func.isRequired
    }).isRequired
}

export default StockTabTransfer
