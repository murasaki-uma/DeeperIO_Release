import * as dat from "dat-gui";
import GUIParameters from "./GUIParameters";
export default class GUI
{
    public gui:dat.GUI;
    public parameters:any;
    public rendering:any;
    public particle:any;
    public scene03:any;
    public image:any;
    public parking:any;
    public pal:any;
    // public camera:any;
    constructor ()
    {


        // var fizzyText = new FizzyText();
        this.parameters = new GUIParameters;
        console.log(this.parameters);
        // this.gui = new dat.GUI({ load: data, width:400});
        this.gui = new dat.GUI(this.parameters);
        this.gui.width = 400;

        // this.gui.remember();
        this.gui.remember(this.parameters);


        this.rendering = this.gui.addFolder('animation');
        this.scene03 = this.gui.addFolder("scene03");
        this.particle = this.gui.addFolder("particle");
        this.image = this.gui.addFolder("image");
        this.parking = this.gui.addFolder("parking");
        this.pal = this.gui.addFolder("pal");

        // this.camera = this.gui.addFolder('camera');

        this.init();

    }

    public init()
    {
        this.rendering.add(this.parameters, 'threshold',-30.0,30.0);
        this.scene03.add(this.parameters,"drawArms01",true);
        this.scene03.add(this.parameters,"drawArms02",true);
        this.scene03.add(this.parameters,"drawArms03",true);

        this.particle.add(this.parameters,"particleStartX",-3.0,3.0);
        this.particle.add(this.parameters,"particleStartY",-5.0,5.0);
        this.particle.add(this.parameters,"particleStartZ",-1.0,1.0);
        this.image.add(this.parameters,"image_speed",0.0,0.01);
        this.image.add(this.parameters,"image_noiseScale",0.0,1.0);
        this.image.add(this.parameters,"image_noiseSeed",0.0,0.05);

        // this.image.add(this.parameters,"image_positionX",-30.0,30.0);
        // this.image.add(this.parameters,"image_positionY",-30.0,30.0);
        // this.image.add(this.parameters,"image_positionZ",-500.0,100.0);
        // this.image.add(this.parameters,"imagePos");
        this.image.add(this.parameters,"image_rotationX",-1.0,1.0);
        this.image.add(this.parameters,"image_rotationY",-1.0,1.0);
        this.image.add(this.parameters,"image_rotationZ",-0.100,0.100);
        this.image.add(this.parameters,"image_translatedZ",-1000,0);

        this.image.add(this.parameters,"rotationDulation",0.0,5.0);
        this.image.add(this.parameters,"translateDulation",0.0,5.0);
        this.image.add(this.parameters,"colorDulation",0.0,10.0);

        this.parking.add(this.parameters, "parking_vGlitchArea", 0.0,10.0);
        this.pal.add(this.parameters,"pal_position_x", -5.0,5.0);
        this.pal.add(this.parameters,"scene_rotation_y", -1.0,1.0);

    }




};