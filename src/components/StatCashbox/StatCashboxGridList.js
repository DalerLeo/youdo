import _ from 'lodash'
import injectSheet from 'react-jss'
import React from 'react'
import sprintf from 'sprintf'
import {compose} from 'recompose'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'
import Paper from 'material-ui/Paper'
import {Link} from 'react-router'
import numberFormat from '../../helpers/numberFormat'
import {Row, Col} from 'react-flexbox-grid'
import Container from '../Container'
import StatCashboxOrderDetails from './StatCashboxOrderDetails'
import ConfirmDialog from '../ConfirmDialog'
import SubMenu from '../SubMenu'
import * as ROUTES from '../../constants/routes'
import StatCashboxCreateDialog from './StatCashboxCreateDialog'

const enhance = compose(
    injectSheet({
        infoBlock: {
            width: '25%',
            display: 'inline-block',
            color: '#999',
            fontWeight: '400',
            fontSize: '13px',
            lineHeight: '1.3',
            borderLeft: '1px solid #efefef',
            padding: '12px 15px 12px 15px',
            alignItems: 'center',
            '& span': {
                color: '#333',
                fontWeight: '700',
                fontSize: '24px !important'
            },
            '&:first-child': {
                border: 'none'
            }
        },
        typeListStock: {
            width: '100px',
            height: 'calc(100% + 16px)',
            marginTop: '-8px',
            float: 'left',
            display: 'flex',
            alignItems: 'center',
            textAlign: 'center',
            borderRight: '1px solid #fff',
            backgroundColor: '#eceff5',
            '& a': {
                display: 'block',
                width: '100%',
                fontWeight: '600'
            },
            '& a.active': {
                color: '#333',
                cursor: 'text'
            },
            '&:last-child': {
                border: 'none'
            },
            '&:first-child': {

                marginLeft: '-38px'
            }
        },
        titleLabel: {
            fontSize: '18px',
            color: '#333',
            fontWeight: '700'
        },
        bodyTitle: {
            fontWeight: '600',
            marginBottom: '10px'
        },
        link: {
            color: '#12aaeb !important',
            borderBottom: '1px dashed',
            fontWeight: '400 !important'
        },
        loader: {
            background: '#fff',
            height: '400px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        manufactures: {
            margin: '0 -28px',
            padding: '20px 28px 0',
            borderBottom: '1px #e0e0e0 solid'
        },
        tabWrapper: {
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between'
        },
        tab: {
            cursor: 'pointer',
            padding: '20px',
            height: '100%'
        },
        activeTab: {
            paddingBottom: '20px',
            flexBasis: '20%',
            marginRight: '15px',
            '&:last-child': {
                margin: '0'
            },
            '& a': {
                color: 'inherit !important'
            }
        },
        tabTitle: {
            fontWeight: '600',
            marginBottom: '10px',
            '& span': {
                color: '#999',
                display: 'block',
                fontWeight: 'normal'
            }
        },
        tabText: {
            fontSize: '10px',
            color: '#666',
            fontWeight: '600',
            '& span': {
                display: 'block',
                fontSize: '15px !important',
                color: '#333'
            }
        },
        statTitle: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontWeight: 'bold',
            padding: '20px 0',
            borderBottom: '1px #e0e0e0 solid',
            '& a': {
                fontWeight: '600'
            }
        },
        diagram: {
            padding: '20px 0',
            margin: '0',
            borderBottom: '1px #e0e0e0 solid',
            '& > div': {
                margin: '-20px 0',
                padding: '20px 0',
                '&:first-child': {
                    paddingRight: '10px'
                },
                '&:last-child': {
                    paddingLeft: '10px'
                }
            }
        },
        balanceInfo: {

        },
        balance: {
            padding: '15px 0',
            borderBottom: '1px #e0e0e0 solid',
            '&:last-child': {
                border: 'none'
            },
            '& div:last-child': {
                fontSize: '20px',
                fontWeight: '600'
            }
        }
    }),
)

const StatCashboxGridList = enhance((props) => {
    const {
        filter,
        createDialog,
        updateDialog,
        confirmDialog,
        listData,
        detailData,
        classes,
        orderData
    } = props

    const detailId = _.get(detailData, 'id')
    const manufactureList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const cashbox = _.get(item, 'name')
        const type = _.toInteger(_.get(item, 'type'))
        const balance = numberFormat((_.get(item, 'balance')))
        const currency = _.get(item, ['currency', 'name'])
        const BANK_ID = 1
        return (
        <div key={id} className={classes.activeTab} style={ detailId === id ? {backgroundColor: '#f2f5f8'} : {}}>
            <Paper key={id} zDepth={1} className={classes.tab}>
                <Link
                    to={{
                        pathname: sprintf(ROUTES.TRANSACTION_ITEM_PATH, id),
                        query: filter.getParams({'cashboxId': id})
                    }}>
                    <div className={classes.tabContent}>
                        <div className={classes.tabTitle}>
                            {cashbox}
                            {type === BANK_ID
                                ? <span>банковский счет</span>
                                : <span>наличные</span>
                            }
                        </div>
                        <div className={classes.tabText}>
                            <div>БАЛАНС</div>
                            <span>{balance} {currency}</span>
                        </div>
                    </div>
                </Link>
            </Paper>
        </div>
        )
    })

    return (
        <Container>
            <SubMenu url={ROUTES.STAT_CASHBOX_LIST_URL}/>
            <div className={classes.manufactures}>
                <div className={classes.tabWrapper}>
                    {manufactureList}
                </div>
            </div>

            <div className={classes.stats}>
                <div className={classes.statTitle}>
                    <div>Доходы / Расходы</div>
                    <div><a>6 мая 2017 г. - 12 мая 2017 г.</a></div>
                </div>
                <Row className={classes.diagram}>
                    <Col xs={9}>
                        chart
                    </Col>
                    <Col xs={3} className={classes.balanceInfo}>
                        <div className={classes.balance}>
                            <div>Доходы</div>
                            <div>1 000 000 <span>UZS</span></div>
                        </div>
                        <div className={classes.balance}>
                            <div>Расходы</div>
                            <div>- 1 000 000 <span>UZS</span></div>
                        </div>
                        <div className={classes.balance}>
                            <div>Прибыль</div>
                            <div>1 000 000 <span>UZS</span></div>
                        </div>
                    </Col>
                </Row>
                <div className={classes.statTitle}>
                    <div>Расходы по категории</div>
                </div>
            </div>
            <StatCashboxCreateDialog
                isUpdate={true}
                initialValues={updateDialog.initialValues}
                open={updateDialog.openUpdateDialog}
                loading={updateDialog.updateLoading}
                onClose={updateDialog.handleCloseUpdateDialog}
                onSubmit={updateDialog.handleSubmitUpdateDialog}
            />

            <StatCashboxCreateDialog
                open={createDialog.openCreateDialog}
                loading={createDialog.createLoading}
                onClose={createDialog.handleCloseCreateDialog}
                onSubmit={createDialog.handleSubmitCreateDialog}
            />

            <Dialog
                open={_.get(orderData, 'orderDetailOpen')}
                modal={true}
                onRequestClose={orderData.handleOrderDetailClose}
                bodyClassName={classes.popUp}
                autoScrollBodyContent={true}>
                <StatCashboxOrderDetails
                    key={_.get(orderData, 'id')}
                    data={_.get(orderData, 'orderDetail') || {}}
                    loading={_.get(orderData, 'detailLoading')}
                    handleOrderClick={orderData.handleOrderClick}
                    close={orderData.handleOrderDetailClose}
                />
            </Dialog>

            {detailData.data && <ConfirmDialog
                type="delete"
                message="adfdasf"
                onClose={confirmDialog.handleCloseConfirmDialog}
                onSubmit={confirmDialog.handleSendConfirmDialog}
                open={confirmDialog.openConfirmDialog}
            />}
        </Container>
    )
})

StatCashboxGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    createDialog: PropTypes.shape({
        createLoading: PropTypes.bool.isRequired,
        openCreateDialog: PropTypes.bool.isRequired,
        handleOpenCreateDialog: PropTypes.func.isRequired,
        handleCloseCreateDialog: PropTypes.func.isRequired,
        handleSubmitCreateDialog: PropTypes.func.isRequired
    }).isRequired,
    confirmDialog: PropTypes.shape({
        openConfirmDialog: PropTypes.bool.isRequired,
        handleOpenConfirmDialog: PropTypes.func.isRequired,
        handleCloseConfirmDialog: PropTypes.func.isRequired,
        handleSendConfirmDialog: PropTypes.func.isRequired
    }).isRequired,
    updateDialog: PropTypes.shape({
        updateLoading: PropTypes.bool.isRequired,
        openUpdateDialog: PropTypes.bool.isRequired,
        handleOpenUpdateDialog: PropTypes.func.isRequired,
        handleCloseUpdateDialog: PropTypes.func.isRequired,
        handleSubmitUpdateDialog: PropTypes.func.isRequired
    }).isRequired,
    orderData: PropTypes.object
}

export default StatCashboxGridList
