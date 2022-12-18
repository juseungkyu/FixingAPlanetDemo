import Draw from './Draw.js';

export default class DrawContinent extends Draw {
    /**
     * onMouseDown 이벤트
     * @param {Render} render
     */
    constructor(render, canvasControl) {
        super(render, canvasControl)

        this.ctx = this.canvasControl.continentBumpMapCtx
        this.lineWidth = 2
        this.color = 255
        this.alpha = 0.01
        this.brashType = 'dot'
        this.init()
    }

    init() {
        this.upTool = document.querySelector('.continent-up')
        this.downTool = document.querySelector('.continent-down')

        this.menuList = document.querySelectorAll('.continent-tool-menu')
        
        this.continentSize = document.querySelector('.continent-size')
        this.continentColor = document.querySelector('.continent-color')

        this.lineWidth = parseInt(this.continentSize.value)
        this.alpha = parseFloat(this.continentColor.value)

        this.brashTypeSelect = document.querySelector('.continent-brash-type')
        
        this.addEvent()
        this.setUpTool()
    }

    addEvent() {
        this.upTool.addEventListener('click', this.setUpTool)
        this.downTool.addEventListener('click', this.setDownTool)

        this.continentSize.addEventListener('change', ()=>{
            this.lineWidth = parseInt(this.continentSize.value)
        })
        this.continentColor.addEventListener('change', ()=>{
            this.alpha = parseFloat(this.continentColor.value)
            this.strokeStyle = this.getColor()
        })
        this.brashTypeSelect.addEventListener('change', ()=>{
            this.brashType = this.brashTypeSelect.querySelectorAll('option')[this.brashTypeSelect.selectedIndex].value
        })
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

    /**
     * color를 rgba string으로 변환 후 리턴
     * @returns rgba(color,color,color,alpha)
     */
    getColor() {
        return `rgba(${this.color},${this.color},${this.color},${this.alpha})`
    }

    /**
     * 지형 올리기 모드로 설정
     */
    setUpTool = ()=> {
        console.log('upTool')
        this.color = 255
        this.strokeStyle = this.getColor()
        this.upTool.classList.add('active')
        this.downTool.classList.remove('active')
    }

    /**
     * 지형 내리기 모드로 설정
     */
    setDownTool = ()=> {
        console.log('downTool')
        this.color = 0
        this.strokeStyle = this.getColor()
        this.downTool.classList.add('active')
        this.upTool.classList.remove('active')
    }

    /**
     * 마우스 다운 이벤트
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
     * 마우스 무브 이벤트
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
        this.ctx.strokeStyle = this.strokeStyle

        if(this.brashType == 'dot'){
            this.justDrawDotLine(this.ctx, drawPoint1, drawPoint2, 1000, this.strokeStyle)
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

    /**
     * 좌표에 점을 찍음
     * @param {Vector2} drawPoint 
     */
    drawDot (drawPoint) {
        const {x,y} = drawPoint
        this.ctx.fillRect(x,y,2,2)
    }
}