/*! camera v0.1.7 ~ (c) 2012-2016 zqhe@ewaytec.cn ~ http://gitlab.ewaytec.cn/frontend-components-team/camera.git */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["camera"] = factory();
	else
		root["camera"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "components/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	__webpack_require__(1);

	var _upload2 = __webpack_require__(6);

	var _upload3 = _interopRequireDefault(_upload2);

	var _compress = __webpack_require__(9);

	var _compress2 = _interopRequireDefault(_compress);

	var _rotate = __webpack_require__(10);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function uploadClear(id) {
	    var up = typeof id == "string" ? document.getElementById(id) : id;
	    if ((typeof up === 'undefined' ? 'undefined' : _typeof(up)) != "object") return null;
	    var tt = document.createElement("span");
	    tt.id = "__tt__";
	    up.parentNode.insertBefore(tt, up);
	    var tf = document.createElement("form");
	    tf.appendChild(up);
	    document.getElementsByTagName("body")[0].appendChild(tf);
	    tf.reset();
	    tt.parentNode.insertBefore(up, tt);
	    tt.parentNode.removeChild(tt);
	    tt = null;
	    tf.parentNode.removeChild(tf);
	}

	function drawImage(_camera, settings) {
	    var url;
	    var fileBlob = _camera.file[0].files[0];
	    if (window.createObjectURL != undefined) {
	        // basic
	        url = window.createObjectURL(fileBlob);
	    } else if (window.URL != undefined) {
	        // mozilla(firefox)
	        url = window.URL.createObjectURL(fileBlob);
	    } else if (window.webkitURL != undefined) {
	        // webkit or chrome
	        url = window.webkitURL.createObjectURL(fileBlob);
	    }

	    // 创建一个Image对象，目的是为了获得图片实际的width、height，用于压缩
	    _camera.img = new Image();
	    _camera.img.src = url;
	    _camera.img.style.visiblility = 'hidden';
	    (0, _rotate._getImgAngle)(url, _camera);

	    var imgstatus = 0;
	    $(_camera.img).on("load", function () {
	        console.log(imgstatus);
	        if (imgstatus == 0) {
	            settings.onPreDealWithImg();
	            // util.showMsg('图片等待上传中...', 2000, function () {
	            //     imgstatus = 1;
	            //     //压缩图片
	            //     var imgData = _imageCompression(_camera.img, settings, _camera);
	            //     if (settings.onCompressed) {
	            //         settings.onCompressed(imgData);
	            //     }
	            //     console.log("开始压缩图片");
	            // });

	            console.log('图片等待上传中...');
	            setTimeout(function () {
	                imgstatus = 1;
	                //压缩图片
	                var imgData = (0, _compress2.default)(_camera.img, settings, _camera);
	                if (settings.onCompressed) {
	                    settings.onCompressed(imgData);
	                }
	                console.log("开始压缩图片");
	            }, 0);
	        } else if (imgstatus == 1) {
	            settings.onPreDealWithImg();
	            console.log("开始旋转图片");
	            imgstatus = 2;
	            //旋转图片
	            (0, _rotate._imageRotation)(_camera.img, _camera, settings);
	            $(_camera.img).trigger('load');
	        } else {
	            console.log("开始上传图片");

	            //清空file控件val，不然选择相同图片的时候不会执行上传
	            uploadClear(settings.fileId);
	            //开始上传
	            var up = new _upload3.default({
	                uploadUrl: settings.uploadUrl,
	                data: _camera.imgData,
	                queueId: settings.queueId,
	                queueTemplate: settings.queueTemplate,
	                muiltupload: settings.muiltupload,
	                minWidth: settings.minWidth == "auto" ? 100 : settings.minWidth, //服务端压缩小图宽度的参数
	                minHeight: settings.minHeight == "auto" ? 100 : settings.minHeight, //服务端压缩小图高度的参数
	                mode: settings.mode == null ? "" : settings.mode, //"HW"指定高宽缩放（可能变形）;"W":指定宽，高按比例;"H":指定高，宽按比例;"Cut":指定高宽裁减（不变形）
	                fileExt: settings.fileExt,
	                //上传事件响应
	                onStart: settings.onStart, // 处理新增img标签渲染完毕之后的事件，如刷新iscroll
	                onInit: settings.onInit,
	                onProgress: settings.onProgress,
	                onComplete: settings.onComplete,
	                onFailed: settings.onFailed,
	                onCanceled: settings.onCanceled,
	                showDeleteConfirm: settings.showDeleteConfirm });
	            up.init();
	        }
	    });
	}

	function CameraObj(fileId) {
	    this.file = $('#' + fileId); //上传控件
	    this.img = null; //当前图片对象
	    this.imgData = null; //数据对象
	    this.angle = "0deg"; //图片角度
	}

	var cameraFool = function cameraFool(options) {
	    var _allowUpload = true;
	    var _isUploading = false;

	    var settings = {
	        // uploadUrl: "../../App/UploadCut",//必须
	        uploadUrl: "", //必须
	        uploadBtnId: 'upload',
	        drawImageBox: 'uploader_content', //渲染图片的容器id
	        uploaderInputId: 'uploader_control', //file Input的Id（用于多上传触发时用)
	        lineImageNum: 4, // 一行存放多少img
	        belongedDataId: '', // 图片的数据拥有者Id，新建数据为‘’，编辑数据为该数据的id
	        maxFileCount: 1, // 上传文件个数限制
	        item: null, // 存放Photos数组的对象
	        submitBtnId: 'submit', // 页面提交按钮，用于验证逻辑
	        replace: false, // 在最多上传一张的情况下，是否不用删除直接替换，需要设置muiltupload:false
	        muiltupload: true, //是否上传多个文件
	        fileTypeExts: "image/jpeg", // 在compress.js中使用
	        _allowUpload: true,
	        _isUploading: false,
	        hideBtn: true,
	        mode: 'Cut',
	        _camera: null, //保存camera事件对象
	        onStart: function onStart() {},
	        onInit: function onInit(_upload) {
	            return true;
	        },
	        onDelete: function onDelete() {},
	        onProgress: function onProgress() {},
	        onComplete: function onComplete() {},
	        onSelect: function onSelect() {},
	        onInitImageBox: function onInitImageBox() {
	            if ($('.upload-pic-holder').length && $('#' + this.drawImageBox).length) {
	                var imageBoxWidth = document.getElementById(this.drawImageBox).clientWidth / this.lineImageNum;
	                var boxOuterWidth = $('.upload-pic-holder').outerWidth(true) - $('.upload-pic-holder').width();
	                var imageWidth = imageBoxWidth - boxOuterWidth;
	                $('.upload-pic-holder').css({ width: imageWidth, height: imageWidth }); //初始化宽高，包括上传添加按钮
	                if (!this.muiltupload) {
	                    this.queueTemplate = '<div class="upload-pic-holder" style="width:' + imageWidth + 'px;height:' + imageWidth + 'px"><div class="upload-pic-main"><div class="upload-pic-mask"><div class="upload-pic-progresswrap"><span class="upload-pic-info" data-queue="info"></span><div class="upload-pic-progress"><div data-queue="progress" class="upload-pic-bar" style="width: 0%;"></div></div></div></div><div class="pic-item-holder"><img src="" data-queue="thumb" data-auto-draft="Photos,img" /><div class="imgCover"></div></div></div> </div>';
	                } else {
	                    this.queueTemplate = '<div class="upload-pic-holder" style="width:' + imageWidth + 'px;height:' + imageWidth + 'px"><div class="upload-pic-main"><div class="upload-pic-mask"><div class="upload-pic-progresswrap"><span class="upload-pic-info" data-queue="info"></span><div class="upload-pic-progress"><div data-queue="progress" class="upload-pic-bar" style="width: 0%;"></div></div></div></div><div class="pic-item-holder"><img src="" data-queue="thumb" data-auto-draft="Photos,img" /><div class="imgCover"></div></div><a class="upload-pic-delete" data-queue="cancel"></a></div> </div>';
	                }
	            } else if (!this.muiltupload) {
	                //上传一张时模板去掉删除按钮
	                this.queueTemplate = '<div class="upload-pic-holder" style="margin:0"><div class="upload-pic-main"><div class="upload-pic-mask"><div class="upload-pic-progresswrap"><span class="upload-pic-info" data-queue="info"></span><div class="upload-pic-progress"><div data-queue="progress" class="upload-pic-bar" style="width: 0%;"></div></div></div></div><div class="pic-item-holder"><img src="" data-queue="thumb" data-auto-draft="Photos,img" /><div class="imgCover"></div></div></div> </div>';
	            }
	            $('.upload-pic-holder').addClass('line' + this.lineImageNum);
	        }, //初始化存放图片的宽度高度
	        queueTemplate: '<div class="upload-pic-holder"><div class="upload-pic-main"><div class="upload-pic-mask"><div class="upload-pic-progresswrap"><span class="upload-pic-info" data-queue="info"></span><div class="upload-pic-progress"><div data-queue="progress" class="upload-pic-bar" style="width: 0%;"></div></div></div></div><div class="pic-item-holder"><img src="" data-queue="thumb" data-auto-draft="Photos,img" /><div class="imgCover"></div></div></div> </div>'
	    };

	    settings = $.extend(settings, options);
	    settings.onInitImageBox(); //扩展后执行初始化宽高

	    if (!settings.item.Photos) {
	        settings.item.Photos = [];
	    }

	    var fullSettings = {
	        uploadBtnId: settings.uploadBtnId,
	        fileId: settings.uploaderInputId,
	        queueId: settings.drawImageBox,

	        // 一行格式，参考兴趣小组-创建小组
	        // 多行格式，参考兴趣小组-发布格式
	        queueTemplate: settings.queueTemplate,

	        uploadUrl: settings.uploadUrl, //必须
	        width: '800', //settings.maxCompressedWidth, // 图片压缩后最大宽度 auto 为原始宽度 默认：auto
	        height: '800', //settings.maxCompressedHeight, // 图片压缩后最大高度度 auto 为原始高度 默认：auto
	        minWidth: "300", // 服务端压缩小图宽度的参数
	        minHeight: "300", // 服务端压缩小图高度的参数
	        mode: settings.mode,
	        quality: 1, // 图片压缩品质 0~1
	        muiltupload: settings.muiltupload,
	        Control: false, //这个参数的使用详见微摄影，场景是拖拉排序问题
	        showDeleteConfirm: settings.showDeleteConfirm ? settings.showDeleteConfirm : false,

	        onAfterDrawImage: function onAfterDrawImage() {
	            settings._allowUpload = false;
	        },
	        onPreDealWithImg: function onPreDealWithImg() {
	            // 在图片预处理（压缩、旋转）的时候执行
	            // 在图片预处理时，不能提交页面数据
	            console.log('在图片预处理时，视为图片上传中，不能提交页面数据');
	            settings._isUploading = true;
	            $("#" + settings.submitBtnId).addClass('isUploading');
	            $("#" + settings.submitBtnId).addClass('btn-disabled'); //处理图片等待的过程中禁止提交按钮
	        },
	        onSelect: function onSelect() {
	            if (!settings.item.Photos) {
	                settings.item.Photos = [];
	            }

	            if (settings.replace) {
	                settings.item.Photos = [];
	            }
	            settings.onSelect();

	            if (settings.item.Photos.length < settings.maxFileCount) {
	                console.log('settings._allowUpload', settings._allowUpload);
	                console.log('settings._isUploading', settings._isUploading);
	                if (settings._allowUpload && !settings._isUploading) {
	                    console.log('可以上传');
	                    return true;
	                } else {
	                    // Eap._util.showMsg('请等待照片加载完成...', 1000);
	                    console.log('请等待照片加载完成');
	                    return false;
	                }
	            } else {
	                // Eap._util.showMsg('最多只能添加' + settings.maxFileCount + '张照片', 1000);
	                console.log('最多只能添加' + settings.maxFileCount + '张照片');
	                return false;
	            }
	        },
	        onStart: function onStart() {
	            settings._isUploading = true;
	            //允许上传多张图片是，到最后一张隐藏上传按钮
	            if (settings.muiltupload && settings.hideBtn) {
	                var numberLine = settings.maxFileCount / settings.lineImageNum;
	                if (settings.item.Photos.length == settings.maxFileCount - 1) {
	                    document.getElementById(settings.uploadBtnId).parentElement.style.display = 'none';
	                    if (Math.floor(numberLine) == numberLine) {
	                        document.getElementById(settings.uploadBtnId).parentElement.style.width = '0%';
	                        document.getElementById(settings.uploadBtnId).parentElement.style.height = '0%';
	                    }
	                } else {
	                    document.getElementById(settings.uploadBtnId).parentElement.style.display = 'block';
	                    if (Math.floor(numberLine) == numberLine) {
	                        document.getElementById(settings.uploadBtnId).parentElement.style.width = settings.boxSize + 'px';
	                        document.getElementById(settings.uploadBtnId).parentElement.style.height = settings.boxSize + 'px';
	                    }
	                }
	            }
	            $("#" + settings.submitBtnId).addClass('isUploading');
	            settings.onStart();
	        },
	        onDelete: function onDelete() {
	            if (this.hideBtn) {
	                var numberLine = this.maxFileCount / this.lineImageNum;
	                if (this.item.Photos.length == this.maxFileCount) {
	                    document.getElementById(this.uploadBtnId).parentElement.style.display = 'none';
	                    if (Math.floor(numberLine) == numberLine) {
	                        document.getElementById(this.uploadBtnId).parentElement.style.width = '0%';
	                        document.getElementById(this.uploadBtnId).parentElement.style.height = '0%';
	                    }
	                } else {
	                    document.getElementById(this.uploadBtnId).parentElement.style.display = 'block';
	                    if (Math.floor(numberLine) == numberLine) {
	                        document.getElementById(this.uploadBtnId).parentElement.style.width = this.boxSize + 'px';
	                        document.getElementById(this.uploadBtnId).parentElement.style.height = this.boxSize + 'px';
	                    }
	                }
	            }
	        },
	        onInit: function onInit(_upload) {
	            var upload = settings.onInit(_upload);
	            settings._allowUpload = !upload;
	            return upload;
	        },
	        onProgress: function onProgress() {
	            settings.onProgress();
	        },
	        onComplete: function onComplete(result) {
	            settings._allowUpload = true;
	            settings._isUploading = false;

	            if (result.errcode == "0") {
	                $('#' + settings.uploaderInputId).attr('data-src', result.info.fileName);
	                $("#" + settings.submitBtnId).removeClass('isUploading');
	                if (settings.Control) {
	                    setTimeout(function () {
	                        $('#' + settings.drawImageBox).find('.upload-pic-mask').not(".chackson").hide();
	                    }, 1000);
	                } else {
	                    setTimeout(function () {
	                        $('#' + settings.drawImageBox).find('.upload-pic-mask').hide();
	                    }, 1000);
	                }
	            }

	            if (result.errcode !== "0" || result.errmsg !== "OK") {
	                // Eap._util.showMsg('上传失败！');

	                console.log('上传失败');
	                $('#' + settings.drawImageBox).find(".upload-pic-holder *[data-queue='cancel']").last().trigger('click', true);
	                // settings._allowUpload=true;
	                // settings._isUploading=false;
	                // $("#" + settings.submitBtnId).removeClass('btn-grey');
	                settings.onDelete();
	                fullSettings.onDelete();
	                return false;
	            }

	            if (!settings.item.Photos) {
	                settings.item.Photos = [];
	            }

	            if (settings.item.Photos.length < settings.maxFileCount && result.errcode == "0") {
	                settings.item.Photos.push({
	                    ItemId: settings.belongedDataId,
	                    guidblob: result.info.originalFileName,
	                    guid: result.info.originalFileName,
	                    BigPic: result.info.bigPic,
	                    BigPicUrl: result.info.bicPicUrl,
	                    SmallPic: result.info.smallPic,
	                    SmallPicUrl: result.info.smallPicUrl,
	                    ViewPath: result.info.viewPath,
	                    BicPicTwoUrl: result.info.bicPicTwoUrl,
	                    originalFileName: result.info.originalFileName,
	                    fileName: result.info.fileName,
	                    fileSize: result.info.fileSize,
	                    thumbFileName: result.info.thumbFileName,
	                    contentType: result.info.contentType,
	                    ItemPhotoId: -1 // 所有的上传图片都视为新建图片，ItemPhotoId为-1
	                });
	            }

	            if (settings.item.Photos.length == settings.maxFileCount) {
	                $("#" + settings.submitBtnId).removeClass('btn-disabled');
	            } else if (settings.item.Photos.length < settings.maxFileCount) {
	                $("#" + settings.submitBtnId).removeClass('btn-disabled');
	            } else {
	                $("#" + settings.submitBtnId).addClass('btn-disabled');
	            }

	            // $("#" + settings.submitBtnId).removeClass('btn-grey');

	            $("*[data-queue='cancel']", settings.queueTemplate).on("click", function (e) {
	                //上传完成后删掉图片
	                settings.item.Photos.length = settings.item.Photos.length - 1;
	                settings.onDelete();
	                fullSettings.onDelete();
	            });

	            settings.onComplete();
	        },
	        onCanceled: function onCanceled(e) {
	            settings._allowUpload = true;
	            $('#' + settings.uploaderInputId).attr('data-src', '');

	            var oldLength = settings.item.Photos.length;

	            var guid = $(e.target).parents('.upload-pic-holder').attr('id');

	            for (var i = 0; i < settings.item.Photos.length; i++) {
	                if (settings.item.Photos[i].guid == guid) {
	                    settings.item.Photos.splice(i, 1);
	                }
	            };

	            $("#" + settings.submitBtnId).removeClass('btn-disabled');
	            // $("#" + settings.submitBtnId).removeClass('btn-grey');

	            // 删除正在上传的图片（删除前后Photos的长度不变，因为图片没有上传完毕）
	            if (oldLength == settings.item.Photos.length) {
	                settings._isUploading = false;
	                $("#" + settings.submitBtnId).removeClass('isUploading');
	            }

	            settings.onDelete();
	            fullSettings.onDelete();
	        },
	        onFailed: function onFailed() {
	            settings._allowUpload = true;
	            settings._isUploading = false;
	            $("#" + settings.submitBtnId).removeClass('btn-disabled isUploading');
	        }
	    };

	    var _camera = new CameraObj(fullSettings.fileId);

	    _camera.init = function () {
	        // 判断是否存在多个上传按钮
	        if (fullSettings.uploadBtnId.indexOf(',') > -1) {
	            var tempBtnIds = fullSettings.uploadBtnId.split(',');
	            for (var i_tempBtnIds = 0, len_tempBtnIds = tempBtnIds.length; i_tempBtnIds < len_tempBtnIds; i_tempBtnIds++) {
	                tempBtnIds[i_tempBtnIds] = '#' + tempBtnIds[i_tempBtnIds];
	            }
	            fullSettings.uploadBtnId = tempBtnIds.join(',');
	        } else {
	            fullSettings.uploadBtnId = '#' + fullSettings.uploadBtnId;
	        }

	        $(fullSettings.uploadBtnId).on('click', function (e) {
	            e.stopPropagation();
	            if (fullSettings.onSelect()) {
	                _camera.file.click();
	            } else {
	                console.log('不通过onselect的判断');
	            }
	        });
	        settings._camera = _camera;
	        _camera.file.on("change", function () {
	            var fileFullName = this.files[0].name;
	            var fileType = this.files[0].type;
	            settings._isUploading = true;
	            //alert(this.files[0].type);
	            //alert(this.files[0].name);
	            console.log("选择图片" + fileFullName);
	            if (fileFullName != "") {
	                var fileName = fileFullName.substring(fileFullName.lastIndexOf("\\") + 1);
	                var fileExt = fileFullName.substring(fileFullName.lastIndexOf(".")).toLowerCase();
	                if (fileType) {
	                    //alert('通过file.type正常获取type');
	                    if (fileExt == ".jpg" || fileExt == ".gif" || fileExt == ".png" || fileExt == ".jpeg") {
	                        fullSettings.fileExt = fileExt;
	                        drawImage(_camera, fullSettings);
	                        fullSettings.onAfterDrawImage();
	                    } else {
	                        // 原有逻辑
	                        // Eap._util.showMsg('文件格式不是图片,请重新上传', 1000, function () {
	                        //     //上传失败
	                        //     $("#submitBtn").removeClass('btn-disabled');
	                        //     $('#'+settings.uploaderInputId).attr('data-src', '');
	                        //     document.getElementById(''+settings.uploaderInputId).value = '';
	                        //     return false;
	                        // });

	                        console.log('文件格式不是图片,请重新上传');
	                        //上传失败
	                        settings._isUploading = false;
	                        $("#submitBtn").removeClass('btn-disabled');
	                        $('#' + settings.uploaderInputId).attr('data-src', '');
	                        document.getElementById('' + settings.uploaderInputId).value = '';
	                        return false;
	                    }
	                } else {
	                    // file.type为空时：某些机型使用File的属性不能正常获取格式类型，使用fileReader获取特征字节符进行判断
	                    // 参考：http://stackoverflow.com/questions/18299806/how-to-check-file-mime-type-with-javascript-before-upload
	                    //alert('file.type为空，使用fileReader获取特征字节符进行判断');
	                    var blob = this.files[0];
	                    var fileReader = new FileReader();
	                    fileReader.onloadend = function (e) {
	                        var arr = new Uint8Array(e.target.result).subarray(0, 4);
	                        var header = "";
	                        for (var i = 0; i < arr.length; i++) {
	                            header += arr[i].toString(16);
	                        }
	                        var type = '';
	                        switch (header) {
	                            case "89504e47":
	                                type = "image/png";
	                                fileExt = '.png';
	                                break;
	                            case "47494638":
	                                type = "image/gif";
	                                fileExt = '.gif';
	                                break;
	                            case "ffd8ffe0":
	                            case "ffd8ffe1":
	                            case "ffd8ffe2":
	                                type = "image/jpeg";
	                                fileExt = '.jpeg';
	                                break;
	                            default:
	                                type = "unknown";

	                                // 原有逻辑
	                                // Eap._util.showMsg('文件格式不是图片,请重新上传', 1000, function () {
	                                //     //上传失败
	                                //     $("#submitBtn").removeClass('btn-disabled');
	                                //     $('#'+settings.uploaderInputId).attr('data-src', '');
	                                //     document.getElementById(''+settings.uploaderInputId).value = '';
	                                //     return false;
	                                // });

	                                console.log('文件格式不是图片,请重新上传');
	                                //上传失败
	                                settings._isUploading = false;
	                                $("#submitBtn").removeClass('btn-disabled');
	                                $('#' + settings.uploaderInputId).attr('data-src', '');
	                                document.getElementById('' + settings.uploaderInputId).value = '';
	                                return false;

	                                break;
	                        }

	                        //alert(header);
	                        //alert(type);
	                        if (type && type != 'unknown') {
	                            fullSettings.fileExt = fileExt;
	                            drawImage(_camera, fullSettings);
	                            fullSettings.onAfterDrawImage();
	                        }
	                    };
	                    fileReader.readAsArrayBuffer(blob);
	                }
	            }
	        });
	    };

	    _camera.init();

	    return {
	        isAllowUpload: function isAllowUpload() {
	            return settings._allowUpload;
	        },
	        clearItems: function clearItems() {
	            settings.item = {};
	        },
	        getItems: function getItems() {
	            return settings.item;
	        },
	        getMaxFileCount: function getMaxFileCount() {
	            return settings.maxFileCount;
	        }
	    };
	};

	exports.default = cameraFool;
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(2);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../../Users/32606/AppData/Roaming/npm/node_modules/fis/node_modules/css-loader/index.js!./../../../../../Users/32606/AppData/Roaming/npm/node_modules/fis/node_modules/postcss-loader/index.js!./camera.css", function() {
				var newContent = require("!!./../../../../../Users/32606/AppData/Roaming/npm/node_modules/fis/node_modules/css-loader/index.js!./../../../../../Users/32606/AppData/Roaming/npm/node_modules/fis/node_modules/postcss-loader/index.js!./camera.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, ".camera-btn{\r\n    display: inline-block;\r\n    width: 100%;\r\n    height: 100%;\r\n    box-sizing: border-box;\r\n    vertical-align: middle;\r\n    text-align: center;\r\n    position: relative;\r\n    background: url(" + __webpack_require__(4) + ") center no-repeat;\r\n    background-size: contain;\r\n    \r\n}\r\n\r\n.upload-transparent-input{\r\n    position: absolute;\r\n    left: 0;\r\n    top: 0;\r\n    width: 64px;\r\n    height: 64px;\r\n    opacity: 0;\r\n    z-index: -1;\r\n}\r\n\r\n.upload-wrapper{\r\n    padding: 8px;\r\n    background-color: #FFFFFF;\r\n}\r\n.upload-wrapper:after{\r\n    content: '';\r\n    display: block;\r\n    clear: both;\r\n}\r\n\r\n.upload-wrapper .up-btn,\r\n.upload-wrapper .up-item\r\n{\r\n    width: 64px;\r\n    height: 64px;\r\n    float: left;\r\n    margin: 6px;\r\n}\r\n.upload-wrapper .up-item{\r\n    position: relative;\r\n}\r\n.upload-wrapper .up-progress-mask{\r\n    background-color: rgba(0,0,0,0.6);\r\n    position: absolute;\r\n    top: 0;\r\n    left: 0;\r\n    width: 100%;\r\n    height: 100%;\r\n    line-height: 64px;\r\n    text-align: center;\r\n    color: #FFFFFF;\r\n    font-size: 12px;\r\n    display: none;\r\n}\r\n.upload-wrapper .up-progress-mask.on{\r\n    display: block;\r\n}\r\n\r\n.upload-wrapper img{\r\n    width: 64px;\r\n    height: 64px;\r\n    vertical-align: middle;\r\n}\r\n.upload-wrapper .up-del{\r\n    position: absolute;\r\n    z-index: 777;\r\n    height: 20px;\r\n    width: 20px;\r\n    border-radius: 10px;\r\n    -webkit-border-radius: 10px;\r\n    color: #FFFFFF;\r\n    background-color: #F97642; \r\n    line-height:87%;\r\n    overflow:hidden;\r\n    text-align: center;\r\n    top: -8px;\r\n    right: -8px;\r\n    font-size:20px;\r\n}\r\n\r\n/*单个图片模式*/\r\n.upload-wrapper.single{\r\n    padding: 0;\r\n    background-color: transparent;\r\n    display: inline-block;\r\n    width: 64px;\r\n    height: 64px;\r\n    margin-right: 12px;\r\n    vertical-align: middle;\r\n}\r\n.upload-wrapper.single .up-item{\r\n    margin: 0;\r\n}\r\n.upload-wrapper.single .up-img-holder{\r\n    height: 64px;\r\n}\r\n.upload-wrapper.single img{\r\n    vertical-align: baseline;\r\n}\r\n\r\n\r\n\r\n\r\n/* ============================================================\r\n    拍照样式\r\n ============================================================ */\r\n\r\n\r\n.upload-pic-holder {\r\n    width: 100%;\r\n    height: 100%;\r\n    display: inline-block;\r\n    float:left;\r\n    margin: 0.1125rem;\r\n}\r\n\r\n.upload-pic-main {\r\n    height: 100%;\r\n    position: relative;\r\n}\r\n\r\n .upload-pic-mask {\r\n    width: 100%;\r\n    height: 100%;\r\n    position: absolute;\r\n    display: block;\r\n    background: rgba(0,0,0,0.6);\r\n    z-index: 777;\r\n    color: white;\r\n    font-weight: bold;\r\n    text-align: center;\r\n    vertical-align: middle;\r\n    // line-height: 70px;\r\n}\r\n\r\n .upload-pic-mask .upload-pic-progresswrap {\r\n    width: 100%;\r\n    height: 100%;\r\n    line-height: 100%;\r\n}\r\n\r\n .upload-pic-mask .upload-pic-progresswrap .upload-pic-info {\r\n    font-size: 12px;\r\n    font-weight: normal;\r\n}\r\n\r\n .pic-item-holder{\r\n    width:100%;\r\n    height:100%;\r\n}\r\n\r\n .upload-pic-main .pic-item-holder img {\r\n    vertical-align: middle;\r\n    position: absolute;\r\n    top: 50%;\r\n    left: 50%;\r\n    -webkit-transform: translate(-50%,-50%);\r\n            transform: translate(-50%,-50%);\r\n    width: 100%;\r\n    max-height: 100%;\r\n    background-size:cover;\r\n    background-position: center center;\r\n    display:none;\r\n}\r\n\r\n .upload-pic-main .upload-pic-delete {\r\n    position: absolute;\r\n    right: 0;\r\n    top: 0;\r\n    z-index: 888;\r\n    width: 1rem;\r\n    height: 1rem;\r\n    display: inline-block;\r\n    background-color:#b0ac9d;\r\n    background-size:contain;    \r\n}\r\n\r\n.upload-pic-info{\r\n    position: relative;\r\n    top: 50%;\r\n    left: 50%;\r\n    -webkit-transform: translate(-50%,-50%);\r\n            transform: translate(-50%,-50%);\r\n}\r\n/* 上传图片按钮+&文字配置 */\r\n.upload-word {\r\n    width: 100%;\r\n    height: 100%;\r\n    position: relative;\r\n    top: 50%;\r\n    left: 50%;\r\n    -webkit-transform: translate(-50%,-50%);\r\n            transform: translate(-50%,-50%);\r\n    background-size: contain;\r\n    border:1px solid #dbdee1;\r\n}\r\n\r\n.line-1{\r\n    width:41%;\r\n    height:0.1rem;\r\n    background-color:#aab4bd;\r\n    position:absolute;\r\n    left:50%;\r\n    top:36%;\r\n    -webkit-transform:translate3d(-50%,-50%,0);\r\n            transform:translate3d(-50%,-50%,0);\r\n\r\n}\r\n\r\n.line-2{\r\n    width:41%;\r\n    height:0.1rem;\r\n    background-color:#aab4bd;\r\n    position:absolute;\r\n    top:36%;\r\n    left:50%;\r\n    -webkit-transform:translate3d(-50%,-50%,0) rotate(90deg);\r\n            transform:translate3d(-50%,-50%,0) rotate(90deg);\r\n}\r\n\r\n.line-word{\r\n    color:#aab4bd;\r\n    position:absolute;\r\n    top:75%;\r\n    left:50%;\r\n    width:100%;\r\n    -webkit-transform:translate(-50%,-50%);\r\n            transform:translate(-50%,-50%);\r\n    text-align: center;\r\n}\r\n\r\n.upBox{\r\n    position:relative;\r\n    top:50%;\r\n    left:50%;\r\n    -webkit-transform:translate(-50%,-50%);\r\n            transform:translate(-50%,-50%);\r\n    width:100%;\r\n    height:100%;\r\n}\r\n\r\n.line1 .line-word{\r\n    font-size:2rem;\r\n}\r\n\r\n.line2 .line-word{\r\n    font-size:1rem;\r\n}\r\n\r\n.line3 .line-word{\r\n    font-size:.6rem;\r\n}\r\n\r\n.line4 .line-word{\r\n    font-size:.6rem;\r\n}\r\n\r\n.line5 .line-word{\r\n    font-size:.4rem;\r\n}\r\n\r\n.line6 .line-word{\r\n    font-size:.4rem;\r\n}\r\n\r\n/* 单+号 */\r\n\r\n.singlePlus .line-1{\r\n    width:41%;\r\n    height:0.2rem;\r\n    background-color:#aab4bd;\r\n    position:absolute;\r\n    left:50%;\r\n    top:50%;\r\n    -webkit-transform:translate3d(-50%,-50%,0);\r\n            transform:translate3d(-50%,-50%,0);\r\n\r\n}\r\n\r\n.singlePlus .line-2{\r\n    width:41%;\r\n    height:0.2rem;\r\n    background-color:#aab4bd;\r\n    position:absolute;\r\n    top:50%;\r\n    left:50%;\r\n    -webkit-transform:translate3d(-50%,-50%,0) rotate(90deg);\r\n            transform:translate3d(-50%,-50%,0) rotate(90deg);\r\n}", ""]);

	// exports


/***/ },
/* 3 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RjVDMkQ2QjM2Mjg1MTFFNTlENEU5MDI2MkUzQjg4RTAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RjVDMkQ2QjQ2Mjg1MTFFNTlENEU5MDI2MkUzQjg4RTAiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGNUMyRDZCMTYyODUxMUU1OUQ0RTkwMjYyRTNCODhFMCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGNUMyRDZCMjYyODUxMUU1OUQ0RTkwMjYyRTNCODhFMCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PhRmSNgAAARxSURBVHja7J1XaBRRGIXvWkGJXVGQqPhgQVGxYEXBWBMsiWJH0Sfbk4rGhoqYBCyIYHuy94KKHV0So0hQEXwQRAR9ELGBXaIxnp/9F65j1sSU2bs758CX2ZncnRnm5JZzZ3YTCocflpo/FbJee3/HMjVcpo4u74L8Mt6UZ8oXy1RPmf5gaAg1xFBOaAXIqcXr4IxypRmjIY6plnYoObwU7hhCudOHlNIQ1hCKhtAQqrKq44nwFGsIxWDIYEixyWIwpFhDaAhFQxgMKdYQisGQwZBik8VgSLGG0BCKhjAYUoGpIfXAJvBWh9uu8xwMS+ZguAFkg+YJ8gebCrb63WSVqjvZPhxvvi6HgJeOm5EC5KMBXf02xE810uULxWU11mV9H4MhP47AYS9FQ2gIxWBYAbUDq0EX8ABsBK9dNCQIagoKQVtdHwSGg97guyPnKNEjNyhN1lTLjKgkX6S72IcE4Y5hyxjbm7FTj4+umL+/UeEnCDt0jglzx3AEOAgGVGEfRWAJKNb1z2AeeMpO/f80HpwwkVniTDAGFFRyX9vAftABPAGfmEMqb4aoAbgEBldhn+/BfVfNcNkQrxmvdNlQTRmYzEldgmG2Q+c0wWPGadBRl6IUNaV/shrikiaC4x4zpoOvuryg2xvryKlvEnnh3KOkYsYxy4xTYJo1MpLlJHDZMuWapu2kqiEuBMNMjxkn1YwfnnJiSha4rutN1JReFThGbbAIzGKTVb4ZRy0zjqsZP2OU/6b9TL6VtsWUHv84hozQzoAd4ICJTCy6JieCYZbHDKklM0BJOe+TPkXmoQp1vYXWmm5llJUHKm6Acda2VY4NZJyoIWLGEcsMMWZmBcyI6gvIMJHvixS11AtvP5TQHty2RmTvrCkUeRxpMQ0pu2Yc1ra95D/38wGMBvd0vZWa0hn0BHdAJ/3dM9APLLXevx3MpSHGbAF19bXMU82uhBm2KaNM5JEdUWtwU6dY2ui2R5rwxRR5zmqdbpcMthdMccWQeN0xjB5T5pbmVcEMe0pkpBrRzTLCaJOWrmWiWq8Bc4mOvg7oYOF8kPuQfdVkRlRvTOQu4GNrm3T0aR4zoloG9ujrejo7kBbUYJilbXdJNe/3tV7UU9osZmjnX5akc18ADum6PBB3zkRu7wYuGN4zsb+Cu6qSR1Qna+ddXE7ZX2AOOGvllYugT5CDYbwltVTuuV+1pmRk8rJ7EIOhKyrWGYMCK9OcZQ2Jr75qmi+y0j8NibMk04wFO02c5rtoyN+S6ZWFYHOQgiH1D0P81EcT+dBOqnH/iZcU65z9Coa5fl+UXWA5uJVAf7S7kzkYrtVjvUuQvkTOdU0yd+oy3l+pQ8qQ47TQcy326dowGLooGkJDKBqSYDmEwZA1hIoRDPmtpC7WEH4rKZssisGQNYSiITSEYjBkDaEYDBkMGQzZZFEMhqwhFA2hIRSDIWsIxWDIYEixyaIYDBNilOXV8hhl81imRssMlR+hcPih918exfr8uD08ZpkaKvNbgAEArhQn1kpgPOgAAAAASUVORK5CYII="

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _guid = __webpack_require__(7);

	var _guid2 = _interopRequireDefault(_guid);

	var _dataURLtoBlob = __webpack_require__(8);

	var _dataURLtoBlob2 = _interopRequireDefault(_dataURLtoBlob);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	//文件分块上传
	var upload = function upload(options) {
	    var settings = $.extend({
	        // uploadUrl: "../../App/Upload",
	        uploadUrl: "",
	        minWidth: "100", //服务端压缩小图宽度的参数
	        minHeight: "100", //服务端压缩小图高度的参数
	        mode: "", //"HW"指定高宽缩放（可能变形）;"W":指定宽，高按比例;"H":指定高，宽按比例;"Cut":指定高宽裁减（不变形）
	        data: "", //对象
	        slicesize: 1024 * 10, //10k 分割文件大小
	        queueId: "",
	        queueTemplate: "",
	        fileExt: "", //后缀
	        muiltupload: true,
	        showDeleteConfirm: true, // 删除图片时是否提示 “您确定要删除该照片么”
	        //事件响应
	        onStart: function onStart() {},
	        onInit: function onInit() {},
	        onProgress: function onProgress() {},
	        onComplete: function onComplete() {},
	        onFailed: function onFailed() {},
	        onCanceled: function onCanceled() {}
	    }, options);

	    //创建上传进度提示
	    var _createQueue = function _createQueue() {
	        console.log("创建上传进度提示");
	        _upload.queueHtml = $(settings.queueTemplate).prop("id", _upload.guid);

	        var $uploadWrapper = $("#" + settings.queueId);
	        if (settings.muiltupload) {
	            // 如果uploadWrapper中存在另外一个上传按钮，则新的uploadItem插入到按钮之前
	            if ($uploadWrapper.find('.anotherUploadBtn').length !== 0) {
	                // 控制样式，隐藏原先的按钮
	                $('#multiUpload').addClass('multiUpload');
	                $uploadWrapper.show();
	                var $anotherUploadBtn = $uploadWrapper.find('.anotherUploadBtn');
	                $anotherUploadBtn.before(_upload.queueHtml);
	            } else {
	                $uploadWrapper.css("display", "block");
	                $uploadWrapper.append(_upload.queueHtml);
	            }
	        } else {
	            $uploadWrapper.css("display", "block");
	            $uploadWrapper.html(_upload.queueHtml);
	        }

	        // 显示缩略图，_upload.data即_camera.imgData，经canvas压缩、调整方向输出的DataURL
	        // $("img[data-queue='thumb']", _upload.queueHtml).prop("src", _upload.data);
	        $('.imgCover', _upload.queueHtml).attr('style', 'background:url(' + _upload.data + ');width:100%;height:100%;background-size:cover;background-position:center center;background-repeat:no-repeat;');

	        $("*[data-queue='cancel']", _upload.queueHtml).on("click", function (e, noConfirm) {
	            //图片上传失败后不需要二级提示,由于在cameraFool里面设置了需要二级提示，所以图片上传失败后会调用onDelete()方法弹出二级提示。
	            noConfirm == true ? settings.showDeleteConfirm = false : settings.showDeleteConfirm;
	            if (settings.showDeleteConfirm) {
	                // Eap._util.confirm("您确定要删除该照片么", function (result) {
	                //     if (result) {
	                //         _upload.uploadCancel(e);
	                //     }
	                // });
	            } else {
	                _upload.uploadCancel(e);
	            }
	        });
	    };

	    var _upload = {
	        data: settings.data, //文件
	        guidblob: "", //文件块
	        totalsize: 0, //文件总大小
	        guid: 0,
	        blob_start: 0,
	        blob_end: 0,
	        nextaction_paras: 0,
	        uploadStatus: 0, //上传状态 0:未上传  1：正在上传  2：上传成功 3:取消上传 4：上传失败
	        queueHtml: ""
	    };

	    //初始化
	    _upload.init = function () {
	        console.log("初始化上传");
	        _upload.uploadStatus = 0;
	        //_upload.guid = getGuid() + settings.fileExt;
	        _upload.guid = (0, _guid2.default)();
	        // 这里将canvas生成的压缩后的dataURL装换成Blob
	        _upload.guidblob = (0, _dataURLtoBlob2.default)(settings.data);
	        _upload.totalsize = _upload.guidblob.size;

	        if (settings.onInit(_upload)) {
	            _createQueue();

	            settings.onStart();

	            _upload.uploadFile(0);
	        }
	    };
	    //开始上传
	    _upload.uploadStart = function () {
	        _upload.uploadFile(0);
	    };
	    //取消上传
	    _upload.uploadCancel = function (e) {
	        _upload.uploadStatus = 3;
	        //防止照片栏下面有输入框穿透的问题，所以延时
	        //setTimeout(function () {
	        _upload.queueHtml.remove();
	        settings.onCanceled(e);
	        //}, 500)
	    };
	    //上传中
	    _upload.uploadProgress = function (evt) {
	        if (_upload.uploadStatus != 3) {
	            var percentComplete = Math.round(((Number(evt.loaded) || 0) + this.blob_start) * 100 / this.totalsize);
	            $("*[data-queue='progress']", _upload.queueHtml).width(percentComplete + "%");
	            $("*[data-queue='info']", _upload.queueHtml).html(percentComplete + "%").css('display', 'block');
	            settings.onProgress(percentComplete);
	        } else {
	            console.log("--------------已经取消的了");
	            _upload.blob_end = null;
	        }
	    };
	    //上传完成
	    _upload.uploadComplete = function (evt) {
	        if (_upload.blob_end >= _upload.totalsize) {
	            var result = eval("(" + evt.target.responseText + ")");

	            if (result.errmsg == "OK" && result.errcode == "0") {
	                $("*[data-queue='progress']", _upload.queueHtml).width(100 + "%");
	                $("*[data-queue='info']", _upload.queueHtml).html("上传成功").css('display', 'block');
	            } else {
	                $("*[data-queue='info']", _upload.queueHtml).html("上传失败").css('display', 'block');
	            }

	            if (result.errmsg == "OK" && result.errcode == "0") {
	                // 用于AutoDraft.js----Start
	                $("img[data-queue='thumb']", _upload.queueHtml).attr({
	                    guid: result.info.originalFileName,
	                    BigPic: result.info.bigPic,
	                    BigPicUrl: result.info.bicPicUrl,
	                    SmallPicUrl: result.info.smallPicUrl,
	                    SmallPic: result.info.smallPic,
	                    BicPicTwoUrl: result.info.bicPicTwoUrl
	                });
	            }
	            // 用于AutoDraft.js----End

	            settings.onComplete(result);
	        } else {
	            window.setTimeout(function () {
	                if (_upload.uploadStatus == 0 || _upload.uploadStatus == 1) {
	                    _upload.uploadStatus = 1;
	                    _upload.uploadFile(_upload.blob_end);
	                }
	            }, 50);
	        }
	    };
	    //上传文件
	    _upload.uploadFile = function (start) {
	        console.log("开始上传");
	        if (start >= _upload.totalsize) {
	            return;
	        }
	        _upload.blob_start = start;
	        _upload.blob_end = start + settings.slicesize;
	        if (_upload.blob_end > settings.totalsize) {
	            _upload.blob_end = settings.totalsize;
	        }
	        //分割文件
	        if (this.guidblob.slice) {
	            var sliceblob = _upload.guidblob.slice(_upload.blob_start, _upload.blob_end);
	        } else if (this.guidblob.webkitSlice) {
	            var sliceblob = _upload.guidblob.webkitSlice(_upload.blob_start, _upload.blob_end);
	        } else if (this.guidblob.mozSlice) {
	            var sliceblob = _upload.guidblob.mozSlice(_upload.blob_start, _upload.blob_end);
	        }

	        // 目前的上传逻辑：分片1成功上传完毕之后，才会开始上传分片2。并非并发上传。
	        var f = new FileReader();
	        f.onload = function (e) {
	            var xhr = new XMLHttpRequest();
	            /* event listners */
	            xhr.addEventListener("progress", function (event) {
	                _upload.uploadProgress(event);
	            }, false);
	            xhr.addEventListener("load", function (event) {
	                _upload.uploadComplete(event);
	            }, false);
	            //xhr.addEventListener("error", function (event) { _upload.uploadFile(_upload.blob_start); }, false);
	            xhr.addEventListener("abort", function (event) {
	                _upload.uploadFile(_upload.blob_start);
	            }, false);
	            xhr.addEventListener("readystatechange", function (event) {
	                if (xhr.readyState == 4) {
	                    if (xhr.status == 200) {} else {
	                        _upload.uploadStatus = 4;

	                        settings.onFailed();
	                        return;
	                    }
	                }
	            }, false);

	            /* Be sure to change the url below to the url of your upload server side script */
	            var fix = "?";
	            if (settings.uploadUrl.indexOf('?') < 0) {
	                fix = "?";
	            } else {
	                fix = "&";
	            }
	            if (_upload.blob_end > _upload.totalsize) {
	                _upload.blob_end = _upload.totalsize;
	            }
	            if (_upload.nextaction_paras) {
	                xhr.open("POST", settings.uploadUrl + fix + "guid=" + _upload.guid + "&minWidth=" + settings.minWidth + "&mode=" + settings.mode + "&minHeight=" + settings.minHeight + "&totalSize=" + _upload.totalsize + "&startSize=" + _upload.blob_start + "&endSize=" + _upload.blob_end + "&" + _upload.nextaction_paras + "&suffix=" + settings.fileExt + "&sliceSize=" + settings.slicesize);
	            } else {
	                xhr.open("POST", settings.uploadUrl + fix + "guid=" + _upload.guid + "&minWidth=" + settings.minWidth + "&mode=" + settings.mode + "&minHeight=" + settings.minHeight + "&totalSize=" + _upload.totalsize + "&startSize=" + _upload.blob_start + "&endSize=" + _upload.blob_end + "&suffix=" + settings.fileExt + "&sliceSize=" + settings.slicesize);
	            }
	            xhr.overrideMimeType("application/octet-stream");
	            xhr.setRequestHeader('Content-Type', 'multipart/form-data');
	            xhr.send(e.target.result);
	        };
	        f.readAsArrayBuffer(sliceblob);
	    };
	    return _upload;
	};

	exports.default = upload;
	module.exports = exports['default'];

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	function getGuid() {
		var guid = "";
		for (var i = 1; i <= 32; i++) {
			var n = Math.floor(Math.random() * 16.0).toString(16);
			guid += n;
			if (i == 8 || i == 12 || i == 16 || i == 20) guid += "-";
		}
		return guid;
	}

	exports.default = getGuid;
	module.exports = exports["default"];

/***/ },
/* 8 */
/***/ function(module, exports) {

	/*
	* dataURLtoBlob 将dataUrl转化成Blob对象
	*/

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var CanvasPrototype = window.HTMLCanvasElement && window.HTMLCanvasElement.prototype,
	    hasBlobConstructor = window.Blob && function () {
	    try {
	        return Boolean(new Blob());
	    } catch (e) {
	        return false;
	    }
	}(),
	    hasArrayBufferViewSupport = hasBlobConstructor && window.Uint8Array && function () {
	    try {
	        return new Blob([new Uint8Array(100)]).size === 100;
	    } catch (e) {
	        return false;
	    }
	}(),
	    BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder,
	    dataURLtoBlob = (hasBlobConstructor || BlobBuilder) && window.atob && window.ArrayBuffer && window.Uint8Array && function (dataURI) {
	    var byteString, arrayBuffer, intArray, i, mimeString, bb;
	    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
	        // Convert base64 to raw binary data held in a string:
	        byteString = atob(dataURI.split(',')[1]);
	    } else {
	        // Convert base64/URLEncoded data component to raw binary data:
	        byteString = decodeURIComponent(dataURI.split(',')[1]);
	    }
	    // Write the bytes of the string to an ArrayBuffer:
	    arrayBuffer = new ArrayBuffer(byteString.length);
	    intArray = new Uint8Array(arrayBuffer);
	    for (i = 0; i < byteString.length; i += 1) {
	        intArray[i] = byteString.charCodeAt(i);
	    }
	    // Separate out the mime component:
	    mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
	    // Write the ArrayBuffer (or ArrayBufferView) to a blob:
	    if (hasBlobConstructor) {
	        return new Blob([hasArrayBufferViewSupport ? intArray : arrayBuffer], { type: mimeString });
	    }
	    bb = new BlobBuilder();
	    bb.append(arrayBuffer);
	    return bb.getBlob(mimeString);
	};
	if (window.HTMLCanvasElement && !CanvasPrototype.toBlob) {
	    if (CanvasPrototype.mozGetAsFile) {
	        CanvasPrototype.toBlob = function (callback, type, quality) {
	            if (quality && CanvasPrototype.toDataURL && dataURLtoBlob) {
	                callback(dataURLtoBlob(this.toDataURL(type, quality)));
	            } else {
	                callback(this.mozGetAsFile('blob', type));
	            }
	        };
	    } else if (CanvasPrototype.toDataURL && dataURLtoBlob) {
	        CanvasPrototype.toBlob = function (callback, type, quality) {
	            callback(dataURLtoBlob(this.toDataURL(type, quality)));
	        };
	    }
	}

	exports.default = dataURLtoBlob;
	module.exports = exports['default'];

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * Detecting vertical squash in loaded image.
	 * Fixes a bug which squash image vertically while drawing into canvas for some images.
	 * This is a bug in iOS6 devices. This function from https://github.com/stomita/ios-imagefile-megapixel
	 * 处理IOS的图片压缩比例异常的bug
	 */
	var detectVerticalSquash = function detectVerticalSquash(img) {
	    var iw = img.naturalWidth,
	        ih = img.naturalHeight;
	    var canvas = document.createElement('canvas');
	    canvas.width = 1;
	    canvas.height = ih;
	    var ctx = canvas.getContext('2d');
	    ctx.drawImage(img, 0, 0);
	    var data = ctx.getImageData(0, 0, 1, ih).data;
	    // search image edge pixel position in case it is squashed vertically.
	    var sy = 0;
	    var ey = ih;
	    var py = ih;
	    while (py > sy) {
	        var alpha = data[(py - 1) * 4 + 3];
	        if (alpha === 0) {
	            ey = py;
	        } else {
	            sy = py;
	        }
	        py = ey + sy >> 1;
	    }
	    var ratio = py / ih;
	    return ratio === 0 ? 1 : ratio;
	};
	var drawImageIOSFix = function drawImageIOSFix(ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
	    var vertSquashRatio = detectVerticalSquash(img);
	    ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio);
	};

	//图片缩放计算
	var _autoResizeImage = function _autoResizeImage(maxWidth, maxHeight, img) {
	    var hRatio;
	    var wRatio;
	    var Ratio = 1;
	    var w = img.width;
	    var h = img.height;
	    wRatio = maxWidth / w;
	    hRatio = maxHeight / h;
	    if (maxWidth == 0 && maxHeight == 0) {
	        Ratio = 1;
	    } else if (maxWidth == 0) {
	        //
	        if (hRatio < 1) Ratio = hRatio;
	    } else if (maxHeight == 0) {
	        if (wRatio < 1) Ratio = wRatio;
	    } else if (wRatio < 1 || hRatio < 1) {
	        Ratio = wRatio <= hRatio ? wRatio : hRatio;
	    }
	    if (Ratio < 1) {
	        w = w * Ratio;
	        h = h * Ratio;
	    }
	    return { height: h, width: w };
	};

	//图片压缩，参数img为Image对象
	var _imageCompression = function _imageCompression(img, settings, _camera) {
	    console.log("图片压缩");
	    var canvas = document.createElement('canvas');
	    var setW = settings.width == "auto" ? 0 : settings.width;
	    var setH = settings.height == "auto" ? 0 : settings.height;
	    var newWH = _autoResizeImage(setW, setH, img);
	    var imgWidth = canvas.width = newWH.width;
	    var imgHeight = canvas.height = newWH.height;

	    var context = canvas.getContext('2d');
	    drawImageIOSFix(context, img, 0, 0, img.width, img.height, 0, 0, imgWidth, imgHeight);
	    return img.src = _camera.imgData = canvas.toDataURL(settings.fileTypeExts, settings.quality);
	};

	exports.default = _imageCompression;
	module.exports = exports['default'];

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports._imageRotation = exports._getImgAngle = undefined;

	var _binaryAjax = __webpack_require__(11);

	var _binaryAjax2 = _interopRequireDefault(_binaryAjax);

	var _exif = __webpack_require__(12);

	var _exif2 = _interopRequireDefault(_exif);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// 处理IOS拍照图片会自动旋转的bug，通过EXIF.js获取Orientation
	var _getImgAngle = function _getImgAngle(url, _camera) {
	    var radians = function radians(angle) {
	        if (typeof angle == 'number') return angle;
	        return {
	            rad: function rad(z) {
	                return z;
	            },
	            deg: function deg(z) {
	                return Math.PI / 180 * z;
	            }
	        }[String(angle).match(/[a-z]+$/)[0] || 'rad'](parseFloat(angle));
	    };

	    var orientation = 0;
	    (0, _binaryAjax2.default)(url, function (o) {
	        var oExif = _exif2.default.readFromBinaryFile(o.binaryResponse),
	            orientation = oExif.Orientation;
	        switch (orientation) {
	            case 1:
	                _camera.angle = '0deg';
	                break;
	            case 6:
	                _camera.angle = '90deg';
	                break;
	            case 3:
	                _camera.angle = '180deg';
	                break;
	            case 8:
	                _camera.angle = '270deg';
	                break;
	            default:
	                _camera.angle = '0deg';
	                break;
	        }
	        _camera.angle = radians(_camera.angle);
	    });
	};
	//旋转图片（调整为正向）
	var _imageRotation = function _imageRotation(img, _camera, settings) {
	    console.log("旋转图片（调整为正向）");
	    var imgWidth = img.width; //_camera.imgW;
	    var imgHeight = img.height; //_camera.imgH;
	    var sin = Math.sin(_camera.angle);
	    var cos = Math.cos(_camera.angle);
	    var fullWidth = Math.abs(sin) * imgHeight + Math.abs(cos) * imgWidth;
	    var fullHeight = Math.abs(cos) * imgHeight + Math.abs(sin) * imgWidth;

	    var canvas = document.createElement('canvas');
	    canvas.width = fullWidth;
	    canvas.height = fullHeight;

	    var context = canvas.getContext('2d');
	    context.translate(fullWidth / 2, fullHeight / 2);
	    context.rotate(_camera.angle);
	    context.drawImage(img, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);

	    return _camera.imgData = canvas.toDataURL(settings.fileTypeExts, 1);
	};

	exports._getImgAngle = _getImgAngle;
	exports._imageRotation = _imageRotation;

/***/ },
/* 11 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/*
	* Binary Ajax 0.1.10
	* Copyright (c) 2008 Jacob Seidelin, cupboy@gmail.com, http://blog.nihilogic.dk/
	* Licensed under the MPL License [http://www.nihilogic.dk/licenses/mpl-license.txt]
	*/
	var BinaryFile = function BinaryFile(strData, iDataOffset, iDataLength) {
	    var data = strData;
	    var dataOffset = iDataOffset || 0;
	    var dataLength = 0;

	    this.getRawData = function () {
	        return data;
	    };

	    if (typeof strData == "string") {
	        dataLength = iDataLength || data.length;

	        this.getByteAt = function (iOffset) {
	            return data.charCodeAt(iOffset + dataOffset) & 0xFF;
	        };

	        this.getBytesAt = function (iOffset, iLength) {
	            var aBytes = [];

	            for (var i = 0; i < iLength; i++) {
	                aBytes[i] = data.charCodeAt(iOffset + i + dataOffset) & 0xFF;
	            };

	            return aBytes;
	        };
	    } else if (typeof strData == "unknown") {
	        dataLength = iDataLength || IEBinary_getLength(data);

	        this.getByteAt = function (iOffset) {
	            return IEBinary_getByteAt(data, iOffset + dataOffset);
	        };

	        this.getBytesAt = function (iOffset, iLength) {
	            return new VBArray(IEBinary_getBytesAt(data, iOffset + dataOffset, iLength)).toArray();
	        };
	    }

	    this.getLength = function () {
	        return dataLength;
	    };

	    this.getSByteAt = function (iOffset) {
	        var iByte = this.getByteAt(iOffset);
	        if (iByte > 127) return iByte - 256;else return iByte;
	    };

	    this.getShortAt = function (iOffset, bBigEndian) {
	        var iShort = bBigEndian ? (this.getByteAt(iOffset) << 8) + this.getByteAt(iOffset + 1) : (this.getByteAt(iOffset + 1) << 8) + this.getByteAt(iOffset);
	        if (iShort < 0) iShort += 65536;
	        return iShort;
	    };
	    this.getSShortAt = function (iOffset, bBigEndian) {
	        var iUShort = this.getShortAt(iOffset, bBigEndian);
	        if (iUShort > 32767) return iUShort - 65536;else return iUShort;
	    };
	    this.getLongAt = function (iOffset, bBigEndian) {
	        var iByte1 = this.getByteAt(iOffset),
	            iByte2 = this.getByteAt(iOffset + 1),
	            iByte3 = this.getByteAt(iOffset + 2),
	            iByte4 = this.getByteAt(iOffset + 3);

	        var iLong = bBigEndian ? (((iByte1 << 8) + iByte2 << 8) + iByte3 << 8) + iByte4 : (((iByte4 << 8) + iByte3 << 8) + iByte2 << 8) + iByte1;
	        if (iLong < 0) iLong += 4294967296;
	        return iLong;
	    };
	    this.getSLongAt = function (iOffset, bBigEndian) {
	        var iULong = this.getLongAt(iOffset, bBigEndian);
	        if (iULong > 2147483647) return iULong - 4294967296;else return iULong;
	    };

	    this.getStringAt = function (iOffset, iLength) {
	        var aStr = [];

	        var aBytes = this.getBytesAt(iOffset, iLength);
	        for (var j = 0; j < iLength; j++) {
	            aStr[j] = String.fromCharCode(aBytes[j]);
	        }
	        return aStr.join("");
	    };

	    this.getCharAt = function (iOffset) {
	        return String.fromCharCode(this.getByteAt(iOffset));
	    };
	    this.toBase64 = function () {
	        return window.btoa(data);
	    };
	    this.fromBase64 = function (strBase64) {
	        data = window.atob(strBase64);
	    };
	};
	var BinaryAjax = function () {
	    function createRequest() {
	        var oHTTP = null;
	        if (window.ActiveXObject) {
	            oHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	        } else if (window.XMLHttpRequest) {
	            oHTTP = new XMLHttpRequest();
	        }
	        return oHTTP;
	    }

	    function getHead(strURL, fncCallback, fncError) {
	        var oHTTP = createRequest();
	        if (oHTTP) {
	            if (fncCallback) {
	                if (typeof oHTTP.onload != "undefined") {
	                    oHTTP.onload = function () {
	                        if (oHTTP.status == "200") {
	                            fncCallback(this);
	                        } else {
	                            if (fncError) fncError();
	                        }
	                        oHTTP = null;
	                    };
	                } else {
	                    oHTTP.onreadystatechange = function () {
	                        if (oHTTP.readyState == 4) {
	                            if (oHTTP.status == "200") {
	                                fncCallback(this);
	                            } else {
	                                if (fncError) fncError();
	                            }
	                            oHTTP = null;
	                        }
	                    };
	                }
	            }
	            oHTTP.open("HEAD", strURL, true);
	            oHTTP.send(null);
	        } else {
	            if (fncError) fncError();
	        }
	    }

	    function sendRequest(strURL, fncCallback, fncError, aRange, bAcceptRanges, iFileSize) {
	        var oHTTP = createRequest();
	        if (oHTTP) {
	            var iDataOffset = 0;
	            if (aRange && !bAcceptRanges) {
	                iDataOffset = aRange[0];
	            }
	            var iDataLen = 0;
	            if (aRange) {
	                iDataLen = aRange[1] - aRange[0] + 1;
	            }

	            if (fncCallback) {
	                if (typeof oHTTP.onload != "undefined") {
	                    oHTTP.onload = function () {
	                        if (oHTTP.status == "200" || oHTTP.status == "206" || oHTTP.status == "0") {
	                            oHTTP.binaryResponse = new BinaryFile(oHTTP.responseText, iDataOffset, iDataLen);
	                            oHTTP.fileSize = iFileSize || oHTTP.getResponseHeader("Content-Length");
	                            fncCallback(oHTTP);
	                        } else {
	                            if (fncError) fncError();
	                        }
	                        oHTTP = null;
	                    };
	                } else {
	                    oHTTP.onreadystatechange = function () {
	                        if (oHTTP.readyState == 4) {
	                            if (oHTTP.status == "200" || oHTTP.status == "206" || oHTTP.status == "0") {
	                                // IE6 craps if we try to extend the XHR object
	                                var oRes = {
	                                    status: oHTTP.status,
	                                    // IE needs responseBody, Chrome/Safari needs responseText
	                                    binaryResponse: new BinaryFile(typeof oHTTP.responseBody == "unknown" ? oHTTP.responseBody : oHTTP.responseText, iDataOffset, iDataLen),
	                                    fileSize: iFileSize || oHTTP.getResponseHeader("Content-Length")
	                                };
	                                fncCallback(oRes);
	                            } else {
	                                if (fncError) fncError();
	                            }
	                            oHTTP = null;
	                        }
	                    };
	                }
	            }
	            oHTTP.open("GET", strURL, true);

	            if (oHTTP.overrideMimeType) oHTTP.overrideMimeType('text/plain; charset=x-user-defined');

	            if (aRange && bAcceptRanges) {
	                oHTTP.setRequestHeader("Range", "bytes=" + aRange[0] + "-" + aRange[1]);
	            }

	            oHTTP.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 1970 00:00:00 GMT");

	            oHTTP.send(null);
	        } else {
	            if (fncError) fncError();
	        }
	    }

	    return function (strURL, fncCallback, fncError, aRange) {
	        if (aRange) {
	            getHead(strURL, function (oHTTP) {
	                var iLength = parseInt(oHTTP.getResponseHeader("Content-Length"), 10);
	                var strAcceptRanges = oHTTP.getResponseHeader("Accept-Ranges");

	                var iStart, iEnd;
	                iStart = aRange[0];
	                if (aRange[0] < 0) iStart += iLength;
	                iEnd = iStart + aRange[1] - 1;

	                sendRequest(strURL, fncCallback, fncError, [iStart, iEnd], strAcceptRanges == "bytes", iLength);
	            });
	        } else {
	            sendRequest(strURL, fncCallback, fncError);
	        }
	    };
	}();
	document.write("<script type='text/vbscript'>\r\n" + "Function IEBinary_getByteAt(strBinary, iOffset)\r\n" + "	IEBinary_getByteAt = AscB(MidB(strBinary, iOffset + 1, 1))\r\n" + "End Function\r\n" + "Function IEBinary_getBytesAt(strBinary, iOffset, iLength)\r\n" + "  Dim aBytes()\r\n" + "  ReDim aBytes(iLength - 1)\r\n" + "  For i = 0 To iLength - 1\r\n" + "   aBytes(i) = IEBinary_getByteAt(strBinary, iOffset + i)\r\n" + "  Next\r\n" + "  IEBinary_getBytesAt = aBytes\r\n" + "End Function\r\n" + "Function IEBinary_getLength(strBinary)\r\n" + "	IEBinary_getLength = LenB(strBinary)\r\n" + "End Function\r\n" + "</script>\r\n");

	exports.default = BinaryAjax;
	module.exports = exports["default"];

/***/ },
/* 12 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/*
	* Javascript EXIF Reader 0.1.4
	* Copyright (c) 2008 Jacob Seidelin, cupboy@gmail.com, http://blog.nihilogic.dk/
	* Licensed under the MPL License [http://www.nihilogic.dk/licenses/mpl-license.txt]
	* Refer to https://github.com/exif-js/exif-js
	*/
	var EXIF = {};
	(function () {
	    var bDebug = false;

	    EXIF.Tags = {
	        // version tags
	        0x9000: "ExifVersion", // EXIF version
	        0xA000: "FlashpixVersion", // Flashpix format version

	        // colorspace tags
	        0xA001: "ColorSpace", // Color space information tag

	        // image configuration
	        0xA002: "PixelXDimension", // Valid width of meaningful image
	        0xA003: "PixelYDimension", // Valid height of meaningful image
	        0x9101: "ComponentsConfiguration", // Information about channels
	        0x9102: "CompressedBitsPerPixel", // Compressed bits per pixel

	        // user information
	        0x927C: "MakerNote", // Any desired information written by the manufacturer
	        0x9286: "UserComment", // Comments by user

	        // related file
	        0xA004: "RelatedSoundFile", // Name of related sound file

	        // date and time
	        0x9003: "DateTimeOriginal", // Date and time when the original image was generated
	        0x9004: "DateTimeDigitized", // Date and time when the image was stored digitally
	        0x9290: "SubsecTime", // Fractions of seconds for DateTime
	        0x9291: "SubsecTimeOriginal", // Fractions of seconds for DateTimeOriginal
	        0x9292: "SubsecTimeDigitized", // Fractions of seconds for DateTimeDigitized

	        // picture-taking conditions
	        0x829A: "ExposureTime", // Exposure time (in seconds)
	        0x829D: "FNumber", // F number
	        0x8822: "ExposureProgram", // Exposure program
	        0x8824: "SpectralSensitivity", // Spectral sensitivity
	        0x8827: "ISOSpeedRatings", // ISO speed rating
	        0x8828: "OECF", // Optoelectric conversion factor
	        0x9201: "ShutterSpeedValue", // Shutter speed
	        0x9202: "ApertureValue", // Lens aperture
	        0x9203: "BrightnessValue", // Value of brightness
	        0x9204: "ExposureBias", // Exposure bias
	        0x9205: "MaxApertureValue", // Smallest F number of lens
	        0x9206: "SubjectDistance", // Distance to subject in meters
	        0x9207: "MeteringMode", // Metering mode
	        0x9208: "LightSource", // Kind of light source
	        0x9209: "Flash", // Flash status
	        0x9214: "SubjectArea", // Location and area of main subject
	        0x920A: "FocalLength", // Focal length of the lens in mm
	        0xA20B: "FlashEnergy", // Strobe energy in BCPS
	        0xA20C: "SpatialFrequencyResponse", //
	        0xA20E: "FocalPlaneXResolution", // Number of pixels in width direction per FocalPlaneResolutionUnit
	        0xA20F: "FocalPlaneYResolution", // Number of pixels in height direction per FocalPlaneResolutionUnit
	        0xA210: "FocalPlaneResolutionUnit", // Unit for measuring FocalPlaneXResolution and FocalPlaneYResolution
	        0xA214: "SubjectLocation", // Location of subject in image
	        0xA215: "ExposureIndex", // Exposure index selected on camera
	        0xA217: "SensingMethod", // Image sensor type
	        0xA300: "FileSource", // Image source (3 == DSC)
	        0xA301: "SceneType", // Scene type (1 == directly photographed)
	        0xA302: "CFAPattern", // Color filter array geometric pattern
	        0xA401: "CustomRendered", // Special processing
	        0xA402: "ExposureMode", // Exposure mode
	        0xA403: "WhiteBalance", // 1 = auto white balance, 2 = manual
	        0xA404: "DigitalZoomRation", // Digital zoom ratio
	        0xA405: "FocalLengthIn35mmFilm", // Equivalent foacl length assuming 35mm film camera (in mm)
	        0xA406: "SceneCaptureType", // Type of scene
	        0xA407: "GainControl", // Degree of overall image gain adjustment
	        0xA408: "Contrast", // Direction of contrast processing applied by camera
	        0xA409: "Saturation", // Direction of saturation processing applied by camera
	        0xA40A: "Sharpness", // Direction of sharpness processing applied by camera
	        0xA40B: "DeviceSettingDescription", //
	        0xA40C: "SubjectDistanceRange", // Distance to subject

	        // other tags
	        0xA005: "InteroperabilityIFDPointer",
	        0xA420: "ImageUniqueID" // Identifier assigned uniquely to each image
	    };

	    EXIF.TiffTags = {
	        0x0100: "ImageWidth",
	        0x0101: "ImageHeight",
	        0x8769: "ExifIFDPointer",
	        0x8825: "GPSInfoIFDPointer",
	        0xA005: "InteroperabilityIFDPointer",
	        0x0102: "BitsPerSample",
	        0x0103: "Compression",
	        0x0106: "PhotometricInterpretation",
	        0x0112: "Orientation",
	        0x0115: "SamplesPerPixel",
	        0x011C: "PlanarConfiguration",
	        0x0212: "YCbCrSubSampling",
	        0x0213: "YCbCrPositioning",
	        0x011A: "XResolution",
	        0x011B: "YResolution",
	        0x0128: "ResolutionUnit",
	        0x0111: "StripOffsets",
	        0x0116: "RowsPerStrip",
	        0x0117: "StripByteCounts",
	        0x0201: "JPEGInterchangeFormat",
	        0x0202: "JPEGInterchangeFormatLength",
	        0x012D: "TransferFunction",
	        0x013E: "WhitePoint",
	        0x013F: "PrimaryChromaticities",
	        0x0211: "YCbCrCoefficients",
	        0x0214: "ReferenceBlackWhite",
	        0x0132: "DateTime",
	        0x010E: "ImageDescription",
	        0x010F: "Make",
	        0x0110: "Model",
	        0x0131: "Software",
	        0x013B: "Artist",
	        0x8298: "Copyright"
	    };

	    EXIF.GPSTags = {
	        0x0000: "GPSVersionID",
	        0x0001: "GPSLatitudeRef",
	        0x0002: "GPSLatitude",
	        0x0003: "GPSLongitudeRef",
	        0x0004: "GPSLongitude",
	        0x0005: "GPSAltitudeRef",
	        0x0006: "GPSAltitude",
	        0x0007: "GPSTimeStamp",
	        0x0008: "GPSSatellites",
	        0x0009: "GPSStatus",
	        0x000A: "GPSMeasureMode",
	        0x000B: "GPSDOP",
	        0x000C: "GPSSpeedRef",
	        0x000D: "GPSSpeed",
	        0x000E: "GPSTrackRef",
	        0x000F: "GPSTrack",
	        0x0010: "GPSImgDirectionRef",
	        0x0011: "GPSImgDirection",
	        0x0012: "GPSMapDatum",
	        0x0013: "GPSDestLatitudeRef",
	        0x0014: "GPSDestLatitude",
	        0x0015: "GPSDestLongitudeRef",
	        0x0016: "GPSDestLongitude",
	        0x0017: "GPSDestBearingRef",
	        0x0018: "GPSDestBearing",
	        0x0019: "GPSDestDistanceRef",
	        0x001A: "GPSDestDistance",
	        0x001B: "GPSProcessingMethod",
	        0x001C: "GPSAreaInformation",
	        0x001D: "GPSDateStamp",
	        0x001E: "GPSDifferential"
	    };

	    EXIF.StringValues = {
	        ExposureProgram: {
	            0: "Not defined",
	            1: "Manual",
	            2: "Normal program",
	            3: "Aperture priority",
	            4: "Shutter priority",
	            5: "Creative program",
	            6: "Action program",
	            7: "Portrait mode",
	            8: "Landscape mode"
	        },
	        MeteringMode: {
	            0: "Unknown",
	            1: "Average",
	            2: "CenterWeightedAverage",
	            3: "Spot",
	            4: "MultiSpot",
	            5: "Pattern",
	            6: "Partial",
	            255: "Other"
	        },
	        LightSource: {
	            0: "Unknown",
	            1: "Daylight",
	            2: "Fluorescent",
	            3: "Tungsten (incandescent light)",
	            4: "Flash",
	            9: "Fine weather",
	            10: "Cloudy weather",
	            11: "Shade",
	            12: "Daylight fluorescent (D 5700 - 7100K)",
	            13: "Day white fluorescent (N 4600 - 5400K)",
	            14: "Cool white fluorescent (W 3900 - 4500K)",
	            15: "White fluorescent (WW 3200 - 3700K)",
	            17: "Standard light A",
	            18: "Standard light B",
	            19: "Standard light C",
	            20: "D55",
	            21: "D65",
	            22: "D75",
	            23: "D50",
	            24: "ISO studio tungsten",
	            255: "Other"
	        },
	        Flash: {
	            0x0000: "Flash did not fire",
	            0x0001: "Flash fired",
	            0x0005: "Strobe return light not detected",
	            0x0007: "Strobe return light detected",
	            0x0009: "Flash fired, compulsory flash mode",
	            0x000D: "Flash fired, compulsory flash mode, return light not detected",
	            0x000F: "Flash fired, compulsory flash mode, return light detected",
	            0x0010: "Flash did not fire, compulsory flash mode",
	            0x0018: "Flash did not fire, auto mode",
	            0x0019: "Flash fired, auto mode",
	            0x001D: "Flash fired, auto mode, return light not detected",
	            0x001F: "Flash fired, auto mode, return light detected",
	            0x0020: "No flash function",
	            0x0041: "Flash fired, red-eye reduction mode",
	            0x0045: "Flash fired, red-eye reduction mode, return light not detected",
	            0x0047: "Flash fired, red-eye reduction mode, return light detected",
	            0x0049: "Flash fired, compulsory flash mode, red-eye reduction mode",
	            0x004D: "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",
	            0x004F: "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",
	            0x0059: "Flash fired, auto mode, red-eye reduction mode",
	            0x005D: "Flash fired, auto mode, return light not detected, red-eye reduction mode",
	            0x005F: "Flash fired, auto mode, return light detected, red-eye reduction mode"
	        },
	        SensingMethod: {
	            1: "Not defined",
	            2: "One-chip color area sensor",
	            3: "Two-chip color area sensor",
	            4: "Three-chip color area sensor",
	            5: "Color sequential area sensor",
	            7: "Trilinear sensor",
	            8: "Color sequential linear sensor"
	        },
	        SceneCaptureType: {
	            0: "Standard",
	            1: "Landscape",
	            2: "Portrait",
	            3: "Night scene"
	        },
	        SceneType: {
	            1: "Directly photographed"
	        },
	        CustomRendered: {
	            0: "Normal process",
	            1: "Custom process"
	        },
	        WhiteBalance: {
	            0: "Auto white balance",
	            1: "Manual white balance"
	        },
	        GainControl: {
	            0: "None",
	            1: "Low gain up",
	            2: "High gain up",
	            3: "Low gain down",
	            4: "High gain down"
	        },
	        Contrast: {
	            0: "Normal",
	            1: "Soft",
	            2: "Hard"
	        },
	        Saturation: {
	            0: "Normal",
	            1: "Low saturation",
	            2: "High saturation"
	        },
	        Sharpness: {
	            0: "Normal",
	            1: "Soft",
	            2: "Hard"
	        },
	        SubjectDistanceRange: {
	            0: "Unknown",
	            1: "Macro",
	            2: "Close view",
	            3: "Distant view"
	        },
	        FileSource: {
	            3: "DSC"
	        },

	        Components: {
	            0: "",
	            1: "Y",
	            2: "Cb",
	            3: "Cr",
	            4: "R",
	            5: "G",
	            6: "B"
	        }
	    };

	    function findEXIFinJPEG(oFile) {
	        var aMarkers = [];

	        if (oFile.getByteAt(0) != 0xFF || oFile.getByteAt(1) != 0xD8) {
	            return false; // not a valid jpeg
	        }

	        var iOffset = 2;
	        var iLength = oFile.getLength();
	        while (iOffset < iLength) {
	            if (oFile.getByteAt(iOffset) != 0xFF) {
	                if (bDebug) console.log("Not a valid marker at offset " + iOffset + ", found: " + oFile.getByteAt(iOffset));
	                return false; // not a valid marker, something is wrong
	            }

	            var iMarker = oFile.getByteAt(iOffset + 1);

	            // we could implement handling for other markers here,
	            // but we're only looking for 0xFFE1 for EXIF data

	            if (iMarker == 22400) {
	                if (bDebug) console.log("Found 0xFFE1 marker");
	                return readEXIFData(oFile, iOffset + 4, oFile.getShortAt(iOffset + 2, true) - 2);
	                iOffset += 2 + oFile.getShortAt(iOffset + 2, true);
	            } else if (iMarker == 225) {
	                // 0xE1 = Application-specific 1 (for EXIF)
	                if (bDebug) console.log("Found 0xFFE1 marker");
	                return readEXIFData(oFile, iOffset + 4, oFile.getShortAt(iOffset + 2, true) - 2);
	            } else {
	                iOffset += 2 + oFile.getShortAt(iOffset + 2, true);
	            }
	        }
	    }

	    function readTags(oFile, iTIFFStart, iDirStart, oStrings, bBigEnd) {
	        var iEntries = oFile.getShortAt(iDirStart, bBigEnd);
	        var oTags = {};
	        for (var i = 0; i < iEntries; i++) {
	            var iEntryOffset = iDirStart + i * 12 + 2;
	            var strTag = oStrings[oFile.getShortAt(iEntryOffset, bBigEnd)];
	            if (!strTag && bDebug) console.log("Unknown tag: " + oFile.getShortAt(iEntryOffset, bBigEnd));
	            oTags[strTag] = readTagValue(oFile, iEntryOffset, iTIFFStart, iDirStart, bBigEnd);
	        }
	        return oTags;
	    }

	    function readTagValue(oFile, iEntryOffset, iTIFFStart, iDirStart, bBigEnd) {
	        var iType = oFile.getShortAt(iEntryOffset + 2, bBigEnd);
	        var iNumValues = oFile.getLongAt(iEntryOffset + 4, bBigEnd);
	        var iValueOffset = oFile.getLongAt(iEntryOffset + 8, bBigEnd) + iTIFFStart;

	        switch (iType) {
	            case 1: // byte, 8-bit unsigned int
	            case 7:
	                // undefined, 8-bit byte, value depending on field
	                if (iNumValues == 1) {
	                    return oFile.getByteAt(iEntryOffset + 8, bBigEnd);
	                } else {
	                    var iValOffset = iNumValues > 4 ? iValueOffset : iEntryOffset + 8;
	                    var aVals = [];
	                    for (var n = 0; n < iNumValues; n++) {
	                        aVals[n] = oFile.getByteAt(iValOffset + n);
	                    }
	                    return aVals;
	                }
	                break;

	            case 2:
	                // ascii, 8-bit byte
	                var iStringOffset = iNumValues > 4 ? iValueOffset : iEntryOffset + 8;
	                return oFile.getStringAt(iStringOffset, iNumValues - 1);
	                break;

	            case 3:
	                // short, 16 bit int
	                if (iNumValues == 1) {
	                    return oFile.getShortAt(iEntryOffset + 8, bBigEnd);
	                } else {
	                    var iValOffset = iNumValues > 2 ? iValueOffset : iEntryOffset + 8;
	                    var aVals = [];
	                    for (var n = 0; n < iNumValues; n++) {
	                        aVals[n] = oFile.getShortAt(iValOffset + 2 * n, bBigEnd);
	                    }
	                    return aVals;
	                }
	                break;

	            case 4:
	                // long, 32 bit int
	                if (iNumValues == 1) {
	                    return oFile.getLongAt(iEntryOffset + 8, bBigEnd);
	                } else {
	                    var aVals = [];
	                    for (var n = 0; n < iNumValues; n++) {
	                        aVals[n] = oFile.getLongAt(iValueOffset + 4 * n, bBigEnd);
	                    }
	                    return aVals;
	                }
	                break;
	            case 5:
	                // rational = two long values, first is numerator, second is denominator
	                if (iNumValues == 1) {
	                    return oFile.getLongAt(iValueOffset, bBigEnd) / oFile.getLongAt(iValueOffset + 4, bBigEnd);
	                } else {
	                    var aVals = [];
	                    for (var n = 0; n < iNumValues; n++) {
	                        aVals[n] = oFile.getLongAt(iValueOffset + 8 * n, bBigEnd) / oFile.getLongAt(iValueOffset + 4 + 8 * n, bBigEnd);
	                    }
	                    return aVals;
	                }
	                break;
	            case 9:
	                // slong, 32 bit signed int
	                if (iNumValues == 1) {
	                    return oFile.getSLongAt(iEntryOffset + 8, bBigEnd);
	                } else {
	                    var aVals = [];
	                    for (var n = 0; n < iNumValues; n++) {
	                        aVals[n] = oFile.getSLongAt(iValueOffset + 4 * n, bBigEnd);
	                    }
	                    return aVals;
	                }
	                break;
	            case 10:
	                // signed rational, two slongs, first is numerator, second is denominator
	                if (iNumValues == 1) {
	                    return oFile.getSLongAt(iValueOffset, bBigEnd) / oFile.getSLongAt(iValueOffset + 4, bBigEnd);
	                } else {
	                    var aVals = [];
	                    for (var n = 0; n < iNumValues; n++) {
	                        aVals[n] = oFile.getSLongAt(iValueOffset + 8 * n, bBigEnd) / oFile.getSLongAt(iValueOffset + 4 + 8 * n, bBigEnd);
	                    }
	                    return aVals;
	                }
	                break;
	        }
	    }

	    function readEXIFData(oFile, iStart, iLength) {
	        if (oFile.getStringAt(iStart, 4) != "Exif") {
	            if (bDebug) console.log("Not valid EXIF data! " + oFile.getStringAt(iStart, 4));
	            return false;
	        }

	        var bBigEnd;

	        var iTIFFOffset = iStart + 6;

	        // test for TIFF validity and endianness
	        if (oFile.getShortAt(iTIFFOffset) == 0x4949) {
	            bBigEnd = false;
	        } else if (oFile.getShortAt(iTIFFOffset) == 0x4D4D) {
	            bBigEnd = true;
	        } else {
	            if (bDebug) console.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)");
	            return false;
	        }

	        if (oFile.getShortAt(iTIFFOffset + 2, bBigEnd) != 0x002A) {
	            if (bDebug) console.log("Not valid TIFF data! (no 0x002A)");
	            return false;
	        }

	        if (oFile.getLongAt(iTIFFOffset + 4, bBigEnd) != 0x00000008) {
	            if (bDebug) console.log("Not valid TIFF data! (First offset not 8)", oFile.getShortAt(iTIFFOffset + 4, bBigEnd));
	            return false;
	        }

	        var oTags = readTags(oFile, iTIFFOffset, iTIFFOffset + 8, EXIF.TiffTags, bBigEnd);

	        if (oTags.ExifIFDPointer) {
	            var oEXIFTags = readTags(oFile, iTIFFOffset, iTIFFOffset + oTags.ExifIFDPointer, EXIF.Tags, bBigEnd);
	            for (var strTag in oEXIFTags) {
	                switch (strTag) {
	                    case "LightSource":
	                    case "Flash":
	                    case "MeteringMode":
	                    case "ExposureProgram":
	                    case "SensingMethod":
	                    case "SceneCaptureType":
	                    case "SceneType":
	                    case "CustomRendered":
	                    case "WhiteBalance":
	                    case "GainControl":
	                    case "Contrast":
	                    case "Saturation":
	                    case "Sharpness":
	                    case "SubjectDistanceRange":
	                    case "FileSource":
	                        oEXIFTags[strTag] = EXIF.StringValues[strTag][oEXIFTags[strTag]];
	                        break;

	                    case "ExifVersion":
	                    case "FlashpixVersion":
	                        oEXIFTags[strTag] = String.fromCharCode(oEXIFTags[strTag][0], oEXIFTags[strTag][1], oEXIFTags[strTag][2], oEXIFTags[strTag][3]);
	                        break;

	                    case "ComponentsConfiguration":
	                        oEXIFTags[strTag] = EXIF.StringValues.Components[oEXIFTags[strTag][0]] + EXIF.StringValues.Components[oEXIFTags[strTag][1]] + EXIF.StringValues.Components[oEXIFTags[strTag][2]] + EXIF.StringValues.Components[oEXIFTags[strTag][3]];
	                        break;
	                }
	                oTags[strTag] = oEXIFTags[strTag];
	            }
	        }

	        if (oTags.GPSInfoIFDPointer) {
	            var oGPSTags = readTags(oFile, iTIFFOffset, iTIFFOffset + oTags.GPSInfoIFDPointer, EXIF.GPSTags, bBigEnd);
	            for (var strTag in oGPSTags) {
	                switch (strTag) {
	                    case "GPSVersionID":
	                        oGPSTags[strTag] = oGPSTags[strTag][0] + "." + oGPSTags[strTag][1] + "." + oGPSTags[strTag][2] + "." + oGPSTags[strTag][3];
	                        break;
	                }
	                oTags[strTag] = oGPSTags[strTag];
	            }
	        }

	        return oTags;
	    }

	    EXIF.readFromBinaryFile = function (oFile) {
	        return findEXIFinJPEG(oFile);
	    };
	})();

	exports.default = EXIF;
	module.exports = exports["default"];

/***/ }
/******/ ])
});
;