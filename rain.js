var RAIN = (function () {
    var rain = {
        style: {
            r: 0,
            g: 100,
            b: 255,
            a: function (_data) {
                return Math.floor(255 * _data / 160);
            }
        },
        vertical: true,
        buffer: {
            ctx: null,
            width: 800,
            height: 400,
        },
        view: {
            ctx: null,
            x: 0,
            y: 0,
            width: 800,
            height: 400
        },
        imgData: null,
        init: function (isVertical, bufferWidth, bufferHeight, viewCanvas, viewX, viewY, viewWidth, viewHeight) {
            var c = document.createElement('canvas');
            this.buffer.ctx = c.getContext("2d");
            c.width = this.buffer.width;
            c.height = this.buffer.height;
            this.buffer.width = bufferWidth;
            this.buffer.heigth = bufferHeight;

            var c2 = document.getElementById(viewCanvas);
            this.view.ctx = c2.getContext("2d");
            c2.width = c2.offsetWidth;
            c2.height = c2.offsetHeight;
            this.view.x = viewX;
            this.view.y = viewY;
            this.view.width = viewWidth;
            this.view.height = viewHeight;

            if (isVertical)
                this.imgData = this.buffer.ctx.createImageData(this.buffer.width, 1);
            else
                this.imgData = this.buffer.ctx.createImageData(1, this.buffer.height);
            this.vertical = isVertical;
        },
        push: function (data) {
            if (this.vertical)
                this.pushVertical(data);
            else
                this.pushHorizontal(data);
        },
        pushVertical: function (data) {
            //move
            var img = this.buffer.ctx.getImageData(0, 0, this.buffer.width, this.buffer.height);
            this.buffer.ctx.putImageData(img, 0, 1);

            //add 1 line
            for (var x = 0; x < this.buffer.width; x++) {
                    this.imgData.data[x * 4 + 0] = this.style.r;
                    this.imgData.data[x * 4 + 1] = this.style.g;
                    this.imgData.data[x * 4 + 2] = this.style.b;
                    this.imgData.data[x * 4 + 3] = this.style.a(data[x]);
            }
            this.buffer.ctx.putImageData(this.imgData, 0, 0);

            //view
            this.view(this.buffer.ctx.canvas);
        },
        pushHorizontal: function (data) {
            //move
            var img = this.buffer.ctx.getImageData(0, 0, this.buffer.width, this.buffer.height);
            this.buffer.ctx.putImageData(img, 1, 0);

            //add 1 line
            for (var x = 0; x < this.buffer.height; x++) {
                this.imgData.data[x * 4 + 0] = this.style.r;
                this.imgData.data[x * 4 + 1] = this.style.g;
                this.imgData.data[x * 4 + 2] = this.style.b;
                this.imgData.data[x * 4 + 3] = this.style.a(data[this.buffer.height - x]);
            }
            this.buffer.ctx.putImageData(this.imgData, 0, 0);

            //view
            this.view(this.buffer.ctx.canvas);
        },
        view: function (imageData) {
            this.view.ctx.canvas.width = this.view.ctx.canvas.width; //value canvas.width and canvas will refresh 
            this.view.ctx.drawImage(
                imageData,
                0, 0, this.buffer.width, this.buffer.height,
                this.view.x, this.view.y, this.view.width, this.view.height
            );
        }
    };


    return rain;
});