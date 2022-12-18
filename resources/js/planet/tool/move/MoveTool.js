import Tool from "/resources/js/planet/tool/Tool.js"

export default class MoveTool extends Tool {
    constructor(render) {
        super(render)
        
        this.setController()
    }

    /**
     * OrbitControls의 기본설정
     */
    setController() {
        this.controls = new THREE.OrbitControls(this.render.camera, this.render.renderer.domElement);

        this.controls.rotateSpeed = 0.5
        this.controls.zoomSpeed = 1
        this.controls.panSpeed = 0.8
        this.controls.minDistance = 900
        this.controls.maxDistance = 3000
    }

    /**
     * 툴 활성화
     */
    setAble() {
        this.controls.enabled = true;
    }

    /**
     * 툴 비활성화
     */
    setDisable() {
        this.controls.enabled = false;
    }
}