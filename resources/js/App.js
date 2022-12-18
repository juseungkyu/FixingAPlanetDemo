import MainPage from './page/MainPage.js';
import PlanetListPage from './page/PlanetListPage.js';
import CreatePage from './page/CreatePage.js';
import UserPage from './page/UserPage.js';
import CanvasPage from './page/CanvasPage.js';

class App {
    constructor() {
        window.app = this
        this.init()
    }

    init() {
        this.lodingScreen = document.querySelector('.wait')

        this.pageList = document.querySelectorAll('.fix-full')

        this.sessionTab = document.querySelectorAll('.session-btns')
        
        this.canvasPage = document.querySelector('.canvas-container')
        this.mainPage = document.querySelector('.main-container')
        this.listPage = document.querySelector('.list-container')
        this.informationPage = document.querySelector('.information-container')
        this.createPlanetPage = document.querySelector('.planet-create-container')
        this.userPage = document.querySelector('.user-container')

        this.userPageControl = new UserPage(this)
        this.mainPageControl = new MainPage(this)
        this.planetListPageControl = new PlanetListPage(this)
        this.createPageControl = new CreatePage(this)
        this.canvasPageControl = new CanvasPage(this)


        this.getInitData()
        this.addEvent()
        this.unsetWaitMode()


        this.unsetPageAll()
        this.setCanvas()
    }

    /**
     * 서버에서 설정한 기본 데이터 받아오기
     */
    getInitData() {
        // const data = document.querySelector('#init-data').innerHTML
        // this.session = JSON.parse(data)

        // if(this.session) {
        //     this.setLogoutBtn()
        // }
    }

    /**
     * 테스트
     */
    test() {
        // console.log(await urlToImageDom('/resources/image/test.jpg'))
        // console.log(await urlToImageDom('/resources/image/test_bump.jpg'))
        // this.render.drawMap(await urlToImageDom('/resources/image/test.jpg'))
        // this.canvasControl.continentBumpMapCtx.drawImage(await urlToImageDom('/resources/image/test_bump.jpg'),0,0)
        // this.canvasControl.updateCanvas()
        // this.canvasControl.cloudMapCtx.drawImage(await urlToImageDom('/resources/image/cloudMap.jpg'),0,0, 1000, 500)
        // this.render.cloudMat.alphaMap.needsUpdate = true
    }

    /**
     * 로딩창 생성
     */
    setWaitMode() {
        this.lodingScreen.classList.add('active')
    }

    /**
     * 로딩창 제거
     */
    unsetWaitMode() {
        this.lodingScreen.classList.remove('active')
    }

    /**
     * 페이지 전부 비활성화
     */
    unsetPageAll() {
        this.pageList.forEach(x=>x.classList.remove('active'))
    }

    /**
     * 메인 페이지 활성화
     */
    setMainPage = () => {
        this.unsetPageAll()
        this.mainPage.classList.add('active')
    }

    /**
     * 캔버스 페이지 활성화
     */
    setCanvas = (planetId) => {
        this.unsetPageAll()
        this.canvasPage.classList.add('active')
        this.canvasPageControl.onCall(planetId)
    }

    /**
     * 리스트 페이지 활성화
     * @param {String} type all or my
     */
    setListPage = (type) => {
        this.unsetPageAll()
        this.listPage.classList.add('active')
        this.planetListPageControl.onCall(type)
    }

    /**
     * 유저 페이지 활성화
     * @param {String} type login or join
     */
    setUserPage = (type) => {
        this.unsetPageAll()
        this.userPage.classList.add('active')
        this.userPageControl.onCall(type)
    }

    /**
     * 상세정보 페이지 활성화
     */
    setInformationPage = () => {
        this.unsetPageAll()
        this.informationPage.classList.add('active')
    }

    /**
     * 행성 생성 페이지 활성화
     */
    setCreatePage = () => {
        this.unsetPageAll()
        this.createPageControl.onCall()
        this.createPlanetPage.classList.add('active')
    }


    /**
     * 세션에 따라 ui 제어 
     */
    setLogoutBtn() {
        this.sessionTab[0].classList.remove('active')
        this.sessionTab[1].classList.add('active')
    }
    unsetLogoutBtn() {
        this.sessionTab[1].classList.remove('active')
        this.sessionTab[0].classList.add('active')
    }

    /**
     * 이벤트 제어
     */
    addEvent() {
        // this.container.addEventListener('mousedown', this.mouseDown)
        // this.container.addEventListener('mousemove', this.mouseMove)
        // this.container.addEventListener('mouseup', this.mouseUp)
        // this.container.addEventListener('mouseleave', this.mouseLeave)
    }
}

window.addEventListener('load', ()=>{
    new App()
})