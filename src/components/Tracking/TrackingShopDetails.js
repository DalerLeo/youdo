import _ from 'lodash'
import React from 'react'
import IconButton from 'material-ui/IconButton'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import CircularProgress from 'material-ui/CircularProgress'
import CloseIcon2 from '../CloseIcon2'
import Dot from 'material-ui/svg-icons/av/fiber-manual-record'
import {Tabs, Tab} from 'material-ui/Tabs'

const enhance = compose(
    injectSheet({
        detailWrap: {
            background: '#fff',
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            zIndex: '2',
            overflowY: 'auto'
        },
        loader: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: '#fff',
            top: '0',
            left: '0',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex'
        },
        image: {
            backgroundSize: 'cover !important',
            height: '250px',
            '& img': {
                width: '100%'
            }
        },
        tabs: {
            '& > div': {
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
                    width: '100% !important'
                }
            },
            '& button div div': {
                textTransform: 'initial',
                height: '52px !important'
            }
        },
        tabContent: {
            padding: '15px 30px'
        },
        title: {
            background: '#fff',
            color: '#333',
            fontWeight: '600',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid #efefef',
            padding: '20px 30px',
            zIndex: '999',
            '& > svg': {
                marginRight: '10px',
                width: '18px !important',
                height: '18px !important'
            },
            '& button': {
                right: '13px',
                top: '5px',
                padding: '0 !important',
                position: 'absolute !important',
                '& > div': {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }
            }
        },
        block: {
            lineHeight: '25px',
            marginBottom: '10px',
            '& > div': {
                display: 'flex',
                justifyContent: 'space-between'
            }
        },
        subtitle: {
            fontWeight: '600'
        }
    })
)

const TrackingShopDetails = enhance((props) => {
    const {
        classes,
        shopDetails
    } = props
    const loading = _.get(shopDetails, 'marketDataLoading')
    const data = _.get(shopDetails, 'marketData')
    const name = _.get(data, 'name')
    const marketType = _.get(data, ['marketType', 'name'])
    const isActive = _.get(data, 'isActive')
    const client = _.get(data, ['client', 'name'])
    const contactName = _.get(data, 'contactName')
    const phone = _.get(data, 'phone')
    const address = _.get(data, 'address')
    const guide = _.get(data, 'guide')

    const freq = _.get(data, 'visitFrequency')
    const EVERY_DAY = '1'
    const ONCE_IN_A_WEEK = '2'
    const TWICE_IN_A_WEEK = '3'
    const IN_A_DAY = '4'

    const image = _.map(_.get(data, 'images'), (item) => {
        const isPrimary = _.get(item, 'isPrimary')
        const url = _.get(item, 'image')
        const imageStyle = {
            background: 'url(' + url + ') no-repeat center center'
        }
        if (isPrimary) {
            return (
                <div className={classes.image} style={imageStyle}>
                </div>
            )
        }
        return false
    })
    return (
        <div className={classes.detailWrap}>
            {loading && <div className={classes.loader}>
                <CircularProgress size={40} thickness={4}/>
            </div>}
            <div className={classes.title}>
                <Dot style={isActive ? {color: '#92ce95'} : {color: '#e57373'}}/>
                <span>{name}</span>
                <IconButton
                    onTouchTap={shopDetails.handleCloseShopDetails}>
                    <CloseIcon2 color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.content}>
                {image}
                <Tabs
                    inkBarStyle={{backgroundColor: '#12aaeb', height: '3px'}}
                    tabItemContainerStyle={{backgroundColor: '#fff', color: '#333'}}
                    className={classes.tabs}
                    contentContainerClassName={classes.tabContent}>
                    <Tab label="Детали">
                        <div className={classes.block}>
                            <div className={classes.subtitle}>Детали</div>
                            <div>
                                <span>Клиент:</span>
                                <span>{client}</span>
                            </div>
                            <div>
                                <span>Тип заведения:</span>
                                <span>{marketType}</span>
                            </div>
                            <div>
                                <span>Частота посещений:</span>
                                <span>{ freq === EVERY_DAY ? 'Каждый день' : (
                                    freq === ONCE_IN_A_WEEK ? 'Раз в неделю' : (
                                        freq === TWICE_IN_A_WEEK ? '2 раза в неделю' : (
                                            freq === IN_A_DAY ? 'Через день' : ''
                                        )
                                    )
                                )}</span>
                            </div>
                        </div>
                        <div className={classes.block}>
                            <div className={classes.subtitle}>Контакты</div>
                            <div>
                                <span>{contactName}</span>
                                <span>{phone}</span>
                            </div>
                            <div>
                                <span>Адрес:</span>
                                <span>{address}</span>
                            </div>
                            <div>
                                <span>Ориентир:</span>
                                <span>{guide}</span>
                            </div>
                        </div>
                    </Tab>
                    <Tab label="Активность">

                    </Tab>
                </Tabs>
            </div>
        </div>
    )
})

TrackingShopDetails.PropTypes = {
    shopDetails: PropTypes.shape({
        openShopDetails: PropTypes.number.isRequired,
        handleOpenShopDetails: PropTypes.func.isRequired,
        handleCloseShopDetails: PropTypes.func.isRequired
    })
}

export default TrackingShopDetails
