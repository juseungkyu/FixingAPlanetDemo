import Draw from './Draw.js';

export default class DrawCloud extends Draw {
    /**
     * onMouseDown 이벤트
     * @param {Render} render
     */
    constructor(render, canvasControl) {
        super(render, canvasControl)

        this.ctx = this.canvasControl.cloudMapCtx
        this.lineWidth = 2
        this.color = 255
        this.alpha = 0.01
        this.brashType = 'dot'
        this.init()
    }

    /**
     * 초기세팅
     */
    init() {
        this.upTool = document.querySelector('.cloud-up')
        this.downTool = document.querySelector('.cloud-down')

        this.menuList = document.querySelectorAll('.cloud-tool-menu')
        
        this.cloudSize = document.querySelector('.cloud-size')
        this.cloudColor = document.querySelector('.cloud-color')

        this.lineWidth = parseInt(this.cloudSize.value)
        this.alpha = parseFloat(this.cloudColor.value)

        this.brashTypeSelect = document.querySelector('.cloud-brash-type')
        
        this.addEvent()
        this.setUpTool()
    }

    /**
     * 이벤트 설정
     */
    addEvent() {
        // 그리기 툴
        this.upTool.addEventListener('click', this.setUpTool)
        // 지우개 툴
        this.downTool.addEventListener('click', this.setDownTool)

        // 브러쉬 사이즈 조절
        this.cloudSize.addEventListener('change', ()=>{
            this.lineWidth = parseInt(this.cloudSize.value)
        })
        this.cloudColor.addEventListener('change', ()=>{
            this.alpha = parseFloat(this.cloudColor.value)
            this.strokeStyle = this.getColor()
        })

        // 브러쉬 타입 조절
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
     * 그리기 툴 설정
     */
    setUpTool = ()=> {
        console.log('upTool')
        this.color = 255
        this.strokeStyle = this.getColor()
        this.upTool.classList.add('active')
        this.downTool.classList.remove('active')
    }

    /**
     * 지우개 툴 설정
     */
    setDownTool = ()=> {
        console.log('downTool')
        this.color = 0
        this.strokeStyle = this.getColor()
        this.downTool.classList.add('active')
        this.upTool.classList.remove('active')
    }

    /**
     * 마우스 다운 시 시작 좌표를 설정함
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
     * 마우스 이동 시 선을 그림
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

        const uvPoint = intersects[0].uv
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

        this.canvasControl.updateCloudCanvas()
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
        this.canvasControl.updateCloudCanvas()
    }

    /**
     * 점을 그림
     * @param {Vector2} drawPoint 
     */
    drawDot (drawPoint) {
        const {x,y} = drawPoint
        this.ctx.fillRect(x,y,2,2)
    }
}