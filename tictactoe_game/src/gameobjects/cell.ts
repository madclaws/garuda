
export class Cell{
    private scene: Phaser.Scene
    private x: number
    private y: number
    private scale:number
    private texture: string
    private cellIndex:number
    private cellPressIndicatorTween:Phaser.Tweens.Tween
    private gameObject: Phaser.GameObjects.Sprite
    private static GameObjectInstance: Cell=null;
    public static getInstance():Cell{
        return this.GameObjectInstance;
    }			
    constructor(scene,x,y,texture,cellIndex,scale){
        this.initialiseVariables(scene,x,y,texture,cellIndex,scale)
        this.addGameObject()
    }

    private initialiseVariables(scene,x,y,texture,cellIndex,scale){
        this.scene = scene
        this.x = x
        this.y = y
        this.scale = scale
        this.texture = texture
        this.cellIndex = cellIndex
    }
    
    private addGameObject(){
        this.gameObject = this.scene.add.sprite(this.x,this.y,this.texture).setScale(this.scale).setOrigin(0)
        this.gameObject.setInteractive()
    }

    public cellClicked(inputSign: string){
        this.gameObject.setTexture(inputSign).setOrigin(0);
    }

    public disableInput(){
        this.gameObject.disableInteractive()
    }		

    public getGameObject(){
        return this.gameObject
    }
}
