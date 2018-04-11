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
import ResumeDetails from '../Resume/ResumeDetails'
import ResumeQuestionsTab from './ResumeQuestionsTab'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import AddToList from 'material-ui/svg-icons/av/playlist-add'
import AddNote from 'material-ui/svg-icons/communication/chat'
import Delete from 'material-ui/svg-icons/action/delete'
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
import {hashHistory} from 'react-router'
import {reduxForm, Field} from 'redux-form'
import {TextField} from '../../ReduxForm'
import formValidate from '../../../helpers/formValidate'
import dateFormat from '../../../helpers/dateFormat'
import {
    HR_RESUME_LONG,
    HR_RESUME_MEETING, HR_RESUME_NOTE, HR_RESUME_REMOVED,
    HR_RESUME_SHORT
} from '../../../constants/backendConstants'

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
            fontWeight: 'normal',
            textTransform: 'none',
            '& > div button': {
                padding: '13px !important',
                '& svg': {
                    width: '20px !important',
                    height: '22px !important'
                }
            },
            '& > button:last-child': {
                marginLeft: '10px !important',
                padding: '12px !important',
                '& svg': {
                    width: '24px !important',
                    height: '24px !important'
                },
                '&:after': {
                    position: 'absolute',
                    content: '""',
                    top: '0',
                    bottom: '0',
                    left: '-5px',
                    width: '1px',
                    background: '#efefef'
                }
            }
        },
        wrapper: {
            display: 'flex'
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
            paddingTop: '0',
            position: 'absolute',
            left: '0',
            right: '0',
            bottom: '0',
            overflowY: 'auto'
        },
        innerTitle: {
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '10px'
        },
        textFieldArea: {
            top: '-5px !important',
            lineHeight: '20px !important',
            fontSize: '13px !important'
        },
        addComment: {
            background: COLOR_WHITE,
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
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
        }
    }),
    reduxForm({
        form: 'ResumeDetailsForm',
        enableReinitialize: true
    }),
    withState('openAddComment', 'setOpenAddComment', false)
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
        questionsData
    } = props

    const currentStatus = filter.getParam('status')
    const submitComment = handleSubmit(() => handleCreateComment()
        .catch((error) => {
            formValidate(['comment'], dispatch, error)
        }))

    const fullName = _.get(data, 'fullName')

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

    return (
        <Dialog
            modal={true}
            open={open}
            className={classes.dialog}
            contentStyle={{width: '800px', marginLeft: 'calc(50% - 558px)', maxWidth: 'none'}}
            bodyClassName={classes.popUp}>

            <div className={classes.titleContent}>
                <span>{fullName}</span>
                <div className={classes.buttons}>
                    {currentStatus === HR_RESUME_MEETING &&
                    <ToolTip position={'bottom'} text={t('Завершить собеседование')}>
                        <IconButton onTouchTap={() => null}>
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
                    <ToolTip position={'bottom'} text={t('Удалить со списка')}>
                        <IconButton onTouchTap={() => { handleClickButton(HR_RESUME_REMOVED) }}>
                            <Delete color={COLOR_GREY}/>
                        </IconButton>
                    </ToolTip>

                    <IconButton onTouchTap={() => hashHistory.push(filter.createURL({resume: null, status: null, relation: null}))}>
                        <CloseIcon color={COLOR_GREY}/>
                    </IconButton>
                </div>
            </div>

            <div className={classes.bodyContent}>
                <div className={classes.inContent}>
                    {loading
                        ? <div className={classes.loader}>
                            <Loader size={0.75}/>
                        </div>
                        : <div className={classes.wrapper}>
                            <div className={classes.details}>
                                <ResumeDetails
                                    data={data}
                                    loading={loading}/>
                            </div>
                        </div>}
                    <Paper zDepth={4} className={classes.comments}>
                        <Tabs
                            inkBarStyle={tabStyle.ink}
                            tabItemContainerStyle={tabStyle.tabItem}
                            className={classes.tab}
                            contentContainerClassName={classes.tabContainer}>
                            {currentStatus === HR_RESUME_MEETING &&
                            <Tab label={t('Вопросник')} buttonStyle={tabStyle.button} disableTouchRipple>
                                <Field
                                    name="answers"
                                    component={ResumeQuestionsTab}
                                    questionsData={questionsData}
                                    handleSubmitResumeAnswers={handleSubmitResumeAnswers}
                                />
                            </Tab>}
                            <Tab
                                label={t('Комментарии')}
                                buttonStyle={currentStatus === HR_RESUME_MEETING
                                    ? tabStyle.button : tabStyle.customButton}
                                disableTouchRipple>
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
                            </Tab>
                        </Tabs>
                    </Paper>
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
