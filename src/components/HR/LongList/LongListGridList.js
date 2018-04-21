import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import PropTypes from 'prop-types'
import Container from '../../Container'
import ConfirmDialog from '../../ConfirmDialog'
import Loader from '../../Loader'
import ToolTip from '../../ToolTip'
import Popover from 'material-ui/Popover'
import FlatButton from 'material-ui/FlatButton'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import Divider from 'material-ui/Divider'
import injectSheet from 'react-jss'
import {compose, withState} from 'recompose'
import {hashHistory, Link} from 'react-router'
import Return from 'material-ui/svg-icons/content/reply'
import MoreIcon from 'material-ui/svg-icons/navigation/more-vert'
import AddToList from 'material-ui/svg-icons/av/playlist-add'
import AddContent from 'material-ui/svg-icons/content/add'
import Done from 'material-ui/svg-icons/av/playlist-add-check'
import Clear from 'material-ui/svg-icons/content/clear'
import Report from 'material-ui/svg-icons/action/description'
import Assignment from 'material-ui/svg-icons/action/assignment'
import ArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down'
import ArrowUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up'
import Event from 'material-ui/svg-icons/action/event'
import AddNote from 'material-ui/svg-icons/editor/mode-edit'
import Send from 'material-ui/svg-icons/content/reply-all'
import Edit from 'material-ui/svg-icons/image/edit'
import Delete from 'material-ui/svg-icons/action/delete'
import ChatBubble from 'material-ui/svg-icons/communication/chat-bubble'
import AddLongListDialog from './AddLongListDialog'
import ResumeDetailsDialog from './ResumeDetailsDialog'
import DateTimeCommentDialog from './DateTimeCommentDialog'
import QuestionnaireDialog from './QuestionnaireDialog'
import ReportDialog from './ReportDialog'
import {TextField} from '../../ReduxForm'
import t from '../../../helpers/translate'
import {
    BORDER_STYLE,
    COLOR_BLUE_GREY,
    COLOR_DEFAULT,
    COLOR_GREEN,
    COLOR_GREY,
    COLOR_GREY_LIGHTEN,
    COLOR_RED,
    COLOR_WHITE,
    LINK_COLOR,
    PADDING_STANDART
} from '../../../constants/styleConstants'
import {genderFormat} from '../../../constants/gender'
import {getAppStatusName, getBackendNames, getYearText} from '../../../helpers/hrcHelpers'
import {
    HR_EDUCATION, HR_LEVEL_PC,
    HR_RESUME_LONG,
    HR_RESUME_MEETING,
    HR_RESUME_REMOVED,
    HR_RESUME_REPORT,
    HR_RESUME_SHORT, HR_WORK_SCHEDULE,
    ZERO
} from '../../../constants/backendConstants'
import dateFormat from '../../../helpers/dateFormat'
import {reduxForm, Field} from 'redux-form'
import * as ROUTES from '../../../constants/routes'
import classNames from 'classnames'

export const CUSTOM_BOX_SHADOW = '0 1px 2px rgba(0, 0, 0, 0.1)'
export const CUSTOM_BOX_SHADOW_HOVER = '0 2px 4px rgba(0, 0, 0, 0.19)'

const enhance = compose(
    injectSheet({
        loader: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '25px 0'
        },
        detailLoader: {
            background: COLOR_WHITE,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            zIndex: '2'
        },
        wrapper: {
            position: 'absolute',
            top: '0',
            bottom: '-28px',
            paddingTop: '30px',
            width: '100%'
        },
        content: {
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
        },
        header: {
            background: COLOR_WHITE,
            margin: '-30px -28px 0 -28px',
            boxShadow: CUSTOM_BOX_SHADOW,
            position: 'relative',
            zIndex: '2'
        },
        title: {
            color: COLOR_GREY,
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            height: '60px',
            width: '100%',
            '& h1': {
                fontSize: '15px',
                fontWeight: '700',
                whiteSpace: 'nowrap'
            },
            '& > div': {
                padding: '0 30px',
                width: 'calc(100% / 3)'
            }
        },
        return: {
            color: COLOR_GREY,
            display: 'flex',
            alignItems: 'center',
            borderRight: BORDER_STYLE,
            height: '100%',
            position: 'relative',
            '& svg': {
                color: COLOR_GREY + '!important',
                marginRight: '5px',
                width: 'auto',
                height: 'auto'
            }
        },
        backToTasks: {
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0'
        },
        appStatus: {

        },
        toggle: {
            height: '100%',
            position: 'relative',
            padding: '0 !important',
            borderLeft: BORDER_STYLE
        },
        toggleButton: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '0 30px',
            cursor: 'pointer',
            height: '100%',
            width: '100%',
            '& svg': {
                color: COLOR_GREY + '!important',
                marginLeft: '5px'
            }
        },
        detailOverlay: {
            background: 'black',
            position: 'fixed',
            top: '60px',
            left: '0',
            right: '0',
            bottom: '0',
            opacity: '0.5',
            zIndex: '2'
        },
        demands: {
            background: COLOR_WHITE,
            borderTop: BORDER_STYLE,
            color: COLOR_GREY,
            fontSize: '13px',
            fontWeight: 'normal',
            padding: PADDING_STANDART,
            position: 'absolute',
            top: '100%',
            left: '0',
            right: '0',
            height: 'calc(100vh - 60px)',
            zIndex: '4',
            '& h2': {
                fontSize: '15px',
                fontWeight: '700',
                marginBottom: '7px'
            }
        },
        demandsList: {
            marginBottom: '20px',
            '& h5': {
                fontSize: '13px',
                fontWeight: '600',
                marginBottom: '5px'
            },
            '& ul': {
                listStyle: 'none',
                '&:first-child': {
                    marginLeft: '0'
                },
                '& li': {
                    lineHeight: '25px'
                }
            },
            '&:last-child': {
                marginBottom: '0'
            }
        },
        tagsWrapper: {
            display: 'flex',
            flexWrap: 'wrap',
            marginBottom: '-8px'
        },
        tag: {
            background: '#e8e8e8',
            padding: '3px 10px',
            margin: '0 8px 8px 0'
        },
        lists: {
            display: 'flex',
            margin: '0 -28px',
            height: '100%'
        },
        column: {
            padding: '15px 15px 20px',
            width: 'calc(100% / 3)',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            '&:first-child': {paddingLeft: '30px'},
            '&:last-child': {paddingRight: '30px'},
            '&:nth-child(even)': {
                background: '#f2f5f8'
            },
            '& > header': {
                background: COLOR_BLUE_GREY,
                borderRadius: '2px',
                color: COLOR_WHITE,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                minHeight: '60px',
                height: '60px',
                marginBottom: '10px',
                padding: '0 30px',
                '& h3': {
                    fontSize: '14px',
                    fontWeight: '700',
                    whiteSpace: 'nowrap'
                }
            }
        },
        reportInfo: {
            background: '#f7f8f9',
            borderRadius: '2px',
            position: 'absolute',
            padding: '15px',
            top: '132px',
            right: 'calc(100% + 20px)',
            textAlign: 'center',
            width: '300px',
            '&:after': {
                position: 'absolute',
                content: '""',
                borderTop: '10px transparent solid',
                borderBottom: '10px transparent solid',
                borderLeft: '10px #f7f8f9 solid',
                right: '-10px',
                top: '15px'
            },
            '& h4': {
                fontWeight: '600',
                fontSize: '14px',
                marginBottom: '20px'
            },
            '& button:last-child': {
                marginBottom: '0 !important'
            }
        },
        overlay: {
            background: 'rgba(0, 0, 0, 0.55)',
            cursor: 'pointer',
            position: 'fixed',
            top: '0',
            right: '0',
            left: '0',
            bottom: '0',
            width: '100%',
            zIndex: '15'
        },
        brightColumn: {
            background: '#f7f8f9 !important',
            paddingRight: '15px !important',
            marginRight: '15px',
            zIndex: '20'
        },
        countWrapper: {
            display: 'flex',
            height: '18px'
        },
        count: {
            display: 'block',
            fontWeight: 'normal',
            marginRight: '5px',
            '&:after': {
                margin: '0 3px'
            },
            '&:last-child:after': {
                display: 'none'
            }
        },
        countClickable: {
            extend: 'count',
            cursor: 'pointer',
            '&:hover': {
                textDecoration: 'underline'
            }
        },
        countClickabled: {
            extend: 'countClickable',
            textDecoration: 'underline'
        },
        add: {
            cursor: 'pointer',
            height: '34px',
            marginRight: '-15px',
            padding: '0px 5px',
            borderRadius: '4px',
            transition: 'all 200ms ease',
            '& svg': {
                height: '34px !important',
                width: '34px !important',
                color: '#f2f5f8 !important'
            }
        },
        resumeList: {
            height: '100%',
            overflowY: 'auto'
        },
        reportList: {
            padding: '15px',
            border: '2px #e3e3e3 dashed',
            marginBottom: '15px',
            '& > header': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '10px',
                '& > h4': {
                    fontWeight: '700'
                },
                '& > div': {
                    display: 'flex',
                    alignItems: 'center'
                }
            }
        },
        reportButton: {
            width: '36px',
            height: '36px',
            padding: '7px',
            cursor: 'pointer',
            '& svg': {
                width: '22px !important',
                height: '22px !important',
                color: COLOR_GREY + '!important'
            }
        },
        interviewDay: {
            marginBottom: '20px',
            '&:last-child': {
                marginBottom: '0',
                '& > div:last-child:after': {
                    bottom: '0 !important'
                }
            }
        },
        interviewDate: {
            color: COLOR_GREY_LIGHTEN,
            fontWeight: '600',
            marginBottom: '10px'
        },
        interviewTime: {
            color: COLOR_GREY,
            display: 'flex',
            fontSize: '14px',
            margin: '-10px -12px',
            padding: '6px 15px',
            fontWeight: '700',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px'
        },
        resumeWrapper: {
            display: 'flex',
            alignItems: 'flex-end',
            position: 'relative',
            '& > div:last-child': {
                width: '100%'
            }
        },
        resume: {
            background: COLOR_WHITE,
            borderRadius: '2px',
            boxShadow: CUSTOM_BOX_SHADOW,
            padding: '15px 20px',
            position: 'relative',
            transition: 'all 300ms ease',
            marginBottom: '3px',
            '&:hover': {
                boxShadow: CUSTOM_BOX_SHADOW_HOVER
            },
            '&:last-child': {
                margin: '0'
            }
        },
        activeResume: {
            extend: 'resume',
            borderLeft: '4px ' + COLOR_GREEN + ' solid'
        },
        createdDate: {
            color: COLOR_GREY_LIGHTEN,
            fontSize: '12px',
            fontWeight: '600'
        },
        moreButton: {
            borderRadius: '50%',
            position: 'absolute',
            cursor: 'pointer',
            top: '15px',
            right: '12px',
            width: '30px',
            height: '30px',
            padding: '5px',
            zIndex: '2',
            transition: 'all 200ms ease',
            '& svg': {
                height: '20px !important',
                width: '20px !important',
                color: COLOR_GREY + '!important'
            }
        },
        moreButtonBlock: {
            extend: 'moreButton',
            position: 'unset'
        },
        resumeBody: {
            '& h4': {
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '10px'
            }
        },
        resumeInfo: {
            color: COLOR_GREY,
            lineHeight: '18px',
            '& > div': {
                fontWeight: '600',
                marginBottom: '5px',
                '&:last-child': {
                    marginBottom: '0'
                }
            }
        },
        resumeFooter: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative'
        },
        openResume: {
            cursor: 'pointer',
            position: 'absolute',
            top: '-15px',
            left: '-20px',
            right: '-20px',
            bottom: '-15px',
            zIndex: '1'
        },
        openResumeInterview: {
            extend: 'openResume',
            left: '-15px',
            right: '-20px'
        },
        resumeFullName: {
            color: COLOR_GREY,
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            '&:after': {
                content: '""',
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0'
            },
            '& img': {
                width: '35px',
                height: '35px',
                borderRadius: '50%',
                marginRight: '10px'
            }
        },
        note: {
            marginTop: '15px',
            display: 'flex',
            '& svg': {
                color: COLOR_GREY_LIGHTEN + '!important',
                marginTop: '5px',
                width: '22px !important',
                height: '22px !important',
                minWidth: '22px'
            }
        },
        inputField: {
            color: COLOR_DEFAULT,
            marginLeft: '10px',
            lineHeight: '20px !important',
            background: '#f9f9f9 !important',
            borderRadius: '6px',
            padding: '10px 12px',
            position: 'relative',
            '&:after': {
                content: '""',
                position: 'absolute',
                left: '-9px',
                top: '6px',
                borderRight: '10px #f9f9f9 solid',
                borderTop: '10px transparent solid',
                borderBottom: '10px transparent solid'
            },
            '& textarea': {
                marginTop: '0 !important'
            },
            '& hr': {
                display: 'none !important'
            }
        },
        resumeAge: {
            color: '#a6aebc',
            fontWeight: '600'
        },
        block: {
            display: 'block !important'
        },
        popover: {
            '& svg': {
                margin: '8px 16px !important',
                width: '20px !important',
                height: '20px !important'
            }
        }
    }),
    reduxForm({
        form: 'ResumeItemForm',
        enableReinitialize: true
    }),
    withState('showDetails', 'setShowDetails', false),
    withState('anchorEl', 'setAnchorEl', null),
    withState('currentResume', 'setCurrentResume', null),
    withState('currentStatus', 'setCurrentStatus', ''),
    withState('openActionMenu', 'setOpenActionMenu', false),
    withState('currentNote', 'updateCurrentNote', ''),

    withState('openAddReport', 'setOpenAddReport', false),
    withState('checkedList', 'updateCheckedList', []),
    withState('finishConfirmDialog', 'setFinishConfirmDialog', false)
)

const LongListGridList = enhance((props) => {
    const {
        filter,
        detailData,
        classes,
        addDialog,
        moveToDialog,
        filterDialog,
        anchorEl,
        setAnchorEl,
        openActionMenu,
        setOpenActionMenu,
        longListData,
        meetingListData,
        shortListData,
        reportListData,
        currentResume,
        setCurrentResume,
        currentStatus,
        setCurrentStatus,
        showDetails,
        setShowDetails,
        confirmDialog,
        resumeDetails,
        currentNote,
        updateCurrentNote,
        resumeNoteData,
        questionsDialog,
        openAddReport,
        setOpenAddReport,
        checkedList,
        updateCheckedList,
        reportDialog,
        editReportDialog,
        deleteReportDialog,
        answersData,
        questionsData,
        handleGetPreviewReport,
        editResumeDetails,
        setFinishConfirmDialog,
        finishConfirmDialog,
        appCount,
        pathname
    } = props

    const moveToStatus = filter.getParam('moveTo')
    const complete = (filter.getParam('completed'))
    const data = _.get(detailData, 'data')
    const loading = _.get(detailData, 'loading')
    const position = _.get(data, ['position', 'name'])
    const uri = _.get(data, 'filterUri')
    const applicationStatus = _.get(data, 'status')
    const application = _.get(data, ['id'])
    const client = _.get(data, ['contact', 'client', 'name'])
    const contact = _.get(data, ['contact', 'name'])
    const contactPhone = _.get(data, ['contact', 'telephone'])
    const contactEmail = _.get(data, ['contact', 'email'])

    const ageMin = _.get(data, ['ageMin'])
    const ageMax = _.get(data, ['ageMax'])
    const sex = _.get(data, ['sex'])
    const education = _.get(data, ['education'])
    const levelPc = _.get(data, ['levelPc'])
    const experience = _.get(data, ['experience'])
    const languages = _.map(_.get(data, ['languages']), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, ['language', 'name'])
        const level = _.get(item, ['level', 'name'])
        return <span key={id}>{name} {level && <span>({level})</span>}</span>
    })
    const skills = _.map(_.get(data, ['skills']), (item) => {
        return (
            <span className={classes.tag}>{_.get(item, 'name')}</span>
        )
    })

    const mode = _.get(data, ['mode'])
    const responsibility = _.get(data, ['responsibility'])
    const privileges = _.map(_.get(data, ['privileges']), (item) => _.get(item, 'name'))

    const checkedAllResumes = _.map(shortListData.list, (item) => _.get(item, 'id'))
    const reportListIds = _.map(reportListData.list, (item) => _.get(item, 'id'))

    const popoverStyle = {
        menuItem: {
            fontSize: '13px',
            minHeight: '36px',
            lineHeight: '36px'
        },
        innerDiv: {
            padding: '0px 16px 0px 60px'
        }
    }

    const flatButtonStyle = {
        background: '#dadada',
        button: {
            marginBottom: '10px',
            minHeight: '36px'
        },
        label: {
            color: COLOR_DEFAULT,
            textTransform: 'none',
            verticalAlign: 'baseline',
            fontWeight: '600'
        },
        labelWhite: {
            color: COLOR_WHITE,
            textTransform: 'none',
            verticalAlign: 'baseline',
            fontWeight: '600'
        },
        icon: {
            fill: COLOR_DEFAULT,
            width: '20px',
            height: '20px',
            verticalAlign: 'text-top'
        }
    }

    const resumeLink = (id, status, relation) => {
        return hashHistory.push(filter.createURL({resume: id, status: status, relation: relation}))
    }
    const meetingFilter = (completed) => {
        return hashHistory.push({pathname, query: filter.getParams({completed})})
    }
    const getResume = (list, status) => {
        return _.map(list, (item) => {
            const id = _.get(item, 'id')
            const relationId = _.get(item, 'relationId')
            const fullName = _.get(item, 'fullName')
            const note = _.get(item, 'note')
            const date = moment(_.get(item, 'dateMeeting')).format('YYYY-MM-DD')
            const time = moment(_.get(item, 'dateMeeting')).format('HH:mm')
            const createdDate = dateFormat(_.get(item, 'dateUpdate'))
            const isInterview = status === HR_RESUME_MEETING

            const updatedList = _.uniq(_.concat(checkedList, id))
            const isActive = _.includes(checkedList, id) && openAddReport

            return (
                <div
                    key={id}
                    className={isActive ? classes.activeResume : classes.resume}
                    style={{paddingLeft: isInterview ? '15px' : 'auto', cursor: openAddReport ? 'pointer' : 'auto'}}
                    onClick={() => {
                        openAddReport
                        ? isActive
                            ? updateCheckedList(_.pull(updatedList, id))
                            : updateCheckedList(updatedList)
                        : null
                    }}>
                    <div className={classes.resumeFooter}>
                        {!openAddReport &&
                        <div
                            className={isInterview ? classes.openResumeInterview : classes.openResume}
                            onClick={() => {
                                resumeLink(id, status, relationId)
                            }}/>}
                        <div className={classes.resumeFullName}>
                            <div>{fullName}</div>
                        </div>
                        {isInterview
                            ? <div className={classes.interviewTime}>{time}</div>
                            : <div className={classes.createdDate}>{createdDate}</div>}
                        {false &&
                        <div
                            className={classes.moreButtonBlock}
                            onClick={(event) => {
                                setAnchorEl(event.currentTarget)
                                setOpenActionMenu(true)
                                setCurrentStatus(status)
                                setCurrentResume(id)
                            }}
                            style={{background: id === currentResume ? '#efefef' : '#fff'}}>
                            <MoreIcon/>
                        </div>}
                    </div>
                    {note && !isActive && status !== HR_RESUME_REPORT &&
                    <form className={classes.note}>
                        <ChatBubble/>
                        <Field
                            name={'note[' + id + ']'}
                            className={classes.inputField}
                            component={TextField}
                            onBlur={(event, value) => { resumeNoteData.handleEdit(id, value, currentNote, status, {date, time}) }}
                            onFocus={(event) => { updateCurrentNote(event.target.value) }}
                            fullWidth
                            multiLine
                            rows={1}
                            rowsMax={99}
                        />
                    </form>}
                </div>
            )
        })
    }

    const getResumeItem = (list, status) => {
        const groupByDate = _.groupBy(list, (item) => {
            const dateMeeting = _.get(item, 'dateMeeting')
            return moment(dateMeeting).format('YYYY-MM-DD')
        })
        const interviewList = _.map(groupByDate, (item, date) => {
            const dayOutput = () => {
                const TOMORROW = 1
                if (date === moment().format('YYYY-MM-DD')) {
                    return 'Сегодня'
                }
                if (date === moment().add(TOMORROW, 'days').format('YYYY-MM-DD')) {
                    return 'Завтра'
                }
                return dateFormat(date)
            }
            return (
                <div key={date} className={classes.interviewDay}>
                    <div className={classes.interviewDate}>{dayOutput()}</div>
                    {getResume(item, HR_RESUME_MEETING)}
                </div>
            )
        })
        if (status === HR_RESUME_MEETING) {
            return interviewList
        }
        return getResume(list, status)
    }

    const handleClickMenuItem = (status) => {
        return moveToDialog.handleOpen(status)
    }

    const getPopoverMenus = () => {
        switch (currentStatus) {
            case HR_RESUME_LONG: return (
                <Menu>
                    <MenuItem
                        style={popoverStyle.menuItem}
                        innerDivStyle={popoverStyle.innerDiv}
                        leftIcon={<Event/>}
                        onTouchTap={() => { handleClickMenuItem(HR_RESUME_MEETING) }}
                        primaryText={t('Назначить собеседование')}/>
                    <MenuItem
                        style={popoverStyle.menuItem}
                        innerDivStyle={popoverStyle.innerDiv}
                        leftIcon={<AddToList/>}
                        onTouchTap={() => { handleClickMenuItem(HR_RESUME_SHORT) }}
                        primaryText={t('Добавить в шортлист')}/>
                    <MenuItem
                        style={popoverStyle.menuItem}
                        innerDivStyle={popoverStyle.innerDiv}
                        leftIcon={<AddNote/>}
                        primaryText={t('Добавить заметку')}/>
                    <Divider/>
                    <MenuItem
                        style={popoverStyle.menuItem}
                        innerDivStyle={popoverStyle.innerDiv}
                        leftIcon={<Delete/>}
                        onTouchTap={() => { handleClickMenuItem(HR_RESUME_REMOVED) }}
                        primaryText={t('Удалить со списка')}/>
                </Menu>
            )
            case HR_RESUME_MEETING: return (
                <Menu>
                    <MenuItem
                        style={popoverStyle.menuItem}
                        innerDivStyle={popoverStyle.innerDiv}
                        leftIcon={<AddToList/>}
                        onTouchTap={() => { handleClickMenuItem(HR_RESUME_SHORT) }}
                        primaryText={t('Добавить в шортлист')}/>
                    <MenuItem
                        style={popoverStyle.menuItem}
                        innerDivStyle={popoverStyle.innerDiv}
                        leftIcon={<Delete/>}
                        onTouchTap={() => { handleClickMenuItem(HR_RESUME_REMOVED) }}
                        primaryText={t('Удалить со списка')}/>
                </Menu>
            )
            case HR_RESUME_SHORT: return (
                <Menu>
                    <MenuItem
                        style={popoverStyle.menuItem}
                        innerDivStyle={popoverStyle.innerDiv}
                        leftIcon={<Delete/>}
                        onTouchTap={() => { handleClickMenuItem(HR_RESUME_REMOVED) }}
                        primaryText={t('Удалить со списка')}/>
                </Menu>
            )
            default: return null
        }
    }

    return (
        <Container>
            <div className={classes.wrapper}>
                <div className={classes.content}>
                    <div className={classes.header}>
                        {loading && <div className={classes.detailLoader}>
                            <Loader size={0.75}/>
                        </div>}
                        <div className={classes.title}>
                            <div className={classes.return}>
                                <Return/>
                                <h1>{t('Задания')} <span style={{margin: '0 5px'}}>|</span> {position}</h1>
                                <Link to={{pathname: ROUTES.HR_TASKS_LIST_URL}} className={classes.backToTasks}/>
                            </div>
                            <div className={classes.appStatus}>{t('Статус')}: {getAppStatusName(applicationStatus, true)}</div>
                            <div className={classes.toggle}>
                                <div className={classes.toggleButton} onClick={() => { setShowDetails(!showDetails) }}>
                                    <span>{t('Детали')}</span>
                                    {showDetails ? <ArrowUp/> : <ArrowDown/>}
                                </div>
                                {showDetails && <div className={classes.detailOverlay}/>}
                                {showDetails &&
                                <div className={classes.demands}>
                                    <h2>{t('Описание компании')}</h2>
                                    <div className={classes.demandsList}>
                                        <ul>
                                            <li>{t('Клиент')}: {client}</li>
                                            <li>{t('Контактное лицо')}: {contact}</li>
                                            <li>{t('Телефон')}: {contactPhone}</li>
                                            <li>{t('Email')}: {contactEmail}</li>
                                        </ul>
                                    </div>
                                    <h2>{t('Требования к кандидату')}</h2>
                                    <div className={classes.demandsList}>
                                        <ul>
                                            <li>{t('Возраст')}: {ageMin} - {getYearText(ageMax)}</li>
                                            <li>{t('Пол')}: {genderFormat[sex]}</li>
                                        </ul>
                                        <ul>
                                            <li>{t('Образование')}: {getBackendNames(HR_EDUCATION, education)}</li>
                                            <li>{t('Знание языков')}: {_.isEmpty(languages) ? t('Не указано') : languages}</li>
                                            <li>{t('Знание ПК')}: {getBackendNames(HR_LEVEL_PC, levelPc)}</li>
                                        </ul>
                                        <ul>
                                            <li>{t('Режим работы')}: {getBackendNames(HR_WORK_SCHEDULE, mode)}</li>
                                            <li>{t('Минимальный опыт работы')}: {getYearText(experience)}</li>
                                        </ul>
                                    </div>
                                    <div className={classes.demandsList + ' ' + classes.block}>
                                        <h5>{t('Функциональные обязанности')}</h5>
                                        <div>{responsibility}</div>
                                    </div>
                                    <div className={classes.demandsList + ' ' + classes.block}>
                                        <h5>{t('Социальный пакет')}</h5>
                                        <div>{_.join(privileges, ', ') || t('Не указан')}</div>
                                    </div>
                                    <div className={classes.demandsList + ' ' + classes.block}>
                                        <h5>{t('Профессиональные навыки')}</h5>
                                        <div className={classes.tagsWrapper}>{skills}</div>
                                    </div>
                                </div>}
                            </div>
                        </div>
                    </div>
                    <div className={classes.lists}>
                        <div className={classes.column}>
                            <header>
                                <div>
                                    <h3>{t('Лонглист')}</h3>
                                    <div className={classes.countWrapper}>
                                        {longListData.count > ZERO && <span className={classes.count}>{longListData.count} {t('чел.')}</span>}
                                    </div>
                                </div>
                            </header>
                            {longListData.loading
                                ? <div className={classes.loader}>
                                    <Loader size={0.75}/>
                                </div>
                                : <div className={classes.resumeList}>
                                    <FlatButton
                                        label={t('Добавить в список')}
                                        labelStyle={flatButtonStyle.label}
                                        icon={<AddContent style={flatButtonStyle.icon}/>}
                                        style={flatButtonStyle.button}
                                        backgroundColor={flatButtonStyle.background}
                                        hoverColor={flatButtonStyle.background}
                                        rippleColor={COLOR_WHITE}
                                        fullWidth
                                        onClick={() => { addDialog.handleOpen(uri) }}
                                    />
                                    {getResumeItem(longListData.list, HR_RESUME_LONG)}
                                </div>}
                        </div>
                        <div className={classes.column}>
                            <header>
                                <div>
                                    <h3>{t('Собеседования')}</h3>
                                    <div className={classes.countWrapper}>
                                        <span onClick={() => meetingFilter(true)} className={classNames({[classes.countClickable]: true, [classes.countClickabled]: complete === 'true'})}>{_.get(appCount, 'completed')} {t('заверш.')}</span> | &nbsp;
                                        <span onClick={() => meetingFilter(false)} className={classNames({[classes.countClickable]: true, [classes.countClickabled]: complete === 'false'})}> {_.get(appCount, 'notCompleted')} {t('незаверш.')}</span>
                                        {(complete === 'false' || complete === 'true') && <span style={{cursor: 'pointer'}} onClick={() => meetingFilter(null)}><Clear style={{color: '#fff', height: '18px', width: '18px'}}/></span>}
                                    </div>
                                </div>
                                <ToolTip text={t('Вопросник')} position={'left'}>
                                    <div className={classes.add} onClick={() => { questionsDialog.handleOpen() }}><Assignment/></div>
                                </ToolTip>
                            </header>
                            {meetingListData.loading
                                ? <div className={classes.loader}>
                                    <Loader size={0.75}/>
                                </div>
                                : <div className={classes.resumeList}>
                                    {getResumeItem(meetingListData.list, HR_RESUME_MEETING)}
                                </div>}
                        </div>
                        {openAddReport && <div className={classes.overlay} onClick={() => { setOpenAddReport(false) }}/>}
                        <div className={classes.column + ' ' + (openAddReport ? classes.brightColumn : '')}>
                            <header>
                                <div>
                                    <h3>{t('Шортлист')}</h3>
                                    <div className={classes.countWrapper}>
                                        {shortListData.count > ZERO && <span className={classes.count}>{shortListData.count} {t('чел.')}</span>}
                                    </div>
                                </div>
                            </header>
                            {shortListData.count > ZERO && reportListData.count === ZERO &&
                            <FlatButton
                                label={t('Сформировать отчет')}
                                labelStyle={flatButtonStyle.label}
                                icon={<Done style={flatButtonStyle.icon}/>}
                                style={flatButtonStyle.button}
                                backgroundColor={flatButtonStyle.background}
                                hoverColor={flatButtonStyle.background}
                                rippleColor={COLOR_WHITE}
                                fullWidth
                                onClick={() => { setOpenAddReport(true) }}
                            />}
                            <div className={classes.resumeList}>
                                {reportListData.loading
                                    ? <div className={classes.loader}>
                                        <Loader size={0.75}/>
                                    </div>
                                    : reportListData.count > ZERO && !openAddReport &&
                                    <div className={classes.reportList}>
                                        <header>
                                            <h4>{t('Отчет')} ({reportListData.count + ' ' + t('чел.')})</h4>
                                            <div>
                                                <ToolTip text={t('Скачать отчет')} position={'bottom'}>
                                                    <div className={classes.reportButton} onClick={() => handleGetPreviewReport()}>
                                                        <Report/>
                                                    </div>
                                                </ToolTip>
                                                <ToolTip text={t('Отправить')} position={'bottom'}>
                                                    <div className={classes.reportButton} onClick={confirmDialog.handleOpen}>
                                                        <Send/>
                                                    </div>
                                                </ToolTip>
                                                <ToolTip text={t('Изменить')} position={'bottom'}>
                                                    <div className={classes.reportButton} onClick={editReportDialog.handleOpen}>
                                                        <Edit/>
                                                    </div>
                                                </ToolTip>
                                                <ToolTip text={t('Удалить')} position={'bottom'}>
                                                    <div className={classes.reportButton} onClick={deleteReportDialog.handleOpen}>
                                                        <Delete/>
                                                    </div>
                                                </ToolTip>
                                            </div>
                                        </header>
                                        {getResumeItem(reportListData.list, HR_RESUME_REPORT)}
                                    </div>}
                                {shortListData.loading
                                    ? <div className={classes.loader}>
                                        <Loader size={0.75}/>
                                    </div>
                                    : getResumeItem(shortListData.list, HR_RESUME_SHORT)}
                            </div>
                            {openAddReport &&
                            <div className={classes.reportInfo}>
                                <h4>{t('Выберите из списка резюме для формирования отчета')}</h4>
                                <FlatButton
                                    label={_.isEqual(checkedList, checkedAllResumes) ? t('Снять все') : t('Выбрать все')}
                                    labelStyle={flatButtonStyle.labelWhite}
                                    style={flatButtonStyle.button}
                                    backgroundColor={_.isEqual(checkedList, checkedAllResumes) ? COLOR_RED : COLOR_GREEN}
                                    hoverColor={_.isEqual(checkedList, checkedAllResumes) ? COLOR_RED : COLOR_GREEN}
                                    rippleColor={COLOR_WHITE}
                                    fullWidth
                                    onClick={() => {
                                        _.isEqual(checkedList, checkedAllResumes)
                                        ? updateCheckedList([])
                                        : updateCheckedList(checkedAllResumes)
                                    }}/>
                                {!_.isEmpty(checkedList) &&
                                <FlatButton
                                    label={t('Сохранить')}
                                    labelStyle={flatButtonStyle.labelWhite}
                                    style={flatButtonStyle.button}
                                    backgroundColor={LINK_COLOR}
                                    hoverColor={LINK_COLOR}
                                    rippleColor={COLOR_WHITE}
                                    fullWidth
                                    onClick={() => {
                                        shortListData.handleSubmitReport(checkedList)
                                            .then(() => {
                                                setOpenAddReport(false)
                                                updateCheckedList([])
                                            })
                                    }}
                                />}
                            </div>}
                        </div>
                    </div>
                </div>
            </div>

            {!_.isNull(getPopoverMenus()) &&
            <Popover
                open={openActionMenu}
                className={classes.popover}
                anchorEl={anchorEl}
                anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                onRequestClose={() => {
                    setOpenActionMenu(false)
                    setCurrentResume(null)
                }}>
                {getPopoverMenus()}
            </Popover>}

            <AddLongListDialog
                open={addDialog.open}
                onClose={addDialog.handleClose}
                onSubmit={addDialog.handleSubmit}
                filter={filter}
                filterDialog={filterDialog}
                loading={false}
                resumePreview={addDialog.resumePreview}
                uri={uri}
                resumeLink={resumeLink}/>

            <DateTimeCommentDialog
                initialValues={moveToDialog.initialValues}
                open={moveToDialog.open}
                onClose={moveToDialog.handleClose}
                onSubmit={moveToDialog.handleSubmit}
                status={moveToStatus}/>

            <ConfirmDialog
                open={confirmDialog.open}
                onClose={confirmDialog.handleClose}
                onSubmit={confirmDialog.handleSubmit}
                message={t('Отправить отчет на задание') + ' №' + application}
                type={'submit'}
                loading={false}/>

            <ConfirmDialog
                open={finishConfirmDialog}
                onClose={() => setFinishConfirmDialog(false)}
                onSubmit={() => {
                    resumeDetails.handleSubmitCompleteMeetingDialog()
                    setFinishConfirmDialog(false)
                }}
                message={t('Завершить собеседование с ') + _.get(resumeDetails, ['data', 'fullName'])}
                type={'submit'}
                loading={false}/>

            <ConfirmDialog
                open={deleteReportDialog.open}
                onClose={deleteReportDialog.handleClose}
                onSubmit={() => { deleteReportDialog.handleSubmit(reportListIds) }}
                type={'delete'}
                loading={false}/>

            <ResumeDetailsDialog
                loading={resumeDetails.loading}
                data={resumeDetails.data || {}}
                application={data}
                open={resumeDetails.open}
                filter={filter}
                editResumeDetails={editResumeDetails}
                createCommentLoading={resumeDetails.createCommentLoading}
                handleCreateComment={resumeDetails.handleCreateComment}
                handleSubmitResumeAnswers={resumeDetails.handleSubmitResumeAnswers}
                commentsList={resumeDetails.commentsList}
                appLogs={resumeDetails.appLogs}
                commentsLoading={resumeDetails.commentsLoading}
                handleClickButton={handleClickMenuItem}
                answersData={answersData}
                questionsData={questionsData}
                setFinishConfirmDialog={setFinishConfirmDialog}
                initialValues={resumeDetails.initialValues}/>

            <QuestionnaireDialog
                open={questionsDialog.open}
                onClose={questionsDialog.handleClose}
                onSubmit={questionsDialog.handleSubmit}
                initialValues={questionsDialog.initialValues}/>

            <ReportDialog
                open={reportDialog.open}
                onClose={reportDialog.handleClose}
                onSubmit={reportDialog.handleSubmit}/>

            <ReportDialog
                isUpdate
                open={editReportDialog.open}
                onClose={editReportDialog.handleClose}
                onSubmit={editReportDialog.handleSubmit}
                reportList={_.clone(reportListData.list)}
                shortList={_.clone(shortListData.list)}
            />
        </Container>
    )
})

LongListGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object
}

export default LongListGridList
