import _ from 'lodash'
import React from 'react'
import {Row, Col} from 'react-flexbox-grid'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import NotFound from '../Images/not-found.png'
import LinearProgress from '../LinearProgress'
import numberFormat from '../../helpers/numberFormat'
import Tooltip from '../ToolTip'
import IconButton from 'material-ui/IconButton'
import PrintIcon from 'material-ui/svg-icons/action/print'
import SendDelivery from 'material-ui/svg-icons/content/reply-all'
import sprintf from 'sprintf'
import {Link} from 'react-router'
import * as ROUTES from '../../constants/routes'

const colorBlue = '#12aaeb !important'
const enhance = compose(
    injectSheet({
        wrapper: {
            color: '#333 !important',
            width: '100%',
            maxHeight: 'unset',
            position: 'relative',
            borderTop: '1px #efefef solid',
            display: 'flex',
            flexWrap: 'wrap',
            '& a': {
                color: colorBlue
            },
            '& .row': {
                alignItems: 'center'
            }
        },
        titleButtons: {
            display: 'flex',
            zIndex: '3',
            justifyContent: 'flex-end'
        },
        loader: {
            width: '100%',
            height: '100px',
            background: '#fff',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex'
        },
        content: {
            width: '100%',
            overflow: 'hidden'
        },
        ordersData: {
            width: '100%',
            padding: '15px 30px',
            borderBottom: '1px #efefef solid'
        },
        leftSide: {
            flexBasis: '100%',
            maxWidth: '100%',
            padding: '0 30px 5px',
            '& > .row': {
                padding: '15px 0',
                '&:first-child': {
                    fontWeight: '600'
                },
                '&:last-child:after': {
                    display: 'none'
                },
                '& > div:last-child': {
                    textAlign: 'right'
                }
            }
        },
        semibold: {
            fontWeight: '600',
            cursor: 'pointer',
            position: 'relative'
        },
        header: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '64px',
            borderBottom: '1px #efefef solid',
            position: 'relative',
            padding: '0 30px',
            width: '100%',
            '& .row': {
                alignItems: 'center'
            }
        },
        title: {
            fontSize: '18px',
            fontWeight: '600'
        },
        emptyQuery: {
            background: 'url(' + NotFound + ') no-repeat center 25px',
            backgroundSize: '200px',
            padding: '170px 0 30px',
            textAlign: 'center',
            fontSize: '13px',
            color: '#999',
            width: '100%',
            '& svg': {
                width: '50px !important',
                height: '50px !important',
                color: '#999 !important'
            }
        },

        closeDetail: {
            position: 'absolute',
            left: '0',
            top: '0',
            right: '0',
            bottom: '0',
            cursor: 'pointer',
            zIndex: '1'
        }

    }),
    withState('openDetails', 'setOpenDetails', false)
)

const iconStyle = {
    icon: {
        color: '#666',
        width: 20,
        height: 20
    },
    button: {
        width: 48,
        height: 48,
        padding: 0
    }
}

const StockTransferDetails = enhance((props) => {
    const {
        detailData,
        handleCloseDetail,
        handleOpenDeliveryPrintDialog,
        confirmTransfer,
        classes,
        loading,
        currentDeliverer
    } = props

    if (loading) {
        return (
            <div className={classes.loader}>
                <LinearProgress/>
            </div>
        )
    }
    const products = _.get(detailData, 'products')
    const orders = _.map(_.get(detailData, 'orders'), (item) => {
        return <Link style={{marginRight: 5}} target="_blank" to={{
            pathname: sprintf(ROUTES.ORDER_ITEM_PATH, item),
            query: {search: item}
        }}>{<strong>{item}</strong>}</Link>
    })
    const deliveryMan = _.get(detailData, 'deliveryMan', 'id')
    const deliveryManName = deliveryMan
        ? _.get(detailData, ['deliveryMan', 'firstName']) + ' ' + _.get(detailData, ['deliveryMan', 'secondName'])
        : 'Доставщик не определен'
    return (
        <div className={classes.wrapper}>
            <div className={classes.header}>
                <div className={classes.title}>{deliveryManName}</div>
                <div className={classes.closeDetail} onClick={handleCloseDetail}>{null}</div>
                <div className={classes.titleButtons}>
                    <Tooltip position="bottom" text="Распечатать релись">
                        <IconButton
                            disabled={_.isEmpty(products)}
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            touch={true}
                            onTouchTap={handleOpenDeliveryPrintDialog}>
                            <PrintIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip position="bottom" text="Передать доставщику">
                        <IconButton
                            disabled={!deliveryMan}
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            touch={true}
                            onTouchTap={confirmTransfer.handleOpenDeliveryConfirmDialog}>
                            <SendDelivery />
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
            {_.isEmpty(products)
                ? <div className={classes.emptyQuery}>
                    <div>Товаров не найдено</div>
                </div>
                : <div style={{width: '100%'}}>
                    <div className={classes.content}>
                        <div className={classes.ordersData}>
                            <div>Склад: <strong>{currentDeliverer.stock.name}</strong></div>
                            <div>Показаны товары по следующим заказам: {orders}</div>
                        </div>
                        <div className={classes.leftSide}>
                            <Row className='dottedList'>
                                <Col xs={6}>Товар</Col>
                                <Col xs={4}>Тип товара</Col>
                                <Col xs={2}>Кол-во</Col>
                            </Row>
                            {_.map(products, (item) => {
                                const productId = _.get(item, 'id')
                                const name = _.get(item, 'name')
                                const measurement = _.get(item, ['measurement', 'name'])
                                const amount = numberFormat(_.get(item, 'count'), measurement)
                                const type = _.get(item, ['type', 'name'])
                                return (
                                    <Row key={productId} className='dottedList'>
                                        <Col xs={6}>{name}</Col>
                                        <Col xs={4}>{type}</Col>
                                        <Col xs={2}>{amount}</Col>
                                    </Row>
                                )
                            })}
                        </div>
                    </div>
                </div>
            }
        </div>
    )
})

export default StockTransferDetails
