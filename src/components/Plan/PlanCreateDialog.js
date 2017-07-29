import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withReducer} from 'recompose'
import injectSheet from 'react-jss'
import {Field, reduxForm, SubmissionError} from 'redux-form'
import Dialog from 'material-ui/Dialog'
import CircularProgress from 'material-ui/CircularProgress'
import IconButton from 'material-ui/IconButton'
import CloseIcon2 from '../CloseIcon2'
import Group from 'material-ui/svg-icons/social/group'
import Person from 'material-ui/svg-icons/social/person'
import toCamelCase from '../../helpers/toCamelCase'
import DateToDate from '../ReduxForm/Basic/DateToDateFieldCustom'
import GoogleMap from '../GoogleMap'

const validate = (data) => {
    const errors = toCamelCase(data)
    const nonFieldErrors = _.get(errors, 'nonFieldErrors')
    throw new SubmissionError({
        ...errors,
        _error: nonFieldErrors
    })
}
const enhance = compose(
    injectSheet({
        loader: {
            width: '100%',
            height: '250px',
            background: '#fff',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex'
        },
        podlojkaScroll: {
            overflowY: 'auto !important',
            padding: '0 !important',
            '& > div:first-child > div:first-child': {
                transform: 'translate(0px, 0px) !important'
            },
            '& > div': {
                height: '100% !important',
                '& > div': {
                    height: '100% !important',
                    padding: '0',
                    '& > div': {
                        height: '100%'
                    }
                }
            }
        },
        popUp: {
            background: '#fff',
            overflowY: 'hidden !important',
            fontSize: '13px !important',
            position: 'relative',
            padding: '0 !important',
            overflowX: 'hidden',
            height: '100%',
            minHeight: '700px',
            maxHeight: 'inherit !important'
        },
        titleContent: {
            background: '#fff',
            color: '#333',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #efefef',
            padding: '0 10px 0 30px',
            minHeight: '59px',
            zIndex: '999',
            '& button': {
                padding: '0 !important',
                '& > div': {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }
            }
        },
        inContent: {
            display: 'flex',
            color: '#333',
            height: '100%'
        },
        bodyContent: {
            color: '#333',
            width: '100%',
            height: '100%'
        },
        form: {
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'space-between'
        },
        field: {
            width: '100%'
        },
        leftSide: {
            width: '300px',
            borderRight: '1px #efefef solid',
            display: 'flex',
            flexDirection: 'column'
        },
        dateBlock: {
            padding: '20px 30px'
        },
        week: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '12px'
        },
        weekItem: {
            background: '#eaeaea',
            color: '#666',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '26px',
            width: '32px'
        },
        weekItemActive: {
            extend: 'weekItem',
            background: '#8de2b3',
            color: '#fff'
        },
        scroll: {
            height: '100%'
        },
        zone: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            padding: '0 30px',
            height: '40px',
            borderTop: '1px #efefef solid'
        },
        activeZone: {
            extend: 'zone',
            background: '#f2f5f8',
            position: 'relative',
            '&:before': {
                content: '""',
                position: 'absolute',
                right: '-13px',
                borderTop: '10px solid transparent',
                borderLeft: '12px solid #efefef',
                borderBottom: '10px solid transparent',
                zIndex: '10'
            },
            '&:after': {
                content: '""',
                position: 'absolute',
                right: '-12px',
                borderTop: '10px solid transparent',
                borderLeft: '12px solid #f2f5f8',
                borderBottom: '10px solid transparent',
                zIndex: '10'
            }
        },
        rightSide: {
            width: 'calc(100% - 300px)',
            position: 'relative'
        },
        agents: {
            display: 'flex',
            justifyContent: 'center',
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            zIndex: '10'
        },
        agentItem: {
            background: '#fff',
            height: '42px',
            width: '142px',
            display: 'flex',
            alignItems: 'center',
            borderLeft: '8px solid',
            padding: '0 10px',
            margin: '0 10px',
            opacity: '0.8',
            '& span': {
                color: '#333 !important',
                lineHeight: '1.2'
            }
        },
        imgPlace: {
            display: 'flex',
            alignItems: 'center',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            background: '#9aa6b3',
            overflow: 'hidden',
            marginRight: '5px',
            '& svg': {
                margin: 'auto'
            }
        },
        agentItemActive: {
            extend: 'agentItem',
            opacity: '1'
        },
        inputFieldCustom: {
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
        form: 'PlanCreateForm',
        enableReinitialize: true
    }),
    withReducer('state', 'dispatch', (state, action) => {
        return {...state, ...action}
    }, {open: false}),
)

const customContentStyle = {
    width: '100%',
    maxWidth: 'none'
}
const PlanCreateDialog = enhance((props) => {
    const {open, handleSubmit, onClose, classes, isUpdate, zonesList, zonesLoading} = props
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))
    const mapCenter = {
        lat: 55.40718864159901,
        lng: 10.34912109375
    }
    const agentIcon = {
        color: '#fff',
        width: 20,
        height: 20
    }
    const zones = _.map(zonesList, (item) => {
        const id = _.get(item, 'id')
        const title = _.get(item, 'title')

        return (
            <div key={id} className={classes.zone}>
                <span>{title}</span>
                <span>50 / 100</span>
            </div>
        )
    })
    return (
        <Dialog
            modal={true}
            className={classes.podlojkaScroll}
            contentStyle={customContentStyle}
            open={open}
            onRequestClose={onClose}
            bodyClassName={classes.popUp}
            autoScrollBodyContent={true}>
            <div className={classes.bodyContent}>
                <form onSubmit={onSubmit} scrolling="auto" className={classes.form}>
                    <div className={classes.inContent}>
                        <div className={classes.leftSide}>
                            <div className={classes.titleContent}>
                                <span>{isUpdate ? 'Изменение плана' : 'Составление плана'}</span>
                                <IconButton onTouchTap={onClose}>
                                    <CloseIcon2 color="#666666"/>
                                </IconButton>
                            </div>
                            <div className={classes.scroll}>
                                <div className={classes.dateBlock}>
                                    <Field
                                        name="date"
                                        component={DateToDate}
                                        className={classes.inputFieldCustom}
                                        label="Дата"
                                        fullWidth={true}
                                    />
                                    <div className={classes.week}>
                                        <div className={classes.weekItemActive}>Пн</div>
                                        <div className={classes.weekItem}>Вт</div>
                                        <div className={classes.weekItem}>Ср</div>
                                        <div className={classes.weekItem}>Чт</div>
                                        <div className={classes.weekItem}>Пт</div>
                                        <div className={classes.weekItem}>Сб</div>
                                        <div className={classes.weekItem}>Вс</div>
                                    </div>
                                </div>
                                <div className={classes.zonesList}>
                                    {zonesLoading
                                        ? <div className={classes.loader}>
                                            <CircularProgress size={40} thickness={4}/>
                                        </div>
                                        : zones}
                                </div>
                            </div>
                        </div>
                        <div className={classes.rightSide}>
                            <div className={classes.agents}>
                                <div className={classes.agentItem} style={{color: '#ebe8de'}}>
                                    <div className={classes.imgPlace}>
                                        <Group style={agentIcon}/>
                                    </div>
                                    <span>Все <br/> агенты</span>
                                </div>
                                <div className={classes.agentItemActive} style={{color: '#035f87'}}>
                                    <div className={classes.imgPlace}>
                                        <Person style={agentIcon}/>
                                    </div>
                                    <span>Бекзод <br/> Азизжанов</span>
                                </div>
                            </div>
                            <GoogleMap center={mapCenter}/>
                        </div>
                    </div>
                </form>
            </div>
        </Dialog>
    )
})
PlanCreateDialog.propTyeps = {
    isUpdate: PropTypes.bool,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}
PlanCreateDialog.defaultProps = {
    isUpdate: false
}
export default PlanCreateDialog
