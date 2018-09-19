/**
 * Detecting vertical squash in loaded image.
 * Fixes a bug which squash image vertically while drawing into canvas for some images.
 * This is a bug in iOS6 devices. This function from https://github.com/stomita/ios-imagefile-megapixel
 * 处理IOS的图片压缩比例异常的bug
 */
var detectVerticalSquash = function (img) {
    var iw = img.naturalWidth, ih = img.naturalHeight;
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
        py = (ey + sy) >> 1;
    }
    var ratio = (py / ih);
    return (ratio === 0) ? 1 : ratio;
};
var drawImageIOSFix = function (ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
    var vertSquashRatio = detectVerticalSquash(img);
    ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio);
};

//图片缩放计算
var _autoResizeImage = function (maxWidth, maxHeight, img) {
    var hRatio;
    var wRatio;
    var Ratio = 1;
    var w = img.width;
    var h = img.height;
    wRatio = maxWidth / w;
    hRatio = maxHeight / h;
    if (maxWidth == 0 && maxHeight == 0) {
        Ratio = 1;
    } else if (maxWidth == 0) {//
        if (hRatio < 1) Ratio = hRatio;
    } else if (maxHeight == 0) {
        if (wRatio < 1) Ratio = wRatio;
    } else if (wRatio < 1 || hRatio < 1) {
        Ratio = (wRatio <= hRatio ? wRatio : hRatio);
    }
    if (Ratio < 1) {
        w = w * Ratio;
        h = h * Ratio;
    }
    return { height: h, width: w };
};

//图片压缩，参数img为Image对象
var _imageCompression = function (img, settings, _camera) {
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

export default _imageCompression;