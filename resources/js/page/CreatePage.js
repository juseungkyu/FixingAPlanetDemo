import PlanetController from '../ajax/PlanetController.js';

/**
 * 행성 생성을 제어하는 페이지
 * @param {App} app 이 페이지를 생성할 App
 */
export default class CreatePage {
    constructor(app) {
        console.log('CreatePage start')
        this.isCreateProcessing = false
        this.app = app
        this.container = document.querySelector('.planet-create-container')
        this.controller = new PlanetController()

        this.init()
    }

    /**
     * 페이지 호출 시 실행
     */
    onCall() {
        this.setContent('')
        this.setTitle('')
    }

    /**
     * 초기설정
     */
    init() {
        this.contentField = this.container.querySelector('#planet-create-content')
        this.titleField = this.container.querySelector('#planet-create-title')
        this.createBtn = this.container.querySelector('.create-btn')

        this.addEvent()
    }

    /**
     * 이벤트 설정
     */
    addEvent() {
        this.contentField.addEventListener('input', this.contentFormatCheck)
        this.titleField.addEventListener('input', this.titleFormatCheck)

        this.createBtn.addEventListener('click', this.onCreateBtnClick)
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
     * 생성 버튼 클릭
     * @param {Event} e
     */
    onCreateBtnClick = async () => {
        if(!this.contentFormatCheck() || !this.titleFormatCheck()) {
            return
        }
        if(this.isCreateProcessing) {
            return
        }
        this.isCreateProcessing = true
        this.app.setWaitMode()
        const data = await this.controller.createPlanet(this.getTitle(), this.getContent())

        if(data.error){
            alert(data.data)
            this.app.unsetWaitMode()
            this.isCreateProcessing = false
            return
        }

        alert('생성 되었습니다.')

        this.setContent('')
        this.setTitle('')

        this.app.setMainPage()
        this.app.unsetWaitMode()
        this.isCreateProcessing = false
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