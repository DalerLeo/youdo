import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import LinearProgress from '../LinearProgress'
import numberFormat from '../../helpers/numberFormat'
import {Row, Col} from 'react-flexbox-grid'
import NotFound from '../Images/not-found.png'

const colorBlue = '#12aaeb !important'
const enhance = compose(
    injectSheet({
        wrapper: {
            color: '#333 !important',
            borderTop: '1px #efefef solid',
            display: 'flex',
            flexWrap: 'wrap',
            padding: '0 30px 5px',
            height: 'auto',
            transition: 'max-height 500ms ease !important',
            overflowY: 'auto',
            '& a': {
                color: colorBlue
            }
        },
        content: {
            width: '100%',
            overflow: 'hidden',
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

const StockReceiveDetails = enhance((props) => {
    const {classes, detailData} = props
    const detailLoading = _.get(detailData, 'detailLoading')
    const products = _.get(detailData, ['data', 'products'])

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
                <Row className='dottedList'>
                    <Col xs={4}>Товар</Col>
                    <Col xs={2}>Тип товара</Col>
                    <Col xs={2}>Кол-во</Col>
                    <Col xs={2}>Принято</Col>
                    <Col xs={2}>Брак</Col>
                </Row>
                {_.map(products, (item) => {
                    const id = _.get(item, 'id')
                    const name = _.get(item, ['product', 'name'])
                    const type = _.get(item, ['product', 'type', 'name'])
                    const measurement = _.get(item, ['product', 'measurement', 'name'])
                    const amount = numberFormat(_.get(item, 'amount'), measurement)
                    const posted = numberFormat(_.get(item, 'postedAmount'), measurement)
                    const defect = numberFormat(_.get(item, 'defectAmount'), measurement)
                    return (
                        <Row key={id} className='dottedList'>
                            <Col xs={4}>{name}</Col>
                            <Col xs={2}>{type}</Col>
                            <Col xs={2}>{amount}</Col>
                            <Col xs={2}>{posted}</Col>
                            <Col xs={2}>{defect}</Col>
                        </Row>
                    )
                })}
            </div>}
        </div>
    )
})

StockReceiveDetails.propTypes = {
    detailData: PropTypes.object.isRequired
}

export default StockReceiveDetails
