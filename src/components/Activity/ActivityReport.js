import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import moment from 'moment'
import CircularProgress from 'material-ui/CircularProgress'
import Paper from 'material-ui/Paper'

const enhance = compose(
    injectSheet({
        loader: {
            minWidth: '300px',
            height: '300px',
            marginRight: '30px',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex'
        },
        padding: {
            padding: '20px 30px'
        },
        block: {
            paddingRight: '20px'
        },
        blockTitle: {
            padding: '15px 0',
            fontWeight: 'bold'
        },
        blockItems: {
            overflowY: 'auto',
            height: 'calc(100% - 80px)',
            paddingRight: '10px'
        },
        tube: {
            padding: '20px 15px',
            marginBottom: '10px',
            width: '300px'
        },
        tubeTitle: {
            fontWeight: '600',
            display: 'flex',
            justifyContent: 'space-between'
        },
        tubeTime: {
            fontSize: '10px',
            color: '#999'
        },
        status: {
            borderRadius: '2px',
            height: '4px',
            width: '30px'
        },
        statusGreen: {
            extend: 'status',
            background: '#92ce95'
        },
        statusRed: {
            extend: 'status',
            background: '#e57373'
        },
        tubeImg: {
            marginTop: '10px',
            '& img': {
                width: '100%',
                display: 'block',
                cursor: 'pointer'
            }
        },
        tubeImgDouble: {
            extend: 'tubeImg',
            display: 'flex',
            justifyContent: 'space-between',
            '& > div': {
                width: 'calc(50% - 4px)',
                position: 'relative',
                '&:after': {
                    content: '""',
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    padding: '2px 8px',
                    color: '#fff',
                    background: '#333',
                    opacity: '0.8',
                    fontSize: '11px',
                    fontWeight: '600'
                },
                '&:first-child:after': {
                    content: '"до"'
                },
                '&:last-child:after': {
                    content: '"после"'
                }
            }
        },
        tubeInfo: {
            marginTop: '10px',
            lineHeight: '15px'
        }
    })
)

const dateFormat = (date, defaultText) => {
    return (date) ? moment(date).locale('ru').format('DD MMM YYYY - HH:mm') : defaultText
}

const ActivityReport = enhance((props) => {
    const {
        reportlistData,
        reportImageData,
        classes,
        summary,
        summaryLoading
    } = props

    const reportlistLoading = _.get(reportlistData, 'reportListLoading')
    const summaryCount = _.get(summary, 'count')
    const reportList = _.map(_.get(reportlistData, 'data'), (item) => {
        const id = _.get(item, ['report', 'id'])
        const market = _.get(item, ['report', 'market', 'name'])
        const comment = _.get(item, ['report', 'comment'])
        const beforeImg = _.get(item, ['report', 'beforeImg', 'file'])
        const afterImg = _.get(item, ['report', 'afterImg', 'file'])
        const beforeImgId = _.get(item, ['report', 'beforeImg', 'id'])
        const afterImgId = _.get(item, ['report', 'afterImg', 'id'])
        const name = _.get(item, ['report', 'user', 'firstName']) + ' ' + _.get(item, ['report', 'user', 'secondName'])
        const createdDate = dateFormat(_.get(item, ['report', 'createdDate']))

        return (
            <Paper key={id} zDepth={1} className={classes.tube}>
                <div className={classes.tubeTitle}>
                    <span>{name}</span>
                </div>
                <div className={classes.tubeTime}>{createdDate}</div>
                <div className={classes.tubeImgDouble}>
                    <div>
                        <img src={beforeImg} alt="" onClick={() => { reportImageData.handleOpenReportImage(beforeImgId) }}/>
                    </div>
                    <div>
                        <img src={afterImg} alt="" onClick={() => { reportImageData.handleOpenReportImage(afterImgId) }}/>
                    </div>
                </div>
                <div className={classes.tubeInfo}>Отчет №{id}. Магазин "{market}", комментарий: {comment}</div>
            </Paper>
        )
    })

    if (_.isEmpty(reportList)) {
        return false
    } else if (reportlistLoading || summaryLoading) {
        return (
            <div className={classes.loader}>
                <CircularProgress size={40} thickness={4}/>
            </div>
        )
    }

    return (
        <div className={classes.block}>
            <div className={classes.blockTitle}>Отчеты ({summaryCount})</div>
            <div className={classes.blockItems}>
                {reportList}
            </div>
        </div>
    )
})

ActivityReport.PropTypes = {
    reportlistData: PropTypes.object,
    reportImageData: PropTypes.shape({
        imageData: PropTypes.object.isRequired,
        openReportImage: PropTypes.bool.isRequired,
        handleOpenReportImage: PropTypes.func.isRequired,
        handleCloseReportImage: PropTypes.func.isRequired
    }).isRequired
}

export default ActivityReport
