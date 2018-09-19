import BinaryAjax from './lib/binaryAjax.js';
import EXIF from './lib/exif.js';

// 处理IOS拍照图片会自动旋转的bug，通过EXIF.js获取Orientation
var _getImgAngle = function (url, _camera) {
    var radians = function (angle) {
        if (typeof angle == 'number') return angle;
        return {
            rad: function (z) {
                return z;
            },
            deg: function (z) {
                return Math.PI / 180 * z;
            }
        }[String(angle).match(/[a-z]+$/)[0] || 'rad'](parseFloat(angle));
    }

    var orientation = 0;
    BinaryAjax(url, function (o) {
        var oExif = EXIF.readFromBinaryFile(o.binaryResponse),
            orientation = oExif.Orientation;
        switch (orientation) {
            case 1:
                _camera.angle = '0deg'
                break;
            case 6:
                _camera.angle = '90deg'
                break;
            case 3:
                _camera.angle = '180deg'
                break;
            case 8:
                _camera.angle = '270deg'
                break;
            default:
                _camera.angle = '0deg'
                break;
        }
        _camera.angle = radians(_camera.angle);
    });
};
//旋转图片（调整为正向）
var _imageRotation = function (img, _camera, settings) {
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
}

export {
    _getImgAngle,
    _imageRotation
}