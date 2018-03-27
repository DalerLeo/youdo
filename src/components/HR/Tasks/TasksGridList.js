import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import * as ROUTES from '../../../constants/routes'
import Container from '../../Container'
import Loader from '../../Loader'
import IconButton from 'material-ui/IconButton'
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
    COLOR_DEFAULT, COLOR_GREEN,
    COLOR_GREY,
    COLOR_GREY_LIGHTEN,
    COLOR_WHITE,
    LINK_COLOR,
    PADDING_STANDART
} from '../../../constants/styleConstants'

const SORT_BY_DEADLINE = 'deadline'
const SORT_BY_CREATED_DATE = 'createdDate'

const BORDER_DARKER = '1px #e3e3e3 solid'
const BORDER_TRANSPARENT = '1px transparent solid'
const enhance = compose(
    injectSheet({
        loader: {
            display: 'flex',
            alignItems: 'center',
            alignSelf: 'baseline',
            justifyContent: 'center',
            padding: '100px 0',
            width: '100%'
        },
        wrapper: {
            position: 'absolute',
            top: '60px',
            left: '-28px',
            right: '-32px',
            bottom: '-28px',
            display: 'flex'
        },
        leftSide: {
            display: 'flex',
            alignSelf: 'baseline',
            flexWrap: 'wrap',
            width: '75%'
        },
        header: {
            display: 'flex',
            height: '60px',
            alignItems: 'center',
            justifyContent: 'space-between',
            margin: '0 -32px 0 -28px',
            borderBottom: BORDER_DARKER
        },
        title: {
            fontWeight: '600',
            fontSize: '17px',
            padding: '0 30px'
        },
        tasks: {
            display: 'flex',
            flexWrap: 'wrap',
            height: '100%',
            paddingBottom: '15px',
            overflowY: 'auto',
            width: '100%'
        },
        task: {
            borderBottom: BORDER_DARKER,
            borderRight: BORDER_DARKER,
            borderTop: BORDER_TRANSPARENT,
            position: 'relative',
            cursor: 'pointer',
            minHeight: '300px',
            width: 'calc(100% / 3)',
            transition: 'all 250ms ease',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            '& > a': {
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0'
            },
            '&:nth-child(3n + 3)': {
                borderRight: BORDER_TRANSPARENT
            },

            '&:hover': {
                background: COLOR_WHITE,
                borderBottom: BORDER_TRANSPARENT,
                borderRight: BORDER_TRANSPARENT,
                borderTop: BORDER_TRANSPARENT,
                boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 30px, rgba(0, 0, 0, 0.19) 0px 6px 10px',
                zIndex: '2'
            },

            '& header': {
                display: 'flex',
                height: '50px',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 20px'
            },
            '& section': {
                padding: '10px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            },
            '& footer': {
                borderTop: BORDER_STYLE,
                display: 'flex',
                height: '50px',
                alignItems: 'center',
                justifyContent: 'space-between',
                '& > div': {
                    borderRight: BORDER_STYLE,
                    color: COLOR_GREY,
                    fontSize: '11px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    height: '100%',
                    padding: '0 20px',
                    width: 'calc(100% / 3)',
                    '&:last-child': {
                        borderRight: 'none'
                    },
                    '& strong': {
                        color: COLOR_DEFAULT,
                        marginLeft: '5px',
                        fontWeight: 'bold'
                    }
                }
            }
        },
        deadline: {
            display: 'flex',
            alignItems: 'center',
            color: COLOR_GREY_LIGHTEN,
            fontSize: '11px',
            '& svg': {
                color: COLOR_GREY_LIGHTEN + '!important',
                width: '20px !important',
                height: '20px !important',
                marginRight: '5px'
            }
        },
        bodyBlock: {
            textAlign: 'center'
        },
        status: {
            border: '2px solid',
            borderRadius: '4px',
            color: LINK_COLOR,
            display: 'inline-block',
            fontWeight: '600',
            padding: '2px 8px'
        },
        client: {
            fontSize: '13px',
            color: COLOR_GREY,
            marginBottom: '5px'
        },
        position: {
            fontSize: '16px',
            fontWeight: '600'
        },
        rightSide: {
            background: COLOR_WHITE,
            borderLeft: BORDER_DARKER,
            padding: PADDING_STANDART,
            width: '25%'
        },
        buttons: {
            display: 'flex',
            alignItems: 'center',
            borderRadius: '40px',
            background: COLOR_WHITE,
            marginRight: '30px'
        }
    })
)

const TasksGridList = enhance((props) => {
    const {
        filter,
        listData,
        classes
    } = props

    const loading = _.get(listData, 'listLoading')
    const tasksList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const isNew = _.get(item, 'isNew')
        const client = _.get(item, ['contact', 'client', 'name'])
        const position = _.get(item, ['position', 'name'])
        const deadline = dateFormat(_.get(item, 'deadline'))
        return (
            <div key={id} className={classes.task}>
                <Link target={'_blank'} to={{
                    pathname: ROUTES.HR_LONG_LIST_URL,
                    query: filter.getParams({application: id})}}/>
                <header>
                    <div className={classes.deadline}><Calendar/>{deadline}</div>
                    <div className={classes.status}>{isNew && t('новое')}</div>
                </header>
                <section>
                    <div className={classes.bodyBlock}>
                        <div className={classes.client}>{client}</div>
                        <div className={classes.position}>{position}</div>
                    </div>
                </section>
                <footer>
                    <div>Long list:<strong>4</strong></div>
                    <div>Interview:<strong>3</strong></div>
                    <div>Short list:<strong>0</strong></div>
                </footer>
            </div>
        )
    })

    const buttonStyle = {
        button: {
            width: 40,
            height: 40,
            padding: 9
        },
        icon: {
            width: 22,
            height: 22
        }
    }
    const currentOrdering = filter.getParam('ordering')
    const sortyBy = (value) => {
        return hashHistory.push(filter.createURL({ordering: value}))
    }

    return (
        <Container>
            <div className={classes.header}>
                <h2 className={classes.title}>{t('Активные задания')}</h2>
                <div className={classes.buttons}>
                    <ToolTip position={'left'} text={t('Сортировать по дэдлайну')}>
                        <IconButton
                            style={buttonStyle.button}
                            iconStyle={buttonStyle.icon}
                            onTouchTap={() => { sortyBy(SORT_BY_DEADLINE) }}>
                            <Calendar color={currentOrdering === SORT_BY_DEADLINE ? COLOR_GREEN : COLOR_GREY}/>
                        </IconButton>
                    </ToolTip>
                    <ToolTip position={'left'} text={t('Сортировать по дате создания')}>
                        <IconButton
                            style={buttonStyle.button}
                            iconStyle={buttonStyle.icon}
                            onTouchTap={() => { sortyBy(SORT_BY_CREATED_DATE) }}>
                            <CalendarCreated color={currentOrdering === SORT_BY_CREATED_DATE ? COLOR_GREEN : COLOR_GREY}/>
                        </IconButton>
                    </ToolTip>
                </div>
            </div>
            <div className={classes.wrapper}>
                <div className={classes.leftSide}>
                    {loading
                        ? <div className={classes.loader}><Loader size={0.75}/></div>
                        : <div className={classes.tasks}>
                            {tasksList}
                        </div>}
                </div>
                <div className={classes.rightSide}>

                </div>
            </div>
        </Container>
    )
})

TasksGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object
}

export default TasksGridList
