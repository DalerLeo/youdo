import React from 'react'

import FormatBold from 'material-ui/svg-icons/editor/format-bold'
import FormatItalic from 'material-ui/svg-icons/editor/format-italic'
import FormatUnderlined from 'material-ui/svg-icons/editor/format-underlined'

const INLINE_STYLES = [
  // ALL INLINE STYLES
  /*

    {label: 'Bold', style: 'BOLD'},
    {label: 'Italic', style: 'ITALIC'},
    {label: 'Underline', style: 'UNDERLINE'},
    {label: 'Monospace', style: 'CODE'}

    */
  // NEEDED STYLES
  {label: <FormatBold/>, style: 'BOLD'},
  {label: <FormatItalic/>, style: 'ITALIC'},
  {label: <FormatUnderlined/>, style: 'UNDERLINE'}
]

export default INLINE_STYLES
