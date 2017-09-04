
import * as THREE from 'three';
import * as $ from 'jquery';
import VThree from "./VThree";
import Scene01 from './Scene01';
import GUI from "./GUI";
console.log(THREE);
class Main
{
    private vthree:VThree;
    private scene01:Scene01;
    private gui:GUI;
    constructor()
    {
        this.gui = new GUI();
        this.vthree = new VThree();
        this.scene01 = new Scene01(this.vthree.renderer,this.gui,this.vthree);
        this.vthree.addScene(this.scene01);
        this.vthree.draw();
    }
}
window.addEventListener('DOMContentLoaded', () => {
    const main = new Main();
});