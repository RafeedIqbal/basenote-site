// Ported from the supplied animated-webgl-background.html.
export const fragmentSource = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
uniform float speed;
#define FC gl_FragCoord.xy
#define T (time * speed)
#define R resolution
#define MN min(R.x, R.y)
float rnd(vec2 p) { p=fract(p*vec2(12.9898,78.233)); p+=dot(p,p+34.56); return fract(p.x*p.y); }
float noise(in vec2 p) { vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f); float a=rnd(i),b=rnd(i+vec2(1,0)),c=rnd(i+vec2(0,1)),d=rnd(i+1.); return mix(mix(a,b,u.x),mix(c,d,u.x),u.y); }
float fbm(vec2 p) { float t=.0,a=1.; mat2 m=mat2(1.,-.5,.2,1.2); for(int i=0;i<5;i++){ t+=a*noise(p); p*=2.*m; a*=.5; } return t; }
float clouds(vec2 p) { float d=1.,t=.0; for(float i=.0;i<3.;i++){ float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p); t=mix(t,d,a); d=a; p*=2./(i+1.); } return t; }
void main(void) {
  vec2 uv=(FC-.5*R)/MN,st=uv*vec2(2,1);
  vec3 col=vec3(0);
  float phase=6.28318530718*T/10.;
  vec2 loopOffset=vec2(sin(phase),cos(phase))*.42;
  float bg=clouds(vec2(st.x,-st.y)+loopOffset);
  uv*=1.-.3*(sin(phase)*.5+.5);
  for(float i=1.;i<12.;i++) {
    uv+=.1*cos(i*vec2(.1+.01*i,.8)+i*i+sin(phase)*.55+cos(phase)*.22+.1*uv.x);
    vec2 p=uv; float d=length(p);
    vec3 canyonRed=vec3(0.580,0.247,0.176);
    vec3 desertVarnish=vec3(0.545,0.227,0.165);
    vec3 mojaveOchre=vec3(0.627,0.271,0.208);
    col+=.00125/d*mix(desertVarnish,mojaveOchre,.5+.5*sin(i));
    float b=noise(i+p+bg*1.731);
    col+=.002*b/length(max(p,vec2(b*p.x*.02,p.y)));
    vec3 brandFold=mix(desertVarnish,canyonRed,bg);
    brandFold=mix(brandFold,mojaveOchre,.18+.18*sin(phase));
    col=mix(col,brandFold*bg*.72,d);
  }
  O=vec4(col,1);
}`;
