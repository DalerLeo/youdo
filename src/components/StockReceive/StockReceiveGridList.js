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
import TabTransferHistory from './StockTabTransferHistory'

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
                boxSizing: 'content-box',
                width: '100% !important',
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
        updateDialog,
        filter,
        printDialog,
        tabData,
        classes,
        handleCloseDetail,
        confirmDialog,
        createDialog,
        handleCheckedForm,
        historyDialog,
        returnDialog,
        supplyDialog,
        popoverDialog
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
                <Tab label="Движение товаров" value={TAB.STOCK_RECEIVE_TAB_OUT_HISTORY}/>
                <Tab label="История Приемки" value={TAB.STOCK_RECEIVE_TAB_HISTORY}/>
                <Tab label="История Передачи" value={TAB.STOCK_RECEIVE_TAB_TRANSFER_HISTORY}/>
            </Tabs>
            {TAB.STOCK_RECEIVE_TAB_RECEIVE === tab && <TabReceive
                filter={filter}
                listData={listData}
                detailData={detailData}
                confirmDialog={confirmDialog}
                handleCloseDetail={handleCloseDetail}
                updateDialog={updateDialog}
                createDialog={createDialog}
                filterDialog={filterDialog}
                history={false}
                handleCheckedForm={handleCheckedForm}

            />}
            {TAB.STOCK_RECEIVE_TAB_TRANSFER === tab && <TabTransfer
                filter={filter}
                listData={transferData}
                detailData={transferDetail}
                handleCloseDetail={handleCloseDetail}
                confirmDialog={confirmDialog}
                filterDialog={filterDialog}
                printDialog={printDialog}
            />}
            {TAB.STOCK_RECEIVE_TAB_OUT_HISTORY === tab && <TabHistory
                filter={filter}
                listData={historyData}
                filterDialog={filterDialog}
                historyDialog={historyDialog}
                returnDialog={returnDialog}
                supplyDialog={supplyDialog}
                popoverDialog={popoverDialog}
            />}
            {TAB.STOCK_RECEIVE_TAB_TRANSFER_HISTORY === tab && <TabTransferHistory
                filter={filter}
                listData={transferData}
                filterDialog={filterDialog}
                detailData={transferDetail}
                handleCloseDetail={handleCloseDetail}
                printDialog={printDialog}
            />}
            {TAB.STOCK_RECEIVE_TAB_HISTORY === tab && <TabReceive
                filter={filter}
                listData={listData}
                detailData={detailData}
                confirmDialog={confirmDialog}
                updateDialog={updateDialog}
                handleCloseDetail={handleCloseDetail}
                createDialog={createDialog}
                filterDialog={filterDialog}
                history={true}/>}

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
    filterDialog: PropTypes.shape({
        initialValues: PropTypes.object,
        filterLoading: PropTypes.bool,
        openFilterDialog: PropTypes.bool.isRequired,
        handleOpenFilterDialog: PropTypes.func.isRequired,
        handleCloseFilterDialog: PropTypes.func.isRequired,
        handleSubmitFilterDialog: PropTypes.func.isRequired
    }).isRequired,
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
    confirmDialog: PropTypes.shape({
        openConfirmDialog: PropTypes.number.isRequired,
        handleOpenConfirmDialog: PropTypes.func.isRequired,
        handleCloseConfirmDialog: PropTypes.func.isRequired,
        handleSubmitTransferAcceptDialog: PropTypes.func.isRequired,
        handleSubmitReceiveConfirmDialog: PropTypes.func.isRequired,
        handleSubmitOrderReturnDialog: PropTypes.func.isRequired
    }).isRequired,
    updateDialog: PropTypes.shape({
        updateLoading: PropTypes.bool.isRequired,
        openUpdateDialog: PropTypes.bool.isRequired,
        handleOpenUpdateDialog: PropTypes.func.isRequired,
        handleCloseUpdateDialog: PropTypes.func.isRequired
    }).isRequired,
    historyDialog: PropTypes.shape({
        openHistoryInfoDialog: PropTypes.number.isRequired,
        handleOpenHistoryDialog: PropTypes.func.isRequired,
        handleCloseHistoryDialog: PropTypes.func.isRequired
    }).isRequired

}

export default StockReceiveGridList
