import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import {Row, Col} from 'react-flexbox-grid'
import * as ROUTES from '../../../constants/routes'
import Container from '../../Container/index'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import {Field} from 'redux-form'
import {DateToDateField, ExpensiveCategoryMultiSearchField} from '../../ReduxForm'
import StatSideMenu from '../StatSideMenu'
import ExpenditureTransactionDialog from '../ExpenditureOnStaff/ExpenditureTransactionDialog'
import Loader from '../../Loader'
import LinearProgress from 'material-ui/LinearProgress'
import Pagination from '../../GridList/GridListNavPagination/index'
import numberFormat from '../../../helpers/numberFormat.js'
import getConfig from '../../../helpers/getConfig'
import NotFound from '../../Images/not-found.png'
import {StatisticsFilterExcel} from '../../Statistics'

export const STAT_EXPENDITURE_ON_STAFF_FILTER_KEY = {
    CATEGORY_EXPENSE: 'categoryExpense',
    FROM_DATE: 'fromDate',
    TO_DATE: 'toDate'
}

const enhance = compose(
    injectSheet({
        loader: {
            width: '100%',
            padding: '100px 0',
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
            '& > div:nth-child(2)': {
                marginTop: '10px',
                borderTop: '1px #efefef solid',
                borderBottom: '1px #efefef solid'
            },
            '& .row': {
                margin: '0 !important'
            }
        },
        tableWrapper: {
            margin: '0 -30px',
            '& .row': {
                '&:after': {
                    bottom: '-1px'
                },
                '& > div': {
                    display: 'flex',
                    height: '50px',
                    alignItems: 'center'
                }
            },
            '& .dottedList': {
                padding: '0 30px',
                '&:hover': {
                    background: '#f2f5f8'
                },
                '&:last-child:after': {
                    content: '""',
                    backgroundImage: 'none'
                }
            },
            '& .personImage': {
                borderRadius: '50%',
                overflow: 'hidden',
                height: '30px',
                minWidth: '30px',
                width: '30px',
                marginRight: '10px',
                '& img': {
                    display: 'flex',
                    height: '100%',
                    width: '100%'
                }
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
            overflowY: 'auto'
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
        }
    })
)

const StatExpenditureOnStaffGridList = enhance((props) => {
    const {
        classes,
        listData,
        filter,
        handleSubmitFilterDialog,
        getDocument,
        initialValues,
        transactionData
    } = props

    const currentCurrency = getConfig('PRIMARY_CURRENCY')
    const listLoading = _.get(listData, 'listLoading')

    const headerStyle = {
        backgroundColor: '#fff',
        fontWeight: '600',
        color: '#666'
    }

    const headers = (
        <Row style={headerStyle} className="dottedList">
            <Col xs={3}>Сотрудник</Col>
            <Col xs={6}>Процентное соотношение</Col>
            <Col xs={3} style={{justifyContent: 'flex-end'}}>Сумма ({currentCurrency})</Col>
        </Row>
    )

    const list = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const employee = _.get(item, ['employee', 'name']) || 'Не указан'
        const percent = _.get(item, 'percent')
        const amount = numberFormat(Math.abs(_.get(item, 'amount')), getConfig('PRIMARY_CURRENCY'))

        return (
            <Row key={id} className="dottedList" onClick={() => { transactionData.handleOpenTransactionDialog() }}>
                <Col xs={3}>{employee}</Col>
                <Col xs={6}>
                    <LinearProgress
                        color="#58bed9"
                        mode="determinate"
                        value={percent}
                        style={{backgroundColor: '#efefef', height: '10px'}}/>
                </Col>
                <Col xs={3} style={{justifyContent: 'flex-end'}}>{amount}</Col>
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
            <Field
                className={classes.inputFieldCustom}
                name="categoryExpense"
                component={ExpensiveCategoryMultiSearchField}
                label="Категории расходов"
                fullWidth={true}/>
        </div>
    )

    const page = (
        <div className={classes.mainWrapper}>
            <Row style={{margin: '0', height: '100%'}}>
                <div className={classes.leftPanel}>
                    <StatSideMenu currentUrl={ROUTES.STATISTICS_EXPENDITURE_ON_STAFF_URL} filter={filter}/>
                </div>
                <div className={classes.rightPanel}>
                    <div className={classes.wrapper}>
                        <StatisticsFilterExcel
                            filter={filter}
                            fields={fields}
                            filterKeys={STAT_EXPENDITURE_ON_STAFF_FILTER_KEY}
                            handleSubmitFilterDialog={handleSubmitFilterDialog}
                            initialValues={initialValues}
                            handleGetDocument={getDocument.handleGetDocument}
                        />
                        <Pagination filter={filter}/>
                        {listLoading
                            ? <div className={classes.tableWrapper}>
                                <div className={classes.loader}>
                                    <Loader size={0.75}/>
                                </div>
                            </div>
                            : <div className={classes.tableWrapper}>
                                {_.isEmpty(list) && !listLoading
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
            <ExpenditureTransactionDialog
                data={transactionData.data}
                open={transactionData.open}
                loading={transactionData.loading}
                onClose={transactionData.handleCloseTransactionDialog}
            />
        </Container>
    )
})

StatExpenditureOnStaffGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object
}

export default StatExpenditureOnStaffGridList