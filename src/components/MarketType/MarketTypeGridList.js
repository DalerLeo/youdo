import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import ModEditorIcon from 'material-ui/svg-icons/editor/mode-edit'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import FlatButton from 'material-ui/FlatButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import Edit from 'material-ui/svg-icons/image/edit'
import * as ROUTES from '../../constants/routes'
import GridList from '../GridList'
import Container from '../Container'
import MarketTypeCreateDialog from './MarketTypeCreateDialog'
import ConfirmDialog from '../ConfirmDialog'
import SettingSideMenu from '../Settings/SettingsSideMenu'
import Tooltip from '../ToolTip'
import dateFormat from '../../helpers/dateFormat'
import Dot from '../Images/dot.png'

const listHeader = [
    {
        sorting: true,
        name: 'name',
        xs: 6,
        title: 'Наименование'
    },
    {
        sorting: true,
        xs: 4,
        name: 'createdDate',
        title: 'Дата создания'
    },
    {
        sorting: true,
        xs: 2,
        name: 'actions',
        title: ''
    }

]

const enhance = compose(
    injectSheet({
        addButton: {
            '& svg': {
                width: '14px !important',
                height: '14px !important'
            }
        },
        wrapper: {
            display: 'flex',
            margin: '0 -28px',
            height: 'calc(100% + 28px)'
        },
        addButtonWrapper: {
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            marginLeft: '-18px'
        },
        marginLeft: {
            marginLeft: '20px !important'
        },
        right: {
            textAlign: 'right'
        },
        rightPanel: {
            background: '#fff',
            flexBasis: 'calc(100% - 225px)',
            maxWidth: 'calc(100% - 225px)',
            paddingTop: '10px',
            overflowY: 'auto',
            overflowX: 'hidden',
            '& > div > div:first-child': {
                boxShadow: 'none !important'
            },
            '& > div > div:last-child > div > div': {
                boxShadow: 'none !important'
            }
        },
        verticalButton: {
            border: '2px #dfdfdf solid !important',
            borderRadius: '50%',
            opacity: '0',
            '& > div': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }
        },
        listRow: {
            margin: '0 -30px !important',
            width: 'auto !important',
            padding: '0 30px',
            '&:hover > div:last-child > div ': {
                opacity: '1'
            }
        },
        iconBtn: {
            display: 'flex',
            justifyContent: 'flex-end',
            opacity: '0',
            transition: 'all 200ms ease-out'
        },
        rowWithParent: {
            flexWrap: 'wrap',
            margin: '0 -30px !important',
            width: 'auto !important',
            padding: '0 30px',
            '& > div': {
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                '&:hover button': {
                    opacity: '1'
                }
            },
            '& > div:first-child': {
                fontWeight: '600'
            }
        },
        rowWithoutParent: {
            extend: 'rowWithParent',
            flexWrap: 'none',
            '&:hover > div:last-child > div': {
                opacity: '1'
            }
        },
        parentCategory: {
            width: '100%',
            '& > div:first-child': {
                paddingLeft: '0'
            },
            '&:hover > div:last-child > div ': {
                opacity: '1'
            }
        },
        subCategory: {
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            '&:hover > div:last-child > div ': {
                opacity: '1'
            },
            '& > div:first-child': {
                paddingLeft: '50px'
            },
            '& > div:last-child': {
                paddingRight: '0'
            },
            '&:after': {
                content: '""',
                opacity: '0.5',
                background: 'url(' + Dot + ')',
                position: 'absolute',
                height: '2px',
                top: '0',
                left: '0',
                right: '0',
                marginTop: '1px'
            }
        }
    })
)

const iconStyle = {
    icon: {
        color: '#666',
        width: 22,
        height: 22
    },
    button: {
        width: 30,
        height: 25,
        padding: 0
    }
}

const MarketTypeGridList = enhance((props) => {
    const {
        filter,
        createDialog,
        updateDialog,
        actionsDialog,
        confirmDialog,
        listData,
        detailData,
        classes
    } = props

    const actions = (
        <div>
            <IconButton onTouchTap={actionsDialog.handleActionEdit}>
                <ModEditorIcon />
            </IconButton>

            <IconButton onTouchTap={actionsDialog.handleActionDelete}>
                <DeleteIcon />
            </IconButton>
        </div>
    )

    const marketTypeDetail = (
        <span>a</span>
    )
    const marketTypeList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const createdDate = dateFormat(_.get(item, 'createdDate'))
        const hasChild = !_.isEmpty(_.get(item, 'children'))
        if (hasChild) {
            return (
                <Row key={id} className={classes.rowWithParent}>
                    <div className={classes.parentCategory}>
                        <Col xs={6}>{name}</Col>
                        <Col xs={4}>{createdDate}</Col>
                        <Col xs={2} className={classes.right}>
                            <div className={classes.iconBtn}>
                                <Tooltip position="bottom" text="Изменить">
                                    <IconButton
                                        iconStyle={iconStyle.icon}
                                        style={iconStyle.button}
                                        disableTouchRipple={true}
                                        touch={true}
                                        onTouchTap={() => { updateDialog.handleOpenUpdateDialog(id) }}>
                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip position="bottom" text="Удалить">
                                    <IconButton
                                        disableTouchRipple={true}
                                        iconStyle={iconStyle.icon}
                                        style={iconStyle.button}
                                        onTouchTap={() => { confirmDialog.handleOpenConfirmDialog(id) }}
                                        touch={true}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        </Col>
                    </div>
                    {_.map(_.get(item, 'children'), (child) => {
                        const childId = _.get(child, 'id')
                        const childName = _.get(child, 'name')
                        const childCreatedDate = dateFormat(_.get(child, 'createdDate'))
                        return (
                            <div key={childId} className={classes.subCategory}>
                                <Col xs={6}>{childName}</Col>
                                <Col xs={4}>{childCreatedDate}</Col>
                                <Col xs={2} className={classes.right}>
                                    <div className={classes.iconBtn}>
                                        <Tooltip position="bottom" text="Изменить">
                                            <IconButton
                                                iconStyle={iconStyle.icon}
                                                style={iconStyle.button}
                                                disableTouchRipple={true}
                                                touch={true}
                                                onTouchTap={() => { updateDialog.handleOpenUpdateDialog(childId) }}>
                                                <Edit />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip position="bottom" text="Удалить">
                                            <IconButton
                                                disableTouchRipple={true}
                                                iconStyle={iconStyle.icon}
                                                style={iconStyle.button}
                                                onTouchTap={() => { confirmDialog.handleOpenConfirmDialog(childId) }}
                                                touch={true}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                </Col>
                            </div>
                        )
                    })}
                </Row>
            )
        }
        return (
            <Row key={id} className={classes.rowWithoutParent}>
                <Col xs={6}>{name}</Col>
                <Col xs={4}>{createdDate}</Col>
                <Col xs={2} className={classes.right}>
                    <div className={classes.iconBtn}>
                        <Tooltip position="bottom" text="Изменить">
                            <IconButton
                                iconStyle={iconStyle.icon}
                                style={iconStyle.button}
                                disableTouchRipple={true}
                                touch={true}
                                onTouchTap={() => { updateDialog.handleOpenUpdateDialog(id) }}>
                                <Edit />
                            </IconButton>
                        </Tooltip>
                        <Tooltip position="bottom" text="Удалить">
                            <IconButton
                                disableTouchRipple={true}
                                iconStyle={iconStyle.icon}
                                style={iconStyle.button}
                                onTouchTap={() => { confirmDialog.handleOpenConfirmDialog(id) }}
                                touch={true}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                </Col>
            </Row>
        )
    })

    const list = {
        header: listHeader,
        list: marketTypeList,
        loading: _.get(listData, 'listLoading')
    }

    const addButton = (
        <div className={classes.addButtonWrapper}>
            <FlatButton
                backgroundColor="#fff"
                labelStyle={{textTransform: 'none', paddingLeft: '2px', color: '#12aaeb', fontSize: '13px'}}
                className={classes.addButton}
                label="добавить тип магазина"
                onTouchTap={createDialog.handleOpenCreateDialog}
                icon={<ContentAdd color="#12aaeb"/>}>
            </FlatButton>
        </div>
    )
    return (
        <Container>
            <div className={classes.wrapper}>
                <SettingSideMenu currentUrl={ROUTES.MARKET_TYPE_LIST_URL}/>
                <div className={classes.rightPanel}>
                    <GridList
                        filter={filter}
                        list={list}
                        detail={marketTypeDetail}
                        actionsDialog={actions}
                        flexibleRow={true}
                        hoverableList={false}
                        addButton={addButton}
                        listShadow={false}
                    />
                </div>
            </div>

            <MarketTypeCreateDialog
                open={createDialog.openCreateDialog}
                loading={createDialog.createLoading}
                onClose={createDialog.handleCloseCreateDialog}
                onSubmit={createDialog.handleSubmitCreateDialog}
            />

            <MarketTypeCreateDialog
                isUpdate={true}
                initialValues={updateDialog.initialValues}
                open={updateDialog.openUpdateDialog}
                loading={updateDialog.updateLoading}
                onClose={updateDialog.handleCloseUpdateDialog}
                onSubmit={updateDialog.handleSubmitUpdateDialog}
            />

            {detailData.data && <ConfirmDialog
                type="delete"
                message={_.get(detailData, ['data', 'name'])}
                loading={confirmDialog.confirmLoading}
                onClose={confirmDialog.handleCloseConfirmDialog}
                onSubmit={confirmDialog.handleSendConfirmDialog}
                open={confirmDialog.openConfirmDialog}
            />}
        </Container>
    )
})

MarketTypeGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    createDialog: PropTypes.shape({
        createLoading: PropTypes.bool,
        openCreateDialog: PropTypes.bool.isRequired,
        handleOpenCreateDialog: PropTypes.func.isRequired,
        handleCloseCreateDialog: PropTypes.func.isRequired,
        handleSubmitCreateDialog: PropTypes.func.isRequired
    }).isRequired,
    confirmDialog: PropTypes.shape({
        confirmLoading: PropTypes.bool.isRequired,
        openConfirmDialog: PropTypes.bool.isRequired,
        handleOpenConfirmDialog: PropTypes.func.isRequired,
        handleCloseConfirmDialog: PropTypes.func.isRequired,
        handleSendConfirmDialog: PropTypes.func.isRequired
    }).isRequired,
    updateDialog: PropTypes.shape({
        updateLoading: PropTypes.bool,
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

export default MarketTypeGridList
