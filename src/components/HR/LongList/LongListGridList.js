import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import PropTypes from 'prop-types'
import * as ROUTES from '../../../constants/routes'
import sprintf from 'sprintf'
import Container from '../../Container'
import Loader from '../../Loader'
import IconButton from 'material-ui/IconButton'
import Paper from 'material-ui/Paper'
import Popover from 'material-ui/Popover'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import injectSheet from 'react-jss'
import {compose, withState} from 'recompose'
import MoreIcon from 'material-ui/svg-icons/navigation/more-vert'
import Add from 'material-ui/svg-icons/content/add'
import AddLongListDialog from './AddLongListDialog'
import CalendarCreated from 'material-ui/svg-icons/notification/event-available'
import ToolTip from '../../ToolTip'
import {hashHistory, Link} from 'react-router'
import dateFormat from '../../../helpers/dateFormat'
import t from '../../../helpers/translate'
import {
    BORDER_STYLE,
    COLOR_DEFAULT,
    COLOR_GREY,
    COLOR_GREY_LIGHTEN,
    COLOR_WHITE,
    LINK_COLOR,
    PADDING_STANDART
} from '../../../constants/styleConstants'
import {genderFormat} from '../../../constants/gender'
import {getYearText} from '../../../helpers/yearsToText'
import Person from '../../Images/person.png'
import {ZERO} from '../../../constants/backendConstants'

const enhance = compose(
    injectSheet({
        loader: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '25px 0'
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
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '20px',
            '& h1': {
                fontSize: '18px',
                fontWeight: '600',
                padding: '20px 30px',
                whiteSpace: 'nowrap'
            }
        },
        demands: {
            padding: PADDING_STANDART,
            borderLeft: BORDER_STYLE,
            width: '100%',
            '& h2': {
                fontSize: '15px',
                fontWeight: '600',
                marginBottom: '10px',
                textAlign: 'right'
            }
        },
        demandsList: {
            display: 'flex',
            justifyContent: 'flex-end',
            '& ul': {
                marginLeft: '20px',
                listStyle: 'disc inside',
                '&:first-child': {
                    marginLeft: '0'
                },
                '& li': {
                    lineHeight: '25px'
                }
            }
        },
        lists: {
            display: 'flex',
            '& > div': {
                padding: PADDING_STANDART,
                width: 'calc(100% / 3)'
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
                    color: '#a6aebc',
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
            height: '36px',
            width: '36px',
            padding: '7px',
            borderRadius: '50%',
            transition: 'all 200ms ease',
            '& svg': {
                height: '22px !important',
                width: '22px !important',
                color: '#a6aebc !important',
                opacity: '0.6'
            },
            '&:hover': {
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
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
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
        }
    }),
    withState('anchorEl', 'setAnchorEl', null),
    withState('openActionMenu', 'setOpenActionMenu', false),
)

const LongListGridList = enhance((props) => {
    const {
        filter,
        detailData,
        classes,
        addDialog,
        filterDialog,
        anchorEl,
        setAnchorEl,
        openActionMenu,
        setOpenActionMenu,
        longListData,
        meetingListData,
        shortListData
    } = props

    const data = _.get(detailData, 'data')
    const loading = _.get(detailData, 'loading')
    const position = _.get(data, ['position', 'name'])
    const uri = _.get(data, 'filterUri')

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
    const skills = _.map(_.get(data, ['skills']), (item) => _.get(item, 'name'))

    const popoverStyle = {
        menuItem: {
            fontSize: '13px',
            minHeight: '35px',
            lineHeight: '35px'
        }
    }

    const getResumeItem = (list) => {
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

    return (
        <Container>
            <div className={classes.wrapper}>
                <div className={classes.content}>
                    <div className={classes.header}>
                        <h1>{position}</h1>
                        <div className={classes.demands}>
                            <h2>{t('Требования к кандидату')}</h2>
                            <div className={classes.demandsList}>
                                <ul>
                                    <li>{t('Возраст')}: <strong>{ageMin} - {getYearText(ageMax)}</strong></li>
                                    <li>{t('Пол')}: <strong>{genderFormat[sex]}</strong></li>
                                    <li>{t('Образование')}: <strong>{education}</strong></li>
                                    <li>{t('Знание ПК')}: <strong>{levelPc}</strong></li>
                                </ul>
                                <ul>
                                    <li>{t('Минимальный опыт работы')}: <strong>{getYearText(experience)}</strong></li>
                                    <li>{t('Знание языков')}: <strong>{_.isEmpty(languages) ? t('Не указано') : languages}</strong></li>
                                    <li>{t('Профессиональные навыки')}: <strong>{_.join(skills, ', ') || t('Не указаны')}</strong></li>
                                </ul>
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
                                    {getResumeItem(longListData.list)}
                                    <Popover
                                        open={openActionMenu}
                                        anchorEl={anchorEl}
                                        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                                        targetOrigin={{horizontal: 'right', vertical: 'top'}}
                                        onRequestClose={() => { setOpenActionMenu(false) }}>
                                        <Menu>
                                            <MenuItem style={popoverStyle.menuItem} primaryText={t('Назначить собеседование')}/>
                                            <MenuItem style={popoverStyle.menuItem} primaryText={t('Добавить в "short list"')}/>
                                            <MenuItem style={popoverStyle.menuItem} primaryText={t('Удалить и лонг листа')}/>
                                        </Menu>
                                    </Popover>
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
                                    {getResumeItem(meetingListData.list)}
                                </div>}
                        </div>
                        <div className={classes.column}>
                            <header>
                                <h3>Short list {shortListData.count > ZERO && <span className={'count'}>{shortListData.count}</span>}</h3>
                            </header>
                        </div>
                    </div>
                </div>
            </div>

            <AddLongListDialog
                open={addDialog.open}
                onClose={addDialog.handleClose}
                onSubmit={addDialog.handleSubmit}
                filter={filter}
                filterDialog={filterDialog}
                loading={addDialog.loading}
                resumePreview={addDialog.resumePreview}
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
