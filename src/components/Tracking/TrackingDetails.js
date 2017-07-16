import _ from 'lodash'
import React from 'react'
import IconButton from 'material-ui/IconButton'
import * as ROUTES from '../../constants/routes'
import {Link} from 'react-router'
import PropTypes from 'prop-types'
import sprintf from 'sprintf'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import CircularProgress from 'material-ui/CircularProgress'
import CloseIcon2 from '../CloseIcon2'
import {reduxForm, Field} from 'redux-form'
import DateToDateField from '../ReduxForm/Basic/DateToDateFieldCustom'
import MarketTypeSearch from '../ReduxForm/Shop/MarketTypeSearchField'
import AgentSearch from '../ReduxForm/Users/UsersSearchField'
import Checkbox from '../ReduxForm/Basic/CheckBox'

const enhance = compose(
    injectSheet({
        detailWrap: {
            background: '#fff',
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            zIndex: '2'
        },
        loader: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: '#fff',
            top: '0',
            left: '0',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex'
        },
        title: {
            background: '#fff',
            color: '#333',
            fontWeight: '600',
            textTransform: 'uppercase',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #efefef',
            padding: '20px 30px',
            zIndex: '999',
            '& button': {
                right: '13px',
                top: '5px',
                padding: '0 !important',
                position: 'absolute !important'
            }
        },
        subtitle: {
            fontWeight: '600',
            marginBottom: '15px'
        },
        content: {
            padding: '20px 30px',
            overflowY: 'auto'
        },
        checkbox: {
            margin: '15px 0 !important',
            '& span': {
                top: '-10px !important',
                left: '-10px !important'
            }
        },
        inputFieldCustom: {
            flexBasis: '200px',
            fontSize: '13px !important',
            height: '45px !important',
            marginTop: '7px',
            '& div': {
                fontSize: '13px !important'
            },
            '& label': {
                top: '20px !important',
                lineHeight: '5px !important'
            },
            '& input': {
                marginTop: '0 !important'
            }
        }
    }),
    reduxForm({
        form: 'TrackingAgentFilterForm',
        enableReinitialize: true
    }),
)

const TrackingDetails = enhance((props) => {
    const {
        classes,
        filter,
        listData,
        detailData
    } = props
    const loading = _.get(detailData, 'detailLoading')
    const id = _.get(detailData, 'id')
    const agent = _.get(_.find(_.get(listData, 'data'), {'id': id}), 'agent')

    return (
        <div className={classes.detailWrap}>
            {loading && <div className={classes.loader}>
                <CircularProgress size={40} thickness={4}/>
            </div>}
            <div className={classes.title}>
                <span>{agent}</span>
                <Link to={{
                    pathname: sprintf(ROUTES.TRACKING_LIST_URL),
                    query: filter.getParams()
                }}>
                    <IconButton>
                        <CloseIcon2 color="#666666"/>
                    </IconButton>
                </Link>
            </div>
            <div className={classes.content}>
                <div className={classes.filter}>
                    <div className={classes.subtitle}>Фильтры</div>
                    <Field
                        className={classes.inputFieldCustom}
                        name="border"
                        component={MarketTypeSearch}
                        label="Выберите зону"
                        fullWidth={true}/>
                    <Field
                        className={classes.inputFieldCustom}
                        name="agent"
                        component={AgentSearch}
                        label="Агент"
                        fullWidth={true}/>
                    <Field
                        className={classes.inputFieldCustom}
                        name="period"
                        component={DateToDateField}
                        label="Посмотреть по периоду"
                        fullWidth={true}/>
                    <Field
                        name="showMarkets"
                        className={classes.checkbox}
                        component={Checkbox}
                        label="Отображать магазины"/>
                    <Field
                        name="showZones"
                        className={classes.checkbox}
                        component={Checkbox}
                        label="Отображать зоны"/>
                    <Field
                        name="agentTrack"
                        className={classes.checkbox}
                        component={Checkbox}
                        label="Пройденный маршрут агента"/>
                </div>
            </div>
        </div>
    )
})

TrackingDetails.PropTypes = {
    filter: PropTypes.object,
    listData: PropTypes.object,
    detailData: PropTypes.object
}

export default TrackingDetails
