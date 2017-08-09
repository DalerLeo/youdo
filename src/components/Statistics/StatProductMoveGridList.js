import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import {Row, Col} from 'react-flexbox-grid'
import * as ROUTES from '../../constants/routes'
import Container from '../Container'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import {reduxForm, Field} from 'redux-form'
import {TextField} from '../ReduxForm'
import DateToDateField from '../ReduxForm/Basic/DateToDateField'
import ZoneSearchField from '../ReduxForm/ZoneSearchField'
import StatProductMoveDialog from './StatProductMoveDialog'
import StatSideMenu from './StatSideMenu'
import Search from 'material-ui/svg-icons/action/search'
import IconButton from 'material-ui/IconButton'
import CircularProgress from 'material-ui/CircularProgress'
import Excel from 'material-ui/svg-icons/av/equalizer'
import Pagination from '../GridList/GridListNavPagination'
import numberFormat from '../../helpers/numberFormat.js'
import getConfig from '../../helpers/getConfig'
import NotFound from '../Images/not-found.png'
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn
} from 'material-ui/Table'

export const STAT_PRODUCT_MOVE_FILTER_KEY = {
    FROM_DATE: 'fromDate',
    TO_DATE: 'toDate',
    ZONE: 'zone',
    SEARCH: 'search'
}

const enhance = compose(
    injectSheet({
        loader: {
            width: '100%',
            height: '100%',
            background: '#fff',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex'
        },
        mainWrapper: {
            background: '#fff',
            margin: '0 -28px',
            height: 'calc(100% + 28px)',
            boxShadow: 'rgba(0, 0, 0, 0.09) 0px -1px 6px, rgba(0, 0, 0, 0.10) 0px -1px 4px'
        },
        wrapper: {
            padding: '20px 30px',
            height: 'calc(100% - 40px)',
            '& > div:nth-child(3)': {
                marginTop: '10px',
                borderTop: '1px #efefef solid',
                borderBottom: '1px #efefef solid'
            },
            '& .row': {
                margin: '0 !important'
            }
        },
        tableWrapper: {
            display: 'flex',
            '& > div:first-child': {
                flexBasis: '20%',
                zIndex: '20',
                boxShadow: '10px 0 5px -2px #CCC'
            },
            '& > div:last-child': {
                flexBasis: '80%'
            }
        },
        balanceInfo: {
            padding: '15px 0'
        },
        balance: {
            paddingRight: '10px',
            fontSize: '24px!important',
            fontWeight: '600'
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
        balanceButtonWrap: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        form: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        filter: {
            display: 'flex',
            alignItems: 'center',
            '& > div': {
                width: '170px!important',
                position: 'relative',
                marginRight: '40px',
                '&:last-child': {
                    margin: '0'
                },
                '&:after': {
                    content: '""',
                    position: 'absolute',
                    right: '-20px',
                    height: '30px',
                    width: '1px',
                    top: '50%',
                    marginTop: '-15px',
                    background: '#efefef'
                },
                '&:last-child:after': {
                    display: 'none'
                }
            }
        },
        leftPanel: {
            backgroundColor: '#f2f5f8',
            flexBasis: '250px',
            maxWidth: '250px'

        },
        rightPanel: {
            flexBasis: 'calc(100% - 250px)',
            maxWidth: 'calc(100% - 250px)',
            overflow: 'hidden'
        },
        searchButton: {
            marginLeft: '-10px !important',
            '& div': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }
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
        pointer: {
            cursor: 'pointer'
        },
        summary: {
            display: 'flex',
            padding: '30px 0',
            '& > div': {
                fontWeight: '400',
                flexBasis: '25%',
                maxWidth: '25%',
                '& div': {
                    fontSize: '24px',
                    fontWeight: '600'
                }
            }
        },
        pagination: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            '& div:first-child': {
                fontWeight: '600'
            }
        },
        tableTitle: {
            fontWeight: '600',
            color: '#333 !important',
            textAlign: 'left',
            padding: '0 !important'
        },
        tableRowHead: {
            '& th:first-child': {

            }
        }

    }),
    reduxForm({
        form: 'StatProductMoveFilterForm',
        enableReinitialize: true
    }),
)

const StatProductMoveGridList = enhance((props) => {
    const {
        classes,
        statProductMoveDialog,
        listData,
        filter,
        handleSubmitFilterDialog,
        detailData,
        getDocument
    } = props

    const listLoading = _.get(listData, 'listLoading')

    const iconStyle = {
        icon: {
            color: '#5d6474',
            width: 22,
            height: 22
        },
        button: {
            width: 40,
            height: 40,
            padding: 0
        }
    }

    const tableLeft = (
        <Table
            height={'300px'}
            fixedHeader={true}
            fixedFooter={false}
            multiSelectable={false}>
            <TableHeader
                displaySelectAll={false}
                adjustForCheckbox={false}
                enableSelectAll={false}
                className={classes.title}>
                <TableRow className={classes.tableRowHead}>
                    <TableHeaderColumn
                        className={classes.tableTitle}>Товар</TableHeaderColumn>
                </TableRow>
            </TableHeader>
            <TableBody
                displayRowCheckbox={false}
                deselectOnClickaway={false}
                showRowHover={false}
                stripedRows={true}>
                <TableRow className={classes.tableRow}>
                    <TableRowColumn>1</TableRowColumn>
                </TableRow>
                <TableRow className={classes.tableRow}>
                    <TableRowColumn>2</TableRowColumn>
                </TableRow>
                <TableRow className={classes.tableRow}>
                    <TableRowColumn>3</TableRowColumn>
                </TableRow>
            </TableBody>
        </Table>
    )
    const tableList = (
        <Table
            height={'300px'}
            fixedHeader={true}
            fixedFooter={false}
            multiSelectable={false}>
            <TableHeader
                displaySelectAll={false}
                adjustForCheckbox={false}
                enableSelectAll={false}
                className={classes.title}>
                <TableRow className={classes.tableRowHead}>
                    <TableHeaderColumn
                        className={classes.tableTitle}>Товар</TableHeaderColumn>
                    <TableHeaderColumn className={classes.tableTitle}>ID товара</TableHeaderColumn>
                    <TableHeaderColumn className={classes.tableTitle}>Кол-во</TableHeaderColumn>
                    <TableHeaderColumn className={classes.tableTitle}>Стоимост</TableHeaderColumn>
                </TableRow>
            </TableHeader>
            <TableBody
                displayRowCheckbox={false}
                deselectOnClickaway={false}
                showRowHover={false}
                stripedRows={true}>
                <TableRow className={classes.tableRow}>
                    <TableRowColumn>1</TableRowColumn>
                    <TableRowColumn>
                        2
                    </TableRowColumn>
                    <TableRowColumn>
                        3 USD
                    </TableRowColumn>
                    <TableRowColumn style={{textAlign: 'right'}}>
                        4
                    </TableRowColumn>
                </TableRow>
                <TableRow className={classes.tableRow}>
                    <TableRowColumn>1</TableRowColumn>
                    <TableRowColumn>
                        2
                    </TableRowColumn>
                    <TableRowColumn>
                        3 USD
                    </TableRowColumn>
                    <TableRowColumn style={{textAlign: 'right'}}>
                        4
                    </TableRowColumn>
                </TableRow>
                <TableRow className={classes.tableRow}>
                    <TableRowColumn>1</TableRowColumn>
                    <TableRowColumn>
                        2
                    </TableRowColumn>
                    <TableRowColumn>
                        3 USD
                    </TableRowColumn>
                    <TableRowColumn style={{textAlign: 'right'}}>
                        4
                    </TableRowColumn>
                </TableRow>
            </TableBody>
        </Table>
    )
    const list = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const zone = _.get(item, ['zone', 'name'])
        const plan = _.get(item, 'plan')
        const paidFor = _.get(item, 'paidFor')
        const balance = _.get(item, 'balance')
        const income = numberFormat(_.get(item, 'income'), getConfig('PRIMARY_CURRENCY'))

        return (
            <Row key={id} className="dottedList">
                <Col xs={2}>
                    <div className={classes.pointer} onClick={() => { statProductMoveDialog.handleOpenStatProductMoveDialog(id) }}>{name}</div>
                </Col>
                <Col xs={2}>
                    <div>{zone}</div>
                </Col>
                <Col xs={2}>
                    <div>{plan}</div>
                </Col>

                <Col xs={2}>
                    <div>{income}</div>
                </Col>
                <Col xs={2}>
                    <div>{paidFor}</div>
                </Col>
                <Col xs={2}>
                    <div>{balance}</div>
                </Col>
            </Row>
        )
    })

    const page = (
        <div className={classes.mainWrapper}>
            <Row style={{margin: '0', height: '100%'}}>
                <div className={classes.leftPanel}>
                    <StatSideMenu currentUrl={ROUTES.STATISTICS_PRODUCT_MOVE_URL}/>
                </div>
                <div className={classes.rightPanel}>
                    {listLoading
                        ? <div className={classes.loader}>
                            <CircularProgress size={40} thickness={4}/>
                        </div>
                        : <div className={classes.wrapper}>
                            <form className={classes.form} onSubmit={handleSubmitFilterDialog}>
                                <div className={classes.filter}>
                                    <Field
                                        className={classes.inputFieldCustom}
                                        name="date"
                                        component={DateToDateField}
                                        label="Диапазон дат"
                                        fullWidth={true}/>
                                    <Field
                                        className={classes.inputFieldCustom}
                                        name="zone"
                                        component={ZoneSearchField}
                                        label="Зона"
                                        fullWidth={true}/>
                                    <Field
                                        className={classes.inputFieldCustom}
                                        name="search"
                                        component={TextField}
                                        label="Поиск"
                                        fullWidth={true}/>

                                    <IconButton
                                        className={classes.searchButton}
                                        iconStyle={iconStyle.icon}
                                        style={iconStyle.button}
                                        type="submit">
                                        <Search/>
                                    </IconButton>
                                </div>
                                <a className={classes.excel}
                                   onClick={getDocument.handleGetDocument}>
                                    <Excel color="#fff"/> <span>Excel</span>
                                </a>
                            </form>
                            <div className={classes.summary}>
                                <div>Остаток на начало периода <div>50 0000 UZS</div></div>
                                <div>Остаток на конец периода<div>50 0000 UZS</div></div>
                                <div>Поступило товара на сумму<div>50 0000 UZS</div></div>
                                <div>Выдано товара на сумму<div>50 0000 UZS</div></div>
                            </div>
                            <div className={classes.pagination}>
                                <div>Движение товаров на складе</div>
                                <Pagination filter={filter}/>
                            </div>
                            <div className={classes.tableWrapper}>
                                <div>
                                    {tableLeft}
                                </div>
                                <div>
                                    {tableList}
                                </div>
                            </div>
                            {(_.isEmpty(list) && !listLoading) ? <div className={classes.emptyQuery}>
                                <div>По вашему запросу ничего не найдено</div>
                            </div>
                                : null}
                        </div>
                    }
                </div>
            </Row>
        </div>
    )

    return (
        <Container>
            {page}
            <StatProductMoveDialog
                loading={_.get(detailData.detailLoading)}
                detailData={detailData}
                open={statProductMoveDialog.openStatProductMoveDialog}
                onClose={statProductMoveDialog.handleCloseStatProductMoveDialog}
                filter={filter}/>
        </Container>
    )
})

StatProductMoveGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    statProductMoveDialog: PropTypes.shape({
        openStatProductMoveDialog: PropTypes.bool.isRequired,
        handleOpenStatProductMoveDialog: PropTypes.func.isRequired,
        handleCloseStatProductMoveDialog: PropTypes.func.isRequired
    }).isRequired
}

export default StatProductMoveGridList
