import * as THREE from 'three';
declare function require(x: string): any;
import * as $ from 'jquery';
import 'imports-loader?THREE=three!../../node_modules/three/examples/js/controls/OrbitControls'
const Stats = require('stats-js');
// console.log(THREE.OrbitControls);

export default class VThree
{
    // 現在のシーンの番号
    public NUM:number = 0;
    // シーンを格納する配列
    public scenes:any[] = [];
    // Renderer
    public renderer:THREE.WebGLRenderer;
    private controls:any[] = [];


    public opacityStep:number = 0.1;
    public opacity:number = 1.0;

    public transparent:boolean = false;
    public key_sceneNext:string = "ArrowRight";
    public key_scenePrev:string = "ArrowLeft";
    private isOrbitControls:boolean = false;
    private stats:any;

    public debugMode:boolean = false;
    public cameras:THREE.Camera[] = [];

    public isUpdate:boolean = true;

    private debugCounter:number = 0;

    public oscValue:any[] = [];

    public rendertarget:THREE.WebGLRenderTarget = null;

    public screenWidth:number = 0;
    public screenHeight:number = 0;
    public maxWidth:number = 640;
    constructor(config?:any)
    {



            console.log(config);
            this.debugMode = (config === undefined? false : config.debugMode);
            this.transparent = false;



            // 初期化処理後、イベント登録
            this.init();

            window.addEventListener( 'resize', this.onWindowResize, false );
            window.addEventListener( 'click', this.onClick, false );
            window.addEventListener( 'onmousedown', this.onMouseDown, false );
            document.addEventListener("keydown", this.onKeyDown, true);
            document.addEventListener("keyup", this.onKeyUp, true);
            document.addEventListener("mousemove", this.onMouseMove, true);

    }

    public setTarget(target:THREE.WebGLRenderTarget)
    {
        this.rendertarget = target;
    }

    public initOrbitContorols()
    {
    }

    public reset()
    {
        for(let i = 0; i < this.scenes.length; i++)
        {
            this.scenes[i].reset();
        }
    }
    public init()
    {

        // Rendererを作る
        this.renderer = new THREE.WebGLRenderer({antialias: true, alpha:true});
        this.renderer.setPixelRatio(1);
        this.computeScreenSize();
        // this.onWindowResize();
        // this.screenWidth = window.innerWidth;
        // this.screenHeight = this.screenWidth/2.0;
        // this.renderer.setSize( this.screenWidth, this.screenHeight );
        this.renderer.sortObjects = false;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.BasicShadowMap;
        this.renderer.domElement.id = "main";
        this.renderer.gammaInput = true;
        this.renderer.gammaOutput = true;
        document.body.appendChild( this.renderer.domElement );

        this.updateCanvasAlpha();
        this.stats = new Stats();
        document.body.appendChild(this.stats.domElement);


        this.debug();

        $('#main').css("width","100%");
        $('#main').css("height",(window.innerWidth/2) + "px");

    }

    // 管理したいシーンを格納する関数

    public addScene(scene:any)
    {

        this.scenes.push(scene);
        this.cameras.push(scene.camera);
        // this.scenes[this.scenes.length-1].update();




    }

    public onMouseDown = (e:MouseEvent) =>
    {
        this.scenes[this.NUM].onMouseDown(e);
    }

    public computeScreenSize()
    {
        let w = window.innerWidth;
        if(w > this.maxWidth)
        {
            w = this.maxWidth;
        }

        this.screenWidth = w;
        this.screenHeight = this.screenWidth/2;
        this.renderer.setSize( this.screenWidth, this.screenHeight );
        $('#main').css("width","100%");
        $('#main').css("height",(window.innerWidth/2) + "px");
    }

    // ウィンドウの幅が変わったときの処理
    public onWindowResize = () =>
    {
        var windowHalfX = window.innerWidth / 2;
        var windowHalfY = window.innerHeight / 2;
        // this.scenes[this.NUM].camera.aspect = window.innerWidth / window.innerWidth/2;
        // this.scenes[this.NUM].camera.updateProjectionMatrix();
        this.computeScreenSize();

        this.scenes[this.NUM].windowResize();
        console.log("resize");
    }

    // 現在のシーン番号が、不適切な値にならないようにチェック
    public checkNum = () =>
    {
        if(this.NUM <0)
        {
            this.NUM = this.scenes.length-1;
        }

        if(this.NUM >= this.scenes.length)
        {
            this.NUM = 0;
        }

    }

    public  onClick = () => {
        this.scenes[this.NUM].click();

        // this.screenWidth = this.maxWidth * ( Math.random()*1.0);
        // this.screenHeight = this.screenWidth/2;
        // this.renderer.setSize( this.screenWidth, this.screenHeight );


    }
    // ←→キーでシーン番号を足し引き

    public onKeyUp = (e:KeyboardEvent) => {
        this.scenes[this.NUM].keyUp(e);
    }
    public getScreenWH()
    {
        return {w:this.screenWidth,h:this.screenHeight};
    }


    public nextScene()
    {
        this.NUM++;
        this.checkNum();
        // this.checkGuiOpen();
    }
    public onMouseMove = (e:MouseEvent) =>
    {
        try {
            this.scenes[this.NUM].mouseMove(e);
        }
        catch (e) {
            console.log(e); // 例外オブジェクトをエラー処理部分に渡す
        }
    }

    public onKeyDown = (e:KeyboardEvent) => {

        console.log(e);
        // console.log(this.NUM);
        try {
            if (e.key == this.key_sceneNext) {
                this.NUM++;
                this.checkNum();
            }
            if (e.key == this.key_scenePrev) {

                this.NUM--;
                this.checkNum();
            }


            if (e.key == "ArrowUp") {
                this.opacity += this.opacityStep;

                if (this.opacity > 1.0) {

                    this.opacity = 1.0;
                }

                this.updateCanvasAlpha();

            }
            if (e.key == "ArrowDown") {

                this.opacity -= this.opacityStep;

                if (this.opacity < 0.0) {

                    this.opacity = 0.0;
                }
                this.updateCanvasAlpha();
            }

            if (e.key == "d") {
                //this.debugCounter++;
            }

            if (e.code == "Space") {
                // this.StartStop();
               if($(".blackScreen").hasClass("start"))
               {
                   $(".blackScreen").removeClass("start");
                   $(".blackScreen").addClass("end");
               } else
               {
                   $(".blackScreen").addClass("start");
                   $(".blackScreen").removeClass("end");
               }

            }


            if (this.debugCounter >= 5) {
                this.changeDebug();
                this.debugCounter = 0;
            }

            console.log(this.NUM);
            this.scenes[this.NUM].keyDown(e);
            for(let i = 0; i < this.controls.length; i++)
            {
                if(i == this.NUM)
                {
                    this.controls[i].enabled = true;
                } else
                {
                    this.controls[i].enabled = false;
                }
            }

        }
        catch (e) {
            console.log(e) // 例外オブジェクトをエラー処理部分に渡す
        }

    }


    public StartStop()
    {
        this.isUpdate = !this.isUpdate;
        if(this.isUpdate)
        {
            requestAnimationFrame(this.draw.bind(this));
        }
    }


    public checkGuiOpen()
    {
        for(let i = 0; i < this.scenes.length; i++)
        {
            if(this.NUM == i)
            {


                this.scenes[i].guiOpen();
            }else {
                this.scenes[i].guiClose();
            }
        }
    }


    public updateCanvasAlpha()
    {
        if(this.transparent)
        {
            this.renderer.domElement.style.opacity = this.opacity.toString();
        }

    }

    public getNowScene()
    {
        return this.scenes[this.NUM];
    }

    public changeDebug()
    {
        this.debugMode = !this.debugMode;
        this.debug();
    }

    public debug()
    {

    }

    public start()
    {


    }

    // 最終的な描写処理と、アニメーション関数をワンフレームごとに実行
    public draw(time?) {


        this.stats.update(time);
        this.scenes[this.NUM].update(time,this.isUpdate);

        if(this.rendertarget === null)
        {
            if(!this.scenes[this.NUM].isPostProcessing) {
                this.renderer.render(this.scenes[this.NUM].scene, this.scenes[this.NUM].camera);
            }
        }
        else
        {
            if(!this.scenes[this.NUM].isPostProcessing)
            {
                this.renderer.render(this.scenes[this.NUM].scene, this.scenes[this.NUM].camera,this.rendertarget);
            }


        }




        if(this.isUpdate)
        {
            requestAnimationFrame(this.draw.bind(this));
        }


        this.oscValue = [];

    }
}

