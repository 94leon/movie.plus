// ==UserScript==
// @name           豆瓣酱电影增强脚本
// @description    老司机专用，添加IMDB等评分信息，一键BT搜索，一键字幕搜索
// @author         94Leon
// @connect        imdb.com
// @connect        6080.tv
// @connect        lbldy.com
// @connect        aaqqs.com
// @grant          GM_xmlhttpRequest
// @grant          GM_setClipboard
// @grant          GM_addStyle
// @grant          GM_setValue
// @grant          GM_getValue
// @require        https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @require        https://cdn.bootcss.com/jqueryui/1.12.1/jquery-ui.min.js
// @include        https://movie.douban.com/
// @match          https://movie.douban.com/*
// @version        200418
// @run-at         document-end
// ==/UserScript==

var myScriptStyle = document.createElement("style");
myScriptStyle.innerHTML = "@charset utf-8;#dale_movie_subject_top_right,#dale_movie_subject_top_right,#dale_movie_subject_top_midle,#dale_movie_subject_middle_right,#dale_movie_subject_bottom_super_banner,#footer,#dale_movie_subject_download_middle,#dale_movie_subject_inner_middle,#movie_home_left_bottom,#dale_movie_home_top_right,#dale_movie_home_side_top,#dale_movie_home_bottom_right,#dale_movie_home_inner_bottom,#dale_movie_home_download_bottom,#dale_movie_home_bottom_right_down,#dale_movie_towhome_explore_right,#dale_movie_chart_top_right,#dale_movie_tags_top_right,#dale_review_best_top_right,.mobile-app-entrance.block5.app-movie,.qrcode-app,.top-nav-doubanapp,.extra,div.gray_ad,p.pl,div.ticket{display:none}.c-aside{margin-bottom:30px}.c-aside-body{*letter-spacing:normal}.c-aside-body a{border-radius:6px;color:#37A;display:inline-block;letter-spacing:normal;margin:0 8px 8px 0;padding:0 8px;text-align:center;width:65px}.c-aside-body a:link,.c-aside-body a:visited{background-color:#f5f5f5;color:#37A}.c-aside-body a:hover,.c-aside-body a:active{background-color:#e8e8e8;color:#37A}.c-aside-body a.disabled{text-decoration:line-through}.c-aside-body a.available{background-color:#5ccccc;color:#006363}.c-aside-body a.available:hover,.c-aside-body a.available:active{background-color:#3cc}.c-aside-body a.honse{background-color:#fff0f5;color:#006363}.c-aside-body a.honse:hover,.c-aside-body a.honse:active{background-color:#3cc}.c-aside-body a.sites_r0{text-decoration:line-through}#c_dialog li{margin:10px}#c_dialog{text-align:center}#interest_sectl .rating_imdb{border-bottom:1px solid #eaeaea;padding-bottom:0}#interest_sectl .rating_wrap{padding-top:15px}#interest_sectl .rating_more{border-bottom:1px solid #eaeaea;color:#9b9b9b;margin:0;padding:15px 0;position:relative}#interest_sectl .rating_more a{left:80px;position:absolute}#interest_sectl .rating_more .titleOverviewSprite{background:url(https://coding.net/u/Changhw/p/MyDoubanMovieHelper/git/raw/master/title_overview_sprite.png) no-repeat;display:inline-block;vertical-align:middle}#interest_sectl .rating_more .popularityImageUp{background-position:-14px -478px;height:8px;width:8px}#interest_sectl .rating_more .popularityImageDown{background-position:-34px -478px;height:8px;width:8px}#interest_sectl .rating_more .popularityUpOrFlat{color:#83C40B}#interest_sectl .rating_more .popularityDown{color:#930E02}/*!jQuery UI - v1.12.1 - 2016-09-14 * https://jqueryui.com * Includes:core.css,accordion.css,autocomplete.css,menu.css,button.css,controlgroup.css,checkboxradio.css,datepicker.css,dialog.css,draggable.css,resizable.css,progressbar.css,selectable.css,selectmenu.css,slider.css,sortable.css,spinner.css,tabs.css,tooltip.css,theme.css * To view and modify this theme,visit http://jqueryui.com/themeroller/?bgShadowXPos=&bgOverlayXPos=&bgErrorXPos=&bgHighlightXPos=&bgContentXPos=&bgHeaderXPos=&bgActiveXPos=&bgHoverXPos=&bgDefaultXPos=&bgShadowYPos=&bgOverlayYPos=&bgErrorYPos=&bgHighlightYPos=&bgContentYPos=&bgHeaderYPos=&bgActiveYPos=&bgHoverYPos=&bgDefaultYPos=&bgShadowRepeat=&bgOverlayRepeat=&bgErrorRepeat=&bgHighlightRepeat=&bgContentRepeat=&bgHeaderRepeat=&bgActiveRepeat=&bgHoverRepeat=&bgDefaultRepeat=&iconsHover=url(%22images%2Fui-icons_555555_256x240.png%22)&iconsHighlight=url(%22images%2Fui-icons_777620_256x240.png%22)&iconsHeader=url(%22images%2Fui-icons_444444_256x240.png%22)&iconsError=url(%22images%2Fui-icons_cc0000_256x240.png%22)&iconsDefault=url(%22images%2Fui-icons_777777_256x240.png%22)&iconsContent=url(%22images%2Fui-icons_444444_256x240.png%22)&iconsActive=url(%22images%2Fui-icons_ffffff_256x240.png%22)&bgImgUrlShadow=&bgImgUrlOverlay=&bgImgUrlHover=&bgImgUrlHighlight=&bgImgUrlHeader=&bgImgUrlError=&bgImgUrlDefault=&bgImgUrlContent=&bgImgUrlActive=&opacityFilterShadow=Alpha(Opacity%3D30)&opacityFilterOverlay=Alpha(Opacity%3D30)&opacityShadowPerc=30&opacityOverlayPerc=30&iconColorHover=%23555555&iconColorHighlight=%23777620&iconColorHeader=%23444444&iconColorError=%23cc0000&iconColorDefault=%23777777&iconColorContent=%23444444&iconColorActive=%23ffffff&bgImgOpacityShadow=0&bgImgOpacityOverlay=0&bgImgOpacityError=95&bgImgOpacityHighlight=55&bgImgOpacityContent=75&bgImgOpacityHeader=75&bgImgOpacityActive=65&bgImgOpacityHover=75&bgImgOpacityDefault=75&bgTextureShadow=flat&bgTextureOverlay=flat&bgTextureError=flat&bgTextureHighlight=flat&bgTextureContent=flat&bgTextureHeader=flat&bgTextureActive=flat&bgTextureHover=flat&bgTextureDefault=flat&cornerRadius=3px&fwDefault=normal&ffDefault=Arial%2CHelvetica%2Csans-serif&fsDefault=1em&cornerRadiusShadow=8px&thicknessShadow=5px&offsetLeftShadow=0px&offsetTopShadow=0px&opacityShadow=.3&bgColorShadow=%23666666&opacityOverlay=.3&bgColorOverlay=%23aaaaaa&fcError=%235f3f3f&borderColorError=%23f1a899&bgColorError=%23fddfdf&fcHighlight=%23777620&borderColorHighlight=%23dad55e&bgColorHighlight=%23fffa90&fcContent=%23333333&borderColorContent=%23dddddd&bgColorContent=%23ffffff&fcHeader=%23333333&borderColorHeader=%23dddddd&bgColorHeader=%23e9e9e9&fcActive=%23ffffff&borderColorActive=%23003eff&bgColorActive=%23007fff&fcHover=%232b2b2b&borderColorHover=%23cccccc&bgColorHover=%23ededed&fcDefault=%23454545&borderColorDefault=%23c5c5c5&bgColorDefault=%23f6f6f6 * Copyright jQuery Foundation and other contributors;Licensed MIT */ .ui-helper-hidden{display:none}.ui-helper-hidden-accessible{border:0;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}.ui-helper-reset{border:0;font-size:100%;line-height:1.3;list-style:none;margin:0;outline:0;padding:0;text-decoration:none}.ui-helper-clearfix:before,.ui-helper-clearfix:after{border-collapse:collapse;content:'';display:table}.ui-helper-clearfix:after{clear:both}.ui-helper-zfix{height:100%;left:0;opacity:0;position:absolute;top:0;width:100%;filter:Alpha(Opacity=0)}.ui-front{z-index:100}.ui-state-disabled{cursor:default !important;pointer-events:none}.ui-icon{background-repeat:no-repeat;display:inline-block;margin-top:-.25em;overflow:hidden;position:relative;text-indent:-99999px;vertical-align:middle}.ui-widget-icon-block{display:block;left:50%;margin-left:-8px}.ui-widget-overlay{height:100%;left:0;position:fixed;top:0;width:100%}.ui-accordion .ui-accordion-header{cursor:pointer;display:block;font-size:100%;margin:2px 0 0 0;padding:.5em .5em .5em .7em;position:relative}.ui-accordion .ui-accordion-content{border-top:0;overflow:auto;padding:1em 2.2em}.ui-autocomplete{cursor:default;left:0;position:absolute;top:0}.ui-menu{display:block;list-style:none;margin:0;outline:0;padding:0}.ui-menu .ui-menu{position:absolute}.ui-menu .ui-menu-item{cursor:pointer;list-style-image:url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7);margin:0}.ui-menu .ui-menu-item-wrapper{padding:3px 1em 3px .4em;position:relative}.ui-menu .ui-menu-divider{border-width:1px 0 0 0;font-size:0;height:0;line-height:0;margin:5px 0}.ui-menu .ui-state-focus,.ui-menu .ui-state-active{margin:-1px}.ui-menu-icons{position:relative}.ui-menu-icons .ui-menu-item-wrapper{padding-left:2em}.ui-menu .ui-icon{bottom:0;left:.2em;margin:auto 0;position:absolute;top:0}.ui-menu .ui-menu-icon{left:auto;right:0}.ui-button{cursor:pointer;display:inline-block;line-height:normal;margin-right:.1em;overflow:visible;padding:.4em 1em;position:relative;text-align:center;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.ui-button,.ui-button:link,.ui-button:visited,.ui-button:hover,.ui-button:active{text-decoration:none}.ui-button-icon-only{box-sizing:border-box;text-indent:-9999px;white-space:nowrap;width:2em}input.ui-button.ui-button-icon-only{text-indent:0}.ui-button-icon-only .ui-icon{left:50%;margin-left:-8px;margin-top:-8px;position:absolute;top:50%}.ui-button.ui-icon-notext .ui-icon{height:2.1em;padding:0;text-indent:-9999px;white-space:nowrap;width:2.1em}input.ui-button.ui-icon-notext .ui-icon{height:auto;padding:.4em 1em;text-indent:0;white-space:normal;width:auto}input.ui-button::-moz-focus-inner,button.ui-button::-moz-focus-inner{border:0;padding:0}.ui-controlgroup{display:inline-block;vertical-align:middle}.ui-controlgroup>.ui-controlgroup-item{float:left;margin-left:0;margin-right:0}.ui-controlgroup>.ui-controlgroup-item:focus,.ui-controlgroup>.ui-controlgroup-item.ui-visual-focus{z-index:9999}.ui-controlgroup-vertical>.ui-controlgroup-item{display:block;float:none;margin-bottom:0;margin-top:0;text-align:left;width:100%}.ui-controlgroup-vertical .ui-controlgroup-item{box-sizing:border-box}.ui-controlgroup .ui-controlgroup-label{padding:.4em 1em}.ui-controlgroup .ui-controlgroup-label span{font-size:80%}.ui-controlgroup-horizontal .ui-controlgroup-label + .ui-controlgroup-item{border-left:none}.ui-controlgroup-vertical .ui-controlgroup-label + .ui-controlgroup-item{border-top:none}.ui-controlgroup-horizontal .ui-controlgroup-label.ui-widget-content{border-right:none}.ui-controlgroup-vertical .ui-controlgroup-label.ui-widget-content{border-bottom:none}.ui-controlgroup-vertical .ui-spinner-input{width:75%;width:calc(100% - 2.4em)}.ui-controlgroup-vertical .ui-spinner .ui-spinner-up{border-top-style:solid}.ui-checkboxradio-label .ui-icon-background{border:0;border-radius:.12em;box-shadow:inset 1px 1px 1px #ccc}.ui-checkboxradio-radio-label .ui-icon-background{border:0;border-radius:1em;height:16px;overflow:visible;width:16px}.ui-checkboxradio-radio-label.ui-checkboxradio-checked .ui-icon,.ui-checkboxradio-radio-label.ui-checkboxradio-checked:hover .ui-icon{background-image:none;border-style:solid;border-width:4px;height:8px;width:8px}.ui-checkboxradio-disabled{pointer-events:none}.ui-datepicker{display:none;padding:.2em .2em 0;width:17em}.ui-datepicker .ui-datepicker-header{padding:.2em 0;position:relative}.ui-datepicker .ui-datepicker-prev,.ui-datepicker .ui-datepicker-next{height:1.8em;position:absolute;top:2px;width:1.8em}.ui-datepicker .ui-datepicker-prev-hover,.ui-datepicker .ui-datepicker-next-hover{top:1px}.ui-datepicker .ui-datepicker-prev{left:2px}.ui-datepicker .ui-datepicker-next{right:2px}.ui-datepicker .ui-datepicker-prev-hover{left:1px}.ui-datepicker .ui-datepicker-next-hover{right:1px}.ui-datepicker .ui-datepicker-prev span,.ui-datepicker .ui-datepicker-next span{display:block;left:50%;margin-left:-8px;margin-top:-8px;position:absolute;top:50%}.ui-datepicker .ui-datepicker-title{line-height:1.8em;margin:0 2.3em;text-align:center}.ui-datepicker .ui-datepicker-title select{font-size:1em;margin:1px 0}.ui-datepicker select.ui-datepicker-month,.ui-datepicker select.ui-datepicker-year{width:45%}.ui-datepicker table{border-collapse:collapse;font-size:.9em;margin:0 0 .4em;width:100%}.ui-datepicker th{border:0;font-weight:bold;padding:.7em .3em;text-align:center}.ui-datepicker td{border:0;padding:1px}.ui-datepicker td span,.ui-datepicker td a{display:block;padding:.2em;text-align:right;text-decoration:none}.ui-datepicker .ui-datepicker-buttonpane{background-image:none;border-bottom:0;border-left:0;border-right:0;margin:.7em 0 0 0;padding:0 .2em}.ui-datepicker .ui-datepicker-buttonpane button{cursor:pointer;float:right;margin:.5em .2em .4em;overflow:visible;padding:.2em .6em .3em .6em;width:auto}.ui-datepicker .ui-datepicker-buttonpane button.ui-datepicker-current{float:left}.ui-datepicker.ui-datepicker-multi{width:auto}.ui-datepicker-multi .ui-datepicker-group{float:left}.ui-datepicker-multi .ui-datepicker-group table{margin:0 auto .4em;width:95%}.ui-datepicker-multi-2 .ui-datepicker-group{width:50%}.ui-datepicker-multi-3 .ui-datepicker-group{width:33.3%}.ui-datepicker-multi-4 .ui-datepicker-group{width:25%}.ui-datepicker-multi .ui-datepicker-group-last .ui-datepicker-header,.ui-datepicker-multi .ui-datepicker-group-middle .ui-datepicker-header{border-left-width:0}.ui-datepicker-multi .ui-datepicker-buttonpane{clear:left}.ui-datepicker-row-break{clear:both;font-size:0;width:100%}.ui-datepicker-rtl{direction:rtl}.ui-datepicker-rtl .ui-datepicker-prev{left:auto;right:2px}.ui-datepicker-rtl .ui-datepicker-next{left:2px;right:auto}.ui-datepicker-rtl .ui-datepicker-prev:hover{left:auto;right:1px}.ui-datepicker-rtl .ui-datepicker-next:hover{left:1px;right:auto}.ui-datepicker-rtl .ui-datepicker-buttonpane{clear:right}.ui-datepicker-rtl .ui-datepicker-buttonpane button{float:left}.ui-datepicker-rtl .ui-datepicker-buttonpane button.ui-datepicker-current,.ui-datepicker-rtl .ui-datepicker-group{float:right}.ui-datepicker-rtl .ui-datepicker-group-last .ui-datepicker-header,.ui-datepicker-rtl .ui-datepicker-group-middle .ui-datepicker-header{border-left-width:1px;border-right-width:0}.ui-datepicker .ui-icon{background-repeat:no-repeat;display:block;left:.5em;overflow:hidden;text-indent:-99999px;top:.3em}.ui-dialog{left:0;outline:0;padding:.2em;position:absolute;top:0}.ui-dialog .ui-dialog-titlebar{padding:.4em 1em;position:relative}.ui-dialog .ui-dialog-title{float:left;margin:.1em 0;overflow:hidden;white-space:nowrap;width:90%;text-overflow:ellipsis}.ui-dialog .ui-dialog-titlebar-close{height:20px;margin:-10px 0 0 0;padding:1px;position:absolute;right:.3em;top:50%;width:20px}.ui-dialog .ui-dialog-content{background:none;border:0;overflow:auto;padding:.5em 1em;position:relative}.ui-dialog .ui-dialog-buttonpane{background-image:none;border-width:1px 0 0 0;margin-top:.5em;padding:.3em 1em .5em .4em;text-align:left}.ui-dialog .ui-dialog-buttonpane .ui-dialog-buttonset{float:right}.ui-dialog .ui-dialog-buttonpane button{cursor:pointer;margin:.5em .4em .5em 0}.ui-dialog .ui-resizable-n{height:2px;top:0}.ui-dialog .ui-resizable-e{right:0;width:2px}.ui-dialog .ui-resizable-s{bottom:0;height:2px}.ui-dialog .ui-resizable-w{left:0;width:2px}.ui-dialog .ui-resizable-se,.ui-dialog .ui-resizable-sw,.ui-dialog .ui-resizable-ne,.ui-dialog .ui-resizable-nw{height:7px;width:7px}.ui-dialog .ui-resizable-se{bottom:0;right:0}.ui-dialog .ui-resizable-sw{bottom:0;left:0}.ui-dialog .ui-resizable-ne{right:0;top:0}.ui-dialog .ui-resizable-nw{left:0;top:0}.ui-draggable .ui-dialog-titlebar{cursor:move}.ui-draggable-handle{-ms-touch-action:none;touch-action:none}.ui-resizable{position:relative}.ui-resizable-handle{display:block;font-size:.1px;position:absolute;-ms-touch-action:none;touch-action:none}.ui-resizable-disabled .ui-resizable-handle,.ui-resizable-autohide .ui-resizable-handle{display:none}.ui-resizable-n{cursor:n-resize;height:7px;left:0;top:-5px;width:100%}.ui-resizable-s{bottom:-5px;cursor:s-resize;height:7px;left:0;width:100%}.ui-resizable-e{cursor:e-resize;height:100%;right:-5px;top:0;width:7px}.ui-resizable-w{cursor:w-resize;height:100%;left:-5px;top:0;width:7px}.ui-resizable-se{bottom:1px;cursor:se-resize;height:12px;right:1px;width:12px}.ui-resizable-sw{bottom:-5px;cursor:sw-resize;height:9px;left:-5px;width:9px}.ui-resizable-nw{cursor:nw-resize;height:9px;left:-5px;top:-5px;width:9px}.ui-resizable-ne{cursor:ne-resize;height:9px;right:-5px;top:-5px;width:9px}.ui-progressbar{height:2em;overflow:hidden;text-align:left}.ui-progressbar .ui-progressbar-value{height:100%;margin:-1px}.ui-progressbar .ui-progressbar-overlay{background:url(data:image/gif;base64,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);height:100%;opacity:.25;filter:alpha(opacity=25)}.ui-progressbar-indeterminate .ui-progressbar-value{background-image:none}.ui-selectable{-ms-touch-action:none;touch-action:none}.ui-selectable-helper{border:1px dotted black;position:absolute;z-index:100}.ui-selectmenu-menu{display:none;left:0;margin:0;padding:0;position:absolute;top:0}.ui-selectmenu-menu .ui-menu{overflow:auto;overflow-x:hidden;padding-bottom:1px}.ui-selectmenu-menu .ui-menu .ui-selectmenu-optgroup{border:0;font-size:1em;font-weight:bold;height:auto;line-height:1.5;margin:.5em 0 0 0;padding:2px .4em}.ui-selectmenu-open{display:block}.ui-selectmenu-text{display:block;margin-right:20px;overflow:hidden;text-overflow:ellipsis}.ui-selectmenu-button.ui-button{text-align:left;white-space:nowrap;width:14em}.ui-selectmenu-icon.ui-icon{float:right;margin-top:0}.ui-slider{position:relative;text-align:left}.ui-slider .ui-slider-handle{cursor:default;height:1.2em;position:absolute;width:1.2em;z-index:2;-ms-touch-action:none;touch-action:none}.ui-slider .ui-slider-range{background-position:0 0;border:0;display:block;font-size:.7em;position:absolute;z-index:1}.ui-slider.ui-state-disabled .ui-slider-handle,.ui-slider.ui-state-disabled .ui-slider-range{filter:inherit}.ui-slider-horizontal{height:.8em}.ui-slider-horizontal .ui-slider-handle{margin-left:-.6em;top:-.3em}.ui-slider-horizontal .ui-slider-range{height:100%;top:0}.ui-slider-horizontal .ui-slider-range-min{left:0}.ui-slider-horizontal .ui-slider-range-max{right:0}.ui-slider-vertical{height:100px;width:.8em}.ui-slider-vertical .ui-slider-handle{left:-.3em;margin-bottom:-.6em;margin-left:0}.ui-slider-vertical .ui-slider-range{left:0;width:100%}.ui-slider-vertical .ui-slider-range-min{bottom:0}.ui-slider-vertical .ui-slider-range-max{top:0}.ui-sortable-handle{-ms-touch-action:none;touch-action:none}.ui-spinner{display:inline-block;overflow:hidden;padding:0;position:relative;vertical-align:middle}.ui-spinner-input{background:none;border:0;color:inherit;margin:.2em 0;margin-left:.4em;margin-right:2em;padding:.222em 0;vertical-align:middle}.ui-spinner-button{cursor:default;display:block;font-size:.5em;height:50%;margin:0;overflow:hidden;padding:0;position:absolute;right:0;text-align:center;width:1.6em}.ui-spinner a.ui-spinner-button{border-bottom-style:none;border-right-style:none;border-top-style:none}.ui-spinner-up{top:0}.ui-spinner-down{bottom:0}.ui-tabs{padding:.2em;position:relative}.ui-tabs .ui-tabs-nav{margin:0;padding:.2em .2em 0}.ui-tabs .ui-tabs-nav li{border-bottom-width:0;float:left;list-style:none;margin:1px .2em 0 0;padding:0;position:relative;top:0;white-space:nowrap}.ui-tabs .ui-tabs-nav .ui-tabs-anchor{float:left;padding:.5em 1em;text-decoration:none}.ui-tabs .ui-tabs-nav li.ui-tabs-active{margin-bottom:-1px;padding-bottom:1px}.ui-tabs .ui-tabs-nav li.ui-tabs-active .ui-tabs-anchor,.ui-tabs .ui-tabs-nav li.ui-state-disabled .ui-tabs-anchor,.ui-tabs .ui-tabs-nav li.ui-tabs-loading .ui-tabs-anchor{cursor:text}.ui-tabs-collapsible .ui-tabs-nav li.ui-tabs-active .ui-tabs-anchor{cursor:pointer}.ui-tabs .ui-tabs-panel{background:none;border-width:0;display:block;padding:1em 1.4em}.ui-tooltip{max-width:300px;padding:8px;position:absolute;z-index:9999}body .ui-tooltip{border-width:2px}.ui-widget{font-family:Arial,Helvetica,sans-serif;font-size:1em}.ui-widget .ui-widget{font-size:1em}.ui-widget input,.ui-widget select,.ui-widget textarea,.ui-widget button{font-family:Arial,Helvetica,sans-serif;font-size:1em}.ui-widget.ui-widget-content{border:1px solid #c5c5c5}.ui-widget-content{background:#fff;border:1px solid #ddd;color:#333}.ui-widget-content a{color:#333}.ui-widget-header{background:#e9e9e9;border:1px solid #ddd;color:#333;font-weight:bold}.ui-widget-header a{color:#333}.ui-state-default,.ui-widget-content .ui-state-default,.ui-widget-header .ui-state-default,.ui-button,html .ui-button.ui-state-disabled:hover,html .ui-button.ui-state-disabled:active{background:#f6f6f6;border:1px solid #c5c5c5;color:#454545;font-weight:normal}.ui-state-default a,.ui-state-default a:link,.ui-state-default a:visited,a.ui-button,a:link.ui-button,a:visited.ui-button,.ui-button{color:#454545;text-decoration:none}.ui-state-hover,.ui-widget-content .ui-state-hover,.ui-widget-header .ui-state-hover,.ui-state-focus,.ui-widget-content .ui-state-focus,.ui-widget-header .ui-state-focus,.ui-button:hover,.ui-button:focus{background:#ededed;border:1px solid #ccc;color:#2b2b2b;font-weight:normal}.ui-state-hover a,.ui-state-hover a:hover,.ui-state-hover a:link,.ui-state-hover a:visited,.ui-state-focus a,.ui-state-focus a:hover,.ui-state-focus a:link,.ui-state-focus a:visited,a.ui-button:hover,a.ui-button:focus{color:#2b2b2b;text-decoration:none}.ui-visual-focus{box-shadow:0 0 3px 1px #5e9ed6}.ui-state-active,.ui-widget-content .ui-state-active,.ui-widget-header .ui-state-active,a.ui-button:active,.ui-button:active,.ui-button.ui-state-active:hover{background:#007fff;border:1px solid #003eff;color:#fff;font-weight:normal}.ui-icon-background,.ui-state-active .ui-icon-background{background-color:#fff;border:#003eff}.ui-state-active a,.ui-state-active a:link,.ui-state-active a:visited{color:#fff;text-decoration:none}.ui-state-highlight,.ui-widget-content .ui-state-highlight,.ui-widget-header .ui-state-highlight{background:#fffa90;border:1px solid #dad55e;color:#777620}.ui-state-checked{background:#fffa90;border:1px solid #dad55e}.ui-state-highlight a,.ui-widget-content .ui-state-highlight a,.ui-widget-header .ui-state-highlight a{color:#777620}.ui-state-error,.ui-widget-content .ui-state-error,.ui-widget-header .ui-state-error{background:#fddfdf;border:1px solid #f1a899;color:#5f3f3f}.ui-state-error a,.ui-widget-content .ui-state-error a,.ui-widget-header .ui-state-error a{color:#5f3f3f}.ui-state-error-text,.ui-widget-content .ui-state-error-text,.ui-widget-header .ui-state-error-text{color:#5f3f3f}.ui-priority-primary,.ui-widget-content .ui-priority-primary,.ui-widget-header .ui-priority-primary{font-weight:bold}.ui-priority-secondary,.ui-widget-content .ui-priority-secondary,.ui-widget-header .ui-priority-secondary{font-weight:normal;opacity:.7;filter:Alpha(Opacity=70)}.ui-state-disabled,.ui-widget-content .ui-state-disabled,.ui-widget-header .ui-state-disabled{background-image:none;opacity:.35;filter:Alpha(Opacity=35)}.ui-state-disabled .ui-icon{filter:Alpha(Opacity=35)}.ui-icon{height:16px;width:16px}.ui-icon,.ui-widget-content .ui-icon{background-image:url(https://cdn.bootcss.com/jqueryui/1.12.1/images/ui-icons_444444_256x240.png)}.ui-widget-header .ui-icon{background-image:url(https://cdn.bootcss.com/jqueryui/1.12.1/images/ui-icons_444444_256x240.png)}.ui-state-hover .ui-icon,.ui-state-focus .ui-icon,.ui-button:hover .ui-icon,.ui-button:focus .ui-icon{background-image:url(https://cdn.bootcss.com/jqueryui/1.12.1/images/ui-icons_555555_256x240.png)}.ui-state-active .ui-icon,.ui-button:active .ui-icon{background-image:url(https://cdn.bootcss.com/jqueryui/1.12.1/images/ui-icons_ffffff_256x240.png)}.ui-state-highlight .ui-icon,.ui-button .ui-state-highlight.ui-icon{background-image:url(https://cdn.bootcss.com/jqueryui/1.12.1/images/ui-icons_777620_256x240.png)}.ui-state-error .ui-icon,.ui-state-error-text .ui-icon{background-image:url(https://cdn.bootcss.com/jqueryui/1.12.1/images/ui-icons_cc0000_256x240.png)}.ui-button .ui-icon{background-image:url(https://cdn.bootcss.com/jqueryui/1.12.1/images/ui-icons_777777_256x240.png)}.ui-icon-blank{background-position:16px 16px}.ui-icon-caret-1-n{background-position:0 0}.ui-icon-caret-1-ne{background-position:-16px 0}.ui-icon-caret-1-e{background-position:-32px 0}.ui-icon-caret-1-se{background-position:-48px 0}.ui-icon-caret-1-s{background-position:-65px 0}.ui-icon-caret-1-sw{background-position:-80px 0}.ui-icon-caret-1-w{background-position:-96px 0}.ui-icon-caret-1-nw{background-position:-112px 0}.ui-icon-caret-2-n-s{background-position:-128px 0}.ui-icon-caret-2-e-w{background-position:-144px 0}.ui-icon-triangle-1-n{background-position:0 -16px}.ui-icon-triangle-1-ne{background-position:-16px -16px}.ui-icon-triangle-1-e{background-position:-32px -16px}.ui-icon-triangle-1-se{background-position:-48px -16px}.ui-icon-triangle-1-s{background-position:-65px -16px}.ui-icon-triangle-1-sw{background-position:-80px -16px}.ui-icon-triangle-1-w{background-position:-96px -16px}.ui-icon-triangle-1-nw{background-position:-112px -16px}.ui-icon-triangle-2-n-s{background-position:-128px -16px}.ui-icon-triangle-2-e-w{background-position:-144px -16px}.ui-icon-arrow-1-n{background-position:0 -32px}.ui-icon-arrow-1-ne{background-position:-16px -32px}.ui-icon-arrow-1-e{background-position:-32px -32px}.ui-icon-arrow-1-se{background-position:-48px -32px}.ui-icon-arrow-1-s{background-position:-65px -32px}.ui-icon-arrow-1-sw{background-position:-80px -32px}.ui-icon-arrow-1-w{background-position:-96px -32px}.ui-icon-arrow-1-nw{background-position:-112px -32px}.ui-icon-arrow-2-n-s{background-position:-128px -32px}.ui-icon-arrow-2-ne-sw{background-position:-144px -32px}.ui-icon-arrow-2-e-w{background-position:-160px -32px}.ui-icon-arrow-2-se-nw{background-position:-176px -32px}.ui-icon-arrowstop-1-n{background-position:-192px -32px}.ui-icon-arrowstop-1-e{background-position:-208px -32px}.ui-icon-arrowstop-1-s{background-position:-224px -32px}.ui-icon-arrowstop-1-w{background-position:-240px -32px}.ui-icon-arrowthick-1-n{background-position:1px -48px}.ui-icon-arrowthick-1-ne{background-position:-16px -48px}.ui-icon-arrowthick-1-e{background-position:-32px -48px}.ui-icon-arrowthick-1-se{background-position:-48px -48px}.ui-icon-arrowthick-1-s{background-position:-64px -48px}.ui-icon-arrowthick-1-sw{background-position:-80px -48px}.ui-icon-arrowthick-1-w{background-position:-96px -48px}.ui-icon-arrowthick-1-nw{background-position:-112px -48px}.ui-icon-arrowthick-2-n-s{background-position:-128px -48px}.ui-icon-arrowthick-2-ne-sw{background-position:-144px -48px}.ui-icon-arrowthick-2-e-w{background-position:-160px -48px}.ui-icon-arrowthick-2-se-nw{background-position:-176px -48px}.ui-icon-arrowthickstop-1-n{background-position:-192px -48px}.ui-icon-arrowthickstop-1-e{background-position:-208px -48px}.ui-icon-arrowthickstop-1-s{background-position:-224px -48px}.ui-icon-arrowthickstop-1-w{background-position:-240px -48px}.ui-icon-arrowreturnthick-1-w{background-position:0 -64px}.ui-icon-arrowreturnthick-1-n{background-position:-16px -64px}.ui-icon-arrowreturnthick-1-e{background-position:-32px -64px}.ui-icon-arrowreturnthick-1-s{background-position:-48px -64px}.ui-icon-arrowreturn-1-w{background-position:-64px -64px}.ui-icon-arrowreturn-1-n{background-position:-80px -64px}.ui-icon-arrowreturn-1-e{background-position:-96px -64px}.ui-icon-arrowreturn-1-s{background-position:-112px -64px}.ui-icon-arrowrefresh-1-w{background-position:-128px -64px}.ui-icon-arrowrefresh-1-n{background-position:-144px -64px}.ui-icon-arrowrefresh-1-e{background-position:-160px -64px}.ui-icon-arrowrefresh-1-s{background-position:-176px -64px}.ui-icon-arrow-4{background-position:0 -80px}.ui-icon-arrow-4-diag{background-position:-16px -80px}.ui-icon-extlink{background-position:-32px -80px}.ui-icon-newwin{background-position:-48px -80px}.ui-icon-refresh{background-position:-64px -80px}.ui-icon-shuffle{background-position:-80px -80px}.ui-icon-transfer-e-w{background-position:-96px -80px}.ui-icon-transferthick-e-w{background-position:-112px -80px}.ui-icon-folder-collapsed{background-position:0 -96px}.ui-icon-folder-open{background-position:-16px -96px}.ui-icon-document{background-position:-32px -96px}.ui-icon-document-b{background-position:-48px -96px}.ui-icon-note{background-position:-64px -96px}.ui-icon-mail-closed{background-position:-80px -96px}.ui-icon-mail-open{background-position:-96px -96px}.ui-icon-suitcase{background-position:-112px -96px}.ui-icon-comment{background-position:-128px -96px}.ui-icon-person{background-position:-144px -96px}.ui-icon-print{background-position:-160px -96px}.ui-icon-trash{background-position:-176px -96px}.ui-icon-locked{background-position:-192px -96px}.ui-icon-unlocked{background-position:-208px -96px}.ui-icon-bookmark{background-position:-224px -96px}.ui-icon-tag{background-position:-240px -96px}.ui-icon-home{background-position:0 -112px}.ui-icon-flag{background-position:-16px -112px}.ui-icon-calendar{background-position:-32px -112px}.ui-icon-cart{background-position:-48px -112px}.ui-icon-pencil{background-position:-64px -112px}.ui-icon-clock{background-position:-80px -112px}.ui-icon-disk{background-position:-96px -112px}.ui-icon-calculator{background-position:-112px -112px}.ui-icon-zoomin{background-position:-128px -112px}.ui-icon-zoomout{background-position:-144px -112px}.ui-icon-search{background-position:-160px -112px}.ui-icon-wrench{background-position:-176px -112px}.ui-icon-gear{background-position:-192px -112px}.ui-icon-heart{background-position:-208px -112px}.ui-icon-star{background-position:-224px -112px}.ui-icon-link{background-position:-240px -112px}.ui-icon-cancel{background-position:0 -128px}.ui-icon-plus{background-position:-16px -128px}.ui-icon-plusthick{background-position:-32px -128px}.ui-icon-minus{background-position:-48px -128px}.ui-icon-minusthick{background-position:-64px -128px}.ui-icon-close{background-position:-80px -128px}.ui-icon-closethick{background-position:-96px -128px}.ui-icon-key{background-position:-112px -128px}.ui-icon-lightbulb{background-position:-128px -128px}.ui-icon-scissors{background-position:-144px -128px}.ui-icon-clipboard{background-position:-160px -128px}.ui-icon-copy{background-position:-176px -128px}.ui-icon-contact{background-position:-192px -128px}.ui-icon-image{background-position:-208px -128px}.ui-icon-video{background-position:-224px -128px}.ui-icon-script{background-position:-240px -128px}.ui-icon-alert{background-position:0 -144px}.ui-icon-info{background-position:-16px -144px}.ui-icon-notice{background-position:-32px -144px}.ui-icon-help{background-position:-48px -144px}.ui-icon-check{background-position:-64px -144px}.ui-icon-bullet{background-position:-80px -144px}.ui-icon-radio-on{background-position:-96px -144px}.ui-icon-radio-off{background-position:-112px -144px}.ui-icon-pin-w{background-position:-128px -144px}.ui-icon-pin-s{background-position:-144px -144px}.ui-icon-play{background-position:0 -160px}.ui-icon-pause{background-position:-16px -160px}.ui-icon-seek-next{background-position:-32px -160px}.ui-icon-seek-prev{background-position:-48px -160px}.ui-icon-seek-end{background-position:-64px -160px}.ui-icon-seek-start{background-position:-80px -160px}.ui-icon-seek-first{background-position:-80px -160px}.ui-icon-stop{background-position:-96px -160px}.ui-icon-eject{background-position:-112px -160px}.ui-icon-volume-off{background-position:-128px -160px}.ui-icon-volume-on{background-position:-144px -160px}.ui-icon-power{background-position:0 -176px}.ui-icon-signal-diag{background-position:-16px -176px}.ui-icon-signal{background-position:-32px -176px}.ui-icon-battery-0{background-position:-48px -176px}.ui-icon-battery-1{background-position:-64px -176px}.ui-icon-battery-2{background-position:-80px -176px}.ui-icon-battery-3{background-position:-96px -176px}.ui-icon-circle-plus{background-position:0 -192px}.ui-icon-circle-minus{background-position:-16px -192px}.ui-icon-circle-close{background-position:-32px -192px}.ui-icon-circle-triangle-e{background-position:-48px -192px}.ui-icon-circle-triangle-s{background-position:-64px -192px}.ui-icon-circle-triangle-w{background-position:-80px -192px}.ui-icon-circle-triangle-n{background-position:-96px -192px}.ui-icon-circle-arrow-e{background-position:-112px -192px}.ui-icon-circle-arrow-s{background-position:-128px -192px}.ui-icon-circle-arrow-w{background-position:-144px -192px}.ui-icon-circle-arrow-n{background-position:-160px -192px}.ui-icon-circle-zoomin{background-position:-176px -192px}.ui-icon-circle-zoomout{background-position:-192px -192px}.ui-icon-circle-check{background-position:-208px -192px}.ui-icon-circlesmall-plus{background-position:0 -208px}.ui-icon-circlesmall-minus{background-position:-16px -208px}.ui-icon-circlesmall-close{background-position:-32px -208px}.ui-icon-squaresmall-plus{background-position:-48px -208px}.ui-icon-squaresmall-minus{background-position:-64px -208px}.ui-icon-squaresmall-close{background-position:-80px -208px}.ui-icon-grip-dotted-vertical{background-position:0 -224px}.ui-icon-grip-dotted-horizontal{background-position:-16px -224px}.ui-icon-grip-solid-vertical{background-position:-32px -224px}.ui-icon-grip-solid-horizontal{background-position:-48px -224px}.ui-icon-gripsmall-diagonal-se{background-position:-64px -224px}.ui-icon-grip-diagonal-se{background-position:-80px -224px}.ui-corner-all,.ui-corner-top,.ui-corner-left,.ui-corner-tl{border-top-left-radius:3px}.ui-corner-all,.ui-corner-top,.ui-corner-right,.ui-corner-tr{border-top-right-radius:3px}.ui-corner-all,.ui-corner-bottom,.ui-corner-left,.ui-corner-bl{border-bottom-left-radius:3px}.ui-corner-all,.ui-corner-bottom,.ui-corner-right,.ui-corner-br{border-bottom-right-radius:3px}.ui-widget-overlay{background:#aaa;opacity:.003;filter:Alpha(Opacity=.3)}.ui-widget-shadow{-webkit-box-shadow:0 0 5px #666;box-shadow:0 0 5px #666}";
document.getElementsByTagName("head")[0].appendChild(myScriptStyle);
var aside_html = '<div class=c-aside > <h2><i class="">四字标题</i>· · · · · · </h2> <div class=c-aside-body  style="padding: 0 12px;"> <ul class=bs > </ul> </div> </div>';
var dialog_html = '<div id=c_dialog  title="Basic dialog"> <ul id=c_dialog_urls > <li class=c_dialog_url_item > <a href="http://www.lbldy.com/search/%E5%96%9C%E6%AC%A2%E4%BD%A0" data-host=www.lbldy.com  target=_blank  rel=nofollow >龙部落</a> <li class=c_dialog_url_item > <a href="http://www.lbldy.com/search/%E5%96%9C%E6%AC%A2%E4%BD%A0" data-host=www.lbldy.com  target=_blank  rel=nofollow >龙部落</a> <li class=c_dialog_url_item > <a href="http://www.lbldy.com/search/%E5%96%9C%E6%AC%A2%E4%BD%A0" data-host=www.lbldy.com  target=_blank  rel=nofollow >龙部落</a> </ul> </div>';
var imdb_html = '<div class="rating_wrap clearbox rating_imdb" rel="v:rating" style="padding-top: 0;"> <div class=rating_logo >IMDB 评分</div> <div class="rating_self clearfix" typeof="v:Rating"> <strong class="ll rating_num" property="v:average">0</strong> <span property="v:best" content=10.0 ></span> <div class="rating_right "> <div class=ll ></div> <div class=rating_sum > <a href=collections  class=rating_people ><span property="v:votes">0</span>人评价</a> </div> </div> </div> </div>';
if (!document.getElementById("seBwhA") && document.title.indexOf('豆瓣') !== -1) {
  var seBwhA = document.createElement("a");
  seBwhA.id = "seBwhA";
  document.getElementsByTagName("html")[0].appendChild(seBwhA);

  if (location.href.startsWith('https://movie.douban.com/subject/')) {

    $(document).ready(function () {
      var getDoc, getJSON, parseURL, postDoc;
      getDoc = function (url, meta, callback) {
        GM_xmlhttpRequest({
          method: 'GET',
          url: url,
          headers: {
            'User-agent': window.navigator.userAgent,
            'Content-type': null
          },
          onload: function (responseDetail) {
            var doc;
            doc = '';
            if (responseDetail.status == 200) {
              doc = (new DOMParser).parseFromString(responseDetail.responseText, 'text/html');
              if (doc == undefined) {
                doc = document.implementation.createHTMLDocument('');
                doc.querySelector('html').innerHTML = responseText;
              }
            }
            callback(doc, responseDetail, meta);
          }
        });
      };
      postDoc = function (url, data, meta, callback) {
        GM_xmlhttpRequest({
          anonymous: true,
          method: 'POST',
          url: url,
          headers: {
            'User-agent': window.navigator.userAgent,
            'Content-type': 'application/x-www-form-urlencoded'
          },
          data: data,
          onload: function (responseDetail) {
            callback(responseDetail.responseText, responseDetail, meta);
          }
        });
      };
      getJSON = function (url, callback) {
        GM_xmlhttpRequest({
          method: 'GET',
          url: url,
          headers: {
            'Accept': 'application/json'
          },
          onload: function (response) {
            if (response.status >= 200 && response.status < 400) {
              callback(JSON.parse(response.responseText), url);
            } else {
            }
          }
        });
      };
      parseURL = function (url) {
        var a;
        a = document.createElement('a');
        a.href = url;
        return {
          source: url,
          protocol: a.protocol.replace(':', ''),
          host: a.hostname,
          port: a.port,
          query: a.search,
          params: (function () {
            var i, len, ret, s, seg;
            ret = {};
            seg = a.search.replace(/^\?/, '').split('&');
            len = seg.length;
            i = 0;
            s = void 0;
            while (i < len) {
              if (!seg[i]) {
                i++;
                continue;
              }
              s = seg[i].split('=');
              ret[s[0]] = s[1];
              i++;
            }
            return ret;
          })(),
          file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
          hash: a.hash.replace('#', ''),
          path: a.pathname.replace(/^([^\/])/, '/$1'),
          relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
          segments: a.pathname.replace(/^\//, '').split('/')
        };
      };

      var site_offline, site_online, site_gaoqing, site_dongman, site_sub, update_site_offline_sites,
        update_site_online_sites, update_site_gaoqing_sites, update_site_dongman_sites, update_site_sub_sites;
      site_online = $(aside_html);
      update_site_online_sites = function (title, en) {
        var i, l, link, link_parsed, n, name, site_online_sites, sites_playBtn, t;
        title = encodeURI(title);
        if (en) {
          site_online_sites = {};
        } else {
          site_online_sites = {
            '看看屋': 'https://www.kankanwu.com/index.php?s=vod-search-wd-' + title + '.html',
            'TV6': 'https://www.tv6.com/index.php/vod/search.html?wd=' + title + '&submit=',
            '两个BT': 'https://www.bttwo.com/?s=' + title,
            '4K屋': 'http://www.kkkkmao.com/index.php?s=vod-search-wd-' + title + '.html',
            'TNT影视': 'http://www.tntdy3.vip/search.php?searchword=' + title,
            '狗带TV': 'http://goudaivv.com/vodsearch/-------------.html?wd=' + title + '&submit=',
            '看精品': 'http://www.kanjp.com/search/-------------.html?wd=' + title,
            '优片网': 'http://www.iupian.com/vod-search-wd-' + title + '.html',
            '无双影视': 'https://53ys.xyz/so?s=' + title,
            '骑士电影': 'http://www.scps6.com/?c=search&wd=' + title + '&sort=addtime&order=desc&page=1',
            '在线之家': 'https://www.zxzjs.com/vodsearch/-------------.html?wd=' + title + '&submit=',
            '完美看看': 'https://www.wanmeikk.me/search/-------------.html?wd=' + title + '&submit=',
            '电影FM': 'http://dianying.fm/search/?text=' + title,
            '在线福利': 'http://www.wz80.com/search?wd=' + title + '+',
            'NO视频': 'http://www.novipnoad.com/?s=' + title,
            '神马电影': 'http://www.9rsm.com/search?wd=' + title,
            '啊哥美剧': 'https://agmov.com/search/kw/' + title,
          };
          sites_playBtn = $('div.gray_ad a.playBtn');
          i = 0;
          n = void 0;
          while (n = sites_playBtn[i]) {
            t = $(n).text().replace(/\s/g, '').replace('视频', '');
            l = $(n).attr('href');
            if (l === 'javascript: void 0;') {
              i++;
              continue;
            }
            l = parseURL(l).params['url'];
            l = decodeURIComponent(l);
            site_online_sites[t + ''] = 'http://www.sfsft.com/admin.php?url=' + l;
            i++;
          }
        }
        for (name in site_online_sites) {
          link = site_online_sites[name];
          link_parsed = parseURL(link);
          link = $('<a></a>').attr('href', link);
          link.attr('data-host', link_parsed.host);
          link.attr('target', '_blank').attr('rel', 'nofollow');
          if (link_parsed.host === 'www.sfsft.com' || link_parsed.host === 'search.bilibili.com' || link_parsed.host === 'vip.ifkdy.com') {
            link.addClass('available');
          }
          link.html(name);
          $('#content div.site-online-body ul').append(link);
        }
      };
      update_site_offline_sites = function (title, en) {
        var link, link_parsed, name, site_offline_sites;
        title = encodeURI(title);
        if (en) {
          site_offline_sites = {
            '海盗湾': 'http://thepiratebay.ee/s/?q=' + title,
          };
        } else {
          site_offline_sites = {
            '五号站': 'http://www.wuhaozhan.net/s/' + title + '/',
            'MP4Vv': 'https://www.mp4pa.com/search.php?searchword=' + title,
            'BT吧': 'http://www.btba.cc/search?keyword=' + title,
            '茶杯狐': 'https://www.cupfox.com/?type=download&key=' + title,
            '龙部落': 'http://www.lbldy.com/search/' + title,
            '比特大雄': 'http://www.btdx8.com/?s=' + title,
            '哇呱影视': 'http://www.gagays.xyz/movie/search?req%5Bkw%5D=' + title,
            '人人美剧': 'http://yyetss.com/Search/index/?s_keys=' + title,
            'RARBT': 'http://www.rarbt.com/index.php/search/index.html?search=' + title,
            'CILI001': 'http://f.cili001.com/index/index?c=&k=' + title,
            'BT天堂': 'http://www.btbtdy.me/search/' + title + '.html',
            '疯狂影视搜': 'http://www.ifkdy.com/?q=' + title + '&p=1',
          };
        }
        for (name in site_offline_sites) {
          link = site_offline_sites[name];
          link_parsed = parseURL(link);
          link = $('<a></a>').attr('href', link);
          link.attr('data-host', link_parsed.host);
          link.attr('target', '_blank').attr('rel', 'nofollow');
          link.html(name);
          $('#content div.site-offline-body ul').append(link);
        }
      };
      update_site_gaoqing_sites = function (title, en) {
        var link, link_parsed, name, site_gaoqing_sites;
        title = encodeURI(title);
        if (en) {
          site_gaoqing_sites = {};
        } else {
          site_gaoqing_sites = {
            '音范丝': 'http://www.yinfans.com/?s=' + title,
            '蓝光网': 'http://www.languang.co/?s=' + title,
            '片源网': 'http://pianyuan.net/search?q=' + title,
            '高清网': 'http://gaoqing.la/?s=' + title,
            '思享网': 'http://www.ibtbb.com/?s=' + title,

          };
        }
        for (name in site_gaoqing_sites) {
          link = site_gaoqing_sites[name];
          link_parsed = parseURL(link);
          link = $('<a></a>').attr('href', link);
          link.attr('data-host', link_parsed.host);
          link.attr('target', '_blank').attr('rel', 'nofollow');
          link.html(name);
          $('#content div.site-gaoqing-body ul').append(link);
        }

      };
      update_site_dongman_sites = function (title, en) {
        var link, link_parsed, name, site_dongman_sites;
        title = encodeURI(title);
        if (en) {
          site_dongman_sites = {};
        } else {
          site_dongman_sites = {
            '妮可动漫': 'http://www.nicotv.me/video/search/' + title + '.html',
            '西西动漫': 'https://www.xixixixi.wang/search/name/' + title + '.html',
            '茵蒂克丝': 'https://www.kisssub.org',
          };
        }
        for (name in site_dongman_sites) {
          link = site_dongman_sites[name];
          link_parsed = parseURL(link);
          link = $('<a></a>').attr('href', link);
          link.attr('data-host', link_parsed.host);
          link.attr('target', '_blank').attr('rel', 'nofollow');
          link.html(name);
          $('#content div.site-dongman-body ul').append(link);
        }

      };
      update_site_sub_sites = function (title, en) {
        var link, link_parsed, name, site_offline_sites;
        title = encodeURI(title);
        if (en) {
          site_offline_sites = {
            '射手伪': 'http://assrt.net/sub/?searchword=' + title
          };
        } else {
          site_offline_sites = {
            '字幕库': 'http://www.zimuku.net/search?q=' + title,
            '字幕组': 'http://www.zmz2019.com/search/index?keyword=' + title + '&search_type=',
            '字幕社': 'https://www.zimushe.com/search.php?keywords=' + title,
            'sub HD': 'http://subhd.com/search/' + title,
            '电波字幕': 'http://dbfansub.com/?s=' + title,
            '伪射手': 'http://assrt.net/sub/?searchword=' + title,
            '翻托邦字幕': 'https://fantopia.club/?s=' + title,
          };
        }
        for (name in site_offline_sites) {
          link = site_offline_sites[name];
          link_parsed = parseURL(link);
          link = $('<a></a>').attr('href', link);
          link.attr('data-host', link_parsed.host);
          link.attr('target', '_blank').attr('rel', 'nofollow');
          link.html(name);
          $('#content div.site-sub-body ul').append(link);
        }
      };
      site_online.addClass('site_online');
      site_online.find('div.c-aside-body').addClass('site-online-body');
      site_online.find('h2 i').text('在线观看');
      $('#content div.tags').before(site_online);
      site_gaoqing = $(aside_html);
      site_gaoqing.addClass('site_gaoqing');
      site_gaoqing.find('div.c-aside-body').addClass('site-gaoqing-body');
      site_gaoqing.find('h2 i').text('高清资源');
      $('#content div.tags').before(site_gaoqing);
      site_dongman = $(aside_html);
      site_dongman.addClass('site_dongman');
      site_dongman.find('div.c-aside-body').addClass('site-dongman-body');
      site_dongman.find('h2 i').text('动漫资源');
      $('#content div.tags').before(site_dongman);
      site_offline = $(aside_html);
      site_offline.addClass('name-offline');
      site_offline.find('div.c-aside-body').addClass('site-offline-body');
      site_offline.find('h2 i').text('电影资源');
      $('#content div.tags').before(site_offline);
      site_sub = $(aside_html);
      site_sub.addClass('name-offline');
      site_sub.find('div.c-aside-body').addClass('site-sub-body');
      site_sub.find('h2 i').text('字幕资源');
      $('#content div.related-info').after(site_sub);

      var title, title_en, title_sec;
      title = title_sec = $('#content > h1 > span')[0].textContent.split(' ');
      title = title.shift();
      title_sec = title_sec.join(' ').trim();
      title_en = '';
      update_site_online_sites(title);
      update_site_gaoqing_sites(title);
      update_site_dongman_sites(title);
      update_site_offline_sites(title);
      update_site_sub_sites(title);

      var meta, site, site_href;
      site = null;
      site = $('div.aside a[data-host$=\'www.6080.tv\']');
      if (site) {
        site_href = site.attr('href');
        meta = new Array;
        meta['site'] = site;
        getDoc(site_href, meta, function (doc, resp, meta) {
          var i, l, links, lists;
          site = meta['site'];
          lists = $('div.bd ul.pic li', doc);
          links = [];
          i = 0;
          while (i < lists.length) {
            l = $(lists[i]);
            if (l.find('span > span').text().indexOf(title) !== -1) {
              links.push('http://www.6080.tv' + l.find('a[href^=\'/note\']').attr('href'));
            }
            i++;
          }
          if (links.length === 0) {
            site.addClass('honse');
            return;
          } else if (links.length === 1) {
            site.addClass('available');
            site.attr('href', links[0]);
          }
        });
      }
      site = $('div.aside a[data-host$=\'lbldy.com\']');
      if (site) {
        site_href = site.attr('href');
        meta = new Array;
        meta['site'] = site;
        getDoc(site_href, meta, function (doc, resp, meta) {
          var i, l, links, lists;
          site = meta['site'];
          lists = $('div.col div.postlist', doc);
          links = [];
          i = 0;
          while (i < lists.length) {
            l = $(lists[i]);
            l = l.find('a');
            links.push(l.attr('href'));
            i++;
          }
          if (links.length === 0) {
            site.addClass('honse');
            return;
          } else if (links.length === 1) {
            site.attr('href', links[0]);
            site.addClass('available');
          }
        });
      }
      site = $('div.aside a[data-host$=\'aaxxy.com\']');
      if (site) {
        site_href = site.attr('href');
        meta = new Array;
        meta['site'] = site;
        getDoc(site_href, meta, function (doc, resp, meta) {
          var i, l, links, lists;
          site = meta['site'];
          lists = $('#contents li', doc);
          links = [];
          i = 0;
          while (i < lists.length) {
            l = $(lists[i]);
            links.push('http://aaxxy.com/' + l.find('a[href^=\'/vodhtml\']').attr('href'));
            i++;
          }
          if (links.length === 0) {
            site.addClass('disabled');
            return;
          } else if (links.length === 1) {
            site.attr('href', links[0]);
            site.addClass('available');
          }
        });
      }

      var imdb, imdb_href, imdb_id;
      imdb = $('div#info a[href^=\'http://www.imdb.com/title/tt\']');
      if (imdb.length) {
        imdb_href = imdb.attr('href');
        imdb_id = imdb.text();
        if (imdb && imdb_id.startsWith('tt')) {
          imdb_id = imdb_id.slice(2);
        } else {
          imdb_id = '';
        }
        getDoc(imdb_href, null, function (doc, resp, meta) {
          var i, item, len, metascore, parse, popularity, ratingCount, ratingValue, rating_douban,
            rating_douban_ratingValue, rating_imdb, rating_more, reviews, starValue, titleReviewBarItem, title_en;
          title_en = $(doc).attr('title');
          title_en = title_en.split(' (')[0];
          update_site_online_sites(title_en, true);
          update_site_offline_sites(title_en, true);
          rating_douban = $('#interest_sectl .rating_wrap').addClass('rating_douban');
          rating_douban_ratingValue = $('#interest_sectl .rating_douban a.rating_people span[property^=v]').text();
          rating_douban_ratingValue = (rating_douban_ratingValue + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
          $('#interest_sectl .rating_douban a.rating_people span[property^=v]').text(rating_douban_ratingValue);
          $('#interest_sectl').prepend($(imdb_html));
          rating_imdb = $('#interest_sectl .rating_imdb');
          $('#interest_sectl .rating_imdb a.rating_people').attr('href', imdb_href + '/' + 'ratings?ref_=tt_ov_rt');
          ratingValue = $('span[itemprop=ratingValue]', doc).text();
          $('#interest_sectl .rating_imdb strong.rating_num').text(ratingValue);
          starValue = ratingValue / 2;
          starValue = starValue % 1 > 0.5 ? Math.floor(starValue) + 0.5 : Math.floor(starValue);
          starValue *= 10;
          starValue = 'bigstar' + starValue;
          $('#interest_sectl .rating_imdb div.rating_right div.ll').addClass(starValue);
          ratingCount = $('span[itemprop=ratingCount]', doc).text();
          $('#interest_sectl .rating_imdb a.rating_people span[property^=v]').text(ratingCount);
          rating_imdb.after($('<div></div>').addClass('rating_more'));
          rating_more = $('#interest_sectl .rating_more');
          titleReviewBarItem = $('.titleReviewBar div.titleReviewBarItem', doc);
          metascore = null;
          popularity = null;
          reviews = null;
          parse = function (item) {
            var Popularity, score, text;
            text = $(item).text();
            if (text.indexOf('Metascore') !== -1) {
              score = $(item).find('a[href^=criticreviews] span').text();
              metascore = $("<div>");
              metascore.html('Metascore');
              return metascore.append($('<a></a>').attr('href', imdb_href + '/' + 'criticreviews?ref_=tt_ov_rt').text(score));
            } else if (text.indexOf('Popularity') !== -1) {
              popularity = $("<div>");
              Popularity = $(item).find('span.subText').html();
              return popularity.html('流行度&nbsp;&nbsp;' + Popularity + '<br>');
            } else if (text.indexOf('Reviews') !== -1) {
              return null;
            }
          };
          for (i = 0, len = titleReviewBarItem.length; i < len; i++) {
            item = titleReviewBarItem[i];
            parse(item);
          }
          if (metascore || popularity || reviews) {
            if (metascore) {
              rating_more.append(metascore);
            }
            if (popularity) {
              rating_more.append(popularity);
            }
            if (reviews) {
              rating_more.append(reviews);
            }
          } else {
            rating_more.remove();
          }
          return null;
        });
      }

    });
  }

}