import _ from 'lodash'
import React from 'react'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import Pagination from '../GridList/GridListNavPagination'
import numberFormat from '../../helpers/numberFormat'
import dateTimeFormat from '../../helpers/dateTimeFormat'
import NotFound from '../Images/not-found.png'
import LinearProgress from '../LinearProgress'

const enhance = compose(
    injectSheet({
        loader: {
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            background: '#fff'
        },
        wrapper: {
            width: '100%',
            height: 'auto',
            transition: 'max-height 500ms ease !important',
            overflowY: 'auto',
            '& .progress': {
                background: 'transparent'
            }
        },
        title: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            height: '48px',
            fontWeight: '600',
            borderBottom: '1px #efefef solid'

        },
        content: {
            width: '100%',
            overflow: 'hidden',
            padding: '0 30px 5px',
            '& > .row': {
                overflowY: 'auto',
                overflowX: 'hidden',
                margin: '0 -0.5rem',
                padding: '15px 0'
            },
            '& > .row:first-child': {
                fontWeight: '600',
                lineHeight: '20px'
            },
            '& .dottedList:last-child:after': {
                content: '""',
                backgroundImage: 'none'
            }
        },
        header: {
            height: '47px',
            borderBottom: '1px #efefef solid',
            position: 'relative',
            padding: '0 30px',
            width: '100%'
        },
        error: {
            color: '#e57373'
        },
        success: {
            color: '#81c784'
        },
        semibold: {
            fontWeight: '600',
            cursor: 'pointer',
            position: 'relative',
            alignItems: 'center',
            height: '47px'
        },
        itemData: {
            textAlign: 'left',
            fontWeight: '600',
            fontSize: '16px'
        },
        itemOpenData: {
            extend: 'itemData',
            color: '#129fdd',
            zIndex: '2',
            cursor: 'pointer'
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

const RemainderDetails = enhance((props) => {
    const {classes, filterItem, detailData, handleCloseDetail, reservedOpen} = props
    const ZERO = 0
    const isLoading = _.get(detailData, 'detailLoading')
    const detailId = _.get(detailData, 'id')
    const title = _.get(detailData, ['currentRow', '0', 'title'])
    const defects = _.get(detailData, ['currentRow', '0', 'defects'])
    const balance = _.toNumber(_.get(detailData, ['currentRow', '0', 'balance'])) + _.toNumber(_.get(detailData, ['currentRow', '0', 'defects']))
    const reserved = _.toNumber(_.get(detailData, ['currentRow', '0', 'reserved']))
    const measurement = _.get(detailData, ['currentRow', '0', 'measurement', 'name'])
    const type = _.get(detailData, ['currentRow', '0', 'type', 'name'])

    if (isLoading) {
        return (
            <div className={classes.loader}>
                <LinearProgress/>
            </div>
        )
    }
    return (
        <div className={classes.wrapper}>
            {_.isEmpty(_.get(detailData, ['data', 'results']))
                ? <div className={classes.emptyQuery}>
                    <div>Товаров не найдено</div>
                </div>
                : <div style={{width: '100%'}}>
                    <div className={classes.header}>
                        <div className={classes.closeDetail}
                             onClick={handleCloseDetail}>
                        </div>
                        <Row className={classes.semibold}>
                            <Col xs={3}>{title}</Col>
                            <Col xs={2}>{type}</Col>
                            <Col xs={2} className={classes.itemData}>{numberFormat(balance, measurement)}</Col>
                            <Col xs={3} className={classes.itemData}>{numberFormat(defects, measurement)}</Col>
                            {reserved > ZERO
                                ? <Col xs={2}
                                       className={classes.itemOpenData} onClick={() => { reservedOpen(detailId) }}>
                                    {numberFormat(reserved, measurement)}
                                </Col>
                                : <Col xs={2} className={classes.itemData}>{numberFormat(reserved, measurement)}</Col>}
                        </Row>
                    </div>
                    <div className={classes.content}>
                        <div className={classes.title}>
                            <div className={classes.titleLabel}>Парти товаров</div>
                            <Pagination filter={filterItem}/>
                        </div>
                        <Row className='dottedList'>
                            <Col xs={4}>Код</Col>
                            <Col xs={4}>Дата приемки</Col>
                            <Col xs={3}>Кол-во</Col>
                            <Col xs={1}>Статус</Col>
                        </Row>
                        {_.map(_.get(detailData, ['data', 'results']), (item) => {
                            const barcode = _.get(item, 'barcode')
                            const productBalance = numberFormat(_.get(item, 'balance'), measurement)
                            const createdDate = dateTimeFormat(_.get(item, 'createdDate'))
                            const isDefect = _.get(item, 'isDefect') ? 'Брак' : 'OK'
                            return (
                                <Row key={barcode} className='dottedList'>
                                    <Col xs={4}>{barcode}</Col>
                                    <Col xs={4}>{createdDate}</Col>
                                    <Col xs={3}>{productBalance} </Col>
                                    <Col xs={1}> <span
                                        className={_.get(item, 'isDefect') ? classes.error : classes.success}>{isDefect}</span></Col>
                                </Row>
                            )
                        })}
                    </div>
                </div>
            }
        </div>
    )
})

RemainderDetails.propTypes = {
    filterItem: PropTypes.object.isRequired,
    detailData: PropTypes.object.isRequired,
    handleCloseDetail: PropTypes.func.isRequired
}

export default RemainderDetails
