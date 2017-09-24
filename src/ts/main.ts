declare function require(x: string): any;
var css = require('../styl/main.styl');
var sp = require('../pug/sp.pug');
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
import Scene03 from './Scene03';
import Home from './Home';
import GUI from "./GUI";
// var img = require('./texture/pal01_opt.png');
// console.log(img);

console.log(THREE);
class Main
{
    private vthree:VThree;
    private home:Home;
    private scene01:Scene01;
    private scene02:Scene02;
    private scene03:Scene03;
    private gui:GUI;
    public socket:any;
    constructor()
    {




        $('.close').on('click',function() {
            $('.aboutText').stop().fadeOut('slow');
        });

        $('.about').on('click',function() {
            $('.aboutText').stop().fadeIn('slow');
        });
        let easeTime = 200;
        $('.playHigh').hover(function() {

            $('.fillHigh').stop().animate({'opacity':'1'}, easeTime);
            $(this).stop().addClass('hoveron');
            $(this).stop().removeClass('hoverout');

        },function() {

            $('.fillHigh').stop().animate({'opacity':'0'}, easeTime);
            $(this).stop().removeClass('hoveron');
            $(this).stop().addClass('hoverout');

        });

        $('.playLow').hover(function() {

            $('.fillLow').stop().animate({'opacity':'1'}, easeTime);
            $(this).stop().addClass('hoveron');
            $(this).stop().removeClass('hoverout');

        },function() {

            $('.fillLow').stop().animate({'opacity':'0'}, easeTime);
            $(this).stop().removeClass('hoveron');
            $(this).stop().addClass('hoverout');

        });


        $('.about').hover(function() {

            $(this).stop().addClass('hoveron');
            $(this).stop().removeClass('hoverout');

        },function() {

            $(this).stop().removeClass('hoveron');
            $(this).stop().addClass('hoverout');
        });


        this.gui = new GUI();
        this.vthree = new VThree();
        this.vthree.progress = {
            "home":0,
            "scene1":0,
            "scene2":0,
            "scene3":0

        };
        this.home = new Home(this.vthree.renderer,this.gui,this.vthree);
        this.scene01 = new Scene01(this.vthree.renderer,this.gui,this.vthree);
        this.scene02 = new Scene02(this.vthree.renderer,this.gui,this.vthree);
        this.scene03 = new Scene03(this.vthree.renderer,this.gui,this.vthree);
        this.vthree.addScene(this.home);
        this.vthree.addScene(this.scene01);
        this.vthree.addScene(this.scene02);
        this.vthree.addScene(this.scene03);
        this.vthree.draw();


    }
}

var getDevice = (function(){
    var ua = navigator.userAgent;
    if(ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0){

        $('.progressbar').stop().fadeOut("slow");

    } else
    {
        const main = new Main();
    }
})();



