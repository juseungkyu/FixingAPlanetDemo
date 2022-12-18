import Draw from './Draw.js'

export default class DrawContinent extends Draw {
    /**
     * onMouseDown 이벤트
     * @param {Render} render
     */
    constructor(render, canvasControl) {
        super(render, canvasControl)

        this.ctx = this.canvasControl.colorMapCtx
        this.lineWidth = 2
        this.brashType = 'dot'
        this.init()
    }

    /**
     * 툴 활성화
     */
    setAble() {
        this.menuList.forEach(x=>{
            x.style.display = 'flex'
        })
    }

    /**
     * 툴 비활성화
     */
    setDisable() {
        this.menuList.forEach(x=>{
            x.style.display = 'none'
        })
    }

    init() {
        this.menuList = document.querySelectorAll('.color-tool-menu')
        this.colorSize = document.querySelector('.color-size')

        this.rInput = document.querySelector('.color-r')
        this.gInput = document.querySelector('.color-g')
        this.bInput = document.querySelector('.color-b')
        this.colorView = document.querySelector('.color-view')

        this.brashTypeSelect = document.querySelector('.color-brash-type')

        this.color = 'rgb(0,0,0)'
        this.r = 0
        this.g = 0
        this.b = 0
        this.changeColor()

        this.addEvent()
    }

    addEvent() {
        // rgb set
        this.rInput.addEventListener('mousemove', this.changeR)
        this.rInput.addEventListener('keydown', this.changeR)
        this.gInput.addEventListener('mousemove', this.changeG)
        this.gInput.addEventListener('keydown', this.changeG)
        this.bInput.addEventListener('mousemove', this.changeB)
        this.bInput.addEventListener('keydown', this.changeB)

        this.colorSize.addEventListener('change', ()=>{
            this.lineWidth = parseInt(this.colorSize.value)
        })

        this.brashTypeSelect.addEventListener('change', ()=>{
            this.brashType = this.brashTypeSelect.querySelectorAll('option')[this.brashTypeSelect.selectedIndex].value
        })
    }

    /**
     * 설정된 색의 빨강값을 변경
     */
    changeR = () => {
        this.r = parseInt(this.rInput.value)
        this.changeColor()
    }
    /**
     * 설정된 색의 초록값을 변경
     */
    changeG = () => {
        this.g = parseInt(this.gInput.value)
        this.changeColor()
    }
    /**
     * 설정된 색의 파랑값을 변경
     */
    changeB = () => {
        this.b = parseInt(this.bInput.value)
        this.changeColor()
    }

    /**
     * r, g, b 각각 따로 저장되어 있는 색을 합쳐 설정함
     * 설정된 색을 유저에게 보여줌
     */
    changeColor() {
        this.color = `rgb(${this.r},${this.g},${this.b})`
        this.colorView.style.backgroundColor = this.color
    }

    /**
     * mouse down event
     * @param {Event} event 
     */
    downProcess(event) {
        const drawPoint = this.getDrawPoint(event)
        if(drawPoint === -1) {
            return 
        }

        this.beforePoint = drawPoint
        this.drawLine(this.beforePoint, this.beforePoint)
    }

    /**
     * mouse move event
     * @param {Event} event 
     */
    moveProcess(event) {
        const drawPoint =  this.getDrawPoint(event)
        if(drawPoint === -1) {
            return 
        }

        this.afterPoint = drawPoint
        this.drawLine(this.beforePoint, this.afterPoint)
        this.beforePoint = this.afterPoint
    }

    upProcess(event) {

    }

    leaveProcess(event) {

    }

    /**
     * 클릭 좌표와 raycaster 알고리즘을 이용하여
     * uv좌표를 구하고 구한 uv좌표를 캔버스 상의 실제 좌표로 변환해서 반환
     * @param {Event} event
     * @returns Vector2[x,y]
     */
    getDrawPoint(event) {
        const raycaster = new THREE.Raycaster()
        const mouse = new THREE.Vector2(event.clientX/this.render.WIDTH * 2 - 1, event.clientY/this.render.HEIGHT * -2 + 1)
        raycaster.setFromCamera(mouse, this.render.camera)
        
        const intersects = raycaster.intersectObjects(this.render.scene.children, true)

        if(intersects.length < 3){
            return -1
        }

        const uvPoint = intersects[1].uv
        return this.uvToDrawPoint(uvPoint)
    }

    /**
     * 지도상의 두 좌표를 이어줌 
     * 만약 두 좌표가 끝에서 끝을 통과하여 이어져 있다면 (x 좌표 차이가 지도의 절반보다 크다면 )
     * 지도상에선 반대로 이어 올바르게 이어진 것처럼 보이게 해줌
     * @param {Vector2} drawPoint1 
     * @param {Vector2} drawPoint2 
     */
    drawLine(drawPoint1, drawPoint2) {
        drawPoint1.x = Math.ceil(drawPoint1.x)
        drawPoint1.y = Math.ceil(drawPoint1.y)
        drawPoint2.x = Math.ceil(drawPoint2.x)
        drawPoint2.y = Math.ceil(drawPoint2.y)
        
        const reverseLine = Math.abs(drawPoint1.x - drawPoint2.x) > this.render.mapCanvas.width / 2

        if(reverseLine){
            this.reverseDrawLine(drawPoint1, drawPoint2)
            return
        }

        this.ctx.lineWidth = this.lineWidth
        this.ctx.strokeStyle = this.color

        if(this.brashType == 'dot'){
            this.justDrawDotLine(this.ctx, drawPoint1, drawPoint2, 1000, this.color)
        } else {
            this.justDrawLine(this.ctx, drawPoint1, drawPoint2)
        }

        this.canvasControl.updateCanvas(drawPoint1, drawPoint2, this.lineWidth)
    }

    /**
     * 선을 반대로 이음
     * @param {Vector2} drawPoint1 
     * @param {Vector2} drawPoint2 
     */
    reverseDrawLine(drawPoint1, drawPoint2) {
        if(drawPoint1.x < drawPoint2.x) {
            let temp = drawPoint1
            drawPoint1 = drawPoint2
            drawPoint2 = temp
        }

        let centerY = (drawPoint1.y + drawPoint2.y) / 2

        if(this.brashType = 'dot'){
            this.justDrawDotLine(this.ctx, drawPoint1, {x : this.ctx.canvas.width, y : centerY}, 1000, this.color)
            this.justDrawDotLine(this.ctx, drawPoint2, {x : 0, y : centerY}, 1000, this.color)
        } else {
            this.justDrawLine(this.ctx, drawPoint1, {x : this.ctx.canvas.width, y : centerY})
            this.justDrawLine(this.ctx, drawPoint2, {x : 0, y : centerY})
        }
        this.canvasControl.updateCanvas()
    }

}