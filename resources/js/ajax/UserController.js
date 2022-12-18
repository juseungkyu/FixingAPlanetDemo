import Controller from "./Controller.js";

export default class UserController extends Controller {
    constructor() {
        super()
    }

    /**
     * 유저 정보를 반환
     * @param {String} id 
     * @param {String} pw 
     * 
     * @returns  {
     *    'error' = true
     *    'data' : "id가 누락 되었습니다. 등 오류 메시지"
     *  }
     * @returns  {
     *    'error' = false
     *    'data' : {
     *         "loginSuccess" : false,
     *         "user" : null
     *     }
     *  }
     * @returns {
     *    'error' = false
     *    'data' : {
     *         userId : String,
     *         userName : String,   
     *     }
     *  }
     */
    login = async (id, pw) => await this.post('/session', { id, pw })

    /**
     * 유저 정보를 반환
     * 
     * @returns  {
     *    'error' = true
     *    'data' : "로그아웃을 실패했습니다."
     *  }
     * @returns  {
     *    'error' = false
     *    'data' : {
     *         "message" : "로그아웃 성공"
     *     }
     *  }
     */
    logout = async () => await this.get('/session')


    /**
     * 유저 정보를 반환
     * 
     * @param {String} id 
     * @param {String} pw 
     * @param {String} name 
     * 
     * @returns  {
     *    'error' = true
     *    'data' : "id가 누락 되었습니다. 등 오류 메시지"
     * }
     * @returns {
     *    'error' = false
     *    'data' : {
     *         "loginSuccess" : true
     *     }
     * }
     */
    join = async (id, pw, name) => await this.post('/join', { id, pw, name })
}