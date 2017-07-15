import _ from 'lodash'
import React from 'react'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import Pagination from '../GridList/GridListNavPagination'

import CircularProgress from 'material-ui/CircularProgress'

const enhance = compose(
    injectSheet({
        loader: {
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            background: '#fff'
        },
        wrapper: {
            position: 'relative',
            padding: '0 30px',
            marginBottom: '5px',
            '& .row': {
                alignItems: 'center',
                '& div': {
                    lineHeight: '55px'
                }
            }
        },
        title: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            height: '55px',
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
        dropDown: {

            position: 'absolute !important',
            right: '0',
            top: '5px',
            '& > div': {
                borderRadius: '200px',
                border: 'solid #61a8e8 4px!important',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }
        }

    }),
    withState('openDetails', 'setOpenDetails', false)
)

const RemainderDetails = enhance((props) => {
    const {classes, filter, detailData} = props
    const isLoading = _.get(detailData, 'detailLoading')

    if (isLoading) {
        return (
            <div className={classes.loader}>
                <CircularProgress size={60} thickness={5}/>
            </div>
        )
    }
    return (
            <div>
                <div className={classes.title}>
                    <div className={classes.titleLabel}>Парти товаров</div>
                    <Pagination filter={filter}/>
                </div>
                <div className={classes.content}>
                    <Row className='dottedList'>
                        <Col xs={3}>Код</Col>
                        <Col style={{textAlign: 'center'}} xs={3}>Дата приемки</Col>
                        <Col xs={3}>Срок годности</Col>
                        <Col xs={2}>Кол-во</Col>
                        <Col xs={1}>Статус</Col>
                    </Row>
                    <Row className='dottedList'>
                        <Col xs={3}>Z857OA458795215ZAR</Col>
                        <Col style={{textAlign: 'center'}} xs={3}>25 Сен, 2015</Col>
                        <Col xs={3}>25 Сен, 2015</Col>
                        <Col xs={2}>100 шт</Col>
                        <Col xs={1}>Ok</Col>
                    </Row>
                </div>
            </div>
    )
})

RemainderDetails.propTypes = {
    filter: PropTypes.object.isRequired
}

export default RemainderDetails
