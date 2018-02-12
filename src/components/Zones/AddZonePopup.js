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
import injectSheet from 'react-jss'
import {compose, withHandlers} from 'recompose'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ToolTip from '../ToolTip'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import Draw from 'material-ui/svg-icons/action/timeline'
import Touch from 'material-ui/svg-icons/action/touch-app'
import {hashHistory} from 'react-router'
import t from '../../helpers/translate'

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
        classes,
        onClose,
        handleSubmit,
        handleClearDrawing,
        draw,
        edit,
        data,
        isDrawing,
        update
    } = props
    const submitZone = handleSubmit(() => props.onSubmit(data()).catch(validate))
    return (
        <div>
            <Paper zDepth={1} className={classes.addZoneWrapper}>
                <form onSubmit={submitZone}>
                    <Field
                        name="zoneName"
                        component={TextField}
                        className={classes.inputFieldCustom}
                        label={t('Наименование зоны')}
                        fullWidth={true}/>
                    <div className={classes.buttons}>
                        <ToolTip text={t('Режим рисования')} position="bottom">
                            <IconButton
                                disableTouchRipple={true}
                                className={isDrawing ? classes.activeButton : classes.button}
                                onTouchTap={() => { draw() }}>
                                <Draw color="#666"/>
                            </IconButton>
                        </ToolTip>

                        <ToolTip text={t('Обычный режим')} position="bottom">
                            <IconButton
                                disableTouchRipple={true}
                                className={!isDrawing ? classes.activeButton : classes.button}
                                onTouchTap={() => { edit() }}>
                                <Touch color="#666"/>
                            </IconButton>
                        </ToolTip>

                        {!update && <ToolTip text={t('Очистить')} position="bottom">
                            <IconButton>
                                <DeleteIcon color="#666"
                                onTouchTap={() => { handleClearDrawing() }}
                                />
                            </IconButton>
                        </ToolTip>}
                    </div>
                    <FlatButton
                        label={t('Сохранить')}
                        labelStyle={{fontSize: '13px'}}
                        className={classes.actionButton}
                        primary={true}
                        type="submit"
                    />
                </form>
            </Paper>

            <div className={classes.addZoneClose}>
                <ToolTip position="left" text={t('Закрыть')}>
                    <FloatingActionButton
                        mini={true}
                        zDepth={1}
                        onTouchTap={ () => {
                            onClose()
                            edit()
                        } }>
                        <CloseIcon/>
                    </FloatingActionButton>
                </ToolTip>
            </div>
        </div>
    )
})

AddZonePopup.PropTypes = {
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
}

export default AddZonePopup
