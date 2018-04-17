import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import {Row, Col} from 'react-flexbox-grid'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import Loader from '../../Loader/index'
import {reduxForm, Field} from 'redux-form'
import {CheckBox} from '../../ReduxForm'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import t from '../../../helpers/translate'
import {BORDER_STYLE, COLOR_DEFAULT, PADDING_STANDART} from '../../../constants/styleConstants'
import ResumeFilterForm from '../Resume/ResumeFilterForm'
import formValidate from '../../../helpers/formValidate'
import NotFound from '../../Images/not-found.png'

const enhance = compose(
    injectSheet({
        dialog: {
            overflowY: 'auto',
            paddingTop: '0 !important',
            zIndex: '1390 !important'
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
        listLoader: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '50px 0'
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
        inContent: {
            display: 'flex'
        },
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
        flex: {
            display: 'flex'
        },
        alignBaseline: {
            alignItems: 'baseline'
        },
        alignCenter: {
            alignItems: 'center'
        },
        flexBetween: {
            extend: 'flex',
            justifyContent: 'space-between'
        },
        halfChild: {
            flexWrap: 'wrap',
            '& > div': {
                width: '49% !important'
            }
        },
        thirdChild: {
            flexWrap: 'wrap',
            '& > div': {
                width: '32% !important'
            }
        },
        filters: {
            borderRight: BORDER_STYLE,
            width: '400px'
        },
        list: {
            padding: PADDING_STANDART,
            width: 'calc(100% - 400px)'
        },
        resumeList: {
            '& .row': {
                alignItems: 'center',
                margin: '0 -30px',
                padding: '0 30px',
                minHeight: '45px',
                '&:after': {left: '30px', right: '30px'},
                '&:first-child': {fontWeight: '600', color: 'inherit !important'},
                '&:last-child:after': {display: 'none'},

                '& > div:first-child': {paddingLeft: '0'},
                '& > div:last-child': {paddingRight: '0', textAlign: 'right'},

                '&:hover': {
                    background: '#f2f5f8',
                    cursor: 'pointer'
                }
            }
        },
        title: {
            fontWeight: '600',
            marginBottom: '10px'
        },
        emptyQuery: {
            background: '#fff url(' + NotFound + ') no-repeat center 20px',
            backgroundSize: '175px',
            padding: '135px 0 0',
            textAlign: 'center',
            fontSize: '13px',
            color: '#666',
            zIndex: '30'
        }
    }),
    reduxForm({
        form: 'AddLongListForm',
        enableReinitialize: true
    })
)

const AddLongListDialog = enhance((props) => {
    const {
        open,
        onClose,
        classes,
        filter,
        filterDialog,
        handleSubmit,
        dispatch,
        resumePreview,
        resumeLink
    } = props
    const onSubmit = handleSubmit(() => props.onSubmit()
        .catch((error) => {
            formValidate([], dispatch, error)
        }))
    const resumeLoading = _.get(resumePreview, 'loading')

    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={{width: '1000px', maxWidth: 'none'}}
            bodyClassName={classes.popUp}>

            <div className={classes.titleContent}>
                <span>{t('Добавление в лонглист')}</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon color="#666666"/>
                </IconButton>
            </div>

            <div className={classes.bodyContent}>
                <div className={classes.inContent}>
                    <div className={classes.loader}>
                        <Loader size={0.75}/>
                    </div>
                    <div className={classes.filters}>
                        <ResumeFilterForm
                            filter={filter}
                            filterDialog={filterDialog}
                            initialValues={filterDialog.initialValues}
                            forDialog={true}/>
                    </div>
                    <div className={classes.list}>
                        <div className={classes.title}>{t('Список резюме')}</div>
                        <form className={classes.resumeList}>
                            <Row className={'dottedList'}>
                                <Col xs={1}/>
                                <Col xs={4}>{t('Должность')}</Col>
                                <Col xs={5}>{t('Ф.И.О.')}</Col>
                                <Col xs={2}>{t('Статус')}</Col>
                            </Row>
                            {resumeLoading
                                ? <div className={classes.listLoader}>
                                    <Loader size={0.75}/>
                                </div>
                                : !_.isEmpty(_.get(resumePreview, 'list'))
                                    ? _.map(_.get(resumePreview, 'list'), (item) => {
                                        const id = _.get(item, ['id'])
                                        const relationId = _.get(item, 'relationId')
                                        const position = _.get(item, ['position', 'name'])
                                        const fullName = _.get(item, ['fullName'])
                                        const status = _.get(item, ['status'])
                                        return (
                                            <Row key={id} className={'dottedList'} onClick={() => { resumeLink(id, null, relationId) }}>
                                                <Col xs={1}>
                                                    <Field
                                                        name={'resumes[' + id + '][selected]'}
                                                        component={CheckBox}/>
                                                </Col>
                                                <Col xs={4}>{position}</Col>
                                                <Col xs={5}>{fullName}</Col>
                                                <Col xs={2}>{status}</Col>
                                            </Row>
                                        )
                                    })
                                    : <div className={classes.emptyQuery}>
                                        <div>{t('Не найдено резюме по данным фильтрам')}</div>
                                    </div>}
                        </form>
                    </div>
                </div>
                <div className={classes.bottomButton}>
                    <FlatButton
                        label={t('Добавить в лонглист')}
                        className={classes.actionButton}
                        primary={true}
                        onTouchTap={onSubmit}
                    />
                </div>
            </div>
        </Dialog>
    )
})

AddLongListDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    filter: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}

export default AddLongListDialog
