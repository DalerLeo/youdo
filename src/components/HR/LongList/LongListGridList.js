import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import PropTypes from 'prop-types'
import Container from '../../Container'
import Loader from '../../Loader'
import Popover from 'material-ui/Popover'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import injectSheet from 'react-jss'
import {compose, withState} from 'recompose'
import MoreIcon from 'material-ui/svg-icons/navigation/more-vert'
import Add from 'material-ui/svg-icons/content/add'
import ArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down'
import ArrowUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up'
import AddLongListDialog from './AddLongListDialog'
import DateTimeCommentDialog from './DateTimeCommentDialog'
import t from '../../../helpers/translate'
import {
    BORDER_STYLE,
    COLOR_DEFAULT,
    COLOR_GREY,
    COLOR_WHITE,
    PADDING_STANDART
} from '../../../constants/styleConstants'
import {genderFormat} from '../../../constants/gender'
import {getYearText} from '../../../helpers/yearsToText'
import Person from '../../Images/person.png'
import {
    HR_RESUME_LONG,
    HR_RESUME_MEETING,
    HR_RESUME_REMOVED,
    HR_RESUME_SHORT,
    ZERO
} from '../../../constants/backendConstants'

const CUSTOM_BOX_SHADOW = '0 1px 2px rgba(0, 0, 0, 0.1)'
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
            height: '100%'
        },
        header: {
            background: COLOR_WHITE,
            marginBottom: '30px',
            boxShadow: CUSTOM_BOX_SHADOW,
            position: 'relative',
            '& h1': {
                fontSize: '18px',
                fontWeight: '600',
                whiteSpace: 'nowrap'
            },
            '& > div': {
                padding: PADDING_STANDART
            }
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
                    color: COLOR_GREY,
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
            '& > div': {
                marginRight: '30px',
                width: 'calc(100% / 3)',
                '&:last-child': {
                    margin: '0'
                }
            }
        },
        column: {
            '& header': {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: '30px',
                marginBottom: '10px',
                '& h3': {
                    color: COLOR_DEFAULT,
                    fontSize: '14px',
                    fontWeight: '600',
                    whiteSpace: 'nowrap',
                    '& .count': {
                        background: '#eceff2',
                        padding: '3px 7px',
                        marginLeft: '5px',
                        borderRadius: '20px'
                    }
                }
            }
        },
        add: {
            background: '#eceff2',
            cursor: 'pointer',
            height: '26px',
            width: '36px',
            padding: '3px 8px',
            borderRadius: '4px',
            transition: 'all 200ms ease',
            '& svg': {
                height: '20px !important',
                width: '20px !important',
                color: '#5d6474 !important'
            },
            '&:hover': {
                background: '#e7e8ea',
                '& svg': {
                    opacity: '1'
                }
            }
        },
        resumeList: {

        },
        resume: {
            background: 'rgba(255,255,255, 0.5)',
            borderRadius: '2px',
            boxShadow: CUSTOM_BOX_SHADOW,
            cursor: 'pointer',
            padding: PADDING_STANDART,
            position: 'relative',
            transition: 'all 200ms ease',
            marginBottom: '3px',
            '&:hover': {
                background: COLOR_WHITE
            },
            '&:last-child': {
                margin: '0'
            }
        },
        moreButton: {
            position: 'absolute',
            cursor: 'pointer',
            top: '15px',
            right: '12px',
            '& svg': {
                height: '22px !important',
                width: '22px !important',
                color: COLOR_GREY + '!important'
            }
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
            marginTop: '15px'
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
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                marginRight: '10px'
            }
        },
        resumeAge: {
            color: '#a6aebc',
            fontWeight: '600'
        },
        block: {
            display: 'block !important'
        }
    }),
    withState('showDetails', 'setShowDetails', false),
    withState('anchorEl', 'setAnchorEl', null),
    withState('currentResume', 'setCurrentResume', null),
    withState('currentStatus', 'setCurrentStatus', ''),
    withState('openActionMenu', 'setOpenActionMenu', false),
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
        setShowDetails
    } = props

    const moveToStatus = filter.getParam('moveTo')

    const data = _.get(detailData, 'data')
    const loading = _.get(detailData, 'loading')
    const position = _.get(data, ['position', 'name'])
    const uri = _.get(data, 'filterUri')

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
            minHeight: '35px',
            lineHeight: '35px'
        }
    }

    const getResumeItem = (list, status) => {
        return _.map(list, (item) => {
            const id = _.get(item, 'id')
            const fullName = _.get(item, 'fullName')
            const dateOfBirth = moment(_.get(item, 'dateOfBirth')).format('YYYY-MM-DD')
            const age = moment().diff(dateOfBirth, 'years')
            const resumePosition = _.get(item, ['position', 'name'])
            return (
                <div key={id} className={classes.resume}>
                    <div className={classes.moreButton}>
                        <MoreIcon onTouchTap={(event) => {
                            setAnchorEl(event.currentTarget)
                            setOpenActionMenu(true)
                            setCurrentStatus(status)
                            setCurrentResume(id)
                        }}/>
                    </div>
                    <div className={classes.resumeBody}>
                        <h4>{resumePosition}</h4>
                        <div className={classes.resumeInfo}>
                            <div>Опыт работы: 2 года и 8 месяцев</div>
                        </div>
                    </div>
                    <div className={classes.resumeFooter}>
                        <div className={classes.resumeFullName}>
                            <img src={Person} alt=""/>
                            <span>{fullName}</span>
                        </div>
                        <div className={classes.resumeAge}>{getYearText(age)}</div>
                    </div>
                </div>
            )
        })
    }

    const getPopoverMenus = () => {
        switch (currentStatus) {
            case HR_RESUME_LONG: return (
                <Menu>
                    <MenuItem
                        style={popoverStyle.menuItem}
                        onTouchTap={() => {
                            moveToDialog.handleOpen(currentResume, HR_RESUME_MEETING)
                            return setOpenActionMenu(false)
                        }}
                        primaryText={t('Назначить собеседование')}/>
                    <MenuItem
                        style={popoverStyle.menuItem}
                        onTouchTap={() => {
                            moveToDialog.handleOpen(currentResume, HR_RESUME_SHORT)
                            return setOpenActionMenu(false)
                        }}
                        primaryText={t('Добавить в "short list"')}/>
                    <MenuItem
                        style={popoverStyle.menuItem}
                        onTouchTap={() => {
                            moveToDialog.handleOpen(currentResume, HR_RESUME_REMOVED)
                            return setOpenActionMenu(false)
                        }}
                        primaryText={t('Удалить и лонг листа')}/>
                </Menu>
            )
            case HR_RESUME_MEETING: return null
            case HR_RESUME_SHORT: return null
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
                            <h1>{t('Задание')} №{application} {position}</h1>
                            <h1>{}</h1>
                        </div>
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
                        </div>
                    </div>
                    <div className={classes.lists}>
                        <div className={classes.column}>
                            <header>
                                <h3>Long list {longListData.count > ZERO && <span className={'count'}>{longListData.count}</span>}</h3>
                                <div className={classes.add} onClick={() => { addDialog.handleOpen(uri) }}><Add/></div>
                            </header>
                            {longListData.loading
                                ? <div className={classes.loader}>
                                    <Loader size={0.75}/>
                                </div>
                                : <div className={classes.resumeList}>
                                    {getResumeItem(longListData.list, HR_RESUME_LONG)}
                                </div>}
                        </div>
                        <div className={classes.column}>
                            <header>
                                <h3>Interview {meetingListData.count > ZERO && <span className={'count'}>{meetingListData.count}</span>}</h3>
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
                                <h3>Short list {shortListData.count > ZERO && <span className={'count'}>{shortListData.count}</span>}</h3>
                            </header>
                            {shortListData.loading
                                ? <div className={classes.loader}>
                                    <Loader size={0.75}/>
                                </div>
                                : <div className={classes.resumeList}>
                                    {getResumeItem(shortListData.list, HR_RESUME_SHORT)}
                                </div>}
                        </div>
                    </div>
                </div>
            </div>

            {!_.isNull(getPopoverMenus()) &&
            <Popover
                open={openActionMenu}
                anchorEl={anchorEl}
                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                onRequestClose={() => { setOpenActionMenu(false) }}>
                {getPopoverMenus()}
            </Popover>}

            <AddLongListDialog
                open={addDialog.open}
                onClose={addDialog.handleClose}
                onSubmit={addDialog.handleSubmit}
                filter={filter}
                filterDialog={filterDialog}
                loading={addDialog.loading}
                resumePreview={addDialog.resumePreview}
                uri={uri}
            />
            <DateTimeCommentDialog
                open={moveToDialog.open}
                onClose={moveToDialog.handleClose}
                onSubmit={moveToDialog.handleSubmit}
                status={moveToStatus}
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
