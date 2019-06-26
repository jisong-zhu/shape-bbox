# 图片探测小程序

目的是为了根据指定的 PNG 图片，将图片中包含的物体的 Boundingbox 计算出来，比例示例图中的圆形图形。

使用 canvas 标签，利用 canvas 的 `getImageData` 方法，逐像素地进行 alpha 值判断，结合横纵向深度遍历，将每个物体的 Boundingbox 计算出来。
