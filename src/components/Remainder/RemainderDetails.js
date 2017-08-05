import _ from 'lodash'
import React from 'react'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import Pagination from '../GridList/GridListNavPagination'
import numberFormat from '../../helpers/numberFormat'
import LinearProgress from '../LinearProgress'
import dateTimeFormat from '../../helpers/dateTimeFormat'

const enhance = compose(
    injectSheet({
        loader: {
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            background: '#fff'
        },
        wrapper: {
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
            '& > .row': {
                overflowY: 'auto',
                overflowX: 'hidden',
                margin: '0 -0.5rem',
                padding: '0'
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
        error: {
            color: '#e57373'
        },
        success: {
            color: '#81c784'
        }

    }),
    withState('openDetails', 'setOpenDetails', false)
)

const RemainderDetails = enhance((props) => {
    const {classes, filterItem, detailData} = props
    const isLoading = _.get(detailData, 'detailLoading')
    const measurement = _.get(detailData, ['currentRow', '0', 'measurement', 'name'])

    return (
        <div className={classes.wrapper}>
            {isLoading ? <LinearProgress />
            : <div className={classes.content}>
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
                        const balance = numberFormat(_.get(item, 'balance'), measurement)
                        const createdDate = dateTimeFormat(_.get(item, 'createdDate'))
                        const isDefect = _.get(item, 'isDefect') ? 'Брак' : 'OK'
                        return (
                            <Row key={barcode} className='dottedList'>
                                <Col xs={4}>{barcode}</Col>
                                <Col xs={4}>{createdDate}</Col>
                                <Col xs={3}>{balance} </Col>
                                <Col xs={1}> <span className={_.get(item, 'isDefect') ? classes.error : classes.success }>{isDefect}</span></Col>
                            </Row>
                        )
                    })}
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
