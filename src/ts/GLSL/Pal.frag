 uniform sampler2D texture;
varying vec2 vUv;
varying vec3 vPos;
uniform int transparent;
uniform float threshold;
float alpha;
uniform bool isDisplay;
void main( void ) {

        if(transparent == 1)
        {
            float d = distance(vec3(vPos.x,vPos.y,vPos.z), vec3(0,0,threshold));

            if(d < 10.0)
            {
                alpha =( 1.0-(d/10.0))+0.2;
                if(alpha > 1.0)
                {
                    alpha = 1.0;
                }

            } else
            {
                alpha = 0.0;
            }
        } else
        {
            alpha = 1.0;
        }
      gl_FragColor = vec4(texture2D( texture, vUv ).rgb,alpha);
      if(!isDisplay)
      {
        discard;
      }

}