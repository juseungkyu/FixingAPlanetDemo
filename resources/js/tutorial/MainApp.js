class App {
    constructor(){
        this.init()
    }

    init(){
        this.currentPoint = {
            x : 0,
            y : 0,
        }

        console.log('hi')
        this.changeGardenMap.bind(this)()

        this.mouseDown = false
        document.querySelector('.view-box').addEventListener('mousedown', ()=>{
            this.mouseDown = true
        })
        document.querySelector('.view-box').addEventListener('mouseup', ()=>{
            this.mouseDown = false
        })
        document.querySelector('.view-box').addEventListener('mouseleave', ()=>{
            this.mouseDown = false
        })
        document.querySelector('.view-box').addEventListener('mousemove', (e)=>{
            if(!this.mouseDown){
                return
            }

            this.currentPoint.x -= e.movementX/5
            this.currentPoint.y += e.movementY/5

            if(this.currentPoint.y < -90){
                this.currentPoint.y = -90
            }
            if(this.currentPoint.y > 90){
                this.currentPoint.y = 90
            }

            document.querySelector('.cube').style = 'transform: translate(-50%, -50%) rotateX(${this.currentPoint.y}deg) rotateY(${this.currentPoint.x}deg)'
        })
    }

    async changeGardenMap(){
        this.gardenMap = new Map2()
        const map = await this.gardenMap.getMap()

        document.querySelectorAll('.cube>canvas').forEach((x)=>{
            x.width = map.right.width
            x.height = map.right.height
        })
        
        document.querySelector('.cube>canvas:nth-child(1)').getContext('2d').drawImage(map.back,0,0)
        document.querySelector('.cube>canvas:nth-child(2)').getContext('2d').drawImage(map.right,0,0)
        document.querySelector('.cube>canvas:nth-child(3)').getContext('2d').drawImage(map.front,0,0)
        document.querySelector('.cube>canvas:nth-child(4)').getContext('2d').drawImage(map.left,0,0)
        document.querySelector('.cube>canvas:nth-child(5)').getContext('2d').drawImage(map.bottom,0,0)
        document.querySelector('.cube>canvas:nth-child(6)').getContext('2d').drawImage(map.top,0,0)
    }
}

window.addEventListener('load',()=>{
    new App()
})