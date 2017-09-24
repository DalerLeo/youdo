import React from 'react'
import PropTypes from 'prop-types'
import {hashHistory} from 'react-router'
import * as ROUTER from '../../constants/routes'
import Container from '../../components/Container'
import SubMenu from '../../components/SubMenu'
import injectSheet from 'react-jss'
import {compose, withHandlers, withState} from 'recompose'
import {Tabs, Tab} from 'material-ui/Tabs'
import * as TAB from '../../constants/stockReceiveTab'

const enhance = compose(
    injectSheet({
        tabs: {
            marginBottom: '20px',
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
        }
    }),
    withState('tab', 'setTab', 'receive'),
    withHandlers({
        handleTabChange: props => (tab) => {
            if (tab === 'stockReceive') {
                hashHistory.push({
                    pathname: ROUTER.STOCK_RECEIVE_LIST_URL,
                    query: {}
                })
            } else if (tab === 'stockTransfer') {
                hashHistory.push({
                    pathname: ROUTER.STOCK_TRANSFER_LIST_URL,
                    query: {}
                })
            } else if (tab === 'stockOutHistory') {
                hashHistory.push({
                    pathname: ROUTER.STOCK_OUT_HISTORY_LIST_URL,
                    query: {}
                })
            } else if (tab === 'stockTransferHistory') {
                hashHistory.push({
                    pathname: ROUTER.STOCK_TRANSFER_HISTORY_LIST_URL,
                    query: {}
                })
            } else if (tab === 'stockReceiveHistory') {
                hashHistory.push({
                    pathname: ROUTER.STOCK_RECEIVE_HISTORY_LIST_URL,
                    query: {}
                })
            }
        }
    })
)

const StockReceiveTabList = enhance((props) => {
    const {classes, currentTab} = props

    const handleTabChange = props.handleTabChange
    const tabList = (
        <Tabs
            inkBarStyle={{backgroundColor: '#12aaeb', height: '3px'}}
            tabItemContainerStyle={{backgroundColor: '#fff', color: '#333'}}
            className={classes.tabs}
            value={currentTab}
            onChange={(value) => { handleTabChange(value) }}>
            <Tab label="Приемка" value={TAB.STOCK_RECEIVE_TAB_RECEIVE}/>
            <Tab label="Передача" value={TAB.STOCK_RECEIVE_TAB_TRANSFER}/>
            <Tab label="Движение товаров" value={TAB.STOCK_RECEIVE_TAB_OUT_HISTORY}/>
            <Tab label="История Приемки" value={TAB.STOCK_RECEIVE_TAB_HISTORY}/>
            <Tab label="История Передачи" value={TAB.STOCK_RECEIVE_TAB_TRANSFER_HISTORY}/>
        </Tabs>
    )

    return (
        <Container>
            <SubMenu url={ROUTER.STOCK_RECEIVE_LIST_URL}/>
            {tabList}
        </Container>
    )
})

StockReceiveTabList.propTypes = {
    tabData: PropTypes.shape({
        tab: PropTypes.string.isRequired,
        handleTabChange: PropTypes.func.isRequired
    })

}

export default StockReceiveTabList
