import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import CloseIcon2 from '../CloseIcon2'
import IconButton from 'material-ui/IconButton'
import MainStyles from '../Styles/MainStyles'
export const CURRENCY_HISTORY_DIALOG_OPEN = 'openHistoryDialog'
import ReactHighcharts from 'react-highcharts'

const enhance = compose(
    injectSheet(_.merge(MainStyles, {
        loader: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: '#fff',
            top: '0',
            left: '0',
            alignItems: 'center',
            zIndex: '999',
            textAlign: 'center',
            display: ({loading}) => loading ? 'flex' : 'none'
        },
        historyChart: {
            padding: '20px 0 40px',
            width: '100%'
        },
        historyShow: {
            textAlign: 'right',
            marginBottom: '15px'
        },
        link: {
            borderBottom: '1px dashed',
            fontWeight: '600'
        }
    }))
)
const CurrencyHistoryDialog = enhance((props) => {
    const {open, loading, onClose, classes} = props

    const sempl = 1

    const config = {
        chart: {
            type: 'areaspline',
            height: 245
        },
        title: {
            text: '',
            style: {
                display: 'none'
            }
        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            tickmarkPlacement: 'on',
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
        plotOptions: {
            series: {
                lineWidth: 0
            },
            areaspline: {
                fillOpacity: 0.7
            },
            column: {
                pointPlacement: 'on'
            }
        },
        tooltip: {
            shared: true,
            valueSuffix: ' UZS',
            backgroundColor: '#363636',
            style: {
                color: '#fff'
            },
            borderRadius: 2,
            borderWidth: 0,
            enabled: true,
            shadow: false,
            useHTML: true,
            crosshairs: true,
            pointFormat: '{series.name}: <b>{point.y}</b><br/>'
        },
        series: [{
            marker: {
                enabled: false,
                symbol: 'circle'
            },
            name: 'USD',
            data: [sempl + sempl + sempl + sempl, sempl + sempl + sempl, sempl + sempl + sempl + sempl],
            color: '#7560a5'

        }]
    }

    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '300px'} : {width: '650px'}}
            bodyStyle={{minHeight: 'auto'}}
            bodyClassName={classes.popUp}>
            <div className={classes.titleContent}>
                <span>История изменения курса</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon2 color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <div className={classes.inContent} >
                    <div className={classes.historyChart}>
                        <div className={classes.historyShow}>Покаать: <a className={classes.link}>за год</a></div>
                        <ReactHighcharts config ={config} />
                    </div>
                </div>
            </div>
        </Dialog>
    )
})
CurrencyHistoryDialog.propTypes = {
    isUpdate: PropTypes.bool,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}

export default CurrencyHistoryDialog
