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
import {DateField} from '../ReduxForm'
import Checkbox from '../ReduxForm/Basic/CheckBox'
import RaisedButton from 'material-ui/RaisedButton'
import TrackingTimeSlider from './TrackingTimeSlider'

const enhance = compose(
    injectSheet({
        detailWrap: {
            background: '#fff',
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            zIndex: '2',
            overflowY: 'auto'
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
        halfField: {
            display: 'flex',
            justifyContent: 'space-between',
            '& > div': {
                width: '49%'
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
        },
        inputDateCustom: {
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
            },
            '& div:first-child': {
                height: '45px !important'
            }
        }
    }),
    reduxForm({
        form: 'TrackingFilterForm',
        enableReinitialize: true
    })
)

const TrackingDetails = enhance((props) => {
    const {
        classes,
        listData,
        handleSubmit,
        detailData,
        filterForm,
        isOpenTrack
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
                    pathname: sprintf(ROUTES.TRACKING_LIST_URL)
                }}>
                    <IconButton>
                        <CloseIcon2 color="#666666"/>
                    </IconButton>
                </Link>
            </div>
            <div className={classes.content}>
                <div className={classes.filter}>
                    <div className={classes.subtitle}>Фильтры</div>
                    <form onSubmit={handleSubmit(filterForm.handleSubmitFilterDialog)}>
                        <Field
                            className={classes.inputDateCustom}
                            name="date"
                            component={DateField}
                            label="Посмотреть по дате"
                            fullWidth={true}/>
                        {isOpenTrack && <Field
                            name="time"
                            component={TrackingTimeSlider}
                        />}
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
                        <RaisedButton
                            label="Применить"
                            labelStyle={{fontSize: '13px'}}
                            backgroundColor="#12aaeb"
                            labelColor="#fff"
                            type="submit"/>
                    </form>
                </div>
            </div>
        </div>
    )
})

TrackingDetails.PropTypes = {
    filter: PropTypes.object,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    filterForm: PropTypes.shape({
        handleSubmitFilterDialog: PropTypes.func.isRequired
    }).isRequired,
    agentLocation: PropTypes.object
}

export default TrackingDetails
