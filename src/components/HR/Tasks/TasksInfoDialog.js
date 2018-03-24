import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import IconButton from 'material-ui/IconButton'
import Loader from '../../Loader'
import {reduxForm} from 'redux-form'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import t from '../../../helpers/translate'
import {BORDER_STYLE, COLOR_DEFAULT} from '../../../constants/styleConstants'
import {connect} from 'react-redux'
import ApplicationDetails from '../Application/ApplicationDetails'
import ResumeFilterForm from '../Resume/ResumeFilterForm'

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
            borderBottom: BORDER_STYLE,
            '& > div > div:first-child': {
                display: 'none'
            }
        },
        filters: {

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
        data,
        filter,
        filterDialog
    } = props

    const appId = _.get(data, 'id')
    const initialValues = {
        age: {
            min: _.get(data, 'ageMin'),
            max: _.get(data, 'ageMax')
        },
        position: [_.get(data, ['position', 'id'])],
        mode: [_.get(data, 'mode')],
        experience: _.get(data, 'experience'),
        sex: {
            value: _.get(data, 'sex')
        },
        education: [_.get(data, 'education')],
        levelPc: {
            value: _.get(data, 'levelPc')
        },
        skills: _.map(_.get(data, 'skills'), (item) => _.get(item, 'name')),
        languages: _.map(_.get(data, 'languages'), (item) => {
            return {
                name: {
                    value: _.get(item, 'language')
                },
                level: {
                    value: _.get(item, 'level')
                }
            }
        })
    }
    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={{width: '800px', maxWidth: 'none'}}
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
                    <div className={classes.filters}>
                        <ResumeFilterForm
                            filter={filter}
                            filterDialog={filterDialog}
                            initialValues={initialValues}
                            forDialog={true}/>
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
