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
import MoreIcon from 'material-ui/svg-icons/navigation/more-vert'
import AddToList from 'material-ui/svg-icons/av/playlist-add'
import AddContent from 'material-ui/svg-icons/content/add'
import Done from 'material-ui/svg-icons/av/playlist-add-check'
import Assignment from 'material-ui/svg-icons/action/assignment'
import ArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down'
import ArrowUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up'
import Event from 'material-ui/svg-icons/action/event'
import AddNote from 'material-ui/svg-icons/editor/mode-edit'
import Delete from 'material-ui/svg-icons/action/delete'
import ChatBubble from 'material-ui/svg-icons/communication/chat-bubble'
import AddLongListDialog from './AddLongListDialog'
import ResumeDetailsDialog from './ResumeDetailsDialog'
import DateTimeCommentDialog from './DateTimeCommentDialog'
import {TextField} from '../../ReduxForm'
import t from '../../../helpers/translate'
import {
    BORDER_STYLE,
    COLOR_BLUE_GREY,
    COLOR_BLUE_LOGO,
    COLOR_DEFAULT,
    COLOR_GREY,
    COLOR_GREY_LIGHTEN,
    COLOR_WHITE,
    PADDING_STANDART
} from '../../../constants/styleConstants'
import {genderFormat} from '../../../constants/gender'
import {getYearText} from '../../../helpers/yearsToText'
import {
    APPLICATION_COMPLETED,
    HR_RESUME_LONG,
    HR_RESUME_MEETING,
    HR_RESUME_REMOVED,
    HR_RESUME_SHORT,
    ZERO
} from '../../../constants/backendConstants'
import {hashHistory} from 'react-router'
import dateFormat from '../../../helpers/dateFormat'
import {reduxForm, Field} from 'redux-form'

const CUSTOM_BOX_SHADOW = '0 1px 2px rgba(0, 0, 0, 0.1)'
const CUSTOM_BOX_SHADOW_HOVER = '0 2px 4px rgba(0, 0, 0, 0.19)'
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
            paddingTop: '30px',
            height: '100%',
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
            '& h1': {
                fontSize: '18px',
                fontWeight: '600',
                whiteSpace: 'nowrap'
            }
        },
        title: {
            padding: '20px 60px 20px 30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative'
        },
        toggle: {
            cursor: 'pointer',
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            padding: '0 18px',
            right: '0',
            top: '0',
            bottom: '0'
        },
        demands: {
            borderTop: BORDER_STYLE,
            padding: PADDING_STANDART,
            width: '100%',
            '& h2': {
                fontSize: '15px',
                fontWeight: '600',
                marginBottom: '15px'
            }
        },
        demandsList: {
            display: 'flex',
            marginBottom: '20px',
            '& h5': {
                fontSize: '13px',
                fontWeight: '600',
                marginBottom: '5px'
            },
            '& ul': {
                marginLeft: '20px',
                listStyle: 'none',
                minWidth: '200px',
                '&:first-child': {
                    marginLeft: '0'
                },
                '& li': {
                    paddingLeft: '15px',
                    lineHeight: '25px',
                    position: 'relative',
                    '&:after': {
                        content: '""',
                        position: 'absolute',
                        left: '0',
                        top: '12px',
                        background: '#a6aebc',
                        height: '2px',
                        width: '8px'
                    }
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
            '&:first-child': {paddingLeft: '30px'},
            '&:last-child': {paddingRight: '30px'},
            '&:nth-child(even)': {
                background: '#f2f5f8'
            },
            '& header': {
                background: COLOR_BLUE_LOGO,
                borderRadius: '2px',
                color: COLOR_WHITE,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
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
        countWrapper: {
            display: 'flex'
        },
        count: {
            display: 'block',
            fontWeight: 'normal',
            marginRight: '5px',
            '&:after': {
                content: '"|"',
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

        },
        interviewDay: {
            marginBottom: '40px',
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
            color: COLOR_WHITE,
            display: 'flex',
            fontSize: '14px',
            margin: '-10px -12px',
            padding: '6px 15px',
            fontWeight: '700',
            alignItems: 'center',
            justifyContent: 'center',
            background: COLOR_BLUE_GREY,
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
        createdDate: {
            color: COLOR_GREY_LIGHTEN,
            fontSize: '12px',
            fontWeight: '600'
        },
        moreButton: {
            display: 'none',
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
        resumeNoteData
    } = props

    const moveToStatus = filter.getParam('moveTo')

    const data = _.get(detailData, 'data')
    const loading = _.get(detailData, 'loading')
    const position = _.get(data, ['position', 'name'])
    const uri = _.get(data, 'filterUri')
    const isCompleted = _.get(data, 'status') === APPLICATION_COMPLETED

    const application = _.get(data, ['id'])
    const client = _.get(data, ['contact', 'client', 'name'])
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
            marginBottom: '10px'
        },
        label: {
            color: COLOR_DEFAULT,
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

    const resumeLink = (id) => {
        return hashHistory.push(filter.createURL({resume: id}))
    }
    const getResume = (list, status) => {
        return _.map(list, (item) => {
            const id = _.get(item, 'id')
            const fullName = _.get(item, 'fullName')
            const note = _.get(item, 'note')
            const time = moment(_.get(item, 'dateMeeting')).format('HH:mm')
            const createdDate = dateFormat(_.get(item, 'createdDate'))
            const isInterview = status === HR_RESUME_MEETING

            return (
                <div key={id} className={classes.resume} style={{paddingLeft: isInterview ? '15px' : 'auto'}}>
                    <div className={classes.resumeFooter}>
                        <div className={isInterview ? classes.openResumeInterview : classes.openResume} onClick={() => { resumeLink(id) }}/>
                        <div className={classes.resumeFullName}>
                            <div>{fullName}</div>
                        </div>
                        {isInterview
                            ? <div className={classes.interviewTime}>{time}</div>
                            : <div className={classes.createdDate}>{createdDate}</div>}
                        {!isCompleted && false &&
                        <div
                            className={classes.moreButtonBlock}
                            onClick={(event) => {
                                setAnchorEl(event.currentTarget)
                                setOpenActionMenu(true)
                                setCurrentStatus(status)
                                setCurrentResume(id)
                            }}
                            style={{
                                display: isCompleted ? 'none' : 'block',
                                background: id === currentResume ? '#efefef' : '#fff'}}>
                            <MoreIcon/>
                        </div>}
                    </div>
                    {note &&
                    <form className={classes.note}>
                        <ChatBubble/>
                        <Field
                            name={'note[' + id + ']'}
                            className={classes.inputField}
                            component={TextField}
                            onBlur={(event, value) => { resumeNoteData.handleEdit(id, value, currentNote) }}
                            onFocus={(event) => { updateCurrentNote(event.target.value) }}
                            fullWidth
                            multiLine
                            rows={1}
                            rowsMax={6}
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
            return (
                <div key={date} className={classes.interviewDay}>
                    <div className={classes.interviewDate}>{dateFormat(date)}</div>
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
        moveToDialog.handleOpen(currentResume, status)
        setCurrentResume(null)
        return setOpenActionMenu(false)
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
                            <h1>{t('Задание')}: {position}</h1>
                            <h1>{client}</h1>
                            <div className={classes.toggle} onClick={() => { setShowDetails(!showDetails) }}>
                                {showDetails ? <ArrowUp/> : <ArrowDown/>}
                            </div>
                        </div>
                        {showDetails &&
                        <div className={classes.demands}>
                            <h2>{t('Требования к кандидату')}</h2>
                            <div className={classes.demandsList}>
                                <ul>
                                    <li>{t('Возраст')}: <strong>{ageMin} - {getYearText(ageMax)}</strong></li>
                                    <li>{t('Пол')}: <strong>{genderFormat[sex]}</strong></li>
                                </ul>
                                <ul>
                                    <li>{t('Образование')}: <strong>{education}</strong></li>
                                    <li>{t('Знание языков')}: <strong>{_.isEmpty(languages) ? t('Не указано') : languages}</strong></li>
                                    <li>{t('Знание ПК')}: <strong>{levelPc}</strong></li>
                                </ul>
                                <ul>
                                    <li>{t('Режим работы')}: <strong>{mode}</strong></li>
                                    <li>{t('Минимальный опыт работы')}: <strong>{getYearText(experience)}</strong></li>
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
                                        <span className={classes.countClickable}>2 заверш.</span>
                                        <span className={classes.countClickable}>5 незаверш.</span>
                                    </div>
                                </div>
                                <ToolTip text={t('Вопросник')} position={'left'}>
                                    <div className={classes.add} onClick={() => { addDialog.handleOpen(uri) }}><Assignment/></div>
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
                        <div className={classes.column}>
                            <header>
                                <div>
                                    <h3>{t('Шортлист')}</h3>
                                    <div className={classes.countWrapper}>
                                        {shortListData.count > ZERO && <span className={classes.count}>{shortListData.count} {t('чел.')}</span>}
                                    </div>
                                </div>
                            </header>
                            {shortListData.loading
                                ? <div className={classes.loader}>
                                    <Loader size={0.75}/>
                                </div>
                                : <div className={classes.resumeList}>
                                    {shortListData.count > ZERO &&
                                    <FlatButton
                                        label={isCompleted ? t('Отчет') : t('Сформировать отчет')}
                                        labelStyle={flatButtonStyle.label}
                                        icon={<Done style={flatButtonStyle.icon}/>}
                                        style={flatButtonStyle.button}
                                        backgroundColor={flatButtonStyle.background}
                                        hoverColor={flatButtonStyle.background}
                                        rippleColor={COLOR_WHITE}
                                        fullWidth
                                        onClick={confirmDialog.handleOpen}
                                    />}
                                    {getResumeItem(shortListData.list, HR_RESUME_SHORT)}
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
                uri={uri}/>

            <DateTimeCommentDialog
                open={moveToDialog.open}
                onClose={moveToDialog.handleClose}
                onSubmit={moveToDialog.handleSubmit}
                status={moveToStatus}/>

            <ConfirmDialog
                open={confirmDialog.open}
                onClose={confirmDialog.handleClose}
                onSubmit={confirmDialog.handleSubmit}
                message={t('Сформировать шортлист на задание') + ' №' + application}
                type={'submit'}
                loading={false}/>

            <ResumeDetailsDialog
                loading={resumeDetails.loading}
                data={resumeDetails.data || {}}
                open={resumeDetails.open}
                filter={filter}
                createCommentLoading={resumeDetails.createCommentLoading}
                handleCreateComment={resumeDetails.handleCreateComment}
                commentsList={resumeDetails.commentsList}
                commentsLoading={resumeDetails.commentsLoading}
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
