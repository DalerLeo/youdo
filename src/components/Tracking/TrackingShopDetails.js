import _ from 'lodash'
import React from 'react'
import IconButton from 'material-ui/IconButton'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import Loader from '../Loader'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import Dot from 'material-ui/svg-icons/av/fiber-manual-record'
import MarketImage from '../Images/no-shop.svg'
import dateFormat from '../../helpers/dateFormat'

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
        content: {
            padding: '15px 30px'
        },
        image: {
            backgroundSize: '220px',
            background: '#f2f5f8 url(' + MarketImage + ') 50% 50% no-repeat',
            height: '250px',
            margin: '-15px -30px 15px',
            '& img': {
                width: '100%'
            }
        },
        opacity: {
            opacity: '0.75'
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
    const border = _.get(data, ['border', 'title'])
    const createdDate = dateFormat(_.get(data, ['createdDate']))
    const createdBy = _.get(data, 'createdBy')
        ? _.get(data, ['createdBy', 'firstName']) + ' ' + _.get(data, ['createdBy', 'secondName'])
        : 'Неизвестно'

    const freq = _.get(data, 'visitFrequency')
    const EVERY_DAY = '1'
    const ONCE_IN_A_WEEK = '2'
    const TWICE_IN_A_WEEK = '3'
    const IN_A_DAY = '4'

    const primaryImage = _.filter(_.get(data, 'images'), (item) => {
        return _.get(item, 'isPrimary')
    })
    const image = _.map(primaryImage, (item) => {
        const url = _.get(item, 'file')
        const imageStyle = {
            backgroundImage: 'url(' + url + ')',
            backgroundSize: 'cover',
            backgroundColor: '#fff',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center'
        }
        return (
            <div className={classes.image} style={imageStyle}>
            </div>
        )
    })
    return (
        <div className={classes.detailWrap}>
            {loading && <div className={classes.loader}>
                <Loader size={0.75}/>
            </div>}
            <div className={classes.title}>
                <Dot style={isActive ? {color: '#92ce95'} : {color: '#e57373'}}/>
                <span>{name}</span>
                <IconButton
                    onTouchTap={shopDetails.handleCloseShopDetails}>
                    <CloseIcon color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.content}>
                {!_.isEmpty(primaryImage)
                    ? image
                    : <div className={classes.image + ' ' + classes.opacity}>{null}</div>}
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
                        <span>{
                        freq === EVERY_DAY ? 'Каждый день' : (
                            freq === ONCE_IN_A_WEEK ? 'Раз в неделю' : (
                                freq === TWICE_IN_A_WEEK ? '2 раза в неделю' : (
                                    freq === IN_A_DAY ? 'Через день' : ''
                                )
                            )
                        )}</span>
                    </div>
                    <div>
                        <span>Создал:</span>
                        <span>{createdBy}</span>
                    </div>
                    <div>
                        <span>Дата:</span>
                        <span>{createdDate}</span>
                    </div>
                    <div>
                        <span>Зона:</span>
                        <span>{border}</span>
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
