import ManufactureGridList from './ManufactureGridList'
import ManufactureProductWrapper from './ManufactureProductWrapper'
import ManufacturePersonWrapper from './ManufacturePersonWrapper'

import {OPEN_USER_CREATE_DIALOG} from './ManufactureAddStaffDialog'
import {MANUFACTURE_SHOW_BOM_DIALOG_OPEN} from './ManufactureShowBom'
import {MANUFACTURE_ADD_PRODUCT_DIALOG_OPEN} from './ManufactureAddProductDialog'
import {MANUFACTURE_EDIT_PRODUCT_DIALOG_OPEN} from './ManufactureEditProductDialog'

const SHIFT_DELETE_DIALOG_OPEN = 'openDeleteDialog'
const USER_SHIFT_DELETE_DIALOG_OPEN = 'openUserStaffDeleteDialog'
const INGREDIENT_DELETE_DIALOG_OPEN = 'openIngredientDeleteDialog'
const OPEN_UPDATE_PRODUCT_DIALOG = 'openUpdateProductDialog'
const OPEN_DELETE_PRODUCT_DIALOG = 'openDeleteProductDialog'
const OPEN_USER_UPDATE_DIALOG = 'openUserUpdateDialog'
const MANUFACTURE_CREATE_PRODUCT_DIALOG_OPEN = 'createMaterials'
const OPEN_DELETE_MATERIALS_DIALOG = 'openDeleteIngredient'
const OPEN_USER_CONFIRM_DIALOG = 'openUserDeleteDialog'
const MANUFACTURE_CHANGE = 'openChangeManufacture'

export {
    OPEN_USER_CREATE_DIALOG,
    MANUFACTURE_SHOW_BOM_DIALOG_OPEN,
    MANUFACTURE_ADD_PRODUCT_DIALOG_OPEN,
    MANUFACTURE_CREATE_PRODUCT_DIALOG_OPEN,
    MANUFACTURE_EDIT_PRODUCT_DIALOG_OPEN,
    SHIFT_DELETE_DIALOG_OPEN,
    USER_SHIFT_DELETE_DIALOG_OPEN,
    INGREDIENT_DELETE_DIALOG_OPEN,
    OPEN_UPDATE_PRODUCT_DIALOG,
    OPEN_DELETE_PRODUCT_DIALOG,
    OPEN_USER_CONFIRM_DIALOG,
    OPEN_USER_UPDATE_DIALOG,
    OPEN_DELETE_MATERIALS_DIALOG,
    MANUFACTURE_CHANGE,
    ManufactureGridList,
    ManufactureProductWrapper,
    ManufacturePersonWrapper
}
