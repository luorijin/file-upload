import './style/camera.css';
import upload from './upload.js';
import _imageCompression from './compress.js';
import {_getImgAngle, _imageRotation} from './rotate.js';

function uploadClear (id) {
    var up = (typeof id == "string") ? document.getElementById(id) : id;
    if (typeof up != "object") return null;
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

function drawImage(_camera, settings){
    var url;
    var fileBlob = _camera.file[0].files[0];
    if (window.createObjectURL != undefined) { // basic
        url = window.createObjectURL(fileBlob);
    } else if (window.URL != undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(fileBlob);
    } else if (window.webkitURL != undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(fileBlob);
    }

    // 创建一个Image对象，目的是为了获得图片实际的width、height，用于压缩
    _camera.img = new Image();
    _camera.img.src = url;
    _camera.img.style.visiblility = 'hidden';
    _getImgAngle(url, _camera);

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
            setTimeout(function(){
                imgstatus = 1;
                //压缩图片
                var imgData = _imageCompression(_camera.img, settings, _camera);
                if (settings.onCompressed) {
                    settings.onCompressed(imgData);
                }
                console.log("开始压缩图片");
            },0);
        } else if (imgstatus == 1) {
            settings.onPreDealWithImg();
            console.log("开始旋转图片");
            imgstatus = 2;
            //旋转图片
            _imageRotation(_camera.img, _camera, settings);
            $(_camera.img).trigger('load');
        } else {
            console.log("开始上传图片");

            //清空file控件val，不然选择相同图片的时候不会执行上传
            uploadClear(settings.fileId);
            //开始上传
            var up = new upload({
                uploadUrl: settings.uploadUrl,
                data: _camera.imgData,
                queueId: settings.queueId,
                queueTemplate: settings.queueTemplate,
                muiltupload: settings.muiltupload,
                minWidth: settings.minWidth == "auto" ? 100 : settings.minWidth,//服务端压缩小图宽度的参数
                minHeight: settings.minHeight == "auto" ? 100 : settings.minHeight,//服务端压缩小图高度的参数
                mode: settings.mode == null ? "" : settings.mode,    //"HW"指定高宽缩放（可能变形）;"W":指定宽，高按比例;"H":指定高，宽按比例;"Cut":指定高宽裁减（不变形）
                fileExt: settings.fileExt,
                //上传事件响应
                onStart: settings.onStart, // 处理新增img标签渲染完毕之后的事件，如刷新iscroll
                onInit: settings.onInit,
                onProgress: settings.onProgress,
                onComplete: settings.onComplete,
                onFailed: settings.onFailed,
                onCanceled: settings.onCanceled,
                showDeleteConfirm: settings.showDeleteConfirm, // 删除图片时是否提示 “您确定要删除该照片么”
            });
            up.init();
        }
    });
}

function CameraObj(fileId){
    this.file = $('#' + fileId); //上传控件
    this.img = null; //当前图片对象
    this.imgData = null; //数据对象
    this.angle = "0deg"; //图片角度
}

var cameraFool = function (options) {
    var _allowUpload = true;
    var _isUploading = false;

    var settings = {
        // uploadUrl: "../../App/UploadCut",//必须
        uploadUrl: "",//必须
        uploadBtnId: 'upload',
        drawImageBox:'uploader_content',//渲染图片的容器id
        uploaderInputId:'uploader_control',//file Input的Id（用于多上传触发时用)
        lineImageNum:4,// 一行存放多少img
        belongedDataId: '', // 图片的数据拥有者Id，新建数据为‘’，编辑数据为该数据的id
        maxFileCount: 1, // 上传文件个数限制
        item: null, // 存放Photos数组的对象
        submitBtnId: 'submit', // 页面提交按钮，用于验证逻辑
        replace: false,  // 在最多上传一张的情况下，是否不用删除直接替换，需要设置muiltupload:false
        muiltupload: true, //是否上传多个文件
        fileTypeExts: "image/jpeg", // 在compress.js中使用
        _allowUpload:true,
        _isUploading:false,
        hideBtn:true,
        mode:'Cut',
        _camera:null,//保存camera事件对象
        onStart: function () { },
        onInit: function (_upload) { return true; },
        onDelete: function () { },
        onProgress: function () { },
        onComplete: function () { },
        onSelect:function onSelect(){},
        onInitImageBox:function(){
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
            $('.upload-pic-holder').addClass('line'+this.lineImageNum);
        },//初始化存放图片的宽度高度
        queueTemplate: '<div class="upload-pic-holder"><div class="upload-pic-main"><div class="upload-pic-mask"><div class="upload-pic-progresswrap"><span class="upload-pic-info" data-queue="info"></span><div class="upload-pic-progress"><div data-queue="progress" class="upload-pic-bar" style="width: 0%;"></div></div></div></div><div class="pic-item-holder"><img src="" data-queue="thumb" data-auto-draft="Photos,img" /><div class="imgCover"></div></div></div> </div>'
    };

    settings = $.extend(settings, options);
    settings.onInitImageBox();//扩展后执行初始化宽高

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

        uploadUrl: settings.uploadUrl,//必须
        width: '800', //settings.maxCompressedWidth, // 图片压缩后最大宽度 auto 为原始宽度 默认：auto
        height: '800', //settings.maxCompressedHeight, // 图片压缩后最大高度度 auto 为原始高度 默认：auto
        minWidth: "300", // 服务端压缩小图宽度的参数
        minHeight: "300", // 服务端压缩小图高度的参数
        mode: settings.mode,
        quality: 1, // 图片压缩品质 0~1
        muiltupload: settings.muiltupload,
        Control:false, //这个参数的使用详见微摄影，场景是拖拉排序问题
        showDeleteConfirm: settings.showDeleteConfirm ? settings.showDeleteConfirm : false,

        onAfterDrawImage: function () {
            settings._allowUpload = false;
        },
        onPreDealWithImg: function () {
            // 在图片预处理（压缩、旋转）的时候执行
            // 在图片预处理时，不能提交页面数据
            console.log('在图片预处理时，视为图片上传中，不能提交页面数据');
            settings._isUploading = true;
            $("#" + settings.submitBtnId).addClass('isUploading');
            $("#" + settings.submitBtnId).addClass('btn-disabled');//处理图片等待的过程中禁止提交按钮
        },
        onSelect: function () {
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
        onStart: function () {
            settings._isUploading = true;
            //允许上传多张图片是，到最后一张隐藏上传按钮
            if (settings.muiltupload && settings.hideBtn) {
                let numberLine = settings.maxFileCount/settings.lineImageNum
                if (settings.item.Photos.length == settings.maxFileCount - 1) {
                    document.getElementById(settings.uploadBtnId).parentElement.style.display = 'none'
                    if(Math.floor(numberLine) == numberLine){
                        document.getElementById(settings.uploadBtnId).parentElement.style.width = '0%';
                        document.getElementById(settings.uploadBtnId).parentElement.style.height = '0%';
                    }
                } else {
                    document.getElementById(settings.uploadBtnId).parentElement.style.display = 'block'
                    if(Math.floor(numberLine) == numberLine){
                        document.getElementById(settings.uploadBtnId).parentElement.style.width = settings.boxSize+'px';
                        document.getElementById(settings.uploadBtnId).parentElement.style.height = settings.boxSize+'px';
                    }
                }
            }
            $("#" + settings.submitBtnId).addClass('isUploading');
            settings.onStart();
        },
        onDelete:function(){
            if(this.hideBtn){
                let numberLine = this.maxFileCount/this.lineImageNum
                if (this.item.Photos.length == this.maxFileCount) {
                    document.getElementById(this.uploadBtnId).parentElement.style.display = 'none';
                    if(Math.floor(numberLine) == numberLine){
                        document.getElementById(this.uploadBtnId).parentElement.style.width = '0%';
                        document.getElementById(this.uploadBtnId).parentElement.style.height = '0%';
                    }
                }else{
                    document.getElementById(this.uploadBtnId).parentElement.style.display = 'block';
                    if(Math.floor(numberLine) == numberLine){
                        document.getElementById(this.uploadBtnId).parentElement.style.width = this.boxSize+'px';
                        document.getElementById(this.uploadBtnId).parentElement.style.height = this.boxSize+'px';
                    }
                }
            }
        },
        onInit: function (_upload) {
            var upload = settings.onInit(_upload);
            settings._allowUpload = !upload;
            return upload;
        },
        onProgress: function () {
            settings.onProgress();
        },
        onComplete: function (result) {
            settings._allowUpload = true;
            settings._isUploading = false;
            
             if(result.errcode == "0"){   
                $('#'+ settings.uploaderInputId).attr('data-src', result.info.fileName);
                $("#" + settings.submitBtnId).removeClass('isUploading');
                if (settings.Control) {
                    setTimeout(function () {  $('#'+settings.drawImageBox).find('.upload-pic-mask').not(".chackson").hide(); }, 1000);
                } else {
                    setTimeout(function () {  $('#'+settings.drawImageBox).find('.upload-pic-mask').hide(); }, 1000);
                }
            }

            if (result.errcode !== "0" || result.errmsg !== "OK") {
                // Eap._util.showMsg('上传失败！');
                
                console.log('上传失败');
                $('#'+settings.drawImageBox).find(".upload-pic-holder *[data-queue='cancel']").last().trigger('click',true);
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
                    originalFileName:result.info.originalFileName,
                    fileName:result.info.fileName,
                    fileSize:result.info.fileSize,
                    thumbFileName:result.info.thumbFileName,
                    contentType:result.info.contentType,
                    ItemPhotoId: -1 // 所有的上传图片都视为新建图片，ItemPhotoId为-1
                });
            }

            if (settings.item.Photos.length == settings.maxFileCount) {
                $("#" + settings.submitBtnId).removeClass('btn-disabled');
            }
            else if (settings.item.Photos.length < settings.maxFileCount) {
                $("#" + settings.submitBtnId).removeClass('btn-disabled');
            }
            else {
                $("#" + settings.submitBtnId).addClass('btn-disabled');
            }

            // $("#" + settings.submitBtnId).removeClass('btn-grey');

            $("*[data-queue='cancel']", settings.queueTemplate).on("click", function (e) {
                //上传完成后删掉图片
                settings.item.Photos.length = settings.item.Photos.length - 1;
                settings.onDelete();
                fullSettings.onDelete();
            })

            settings.onComplete();
        },
        onCanceled: function (e) {
            settings._allowUpload = true;
            $('#'+settings.uploaderInputId).attr('data-src', '');

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
        onFailed: function () {
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
        }
        else {
            fullSettings.uploadBtnId = '#' + fullSettings.uploadBtnId;
        }

        $(fullSettings.uploadBtnId).on('click', function (e) {
            e.stopPropagation();
            if (fullSettings.onSelect()) {
                _camera.file.click();
            }
            else {
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
                    }
                    else {
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
                        $('#'+settings.uploaderInputId).attr('data-src', '');
                        document.getElementById(''+settings.uploaderInputId).value = '';
                        return false;

                    }
                } else {
                    // file.type为空时：某些机型使用File的属性不能正常获取格式类型，使用fileReader获取特征字节符进行判断
                    // 参考：http://stackoverflow.com/questions/18299806/how-to-check-file-mime-type-with-javascript-before-upload
                    //alert('file.type为空，使用fileReader获取特征字节符进行判断');
                    var blob = this.files[0];
                    var fileReader = new FileReader();
                    fileReader.onloadend = function (e) {
                        var arr = (new Uint8Array(e.target.result)).subarray(0, 4);
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
                                $('#'+settings.uploaderInputId).attr('data-src', '');
                                document.getElementById(''+settings.uploaderInputId).value = '';
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
    }

    _camera.init();

    return {
        isAllowUpload: function () {
            return settings._allowUpload;
        },
        clearItems: function () {
            settings.item = {};
        },
        getItems: function () {
            return settings.item;
        },
        getMaxFileCount: function () {
            return settings.maxFileCount;
        }
    };
};

export default cameraFool;