import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import Loader from '../../Loader'
import ResumeDetails from '../Resume/ResumeDetails'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import {
    BORDER_STYLE,
    COLOR_DEFAULT,
    COLOR_GREY_LIGHTEN,
    COLOR_WHITE,
    LINK_COLOR,
    PADDING_STANDART
} from '../../../constants/styleConstants'
import t from '../../../helpers/translate'
import {hashHistory} from 'react-router'
import {reduxForm, Field} from 'redux-form'
import {TextField} from '../../ReduxForm'
import formValidate from '../../../helpers/formValidate'
import dateFormat from '../../../helpers/dateFormat'

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
            background: COLOR_WHITE,
            top: '0',
            left: '0',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex'
        },
        staticLoader: {
            background: COLOR_WHITE,
            padding: '50px 0',
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex'
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
            background: COLOR_WHITE,
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
        wrapper: {
            display: 'flex'
        },
        details: {
            width: '700px',
            '& > div > div:first-child': {
                display: 'none'
            }
        },
        position: {
            color: COLOR_GREY_LIGHTEN,
            fontSize: '12px',
            fontWeight: '600',
            textTransform: 'none'
        },
        comments: {
            borderLeft: BORDER_STYLE,
            maxHeight: '600px',
            width: 'calc(100% - 700px)',
            overflowY: 'auto'
        },
        block: {
            padding: PADDING_STANDART
        },
        innerTitle: {
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '10px'
        },
        textFieldArea: {
            top: '-5px !important',
            lineHeight: '20px !important',
            fontSize: '13px !important'
        },
        commentsList: {
            marginTop: '20px'
        },
        comment: {
            marginBottom: '10px',
            paddingBottom: '10px',
            borderBottom: BORDER_STYLE,
            position: 'relative',
            '&:last-child': {
                marginBottom: '0',
                paddingBottom: '0',
                borderBottom: 'none'
            },
            '& h2': {
                fontSize: '13px',
                fontWeight: '600',
                marginBottom: '5px'
            },
            '& div': {
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap'
            },
            '& span': {
                color: COLOR_GREY_LIGHTEN,
                display: 'block',
                textAlign: 'right',
                fontSize: '11px',
                marginTop: '10px'
            }
        }
    }),
    reduxForm({
        form: 'ResumeDetailsForm',
        enableReinitialize: true
    }),
    withState('openAddComment', 'setOpenAddComment', false)
)

const ResumeDetailsDialog = enhance((props) => {
    const {
        open,
        filter,
        data,
        loading,
        classes,
        handleSubmit,
        dispatch,
        createCommentLoading,
        handleCreateComment,
        commentsList,
        commentsLoading,
        openAddComment,
        setOpenAddComment
    } = props

    const submitComment = handleSubmit(() => handleCreateComment()
        .catch((error) => {
            formValidate(['comment'], dispatch, error)
        }))

    const fullName = _.get(data, 'fullName')
    const position = _.get(data, ['position', 'name'])

    const flatButtonStyle = {
        label: {
            color: COLOR_WHITE,
            fontWeight: '600',
            textTransform: 'none',
            vertivalAlign: 'baseline'
        }
    }

    return (
        <Dialog
            modal={true}
            open={open}
            className={classes.dialog}
            contentStyle={{width: '1000px', maxWidth: 'none'}}
            bodyClassName={classes.popUp}>

            <div className={classes.titleContent}>
                <span>{fullName} <span className={classes.position}>({position})</span></span>
                <IconButton onTouchTap={() => hashHistory.push(filter.createURL({resume: null}))}>
                    <CloseIcon color="#666666"/>
                </IconButton>
            </div>

            <div className={classes.bodyContent}>
                <div className={classes.inContent}>
                    {loading &&
                    <div className={classes.loader}>
                        <Loader size={0.75}/>
                    </div>}
                    <div className={classes.wrapper}>
                        <div className={classes.details}>
                            <ResumeDetails
                                data={data}
                                loading={loading}/>
                        </div>
                        <div className={classes.comments}>
                            <form className={classes.block}>
                                <div className={classes.innerTitle}>{t('Комментарии')}</div>
                                {openAddComment && !createCommentLoading &&
                                <div>
                                    <Field
                                        name={'comment'}
                                        component={TextField}
                                        className={classes.textFieldArea}
                                        hintStyle={{bottom: 'auto', top: '12px'}}
                                        fullWidth
                                        multiLine
                                        rows={2}
                                        rowsMax={4}/>
                                    <FlatButton
                                        label={'Сохранить'}
                                        labelStyle={flatButtonStyle.label}
                                        backgroundColor={LINK_COLOR}
                                        fullWidth={true}
                                        hoverColor={LINK_COLOR}
                                        rippleColor={COLOR_WHITE}
                                        onClick={submitComment}/>
                                </div>}
                                {createCommentLoading &&
                                <div className={classes.staticLoader}>
                                    <Loader size={0.75}/>
                                </div>}
                                {!openAddComment &&
                                <FlatButton
                                    label={'Добавить'}
                                    labelStyle={flatButtonStyle.label}
                                    backgroundColor={LINK_COLOR}
                                    fullWidth={true}
                                    hoverColor={LINK_COLOR}
                                    rippleColor={COLOR_WHITE}
                                    onClick={() => { setOpenAddComment(true) }}/>}
                                <div className={classes.commentsList}>
                                    {commentsLoading
                                        ? <div className={classes.staticLoader}>
                                            <Loader size={0.75}/>
                                        </div>
                                        : _.map(commentsList, (item) => {
                                            const id = _.get(item, 'id')
                                            const comment = _.get(item, 'comment')
                                            const createdDate = dateFormat(_.get(item, 'createdDate'), true)
                                            const user = _.get(item, ['user', 'firstName']) + ' ' + _.get(item, ['user', 'secondName'])
                                            return (
                                                <div key={id} className={classes.comment}>
                                                    <h2>{user}</h2>
                                                    <div>{comment}</div>
                                                    <span>{createdDate}</span>
                                                </div>
                                            )
                                        })}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    )
})

ResumeDetailsDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    data: PropTypes.object.isRequired,
    filter: PropTypes.object.isRequired
}

export default ResumeDetailsDialog
