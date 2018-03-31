import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import {Tabs, Tab} from 'material-ui/Tabs'
import Paper from 'material-ui/Paper'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import Loader from '../../Loader'
import ResumeDetails from '../Resume/ResumeDetails'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import {
    BORDER_STYLE,
    COLOR_DEFAULT, COLOR_GREY,
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
            fontSize: '15px',
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
            width: '100%',
            '& > div > div:first-child': {
                display: 'none'
            },
            '& > div > div:last-child': {
                width: 'auto'
            }
        },
        position: {
            color: COLOR_GREY,
            fontSize: '13px',
            fontWeight: '600',
            textTransform: 'none'
        },
        comments: {
            position: 'fixed',
            right: '-315px',
            top: '0',
            bottom: '0',
            borderLeft: BORDER_STYLE,
            width: '300px'
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
            '& header': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '5px',
                '& h2': {
                    fontSize: '13px',
                    fontWeight: '600'
                },
                '& span': {
                    color: COLOR_GREY_LIGHTEN,
                    display: 'block',
                    textAlign: 'right',
                    fontSize: '11px'
                }
            },
            '& div': {
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap'
            }
        },
        tab: {
            height: '100%',
            '& button': {
                borderRight: BORDER_STYLE + '!important',
                '&:last-child': {
                    borderRight: 'none !important'
                }
            }
        },
        tabContainer: {
            height: 'calc(100% - 49px)',
            overflowY: 'auto'
        },
        questions: {
            padding: PADDING_STANDART
        },
        question: {
            '& > span': {
                fontWeight: '600'
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

    const tabStyle = {
        button: {
            textTransform: 'none'
        },
        ink: {
            background: COLOR_WHITE,
            marginTop: '-1px',
            height: '1px'
        },
        tabItem: {
            borderBottom: BORDER_STYLE
        }
    }

    return (
        <Dialog
            modal={true}
            open={open}
            className={classes.dialog}
            contentStyle={{width: '800px', marginLeft: 'calc(50% - 558px)', maxWidth: 'none'}}
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
                        <Paper zDepth={4} className={classes.comments}>
                            <Tabs
                                inkBarStyle={tabStyle.ink}
                                tabItemContainerStyle={tabStyle.tabItem}
                                className={classes.tab}
                                contentContainerClassName={classes.tabContainer}>
                                <Tab label={t('Комментарии')} buttonStyle={tabStyle.button} disableTouchRipple>
                                    <form className={classes.block}>
                                        {openAddComment && !createCommentLoading &&
                                        <div>
                                            <Field
                                                name={'comment'}
                                                component={TextField}
                                                className={classes.textFieldArea}
                                                hintText={t('Комментарий') + '...'}
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
                                            onClick={() => {
                                                setOpenAddComment(true)
                                            }}/>}
                                        <div className={classes.commentsList}>
                                            {commentsLoading
                                                ? <div className={classes.staticLoader}>
                                                    <Loader size={0.75}/>
                                                </div>
                                                : _.map(commentsList, (item) => {
                                                    const id = _.get(item, 'id')
                                                    const comment = _.get(item, 'comment')
                                                    const createdDate = dateFormat(_.get(item, 'createdDate'))
                                                    const user = _.get(item, ['user', 'firstName']) + ' ' + _.get(item, ['user', 'secondName'])
                                                    return (
                                                        <div key={id} className={classes.comment}>
                                                            <header>
                                                                <h2>{user}</h2>
                                                                <span>{createdDate}</span>
                                                            </header>
                                                            <div>{comment}</div>
                                                        </div>
                                                    )
                                                })}
                                        </div>
                                    </form>
                                </Tab>
                                <Tab label={t('Вопросник')} buttonStyle={tabStyle.button} disableTouchRipple>
                                    <ul className={classes.questions}>
                                        {_.map(_.range(Number('5')), (item, index) => {
                                            const ONE = 1
                                            const count = index + ONE
                                            return (
                                                <li key={item} className={classes.question}>
                                                    <span>{count}. Lorem ipsum dolor sit.</span>
                                                    <Field
                                                        name={'questions[' + item + '][answer]'}
                                                        component={TextField}
                                                        className={classes.textFieldArea}
                                                        fullWidth
                                                        multiLine
                                                        rows={2}
                                                        rowsMax={4}
                                                    />
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </Tab>
                            </Tabs>
                        </Paper>
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
