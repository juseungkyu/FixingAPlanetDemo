import PlanetController from '../ajax/PlanetController.js';

/**
 * 행성 리스트 뷰어를 제어하는 페이지
 * @param {App} app 이 페이지를 생성할 App
 */
export default class PlanetListPage {
    constructor(app) {
        console.log('PlanetListPage start')
        this.app = app
        this.container = document.querySelector('.list-container')
        this.controller = new PlanetController()

        this.scrollPosition = 0

        this.init()
    }

    /**
     * 초기설정
     */
    init() {
        this.table = this.container.querySelector('.planet-table')
        this.scroll = this.container.querySelector('.scroll-bar')
        this.scrollBar = this.scroll.querySelector('i')

        this.addEvent()
    }

    /**
     * 이벤트 설정
     */
    addEvent() {
        this.mouseDown = false

        // 커스텀 스크롤바 설정
        this.scrollBar.addEventListener('mousedown', ()=>{
            this.mouseDown = true
        })
        window.addEventListener('mousemove', (e)=>{
            if(!this.mouseDown) {
                return
            }
            e.preventDefault()
            this.onScroll(e)
        })
        window.addEventListener('mouseup', (e)=>{
            if(!this.mouseDown) {
                return
            }
            this.mouseDown = false
            this.onScroll(e)
        })
        window.addEventListener('mouseleave', ()=>{
            this.mouseDown = false
        })

        // 윈도우 크기 변경
        window.addEventListener('resize', (e)=> {
            this.onScroll({movementY : 0}, true)
        })
    }

    /**
     * 커스텀 스크롤바의 스크롤 이벤트
     * @param {Event} e 
     * @param {Boolean} test default : false
     */
    onScroll(e, test = false) {
        if(this.table.clientHeight == this.table.scrollHeight){
            if(!test){
                alert('요소가 충분하지 않아 스크롤 할 수 없습니다.')
            }
            
            this.mouseDown = false
            return
        }
        this.scrollPosition -= e.movementY

        if(this.scrollPosition > 0){
            this.scrollPosition = 0
        } else if(this.scrollPosition < -this.scroll.clientHeight) {
            this.scrollPosition = -this.scroll.clientHeight
        }

        this.scrollBar.style.transform = `rotateZ(270deg) translateX(${this.scrollPosition}px)`
        const ratio = (this.table.scrollHeight - this.table.clientHeight) / this.scroll.clientHeight
        const scrollValue = ratio * (-this.scrollPosition)

        this.table.scrollTo(0, scrollValue)
    }

    /**
     * 페이지가 호출될 시
     * 행성 리스트를 서버에서 받아와 출력
     */
    async onCall(type) {
        this.currentType = type
        this.table.scrollTo(0, 0)
        this.scrollPosition = 0
        this.scrollBar.style.transform = `rotateZ(270deg) translateX(0px)`

        this.app.setWaitMode()

        let returnData = []
        
        if(type === 'all') {
            returnData = await this.controller.getPlanetListAll()
        } else if(type === 'my'){
            returnData = await this.controller.getMyPlanetList()
        } else {
            return
        }
        
        console.log(returnData)

        if(returnData.error){
            alert(returnData.data)
            this.app.setMainPage()
            this.app.unsetWaitMode()
            return
        }

        this.setList(returnData.data)
        this.app.unsetWaitMode()
    }

    async getAll() {

    }

    /**
     * 행성 리스트 설정
     * @param {Array} list 
     */
    setList(list) {
        this.table.innerHTML = ''
        
        list.forEach(cardData => {
            this.table.appendChild(this.createCard(cardData))
        })
    }

    /**
     * 행성 하나의 정보를 받아와 dom을 생성하고 이벤트를 추가함
     * @param {Object} cardData 
     * @returns HTMLElement card
     */
    createCard(cardData) {
        const card = document.createElement('div')
        card.classList.add('card')
        card.classList.add('d-flex')

        const {canvas, planetContent, planetId, planetTitle, playerId} = cardData
        const {canvasMapAddr} = canvas

        const date = new Date()

        card.innerHTML = `
            <img src="./resources/image/canvas/map/${canvasMapAddr}?${date.getTime()}" alt="지도">
            <div class="text">
                <h3>${planetTitle}</h3>
                <p>${planetContent}</p>
                <p class="creater">제작자 : ${playerId}</p>
            </div>
        `
        if(this.sessionCheck(playerId)) {
            card.querySelector('.text').innerHTML += `<div class="remove-btn">X</div>`
            this.removeBtnAddEvent(card.querySelector('.remove-btn'), planetId)
        }

        this.cardAddEvent(card, planetId)

        return card
    }

    /**
     * 카드 하나에 이벤트를 추가함
     * @param {String} playerId 
     * @returns Boolean
     */
    sessionCheck(playerId) {
        console.log(this.app.session, playerId)

        if(this.app.session == null){
            return false
        }
        if(this.app.session.playerId != playerId){
            return false
        }

        return true
    }

    /**
     * 카드 하나에 이벤트를 추가함
     * @param {HTMLElement} card 
     * @param {Number} planetId 
     */
    cardAddEvent(card, planetId) {
        card.addEventListener('click', (e)=>{
            console.log(planetId, 'card')
            this.app.setCanvas(planetId)
        })
    }

    /**
     * 카드 하나에 이벤트를 추가함
     * @param {HTMLElement} removeBtn 
     * @param {Number} planetId 
     */
    removeBtnAddEvent(removeBtn, planetId) {
        removeBtn.addEventListener('click', (e)=>{
            e.stopPropagation()
            this.removePlanet(planetId)
        })
    }

    /**
     * 자신의 행성 삭제 
     * @param {Number} planetId 
     */
    async removePlanet(planetId) {
        if(this.isProcessing){
            return
        }
        this.isProcessing = true

        this.app.setWaitMode()
        const data = await this.controller.deletePlanet(planetId)

        if(data.error) {
            alert(data.data)
            this.app.unsetWaitMode()
            this.isProcessing = false
            return
        }
        console.log(data)

        this.onCall(this.currentType)
        alert(data.data.message)
        this.isProcessing = false
    }
}