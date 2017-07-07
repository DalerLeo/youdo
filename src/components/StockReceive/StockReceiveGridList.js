import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import * as ROUTES from '../../constants/routes'
import Container from '../Container'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import {Tabs, Tab} from 'material-ui/Tabs'
import * as TAB from '../../constants/stockReceiveTab'
import TabReceive from './StockTabReceive'
import TabTransfer from './StockTabTransfer'
import TabHistory from './StockTabHistory'

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
        tabWrapper: {
            position: 'relative'
        },
        tabs: {
            marginBottom: '0',
            width: '100%',
            '& > div': {
                width: '300px !important',
                paddingRight: 'calc(100% - 300px)',
                '&:first-child': {
                    boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px',
                    borderRadius: '2px',
                    height: '52px',
                    alignItems: 'center',
                    '& button': {
                        color: '#333 !important'
                    }
                },
                '&:nth-child(2)': {
                    marginTop: '-3px'
                },
                '&:last-child': {
                    width: '100% !important',
                    padding: '0'
                }
            },
            '& button div div': {
                textTransform: 'initial',
                height: '52px !important'
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
        historyData,
        transferData,
        transferDetail,
        filterDialog,
        detailData,
        filter,
        tabData,
        classes,
        createDialog,
        handleCloseDetail
    } = props
    const tab = _.get(tabData, 'tab')

    const tabList = (
        <div className={classes.tabWrapper}>
            <Tabs
                inkBarStyle={{backgroundColor: '#12aaeb', height: '3px'}}
                tabItemContainerStyle={{backgroundColor: '#fff', color: '#333'}}
                value={tab}
                className={classes.tabs}
                onChange={(value) => tabData.handleTabChange(value)}>
                <Tab label="Приемка" value={TAB.STOCK_RECEIVE_TAB_RECEIVE}/>
                <Tab label="Передача" value={TAB.STOCK_RECEIVE_TAB_TRANSFER}/>
                <Tab label="История" value={TAB.STOCK_RECEIVE_TAB_HISTORY}/>
            </Tabs>
            {TAB.STOCK_RECEIVE_TAB_RECEIVE === tab && <TabReceive
                filter={filter}
                listData={listData}
                detailData={detailData}
                createDialog={createDialog}
                handleCloseDetail={handleCloseDetail}
            />}
            {TAB.STOCK_RECEIVE_TAB_TRANSFER === tab && <TabTransfer
                filter={filter}
                listData={transferData}
                detailData={transferDetail}
                createDialog={createDialog}
                handleCloseDetail={handleCloseDetail}
            />}
            {TAB.STOCK_RECEIVE_TAB_HISTORY === tab && <TabHistory
                filter={filter}
                listData={historyData}
                filterDialog={filterDialog}
            />}
        </div>
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
    historyData: PropTypes.object,
    transferData: PropTypes.object,
    detailData: PropTypes.object,
    transferDetail: PropTypes.object,
    tabData: PropTypes.shape({
        tab: PropTypes.string.isRequired,
        handleTabChange: PropTypes.func.isRequired
    }),
    handleCloseDetail: PropTypes.func.isRequired,
    createDialog: PropTypes.shape({
        createLoading: PropTypes.bool.isRequired,
        openCreateDialog: PropTypes.bool.isRequired,
        isDefect: PropTypes.bool,
        detailProducts: PropTypes.object,
        detailLoading: PropTypes.bool,
        handleOpenCreateDialog: PropTypes.func.isRequired,
        handleCloseCreateDialog: PropTypes.func.isRequired,
        handleSubmitCreateDialog: PropTypes.func.isRequired
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

export default StockReceiveGridList
