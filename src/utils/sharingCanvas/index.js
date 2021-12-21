
// canvas绘制文字自动换行
function fillTextToCanvas(cxt, text, beginWidth, beginHeight) {
    const lineLength = 24;// 行高
    let item = '';
    let count = 0;
    const stringLength = text.length;
    const newText = text.split('');
    const context = cxt;
    let beginHeightNew = beginHeight;
    context.textAlign = 'left';
    for (let i = 0; i <= stringLength; i++) {
        if (count === 15) { // count一行显示多少个字
            context.fillText(item, beginWidth, beginHeightNew);
            beginHeightNew += lineLength;
            item = '';
            count = 0;
        }
        if (i === stringLength) {
            context.fillText(item, beginWidth, beginHeightNew);
            item = '';
            count = 0;
        }
        item += newText[0];
        count += 1;
        newText.shift();
    }
}
//  canvas绘制文字自动换行
function drawLongText(longText, cxt, beginWidth, beginHeight) {
    const lines = longText.split('\n');
    const linesLen = lines.length;
    const lineLength = 24;// 行高
    if (linesLen >= 0) {
        for (let t = 0; t < linesLen; t++) {
            const beginHeightNew = beginHeight + lineLength * t;
            fillTextToCanvas(cxt, lines[t], beginWidth, beginHeightNew);
        }
    }
}

// 绘制分享图片
function createSharePicUrl(self, avatar, nickname, college, callback) {
    const shareCtx = wx.createCanvasContext('shareCanvas', self);
    shareCtx.rect(0, 0, 250, 200);
    shareCtx.setFillStyle('white');
    var path = 'https://images.ufutx.com/202104/24/9d2b72b0f7fdece30b1c1280ae19540c.png'
    var iconPath = ''
    wx.downloadFile({
    url: path,
        success(icon) {
            if (icon.statusCode==200){
                iconPath = icon.tempFilePath
                wx.downloadFile({
                    url: avatar,
                    success(res) {
                        wx.getImageInfo({src: avatar,
                            success(item){
                                console.log('img',res)
                                var w = item.width
                                var h = item.height
                                var dw = 250/w//canvas与图片的宽高比
                                var dh = 200/h
                                var ratio
                                // 裁剪图片中间部分
                                if(w > 250 && h > 200 || w < 250 && h < 200){
                                    if (dw > dh) {
                                        shareCtx.drawImage(res.tempFilePath, 0, (h - 200/dw)/2, w, 200/dw, 0, 0, 250, 200)
                                    } else {
                                        shareCtx.drawImage(res.tempFilePath, (w - 250/dh)/2, 0, 250/dh, h, 0, 0, 250, 200)
                                    }
                                }
                                // 拉伸图片
                                else{
                                    if(w < 250){
                                        shareCtx.drawImage(res.tempFilePath, 0, (h - 200/dw)/2, w, 200/dw, 0, 0, 250, 200)
                                    }else {
                                        shareCtx.drawImage(res.tempFilePath, (w - 250/dh)/2, 0, 250/dh, h, 0, 0, 250, 200)
                                    }
                                }
                                
                                const avatarWidth = 250; // 绘制的头像宽度
                                const avatarHeight = 200; // 绘制的头像高度
                                const avatarX = 0; // 绘制的头像在画布上的位置
                                const avatarY = 0; // 绘制的头像在画布上的位置
                                shareCtx.save();
                                shareCtx.beginPath(); // 开始绘制
                                // 先画个圆   前两个参数确定了圆心 （x,y） 坐标  第三个参数是圆的半径  四参数是绘图方向  默认是false，即顺时针
                                shareCtx.rect(avatarX,
                                    avatarY,
                                    avatarWidth,
                                    avatarHeight);
                                shareCtx.clip();
                                shareCtx.restore(); // 恢复之前保存的绘图上下文 恢复之前保存的绘图上下午即状态 还可以继续绘制
                                // 画中间帖子内容
            
                                const grd = shareCtx.createLinearGradient(0,136, 0, 200)
                                grd.addColorStop(0, 'rgba(10, 10, 10, 0)')
                                grd.addColorStop(1, 'rgba(10, 10, 10, .25)')
                                // Fill with gradient
                                shareCtx.setFillStyle(grd);//将渐变色渲染入正方形
                                shareCtx.fillRect(0, 136, 250 , 64 );//画出矩形背景
                                const buGrd = shareCtx.createLinearGradient(172,178, 240, 176)
                                buGrd.addColorStop(0, 'white')
                                buGrd.addColorStop(1, 'white')
                                // Fill with gradient
                                shareCtx.beginPath()
                                roundRect(shareCtx,168,161,72,28,13,buGrd)
                                shareCtx.fill()
                                shareCtx.setFontSize(13); // 文字字号
                                // shareCtx.fillText('马上认识', 175, 175, 100);
                                drawText({
                                    ctx: shareCtx,
                                    x: 175,
                                    y: 175,
                                    color: '#333333',
                                    size: 13,
                                    align: 'left',
                                    baseline: 'middle',
                                    text: '马上认识',
                                    bold: true
                                })

                                shareCtx.drawImage(iconPath, 229, 171, 5,8);
                                // shareCtx.fillText(nickname, 20, 140, 100);
                                // shareCtx.fillText(college, 20, 160, 100);
                                shareCtx.setFillStyle('white');
                                canvasWraptitleText(shareCtx,nickname,10,159,130,18,1)
                                canvasWraptitleText(shareCtx,college,10,183,130,18,1)
                                shareCtx.draw(false, setTimeout(callback, 200));
                            }
                        })
                    },
                });
            }
        }
    })
}
// 字体加粗
function drawText (obj) {
    console.log('渲染文字')
    obj.ctx.save();
    obj.ctx.setFillStyle(obj.color);
    obj.ctx.setFontSize(obj.size);
    obj.ctx.setTextAlign(obj.align);
    obj.ctx.setTextBaseline(obj.baseline);
    if (obj.bold) {
        console.log('字体加粗')
        obj.ctx.fillText(obj.text, obj.x, obj.y - 0.05);
        obj.ctx.fillText(obj.text, obj.x - 0.05, obj.y);
    }
    obj.ctx.fillText(obj.text, obj.x, obj.y);
    if (obj.bold) {
        obj.ctx.fillText(obj.text, obj.x, obj.y + 0.05);
        obj.ctx.fillText(obj.text, obj.x + 0.05, obj.y);
    }
    obj.ctx.restore();
}
/**
 * 绘制圆角矩形
 * @param {Object} ctx - canvas组件的绘图上下文
 * @param {Number} x - 矩形的x坐标
 * @param {Number} y - 矩形的y坐标
 * @param {Number} w - 矩形的宽度
 * @param {Number} h - 矩形的高度
 * @param {Number} r - 矩形的圆角半径
 * @param {String} [c = 'transparent'] - 矩形的填充色
 */
function roundRect(ctx, x, y, w, h, r, c = '#fff') {
    if (w < 2 * r) { r = w / 2; }
    if (h < 2 * r) { r = h / 2; }
 
    ctx.beginPath();
    ctx.fillStyle = c;
 
    ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.lineTo(x + w, y + r);
 
    ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2);
    ctx.lineTo(x + w, y + h - r);
    ctx.lineTo(x + w - r, y + h);
 
    ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5);
    ctx.lineTo(x + r, y + h);
    ctx.lineTo(x, y + h - r);
 
    ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI);
    ctx.lineTo(x, y + r);
    ctx.lineTo(x + r, y);
 
    ctx.fill();
    ctx.closePath();
}
/**
 * 
 * @param {CanvasContext} canvas canvas上下文
 * @param {number} text 文字
 * @param {number} xy x , y 绘制的坐标
 * @param {number} maxWigth 绘制文字的宽度
 * @param {number} lineHeight 行高
 * @param {number} maxRowNum 最大行数
 */
function canvasWraptitleText(canvas, text, x, y, maxWidth, lineHeight, maxRowNum) {
    if (typeof text != 'string' || typeof x != 'number' || typeof y != 'number') {
        return;
    }
    canvas.font = '15px bold PingFang SC'; //绘制文字的字号和大小
    // 字符分隔为数组
    var arrText = text.split('');
    var line = '';
    var rowNum = 1
    for (var n = 0; n < arrText.length; n++) {
        var testLine = line + arrText[n];
        var metrics = canvas.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            if (rowNum >= maxRowNum) {
                var arrLine = testLine.split('')
                arrLine.splice(-1)
                var newTestLine = arrLine.join("")
                newTestLine += "..."
                canvas.fillText(newTestLine, x, y);
                  //如果需要在省略号后面添加其他的东西，就在这个位置写（列如添加扫码查看详情字样）
                  //canvas.fillStyle = '#2259CA';
                //canvas.fillText('扫码查看详情',x + maxWidth-90, y);
                return
            }
            canvas.fillText(line, x, y);
            line = arrText[n];
            y += lineHeight;
            rowNum += 1
        } else {
            line = testLine;
        }
    }
    canvas.fillText(line, x, y);
}
module.exports = {
    drawLongText,
    createSharePicUrl,
};