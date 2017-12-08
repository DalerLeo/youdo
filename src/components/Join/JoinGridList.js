import _ from 'lodash'
import React from 'react'
import * as ROUTES from '../../constants/routes'
import Container from '../Container'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import {Tabs, Tab} from 'material-ui/Tabs'
import * as TAB from '../../constants/joinTab'
import TabClients from './JoinTabClients'
import TabMarkets from './JoinTabMarkets'
import SettingSideMenu from '../Settings/SettingsSideMenu'

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
        wrapper: {
            display: 'flex',
            margin: '0 -28px',
            height: 'calc(100% + 28px)'
        },
        rightPanel: {
            background: '#fff',
            flexBasis: 'calc(100% - 225px)',
            maxWidth: 'calc(100% - 225px)',
            paddingTop: '10px',
            overflowY: 'auto',
            overflowX: 'hidden'
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
        tabWrapper: {
            position: 'relative'
        },
        tabs: {
            marginBottom: '0',
            width: '100%',
            '& > div': {
                boxSizing: 'content-box',
                width: '400px !important',
                paddingRight: 'calc(100% - 400px)',
                background: '#f2f5f8',
                '&:first-child': {
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

const JoinGridList = enhance((props) => {
    const {
        marketFilter,
        clientFilter,
        tabData,
        classes,
        marketsData,
        clientsData,
        joinMarketDialog,
        joinClientDialog,
        hasMarket
    } = props
    const tab = _.get(tabData, 'tab') || 'clients'
    const tabList = (
        <div className={classes.tabWrapper}>
            <Tabs
                inkBarStyle={{backgroundColor: '#12aaeb', height: '3px'}}
                tabItemContainerStyle={{backgroundColor: '#fff', color: '#333'}}
                value={tab}
                className={classes.tabs}
                onChange={(value) => tabData.handleTabChange(value)}>
                {hasMarket && <Tab label="Магазины" value={TAB.JOIN_TAB_MARKETS}/>}
                <Tab label="Клиенты" value={TAB.JOIN_TAB_CLIENTS}/>
            </Tabs>
            {TAB.JOIN_TAB_MARKETS === tab && hasMarket &&
            <TabMarkets
                filter={marketFilter}
                listData={marketsData}
                joinMarketDialog={joinMarketDialog}
            />}
            {TAB.JOIN_TAB_CLIENTS === tab &&
            <TabClients
                filter={clientFilter}
                listData={clientsData}
                joinClientDialog={joinClientDialog}
            />}
        </div>
    )
    return (
        <Container>
            <div className={classes.wrapper}>
                <SettingSideMenu currentUrl={ROUTES.JOIN_LIST_URL}/>
                <div className={classes.rightPanel}>
                    {tabList}
                </div>
            </div>
        </Container>
    )
})

JoinGridList.propTypes = {

}

export default JoinGridList
