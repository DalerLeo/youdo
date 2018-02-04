import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import RemoveCircleIcon from 'material-ui/svg-icons/content/remove-circle'
import PrintIcon from 'material-ui/svg-icons/action/print'
import IconButton from 'material-ui/IconButton'
import LinearProgress from '../LinearProgress'
import {Row, Col} from 'react-flexbox-grid'
import NotFound from '../Images/not-found.png'
import ToolTip from '../ToolTip'
import dateFormat from '../../helpers/dateFormat'
import numberformat from '../../helpers/numberFormat'
import stockTypeFormat from '../../helpers/stockTypeFormat'
import t from '../../helpers/translate'

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
            overflow: 'hidden',
            display: 'flex',
            borderTop: 'solid 1px #efefef'
        },
        leftSide: {
            flexBasis: '70%',
            maxWidth: '70%',
            padding: '0 30px 5px',
            '& > .row': {
                padding: '15px 0',
                '&:first-child': {
                    fontWeight: '600'
                },
                '&:last-child:after': {
                    display: 'none'
                }
            }
        },
        semibold: {
            fontWeight: '600',
            cursor: 'pointer',
            position: 'relative',
            height: 'inherit'
        },
        header: {
            position: 'relative',
            height: '48px',
            padding: '0 15px 0 30px',
            width: '100%',
            '& .row': {
                alignItems: 'center'
            }
        },
        rightSide: {
            flexBasis: '30%',
            maxWidth: '30%',
            padding: '20px 30px',
            borderLeft: '1px #efefef solid',
            '& > div:last-child': {
                marginTop: '5px'
            }
        },
        printer: {
            position: 'absolute',
            right: '0'
        },
        subtitle: {
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
            overflow: 'hidden',
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
        },
        flex: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            '& > div': {
                display: 'flex'
            },
            '& > span': {
                marginRight: '10px'
            }
        }

    }),
    withState('openDetails', 'setOpenDetails', false)
)

const iconStyle = {
    icon: {
        color: '#666',
        width: 22,
        height: 22
    },
    button: {
        width: 36,
        height: 36,
        padding: 7
    }
}

const StockTransferDetails = enhance((props) => {
    const {
        classes,
        detailData,
        handleCloseDetail,
        handleOpenPrint,
        repealDialog,
        loading
    } = props
    const detail = _.get(detailData, 'data')
    const products = _.get(detail, 'products')
    const comment = _.get(detail, 'comment') || t('Комментарий не отсутствует')
    const id = _.get(detailData, 'id')
    const dateRequest = dateFormat(_.get(detailData, ['currentDetail', 'dateRequest']))
    const dateDelivery = dateFormat(_.get(detailData, ['currentDetail', 'dateDelivery']))
    const receiver = _.get(detailData, ['currentDetail', 'receiver'])
    const stockName = _.get(detailData, ['currentDetail', 'stock', 'name'])
    const type = stockTypeFormat(_.get(detailData, 'type'))
    const tooltipCancelText = t('Отменить Запрос') + ' №' + id

    if (_.isEmpty(products)) {
        return (
            <div className={classes.wrapper} style={loading ? {padding: '0 30px', border: 'none', maxHeight: '2px'} : {
                maxHeight: '250px',
                overflowY: 'hidden',
                height: '100%'
            }}>
                {loading ? <LinearProgress/>
                    : <div className={classes.emptyQuery}>
                        <div>{t('Товаров не найдено')}</div>
                    </div>}
            </div>
        )
    }

    return (
        <div className={classes.wrapper}
             style={loading ? {padding: '0 30px', border: 'none', maxHeight: '2px'} : {maxHeight: 'unset'}}>
            {loading ? <LinearProgress/>
                : <div style={{width: '100%'}}>
                    <div className={classes.header}>
                        <div className={classes.closeDetail}
                             onClick={handleCloseDetail}>
                        </div>
                        <Row className={classes.semibold}>
                            <Col xs={2}>{id}</Col>
                            <Col xs={2}>{dateRequest}</Col>
                            <Col xs={2}>{stockName}</Col>
                            <Col xs={2}>{type}</Col>
                            <Col xs={2}>{receiver}</Col>
                            <Col xs={2} className={classes.flex}><span>{dateDelivery}</span>
                                <div>
                                    <ToolTip position="left" text={t('Распечатать накладную')}>
                                        <IconButton
                                            iconStyle={iconStyle.icon}
                                            style={iconStyle.button}
                                            onTouchTap={() => {
                                                handleOpenPrint(id)
                                            }}
                                            touch={true}>
                                            <PrintIcon/>
                                        </IconButton>
                                    </ToolTip>
                                    <ToolTip position="left" text={tooltipCancelText}>
                                        <IconButton
                                            iconStyle={iconStyle.icon}
                                            style={iconStyle.button}
                                            onTouchTap={() => {
                                                repealDialog.handleOpenRepealDialog(id)
                                            }}
                                            touch={true}>
                                            <RemoveCircleIcon/>
                                        </IconButton>
                                    </ToolTip>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div className={classes.content}>
                        <div className={classes.leftSide}>
                            <Row className='dottedList'>
                                <Col xs={6}>{t('Товар')}</Col>
                                <Col xs={4}>{t('Тип товара')}</Col>
                                <Col xs={2}>{t('Кол-во')}</Col>
                            </Row>
                            {_.map(products, (item) => {
                                const productId = _.get(item, 'id')
                                const name = _.get(item, ['product', 'name'])
                                const productType = _.get(item, ['product', 'productType', 'name'])
                                const measurement = _.get(item, ['product', 'measurement', 'name'])
                                const amount = numberformat(_.get(item, 'amount'), measurement)
                                return (
                                    <Row key={productId} className='dottedList'>
                                        <Col xs={6}>{name}</Col>
                                        <Col xs={4}>{productType}</Col>
                                        <Col xs={2}>{amount}</Col>
                                    </Row>
                                )
                            })}
                        </div>
                        <div className={classes.rightSide}>
                            <div className={classes.subtitle}>{t('Комментарий')}:</div>
                            <div>{comment}</div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
})

StockTransferDetails.propTypes = {
    detailData: PropTypes.object.isRequired
}

export default StockTransferDetails
