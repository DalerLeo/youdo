import React from 'react'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import Pagination from '../GridList/GridListNavPagination'

const colorBlue = '#12aaeb !important'
const enhance = compose(
    injectSheet({
        dottedList: {
            padding: '20px 0'
        },
        wrapper: {
            color: '#333 !important',
            borderTop: '1px #efefef solid',
            display: 'flex',
            flexWrap: 'wrap',
            padding: '0 30px',
            paddingBottom: '5px',
            '& a': {
                color: colorBlue
            }
        },
        loader: {
            position: 'absolute',
            display: 'flex',
            justifyContent: 'center',
            width: '100%'
        },
        title: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            height: '55px',
            fontWeight: '700',
            borderBottom: '1px #efefef solid'

        },
        content: {
            width: '100%',
            overflow: 'hidden',
            '& > .row': {
                overflowY: 'auto',
                overflowX: 'hidden',
                margin: '0 -0.5rem'
            },
            '& > .row:first-child': {
                fontWeight: '600',
                lineHeight: '20px'
            },
            '& .dottedList:last-child:after': {
                content: '""',
                backgroundImage: 'none'
            }
        }

    }),
    withState('openDetails', 'setOpenDetails', false)
)

const RemainderDetails = enhance((props) => {
    const {classes, filter} = props

    return (
        <div className={classes.wrapper}>
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
