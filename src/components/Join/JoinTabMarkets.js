import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row} from 'react-flexbox-grid'
import GridList from '../GridList'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import IconButton from 'material-ui/IconButton'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import Join from 'material-ui/svg-icons/content/link'
import Tooltip from '../ToolTip'
import JoinDialog from './JoinDialog'

const listHeader = [
    {
        xs: '20%',
        sorting: true,
        name: 'name',
        title: 'Название'
    },
    {
        xs: '25%',
        sorting: true,
        name: 'client',
        title: 'Клиент'
    },
    {
        xs: '15%',
        sorting: true,
        title: 'Похожие'
    },
    {
        xs: '20%',
        sorting: true,
        name: 'address',
        title: 'Адрес'
    },
    {
        xs: '15%',
        sorting: true,
        name: 'phone',
        title: 'Телефон'
    },
    {
        xs: '5%'
    }
]

const enhance = compose(
    injectSheet({
        loader: {
            position: 'absolute',
            background: '#fff',
            top: '72px',
            left: '0',
            width: '100%',
            minHeight: '400px',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex'
        },
        iconBtn: {
            display: 'flex',
            justifyContent: 'flex-end',
            opacity: '0',
            transition: 'all 200ms ease-out',
            '& button > div': {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }
        },
        listRow: {
            margin: '0 -30px !important',
            width: 'auto !important',
            padding: '0 30px',
            '& > div': {
                padding: '0 0.5rem !important'
            },
            '&:hover > div:last-child > div ': {
                opacity: '1'
            }
        },
        wrapper: {
            position: 'relative',
            '& .row > div > svg': {
                position: 'relative',
                width: '16px !important',
                height: '16px !important',
                top: '3px',
                marginRight: '5px'
            }
        },
        mainButton: {
            position: 'absolute',
            top: -50,
            right: 18
        }
    })
)

const iconStyle = {
    icon: {
        color: '#5d6474',
        width: 22,
        height: 22
    },
    button: {
        width: 40,
        height: 40,
        padding: 0
    }
}

const JoinTabMarkets = enhance((props) => {
    const {
        filter,
        listData,
        classes,
        joinMarketDialog
    } = props

    const shopDetail = (
        <div>-</div>

    )
    const shopList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const client = _.get(item, ['client', 'name'])
        const address = _.get(item, 'address') || 'Не известен'
        const phone = _.get(item, 'phone') || '-'
        return (
            <Row key={id} className={classes.listRow}>
                <div style={{width: '20%'}}>{name}</div>
                <div style={{width: '25%'}}>{client}</div>
                <div style={{width: '15%'}}>3</div>
                <div style={{width: '20%'}}>{address}</div>
                <div style={{width: '15%'}}>{phone}</div>
                <div style={{width: '5%'}}>
                    <div className={classes.iconBtn}>
                        <Tooltip position="bottom" text="Объединить">
                            <IconButton
                                onTouchTap={() => { joinMarketDialog.handleOpenJoinMarkets(id) }}
                                iconStyle={iconStyle.icon}
                                style={iconStyle.button}>
                                <Join/>
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
            </Row>
        )
    })

    const list = {
        header: listHeader,
        list: shopList,
        loading: _.get(listData, 'marketsListLoading')
    }

    return (
        <div className={classes.wrapper}>
            <GridList
                filter={filter}
                list={list}
                withoutRow={true}
                listShadow={false}
                detail={shopDetail}
            />
            <div className={classes.mainButton}>
                <Tooltip position="left" text="Объединить">
                    <FloatingActionButton
                        onTouchTap={() => { joinMarketDialog.handleOpenJoinMarkets(true) }}
                        backgroundColor="#12aaeb"
                        mini={true}
                        zDepth={1}>
                        <Join/>
                    </FloatingActionButton>
                </Tooltip>
            </div>
            <JoinDialog
                open={joinMarketDialog.openJoinMarket}
                loading={joinMarketDialog.joinLoading}
                onClose={joinMarketDialog.handleCloseJoinMarkets}
                onSubmit={joinMarketDialog.handleSubmitJoinMarkets}
            />
        </div>
    )
})

JoinTabMarkets.propTypes = {
    joinMarketDialog: PropTypes.shape({
        joinLoading: PropTypes.bool.isRequired,
        openJoinMarket: PropTypes.bool.isRequired,
        handleOpenJoinMarkets: PropTypes.func.isRequired,
        handleCloseJoinMarkets: PropTypes.func.isRequired,
        handleSubmitJoinMarkets: PropTypes.func.isRequired
    }).isRequired
}

export default JoinTabMarkets
