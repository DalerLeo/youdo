import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import {compose, withState, withHandlers} from 'recompose'
import {reduxForm} from 'redux-form'
import IconButton from 'material-ui/IconButton'
import MUICheckbox from 'material-ui/Checkbox'
import LeftArrow from 'material-ui/svg-icons/navigation/chevron-left'
import RightArrow from 'material-ui/svg-icons/navigation/chevron-right'
import {hashHistory} from 'react-router'
import * as ROUTER from '../../constants/routes'
import toBoolean from '../../helpers/toBoolean'
import sprintf from 'sprintf'

const wrapperWidth = 150
const two = 2
const buttonStyle = {
    icon: {
        color: '#666',
        width: 20,
        height: 20
    },
    button: {
        height: 38,
        width: 20,
        padding: 0
    }
}
const enhance = compose(
    injectSheet({
        detailWrap: {
            background: '#fff',
            position: 'absolute',
            border: '1px #efefef solid',
            width: wrapperWidth + 'px',
            zIndex: '5',
            opacity: '0.7',
            transition: 'all 300ms ease',
            '& form > div': {
                margin: '10px 0'
            },
            '&:hover': {
                opacity: '1'
            }
        },
        button: {
            background: '#fff',
            position: 'absolute',
            border: '1px #efefef solid',
            borderRight: 'none',
            left: -(buttonStyle.button.width) + 'px',
            top: 'calc(50% - ' + (buttonStyle.button.height / two) + 'px)'
        },
        content: {
            padding: '0 20px'
        },
        checkBox: {
            '& svg:first-child': {
                fill: '#666666 !important',
                color: '#666666 !important'
            },
            '& svg:last-child': {
                fill: '#666666 !important',
                color: '#666666 !important'
            },
            '& span': {
                top: '-10px !important',
                left: '-10px !important'
            }
        },
        checkbox: {
            margin: '15px 0 !important',
            '& span': {
                top: '-10px !important',
                left: '-10px !important'
            }
        }
    }),
    reduxForm({
        form: 'TrackingFilterForm',
        enableReinitialize: true
    }),
    withState('openCheck', 'setOpenCheck', true),
    withState('isMarketChecked', 'setMarketCheck', false),
    withState('isZoneChecked', 'setZoneCheck', false),
    withHandlers({
        marketCheck: props => () => {
            const {isMarketChecked, setMarketCheck, agentId, openDetail} = props
            setMarketCheck(!isMarketChecked)
            hashHistory.push({
                pathname: openDetail ? sprintf(ROUTER.TRACKING_ITEM_PATH, agentId) : ROUTER.TRACKING_LIST_URL,
                query: props.filter.getParams({showMarkets: !isMarketChecked})
            })
        },
        zoneCheck: props => () => {
            const {isZoneChecked, setZoneCheck, agentId, openDetail} = props
            setZoneCheck(!isZoneChecked)
            hashHistory.push({
                pathname: openDetail ? sprintf(ROUTER.TRACKING_ITEM_PATH, agentId) : ROUTER.TRACKING_LIST_URL,
                query: props.filter.getParams({showZones: !isZoneChecked})
            })
        }
    }),
)

const TrackingMarketsZones = enhance((props) => {
    const {
        filter,
        classes,
        openCheck,
        setOpenCheck,
        openDetail,
        openAgentsInfo
    } = props

    const styles = {
        openCheck_openDetails: {
            right: openAgentsInfo ? '320px' : 'calc(320px - 350px)',
            bottom: '20px'
        },
        openCheck_closedDetails: {
            right: openAgentsInfo ? '320px' : 'calc(320px - 350px)',
            bottom: '-28px'
        },
        closedCheck_openDetails: {
            right: openAgentsInfo ? '172px' : 'calc(172px - 350px)',
            bottom: '20px'
        },
        closedCheck_closedDetails: {
            right: openAgentsInfo ? '172px' : 'calc(172px - 350px)',
            bottom: '-28px'
        }
    }

    const showMarkets = toBoolean(_.get(filter.getParams(), 'showMarkets')) || false
    const showZones = toBoolean(_.get(filter.getParams(), 'showZones')) || false

    const checkboxStyle = {
        textAlign: 'left',
        marginBottom: '10px',
        marginTop: '10px'
    }

    return (
        <div className={classes.detailWrap}
             style={openCheck
                 ? (openDetail ? styles.openCheck_openDetails : styles.openCheck_closedDetails)
                 : (openDetail ? styles.closedCheck_openDetails : styles.closedCheck_closedDetails)}>
            <div className={classes.button}>
                <IconButton
                    onTouchTap={() => { setOpenCheck(!openCheck) }}
                    iconStyle={buttonStyle.icon}
                    style={buttonStyle.button}
                    disableTouchRipple={true}>
                    {openCheck ? <RightArrow/> : <LeftArrow/>}
                </IconButton>
            </div>
            <div className={classes.content}>
                <div className={classes.filter}>
                    <form>
                        <MUICheckbox
                            label="Магазины"
                            className={classes.checkBox}
                            style={checkboxStyle}
                            iconStyle={{width: '20px', height: '20px'}}
                            labelStyle={{lineHeight: '20px', left: '-10px'}}
                            checked={showMarkets}
                            onCheck={props.marketCheck}
                        />

                        <MUICheckbox
                            label="Зоны"
                            className={classes.checkBox}
                            style={checkboxStyle}
                            iconStyle={{width: '20px', height: '20px'}}
                            labelStyle={{lineHeight: '20px', left: '-10px'}}
                            checked={showZones}
                            onCheck={props.zoneCheck}
                        />
                    </form>
                </div>
            </div>
        </div>
    )
})

TrackingMarketsZones.PropTypes = {
    filter: PropTypes.object,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    filterForm: PropTypes.shape({
        handleSubmitFilterDialog: PropTypes.func.isRequired
    }).isRequired,
    agentLocation: PropTypes.object
}

export default TrackingMarketsZones
