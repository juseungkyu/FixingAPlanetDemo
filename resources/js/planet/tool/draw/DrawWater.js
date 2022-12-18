import Draw from './Draw.js';

export default class DrawWater extends Draw {
    /**
     * onMouseDown 이벤트
     * @param {Render} render
     */
    constructor(render, canvasControl) {
        super(render, canvasControl)

        // 해수면
        this.seaLevel = 0
        this.init()
    }

    init() {
        this.waterLevel = document.querySelector('.water-level')
        this.menuList = document.querySelectorAll('.water-tool-menu')

        this.addEvent()
    }

    addEvent() {
        // 해수면 변경 감지 이벤트
        this.waterLevel.addEventListener('mousemove', this.changeSeaLevel)
        this.waterLevel.addEventListener('keyup', this.changeSeaLevel)
        this.waterLevel.addEventListener('keydown', this.changeSeaLevel)
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
     * 해수면 변경
     */
    changeSeaLevel = () => {
        const nextSeaLevel = parseInt(this.waterLevel.value)

        if(nextSeaLevel !== this.seaLevel) {
            this.seaLevel = nextSeaLevel
            this.canvasControl.seaLevel = this.seaLevel
            this.canvasControl.updateCanvas(true)
        }            
    }
}