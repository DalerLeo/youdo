import _ from 'lodash'
import React from 'react'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Container from '../Container'
import Paper from 'material-ui/Paper'
import User from '../Images/person.png'
import Filter from './Filter'
import Widgets from './Widgets'
import OrderChart from './OrderChart'

const enhance = compose(
    injectSheet({
        wrapper: {
            position: 'absolute',
            left: '-28px',
            right: '-28px',
            top: '0',
            bottom: '-28px',
            padding: '20px 30px',
            overflowY: 'auto'
        },
        header: {
            padding: '20px 30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxHeight: '70px'
        },
        user: {
            display: 'flex',
            alignItems: 'center',
            '& div': {
                marginRight: '10px',
                fontSize: '16px',
                fontWeight: '600'
            },
            '& span': {
                color: '#999',
                fontSize: '12px',
                fontWeight: '600',
                marginLeft: '-5px'
            }
        },
        userImage: {
            background: 'url(' + User + ') no-repeat center center',
            backgroundSize: 'cover',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            overflow: 'hidden'
        },
        buttons: {
            display: 'flex',
            alignItems: 'center'
        },
        chartsWrapper: {
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            '& > div': {
                width: 'calc(50% - 10px)',
                marginBottom: '20px',
                padding: '20px 30px',
                background: '#efefef'
            }
        },
        chartHeader: {
            padding: '15px 30px',
            margin: '-20px -30px 20px',
            borderBottom: '1px #efefef solid',
            fontWeight: '600'
        }
    })
)

const Dashboard = enhance((props) => {
    const {
        classes,
        filter,
        orderChart,
        dateInitialValues
    } = props
    const orderChartLoading = _.get(orderChart, 'loading')
    const orderChartDate = _.map(_.get(orderChart, 'data'), (item) => {
        return _.get(item, 'date')
    })
    const orderChartTotal = _.map(_.get(orderChart, 'data'), (item) => {
        return _.toNumber(_.get(item, 'amount'))
    })
    return (
        <Container>
            <div className={classes.wrapper}>
                <Paper zDepth={1} className={classes.header}>
                    <div className={classes.user}>
                        <div className={classes.userImage}>{null}</div>
                        <div>Jasur Juraev</div>
                        <span>(Admin)</span>
                    </div>
                    <div className={classes.buttons}>
                        <Filter filter={filter} initialValues={dateInitialValues}/>
                        <Widgets/>
                    </div>
                </Paper>

                <section className={classes.chartsWrapper}>
                    <Paper zDepth={1}>
                        <div className={classes.chartHeader}>
                            <div>Продажи</div>
                        </div>
                        {orderChartLoading
                        ? <div>Loading</div>
                        : <OrderChart
                            height={250}
                            primaryText="Нал"
                            secondaryText="Переч"
                            primaryValues={orderChartTotal}
                            secondaryValues={orderChartTotal}
                            tooltipTitle={orderChartDate}
                        />}
                    </Paper>
                </section>
            </div>
        </Container>
    )
})

export default Dashboard
