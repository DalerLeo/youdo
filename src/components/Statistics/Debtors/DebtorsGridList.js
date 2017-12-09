import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import {Row, Col} from 'react-flexbox-grid'
import * as ROUTES from '../../../constants/routes'
import Container from '../../Container/index'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import {reduxForm, Field} from 'redux-form'
import {TextField, DivisionSearchField} from '../../ReduxForm'
import StatSideMenu from '../StatSideMenu'
import Loader from '../../Loader'
import Pagination from '../../GridList/GridListNavPagination'
import numberFormat from '../../../helpers/numberFormat'
import getConfig from '../../../helpers/getConfig'
import StatSaleDialog from '../Sales/SalesDialog'
import DebtorsDetails from './DebtorsDetails'
import StatisticsFilterExcel from '../StatisticsFilterExcel'
import NotFound from '../../Images/not-found.png'

export const STAT_DEBTORS_FILTER_KEY = {
    DIVISION: 'division',
    SEARCH: 'search'
}

const ZERO = 0

const enhance = compose(
    injectSheet({
        mainWrapper: {
            background: '#fff',
            margin: '0 -28px',
            height: 'calc(100% + 28px)',
            boxShadow: 'rgba(0, 0, 0, 0.09) 0px -1px 6px, rgba(0, 0, 0, 0.10) 0px -1px 4px'
        },
        loader: {
            width: '100%',
            padding: '100px 0',
            background: '#fff',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex'
        },
        detailLoader: {
            extend: 'loader',
            padding: '50px 0'
        },
        statLoader: {
            extend: 'loader',
            padding: '0'
        },
        wrapper: {
            padding: '20px 30px',
            '& .row': {
                marginLeft: '0',
                marginRight: '0'
            }
        },
        debtors: {
            display: 'flex',
            margin: '15px 0',
            '& > div': {
                marginRight: '60px',
                '& span': {
                    color: '#666',
                    marginBottom: '5px'
                },
                '& div': {
                    fontSize: '17px',
                    fontWeight: '600'
                }
            }
        },
        pagination: {
            display: 'flex',
            alignItems: 'center',
            marginTop: '10px',
            justifyContent: 'space-between',
            borderTop: '1px #efefef solid',
            borderBottom: '1px #efefef solid'
        },
        tableWrapper: {
            margin: '0 -30px !important',
            '& .row': {
                padding: '0 30px',
                height: '55px',
                alignItems: 'center',
                '&:after': {
                    bottom: '-1px'
                },
                '& > div': {
                    textAlign: 'right',
                    '&:first-child': {
                        textAlign: 'left',
                        paddingLeft: '0'
                    },
                    '&:last-child': {
                        paddingRight: '0'
                    }
                }
            }
        },
        headers: {
            backgroundColor: '#fff',
            fontWeight: '600',
            color: '#666'
        },
        list: {
            cursor: 'pointer',
            transition: 'all 200ms ease',
            '&:hover': {
                background: '#fafafa',
                '& div:last-child': {
                    opacity: '1 !important'
                }
            },
            '&:last-child:after': {
                display: 'none'
            }
        },
        button: {
            opacity: '0',
            paddingRight: '0',
            transition: 'all 200ms ease'
        },
        expandedList: {
            extend: 'list',
            background: '#fcfcfc !important',
            position: 'relative',
            cursor: 'auto',
            '& > div:first-child': {
                fontWeight: '600',
                cursor: 'pointer'
            }
        },
        editButton: {
            position: 'absolute',
            top: '0',
            right: '30px',
            height: '55px',
            display: 'flex',
            alignItems: 'center',
            '& svg': {
                width: '22px !important',
                height: '22px !important'
            }
        },
        detail: {
            width: '100%',
            fontWeight: '400 !important',
            display: 'block !important',
            borderTop: '1px #efefef solid',
            '& .dottedList': {
                '&:first-child': {
                    color: '#666',
                    fontWeight: '600'
                },
                '& > div': {
                    padding: '0 5px'
                },
                '& > div:nth-child(2)': {
                    textAlign: 'left'
                },
                '& > div:nth-child(3)': {
                    textAlign: 'left'
                },
                '&:last-child:after': {
                    display: 'none'
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
    }),
    reduxForm({
        form: 'StatisticsFilterForm',
        enableReinitialize: true
    }),
)

const StatDebtorsGridList = enhance((props) => {
    const {
        classes,
        filter,
        listData,
        detailData,
        handleSubmitFilterDialog,
        statDebtorsDialog,
        handleSubmit,
        handleOpenCloseDetail,
        getDocument,
        handleSubmitMultiUpdate
    } = props

    const divisionStatus = getConfig('DIVISIONS')
    const listLoading = _.get(listData, 'listLoading')
    const statLoading = _.get(listData, 'statLoading')
    const headers = (
        <Row className={classes.headers + ' dottedList'}>
            <Col xs={4}>Клиент</Col>
            <Col xs={2}>Просроченные (SUM)</Col>
            <Col xs={2}>Ожидаемые (SUM)</Col>
            <Col xs={2}>Просроченные (USD)</Col>
            <Col xs={2}>Ожидаемые (USD)</Col>
        </Row>
    )

    const list = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, ['client', 'id'])
        const client = _.get(item, ['client', 'name'])
        const deptSum = numberFormat(_.get(item, 'debtSum'), getConfig('PRIMARY_CURRENCY'))
        const expectSum = numberFormat(_.get(item, 'expectSum'), getConfig('PRIMARY_CURRENCY'))
        if (_.get(detailData, 'openDetailId') === id) {
            return <DebtorsDetails
                key={id}
                id={_.get(detailData, 'openDetailId')}
                filter={filter}
                listData={listData}
                detailData={detailData}
                statDebtorsDialog={statDebtorsDialog}
                handleSubmitMultiUpdate={handleSubmitMultiUpdate}
                handleOpenCloseDetail={handleOpenCloseDetail}/>
        }
        return (
            <Row key={id}
                 className={classes.list + ' dottedList'}
                 onTouchTap={() => { handleOpenCloseDetail.handleOpenDetail(id) }}>
                <Col xs={4}>{client}</Col>
                <Col xs={2}>{deptSum}</Col>
                <Col xs={2}>{expectSum}</Col>
                <Col xs={2}>{deptSum}</Col>
                <Col xs={2}>{expectSum}</Col>
            </Row>
        )
    })

    const fields = (
        <div>
            {divisionStatus && <Field
                name="division"
                component={DivisionSearchField}
                className={classes.inputFieldCustom}
                label="Подразделение"
                fullWidth={true}
            />}
        </div>
    )

    const countDebtors = _.get(listData, ['statData', 'debtors'])
    const deptSum = numberFormat(_.get(listData, ['statData', 'debtsSum']), getConfig('PRIMARY_CURRENCY'))
    const expectSum = numberFormat(_.get(listData, ['statData', 'expectSum']), getConfig('PRIMARY_CURRENCY'))
    const page = (
        <div className={classes.mainWrapper}>
            <Row style={{margin: '0', height: '100%'}}>
                <div className={classes.leftPanel}>
                    <StatSideMenu currentUrl={ROUTES.STATISTICS_DEBTORS_URL}/>
                </div>
                <div className={classes.rightPanel}>
                    <div className={classes.wrapper}>
                        <StatisticsFilterExcel
                            filter={filter}
                            fields={fields}
                            filterKeys={STAT_DEBTORS_FILTER_KEY}
                            handleSubmitFilterDialog={handleSubmitFilterDialog}
                            handleGetDocument={getDocument.handleGetDocument}
                            withoutDate={true}
                        />
                        {statLoading
                            ? <div className={classes.statLoader}>
                                <Loader size={0.75}/>
                            </div>
                            : <div className={classes.debtors}>
                                <div>
                                    <span>Всего должников</span>
                                    <div>{countDebtors} клиентов</div>
                                </div>
                                <div>
                                    <span>Просроченные платежи</span>
                                    <div>{deptSum}</div>
                                </div>
                                <div>
                                    <span>Ожидаемые поступления</span>
                                    <div>{expectSum}</div>
                                </div>
                            </div>}
                        <form onSubmit={handleSubmit(handleSubmitFilterDialog)} className={classes.pagination}>
                            <div>
                                <strong>Отчет по задолжностям</strong>
                            </div>
                            <Field
                                className={classes.inputFieldCustom}
                                name="search"
                                component={TextField}
                                hintText="Клиент"/>
                            <Pagination filter={filter}/>
                        </form>
                        <div className={classes.tableWrapper}>
                            {headers}
                            {listLoading
                                ? <div className={classes.loader}>
                                    <Loader size={0.75}/>
                                </div>
                                : _.isEmpty(list)
                                    ? <div className={classes.emptyQuery}>
                                        <div>По вашему запросу ничего не найдено</div>
                                    </div>
                                    : list}
                        </div>
                    </div>
                </div>
            </Row>
        </div>
    )
    const data = {
        data: _.get(detailData, ['detailOrder']),
        id: _.get(detailData, 'openDetailId')
    }
    return (
        <Container>
            {page}
            <StatSaleDialog
                loading={_.get(detailData, 'detailOrderLoading')}
                detailData={data}
                open={_.get(statDebtorsDialog, 'openStatDebtorsDialog') !== ZERO}
                onClose={statDebtorsDialog.handleCloseStatDebtorsDialog}
                filter={filter}
                type={false}/>
        </Container>
    )
})

StatDebtorsGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    statDebtorsDialog: PropTypes.shape({
        openStatDebtorsDialog: PropTypes.number.isRequired,
        handleCloseStatDebtorsDialog: PropTypes.func.isRequired,
        handleOpenStatDebtorsDialog: PropTypes.func.isRequired
    }).isRequired
}

export default StatDebtorsGridList
