import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import ModEditorIcon from 'material-ui/svg-icons/editor/mode-edit'
import Delete from 'material-ui/svg-icons/action/delete'
import * as ROUTES from '../../constants/routes'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import Paper from 'material-ui/Paper'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import CircularProgress from 'material-ui/CircularProgress'
import PositionCreateDialog from './PositionCreateDialog'
import SubMenu from '../SubMenu'
import ConfirmDialog from '../ConfirmDialog'
import GridList from '../GridList'
import Tooltip from '../ToolTip'
import Container from '../Container'
import {CheckBox} from '../ReduxForm'
import {Field, reduxForm} from 'redux-form'

const listHeader = [
    {
        sorting: true,
        name: 'name',
        xs: 2,
        title: ''
    },
    {
        sorting: true,
        name: 'name',
        xs: 4,
        title: 'Курс'
    },
    {
        sorting: true,
        xs: 4,
        name: 'created_date',
        title: 'Дата обновления'
    }
]

const enhance = compose(
    injectSheet({
        loader: {
            width: '100%',
            height: '100%',
            background: '#fff',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex'
        },
        addButton: {
            '& button': {
                backgroundColor: '#275482 !important'
            }
        },
        addButtonWrapper: {
            position: 'absolute',
            top: '10px',
            right: '0',
            marginBottom: '0px'
        },
        semibold: {
            fontWeight: '600'
        },
        editContent: {
            width: '100%',
            backgroundColor: '#fff',
            color: '#333',
            padding: '20px 30px',
            boxSizing: 'border-box',
            marginBottom: '15px',
            '&>div': {
                marginBottom: '10px',
                '&:last-child': {
                    margin: '0'
                }
            }
        },
        wrap: {
            display: 'flex',
            margin: '0 -28px',
            padding: '0 28px 0 0',
            minHeight: 'calc(100% - 120px)'
        },
        leftSide: {
            flexBasis: '25%'
        },
        list: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '15px 30px',
            borderBottom: '1px #efefef solid',
            cursor: 'pointer',
            '& > div:first-child': {
                fontWeight: '600'
            },
            '& > div:last-child': {
                textAlign: 'right'
            }
        },
        rightSide: {
            flexBasis: '75%',
            marginLeft: '28px'
        },
        rightTitle: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        btnSend: {
            color: '#12aaeb !important'
        },
        btnAdd: {
            color: '#8acb8d !important'
        },
        btnRemove: {
            color: '#e57373 !important'
        },
        outerTitle: {
            extend: 'flex',
            justifyContent: 'space-between',
            fontWeight: '600',
            paddingBottom: '10px',
            paddingTop: '5px',
            '& a': {
                padding: '2px 10px',
                border: '1px solid',
                borderRadius: '2px',
                marginLeft: '12px'
            }
        },
        buttons: {
            float: 'right',
            textAlign: 'right'
        }
    }),

    reduxForm({
        form: 'PositionPermissionForm'
    })
)
const MINUS_ONE = -1

const PositionGridList = enhance((props) => {
    const {
        createDialog,
        updateDialog,
        actionsDialog,
        confirmDialog,
        listData,
        detailData,
        classes,
        detailId,
        detailFilter
    } = props

    const actions = (
        <div>
            <IconButton onTouchTap={actionsDialog.handleActionEdit}>
                <ModEditorIcon />
            </IconButton>

            <IconButton onTouchTap={actionsDialog.handleActionDelete}>
                <Delete />
            </IconButton>
        </div>
    )

    const positionList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const isActive = _.get(detailData, 'id') === id

        if (name) {
            return (
                <div key={id} className={classes.list}
                     style={isActive ? {backgroundColor: '#ffffff', display: 'relative'}
                         : {backgroundColor: '#f2f5f8', display: 'relative'}}
                     onClick={() => { listData.handlePositionClick(id) }}>
                    <div className={classes.title}>{name}</div>
                </div>
            )
        }
        return null
    })
    const permissionList = _.map(_.get(detailData, ['data']), (item, index) => {
        const name = _.get(item, 'name')
        const codename = _.get(item, 'codename')

        const createdDate = moment(_.get(item, 'createdDate')).format('DD.MM.YYYY')
        return (
            <Row key={index}>
                <Col xs={2}>
                    <Field
                    component={CheckBox}
                    name={codename}/>
                </Col>
                <Col xs={4}>{name}</Col>
                <Col xs={6}>{createdDate}</Col>
            </Row>
        )
    })

    const list = {
        header: listHeader,
        list: permissionList,
        loading: _.get(detailData, 'detailLoading')
    }
    const currentDetail = _.find(_.get(listData, 'data'), {'id': _.toInteger(detailId)})
    const confirmMessage = 'Валюта: ' + _.get(currentDetail, 'name')
    const listLoading = _.get(listData, 'listLoading')
    const detail = <div>a</div>

    return (
        <Container>
            <SubMenu url={ROUTES.POSITION_LIST_URL}/>
            <div className={classes.addButtonWrapper}>
                <Tooltip position="left" text="Добавить группу">
                    <FloatingActionButton
                        mini={true}
                        className={classes.addButton}
                        onTouchTap={createDialog.handleOpenCreateDialog}>
                        <ContentAdd />
                    </FloatingActionButton>
                </Tooltip>
            </div>
            <div className={classes.wrap}>
                <div className={classes.leftSide}>
                    <div className={classes.outerTitle} style={{paddingLeft: '30px'}}>
                        <div>Группы</div>
                    </div>
                    <Paper zDepth={1} style={{height: 'calc(100% - 18px)'}}>
                        {listLoading
                            ? <div className={classes.loader}>
                                <CircularProgress size={40} thickness={4}/>
                            </div>
                            : <div className={classes.listWrapper}>
                            {positionList}
                        </div>
                        }
                    </Paper>
                </div>
                <div className={classes.rightSide}>
                    <div className={classes.rightTitle}>
                        <div className={classes.outerTitle}>Доступы</div>
                        <div className={classes.outerTitle}>
                            <div className={classes.buttons}>
                                <a onClick={confirmDialog.handleOpenConfirmDialog} className={classes.btnRemove}>Удалить группу</a>
                                <a onClick={updateDialog.handleOpenUpdateDialog} className={classes.btnSend}>Изменить группу</a>
                            </div>
                        </div>
                    </div>
                    <GridList
                        filter={detailFilter}
                        list={list}
                        detail={detail}
                        withoutPagination={true}
                        actionsDialog={actions}
                    />

                    <PositionCreateDialog
                        initialValues={createDialog.initialValues}
                        open={createDialog.openCreateDialog}
                        loading={createDialog.createLoading}
                        onClose={createDialog.handleCloseCreateDialog}
                        onSubmit={createDialog.handleSubmitCreateDialog}
                    />

                    <PositionCreateDialog
                        isUpdate={true}
                        initialValues={updateDialog.initialValues}
                        open={updateDialog.openUpdateDialog}
                        loading={updateDialog.updateLoading}
                        onClose={updateDialog.handleCloseUpdateDialog}
                        onSubmit={updateDialog.handleSubmitUpdateDialog}
                    />
                    {detailId !== MINUS_ONE && <ConfirmDialog
                        type="delete"
                        message={confirmMessage}
                        onClose={confirmDialog.handleCloseConfirmDialog}
                        onSubmit={confirmDialog.handleSendConfirmDialog}
                        open={confirmDialog.openConfirmDialog}
                    />}
                </div>
            </div>
        </Container>
    )
})

PositionGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    createDialog: PropTypes.shape({
        createLoading: PropTypes.bool.isRequired,
        openCreateDialog: PropTypes.bool.isRequired,
        handleOpenCreateDialog: PropTypes.func.isRequired,
        handleCloseCreateDialog: PropTypes.func.isRequired,
        handleSubmitCreateDialog: PropTypes.func.isRequired
    }).isRequired,
    setPositionUpdateDialog: PropTypes.shape({
        setPositionLoading: PropTypes.bool.isRequired,
        openSetPositionDialog: PropTypes.bool.isRequired,
        handleOpenSetPositionDialog: PropTypes.func.isRequired,
        handleCloseSetPositionDialog: PropTypes.func.isRequired,
        handleSubmitSetPositionDialog: PropTypes.func.isRequired
    }),
    confirmDialog: PropTypes.shape({
        openConfirmDialog: PropTypes.bool.isRequired,
        handleOpenConfirmDialog: PropTypes.func.isRequired,
        handleCloseConfirmDialog: PropTypes.func.isRequired,
        handleSendConfirmDialog: PropTypes.func.isRequired
    }).isRequired,
    updateDialog: PropTypes.shape({
        updateLoading: PropTypes.bool.isRequired,
        openUpdateDialog: PropTypes.bool.isRequired,
        handleOpenUpdateDialog: PropTypes.func.isRequired,
        handleCloseUpdateDialog: PropTypes.func.isRequired,
        handleSubmitUpdateDialog: PropTypes.func.isRequired
    }).isRequired,
    actionsDialog: PropTypes.shape({
        handleActionEdit: PropTypes.func.isRequired,
        handleActionDelete: PropTypes.func.isRequired
    }).isRequired
}

export default PositionGridList
