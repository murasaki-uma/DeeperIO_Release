/**
 * Created by uma92 on 2017/07/16.
 */
declare function require(x: string): any;
import GUI from "./GUI";
import * as THREE from 'three';
const vert = require('./GLSL/Home.vert');
const frag = require('./GLSL/Home.frag');
import VThree from "./VThree";
// *********** ひとつめのシーン *********** //

export default class Home{

    public scene: THREE.Scene;
    public camera: THREE.OrthographicCamera;
    private renderer:THREE.WebGLRenderer;
    private gui:GUI;
    private vthree;

    private cube:THREE.Mesh;
    private geometry:THREE.BoxGeometry;
    private material:THREE.MeshBasicMaterial;
    private width:number=0
    private uniforms:any;
    private height:number = 0;

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

        // 立方体のジオメトリーを作成
        this.geometry = new THREE.BoxGeometry( 1, 1, 1 );
        // 緑のマテリアルを作成
        this.material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        // 上記作成のジオメトリーとマテリアルを合わせてメッシュを生成
        this.cube = new THREE.Mesh( this.geometry, this.material );
        this.cube.position.z = -1;
        // メッシュをシーンに追加
        this.scene.add( this.cube );

        this.scene.add(new THREE.AmbientLight(0xffffff,1.0));

        // カメラを作成
        this.width = window.innerWidth;
        this.height = this.width/2;
        let aspect = this.width/this.height;
        // let frustumSize = 1000;
        this.camera = new THREE.OrthographicCamera( this.width  / - 2, this.width / 2, this.height / 2, this.height / - 2, 1, 1000 );
        // カメラ位置を設定
        // this.camera.position.y = 400;


        this.uniforms = {
            u_time: {value:0.0},
        };
        let planegeo = new THREE.PlaneGeometry(this.width
            ,this.height);
        let mat = new THREE.ShaderMaterial( {
            uniforms:       this.uniforms,
            vertexShader:   vert,
            fragmentShader: frag,
        });

        let mesh = new THREE.Mesh(planegeo,mat);
        mesh.position.z = -1;
        this.scene.add(mesh);

        //
        // var geometry = new THREE.BoxGeometry( 50, 50, 50 );
        // for ( var i = 0; i < 2000; i ++ ) {
        //     var object = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff } ) );
        //     object.position.x = Math.random() * 800 - 400;
        //     object.position.y = Math.random() * 800 - 400;
        //     object.position.z = Math.random() * 800 - 400;
        //     object.rotation.x = Math.random() * 2 * Math.PI;
        //     object.rotation.y = Math.random() * 2 * Math.PI;
        //     object.rotation.z = Math.random() * 2 * Math.PI;
        //     object.scale.x = Math.random() + 0.5;
        //     object.scale.y = Math.random() + 0.5;
        //     object.scale.z = Math.random() + 0.5;
        //     this.scene.add( object );
        // }



    }



    public replaceShader()
    {


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

    // ******************************************************
    public keyDown(e:KeyboardEvent)
    {

        if(e.key == "R")
        {
            // this.replaceShader();
        }


    }

    // ******************************************************
    public onMouseDown(e:MouseEvent)
    {


    }

    public reset()
    {

    }

    // ******************************************************


    public update(time)
    {


        this.uniforms.u_time.value += 0.01;

        // this.cube.rotateY(0.01);
        // this.cube.rotateX(0.005);


    }



}
