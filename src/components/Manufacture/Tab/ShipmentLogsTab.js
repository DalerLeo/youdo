import React from 'react'
import {change, Field} from 'redux-form'
import {hashHistory} from 'react-router'
import _ from 'lodash'
import t from '../../../helpers/translate'
import dateTimeFormat from '../../../helpers/dateTimeFormat'
import numberFormat from '../../../helpers/numberFormat'
import {normalizeNumber, TextField} from '../../ReduxForm'
import {Row, Col} from 'react-flexbox-grid'
import Loader from '../../Loader'
import ToolTip from '../../ToolTip'
import {PRODUCT, MATERIAL} from '../index'
import Person from 'material-ui/svg-icons/social/person'
import Product from '../../CustomIcons/Product'
import IconButton from 'material-ui/IconButton'
import Check from 'material-ui/svg-icons/navigation/check'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import EditIcon from 'material-ui/svg-icons/editor/mode-edit'
import Defected from 'material-ui/svg-icons/image/broken-image'
import Raw from 'material-ui/svg-icons/action/exit-to-app'
import Pagination from '../../GridList/GridListNavPagination'

const iconStyles = {
    product: {
        width: 20,
        height: 20,
        color: '#81c784'
    },
    material: {
        width: 20,
        height: 20,
        color: '#999'
    },
    defected: {
        width: 20,
        height: 20,
        color: '#e57373'
    },
    icon: {
        color: '#666',
        width: 22,
        height: 22
    },
    button: {
        width: 30,
        height: 30,
        padding: 0
    },
    user: {
        marginRight: '5px',
        color: '#888',
        width: 22,
        height: 22
    }
}

class ShipmentLogs extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            editItem: null
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleOpenEdit = this.handleOpenEdit.bind(this)
    }

    handleOpenEdit (type, id) {
        const {dispatch, filter} = this.props
        this.setState({
            editItem: id
        })
        dispatch(change('LogEditForm', 'editAmount', ''))
        hashHistory.push(filter.createURL({openType: type, openId: id}))
    }

    handleSubmit () {
        this.setState({
            editItem: null
        })
        this.props.handleEditProductAmount()
    }

    render () {
        const {list, classes, loading, filter, handleOpenDelete, editLoading} = this.props
        const {editItem} = this.state
        const openID = _.toInteger(filter.getParam('openId'))
        const logs = _.map(list, (item, index) => {
            const measurement = _.get(item, ['product', 'measurement', 'name'])
            const product = _.get(item, ['product', 'name'])
            const createdDate = dateTimeFormat(_.get(item, 'createdDate'))
            const amount = _.get(item, 'amount')
            const type = _.get(item, 'type')
            const id = _.get(item, 'id')
            const kind = _.get(item, 'kind')
            const isDefect = _.get(item, 'isDefect')
            const userName = _.get(item, ['user', 'firstName']) + ' ' + _.get(item, ['user', 'firstName'])
            const isTransferred = _.get(item, ['personalRotation', 'isTransferred'])
            return (
                <Row key={index} className={isDefect ? classes.productDefected : classes.product}>
                    <Col xs={4} style={{display: 'flex'}}>
                        <ToolTip position="left" text={'Создал: ' + userName}>
                            <Person style={iconStyles.user}/>
                        </ToolTip>
                        {type === PRODUCT
                            ? <span>
                        {isDefect
                            ? <ToolTip position="left" text={t('Брак')}><Defected style={iconStyles.defected}/></ToolTip>
                            : kind === MATERIAL
                                ? <Material style={iconStyles.material}/>
                                : <Product style={iconStyles.product}/>
                        }
                                {product}
                        </span>
                            : <span>
                            <ToolTip position="left" text={t(isDefect ? 'Брак' : '')}>
                                <Raw style={isDefect ? iconStyles.defected : iconStyles.material}/>
                            </ToolTip>
                                {product}
                        </span>}
                    </Col>
                    <Col xs={2}>
                        {type === PRODUCT
                            ? (kind === MATERIAL)
                                ? t('Материал')
                                : t('Продукт')
                            : t('Сырье')}
                    </Col>
                    {editItem === id
                        ? <Col xs={2}>
                            <Field
                                className={classes.inputFieldCustom}
                                fullWidth={true}
                                component={TextField}
                                name={'editAmount'}
                                normalize={normalizeNumber}
                                hintText={numberFormat(amount, measurement)}/>
                        </Col>
                        : <Col xs={2}>
                            {editLoading && (openID === id)
                                ? <div className={classes.load}><Loader size={0.5}/></div>
                                : numberFormat(amount, measurement)}
                        </Col>}
                    <Col xs={4} style={{position: 'relative', paddingRight: '78px'}}>{createdDate}
                        <div style={{position: 'absolute', top: '-5px', right: '0'}}>
                            {editItem === id
                                ? <div>
                                    <IconButton
                                        iconStyle={iconStyles.icon}
                                        style={iconStyles.button}
                                        disableTouchRipple={true}
                                        onTouchTap={() => this.handleSubmit()}>
                                        <Check color="#12aaeb"/>
                                    </IconButton>
                                </div>
                                : <div className={classes.actionButtons}>
                                    <ToolTip position="bottom" text={isTransferred ? t('Уже передан') : t('Изменить')}>
                                        <IconButton
                                            iconStyle={iconStyles.icon}
                                            disabled={isTransferred}
                                            style={iconStyles.button}
                                            disableTouchRipple={true}
                                            onTouchTap={() => this.handleOpenEdit(type, id)}
                                            touch={true}>
                                            <EditIcon/>
                                        </IconButton>
                                    </ToolTip>
                                    <ToolTip position="bottom" text={isTransferred ? t('Уже передан') : t('Удалить')}>
                                        <IconButton
                                            disableTouchRipple={true}
                                            disabled={isTransferred}
                                            iconStyle={iconStyles.icon}
                                            style={iconStyles.button}
                                            onTouchTap={() => handleOpenDelete(item, type, id)}
                                            touch={true}>
                                            <DeleteIcon/>
                                        </IconButton>
                                    </ToolTip>
                                </div>}
                        </div>
                    </Col>

                </Row>
            )
        })

        return (
            !_.isEmpty(list)
                ? <div className={classes.productsBlock}>
                <div className={classes.pagination}>
                    <Pagination filter={filter}/>

                </div>
                <Row className={classes.flexTitle}>
                    <Col xs={4}><h4>{t('Продукт / сырье')}</h4></Col>
                    <Col xs={2}><h4>{t('Тип')}</h4></Col>
                    <Col xs={2}><h4>{t('Кол-во')}</h4></Col>
                    <Col xs={4} style={{paddingRight: '78px'}}><h4>{t('Дата, время')}</h4></Col>
                </Row>
                {loading
                    ? <div className={classes.loader}>
                        <Loader size={0.75}/>
                    </div>
                    : logs}
            </div>
                : loading
                ? <div className={classes.loader}>
                    <Loader size={0.75}/>
                </div>
                : <div className={classes.emptyQuery}>
                    <div>{t('Нет записей в данной смене')}</div>
                </div>
        )
    }
}

export default ShipmentLogs
