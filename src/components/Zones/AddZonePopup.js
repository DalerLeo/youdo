import React from 'react'
import IconButton from 'material-ui/IconButton'
import Paper from 'material-ui/Paper'
import PropTypes from 'prop-types'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import {Field, reduxForm} from 'redux-form'
import FlatButton from 'material-ui/FlatButton'
import {TextField} from '../ReduxForm'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ToolTip from '../ToolTip'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import Draw from 'material-ui/svg-icons/action/timeline'
import Touch from 'material-ui/svg-icons/action/touch-app'
import t from '../../helpers/translate'
import formValidate from '../../helpers/formValidate'

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
        update,
        dispatch
    } = props
    const formNames = ['title']
    const submitZone = handleSubmit(() => props.onSubmit(data())
        .catch((error) => {
            formValidate(formNames, dispatch, error)
        })
    )
    return (
        <div>
            <Paper zDepth={1} className={classes.addZoneWrapper}>
                <form onSubmit={submitZone}>
                    <Field
                        name="title"
                        component={TextField}
                        className={classes.inputFieldCustom}
                        withoutErrorText={true}
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

                        {!update &&
                        <ToolTip text={t('Очистить')} position="bottom">
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
