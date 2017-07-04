import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import * as ROUTES from '../../constants/routes'
import {Link} from 'react-router'
import Container from '../Container'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import sprintf from 'sprintf'
import moment from 'moment'
import {compose} from 'recompose'
import CircularProgress from 'material-ui/CircularProgress'
import Paper from 'material-ui/Paper'
import StockReceiveDetails from './StockReceiveDetails'
import {Tabs, Tab} from 'material-ui/Tabs'
import * as TAB from '../../constants/stockReceiveTab'
import Pagination from '../GridList/GridListNavPagination'

const enhance = compose(
    injectSheet({
        loader: {
            position: 'absolute',
            background: '#fff',
            top: '0',
            left: '0',
            width: '100%',
            minHeight: '400px',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex'
        },
        list: {
            marginBottom: '5px',
            '& > a': {
                color: 'inherit'
            }
        },
        semibold: {
            fontWeight: '600',
            cursor: 'pointer'
        },
        wrapper: {
            padding: '15px 30px',
            '& .row': {
                alignItems: 'center'
            }
        },
        tabs: {
            marginBottom: '0',
            width: '100%',
            '& > div': {
                width: '40% !important',
                paddingRight: '60%',
                background: 'transparent !important'
            },
            '& > div:first-child': {
                height: '40px',
                alignItems: 'center',
                borderBottom: '1px #cccccc solid'
            },
            '& > div:last-child': {
                width: '100% !important',
                padding: '0'
            },
            '& > div:nth-child(2) > div': {
                marginTop: '-1px !important',
                marginBottom: '-1px',
                backgroundColor: '#12aaeb !important',
                height: '1px !important'
            },
            '& button': {
                color: '#333 !important'
            },
            '& button > span:first-line': {
                color: '#a6dff7'
            },
            '& button div div': {
                textTransform: 'initial',
                height: '40px !important'
            }
        },
        headers: {
            color: '#666',
            padding: '15px 30px',
            '& .row': {
                alignItems: 'center'
            }
        },
        actionButton: {
            background: '#12aaeb',
            borderRadius: '2px',
            color: '#fff',
            padding: '5px 20px'
        },
        success: {
            color: '#81c784'
        },
        begin: {
            color: '#f0ad4e'
        },
        error: {
            color: '#e57373'
        },
        waiting: {
            color: '#64b5f6'
        }
    })
)

const StockReceiveGridList = enhance((props) => {
    const {
        listData,
        detailData,
        filter,
        tabData,
        classes,
        handleCloseDetail
    } = props
    const tab = _.get(tabData, 'tab')
    const detailId = _.get(detailData, 'id')
    const listLoading = _.get(listData, 'listLoading')

    const listDetail = (
        <StockReceiveDetails
            key={detailId}
            detailData={detailData}
        />
    )
    let list = (
        <div style={{position: 'relative'}}>
            <div className={classes.headers}>
                <Row>
                    <Col xs={2}>№ заказа</Col>
                    <Col xs={4}>От кого</Col>
                    <Col xs={2}>Дата приемки</Col>
                    <Col xs={2}>Статус</Col>
                </Row>
            </div>
            {_.map(_.get(listData, 'data'), (item) => {
                const id = _.get(item, 'id')
                const provider = _.get(item, ['provider', 'name'])
                const acceptedDate = moment(_.get(item, 'acceptedTime')).format('DD.MM.YYYY')
                const status = _.toInteger(_.get(item, 'status'))
                const PENDING = 0
                const IN_PROGRESS = 1
                const COMPLETED = 2

                if (id === detailId) {
                    return (
                        <Paper key={id} zDepth={1} className={classes.list}>
                            <div className={classes.wrapper}>
                                <Row className={classes.semibold}>
                                    <Col xs={2}>{id}</Col>
                                    <Col xs={4} onClick={handleCloseDetail}>{provider}</Col>
                                    <Col xs={2}>{acceptedDate}</Col>
                                    <Col xs={2}>{status === PENDING ? (<span className={classes.waiting}>Ожидает</span>)
                                        : ((status === IN_PROGRESS) ? (<span className={classes.begin}>В процессе</span>)
                                            : (status === COMPLETED) ? (<span className={classes.success}>Принят</span>)
                                                : (<span className={classes.error}>Отменен</span>))}</Col>
                                    <Col xs={2} style={{textAlign: 'right'}}>
                                        <a className={classes.actionButton}>Выполнить</a>
                                    </Col>
                                </Row>
                            </div>
                            {listDetail}
                        </Paper>
                    )
                }
                return (
                    <Paper key={id} zDepth={1} className={classes.list}>
                        <Link to={{
                            pathname: sprintf(ROUTES.STOCK_RECEIVE_ITEM_PATH, id),
                            query: filter.getParams()
                        }}>
                            <div className={classes.wrapper}>
                                <Row>
                                    <Col xs={2}>{id}</Col>
                                    <Col xs={4}>{provider}</Col>
                                    <Col xs={2}>{acceptedDate}</Col>
                                    <Col xs={2}>{status === PENDING ? (<span className={classes.waiting}>Ожидает</span>)
                                        : ((status === IN_PROGRESS) ? (<span className={classes.begin}>В процессе</span>)
                                            : (status === COMPLETED) ? (<span className={classes.success}>Принят</span>)
                                                : (<span className={classes.error}>Отменен</span>))}</Col>
                                    <Col xs={2} style={{textAlign: 'right'}}>
                                        <a className={classes.actionButton}>Выполнить</a>
                                    </Col>
                                </Row>
                            </div>
                        </Link>
                    </Paper>
                )
            })}
        </div>
    )
    if (listLoading) {
        list = (
            <div className={classes.loader}>
                <CircularProgress size={80} thickness={5}/>
            </div>
        )
    }

    const tabList = (
        <Tabs
            value={tab}
            className={classes.tabs}
            onChange={(value) => tabData.handleTabChange(value)}>
            <Tab label="Приемка" value={TAB.STOCK_RECEIVE_TAB_RECEIVE}>
                {list}
            </Tab>
            <Tab label="Передача" value={TAB.STOCK_RECEIVE_TAB_TRANSFER}>
                2
            </Tab>
            <Tab label="История" value={TAB.STOCK_RECEIVE_TAB_HISTORY}>
                3
            </Tab>
            <Pagination
                filter={filter}
                customPagination={true}/>
        </Tabs>
    )

    return (
        <Container>
            <SubMenu url={ROUTES.STOCK_RECEIVE_LIST_URL}/>
            {tabList}
        </Container>
    )
})

StockReceiveGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    tabData: PropTypes.shape({
        tab: PropTypes.string.isRequired,
        handleTabChange: PropTypes.func.isRequired
    }),
    handleCloseDetail: PropTypes.func.isRequired
}

export default StockReceiveGridList
