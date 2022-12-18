import PlanetController from '../ajax/PlanetController.js';
import Render from '../planet/view/Render.js';
import ToolControl from '../planet/tool/ToolControl.js';
import CanvasControl from '../planet/canvasControl/CanvasControl.js';
import UpdatePage from './UpdatePage.js';

/**
 * canvas(행성 뷰어)를 제어하는 페이지
 * @param {App} app 이 페이지를 생성할 App
 */
export default class CanvasPage {
    constructor(app) {
        console.log('CanvasPage start')
        this.app = app

        this.init()
        this.addEvent()
    }

    /**
     * 캔버스 페이지 기본 설정
     */
    init() {
        this.controller = new PlanetController()
        this.canvasControl = new CanvasControl()
        this.container = document.querySelector('.canvas-container')
        this.render = new Render(this.container, this)
        this.tool = new ToolControl(this.canvasControl, this.render, this.container)

        this.currentPlanetInfo = null

        this.saveAndExitBtn = this.container.querySelector('.save-btn')
        this.exitBtn = this.container.querySelector('.exit-btn')
        this.infoUpdateBtn = this.container.querySelector('.info-update-btn')

        this.ui = this.container.querySelectorAll('.ui')
        this.info = this.container.querySelector('.planet-info')

        this.render.stopAnimate()

        this.infoUpdatePage = document.querySelector('.info-update-container')
        this.updatePageControl = new UpdatePage(this.app)
    }

    /**
     * 캔버스 페이지 이벤트 설정
     */
    addEvent() {
        this.saveAndExitBtn.addEventListener('click', this.saveAndExit)
        this.exitBtn.addEventListener('click', this.exit)
        this.infoUpdateBtn.addEventListener('click', this.opanInfoUpdatePage)
        window.addEventListener('resize', this.render.setRendererSize)
    }

    /**
     * 저장하고 나가기
     */
    saveAndExit = async ()=>{
        alert('데모 플레이에서는 할 수 없습니다.')

        // if(this.isProcessing) {
        //     return
        // }

        // this.isProcessing = true
        // this.app.setWaitMode()

        // const data = await this.controller.savePlanet(this.currentPlanetInfo.planetId, this.tool.drawWaterTool.waterLevel.value, {
        //     "bumpMap" : this.canvasControl.bumpMapCanvas, 
        //     "cloudMap" : this.canvasControl.cloudMapCanvas, 
        //     "colorMap" : this.canvasControl.colorMapCanvas, 
        //     "continentMap" : this.canvasControl.continentBumpMapCanvas, 
        //     "map" : this.canvasControl.mapCanvas
        // })

        // if(data.error){
        //     alert(data.data)
        //     this.app.unsetWaitMode()
        //     this.isProcessing = false
        //     return
        // }

        // alert(data.data.message)
        // this.exit()

        // this.app.unsetWaitMode(true)
        // this.isProcessing = false
    }

    /**
     * 나가기
     */
    exit = ()=>{
        alert('데모 플레이에서는 할 수 없습니다.')
        // this.render.stopAnimate()
        // this.app.setMainPage()
    }

    /**
     * 호출되었을때
     * @param {Number} planetId 
     */
    async onCall(planetId) {
        if(this.isProcessing){
            return
        }
        this.isProcessing = true

        this.app.setWaitMode()
        // const data = await this.controller.getPlanet(planetId)

        // if(data.error) {
        //     alert(data.data)
        //     this.app.setMainPage()
        //     this.app.unsetWaitMode()
        //     this.isProcessing = false
        //     return
        // }

        // this.currentPlanetInfo = data.data
        
        // this.sessionCheck(this.currentPlanetInfo.playerId)

        // // 불러온 정보 그리기
        // await this.drawCanvas(this.currentPlanetInfo)

        // // 해수면 조절
        // this.tool.drawWaterTool.waterLevel.value = this.currentPlanetInfo.planetSeaLevel
        // this.tool.drawWaterTool.changeSeaLevel()

        // // 업데이트 
        // this.canvasControl.updateCanvas()
        // this.canvasControl.updateCloudCanvas()

        // 설명 쓰기
        this.info.querySelector('h2').innerText = '데모버젼 행성'
        this.info.querySelector('p').innerText = '데모버젼 행성입니다.'

        // 렌더 재시작
        this.render.animate()
        
        this.app.unsetWaitMode()
        this.isProcessing = false
    }

    /**
     * 제작자인지 체크
     * @param {String} playerId 
     */
    sessionCheck(playerId) {
        console.log(this.app.session, playerId)

        if(this.app.session == null){
            this.setViewer()
            return
        }
        if(this.app.session.playerId != playerId){
            this.setViewer()
            return
        }

        this.setEditer()
    }

    /**
     * 뷰어로 행성보기
     */
    setViewer() {
        console.log('open Viewer')
        this.tool.moveToolSet()
        this.ui.forEach(x=>{
            x.style.visibility = 'hidden'
        })
        this.container.querySelector('.right-top').style.visibility = 'visible'
        this.container.querySelector('.center-bottom').style.visibility = 'visible'
        this.saveAndExitBtn.style.visibility = 'hidden'
        this.infoUpdateBtn.style.visibility = 'hidden'
    }

    /**
     * 편집기로 행성 보기
     */
    setEditer() {
        console.log('open Editer')
        this.tool.moveToolSet()
        this.ui.forEach(x=>{
            x.style.visibility = 'visible'
        })
        this.saveAndExitBtn.style.visibility = 'visible'
        this.infoUpdateBtn.style.visibility = 'visible'
    }

    /**
     * 받아온 정보로 캔버스를 그림
     * @param {*} planetInfo 
     */
    async drawCanvas(planetInfo) {
        const {canvas} = planetInfo
        const {
            canvasBumpMapAddr,
            canvasContinentMapAddr,
            canvasColorMapAddr,
            canvasCloudMapAddr,
            canvasMapAddr,
        } = canvas
        const url = '/resources/image/canvas/'
        try {
            const 
            bumpMap = await urlToImageDom(`${url}bumpmap${canvasBumpMapAddr}`),
            cloudMap = await urlToImageDom(`${url}cloudmap${canvasCloudMapAddr}`),
            colorMap = await urlToImageDom(`${url}colormap${canvasColorMapAddr}`),
            continentMap = await urlToImageDom(`${url}continent${canvasContinentMapAddr}`),
            map = await urlToImageDom(`${url}map${canvasMapAddr}`)

            console.log(bumpMap)
            console.log(cloudMap)
            console.log(colorMap)
            console.log(continentMap)
            console.log(map)

            this.canvasControl.bumpMapCtx.drawImage(bumpMap, 0, 0)
            this.canvasControl.cloudMapCtx.drawImage(cloudMap, 0, 0)
            this.canvasControl.colorMapCtx.drawImage(colorMap, 0, 0)
            this.canvasControl.continentBumpMapCtx.drawImage(continentMap, 0, 0)
            this.canvasControl.mapCtx.drawImage(map, 0, 0)  
            
            console.log('success')
        } catch (error) {
            console.log(error)
            const defaultAddr = '/default.png'
            this.canvasControl.bumpMapCtx.drawImage(await urlToImageDom(`${url}bumpmap${defaultAddr}`), 0, 0)
            this.canvasControl.cloudMapCtx.drawImage(await urlToImageDom(`${url}cloudmap${defaultAddr}`), 0, 0)
            this.canvasControl.colorMapCtx.drawImage(await urlToImageDom(`${url}colormap${defaultAddr}`), 0, 0)
            this.canvasControl.continentBumpMapCtx.drawImage(await urlToImageDom(`${url}continent${defaultAddr}`), 0, 0)
            this.canvasControl.mapCtx.drawImage(await urlToImageDom(`${url}map${defaultAddr}`), 0, 0)
        }
    }

    /**
     * 유저 페이지 활성화
     * @param {String} type login or join
     */
    setUserPage = (type) => {
        this.unsetPageAll()
        this.userPageControl.onCall(type)
    }

    /**
     * 정보 수정 페이지 열기
     */
    opanInfoUpdatePage = async () => {
        alert('데모 플레이에서는 할 수 없습니다.')
        // if(this.isProcessing){
        //     return
        // }
        // this.isProcessing = true

        // this.container.classList.remove('active')
        // this.infoUpdatePage.classList.add('active')
        // const updateInfo = await this.updatePageControl.onCall(
        //     this.currentPlanetInfo.planetId, 
        //     this.currentPlanetInfo.planetTitle, 
        //     this.currentPlanetInfo.planetContent
        // )
        // this.infoUpdatePage.classList.remove('active') 
        // this.container.classList.add('active')
        
        // this.currentPlanetInfo.planetTitle = updateInfo.title
        // this.currentPlanetInfo.planetContent = updateInfo.content

        // this.info.querySelector('h2').innerText = this.currentPlanetInfo.planetTitle
        // this.info.querySelector('p').innerText = this.currentPlanetInfo.planetContent

        // this.isProcessing = false
    }
}

// this.currentPlanetInfo = {
//     "error": false,
//     "data": {
//         "planetTitle": "ddd",
//         "canvas": {
//             "canvasId": 22,
//             "canvasBumpMapAddr": "/default.png",
//             "canvasContinentMapAddr": "/default.png",
//             "canvasCloudMapAddr": "/default.png",
//             "canvasMapAddr": "/default.png"
//         },
//         "planetContent": "ddd",
//         "planetId": 22,
//         "playerId": "1234",
//         "planetSeaLevel": 10
//     }
// }