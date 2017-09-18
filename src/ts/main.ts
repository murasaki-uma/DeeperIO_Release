declare function require(x: string): any;
var css = require('../styl/main.styl');
import * as THREE from 'three';
import * as $ from 'jquery';

import 'imports-loader?THREE=three!three/examples/js/shaders/VignetteShader'
import 'imports-loader?THREE=three!three/examples/js/shaders/CopyShader'
import 'imports-loader?THREE=three!three/examples/js/postprocessing/EffectComposer'
import 'imports-loader?THREE=three!three/examples/js/postprocessing/RenderPass'
import 'imports-loader?THREE=three!three/examples/js/shaders/ConvolutionShader'
import 'imports-loader?THREE=three!three/examples/js/shaders/BleachBypassShader'
import 'imports-loader?THREE=three!three/examples/js/shaders/FilmShader'
import 'imports-loader?THREE=three!three/examples/js/shaders/VerticalTiltShiftShader'

import VThree from "./VThree";
import Scene01 from './Scene01';
import Scene02 from './Scene02';
import GUI from "./GUI";
// var img = require('./texture/pal01_opt.png');
// console.log(img);
console.log(THREE);
class Main
{
    private vthree:VThree;
    private scene01:Scene01;
    private scene02:Scene02;
    private gui:GUI;
    constructor()
    {
        this.gui = new GUI();
        this.vthree = new VThree();
        this.scene01 = new Scene01(this.vthree.renderer,this.gui,this.vthree);
        this.scene02 = new Scene02(this.vthree.renderer,this.gui,this.vthree);
        this.vthree.addScene(this.scene01);
        this.vthree.addScene(this.scene02);
        this.vthree.draw();
    }
}
window.addEventListener('DOMContentLoaded', () => {
    const main = new Main();
});