"use client";
import { useEffect, useRef } from "react";

const vertexShader = `
uniform float uTime;
uniform float uSeed;
varying vec3 vNormal;
varying vec3 vPosition;
float hash(vec3 p){ return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453); }
float noise(vec3 p){
 vec3 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
 return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);
}
float field(vec3 p){ return noise(p*1.65+vec3(uTime*.041,uSeed,uTime*.027))*.75+noise(p*3.1+vec3(uSeed,-uTime*.022,0.0))*.25; }
void main(){
 vec3 p=position;
 float n=field(p);
 float e=.04;
 vec3 gradient=vec3(field(p+vec3(e,0,0))-n,field(p+vec3(0,e,0))-n,field(p+vec3(0,0,e))-n)/e;
 vec3 deformed=p+normal*(n-.45)*.48;
 vec3 corrected=normalize(normal-.35*(gradient-normal*dot(gradient,normal)));
 vec4 world=modelMatrix*vec4(deformed,1.0);
 vPosition=world.xyz;
 vNormal=normalize(mat3(modelMatrix)*corrected);
 gl_Position=projectionMatrix*viewMatrix*world;
}`;
const fragmentShader = `
uniform float uTime;
uniform float uSeed;
varying vec3 vNormal;
varying vec3 vPosition;
void main(){
 vec3 n=normalize(vNormal), view=normalize(cameraPosition-vPosition);
 float facing=abs(dot(n,view));
 float rim=pow(1.0-facing,2.7);
 vec3 reflected=reflect(-view,n);
 float shine=pow(max(0.0,dot(reflected,normalize(vec3(-.6,.8,1.0)))),34.0);
 float windowLight=smoothstep(.58,.78,reflected.y)*(1.0-smoothstep(.86,.97,reflected.y));
 float tint=clamp(.5+.38*n.x+.2*sin(n.y*3.0+uSeed+uTime*.014),0.0,1.0);
 vec3 pastel=mix(vec3(.53,.70,.93),vec3(.93,.57,.76),tint);
 vec3 color=mix(vec3(.96,.98,1.0),pastel,.45+rim*.45);
 color+=vec3(1.0)*shine*.65+vec3(.25)*windowLight;
 gl_FragColor=vec4(color,clamp(.12+rim*.62+shine*.23+windowLight*.08,.0,.8));
}`;

export default function LiquidGlassBackground() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let disposed = false;
    let release: (() => void) | undefined;
    const timer = window.setTimeout(async () => {
      const THREE = await import("three").catch(() => null);
      if (!THREE) { if (host.current) host.current.dataset.renderer = "fallback"; return; }
      if (disposed || !host.current) return;
      const target = host.current;
      let renderer: import("three").WebGLRenderer;
      try {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("webgl2", { alpha: true, antialias: true, powerPreference: "low-power" });
        if (!context) { target.dataset.renderer = "fallback"; return; }
        renderer = new THREE.WebGLRenderer({ canvas, context, alpha: true, antialias: true, powerPreference: "low-power" });
      }
      catch { target.dataset.renderer = "fallback"; return; }
      const mobile = window.innerWidth < 768;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(36, window.innerWidth/window.innerHeight, .1, 40);
      camera.position.z = 9;
      renderer.setClearColor(0xffffff, 0);
      target.appendChild(renderer.domElement);
      target.dataset.renderer = "webgl";
      const seeds = [1.2,4.7,8.3];
      const meshes = seeds.slice(0,mobile?2:3).map((seed,index) => {
        const geometry = new THREE.IcosahedronGeometry(1,mobile?8:16);
        const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, transparent:true, depthWrite:false, uniforms:{uTime:{value:0},uSeed:{value:seed}} });
        const mesh = new THREE.Mesh(geometry,material);
        mesh.scale.set(index===0?1.8:1.25,index===0?1.3:1.0,.85);
        scene.add(mesh);return mesh;
      });
      const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
      let frame = 0, previous = 0, elapsed = 0, lost = false;
      renderer.debug.onShaderError = () => { lost=true;cancelAnimationFrame(frame);target.dataset.renderer="fallback";renderer.domElement.style.display="none"; };
      const pointer = new THREE.Vector2();
      const smoothed = new THREE.Vector2();
      const resize = () => { camera.aspect=window.innerWidth/window.innerHeight;camera.updateProjectionMatrix();renderer.setPixelRatio(Math.min(window.devicePixelRatio,window.innerWidth<768?1:1.5));renderer.setSize(window.innerWidth,window.innerHeight); };
      const draw = (timestamp:number) => {
        if (disposed || lost || document.hidden) return;
        const interval=window.innerWidth<768?1000/24:1000/30;
        if (timestamp-previous>=interval || !previous) {
          elapsed+=previous?Math.min((timestamp-previous)/1000,.1):0;previous=timestamp;
          smoothed.lerp(pointer,.025);
          const height=2*Math.tan(THREE.MathUtils.degToRad(18))*9, width=height*camera.aspect;
          meshes.forEach((mesh,index) => {
            const seed=seeds[index];
            mesh.material.uniforms.uTime.value=elapsed;
            mesh.position.set((index===0?.43:index===1?-.4:.02)*width+Math.sin(elapsed*.043+seed)*.12+smoothed.x*.08,(index===0?.23:index===1?-.31:-.05)*height+Math.sin(elapsed*.067+seed)*.17+Math.sin(elapsed*.031+seed)*.09+smoothed.y*.06,index===2?-2:0);
            mesh.rotation.set(Math.sin(elapsed*.021+seed)*.25,elapsed*.012+seed,Math.cos(elapsed*.032+seed)*.18);
            mesh.visible=!(window.innerWidth<768&&index===2);
          });
          try { renderer.render(scene,camera); } catch { lost=true;target.dataset.renderer="fallback";renderer.domElement.style.display="none";return; }
        }
        if (!motion.matches) frame=requestAnimationFrame(draw);
      };
      const resume = () => { cancelAnimationFrame(frame);previous=0;if(!document.hidden&&!lost)frame=requestAnimationFrame(draw); };
      const onResize = () => { resize();resume(); };
      const onPointer = (event:PointerEvent) => { if(window.innerWidth>=768&&!motion.matches)pointer.set(event.clientX/window.innerWidth-.5,.5-event.clientY/window.innerHeight); };
      const onLost = (event:Event) => { event.preventDefault();lost=true;cancelAnimationFrame(frame);target.dataset.renderer="fallback";renderer.domElement.style.display="none"; };
      resize();resume();
      window.addEventListener("resize",onResize);window.addEventListener("pointermove",onPointer,{passive:true});document.addEventListener("visibilitychange",resume);motion.addEventListener("change",resume);renderer.domElement.addEventListener("webglcontextlost",onLost);
      release=()=>{cancelAnimationFrame(frame);window.removeEventListener("resize",onResize);window.removeEventListener("pointermove",onPointer);document.removeEventListener("visibilitychange",resume);motion.removeEventListener("change",resume);renderer.domElement.removeEventListener("webglcontextlost",onLost);meshes.forEach(mesh=>{mesh.geometry.dispose();mesh.material.dispose();});renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();};
    },120);
    return () => { disposed=true;clearTimeout(timer);release?.(); };
  },[]);
  return <div ref={host} className="knowledge-glass" aria-hidden="true" />;
}
