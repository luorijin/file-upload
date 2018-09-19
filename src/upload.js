import getGuid from './guid.js';
import dataURLtoBlob from './lib/dataURLtoBlob.js';

//文件分块上传
var upload = function (options) {
    var settings = $.extend({
        // uploadUrl: "../../App/Upload",
        uploadUrl: "",
        minWidth: "100",//服务端压缩小图宽度的参数
        minHeight: "100",//服务端压缩小图高度的参数
        mode: "",    //"HW"指定高宽缩放（可能变形）;"W":指定宽，高按比例;"H":指定高，宽按比例;"Cut":指定高宽裁减（不变形）
        data: "",//对象
        slicesize: 1024 * 10, //10k 分割文件大小
        queueId: "",
        queueTemplate: "",
        fileExt: "",//后缀
        muiltupload: true,
        showDeleteConfirm: true, // 删除图片时是否提示 “您确定要删除该照片么”
        //事件响应
        onStart: function () { },
        onInit:function(){},
        onProgress: function () { },
        onComplete: function () { },
        onFailed: function () { },
        onCanceled: function () { }
    }, options);

    //创建上传进度提示
    var _createQueue = function () {
        console.log("创建上传进度提示")
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
            }
            else {
                $uploadWrapper.css("display", "block");
                $uploadWrapper.append(_upload.queueHtml);
            }
        } else {
            $uploadWrapper.css("display", "block");
            $uploadWrapper.html(_upload.queueHtml);
        }

        // 显示缩略图，_upload.data即_camera.imgData，经canvas压缩、调整方向输出的DataURL
       // $("img[data-queue='thumb']", _upload.queueHtml).prop("src", _upload.data);
        $('.imgCover', _upload.queueHtml).attr('style','background:url('+_upload.data+');width:100%;height:100%;background-size:cover;background-position:center center;background-repeat:no-repeat;')
                                    
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
        })
    }

    var _upload = {
        data: settings.data,//文件
        guidblob: "",//文件块
        totalsize: 0,//文件总大小
        guid: 0,
        blob_start: 0,
        blob_end: 0,
        nextaction_paras: 0,
        uploadStatus: 0, //上传状态 0:未上传  1：正在上传  2：上传成功 3:取消上传 4：上传失败
        queueHtml: ""
    }

    //初始化
    _upload.init = function () {
        console.log("初始化上传");
        _upload.uploadStatus = 0;
        //_upload.guid = getGuid() + settings.fileExt;
        _upload.guid = getGuid();
        // 这里将canvas生成的压缩后的dataURL装换成Blob
        _upload.guidblob = dataURLtoBlob(settings.data);
        _upload.totalsize = _upload.guidblob.size;

        if(settings.onInit(_upload)){
            _createQueue();

            settings.onStart();

            _upload.uploadFile(0);
        }

    }
    //开始上传
    _upload.uploadStart = function () {
        _upload.uploadFile(0);
    }
    //取消上传
    _upload.uploadCancel = function (e) {
        _upload.uploadStatus = 3;
        //防止照片栏下面有输入框穿透的问题，所以延时
        //setTimeout(function () {
        _upload.queueHtml.remove();
        settings.onCanceled(e);
        //}, 500)
    }
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
    }
    //上传完成
    _upload.uploadComplete = function (evt) {
        if (_upload.blob_end >= _upload.totalsize) {
            var result = eval("(" + evt.target.responseText + ")");

            if (result.errmsg == "OK" && result.errcode == "0") {
                $("*[data-queue='progress']", _upload.queueHtml).width(100 + "%");
                $("*[data-queue='info']", _upload.queueHtml).html("上传成功").css('display', 'block');
            }
            else {
                $("*[data-queue='info']", _upload.queueHtml).html("上传失败").css('display', 'block');
               
            }

            if(result.errmsg == "OK" && result.errcode == "0"){
                // 用于AutoDraft.js----Start
                $("img[data-queue='thumb']", _upload.queueHtml).attr({
                    guid: result.info.originalFileName,
                    BigPic: result.info.bigPic,
                    BigPicUrl: result.info.bicPicUrl,
                    SmallPicUrl: result.info.smallPicUrl,
                    SmallPic: result.info.smallPic,
                    BicPicTwoUrl:result.info.bicPicTwoUrl
                });
            }
            // 用于AutoDraft.js----End

            settings.onComplete(result);
        }
        else {
            window.setTimeout(function () {
                if (_upload.uploadStatus == 0 || _upload.uploadStatus == 1) {
                    _upload.uploadStatus = 1;
                    _upload.uploadFile(_upload.blob_end);
                }
            }, 50);
        }
    }
    //上传文件
    _upload.uploadFile = function (start) {
        console.log("开始上传")
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
        }
        else if (this.guidblob.webkitSlice) {
            var sliceblob = _upload.guidblob.webkitSlice(_upload.blob_start, _upload.blob_end);
        } else if (this.guidblob.mozSlice) {
            var sliceblob = _upload.guidblob.mozSlice(_upload.blob_start, _upload.blob_end);
        }

        // 目前的上传逻辑：分片1成功上传完毕之后，才会开始上传分片2。并非并发上传。
        var f = new FileReader();
        f.onload = function (e) {
            var xhr = new XMLHttpRequest();
            /* event listners */
            xhr.addEventListener("progress", function (event) { _upload.uploadProgress(event); }, false);
            xhr.addEventListener("load", function (event) { _upload.uploadComplete(event) }, false);
            //xhr.addEventListener("error", function (event) { _upload.uploadFile(_upload.blob_start); }, false);
            xhr.addEventListener("abort", function (event) { _upload.uploadFile(_upload.blob_start); }, false);
            xhr.addEventListener("readystatechange", function (event) {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                    } else {
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
        }
        f.readAsArrayBuffer(sliceblob);
    }
    return _upload;
}

export default upload;