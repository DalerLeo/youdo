import React from 'react'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import ReactHighcharts from 'react-highcharts'
import Loader from 'components/Loader'

const enhance = compose(
  injectSheet({
    pieWrap: {
      position: 'relative'
    },
    btn: {
      padding: '6px 20px',
      fontWeight: '600',
      position: 'absolute',
      top: '-40px',
      left: '0',
      background: '#12aaeb',
      cursor: 'pointer',
      zIndex: '2',
      color: '#fff',
      boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px'
    }
  })
)

const ProductsPieChart = enhance((props) => {
  const {
    classes,
    data,
    loading
  } = props

  const parentData = data
  const config = {
    chart: {
      type: 'pie',
      height: 308
    },
    title: {
      text: ''
    },
    legend: {
      enabled: true,
      itemStyle: {
        fontWeight: 600,
        fontFamily: 'Open Sans',
        fontSize: 11
      },
      symbolHeight: 9,
      symbolWidth: 9,
      margin: 5
    },
    credits: {
      enabled: false
    },
    plotOptions: {
      pie: {
      },
      series: {
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b><br/>{point.percentage:.1f}% <br/> {point.y:.0f} заказов',
          distance: 25,
          filter: {
            property: 'percentage',
            operator: '>',
            value: 4
          }
        }
      }
    },

    tooltip: {
      shared: true,
      pointFormat: '{point.percentage:.1f}%<br/> {point.y:.0f} заказов',
      backgroundColor: '#fff',
      style: {
        color: '#666',
        fontFamily: 'Open Sans',
        fontWeight: '600'
      },
      borderRadius: 0,
      borderWidth: 0,
      enabled: true,
      shadow: true,
      useHTML: true,
      crosshairs: true
    },

    'series': [
      {
        'name': ' ',
        'colorByPoint': true,
        'data': parentData
      }
    ]
  }

  return (
    <div className={classes.pieWrap}>
      {loading && <Loader size={'0.3'}/>}
      {!loading && <ReactHighcharts config={config} />}
    </div>

  )
})

ProductsPieChart.propTypes = {

}

export default ProductsPieChart
