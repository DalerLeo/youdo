import _ from 'lodash'
import React from 'react'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Loader from '../../Loader'
import {Tabs, Tab} from 'material-ui/Tabs'
import NotFound from '../../Images/not-found.png'
import {Row, Col} from 'react-flexbox-grid'
import numberFormat from '../../../helpers/numberFormat'
import dateTimeFormat from '../../../helpers/dateTimeFormat'
import * as TAB from '../../../constants/manufactureShipmentTab'
import Sort from 'material-ui/svg-icons/content/sort'
import Log from 'material-ui/svg-icons/content/content-paste'
import Product from 'material-ui/svg-icons/device/widgets'
import Material from 'material-ui/svg-icons/action/exit-to-app'
import Pagination from '../../ReduxForm/Pagination'

const enhance = compose(
    injectSheet({
        dottedList: {
            padding: '20px 0'
        },
        wrapper: {
            width: '100%',
            alignSelf: 'flex-start'
        },
        loader: {
            width: '100%',
            background: '#fff',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        title: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            height: '65px',
            padding: '0 30px',
            borderBottom: '1px #efefef solid',
            '& span': {
                fontSize: '11px',
                textAlign: 'right',
                fontWeight: 'normal'
            }
        },
        titleLabel: {
            fontSize: '18px',
            color: '#333',
            fontWeight: '600'
        },
        details: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%'
        },
        leftSide: {
            width: '100%',
            borderRight: '1px #efefef solid'
        },
        infoBlock: {
            padding: '15px 30px',
            borderBottom: '1px #efefef solid',
            '&:last-child': {
                border: 'none'
            },
            '& ul li': {
                marginBottom: '5px',
                '& > span:last-child': {
                    marginLeft: '5px',
                    fontWeight: '600'
                }
            }
        },
        rightSide: {
            width: '100%',
            position: 'relative',
            borderTop: '1px #efefef solid',
            '& > div > div': {
                '&:nth-child(1)': {
                    paddingRight: 'calc(100% - 330px)'
                },
                '&:nth-child(2)': {
                    paddingRight: 'calc(100% - 330px)'
                }
            }
        },
        tabWrapper: {
            borderTop: '1px #efefef solid',
            marginTop: '-1px'
        },
        tab: {
            textTransform: 'none !important',
            '& > div': {
                flexDirection: 'row !important',
                height: '48px !important',
                '& svg': {
                    marginBottom: '0 !important',
                    marginRight: '5px',
                    width: '22px !important',
                    height: '22px !important'
                }
            }
        },
        flexReview: {
            display: 'flex',
            '& > div': {
                width: '50%',
                borderRight: '1px #efefef solid',
                '&:last-child': {
                    borderRight: 'none'
                }
            }
        },
        productsBlock: {
            padding: '15px 30px',
            '& h4': {
                fontWeight: '600',
                marginBottom: '5px',
                fontSize: '13px'
            }
        },
        flexTitle: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '5px',
            '& h4': {
                fontWeight: '600',
                fontSize: '13px'
            },
            '& > div:last-child': {
                textAlign: 'right'
            }
        },
        product: {
            display: 'flex',
            padding: '5px 0',
            justifyContent: 'space-between',
            '& span': {
                display: 'flex',
                alignItems: 'center',
                '& svg': {
                    marginRight: '5px'
                }
            },
            '& > div:last-child': {
                textAlign: 'right'
            }
        },
        pagination: {
            position: 'absolute',
            display: 'flex',
            height: '48px',
            top: '-48px',
            right: '30px'
        },
        emptyQuery: {
            background: 'url(' + NotFound + ') no-repeat center center',
            backgroundSize: '285px',
            padding: '260px 0 0',
            textAlign: 'center',
            fontSize: '15px',
            color: '#666',
            '& svg': {
                width: '50px !important',
                height: '50px !important',
                color: '#999 !important'
            }
        }
    }),
)

const ManufactureShipmentDetail = enhance((props) => {
    const {
        filterLogs,
        classes,
        tabData,
        detailData,
        handleCloseDetail
    } = props

    const iconStyles = {
        product: {
            width: 20,
            height: 20,
            color: '#81c784'
        },
        material: {
            width: 20,
            height: 20,
            color: '#999'
        }
    }
    const PRODUCT = 'return'
    const tab = _.get(tabData, 'tab')
    const loading = _.get(detailData, 'loading')
    const logsLoading = _.get(detailData, 'logsLoading')
    const productsLoading = _.get(detailData, 'productsLoading')
    const materialsLoading = _.get(detailData, 'materialsLoading')
    const userName = _.get(detailData, ['data', 'user', 'firstName']) + ' ' + _.get(detailData, ['data', 'user', 'secondName'])
    const openedTime = _.get(detailData, ['data', 'openedTime']) ? dateTimeFormat(_.get(detailData, ['data', 'openedTime'])) : 'Не началась'
    const closedTime = _.get(detailData, ['data', 'closedTime']) ? dateTimeFormat(_.get(detailData, ['data', 'closedTime'])) : 'Не закончилась'
    const producs = _.map(_.get(detailData, 'products'), (item, index) => {
        const measurement = _.get(item, ['measurement', 'name'])
        const product = _.get(item, ['product', 'name'])
        const amount = _.get(item, 'totalAmount')
        return (
            <div key={index} className={classes.product}>
                <span>{product}</span>
                <span>{numberFormat(amount, measurement)}</span>
            </div>
        )
    })
    const materials = _.map(_.get(detailData, 'materials'), (item, index) => {
        const measurement = _.get(item, ['measurement', 'name'])
        const product = _.get(item, ['product', 'name'])
        const amount = _.get(item, 'totalAmount')
        return (
            <div key={index} className={classes.product}>
                <span>{product}</span>
                <span>{numberFormat(amount, measurement)}</span>
            </div>
        )
    })
    const logs = _.map(_.get(detailData, 'logs'), (item, index) => {
        const measurement = _.get(item, ['product', 'measurement', 'name'])
        const product = _.get(item, ['product', 'name'])
        const createdDate = dateTimeFormat(_.get(item, 'createdDate'))
        const amount = _.get(item, 'amount')
        const type = _.get(item, 'type')
        return (
            <Row key={index} className={classes.product}>
                {type === PRODUCT
                    ? <Col xs={8}><span><Product style={iconStyles.product}/>{product}</span></Col>
                    : <Col xs={8}><span><Material style={iconStyles.material}/>{product}</span></Col>}
                <Col xs={2}>{numberFormat(amount, measurement)}</Col>
                <Col xs={2}>{createdDate}</Col>
            </Row>
        )
    })
    if (loading || productsLoading || materialsLoading) {
        return (
            <div className={classes.loader}>
                <Loader size={0.75}/>
            </div>
        )
    }
    const tabStyles = {
        ink: {
            background: '#12aaeb',
            margin: '0',
            height: '2px'
        }
    }
    return (
        <div className={classes.wrapper}>
            <div className={classes.title} onClick={handleCloseDetail}>
                <div className={classes.titleLabel}>{userName}</div>
                <span>Начало смены: {openedTime} <br/> Конец смены: {closedTime}</span>
            </div>
            <div className={classes.details}>
                <div className={classes.leftSide}>
                    <div className={classes.infoBlock}>
                        <ul>
                            <li>
                                <span>Исп. оборудование:</span>
                                <span>SUPER Charger GGX</span>
                            </li>
                            <li>
                                <span>Передано в:</span>
                                <span>Главный склад</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className={classes.rightSide}>
                    <Tabs
                        value={tab}
                        contentContainerClassName={classes.tabWrapper}
                        inkBarStyle={tabStyles.ink}
                        onChange={(value) => tabData.handleTabChange(value)}>
                        <Tab
                            label="Обзор"
                            className={classes.tab}
                            disableTouchRipple={true}
                            icon={<Sort/>}
                            value={TAB.TAB_SORTED}>
                            <div className={classes.flexReview}>
                                <div className={classes.productsBlock}>
                                    <h4>Произведенная продукция</h4>
                                    {producs}
                                </div>
                                <div className={classes.productsBlock}>
                                    <h4>Затраченное сырье</h4>
                                    {materials}
                                </div>
                            </div>
                        </Tab>

                        <Tab
                            label="Записи"
                            className={classes.tab}
                            disableTouchRipple={true}
                            icon={<Log/>}
                            value={TAB.TAB_LOGS}>
                            <div className={classes.productsBlock}>
                                <div className={classes.pagination}>
                                    <Pagination filter={filterLogs}/>
                                </div>
                                <Row className={classes.flexTitle}>
                                    <Col xs={8}><h4>Продукт / сырье</h4></Col>
                                    <Col xs={2}><h4>Кол-во</h4></Col>
                                    <Col xs={2}><h4>Дата</h4></Col>
                                </Row>
                                {logsLoading
                                    ? <div className={classes.loader}>
                                        <Loader size={0.75}/>
                                    </div>
                                    : logs}
                            </div>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </div>
    )
})

ManufactureShipmentDetail.propTypes = {
}

export default ManufactureShipmentDetail
