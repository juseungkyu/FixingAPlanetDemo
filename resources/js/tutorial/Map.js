class Map2 {
    constructor(url) {}

    getMap = async () => {
        return {
            left: await this.getImage("./resources/images/3d/nx.png"),
            front: await this.getImage("./resources/images/3d/nz.png"),
            right: await this.getImage("./resources/images/3d/px.png"),
            back: await this.getImage("./resources/images/3d/pz.png"),
            top: await this.getImage("./resources/images/3d/ny.png"),
            bottom: await this.getImage("./resources/images/3d/py.png"),
        }
    }

    getImage(src){
        const img = document.createElement('img')

        return new Promise((res, rej)=>{
            img.src = src 

            img.onload = ()=>{
                res(img)
            }
            img.onerror = ()=>{
                rej(img)
            }
        })
    }
} 