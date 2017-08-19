import _ from 'lodash'
import sprintf from 'sprintf'
import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router'
import IconButton from 'material-ui/IconButton'
import * as ROUTES from '../../constants/routes'
import GridList from '../GridList'
import Container from '../Container'
import ReturnFilterForm from './ReturnFilterForm'
import ReturnDetails from './ReturnDetails'
import ConfirmDialog from '../ConfirmDialog'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import {Row, Col} from 'react-flexbox-grid'
import {compose} from 'recompose'
import getConfig from '../../helpers/getConfig'
import Tooltip from '../ToolTip'
import numberFormat from '../../helpers/numberFormat'
import InProcess from 'material-ui/svg-icons/action/cached'
import DoneIcon from 'material-ui/svg-icons/action/done-all'
import Canceled from 'material-ui/svg-icons/notification/do-not-disturb-alt'
import dateFormat from '../../helpers/dateTimeFormat'

const listHeader = [
    {
        sorting: true,
        name: 'id',
        title: 'Возврат',
        xs: 1
    },
    {
        sorting: true,
        name: 'order',
        title: 'От каго',
        xs: 2
    },
    {
        sorting: true,
        name: 'stock',
        title: 'Склад',
        xs: 2
    },
    {
        sorting: true,
        name: 'user',
        title: 'Добавил',
        xs: 2
    },
    {
        sorting: true,
        name: 'createdDate',
        title: 'Дата возврата',
        xs: 2
    },
    {
        sorting: true,
        name: 'amount',
        alignRight: true,
        title: 'Сумма возврата',
        xs: 2
    },
    {
        sorting: false,
        xs: 1
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
        },
        listWrapper: {
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            margin: '0 -30px !important',
            width: 'auto !important',
            padding: '0 30px',
            position: 'relative',
            '& > div': {
                '&:first-child': {
                    paddingLeft: '0'
                },
                '&:last-child': {
                    textAlign: 'right'
                }
            }
        },
        buttons: {
            display: 'flex',
            justifyContent: 'space-around'
        },
        openDetails: {
            position: 'absolute',
            top: '0',
            bottom: '0',
            right: '0',
            left: '0',
            cursor: 'pointer'
        }
    })
)

const OrderGridList = enhance((props) => {
    const {
        filter,
        filterDialog,
        getDocument,
        confirmDialog,
        listData,
        detailData,
        classes,
        printDialog,
        cancelReturnDialog
    } = props

    const orderFilterDialog = (
        <ReturnFilterForm
            initialValues={filterDialog.initialValues}
            filter={filter}
            filterDialog={filterDialog}/>
    )
    const iconStyle = {
        icon: {
            color: '#666',
            width: 20,
            height: 20
        },
        button: {
            width: 30,
            height: 30,
            padding: 0,
            zIndex: 0
        }
    }
    const orderDetail = (
        <ReturnDetails
            key={_.get(detailData, 'id')}
            data={_.get(detailData, 'data') || {}}
            getDocument={getDocument}
            confirmDialog={confirmDialog}
            loading={_.get(detailData, 'detailLoading')}
            handleCloseDetail={_.get(detailData, 'handleCloseDetail')}
            cancelReturnDialog={cancelReturnDialog}
        />
    )
    const orderList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const orderId = _.get(item, 'order') ? _.get(item, ['order', 'id']) : _.get(item, ['client', 'name'])
        const stockId = _.get(item, ['stock', 'name'])
        const currentCurrency = getConfig('PRIMARY_CURRENCY')
        const user = _.get(item, ['createdBy', 'firstName']) + ' ' + _.get(item, ['createdBy', 'secondName']) || 'N/A'
        const createdDate = dateFormat(_.get(item, 'createdDate'))
        const totalPrice = numberFormat(_.get(item, 'totalPrice'), currentCurrency)
        const status = _.toInteger(_.get(item, 'status'))
        const PENDING = 0
        const IN_PROGRESS = 1
        const COMPLETED = 2
        const CANCELLED = 3
        return (
            <Row className={classes.listWrapper} key={id}>
                <Col xs={1}>{id}</Col>
                <Col xs={2}>{orderId}</Col>
                <Link className={classes.openDetails} to={{
                    pathname: sprintf(ROUTES.RETURN_ITEM_PATH, id),
                    query: filter.getParams()
                }}>
                </Link>
                <Col xs={2}>{stockId}</Col>
                <Col xs={2}>{user}</Col>
                <Col xs={2}>{createdDate}</Col>
                <Col xs={2} style={{textAlign: 'right'}}>{totalPrice}</Col>
                <Col xs={1}>
                    <div className={classes.buttons}>
                        {(status === PENDING || status === IN_PROGRESS)
                            ? <Tooltip position="bottom" text="Ожидает">
                                <IconButton
                                    disableTouchRipple={true}
                                    iconStyle={iconStyle.icon}
                                    style={iconStyle.button}
                                    touch={true}>
                                    <InProcess color="#f0ad4e"/>
                                </IconButton>
                            </Tooltip>
                            : (status === COMPLETED)
                                ? <Tooltip position="bottom" text="Завершен">
                                    <IconButton
                                        disableTouchRipple={true}
                                        iconStyle={iconStyle.icon}
                                        style={iconStyle.button}
                                        touch={true}>
                                        <DoneIcon color="#81c784"/>
                                    </IconButton>
                                </Tooltip>
                                : (status === CANCELLED)
                                    ? <Tooltip position="bottom" text="Отменен">
                                        <IconButton
                                            disableTouchRipple={true}
                                            iconStyle={iconStyle.icon}
                                            style={iconStyle.button}
                                            touch={true}>
                                            <Canceled color='#e57373'/>
                                        </IconButton>
                                    </Tooltip> : null}
                    </div>
                </Col>
            </Row>
        )
    })

    const list = {
        header: listHeader,
        list: orderList,
        loading: _.get(listData, 'listLoading')
    }

    return (
        <Container>
            <SubMenu url={ROUTES.RETURN_LIST_URL}/>

            <GridList
                filter={filter}
                list={list}
                detail={orderDetail}
                withInvoice={true}
                filterDialog={orderFilterDialog}
                printDialog={printDialog}
            />

            {detailData.data && <ConfirmDialog
                type="cancel"
                message={'Заказ № ' + _.get(detailData, ['data', 'id'])}
                onClose={confirmDialog.handleCloseConfirmDialog}
                onSubmit={confirmDialog.handleSendConfirmDialog}
                open={confirmDialog.openConfirmDialog}
            />}
        </Container>
    )
})

OrderGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    confirmDialog: PropTypes.shape({
        openConfirmDialog: PropTypes.bool.isRequired,
        handleOpenConfirmDialog: PropTypes.func.isRequired,
        handleCloseConfirmDialog: PropTypes.func.isRequired,
        handleSendConfirmDialog: PropTypes.func.isRequired
    }).isRequired,
    filterDialog: PropTypes.shape({
        initialValues: PropTypes.object,
        filterLoading: PropTypes.bool,
        openFilterDialog: PropTypes.bool.isRequired,
        handleOpenFilterDialog: PropTypes.func.isRequired,
        handleCloseFilterDialog: PropTypes.func.isRequired,
        handleSubmitFilterDialog: PropTypes.func.isRequired
    }).isRequired,
    getDocument: PropTypes.shape({
        handleGetDocument: PropTypes.func.isRequired
    }),
    printDialog: PropTypes.shape({
        openPrint: PropTypes.bool.isRequired,
        handleOpenPrintDialog: PropTypes.func.isRequired,
        handleClosePrintDialog: PropTypes.func.isRequired
    }).isRequired,
    cancelReturnDialog: PropTypes.shape({
        openCancelDialog: PropTypes.number.isRequired,
        handleOpenCancelReturnDialog: PropTypes.func.isRequired,
        handleCloseCancelReturnDialog: PropTypes.func.isRequired,
        handleSubmitCancelReturnDialog: PropTypes.func.isRequired
    }).isRequired
}

export default OrderGridList
