export default class GUIParameters
{

    public threshold:number = 20;
    public drawArms01:boolean = true;
    public drawArms02:boolean = true;
    public drawArms03:boolean = true;

    public particleStartX:number = 0.1;
    public particleStartY:number = 0.1;
    public particleStartZ:number = 0.1;


    public image_speed:number =0.003;
    public image_noiseScale:number = 0.74;
    public image_noiseSeed:number = 0.002;

    public image_speed_scale__vertex:number = 0.005;
    public image_noiseScale_vertex:number = 0.1;
    public image_noiseSeed_vertex:number = 0.006;

    // public imagePos = {x:1,y:1,Z:1};
    public image_positionX:number = 0.0;
    public image_positionY:number = 0.0;
    public image_positionZ:number = 0.0;
    public image_rotationX:number = -0.4000;
    public image_rotationY:number = -0.2600;
    public image_rotationZ:number = 0.00001;
    public image_translatedZ:number = -80.0;

    public rotationDulation:number = 1.4;
    public translateDulation:number = 2.0;
    public colorDulation:number = 6.0;

    public parking_vGlitchArea = 0.001;

    public pal_position_x = -1.5;
    public scene_rotation_y = 0.0;
    constructor()
    {

    }

};
