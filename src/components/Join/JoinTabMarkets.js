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
import ToolTip from '../ToolTip'
import JoinDialog from './JoinDialog'
import t from '../../helpers/translate'

const listHeader = [
    {
        width: '20%',
        sorting: false,
        name: 'name',
        title: t('Название')
    },
    {
        width: '25%',
        sorting: false,
        name: 'client',
        title: t('Клиент')
    },
    {
        width: '15%',
        sorting: true,
        name: 'repetition',
        title: t('Похожие')
    },
    {
        width: '20%',
        sorting: false,
        name: 'address',
        title: t('Адрес')
    },
    {
        width: '15%',
        sorting: true,
        name: 'phone',
        title: t('Телефон')
    },
    {
        width: '5%'
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
        joinMarketDialog,
        openConfirm,
        setOpenConfirm
    } = props

    const shopDetail = (
        <div/>
    )
    const shopList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const repetition = _.get(item, 'repetition')
        const client = _.get(item, ['client', 'name'])
        const address = _.get(item, 'address') || 'Не известен'
        const phone = _.get(item, 'phone') || '-'
        return (
            <Row key={id} className={classes.listRow}>
                <div style={{width: '20%'}}>{name}</div>
                <div style={{width: '25%'}}>{client}</div>
                <div style={{width: '15%'}}>{repetition}</div>
                <div style={{width: '20%'}}>{address}</div>
                <div style={{width: '15%'}}>{phone}</div>
                <div style={{width: '5%'}}>
                    <div className={classes.iconBtn}>
                        <ToolTip position="bottom" text={t('Объединить')}>
                            <IconButton
                                onTouchTap={() => { joinMarketDialog.handleOpenJoinMarkets(id) }}
                                iconStyle={iconStyle.icon}
                                style={iconStyle.button}>
                                <Join/>
                            </IconButton>
                        </ToolTip>
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
                <ToolTip position="left" text={t('Объединить')}>
                    <FloatingActionButton
                        onTouchTap={() => { joinMarketDialog.handleOpenJoinMarkets(true) }}
                        backgroundColor="#12aaeb"
                        mini={true}
                        zDepth={1}>
                        <Join/>
                    </FloatingActionButton>
                </ToolTip>
            </div>
            <JoinDialog
                open={joinMarketDialog.openJoinMarket}
                loading={joinMarketDialog.marketsItemLoading}
                onClose={joinMarketDialog.handleCloseJoinMarkets}
                onSubmit={joinMarketDialog.handleSubmitJoinMarkets}
                initialValues={joinMarketDialog.initialValues}
                openConfirm={openConfirm}
                setOpenConfirm={setOpenConfirm}
            />
        </div>
    )
})

JoinTabMarkets.propTypes = {
    joinMarketDialog: PropTypes.shape({
        joinLoading: PropTypes.bool.isRequired,
        openJoinMarket: PropTypes.string.isRequired,
        handleOpenJoinMarkets: PropTypes.func.isRequired,
        handleCloseJoinMarkets: PropTypes.func.isRequired,
        handleSubmitJoinMarkets: PropTypes.func.isRequired
    }).isRequired
}

export default JoinTabMarkets
