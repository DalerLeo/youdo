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
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import Tooltip from '../ToolTip'
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
        flex: {
            display: 'flex'
        },
        listWrapper: {
            boxShadow: '2px 2px 3px #c3c5c7',
            border: '1px solid #d2d3d5',
            borderTop: 'none',
            height: '100%',
            width: '24%',
            position: 'absolute',
            marginLeft: '-36px',
            paddingRight: '8px'
        },
        row: {
            borderTop: '1px solid #c3c5c7',
            padding: '15px 5px 15px 35px',
            boxSizing: 'border-box',
            '& > div:nth-child(2)> div': {
                textAlign: 'right'
            },
            '& > div:nth-child(2)> div:first-child': {
                color: '#92ce95',
                marginBottom: '5px'
            },
            '& > div:first-child > div:first-child': {
                marginBottom: '5px',
                fontWeight: 'bold'
            },
            '& > div:first-child > div:nth-child(2)': {
                color: '#409bcc'
            }
        },
        red: {
            color: '#e57373 !important'
        },
        blue: {
            color: '#6f6fb5 !important'
        },
        desc: {
            transform: 'translate(5%,0%)',
            position: 'absolute'
        },
        title: {
            fontWeight: 'bold'
        },
        end: {
            color: '#b1b2b3',
            width: '100%'
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
                <Col xs={2}>
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
        const type = _.toInteger(_.get(item, 'type'))
        const balance = _.toInteger(_.get(item, 'balance'))
        const isActive = item.id === _.get(cashboxData, 'cashboxId')
        const BANK_ID = 1

        return (
            <Row key={id} className={classes.row} onTouchTap={() => {
                cashboxData.handleClickCashbox(id)
            } }
                 style={isActive ? {backgroundColor: '#ffffff'} : {backgroundColor: '#f2f5f8'}}>
                <Col xs={8}>
                    <div>{name}</div>
                    <div className={item.id === cashboxData.cashboxId && classes.blue}>
                        {type === BANK_ID
                            ? <div>
                                <BankPayment style={{height: '16px', width: '16px'}}/>
                                <span className={classes.desc}>банковский счет</span>
                            </div>
                            : <div>
                                <CashPayment style={{height: '16px', width: '16px'}}/>
                                <span className={classes.desc}>наличные</span>
                            </div>
                        }
                    </div>
                </Col>
                <Col xs={4}>
                    <div className={item.id === cashboxData.cashboxId && classes.red}>{balance}</div>
                    <div>{type}</div>
                </Col>
            </Row>
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

            <div className={classes.addButtonWrapper}>
                <Tooltip position="left" text="Расход">
                    <FloatingActionButton
                        mini={true}
                        className={classes.addButton}
                        onTouchTap={createDialog.handleOpenCreateDialog}>
                        <ContentAdd />
                    </FloatingActionButton>
                </Tooltip>
                <Tooltip position="left" text="Доход">
                    <FloatingActionButton
                        mini={true}
                        className={classes.addButton}
                        onTouchTap={createDialog.handleOpenCreateDialog}
                    >
                        <ContentAdd />
                    </FloatingActionButton>
                </Tooltip>
            </div>

            <div className={classes.flex}>
                <Col xs={3}>
                    <div className={classes.listWrapper}>
                        <Row className={classes.row}
                             onTouchTap={() => { cashboxData.handleClickCashbox(AllCashboxId) } }
                             style={_.get(cashboxData, 'cashboxId') === AllCashboxId ? {backgroundColor: '#ffffff'} : {backgroundColor: '#f2f5f8'}}>
                            <div className={classes.title}>Общий объем</div>
                            <br/>
                            <div className={classes.end}>во всех классах</div>
                        </Row>
                        {cashboxListLoading &&
                            <div style={{textAlign: 'center'}}>
                                <CircularProgress size={100} thickness={6} />
                            </div>
                        }
                        {cashboxList}
                    </div>
                </Col>
                <Col xs={9}>
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
                </Col>
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
