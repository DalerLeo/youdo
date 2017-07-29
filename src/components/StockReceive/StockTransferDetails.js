import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import LinearProgress from '../LinearProgress'
import numberformat from '../../helpers/numberFormat'
import {Row, Col} from 'react-flexbox-grid'
import NotFound from '../Images/not-found.png'

const colorBlue = '#12aaeb !important'
const enhance = compose(
    injectSheet({
        wrapper: {
            color: '#333 !important',
            position: 'relative',
            borderTop: '1px #efefef solid',
            display: 'flex',
            flexWrap: 'wrap',
            '& a': {
                color: colorBlue
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
            display: 'flex'
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
        rightSide: {
            flexBasis: '30%',
            maxWidth: '30%',
            padding: '20px 30px',
            borderLeft: '1px #efefef solid',
            '& > div:last-child': {
                marginTop: '5px'
            }
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
        }

    }),
    withState('openDetails', 'setOpenDetails', false)
)

const StockTransferDetails = enhance((props) => {
    const {classes, detailData} = props
    const detailLoading = _.get(detailData, 'transferDetailLoading')
    const detailType = _.toInteger(_.get(detailData, 'type'))
    const products = _.get(detailData, ['data', 'products'])
    const comment = _.get(detailData, ['data', 'comment']) || 'Комментарий отсутствует'
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
        <div className={classes.wrapper} style={detailLoading ? {padding: '0 30px', border: 'none', maxHeight: '2px'} : {maxHeight: '250px'}}>
            {detailLoading ? <LinearProgress/>
                : <div className={classes.content}>
                    <div className={classes.leftSide}>
                        <Row className='dottedList'>
                            <Col xs={6}>Товар</Col>
                            <Col xs={4}>Тип товара</Col>
                            <Col xs={2}>Кол-во</Col>
                        </Row>
                        {_.map(products, (item) => {
                            const id = _.get(item, 'id')
                            const name = _.get(item, ['product', 'name'])
                            const measurement = _.get(item, ['product', 'measurement', 'name'])
                            const amount = numberformat(_.get(item, 'amount'), measurement)
                            const stock = _.toInteger(_.get(item, ['stock', 'id']))

                            if (stock === detailType) {
                                return (
                                <Row key={id} className='dottedList'>
                                    <Col xs={6}>{name}</Col>
                                    <Col xs={4}>Стиральный порошек</Col>
                                    <Col xs={2}>{amount}</Col>
                                </Row>
                                )
                            }
                        })}
                    </div>
                    <div className={classes.rightSide}>
                        <div className={classes.subtitle}>Комментарий:</div>
                        <div>{comment}</div>
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
