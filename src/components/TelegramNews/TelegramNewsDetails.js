import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import LinearProgress from '../LinearProgress'
import Edit from 'material-ui/svg-icons/image/edit'
import IconButton from 'material-ui/IconButton'
import Delete from 'material-ui/svg-icons/action/delete'
import ToolTip from '../ToolTip'
import dateFormat from '../../helpers/dateFormat'
import t from '../../helpers/translate'

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
        }
    })
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

const TelegramNewsDetails = enhance((props) => {
    const {classes,
        loading,
        data,
        confirmDialog,
        handleOpenUpdateDialog,
        handleCloseDetail
    } = props

    const detailID = _.get(data, 'id')
    const title = _.get(data, 'title')
    const description = _.get(data, 'description')
    const content = _.get(data, 'content')
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
                    <ToolTip position="bottom" text={t('Изменить')}>
                        <IconButton
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            touch={true}
                            onTouchTap={() => { handleOpenUpdateDialog(detailID) }}>
                            <Edit />
                        </IconButton>
                    </ToolTip>
                    <ToolTip position="bottom" text={t('Удалить')}>
                        <IconButton
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            touch={true}
                            onTouchTap={() => { confirmDialog.handleOpenConfirmDialog(detailID) }}>
                            <Delete />
                        </IconButton>
                    </ToolTip>
                </div>
            </div>
            <div className={classes.container}>
                <div className={classes.info}>
                    <ul>
                        <li>{t('Описание')}: <span>{description}</span></li>
                        <li>{t('Дата создания')}: <span>{createdDate}</span></li>
                        <li>{t('Дата редактирования')}: <span>{modifiedDate}</span></li>
                    </ul>
                </div>
                <div className={classes.content}>{content}</div>
            </div>
        </div>
    )
})

TelegramNewsDetails.propTypes = {
    data: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    confirmDialog: PropTypes.shape({
        openConfirmDialog: PropTypes.bool.isRequired,
        handleOpenConfirmDialog: PropTypes.func.isRequired,
        handleCloseConfirmDialog: PropTypes.func.isRequired,
        handleSendConfirmDialog: PropTypes.func.isRequired
    }).isRequired
}

export default TelegramNewsDetails
