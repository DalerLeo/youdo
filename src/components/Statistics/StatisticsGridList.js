import PropTypes from 'prop-types'
import React from 'react'
import {Row, Col} from 'react-flexbox-grid'
import * as ROUTES from '../../constants/routes'
import Container from '../Container'
import SubMenu from '../SubMenu'
import Paper from 'material-ui/Paper'
import injectSheet from 'react-jss'
import {compose} from 'recompose'

const enhance = compose(
    injectSheet({
        wrapper: {
            padding: '20px 30px',
            '& .row': {
                margin: '0rem !important',
                '& div': {
                    lineHeight: '55px'
                }
            }
        },
        tableWrapper: {
            padding: '0 30px',
            '& .row': {
                '& div': {
                    lineHeight: '55px'
                }
            }
        },
        rightPanel: {
            flexBasis: '75%',
            maxWidth: '75%',
            '& .dottedList': {
                padding: '0'
            },
            '& .dottedList:after': {
                margin: '0 -20px'
            },
            '& .dottedList:last-child:after': {
                content: '""',
                backgroundImage: 'none'
            }
        },
        leftPanel: {
            backgroundColor: '#f2f5f8',
            flexBasis: '25%',
            maxWidth: '25%'

        }

    })
)

const StatisticsGridList = enhance((props) => {
    const {
        classes
    } = props

    const headerStyle = {
        backgroundColor: '#5d6474',
        color: '#fff',
        fontWeight: '600'
    }
    const headers = (
        <Paper
            zDepth={2}
            style={headerStyle}>
            <div className={classes.tableWrapper}>
                <Row>
                    <Col xs={8}>Название</Col>
                    <Col xs={2}>Себестоимость</Col>
                    <Col xs={2}>Цена</Col>
                </Row>
            </div>
        </Paper>

    )
    const list = (
        <Paper zDepth={1} >
            <div className={classes.tableWrapper}>
                <Row className="dottedList">
                    <Col xs={8}>Миф морозная свежесть</Col>
                    <Col xs={2}>Стиралны</Col>
                    <Col xs={2}>5000 - 100000 UZS</Col>
                </Row>
                <Row className="dottedList">
                    <Col xs={8}>Миф морозная свежесть</Col>
                    <Col xs={2}>Стиралны</Col>
                    <Col xs={2}>5000 - 100000 UZS</Col>
                </Row>
            </div>
        </Paper>
    )

    /* Const priceList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const type = _.get(item, ['type', 'name']) || 'N/A'
        const price = _.get(item, ['measurement', 'name']) || ''
        const createdDate = moment(_.get(item, 'createdDate')).format('DD.MM.YYYY')

        return (
        <Paper zDepth={1} key={id} >
            <div className={classes.tableWrapper}>
                <Row className="dottedList">
                    <Col xs={8}>{name}</Col>
                    <Col xs={2}>{type}</Col>
                    <Col xs={2}>{price}</Col>
                </Row>
            </div>
        </Paper>
        )
    }) */
    const page = (
        <Paper zDepth={1}
        style={{margin: '0 -28px'}}>
            <Row style={{margin: '0'}}>
                <div className={classes.leftPanel}>
                    <div className={classes.wrapper}>
                        <ul>
                            <li>sdasdasa</li>
                        </ul>
                    </div>
                </div>
                <div className={classes.rightPanel}>
                    <div className={classes.wrapper}>
                        <div>something something something</div>
                        {headers}
                        {list}
                    </div>
                </div>
            </Row>
        </Paper>
    )

    return (
        <Container>
            <SubMenu url={ROUTES.STATISTICS_LIST_URL}/>

            {page}
         </Container>
    )
})

StatisticsGridList.propTypes = {
    listData: PropTypes.object,
    detailData: PropTypes.object
}

export default StatisticsGridList
