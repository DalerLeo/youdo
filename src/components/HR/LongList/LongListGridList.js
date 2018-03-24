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
                marginBottom: '10px'
            },
            '& ul': {
                listStyle: 'disc inside',
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
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '15px'
            }
        }
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
                    <Paper zDepth={1} className={classes.header}>
                        <h1>{position}</h1>
                        <div className={classes.demands}>
                            <h2>{t('Требования к кандидату')}</h2>
                            <ul>
                                <li>{t('Возраст')}: {ageMin} - {getYearText(ageMax)}</li>
                                <li>{t('Пол')}: {genderFormat[sex]}</li>
                                <li>{t('Образование')}: {education}</li>
                                <li>{t('Знание ПК')}: {levelPc}</li>
                            </ul>
                        </div>
                    </Paper>
                    <Paper zDepth={1} className={classes.lists}>
                        <div className={classes.column}>
                            <h3>{t('Лонг лист')}</h3>
                            <FlatButton
                                label={t('Добавить')}
                                labelStyle={flatButtonStyle.label}
                                backgroundColor={LINK_COLOR}
                                hoverColor={LINK_COLOR}
                                rippleColor={COLOR_WHITE}
                                fullWidth={true}
                            />
                        </div>
                        <div className={classes.column}>
                            <h3>{t('Собеседования')}</h3>
                        </div>
                        <div className={classes.column}>
                            <h3>{t('Шорт лист')}</h3>
                        </div>
                    </Paper>
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
