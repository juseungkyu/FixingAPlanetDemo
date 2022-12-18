import Tool from "/resources/js/planet/tool/Tool.js"

export default class Draw extends Tool {
    constructor(render, canvasControl) {
        super(render)
        this.canvasControl = canvasControl
        this.beforePoint = new THREE.Vector2(0,0)
        this.afterPoint = new THREE.Vector2(0,0)
    }
    
    /**
     * UV좌표를 지도좌표로 변환
     * @param {Vector2} uvPoint
     * @param {Vector2} point
     */
    uvToDrawPoint(uvPoint) {
        const point = uvPoint
        point.x *= this.render.mapCanvas.width
        point.y = 1- point.y
        point.y *= this.render.mapCanvas.height

        return point
    }

    /**
     * 그냥 선 잇기
     * @param {CanvasRenderingContext2D} ctx
     * @param {Vector2} point1
     * @param {Vector2} point2
     */
    justDrawLine(ctx, point1, point2) {
        ctx.beginPath()
        ctx.moveTo(point1.x, point1.y)
        ctx.lineTo(point2.x, point2.y)
        ctx.stroke()
    }

    /**
     * 선에 랜덤 점을 뿌림
     * @param {CanvasRenderingContext2D} ctx 
     * @param {Vector2} point1 
     * @param {Vector2} point2 
     * @param {Number} density 
     * @param {String} color 
     */
    justDrawDotLine(ctx, point1, point2, density, color) {
        const angle = getTwoPointRadian(point1.x, point1.y, point2.x, point2.y)
        const randomDotCanvas = this.canvasControl.getRandomDotCanvas(color, density)

        const x = (point2.x+point1.x)/2
        const y = (point2.y+point1.y)/2
        const width = ctx.lineWidth
        const height = getLength(point1, point2)

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(90 + angle);
        ctx.drawImage(randomDotCanvas, width/-2, height/-2, width, height)
        ctx.restore();
    }
}