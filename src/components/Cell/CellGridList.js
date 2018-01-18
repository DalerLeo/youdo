import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import * as ROUTES from '../../constants/routes'
import GridList from '../GridList'
import Container from '../Container'
import CellCreateDialog from './CellCreateDialog'
import ConfirmDialog from '../ConfirmDialog'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import FlatButton from 'material-ui/FlatButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import SettingSideMenu from '../Settings/SettingsSideMenu'
import Edit from 'material-ui/svg-icons/image/edit'
import ToolTip from '../ToolTip'
import t from '../../helpers/translate'
import dateFormat from '../../helpers/dateFormat'

const listHeader = [
    {
        sorting: true,
        name: 'barcode',
        xs: 3,
        title: t('Barcode')
    },
    {
        sorting: true,
        name: 'name',
        xs: 3,
        title: t('Наименование')
    },
    {
        sorting: true,
        name: 'cell_type',
        title: t('Тип ячейки'),
        xs: 2
    },
    {
        sorting: true,
        name: 'created_date',
        title: t('Дата создания'),
        xs: 3,
        alignRight: true
    },
    {
        sorting: false,
        name: 'actions',
        title: '',
        xs: 1
    }
]

const enhance = compose(
    injectSheet({
        wrapper: {
            display: 'flex',
            margin: '0 -28px',
            height: 'calc(100% + 28px)'
        },
        addButton: {
            '& svg': {
                width: '14px !important',
                height: '14px !important'
            }
        },
        addButtonWrapper: {
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            marginLeft: '-18px'
        },
        leftPanel: {
            backgroundColor: '#f2f5f8',
            flexBasis: '250px',
            maxWidth: '250px'

        },
        rightPanel: {
            background: '#fff',
            flexBasis: 'calc(100% - 225px)',
            maxWidth: 'calc(100% - 225px)',
            paddingTop: '10px',
            overflowY: 'auto',
            overflowX: 'hidden'
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
            opacity: '0',
            transition: 'all 200ms ease-out'
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

const CellGridList = enhance((props) => {
    const {
        filter,
        createDialog,
        updateDialog,
        confirmDialog,
        listData,
        detailData,
        classes
    } = props

    const actions = (
        <div></div>
    )

    const cellDetail = (
        <span>a</span>
    )

    const cellList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const barcode = _.get(item, ['barcode'])
        const cellType = _.get(item, ['cellType'])
        const createdDate = dateFormat(_.get(item, ['createdDate']))

        return (
            <Row key={id} className={classes.listRow}>
                <Col xs={3}>{barcode}</Col>
                <Col xs={3}>{name}</Col>
                <Col xs={2}>{cellType}</Col>
                <Col xs={3} style={{textAlign: 'right'}}>{createdDate}</Col>
                <Col xs={1} style={{textAlign: 'right'}}>
                    <div className={classes.iconBtn}>
                        <ToolTip position="bottom" text={t('Изменить')}>
                            <IconButton
                                iconStyle={iconStyle.icon}
                                style={iconStyle.button}
                                disableTouchRipple={true}
                                touch={true}
                                onTouchTap={() => { updateDialog.handleOpenUpdateDialog(id) }}>
                                <Edit />
                            </IconButton>
                        </ToolTip>
                        <ToolTip position="bottom" text={t('Удалить')}>
                            <IconButton
                                disableTouchRipple={true}
                                iconStyle={iconStyle.icon}
                                style={iconStyle.button}
                                onTouchTap={() => { confirmDialog.handleOpenConfirmDialog(id) }}
                                touch={true}>
                                <DeleteIcon />
                            </IconButton>
                        </ToolTip>
                    </div>
                </Col>
            </Row>
        )
    })

    const list = {
        header: listHeader,
        list: cellList,
        loading: _.get(listData, 'listLoading')
    }

    const addButton = (
        <div className={classes.addButtonWrapper}>
            <FlatButton
                backgroundColor="#fff"
                labelStyle={{textTransform: 'none', paddingLeft: '2px', color: '#12aaeb', fontSize: '13px'}}
                className={classes.addButton}
                label={t('добавить оборудование')}
                onTouchTap={createDialog.handleOpenCreateDialog}
                icon={<ContentAdd color="#12aaeb"/>}>
            </FlatButton>
        </div>
    )

    return (
        <Container>
            <div className={classes.wrapper}>
                <SettingSideMenu currentUrl={ROUTES.CELL_LIST_URL}/>
                <div className={classes.rightPanel}>
                    <GridList
                        filter={filter}
                        list={list}
                        detail={cellDetail}
                        actionsDialog={actions}
                        addButton={addButton}
                        listShadow={false}
                    />
                </div>
            </div>

            <CellCreateDialog
                isUpdate={true}
                initialValues={updateDialog.initialValues}
                open={updateDialog.openUpdateDialog}
                loading={updateDialog.updateLoading}
                onClose={updateDialog.handleCloseUpdateDialog}
                onSubmit={updateDialog.handleSubmitUpdateDialog}
            />

            <CellCreateDialog
                open={createDialog.openCreateDialog}
                loading={createDialog.createLoading}
                onClose={createDialog.handleCloseCreateDialog}
                onSubmit={createDialog.handleSubmitCreateDialog}
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

CellGridList.propTypes = {
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
    confirmDialog: PropTypes.shape({
        confirmLoading: PropTypes.bool.isRequired,
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
    }).isRequired
}

export default CellGridList
