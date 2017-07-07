import PropTypes from 'prop-types'
import React from 'react'
import {Row} from 'react-flexbox-grid'
import * as ROUTES from '../../constants/routes'
import Container from '../Container'
import SubMenu from '../SubMenu'
import Paper from 'material-ui/Paper'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import {reduxForm} from 'redux-form'
import StatSideMenu from './StatSideMenu'

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
    }),
    reduxForm({
        form: 'StatisticsFilterForm',
        enableReinitialize: true
    }),
)

const StatisticsGridList = enhance((props) => {
    const {
        classes
    } = props
    const page = (
        <Paper zDepth={1}
        style={{margin: '0 -28px'}}>
            <Row style={{margin: '0'}}>
                <div className={classes.leftPanel}>
                    <StatSideMenu/>
                </div>
                <div className={classes.rightPanel}>
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
