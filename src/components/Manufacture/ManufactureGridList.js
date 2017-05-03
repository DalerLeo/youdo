import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import ModEditorIcon from 'material-ui/svg-icons/editor/mode-edit'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import * as ROUTES from '../../constants/routes'
import GridList from '../GridList'
import Container from '../Container'
import ManufactureAddStaffDialog from './ManufactureAddStaffDialog'
import DeleteDialog from '../DeleteDialog'
import ConfirmDialog from '../ConfirmDialog'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import Tooltip from '../ToolTip'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import ContentAdd from 'material-ui/svg-icons/content/add'
import Edit from 'material-ui/svg-icons/image/edit'

const listHeader = [
    {
        sorting: true,
        name: 'id',
        xs: 2,
        title: 'Id'
    },
    {
        sorting: true,
        name: 'name',
        xs: 6,
        title: 'Наименование'
    },
    {
        sorting: true,
        xs: 3,
        name: 'created_date',
        title: 'Дата создания'
    },
    {
        sorting: false,
        xs: 1,
        name: 'actions',
        title: ''
    }
]

const enhance = compose(
    injectSheet({
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
        productionMainRow: {
            margin: '0 -26px;',
            fontSize: '13px',
            '& a': {
                color: 'rgb(18, 170, 235)'
            }
        },
        productionLeftSide: {
            background: '#fcfcfc',
            borderRight: '1px solid #efefef',
            height: 'calc(100vh - 65px)',
            padding: '0'
        },
        productionRightSide: {
            background: '#fff',
            height: 'calc(100vh - 65px)',
            padding: '0 30px'
        },
        productionUl: {
            listStyle: 'none',
            margin: '0',
            padding: '0',
            '& li:last-child': {
                border: 'none'
            }
        },
        productionTypeLi: {
            margin: '0',
            padding: '20px 30px',
            borderBottom: '1px solid #efefef'
        },
        productionH2: {
            fontSize: '13px',
            fontWeight: 'bold',
            margin: '0',
            borderBottom: '1px solid #efefef',
            padding: '20px 30px'
        },
        productionRightH2: {
            fontSize: '13px',
            fontWeight: 'bold',
            margin: '0',
            borderBottom: '1px solid #efefef',
            padding: '20px 0'
        },

        productionStaffGroupTitle: {
            margin: '0',
            borderBottom: '1px dashed #efefef',
            padding: '20px 0 10px 0',
            '& p': {
                margin: '0',
                display: 'inline-block'
            },
            '& span': {
                color: '#999',
                float: 'right',
                fontSize: '12px',
                marginTop: '1px'
            }
        },
        productionStaff: {
            margin: '0',
            borderBottom: '1px dashed #efefef',
            padding: '10px 0 10px 0',
            '& div:first-child': {
                width: '30px',
                height: '30px',
                display: 'inline-block',
                borderRadius: '50%',
                verticalAlign: 'top',
                marginRight: '10px'
            },
            '& div:first-child img': {
                width: '30px'
            },
            '& div:last-child': {
                display: 'inline-block',
                verticalAlign: 'top'
            },
            '& div:last-child span': {
                color: '#666'
            }
        },
        productionEquipment: {
            padding: '20px 0',
            borderBottom: '1px solid #efefef'
        },
        productionEquipmentElement: {
            background: '#f2f5f8',
            textAlign: 'center',
            padding: '20px 30px'
        }

    })
)

const ManufactureGridList = enhance((props) => {
    const {
        filter,
        createDialog,
        updateDialog,
        actionsDialog,
        confirmDialog,
        deleteDialog,
        addStaff,
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
    const manufactureDetail = (
        <span>a</span>
    )

    const manufactureList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const createdDate = moment(_.get(item, 'createdDate')).format('DD.MM.YYYY')
        const iconButton = (
            <IconButton style={{padding: '0 12px', height: 'auto'}}>
                <MoreVertIcon />
            </IconButton>
        )
        return (
            <Row key={id} style={{alignItems: 'center'}}>
                <Col xs={2}>{id}</Col>
                <Col xs={6}>{name}</Col>
                <Col xs={3}>{createdDate}</Col>
                <Col xs={1} style={{textAlign: 'right'}}>
                    <IconMenu
                        iconButtonElement={iconButton}
                        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                        targetOrigin={{horizontal: 'right', vertical: 'top'}}>
                        <MenuItem
                            primaryText="Изменить"
                            leftIcon={<Edit />}
                            onTouchTap={() => { updateDialog.handleOpenUpdateDialog(id) }}
                        />
                        <MenuItem
                            primaryText="Удалить "
                            leftIcon={<DeleteIcon />}
                            onTouchTap={confirmDialog.handleOpenConfirmDialog}
                        />
                    </IconMenu>
                </Col>
            </Row>
        )
    })

    const list = {
        header: listHeader,
        list: manufactureList,
        loading: _.get(listData, 'listLoading')
    }

    return (
        <Container>
            <SubMenu url={ROUTES.MANUFACTURE_LIST_URL}/>
            <ManufactureAddStaffDialog
                open={addStaff.open}
                loading={createDialog.createLoading}
                onClose={addStaff.handleClose}
                onSubmit={createDialog.handleSubmitCreateDialog}
            />
            <Row className={classes.productionMainRow}>
                <Col xs={3} className={classes.productionLeftSide}>
                    <h2 className={classes.productionH2}>Этапы производства</h2>
                    <ul className={classes.productionUl}>
                        <li className={classes.productionTypeLi}>
                            Производство клея
                        </li>
                        <li className={classes.productionTypeLi}>
                            Производство втулок
                        </li>
                        <li className={classes.productionTypeLi}>
                            Производство рулонов
                        </li>
                        <li className={classes.productionTypeLi}>
                            Резка рулонов
                        </li>
                        <li className={classes.productionTypeLi}>
                            Нанесение логотипа
                        </li>
                    </ul>
                </Col>
                <Col xs={9} className={classes.productionRightSide}>
                    <Row>
                        <Col xs={12}>
                            <h2 className={classes.productionRightH2}>Производство клея</h2>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={4} style={{borderRight: '1px solid #efefef', height: 'calc(100vh - 120px)', padding: '20px 30px 20px 10px'}}>
                            <div>
                                <h3 style={{display: 'inline-block', fontSize: '13px', fontWeight: '600', margin: '0'}}>Персонал</h3>
                                <a style={{float: 'right'}} onClick={addStaff.handleOpen}> <ContentAdd />добавить</a>
                            </div>
                            <div style={{marginBottom: '10px'}}>
                                <div className={classes.productionStaffGroupTitle}>
                                    <p>Смена А</p>
                                    <span>График: 09:00 - 18:00</span>
                                </div>
                                <ul className={classes.productionUl}>
                                    <li className={classes.productionStaff}>
                                        <div>
                                            <img src />
                                        </div>
                                        <div>
                                            Атамбаев Бекзод<br />
                                            <span>Должность</span>
                                        </div>
                                    </li>
                                    <li className={classes.productionStaff}>
                                        <div>
                                            <img src />
                                        </div>
                                        <div>
                                            Атамбаев Бекзод<br />
                                            <span>Должность</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div style={{marginBottom: '10px'}}>
                                <div className={classes.productionStaffGroupTitle}>
                                    <p>Смена Б</p>
                                    <span>График: 09:00 - 18:00</span>
                                </div>
                                <ul className={classes.productionUl}>
                                    <li className={classes.productionStaff}>
                                        <div>
                                            <img src />
                                        </div>
                                        <div>
                                            Атамбаев Бекзод<br />
                                            <span>Должность</span>
                                        </div>
                                    </li>
                                    <li className={classes.productionStaff}>
                                        <div>
                                            <img src />
                                        </div>
                                        <div>
                                            Атамбаев Бекзод<br />
                                            <span>Должность</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </Col>
                        <Col xs={8} style={{padding: '20px 25px'}}>
                            <Row>
                                <Col xs={12}>
                                    <h3 style={{display: 'inline-block', fontSize: '13px', fontWeight: '600', margin: '0'}}>Оборудование</h3>
                                    <Row className={classes.productionEquipment}>
                                        <Col xs={4}>
                                            <div className={classes.productionEquipmentElement}>
                                                Название оборудования
                                            </div>
                                        </Col>
                                        <Col xs={4}>
                                            <div className={classes.productionEquipmentElement}>
                                                Название оборудования
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12}>
                                    <h3 style={{display: 'inline-block', fontSize: '13px', fontWeight: '600', margin: '0', padding: '20px 0 10px'}}>Список производимой продукции</h3>
                                </Col>
                            </Row>
                            <Row style={{borderBottom: '1px dashed #efefef', padding: '10px 0'}}>
                                <Col xs={8}>
                                    <strong>Название продукта</strong><br />
                                    <span>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</span>
                                </Col>
                                <Col xs={4} style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                                    <a href="#" style={{borderBottom: '1px dashed rgb(18, 170, 235)'}}>BoM </a>
                                    <a href="#"> ic</a>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>

        </Container>
    )
})

ManufactureGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    tabData: PropTypes.object.isRequired,
    createDialog: PropTypes.shape({
        createLoading: PropTypes.bool.isRequired,
        openCreateDialog: PropTypes.bool.isRequired,
        handleOpenCreateDialog: PropTypes.func.isRequired,
        handleCloseCreateDialog: PropTypes.func.isRequired,
        handleSubmitCreateDialog: PropTypes.func.isRequired
    }).isRequired,
    confirmDialog: PropTypes.shape({
        openConfirmDialog: PropTypes.bool.isRequired,
        handleOpenConfirmDialog: PropTypes.func.isRequired,
        handleCloseConfirmDialog: PropTypes.func.isRequired,
        handleSendConfirmDialog: PropTypes.func.isRequired
    }).isRequired,
    deleteDialog: PropTypes.shape({
        openDeleteDialog: PropTypes.bool.isRequired,
        handleOpenDeleteDialog: PropTypes.func.isRequired,
        handleCloseDeleteDialog: PropTypes.func.isRequired
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
    }).isRequired,
    addStaff: PropTypes.shape({
        open: PropTypes.bool.isRequired,
        handleOpen: PropTypes.func.isRequired,
        handleClose: PropTypes.func.isRequired
    }).isRequired
}

export default ManufactureGridList
