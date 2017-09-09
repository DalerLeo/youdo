import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import IconButton from 'material-ui/IconButton'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import ModEditorIcon from 'material-ui/svg-icons/editor/mode-edit'
import FlatButton from 'material-ui/FlatButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import ContentAdd from 'material-ui/svg-icons/content/add'
import Edit from 'material-ui/svg-icons/image/edit'
import PersonFilterForm from '../PersonFilterForm'
import ManufactureAddStaffDialog from '../ManufactureAddStaffDialog'
import ConfirmDialog from '../../ConfirmDialog'
import GridList from '../../GridList'
import moment from 'moment'
import Paper from 'material-ui/Paper'
import Choose from '../../Images/choose-menu.png'

const listHeader = [
    {
        sorting: false,
        name: 'name',
        title: 'Сотрудник',
        xs: 4
    },
    {
        sorting: false,
        name: 'position',
        title: 'Должность',
        xs: 3
    },
    {
        sorting: true,
        name: 'shift',
        title: 'Смена',
        xs: 3
    },
    {
        sorting: false,
        name: 'time',
        title: 'Время',
        xs: 3
    },
    {
        sorting: false,
        name: 'action',
        title: '',
        xs: 2
    }
]

const enhance = compose(
    injectSheet({
        listRow: {
            cursor: 'pointer',
            width: 'auto !important',
            margin: '0 -30px !important',
            padding: '0 30px'
        },
        imgContent: {
            '& img': {
                width: '33%',
                margin: '1px'
            },
            height: '390px',
            overflowY: 'scroll'
        },
        cursor: {
            cursor: 'pointer'
        },
        choose: {
            background: 'url(' + Choose + ') no-repeat center 50px',
            backgroundSize: '200px',
            marginTop: '20px',
            padding: '245px 0 30px',
            textAlign: 'center',
            fontSize: '15px',
            color: '#666 !important'
        }
    })
)

const ManufacturePerson = enhance((props) => {
    const {personData, classes, manufactureId} = props

    const ZERO = 0
    const filter = _.get(personData, 'filter')
    const filterDialog = _.get(personData, 'filterDialog')

    const personFilterDialog = (
        <PersonFilterForm
            initialValues={filterDialog.initialValues}
            filter={filter}
            filterDialog={filterDialog}
        />
    )

    const actions = (
        <div>
            <IconButton>
                <ModEditorIcon/>
            </IconButton>

            <IconButton>
                <DeleteIcon/>
            </IconButton>
        </div>
    )

    const detail = (
        <span>a</span>
    )
    const updateDialog = _.get(personData, 'updateDialog')
    const confirmDialog = _.get(personData, 'confirmDialog')

    const personList = _.map(_.get(personData, ['list', 'results']), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, ['user', 'firstName']) + ' ' + _.get(item, ['user', 'secondName'])
        const shift = _.get(item, 'name')
        const beginTime = moment(moment().format('YYYY-MM-DD ' + _.get(item, 'beginTime'))).format('HH:mm')
        const endTime = moment(moment().format('YYYY-MM-DD ' + _.get(item, 'endTime'))).format('HH:mm')
        const iconButton = (
            <IconButton style={{padding: '0 12px'}}>
                <MoreVertIcon/>
            </IconButton>
        )
        return (
            <Row key={id}>
                <Col xs={4}>{name}</Col>
                <Col xs={3}>{shift}</Col>
                <Col xs={3}>{beginTime} - {endTime}</Col>
                <Col xs={2} style={{textAlign: 'right'}}>
                    <IconMenu
                        iconButtonElement={iconButton}
                        menuItemStyle={{fontSize: '13px'}}
                        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                        targetOrigin={{horizontal: 'right', vertical: 'top'}}>
                        <MenuItem
                            primaryText="Изменить"
                            leftIcon={<Edit/>}
                            onTouchTap={() => {
                                updateDialog.handleOpenUpdateDialog(id)
                            }}
                        />
                        <MenuItem
                            primaryText="Удалить "
                            leftIcon={<DeleteIcon/>}
                            onTouchTap={() => {
                                confirmDialog.handleOpenConfirmDialog(id)
                            }}
                        />
                    </IconMenu>
                </Col>
            </Row>
        )
    })

    const personListExp = {
        header: listHeader,
        list: personList,
        loading: _.get(personData, 'listLoading')
    }

    const userCreate = _.get(personData, 'createDialog')
    const userUpdate = _.get(personData, 'updateDialog')
    const userConfirm = _.get(personData, 'confirmDialog')

    if (manufactureId <= ZERO) {
        return (
            <Paper zDepth={1} className={classes.choose}>
                <div>Выберите производство...</div>
            </Paper>
        )
    }

    return (
        <div>
            <div style={{padding: '10px 0', textAlign: 'right'}}>
                <FlatButton
                    label="Добавить сотрудников"
                    onClick={userCreate.handleOpenDialog}
                    labelStyle={{color: '#12aaeb', fontSize: '13px', textTransform: 'normal'}}
                    icon={<ContentAdd style={{width: 13, height: 13, fill: '#12aaeb'}}/>}/>
            </div>
            <GridList
                filter={filter}
                list={personListExp}
                detail={detail}
                actionsDialog={actions}
                filterDialog={personFilterDialog}
            />
            <ManufactureAddStaffDialog
                open={userCreate.open}
                onClose={userCreate.handleCloseDialog}
                onSubmit={userCreate.handleSubmitDialog}
            />
            <ManufactureAddStaffDialog
                isUpdate={true}
                initialValues={userUpdate.initialValues}
                open={userUpdate.open}
                onClose={userUpdate.handleCloseUpdateDialog}
                onSubmit={userUpdate.handleSubmitUpdateDialog}
            />
            {_.get(personData, 'userShiftItem') && <ConfirmDialog
                type="delete"
                message={_.get(_.get(personData, ['userShiftItem', 'user']), 'firstName') +
                ' ' + _.get(_.get(personData, ['userShiftItem', 'user']), 'secondName')}
                onClose={userConfirm.handleCloseConfirmDialog}
                onSubmit={userConfirm.handleSendConfirmDialog}
                open={userConfirm.open}
            />}
        </div>
    )
})

ManufacturePerson.propTypes = {
    personData: PropTypes.object.isRequired
}

export default ManufacturePerson

