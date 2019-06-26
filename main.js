"use strict";

var imgPath = "img/1-mainpoint.png";
var canvas = document.getElementById("mycanvas");
var ctx = canvas.getContext("2d");

function traceToLeft(pixelData, w, y, sx, bbox) {
    for (var x1 = sx; x1 > 0; x1--) {
        if (pixelData[(y * w + x1) * 4 + 3] === 0) {
            bbox.sx = x1 < bbox.sx ? x1 : bbox.sx;
            bbox.sy = y < bbox.sy ? y : bbox.sy;
            break;
        }
    }
    return bbox;
}

function traceToRight(pixelData, w, y, sx, bbox) {
    for (var x2 = sx; x2 < w; x2++) {
        if (pixelData[(y * w + x2) * 4 + 3] === 0) {
            bbox.ex = x2 > bbox.ex ? x2 : bbox.ex;
            bbox.ey = y > bbox.ey ? y : bbox.ey;
            break;
        }
    }
    return bbox;
}

function getBBox(pixelData, cx, cy, w, h) {
    let bbox = {
        sx: cx,
        sy: cy,
        ex: cx,
        ey: cy
    };
    for (var y = cy; y < h; y++) {
        // 探测左侧边界坐标
        traceToLeft(pixelData, w, y, cx, bbox);
        // 探测右侧边界坐标
        traceToRight(pixelData, w, y, cx, bbox);

        cx = parseInt((bbox.sx + bbox.ex) / 2);
        // 如果向下探查5行，如果是透明，则停止。
        if (pixelData[(y * w + cx) * 4 + 3] === 0) {
            break;
        }
    }
    bbox.sx -= 5;
    bbox.sy -= 5;
    bbox.ex += 5;
    bbox.ey += 5;
    return bbox;
}

function hasPicked(targets, x, y) {
    if (targets.length === 0) {
        return false;
    }
    var checked = false;
    for (var index = 0; index < targets.length; index++) {
        const bbox = targets[index];
        if (x >= bbox.sx && x <= bbox.ex && y >= bbox.sy && y <= bbox.ey) {
            checked = true;
            break;
        }
    }
    return checked;
}

function pick(imageData, w, h) {
    var fromPixelData = imageData.data;
    var results = [];
    for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
            if (hasPicked(results, x, y)) {
                continue;
            }
            var index = (y * w + x) * 4;
            if (fromPixelData[index + 3] !== 0) {
                var bbox = getBBox(fromPixelData, x, y, w, h);
                results.push(bbox);
            }
        }
    }
    console.log("results", results);
    var resultDom = document.getElementById("result");
    resultDom.innerText = imgPath + "\n\n" + JSON.stringify(results, null, 4);
}

function start(image) {
    var w = image.width;
    var h = image.height;
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.drawImage(image, 0, 0, w, h);
    var imgData = ctx.getImageData(0, 0, w, h);
    pick(imgData, w, h);
}

var img = new Image();
img.onload = function () {
    start(img);
};
img.src = imgPath;