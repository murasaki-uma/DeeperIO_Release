export default class GUIParameters
{

    public threshold:number = 20;
    public drawArms01:boolean = true;
    public drawArms02:boolean = true;
    public drawArms03:boolean = true;

    public particleStartX:number = 0.1;
    public particleStartY:number = 0.1;
    public particleStartZ:number = 0.1;


    public image_speed:number =0.005;
    public image_noiseScale:number = 0.1;
    public image_noiseSeed:number = 0.1;

    public image_speed_scale__vertex:number = 0.005;
    public image_noiseScale_vertex:number = 0.1;
    public image_noiseSeed_vertex:number = 0.1;
    public image_distance_threshold:number = 0.3;

    public image_positionX:number = 0.0;
    public image_positionY:number = 0.0;
    public image_positionZ:number = 29.5;

    public parking_vGlitchArea = 0.001;

    public pal_position_x = -1.5;
    public scene_rotation_y = 0.0;
    constructor()
    {

    }

};
