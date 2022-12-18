import PlanetController from '../ajax/PlanetController.js';

/**
 * 행성 정보 수정을 제어하는 페이지
 * @param {App} app 이 페이지를 생성할 App
 */
export default class UpdatePage {
    constructor(app) {
        console.log('UpdatePage start')
        this.isCreateProcessing = false
        this.app = app
        this.container = document.querySelector('.info-update-container')
        this.controller = new PlanetController()

        this.res = null

        this.planetId = -1

        this.init()
    }

    /**
     * 페이지 호출 시 실행
     */
    onCall(planetId, title, content) {
        this.planetId = planetId
        this.setContent(content)
        this.setTitle(title)

        return new Promise((res, rej)=>{
            this.res = res
        })
    }

    /**
     * 초기설정
     */
    init() {
        this.contentField = this.container.querySelector('#planet-update-content')
        this.titleField = this.container.querySelector('#planet-update-title')
        this.updateBtn = this.container.querySelector('.update-btn')

        this.addEvent()
    }

    /**
     * 이벤트 설정
     */
    addEvent() {
        this.contentField.addEventListener('input', this.contentFormatCheck)
        this.titleField.addEventListener('input', this.titleFormatCheck)

        this.updateBtn.addEventListener('click', this.onUpdateBtnClick)
    }

    /**
     * title 받아오기
     * @returns title string
     */
    getTitle = () => this.titleField.value
    /**
     * title 설정하기
     * @param {String} value 
     */
    setTitle(value) {
        this.titleField.value = value
    }
    /**
     * content 받아오기
     * @returns content string
     */
    getContent = () => this.contentField.value
    /**
     * content 설정하기
     * @param {String} value 
     */
    setContent(value) {
        this.contentField.value = value
    }

    /**
     * 수정 버튼 클릭
     * @param {Event} e
     */
    onUpdateBtnClick = async () => {
        if(!this.contentFormatCheck() || !this.titleFormatCheck()) {
            return
        }
        if(this.isCreateProcessing) {
            return
        }
        this.isCreateProcessing = true
        this.app.setWaitMode()
        const data = await this.controller.updatePlanet(this.planetId, this.getTitle(), this.getContent())

        if(data.error){
            alert(data.data)
            this.app.unsetWaitMode()
            this.isCreateProcessing = false
            return
        }

        alert(data.data.message)

        this.app.unsetWaitMode()
        this.isCreateProcessing = false

        this.res({
            title : this.getTitle(),
            content : this.getContent()
        }) 
    }

    /**
     * 150자 이하, 한글 또는 영어 또는 숫자인지 검사
     * @param {Event} e
     * @returns Boolean
     */
    contentFormatCheck = (e) => {
        let content = this.getContent()
        const reg = /^[0-9a-zA-Zㄱ-ㅎ가-힣ㅏ-ㅣ\s]*$/
        if(!reg.test(content) || content.length > 150) {
            content = content.substr(0, 150)
            content = content.replace(/[^0-9a-zA-Zㄱ-ㅎ가-힣ㅏ-ㅣ\s]/g, '')
            alert('150자 이하 한글 또는 영어 또는 숫자만 입력 가능합니다.')

            this.setContent(content)

            return false
        }
        
        return true;
    }

    /**
     * 15자 이하, 한글 또는 영어 또는 숫자인지 검사
     * @param {Event} e;
     * @returns Boolean
     */
    titleFormatCheck = (e) => {
        let title = this.getTitle()
        const reg = /^[0-9a-zA-Zㄱ-ㅎ가-힣ㅏ-ㅣ\s]*$/
        if(!reg.test(title) || title.length > 15) {
            title = title.substr(0, 15)
            title = title.replace(/[^0-9a-zA-Zㄱ-ㅎ가-힣ㅏ-ㅣ\s]/g, '')
            alert('15자 이하 한글 또는 영어 또는 숫자만 입력 가능합니다.')

            this.setTitle(title)

            return false
        }
        
        return true;
    }
}