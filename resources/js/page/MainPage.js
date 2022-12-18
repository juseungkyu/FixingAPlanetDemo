import UserController from '../ajax/UserController.js';

/**
 * 메인 화면을 제어하는 페이지
 * @param {App} app 이 페이지를 생성할 App
 */
export default class MainPage {
    constructor(app) {
        this.app = app
        this.container = document.querySelector('.main-container')
        this.isProcessing = false

        this.init()
    }

    /**
     * 초기설정
     */
    init(){
        this.controller = new UserController()

        this.loginBtn = this.container.querySelector('.login-btn')
        this.joinBtn = this.container.querySelector('.join-btn')
        this.logoutBtn = this.container.querySelector('.logout-btn')
        this.planetListBtn = this.container.querySelector('.planet-list-btn')
        this.myPlanetListBtn = this.container.querySelector('.my-planet-list-btn')
        this.informationBtn = this.container.querySelector('.information-btn')
        this.createBtn = this.container.querySelector('.planet-create-btn')

        this.mainBtn = document.querySelectorAll('.main-btn')

        this.addEvent()
    }

    /**
     * 이벤트 설정
     */
    addEvent() {
        this.loginBtn.addEventListener('click', this.onLogin)
        this.joinBtn.addEventListener('click', this.onJoin)
        this.logoutBtn.addEventListener('click', this.onLogout)
        this.planetListBtn.addEventListener('click', this.onPlanetList)
        this.myPlanetListBtn.addEventListener('click', this.onMyPlanetList)
        this.informationBtn.addEventListener('click', this.onInformation)
        this.createBtn.addEventListener('click', this.onCreatePlanet)


        this.mainBtn.forEach(x=>x.addEventListener('click', this.onMainBtn))
    }

    onMainBtn = ()=> {
        this.app.setMainPage()
    }
    onLogin = () => {
        this.app.setUserPage('login')
    }
    onJoin = () => {
        this.app.setUserPage('join')
    }
    onLogout = async () => {
        if(this.isProcessing){
            return
        }
        this.isProcessing = true

        this.app.setWaitMode()
        const data = await this.controller.logout()

        if(data.error) {
            alert(data.data)
            this.app.unsetWaitMode()
            this.isProcessing = false
            return
        }

        alert(data.data.message)
        this.app.session = null
        this.app.unsetLogoutBtn()
        this.app.unsetWaitMode()

        this.isProcessing = false
    }
    onPlanetList = () => {
        this.app.setListPage('all')
    }
    onMyPlanetList = () => {
        this.app.setListPage('my')
    }
    onInformation = () => {
        this.app.setInformationPage()
    }
    onCreatePlanet = () => {
        this.app.setCreatePage()
    }
}