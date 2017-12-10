import PropTypes from 'prop-types'
import React from 'react'
import _ from 'lodash'
import {Row, Col} from 'react-flexbox-grid'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import {Field} from 'redux-form'
import IconButton from 'material-ui/IconButton'
import Loader from '../../Loader'
import InProcess from 'material-ui/svg-icons/action/cached'
import DoneIcon from 'material-ui/svg-icons/action/done-all'
import Canceled from 'material-ui/svg-icons/notification/do-not-disturb-alt'
import StatReturnDialog from './StatReturnDialog'
import StatSideMenu from '../StatSideMenu'
import DateToDateField from '../../ReduxForm/Basic/DateToDateField'
import Container from '../../Container/index'
import Pagination from '../../GridList/GridListNavPagination/index'
import DivisionMultiSearchField from '../../ReduxForm/Division/DivisionMultiSearchField'
import NotFound from '../../Images/not-found.png'
import * as ROUTES from '../../../constants/routes'
import numberFormat from '../../../helpers/numberFormat'
import dateFormat from '../../../helpers/dateFormat'
import getConfig from '../../../helpers/getConfig'
import {StatisticsFilterExcel, StatisticsChart} from '../../Statistics'
import Tooltip from '../../ToolTip'

export const STAT_RETURN_FILTER_KEY = {
    FROM_DATE: 'fromDate',
    TO_DATE: 'toDate',
    DIVISION: 'division'
}

const enhance = compose(
    injectSheet({
        mainWrapper: {
            background: '#fff',
            margin: '0 -28px',
            height: 'calc(100% + 28px)',
            boxShadow: 'rgba(0, 0, 0, 0.09) 0px -1px 6px, rgba(0, 0, 0, 0.10) 0px -1px 4px'
        },
        wrapper: {
            height: 'calc(100% - 40px)',
            padding: '20px 30px',
            '& .row': {
                marginLeft: '0',
                marginRight: '0'
            }
        },
        loader: {
            width: '100%',
            padding: '100px 0',
            background: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: '999',
            display: 'flex'
        },
        graphLoader: {
            extend: 'loader',
            padding: '0',
            height: '180px',
            marginTop: '20px'
        },
        pagination: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px #efefef solid',
            borderBottom: '1px #efefef solid'
        },
        tableWrapper: {
            '& .row': {
                margin: '0 -30px',
                padding: '0 30px',
                '&:hover': {
                    background: '#f2f5f8'
                },
                '&:after': {
                    bottom: '-1px'
                },
                '& > div': {
                    display: 'flex',
                    height: '50px',
                    alignItems: 'center',
                    '&:first-child': {
                        paddingLeft: '0'
                    },
                    '&:last-child': {
                        justifyContent: 'flex-end',
                        paddingRight: '0'
                    }
                }
            },
            '& .dottedList': {
                padding: '0 30px',
                '&:last-child:after': {
                    content: '""',
                    backgroundImage: 'none'
                }
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
        leftPanel: {
            backgroundColor: '#f2f5f8',
            flexBasis: '250px',
            maxWidth: '250px'

        },
        rightPanel: {
            flexBasis: 'calc(100% - 250px)',
            maxWidth: 'calc(100% - 250px)',
            overflowY: 'auto',
            overflowX: 'hidden'
        },
        diagram: {
            marginTop: '20px',
            '& > div:first-child': {
                paddingLeft: '0'
            },
            '& > div:last-child': {
                paddingRight: '0'
            }
        },
        salesSummary: {
            '& > div:nth-child(odd)': {
                color: '#666'
            },
            '& > div:nth-child(even)': {
                fontSize: '20px',
                fontWeight: '600',
                marginBottom: '15px'
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
        }
    })
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

const PENDING = 0
const IN_PROGRESS = 1
const COMPLETED = 2
const CANCELLED = 3
const StatReturnGridList = enhance((props) => {
    const {
        classes,
        type,
        filter,
        onSubmit,
        listData,
        statReturnDialog,
        detailData,
        handleGetDocument,
        graphData,
        initialValues
    } = props

    const loading = _.get(listData, 'listLoading')
    const graphLoading = _.get(graphData, 'graphLoading')
    const divisionStatus = getConfig('DIVISIONS')
    const headerStyle = {
        backgroundColor: '#fff',
        fontWeight: '600',
        color: '#666'
    }

    const returnSum = _.sumBy(_.get(graphData, 'data'), (item) => {
        return _.toNumber(_.get(item, 'totalAmount'))
    })
    const returnedValue = _.map(_.get(graphData, 'data'), (item) => {
        return _.toNumber(_.get(item, 'totalAmount'))
    })

    const valueName = _.map(_.get(graphData, 'data'), (item) => {
        return _.get(item, 'date')
    })

    const headers = (
        <Row style={headerStyle} className="dottedList">
            <Col xs={1}>№</Col>
            <Col xs={2}>От кого</Col>
            <Col xs={1}>Заказ</Col>
            <Col xs={2}>Склад</Col>
            <Col xs={2}>Добавил</Col>
            <Col xs={1}>Дата</Col>
            <Col xs={2} style={{justifyContent: 'flex-end'}}>Сумма возврата</Col>
            <Col xs={1}>Статус</Col>
        </Row>
    )

    const list = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const client = _.get(item, ['client', 'name']) || '-'
        const order = _.get(item, 'order') || '-'
        const stock = _.get(item, ['stock', 'name'])
        const currency = _.get(item, ['currency', 'name'])
        const user = _.get(item, ['createdBy', 'firstName']) + ' ' + _.get(item, ['createdBy', 'secondName']) || 'N/A'
        const createdDate = dateFormat(_.get(item, 'createdDate'))
        const totalPrice = numberFormat(_.get(item, 'totalPrice'), currency)
        const status = _.toInteger(_.get(item, 'status'))

        return (
            <Row className={classes.listWrapper} style={{cursor: 'pointer'}} key={id} onTouchTap={() => {
                statReturnDialog.handleOpenStatReturnDialog(id)
            }}>
                <Col xs={1}>{id}</Col>
                <Col xs={2}>{client}</Col>
                <Col xs={1}>{order}</Col>
                <Col xs={2}>{stock}</Col>
                <Col xs={2}>{user}</Col>
                <Col xs={1} style={{whiteSpace: 'nowrap'}}>{createdDate}</Col>
                <Col xs={2} style={{justifyContent: 'flex-end'}}>{totalPrice}</Col>
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
                                    </Tooltip> : null
                        }
                    </div>
                </Col>
            </Row>
        )
    })

    const fields = (
        <div>
            <Field
                className={classes.inputFieldCustom}
                name="date"
                component={DateToDateField}
                label="Диапазон дат"
                fullWidth={true}/>
            {divisionStatus && <Field
                name="division"
                component={DivisionMultiSearchField}
                className={classes.inputFieldCustom}
                label="Подразделение"
                fullWidth={true}/>}
        </div>
    )

    const page = (
        <div className={classes.mainWrapper}>
            <Row style={{margin: '0', height: '100%'}}>
                <div className={classes.leftPanel}>
                    <StatSideMenu currentUrl={ROUTES.STATISTICS_RETURN_URL} filter={filter}/>
                </div>
                <div className={classes.rightPanel}>
                    <div className={classes.wrapper}>
                        <StatisticsFilterExcel
                            filter={filter}
                            fields={fields}
                            handleGetDocument={handleGetDocument}
                            handleSubmitFilterDialog={onSubmit}
                            initialValues={initialValues}
                            filterKeys={STAT_RETURN_FILTER_KEY}
                        />
                        {graphLoading
                        ? <div className={classes.graphLoader}>
                                <Loader size={0.75}/>
                            </div>
                        : <Row className={classes.diagram}>
                            <Col xs={3} className={classes.salesSummary}>
                                <div>Общая сумма возврата</div>
                                <div>{numberFormat(returnSum, getConfig('PRIMARY_CURRENCY'))}</div>
                            </Col>
                            <Col xs={9}>
                                <StatisticsChart
                                    primaryText="Возврат"
                                    primaryValues={returnedValue}
                                    tooltipTitle={valueName}
                                    height={180}
                                />
                            </Col>
                        </Row>}
                        <div className={classes.pagination}>
                            <div><b>История возврата</b></div>
                            <Pagination filter={filter}/>
                        </div>
                        {loading
                        ? <div className={classes.tableWrapper}>
                            <div className={classes.loader}>
                                <Loader size={0.75}/>
                            </div>
                        </div>
                        : <div className={classes.tableWrapper}>
                            {_.isEmpty(list) && !loading
                                ? <div className={classes.emptyQuery}>
                                    <div>По вашему запросу ничего не найдено</div>
                                </div>
                                : <div>
                                    {headers}
                                    {list}
                                </div>}
                        </div>}
                    </div>
                </div>
            </Row>
        </div>
    )

    return (
        <Container>
            {page}
            <StatReturnDialog
                loading={_.get(detailData, 'detailLoading')}
                detailData={detailData}
                open={statReturnDialog.openStatReturnDialog}
                onClose={statReturnDialog.handleCloseStatReturnDialog}
                filter={filter}
                type={type}/>
        </Container>
    )
})

StatReturnGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    statReturnDialog: PropTypes.shape({
        openStatReturnDialog: PropTypes.bool.isRequired,
        handleOpenStatReturnDialog: PropTypes.func.isRequired,
        handleCloseStatReturnDialog: PropTypes.func.isRequired
    }).isRequired
}

export default StatReturnGridList
