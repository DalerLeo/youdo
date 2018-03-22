import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import Loader from '../../Loader'
import ToolTip from '../../ToolTip'
import {Field, FieldArray, reduxForm, change} from 'redux-form'
import {TextField, CheckBox, DateField, ClientContactsField, TimeField} from '../../ReduxForm'
import WorkScheduleSearchField from '../../ReduxForm/HR/WorkScheduleSearchField'
import SexSearchField from '../../ReduxForm/HR/GenderSearchField'
import EducationSearchField from '../../ReduxForm/HR/EducationSearchField'
import ComputerLevelSearchField from '../../ReduxForm/HR/ComputerLevelSearchField'
import SkillsTagSearchField from '../../ReduxForm/HR/SkillsTagSearchField'
import LanguageField from '../../ReduxForm/HR/LanguageField'
import PositionSearchField from '../../ReduxForm/HR/Position/PositionSearchField'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import AddPerson from 'material-ui/svg-icons/social/person-add'
import PersonIcon from 'material-ui/svg-icons/social/person'
import IconButton from 'material-ui/IconButton'
import t from '../../../helpers/translate'
import * as ROUTES from '../../../constants/routes'
import formValidate from '../../../helpers/formValidate'
import normalizeNumber from '../../ReduxForm/normalizers/normalizeNumber'
import {BORDER_STYLE, COLOR_DEFAULT} from '../../../constants/styleConstants'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import Popover from 'material-ui/Popover/Popover'
import ApplicationDetails from '../Application/ApplicationDetails'

const enhance = compose(
    injectSheet({
        dialog: {
            overflowY: 'auto',
            paddingTop: '0 !important'
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
            display: ({loading}) => loading ? 'flex' : 'none'
        },
        customLoader: {
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px 0'
        },
        popUp: {
            color: '#333 !important',
            overflowY: 'unset !important',
            overflowX: 'unset !important',
            fontSize: '13px !important',
            position: 'relative',
            padding: '0 !important',
            height: '100%',
            maxHeight: 'none !important',
            marginBottom: '64px'
        },
        titleContent: {
            background: '#fff',
            color: COLOR_DEFAULT,
            fontWeight: 'bold',
            textTransform: 'uppercase',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: BORDER_STYLE,
            padding: '0 10px 0 30px',
            height: '60px',
            zIndex: '999'
        },
        sidePaddings: {
            padding: '10px 30px 15px'
        },
        inContent: {
            borderTop: BORDER_STYLE,
            '&:first-child': {
                border: 'none'
            }
        },
        block: {
            '& h4': {
                fontWeight: '600',
                fontSize: '13px',
                padding: '10px 0'
            }
        },
        inputFieldCustom: {
            fontSize: '13px !important',
            height: '45px !important',
            marginTop: '7px',
            '& > div:first-child': {
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
        textFieldArea: {
            top: '-20px !important',
            lineHeight: '20px !important',
            fontSize: '13px !important',
            marginBottom: '-22px'
        },
        inputDateCustom: {
            fontSize: '13px !important',
            height: '45px !important',
            marginTop: '7px',
            '& > div:first-child': {
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
        },
        bottomButton: {
            bottom: '0',
            left: '0',
            right: '0',
            padding: '10px',
            zIndex: '999',
            borderTop: BORDER_STYLE,
            background: '#fff',
            textAlign: 'right',
            '& span': {
                fontSize: '13px !important',
                fontWeight: '600 !important',
                color: '#129fdd',
                verticalAlign: 'inherit !important'
            }
        },
        actionButton: {
            fontSize: '13px !important',
            margin: '0 !important'
        },
        flex: {
            display: 'flex'
        },
        alignBaseline: {
            alignItems: 'baseline'
        },
        alignCenter: {
            alignItems: 'center'
        },
        flexBetween: {
            extend: 'flex',
            justifyContent: 'space-between'
        },
        halfChild: {
            flexWrap: 'wrap',
            '& > div': {
                width: '49% !important'
            }
        },
        thirdChild: {
            flexWrap: 'wrap',
            '& > div': {
                width: '32% !important'
            }
        },
        details: {
            '& > div > div:first-child': {
                display: 'none'
            }
        }
    }),
    reduxForm({
        form: 'TasksCreateForm',
        enableReinitialize: true
    }),
    withState('anchorEl', 'setAnchorEl', null),
    withState('chosenRecruiter', 'chooseRecruiter', false),
    connect((state) => {
        const recruiter = _.get(state, ['form', 'TasksCreateForm', 'values', 'recruiter']) || false
        return {
            recruiter
        }
    })
)

const TasksInfoDialog = enhance((props) => {
    const {
        open,
        onClose,
        classes,
        loading,
        data
    } = props

    const appId = _.get(data, 'id')
    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={{width: '900px', maxWidth: 'none'}}
            bodyClassName={classes.popUp}>

            <div className={classes.titleContent}>
                <span>{t('Работа с заявкой')} №{appId}</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon color="#666666"/>
                </IconButton>
            </div>

            <div className={classes.bodyContent}>
                <div className={classes.inContent}>
                    <div className={classes.loader}>
                        <Loader size={0.75}/>
                    </div>
                    <div className={classes.details}>
                        <ApplicationDetails
                            data={data}
                            loading={loading}
                            handleOpenUpdateDialog={null}/>
                    </div>
                </div>
            </div>
        </Dialog>
    )
})

TasksInfoDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}

export default TasksInfoDialog
