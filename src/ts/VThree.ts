import * as THREE from 'three';
declare function require(x: string): any;
import * as $ from 'jquery';
import 'imports-loader?THREE=three!../../node_modules/three/examples/js/controls/OrbitControls'
const Stats = require('stats-js');
const timeline = require('../json/fragValues.json');
const bgm = require('../audio/bgm.mp3');
// console.log(THREE.OrbitControls);
console.log(timeline);
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

    public oscValue:any = {node:"node"};

    public rendertarget:THREE.WebGLRenderTarget = null;

    public screenWidth:number = 0;
    public screenHeight:number = 0;
    public maxWidth:number = 1024;

    public progress:any;

    public firstupdateDelayNum:number = 60;
    public sceneFirtstUpdateDelay:number = 60;

    public awakedNum:number = 0;
    public isFistUpdate:boolean[] = [];
    public isAllSceneAwaking:boolean = false;

    public progressingbarLength:number = 0.0;

    public timeline:any[] = [];
    public audio:any;
public frameCount:number = 0;
    public isTimeLineStart:boolean = false;

    public isRelease:boolean = true;
    public isMenuFadeIn:boolean = false;
    constructor(config?:any)
    {



            console.log(config);
            this.debugMode = (config === undefined? false : config.debugMode);
            this.transparent = false;



            // 初期化処理後、イベント登録
            this.init();
            this.initTimeLine();
            this.initAudio();

            window.addEventListener( 'resize', this.onWindowResize, false );
            window.addEventListener( 'click', this.onClick, false );
            window.addEventListener( 'onmousedown', this.onMouseDown, false );
            document.addEventListener("keydown", this.onKeyDown, true);
            document.addEventListener("keyup", this.onKeyUp, true);
            document.addEventListener("mousemove", this.onMouseMove, true);
        $('.playHigh').on('click',{ value: 1 }, this.play);
        $('.playLow').on('click',{ value: 0 }, this.play);

    }

    public initAudio()
    {
        console.log('audio start');
        this.audio = new Audio();
        this.audio.volume = 0.3;
        this.audio.src = bgm;
        // this.audio.play();
    }

    public play =(e)=>
    {
        //this.audio.play();
        $('.blackscreen').fadeIn('slow');
        $('.menu').stop().fadeOut("slow");
        setTimeout(()=>{
            $('.blackscreen').fadeOut(15000);
            this.NUM = 1;
            this.checkNum();
            this.audio.play();
            if(e.data.value == 0)
            {
                this.maxWidth = 640;
            } else
            {
                this.maxWidth = 1024;
            }

            this.onWindowResize();
            this.isTimeLineStart = true;
        }, 1000);

    }

    public initTimeLine()
    {

        for(let i = 0; i < timeline.frags.length; i ++)
        {
            let start = timeline.frags[i].pos.x * timeline.framePerPixel;
            this.timeline.push({
                start:start/60,
                end:(start + timeline.frags[i].sendingOscTime * timeline.framePerPixel)/60,
                value:timeline.frags[i].value
            })
        }

        console.log(this.timeline);
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

        // this.progress.push(0);
        this.isFistUpdate.push(false);
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

        try
        {
           if(!this.scenes[this.NUM].isShaderReplace)
           {
               this.scenes[this.NUM].Awake();
           }
        }catch (e)
        {
            console.log(e);
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

        // console.log(e);
        if(!this.isRelease) {


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
                    if ($(".blackScreen").hasClass("start")) {
                        $(".blackScreen").removeClass("start");
                        $(".blackScreen").addClass("end");
                    } else {
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
                for (let i = 0; i < this.controls.length; i++) {
                    if (i == this.NUM) {
                        this.controls[i].enabled = true;
                    } else {
                        this.controls[i].enabled = false;
                    }
                }

            }
            catch (e) {
                console.log(e) // 例外オブジェクトをエラー処理部分に渡す
            }
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

        this.frameCount++;


        console.log(this.progress);
        if(this.isTimeLineStart)
        {
            console.log("audio" + this.audio.currentTime);
            let t = this.audio.currentTime;
            for(let i = 0; i < this.timeline.length; i++)
            {
                if(this.timeline[i].start+1 < t && this.timeline[i].end+1 > t)
                {
                    this.oscValue = this.timeline[i].value;
                }

            }
        }

        if(!this.isAllSceneAwaking)
        {
            let count = 0;
            let p = 0;
            for (let i = 0; i < this.scenes.length; i++) {

                p += this.progress[this.scenes[i].name];
                if (this.progress[this.scenes[i].name] == 100) {

                    count++;
                }

                if(i == this.scenes.length-1)
                {
                    if(this.scenes.length == count)
                    {
                        this.isAllSceneAwaking = true;
                    }
                }
            }

            this.progressingbarLength +=((p/4.0-10) - this.progressingbarLength) * 0.05;
            // $('.bar').css("width",Math.ceil(p/4.0-10)+"%");

        }
        if(this.isAllSceneAwaking && this.awakedNum < this.scenes.length) {


            this.sceneFirtstUpdateDelay--;
            if(this.sceneFirtstUpdateDelay < 0)
            {
                this.nextScene();
                this.checkNum();
                this.sceneFirtstUpdateDelay = this.firstupdateDelayNum;
                this.awakedNum++;
            }


            if(Math.floor(90 + 10/4 * this.awakedNum) > 95)
            {
                this.progressingbarLength +=(100 - this.progressingbarLength) * 0.05;
                if(this.progressingbarLength > 99.5)
                {
                    this.progressingbarLength = 100;


                    if(!this.isMenuFadeIn)
                    {
                        $('.progressbar').delay(2000).fadeOut("slow");
                        $('.menu').stop().delay(2000).fadeIn("slow");
                        this.isMenuFadeIn = true;
                    }
                }
            } else
            {
                this.progressingbarLength +=(Math.floor(90 + 10/4 * this.awakedNum)  - this.progressingbarLength) * 0.05;
            }
            // $('.bar').css("width",90 + 10/4 * this.awakedNum +"%");
        }

        $('.bar').css("width", this.progressingbarLength + "%");


        this.stats.update(time);


        if (this.rendertarget === null) {
            if (!this.scenes[this.NUM].isPostProcessing) {
                this.renderer.render(this.scenes[this.NUM].scene, this.scenes[this.NUM].camera);
            }
        }
        else {
            if (!this.scenes[this.NUM].isPostProcessing) {
                this.renderer.render(this.scenes[this.NUM].scene, this.scenes[this.NUM].camera, this.rendertarget);
            }


        }


        if (this.isUpdate) {
            requestAnimationFrame(this.draw.bind(this));
        }


        if(this.oscValue.node == '14')
        {
            // $('.blackscreen').css('display', 'block');
            $('.blackscreen').fadeIn(7000);
        }


        if(this.oscValue.node == '15') {

            for (let i = 0; i < this.scenes.length; i++) {

                this.scenes[i].reset();

            }
            this.NUM = 0;
            this.checkNum();
            $('.blackscreen').fadeOut(1000);
            $('.menu').stop().delay(0).fadeIn('slow');
        }

        if(this.oscValue.node == '03')
        {
            this.NUM = 2;
            this.checkNum();
        }

        if(this.oscValue.node == '05')
        {
            this.NUM = 3;
            this.checkNum();
        }

        if(this.oscValue.node == '11')
        {
            this.NUM = 2;
            this.checkNum();
        }

        // if(this.frameCount % 2 ==0){return;}
        this.scenes[this.NUM].update(time, this.isUpdate);
        this.oscValue = {node:'none'};


    }
}

