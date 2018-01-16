import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import LinearProgress from '../LinearProgress'
import Edit from 'material-ui/svg-icons/image/edit'
import IconButton from 'material-ui/IconButton'
import ToolTip from '../ToolTip'
import dateFormat from '../../helpers/dateFormat'
import {Tabs, Tab} from 'material-ui/Tabs'

const colorBlue = '#12aaeb !important'
const enhance = compose(
    injectSheet({
        loader: {
            width: '100%',
            background: '#fff',
            height: '100px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        wrapper: {
            color: '#333 !important',
            width: '100%',
            display: 'flex',
            alignSelf: 'baseline',
            flexWrap: 'wrap',
            '& a': {
                color: colorBlue
            }
        },
        title: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            height: '65px',
            padding: '0 30px',
            borderBottom: '1px #efefef solid',
            position: 'relative'
        },
        container: {
            display: 'flex',
            width: '100%',
            '& > div': {
                '&:first-child': {
                    paddingTop: '0'
                },
                width: '50%',
                padding: '20px 30px'
            }
        },
        info: {
            borderRight: '1px #efefef solid',
            '& ul': {
                '& li': {
                    fontWeight: '600',
                    marginBottom: '5px',
                    '&:last-child': {marginBottom: '0'},
                    '& span': {
                        fontWeight: '400'
                    }
                }
            }
        },
        titleLabel: {
            fontSize: '18px',
            color: '#333',
            fontWeight: '600',
            cursor: 'pointer'
        },
        titleButtons: {
            display: 'flex',
            justifyContent: 'flex-end'
        },
        bodyTitle: {
            fontWeight: '600',
            marginBottom: '10px'
        },
        closeDetail: {
            position: 'absolute',
            left: '0',
            top: '0',
            right: '0',
            bottom: '0',
            cursor: 'pointer',
            zIndex: '1'
        },
        tabsWrapper: {
            width: '100%'
        },
        tabsContainer: {
            padding: '0',
            paddingTop: '20px'
        }
    }),
    withState('tab', 'setTab', 'ru')
)

const iconStyle = {
    icon: {
        color: '#666',
        width: 20,
        height: 20
    },
    button: {
        width: 48,
        height: 48,
        padding: 0
    }
}

const SystemPagesDetails = enhance((props) => {
    const {classes,
        loading,
        data,
        handleOpenUpdateDialog,
        handleCloseDetail,
        tab,
        setTab
    } = props

    const detailID = _.get(data, 'id')
    const title = _.get(data, ['translations', tab, 'title'])
    const description = _.get(data, ['translations', tab, 'description'])
    const body = _.get(data, ['translations', tab, 'body'])
    const createdDate = dateFormat(_.get(data, 'createdDate'), true)
    const modifiedDate = dateFormat(_.get(data, 'modifiedDate'), true)

    if (loading) {
        return (
            <div className={classes.loader}>
                <LinearProgress/>
            </div>
        )
    }

    return (
        <div className={classes.wrapper} key={_.get(data, 'id')}>
            <div className={classes.title}>
                <div className={classes.titleLabel}>{title}</div>
                <div className={classes.closeDetail} onClick={handleCloseDetail}/>
                <div className={classes.titleButtons}>
                    <ToolTip position="bottom" text="Изменить">
                        <IconButton
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            touch={true}
                            onTouchTap={() => { handleOpenUpdateDialog(detailID) }}>
                            <Edit />
                        </IconButton>
                    </ToolTip>
                </div>
            </div>
            <div className={classes.container}>
                <div className={classes.info}>
                    <Tabs
                        inkBarStyle={{background: '#12aaeb'}}
                        className={classes.tabsWrapper}
                        onChange={(value) => setTab(value)}
                        contentContainerClassName={classes.tabsContainer}>
                        <Tab label={'Ру'} disableTouchRipple={true} value="ru">
                            <ul>
                                <li>Описание: <span>{description}</span></li>
                                <li>Дата создания: <span>{createdDate}</span></li>
                                <li>Дата редактирования: <span>{modifiedDate}</span></li>
                            </ul>
                        </Tab>
                        <Tab label={'Ўз'} disableTouchRipple={true} value="uz">
                            <ul>
                                <li>Tavsif: <span>{description}</span></li>
                                <li>Yaratilgan sana: <span>{createdDate}</span></li>
                                <li>O'zgartirilgan sana: <span>{modifiedDate}</span></li>
                            </ul>
                        </Tab>
                        <Tab label={'En'} disableTouchRipple={true} value="en">
                            <ul>
                                <li>Description: <span>{description}</span></li>
                                <li>Created date: <span>{createdDate}</span></li>
                                <li>Modified date: <span>{modifiedDate}</span></li>
                            </ul>
                        </Tab>
                    </Tabs>

                </div>
                <div className={classes.content}>{body}</div>
            </div>
        </div>
    )
})

SystemPagesDetails.propTypes = {
    data: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    confirmDialog: PropTypes.shape({
        openConfirmDialog: PropTypes.bool.isRequired,
        handleOpenConfirmDialog: PropTypes.func.isRequired,
        handleCloseConfirmDialog: PropTypes.func.isRequired,
        handleSendConfirmDialog: PropTypes.func.isRequired
    }).isRequired
}

export default SystemPagesDetails
