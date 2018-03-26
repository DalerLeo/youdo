import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import * as ROUTES from '../../../constants/routes'
import sprintf from 'sprintf'
import Container from '../../Container'
import Loader from '../../Loader'
import IconButton from 'material-ui/IconButton'
import Paper from 'material-ui/Paper'
import FlatButton from 'material-ui/FlatButton'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import Calendar from 'material-ui/svg-icons/action/event'
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
const enhance = compose(
    injectSheet({
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
                borderRight: BORDER_STYLE,
                width: 'calc(100% / 3)',
                '&:last-child': {
                    borderRight: 'none'
                }
            }
        },
        column: {
            '& h3': {
                color: '#a6aebc',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '15px',
                '& .count': {
                    background: '#eceff2',
                    padding: '3px 7px',
                    marginLeft: '5px',
                    borderRadius: '20px'
                }
            }
        },
        resumeList: {

        },
        resume: {
            background: COLOR_WHITE,
            borderRadius: '2px',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
            padding: PADDING_STANDART,
            transition: 'all 200ms ease',
            marginBottom: '10px',
            '&:hover': {
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
            },
            '&:last-child': {
                margin: '0'
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
        resumeFooter: {}
    })
)

const LongListGridList = enhance((props) => {
    const {
        filter,
        detailData,
        classes,
        filterDialog
    } = props

    const data = _.get(detailData, 'data')
    const loading = _.get(detailData, 'loading')
    const position = _.get(data, ['position', 'name'])

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

    // const skills = _.get(data, ['skills'])

    const flatButtonStyle = {
        label: {
            color: COLOR_WHITE,
            fontWeight: '600',
            textTransform: 'none',
            verticalAlign: 'baseline'
        }
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
                            <h3>Long list <span className={'count'}>3</span></h3>
                            <div className={classes.resumeList}>
                                <div className={classes.resume}>
                                    <div className={classes.resumeBody}>
                                        <h4>Менеджер по продажам</h4>
                                        <div className={classes.resumeInfo}>
                                            <div>Опыт работы: 2 года и 8 месяцев</div>
                                        </div>
                                    </div>
                                    <div className={classes.resumeFooter}>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={classes.column}>
                            <h3>Interview <span className={'count'}>2</span></h3>
                        </div>
                        <div className={classes.column}>
                            <h3>Short list</h3>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    )
})

LongListGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object
}

export default LongListGridList
