declare function require(x: string): any;
// *********** ひとつめのシーン *********** //
import GUI from "./GUI";
import * as THREE from 'three';
import VThree from "./VThree";
const NoiseUvShader_Frag = require("./GLSL/NoiseUvShader.frag");
const NoiseUvShader_Vert = require("./GLSL/NoiseUvShader.vert");
const texture = require('./texture/pal01_opt_min.png');
const TimeLineMax = require('gsap/TimelineMax');
const TimelineLite = require( 'gsap/TimelineLite');
const TweenLite = require('gsap/TweenLite');
const EASE = require('gsap/EasePack.js');
require("gsap");
const CustomEase = require("gsap/CustomEase");

import 'imports-loader?THREE=three!three/examples/js/shaders/VignetteShader'
import 'imports-loader?THREE=three!three/examples/js/shaders/CopyShader'
import 'imports-loader?THREE=three!three/examples/js/postprocessing/EffectComposer'
import 'imports-loader?THREE=three!three/examples/js/postprocessing/RenderPass'
import 'imports-loader?THREE=three!three/examples/js/postprocessing/ShaderPass'

// let c = new CustomEase();

console.log(TweenLite);

export default class Scene01{

    public name:string = "scene1";
    public scene: THREE.Scene;
    public camera: THREE.PerspectiveCamera;
    private renderer:THREE.WebGLRenderer;
    private plane_geometry:THREE.PlaneGeometry;
    private plane_material:THREE.ShaderMaterial;
    private plane:THREE.Mesh;
    private image_uniform:any;
    private gui:GUI;
    public isPostProcessing:boolean = false;
    private isImageUpdate:boolean = false;
    private composer:any;
    private isAnimationStart:boolean = false;

    private startPlaneZ:any ={value:0};

    private planeMoveSpeed = 0.05;

    private planeRotateSpeed = 0.02;

    private image_noiseScale:number = 0.0;
    private image_noiseSeed:number = 0.0;
    private image_noiseSpeed:number = 0.0;
    private vthree:VThree;
    // private clearColor:number = 0.0;
    private texture:any;
    private imageRotation:THREE.Vector3;
    private clearColor:THREE.Color;
    private isTweenStart:boolean = false;
    public rendertarget:boolean = true;
    public counter:number = 0;
    public translatedZ:number=0;
    public isPlaneConstantMove:boolean = false;
    private effectFilm:any;

    // ******************************************************
    constructor(renderer:THREE.WebGLRenderer,gui:GUI, vthree:VThree) {
        this.renderer = renderer;
        this.gui = gui;
        this.vthree = vthree;
        this.createScene();


        console.log("scene created!")
    }

    // ******************************************************
    private createScene()
    {


        this.scene = new THREE.Scene();

        this.scene.add(new THREE.AmbientLight(0xffffff,1.0));


        this.texture = new Image();
        this.texture.src = texture;
        this.image_uniform = {
            texture: { value: THREE.ImageUtils.loadTexture( this.texture.src )},
            time: {value:0.0},
            noiseSeed:{value:0.1},
            noiseScale:{value:0.1},
            time_scale_vertex: {value:0.0},
            noiseSeed_vertex:{value:0.1},
            noiseScale_vertex:{value:0.1},
            distance_threshold:{value:0.3},
            display:{value:true}
        };

        // 立方体のジオメトリーを作成
        this.plane_geometry = new THREE.PlaneGeometry(this.vthree.getScreenWH().w,this.vthree.getScreenWH().h);
        // 緑のマテリアルを作成
        this.plane_material = new THREE.ShaderMaterial( {
            uniforms:       this.image_uniform,
            vertexShader:   NoiseUvShader_Vert,
            fragmentShader: NoiseUvShader_Frag,
            side:THREE.DoubleSide
        });
        // 上記作成のジオメトリーとマテリアルを合わせてメッシュを生成
        this.plane = new THREE.Mesh( this.plane_geometry, this.plane_material );
        // this.plane.position.z = 10;
        this.scene.add( this.plane );

        // カメラを作成
        this.camera = new THREE.PerspectiveCamera( 90, this.vthree.getScreenWH().w/this.vthree.getScreenWH().h, 0.1, 10000 );
        // カメラ位置を設定
        this.camera.position.z = this.vthree.getScreenWH().h/2;


        this.clearColor = new THREE.Color("rgb(0,0,0)");
        this.renderer.setClearColor(this.clearColor.getHex());



        this.image_noiseSeed = this.gui.parameters.image_noiseSeed;
        this.image_noiseScale = this.gui.parameters.image_noiseScale;
        this.image_noiseSpeed = this.gui.parameters.image_speed;
        this.initPostProcessing();

        this.reset();
    }
    public  initPostProcessing()
    {

        var shaderVignette = THREE.VignetteShader;
        var shaderBleach = THREE.BleachBypassShader;
        let film = THREE.FilmShader;
        film.uniforms = {

            "tDiffuse":   { value: null },
            "time":       { value: 0.0 },
            "nIntensity": { value: 0.4 },
            "sIntensity": { value: 0.06 },
            "sCount":     { value: 4096/2 },
            "grayscale":  { value: 0 }

        };

        let ConvolutionShader = THREE.ConvolutionShader;

        var shaderCopy = THREE.CopyShader;
        var effectVignette = new THREE.ShaderPass( shaderVignette );
        var effectCopy = new THREE.ShaderPass( shaderCopy );
        effectVignette.uniforms[ "offset" ].value = 0.95;
        effectVignette.uniforms[ "darkness" ].value = 1.6;
        // var effectBloom = new THREE.ShaderPass( ConvolutionShader );
        this.effectFilm = new THREE.ShaderPass(film );
        var effectBleach = new THREE.ShaderPass( shaderBleach );
        effectVignette.renderToScreen = true;
        this.composer = new THREE.EffectComposer( this.renderer );
        this.composer.addPass( new THREE.RenderPass( this.scene, this.camera ) );
        // this.composer.addPass( effectBloom );
        this.composer.addPass( this.effectFilm );
        this.composer.addPass( effectBleach );
        this.composer.addPass( effectVignette    );

        this.isPostProcessing = true;
    }


    // ******************************************************
    public click()
    {

    }

    // ******************************************************
    public keyUp(e:KeyboardEvent)
    {

    }
    
    public windowResize()
    {
        // this.camera.aspect = window.innerWidth / window.innerWidth/2;
        // this.camera.updateProjectionMatrix();
        // this.camera.position.z = this.vthree.getScreenWH().h/2;
        // this.plane_geometry.vertices = new THREE.PlaneGeometry(this.vthree.getScreenWH().w,this.vthree.getScreenWH().h).vertices;
        // this.plane_geometry.verticesNeedUpdate = true;
    }

    // ******************************************************
    public mouseMove(e:MouseEvent)
    {

    }

    public reset()
    {
        this.imageRotation = new THREE.Vector3(0,0,0);
        this.isAnimationStart = false;
        this.startPlaneZ.value = -0;
        this.plane.position.set(0,0,0);
        this.plane.rotation.setFromVector3(new THREE.Vector3(0,0,0));
        this.renderer.setClearColor(0x000000);
        this.image_noiseSeed = this.gui.parameters.image_noiseSeed;
        this.image_noiseScale = this.gui.parameters.image_noiseScale;
        this.image_noiseSpeed = this.gui.parameters.image_speed;
        this.planeMoveSpeed = 0.05;
        this.planeRotateSpeed = 0.02;
        this.clearColor = new THREE.Color("rgb(0,0,0)");
        this.image_uniform.noiseScale.value = this.image_noiseScale;
        this.image_uniform.noiseSeed.value = this.image_noiseSeed;
        this.isPlaneConstantMove = false;
        this.translatedZ = 0;
    }

    // ******************************************************
    public keyDown(e:KeyboardEvent)
    {

        if(e.key == "p")
        {
            this.image_uniform.display.value = !this.image_uniform.display.value;
        }

        if(e.key == "s")
        {
            this.isAnimationStart = !this.isAnimationStart;
           this.isTweenStart = true;
        }

        if(e.key =="r")
        {
            this.reset();
        }


        if(e.key == "0")
        {
            this.vthree.scenes[1].update();
        }
        if(e.key == "1")
        {
            this.vthree.scenes[1].shaderReplace();
        }

    }

    // ******************************************************
    public onMouseDown(e:MouseEvent)
    {


    }

    // ******************************************************
    public update(time)
    {
        this.counter++;
        this.effectFilm.uniforms.time += 0.01;
        if(this.vthree.oscValue.length > 0)
        {


            if( this.vthree.oscValue[1] == 112)

            {
                this.isAnimationStart = true;

            }

        }


        if(this.isAnimationStart)
        {



            if(this.isTweenStart)
            {
                let anim = new TimeLineMax({delay:0.0,ease:CustomEase.create("custom", "M0,0 C0.022,0.386 -0.025,0.782 0.154,0.886 0.352,1 0.818,1 1,1"),onComplete: ()=>{this.isPlaneConstantMove = true;}}).to(this.startPlaneZ,this.gui.parameters.translateDulation,{value:this.gui.parameters.image_translatedZ});
                let anim02 = new TimeLineMax({delay:0,ease:CustomEase.create("custom", "M0,0 C0.03,0.386 0.114,0.777 0.224,0.85 0.336,0.924 0.818,1 1,1")}).to(this.imageRotation,this.gui.parameters.rotationDulation,{
                    x:this.gui.parameters.image_rotationX,
                    y:this.gui.parameters.image_rotationY,
                    z:this.gui.parameters.image_rotationZ,
                });
                // this.image_uniform.noiseScale.valu
                // this.image_uniform.noiseSeed.value
                let tween_noiseSpeed = new TimeLineMax({delay:0.5,ease:EASE.Expo.easeOut}).to(this.image_uniform.noiseScale,this.gui.parameters.translateDulation*6.0,{value:0.04});

                let tween_noiseSeed = new TimeLineMax({delay:0.5,ease:EASE.Expo.easeOut}).to(this.image_uniform.noiseSeed,this.gui.parameters.translateDulation*6.0,{value:0.001});

                let tween_color = new TimeLineMax({delay:0.0}).to(this.clearColor,this.gui.parameters.colorDulation,{r:1.0,g:1.0,b:1.0});
                this.isTweenStart = false;
            }

            this.renderer.setClearColor(this.clearColor.getHex());
this.plane.rotateX(-this.planeRotateSpeed);


        }
        this.image_uniform.time.value += this.image_noiseSpeed;


        if(this.isPlaneConstantMove)
        {
            this.translatedZ -= 0.5;
        }
        this.plane.position.set (
            this.gui.parameters.image_positionX,
            this.gui.parameters.image_positionY,
            // this.gui.parameters.image_positionZ,
            this.startPlaneZ.value+this.translatedZ
        );

        this.plane.rotation.setFromVector3(this.imageRotation);


// if(this.isTweenStart)
        // {
        this.composer.render();
        // }
        // else
        // {
        //     if(time % 2 == 0)
        //     {
        //         this.composer.render();
        //     }
        //
        //
        // }





    }



}
