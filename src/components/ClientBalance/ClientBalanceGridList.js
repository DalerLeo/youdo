import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import * as ROUTES from '../../constants/routes'
import GridList from '../GridList'
import Container from '../Container'
import ClientBalanceInfoDialog from './ClientBalanceInfoDialog'
import ClientBalanceCreateDialog from './ClientBalanceCreateDialog'
import ClientBalanceUpdateDialog from './ClientBalanceUpdateDialog'
import CircularProgress from 'material-ui/CircularProgress'
import ClientBalanceReturnDialog from './ClientBalanceReturnDialog'
import {Field, reduxForm} from 'redux-form'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import {compose, withState} from 'recompose'
import numberFormat from '../../helpers/numberFormat'
import getConfig from '../../helpers/getConfig'
import IconButton from 'material-ui/IconButton'
import Cancel from 'material-ui/svg-icons/content/remove-circle'
import Add from 'material-ui/svg-icons/content/add-circle'
import ReturnIcon from 'material-ui/svg-icons/content/reply'
import Tooltip from '../ToolTip'
import Paper from 'material-ui/Paper'
import SearchIcon from 'material-ui/svg-icons/action/search'

import {TextField} from '../ReduxForm/index'
import Pagination from '../GridList/GridListNavPagination'
let amountValues = []
let head = []
const DIVISION = {
    SHAMPUN: 2,
    KOSMETIKA: 1
}

const enhance = compose(
    injectSheet({
        loader: {
            width: '100%',
            height: '300px',
            background: '#fff',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex'
        },
        listRow: {
            margin: '0 -30px !important',
            padding: '0 30px',
            width: 'auto !important',
            '&:hover button': {
                opacity: '1'
            }
        },
        rightAlign: {
            textAlign: 'right',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            '& > div': {
                position: 'absolute',
                right: '-15px'
            },
            '& button': {
                opacity: '0',
                '& > div': {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }
            },
            '& span': {
                cursor: 'pointer'
            }
        },
        red: {
            color: '#e27676',
            fontWeight: '600'
        },
        green: {
            fontWeight: '600',
            color: '#92ce95'
        },
        balance: {
            textAlign: 'right',
            fontWeight: '600',
            '& span': {
                cursor: 'pointer'
            }
        },
        tableRow: {
            '& td': {
                borderRight: '1px #efefef solid',
                textAlign: 'left'
            },
            '&:nth-child(even)': {
                backgroundColor: '#f4f4f4'
            }
        },
        leftTable: {
            display: 'table',
            width: '100%',
            '& > div': {
                '&:nth-child(even)': {
                    backgroundColor: '#f4f4f4'
                },
                display: 'table-row',
                height: '40px',
                '&:nth-child(2)': {
                    height: '39px'
                },
                '&:first-child': {
                    backgroundColor: 'white',
                    height: '41px',
                    '& span': {
                        borderTop: '1px #efefef solid',
                        borderBottom: '1px #efefef solid'
                    }
                },
                '& span': {
                    display: 'table-cell',
                    verticalAlign: 'middle',
                    padding: '0 10px 0 30px'
                }
            }
        },
        tableWrapper: {
            display: 'flex',
            marginLeft: '-30px',
            paddingLeft: '30px',
            '& > div:first-child': {
                zIndex: '4',
                flexBasis: '25%',
                maxWidth: '25%',
                boxShadow: '5px 0 8px -3px #CCC'
            },
            '& > div:nth-child(2)': {
                flexBasis: '63%',
                maxWidth: '63%',
                overflowX: 'auto',
                overflowY: 'hidden'
            },
            '& > div:nth-child(3)': {
                flexBasis: '12%',
                maxWidth: '12%'

            }
        },
        inputFieldCustom: {
            fontSize: '13px !important',
            height: '45px !important',
            marginTop: '7px',
            '& div': {
                fontSize: '13px !important'
            },
            '& label': {
                top: '20px !important',
                lineHeight: '5px !important'
            },
            '& input': {
                marginTop: '0 !important'
            }
        },
        mainTable: {
            width: '100%',
            minWidth: '750px',
            color: '#666',
            borderCollapse: 'collapse',
            '& tr, td': {
                height: '40px'
            },
            '& td': {
                padding: '0 20px',
                minWidth: '80px'
            }
        },
        title: {
            fontWeight: '600',
            '& tr, td': {
                border: '1px #efefef solid'
            }
        },
        nav: {
            height: '55px',
            padding: '0 30px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }
    }),
    reduxForm({
        form: 'ClientBalanceForm',
        enableReinitialize: true
    }),
    withState('currentItem', 'setItem', null)

)

const searchIconStyle = {
    icon: {
        width: 24,
        height: 24
    },
    button: {
        width: 30,
        height: 30,
        padding: 0
    }
}
const iconStyle = {
    icon: {
        width: 22,
        height: 22
    },
    button: {
        width: 30,
        height: 30,
        padding: 0
    }
}

const MINUS_ONE = -1
const ZERO = 0
const ClientBalanceGridList = enhance((props) => {
    const {
        classes,
        filter,
        createDialog,
        addDialog,
        filterItem,
        infoDialog,
        listData,
        detailData,
        clientReturnDialog,
        superUser,
        currentItem,
        setItem,
        handleSubmit,
        handleSubmitSearch
    } = props
    const name1 = _.get(listData, ['data', '0', 'division', '0', 'name'])
    const name2 = _.get(listData, ['data', '0', 'division', '1', 'name'])
    const primaryCurrency = getConfig('PRIMARY_CURRENCY')

    const clients = (
        <div className={classes.leftTable}>
            <div><span>Клиент</span></div>
            {_.map(_.get(listData, 'data'), (item) => {
                const id = _.get(item, 'id')
                const name = _.get(item, 'name') || 'No'
                return (
                    <div key={id}><span>{name}</span></div>
                )
            })}
        </div>
    )
    const buttons = (
        <div className={classes.leftTable}>
            <div><span> </span></div>
            {_.map(_.get(listData, 'data'), (item) => {
                const id = _.get(item, 'id')
                return (
                    <div key={id} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Tooltip position="bottom" text="Возврат с клиента">
                            <IconButton
                                iconStyle={iconStyle.icon}
                                style={iconStyle.button}
                                touch={true}
                                onTouchTap={() => {
                                    clientReturnDialog.handleOpenClientReturnDialog(id)
                                }}>
                                <ReturnIcon color="#666"/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip position="bottom" text="Списать">
                            <IconButton
                                iconStyle={iconStyle.icon}
                                style={iconStyle.button}
                                touch={true}
                                onTouchTap={() => {
                                    createDialog.handleOpenCreateDialog(id)
                                }}>
                                <Cancel color='#f44336'/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip position="bottom" text="Добавить">
                            <IconButton
                                iconStyle={iconStyle.icon}
                                style={iconStyle.button}
                                touch={true}
                                onTouchTap={() => {
                                    addDialog.handleOpenAddDialog(id)
                                }}>
                                <Add color='#8dc572'/>
                            </IconButton>
                        </Tooltip>
                    </div>
                )
            })}
        </div>
    )
    head = []
    _.map(_.get(listData, ['data', '0', 'divisions']), (item) => {
        head.push(item.name + ' нал.')
        head.push(item.name + ' переч.')
    })

    const tableList = (
        <table className={classes.mainTable}>
            <tbody>
            <tr className={classes.title}>
                <td>Кол-во заказов</td>
                {_.map(head, (item, index) => {
                    return (
                        <td key={index}>{item}</td>
                    )
                })}
            </tr>

            {_.map(_.get(listData, 'data'), (item) => {
                const id = _.get(item, 'id')
                const orderNo = numberFormat(_.get(item, 'orders'))
                amountValues = []
                _.map(_.get(item, 'divisions'), (child) => {
                    amountValues.push({amount: _.get(child, 'cash'), type: 'cash', id: _.get(child, 'id')})
                    amountValues.push({amount: _.get(child, 'bank'), type: 'bank', id: _.get(child, 'id')})
                })
                return (
                    <tr key={id} className={classes.tableRow}>
                        <td>{orderNo}</td>
                        {_.map(amountValues, (val, index) => {
                            const amount = _.get(val, 'amount') || '0'
                            return (
                                <td key={index} style={{cursor: 'pointer'}} onClick={() => {
                                    infoDialog.handleOpenInfoDialog(id, _.get(val, 'id'), _.get(val, 'type'))
                                }}>
                                    <span className={amount > ZERO ? classes.green : amount < ZERO ? classes.red : {}}>{amount} {primaryCurrency}</span>
                                </td>
                            )
                        })}
                    </tr>
                )
            })}
            </tbody>
        </table>
    )
    const lists = (
        <div className={classes.tableWrapper}>
            {clients}
            <div>
                {tableList}
            </div>
            {buttons}
        </div>
    )

    const listHeader = [
        {
            sorting: false,
            name: 'client',
            title: 'Клиент',
            xs: 3
        },
        {
            sorting: true,
            name: 'orders',
            title: 'Кол-во заказов',
            xs: 2
        },
        {
            sorting: true,
            alignRight: true,
            name: 'cosmetics_balance',
            title: name1,
            xs: 2
        },
        {
            sorting: true,
            alignRight: true,
            name: 'shampoo_balance',
            title: name2,
            xs: 2
        },
        {
            sorting: true,
            alignRight: true,
            name: 'shampoo_bank',
            title: 'Баланс шампунь переч.',
            xs: 2
        },
        {
            sorting: false,
            title: '',
            xs: 1
        }
    ]
    const isSuperUser = _.get(superUser, 'isSuperUser')
    const clientBalanceDetail = (
        <span>a</span>
    )
    const clientBalanceList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const cosmeticsBalance = _.toNumber(_.get(item, 'cosmeticsBalance'))
        const shampooBalance = _.toNumber(_.get(item, 'shampooBalance'))
        const shampooBank = _.toNumber(_.get(item, 'shampooBank'))
        const currentCurrency = getConfig('PRIMARY_CURRENCY')
        const orders = numberFormat(_.get(item, 'orders'))
        const clientName = _.get(item, 'name')

        return (
            <Row key={id} className={classes.listRow}>
                <Col xs={3}>{clientName}</Col>
                <Col xs={2}>{orders}</Col>
                <Col xs={2} className={classes.balance}>
                    <span onClick={() => {
                        infoDialog.handleOpenInfoDialog(id, DIVISION.KOSMETIKA)
                    }} className={cosmeticsBalance > ZERO ? classes.green : (cosmeticsBalance < ZERO ? classes.red : classes.black)}>
                        {numberFormat(cosmeticsBalance, currentCurrency)}
                    </span>
                </Col>
                <Col xs={2} className={classes.balance}>
                    <span onClick={() => {
                        infoDialog.handleOpenInfoDialog(id, DIVISION.SHAMPUN, 'cash')
                    }} className={shampooBalance > ZERO ? classes.green : (shampooBalance < ZERO ? classes.red : classes.black)}>
                        {numberFormat(shampooBalance, currentCurrency)}
                    </span>
                </Col>
                <Col xs={2} className={classes.balance}>
                    <span onClick={() => {
                        infoDialog.handleOpenInfoDialog(id, DIVISION.SHAMPUN, 'bank')
                    }} className={shampooBank > ZERO ? classes.green : (shampooBank < ZERO ? classes.red : classes.black)}>
                        {numberFormat(shampooBank, currentCurrency)}
                    </span>
                </Col>
                <Col xs={1} className={classes.rightAlign}>
                    <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                        <Tooltip position="bottom" text="Возврат с клиента">
                            <IconButton
                                iconStyle={iconStyle.icon}
                                style={iconStyle.button}
                                touch={true}
                                onTouchTap={() => {
                                    clientReturnDialog.handleOpenClientReturnDialog(id)
                                }}>
                                <ReturnIcon color="#666"/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip position="bottom" text="Списать">
                            <IconButton
                                iconStyle={iconStyle.icon}
                                style={iconStyle.button}
                                touch={true}
                                onTouchTap={() => {
                                    createDialog.handleOpenCreateDialog(id)
                                }}>
                                <Cancel color='#f44336'/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip position="bottom" text="Добавить">
                            <IconButton
                                iconStyle={iconStyle.icon}
                                style={iconStyle.button}
                                touch={true}
                                onTouchTap={() => {
                                    addDialog.handleOpenAddDialog(id)
                                }}>
                                <Add color='#8dc572'/>
                            </IconButton>
                        </Tooltip>
                    </div>
                </Col>
            </Row>
        )
    })

    const list = {
        header: listHeader,
        list: clientBalanceList,
        loading: _.get(listData, 'listLoading')
    }

    const client = _.find(_.get(listData, 'data'), {'id': _.get(detailData, 'id')})
    const clientName = _.find(_.get(listData, 'data'), {'id': _.toInteger(_.get(clientReturnDialog, 'openClientReturnDialog'))})
    const initialValues = {
        paymentType: {
            value: _.get(currentItem, 'paymentType')
        },
        amount: _.get(currentItem, 'amount'),
        division: {
            value: _.get(currentItem, ['division', 'id'])
        },
        comment: _.get(currentItem, 'comment')
    }

    const navigation = (
        <div className={classes.nav}>
            <form style={{display: 'flex', alignItems: 'center'}} onSubmit={handleSubmit(handleSubmitSearch)}>
                <Field
                    className={classes.inputFieldCustom}
                    component={TextField}
                    name="searching"
                    label="Поиск"
                />
                <IconButton
                    type="submit"
                    iconStyle={searchIconStyle.icon}
                    style={searchIconStyle.button}
                    touch={true}>
                    <SearchIcon color='rgb(204, 204, 204)'/>
                </IconButton>
            </form>
            <Pagination filter={filter}/>
        </div>
    )

    const gridList = (
        <GridList
            filter={filter}
            list={list}
            detail={clientBalanceDetail}
            loading={_.get(listData, 'listLoading')}
        />
    )

    _.get(gridList, 'hello')
    return (
        <Container>
            <SubMenu url={ROUTES.CLIENT_BALANCE_LIST_URL}/>
            <Paper>
                {navigation}
                {_.get(listData, 'listLoading')
                    ? <div className={classes.loader}>
                        <CircularProgress size={40} thickness={4}/>
                    </div> : lists}
            </Paper>

            <ClientBalanceInfoDialog
                open={infoDialog.openInfoDialog}
                detailData={detailData}
                onClose={infoDialog.handleCloseInfoDialog}
                filterItem={filterItem}
                filter={filter}
                name={_.get(client, 'name')}
                paymentType={_.get(infoDialog, ['division', 'name']) + _.get(infoDialog, 'type')}
                balance={_.get(infoDialog, 'balance')}
                superUser={superUser}
                setItem={setItem}
            />
            <ClientBalanceCreateDialog
                open={createDialog.openCreateDialog}
                listData={listData}
                detailData={detailData}
                loading={createDialog.createLoading}
                onClose={createDialog.handleCloseCreateDialog}
                onSubmit={createDialog.handleSubmitCreateDialog}
                name={_.get(client, 'name')}
            />
            {isSuperUser && <ClientBalanceUpdateDialog
                initialValues={initialValues}
                open={superUser.open}
                loading={superUser.loading}
                onClose={superUser.handleCloseSuperUserDialog}
                onSubmit={superUser.handleSubmitSuperUserDialog}
                name={_.get(client, 'name')}
            />}
            <ClientBalanceCreateDialog
                open={addDialog.openAddDialog}
                listData={listData}
                detailData={detailData}
                loading={addDialog.addLoading}
                onClose={addDialog.handleCloseAddDialog}
                onSubmit={addDialog.handleSubmitAddDialog}
                addDialog={true}
                name={_.get(client, 'name')}
            />
            <ClientBalanceReturnDialog
                name={_.get(clientName, 'name')}
                clientId={_.get(filter.getParams(), 'openClientReturnDialog')}
                open={_.get(clientReturnDialog, 'openClientReturnDialog') ? _.toInteger(_.get(clientReturnDialog, 'openClientReturnDialog')) !== MINUS_ONE : false}
                onClose={clientReturnDialog.handleCloseClientReturnDialog}
                onSubmit={clientReturnDialog.handleSubmitClientReturnDialog}
            />
        </Container>
    )
})

ClientBalanceGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    infoDialog: PropTypes.shape({
        updateLoading: PropTypes.bool.isRequired,
        openInfoDialog: PropTypes.bool.isRequired,
        handleOpenInfoDialog: PropTypes.func.isRequired,
        handleCloseInfoDialog: PropTypes.func.isRequired
    }).isRequired,
    createDialog: PropTypes.shape({
        createLoading: PropTypes.bool.isRequired,
        openCreateDialog: PropTypes.bool.isRequired,
        handleOpenCreateDialog: PropTypes.func.isRequired,
        handleCloseCreateDialog: PropTypes.func.isRequired,
        handleSubmitCreateDialog: PropTypes.func.isRequired
    }).isRequired,
    clientReturnDialog: PropTypes.shape({
        handleOpenClientReturnDialog: PropTypes.func.isRequired,
        handleCloseClientReturnDialog: PropTypes.func.isRequired,
        handleSubmitClientReturnDialog: PropTypes.func.isRequired
    }),
    superUser: PropTypes.shape({
        open: PropTypes.bool.isRequired,
        loading: PropTypes.bool.isRequired,
        handleOpenSuperUserDialog: PropTypes.func.isRequired,
        handleCloseSuperUserDialog: PropTypes.func.isRequired,
        handleSubmitSuperUserDialog: PropTypes.func.isRequired
    })
}

export default ClientBalanceGridList
