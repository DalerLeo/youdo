import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import ModEditorIcon from 'material-ui/svg-icons/editor/mode-edit'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import * as ROUTES from '../../constants/routes'
import GridList from '../GridList'
import Container from '../Container'
import TransactionFilterForm from './TransactionFilterForm'
import TransactionCreateDialog from './TransactionCreateDialog'
import ConfirmDialog from '../ConfirmDialog'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import Paper from 'material-ui/Paper'
import CashPayment from '../CashPayment'
import BankPayment from '../BankPayment'
import CircularProgress from 'material-ui/CircularProgress'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import Edit from 'material-ui/svg-icons/image/edit'

const listHeader = [
    {
        sorting: true,
        name: 'id',
        title: 'Id',
        xs: 1
    },
    {
        sorting: true,
        name: 'comment',
        title: 'Описание',
        xs: 5
    },
    {
        sorting: true,
        name: 'date',
        title: 'Дата',
        xs: 2
    },
    {
        sorting: true,
        name: 'amount',
        title: 'Сумма',
        xs: 2
    }
]

const enhance = compose(
    injectSheet({
        wrap: {
            display: 'flex',
            margin: '0 -28px',
            padding: '0 28px 0 0',
            minHeight: 'calc(100% - 8px)'
        },
        listWrapper: {
            border: '1px solid #d9dde1',
            borderBottom: 'none',
            height: '100%'
        },
        leftSide: {
            flexBasis: '25%'
        },
        rightSide: {
            flexBasis: '75%',
            marginLeft: '28px'
        },
        list: {
            borderBottom: '1px solid #d9dde1',
            display: 'flex',
            padding: '20px 30px',
            margin: '0',
            boxSizing: 'border-box',
            cursor: 'pointer',
            justifyContent: 'space-between'
        },
        flex: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        outerTitle: {
            extend: 'flex',
            fontWeight: '600',
            paddingBottom: '10px',
            paddingTop: '5px',
            '& a': {
                padding: '2px 10px',
                border: '1px solid',
                borderRadius: '2px',
                marginLeft: '12px'
            }
        },
        btnAdd: {
            color: '#8acb8d !important'
        },
        btnRemove: {
            color: '#e57373 !important'
        },
        title: {
            fontWeight: '600',
            '& span': {
                fontSize: '11px !important',
                display: 'block',
                color: '#999'
            }
        },
        green: {
            color: '#92ce95'
        },
        red: {
            color: '#e57373'
        }
    }),
)

const TransactionGridList = enhance((props) => {
    const {
        filter,
        createDialog,
        updateDialog,
        filterDialog,
        cashboxData,
        actionsDialog,
        cashboxListLoading,
        confirmDialog,
        listData,
        detailData,
        classes
    } = props

    const actions = (
        <div>
            <IconButton onTouchTap={actionsDialog.handleActionEdit}>
                <ModEditorIcon />
            </IconButton>

            <IconButton onTouchTap={actionsDialog.handleActionDelete}>
                <DeleteIcon />
            </IconButton>
        </div>
    )

    const transactionFilterDialog = (
        <TransactionFilterForm
            initialValues={filterDialog.initialValues}
            filter={filter}
            filterDialog={filterDialog}
        />
    )

    const transactionDetail = (
        <span>a</span>
    )

    const minus = 0
    const expense = 1
    const income = 2

    const transactionList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const comment = _.get(item, 'comment')
        const amount = _.get(item, 'amount') || 'N/A'
        const type = amount < minus ? expense : income
        const createdDate = moment(_.get(item, 'createdDate')).format('DD.MM.YYYY')
        const iconButton = (
            <IconButton style={{padding: '0 12px'}}>
                <MoreVertIcon />
            </IconButton>
        )
        return (
            <Row key={id}>
                <Col xs={1}>{id}</Col>
                <Col xs={5}>{comment}</Col>
                <Col xs={2}>{createdDate}</Col>
                <Col xs={2}>{amount}</Col>
                <Col xs={2} style={{textAlign: 'right'}}>
                    <IconMenu
                        iconButtonElement={iconButton}
                        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                        targetOrigin={{horizontal: 'right', vertical: 'top'}}>
                        <MenuItem
                            primaryText="Изменить"
                            leftIcon={<Edit />}
                            onTouchTap={() => { updateDialog.handleOpenUpdateDialog(id, type) }}
                        />
                        <MenuItem
                            primaryText="Удалить "
                            leftIcon={<DeleteIcon />}
                            onTouchTap={() => { confirmDialog.handleOpenConfirmDialog(id) }}
                        />
                    </IconMenu>
                </Col>
            </Row>
        )
    })
    const cashboxList = _.map(_.get(cashboxData, 'data'), (item, index) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const currency = _.get(item, ['currency', 'name'])
        const type = _.toInteger(_.get(item, 'type'))
        const balance = _.toInteger(_.get(item, 'balance'))
        const isActive = item.id === _.get(cashboxData, 'cashboxId')
        const BANK_ID = 1
        const ZERO_NUM = 0
        return (
            <div key={id} className={classes.list} onClick={() => {
                cashboxData.handleClickCashbox(id)
            } }
                 style={isActive ? {backgroundColor: '#ffffff'} : {backgroundColor: '#f2f5f8'}}>
                <div>
                    <div className={classes.title}>{name}</div>
                    <div className={item.id === cashboxData.cashboxId}>
                        {type === BANK_ID
                            ? <div className={classes.flex}>
                                <BankPayment style={{height: '14px', width: '14px', color: '#6261b0'}}/>
                                <span style={{marginLeft: '5px', color: '#6261b0'}}>банковский счет</span>
                            </div>
                            : <div className={classes.flex}>
                                <CashPayment style={{height: '14px', width: '14px', color: '#12aaeb'}}/>
                                <span style={{marginLeft: '5px', color: '#12aaeb'}}>наличные</span>
                            </div>
                        }
                    </div>
                </div>
                <div style={{textAlign: 'right'}}>
                    <div className={balance >= ZERO_NUM ? classes.green : classes.red}>{balance}</div>
                    <div>{currency}</div>
                </div>
            </div>
        )
    })

    const list = {
        header: listHeader,
        list: transactionList,
        loading: _.get(listData, 'listLoading')
    }
    const AllCashboxId = 0

    return (
        <Container>
            <SubMenu url={ROUTES.TRANSACTION_LIST_URL}/>

            <div className={classes.wrap}>
                <div className={classes.leftSide}>
                    <div className={classes.outerTitle} style={{paddingLeft: '30px'}}>
                        <div>Кассы</div>
                    </div>
                    <Paper zDepth={2} style={{height: '100%'}}>
                        <div className={classes.listWrapper}>
                            <div className={classes.list}
                                 onClick={() => { cashboxData.handleClickCashbox(AllCashboxId) } }
                                 style={_.get(cashboxData, 'cashboxId') === AllCashboxId ? {backgroundColor: '#ffffff'} : {backgroundColor: '#f2f5f8'}}>
                                <div className={classes.title}>
                                    Общий объем
                                    <span>во всех классах</span>
                                </div>
                            </div>
                            {cashboxListLoading &&
                            <div style={{textAlign: 'center'}}>
                                <CircularProgress size={100} thickness={6} />
                            </div>
                            }
                            {cashboxList}
                        </div>
                    </Paper>
                </div>
                <div className={classes.rightSide}>
                    <div className={classes.outerTitle}>
                       <div>Транзакции выбранной кассы</div>
                        <div className={classes.buttons}>
                            <a onClick={createDialog.handleOpenCreateDialog} className={classes.btnAdd}>+ Доход</a>
                            <a onClick={createDialog.handleOpenCreateDialog} className={classes.btnRemove}>- Расход</a>
                        </div>
                    </div>

                    <GridList
                        filter={filter}
                        list={list}
                        detail={transactionDetail}
                        actionsDialog={actions}
                        filterDialog={transactionFilterDialog}
                    />

                    <TransactionCreateDialog
                        cashboxData={cashboxData}
                        open={createDialog.openCreateDialog}
                        loading={createDialog.createLoading}
                        onClose={createDialog.handleCloseCreateDialog}
                        onSubmit={createDialog.handleSubmitCreateDialog}
                    />

                    <TransactionCreateDialog
                        initialValues={updateDialog.initialValues}
                        isUpdate={true}
                        open={updateDialog.openUpdateDialog}
                        loading={updateDialog.updateLoading}
                        onClose={updateDialog.handleCloseUpdateDialog}
                        onSubmit={updateDialog.handleSubmitUpdateDialog}
                    />
                    {detailData.data && <ConfirmDialog
                        type="delete"
                        message={_.get(detailData, ['data', 'comment'])}
                        onClose={confirmDialog.handleCloseConfirmDialog}
                        onSubmit={confirmDialog.handleSendConfirmDialog}
                        open={confirmDialog.openConfirmDialog}
                    />}
                </div>
            </div>
        </Container>
    )
})

TransactionGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    cashboxData: PropTypes.object,
    cashboxListLoading: PropTypes.bool,
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
    actionsDialog: PropTypes.shape({
        handleActionEdit: PropTypes.func.isRequired,
        handleActionDelete: PropTypes.func.isRequired
    }).isRequired,
    filterDialog: PropTypes.shape({
        initialValues: PropTypes.object,
        filterLoading: PropTypes.bool,
        openFilterDialog: PropTypes.bool.isRequired,
        handleOpenFilterDialog: PropTypes.func.isRequired,
        handleCloseFilterDialog: PropTypes.func.isRequired,
        handleSubmitFilterDialog: PropTypes.func.isRequired
    }).isRequired
}

export default TransactionGridList
