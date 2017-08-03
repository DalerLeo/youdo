import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import LinearProgress from '../LinearProgress'
import numberformat from '../../helpers/numberFormat'
import dateFormat from '../../helpers/dateFormat'
import {Row, Col} from 'react-flexbox-grid'
import NotFound from '../Images/not-found.png'
import PrintIcon from 'material-ui/svg-icons/action/print'
import Tooltip from '../ToolTip'
import IconButton from 'material-ui/IconButton'

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
            position: 'relative'
        },
        header: {
            position: 'relative',
            padding: '15px 30px',
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
        width: 25,
        height: 25
    },
    button: {
        width: 48,
        height: 48,
        padding: 0
    }
}

const StockTransferDetails = enhance((props) => {
    const {
        classes,
        detailData,
        handleCloseDetail,
        handleOpenPrint
    } = props
    const detailLoading = _.get(detailData, 'transferDetailLoading')
    const products = _.get(detailData, ['data', 'products'])
    const comment = _.get(detailData, ['data', 'comment']) || 'Комментарий отсутствует'
    const id = _.get(detailData, 'id')
    const dateRequest = dateFormat(_.get(detailData, ['currentTransferDetail', 'dateRequest']))
    const dateDelivery = dateFormat(_.get(detailData, ['currentTransferDetail', 'dateDelivery']))
    const receiver = _.get(detailData, ['currentTransferDetail', 'receiver'])
    const detailType = _.toInteger(_.get(detailData, 'type'))
    const stockName = _.get(detailData, ['currentTransferDetail', 'stock', 'name'])

    if (_.isEmpty(products)) {
        return (
            <div className={classes.wrapper} style={detailLoading ? {padding: '0 30px', border: 'none', maxHeight: '2px'} : {maxHeight: '250px', overflowY: 'hidden'}}>
                {detailLoading && <LinearProgress/>}
                <div className={classes.emptyQuery}>
                    <div>Товаров не найдено</div>
                </div>
            </div>
        )
    }

    return (
        <div className={classes.wrapper} style={detailLoading ? {padding: '0 30px', border: 'none', maxHeight: '2px'} : {maxHeight: 'unset'}}>
            {detailLoading ? <LinearProgress/>
                : <div style={{width: '100%'}}>
                  <div className={classes.header}>
                      <div className={classes.closeDetail}
                           onClick={handleCloseDetail}>
                      </div>
                    <Row className={classes.semibold}>
                        <Col xs={2}>{id}</Col>
                        <Col xs={2}>{dateRequest}</Col>
                        <Col xs={2}>{stockName}</Col>
                        <Col xs={3}>{receiver}</Col>
                        <Col xs={2}>{dateDelivery}</Col>
                        <div className={classes.printer}>
                            <Tooltip position="bottom" text="Распечатать накладную">
                                <IconButton
                                    iconStyle={iconStyle.icon}
                                    style={iconStyle.button}
                                    onTouchTap={() => { handleOpenPrint(id) }}
                                    touch={true}>
                                    <PrintIcon />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </Row>
                </div>
                    <div className={classes.content}>
                        <div className={classes.leftSide}>
                            <Row className='dottedList'>
                                <Col xs={6}>Товар</Col>
                                <Col xs={4}>Тип товара</Col>
                                <Col xs={2}>Кол-во</Col>
                            </Row>
                            {_.map(products, (item) => {
                                const productId = _.get(item, 'id')
                                const name = _.get(item, ['product', 'name'])
                                const measurement = _.get(item, ['product', 'measurement', 'name'])
                                const amount = numberformat(_.get(item, 'amount'), measurement)
                                const stock = _.toInteger(_.get(item, ['stock', 'id']))
                                if (stock === detailType) {
                                    return (
                                        <Row key={productId} className='dottedList'>
                                            <Col xs={6}>{name}</Col>
                                            <Col xs={4}>Стиральный порошек</Col>
                                            <Col xs={2}>{amount}</Col>
                                        </Row>
                                    )
                                }
                                return null
                            })}
                        </div>
                        <div className={classes.rightSide}>
                            <div className={classes.subtitle}>Комментарий:</div>
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