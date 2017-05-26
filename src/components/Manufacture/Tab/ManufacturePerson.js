import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import ModEditorIcon from 'material-ui/svg-icons/editor/mode-edit'
import FloatButton from 'material-ui/FlatButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import ContentAdd from 'material-ui/svg-icons/content/add'
import Edit from 'material-ui/svg-icons/image/edit'
import UsersFilterForm from '../../Users/UsersFilterForm'
import GridList from '../../GridList'

const listHeader = [
    {
        sorting: true,
        name: 'name',
        title: 'Наименование',
        xs: 3
    },
    {
        sorting: true,
        name: 'type',
        title: 'Тип товара',
        xs: 3
    },
    {
        sorting: true,
        name: 'brand',
        title: 'Бренд',
        xs: 2
    },
    {
        sorting: true,
        name: 'measurement',
        title: 'Мера',
        xs: 2
    },
    {
        sorting: true,
        name: 'created_date',
        title: 'Дата создания',
        xs: 2
    }
]

const ManufacturePerson = (props) => {
    const {personData} = props

    const filter = _.get(personData, 'filter')
    const filterDialog = _.get(personData, 'filterDialog')

    const personFilterDialog = (
        <UsersFilterForm
            initialValues={filterDialog.initialValues}
            filter={filter}
            filterDialog={filterDialog}
        />
    )

    const actions = (
        <div>
            <IconButton>
                {/* OnTouchTap={actionsDialog.handleActionEdit} */}
                <ModEditorIcon />
            </IconButton>

            <IconButton>
                {/* OnTouchTap={actionsDialog.handleActionDelete} */}
                <DeleteIcon />
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
        const name = _.get(item, ['user', 'firstName']) + _.get(item, ['user', 'secondName'])
        const shift = _.get(item, 'name')
        const beginTime = _.get(item, 'beginTime')
        const endTime = _.get(item, 'endTime')
        const iconButton = (
            <IconButton style={{padding: '0 12px'}}>
                <MoreVertIcon />
            </IconButton>
        )
        return (
            <Row key={id}>
                <Col xs={1}>{id}</Col>
                <Col xs={3}>{name}</Col>
                <Col xs={3}>{shift}</Col>
                <Col xs={2}>{beginTime}</Col>
                <Col xs={2}>{endTime}</Col>
                <Col xs={1} style={{textAlign: 'right'}}>
                    <IconMenu
                        iconButtonElement={iconButton}
                        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                        targetOrigin={{horizontal: 'right', vertical: 'top'}}>
                        <MenuItem
                            primaryText="Изменить"
                            leftIcon={<Edit />}
                            onTouchTap={() => {
                                updateDialog.handleOpenUpdateDialog(id)
                            }}
                        />
                        <MenuItem
                            primaryText="Удалить "
                            leftIcon={<DeleteIcon />}
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

    const createDialog = _.get(personData, 'createDialog')

    return (
        <Row>
            <Col xs={12}>
                <div>
                    <FloatButton onClick={createDialog.handleOpenDialog}>
                        <ContentAdd style={{height: '13px', width: '13px', color: 'rgb(18, 170, 235)'}}
                                    viewBox="0 0 24 15"/>
                        добавить продукцию
                    </FloatButton>
                </div>
                <GridList
                    filter={filter}
                    list={personListExp}
                    detail={detail}
                    actionsDialog={actions}
                    filterDialog={personFilterDialog}
                />
            </Col>
        </Row>
    )
}

ManufacturePerson.propTypes = {
    personData: PropTypes.object.isRequired
}

export default ManufacturePerson

