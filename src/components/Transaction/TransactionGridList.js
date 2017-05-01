import _ from 'lodash'
import moment from 'moment'
import sprintf from 'sprintf'
import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import ModEditorIcon from 'material-ui/svg-icons/editor/mode-edit'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import * as ROUTES from '../../constants/routes'
import GridList from '../GridList'
import Container from '../Container'
import TransactionFilterForm from './TransactionFilterForm'
import TransactionDetails from './TransactionDetails'
import TransactionCreateDialog from './TransactionCreateDialog'
import DeleteDialog from '../DeleteDialog'
import ConfirmDialog from '../ConfirmDialog'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import {compose, withState} from 'recompose'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import Tooltip from '../ToolTip'
import CashPayment from  '../CashPayment'
import BankPayment from '../BankPayment'

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
    withState('state', 'setState', null)
)

const TransactionGridList = enhance((props) => {
    const {
        state,
        setState,
        filter,
        createDialog,
        updateDialog,
        filterDialog,
        cashboxData,
        actionsDialog,
        confirmDialog,
        deleteDialog,
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
        <TransactionDetails
            key={_.get(detailData, 'id')}
            data={_.get(detailData, 'data') || {}}
            deleteDialog={deleteDialog}
            confirmDialog={confirmDialog}
            loading={_.get(detailData, 'detailLoading')}
            handleOpenUpdateDialog={updateDialog.handleOpenUpdateDialog}
        />
    )

    const transactionList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const comment = _.get(item, 'comment')
        const amount = _.get(item, 'amount') || 'N/A'
        const createdDate = moment(_.get(item, 'createdDate')).format('DD.MM.YYYY')

        return (
            <Row key={id}>
                <Col xs={1}>{id}</Col>
                <Col xs={5}>
                    <Link to={{
                        pathname: sprintf(ROUTES.TRANSACTION_ITEM_PATH, id),
                        query: filter.getParams()
                    }}>{comment}</Link>
                </Col>
                <Col xs={2}>{amount}</Col>
                <Col xs={2}>{createdDate}</Col>
                <Col xs={2}></Col>
            </Row>
        )
    })
    const cashboxList = _.map(_.get(cashboxData, 'data'), (item, index) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const type = _.get(item, 'type')
        const cashier = _.toInteger(_.get(item, 'cashier'))
        const balance = _.toInteger(_.get(item, 'balance'))

        return (
            <Row key={id} className={classes.row} onTouchTap={() => setState(index)}
                 style={state === index ? {backgroundColor: '#ffffff'} : {backgroundColor: '#f2f5f8'}}>
                <Col xs={8}>
                    <div>{name}</div>
                    <div className={state === index && classes.blue}>
                        {cashier === 1
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
                    <div className={state === index && classes.red}>{balance}</div>
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

    return (
        <Container>
            <SubMenu url={ROUTES.TRANSACTION_LIST_URL}/>

            <div className={classes.addButtonWrapper}>
                <Tooltip position="left" text="Добавить магазин">
                    <FloatingActionButton
                        mini={true}
                        className={classes.addButton}
                        onTouchTap={createDialog.handleOpenCreateDialog}>
                        <ContentAdd />
                    </FloatingActionButton>
                </Tooltip>
            </div>

            <div className={classes.flex}>
                <Col xs={3}>
                    <div className={classes.listWrapper}>
                        <Row className={classes.row}
                             style={state !== null ? {backgroundColor: '#f2f5f8'} : {backgroundColor: '#ffffff'}}>
                            <div className={classes.title}>Общий объем</div>
                            <br/>
                            <div className={classes.end}>во всех классах</div>
                        </Row>
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
                        open={createDialog.openCreateDialog}
                        loading={createDialog.createLoading}
                        onClose={createDialog.handleCloseCreateDialog}
                        onSubmit={createDialog.handleSubmitCreateDialog}
                    />

                    <TransactionCreateDialog
                        initialValues={updateDialog.initialValues}
                        open={updateDialog.openUpdateDialog}
                        loading={updateDialog.updateLoading}
                        onClose={updateDialog.handleCloseUpdateDialog}
                        onSubmit={updateDialog.handleSubmitUpdateDialog}
                    />

                    <DeleteDialog
                        filter={filter}
                        open={deleteDialog.openDeleteDialog}
                        onClose={deleteDialog.handleCloseDeleteDialog}
                    />

                    {detailData.data && <ConfirmDialog
                        type="delete"
                        message={_.get(detailData, ['data', 'name'])}
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
    deleteDialog: PropTypes.shape({
        openDeleteDialog: PropTypes.bool.isRequired,
        handleOpenDeleteDialog: PropTypes.func.isRequired,
        handleCloseDeleteDialog: PropTypes.func.isRequired
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
