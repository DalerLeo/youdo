import ManufactureProductWrapper from './ProductWrapper'
import ManufacturePersonWrapper from './PersonWrapper'
import ManufactureEquipmentWrapper from './EquipmentWrapper'
import ManufactureShipmentWrapper from './ShipmentWrapper'
import ManufacturesList from './ManufacturesList'
import {OPEN_USER_CREATE_DIALOG} from './ManufactureAddStaffDialog'
import {MANUFACTURE_SHOW_BOM_DIALOG_OPEN} from './ManufactureShowBom'
import {MANUFACTURE_ADD_PRODUCT_DIALOG_OPEN} from './ManufactureAddProductDialog'
import {MANUFACTURE_EDIT_PRODUCT_DIALOG_OPEN} from './ManufactureEditProductDialog'

const OPEN_FILTER = 'openFilter'
const OPEN_DELETE_PRODUCT_DIALOG = 'openDeleteDialog'
const OPEN_USER_UPDATE_DIALOG = 'openUpdateDialog'
const MANUFACTURE_CREATE_PRODUCT_DIALOG_OPEN = 'createMaterials'
const OPEN_DELETE_MATERIALS_DIALOG = 'openDeleteIngredient'
const OPEN_USER_CONFIRM_DIALOG = 'openUserDeleteDialog'
const MANUFACTURE_CHANGE = 'openChangeManufacture'
const OPEN_ADD_PRODUCT_MATERIAL_DIALOG = 'openProductMaterialDialog'
const TYPE_PRODUCT = 'product'
const TYPE_RAW = 'raw'

export {
    OPEN_FILTER,
    OPEN_USER_CREATE_DIALOG,
    MANUFACTURE_SHOW_BOM_DIALOG_OPEN,
    MANUFACTURE_ADD_PRODUCT_DIALOG_OPEN,
    MANUFACTURE_CREATE_PRODUCT_DIALOG_OPEN,
    MANUFACTURE_EDIT_PRODUCT_DIALOG_OPEN,
    OPEN_DELETE_PRODUCT_DIALOG,
    OPEN_USER_CONFIRM_DIALOG,
    OPEN_USER_UPDATE_DIALOG,
    OPEN_DELETE_MATERIALS_DIALOG,
    OPEN_ADD_PRODUCT_MATERIAL_DIALOG,
    MANUFACTURE_CHANGE,
    TYPE_PRODUCT,
    TYPE_RAW,
    ManufactureProductWrapper,
    ManufacturePersonWrapper,
    ManufactureEquipmentWrapper,
    ManufactureShipmentWrapper,
    ManufacturesList
}
