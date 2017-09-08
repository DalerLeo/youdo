import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import {Row, Col} from 'react-flexbox-grid'
import * as ROUTES from '../../../constants/routes'
import Container from '../../Container/index'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import StatAgentDialog from './StatAgentDialog'
import StatSideMenu from '../StatSideMenu'
import CircularProgress from 'material-ui/CircularProgress'
import Pagination from '../../GridList/GridListNavPagination/index'
import numberFormat from '../../../helpers/numberFormat.js'
import getConfig from '../../../helpers/getConfig'
import NotFound from '../../Images/not-found.png'
import StatAgentFilterForm from './StatAgentFilterForm'
import GridListHeader from '../../GridList/GridListHeader/index'

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
            height: 'calc(100% - 118px)',
            overflowY: 'auto',
            overflowX: 'hidden',
            '& .row': {
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
        header: {
            position: 'relative',
            top: 'auto'
        },
        alignRightFlex: {
            justifyContent: 'flex-end'
        }
    }),
)

const listHeader = [
    {
        sorting: false,
        name: 'agent',
        title: 'Агенты',
        xs: 2
    },
    {
        sorting: false,
        name: 'monthlyPlanAmount',
        title: 'План',
        xs: 1
    },
    {
        sorting: false,
        name: 'ordersTotalPrice',
        title: 'Сумма продаж',
        xs: 2
    },
    {
        sorting: false,
        name: 'ordersReturnTotalPrice',
        title: 'Сумма возарата',
        xs: 2
    },
    {
        sorting: true,
        name: 'factPrice',
        title: 'Факт. продажи',
        xs: 2
    },
    {
        sorting: true,
        name: 'totalPaid',
        alignRight: true,
        title: 'Оплачено',
        xs: 1
    },
    {
        sorting: true,
        name: 'ordersLeftTotalPrice',
        alignRight: true,
        title: 'Баланс',
        xs: 1
    },
    {
        sorting: true,
        alignRight: true,
        name: 'monthlyPlanLeft',
        title: 'До выполнения',
        xs: 1
    }
]

const StatAgentGridList = enhance((props) => {
    const {
        classes,
        statAgentDialog,
        listData,
        filter,
        handleSubmitFilterDialog,
        detailData,
        getDocument,
        calendar,
        initialValues
    } = props

    const listLoading = _.get(listData, 'listLoading')

    const list = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const plan = numberFormat(_.get(item, 'monthlyPlanAmount'), getConfig('PRIMARY_CURRENCY'))
        const factPrice = numberFormat(_.get(item, 'factPrice'), getConfig('PRIMARY_CURRENCY'))
        const orderTotalPrice = numberFormat(_.get(item, 'ordersTotalPrice'), getConfig('PRIMARY_CURRENCY'))
        const orderReturnTotalPrice = numberFormat(_.get(item, 'ordersReturnTotalPrice'), getConfig('PRIMARY_CURRENCY'))
        const orderLeftTotalPrice = numberFormat(_.get(item, 'ordersLeftTotalPrice'), getConfig('PRIMARY_CURRENCY'))
        const totalPaid = numberFormat(_.get(item, 'totalPaid'), getConfig('PRIMARY_CURRENCY'))
        const monthlyPlanLeft = numberFormat(_.get(item, 'monthlyPlanLeft'), getConfig('PRIMARY_CURRENCY'))

        return (
            <Row key={id} className="dottedList">
                <Col xs={2}>
                    <div className={classes.pointer} onClick={() => { statAgentDialog.handleOpenStatAgentDialog(id) }}>{name}</div>
                </Col>
                <Col xs={1}>
                    <div>{plan}</div>
                </Col>
                <Col xs={2}>
                    <div>{orderTotalPrice}</div>
                </Col>
                <Col xs={2}>
                    <div>{orderReturnTotalPrice}</div>
                </Col>
                <Col xs={2}>
                    <div>{factPrice}</div>
                </Col>
                <Col xs={1} className={classes.alignRightFlex}>
                    <div>{totalPaid}</div>
                </Col>
                <Col xs={1} className={classes.alignRightFlex}>
                    <div>{orderLeftTotalPrice}</div>
                </Col>
                <Col xs={1} className={classes.alignRightFlex}>
                    <div>{monthlyPlanLeft}</div>
                </Col>
            </Row>
        )
    })
    const listIds = _.map(list, item => _.toInteger(_.get(item, 'key')))
    const page = (
        <div className={classes.mainWrapper}>
            <Row style={{margin: '0', height: '100%'}}>
                <div className={classes.leftPanel}>
                     <StatSideMenu currentUrl={ROUTES.STATISTICS_AGENT_URL}/>
                </div>
                <div className={classes.rightPanel}>
                    <div className={classes.wrapper}>
                        <StatAgentFilterForm
                            onSubmit={handleSubmitFilterDialog}
                            initialValues={initialValues}
                            getDocument={getDocument}
                            calendar={calendar}/>
                        <Pagination filter={filter}/>
                    {listLoading
                        ? <div className={classes.loader}>
                            <CircularProgress size={40} thickness={4}/>
                        </div>
                        : (_.isEmpty(list))
                            ? <div className={classes.emptyQuery}>
                                <div>По вашему запросу ничего не найдено</div>
                            </div>
                            : <div className={classes.tableWrapper}>
                                <GridListHeader
                                    filter={filter}
                                    listIds={listIds}
                                    withoutCheckboxes={false}
                                    withoutRow={false}
                                    column={listHeader}
                                    listShadow={true}
                                    style={{position: 'relative'}}
                                    className={classes.header}
                                    statistics={true}
                                />
                                {list}
                            </div>}
                    </div>
                </div>
            </Row>
        </div>
    )

    return (
        <Container>
            {page}
            <StatAgentDialog
                loading={_.get(detailData.detailLoading)}
                detailData={detailData}
                open={statAgentDialog.openStatAgentDialog}
                onClose={statAgentDialog.handleCloseStatAgentDialog}
                filter={filter}/>
        </Container>
    )
})

StatAgentGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    getDocument: PropTypes.object.isRequired,
    statAgentDialog: PropTypes.shape({
        openStatAgentDialog: PropTypes.bool.isRequired,
        handleOpenStatAgentDialog: PropTypes.func.isRequired,
        handleCloseStatAgentDialog: PropTypes.func.isRequired
    }).isRequired
}

export default StatAgentGridList
