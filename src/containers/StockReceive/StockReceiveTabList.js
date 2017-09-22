import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {hashHistory} from 'react-router'
import * as ROUTER from '../../constants/routes'
import Container from '../Container'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import {compose, withHandlers} from 'recompose'
import {Tabs, Tab} from 'material-ui/Tabs'
import * as TAB from '../../constants/stockReceiveTab'

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
    }),
    withHandlers({
        handleTabChange: props => (tab) => {
            if (tab === 'receive') {
                hashHistory.push({
                    pathname: ROUTER.STOCK_RECEIVE_LIST_URL,
                    query: {}
                })
            } else if (tab === 'transfer') {
                hashHistory.push({
                    pathname: ROUTER.STOCK_TRANSFER_LIST_URL,
                    query: {}
                })
            } else if (tab === 'outHistory') {
                hashHistory.push({
                    pathname: ROUTER.STOCK_OUT_HISTORY_LIST_URL,
                    query: {}
                })
            } else if (tab === 'transferHistory') {
                hashHistory.push({
                    pathname: ROUTER.STOCK_TRANSFER_HISTORY_LIST_URL,
                    query: {}
                })
            } else if (tab === 'receiveHistory') {
                hashHistory.push({
                    pathname: ROUTER.STOCK_RECEIVE_HISTORY_LIST_URL,
                    query: {}
                })
            }
        }
    })
)

const StockReceiveTabList = enhance((props) => {
    const {
        classes
    } = props
    const handleTabChange = props.handleTabChange
    const tabList = (
        <div className={classes.tabWrapper}>
            <Tabs
                inkBarStyle={{backgroundColor: '#12aaeb', height: '3px'}}
                tabItemContainerStyle={{backgroundColor: '#fff', color: '#333'}}
                className={classes.tabs}
                onChange={(value) => handleTabChange(value)}>
                <Tab label="Приемка" value={TAB.STOCK_RECEIVE_TAB_RECEIVE}/>
                <Tab label="Передача" value={TAB.STOCK_RECEIVE_TAB_TRANSFER}/>
                <Tab label="Движение товаров" value={TAB.STOCK_RECEIVE_TAB_OUT_HISTORY}/>
                <Tab label="История Приемки" value={TAB.STOCK_RECEIVE_TAB_HISTORY}/>
                <Tab label="История Передачи" value={TAB.STOCK_RECEIVE_TAB_TRANSFER_HISTORY}/>
            </Tabs>

        </div>
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
