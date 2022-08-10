import { GridLocaleText } from '@mui/x-data-grid';

export const GRID_DEFAULT_LOCALE_TEXT: GridLocaleText = {
  // Root
  noRowsLabel: 'No rows',
  noResultsOverlayLabel: 'No results found.',
  errorOverlayDefaultLabel: 'An error occurred.',

  // Density selector toolbar button text
  toolbarDensity: '行高',
  toolbarDensityLabel: '行高',
  toolbarDensityCompact: '紧凑',
  toolbarDensityStandard: '中等',
  toolbarDensityComfortable: '宽敞',

  // Columns selector toolbar button text
  toolbarColumns: '列表菜单',
  toolbarColumnsLabel: '选择列',

  // Filters toolbar button text
  toolbarFilters: '过滤器',
  toolbarFiltersLabel: '显示过滤器',
  toolbarFiltersTooltipHide: '隐藏过滤器',
  toolbarFiltersTooltipShow: '显示过滤器',
  toolbarFiltersTooltipActive: (count) => (count !== 1 ? `${count} active filters` : `${count} active filter`),

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'Search...',
  toolbarQuickFilterLabel: 'Search',
  toolbarQuickFilterDeleteIconLabel: 'Clear',

  // Export selector toolbar button text
  toolbarExport: '导出',
  toolbarExportLabel: '导出',
  toolbarExportCSV: '导出CSV',
  toolbarExportPrint: '打印',
  toolbarExportExcel: '导出Excel',

  // Columns panel text
  columnsPanelTextFieldLabel: '过滤显示列表',
  columnsPanelTextFieldPlaceholder: '请输入列标题',
  columnsPanelDragIconLabel: '重新排序列',
  columnsPanelShowAllButton: '全部显示',
  columnsPanelHideAllButton: '全部隐藏',

  // Filter panel text
  filterPanelAddFilter: 'Add filter',
  filterPanelDeleteIconLabel: 'Delete',
  filterPanelLinkOperator: 'Logic operator',
  filterPanelOperators: '条件', // TODO v6: rename to filterPanelOperator
  filterPanelOperatorAnd: 'And',
  filterPanelOperatorOr: 'Or',
  filterPanelColumns: '选择列',
  filterPanelInputLabel: '值',
  filterPanelInputPlaceholder: '过滤值',

  // Filter operators text
  filterOperatorContains: '包含',
  filterOperatorEquals: '等于',
  filterOperatorStartsWith: '以开头',
  filterOperatorEndsWith: '以结尾',
  filterOperatorIs: 'is',
  filterOperatorNot: 'is not',
  filterOperatorAfter: 'is after',
  filterOperatorOnOrAfter: 'is on or after',
  filterOperatorBefore: 'is before',
  filterOperatorOnOrBefore: 'is on or before',
  filterOperatorIsEmpty: '空值',
  filterOperatorIsNotEmpty: '非空值',
  filterOperatorIsAnyOf: '任何值',

  // Filter values text
  filterValueAny: 'any',
  filterValueTrue: 'true',
  filterValueFalse: 'false',

  // Column menu text
  columnMenuLabel: 'Menu',
  columnMenuShowColumns: '打开列表菜单',
  columnMenuFilter: '过滤',
  columnMenuHideColumn: '隐藏',
  columnMenuUnsort: '取消排序',
  columnMenuSortAsc: '按照升序排序',
  columnMenuSortDesc: '按降序排序',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) => (count !== 1 ? `${count} active filters` : `${count} active filter`),
  columnHeaderFiltersLabel: 'Show filters',
  columnHeaderSortIconLabel: 'Sort',

  // Rows selected footer text
  footerRowSelected: (count) =>
    count !== 1 ? `已选中${count.toLocaleString()}行` : `已选中${count.toLocaleString()}行`,

  // Total row amount footer text
  footerTotalRows: 'Total Rows:',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} of ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: '复选框选择',
  checkboxSelectionSelectAllRows: 'Select all rows',
  checkboxSelectionUnselectAllRows: 'Unselect all rows',
  checkboxSelectionSelectRow: 'Select row',
  checkboxSelectionUnselectRow: 'Unselect row',

  // Boolean cell text
  booleanCellTrueLabel: 'yes',
  booleanCellFalseLabel: 'no',

  // Actions cell more text
  actionsCellMore: 'more',

  // Column pinning text
  pinToLeft: 'Pin to left',
  pinToRight: 'Pin to right',
  unpin: 'Unpin',

  // Tree Data
  treeDataGroupingHeaderName: 'Group',
  treeDataExpand: 'see children',
  treeDataCollapse: 'hide children',

  // Grouping columns
  groupingColumnHeaderName: 'Group',
  groupColumn: (name) => `Group by ${name}`,
  unGroupColumn: (name) => `Stop grouping by ${name}`,

  // Master/detail
  detailPanelToggle: 'Detail panel toggle',
  expandDetailPanel: 'Expand',
  collapseDetailPanel: 'Collapse',

  // Used core components translation keys
  MuiTablePagination: {},

  // Row reordering text
  rowReorderingHeaderName: 'Row reordering'
};
