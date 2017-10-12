import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import * as ROUTES from '../../constants/routes'
import Container from '../Container'
import ClientBalanceInfoDialog from './ClientBalanceInfoDialog'
import ClientBalanceCreateDialog from './ClientBalanceCreateDialog'
import ClientBalanceUpdateDialog from './ClientBalanceUpdateDialog'
import CircularProgress from 'material-ui/CircularProgress'
import {Field, reduxForm} from 'redux-form'
import SubMenu from '../SubMenu'
import {Row} from 'react-flexbox-grid'
import injectSheet from 'react-jss'
import ordering from '../../helpers/ordering'
import {compose, withState} from 'recompose'
import numberFormat from '../../helpers/numberFormat'
import getConfig from '../../helpers/getConfig'
import IconButton from 'material-ui/IconButton'
import Cancel from 'material-ui/svg-icons/content/remove-circle'
import Add from 'material-ui/svg-icons/content/add-circle'
import Tooltip from '../ToolTip'
import Paper from 'material-ui/Paper'
import SearchIcon from 'material-ui/svg-icons/action/search'
import StatSideMenu from '../Statistics/StatSideMenu'
import {TextField} from '../ReduxForm/index'
import Pagination from '../GridList/GridListNavPagination'
import NotFound from '../Images/not-found.png'
import ArrowUpIcon from 'material-ui/svg-icons/navigation/arrow-upward'
import ArrowDownIcon from 'material-ui/svg-icons/navigation/arrow-downward'
import Excel from 'material-ui/svg-icons/av/equalizer'

let amountValues = []
let head = []

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
        wrapper: {
            padding: '0 30px',
            height: '100%',
            '& .row': {
                margin: '0 !important'
            }
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
            '&:nth-child(odd)': {
                backgroundColor: '#f4f4f4'
            }
        },
        tableWrapper: {
            display: 'flex',
            overflow: 'hidden',
            marginLeft: '-30px',
            'padding-left': ({stat}) => stat ? '0' : '30px',
            'margin-right': ({stat}) => stat ? '-30px' : 'unset'
        },
        leftTable: {
            display: 'table',
            zIndex: '4',
            width: '350px',
            boxShadow: '5px 0 8px -3px #ccc',
            '& > div': {
                '&:nth-child(odd)': {
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
        mainTableWrapper: {
            overflowX: 'auto',
            overflowY: 'hidden'
        },
        rightTable: {
            extend: 'leftTable',
            boxSizing: 'content-box',
            boxShadow: 'none',
            borderLeft: '1px #efefef solid',
            borderRight: '1px #efefef solid',
            width: '120px'
        },
        buttonsWrapper: {
            padding: '0 30px',
            display: 'flex !important',
            justifyContent: 'flex-end',
            alignItems: 'center'
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
            minWidth: '850px',
            color: '#666',
            borderCollapse: 'collapse',
            '& tr, td': {
                height: '40px'
            },
            '& td': {
                padding: '0 20px',
                minWidth: '80px'
            },
            '& tr > td:last-child': {
                borderRight: 'none'
            }
        },
        title: {
            fontWeight: '600',
            '& > td': {
                verticalAlign: 'middle'
            },
            '& tr, td': {
                border: '1px #efefef solid'
            }
        },
        nav: {
            borderTop: '1px solid #efefef',
            height: '55px',
            padding: ({stat}) => stat ? 'unset' : '0 30px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        mainWrapper: {
            background: '#fff',
            margin: '0 -28px',
            height: 'calc(100% + 28px)',
            boxShadow: 'rgba(0, 0, 0, 0.09) 0px -1px 6px, rgba(0, 0, 0, 0.10) 0px -1px 4px'
        },
        leftPanel: {
            backgroundColor: '#f2f5f8',
            flexBasis: '250px',
            maxWidth: '250px'

        },
        rightPanel: {
            overflowY: 'auto',
            flexBasis: 'calc(100% - 250px)',
            maxWidth: 'calc(100% - 250px)'
        },
        emptyQuery: {
            background: 'url(' + NotFound + ') no-repeat center center',
            backgroundSize: '200px',
            padding: '200px 0 0',
            textAlign: 'center',
            fontSize: '13px',
            color: '#666',
            '& svg': {
                width: '50px !important',
                height: '50px !important',
                color: '#999 !important'
            }
        },
        icon: {
            color: '#666 !important',
            height: '15px !important'
        },
        getDocument: {
            display: 'flex',
            justifyContent: 'flex-end'
        },
        excel: {
            background: '#71ce87',
            borderRadius: '2px',
            color: '#fff',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            padding: '5px 15px',
            '& svg': {
                width: '18px !important'
            }
        },
        summary: {
            padding: '20px 0'
        },
        summaryWrapper: {
            width: '100%',
            display: 'flex',
            '& > div': {
                fontWeight: '400',
                flexBasis: '25%',
                maxWidth: '25%',
                '& div': {
                    fontSize: '17px',
                    marginTop: '2px',
                    fontWeight: '600'
                }
            }
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
        padding: 4
    }
}

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
        superUser,
        currentItem,
        setItem,
        handleSubmit,
        handleSubmitSearch,
        getDocument,
        stat,
        sumData
    } = props

    // This constants for Statistics
    const borrowersBank = _.get(sumData, ['sum', 'borrowersSumBank'])
    const borrowersBankCount = _.get(sumData, ['sum','borrowersCountBank'])
    const borrowersCash = _.get(sumData, ['sum', 'borrowersSumCash'])
    const borrowersCashCount = _.get(sumData, ['sum', 'borrowersCountCash'])
    const loanersBank = _.get(sumData, ['sum', 'loanersSumBank'])
    const loanersBankCount = _.get(sumData, ['sum', 'loanersCountBank'])
    const loanersCash = _.get(sumData, ['sum', 'loanersSumCash'])
    const loanersCashCount = _.get(sumData, ['sum', 'loanersCountCash'])

    const orderNoSorting = _.isNil(filter.getSortingType('order_no')) ? null
        : filter.getSortingType('order_no') ? <ArrowUpIcon className={classes.icon}/>
            : <ArrowDownIcon className={classes.icon}/>
    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    const listLoading = _.get(listData, 'listLoading')
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
        <div className={classes.rightTable}>
            <div><span> </span></div>
            {_.map(_.get(listData, 'data'), (item) => {
                const id = _.get(item, 'id')
                return (
                    <div key={id} className={classes.buttonsWrapper}>
                        <Tooltip position="bottom" text="Списать">
                            <IconButton
                                disableTouchRipple={true}
                                iconStyle={iconStyle.icon}
                                style={iconStyle.button}
                                touch={true}
                                onTouchTap={() => {
                                    createDialog.handleOpenCreateDialog(id)
                                }}>
                                <Cancel color='#ff584b'/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip position="bottom" text="Добавить">
                            <IconButton
                                disableTouchRipple={true}
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
        head.push({name: item.name + ' нал.', id: item.id, type: 'cash'})
        head.push({name: item.name + ' переч.', id: item.id, type: 'bank'})
    })

    const tableList = (
        <table className={classes.mainTable}>
            <tbody>
            <tr className={classes.title}>
                <td
                    style={{cursor: 'pointer'}}
                    onClick={() => ordering(filter, 'order_no')}>
                    Кол-во заказов {orderNoSorting}
                </td>
                {_.map(head, (item, index) => {
                    const sortingType = filter.getSortingType(item.type + '_' + item.id)
                    const icon = _.isNil(sortingType) ? null
                                                        : sortingType ? <ArrowUpIcon className={classes.icon}/>
                                                                        : <ArrowDownIcon className={classes.icon}/>
                    return (
                        <td
                            key={index}
                            style={{cursor: 'pointer'}}
                            onClick={() => ordering(filter, item.type + '_' + item.id)}>
                            {item.name}{icon}
                        </td>
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
                            const amount = _.toNumber(_.get(val, 'amount'))
                            return (
                                <td key={index} style={{cursor: 'pointer'}} onClick={() => { infoDialog.handleOpenInfoDialog(id, _.get(val, 'id'), _.get(val, 'type')) }}>
                                    <span className={(amount > ZERO) ? classes.green : (amount < ZERO) && classes.red}>{amount} {primaryCurrency}</span>
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
            <div className={classes.mainTableWrapper} style={stat
                ? {width: 'calc(100% - 350px)'}
                : {width: 'calc(100% - 350px - 120px)'}}>
                {tableList}
            </div>
            {!stat && buttons}
        </div>
    )
    const isSuperUser = _.get(superUser, 'isSuperUser')

    const client = _.find(_.get(listData, 'data'), {'id': _.get(detailData, 'id')})

    const amount = _.toNumber(_.get(currentItem, 'amount'))
    const internal = _.toNumber(_.get(currentItem, 'internal'))
    const initialValues = {
        currency: {
            value: _.get(currentItem, ['currency', 'id'])
        },
        custom_rate: !_.isNil(_.get(currentItem, 'customRate')) ? _.get(currentItem, 'customRate') : _.toInteger(amount / internal),
        paymentType: {
            value: _.get(currentItem, 'paymentType')
        },
        amount: _.get(currentItem, 'amount'),
        division: {
            value: _.get(currentItem, ['division', 'id'])
        },
        comment: _.get(currentItem, 'comment'),
        user: {
            value: _.get(currentItem, ['user', 'id'])
        }
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
            {stat && <div className={classes.getDocument}>
                <a className={classes.excel} onClick={getDocument.handleGetDocument}>
                    <Excel color="#fff"/> <span>Excel</span>
                </a>
            </div>}
        </div>
    )
    return (
        <Container>

            {stat &&
            <div className={classes.mainWrapper}>
                <Row style={{margin: '0', height: '100%'}}>
                    <div className={classes.leftPanel}>
                        <StatSideMenu currentUrl={ROUTES.STATISTICS_CLIENT_BALANCE_URL}/>
                    </div>
                    <div className={classes.rightPanel}>
                        <div className={classes.wrapper}>
                            <div className={classes.summary}>
                                {listLoading
                                    ? <div className={classes.summaryLoader}>
                                        <CircularProgress size={40} thickness={4}/>
                                    </div>
                                    : <div className={classes.summaryWrapper}>
                                        <div>Задолжники нал. - {borrowersCashCount}
                                            <div>{borrowersCash}</div>
                                        </div>
                                        <div>Задолжники переч. - {borrowersBankCount}
                                            <div>{borrowersBank}</div>
                                        </div>
                                        <div>Закладчики нал. - {loanersCashCount}
                                            <div>{loanersCash}</div>
                                        </div>
                                        <div>Закладчики нал. - {loanersBankCount}
                                            <div>{loanersBank} USD</div>
                                        </div>
                                    </div>}
                            </div>
                            {navigation}
                            {listLoading
                                ? <div className={classes.loader}>
                                    <CircularProgress size={40} thickness={4} />
                                </div>
                                : (_.isEmpty(tableList) && !listLoading)
                                    ? <div className={classes.emptyQuery}>
                                        <div>По вашему запросу ничего не найдено</div>
                                    </div>
                                    : <div>
                                        {lists}
                                    </div>
                            }
                        </div>
                    </div>
                </Row>
            </div>
            }

            {!stat && <SubMenu url={ROUTES.CLIENT_BALANCE_LIST_URL}/>}
            {!stat && <Paper>
                {navigation}
                {listLoading
                    ? <div className={classes.loader}>
                        <CircularProgress size={40} thickness={4}/>
                    </div>
                    : (_.isEmpty(tableList) && !listLoading)
                        ? <div className={classes.emptyQuery}>
                            <div>По вашему запросу ничего не найдено</div>
                        </div>
                        : lists}
            </Paper>}

            <ClientBalanceInfoDialog
                stat={stat}
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
            {!stat && <ClientBalanceCreateDialog
                open={_.get(createDialog, 'openCreateDialog')}
                listData={listData}
                detailData={detailData}
                loading={_.get(createDialog, 'createLoading')}
                onClose={_.get(createDialog, 'handleCloseCreateDialog')}
                onSubmit={_.get(createDialog, 'handleSubmitCreateDialog')}
                name={_.get(client, 'name')}
            />}
            {!stat && isSuperUser && !_.isNull(currentItem) && <ClientBalanceUpdateDialog
                initialValues={initialValues}
                isUpdate={true}
                open={_.get(superUser, 'open')}
                loading={_.get(superUser, 'loading')}
                onClose={_.get(superUser, 'handleCloseSuperUserDialog')}
                onSubmit={_.get(superUser, 'handleSubmitSuperUserDialog')}
                name={_.get(client, 'name')}
            />}
            {!stat && <ClientBalanceCreateDialog
                open={_.get(addDialog, 'openAddDialog')}
                listData={listData}
                detailData={detailData}
                loading={_.get(addDialog, 'addLoading')}
                onClose={_.get(addDialog, 'handleCloseAddDialog')}
                onSubmit={_.get(addDialog, 'handleSubmitAddDialog')}
                addDialog={true}
                name={_.get(client, 'name')}
            />}
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
        createLoading: PropTypes.bool,
        openCreateDialog: PropTypes.bool,
        handleOpenCreateDialog: PropTypes.func,
        handleCloseCreateDialog: PropTypes.func,
        handleSubmitCreateDialog: PropTypes.func
    }),
    superUser: PropTypes.shape({
        open: PropTypes.bool,
        loading: PropTypes.bool,
        handleOpenSuperUserDialog: PropTypes.func,
        handleCloseSuperUserDialog: PropTypes.func,
        handleSubmitSuperUserDialog: PropTypes.func
    })
}

export default ClientBalanceGridList
