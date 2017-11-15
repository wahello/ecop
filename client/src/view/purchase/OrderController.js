Ext.define('Ecop.view.purchase.OrderController', {
  extend: 'Ecop.view.sales.OrderControllerBase',
  alias: 'controller.po-order',

  orderType: 'P',
  rpcSaveMethod: 'order.purchase.upsert',

  init: function() {
    var me = this,
      vm = me.getViewModel()

    me.callParent()

    vm.get('orders').on({
      load: function(store) {
        if (store.getCount()) {
          // Use select method directly here will not work since the store change
          // has not yet be reflected in the grid yet
          setTimeout(function() {
            me
              .lookup('orderlist')
              .getSelectionModel()
              .select(0)
          }, 500)
        } else {
          me.addNewOrder()
        }
      }
    })
    vm.bind('{orderEditable}', 'onOrderEditableChange', me)
    me.refreshPOList()
  },

  getOrderForm: function() {
    return this.getView().getForm()
  },

  loadOrder: function() {
    var me = this,
      vm = me.getViewModel(),
      order = me.getCurrentOrder()

    Web.data.JsonRPC.request({
      method: 'order.purchase.data',
      params: [order.getId()],
      success: function(ret) {
        me.setOrderData(ret)
      }
    })
  },

  addNewOrder: function() {
    var me = this,
      vm = me.getViewModel(),
      so = vm.get('relatedOrder')

    po = Ext.create('Web.model.Order')
    po.set({
      relatedOrderId: so.get('orderId'),
      customerId: so.get('customerId'),
      recipientName: so.get('recipientName'),
      regionCode: so.get('regionCode'),
      streetAddress: so.get('streetAddress'),
      recipientMobile: so.get('recipientMobile'),
      recipientPhone: so.get('recipientPhone'),
      orderStatus: 1
    })
    vm.set('currentOrder', po)
    // clear any leftover from last order
    vm.get('items').removeAll()
    vm.set('originalStatus', 1)
  },

  refreshPOList: function() {
    var me = this,
      vm = me.getViewModel()

    me
      .lookup('orderlist')
      .getSelectionModel()
      .deselectAll()
    vm.get('orders').load({ params: [vm.get('relatedOrder').get('orderId')] })
  },

  onPOSelect: function(rowmodel, record) {
    var me = this
    me.getViewModel().set('currentOrder', record)
    me.loadOrder()
  },

  /*
   * When `orderEditable` from view model is changed, update the grid view
   * plugins to be readonly
   */
  onOrderEditableChange: function(editable) {
    var me = this,
      grid = me.lookup('itemsGrid')

    if (editable) {
      grid.getView().plugins[0].enable()
      grid.getPlugin('edit').enable()
    } else {
      grid.getView().plugins[0].disable()
      grid.getPlugin('edit').disable()
    }
  },

  onOrderItemRightClick: function(table, record, tr, rowIndex, e) {
    var me = this,
      menu

    e.preventDefault()
    if (!me.contextMenu) {
      me.contextMenu = Ext.widget('menu', {
        width: 100,
        plain: true,

        viewModel: me.getViewModel(),

        items: [
          {
            itemId: 'removeItem',
            text: '删除订单项目',
            hidden: true,
            bind: {
              hidden: '{!orderEditable}'
            }
          }
        ],
        listeners: {
          click: me.onContextMenuClick,
          scope: me
        }
      })
    }

    me.contextMenu.showAt(e.getXY()).focus()
  },

  onContextMenuClick: function(menu, menuItem) {
    var me = this,
      itemsGrid = this.lookup('itemsGrid'),
      menuId = menuItem.getItemId()

    if (menuId === 'removeItem') {
      itemsGrid.getStore().remove(itemsGrid.getSelection()[0])
      // refresh the row number
      itemsGrid.getView().refresh()
    }
  },

  doSaveOrder: function() {
    var me = this,
      vm = me.getViewModel(),
      store = vm.get('orders'),
      order = vm.get('currentOrder')

    me.callParent([
      function() {
        // if the currently saved order is not in orders store, add it
        if (store.indexOf(order) === -1) {
          store.add(order)
        }
        Ecop.util.Util.showInfo('订单保存成功!')
      }
    ])
  }
})
