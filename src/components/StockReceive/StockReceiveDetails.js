import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import CircularProgress from 'material-ui/CircularProgress'
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
            padding: '0 30px 5px',
            '& a': {
                color: colorBlue
            }
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
            width: '100%',
            overflow: 'hidden',
            '& > .row': {
                padding: '15px 0',
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
            <div className={classes.wrapper}>
                {detailLoading && <div className={classes.loader}>
                    <CircularProgress size={40} thickness={4}/>
                </div>}
                <div className={classes.emptyQuery}>
                    <div>Товаров не найдено</div>
                </div>
            </div>
        )
    }

    return (
        <div className={classes.wrapper}>
            {detailLoading && <div className={classes.loader}>
                <CircularProgress size={40} thickness={4}/>
            </div>}
            <div className={classes.content}>
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
                    const measurement = _.get(item, ['product', 'measurement', 'name'])
                    const amount = numberformat(_.get(item, 'amount'), measurement)
                    const posted = numberformat(_.get(item, 'postedAmount'), measurement)
                    const defect = numberformat(_.get(item, 'defectAmount'), measurement)
                    return (
                        <Row key={id} className='dottedList'>
                            <Col xs={4}>{name}</Col>
                            <Col xs={2}>Стиральный порошек</Col>
                            <Col xs={2}>{amount}</Col>
                            <Col xs={2}>{posted}</Col>
                            <Col xs={2}>{defect}</Col>
                        </Row>
                    )
                })}
            </div>
        </div>
    )
})

StockReceiveDetails.propTypes = {
    detailData: PropTypes.object.isRequired
}

export default StockReceiveDetails
