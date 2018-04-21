import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import {Tabs, Tab} from 'material-ui/Tabs'
import Paper from 'material-ui/Paper'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import Loader from '../../Loader'
import ToolTip from '../../ToolTip'
import {Row, Col} from 'react-flexbox-grid'
import ResumeDetails from '../Resume/ResumeDetails'
import ResumeDetailsEditForm from './ResumeDetailsEditForm'
import ResumeQuestionsTab from './ResumeQuestionsTab'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import AddToList from 'material-ui/svg-icons/av/playlist-add'
import AddNote from 'material-ui/svg-icons/communication/chat'
import Delete from 'material-ui/svg-icons/action/delete'
import Edit from 'material-ui/svg-icons/editor/mode-edit'
import EventDone from 'material-ui/svg-icons/notification/event-available'
import {
    BORDER_STYLE,
    COLOR_DEFAULT, COLOR_GREY,
    COLOR_GREY_LIGHTEN,
    COLOR_WHITE,
    LINK_COLOR,
    PADDING_STANDART
} from '../../../constants/styleConstants'
import t from '../../../helpers/translate'
import dateTimeFormat from '../../../helpers/dateTimeFormat'
import {getBackendNames, getYearText} from '../../../helpers/hrcHelpers'
import {hashHistory} from 'react-router'
import {reduxForm, Field} from 'redux-form'
import {connect} from 'react-redux'
import {TextField, CheckBox} from '../../ReduxForm'
import formValidate from '../../../helpers/formValidate'
import dateFormat from '../../../helpers/dateFormat'
import {
    HR_RESUME_LONG,
    HR_RESUME_MEETING, HR_RESUME_NOTE, HR_RESUME_REMOVED,
    HR_RESUME_SHORT, HR_GENDER, HR_LEVEL_PC, HR_EDUCATION, HR_LANG_LEVELS
} from '../../../constants/backendConstants'

const TAB_DETAILS = 'details'
const TAB_COMMENTS = 'comments'
const TAB_LOGS = 'logs'
const AGE = 'age'
const SEX = 'sex'
const EDU = 'education'
const LEVEL_PC = 'level_pc'
const EXP = 'experience'

const enhance = compose(
    injectSheet({
        dialog: {
            overflowY: 'auto',
            paddingTop: '0 !important',
            zIndex: '1400 !important'
        },
        loader: {
            width: '100%',
            height: '400px',
            background: COLOR_WHITE,
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex'
        },
        staticLoader: {
            background: COLOR_WHITE,
            padding: '50px 0',
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex'
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
            background: COLOR_WHITE,
            color: COLOR_DEFAULT,
            fontSize: '15px',
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
        buttons: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            fontWeight: 'normal',
            textTransform: 'none',
            padding: '0 10px',
            '& > div button': {
                padding: '14px !important',
                '& svg': {
                    width: '20px !important',
                    height: '20px !important'
                }
            }
        },
        inContent: {
            minHeight: '600px'
        },
        details: {
            width: '100%',
            '& > div > div:first-child': {
                display: 'none'
            }
        },
        position: {
            color: COLOR_GREY,
            fontSize: '13px',
            fontWeight: '600',
            textTransform: 'none'
        },
        comments: {
            position: 'fixed',
            right: '-315px',
            top: '0',
            bottom: '0',
            borderLeft: BORDER_STYLE,
            width: '300px'
        },
        block: {
            padding: PADDING_STANDART,
            paddingTop: '10px',
            overflowY: 'auto',
            maxHeight: '600px'
        },
        innerTitle: {
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '10px'
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
            top: '-5px !important',
            lineHeight: '20px !important',
            fontSize: '13px !important'
        },
        addComment: {
            background: COLOR_WHITE,
            padding: '20px 30px'
        },
        commentsList: {

        },
        comment: {
            marginBottom: '10px',
            paddingBottom: '10px',
            borderBottom: BORDER_STYLE,
            position: 'relative',
            '&:last-child': {
                marginBottom: '0',
                paddingBottom: '0',
                borderBottom: 'none'
            },
            '& header': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '5px',
                '& h2': {
                    fontSize: '13px',
                    fontWeight: '600'
                },
                '& span': {
                    color: COLOR_GREY_LIGHTEN,
                    display: 'block',
                    textAlign: 'right',
                    fontSize: '11px'
                }
            },
            '& div': {
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
            }
        },
        tab: {
            height: '100%',
            '& > div:first-child > button': {
                borderRight: BORDER_STYLE + '!important',
                '& > div': {
                    display: 'inline-flex !important',
                    padding: '0 30px'
                },
                '&:last-child': {
                    borderRight: 'none !important'
                }
            }
        },
        tabContainer: {
            height: 'calc(100% - 49px)',
            overflowY: 'auto',
            position: 'relative',
            '& > div': {
                height: '100%'
            }
        },
        questions: {
            padding: '20px 30px',
            position: 'absolute',
            top: '0',
            bottom: '0',
            overflowY: 'auto',
            width: '100%'
        },
        question: {
            marginBottom: '15px',
            '&:last-child': {
                marginBottom: '0'
            },
            '& > span': {
                fontWeight: '600'
            }
        },
        saveButton: {
            background: COLOR_WHITE,
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            padding: '0 10px 10px 10px'
        },
        tabWrapper: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '50px',
            borderBottom: BORDER_STYLE
        },
        tabs: {
            '& > span': {
                cursor: 'pointer',
                display: 'inline-block',
                lineHeight: '50px',
                padding: '0 30px'
            }
        },
        activeTab: {
            color: LINK_COLOR
        },
        requirements: {
            padding: PADDING_STANDART,
            borderBottom: BORDER_STYLE,
            '& h2': {
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '15px'
            },
            '&:last-child': {
                borderBottom: 'none'
            }
        },
        requiredLanguages: {
            marginTop: '20px',
            '& h3': {
                fontWeight: '600',
                fontSize: '13px',
                marginBottom: '15px'
            }
        },
        requiredItems: {
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            marginBottom: '15px',
            '& > span': {
                width: 'calc(100% - 50px)'
            },
            '& > div div': {
                margin: '0 !important'
            },
            '&:last-child': {
                marginBottom: '0'
            }
        },
        requiredLangs: {
            extend: 'requiredItems',
            '& > div': {
                width: 'auto'
            }
        },
        checkedComment: {
            width: '100% !important',
            margin: '5px 0 0 0 !important'
        },
        langComment: {
            extend: 'checkedComment'
        },
        logs: {
            display: 'flex',
            '& > div:first-child': {
                flexBasis: '35%',
                maxWidth: '35%'
            },
            '& > div:nth-child(2)': {
                flexBasis: '30%',
                maxWidth: '30%'
            },
            '& > div:nt-child(3)': {
                flexBasis: '35%',
                maxWidth: '35%'
            }
        }
    }),
    reduxForm({
        form: 'ResumeDetailsForm',
        enableReinitialize: true
    }),
    withState('openAddComment', 'setOpenAddComment', false),
    withState('currentTab', 'setCurrentTab', TAB_DETAILS),
    connect((state) => {
        const requiredFields = _.get(state, ['form', 'ResumeDetailsForm', 'values', 'requirements'])
        const optionalFields = _.get(state, ['form', 'ResumeDetailsForm', 'values', 'optional'])
        return {
            requiredFields,
            optionalFields
        }
    })
)

const ResumeDetailsDialog = enhance((props) => {
    const {
        open,
        filter,
        data,
        loading,
        classes,
        handleSubmit,
        dispatch,
        createCommentLoading,
        handleCreateComment,
        handleSubmitResumeAnswers,
        commentsList,
        commentsLoading,
        openAddComment,
        setOpenAddComment,
        handleClickButton,
        answersData,
        questionsData,
        currentTab,
        setCurrentTab,
        editResumeDetails,
        application,
        appLogs,
        requiredFields,
        optionalFields,
        setFinishConfirmDialog

    } = props

    const currentStatus = filter.getParam('status')
    const submitComment = handleSubmit(() => handleCreateComment()
        .catch((error) => {
            formValidate(['comment'], dispatch, error)
        }))

    const fullName = _.get(data, 'fullName')
    const languages = _.get(application, 'languages')
    const filterRequired = _.get(application, 'filterRequired')

    const allLanguagesIds = _.map(languages, (item) => _.get(item, ['language', 'id']))
    const requiredLanguagesIds = _.get(_.find(filterRequired, _.isObject), ['langLevel'])
    const optionalLanguagesIds = _.difference(allLanguagesIds, requiredLanguagesIds)
    const allRequirments = [
        'age',
        'education',
        'experience',
        'level_pc',
        'sex',
        {langLevel: optionalLanguagesIds}
    ]
    const optionalRequired = _.difference(allRequirments, filterRequired)

    const flatButtonStyle = {
        label: {
            color: COLOR_WHITE,
            fontWeight: '600',
            textTransform: 'none',
            verticalAlign: 'baseline'
        }
    }

    const tabStyle = {
        button: {
            textTransform: 'none'
        },
        customButton: {
            color: COLOR_DEFAULT,
            fontSize: '15px',
            fontWeight: 'bold',
            textTransform: 'uppercase'
        },
        ink: {
            background: COLOR_WHITE,
            marginTop: '-1px',
            height: '1px'
        },
        tabItem: {
            borderBottom: BORDER_STYLE
        }
    }

    const getTabContent = () => {
        switch (currentTab) {
            case TAB_DETAILS: return (
                <div>
                    {loading
                        ? <div className={classes.loader}>
                            <Loader size={0.75}/>
                        </div>
                        : <div className={classes.wrapper}>
                            <div className={classes.details}>
                                {!editResumeDetails.open
                                ? <ResumeDetails
                                    data={data}
                                    loading={loading}/>
                                : <ResumeDetailsEditForm
                                        initialValues={editResumeDetails.initialValues}
                                        educations={_.get(editResumeDetails, ['initialValues', 'educations'])}
                                        experiences={_.get(editResumeDetails, ['initialValues', 'experiences'])}
                                        editResumeDetails={editResumeDetails}
                                    />}
                            </div>
                        </div>}
                </div>
            )
            case TAB_COMMENTS: return (
                <div>
                    {!openAddComment &&
                    <div className={classes.addComment}>
                        <FlatButton
                            label={'Добавить'}
                            labelStyle={flatButtonStyle.label}
                            backgroundColor={'#607D8B'}
                            fullWidth={true}
                            hoverColor={'#607D8B'}
                            rippleColor={COLOR_WHITE}
                            onClick={() => {
                                setOpenAddComment(true)
                            }}/>
                    </div>}
                    <form className={classes.block} style={{top: openAddComment ? '20px' : '75px'}}>
                        {openAddComment && !createCommentLoading &&
                        <div>
                            <Field
                                name={'comment'}
                                component={TextField}
                                className={classes.textFieldArea}
                                hintText={t('Комментарий') + '...'}
                                hintStyle={{bottom: 'auto', top: '12px'}}
                                fullWidth
                                multiLine
                                rows={2}/>
                            <FlatButton
                                label={'Сохранить'}
                                labelStyle={flatButtonStyle.label}
                                backgroundColor={'#607D8B'}
                                fullWidth={true}
                                hoverColor={'#607D8B'}
                                rippleColor={COLOR_WHITE}
                                onClick={submitComment}/>
                        </div>}
                        {createCommentLoading &&
                        <div className={classes.staticLoader}>
                            <Loader size={0.75}/>
                        </div>}
                        <div className={classes.commentsList}
                             style={{marginTop: openAddComment ? '20px' : '0'}}>
                            {commentsLoading
                                ? <div className={classes.staticLoader}>
                                    <Loader size={0.75}/>
                                </div>
                                : _.map(commentsList, (item) => {
                                    const id = _.get(item, 'id')
                                    const comment = _.get(item, 'comment')
                                    const createdDate = dateFormat(_.get(item, 'createdDate'))
                                    const user = _.get(item, ['user', 'firstName']) + ' ' + _.get(item, ['user', 'secondName'])
                                    return (
                                        <div key={id} className={classes.comment}>
                                            <header>
                                                <h2>{user}</h2>
                                                <span>{createdDate}</span>
                                            </header>
                                            <div>{comment}</div>
                                        </div>
                                    )
                                })}
                        </div>
                    </form>
                </div>
            )
            case TAB_LOGS: return (
                <div style={{padding: '0 30px'}}>
                    <Row className="dottedList">
                        <Col xs={4}>{t('Дата')}</Col>
                        <Col xs={3}>{t('Позиция')}</Col>
                        <Col xs={5} style={{textAlign: 'right'}} >{t('Кем')}</Col>
                    </Row>
                    {_.map(appLogs, (item, index) => {
                        return (
                            <Row className="dottedList" key={index}>
                                <Col xs={4}>{dateTimeFormat(item.createdDate)}</Col>
                                <Col xs={3}>{item.position}</Col>
                                <Col xs={5} style={{textAlign: 'right'}}>{item.user}</Col>
                            </Row>
                        )
                    })}
                </div>
            )
            default: return null
        }
    }
    const mainDialogWidth = currentTab === TAB_DETAILS ? Number('910') : Number('400')
    const secondaryDialogWidth = 300
    const offsetBetweenDialogs = 15
    const half = 2
    const dialogMargin = (mainDialogWidth + secondaryDialogWidth + offsetBetweenDialogs) / half

    const getRequirements = (key, required, selected, index) => {
        const formName = required ? 'requirements' : 'optional'
        const getField = (name, value) => {
            return (
                <div key={key + '_' + index} className={classes.requiredItems}>
                    <span>{name}: {value}</span>
                    <Field
                        name={formName + '[' + key + '][checked]'}
                        component={CheckBox}
                        style={{width: 'auto', margin: '0 0 0 10px'}}/>
                    {selected &&
                    <div className={classes.checkedComment}>
                        <Field
                            name={formName + '[' + key + '][comment]'}
                            component={TextField}
                            hintText={t('Комментарий')}
                            hintStyle={{bottom: 16}}
                            className={classes.textFieldArea}
                            fullWidth
                            multiLine
                            rows={1}/>
                    </div>}
                </div>
            )
        }
        const getLanguageField = (value, id, checked) => {
            return (
                <div key={id} className={classes.requiredLangs}>
                    {value}
                    <Field
                        name={formName + '[langs][' + id + '][checked]'}
                        component={CheckBox}
                        style={{width: 'auto', margin: '0 0 0 10px'}}/>
                    {checked &&
                    <div className={classes.langComment}>
                        <Field
                            name={formName + '[langs][' + id + '][comment]'}
                            component={TextField}
                            hintText={t('Комментарий')}
                            hintStyle={{bottom: 16}}
                            className={classes.textFieldArea}
                            fullWidth
                            multiLine
                            rows={1}/>
                    </div>}
                </div>
            )
        }
        if (_.isObject(key)) {
            return !_.isEmpty(_.get(key, 'langLevel'))
                ? (
                    <div key={index} className={classes.requiredLanguages}>
                        <h3>{t('Языки')}</h3>
                        {_.map(_.get(key, 'langLevel'), (langId) => {
                            const getLanguage = () => {
                                return _.find(languages, (item) => {
                                    return _.get(item, ['language', 'id']) === langId
                                })
                            }
                            const language = getLanguage(langId)
                            const languageId = _.get(language, ['language', 'id'])
                            const langName = _.get(language, ['language', 'name'])
                            const langLevel = getBackendNames(HR_LANG_LEVELS, _.get(language, ['level']))
                            const output = langName + ' (' + langLevel + ')'
                            const checked = required
                                ? _.get(requiredFields, ['langs', languageId, 'checked'])
                                : _.get(optionalFields, ['langs', languageId, 'checked'])
                            return getLanguageField(output, languageId, checked)
                        })}
                    </div>
                ) : null
        }
        switch (key) {
            case AGE: return getField(t('Возраст'), getYearText(_.get(application, 'ageMin')) + ' - ' + getYearText(_.get(application, 'ageMax')))
            case SEX: return getField(t('Пол'), getBackendNames(HR_GENDER, _.get(application, key)))
            case EDU: return getField(t('Образование'), getBackendNames(HR_EDUCATION, _.get(application, key)))
            case LEVEL_PC: return getField(t('Уревень владения ПК'), getBackendNames(HR_LEVEL_PC, _.get(application, 'levelPc')))
            case EXP: return getField(t('Минимальный опыт работы'), getYearText(_.get(application, key)))
            default: return null
        }
    }

    return (
        <Dialog
            modal={true}
            open={open}
            className={classes.dialog}
            contentStyle={{
                width: mainDialogWidth,
                marginLeft: currentStatus === HR_RESUME_MEETING ? 'calc(50% - ' + dialogMargin + 'px)' : 'auto',
                maxWidth: 'none'}}
            bodyClassName={classes.popUp}>

            <div className={classes.titleContent}>
                <span>{fullName}</span>
                <IconButton onTouchTap={() => {
                    hashHistory.push(filter.createURL({resume: null, status: null, relation: null, editResumeDetails: null}))
                    return setCurrentTab(TAB_DETAILS)
                }}>
                    <CloseIcon color={COLOR_GREY}/>
                </IconButton>
            </div>

            <div className={classes.bodyContent}>
                <div className={classes.inContent}>
                    <div className={classes.tabWrapper}>
                        <div className={classes.tabs}>
                            <span
                                className={currentTab === TAB_DETAILS ? classes.activeTab : ''}
                                onClick={() => { setCurrentTab(TAB_DETAILS) }}>
                                {t('Детали')}
                            </span>
                            <span
                                className={currentTab === TAB_COMMENTS ? classes.activeTab : ''}
                                onClick={() => { setCurrentTab(TAB_COMMENTS) }}>
                                {t('Комментарии')}
                            </span>
                            <span
                                className={currentTab === TAB_LOGS ? classes.activeTab : ''}
                                onClick={() => { setCurrentTab(TAB_LOGS) }}>
                                {t('Логи')}
                            </span>
                        </div>
                        {currentTab === TAB_DETAILS && !_.isNil(currentStatus) &&
                        <div className={classes.buttons}>
                            {currentStatus === HR_RESUME_MEETING &&
                            <ToolTip position={'bottom'} text={t('Завершить собеседование')}>
                                <IconButton onTouchTap={() => setFinishConfirmDialog(true)}>
                                    <EventDone color={COLOR_GREY}/>
                                </IconButton>
                            </ToolTip>}
                            {currentStatus === HR_RESUME_LONG &&
                            <FlatButton
                                label={'Назначить собеседование'}
                                labelStyle={flatButtonStyle.label}
                                backgroundColor={LINK_COLOR}
                                hoverColor={LINK_COLOR}
                                rippleColor={COLOR_WHITE}
                                onTouchTap={() => { handleClickButton(HR_RESUME_MEETING) }}/>}
                            {(currentStatus === HR_RESUME_LONG || currentStatus === HR_RESUME_MEETING) &&
                            <ToolTip position={'bottom'} text={t('Добавить в шортлист')}>
                                <IconButton onTouchTap={() => { handleClickButton(HR_RESUME_SHORT) }}>
                                    <AddToList color={COLOR_GREY}/>
                                </IconButton>
                            </ToolTip>}
                            <ToolTip position={'bottom'} text={t('Добавить заметку')}>
                                <IconButton onTouchTap={() => { handleClickButton(HR_RESUME_NOTE) }}>
                                    <AddNote color={COLOR_GREY}/>
                                </IconButton>
                            </ToolTip>
                            {currentStatus === HR_RESUME_MEETING && !editResumeDetails.open &&
                             <ToolTip position={'bottom'} text={t('Изменить данные')}>
                                <IconButton onTouchTap={() => { editResumeDetails.handleOpen() }}>
                                    <Edit color={COLOR_GREY}/>
                                </IconButton>
                            </ToolTip>}
                            <ToolTip position={'bottom'} text={t('Удалить со списка')}>
                                <IconButton onTouchTap={() => { handleClickButton(HR_RESUME_REMOVED) }}>
                                    <Delete color={COLOR_GREY}/>
                                </IconButton>
                            </ToolTip>
                        </div>}
                    </div>
                    {getTabContent()}
                    {currentStatus === HR_RESUME_MEETING &&
                    <Paper zDepth={4} className={classes.comments}>
                        <Tabs
                            inkBarStyle={tabStyle.ink}
                            tabItemContainerStyle={tabStyle.tabItem}
                            className={classes.tab}
                            contentContainerClassName={classes.tabContainer}>
                            <Tab label={t('Вопросник')} buttonStyle={tabStyle.button} disableTouchRipple>
                                <Field
                                    name="answers"
                                    component={ResumeQuestionsTab}
                                    answersData={answersData}
                                    questionsData={questionsData}
                                    handleSubmitResumeAnswers={handleSubmitResumeAnswers}
                                />
                            </Tab>
                            <Tab label={t('Требования')} buttonStyle={tabStyle.button} disableTouchRipple>
                                <div className={classes.requirements}>
                                    <h2>{t('Обязательные требования')}</h2>
                                    {_.map(filterRequired, (item, index) => {
                                        const checked = _.get(requiredFields, [item, 'checked'])
                                        return getRequirements(item, true, checked, index)
                                    })}
                                </div>
                                <div className={classes.requirements}>
                                    <h2>{t('Необязательные требования')}</h2>
                                    {_.map(optionalRequired, (item, index) => {
                                        const checked = _.get(optionalFields, [item, 'checked'])
                                        return getRequirements(item, false, checked, index)
                                    })}
                                </div>
                            </Tab>
                        </Tabs>
                    </Paper>}
                </div>
            </div>
        </Dialog>
    )
})

ResumeDetailsDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    data: PropTypes.object.isRequired,
    filter: PropTypes.object.isRequired
}

export default ResumeDetailsDialog
