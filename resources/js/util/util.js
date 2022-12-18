function urlToImageDom(url) {
    const img = document.createElement('img')
    return new Promise((res, rej) => {
        img.src = url
        img.onload = () => {
            res(img)
        }
        img.onerror = () => {
            rej(false)
        }
    })
}

/**
 * '도'를 라디안으로 변환
 * @param {Number} degrees 
 * @returns 
 */
function getRadian(degrees) {
    return degrees * Math.PI / 180;
}

/**
 * 서로 다른 두 좌표 사이의 각도
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 */
function getTwoPointAngle(x1, y1, x2, y2) {
    const angle = Math.atan2(y2 - y1, x2 - x1);

    return (angle * 180) / Math.PI
}

/**
 * 서로 다른 두 좌표 사이의 각도를 라디안으로 
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 */
function getTwoPointRadian(x1, y1, x2, y2) {
    const angle = Math.atan2(y2 - y1, x2 - x1);

    return angle
}

/**
 * 포인트 사이 거리 구하기
 * @param {Vector2} point1 
 * @param {Vector2} point2 
 */
function getLength(point1, point2) {
    const xLength = Math.pow(point2.x - point1.x, 2)
    const yLength = Math.pow(point2.y - point1.y, 2)

    return Math.sqrt(xLength + yLength)
}

/**
 * 캔버스를 파일로 변환
 * @param {String} canvas base64
 * @returns File
 */
function convertCanvasToFile(canvas, fileName) {
    return convertBase64ToFile(canvas.toDataURL(), fileName)
}

/**
 * base64 문자열을 파일로 변환
 * @param {String} url base64
 * @returns File
 */
function convertBase64ToFile(url, fileName) {
    const arr = url.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    let length = bstr.length
    const u8arr = new Uint8Array(length)
        
    while(length--){
        u8arr[length] = bstr.charCodeAt(length);
    }
    
    return new File([u8arr], fileName, {type:mime});
}