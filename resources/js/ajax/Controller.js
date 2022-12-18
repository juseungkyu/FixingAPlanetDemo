// server message format
// const message = {
//     'err' : {
//         'message' : ''
//     } ,
//     'result' : {
//         'temp' : []
//     }
// }

// client message format
// const data = {
//     'error' = false
//     'data' : {
//         'temp' : String
//         'tempList' : []
//     }
// }


export default class Controller {
    constructor() {}

    /**
     * get 방식의 fetch를 보냄
     * @param {String} url 
     * @returns {
     *      "error" : Boolean,
     *      "data" : Object
     * }
     */
    async get (url) {
        let json = null
        const result = {
            error: false,
            data: {}
        }

        try {
            json = await (
                await fetch(url, {method: 'GET'})
            ).json()
        } catch (error) {
            console.log(error)
            result.error = true
            result.data = '올바르지 않거나 구현되지 않은 요청입니다. 문제가 없다면 인터넷 연결 상태를 확인해보세요.'
            return result 
        }

        console.log('서버 메시지 :', json)

        if (json.err) {
            result.error = true
            result.data = json.err.message
        } else {
            result.data = json.result
        }

        return result;
    }

    /**
     * delete 방식의 fetch를 보냄
     * @param {String} url 
     * @returns {
     *      "error" : Boolean,
     *      "data" : Object
     * }
     */
    async delete (url) {
        let json = null
        const result = {
            error: false,
            data: {}
        }

        try {
            json = await (
                await fetch(url, {method: 'DELETE'})
            ).json()
        } catch (error) {
            console.log(error)
            result.error = true
            result.data = '올바르지 않거나 구현되지 않은 요청입니다. 문제가 없다면 인터넷 연결 상태를 확인해보세요.'
            return result 
        }

        console.log('서버 메시지 :', json)

        if (json.err) {
            result.error = true
            result.data = json.err.message
        } else {
            result.data = json.result
        }

        return result
    }

    /**
     * post 방식의 fetch를 보냄
     * @param {String} url 
     * @param {Object} data
     * @returns {
     *      "error" : Boolean,
     *      "data" : Object
     * }
     */
    async post (url, data) {
        let json = null
        const result = {
            error: false,
            data: {}
        }

        try {
            json = await (
                await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, 
                    body: 'json='+JSON.stringify(data),
                })
            ).json()
        } catch (error) {
            console.log(error)
            result.error = true
            result.data = '올바르지 않거나 구현되지 않은 요청입니다. 문제가 없다면 인터넷 연결 상태를 확인해보세요.'
            return result
        }

        console.log('서버 메시지 :', json)

        if (json.err) {
            result.error = true
            result.data = json.err.message
        } else {
            result.data = json.result
        }

        return result
    }

    /**
     * put 방식의 fetch를 보냄
     * @param {String} url 
     * @param {Object} data
     * @returns {
     *      "error" : Boolean,
     *      "data" : Object
     * }
     */
    async put (url, data) {
        let json = null
        const result = {
            error: false,
            data: {}
        }

        try {
            json = await (
                await fetch(url, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, 
                    body: 'json='+JSON.stringify(data),
                })
            ).json()
        } catch (error) {
            console.log(error)
            result.error = true
            result.data = '올바르지 않거나 구현되지 않은 요청입니다. 문제가 없다면 인터넷 연결 상태를 확인해보세요.'
            return result 
        }

        console.log('서버 메시지 :', json)

        if (json.err) {
            result.error = true
            result.data = json.err.message
        } else {
            result.data = json.result
        }

        return result
    }

    /**
     * put 방식의 fetch를 보냄
     * @param {String} url 
     * @param {Object} data
     * @param {Object} fileData
     * @returns {
     *      "error" : Boolean,
     *      "data" : Object
     * }
     */
    async postWithImageFile(url, data, fileData) {
        const formData = this.objectToFormData(fileData)
        this.appendFormDataValues(formData, data)
        
        let json = null
        const result = {
            error: false,
            data: {}
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData ,
                // headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, 
            })
            json = await (response).json()
        } catch (error) {
            console.log(error)
            result.error = true
            result.data = '올바르지 않거나 구현되지 않은 요청입니다. 문제가 없다면 인터넷 연결 상태를 확인해보세요.'
            return result 
        }

        console.log('서버 메시지 :', json)

        if (json.err) {
            result.error = true
            result.data = json.err.message
        } else {
            result.data = json.result
        }

        return result
    }

    /**
     * FormData에 Object안에 있는 요소를 넣습니다.
     * @param {Object} obj
     */
    appendFormDataValues(formData, obj) {
        const keyList = Object.keys(obj)

        keyList.forEach(x => {
            formData.set(x, obj[x]) 
        })
    }

    /**
     * Object를 FormData로 만들어 반환합니다.
     * @param {Object} obj
     * @return FormData
     */
    objectToFormData(obj) {
        const formData = new FormData()
        this.appendFormDataValues(formData, obj)
        return formData
    }
}
