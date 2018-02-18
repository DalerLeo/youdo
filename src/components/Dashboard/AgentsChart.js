import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import ReactHighcharts from 'react-highcharts'
import getConfig from '../../helpers/getConfig'
import t from '../../helpers/translate'

const enhance = compose(
    injectSheet({

    })
)

const AgentsChart = enhance((props) => {
    const {
        agentsList,
        ordersData,
        returnsData,
        factsData
    } = props
    const agentsCount = _.get(agentsList, 'length')
    const initialHeight = 100
    const heightPerItem = 60

    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    const config = {
        chart: {
            type: 'bar',
            height: initialHeight + (agentsCount * heightPerItem)
        },
        title: {
            text: '',
            style: {
                display: 'none'
            }
        },
        legend: {
            enabled: true,
            itemStyle: {
                fontWeight: 600,
                fontFamily: 'Open Sans',
                fontSize: 11
            },
            symbolHeight: 9,
            symbolWidth: 9
        },
        credits: {
            enabled: false
        },
        xAxis: {
            categories: agentsList,
            title: {
                text: '',
                style: {
                    display: 'none'
                }
            }
        },
        yAxis: {
            title: {
                text: '',
                style: {
                    display: 'none'
                }
            },
            gridLineColor: '#efefef',
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            shared: true,
            valueSuffix: ' ' + primaryCurrency,
            backgroundColor: '#fff',
            style: {
                color: '#666',
                fontFamily: 'Open Sans',
                fontWeight: '600'
            },
            borderRadius: 0,
            borderWidth: 0,
            headerFormat: '<b>{point.x}</b><br/>'
        },
        series: [{
            name: t('Продажи'),
            data: ordersData,
            color: '#5d6474'
        },
        {
            name: t('Возвраты'),
            data: returnsData,
            color: '#ff526d'
        }, {
            name: t('Фактически'),
            data: factsData,
            color: '#12aaeb'
        }]
    }

    return (
        <ReactHighcharts config={config} neverReflow={true} isPureConfig={true}/>
    )
})

AgentsChart.propTypes = {
    agentsList: PropTypes.array.isRequired,
    ordersData: PropTypes.array.isRequired,
    returnsData: PropTypes.array.isRequired,
    factsData: PropTypes.array.isRequired
}

export default AgentsChart
