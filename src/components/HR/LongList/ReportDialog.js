import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState, withPropsOnChange} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import Loader from '../../Loader/index'
import {reduxForm} from 'redux-form'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import t from '../../../helpers/translate'
import {
    BORDER_STYLE,
    COLOR_DEFAULT,
    COLOR_GREY,
    COLOR_GREY_LIGHTEN,
    PADDING_STANDART
} from '../../../constants/styleConstants'
import {HR_RESUME_REPORT, HR_RESUME_SHORT} from '../../../constants/backendConstants'

const enhance = compose(
    injectSheet({
        dialog: {
            overflowY: 'auto',
            paddingTop: '0 !important'
        },
        loader: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: '#fff',
            top: '0',
            left: '0',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: ({loading}) => loading ? 'flex' : 'none'
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
            background: '#fff',
            color: COLOR_DEFAULT,
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
        inContent: {},
        inputFieldCustom: {
            fontSize: '13px !important',
            height: '45px !important',
            marginTop: '7px',
            '& > div:first-child': {
                fontSize: '13px !important'
            },
            '& label': {
                top: '20px !important',
                lineHeight: '5px !important'
            },
            '& input': {
                marginTop: '0 !important'
            }
        },
        textFieldArea: {
            top: '-20px !important',
            lineHeight: '20px !important',
            fontSize: '13px !important',
            marginBottom: '-22px'
        },
        inputDateCustom: {
            fontSize: '13px !important',
            height: '45px !important',
            marginTop: '7px',
            '& > div:first-child': {
                fontSize: '13px !important'
            },
            '& label': {
                top: '20px !important',
                lineHeight: '5px !important'
            },
            '& input': {
                marginTop: '0 !important'
            },
            '& div:first-child': {
                height: '45px !important'
            }
        },
        bottomButton: {
            bottom: '0',
            left: '0',
            right: '0',
            padding: '10px',
            zIndex: '999',
            borderTop: BORDER_STYLE,
            background: '#fff',
            textAlign: 'right',
            '& span': {
                fontSize: '13px !important',
                fontWeight: '600 !important',
                color: '#129fdd',
                verticalAlign: 'inherit !important'
            }
        },
        actionButton: {
            fontSize: '13px !important',
            margin: '0 !important'
        },

        block: {
            padding: PADDING_STANDART,
            '&:first-child': {
                paddingBottom: '0'
            },
            '& h2': {
                fontWeight: '600',
                fontSize: '14px',
                marginBottom: '15px'
            }
        },
        styledTitle: {
            textAlign: 'center',
            position: 'relative',
            color: COLOR_GREY_LIGHTEN,
            '&:before': {
                background: '#e3e3e3',
                content: '""',
                position: 'absolute',
                left: '0',
                top: '8px',
                height: '1px',
                width: '125px'
            },
            '&:after': {
                background: '#e3e3e3',
                content: '""',
                position: 'absolute',
                right: '0',
                top: '8px',
                height: '1px',
                width: '125px'
            }
        },
        resume: {
            background: '#fafafa',
            border: BORDER_STYLE,
            borderRadius: '2px',
            padding: '15px 20px',
            position: 'relative',
            transition: 'all 300ms ease',
            marginBottom: '5px',
            '&:hover': {
                background: '#f0f0f0'
            },
            '&:last-child': {
                margin: '0'
            }
        },
        activeResume: {
            extend: 'resume',
            background: '#f0f0f0'
        },
        remove: {
            cursor: 'pointer',
            '&:hover': {
                textDecoration: 'underline'
            }
        },
        createdDate: {
            color: COLOR_GREY_LIGHTEN,
            fontSize: '12px',
            fontWeight: '600'
        },
        resumeFooter: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative'
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
        }
    }),
    reduxForm({
        form: 'ReportForm',
        enableReinitialize: true
    }),
    withState('reportListClone', 'updateReportList', []),
    withState('shortListClone', 'updateShortList', []),

    withPropsOnChange((props, nextProps) => {
        const shortList = _.get(props, 'shortList')
        const nextShortList = _.get(nextProps, 'shortList')
        return !_.isEqual(shortList, nextShortList)
    }, ({shortList, updateShortList}) => {
        if (!_.isEmpty(shortList)) {
            updateShortList(shortList)
        }
    }),
    withPropsOnChange((props, nextProps) => {
        const reportList = _.get(props, 'reportList')
        const nextReportList = _.get(nextProps, 'reportList')
        return !_.isEqual(reportList, nextReportList)
    }, ({reportList, updateReportList}) => {
        if (!_.isEmpty(reportList)) {
            updateReportList(reportList)
        }
    })
)

const ReportDialog = enhance((props) => {
    const {
        open,
        onClose,
        classes,
        onSubmit,
        loading,
        reportListClone,
        updateReportList,
        shortListClone,
        updateShortList
    } = props

    const removeFromReport = (id) => {
        const removedArray = _.remove(reportListClone, (item) => {
            return _.get(item, 'id') === id
        })
        updateShortList(_.concat(shortListClone, removedArray))
        return _.differenceBy(reportListClone, removedArray)
    }
    const removeFromShort = (id) => {
        const removedArray = _.remove(shortListClone, (item) => {
            return _.get(item, 'id') === id
        })
        updateReportList(_.concat(reportListClone, removedArray))
        return _.differenceBy(shortListClone, removedArray)
    }

    const getResume = (list, status) => {
        return _.map(list, (item) => {
            const id = _.get(item, 'id')
            const fullName = _.get(item, 'fullName')

            return (
                <div key={id} className={classes.resume}>
                    <div className={classes.resumeFooter}>
                        <div className={classes.resumeFullName}>
                            <div>{fullName}</div>
                        </div>
                        <div
                            className={classes.remove}
                            onClick={() => {
                                status === HR_RESUME_REPORT
                                    ? updateReportList(removeFromReport(id))
                                    : updateShortList(removeFromShort(id))
                            }}>{status === HR_RESUME_REPORT ? t('Исключить') : t('Добавить')}
                        </div>
                    </div>
                </div>
            )
        })
    }

    const reportListIds = _.map(reportListClone, (item) => _.get(item, 'id'))
    const shortListIds = _.map(shortListClone, (item) => _.get(item, 'id'))

    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={{width: '500px', maxWidth: 'none'}}
            bodyClassName={classes.popUp}>

            <div className={classes.titleContent}>
                <span>{t('Отчет')}</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon color="#666666"/>
                </IconButton>
            </div>

            <div className={classes.bodyContent}>
                <div className={classes.inContent}>
                    {loading && <div className={classes.loader}>
                        <Loader size={0.75}/>
                    </div>}

                    <div className={classes.block}>
                        {getResume(reportListClone, HR_RESUME_REPORT)}
                    </div>
                    <div className={classes.block}>
                        <h2 className={classes.styledTitle}>{t('Невошедшие в отчет')}</h2>
                        {getResume(shortListClone, HR_RESUME_SHORT)}
                    </div>
                </div>
                <div className={classes.bottomButton}>
                    <FlatButton
                        label={t('Сохранить')}
                        className={classes.actionButton}
                        primary={true}
                        onTouchTap={() => { onSubmit(reportListIds, shortListIds) }}
                    />
                </div>
            </div>
        </Dialog>
    )
})

ReportDialog.defaultProps = {
    isUpdate: false
}
ReportDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    loading: PropTypes.bool
}

export default ReportDialog
