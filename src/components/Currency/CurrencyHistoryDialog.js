import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState, withHandlers} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import CloseIcon2 from '../CloseIcon2'
import IconButton from 'material-ui/IconButton'
import MainStyles from '../Styles/MainStyles'
export const CURRENCY_HISTORY_DIALOG_OPEN = 'openHistoryDialog'
import ReactHighcharts from 'react-highcharts'
import Popover from 'material-ui/Popover'

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
        },
        popoverMode: {
            padding: '10px 30px',
            boxShadow: 'none !important',
            '& h4': {
                padding: '10px 0'
            },
            '& div p': {
                display: 'inline-block'
            },
            '& div p:first-child': {
                width: '120px'
            }
        }
    }),

        withState('anchorEl', 'setAnchorEl', (<div></div>)),
        withState('periodSelectOpen', 'setPeriodSelectOpen', false),

        withHandlers({
            handleOpenDetails: props => (event) => {
                props.setAnchorEl(event.currentTarget)
                props.setPriceDetailsOpen(true)
            },
            handleCloseDetails: props => (event) => {
                props.setPriceDetailsOpen(false)
            }
        }),
    )
)
const CurrencyHistoryDialog = enhance((props) => {
    const {
        open,
        loading,
        onClose,
        classes,
        periodSelectOpen,
        anchorEl,
        handleCloseDetails,
        handleOpenDetails
    } = props

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
                lineWidth: 1,
                pointPlacement: 'on'
            },
            areaspline: {
                fillOpacity: 0.7
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
                symbol: 'circle'
            },
            name: 'USD',
            data: [sempl + sempl + sempl + sempl, sempl + sempl + sempl, sempl + sempl + sempl + sempl],
            color: '#43d0e3'

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
                        <div className={classes.historyShow}>Покаать: <a className={classes.link} onClick={handleOpenDetails}>за год</a></div>
                            <Popover
                                open={periodSelectOpen}
                                anchorEl={anchorEl}
                                anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                                onRequestClose={handleCloseDetails}
                            >
                                <div className={classes.popoverMode}>
                                    jkj
                                </div>
                            </Popover>
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
