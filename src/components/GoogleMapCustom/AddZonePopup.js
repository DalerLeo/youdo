import _ from 'lodash'
import React from 'react'
import IconButton from 'material-ui/IconButton'
import Paper from 'material-ui/Paper'
import PropTypes from 'prop-types'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import {Field, reduxForm, SubmissionError} from 'redux-form'
import FlatButton from 'material-ui/FlatButton'
import {TextField} from '../ReduxForm'
import toCamelCase from '../../helpers/toCamelCase'
import toBoolean from '../../helpers/toBoolean'
import injectSheet from 'react-jss'
import {compose, withHandlers} from 'recompose'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import Tooltip from '../ToolTip'
import CloseIcon2 from '../CloseIcon2'
import Draw from 'material-ui/svg-icons/action/timeline'
import Touch from 'material-ui/svg-icons/action/touch-app'
import {hashHistory} from 'react-router'

const validate = (data) => {
    const errors = toCamelCase(data)
    const nonFieldErrors = _.get(errors, 'nonFieldErrors')

    throw new SubmissionError({
        ...errors,
        _error: nonFieldErrors
    })
}
const DRAW = 'draw'
const pathname = 'googleMap'
const enhance = compose(
    injectSheet({
        addZoneWrapper: {
            position: 'absolute',
            top: '10px',
            left: '50%',
            marginLeft: '-275px',
            padding: '7px 20px',
            width: '550px',
            height: '60px',
            '& form': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                height: '100%'
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
        buttons: {
            display: 'flex'
        },
        actionButton: {
            '& span': {
                color: '#129fdd !important',
                fontWeight: '600 !important'
            }
        },
        button: {
            background: '#fff !important',
            borderRadius: '50%'
        },
        activeButton: {
            extend: 'button',
            background: '#f0f0f0 !important'
        },
        addZoneClose: {
            position: 'absolute',
            top: '18px',
            right: '30px',
            '& button': {
                background: '#fff !important'
            },
            '& svg': {
                fill: '#666 !important'
            }
        }
    }),
    reduxForm({
        form: 'ZoneCreateForm',
        enableReinitialize: true
    }),
    withHandlers({
        clickDraw: props => () => {
            const {filter} = props
            hashHistory.push({pathname, query: filter.getParams({[DRAW]: true})})
        },
        clickPoint: props => () => {
            const {filter} = props
            hashHistory.push({pathname, query: filter.getParams({[DRAW]: false})})
        }
    })
)
const AddZonePopup = enhance((props) => {
    const {
        filter,
        classes,
        onClose,
        handleSubmit,
        handleClearDrawing,
        draw,
        edit,
        data
    } = props
    const submitZone = handleSubmit(() => props.onSubmit(data()).catch(validate))
    const isDraw = toBoolean(_.get(filter.getParams(), 'draw'))

    return (
        <div>
            <Paper zDepth={1} className={classes.addZoneWrapper}>
                <form onSubmit={submitZone}>
                    <Field
                        name="zoneName"
                        component={TextField}
                        className={classes.inputFieldCustom}
                        label="Наименование зоны"
                        fullWidth={true}/>
                    <div className={classes.buttons}>
                        <Tooltip text="Режим рисования" position="bottom">
                            <IconButton
                                disableTouchRipple={true}
                                className={isDraw ? classes.activeButton : classes.button}
                                onTouchTap={() => { draw() }}>
                                <Draw color="#666"/>
                            </IconButton>
                        </Tooltip>

                        <Tooltip text="Обычный режим" position="bottom">
                            <IconButton
                                disableTouchRipple={true}
                                className={!isDraw ? classes.activeButton : classes.button}
                                onTouchTap={() => { edit() }}>
                                <Touch color="#666"/>
                            </IconButton>
                        </Tooltip>

                        <Tooltip text="Очистить" position="bottom">
                            <IconButton
                                disableTouchRipple={true}>
                                <DeleteIcon color="#666"
                                onTouchTap={(event) => { handleClearDrawing(event) }}
                                />
                            </IconButton>
                        </Tooltip>
                    </div>
                    <FlatButton
                        label="Сохранить"
                        labelStyle={{fontSize: '13px'}}
                        className={classes.actionButton}
                        primary={true}
                        type="submit"
                    />
                </form>
            </Paper>

            <div className={classes.addZoneClose}>
                <Tooltip position="left" text="Закрыть">
                    <FloatingActionButton
                        mini={true}
                        zDepth={1}
                        onTouchTap={onClose}>
                        <CloseIcon2/>
                    </FloatingActionButton>
                </Tooltip>
            </div>
        </div>
    )
})

AddZonePopup.PropTypes = {
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
}

export default AddZonePopup
