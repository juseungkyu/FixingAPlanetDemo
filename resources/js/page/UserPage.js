import UserController from '../ajax/UserController.js';

/**
 * 로그인, 회원가입 등 세션을 제어하는 페이지
 * @param {App} app 이 페이지를 생성할 App
 */
export default class UserPage {
    constructor(app) {
        console.log('UserPage start')
        this.app = app
        this.init()
    }

    /**
     * 초기 설정
     */
    init() {
        this.isProcessing = false
        this.container = document.querySelector('.user-container')
        this.controller = new UserController()

        this.tab = {
            login : this.container.querySelector('.login'),
            join : this.container.querySelector('.join')
        }

        this.logTabChangeBtn = this.container.querySelector('.login-btn')
        this.joinTabChangeBtn = this.container.querySelector('.join-btn')

        this.loginSubmit = this.container.querySelector('.user-login-btn')
        this.joinSubmit = this.container.querySelector('.create-user-btn')

        this.loginForms = {
            id : this.container.querySelector('#user-login-id'),
            pw : this.container.querySelector('#user-login-pw'),
        }

        this.joinForms = {
            id : this.container.querySelector('#user-join-id'),
            pw : this.container.querySelector('#user-join-pw'),
            name : this.container.querySelector('#user-join-name'),
        }

        this.addEvent()
    }

    /**
     * 이벤트 설정
     */
    addEvent() {
        // TAB 변경
        this.logTabChangeBtn.addEventListener('click', ()=>{
            this.changeTab('login')   
        })
        this.joinTabChangeBtn.addEventListener('click', ()=>{
            this.changeTab('join')   
        })

        this.loginSubmit.addEventListener('click', this.login)
        this.joinSubmit.addEventListener('click', this.join)
    }

    /**
     * 로그인 시도
     */
    login = async () =>{
        if(this.isProcessing){
            return
        }
        this.isProcessing = true

        console.log(this.loginForms.id)

        const id = this.loginForms.id.value
        const pw = this.loginForms.pw.value

        this.app.setWaitMode()
        const data = await this.controller.login(id, pw)

        if(data.error) {
            alert(data.data)
            this.app.unsetWaitMode()
            this.isProcessing = false
            return
        }
        console.log(data)

        alert('로그인 성공')
        this.app.session = data.data
        console.log(this.app.session)

        this.app.setLogoutBtn()
        this.app.unsetWaitMode()
        this.app.setMainPage()

        this.isProcessing = false
    }

    /**
     * 회원가입 시도
     */
    join = async () => {
        if(this.isProcessing){
            return
        }
        this.isProcessing = true

        const id = this.joinForms.id.value
        const pw = this.joinForms.pw.value
        const name = this.joinForms.name.value

        this.app.setWaitMode()
        const data = await this.controller.join(id, pw, name)

        if(data.error) {
            alert(data.data)
            this.app.unsetWaitMode()
            this.isProcessing = false
            return
        }

        alert(data.data.message)
        this.changeTab('login')

        this.app.unsetWaitMode()
        this.isProcessing = false

    }

    /**
     * 필드 비우기
     */
    resetField() {
        const loginFormsKeys = Object.keys(this.loginForms)
        loginFormsKeys.forEach(x => {
            this.loginForms[x].value = ''
        });

        const joinFormsKeys = Object.keys(this.joinForms)
        joinFormsKeys.forEach(x => {
            this.joinForms[x].value = ''
        });
    }

    /**
     * login or join tab으로 바꾸기
     * @param {String} type 
     */
    changeTab(type) {
        this.resetField()

        const keys = Object.keys(this.tab)
        keys.forEach(x=> {
            this.tab[x].classList.remove('active')
        })
        this.tab[type].classList.add('active')
    }

    /**
     * 호출 되었을 때 실행
     * @param {String} type 'login' or 'join'
     */
    onCall(type) {
        this.changeTab(type)
    }
}