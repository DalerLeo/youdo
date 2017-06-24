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
import ClientTransactionFilterForm from './ClientTransactionFilterForm'
import ClientTransactionCreateDialog from './ClientTransactionCreateDialog'
import ClientTransactionSendDialog from './ClientTransactionSendDialog'
import ConfirmDialog from '../ConfirmDialog'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import Paper from 'material-ui/Paper'
import CircularProgress from 'material-ui/CircularProgress'
import numberFormat from '../../helpers/numberFormat'
import GridListNavSearch from '../GridList/GridListNavSearch'

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
        xs: 3
    },
    {
        sorting: true,
        name: 'amount',
        title: 'Сумма',
        xs: 3
    }
]

const enhance = compose(
    injectSheet({
        wrap: {
            display: 'flex',
            margin: '0 -28px',
            padding: '0 28px 0 0',
            minHeight: 'calc(100% - 41px)'
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
            borderBottom: '1px solid #efefef',
            display: 'flex',
            padding: '20px 30px',
            margin: '0',
            boxSizing: 'border-box',
            cursor: 'pointer',
            justifyContent: 'space-between',
            position: 'relative'
        },
        flex: {
            display: 'flex',
            alignItems: 'center'
        },
        outerTitle: {
            extend: 'flex',
            justifyContent: 'space-between',
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
        balance: {
            textAlign: 'right',
            position: 'absolute',
            right: '30px'
        },
        btnSend: {
            color: '#12aaeb !important'
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
        rightTitle: {
            extend: 'flex',
            justifyContent: 'space-between'
        },
        green: {
            color: '#92ce95 !important'
        },
        red: {
            color: '#e57373 !important'
        }
    }),
)

const ClientTransactionGridList = enhance((props) => {
    const {
        filter,
        filterClient,
        createExpenseDialog,
        createIncomeDialog,
        updateExpenseDialog,
        updateIncomeDialog,
        createSendDialog,
        filterDialog,
        clientData,
        actionsDialog,
        clientListLoading,
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

    const clientTransactionFilterDialog = (
        <ClientTransactionFilterForm
            initialValues={filterDialog.initialValues}
            filter={filter}
            filterDialog={filterDialog}
        />
    )

    const clientTransactionDetail = (
        <span>a</span>
    )

    const clientTransactionList = _.map(_.get(listData, 'data'), (item) => {
        const zero = 0
        const id = _.get(item, 'id')
        const comment = _.get(item, 'comment')
        const type = _.get(item, 'amount') || 'N/A'
        const amount = numberFormat(_.get(item, 'amount')) || 'N/A'
        const createdDate = moment(_.get(item, 'createdDate')).format('DD.MM.YYYY HH:mm')
        const currency = _.get(item, ['currency', 'name']) || 'N/A'

        return (
            <Row key={id}>
                <Col xs={1}>{id}</Col>
                <Col xs={5}>{comment}</Col>
                <Col xs={3}>{createdDate}</Col>
                <Col className={type >= zero ? classes.green : classes.red} xs={3}>{amount} {currency}</Col>
            </Row>
        )
    })
    const clientList = _.map(_.get(clientData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const isActive = _.get(detailData, 'id') === id
        return (
            <div key={id} className={classes.list}
                 onTouchTap={() => { clientData.handleClickClient(id) }}
                 style={isActive ? {backgroundColor: '#ffffff'} : {backgroundColor: '#f2f5f8'}}>
                <div>
                    <div className={classes.title}>{name}</div>
                </div>
            </div>
        )
    })

    const list = {
        header: listHeader,
        list: clientTransactionList,
        loading: _.get(listData, 'listLoading')
    }
    const AllClientId = 0
    const selectedClient = _.find(_.get(clientData, 'data'),
        (o) => {
            return _.toInteger(o.id) === _.toInteger(_.get(clientData, 'cashboxId'))
        })
    const cashboxName = _.get(clientData, 'cashboxId') === AllClientId ? 'Общий объем' : _.get(selectedClient, 'name')
    return (
        <Container>
            <SubMenu url={ROUTES.CLIENT_TRANSACTION_LIST_URL}/>

            <div className={classes.wrap}>
                <div className={classes.leftSide}>
                    <div className={classes.outerTitle} style={{paddingLeft: '30px'}}>
                        <div>Кассы</div>
                    </div>
                    <Paper zDepth={2} style={{height: '100%'}}>
                        <div className={classes.listWrapper}>
                            <div>
                                <GridListNavSearch filter={filterClient} filterIsEmpty={false}/>
                                <input type="text"/>
                            </div>
                            <div className={classes.list}
                                 onClick={() => {
                                     clientData.handleClickClient(AllClientId)
                                 } }
                                 style={_.get(clientData, 'clientId') === AllClientId ? {backgroundColor: '#ffffff'} : {backgroundColor: '#f2f5f8'}}>
                                <div className={classes.title}>
                                    Общий объем
                                    <span>во всех классах</span>
                                </div>
                            </div>
                            {clientListLoading
                                ? <div style={{textAlign: 'center'}}>
                                    <CircularProgress size={100} thickness={6}/>
                                </div>
                                : clientList
                            }
                        </div>
                    </Paper>
                </div>
                <div className={classes.rightSide}>
                    <div className={classes.rightTitle}>
                        <div className={classes.outerTitle}>{cashboxName}</div>
                        { _.get(clientData, 'cashboxId') !== AllClientId && <div className={classes.outerTitle}>
                            <div className={classes.buttons}>
                                <a onClick={createIncomeDialog.handleOpenDialog} className={classes.btnAdd}>+ Доход</a>
                                <a onClick={createExpenseDialog.handleOpenDialog} className={classes.btnRemove}>-
                                    Расход</a>
                            </div>
                        </div>}
                    </div>

                    <GridList
                        filter={filter}
                        list={list}
                        detail={clientTransactionDetail}
                        actionsDialog={actions}
                        filterDialog={clientTransactionFilterDialog}
                    />

                    <ClientTransactionCreateDialog
                        isExpense={true}
                        clientData={clientData}
                        open={createExpenseDialog.open}
                        loading={createExpenseDialog.loading}
                        onClose={createExpenseDialog.handleCloseDialog}
                        onSubmit={createExpenseDialog.handleSubmitDialog}
                    />

                    <ClientTransactionCreateDialog
                        clientData={clientData}
                        open={createIncomeDialog.open}
                        loading={createIncomeDialog.loading}
                        onClose={createIncomeDialog.handleCloseDialog}
                        onSubmit={createIncomeDialog.handleSubmitDialog}
                    />

                    <ClientTransactionCreateDialog
                        initialValues={updateExpenseDialog.initialValues}
                        isUpdate={true}
                        isExpense={true}
                        open={updateExpenseDialog.open}
                        loading={updateExpenseDialog.loading}
                        onClose={updateExpenseDialog.handleCloseUpdateDialog}
                        onSubmit={updateExpenseDialog.handleSubmitUpdateDialog}
                    />

                    <ClientTransactionCreateDialog
                        initialValues={updateIncomeDialog.initialValues}
                        isUpdate={true}
                        open={updateIncomeDialog.open}
                        loading={updateIncomeDialog.loading}
                        onClose={updateIncomeDialog.handleCloseUpdateDialog}
                        onSubmit={updateIncomeDialog.handleSubmitUpdateDialog}
                    />

                    <ClientTransactionSendDialog
                        clientData={clientData}
                        open={createSendDialog.open}
                        loading={createSendDialog.loading}
                        onClose={createSendDialog.handleCloseDialog}
                        onSubmit={createSendDialog.handleSubmitDialog}
                    />

                    {detailData.data && <ConfirmDialog
                        type="delete"
                        message={_.get(detailData, ['data', 'comment'])}
                        onClose={confirmDialog.handleCloseConfirmDialog}
                        onSubmit={confirmDialog.handleExpenseConfirmDialog}
                        open={confirmDialog.open}
                    />}
                </div>
            </div>
        </Container>
    )
})

ClientTransactionGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    clientData: PropTypes.object,
    clientListLoading: PropTypes.bool,
    detailData: PropTypes.object,
    createExpenseDialog: PropTypes.shape({
        loading: PropTypes.bool.isRequired,
        open: PropTypes.bool.isRequired,
        handleOpenDialog: PropTypes.func.isRequired,
        handleCloseDialog: PropTypes.func.isRequired,
        handleSubmitDialog: PropTypes.func.isRequired
    }).isRequired,
    createIncomeDialog: PropTypes.shape({
        loading: PropTypes.bool.isRequired,
        open: PropTypes.bool.isRequired,
        handleOpenDialog: PropTypes.func.isRequired,
        handleCloseDialog: PropTypes.func.isRequired,
        handleSubmitDialog: PropTypes.func.isRequired
    }).isRequired,
    updateExpenseDialog: PropTypes.shape({
        loading: PropTypes.bool.isRequired,
        open: PropTypes.bool.isRequired,
        handleOpenUpdateDialog: PropTypes.func.isRequired,
        handleCloseUpdateDialog: PropTypes.func.isRequired,
        handleSubmitUpdateDialog: PropTypes.func.isRequired
    }).isRequired,
    updateIncomeDialog: PropTypes.shape({
        loading: PropTypes.bool.isRequired,
        open: PropTypes.bool.isRequired,
        handleOpenUpdateDialog: PropTypes.func.isRequired,
        handleCloseUpdateDialog: PropTypes.func.isRequired,
        handleSubmitUpdateDialog: PropTypes.func.isRequired
    }).isRequired,
    createSendDialog: PropTypes.shape({
        loading: PropTypes.bool.isRequired,
        open: PropTypes.bool.isRequired,
        handleOpenDialog: PropTypes.func.isRequired,
        handleCloseDialog: PropTypes.func.isRequired,
        handleSubmitDialog: PropTypes.func.isRequired
    }).isRequired,
    confirmDialog: PropTypes.shape({
        open: PropTypes.bool.isRequired,
        handleOpenConfirmDialog: PropTypes.func.isRequired,
        handleCloseConfirmDialog: PropTypes.func.isRequired,
        handleExpenseConfirmDialog: PropTypes.func.isRequired
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

export default ClientTransactionGridList
