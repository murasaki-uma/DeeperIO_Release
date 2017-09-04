
// *********** ひとつめのシーン *********** //
import GUI from "./GUI";
import * as THREE from 'three';
import VThree from "./VThree";
export default class Scene01{

    public scene: THREE.Scene;
    public camera: THREE.Camera;
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

    private startPlaneZ:number = -0.1;

    private planeMoveSpeed = 0.05;

    private planeRotateSpeed = 0.02;

    private image_noiseScale:number = 0.0;
    private image_noiseSeed:number = 0.0;
    private image_noiseSpeed:number = 0.0;
    private vthree:VThree;
    private clearColor:number = 0.0;
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


        this.image_uniform = {
            texture: { value: new THREE.TextureLoader().load("./Texture/pal01.png") },
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
        this.plane_geometry = new THREE.PlaneGeometry( 1, window.innerHeight/window.innerWidth,100,100);
        // 緑のマテリアルを作成
        this.plane_material = new THREE.ShaderMaterial( {
            uniforms:       this.image_uniform,
            vertexShader:   document.getElementById( 'imageVertexShader' ).textContent,
            fragmentShader: document.getElementById( 'imageFragmentShader' ).textContent,
            side:THREE.DoubleSide
        });
        // 上記作成のジオメトリーとマテリアルを合わせてメッシュを生成
        this.plane = new THREE.Mesh( this.plane_geometry, this.plane_material );
        this.scene.add( this.plane );

        // カメラを作成
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
        // カメラ位置を設定
        this.camera.position.z = 0;







        this.image_noiseSeed = this.gui.parameters.image_noiseSeed;
        this.image_noiseScale = this.gui.parameters.image_noiseScale;
        this.image_noiseSpeed = this.gui.parameters.image_speed;
        this.initPostProcessing();

    }
    public  initPostProcessing()
    {
        //
        // var shaderBleach = THREE.BleachBypassShader;
        // var shaderSepia = THREE.SepiaShader;
        // var shaderVignette = THREE.VignetteShader;
        // var shaderCopy = THREE.CopyShader;
        //
        //
        // var shaderBleach = THREE.BleachBypassShader;
        // var shaderSepia = THREE.SepiaShader;
        // var shaderVignette = THREE.VignetteShader;
        // var shaderCopy = THREE.CopyShader;
        // var effectBleach = new THREE.ShaderPass( shaderBleach );
        // var effectSepia = new THREE.ShaderPass( shaderSepia );
        // var effectVignette = new THREE.ShaderPass( shaderVignette );
        // var effectCopy = new THREE.ShaderPass( shaderCopy );
        // effectBleach.uniforms[ "opacity" ].value = 0.05;
        // effectSepia.uniforms[ "amount" ].value = 0.9;
        // effectVignette.uniforms[ "offset" ].value = 0.95;
        // effectVignette.uniforms[ "darkness" ].value = 1.6;
        //
        //
        // var effectBloom = new THREE.BloomPass( 2.2);
        // var effectFilm = new THREE.FilmPass( 0.35, 0.025, 1024, false );
        // var effectFilmBW = new THREE.FilmPass( 0.35, 0.5, 2048, true );
        // effectVignette.renderToScreen = true;
        // effectBleach.renderToScreen = true;
        // var effectDotScreen = new THREE.DotScreenPass( new THREE.Vector2( 0, 0 ), 0.5, 0.8 );
        //
        //
        // effectFilm.renderToScreen = true;
        // effectFilmBW.renderToScreen = true;
        //
        //
        // var effectHBlur = new THREE.ShaderPass( THREE.HorizontalBlurShader );
        // var effectVBlur = new THREE.ShaderPass( THREE.VerticalBlurShader );
        // effectHBlur.uniforms[ 'h' ].value = 4 / ( window.innerWidth / 2 );
        // effectVBlur.uniforms[ 'v' ].value = 4 / ( window.innerHeight / 2 );
        // var effectColorify1 = new THREE.ShaderPass( THREE.ColorifyShader );
        // var effectColorify2 = new THREE.ShaderPass( THREE.ColorifyShader );
        // effectColorify1.uniforms[ 'color' ] = new THREE.Uniform( new THREE.Color( 1, 0.8, 0.8 ) );
        // effectColorify2.uniforms[ 'color' ] = new THREE.Uniform( new THREE.Color( 1, 0.75, 0.5 ) );
        // var clearMask = new THREE.ClearMaskPass();
        // var renderMask = new THREE.MaskPass( this.scene, this.camera );
        // var renderMaskInverse = new THREE.MaskPass( this.scene, this.camera );
        // renderMaskInverse.inverse = true;
        // this.composer = new THREE.EffectComposer( this.renderer );
        // this.composer.addPass( new THREE.RenderPass( this.scene, this.camera ) );
        // let renderScene = new THREE.TexturePass( this.composer.renderTarget2.texture );
        //
        // var effectRGB = new THREE.ShaderPass( THREE.RGBShiftShader );
        // effectRGB.uniforms[ 'amount' ].value = 0.001;
        // effectRGB.renderToScreen = true;
        //
        //
        // this.composer.addPass( effectFilm   );
        // this.composer.addPass( effectBleach   );
        // this.composer.addPass( effectVignette    );
        //
        //
        // this.composer.addPass( renderMaskInverse  );
        // this.composer.addPass( effectHBlur  );
        // this.composer.addPass( effectVBlur  );
        // this.composer.addPass( clearMask     );
        // this.isPostProcessing = true;
    }


    // ******************************************************
    public click()
    {

    }

    // ******************************************************
    public keyUp(e:KeyboardEvent)
    {

    }

    // ******************************************************
    public mouseMove(e:MouseEvent)
    {

    }

    public reset()
    {
        this.isAnimationStart = false;
        this.startPlaneZ = -0.1;
        this.plane.position.set(0,0,-0.1);
        this.plane.rotation.setFromVector3(new THREE.Vector3(0,0,0));
        this.renderer.setClearColor(0x000000);
        this.image_noiseSeed = this.gui.parameters.image_noiseSeed;
        this.image_noiseScale = this.gui.parameters.image_noiseScale;
        this.image_noiseSpeed = this.gui.parameters.image_speed;
        this.planeMoveSpeed = 0.05;
        this.planeRotateSpeed = 0.02;
        this.clearColor = 0.0;
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
        }

        if(e.key =="r")
        {
            this.reset();
        }

    }

    // ******************************************************
    public onMouseDown(e:MouseEvent)
    {


    }

    // ******************************************************
    public update(time)
    {
        if(this.vthree.oscValue.length > 0)
        {


            if( this.vthree.oscValue[1] == 112)

            {
                this.isAnimationStart = true;

            }

        }


        if(this.isAnimationStart)
        {


            if(this.planeMoveSpeed >= 0.0005)
            {

                this.planeMoveSpeed += (0.0004 - this.planeMoveSpeed) * 0.1;
            }
            // this.gui.parameters.image_positionZ -= this.planeMoveSpeed;
            this.startPlaneZ -= this.planeMoveSpeed;

            if(this.planeMoveSpeed <= 0.015)
            {
                this.clearColor += (1.0 - this.clearColor) * 0.0015;
                let c = new THREE.Color(this.clearColor,this.clearColor,this.clearColor);
                this.renderer.setClearColor(c);


                this.planeRotateSpeed +=(0.0 - this.planeRotateSpeed) * 0.1;
                this.plane.rotateX(-this.planeRotateSpeed);
                this.plane.rotateY(-this.planeRotateSpeed/2);
                this.plane.rotateZ(this.planeRotateSpeed/3);
            }

            if(this.planeMoveSpeed <= 0.001)
            {
                this.image_noiseSeed +=(0.01 - this.image_noiseSeed ) * 0.005;
                this.image_noiseScale +=(0.01 - this.image_noiseScale ) * 0.005;
                this.image_noiseSpeed +=(0.01 - this.image_noiseSpeed ) * 0.005;
            }


        }

        this.image_uniform.noiseScale.value = this.image_noiseScale;
        this.image_uniform.noiseSeed.value = this.image_noiseSeed;
        this.image_uniform.time.value += this.image_noiseSpeed;



        this.image_uniform.noiseScale_vertex.value = this.gui.parameters.image_noiseScale_vertex;
            this.image_uniform.noiseSeed_vertex.value = this.gui.parameters.image_noiseSeed_vertex;
            this.image_uniform.time_scale_vertex.value = this.gui.parameters.image_speed_scale__vertex;
            this.image_uniform.distance_threshold.value = this.gui.parameters.image_distance_threshold;
        // }



        this.plane.position.set (
            this.gui.parameters.image_positionX,
            this.gui.parameters.image_positionY,
            //this.gui.parameters.image_positionZ,
            this.startPlaneZ
        );


        // this.composer.render();

    }



}
