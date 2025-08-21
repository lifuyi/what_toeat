(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["pages/index/index"],{

/***/ 34:
/*!************************************************************************************!*\
  !*** /Users/eyeopen/Downloads/wte/Uniapp/main.js?{"page":"pages%2Findex%2Findex"} ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(wx, createPage) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
__webpack_require__(/*! uni-pages */ 26);
var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 25));
var _index = _interopRequireDefault(__webpack_require__(/*! ./pages/index/index.vue */ 35));
// @ts-ignore
wx.__webpack_require_UNI_MP_PLUGIN__ = __webpack_require__;
createPage(_index.default);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js */ 1)["default"], __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["createPage"]))

/***/ }),

/***/ 35:
/*!*****************************************************************!*\
  !*** /Users/eyeopen/Downloads/wte/Uniapp/pages/index/index.vue ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index_vue_vue_type_template_id_57280228___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.vue?vue&type=template&id=57280228& */ 36);
/* harmony import */ var _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.vue?vue&type=script&lang=js& */ 38);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _index_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./index.vue?vue&type=style&index=0&lang=css& */ 45);
/* harmony import */ var _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js */ 32);

var renderjs





/* normalize component */

var component = Object(_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _index_vue_vue_type_template_id_57280228___WEBPACK_IMPORTED_MODULE_0__["render"],
  _index_vue_vue_type_template_id_57280228___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null,
  false,
  _index_vue_vue_type_template_id_57280228___WEBPACK_IMPORTED_MODULE_0__["components"],
  renderjs
)

component.options.__file = "pages/index/index.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ 36:
/*!************************************************************************************************!*\
  !*** /Users/eyeopen/Downloads/wte/Uniapp/pages/index/index.vue?vue&type=template&id=57280228& ***!
  \************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_template_id_57280228___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./index.vue?vue&type=template&id=57280228& */ 37);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_template_id_57280228___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_template_id_57280228___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_template_id_57280228___WEBPACK_IMPORTED_MODULE_0__["recyclableRender"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "components", function() { return _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_template_id_57280228___WEBPACK_IMPORTED_MODULE_0__["components"]; });



/***/ }),

/***/ 37:
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!/Users/eyeopen/Downloads/wte/Uniapp/pages/index/index.vue?vue&type=template&id=57280228& ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return recyclableRender; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "components", function() { return components; });
var components
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  var g0 = _vm.searchTerm.trim()
  var l1 = !_vm.loading
    ? _vm.__map(_vm.recommendedDishes, function (dish, index) {
        var $orig = _vm.__get_orig(dish)
        var g1 = dish.matchScore ? Math.round(dish.matchScore) : null
        var l0 = dish.cid ? _vm.splitCidTags(dish.cid) : null
        return {
          $orig: $orig,
          g1: g1,
          l0: l0,
        }
      })
    : null
  var g2 = _vm.favoriteDishes.length
  var l2 =
    g2 > 0
      ? _vm.__map(_vm.favoriteDishes, function (dish, index) {
          var $orig = _vm.__get_orig(dish)
          var g3 = dish.matchScore ? Math.round(dish.matchScore) : null
          return {
            $orig: $orig,
            g3: g3,
          }
        })
      : null
  _vm.$mp.data = Object.assign(
    {},
    {
      $root: {
        g0: g0,
        l1: l1,
        g2: g2,
        l2: l2,
      },
    }
  )
}
var recyclableRender = false
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ 38:
/*!******************************************************************************************!*\
  !*** /Users/eyeopen/Downloads/wte/Uniapp/pages/index/index.vue?vue&type=script&lang=js& ***!
  \******************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/babel-loader/lib!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./index.vue?vue&type=script&lang=js& */ 39);
/* harmony import */ var _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 39:
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!/Users/eyeopen/Downloads/wte/Uniapp/pages/index/index.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _regenerator = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/regenerator */ 40));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ 42));
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ 11));
var _api = _interopRequireDefault(__webpack_require__(/*! ../../utils/api.js */ 43));
var _config = __webpack_require__(/*! ../../utils/config.js */ 44);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var _default = {
  data: function data() {
    return {
      greeting: '早上好',
      meal: '早餐',
      currentDate: '',
      searchTerm: '',
      isSearching: false,
      loading: false,
      preferences: _objectSpread({}, _config.CONFIG.DEFAULT_PREFERENCES),
      presets: _config.CONFIG.PRESETS,
      recommendedDishes: [],
      favoriteDishes: [],
      showTestButton: true,
      // 开发环境显示测试按钮
      isDragging: false,
      draggedPoint: null,
      debounceTimer: null
    };
  },
  onLoad: function onLoad() {
    var _this = this;
    this.initializeApp();
    this.loadFavorites();
    this.fetchRecommendations();

    // 监听收藏更新事件
    uni.$on('favoritesUpdated', function () {
      _this.loadFavorites();
    });
  },
  onReady: function onReady() {
    console.log('Page ready, drawing radar chart...');
    console.log('Preferences:', this.preferences);
    this.drawRadarChart();
  },
  onUnload: function onUnload() {
    // 移除事件监听器
    uni.$off('favoritesUpdated');
  },
  methods: {
    initializeApp: function initializeApp() {
      this.updateGreeting();
      this.updateDate();
    },
    updateGreeting: function updateGreeting() {
      var hour = new Date().getHours();
      if (hour < 10) {
        this.greeting = '早上好';
        this.meal = '早餐';
      } else if (hour >= 10 && hour < 16) {
        this.greeting = '中午好';
        this.meal = '午餐';
      } else {
        this.greeting = '晚上好';
        this.meal = '晚餐';
      }
    },
    updateDate: function updateDate() {
      var now = new Date();
      var options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      };
      this.currentDate = now.toLocaleDateString('zh-CN', options);
    },
    loadFavorites: function loadFavorites() {
      try {
        var favorites = uni.getStorageSync(_config.CONFIG.STORAGE_KEYS.FAVORITES) || [];
        var searchTerm = uni.getStorageSync(_config.CONFIG.STORAGE_KEYS.INGREDIENT_SEARCH);

        // 如果有搜索词，过滤收藏列表
        if (searchTerm) {
          this.favoriteDishes = favorites.filter(function (dish) {
            return dish.ingredients.some(function (ingredient) {
              return ingredient.includes(searchTerm);
            }) || dish.name.includes(searchTerm);
          });
        } else {
          this.favoriteDishes = favorites;
        }
        uni.showToast({
          title: '收藏列表已更新',
          icon: 'success',
          duration: 1000
        });
      } catch (e) {
        console.error('Failed to load favorites:', e);
        this.favoriteDishes = [];
        uni.showToast({
          title: '加载收藏失败',
          icon: 'error',
          duration: 1000
        });
      }
    },
    selectHealthyPreset: function selectHealthyPreset() {
      this.preferences = {
        healthy: 9,
        difficulty: 2,
        vegetarian: 8,
        spicy: 2,
        sweetness: 3
      };
      uni.removeStorageSync(_config.CONFIG.STORAGE_KEYS.INGREDIENT_SEARCH);
      this.fetchRecommendations();
      this.loadFavorites();
      this.drawRadarChart();
      uni.showToast({
        title: '已选择健康模式',
        icon: 'success'
      });
    },
    selectSpicyPreset: function selectSpicyPreset() {
      this.preferences = {
        healthy: 6,
        difficulty: 3,
        vegetarian: 4,
        spicy: 9,
        sweetness: 2
      };
      uni.removeStorageSync(_config.CONFIG.STORAGE_KEYS.INGREDIENT_SEARCH);
      this.fetchRecommendations();
      this.loadFavorites();
      this.drawRadarChart();
      uni.showToast({
        title: '已选择辣味模式',
        icon: 'success'
      });
    },
    selectEasyPreset: function selectEasyPreset() {
      this.preferences = {
        healthy: 6,
        difficulty: 1,
        vegetarian: 5,
        spicy: 4,
        sweetness: 5
      };
      uni.removeStorageSync(_config.CONFIG.STORAGE_KEYS.INGREDIENT_SEARCH);
      this.fetchRecommendations();
      this.loadFavorites();
      this.drawRadarChart();
      uni.showToast({
        title: '已选择简单模式',
        icon: 'success'
      });
    },
    randomRecommend: function randomRecommend() {
      this.preferences = {
        healthy: Math.floor(Math.random() * 10) + 1,
        difficulty: Math.floor(Math.random() * 3) + 1,
        vegetarian: Math.floor(Math.random() * 10) + 1,
        spicy: Math.floor(Math.random() * 10) + 1,
        sweetness: Math.floor(Math.random() * 10) + 1
      };
      uni.removeStorageSync(_config.CONFIG.STORAGE_KEYS.INGREDIENT_SEARCH);
      this.fetchRecommendations();
      this.loadFavorites();
      this.drawRadarChart();
      uni.showToast({
        title: '随机推荐已生成',
        icon: 'success'
      });
    },
    handleSearch: function handleSearch() {
      var _this2 = this;
      if (!this.searchTerm.trim()) return;
      this.isSearching = true;
      uni.setStorageSync(_config.CONFIG.STORAGE_KEYS.INGREDIENT_SEARCH, this.searchTerm.trim());
      setTimeout(function () {
        _this2.fetchRecommendations();
        _this2.loadFavorites(); // 更新收藏列表
        _this2.isSearching = false;
        uni.showToast({
          title: '搜索完成',
          icon: 'success'
        });
      }, 1000);
    },
    clearSearch: function clearSearch() {
      this.searchTerm = '';
      uni.removeStorageSync(_config.CONFIG.STORAGE_KEYS.INGREDIENT_SEARCH);
      this.fetchRecommendations();
      this.loadFavorites(); // 更新收藏列表
    },
    getPreferenceLabel: function getPreferenceLabel(key) {
      var labels = {
        healthy: '🥗 健康度',
        difficulty: '👨‍🍳 难易度',
        vegetarian: '🥬 素食度',
        spicy: '🌶️ 辣味度',
        sweetness: '🍯 甜味度'
      };
      return labels[key] || key;
    },
    fetchRecommendations: function fetchRecommendations() {
      var _this3 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
        var searchTerm, recipes, searchResult;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _this3.loading = true;
                _context.prev = 1;
                searchTerm = uni.getStorageSync(_config.CONFIG.STORAGE_KEYS.INGREDIENT_SEARCH);
                recipes = [];
                if (!searchTerm) {
                  _context.next = 11;
                  break;
                }
                _context.next = 7;
                return _api.default.searchRecipesByIngredients([searchTerm]);
              case 7:
                searchResult = _context.sent;
                // 处理食材搜索的特殊响应格式
                recipes = searchResult.results || searchResult;
                _context.next = 14;
                break;
              case 11:
                _context.next = 13;
                return _api.default.getRecommendedRecipes(_this3.preferences);
              case 13:
                recipes = _context.sent;
              case 14:
                // 转换数据格式并计算匹配分数
                console.log('Raw API recipes:', recipes);
                _this3.recommendedDishes = recipes.map(function (recipe) {
                  console.log('Converting recipe:', recipe);
                  var dish = _api.default.convertRecipeToDish(recipe);
                  console.log('Converted dish:', dish);
                  dish.matchScore = _api.default.calculateMatchScore(dish, _this3.preferences);
                  return dish;
                });
                console.log('Final recommended dishes:', _this3.recommendedDishes);

                // 按匹配分数排序
                _this3.recommendedDishes.sort(function (a, b) {
                  return (b.matchScore || 0) - (a.matchScore || 0);
                });

                // 更新收藏列表
                _this3.loadFavorites();
                _context.next = 27;
                break;
              case 21:
                _context.prev = 21;
                _context.t0 = _context["catch"](1);
                console.error('获取推荐失败:', _context.t0);
                _api.default.handleApiError(_context.t0);

                // 显示错误信息，不使用备用数据，这样可以看到真实的API问题
                uni.showToast({
                  title: 'API连接失败，请检查网络',
                  icon: 'error',
                  duration: 3000
                });
                _this3.recommendedDishes = [];
              case 27:
                _context.prev = 27;
                _this3.loading = false;
                return _context.finish(27);
              case 30:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[1, 21, 27, 30]]);
      }))();
    },
    getFallbackDishes: function getFallbackDishes() {
      // 备用数据，当API失败时使用
      var fallbackDishes = [{
        id: 'fallback_1',
        cid: 'CID001234',
        name: '番茄鸡蛋面',
        description: '经典家常面条，酸甜可口，营养丰富，老少皆宜的传统美食',
        cookingTime: '15分钟',
        difficulty: '简单',
        tags: ['小吃', '家常菜', '快手菜', '营养', '面食'],
        matchScore: 85,
        ingredients: ['番茄', '鸡蛋', '面条', '葱'],
        steps: ['准备食材', '炒制番茄鸡蛋', '煮面条', '调味装盘'],
        category: '家常菜',
        scores: {
          healthy: 7,
          difficulty: 1,
          vegetarian: 3,
          spicy: 2,
          sweetness: 4
        }
      }, {
        id: 'fallback_2',
        cid: 'CID005678',
        name: '蒜蓉西兰花',
        description: '简单素菜，清爽健康，富含维生素C和膳食纤维，口感脆嫩',
        cookingTime: '10分钟',
        difficulty: '简单',
        tags: ['素食', '健康', '快手菜', '蔬菜', '清淡'],
        matchScore: 88,
        ingredients: ['西兰花', '大蒜', '生抽', '盐'],
        steps: ['处理西兰花', '爆炒蒜蓉', '下西兰花炒制', '调味出锅'],
        category: '素食',
        scores: {
          healthy: 9,
          difficulty: 1,
          vegetarian: 10,
          spicy: 1,
          sweetness: 2
        }
      }, {
        id: 'fallback_3',
        cid: 'CID009876',
        name: '宫保鸡丁',
        description: '四川经典菜品，鸡肉嫩滑，花生香脆，酸甜微辣，下饭神器',
        cookingTime: '25分钟',
        difficulty: '中等',
        tags: ['川菜', '下饭菜', '经典', '辣味', '荤菜'],
        matchScore: 92,
        ingredients: ['鸡胸肉', '花生米', '干辣椒', '花椒'],
        steps: ['腌制鸡肉', '炸花生米', '爆炒调味', '装盘上桌'],
        category: '川菜',
        scores: {
          healthy: 6,
          difficulty: 2,
          vegetarian: 2,
          spicy: 8,
          sweetness: 5
        }
      }];
      var searchTerm = uni.getStorageSync(_config.CONFIG.STORAGE_KEYS.INGREDIENT_SEARCH);
      if (searchTerm) {
        return fallbackDishes.filter(function (dish) {
          return dish.ingredients.some(function (ingredient) {
            return ingredient.includes(searchTerm);
          }) || dish.name.includes(searchTerm);
        });
      }
      return fallbackDishes;
    },
    viewDishDetail: function viewDishDetail(dish) {
      uni.navigateTo({
        url: "/pages/dish-detail/dish-detail?dish=".concat(encodeURIComponent(JSON.stringify(dish)))
      });
    },
    goToApiTest: function goToApiTest() {
      uni.navigateTo({
        url: '/pages/test-api/test-api'
      });
    },
    getRadarColor: function getRadarColor(key) {
      var colors = {
        healthy: '#10b981',
        difficulty: '#f59e0b',
        vegetarian: '#84cc16',
        spicy: '#ef4444',
        sweetness: '#8b5cf6'
      };
      return colors[key] || '#6366f1';
    },
    drawRadarChart: function drawRadarChart() {
      var _this4 = this;
      // Add a small delay to ensure canvas is ready
      this.$nextTick(function () {
        setTimeout(function () {
          _this4.renderRadarChart();
        }, 200); // Increased delay
      });
    },
    renderRadarChart: function renderRadarChart() {
      var _this5 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
        var query, canvas, ctx, dpr, canvasWidth, canvasHeight, centerX, centerY, radius, sides, i, angleStep, labels, labelNames, _i, angle, x, y, labelX, labelY, _i2, _angle, value, distance, _x, _y, _i3, _angle2, _value, _distance, _x2, _y2;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                console.log('Starting Canvas 2D radar chart render...');
                _context2.prev = 1;
                // Use Canvas 2D API (modern approach)
                query = uni.createSelectorQuery().in(_this5);
                _context2.next = 5;
                return new Promise(function (resolve) {
                  query.select('#radarChart').fields({
                    node: true,
                    size: true
                  }).exec(function (res) {
                    resolve(res[0]);
                  });
                });
              case 5:
                canvas = _context2.sent;
                if (!(!canvas || !canvas.node)) {
                  _context2.next = 9;
                  break;
                }
                console.error('Failed to get canvas node');
                return _context2.abrupt("return");
              case 9:
                ctx = canvas.node.getContext('2d');
                dpr = uni.getSystemInfoSync().pixelRatio; // Set canvas size
                canvas.node.width = canvas.width * dpr;
                canvas.node.height = canvas.height * dpr;
                ctx.scale(dpr, dpr);
                console.log('Canvas 2D context created successfully', {
                  width: canvas.width,
                  height: canvas.height,
                  dpr: dpr
                });

                // Use proper dimensions
                canvasWidth = canvas.width;
                canvasHeight = canvas.height;
                centerX = canvasWidth / 2;
                centerY = canvasHeight / 2;
                radius = Math.min(canvasWidth, canvasHeight) * 0.25; // 25% of canvas size
                sides = Object.keys(_this5.preferences).length; // Clear canvas with white background
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvasWidth, canvasHeight);

                // Draw background grid
                ctx.strokeStyle = 'rgba(99, 102, 241, 0.2)';
                ctx.lineWidth = 1;

                // Draw concentric circles
                for (i = 1; i <= 5; i++) {
                  ctx.beginPath();
                  ctx.arc(centerX, centerY, radius * i / 5, 0, 2 * Math.PI);
                  ctx.stroke();
                }

                // Draw axis lines and labels
                angleStep = 2 * Math.PI / sides;
                labels = Object.keys(_this5.preferences);
                labelNames = {
                  healthy: '健康',
                  difficulty: '难度',
                  vegetarian: '素食',
                  spicy: '辣味',
                  sweetness: '甜味'
                };
                ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
                ctx.fillStyle = '#666666';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                for (_i = 0; _i < sides; _i++) {
                  angle = _i * angleStep - Math.PI / 2;
                  x = centerX + Math.cos(angle) * radius;
                  y = centerY + Math.sin(angle) * radius; // Draw axis line
                  ctx.beginPath();
                  ctx.moveTo(centerX, centerY);
                  ctx.lineTo(x, y);
                  ctx.stroke();

                  // Draw label
                  labelX = centerX + Math.cos(angle) * (radius + 20);
                  labelY = centerY + Math.sin(angle) * (radius + 20);
                  ctx.fillText(labelNames[labels[_i]] || labels[_i], labelX, labelY);
                }

                // Draw data polygon
                ctx.strokeStyle = '#6366f1';
                ctx.fillStyle = 'rgba(99, 102, 241, 0.3)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                for (_i2 = 0; _i2 < sides; _i2++) {
                  _angle = _i2 * angleStep - Math.PI / 2;
                  value = _this5.preferences[labels[_i2]] || 1;
                  distance = radius * Math.max(1, Math.min(10, value)) / 10;
                  _x = centerX + Math.cos(_angle) * distance;
                  _y = centerY + Math.sin(_angle) * distance;
                  if (_i2 === 0) {
                    ctx.moveTo(_x, _y);
                  } else {
                    ctx.lineTo(_x, _y);
                  }
                }
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                // Draw data points with enhanced interactivity
                for (_i3 = 0; _i3 < sides; _i3++) {
                  _angle2 = _i3 * angleStep - Math.PI / 2;
                  _value = _this5.preferences[labels[_i3]] || 1;
                  _distance = radius * Math.max(1, Math.min(10, _value)) / 10;
                  _x2 = centerX + Math.cos(_angle2) * _distance;
                  _y2 = centerY + Math.sin(_angle2) * _distance; // Draw outer ring for better touch target
                  ctx.fillStyle = 'rgba(99, 102, 241, 0.2)';
                  ctx.beginPath();
                  ctx.arc(_x2, _y2, 8, 0, 2 * Math.PI);
                  ctx.fill();

                  // Draw main point
                  ctx.fillStyle = '#6366f1';
                  ctx.beginPath();
                  ctx.arc(_x2, _y2, 5, 0, 2 * Math.PI);
                  ctx.fill();

                  // Draw white center for contrast
                  ctx.fillStyle = '#ffffff';
                  ctx.beginPath();
                  ctx.arc(_x2, _y2, 2, 0, 2 * Math.PI);
                  ctx.fill();

                  // Draw value text with background
                  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                  ctx.fillRect(_x2 - 8, _y2 - 18, 16, 12);
                  ctx.strokeStyle = '#6366f1';
                  ctx.lineWidth = 1;
                  ctx.strokeRect(_x2 - 8, _y2 - 18, 16, 12);
                  ctx.fillStyle = '#333333';
                  ctx.font = 'bold 10px Arial';
                  ctx.textAlign = 'center';
                  ctx.fillText(_value.toString(), _x2, _y2 - 10);
                }
                console.log('Canvas 2D radar chart completed successfully');
                _context2.next = 51;
                break;
              case 47:
                _context2.prev = 47;
                _context2.t0 = _context2["catch"](1);
                console.error('Canvas 2D rendering failed:', _context2.t0);
                // Fallback to old method if Canvas 2D is not supported
                _this5.renderRadarChartFallback();
              case 51:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[1, 47]]);
      }))();
    },
    renderRadarChartFallback: function renderRadarChartFallback() {
      console.log('Using fallback canvas rendering...');
      var ctx = uni.createCanvasContext('radarChart', this);
      if (!ctx) {
        console.error('Failed to create fallback canvas context');
        return;
      }

      // Use conservative dimensions for fallback
      var canvasSize = 300;
      var centerX = 150;
      var centerY = 150;
      var radius = 60;
      var sides = Object.keys(this.preferences).length;

      // Clear canvas
      ctx.setFillStyle('#ffffff');
      ctx.fillRect(0, 0, canvasSize, canvasSize);

      // Draw background grid
      ctx.setStrokeStyle('rgba(99, 102, 241, 0.2)');
      ctx.setLineWidth(1);
      for (var i = 1; i <= 5; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * i / 5, 0, 2 * Math.PI);
        ctx.stroke();
      }

      // Draw axis lines
      var angleStep = 2 * Math.PI / sides;
      var labels = Object.keys(this.preferences);
      ctx.setStrokeStyle('rgba(99, 102, 241, 0.3)');
      for (var _i4 = 0; _i4 < sides; _i4++) {
        var angle = _i4 * angleStep - Math.PI / 2;
        var x = centerX + Math.cos(angle) * radius;
        var y = centerY + Math.sin(angle) * radius;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();
      }

      // Draw data polygon
      ctx.setStrokeStyle('#6366f1');
      ctx.setFillStyle('rgba(99, 102, 241, 0.3)');
      ctx.setLineWidth(2);
      ctx.beginPath();
      for (var _i5 = 0; _i5 < sides; _i5++) {
        var _angle3 = _i5 * angleStep - Math.PI / 2;
        var value = this.preferences[labels[_i5]] || 1;
        var distance = radius * Math.max(1, Math.min(10, value)) / 10;
        var _x3 = centerX + Math.cos(_angle3) * distance;
        var _y3 = centerY + Math.sin(_angle3) * distance;
        if (_i5 === 0) {
          ctx.moveTo(_x3, _y3);
        } else {
          ctx.lineTo(_x3, _y3);
        }
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Draw data points
      ctx.setFillStyle('#6366f1');
      for (var _i6 = 0; _i6 < sides; _i6++) {
        var _angle4 = _i6 * angleStep - Math.PI / 2;
        var _value2 = this.preferences[labels[_i6]] || 1;
        var _distance2 = radius * Math.max(1, Math.min(10, _value2)) / 10;
        var _x4 = centerX + Math.cos(_angle4) * _distance2;
        var _y4 = centerY + Math.sin(_angle4) * _distance2;
        ctx.beginPath();
        ctx.arc(_x4, _y4, 4, 0, 2 * Math.PI);
        ctx.fill();
      }
      ctx.draw(true);
      console.log('Fallback radar chart completed');
    },
    onRadarTouch: function onRadarTouch(e) {
      this.handleRadarInteraction(e);
    },
    onRadarTouchMove: function onRadarTouchMove(e) {
      this.handleRadarInteraction(e);
    },
    onRadarTouchEnd: function onRadarTouchEnd(e) {
      this.isDragging = false;
      this.draggedPoint = null;
    },
    handleRadarInteraction: function handleRadarInteraction(e) {
      var _this6 = this;
      if (!e.touches || e.touches.length === 0) return;
      var touch = e.touches[0];

      // Get canvas position and size
      uni.createSelectorQuery().in(this).select('#radarChart').boundingClientRect(function (rect) {
        if (!rect) return;

        // Calculate relative position within canvas
        var relativeX = touch.clientX - rect.left;
        var relativeY = touch.clientY - rect.top;

        // Convert to canvas coordinates (accounting for rpx to px conversion)
        var canvasX = relativeX / rect.width * 300;
        var canvasY = relativeY / rect.height * 300;
        _this6.updatePreferenceFromTouch(canvasX, canvasY);
      }).exec();
    },
    updatePreferenceFromTouch: function updatePreferenceFromTouch(canvasX, canvasY) {
      var _this7 = this;
      var centerX = 150;
      var centerY = 150;
      var maxRadius = 75; // Maximum radius for preferences

      // Calculate distance from center
      var deltaX = canvasX - centerX;
      var deltaY = canvasY - centerY;
      var distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Calculate angle
      var angle = Math.atan2(deltaY, deltaX) + Math.PI / 2;
      if (angle < 0) angle += 2 * Math.PI;

      // Determine which preference dimension this corresponds to
      var sides = Object.keys(this.preferences).length;
      var angleStep = 2 * Math.PI / sides;
      var labels = Object.keys(this.preferences);

      // Find the closest preference dimension
      var closestIndex = 0;
      var minAngleDiff = Math.PI;
      for (var i = 0; i < sides; i++) {
        var preferenceAngle = i * angleStep;
        var angleDiff = Math.abs(angle - preferenceAngle);
        if (angleDiff > Math.PI) angleDiff = 2 * Math.PI - angleDiff;
        if (angleDiff < minAngleDiff) {
          minAngleDiff = angleDiff;
          closestIndex = i;
        }
      }

      // Only update if touch is close enough to a preference axis (within 30 degrees)
      if (minAngleDiff < Math.PI / 6) {
        var preferenceKey = labels[closestIndex];

        // Calculate new value based on distance from center
        var clampedDistance = Math.min(distance, maxRadius);
        var newValue = Math.max(1, Math.min(10, Math.round(clampedDistance / maxRadius * 10)));

        // Update preference if it changed
        if (this.preferences[preferenceKey] !== newValue) {
          this.preferences[preferenceKey] = newValue;
          this.drawRadarChart();

          // Debounced API call
          clearTimeout(this.debounceTimer);
          this.debounceTimer = setTimeout(function () {
            _this7.fetchRecommendations();
          }, 500);

          // Show feedback
          uni.showToast({
            title: "".concat(this.getPreferenceLabel(preferenceKey).split(' ')[1], ": ").concat(newValue),
            icon: 'none',
            duration: 1000
          });
        }
      }
    },
    getFirstThreeTags: function getFirstThreeTags(tags) {
      if (!tags || !Array.isArray(tags)) return '';
      return tags.slice(0, 3).join('\r\n');
    },
    // Split CID string by comma and trim whitespace
    splitCidTags: function splitCidTags(cidString) {
      if (!cidString) return [];
      return cidString.split(',').map(function (tag) {
        return tag.trim();
      }).filter(function (tag) {
        return tag.length > 0;
      });
    }
  }
};
exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"]))

/***/ }),

/***/ 45:
/*!**************************************************************************************************!*\
  !*** /Users/eyeopen/Downloads/wte/Uniapp/pages/index/index.vue?vue&type=style&index=0&lang=css& ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-2!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/postcss-loader/src??ref--6-oneOf-1-3!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./index.vue?vue&type=style&index=0&lang=css& */ 46);
/* harmony import */ var _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 46:
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-2!./node_modules/postcss-loader/src??ref--6-oneOf-1-3!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!/Users/eyeopen/Downloads/wte/Uniapp/pages/index/index.vue?vue&type=style&index=0&lang=css& ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
    if(false) { var cssReload; }
  

/***/ })

},[[34,"common/runtime","common/vendor"]]]);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map