var vu=Object.defineProperty,xu=Object.defineProperties;var Mu=Object.getOwnPropertyDescriptors;var oo=Object.getOwnPropertySymbols;var Su=Object.prototype.hasOwnProperty,Eu=Object.prototype.propertyIsEnumerable;var As=Math.pow,lo=(r,t,e)=>t in r?vu(r,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[t]=e,bs=(r,t)=>{for(var e in t||(t={}))Su.call(t,e)&&lo(r,e,t[e]);if(oo)for(var e of oo(t))Eu.call(t,e)&&lo(r,e,t[e]);return r},co=(r,t)=>xu(r,Mu(t));var uo=(r,t,e)=>new Promise((n,i)=>{var s=l=>{try{a(e.next(l))}catch(c){i(c)}},o=l=>{try{a(e.throw(l))}catch(c){i(c)}},a=l=>l.done?n(l.value):Promise.resolve(l.value).then(s,o);a((e=e.apply(r,t)).next())});/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Ca="160";const rn="",Me="srgb",Rn="srgb-linear",Pa="display-p3",ps="display-p3-linear",is="linear",$t="srgb",rs="rec709",ss="p3";const ho="300 es";class Ki{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const i=this._listeners[t];if(i!==void 0){const s=i.indexOf(e);s!==-1&&i.splice(s,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const i=n.slice(0);for(let s=0,o=i.length;s<o;s++)i[s].call(this,t);t.target=null}}}const ye=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],ws=Math.PI/180,fa=180/Math.PI;function Er(){const r=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(ye[r&255]+ye[r>>8&255]+ye[r>>16&255]+ye[r>>24&255]+"-"+ye[t&255]+ye[t>>8&255]+"-"+ye[t>>16&15|64]+ye[t>>24&255]+"-"+ye[e&63|128]+ye[e>>8&255]+"-"+ye[e>>16&255]+ye[e>>24&255]+ye[n&255]+ye[n>>8&255]+ye[n>>16&255]+ye[n>>24&255]).toLowerCase()}function Ne(r,t,e){return Math.max(t,Math.min(e,r))}function Tu(r,t){return(r%t+t)%t}function Rs(r,t,e){return(1-e)*r+e*t}function fo(r){return(r&r-1)===0&&r!==0}function da(r){return Math.pow(2,Math.floor(Math.log(r)/Math.LN2))}function Ji(r,t){switch(t.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("Invalid component type.")}}function Fe(r,t){switch(t.constructor){case Float32Array:return r;case Uint32Array:return Math.round(r*4294967295);case Uint16Array:return Math.round(r*65535);case Uint8Array:return Math.round(r*255);case Int32Array:return Math.round(r*2147483647);case Int16Array:return Math.round(r*32767);case Int8Array:return Math.round(r*127);default:throw new Error("Invalid component type.")}}class Vt{constructor(t=0,e=0){Vt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Ne(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),i=Math.sin(e),s=this.x-t.x,o=this.y-t.y;return this.x=s*n-o*i+t.x,this.y=s*i+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ot{constructor(t,e,n,i,s,o,a,l,c){Ot.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,s,o,a,l,c)}set(t,e,n,i,s,o,a,l,c){const u=this.elements;return u[0]=t,u[1]=i,u[2]=a,u[3]=e,u[4]=s,u[5]=l,u[6]=n,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,s=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],u=n[4],h=n[7],f=n[2],m=n[5],g=n[8],_=i[0],p=i[3],d=i[6],M=i[1],x=i[4],E=i[7],R=i[2],w=i[5],A=i[8];return s[0]=o*_+a*M+l*R,s[3]=o*p+a*x+l*w,s[6]=o*d+a*E+l*A,s[1]=c*_+u*M+h*R,s[4]=c*p+u*x+h*w,s[7]=c*d+u*E+h*A,s[2]=f*_+m*M+g*R,s[5]=f*p+m*x+g*w,s[8]=f*d+m*E+g*A,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],i=t[2],s=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8];return e*o*u-e*a*c-n*s*u+n*a*l+i*s*c-i*o*l}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],s=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8],h=u*o-a*c,f=a*l-u*s,m=c*s-o*l,g=e*h+n*f+i*m;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return t[0]=h*_,t[1]=(i*c-u*n)*_,t[2]=(a*n-i*o)*_,t[3]=f*_,t[4]=(u*e-i*l)*_,t[5]=(i*s-a*e)*_,t[6]=m*_,t[7]=(n*l-c*e)*_,t[8]=(o*e-n*s)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,s,o,a){const l=Math.cos(s),c=Math.sin(s);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-i*c,i*l,-i*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(Cs.makeScale(t,e)),this}rotate(t){return this.premultiply(Cs.makeRotation(-t)),this}translate(t,e){return this.premultiply(Cs.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Cs=new Ot;function Kl(r){for(let t=r.length-1;t>=0;--t)if(r[t]>=65535)return!0;return!1}function as(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function yu(){const r=as("canvas");return r.style.display="block",r}const po={};function cr(r){r in po||(po[r]=!0,console.warn(r))}const mo=new Ot().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),_o=new Ot().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Cr={[Rn]:{transfer:is,primaries:rs,toReference:r=>r,fromReference:r=>r},[Me]:{transfer:$t,primaries:rs,toReference:r=>r.convertSRGBToLinear(),fromReference:r=>r.convertLinearToSRGB()},[ps]:{transfer:is,primaries:ss,toReference:r=>r.applyMatrix3(_o),fromReference:r=>r.applyMatrix3(mo)},[Pa]:{transfer:$t,primaries:ss,toReference:r=>r.convertSRGBToLinear().applyMatrix3(_o),fromReference:r=>r.applyMatrix3(mo).convertLinearToSRGB()}},Au=new Set([Rn,ps]),Xt={enabled:!0,_workingColorSpace:Rn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(r){if(!Au.has(r))throw new Error(`Unsupported working color space, "${r}".`);this._workingColorSpace=r},convert:function(r,t,e){if(this.enabled===!1||t===e||!t||!e)return r;const n=Cr[t].toReference,i=Cr[e].fromReference;return i(n(r))},fromWorkingColorSpace:function(r,t){return this.convert(r,this._workingColorSpace,t)},toWorkingColorSpace:function(r,t){return this.convert(r,t,this._workingColorSpace)},getPrimaries:function(r){return Cr[r].primaries},getTransfer:function(r){return r===rn?is:Cr[r].transfer}};function Ni(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function Ps(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}let mi;class jl{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement=="undefined")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{mi===void 0&&(mi=as("canvas")),mi.width=t.width,mi.height=t.height;const n=mi.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=mi}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement!="undefined"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&t instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&t instanceof ImageBitmap){const e=as("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const i=n.getImageData(0,0,t.width,t.height),s=i.data;for(let o=0;o<s.length;o++)s[o]=Ni(s[o]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Ni(e[n]/255)*255):e[n]=Ni(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let bu=0;class Zl{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:bu++}),this.uuid=Er(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let s;if(Array.isArray(i)){s=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?s.push(Ls(i[o].image)):s.push(Ls(i[o]))}else s=Ls(i);n.url=s}return e||(t.images[this.uuid]=n),n}}function Ls(r){return typeof HTMLImageElement!="undefined"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&r instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&r instanceof ImageBitmap?jl.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let wu=0;class je extends Ki{constructor(t=je.DEFAULT_IMAGE,e=je.DEFAULT_MAPPING,n=1001,i=1001,s=1006,o=1008,a=1023,l=1009,c=je.DEFAULT_ANISOTROPY,u=rn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:wu++}),this.uuid=Er(),this.name="",this.source=new Zl(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Vt(0,0),this.repeat=new Vt(1,1),this.center=new Vt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ot,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof u=="string"?this.colorSpace=u:(cr("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=u===3001?Me:rn),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==300)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case 1e3:t.x=t.x-Math.floor(t.x);break;case 1001:t.x=t.x<0?0:1;break;case 1002:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case 1e3:t.y=t.y-Math.floor(t.y);break;case 1001:t.y=t.y<0?0:1;break;case 1002:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return cr("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Me?3001:3e3}set encoding(t){cr("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===3001?Me:rn}}je.DEFAULT_IMAGE=null;je.DEFAULT_MAPPING=300;je.DEFAULT_ANISOTROPY=1;class ve{constructor(t=0,e=0,n=0,i=1){ve.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,s=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*i+o[12]*s,this.y=o[1]*e+o[5]*n+o[9]*i+o[13]*s,this.z=o[2]*e+o[6]*n+o[10]*i+o[14]*s,this.w=o[3]*e+o[7]*n+o[11]*i+o[15]*s,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,s;const l=t.elements,c=l[0],u=l[4],h=l[8],f=l[1],m=l[5],g=l[9],_=l[2],p=l[6],d=l[10];if(Math.abs(u-f)<.01&&Math.abs(h-_)<.01&&Math.abs(g-p)<.01){if(Math.abs(u+f)<.1&&Math.abs(h+_)<.1&&Math.abs(g+p)<.1&&Math.abs(c+m+d-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const x=(c+1)/2,E=(m+1)/2,R=(d+1)/2,w=(u+f)/4,A=(h+_)/4,L=(g+p)/4;return x>E&&x>R?x<.01?(n=0,i=.707106781,s=.707106781):(n=Math.sqrt(x),i=w/n,s=A/n):E>R?E<.01?(n=.707106781,i=0,s=.707106781):(i=Math.sqrt(E),n=w/i,s=L/i):R<.01?(n=.707106781,i=.707106781,s=0):(s=Math.sqrt(R),n=A/s,i=L/s),this.set(n,i,s,e),this}let M=Math.sqrt((p-g)*(p-g)+(h-_)*(h-_)+(f-u)*(f-u));return Math.abs(M)<.001&&(M=1),this.x=(p-g)/M,this.y=(h-_)/M,this.z=(f-u)/M,this.w=Math.acos((c+m+d-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Ru extends Ki{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new ve(0,0,t,e),this.scissorTest=!1,this.viewport=new ve(0,0,t,e);const i={width:t,height:e,depth:1};n.encoding!==void 0&&(cr("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===3001?Me:rn),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:1006,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new je(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(t,e,n=1){(this.width!==t||this.height!==e||this.depth!==n)&&(this.width=t,this.height=e,this.depth=n,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Zl(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class fi extends Ru{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class $l extends je{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=1003,this.minFilter=1003,this.wrapR=1001,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Cu extends je{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=1003,this.minFilter=1003,this.wrapR=1001,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Tr{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,s,o,a){let l=n[i+0],c=n[i+1],u=n[i+2],h=n[i+3];const f=s[o+0],m=s[o+1],g=s[o+2],_=s[o+3];if(a===0){t[e+0]=l,t[e+1]=c,t[e+2]=u,t[e+3]=h;return}if(a===1){t[e+0]=f,t[e+1]=m,t[e+2]=g,t[e+3]=_;return}if(h!==_||l!==f||c!==m||u!==g){let p=1-a;const d=l*f+c*m+u*g+h*_,M=d>=0?1:-1,x=1-d*d;if(x>Number.EPSILON){const R=Math.sqrt(x),w=Math.atan2(R,d*M);p=Math.sin(p*w)/R,a=Math.sin(a*w)/R}const E=a*M;if(l=l*p+f*E,c=c*p+m*E,u=u*p+g*E,h=h*p+_*E,p===1-a){const R=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=R,c*=R,u*=R,h*=R}}t[e]=l,t[e+1]=c,t[e+2]=u,t[e+3]=h}static multiplyQuaternionsFlat(t,e,n,i,s,o){const a=n[i],l=n[i+1],c=n[i+2],u=n[i+3],h=s[o],f=s[o+1],m=s[o+2],g=s[o+3];return t[e]=a*g+u*h+l*m-c*f,t[e+1]=l*g+u*f+c*h-a*m,t[e+2]=c*g+u*m+a*f-l*h,t[e+3]=u*g-a*h-l*f-c*m,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,i=t._y,s=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),u=a(i/2),h=a(s/2),f=l(n/2),m=l(i/2),g=l(s/2);switch(o){case"XYZ":this._x=f*u*h+c*m*g,this._y=c*m*h-f*u*g,this._z=c*u*g+f*m*h,this._w=c*u*h-f*m*g;break;case"YXZ":this._x=f*u*h+c*m*g,this._y=c*m*h-f*u*g,this._z=c*u*g-f*m*h,this._w=c*u*h+f*m*g;break;case"ZXY":this._x=f*u*h-c*m*g,this._y=c*m*h+f*u*g,this._z=c*u*g+f*m*h,this._w=c*u*h-f*m*g;break;case"ZYX":this._x=f*u*h-c*m*g,this._y=c*m*h+f*u*g,this._z=c*u*g-f*m*h,this._w=c*u*h+f*m*g;break;case"YZX":this._x=f*u*h+c*m*g,this._y=c*m*h+f*u*g,this._z=c*u*g-f*m*h,this._w=c*u*h-f*m*g;break;case"XZY":this._x=f*u*h-c*m*g,this._y=c*m*h-f*u*g,this._z=c*u*g+f*m*h,this._w=c*u*h+f*m*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],i=e[4],s=e[8],o=e[1],a=e[5],l=e[9],c=e[2],u=e[6],h=e[10],f=n+a+h;if(f>0){const m=.5/Math.sqrt(f+1);this._w=.25/m,this._x=(u-l)*m,this._y=(s-c)*m,this._z=(o-i)*m}else if(n>a&&n>h){const m=2*Math.sqrt(1+n-a-h);this._w=(u-l)/m,this._x=.25*m,this._y=(i+o)/m,this._z=(s+c)/m}else if(a>h){const m=2*Math.sqrt(1+a-n-h);this._w=(s-c)/m,this._x=(i+o)/m,this._y=.25*m,this._z=(l+u)/m}else{const m=2*Math.sqrt(1+h-n-a);this._w=(o-i)/m,this._x=(s+c)/m,this._y=(l+u)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Ne(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,i=t._y,s=t._z,o=t._w,a=e._x,l=e._y,c=e._z,u=e._w;return this._x=n*u+o*a+i*c-s*l,this._y=i*u+o*l+s*a-n*c,this._z=s*u+o*c+n*l-i*a,this._w=o*u-n*a-i*l-s*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,i=this._y,s=this._z,o=this._w;let a=o*t._w+n*t._x+i*t._y+s*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=i,this._z=s,this;const l=1-a*a;if(l<=Number.EPSILON){const m=1-e;return this._w=m*o+e*this._w,this._x=m*n+e*this._x,this._y=m*i+e*this._y,this._z=m*s+e*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,a),h=Math.sin((1-e)*u)/c,f=Math.sin(e*u)/c;return this._w=o*h+this._w*f,this._x=n*h+this._x*f,this._y=i*h+this._y*f,this._z=s*h+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=Math.random(),e=Math.sqrt(1-t),n=Math.sqrt(t),i=2*Math.PI*Math.random(),s=2*Math.PI*Math.random();return this.set(e*Math.cos(i),n*Math.sin(s),n*Math.cos(s),e*Math.sin(i))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class N{constructor(t=0,e=0,n=0){N.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(go.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(go.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,i=this.z,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6]*i,this.y=s[1]*e+s[4]*n+s[7]*i,this.z=s[2]*e+s[5]*n+s[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,s=t.elements,o=1/(s[3]*e+s[7]*n+s[11]*i+s[15]);return this.x=(s[0]*e+s[4]*n+s[8]*i+s[12])*o,this.y=(s[1]*e+s[5]*n+s[9]*i+s[13])*o,this.z=(s[2]*e+s[6]*n+s[10]*i+s[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,i=this.z,s=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*i-a*n),u=2*(a*e-s*i),h=2*(s*n-o*e);return this.x=e+l*c+o*h-a*u,this.y=n+l*u+a*c-s*h,this.z=i+l*h+s*u-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,i=this.z,s=t.elements;return this.x=s[0]*e+s[4]*n+s[8]*i,this.y=s[1]*e+s[5]*n+s[9]*i,this.z=s[2]*e+s[6]*n+s[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,i=t.y,s=t.z,o=e.x,a=e.y,l=e.z;return this.x=i*l-s*a,this.y=s*o-n*l,this.z=n*a-i*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Ds.copy(this).projectOnVector(t),this.sub(Ds)}reflect(t){return this.sub(Ds.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Ne(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,n=Math.sqrt(1-As(t,2));return this.x=n*Math.cos(e),this.y=n*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Ds=new N,go=new Tr;class yr{constructor(t=new N(1/0,1/0,1/0),e=new N(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(on.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(on.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=on.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const s=n.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,on):on.fromBufferAttribute(s,o),on.applyMatrix4(t.matrixWorld),this.expandByPoint(on);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Pr.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Pr.copy(n.boundingBox)),Pr.applyMatrix4(t.matrixWorld),this.union(Pr)}const i=t.children;for(let s=0,o=i.length;s<o;s++)this.expandByObject(i[s],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,on),on.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Qi),Lr.subVectors(this.max,Qi),_i.subVectors(t.a,Qi),gi.subVectors(t.b,Qi),vi.subVectors(t.c,Qi),Ln.subVectors(gi,_i),Dn.subVectors(vi,gi),Kn.subVectors(_i,vi);let e=[0,-Ln.z,Ln.y,0,-Dn.z,Dn.y,0,-Kn.z,Kn.y,Ln.z,0,-Ln.x,Dn.z,0,-Dn.x,Kn.z,0,-Kn.x,-Ln.y,Ln.x,0,-Dn.y,Dn.x,0,-Kn.y,Kn.x,0];return!Is(e,_i,gi,vi,Lr)||(e=[1,0,0,0,1,0,0,0,1],!Is(e,_i,gi,vi,Lr))?!1:(Dr.crossVectors(Ln,Dn),e=[Dr.x,Dr.y,Dr.z],Is(e,_i,gi,vi,Lr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,on).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(on).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Sn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Sn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Sn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Sn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Sn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Sn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Sn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Sn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Sn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Sn=[new N,new N,new N,new N,new N,new N,new N,new N],on=new N,Pr=new yr,_i=new N,gi=new N,vi=new N,Ln=new N,Dn=new N,Kn=new N,Qi=new N,Lr=new N,Dr=new N,jn=new N;function Is(r,t,e,n,i){for(let s=0,o=r.length-3;s<=o;s+=3){jn.fromArray(r,s);const a=i.x*Math.abs(jn.x)+i.y*Math.abs(jn.y)+i.z*Math.abs(jn.z),l=t.dot(jn),c=e.dot(jn),u=n.dot(jn);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}const Pu=new yr,tr=new N,Us=new N;class La{constructor(t=new N,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Pu.setFromPoints(t).getCenter(n);let i=0;for(let s=0,o=t.length;s<o;s++)i=Math.max(i,n.distanceToSquared(t[s]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;tr.subVectors(t,this.center);const e=tr.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(tr,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Us.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(tr.copy(t.center).add(Us)),this.expandByPoint(tr.copy(t.center).sub(Us))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const En=new N,Fs=new N,Ir=new N,In=new N,Ns=new N,Ur=new N,Os=new N;class Lu{constructor(t=new N,e=new N(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,En)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=En.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(En.copy(this.origin).addScaledVector(this.direction,e),En.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){Fs.copy(t).add(e).multiplyScalar(.5),Ir.copy(e).sub(t).normalize(),In.copy(this.origin).sub(Fs);const s=t.distanceTo(e)*.5,o=-this.direction.dot(Ir),a=In.dot(this.direction),l=-In.dot(Ir),c=In.lengthSq(),u=Math.abs(1-o*o);let h,f,m,g;if(u>0)if(h=o*l-a,f=o*a-l,g=s*u,h>=0)if(f>=-g)if(f<=g){const _=1/u;h*=_,f*=_,m=h*(h+o*f+2*a)+f*(o*h+f+2*l)+c}else f=s,h=Math.max(0,-(o*f+a)),m=-h*h+f*(f+2*l)+c;else f=-s,h=Math.max(0,-(o*f+a)),m=-h*h+f*(f+2*l)+c;else f<=-g?(h=Math.max(0,-(-o*s+a)),f=h>0?-s:Math.min(Math.max(-s,-l),s),m=-h*h+f*(f+2*l)+c):f<=g?(h=0,f=Math.min(Math.max(-s,-l),s),m=f*(f+2*l)+c):(h=Math.max(0,-(o*s+a)),f=h>0?s:Math.min(Math.max(-s,-l),s),m=-h*h+f*(f+2*l)+c);else f=o>0?-s:s,h=Math.max(0,-(o*f+a)),m=-h*h+f*(f+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,h),i&&i.copy(Fs).addScaledVector(Ir,f),m}intersectSphere(t,e){En.subVectors(t.center,this.origin);const n=En.dot(this.direction),i=En.dot(En)-n*n,s=t.radius*t.radius;if(i>s)return null;const o=Math.sqrt(s-i),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,s,o,a,l;const c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,f=this.origin;return c>=0?(n=(t.min.x-f.x)*c,i=(t.max.x-f.x)*c):(n=(t.max.x-f.x)*c,i=(t.min.x-f.x)*c),u>=0?(s=(t.min.y-f.y)*u,o=(t.max.y-f.y)*u):(s=(t.max.y-f.y)*u,o=(t.min.y-f.y)*u),n>o||s>i||((s>n||isNaN(n))&&(n=s),(o<i||isNaN(i))&&(i=o),h>=0?(a=(t.min.z-f.z)*h,l=(t.max.z-f.z)*h):(a=(t.max.z-f.z)*h,l=(t.min.z-f.z)*h),n>l||a>i)||((a>n||n!==n)&&(n=a),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,En)!==null}intersectTriangle(t,e,n,i,s){Ns.subVectors(e,t),Ur.subVectors(n,t),Os.crossVectors(Ns,Ur);let o=this.direction.dot(Os),a;if(o>0){if(i)return null;a=1}else if(o<0)a=-1,o=-o;else return null;In.subVectors(this.origin,t);const l=a*this.direction.dot(Ur.crossVectors(In,Ur));if(l<0)return null;const c=a*this.direction.dot(Ns.cross(In));if(c<0||l+c>o)return null;const u=-a*In.dot(Os);return u<0?null:this.at(u/o,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class fe{constructor(t,e,n,i,s,o,a,l,c,u,h,f,m,g,_,p){fe.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,s,o,a,l,c,u,h,f,m,g,_,p)}set(t,e,n,i,s,o,a,l,c,u,h,f,m,g,_,p){const d=this.elements;return d[0]=t,d[4]=e,d[8]=n,d[12]=i,d[1]=s,d[5]=o,d[9]=a,d[13]=l,d[2]=c,d[6]=u,d[10]=h,d[14]=f,d[3]=m,d[7]=g,d[11]=_,d[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new fe().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,i=1/xi.setFromMatrixColumn(t,0).length(),s=1/xi.setFromMatrixColumn(t,1).length(),o=1/xi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*s,e[5]=n[5]*s,e[6]=n[6]*s,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,i=t.y,s=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(i),c=Math.sin(i),u=Math.cos(s),h=Math.sin(s);if(t.order==="XYZ"){const f=o*u,m=o*h,g=a*u,_=a*h;e[0]=l*u,e[4]=-l*h,e[8]=c,e[1]=m+g*c,e[5]=f-_*c,e[9]=-a*l,e[2]=_-f*c,e[6]=g+m*c,e[10]=o*l}else if(t.order==="YXZ"){const f=l*u,m=l*h,g=c*u,_=c*h;e[0]=f+_*a,e[4]=g*a-m,e[8]=o*c,e[1]=o*h,e[5]=o*u,e[9]=-a,e[2]=m*a-g,e[6]=_+f*a,e[10]=o*l}else if(t.order==="ZXY"){const f=l*u,m=l*h,g=c*u,_=c*h;e[0]=f-_*a,e[4]=-o*h,e[8]=g+m*a,e[1]=m+g*a,e[5]=o*u,e[9]=_-f*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){const f=o*u,m=o*h,g=a*u,_=a*h;e[0]=l*u,e[4]=g*c-m,e[8]=f*c+_,e[1]=l*h,e[5]=_*c+f,e[9]=m*c-g,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){const f=o*l,m=o*c,g=a*l,_=a*c;e[0]=l*u,e[4]=_-f*h,e[8]=g*h+m,e[1]=h,e[5]=o*u,e[9]=-a*u,e[2]=-c*u,e[6]=m*h+g,e[10]=f-_*h}else if(t.order==="XZY"){const f=o*l,m=o*c,g=a*l,_=a*c;e[0]=l*u,e[4]=-h,e[8]=c*u,e[1]=f*h+_,e[5]=o*u,e[9]=m*h-g,e[2]=g*h-m,e[6]=a*u,e[10]=_*h+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Du,t,Iu)}lookAt(t,e,n){const i=this.elements;return ke.subVectors(t,e),ke.lengthSq()===0&&(ke.z=1),ke.normalize(),Un.crossVectors(n,ke),Un.lengthSq()===0&&(Math.abs(n.z)===1?ke.x+=1e-4:ke.z+=1e-4,ke.normalize(),Un.crossVectors(n,ke)),Un.normalize(),Fr.crossVectors(ke,Un),i[0]=Un.x,i[4]=Fr.x,i[8]=ke.x,i[1]=Un.y,i[5]=Fr.y,i[9]=ke.y,i[2]=Un.z,i[6]=Fr.z,i[10]=ke.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,s=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],u=n[1],h=n[5],f=n[9],m=n[13],g=n[2],_=n[6],p=n[10],d=n[14],M=n[3],x=n[7],E=n[11],R=n[15],w=i[0],A=i[4],L=i[8],v=i[12],y=i[1],U=i[5],F=i[9],q=i[13],C=i[2],I=i[6],O=i[10],W=i[14],X=i[3],Y=i[7],j=i[11],tt=i[15];return s[0]=o*w+a*y+l*C+c*X,s[4]=o*A+a*U+l*I+c*Y,s[8]=o*L+a*F+l*O+c*j,s[12]=o*v+a*q+l*W+c*tt,s[1]=u*w+h*y+f*C+m*X,s[5]=u*A+h*U+f*I+m*Y,s[9]=u*L+h*F+f*O+m*j,s[13]=u*v+h*q+f*W+m*tt,s[2]=g*w+_*y+p*C+d*X,s[6]=g*A+_*U+p*I+d*Y,s[10]=g*L+_*F+p*O+d*j,s[14]=g*v+_*q+p*W+d*tt,s[3]=M*w+x*y+E*C+R*X,s[7]=M*A+x*U+E*I+R*Y,s[11]=M*L+x*F+E*O+R*j,s[15]=M*v+x*q+E*W+R*tt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],i=t[8],s=t[12],o=t[1],a=t[5],l=t[9],c=t[13],u=t[2],h=t[6],f=t[10],m=t[14],g=t[3],_=t[7],p=t[11],d=t[15];return g*(+s*l*h-i*c*h-s*a*f+n*c*f+i*a*m-n*l*m)+_*(+e*l*m-e*c*f+s*o*f-i*o*m+i*c*u-s*l*u)+p*(+e*c*h-e*a*m-s*o*h+n*o*m+s*a*u-n*c*u)+d*(-i*a*u-e*l*h+e*a*f+i*o*h-n*o*f+n*l*u)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],s=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8],h=t[9],f=t[10],m=t[11],g=t[12],_=t[13],p=t[14],d=t[15],M=h*p*c-_*f*c+_*l*m-a*p*m-h*l*d+a*f*d,x=g*f*c-u*p*c-g*l*m+o*p*m+u*l*d-o*f*d,E=u*_*c-g*h*c+g*a*m-o*_*m-u*a*d+o*h*d,R=g*h*l-u*_*l-g*a*f+o*_*f+u*a*p-o*h*p,w=e*M+n*x+i*E+s*R;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/w;return t[0]=M*A,t[1]=(_*f*s-h*p*s-_*i*m+n*p*m+h*i*d-n*f*d)*A,t[2]=(a*p*s-_*l*s+_*i*c-n*p*c-a*i*d+n*l*d)*A,t[3]=(h*l*s-a*f*s-h*i*c+n*f*c+a*i*m-n*l*m)*A,t[4]=x*A,t[5]=(u*p*s-g*f*s+g*i*m-e*p*m-u*i*d+e*f*d)*A,t[6]=(g*l*s-o*p*s-g*i*c+e*p*c+o*i*d-e*l*d)*A,t[7]=(o*f*s-u*l*s+u*i*c-e*f*c-o*i*m+e*l*m)*A,t[8]=E*A,t[9]=(g*h*s-u*_*s-g*n*m+e*_*m+u*n*d-e*h*d)*A,t[10]=(o*_*s-g*a*s+g*n*c-e*_*c-o*n*d+e*a*d)*A,t[11]=(u*a*s-o*h*s-u*n*c+e*h*c+o*n*m-e*a*m)*A,t[12]=R*A,t[13]=(u*_*i-g*h*i+g*n*f-e*_*f-u*n*p+e*h*p)*A,t[14]=(g*a*i-o*_*i-g*n*l+e*_*l+o*n*p-e*a*p)*A,t[15]=(o*h*i-u*a*i+u*n*l-e*h*l-o*n*f+e*a*f)*A,this}scale(t){const e=this.elements,n=t.x,i=t.y,s=t.z;return e[0]*=n,e[4]*=i,e[8]*=s,e[1]*=n,e[5]*=i,e[9]*=s,e[2]*=n,e[6]*=i,e[10]*=s,e[3]*=n,e[7]*=i,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),i=Math.sin(e),s=1-n,o=t.x,a=t.y,l=t.z,c=s*o,u=s*a;return this.set(c*o+n,c*a-i*l,c*l+i*a,0,c*a+i*l,u*a+n,u*l-i*o,0,c*l-i*a,u*l+i*o,s*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,s,o){return this.set(1,n,s,0,t,1,o,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){const i=this.elements,s=e._x,o=e._y,a=e._z,l=e._w,c=s+s,u=o+o,h=a+a,f=s*c,m=s*u,g=s*h,_=o*u,p=o*h,d=a*h,M=l*c,x=l*u,E=l*h,R=n.x,w=n.y,A=n.z;return i[0]=(1-(_+d))*R,i[1]=(m+E)*R,i[2]=(g-x)*R,i[3]=0,i[4]=(m-E)*w,i[5]=(1-(f+d))*w,i[6]=(p+M)*w,i[7]=0,i[8]=(g+x)*A,i[9]=(p-M)*A,i[10]=(1-(f+_))*A,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){const i=this.elements;let s=xi.set(i[0],i[1],i[2]).length();const o=xi.set(i[4],i[5],i[6]).length(),a=xi.set(i[8],i[9],i[10]).length();this.determinant()<0&&(s=-s),t.x=i[12],t.y=i[13],t.z=i[14],ln.copy(this);const c=1/s,u=1/o,h=1/a;return ln.elements[0]*=c,ln.elements[1]*=c,ln.elements[2]*=c,ln.elements[4]*=u,ln.elements[5]*=u,ln.elements[6]*=u,ln.elements[8]*=h,ln.elements[9]*=h,ln.elements[10]*=h,e.setFromRotationMatrix(ln),n.x=s,n.y=o,n.z=a,this}makePerspective(t,e,n,i,s,o,a=2e3){const l=this.elements,c=2*s/(e-t),u=2*s/(n-i),h=(e+t)/(e-t),f=(n+i)/(n-i);let m,g;if(a===2e3)m=-(o+s)/(o-s),g=-2*o*s/(o-s);else if(a===2001)m=-o/(o-s),g=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=u,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,i,s,o,a=2e3){const l=this.elements,c=1/(e-t),u=1/(n-i),h=1/(o-s),f=(e+t)*c,m=(n+i)*u;let g,_;if(a===2e3)g=(o+s)*h,_=-2*h;else if(a===2001)g=s*h,_=-1*h;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-f,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-m,l[2]=0,l[6]=0,l[10]=_,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const xi=new N,ln=new fe,Du=new N(0,0,0),Iu=new N(1,1,1),Un=new N,Fr=new N,ke=new N,vo=new fe,xo=new Tr;class ms{constructor(t=0,e=0,n=0,i=ms.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const i=t.elements,s=i[0],o=i[4],a=i[8],l=i[1],c=i[5],u=i[9],h=i[2],f=i[6],m=i[10];switch(e){case"XYZ":this._y=Math.asin(Ne(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,m),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ne(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,s),this._z=0);break;case"ZXY":this._x=Math.asin(Ne(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-h,m),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-Ne(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(f,m),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Ne(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,s)):(this._x=0,this._y=Math.atan2(a,m));break;case"XZY":this._z=Math.asin(-Ne(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-u,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return vo.makeRotationFromQuaternion(t),this.setFromRotationMatrix(vo,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return xo.setFromEuler(this),this.setFromQuaternion(xo,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}ms.DEFAULT_ORDER="XYZ";class Jl{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Uu=0;const Mo=new N,Mi=new Tr,Tn=new fe,Nr=new N,er=new N,Fu=new N,Nu=new Tr,So=new N(1,0,0),Eo=new N(0,1,0),To=new N(0,0,1),Ou={type:"added"},Bu={type:"removed"};class we extends Ki{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Uu++}),this.uuid=Er(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=we.DEFAULT_UP.clone();const t=new N,e=new ms,n=new Tr,i=new N(1,1,1);function s(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(s),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new fe},normalMatrix:{value:new Ot}}),this.matrix=new fe,this.matrixWorld=new fe,this.matrixAutoUpdate=we.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=we.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Jl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Mi.setFromAxisAngle(t,e),this.quaternion.multiply(Mi),this}rotateOnWorldAxis(t,e){return Mi.setFromAxisAngle(t,e),this.quaternion.premultiply(Mi),this}rotateX(t){return this.rotateOnAxis(So,t)}rotateY(t){return this.rotateOnAxis(Eo,t)}rotateZ(t){return this.rotateOnAxis(To,t)}translateOnAxis(t,e){return Mo.copy(t).applyQuaternion(this.quaternion),this.position.add(Mo.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(So,t)}translateY(t){return this.translateOnAxis(Eo,t)}translateZ(t){return this.translateOnAxis(To,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Tn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Nr.copy(t):Nr.set(t,e,n);const i=this.parent;this.updateWorldMatrix(!0,!1),er.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Tn.lookAt(er,Nr,this.up):Tn.lookAt(Nr,er,this.up),this.quaternion.setFromRotationMatrix(Tn),i&&(Tn.extractRotation(i.matrixWorld),Mi.setFromRotationMatrix(Tn),this.quaternion.premultiply(Mi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(Ou)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Bu)),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Tn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Tn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Tn),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const i=this.children;for(let s=0,o=i.length;s<o;s++)i[s].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(er,t,Fu),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(er,Nu,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,i=e.length;n<i;n++){const s=e[n];(s.matrixWorldAutoUpdate===!0||t===!0)&&s.updateMatrixWorld(t)}}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){const i=this.children;for(let s=0,o=i.length;s<o;s++){const a=i[s];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),i.maxGeometryCount=this._maxGeometryCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=s(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const h=l[c];s(t.shapes,h)}else s(t.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(s(t.materials,this.material[l]));i.material=a}else i.material=s(t.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];i.animations.push(s(t.animations,l))}}if(e){const a=o(t.geometries),l=o(t.materials),c=o(t.textures),u=o(t.images),h=o(t.shapes),f=o(t.skeletons),m=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),h.length>0&&(n.shapes=h),f.length>0&&(n.skeletons=f),m.length>0&&(n.animations=m),g.length>0&&(n.nodes=g)}return n.object=i,n;function o(a){const l=[];for(const c in a){const u=a[c];delete u.metadata,l.push(u)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const i=t.children[n];this.add(i.clone())}return this}}we.DEFAULT_UP=new N(0,1,0);we.DEFAULT_MATRIX_AUTO_UPDATE=!0;we.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const cn=new N,yn=new N,Bs=new N,An=new N,Si=new N,Ei=new N,yo=new N,Gs=new N,zs=new N,Vs=new N;let Or=!1;class hn{constructor(t=new N,e=new N,n=new N){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),cn.subVectors(t,e),i.cross(cn);const s=i.lengthSq();return s>0?i.multiplyScalar(1/Math.sqrt(s)):i.set(0,0,0)}static getBarycoord(t,e,n,i,s){cn.subVectors(i,e),yn.subVectors(n,e),Bs.subVectors(t,e);const o=cn.dot(cn),a=cn.dot(yn),l=cn.dot(Bs),c=yn.dot(yn),u=yn.dot(Bs),h=o*c-a*a;if(h===0)return s.set(0,0,0),null;const f=1/h,m=(c*l-a*u)*f,g=(o*u-a*l)*f;return s.set(1-m-g,g,m)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,An)===null?!1:An.x>=0&&An.y>=0&&An.x+An.y<=1}static getUV(t,e,n,i,s,o,a,l){return Or===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Or=!0),this.getInterpolation(t,e,n,i,s,o,a,l)}static getInterpolation(t,e,n,i,s,o,a,l){return this.getBarycoord(t,e,n,i,An)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,An.x),l.addScaledVector(o,An.y),l.addScaledVector(a,An.z),l)}static isFrontFacing(t,e,n,i){return cn.subVectors(n,e),yn.subVectors(t,e),cn.cross(yn).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return cn.subVectors(this.c,this.b),yn.subVectors(this.a,this.b),cn.cross(yn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return hn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return hn.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,n,i,s){return Or===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Or=!0),hn.getInterpolation(t,this.a,this.b,this.c,e,n,i,s)}getInterpolation(t,e,n,i,s){return hn.getInterpolation(t,this.a,this.b,this.c,e,n,i,s)}containsPoint(t){return hn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return hn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,i=this.b,s=this.c;let o,a;Si.subVectors(i,n),Ei.subVectors(s,n),Gs.subVectors(t,n);const l=Si.dot(Gs),c=Ei.dot(Gs);if(l<=0&&c<=0)return e.copy(n);zs.subVectors(t,i);const u=Si.dot(zs),h=Ei.dot(zs);if(u>=0&&h<=u)return e.copy(i);const f=l*h-u*c;if(f<=0&&l>=0&&u<=0)return o=l/(l-u),e.copy(n).addScaledVector(Si,o);Vs.subVectors(t,s);const m=Si.dot(Vs),g=Ei.dot(Vs);if(g>=0&&m<=g)return e.copy(s);const _=m*c-l*g;if(_<=0&&c>=0&&g<=0)return a=c/(c-g),e.copy(n).addScaledVector(Ei,a);const p=u*g-m*h;if(p<=0&&h-u>=0&&m-g>=0)return yo.subVectors(s,i),a=(h-u)/(h-u+(m-g)),e.copy(i).addScaledVector(yo,a);const d=1/(p+_+f);return o=_*d,a=f*d,e.copy(n).addScaledVector(Si,o).addScaledVector(Ei,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Ql={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Fn={h:0,s:0,l:0},Br={h:0,s:0,l:0};function Hs(r,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?r+(t-r)*6*e:e<1/2?t:e<2/3?r+(t-r)*6*(2/3-e):r}class Ht{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Me){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Xt.toWorkingColorSpace(this,e),this}setRGB(t,e,n,i=Xt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Xt.toWorkingColorSpace(this,i),this}setHSL(t,e,n,i=Xt.workingColorSpace){if(t=Tu(t,1),e=Ne(e,0,1),n=Ne(n,0,1),e===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+e):n+e-n*e,o=2*n-s;this.r=Hs(o,s,t+1/3),this.g=Hs(o,s,t),this.b=Hs(o,s,t-1/3)}return Xt.toWorkingColorSpace(this,i),this}setStyle(t,e=Me){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=i[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Me){const n=Ql[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Ni(t.r),this.g=Ni(t.g),this.b=Ni(t.b),this}copyLinearToSRGB(t){return this.r=Ps(t.r),this.g=Ps(t.g),this.b=Ps(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Me){return Xt.fromWorkingColorSpace(Ae.copy(this),t),Math.round(Ne(Ae.r*255,0,255))*65536+Math.round(Ne(Ae.g*255,0,255))*256+Math.round(Ne(Ae.b*255,0,255))}getHexString(t=Me){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Xt.workingColorSpace){Xt.fromWorkingColorSpace(Ae.copy(this),e);const n=Ae.r,i=Ae.g,s=Ae.b,o=Math.max(n,i,s),a=Math.min(n,i,s);let l,c;const u=(a+o)/2;if(a===o)l=0,c=0;else{const h=o-a;switch(c=u<=.5?h/(o+a):h/(2-o-a),o){case n:l=(i-s)/h+(i<s?6:0);break;case i:l=(s-n)/h+2;break;case s:l=(n-i)/h+4;break}l/=6}return t.h=l,t.s=c,t.l=u,t}getRGB(t,e=Xt.workingColorSpace){return Xt.fromWorkingColorSpace(Ae.copy(this),e),t.r=Ae.r,t.g=Ae.g,t.b=Ae.b,t}getStyle(t=Me){Xt.fromWorkingColorSpace(Ae.copy(this),t);const e=Ae.r,n=Ae.g,i=Ae.b;return t!==Me?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(Fn),this.setHSL(Fn.h+t,Fn.s+e,Fn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Fn),t.getHSL(Br);const n=Rs(Fn.h,Br.h,e),i=Rs(Fn.s,Br.s,e),s=Rs(Fn.l,Br.l,e);return this.setHSL(n,i,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,i=this.b,s=t.elements;return this.r=s[0]*e+s[3]*n+s[6]*i,this.g=s[1]*e+s[4]*n+s[7]*i,this.b=s[2]*e+s[5]*n+s[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ae=new Ht;Ht.NAMES=Ql;let Gu=0;class Ar extends Ki{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Gu++}),this.uuid=Er(),this.name="",this.type="Material",this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ht(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=7680,this.stencilZFail=7680,this.stencilZPass=7680,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const i=this[e];if(i===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==1&&(n.blending=this.blending),this.side!==0&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==204&&(n.blendSrc=this.blendSrc),this.blendDst!==205&&(n.blendDst=this.blendDst),this.blendEquation!==100&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==3&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==519&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==7680&&(n.stencilFail=this.stencilFail),this.stencilZFail!==7680&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==7680&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(s){const o=[];for(const a in s){const l=s[a];delete l.metadata,o.push(l)}return o}if(e){const s=i(t.textures),o=i(t.images);s.length>0&&(n.textures=s),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const i=e.length;n=new Array(i);for(let s=0;s!==i;++s)n[s]=e[s].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class Oi extends Ar{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ht(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const ue=new N,Gr=new Vt;class gn{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=35044,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=1015,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,s=this.itemSize;i<s;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Gr.fromBufferAttribute(this,e),Gr.applyMatrix3(t),this.setXY(e,Gr.x,Gr.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)ue.fromBufferAttribute(this,e),ue.applyMatrix3(t),this.setXYZ(e,ue.x,ue.y,ue.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)ue.fromBufferAttribute(this,e),ue.applyMatrix4(t),this.setXYZ(e,ue.x,ue.y,ue.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)ue.fromBufferAttribute(this,e),ue.applyNormalMatrix(t),this.setXYZ(e,ue.x,ue.y,ue.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)ue.fromBufferAttribute(this,e),ue.transformDirection(t),this.setXYZ(e,ue.x,ue.y,ue.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Ji(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Fe(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Ji(e,this.array)),e}setX(t,e){return this.normalized&&(e=Fe(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Ji(e,this.array)),e}setY(t,e){return this.normalized&&(e=Fe(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Ji(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Fe(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Ji(e,this.array)),e}setW(t,e){return this.normalized&&(e=Fe(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Fe(e,this.array),n=Fe(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=Fe(e,this.array),n=Fe(n,this.array),i=Fe(i,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,s){return t*=this.itemSize,this.normalized&&(e=Fe(e,this.array),n=Fe(n,this.array),i=Fe(i,this.array),s=Fe(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==35044&&(t.usage=this.usage),t}}class tc extends gn{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class ec extends gn{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class Re extends gn{constructor(t,e,n){super(new Float32Array(t),e,n)}}let zu=0;const tn=new fe,ks=new we,Ti=new N,We=new yr,nr=new yr,ge=new N;class xn extends Ki{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:zu++}),this.uuid=Er(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Kl(t)?ec:tc)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new Ot().getNormalMatrix(t);n.applyNormalMatrix(s),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return tn.makeRotationFromQuaternion(t),this.applyMatrix4(tn),this}rotateX(t){return tn.makeRotationX(t),this.applyMatrix4(tn),this}rotateY(t){return tn.makeRotationY(t),this.applyMatrix4(tn),this}rotateZ(t){return tn.makeRotationZ(t),this.applyMatrix4(tn),this}translate(t,e,n){return tn.makeTranslation(t,e,n),this.applyMatrix4(tn),this}scale(t,e,n){return tn.makeScale(t,e,n),this.applyMatrix4(tn),this}lookAt(t){return ks.lookAt(t),ks.updateMatrix(),this.applyMatrix4(ks.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ti).negate(),this.translate(Ti.x,Ti.y,Ti.z),this}setFromPoints(t){const e=[];for(let n=0,i=t.length;n<i;n++){const s=t[n];e.push(s.x,s.y,s.z||0)}return this.setAttribute("position",new Re(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new yr);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new N(-1/0,-1/0,-1/0),new N(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){const s=e[n];We.setFromBufferAttribute(s),this.morphTargetsRelative?(ge.addVectors(this.boundingBox.min,We.min),this.boundingBox.expandByPoint(ge),ge.addVectors(this.boundingBox.max,We.max),this.boundingBox.expandByPoint(ge)):(this.boundingBox.expandByPoint(We.min),this.boundingBox.expandByPoint(We.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new La);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new N,1/0);return}if(t){const n=this.boundingSphere.center;if(We.setFromBufferAttribute(t),e)for(let s=0,o=e.length;s<o;s++){const a=e[s];nr.setFromBufferAttribute(a),this.morphTargetsRelative?(ge.addVectors(We.min,nr.min),We.expandByPoint(ge),ge.addVectors(We.max,nr.max),We.expandByPoint(ge)):(We.expandByPoint(nr.min),We.expandByPoint(nr.max))}We.getCenter(n);let i=0;for(let s=0,o=t.count;s<o;s++)ge.fromBufferAttribute(t,s),i=Math.max(i,n.distanceToSquared(ge));if(e)for(let s=0,o=e.length;s<o;s++){const a=e[s],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)ge.fromBufferAttribute(a,c),l&&(Ti.fromBufferAttribute(t,c),ge.add(Ti)),i=Math.max(i,n.distanceToSquared(ge))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.array,i=e.position.array,s=e.normal.array,o=e.uv.array,a=i.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new gn(new Float32Array(4*a),4));const l=this.getAttribute("tangent").array,c=[],u=[];for(let y=0;y<a;y++)c[y]=new N,u[y]=new N;const h=new N,f=new N,m=new N,g=new Vt,_=new Vt,p=new Vt,d=new N,M=new N;function x(y,U,F){h.fromArray(i,y*3),f.fromArray(i,U*3),m.fromArray(i,F*3),g.fromArray(o,y*2),_.fromArray(o,U*2),p.fromArray(o,F*2),f.sub(h),m.sub(h),_.sub(g),p.sub(g);const q=1/(_.x*p.y-p.x*_.y);isFinite(q)&&(d.copy(f).multiplyScalar(p.y).addScaledVector(m,-_.y).multiplyScalar(q),M.copy(m).multiplyScalar(_.x).addScaledVector(f,-p.x).multiplyScalar(q),c[y].add(d),c[U].add(d),c[F].add(d),u[y].add(M),u[U].add(M),u[F].add(M))}let E=this.groups;E.length===0&&(E=[{start:0,count:n.length}]);for(let y=0,U=E.length;y<U;++y){const F=E[y],q=F.start,C=F.count;for(let I=q,O=q+C;I<O;I+=3)x(n[I+0],n[I+1],n[I+2])}const R=new N,w=new N,A=new N,L=new N;function v(y){A.fromArray(s,y*3),L.copy(A);const U=c[y];R.copy(U),R.sub(A.multiplyScalar(A.dot(U))).normalize(),w.crossVectors(L,U);const q=w.dot(u[y])<0?-1:1;l[y*4]=R.x,l[y*4+1]=R.y,l[y*4+2]=R.z,l[y*4+3]=q}for(let y=0,U=E.length;y<U;++y){const F=E[y],q=F.start,C=F.count;for(let I=q,O=q+C;I<O;I+=3)v(n[I+0]),v(n[I+1]),v(n[I+2])}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new gn(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let f=0,m=n.count;f<m;f++)n.setXYZ(f,0,0,0);const i=new N,s=new N,o=new N,a=new N,l=new N,c=new N,u=new N,h=new N;if(t)for(let f=0,m=t.count;f<m;f+=3){const g=t.getX(f+0),_=t.getX(f+1),p=t.getX(f+2);i.fromBufferAttribute(e,g),s.fromBufferAttribute(e,_),o.fromBufferAttribute(e,p),u.subVectors(o,s),h.subVectors(i,s),u.cross(h),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,p),a.add(u),l.add(u),c.add(u),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(p,c.x,c.y,c.z)}else for(let f=0,m=e.count;f<m;f+=3)i.fromBufferAttribute(e,f+0),s.fromBufferAttribute(e,f+1),o.fromBufferAttribute(e,f+2),u.subVectors(o,s),h.subVectors(i,s),u.cross(h),n.setXYZ(f+0,u.x,u.y,u.z),n.setXYZ(f+1,u.x,u.y,u.z),n.setXYZ(f+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)ge.fromBufferAttribute(t,e),ge.normalize(),t.setXYZ(e,ge.x,ge.y,ge.z)}toNonIndexed(){function t(a,l){const c=a.array,u=a.itemSize,h=a.normalized,f=new c.constructor(l.length*u);let m=0,g=0;for(let _=0,p=l.length;_<p;_++){a.isInterleavedBufferAttribute?m=l[_]*a.data.stride+a.offset:m=l[_]*u;for(let d=0;d<u;d++)f[g++]=c[m++]}return new gn(f,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new xn,n=this.index.array,i=this.attributes;for(const a in i){const l=i[a],c=t(l,n);e.setAttribute(a,c)}const s=this.morphAttributes;for(const a in s){const l=[],c=s[a];for(let u=0,h=c.length;u<h;u++){const f=c[u],m=t(f,n);l.push(m)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const i={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let h=0,f=c.length;h<f;h++){const m=c[h];u.push(m.toJSON(t.data))}u.length>0&&(i[l]=u,s=!0)}s&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const i=t.attributes;for(const c in i){const u=i[c];this.setAttribute(c,u.clone(e))}const s=t.morphAttributes;for(const c in s){const u=[],h=s[c];for(let f=0,m=h.length;f<m;f++)u.push(h[f].clone(e));this.morphAttributes[c]=u}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,u=o.length;c<u;c++){const h=o[c];this.addGroup(h.start,h.count,h.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Ao=new fe,Zn=new Lu,zr=new La,bo=new N,yi=new N,Ai=new N,bi=new N,Ws=new N,Vr=new N,Hr=new Vt,kr=new Vt,Wr=new Vt,wo=new N,Ro=new N,Co=new N,Xr=new N,qr=new N;class Se extends we{constructor(t=new xn,e=new Oi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=i.length;s<o;s++){const a=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(t,e){const n=this.geometry,i=n.attributes.position,s=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(i,t);const a=this.morphTargetInfluences;if(s&&a){Vr.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const u=a[l],h=s[l];u!==0&&(Ws.fromBufferAttribute(h,t),o?Vr.addScaledVector(Ws,u):Vr.addScaledVector(Ws.sub(e),u))}e.add(Vr)}return e}raycast(t,e){const n=this.geometry,i=this.material,s=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),zr.copy(n.boundingSphere),zr.applyMatrix4(s),Zn.copy(t.ray).recast(t.near),!(zr.containsPoint(Zn.origin)===!1&&(Zn.intersectSphere(zr,bo)===null||Zn.origin.distanceToSquared(bo)>As(t.far-t.near,2)))&&(Ao.copy(s).invert(),Zn.copy(t.ray).applyMatrix4(Ao),!(n.boundingBox!==null&&Zn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Zn)))}_computeIntersections(t,e,n){let i;const s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,h=s.attributes.normal,f=s.groups,m=s.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=f.length;g<_;g++){const p=f[g],d=o[p.materialIndex],M=Math.max(p.start,m.start),x=Math.min(a.count,Math.min(p.start+p.count,m.start+m.count));for(let E=M,R=x;E<R;E+=3){const w=a.getX(E),A=a.getX(E+1),L=a.getX(E+2);i=Yr(this,d,t,n,c,u,h,w,A,L),i&&(i.faceIndex=Math.floor(E/3),i.face.materialIndex=p.materialIndex,e.push(i))}}else{const g=Math.max(0,m.start),_=Math.min(a.count,m.start+m.count);for(let p=g,d=_;p<d;p+=3){const M=a.getX(p),x=a.getX(p+1),E=a.getX(p+2);i=Yr(this,o,t,n,c,u,h,M,x,E),i&&(i.faceIndex=Math.floor(p/3),e.push(i))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,_=f.length;g<_;g++){const p=f[g],d=o[p.materialIndex],M=Math.max(p.start,m.start),x=Math.min(l.count,Math.min(p.start+p.count,m.start+m.count));for(let E=M,R=x;E<R;E+=3){const w=E,A=E+1,L=E+2;i=Yr(this,d,t,n,c,u,h,w,A,L),i&&(i.faceIndex=Math.floor(E/3),i.face.materialIndex=p.materialIndex,e.push(i))}}else{const g=Math.max(0,m.start),_=Math.min(l.count,m.start+m.count);for(let p=g,d=_;p<d;p+=3){const M=p,x=p+1,E=p+2;i=Yr(this,o,t,n,c,u,h,M,x,E),i&&(i.faceIndex=Math.floor(p/3),e.push(i))}}}}function Vu(r,t,e,n,i,s,o,a){let l;if(t.side===1?l=n.intersectTriangle(o,s,i,!0,a):l=n.intersectTriangle(i,s,o,t.side===0,a),l===null)return null;qr.copy(a),qr.applyMatrix4(r.matrixWorld);const c=e.ray.origin.distanceTo(qr);return c<e.near||c>e.far?null:{distance:c,point:qr.clone(),object:r}}function Yr(r,t,e,n,i,s,o,a,l,c){r.getVertexPosition(a,yi),r.getVertexPosition(l,Ai),r.getVertexPosition(c,bi);const u=Vu(r,t,e,n,yi,Ai,bi,Xr);if(u){i&&(Hr.fromBufferAttribute(i,a),kr.fromBufferAttribute(i,l),Wr.fromBufferAttribute(i,c),u.uv=hn.getInterpolation(Xr,yi,Ai,bi,Hr,kr,Wr,new Vt)),s&&(Hr.fromBufferAttribute(s,a),kr.fromBufferAttribute(s,l),Wr.fromBufferAttribute(s,c),u.uv1=hn.getInterpolation(Xr,yi,Ai,bi,Hr,kr,Wr,new Vt),u.uv2=u.uv1),o&&(wo.fromBufferAttribute(o,a),Ro.fromBufferAttribute(o,l),Co.fromBufferAttribute(o,c),u.normal=hn.getInterpolation(Xr,yi,Ai,bi,wo,Ro,Co,new N),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const h={a,b:l,c,normal:new N,materialIndex:0};hn.getNormal(yi,Ai,bi,h.normal),u.face=h}return u}class ji extends xn{constructor(t=1,e=1,n=1,i=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:s,depthSegments:o};const a=this;i=Math.floor(i),s=Math.floor(s),o=Math.floor(o);const l=[],c=[],u=[],h=[];let f=0,m=0;g("z","y","x",-1,-1,n,e,t,o,s,0),g("z","y","x",1,-1,n,e,-t,o,s,1),g("x","z","y",1,1,t,n,e,i,o,2),g("x","z","y",1,-1,t,n,-e,i,o,3),g("x","y","z",1,-1,t,e,n,i,s,4),g("x","y","z",-1,-1,t,e,-n,i,s,5),this.setIndex(l),this.setAttribute("position",new Re(c,3)),this.setAttribute("normal",new Re(u,3)),this.setAttribute("uv",new Re(h,2));function g(_,p,d,M,x,E,R,w,A,L,v){const y=E/A,U=R/L,F=E/2,q=R/2,C=w/2,I=A+1,O=L+1;let W=0,X=0;const Y=new N;for(let j=0;j<O;j++){const tt=j*U-q;for(let et=0;et<I;et++){const k=et*y-F;Y[_]=k*M,Y[p]=tt*x,Y[d]=C,c.push(Y.x,Y.y,Y.z),Y[_]=0,Y[p]=0,Y[d]=w>0?1:-1,u.push(Y.x,Y.y,Y.z),h.push(et/A),h.push(1-j/L),W+=1}}for(let j=0;j<L;j++)for(let tt=0;tt<A;tt++){const et=f+tt+I*j,k=f+tt+I*(j+1),K=f+(tt+1)+I*(j+1),rt=f+(tt+1)+I*j;l.push(et,k,rt),l.push(k,K,rt),X+=6}a.addGroup(m,X,v),m+=X,f+=W}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ji(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Vi(r){const t={};for(const e in r){t[e]={};for(const n in r[e]){const i=r[e][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone():Array.isArray(i)?t[e][n]=i.slice():t[e][n]=i}}return t}function Ie(r){const t={};for(let e=0;e<r.length;e++){const n=Vi(r[e]);for(const i in n)t[i]=n[i]}return t}function Hu(r){const t=[];for(let e=0;e<r.length;e++)t.push(r[e].clone());return t}function nc(r){return r.getRenderTarget()===null?r.outputColorSpace:Xt.workingColorSpace}const ku={clone:Vi,merge:Ie};var Wu=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Xu=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class di extends Ar{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Wu,this.fragmentShader=Xu,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Vi(t.uniforms),this.uniformsGroups=Hu(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const i in this.uniforms){const o=this.uniforms[i].value;o&&o.isTexture?e.uniforms[i]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[i]={type:"m4",value:o.toArray()}:e.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}let ic=class extends we{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new fe,this.projectionMatrix=new fe,this.projectionMatrixInverse=new fe,this.coordinateSystem=2e3}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}};class nn extends ic{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=fa*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(ws*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return fa*2*Math.atan(Math.tan(ws*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,n,i,s,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(ws*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,s=-.5*i;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*i/l,e-=o.offsetY*n/c,i*=o.width/l,n*=o.height/c}const a=this.filmOffset;a!==0&&(s+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+i,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const wi=-90,Ri=1;class qu extends we{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new nn(wi,Ri,t,e);i.layers=this.layers,this.add(i);const s=new nn(wi,Ri,t,e);s.layers=this.layers,this.add(s);const o=new nn(wi,Ri,t,e);o.layers=this.layers,this.add(o);const a=new nn(wi,Ri,t,e);a.layers=this.layers,this.add(a);const l=new nn(wi,Ri,t,e);l.layers=this.layers,this.add(l);const c=new nn(wi,Ri,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,i,s,o,a,l]=e;for(const c of e)this.remove(c);if(t===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,o,a,l,c,u]=this.children,h=t.getRenderTarget(),f=t.getActiveCubeFace(),m=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,i),t.render(e,s),t.setRenderTarget(n,1,i),t.render(e,o),t.setRenderTarget(n,2,i),t.render(e,a),t.setRenderTarget(n,3,i),t.render(e,l),t.setRenderTarget(n,4,i),t.render(e,c),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,i),t.render(e,u),t.setRenderTarget(h,f,m),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class rc extends je{constructor(t,e,n,i,s,o,a,l,c,u){t=t!==void 0?t:[],e=e!==void 0?e:301,super(t,e,n,i,s,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Yu extends fi{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];e.encoding!==void 0&&(cr("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===3001?Me:rn),this.texture=new rc(i,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:1006}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new ji(5,5,5),s=new di({name:"CubemapFromEquirect",uniforms:Vi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});s.uniforms.tEquirect.value=e;const o=new Se(i,s),a=e.minFilter;return e.minFilter===1008&&(e.minFilter=1006),new qu(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,i){const s=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,i);t.setRenderTarget(s)}}const Xs=new N,Ku=new N,ju=new Ot;class ei{constructor(t=new N(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const i=Xs.subVectors(n,e).cross(Ku.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Xs),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/i;return s<0||s>1?null:e.copy(t.start).addScaledVector(n,s)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||ju.getNormalMatrix(t),i=this.coplanarPoint(Xs).applyMatrix4(t),s=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const $n=new La,Kr=new N;class Da{constructor(t=new ei,e=new ei,n=new ei,i=new ei,s=new ei,o=new ei){this.planes=[t,e,n,i,s,o]}set(t,e,n,i,s,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(i),a[4].copy(s),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=2e3){const n=this.planes,i=t.elements,s=i[0],o=i[1],a=i[2],l=i[3],c=i[4],u=i[5],h=i[6],f=i[7],m=i[8],g=i[9],_=i[10],p=i[11],d=i[12],M=i[13],x=i[14],E=i[15];if(n[0].setComponents(l-s,f-c,p-m,E-d).normalize(),n[1].setComponents(l+s,f+c,p+m,E+d).normalize(),n[2].setComponents(l+o,f+u,p+g,E+M).normalize(),n[3].setComponents(l-o,f-u,p-g,E-M).normalize(),n[4].setComponents(l-a,f-h,p-_,E-x).normalize(),e===2e3)n[5].setComponents(l+a,f+h,p+_,E+x).normalize();else if(e===2001)n[5].setComponents(a,h,_,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),$n.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),$n.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere($n)}intersectsSprite(t){return $n.center.set(0,0,0),$n.radius=.7071067811865476,$n.applyMatrix4(t.matrixWorld),this.intersectsSphere($n)}intersectsSphere(t){const e=this.planes,n=t.center,i=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const i=e[n];if(Kr.x=i.normal.x>0?t.max.x:t.min.x,Kr.y=i.normal.y>0?t.max.y:t.min.y,Kr.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(Kr)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function sc(){let r=null,t=!1,e=null,n=null;function i(s,o){e(s,o),n=r.requestAnimationFrame(i)}return{start:function(){t!==!0&&e!==null&&(n=r.requestAnimationFrame(i),t=!0)},stop:function(){r.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){r=s}}}function Zu(r,t){const e=t.isWebGL2,n=new WeakMap;function i(c,u){const h=c.array,f=c.usage,m=h.byteLength,g=r.createBuffer();r.bindBuffer(u,g),r.bufferData(u,h,f),c.onUploadCallback();let _;if(h instanceof Float32Array)_=r.FLOAT;else if(h instanceof Uint16Array)if(c.isFloat16BufferAttribute)if(e)_=r.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else _=r.UNSIGNED_SHORT;else if(h instanceof Int16Array)_=r.SHORT;else if(h instanceof Uint32Array)_=r.UNSIGNED_INT;else if(h instanceof Int32Array)_=r.INT;else if(h instanceof Int8Array)_=r.BYTE;else if(h instanceof Uint8Array)_=r.UNSIGNED_BYTE;else if(h instanceof Uint8ClampedArray)_=r.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:g,type:_,bytesPerElement:h.BYTES_PER_ELEMENT,version:c.version,size:m}}function s(c,u,h){const f=u.array,m=u._updateRange,g=u.updateRanges;if(r.bindBuffer(h,c),m.count===-1&&g.length===0&&r.bufferSubData(h,0,f),g.length!==0){for(let _=0,p=g.length;_<p;_++){const d=g[_];e?r.bufferSubData(h,d.start*f.BYTES_PER_ELEMENT,f,d.start,d.count):r.bufferSubData(h,d.start*f.BYTES_PER_ELEMENT,f.subarray(d.start,d.start+d.count))}u.clearUpdateRanges()}m.count!==-1&&(e?r.bufferSubData(h,m.offset*f.BYTES_PER_ELEMENT,f,m.offset,m.count):r.bufferSubData(h,m.offset*f.BYTES_PER_ELEMENT,f.subarray(m.offset,m.offset+m.count)),m.count=-1),u.onUploadCallback()}function o(c){return c.isInterleavedBufferAttribute&&(c=c.data),n.get(c)}function a(c){c.isInterleavedBufferAttribute&&(c=c.data);const u=n.get(c);u&&(r.deleteBuffer(u.buffer),n.delete(c))}function l(c,u){if(c.isGLBufferAttribute){const f=n.get(c);(!f||f.version<c.version)&&n.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);const h=n.get(c);if(h===void 0)n.set(c,i(c,u));else if(h.version<c.version){if(h.size!==c.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");s(h.buffer,c,u),h.version=c.version}}return{get:o,remove:a,update:l}}class Ia extends xn{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};const s=t/2,o=e/2,a=Math.floor(n),l=Math.floor(i),c=a+1,u=l+1,h=t/a,f=e/l,m=[],g=[],_=[],p=[];for(let d=0;d<u;d++){const M=d*f-o;for(let x=0;x<c;x++){const E=x*h-s;g.push(E,-M,0),_.push(0,0,1),p.push(x/a),p.push(1-d/l)}}for(let d=0;d<l;d++)for(let M=0;M<a;M++){const x=M+c*d,E=M+c*(d+1),R=M+1+c*(d+1),w=M+1+c*d;m.push(x,E,w),m.push(E,R,w)}this.setIndex(m),this.setAttribute("position",new Re(g,3)),this.setAttribute("normal",new Re(_,3)),this.setAttribute("uv",new Re(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ia(t.width,t.height,t.widthSegments,t.heightSegments)}}var $u=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Ju=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Qu=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,th=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,eh=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,nh=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,ih=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,rh=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,sh=`#ifdef USE_BATCHING
	attribute float batchId;
	uniform highp sampler2D batchingTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,ah=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,oh=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,lh=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,ch=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,uh=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,hh=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,fh=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#pragma unroll_loop_start
	for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
		plane = clippingPlanes[ i ];
		if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
	}
	#pragma unroll_loop_end
	#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
		bool clipped = true;
		#pragma unroll_loop_start
		for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
		}
		#pragma unroll_loop_end
		if ( clipped ) discard;
	#endif
#endif`,dh=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,ph=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,mh=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,_h=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,gh=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,vh=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,xh=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,Mh=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Sh=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Eh=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Th=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,yh=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Ah=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,bh=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,wh="gl_FragColor = linearToOutputTexel( gl_FragColor );",Rh=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,Ch=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Ph=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Lh=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Dh=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Ih=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Uh=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Fh=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Nh=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Oh=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Bh=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Gh=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,zh=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Vh=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Hh=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,kh=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	#if defined ( LEGACY_LIGHTS )
		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#else
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if ( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#endif
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Wh=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Xh=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,qh=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Yh=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Kh=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,jh=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Zh=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,$h=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Jh=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Qh=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,tf=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,ef=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,nf=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,rf=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,sf=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,af=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,of=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,lf=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,cf=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,uf=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,hf=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,ff=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
	#endif
#endif`,df=`#ifdef USE_MORPHTARGETS
	uniform float morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		uniform sampler2DArray morphTargetsTexture;
		uniform ivec2 morphTargetsTextureSize;
		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
			int y = texelIndex / morphTargetsTextureSize.x;
			int x = texelIndex - y * morphTargetsTextureSize.x;
			ivec3 morphUV = ivec3( x, y, morphTargetIndex );
			return texelFetch( morphTargetsTexture, morphUV, 0 );
		}
	#else
		#ifndef USE_MORPHNORMALS
			uniform float morphTargetInfluences[ 8 ];
		#else
			uniform float morphTargetInfluences[ 4 ];
		#endif
	#endif
#endif`,pf=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];
		#ifndef USE_MORPHNORMALS
			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];
		#endif
	#endif
#endif`,mf=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,_f=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,gf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,vf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,xf=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Mf=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Sf=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Ef=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Tf=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,yf=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Af=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,bf=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,wf=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Rf=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Cf=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Pf=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Lf=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Df=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,If=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
		vec3 lightToPosition = shadowCoord.xyz;
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );		dp += shadowBias;
		vec3 bd3D = normalize( lightToPosition );
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
			return (
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
			) * ( 1.0 / 9.0 );
		#else
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
		#endif
	}
#endif`,Uf=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Ff=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Nf=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Of=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Bf=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Gf=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,zf=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Vf=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Hf=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,kf=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Wf=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color *= toneMappingExposure;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	return color;
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Xf=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,qf=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
		vec3 refractedRayExit = position + transmissionRay;
		vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
		vec2 refractionCoords = ndcPos.xy / ndcPos.w;
		refractionCoords += 1.0;
		refractionCoords /= 2.0;
		vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
		vec3 transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Yf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Kf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,jf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Zf=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const $f=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Jf=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Qf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,td=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ed=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,nd=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,id=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,rd=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,sd=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,ad=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,od=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,ld=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cd=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,ud=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,hd=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,fd=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,dd=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,pd=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,md=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,_d=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,gd=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,vd=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), opacity );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,xd=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Md=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Sd=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Ed=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Td=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,yd=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ad=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,bd=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,wd=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Rd=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Cd=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Pd=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Lt={alphahash_fragment:$u,alphahash_pars_fragment:Ju,alphamap_fragment:Qu,alphamap_pars_fragment:th,alphatest_fragment:eh,alphatest_pars_fragment:nh,aomap_fragment:ih,aomap_pars_fragment:rh,batching_pars_vertex:sh,batching_vertex:ah,begin_vertex:oh,beginnormal_vertex:lh,bsdfs:ch,iridescence_fragment:uh,bumpmap_pars_fragment:hh,clipping_planes_fragment:fh,clipping_planes_pars_fragment:dh,clipping_planes_pars_vertex:ph,clipping_planes_vertex:mh,color_fragment:_h,color_pars_fragment:gh,color_pars_vertex:vh,color_vertex:xh,common:Mh,cube_uv_reflection_fragment:Sh,defaultnormal_vertex:Eh,displacementmap_pars_vertex:Th,displacementmap_vertex:yh,emissivemap_fragment:Ah,emissivemap_pars_fragment:bh,colorspace_fragment:wh,colorspace_pars_fragment:Rh,envmap_fragment:Ch,envmap_common_pars_fragment:Ph,envmap_pars_fragment:Lh,envmap_pars_vertex:Dh,envmap_physical_pars_fragment:Wh,envmap_vertex:Ih,fog_vertex:Uh,fog_pars_vertex:Fh,fog_fragment:Nh,fog_pars_fragment:Oh,gradientmap_pars_fragment:Bh,lightmap_fragment:Gh,lightmap_pars_fragment:zh,lights_lambert_fragment:Vh,lights_lambert_pars_fragment:Hh,lights_pars_begin:kh,lights_toon_fragment:Xh,lights_toon_pars_fragment:qh,lights_phong_fragment:Yh,lights_phong_pars_fragment:Kh,lights_physical_fragment:jh,lights_physical_pars_fragment:Zh,lights_fragment_begin:$h,lights_fragment_maps:Jh,lights_fragment_end:Qh,logdepthbuf_fragment:tf,logdepthbuf_pars_fragment:ef,logdepthbuf_pars_vertex:nf,logdepthbuf_vertex:rf,map_fragment:sf,map_pars_fragment:af,map_particle_fragment:of,map_particle_pars_fragment:lf,metalnessmap_fragment:cf,metalnessmap_pars_fragment:uf,morphcolor_vertex:hf,morphnormal_vertex:ff,morphtarget_pars_vertex:df,morphtarget_vertex:pf,normal_fragment_begin:mf,normal_fragment_maps:_f,normal_pars_fragment:gf,normal_pars_vertex:vf,normal_vertex:xf,normalmap_pars_fragment:Mf,clearcoat_normal_fragment_begin:Sf,clearcoat_normal_fragment_maps:Ef,clearcoat_pars_fragment:Tf,iridescence_pars_fragment:yf,opaque_fragment:Af,packing:bf,premultiplied_alpha_fragment:wf,project_vertex:Rf,dithering_fragment:Cf,dithering_pars_fragment:Pf,roughnessmap_fragment:Lf,roughnessmap_pars_fragment:Df,shadowmap_pars_fragment:If,shadowmap_pars_vertex:Uf,shadowmap_vertex:Ff,shadowmask_pars_fragment:Nf,skinbase_vertex:Of,skinning_pars_vertex:Bf,skinning_vertex:Gf,skinnormal_vertex:zf,specularmap_fragment:Vf,specularmap_pars_fragment:Hf,tonemapping_fragment:kf,tonemapping_pars_fragment:Wf,transmission_fragment:Xf,transmission_pars_fragment:qf,uv_pars_fragment:Yf,uv_pars_vertex:Kf,uv_vertex:jf,worldpos_vertex:Zf,background_vert:$f,background_frag:Jf,backgroundCube_vert:Qf,backgroundCube_frag:td,cube_vert:ed,cube_frag:nd,depth_vert:id,depth_frag:rd,distanceRGBA_vert:sd,distanceRGBA_frag:ad,equirect_vert:od,equirect_frag:ld,linedashed_vert:cd,linedashed_frag:ud,meshbasic_vert:hd,meshbasic_frag:fd,meshlambert_vert:dd,meshlambert_frag:pd,meshmatcap_vert:md,meshmatcap_frag:_d,meshnormal_vert:gd,meshnormal_frag:vd,meshphong_vert:xd,meshphong_frag:Md,meshphysical_vert:Sd,meshphysical_frag:Ed,meshtoon_vert:Td,meshtoon_frag:yd,points_vert:Ad,points_frag:bd,shadow_vert:wd,shadow_frag:Rd,sprite_vert:Cd,sprite_frag:Pd},it={common:{diffuse:{value:new Ht(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ot},alphaMap:{value:null},alphaMapTransform:{value:new Ot},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ot}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ot}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ot}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ot},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ot},normalScale:{value:new Vt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ot},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ot}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ot}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ot}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ht(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ht(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ot},alphaTest:{value:0},uvTransform:{value:new Ot}},sprite:{diffuse:{value:new Ht(16777215)},opacity:{value:1},center:{value:new Vt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ot},alphaMap:{value:null},alphaMapTransform:{value:new Ot},alphaTest:{value:0}}},pn={basic:{uniforms:Ie([it.common,it.specularmap,it.envmap,it.aomap,it.lightmap,it.fog]),vertexShader:Lt.meshbasic_vert,fragmentShader:Lt.meshbasic_frag},lambert:{uniforms:Ie([it.common,it.specularmap,it.envmap,it.aomap,it.lightmap,it.emissivemap,it.bumpmap,it.normalmap,it.displacementmap,it.fog,it.lights,{emissive:{value:new Ht(0)}}]),vertexShader:Lt.meshlambert_vert,fragmentShader:Lt.meshlambert_frag},phong:{uniforms:Ie([it.common,it.specularmap,it.envmap,it.aomap,it.lightmap,it.emissivemap,it.bumpmap,it.normalmap,it.displacementmap,it.fog,it.lights,{emissive:{value:new Ht(0)},specular:{value:new Ht(1118481)},shininess:{value:30}}]),vertexShader:Lt.meshphong_vert,fragmentShader:Lt.meshphong_frag},standard:{uniforms:Ie([it.common,it.envmap,it.aomap,it.lightmap,it.emissivemap,it.bumpmap,it.normalmap,it.displacementmap,it.roughnessmap,it.metalnessmap,it.fog,it.lights,{emissive:{value:new Ht(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Lt.meshphysical_vert,fragmentShader:Lt.meshphysical_frag},toon:{uniforms:Ie([it.common,it.aomap,it.lightmap,it.emissivemap,it.bumpmap,it.normalmap,it.displacementmap,it.gradientmap,it.fog,it.lights,{emissive:{value:new Ht(0)}}]),vertexShader:Lt.meshtoon_vert,fragmentShader:Lt.meshtoon_frag},matcap:{uniforms:Ie([it.common,it.bumpmap,it.normalmap,it.displacementmap,it.fog,{matcap:{value:null}}]),vertexShader:Lt.meshmatcap_vert,fragmentShader:Lt.meshmatcap_frag},points:{uniforms:Ie([it.points,it.fog]),vertexShader:Lt.points_vert,fragmentShader:Lt.points_frag},dashed:{uniforms:Ie([it.common,it.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Lt.linedashed_vert,fragmentShader:Lt.linedashed_frag},depth:{uniforms:Ie([it.common,it.displacementmap]),vertexShader:Lt.depth_vert,fragmentShader:Lt.depth_frag},normal:{uniforms:Ie([it.common,it.bumpmap,it.normalmap,it.displacementmap,{opacity:{value:1}}]),vertexShader:Lt.meshnormal_vert,fragmentShader:Lt.meshnormal_frag},sprite:{uniforms:Ie([it.sprite,it.fog]),vertexShader:Lt.sprite_vert,fragmentShader:Lt.sprite_frag},background:{uniforms:{uvTransform:{value:new Ot},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Lt.background_vert,fragmentShader:Lt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Lt.backgroundCube_vert,fragmentShader:Lt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Lt.cube_vert,fragmentShader:Lt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Lt.equirect_vert,fragmentShader:Lt.equirect_frag},distanceRGBA:{uniforms:Ie([it.common,it.displacementmap,{referencePosition:{value:new N},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Lt.distanceRGBA_vert,fragmentShader:Lt.distanceRGBA_frag},shadow:{uniforms:Ie([it.lights,it.fog,{color:{value:new Ht(0)},opacity:{value:1}}]),vertexShader:Lt.shadow_vert,fragmentShader:Lt.shadow_frag}};pn.physical={uniforms:Ie([pn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ot},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ot},clearcoatNormalScale:{value:new Vt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ot},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ot},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ot},sheen:{value:0},sheenColor:{value:new Ht(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ot},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ot},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ot},transmissionSamplerSize:{value:new Vt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ot},attenuationDistance:{value:0},attenuationColor:{value:new Ht(0)},specularColor:{value:new Ht(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ot},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ot},anisotropyVector:{value:new Vt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ot}}]),vertexShader:Lt.meshphysical_vert,fragmentShader:Lt.meshphysical_frag};const jr={r:0,b:0,g:0};function Ld(r,t,e,n,i,s,o){const a=new Ht(0);let l=s===!0?0:1,c,u,h=null,f=0,m=null;function g(p,d){let M=!1,x=d.isScene===!0?d.background:null;x&&x.isTexture&&(x=(d.backgroundBlurriness>0?e:t).get(x)),x===null?_(a,l):x&&x.isColor&&(_(x,1),M=!0);const E=r.xr.getEnvironmentBlendMode();E==="additive"?n.buffers.color.setClear(0,0,0,1,o):E==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(r.autoClear||M)&&r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil),x&&(x.isCubeTexture||x.mapping===306)?(u===void 0&&(u=new Se(new ji(1,1,1),new di({name:"BackgroundCubeMaterial",uniforms:Vi(pn.backgroundCube.uniforms),vertexShader:pn.backgroundCube.vertexShader,fragmentShader:pn.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(R,w,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(u)),u.material.uniforms.envMap.value=x,u.material.uniforms.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=d.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=d.backgroundIntensity,u.material.toneMapped=Xt.getTransfer(x.colorSpace)!==$t,(h!==x||f!==x.version||m!==r.toneMapping)&&(u.material.needsUpdate=!0,h=x,f=x.version,m=r.toneMapping),u.layers.enableAll(),p.unshift(u,u.geometry,u.material,0,0,null)):x&&x.isTexture&&(c===void 0&&(c=new Se(new Ia(2,2),new di({name:"BackgroundMaterial",uniforms:Vi(pn.background.uniforms),vertexShader:pn.background.vertexShader,fragmentShader:pn.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=x,c.material.uniforms.backgroundIntensity.value=d.backgroundIntensity,c.material.toneMapped=Xt.getTransfer(x.colorSpace)!==$t,x.matrixAutoUpdate===!0&&x.updateMatrix(),c.material.uniforms.uvTransform.value.copy(x.matrix),(h!==x||f!==x.version||m!==r.toneMapping)&&(c.material.needsUpdate=!0,h=x,f=x.version,m=r.toneMapping),c.layers.enableAll(),p.unshift(c,c.geometry,c.material,0,0,null))}function _(p,d){p.getRGB(jr,nc(r)),n.buffers.color.setClear(jr.r,jr.g,jr.b,d,o)}return{getClearColor:function(){return a},setClearColor:function(p,d=1){a.set(p),l=d,_(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(p){l=p,_(a,l)},render:g}}function Dd(r,t,e,n){const i=r.getParameter(r.MAX_VERTEX_ATTRIBS),s=n.isWebGL2?null:t.get("OES_vertex_array_object"),o=n.isWebGL2||s!==null,a={},l=p(null);let c=l,u=!1;function h(C,I,O,W,X){let Y=!1;if(o){const j=_(W,O,I);c!==j&&(c=j,m(c.object)),Y=d(C,W,O,X),Y&&M(C,W,O,X)}else{const j=I.wireframe===!0;(c.geometry!==W.id||c.program!==O.id||c.wireframe!==j)&&(c.geometry=W.id,c.program=O.id,c.wireframe=j,Y=!0)}X!==null&&e.update(X,r.ELEMENT_ARRAY_BUFFER),(Y||u)&&(u=!1,L(C,I,O,W),X!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,e.get(X).buffer))}function f(){return n.isWebGL2?r.createVertexArray():s.createVertexArrayOES()}function m(C){return n.isWebGL2?r.bindVertexArray(C):s.bindVertexArrayOES(C)}function g(C){return n.isWebGL2?r.deleteVertexArray(C):s.deleteVertexArrayOES(C)}function _(C,I,O){const W=O.wireframe===!0;let X=a[C.id];X===void 0&&(X={},a[C.id]=X);let Y=X[I.id];Y===void 0&&(Y={},X[I.id]=Y);let j=Y[W];return j===void 0&&(j=p(f()),Y[W]=j),j}function p(C){const I=[],O=[],W=[];for(let X=0;X<i;X++)I[X]=0,O[X]=0,W[X]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:O,attributeDivisors:W,object:C,attributes:{},index:null}}function d(C,I,O,W){const X=c.attributes,Y=I.attributes;let j=0;const tt=O.getAttributes();for(const et in tt)if(tt[et].location>=0){const K=X[et];let rt=Y[et];if(rt===void 0&&(et==="instanceMatrix"&&C.instanceMatrix&&(rt=C.instanceMatrix),et==="instanceColor"&&C.instanceColor&&(rt=C.instanceColor)),K===void 0||K.attribute!==rt||rt&&K.data!==rt.data)return!0;j++}return c.attributesNum!==j||c.index!==W}function M(C,I,O,W){const X={},Y=I.attributes;let j=0;const tt=O.getAttributes();for(const et in tt)if(tt[et].location>=0){let K=Y[et];K===void 0&&(et==="instanceMatrix"&&C.instanceMatrix&&(K=C.instanceMatrix),et==="instanceColor"&&C.instanceColor&&(K=C.instanceColor));const rt={};rt.attribute=K,K&&K.data&&(rt.data=K.data),X[et]=rt,j++}c.attributes=X,c.attributesNum=j,c.index=W}function x(){const C=c.newAttributes;for(let I=0,O=C.length;I<O;I++)C[I]=0}function E(C){R(C,0)}function R(C,I){const O=c.newAttributes,W=c.enabledAttributes,X=c.attributeDivisors;O[C]=1,W[C]===0&&(r.enableVertexAttribArray(C),W[C]=1),X[C]!==I&&((n.isWebGL2?r:t.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](C,I),X[C]=I)}function w(){const C=c.newAttributes,I=c.enabledAttributes;for(let O=0,W=I.length;O<W;O++)I[O]!==C[O]&&(r.disableVertexAttribArray(O),I[O]=0)}function A(C,I,O,W,X,Y,j){j===!0?r.vertexAttribIPointer(C,I,O,X,Y):r.vertexAttribPointer(C,I,O,W,X,Y)}function L(C,I,O,W){if(n.isWebGL2===!1&&(C.isInstancedMesh||W.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;x();const X=W.attributes,Y=O.getAttributes(),j=I.defaultAttributeValues;for(const tt in Y){const et=Y[tt];if(et.location>=0){let k=X[tt];if(k===void 0&&(tt==="instanceMatrix"&&C.instanceMatrix&&(k=C.instanceMatrix),tt==="instanceColor"&&C.instanceColor&&(k=C.instanceColor)),k!==void 0){const K=k.normalized,rt=k.itemSize,mt=e.get(k);if(mt===void 0)continue;const pt=mt.buffer,wt=mt.type,Ct=mt.bytesPerElement,St=n.isWebGL2===!0&&(wt===r.INT||wt===r.UNSIGNED_INT||k.gpuType===1013);if(k.isInterleavedBufferAttribute){const zt=k.data,B=zt.stride,Pe=k.offset;if(zt.isInstancedInterleavedBuffer){for(let gt=0;gt<et.locationSize;gt++)R(et.location+gt,zt.meshPerAttribute);C.isInstancedMesh!==!0&&W._maxInstanceCount===void 0&&(W._maxInstanceCount=zt.meshPerAttribute*zt.count)}else for(let gt=0;gt<et.locationSize;gt++)E(et.location+gt);r.bindBuffer(r.ARRAY_BUFFER,pt);for(let gt=0;gt<et.locationSize;gt++)A(et.location+gt,rt/et.locationSize,wt,K,B*Ct,(Pe+rt/et.locationSize*gt)*Ct,St)}else{if(k.isInstancedBufferAttribute){for(let zt=0;zt<et.locationSize;zt++)R(et.location+zt,k.meshPerAttribute);C.isInstancedMesh!==!0&&W._maxInstanceCount===void 0&&(W._maxInstanceCount=k.meshPerAttribute*k.count)}else for(let zt=0;zt<et.locationSize;zt++)E(et.location+zt);r.bindBuffer(r.ARRAY_BUFFER,pt);for(let zt=0;zt<et.locationSize;zt++)A(et.location+zt,rt/et.locationSize,wt,K,rt*Ct,rt/et.locationSize*zt*Ct,St)}}else if(j!==void 0){const K=j[tt];if(K!==void 0)switch(K.length){case 2:r.vertexAttrib2fv(et.location,K);break;case 3:r.vertexAttrib3fv(et.location,K);break;case 4:r.vertexAttrib4fv(et.location,K);break;default:r.vertexAttrib1fv(et.location,K)}}}}w()}function v(){F();for(const C in a){const I=a[C];for(const O in I){const W=I[O];for(const X in W)g(W[X].object),delete W[X];delete I[O]}delete a[C]}}function y(C){if(a[C.id]===void 0)return;const I=a[C.id];for(const O in I){const W=I[O];for(const X in W)g(W[X].object),delete W[X];delete I[O]}delete a[C.id]}function U(C){for(const I in a){const O=a[I];if(O[C.id]===void 0)continue;const W=O[C.id];for(const X in W)g(W[X].object),delete W[X];delete O[C.id]}}function F(){q(),u=!0,c!==l&&(c=l,m(c.object))}function q(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:h,reset:F,resetDefaultState:q,dispose:v,releaseStatesOfGeometry:y,releaseStatesOfProgram:U,initAttributes:x,enableAttribute:E,disableUnusedAttributes:w}}function Id(r,t,e,n){const i=n.isWebGL2;let s;function o(u){s=u}function a(u,h){r.drawArrays(s,u,h),e.update(h,s,1)}function l(u,h,f){if(f===0)return;let m,g;if(i)m=r,g="drawArraysInstanced";else if(m=t.get("ANGLE_instanced_arrays"),g="drawArraysInstancedANGLE",m===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[g](s,u,h,f),e.update(h,s,f)}function c(u,h,f){if(f===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let g=0;g<f;g++)this.render(u[g],h[g]);else{m.multiDrawArraysWEBGL(s,u,0,h,0,f);let g=0;for(let _=0;_<f;_++)g+=h[_];e.update(g,s,1)}}this.setMode=o,this.render=a,this.renderInstances=l,this.renderMultiDraw=c}function Ud(r,t,e){let n;function i(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){const A=t.get("EXT_texture_filter_anisotropic");n=r.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function s(A){if(A==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const o=typeof WebGL2RenderingContext!="undefined"&&r.constructor.name==="WebGL2RenderingContext";let a=e.precision!==void 0?e.precision:"highp";const l=s(a);l!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",l,"instead."),a=l);const c=o||t.has("WEBGL_draw_buffers"),u=e.logarithmicDepthBuffer===!0,h=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),f=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),m=r.getParameter(r.MAX_TEXTURE_SIZE),g=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),_=r.getParameter(r.MAX_VERTEX_ATTRIBS),p=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),d=r.getParameter(r.MAX_VARYING_VECTORS),M=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),x=f>0,E=o||t.has("OES_texture_float"),R=x&&E,w=o?r.getParameter(r.MAX_SAMPLES):0;return{isWebGL2:o,drawBuffers:c,getMaxAnisotropy:i,getMaxPrecision:s,precision:a,logarithmicDepthBuffer:u,maxTextures:h,maxVertexTextures:f,maxTextureSize:m,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:p,maxVaryings:d,maxFragmentUniforms:M,vertexTextures:x,floatFragmentTextures:E,floatVertexTextures:R,maxSamples:w}}function Fd(r){const t=this;let e=null,n=0,i=!1,s=!1;const o=new ei,a=new Ot,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,f){const m=h.length!==0||f||n!==0||i;return i=f,n=h.length,m},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,f){e=u(h,f,0)},this.setState=function(h,f,m){const g=h.clippingPlanes,_=h.clipIntersection,p=h.clipShadows,d=r.get(h);if(!i||g===null||g.length===0||s&&!p)s?u(null):c();else{const M=s?0:n,x=M*4;let E=d.clippingState||null;l.value=E,E=u(g,f,x,m);for(let R=0;R!==x;++R)E[R]=e[R];d.clippingState=E,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=M}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function u(h,f,m,g){const _=h!==null?h.length:0;let p=null;if(_!==0){if(p=l.value,g!==!0||p===null){const d=m+_*4,M=f.matrixWorldInverse;a.getNormalMatrix(M),(p===null||p.length<d)&&(p=new Float32Array(d));for(let x=0,E=m;x!==_;++x,E+=4)o.copy(h[x]).applyMatrix4(M,a),o.normal.toArray(p,E),p[E+3]=o.constant}l.value=p,l.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,p}}function Nd(r){let t=new WeakMap;function e(o,a){return a===303?o.mapping=301:a===304&&(o.mapping=302),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===303||a===304)if(t.has(o)){const l=t.get(o).texture;return e(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new Yu(l.height/2);return c.fromEquirectangularTexture(r,o),t.set(o,c),o.addEventListener("dispose",i),e(c.texture,o.mapping)}else return null}}return o}function i(o){const a=o.target;a.removeEventListener("dispose",i);const l=t.get(a);l!==void 0&&(t.delete(a),l.dispose())}function s(){t=new WeakMap}return{get:n,dispose:s}}class ac extends ic{constructor(t=-1,e=1,n=1,i=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let s=n-t,o=n+t,a=i+e,l=i-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Li=4,Po=[.125,.215,.35,.446,.526,.582],ri=20,qs=new ac,Lo=new Ht;let Ys=null,Ks=0,js=0;const ni=(1+Math.sqrt(5))/2,Ci=1/ni,Do=[new N(1,1,1),new N(-1,1,1),new N(1,1,-1),new N(-1,1,-1),new N(0,ni,Ci),new N(0,ni,-Ci),new N(Ci,0,ni),new N(-Ci,0,ni),new N(ni,Ci,0),new N(-ni,Ci,0)];class Io{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,i=100){Ys=this._renderer.getRenderTarget(),Ks=this._renderer.getActiveCubeFace(),js=this._renderer.getActiveMipmapLevel(),this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(t,n,i,s),e>0&&this._blur(s,0,0,e),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=No(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Fo(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Ys,Ks,js),t.scissorTest=!1,Zr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===301||t.mapping===302?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Ys=this._renderer.getRenderTarget(),Ks=this._renderer.getActiveCubeFace(),js=this._renderer.getActiveMipmapLevel();const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:1006,minFilter:1006,generateMipmaps:!1,type:1016,format:1023,colorSpace:Rn,depthBuffer:!1},i=Uo(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Uo(t,e,n);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Od(s)),this._blurMaterial=Bd(s,t,e)}return i}_compileMaterial(t){const e=new Se(this._lodPlanes[0],t);this._renderer.compile(e,qs)}_sceneToCubeUV(t,e,n,i){const a=new nn(90,1,e,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],u=this._renderer,h=u.autoClear,f=u.toneMapping;u.getClearColor(Lo),u.toneMapping=0,u.autoClear=!1;const m=new Oi({name:"PMREM.Background",side:1,depthWrite:!1,depthTest:!1}),g=new Se(new ji,m);let _=!1;const p=t.background;p?p.isColor&&(m.color.copy(p),t.background=null,_=!0):(m.color.copy(Lo),_=!0);for(let d=0;d<6;d++){const M=d%3;M===0?(a.up.set(0,l[d],0),a.lookAt(c[d],0,0)):M===1?(a.up.set(0,0,l[d]),a.lookAt(0,c[d],0)):(a.up.set(0,l[d],0),a.lookAt(0,0,c[d]));const x=this._cubeSize;Zr(i,M*x,d>2?x:0,x,x),u.setRenderTarget(i),_&&u.render(g,a),u.render(t,a)}g.geometry.dispose(),g.material.dispose(),u.toneMapping=f,u.autoClear=h,t.background=p}_textureToCubeUV(t,e){const n=this._renderer,i=t.mapping===301||t.mapping===302;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=No()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Fo());const s=i?this._cubemapMaterial:this._equirectMaterial,o=new Se(this._lodPlanes[0],s),a=s.uniforms;a.envMap.value=t;const l=this._cubeSize;Zr(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,qs)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;for(let i=1;i<this._lodPlanes.length;i++){const s=Math.sqrt(this._sigmas[i]*this._sigmas[i]-this._sigmas[i-1]*this._sigmas[i-1]),o=Do[(i-1)%Do.length];this._blur(t,i-1,i,s,o)}e.autoClear=n}_blur(t,e,n,i,s){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,i,"latitudinal",s),this._halfBlur(o,t,n,n,i,"longitudinal",s)}_halfBlur(t,e,n,i,s,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,h=new Se(this._lodPlanes[i],c),f=c.uniforms,m=this._sizeLods[n]-1,g=isFinite(s)?Math.PI/(2*m):2*Math.PI/(2*ri-1),_=s/g,p=isFinite(s)?1+Math.floor(u*_):ri;p>ri&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${ri}`);const d=[];let M=0;for(let A=0;A<ri;++A){const L=A/_,v=Math.exp(-L*L/2);d.push(v),A===0?M+=v:A<p&&(M+=2*v)}for(let A=0;A<d.length;A++)d[A]=d[A]/M;f.envMap.value=t.texture,f.samples.value=p,f.weights.value=d,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);const{_lodMax:x}=this;f.dTheta.value=g,f.mipInt.value=x-n;const E=this._sizeLods[i],R=3*E*(i>x-Li?i-x+Li:0),w=4*(this._cubeSize-E);Zr(e,R,w,3*E,2*E),l.setRenderTarget(e),l.render(h,qs)}}function Od(r){const t=[],e=[],n=[];let i=r;const s=r-Li+1+Po.length;for(let o=0;o<s;o++){const a=Math.pow(2,i);e.push(a);let l=1/a;o>r-Li?l=Po[o-r+Li-1]:o===0&&(l=0),n.push(l);const c=1/(a-2),u=-c,h=1+c,f=[u,u,h,u,h,h,u,u,h,h,u,h],m=6,g=6,_=3,p=2,d=1,M=new Float32Array(_*g*m),x=new Float32Array(p*g*m),E=new Float32Array(d*g*m);for(let w=0;w<m;w++){const A=w%3*2/3-1,L=w>2?0:-1,v=[A,L,0,A+2/3,L,0,A+2/3,L+1,0,A,L,0,A+2/3,L+1,0,A,L+1,0];M.set(v,_*g*w),x.set(f,p*g*w);const y=[w,w,w,w,w,w];E.set(y,d*g*w)}const R=new xn;R.setAttribute("position",new gn(M,_)),R.setAttribute("uv",new gn(x,p)),R.setAttribute("faceIndex",new gn(E,d)),t.push(R),i>Li&&i--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Uo(r,t,e){const n=new fi(r,t,e);return n.texture.mapping=306,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Zr(r,t,e,n,i){r.viewport.set(t,e,n,i),r.scissor.set(t,e,n,i)}function Bd(r,t,e){const n=new Float32Array(ri),i=new N(0,1,0);return new di({name:"SphericalGaussianBlur",defines:{n:ri,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Ua(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Fo(){return new di({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ua(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function No(){return new di({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ua(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Ua(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Gd(r){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const l=a.mapping,c=l===303||l===304,u=l===301||l===302;if(c||u)if(a.isRenderTargetTexture&&a.needsPMREMUpdate===!0){a.needsPMREMUpdate=!1;let h=t.get(a);return e===null&&(e=new Io(r)),h=c?e.fromEquirectangular(a,h):e.fromCubemap(a,h),t.set(a,h),h.texture}else{if(t.has(a))return t.get(a).texture;{const h=a.image;if(c&&h&&h.height>0||u&&h&&i(h)){e===null&&(e=new Io(r));const f=c?e.fromEquirectangular(a):e.fromCubemap(a);return t.set(a,f),a.addEventListener("dispose",s),f.texture}else return null}}}return a}function i(a){let l=0;const c=6;for(let u=0;u<c;u++)a[u]!==void 0&&l++;return l===c}function s(a){const l=a.target;l.removeEventListener("dispose",s);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function zd(r){const t={};function e(n){if(t[n]!==void 0)return t[n];let i;switch(n){case"WEBGL_depth_texture":i=r.getExtension("WEBGL_depth_texture")||r.getExtension("MOZ_WEBGL_depth_texture")||r.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=r.getExtension("EXT_texture_filter_anisotropic")||r.getExtension("MOZ_EXT_texture_filter_anisotropic")||r.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=r.getExtension("WEBGL_compressed_texture_s3tc")||r.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=r.getExtension("WEBGL_compressed_texture_pvrtc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=r.getExtension(n)}return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(n){n.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(n){const i=e(n);return i===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function Vd(r,t,e,n){const i={},s=new WeakMap;function o(h){const f=h.target;f.index!==null&&t.remove(f.index);for(const g in f.attributes)t.remove(f.attributes[g]);for(const g in f.morphAttributes){const _=f.morphAttributes[g];for(let p=0,d=_.length;p<d;p++)t.remove(_[p])}f.removeEventListener("dispose",o),delete i[f.id];const m=s.get(f);m&&(t.remove(m),s.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function a(h,f){return i[f.id]===!0||(f.addEventListener("dispose",o),i[f.id]=!0,e.memory.geometries++),f}function l(h){const f=h.attributes;for(const g in f)t.update(f[g],r.ARRAY_BUFFER);const m=h.morphAttributes;for(const g in m){const _=m[g];for(let p=0,d=_.length;p<d;p++)t.update(_[p],r.ARRAY_BUFFER)}}function c(h){const f=[],m=h.index,g=h.attributes.position;let _=0;if(m!==null){const M=m.array;_=m.version;for(let x=0,E=M.length;x<E;x+=3){const R=M[x+0],w=M[x+1],A=M[x+2];f.push(R,w,w,A,A,R)}}else if(g!==void 0){const M=g.array;_=g.version;for(let x=0,E=M.length/3-1;x<E;x+=3){const R=x+0,w=x+1,A=x+2;f.push(R,w,w,A,A,R)}}else return;const p=new(Kl(f)?ec:tc)(f,1);p.version=_;const d=s.get(h);d&&t.remove(d),s.set(h,p)}function u(h){const f=s.get(h);if(f){const m=h.index;m!==null&&f.version<m.version&&c(h)}else c(h);return s.get(h)}return{get:a,update:l,getWireframeAttribute:u}}function Hd(r,t,e,n){const i=n.isWebGL2;let s;function o(m){s=m}let a,l;function c(m){a=m.type,l=m.bytesPerElement}function u(m,g){r.drawElements(s,g,a,m*l),e.update(g,s,1)}function h(m,g,_){if(_===0)return;let p,d;if(i)p=r,d="drawElementsInstanced";else if(p=t.get("ANGLE_instanced_arrays"),d="drawElementsInstancedANGLE",p===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[d](s,g,a,m*l,_),e.update(g,s,_)}function f(m,g,_){if(_===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let d=0;d<_;d++)this.render(m[d]/l,g[d]);else{p.multiDrawElementsWEBGL(s,g,0,a,m,0,_);let d=0;for(let M=0;M<_;M++)d+=g[M];e.update(d,s,1)}}this.setMode=o,this.setIndex=c,this.render=u,this.renderInstances=h,this.renderMultiDraw=f}function kd(r){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,o,a){switch(e.calls++,o){case r.TRIANGLES:e.triangles+=a*(s/3);break;case r.LINES:e.lines+=a*(s/2);break;case r.LINE_STRIP:e.lines+=a*(s-1);break;case r.LINE_LOOP:e.lines+=a*s;break;case r.POINTS:e.points+=a*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function Wd(r,t){return r[0]-t[0]}function Xd(r,t){return Math.abs(t[1])-Math.abs(r[1])}function qd(r,t,e){const n={},i=new Float32Array(8),s=new WeakMap,o=new ve,a=[];for(let c=0;c<8;c++)a[c]=[c,0];function l(c,u,h){const f=c.morphTargetInfluences;if(t.isWebGL2===!0){const g=u.morphAttributes.position||u.morphAttributes.normal||u.morphAttributes.color,_=g!==void 0?g.length:0;let p=s.get(u);if(p===void 0||p.count!==_){let I=function(){q.dispose(),s.delete(u),u.removeEventListener("dispose",I)};var m=I;p!==void 0&&p.texture.dispose();const x=u.morphAttributes.position!==void 0,E=u.morphAttributes.normal!==void 0,R=u.morphAttributes.color!==void 0,w=u.morphAttributes.position||[],A=u.morphAttributes.normal||[],L=u.morphAttributes.color||[];let v=0;x===!0&&(v=1),E===!0&&(v=2),R===!0&&(v=3);let y=u.attributes.position.count*v,U=1;y>t.maxTextureSize&&(U=Math.ceil(y/t.maxTextureSize),y=t.maxTextureSize);const F=new Float32Array(y*U*4*_),q=new $l(F,y,U,_);q.type=1015,q.needsUpdate=!0;const C=v*4;for(let O=0;O<_;O++){const W=w[O],X=A[O],Y=L[O],j=y*U*4*O;for(let tt=0;tt<W.count;tt++){const et=tt*C;x===!0&&(o.fromBufferAttribute(W,tt),F[j+et+0]=o.x,F[j+et+1]=o.y,F[j+et+2]=o.z,F[j+et+3]=0),E===!0&&(o.fromBufferAttribute(X,tt),F[j+et+4]=o.x,F[j+et+5]=o.y,F[j+et+6]=o.z,F[j+et+7]=0),R===!0&&(o.fromBufferAttribute(Y,tt),F[j+et+8]=o.x,F[j+et+9]=o.y,F[j+et+10]=o.z,F[j+et+11]=Y.itemSize===4?o.w:1)}}p={count:_,texture:q,size:new Vt(y,U)},s.set(u,p),u.addEventListener("dispose",I)}let d=0;for(let x=0;x<f.length;x++)d+=f[x];const M=u.morphTargetsRelative?1:1-d;h.getUniforms().setValue(r,"morphTargetBaseInfluence",M),h.getUniforms().setValue(r,"morphTargetInfluences",f),h.getUniforms().setValue(r,"morphTargetsTexture",p.texture,e),h.getUniforms().setValue(r,"morphTargetsTextureSize",p.size)}else{const g=f===void 0?0:f.length;let _=n[u.id];if(_===void 0||_.length!==g){_=[];for(let E=0;E<g;E++)_[E]=[E,0];n[u.id]=_}for(let E=0;E<g;E++){const R=_[E];R[0]=E,R[1]=f[E]}_.sort(Xd);for(let E=0;E<8;E++)E<g&&_[E][1]?(a[E][0]=_[E][0],a[E][1]=_[E][1]):(a[E][0]=Number.MAX_SAFE_INTEGER,a[E][1]=0);a.sort(Wd);const p=u.morphAttributes.position,d=u.morphAttributes.normal;let M=0;for(let E=0;E<8;E++){const R=a[E],w=R[0],A=R[1];w!==Number.MAX_SAFE_INTEGER&&A?(p&&u.getAttribute("morphTarget"+E)!==p[w]&&u.setAttribute("morphTarget"+E,p[w]),d&&u.getAttribute("morphNormal"+E)!==d[w]&&u.setAttribute("morphNormal"+E,d[w]),i[E]=A,M+=A):(p&&u.hasAttribute("morphTarget"+E)===!0&&u.deleteAttribute("morphTarget"+E),d&&u.hasAttribute("morphNormal"+E)===!0&&u.deleteAttribute("morphNormal"+E),i[E]=0)}const x=u.morphTargetsRelative?1:1-M;h.getUniforms().setValue(r,"morphTargetBaseInfluence",x),h.getUniforms().setValue(r,"morphTargetInfluences",i)}}return{update:l}}function Yd(r,t,e,n){let i=new WeakMap;function s(l){const c=n.render.frame,u=l.geometry,h=t.get(l,u);if(i.get(h)!==c&&(t.update(h),i.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),i.get(l)!==c&&(e.update(l.instanceMatrix,r.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,r.ARRAY_BUFFER),i.set(l,c))),l.isSkinnedMesh){const f=l.skeleton;i.get(f)!==c&&(f.update(),i.set(f,c))}return h}function o(){i=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:s,dispose:o}}class oc extends je{constructor(t,e,n,i,s,o,a,l,c,u){if(u=u!==void 0?u:1026,u!==1026&&u!==1027)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&u===1026&&(n=1014),n===void 0&&u===1027&&(n=1020),super(null,i,s,o,a,l,u,n,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:1003,this.minFilter=l!==void 0?l:1003,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const lc=new je,cc=new oc(1,1);cc.compareFunction=515;const uc=new $l,hc=new Cu,fc=new rc,Oo=[],Bo=[],Go=new Float32Array(16),zo=new Float32Array(9),Vo=new Float32Array(4);function Zi(r,t,e){const n=r[0];if(n<=0||n>0)return r;const i=t*e;let s=Oo[i];if(s===void 0&&(s=new Float32Array(i),Oo[i]=s),t!==0){n.toArray(s,0);for(let o=1,a=0;o!==t;++o)a+=e,r[o].toArray(s,a)}return s}function de(r,t){if(r.length!==t.length)return!1;for(let e=0,n=r.length;e<n;e++)if(r[e]!==t[e])return!1;return!0}function pe(r,t){for(let e=0,n=t.length;e<n;e++)r[e]=t[e]}function _s(r,t){let e=Bo[t];e===void 0&&(e=new Int32Array(t),Bo[t]=e);for(let n=0;n!==t;++n)e[n]=r.allocateTextureUnit();return e}function Kd(r,t){const e=this.cache;e[0]!==t&&(r.uniform1f(this.addr,t),e[0]=t)}function jd(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(r.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(de(e,t))return;r.uniform2fv(this.addr,t),pe(e,t)}}function Zd(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(r.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(r.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(de(e,t))return;r.uniform3fv(this.addr,t),pe(e,t)}}function $d(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(r.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(de(e,t))return;r.uniform4fv(this.addr,t),pe(e,t)}}function Jd(r,t){const e=this.cache,n=t.elements;if(n===void 0){if(de(e,t))return;r.uniformMatrix2fv(this.addr,!1,t),pe(e,t)}else{if(de(e,n))return;Vo.set(n),r.uniformMatrix2fv(this.addr,!1,Vo),pe(e,n)}}function Qd(r,t){const e=this.cache,n=t.elements;if(n===void 0){if(de(e,t))return;r.uniformMatrix3fv(this.addr,!1,t),pe(e,t)}else{if(de(e,n))return;zo.set(n),r.uniformMatrix3fv(this.addr,!1,zo),pe(e,n)}}function tp(r,t){const e=this.cache,n=t.elements;if(n===void 0){if(de(e,t))return;r.uniformMatrix4fv(this.addr,!1,t),pe(e,t)}else{if(de(e,n))return;Go.set(n),r.uniformMatrix4fv(this.addr,!1,Go),pe(e,n)}}function ep(r,t){const e=this.cache;e[0]!==t&&(r.uniform1i(this.addr,t),e[0]=t)}function np(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(r.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(de(e,t))return;r.uniform2iv(this.addr,t),pe(e,t)}}function ip(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(r.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(de(e,t))return;r.uniform3iv(this.addr,t),pe(e,t)}}function rp(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(r.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(de(e,t))return;r.uniform4iv(this.addr,t),pe(e,t)}}function sp(r,t){const e=this.cache;e[0]!==t&&(r.uniform1ui(this.addr,t),e[0]=t)}function ap(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(r.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(de(e,t))return;r.uniform2uiv(this.addr,t),pe(e,t)}}function op(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(r.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(de(e,t))return;r.uniform3uiv(this.addr,t),pe(e,t)}}function lp(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(r.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(de(e,t))return;r.uniform4uiv(this.addr,t),pe(e,t)}}function cp(r,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i);const s=this.type===r.SAMPLER_2D_SHADOW?cc:lc;e.setTexture2D(t||s,i)}function up(r,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||hc,i)}function hp(r,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),e.setTextureCube(t||fc,i)}function fp(r,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||uc,i)}function dp(r){switch(r){case 5126:return Kd;case 35664:return jd;case 35665:return Zd;case 35666:return $d;case 35674:return Jd;case 35675:return Qd;case 35676:return tp;case 5124:case 35670:return ep;case 35667:case 35671:return np;case 35668:case 35672:return ip;case 35669:case 35673:return rp;case 5125:return sp;case 36294:return ap;case 36295:return op;case 36296:return lp;case 35678:case 36198:case 36298:case 36306:case 35682:return cp;case 35679:case 36299:case 36307:return up;case 35680:case 36300:case 36308:case 36293:return hp;case 36289:case 36303:case 36311:case 36292:return fp}}function pp(r,t){r.uniform1fv(this.addr,t)}function mp(r,t){const e=Zi(t,this.size,2);r.uniform2fv(this.addr,e)}function _p(r,t){const e=Zi(t,this.size,3);r.uniform3fv(this.addr,e)}function gp(r,t){const e=Zi(t,this.size,4);r.uniform4fv(this.addr,e)}function vp(r,t){const e=Zi(t,this.size,4);r.uniformMatrix2fv(this.addr,!1,e)}function xp(r,t){const e=Zi(t,this.size,9);r.uniformMatrix3fv(this.addr,!1,e)}function Mp(r,t){const e=Zi(t,this.size,16);r.uniformMatrix4fv(this.addr,!1,e)}function Sp(r,t){r.uniform1iv(this.addr,t)}function Ep(r,t){r.uniform2iv(this.addr,t)}function Tp(r,t){r.uniform3iv(this.addr,t)}function yp(r,t){r.uniform4iv(this.addr,t)}function Ap(r,t){r.uniform1uiv(this.addr,t)}function bp(r,t){r.uniform2uiv(this.addr,t)}function wp(r,t){r.uniform3uiv(this.addr,t)}function Rp(r,t){r.uniform4uiv(this.addr,t)}function Cp(r,t,e){const n=this.cache,i=t.length,s=_s(e,i);de(n,s)||(r.uniform1iv(this.addr,s),pe(n,s));for(let o=0;o!==i;++o)e.setTexture2D(t[o]||lc,s[o])}function Pp(r,t,e){const n=this.cache,i=t.length,s=_s(e,i);de(n,s)||(r.uniform1iv(this.addr,s),pe(n,s));for(let o=0;o!==i;++o)e.setTexture3D(t[o]||hc,s[o])}function Lp(r,t,e){const n=this.cache,i=t.length,s=_s(e,i);de(n,s)||(r.uniform1iv(this.addr,s),pe(n,s));for(let o=0;o!==i;++o)e.setTextureCube(t[o]||fc,s[o])}function Dp(r,t,e){const n=this.cache,i=t.length,s=_s(e,i);de(n,s)||(r.uniform1iv(this.addr,s),pe(n,s));for(let o=0;o!==i;++o)e.setTexture2DArray(t[o]||uc,s[o])}function Ip(r){switch(r){case 5126:return pp;case 35664:return mp;case 35665:return _p;case 35666:return gp;case 35674:return vp;case 35675:return xp;case 35676:return Mp;case 5124:case 35670:return Sp;case 35667:case 35671:return Ep;case 35668:case 35672:return Tp;case 35669:case 35673:return yp;case 5125:return Ap;case 36294:return bp;case 36295:return wp;case 36296:return Rp;case 35678:case 36198:case 36298:case 36306:case 35682:return Cp;case 35679:case 36299:case 36307:return Pp;case 35680:case 36300:case 36308:case 36293:return Lp;case 36289:case 36303:case 36311:case 36292:return Dp}}class Up{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=dp(e.type)}}class Fp{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Ip(e.type)}}class Np{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const i=this.seq;for(let s=0,o=i.length;s!==o;++s){const a=i[s];a.setValue(t,e[a.id],n)}}}const Zs=/(\w+)(\])?(\[|\.)?/g;function Ho(r,t){r.seq.push(t),r.map[t.id]=t}function Op(r,t,e){const n=r.name,i=n.length;for(Zs.lastIndex=0;;){const s=Zs.exec(n),o=Zs.lastIndex;let a=s[1];const l=s[2]==="]",c=s[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===i){Ho(e,c===void 0?new Up(a,r,t):new Fp(a,r,t));break}else{let h=e.map[a];h===void 0&&(h=new Np(a),Ho(e,h)),e=h}}}class Qr{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const s=t.getActiveUniform(e,i),o=t.getUniformLocation(e,s.name);Op(s,o,this)}}setValue(t,e,n,i){const s=this.map[e];s!==void 0&&s.setValue(t,n,i)}setOptional(t,e,n){const i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let s=0,o=e.length;s!==o;++s){const a=e[s],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,i)}}static seqWithValue(t,e){const n=[];for(let i=0,s=t.length;i!==s;++i){const o=t[i];o.id in e&&n.push(o)}return n}}function ko(r,t,e){const n=r.createShader(t);return r.shaderSource(n,e),r.compileShader(n),n}const Bp=37297;let Gp=0;function zp(r,t){const e=r.split(`
`),n=[],i=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let o=i;o<s;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}function Vp(r){const t=Xt.getPrimaries(Xt.workingColorSpace),e=Xt.getPrimaries(r);let n;switch(t===e?n="":t===ss&&e===rs?n="LinearDisplayP3ToLinearSRGB":t===rs&&e===ss&&(n="LinearSRGBToLinearDisplayP3"),r){case Rn:case ps:return[n,"LinearTransferOETF"];case Me:case Pa:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",r),[n,"LinearTransferOETF"]}}function Wo(r,t,e){const n=r.getShaderParameter(t,r.COMPILE_STATUS),i=r.getShaderInfoLog(t).trim();if(n&&i==="")return"";const s=/ERROR: 0:(\d+)/.exec(i);if(s){const o=parseInt(s[1]);return e.toUpperCase()+`

`+i+`

`+zp(r.getShaderSource(t),o)}else return i}function Hp(r,t){const e=Vp(t);return`vec4 ${r}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function kp(r,t){let e;switch(t){case 1:e="Linear";break;case 2:e="Reinhard";break;case 3:e="OptimizedCineon";break;case 4:e="ACESFilmic";break;case 6:e="AgX";break;case 5:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+r+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function Wp(r){return[r.extensionDerivatives||r.envMapCubeUVHeight||r.bumpMap||r.normalMapTangentSpace||r.clearcoatNormalMap||r.flatShading||r.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(r.extensionFragDepth||r.logarithmicDepthBuffer)&&r.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",r.extensionDrawBuffers&&r.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(r.extensionShaderTextureLOD||r.envMap||r.transmission)&&r.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Di).join(`
`)}function Xp(r){return[r.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(Di).join(`
`)}function qp(r){const t=[];for(const e in r){const n=r[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Yp(r,t){const e={},n=r.getProgramParameter(t,r.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const s=r.getActiveAttrib(t,i),o=s.name;let a=1;s.type===r.FLOAT_MAT2&&(a=2),s.type===r.FLOAT_MAT3&&(a=3),s.type===r.FLOAT_MAT4&&(a=4),e[o]={type:s.type,location:r.getAttribLocation(t,o),locationSize:a}}return e}function Di(r){return r!==""}function Xo(r,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return r.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function qo(r,t){return r.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Kp=/^[ \t]*#include +<([\w\d./]+)>/gm;function pa(r){return r.replace(Kp,Zp)}const jp=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function Zp(r,t){let e=Lt[t];if(e===void 0){const n=jp.get(t);if(n!==void 0)e=Lt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return pa(e)}const $p=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Yo(r){return r.replace($p,Jp)}function Jp(r,t,e,n){let i="";for(let s=parseInt(t);s<parseInt(e);s++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return i}function Ko(r){let t="precision "+r.precision+` float;
precision `+r.precision+" int;";return r.precision==="highp"?t+=`
#define HIGH_PRECISION`:r.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:r.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function Qp(r){let t="SHADOWMAP_TYPE_BASIC";return r.shadowMapType===1?t="SHADOWMAP_TYPE_PCF":r.shadowMapType===2?t="SHADOWMAP_TYPE_PCF_SOFT":r.shadowMapType===3&&(t="SHADOWMAP_TYPE_VSM"),t}function tm(r){let t="ENVMAP_TYPE_CUBE";if(r.envMap)switch(r.envMapMode){case 301:case 302:t="ENVMAP_TYPE_CUBE";break;case 306:t="ENVMAP_TYPE_CUBE_UV";break}return t}function em(r){let t="ENVMAP_MODE_REFLECTION";if(r.envMap)switch(r.envMapMode){case 302:t="ENVMAP_MODE_REFRACTION";break}return t}function nm(r){let t="ENVMAP_BLENDING_NONE";if(r.envMap)switch(r.combine){case 0:t="ENVMAP_BLENDING_MULTIPLY";break;case 1:t="ENVMAP_BLENDING_MIX";break;case 2:t="ENVMAP_BLENDING_ADD";break}return t}function im(r){const t=r.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function rm(r,t,e,n){const i=r.getContext(),s=e.defines;let o=e.vertexShader,a=e.fragmentShader;const l=Qp(e),c=tm(e),u=em(e),h=nm(e),f=im(e),m=e.isWebGL2?"":Wp(e),g=Xp(e),_=qp(s),p=i.createProgram();let d,M,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(d=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(Di).join(`
`),d.length>0&&(d+=`
`),M=[m,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(Di).join(`
`),M.length>0&&(M+=`
`)):(d=[Ko(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+u:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Di).join(`
`),M=[m,Ko(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+u:"",e.envMap?"#define "+h:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==0?"#define TONE_MAPPING":"",e.toneMapping!==0?Lt.tonemapping_pars_fragment:"",e.toneMapping!==0?kp("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Lt.colorspace_pars_fragment,Hp("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Di).join(`
`)),o=pa(o),o=Xo(o,e),o=qo(o,e),a=pa(a),a=Xo(a,e),a=qo(a,e),o=Yo(o),a=Yo(a),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,d=[g,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+d,M=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===ho?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===ho?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+M);const E=x+d+o,R=x+M+a,w=ko(i,i.VERTEX_SHADER,E),A=ko(i,i.FRAGMENT_SHADER,R);i.attachShader(p,w),i.attachShader(p,A),e.index0AttributeName!==void 0?i.bindAttribLocation(p,0,e.index0AttributeName):e.morphTargets===!0&&i.bindAttribLocation(p,0,"position"),i.linkProgram(p);function L(F){if(r.debug.checkShaderErrors){const q=i.getProgramInfoLog(p).trim(),C=i.getShaderInfoLog(w).trim(),I=i.getShaderInfoLog(A).trim();let O=!0,W=!0;if(i.getProgramParameter(p,i.LINK_STATUS)===!1)if(O=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(i,p,w,A);else{const X=Wo(i,w,"vertex"),Y=Wo(i,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(p,i.VALIDATE_STATUS)+`

Program Info Log: `+q+`
`+X+`
`+Y)}else q!==""?console.warn("THREE.WebGLProgram: Program Info Log:",q):(C===""||I==="")&&(W=!1);W&&(F.diagnostics={runnable:O,programLog:q,vertexShader:{log:C,prefix:d},fragmentShader:{log:I,prefix:M}})}i.deleteShader(w),i.deleteShader(A),v=new Qr(i,p),y=Yp(i,p)}let v;this.getUniforms=function(){return v===void 0&&L(this),v};let y;this.getAttributes=function(){return y===void 0&&L(this),y};let U=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return U===!1&&(U=i.getProgramParameter(p,Bp)),U},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(p),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Gp++,this.cacheKey=t,this.usedTimes=1,this.program=p,this.vertexShader=w,this.fragmentShader=A,this}let sm=0;class am{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,i=this._getShaderStage(e),s=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(i)===!1&&(o.add(i),i.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new om(t),e.set(t,n)),n}}class om{constructor(t){this.id=sm++,this.code=t,this.usedTimes=0}}function lm(r,t,e,n,i,s,o){const a=new Jl,l=new am,c=[],u=i.isWebGL2,h=i.logarithmicDepthBuffer,f=i.vertexTextures;let m=i.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(v){return v===0?"uv":`uv${v}`}function p(v,y,U,F,q){const C=F.fog,I=q.geometry,O=v.isMeshStandardMaterial?F.environment:null,W=(v.isMeshStandardMaterial?e:t).get(v.envMap||O),X=W&&W.mapping===306?W.image.height:null,Y=g[v.type];v.precision!==null&&(m=i.getMaxPrecision(v.precision),m!==v.precision&&console.warn("THREE.WebGLProgram.getParameters:",v.precision,"not supported, using",m,"instead."));const j=I.morphAttributes.position||I.morphAttributes.normal||I.morphAttributes.color,tt=j!==void 0?j.length:0;let et=0;I.morphAttributes.position!==void 0&&(et=1),I.morphAttributes.normal!==void 0&&(et=2),I.morphAttributes.color!==void 0&&(et=3);let k,K,rt,mt;if(Y){const Le=pn[Y];k=Le.vertexShader,K=Le.fragmentShader}else k=v.vertexShader,K=v.fragmentShader,l.update(v),rt=l.getVertexShaderID(v),mt=l.getFragmentShaderID(v);const pt=r.getRenderTarget(),wt=q.isInstancedMesh===!0,Ct=q.isBatchedMesh===!0,St=!!v.map,zt=!!v.matcap,B=!!W,Pe=!!v.aoMap,gt=!!v.lightMap,At=!!v.bumpMap,ht=!!v.normalMap,Qt=!!v.displacementMap,Dt=!!v.emissiveMap,b=!!v.metalnessMap,S=!!v.roughnessMap,z=v.anisotropy>0,J=v.clearcoat>0,$=v.iridescence>0,Q=v.sheen>0,ft=v.transmission>0,ot=z&&!!v.anisotropyMap,ct=J&&!!v.clearcoatMap,Mt=J&&!!v.clearcoatNormalMap,It=J&&!!v.clearcoatRoughnessMap,Z=$&&!!v.iridescenceMap,Wt=$&&!!v.iridescenceThicknessMap,Bt=Q&&!!v.sheenColorMap,yt=Q&&!!v.sheenRoughnessMap,_t=!!v.specularMap,ut=!!v.specularColorMap,Pt=!!v.specularIntensityMap,kt=ft&&!!v.transmissionMap,re=ft&&!!v.thicknessMap,Ft=!!v.gradientMap,nt=!!v.alphaMap,P=v.alphaTest>0,st=!!v.alphaHash,at=!!v.extensions,Et=!!I.attributes.uv1,vt=!!I.attributes.uv2,Kt=!!I.attributes.uv3;let jt=0;return v.toneMapped&&(pt===null||pt.isXRRenderTarget===!0)&&(jt=r.toneMapping),{isWebGL2:u,shaderID:Y,shaderType:v.type,shaderName:v.name,vertexShader:k,fragmentShader:K,defines:v.defines,customVertexShaderID:rt,customFragmentShaderID:mt,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:m,batching:Ct,instancing:wt,instancingColor:wt&&q.instanceColor!==null,supportsVertexTextures:f,outputColorSpace:pt===null?r.outputColorSpace:pt.isXRRenderTarget===!0?pt.texture.colorSpace:Rn,map:St,matcap:zt,envMap:B,envMapMode:B&&W.mapping,envMapCubeUVHeight:X,aoMap:Pe,lightMap:gt,bumpMap:At,normalMap:ht,displacementMap:f&&Qt,emissiveMap:Dt,normalMapObjectSpace:ht&&v.normalMapType===1,normalMapTangentSpace:ht&&v.normalMapType===0,metalnessMap:b,roughnessMap:S,anisotropy:z,anisotropyMap:ot,clearcoat:J,clearcoatMap:ct,clearcoatNormalMap:Mt,clearcoatRoughnessMap:It,iridescence:$,iridescenceMap:Z,iridescenceThicknessMap:Wt,sheen:Q,sheenColorMap:Bt,sheenRoughnessMap:yt,specularMap:_t,specularColorMap:ut,specularIntensityMap:Pt,transmission:ft,transmissionMap:kt,thicknessMap:re,gradientMap:Ft,opaque:v.transparent===!1&&v.blending===1,alphaMap:nt,alphaTest:P,alphaHash:st,combine:v.combine,mapUv:St&&_(v.map.channel),aoMapUv:Pe&&_(v.aoMap.channel),lightMapUv:gt&&_(v.lightMap.channel),bumpMapUv:At&&_(v.bumpMap.channel),normalMapUv:ht&&_(v.normalMap.channel),displacementMapUv:Qt&&_(v.displacementMap.channel),emissiveMapUv:Dt&&_(v.emissiveMap.channel),metalnessMapUv:b&&_(v.metalnessMap.channel),roughnessMapUv:S&&_(v.roughnessMap.channel),anisotropyMapUv:ot&&_(v.anisotropyMap.channel),clearcoatMapUv:ct&&_(v.clearcoatMap.channel),clearcoatNormalMapUv:Mt&&_(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:It&&_(v.clearcoatRoughnessMap.channel),iridescenceMapUv:Z&&_(v.iridescenceMap.channel),iridescenceThicknessMapUv:Wt&&_(v.iridescenceThicknessMap.channel),sheenColorMapUv:Bt&&_(v.sheenColorMap.channel),sheenRoughnessMapUv:yt&&_(v.sheenRoughnessMap.channel),specularMapUv:_t&&_(v.specularMap.channel),specularColorMapUv:ut&&_(v.specularColorMap.channel),specularIntensityMapUv:Pt&&_(v.specularIntensityMap.channel),transmissionMapUv:kt&&_(v.transmissionMap.channel),thicknessMapUv:re&&_(v.thicknessMap.channel),alphaMapUv:nt&&_(v.alphaMap.channel),vertexTangents:!!I.attributes.tangent&&(ht||z),vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!I.attributes.color&&I.attributes.color.itemSize===4,vertexUv1s:Et,vertexUv2s:vt,vertexUv3s:Kt,pointsUvs:q.isPoints===!0&&!!I.attributes.uv&&(St||nt),fog:!!C,useFog:v.fog===!0,fogExp2:C&&C.isFogExp2,flatShading:v.flatShading===!0,sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:h,skinning:q.isSkinnedMesh===!0,morphTargets:I.morphAttributes.position!==void 0,morphNormals:I.morphAttributes.normal!==void 0,morphColors:I.morphAttributes.color!==void 0,morphTargetsCount:tt,morphTextureStride:et,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:v.dithering,shadowMapEnabled:r.shadowMap.enabled&&U.length>0,shadowMapType:r.shadowMap.type,toneMapping:jt,useLegacyLights:r._useLegacyLights,decodeVideoTexture:St&&v.map.isVideoTexture===!0&&Xt.getTransfer(v.map.colorSpace)===$t,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===2,flipSided:v.side===1,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionDerivatives:at&&v.extensions.derivatives===!0,extensionFragDepth:at&&v.extensions.fragDepth===!0,extensionDrawBuffers:at&&v.extensions.drawBuffers===!0,extensionShaderTextureLOD:at&&v.extensions.shaderTextureLOD===!0,extensionClipCullDistance:at&&v.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:u||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:u||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:u||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()}}function d(v){const y=[];if(v.shaderID?y.push(v.shaderID):(y.push(v.customVertexShaderID),y.push(v.customFragmentShaderID)),v.defines!==void 0)for(const U in v.defines)y.push(U),y.push(v.defines[U]);return v.isRawShaderMaterial===!1&&(M(y,v),x(y,v),y.push(r.outputColorSpace)),y.push(v.customProgramCacheKey),y.join()}function M(v,y){v.push(y.precision),v.push(y.outputColorSpace),v.push(y.envMapMode),v.push(y.envMapCubeUVHeight),v.push(y.mapUv),v.push(y.alphaMapUv),v.push(y.lightMapUv),v.push(y.aoMapUv),v.push(y.bumpMapUv),v.push(y.normalMapUv),v.push(y.displacementMapUv),v.push(y.emissiveMapUv),v.push(y.metalnessMapUv),v.push(y.roughnessMapUv),v.push(y.anisotropyMapUv),v.push(y.clearcoatMapUv),v.push(y.clearcoatNormalMapUv),v.push(y.clearcoatRoughnessMapUv),v.push(y.iridescenceMapUv),v.push(y.iridescenceThicknessMapUv),v.push(y.sheenColorMapUv),v.push(y.sheenRoughnessMapUv),v.push(y.specularMapUv),v.push(y.specularColorMapUv),v.push(y.specularIntensityMapUv),v.push(y.transmissionMapUv),v.push(y.thicknessMapUv),v.push(y.combine),v.push(y.fogExp2),v.push(y.sizeAttenuation),v.push(y.morphTargetsCount),v.push(y.morphAttributeCount),v.push(y.numDirLights),v.push(y.numPointLights),v.push(y.numSpotLights),v.push(y.numSpotLightMaps),v.push(y.numHemiLights),v.push(y.numRectAreaLights),v.push(y.numDirLightShadows),v.push(y.numPointLightShadows),v.push(y.numSpotLightShadows),v.push(y.numSpotLightShadowsWithMaps),v.push(y.numLightProbes),v.push(y.shadowMapType),v.push(y.toneMapping),v.push(y.numClippingPlanes),v.push(y.numClipIntersection),v.push(y.depthPacking)}function x(v,y){a.disableAll(),y.isWebGL2&&a.enable(0),y.supportsVertexTextures&&a.enable(1),y.instancing&&a.enable(2),y.instancingColor&&a.enable(3),y.matcap&&a.enable(4),y.envMap&&a.enable(5),y.normalMapObjectSpace&&a.enable(6),y.normalMapTangentSpace&&a.enable(7),y.clearcoat&&a.enable(8),y.iridescence&&a.enable(9),y.alphaTest&&a.enable(10),y.vertexColors&&a.enable(11),y.vertexAlphas&&a.enable(12),y.vertexUv1s&&a.enable(13),y.vertexUv2s&&a.enable(14),y.vertexUv3s&&a.enable(15),y.vertexTangents&&a.enable(16),y.anisotropy&&a.enable(17),y.alphaHash&&a.enable(18),y.batching&&a.enable(19),v.push(a.mask),a.disableAll(),y.fog&&a.enable(0),y.useFog&&a.enable(1),y.flatShading&&a.enable(2),y.logarithmicDepthBuffer&&a.enable(3),y.skinning&&a.enable(4),y.morphTargets&&a.enable(5),y.morphNormals&&a.enable(6),y.morphColors&&a.enable(7),y.premultipliedAlpha&&a.enable(8),y.shadowMapEnabled&&a.enable(9),y.useLegacyLights&&a.enable(10),y.doubleSided&&a.enable(11),y.flipSided&&a.enable(12),y.useDepthPacking&&a.enable(13),y.dithering&&a.enable(14),y.transmission&&a.enable(15),y.sheen&&a.enable(16),y.opaque&&a.enable(17),y.pointsUvs&&a.enable(18),y.decodeVideoTexture&&a.enable(19),v.push(a.mask)}function E(v){const y=g[v.type];let U;if(y){const F=pn[y];U=ku.clone(F.uniforms)}else U=v.uniforms;return U}function R(v,y){let U;for(let F=0,q=c.length;F<q;F++){const C=c[F];if(C.cacheKey===y){U=C,++U.usedTimes;break}}return U===void 0&&(U=new rm(r,y,v,s),c.push(U)),U}function w(v){if(--v.usedTimes===0){const y=c.indexOf(v);c[y]=c[c.length-1],c.pop(),v.destroy()}}function A(v){l.remove(v)}function L(){l.dispose()}return{getParameters:p,getProgramCacheKey:d,getUniforms:E,acquireProgram:R,releaseProgram:w,releaseShaderCache:A,programs:c,dispose:L}}function cm(){let r=new WeakMap;function t(s){let o=r.get(s);return o===void 0&&(o={},r.set(s,o)),o}function e(s){r.delete(s)}function n(s,o,a){r.get(s)[o]=a}function i(){r=new WeakMap}return{get:t,remove:e,update:n,dispose:i}}function um(r,t){return r.groupOrder!==t.groupOrder?r.groupOrder-t.groupOrder:r.renderOrder!==t.renderOrder?r.renderOrder-t.renderOrder:r.material.id!==t.material.id?r.material.id-t.material.id:r.z!==t.z?r.z-t.z:r.id-t.id}function jo(r,t){return r.groupOrder!==t.groupOrder?r.groupOrder-t.groupOrder:r.renderOrder!==t.renderOrder?r.renderOrder-t.renderOrder:r.z!==t.z?t.z-r.z:r.id-t.id}function Zo(){const r=[];let t=0;const e=[],n=[],i=[];function s(){t=0,e.length=0,n.length=0,i.length=0}function o(h,f,m,g,_,p){let d=r[t];return d===void 0?(d={id:h.id,object:h,geometry:f,material:m,groupOrder:g,renderOrder:h.renderOrder,z:_,group:p},r[t]=d):(d.id=h.id,d.object=h,d.geometry=f,d.material=m,d.groupOrder=g,d.renderOrder=h.renderOrder,d.z=_,d.group=p),t++,d}function a(h,f,m,g,_,p){const d=o(h,f,m,g,_,p);m.transmission>0?n.push(d):m.transparent===!0?i.push(d):e.push(d)}function l(h,f,m,g,_,p){const d=o(h,f,m,g,_,p);m.transmission>0?n.unshift(d):m.transparent===!0?i.unshift(d):e.unshift(d)}function c(h,f){e.length>1&&e.sort(h||um),n.length>1&&n.sort(f||jo),i.length>1&&i.sort(f||jo)}function u(){for(let h=t,f=r.length;h<f;h++){const m=r[h];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:e,transmissive:n,transparent:i,init:s,push:a,unshift:l,finish:u,sort:c}}function hm(){let r=new WeakMap;function t(n,i){const s=r.get(n);let o;return s===void 0?(o=new Zo,r.set(n,[o])):i>=s.length?(o=new Zo,s.push(o)):o=s[i],o}function e(){r=new WeakMap}return{get:t,dispose:e}}function fm(){const r={};return{get:function(t){if(r[t.id]!==void 0)return r[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new N,color:new Ht};break;case"SpotLight":e={position:new N,direction:new N,color:new Ht,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new N,color:new Ht,distance:0,decay:0};break;case"HemisphereLight":e={direction:new N,skyColor:new Ht,groundColor:new Ht};break;case"RectAreaLight":e={color:new Ht,position:new N,halfWidth:new N,halfHeight:new N};break}return r[t.id]=e,e}}}function dm(){const r={};return{get:function(t){if(r[t.id]!==void 0)return r[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Vt};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Vt};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Vt,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[t.id]=e,e}}}let pm=0;function mm(r,t){return(t.castShadow?2:0)-(r.castShadow?2:0)+(t.map?1:0)-(r.map?1:0)}function _m(r,t){const e=new fm,n=dm(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let u=0;u<9;u++)i.probe.push(new N);const s=new N,o=new fe,a=new fe;function l(u,h){let f=0,m=0,g=0;for(let F=0;F<9;F++)i.probe[F].set(0,0,0);let _=0,p=0,d=0,M=0,x=0,E=0,R=0,w=0,A=0,L=0,v=0;u.sort(mm);const y=h===!0?Math.PI:1;for(let F=0,q=u.length;F<q;F++){const C=u[F],I=C.color,O=C.intensity,W=C.distance,X=C.shadow&&C.shadow.map?C.shadow.map.texture:null;if(C.isAmbientLight)f+=I.r*O*y,m+=I.g*O*y,g+=I.b*O*y;else if(C.isLightProbe){for(let Y=0;Y<9;Y++)i.probe[Y].addScaledVector(C.sh.coefficients[Y],O);v++}else if(C.isDirectionalLight){const Y=e.get(C);if(Y.color.copy(C.color).multiplyScalar(C.intensity*y),C.castShadow){const j=C.shadow,tt=n.get(C);tt.shadowBias=j.bias,tt.shadowNormalBias=j.normalBias,tt.shadowRadius=j.radius,tt.shadowMapSize=j.mapSize,i.directionalShadow[_]=tt,i.directionalShadowMap[_]=X,i.directionalShadowMatrix[_]=C.shadow.matrix,E++}i.directional[_]=Y,_++}else if(C.isSpotLight){const Y=e.get(C);Y.position.setFromMatrixPosition(C.matrixWorld),Y.color.copy(I).multiplyScalar(O*y),Y.distance=W,Y.coneCos=Math.cos(C.angle),Y.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),Y.decay=C.decay,i.spot[d]=Y;const j=C.shadow;if(C.map&&(i.spotLightMap[A]=C.map,A++,j.updateMatrices(C),C.castShadow&&L++),i.spotLightMatrix[d]=j.matrix,C.castShadow){const tt=n.get(C);tt.shadowBias=j.bias,tt.shadowNormalBias=j.normalBias,tt.shadowRadius=j.radius,tt.shadowMapSize=j.mapSize,i.spotShadow[d]=tt,i.spotShadowMap[d]=X,w++}d++}else if(C.isRectAreaLight){const Y=e.get(C);Y.color.copy(I).multiplyScalar(O),Y.halfWidth.set(C.width*.5,0,0),Y.halfHeight.set(0,C.height*.5,0),i.rectArea[M]=Y,M++}else if(C.isPointLight){const Y=e.get(C);if(Y.color.copy(C.color).multiplyScalar(C.intensity*y),Y.distance=C.distance,Y.decay=C.decay,C.castShadow){const j=C.shadow,tt=n.get(C);tt.shadowBias=j.bias,tt.shadowNormalBias=j.normalBias,tt.shadowRadius=j.radius,tt.shadowMapSize=j.mapSize,tt.shadowCameraNear=j.camera.near,tt.shadowCameraFar=j.camera.far,i.pointShadow[p]=tt,i.pointShadowMap[p]=X,i.pointShadowMatrix[p]=C.shadow.matrix,R++}i.point[p]=Y,p++}else if(C.isHemisphereLight){const Y=e.get(C);Y.skyColor.copy(C.color).multiplyScalar(O*y),Y.groundColor.copy(C.groundColor).multiplyScalar(O*y),i.hemi[x]=Y,x++}}M>0&&(t.isWebGL2?r.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=it.LTC_FLOAT_1,i.rectAreaLTC2=it.LTC_FLOAT_2):(i.rectAreaLTC1=it.LTC_HALF_1,i.rectAreaLTC2=it.LTC_HALF_2):r.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=it.LTC_FLOAT_1,i.rectAreaLTC2=it.LTC_FLOAT_2):r.has("OES_texture_half_float_linear")===!0?(i.rectAreaLTC1=it.LTC_HALF_1,i.rectAreaLTC2=it.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),i.ambient[0]=f,i.ambient[1]=m,i.ambient[2]=g;const U=i.hash;(U.directionalLength!==_||U.pointLength!==p||U.spotLength!==d||U.rectAreaLength!==M||U.hemiLength!==x||U.numDirectionalShadows!==E||U.numPointShadows!==R||U.numSpotShadows!==w||U.numSpotMaps!==A||U.numLightProbes!==v)&&(i.directional.length=_,i.spot.length=d,i.rectArea.length=M,i.point.length=p,i.hemi.length=x,i.directionalShadow.length=E,i.directionalShadowMap.length=E,i.pointShadow.length=R,i.pointShadowMap.length=R,i.spotShadow.length=w,i.spotShadowMap.length=w,i.directionalShadowMatrix.length=E,i.pointShadowMatrix.length=R,i.spotLightMatrix.length=w+A-L,i.spotLightMap.length=A,i.numSpotLightShadowsWithMaps=L,i.numLightProbes=v,U.directionalLength=_,U.pointLength=p,U.spotLength=d,U.rectAreaLength=M,U.hemiLength=x,U.numDirectionalShadows=E,U.numPointShadows=R,U.numSpotShadows=w,U.numSpotMaps=A,U.numLightProbes=v,i.version=pm++)}function c(u,h){let f=0,m=0,g=0,_=0,p=0;const d=h.matrixWorldInverse;for(let M=0,x=u.length;M<x;M++){const E=u[M];if(E.isDirectionalLight){const R=i.directional[f];R.direction.setFromMatrixPosition(E.matrixWorld),s.setFromMatrixPosition(E.target.matrixWorld),R.direction.sub(s),R.direction.transformDirection(d),f++}else if(E.isSpotLight){const R=i.spot[g];R.position.setFromMatrixPosition(E.matrixWorld),R.position.applyMatrix4(d),R.direction.setFromMatrixPosition(E.matrixWorld),s.setFromMatrixPosition(E.target.matrixWorld),R.direction.sub(s),R.direction.transformDirection(d),g++}else if(E.isRectAreaLight){const R=i.rectArea[_];R.position.setFromMatrixPosition(E.matrixWorld),R.position.applyMatrix4(d),a.identity(),o.copy(E.matrixWorld),o.premultiply(d),a.extractRotation(o),R.halfWidth.set(E.width*.5,0,0),R.halfHeight.set(0,E.height*.5,0),R.halfWidth.applyMatrix4(a),R.halfHeight.applyMatrix4(a),_++}else if(E.isPointLight){const R=i.point[m];R.position.setFromMatrixPosition(E.matrixWorld),R.position.applyMatrix4(d),m++}else if(E.isHemisphereLight){const R=i.hemi[p];R.direction.setFromMatrixPosition(E.matrixWorld),R.direction.transformDirection(d),p++}}}return{setup:l,setupView:c,state:i}}function $o(r,t){const e=new _m(r,t),n=[],i=[];function s(){n.length=0,i.length=0}function o(h){n.push(h)}function a(h){i.push(h)}function l(h){e.setup(n,h)}function c(h){e.setupView(n,h)}return{init:s,state:{lightsArray:n,shadowsArray:i,lights:e},setupLights:l,setupLightsView:c,pushLight:o,pushShadow:a}}function gm(r,t){let e=new WeakMap;function n(s,o=0){const a=e.get(s);let l;return a===void 0?(l=new $o(r,t),e.set(s,[l])):o>=a.length?(l=new $o(r,t),a.push(l)):l=a[o],l}function i(){e=new WeakMap}return{get:n,dispose:i}}class vm extends Ar{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=3200,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class xm extends Ar{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const Mm=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Sm=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Em(r,t,e){let n=new Da;const i=new Vt,s=new Vt,o=new ve,a=new vm({depthPacking:3201}),l=new xm,c={},u=e.maxTextureSize,h={0:1,1:0,2:2},f=new di({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Vt},radius:{value:4}},vertexShader:Mm,fragmentShader:Sm}),m=f.clone();m.defines.HORIZONTAL_PASS=1;const g=new xn;g.setAttribute("position",new gn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new Se(g,f),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let d=this.type;this.render=function(w,A,L){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||w.length===0)return;const v=r.getRenderTarget(),y=r.getActiveCubeFace(),U=r.getActiveMipmapLevel(),F=r.state;F.setBlending(0),F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const q=d!==3&&this.type===3,C=d===3&&this.type!==3;for(let I=0,O=w.length;I<O;I++){const W=w[I],X=W.shadow;if(X===void 0){console.warn("THREE.WebGLShadowMap:",W,"has no shadow.");continue}if(X.autoUpdate===!1&&X.needsUpdate===!1)continue;i.copy(X.mapSize);const Y=X.getFrameExtents();if(i.multiply(Y),s.copy(X.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(s.x=Math.floor(u/Y.x),i.x=s.x*Y.x,X.mapSize.x=s.x),i.y>u&&(s.y=Math.floor(u/Y.y),i.y=s.y*Y.y,X.mapSize.y=s.y)),X.map===null||q===!0||C===!0){const tt=this.type!==3?{minFilter:1003,magFilter:1003}:{};X.map!==null&&X.map.dispose(),X.map=new fi(i.x,i.y,tt),X.map.texture.name=W.name+".shadowMap",X.camera.updateProjectionMatrix()}r.setRenderTarget(X.map),r.clear();const j=X.getViewportCount();for(let tt=0;tt<j;tt++){const et=X.getViewport(tt);o.set(s.x*et.x,s.y*et.y,s.x*et.z,s.y*et.w),F.viewport(o),X.updateMatrices(W,tt),n=X.getFrustum(),E(A,L,X.camera,W,this.type)}X.isPointLightShadow!==!0&&this.type===3&&M(X,L),X.needsUpdate=!1}d=this.type,p.needsUpdate=!1,r.setRenderTarget(v,y,U)};function M(w,A){const L=t.update(_);f.defines.VSM_SAMPLES!==w.blurSamples&&(f.defines.VSM_SAMPLES=w.blurSamples,m.defines.VSM_SAMPLES=w.blurSamples,f.needsUpdate=!0,m.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new fi(i.x,i.y)),f.uniforms.shadow_pass.value=w.map.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,r.setRenderTarget(w.mapPass),r.clear(),r.renderBufferDirect(A,null,L,f,_,null),m.uniforms.shadow_pass.value=w.mapPass.texture,m.uniforms.resolution.value=w.mapSize,m.uniforms.radius.value=w.radius,r.setRenderTarget(w.map),r.clear(),r.renderBufferDirect(A,null,L,m,_,null)}function x(w,A,L,v){let y=null;const U=L.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(U!==void 0)y=U;else if(y=L.isPointLight===!0?l:a,r.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const F=y.uuid,q=A.uuid;let C=c[F];C===void 0&&(C={},c[F]=C);let I=C[q];I===void 0&&(I=y.clone(),C[q]=I,A.addEventListener("dispose",R)),y=I}if(y.visible=A.visible,y.wireframe=A.wireframe,v===3?y.side=A.shadowSide!==null?A.shadowSide:A.side:y.side=A.shadowSide!==null?A.shadowSide:h[A.side],y.alphaMap=A.alphaMap,y.alphaTest=A.alphaTest,y.map=A.map,y.clipShadows=A.clipShadows,y.clippingPlanes=A.clippingPlanes,y.clipIntersection=A.clipIntersection,y.displacementMap=A.displacementMap,y.displacementScale=A.displacementScale,y.displacementBias=A.displacementBias,y.wireframeLinewidth=A.wireframeLinewidth,y.linewidth=A.linewidth,L.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const F=r.properties.get(y);F.light=L}return y}function E(w,A,L,v,y){if(w.visible===!1)return;if(w.layers.test(A.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&y===3)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(L.matrixWorldInverse,w.matrixWorld);const q=t.update(w),C=w.material;if(Array.isArray(C)){const I=q.groups;for(let O=0,W=I.length;O<W;O++){const X=I[O],Y=C[X.materialIndex];if(Y&&Y.visible){const j=x(w,Y,v,y);w.onBeforeShadow(r,w,A,L,q,j,X),r.renderBufferDirect(L,null,q,j,w,X),w.onAfterShadow(r,w,A,L,q,j,X)}}}else if(C.visible){const I=x(w,C,v,y);w.onBeforeShadow(r,w,A,L,q,I,null),r.renderBufferDirect(L,null,q,I,w,null),w.onAfterShadow(r,w,A,L,q,I,null)}}const F=w.children;for(let q=0,C=F.length;q<C;q++)E(F[q],A,L,v,y)}function R(w){w.target.removeEventListener("dispose",R);for(const L in c){const v=c[L],y=w.target.uuid;y in v&&(v[y].dispose(),delete v[y])}}}function Tm(r,t,e){const n=e.isWebGL2;function i(){let P=!1;const st=new ve;let at=null;const Et=new ve(0,0,0,0);return{setMask:function(vt){at!==vt&&!P&&(r.colorMask(vt,vt,vt,vt),at=vt)},setLocked:function(vt){P=vt},setClear:function(vt,Kt,jt,me,Le){Le===!0&&(vt*=me,Kt*=me,jt*=me),st.set(vt,Kt,jt,me),Et.equals(st)===!1&&(r.clearColor(vt,Kt,jt,me),Et.copy(st))},reset:function(){P=!1,at=null,Et.set(-1,0,0,0)}}}function s(){let P=!1,st=null,at=null,Et=null;return{setTest:function(vt){vt?Ct(r.DEPTH_TEST):St(r.DEPTH_TEST)},setMask:function(vt){st!==vt&&!P&&(r.depthMask(vt),st=vt)},setFunc:function(vt){if(at!==vt){switch(vt){case 0:r.depthFunc(r.NEVER);break;case 1:r.depthFunc(r.ALWAYS);break;case 2:r.depthFunc(r.LESS);break;case 3:r.depthFunc(r.LEQUAL);break;case 4:r.depthFunc(r.EQUAL);break;case 5:r.depthFunc(r.GEQUAL);break;case 6:r.depthFunc(r.GREATER);break;case 7:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL)}at=vt}},setLocked:function(vt){P=vt},setClear:function(vt){Et!==vt&&(r.clearDepth(vt),Et=vt)},reset:function(){P=!1,st=null,at=null,Et=null}}}function o(){let P=!1,st=null,at=null,Et=null,vt=null,Kt=null,jt=null,me=null,Le=null;return{setTest:function(Zt){P||(Zt?Ct(r.STENCIL_TEST):St(r.STENCIL_TEST))},setMask:function(Zt){st!==Zt&&!P&&(r.stencilMask(Zt),st=Zt)},setFunc:function(Zt,De,fn){(at!==Zt||Et!==De||vt!==fn)&&(r.stencilFunc(Zt,De,fn),at=Zt,Et=De,vt=fn)},setOp:function(Zt,De,fn){(Kt!==Zt||jt!==De||me!==fn)&&(r.stencilOp(Zt,De,fn),Kt=Zt,jt=De,me=fn)},setLocked:function(Zt){P=Zt},setClear:function(Zt){Le!==Zt&&(r.clearStencil(Zt),Le=Zt)},reset:function(){P=!1,st=null,at=null,Et=null,vt=null,Kt=null,jt=null,me=null,Le=null}}}const a=new i,l=new s,c=new o,u=new WeakMap,h=new WeakMap;let f={},m={},g=new WeakMap,_=[],p=null,d=!1,M=null,x=null,E=null,R=null,w=null,A=null,L=null,v=new Ht(0,0,0),y=0,U=!1,F=null,q=null,C=null,I=null,O=null;const W=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let X=!1,Y=0;const j=r.getParameter(r.VERSION);j.indexOf("WebGL")!==-1?(Y=parseFloat(/^WebGL (\d)/.exec(j)[1]),X=Y>=1):j.indexOf("OpenGL ES")!==-1&&(Y=parseFloat(/^OpenGL ES (\d)/.exec(j)[1]),X=Y>=2);let tt=null,et={};const k=r.getParameter(r.SCISSOR_BOX),K=r.getParameter(r.VIEWPORT),rt=new ve().fromArray(k),mt=new ve().fromArray(K);function pt(P,st,at,Et){const vt=new Uint8Array(4),Kt=r.createTexture();r.bindTexture(P,Kt),r.texParameteri(P,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(P,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let jt=0;jt<at;jt++)n&&(P===r.TEXTURE_3D||P===r.TEXTURE_2D_ARRAY)?r.texImage3D(st,0,r.RGBA,1,1,Et,0,r.RGBA,r.UNSIGNED_BYTE,vt):r.texImage2D(st+jt,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,vt);return Kt}const wt={};wt[r.TEXTURE_2D]=pt(r.TEXTURE_2D,r.TEXTURE_2D,1),wt[r.TEXTURE_CUBE_MAP]=pt(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(wt[r.TEXTURE_2D_ARRAY]=pt(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),wt[r.TEXTURE_3D]=pt(r.TEXTURE_3D,r.TEXTURE_3D,1,1)),a.setClear(0,0,0,1),l.setClear(1),c.setClear(0),Ct(r.DEPTH_TEST),l.setFunc(3),Dt(!1),b(1),Ct(r.CULL_FACE),ht(0);function Ct(P){f[P]!==!0&&(r.enable(P),f[P]=!0)}function St(P){f[P]!==!1&&(r.disable(P),f[P]=!1)}function zt(P,st){return m[P]!==st?(r.bindFramebuffer(P,st),m[P]=st,n&&(P===r.DRAW_FRAMEBUFFER&&(m[r.FRAMEBUFFER]=st),P===r.FRAMEBUFFER&&(m[r.DRAW_FRAMEBUFFER]=st)),!0):!1}function B(P,st){let at=_,Et=!1;if(P)if(at=g.get(st),at===void 0&&(at=[],g.set(st,at)),P.isWebGLMultipleRenderTargets){const vt=P.texture;if(at.length!==vt.length||at[0]!==r.COLOR_ATTACHMENT0){for(let Kt=0,jt=vt.length;Kt<jt;Kt++)at[Kt]=r.COLOR_ATTACHMENT0+Kt;at.length=vt.length,Et=!0}}else at[0]!==r.COLOR_ATTACHMENT0&&(at[0]=r.COLOR_ATTACHMENT0,Et=!0);else at[0]!==r.BACK&&(at[0]=r.BACK,Et=!0);Et&&(e.isWebGL2?r.drawBuffers(at):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(at))}function Pe(P){return p!==P?(r.useProgram(P),p=P,!0):!1}const gt={100:r.FUNC_ADD,101:r.FUNC_SUBTRACT,102:r.FUNC_REVERSE_SUBTRACT};if(n)gt[103]=r.MIN,gt[104]=r.MAX;else{const P=t.get("EXT_blend_minmax");P!==null&&(gt[103]=P.MIN_EXT,gt[104]=P.MAX_EXT)}const At={200:r.ZERO,201:r.ONE,202:r.SRC_COLOR,204:r.SRC_ALPHA,210:r.SRC_ALPHA_SATURATE,208:r.DST_COLOR,206:r.DST_ALPHA,203:r.ONE_MINUS_SRC_COLOR,205:r.ONE_MINUS_SRC_ALPHA,209:r.ONE_MINUS_DST_COLOR,207:r.ONE_MINUS_DST_ALPHA,211:r.CONSTANT_COLOR,212:r.ONE_MINUS_CONSTANT_COLOR,213:r.CONSTANT_ALPHA,214:r.ONE_MINUS_CONSTANT_ALPHA};function ht(P,st,at,Et,vt,Kt,jt,me,Le,Zt){if(P===0){d===!0&&(St(r.BLEND),d=!1);return}if(d===!1&&(Ct(r.BLEND),d=!0),P!==5){if(P!==M||Zt!==U){if((x!==100||w!==100)&&(r.blendEquation(r.FUNC_ADD),x=100,w=100),Zt)switch(P){case 1:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case 2:r.blendFunc(r.ONE,r.ONE);break;case 3:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case 4:r.blendFuncSeparate(r.ZERO,r.SRC_COLOR,r.ZERO,r.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",P);break}else switch(P){case 1:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case 2:r.blendFunc(r.SRC_ALPHA,r.ONE);break;case 3:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case 4:r.blendFunc(r.ZERO,r.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",P);break}E=null,R=null,A=null,L=null,v.set(0,0,0),y=0,M=P,U=Zt}return}vt=vt||st,Kt=Kt||at,jt=jt||Et,(st!==x||vt!==w)&&(r.blendEquationSeparate(gt[st],gt[vt]),x=st,w=vt),(at!==E||Et!==R||Kt!==A||jt!==L)&&(r.blendFuncSeparate(At[at],At[Et],At[Kt],At[jt]),E=at,R=Et,A=Kt,L=jt),(me.equals(v)===!1||Le!==y)&&(r.blendColor(me.r,me.g,me.b,Le),v.copy(me),y=Le),M=P,U=!1}function Qt(P,st){P.side===2?St(r.CULL_FACE):Ct(r.CULL_FACE);let at=P.side===1;st&&(at=!at),Dt(at),P.blending===1&&P.transparent===!1?ht(0):ht(P.blending,P.blendEquation,P.blendSrc,P.blendDst,P.blendEquationAlpha,P.blendSrcAlpha,P.blendDstAlpha,P.blendColor,P.blendAlpha,P.premultipliedAlpha),l.setFunc(P.depthFunc),l.setTest(P.depthTest),l.setMask(P.depthWrite),a.setMask(P.colorWrite);const Et=P.stencilWrite;c.setTest(Et),Et&&(c.setMask(P.stencilWriteMask),c.setFunc(P.stencilFunc,P.stencilRef,P.stencilFuncMask),c.setOp(P.stencilFail,P.stencilZFail,P.stencilZPass)),z(P.polygonOffset,P.polygonOffsetFactor,P.polygonOffsetUnits),P.alphaToCoverage===!0?Ct(r.SAMPLE_ALPHA_TO_COVERAGE):St(r.SAMPLE_ALPHA_TO_COVERAGE)}function Dt(P){F!==P&&(P?r.frontFace(r.CW):r.frontFace(r.CCW),F=P)}function b(P){P!==0?(Ct(r.CULL_FACE),P!==q&&(P===1?r.cullFace(r.BACK):P===2?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):St(r.CULL_FACE),q=P}function S(P){P!==C&&(X&&r.lineWidth(P),C=P)}function z(P,st,at){P?(Ct(r.POLYGON_OFFSET_FILL),(I!==st||O!==at)&&(r.polygonOffset(st,at),I=st,O=at)):St(r.POLYGON_OFFSET_FILL)}function J(P){P?Ct(r.SCISSOR_TEST):St(r.SCISSOR_TEST)}function $(P){P===void 0&&(P=r.TEXTURE0+W-1),tt!==P&&(r.activeTexture(P),tt=P)}function Q(P,st,at){at===void 0&&(tt===null?at=r.TEXTURE0+W-1:at=tt);let Et=et[at];Et===void 0&&(Et={type:void 0,texture:void 0},et[at]=Et),(Et.type!==P||Et.texture!==st)&&(tt!==at&&(r.activeTexture(at),tt=at),r.bindTexture(P,st||wt[P]),Et.type=P,Et.texture=st)}function ft(){const P=et[tt];P!==void 0&&P.type!==void 0&&(r.bindTexture(P.type,null),P.type=void 0,P.texture=void 0)}function ot(){try{r.compressedTexImage2D.apply(r,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function ct(){try{r.compressedTexImage3D.apply(r,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function Mt(){try{r.texSubImage2D.apply(r,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function It(){try{r.texSubImage3D.apply(r,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function Z(){try{r.compressedTexSubImage2D.apply(r,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function Wt(){try{r.compressedTexSubImage3D.apply(r,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function Bt(){try{r.texStorage2D.apply(r,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function yt(){try{r.texStorage3D.apply(r,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function _t(){try{r.texImage2D.apply(r,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function ut(){try{r.texImage3D.apply(r,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function Pt(P){rt.equals(P)===!1&&(r.scissor(P.x,P.y,P.z,P.w),rt.copy(P))}function kt(P){mt.equals(P)===!1&&(r.viewport(P.x,P.y,P.z,P.w),mt.copy(P))}function re(P,st){let at=h.get(st);at===void 0&&(at=new WeakMap,h.set(st,at));let Et=at.get(P);Et===void 0&&(Et=r.getUniformBlockIndex(st,P.name),at.set(P,Et))}function Ft(P,st){const Et=h.get(st).get(P);u.get(st)!==Et&&(r.uniformBlockBinding(st,Et,P.__bindingPointIndex),u.set(st,Et))}function nt(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),n===!0&&(r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null)),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),f={},tt=null,et={},m={},g=new WeakMap,_=[],p=null,d=!1,M=null,x=null,E=null,R=null,w=null,A=null,L=null,v=new Ht(0,0,0),y=0,U=!1,F=null,q=null,C=null,I=null,O=null,rt.set(0,0,r.canvas.width,r.canvas.height),mt.set(0,0,r.canvas.width,r.canvas.height),a.reset(),l.reset(),c.reset()}return{buffers:{color:a,depth:l,stencil:c},enable:Ct,disable:St,bindFramebuffer:zt,drawBuffers:B,useProgram:Pe,setBlending:ht,setMaterial:Qt,setFlipSided:Dt,setCullFace:b,setLineWidth:S,setPolygonOffset:z,setScissorTest:J,activeTexture:$,bindTexture:Q,unbindTexture:ft,compressedTexImage2D:ot,compressedTexImage3D:ct,texImage2D:_t,texImage3D:ut,updateUBOMapping:re,uniformBlockBinding:Ft,texStorage2D:Bt,texStorage3D:yt,texSubImage2D:Mt,texSubImage3D:It,compressedTexSubImage2D:Z,compressedTexSubImage3D:Wt,scissor:Pt,viewport:kt,reset:nt}}function ym(r,t,e,n,i,s,o){const a=i.isWebGL2,l=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator=="undefined"?!1:/OculusBrowser/g.test(navigator.userAgent),u=new WeakMap;let h;const f=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas!="undefined"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch(b){}function g(b,S){return m?new OffscreenCanvas(b,S):as("canvas")}function _(b,S,z,J){let $=1;if((b.width>J||b.height>J)&&($=J/Math.max(b.width,b.height)),$<1||S===!0)if(typeof HTMLImageElement!="undefined"&&b instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&b instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&b instanceof ImageBitmap){const Q=S?da:Math.floor,ft=Q($*b.width),ot=Q($*b.height);h===void 0&&(h=g(ft,ot));const ct=z?g(ft,ot):h;return ct.width=ft,ct.height=ot,ct.getContext("2d").drawImage(b,0,0,ft,ot),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+b.width+"x"+b.height+") to ("+ft+"x"+ot+")."),ct}else return"data"in b&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+b.width+"x"+b.height+")."),b;return b}function p(b){return fo(b.width)&&fo(b.height)}function d(b){return a?!1:b.wrapS!==1001||b.wrapT!==1001||b.minFilter!==1003&&b.minFilter!==1006}function M(b,S){return b.generateMipmaps&&S&&b.minFilter!==1003&&b.minFilter!==1006}function x(b){r.generateMipmap(b)}function E(b,S,z,J,$=!1){if(a===!1)return S;if(b!==null){if(r[b]!==void 0)return r[b];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+b+"'")}let Q=S;if(S===r.RED&&(z===r.FLOAT&&(Q=r.R32F),z===r.HALF_FLOAT&&(Q=r.R16F),z===r.UNSIGNED_BYTE&&(Q=r.R8)),S===r.RED_INTEGER&&(z===r.UNSIGNED_BYTE&&(Q=r.R8UI),z===r.UNSIGNED_SHORT&&(Q=r.R16UI),z===r.UNSIGNED_INT&&(Q=r.R32UI),z===r.BYTE&&(Q=r.R8I),z===r.SHORT&&(Q=r.R16I),z===r.INT&&(Q=r.R32I)),S===r.RG&&(z===r.FLOAT&&(Q=r.RG32F),z===r.HALF_FLOAT&&(Q=r.RG16F),z===r.UNSIGNED_BYTE&&(Q=r.RG8)),S===r.RGBA){const ft=$?is:Xt.getTransfer(J);z===r.FLOAT&&(Q=r.RGBA32F),z===r.HALF_FLOAT&&(Q=r.RGBA16F),z===r.UNSIGNED_BYTE&&(Q=ft===$t?r.SRGB8_ALPHA8:r.RGBA8),z===r.UNSIGNED_SHORT_4_4_4_4&&(Q=r.RGBA4),z===r.UNSIGNED_SHORT_5_5_5_1&&(Q=r.RGB5_A1)}return(Q===r.R16F||Q===r.R32F||Q===r.RG16F||Q===r.RG32F||Q===r.RGBA16F||Q===r.RGBA32F)&&t.get("EXT_color_buffer_float"),Q}function R(b,S,z){return M(b,z)===!0||b.isFramebufferTexture&&b.minFilter!==1003&&b.minFilter!==1006?Math.log2(Math.max(S.width,S.height))+1:b.mipmaps!==void 0&&b.mipmaps.length>0?b.mipmaps.length:b.isCompressedTexture&&Array.isArray(b.image)?S.mipmaps.length:1}function w(b){return b===1003||b===1004||b===1005?r.NEAREST:r.LINEAR}function A(b){const S=b.target;S.removeEventListener("dispose",A),v(S),S.isVideoTexture&&u.delete(S)}function L(b){const S=b.target;S.removeEventListener("dispose",L),U(S)}function v(b){const S=n.get(b);if(S.__webglInit===void 0)return;const z=b.source,J=f.get(z);if(J){const $=J[S.__cacheKey];$.usedTimes--,$.usedTimes===0&&y(b),Object.keys(J).length===0&&f.delete(z)}n.remove(b)}function y(b){const S=n.get(b);r.deleteTexture(S.__webglTexture);const z=b.source,J=f.get(z);delete J[S.__cacheKey],o.memory.textures--}function U(b){const S=b.texture,z=n.get(b),J=n.get(S);if(J.__webglTexture!==void 0&&(r.deleteTexture(J.__webglTexture),o.memory.textures--),b.depthTexture&&b.depthTexture.dispose(),b.isWebGLCubeRenderTarget)for(let $=0;$<6;$++){if(Array.isArray(z.__webglFramebuffer[$]))for(let Q=0;Q<z.__webglFramebuffer[$].length;Q++)r.deleteFramebuffer(z.__webglFramebuffer[$][Q]);else r.deleteFramebuffer(z.__webglFramebuffer[$]);z.__webglDepthbuffer&&r.deleteRenderbuffer(z.__webglDepthbuffer[$])}else{if(Array.isArray(z.__webglFramebuffer))for(let $=0;$<z.__webglFramebuffer.length;$++)r.deleteFramebuffer(z.__webglFramebuffer[$]);else r.deleteFramebuffer(z.__webglFramebuffer);if(z.__webglDepthbuffer&&r.deleteRenderbuffer(z.__webglDepthbuffer),z.__webglMultisampledFramebuffer&&r.deleteFramebuffer(z.__webglMultisampledFramebuffer),z.__webglColorRenderbuffer)for(let $=0;$<z.__webglColorRenderbuffer.length;$++)z.__webglColorRenderbuffer[$]&&r.deleteRenderbuffer(z.__webglColorRenderbuffer[$]);z.__webglDepthRenderbuffer&&r.deleteRenderbuffer(z.__webglDepthRenderbuffer)}if(b.isWebGLMultipleRenderTargets)for(let $=0,Q=S.length;$<Q;$++){const ft=n.get(S[$]);ft.__webglTexture&&(r.deleteTexture(ft.__webglTexture),o.memory.textures--),n.remove(S[$])}n.remove(S),n.remove(b)}let F=0;function q(){F=0}function C(){const b=F;return b>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+b+" texture units while this GPU supports only "+i.maxTextures),F+=1,b}function I(b){const S=[];return S.push(b.wrapS),S.push(b.wrapT),S.push(b.wrapR||0),S.push(b.magFilter),S.push(b.minFilter),S.push(b.anisotropy),S.push(b.internalFormat),S.push(b.format),S.push(b.type),S.push(b.generateMipmaps),S.push(b.premultiplyAlpha),S.push(b.flipY),S.push(b.unpackAlignment),S.push(b.colorSpace),S.join()}function O(b,S){const z=n.get(b);if(b.isVideoTexture&&Qt(b),b.isRenderTargetTexture===!1&&b.version>0&&z.__version!==b.version){const J=b.image;if(J===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(J.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{rt(z,b,S);return}}e.bindTexture(r.TEXTURE_2D,z.__webglTexture,r.TEXTURE0+S)}function W(b,S){const z=n.get(b);if(b.version>0&&z.__version!==b.version){rt(z,b,S);return}e.bindTexture(r.TEXTURE_2D_ARRAY,z.__webglTexture,r.TEXTURE0+S)}function X(b,S){const z=n.get(b);if(b.version>0&&z.__version!==b.version){rt(z,b,S);return}e.bindTexture(r.TEXTURE_3D,z.__webglTexture,r.TEXTURE0+S)}function Y(b,S){const z=n.get(b);if(b.version>0&&z.__version!==b.version){mt(z,b,S);return}e.bindTexture(r.TEXTURE_CUBE_MAP,z.__webglTexture,r.TEXTURE0+S)}const j={1e3:r.REPEAT,1001:r.CLAMP_TO_EDGE,1002:r.MIRRORED_REPEAT},tt={1003:r.NEAREST,1004:r.NEAREST_MIPMAP_NEAREST,1005:r.NEAREST_MIPMAP_LINEAR,1006:r.LINEAR,1007:r.LINEAR_MIPMAP_NEAREST,1008:r.LINEAR_MIPMAP_LINEAR},et={512:r.NEVER,519:r.ALWAYS,513:r.LESS,515:r.LEQUAL,514:r.EQUAL,518:r.GEQUAL,516:r.GREATER,517:r.NOTEQUAL};function k(b,S,z){if(z?(r.texParameteri(b,r.TEXTURE_WRAP_S,j[S.wrapS]),r.texParameteri(b,r.TEXTURE_WRAP_T,j[S.wrapT]),(b===r.TEXTURE_3D||b===r.TEXTURE_2D_ARRAY)&&r.texParameteri(b,r.TEXTURE_WRAP_R,j[S.wrapR]),r.texParameteri(b,r.TEXTURE_MAG_FILTER,tt[S.magFilter]),r.texParameteri(b,r.TEXTURE_MIN_FILTER,tt[S.minFilter])):(r.texParameteri(b,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(b,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE),(b===r.TEXTURE_3D||b===r.TEXTURE_2D_ARRAY)&&r.texParameteri(b,r.TEXTURE_WRAP_R,r.CLAMP_TO_EDGE),(S.wrapS!==1001||S.wrapT!==1001)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),r.texParameteri(b,r.TEXTURE_MAG_FILTER,w(S.magFilter)),r.texParameteri(b,r.TEXTURE_MIN_FILTER,w(S.minFilter)),S.minFilter!==1003&&S.minFilter!==1006&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),S.compareFunction&&(r.texParameteri(b,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(b,r.TEXTURE_COMPARE_FUNC,et[S.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){const J=t.get("EXT_texture_filter_anisotropic");if(S.magFilter===1003||S.minFilter!==1005&&S.minFilter!==1008||S.type===1015&&t.has("OES_texture_float_linear")===!1||a===!1&&S.type===1016&&t.has("OES_texture_half_float_linear")===!1)return;(S.anisotropy>1||n.get(S).__currentAnisotropy)&&(r.texParameterf(b,J.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,i.getMaxAnisotropy())),n.get(S).__currentAnisotropy=S.anisotropy)}}function K(b,S){let z=!1;b.__webglInit===void 0&&(b.__webglInit=!0,S.addEventListener("dispose",A));const J=S.source;let $=f.get(J);$===void 0&&($={},f.set(J,$));const Q=I(S);if(Q!==b.__cacheKey){$[Q]===void 0&&($[Q]={texture:r.createTexture(),usedTimes:0},o.memory.textures++,z=!0),$[Q].usedTimes++;const ft=$[b.__cacheKey];ft!==void 0&&($[b.__cacheKey].usedTimes--,ft.usedTimes===0&&y(S)),b.__cacheKey=Q,b.__webglTexture=$[Q].texture}return z}function rt(b,S,z){let J=r.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(J=r.TEXTURE_2D_ARRAY),S.isData3DTexture&&(J=r.TEXTURE_3D);const $=K(b,S),Q=S.source;e.bindTexture(J,b.__webglTexture,r.TEXTURE0+z);const ft=n.get(Q);if(Q.version!==ft.__version||$===!0){e.activeTexture(r.TEXTURE0+z);const ot=Xt.getPrimaries(Xt.workingColorSpace),ct=S.colorSpace===rn?null:Xt.getPrimaries(S.colorSpace),Mt=S.colorSpace===rn||ot===ct?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,S.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,S.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,Mt);const It=d(S)&&p(S.image)===!1;let Z=_(S.image,It,!1,i.maxTextureSize);Z=Dt(S,Z);const Wt=p(Z)||a,Bt=s.convert(S.format,S.colorSpace);let yt=s.convert(S.type),_t=E(S.internalFormat,Bt,yt,S.colorSpace,S.isVideoTexture);k(J,S,Wt);let ut;const Pt=S.mipmaps,kt=a&&S.isVideoTexture!==!0&&_t!==36196,re=ft.__version===void 0||$===!0,Ft=R(S,Z,Wt);if(S.isDepthTexture)_t=r.DEPTH_COMPONENT,a?S.type===1015?_t=r.DEPTH_COMPONENT32F:S.type===1014?_t=r.DEPTH_COMPONENT24:S.type===1020?_t=r.DEPTH24_STENCIL8:_t=r.DEPTH_COMPONENT16:S.type===1015&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),S.format===1026&&_t===r.DEPTH_COMPONENT&&S.type!==1012&&S.type!==1014&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),S.type=1014,yt=s.convert(S.type)),S.format===1027&&_t===r.DEPTH_COMPONENT&&(_t=r.DEPTH_STENCIL,S.type!==1020&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),S.type=1020,yt=s.convert(S.type))),re&&(kt?e.texStorage2D(r.TEXTURE_2D,1,_t,Z.width,Z.height):e.texImage2D(r.TEXTURE_2D,0,_t,Z.width,Z.height,0,Bt,yt,null));else if(S.isDataTexture)if(Pt.length>0&&Wt){kt&&re&&e.texStorage2D(r.TEXTURE_2D,Ft,_t,Pt[0].width,Pt[0].height);for(let nt=0,P=Pt.length;nt<P;nt++)ut=Pt[nt],kt?e.texSubImage2D(r.TEXTURE_2D,nt,0,0,ut.width,ut.height,Bt,yt,ut.data):e.texImage2D(r.TEXTURE_2D,nt,_t,ut.width,ut.height,0,Bt,yt,ut.data);S.generateMipmaps=!1}else kt?(re&&e.texStorage2D(r.TEXTURE_2D,Ft,_t,Z.width,Z.height),e.texSubImage2D(r.TEXTURE_2D,0,0,0,Z.width,Z.height,Bt,yt,Z.data)):e.texImage2D(r.TEXTURE_2D,0,_t,Z.width,Z.height,0,Bt,yt,Z.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){kt&&re&&e.texStorage3D(r.TEXTURE_2D_ARRAY,Ft,_t,Pt[0].width,Pt[0].height,Z.depth);for(let nt=0,P=Pt.length;nt<P;nt++)ut=Pt[nt],S.format!==1023?Bt!==null?kt?e.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,nt,0,0,0,ut.width,ut.height,Z.depth,Bt,ut.data,0,0):e.compressedTexImage3D(r.TEXTURE_2D_ARRAY,nt,_t,ut.width,ut.height,Z.depth,0,ut.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):kt?e.texSubImage3D(r.TEXTURE_2D_ARRAY,nt,0,0,0,ut.width,ut.height,Z.depth,Bt,yt,ut.data):e.texImage3D(r.TEXTURE_2D_ARRAY,nt,_t,ut.width,ut.height,Z.depth,0,Bt,yt,ut.data)}else{kt&&re&&e.texStorage2D(r.TEXTURE_2D,Ft,_t,Pt[0].width,Pt[0].height);for(let nt=0,P=Pt.length;nt<P;nt++)ut=Pt[nt],S.format!==1023?Bt!==null?kt?e.compressedTexSubImage2D(r.TEXTURE_2D,nt,0,0,ut.width,ut.height,Bt,ut.data):e.compressedTexImage2D(r.TEXTURE_2D,nt,_t,ut.width,ut.height,0,ut.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):kt?e.texSubImage2D(r.TEXTURE_2D,nt,0,0,ut.width,ut.height,Bt,yt,ut.data):e.texImage2D(r.TEXTURE_2D,nt,_t,ut.width,ut.height,0,Bt,yt,ut.data)}else if(S.isDataArrayTexture)kt?(re&&e.texStorage3D(r.TEXTURE_2D_ARRAY,Ft,_t,Z.width,Z.height,Z.depth),e.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,Z.width,Z.height,Z.depth,Bt,yt,Z.data)):e.texImage3D(r.TEXTURE_2D_ARRAY,0,_t,Z.width,Z.height,Z.depth,0,Bt,yt,Z.data);else if(S.isData3DTexture)kt?(re&&e.texStorage3D(r.TEXTURE_3D,Ft,_t,Z.width,Z.height,Z.depth),e.texSubImage3D(r.TEXTURE_3D,0,0,0,0,Z.width,Z.height,Z.depth,Bt,yt,Z.data)):e.texImage3D(r.TEXTURE_3D,0,_t,Z.width,Z.height,Z.depth,0,Bt,yt,Z.data);else if(S.isFramebufferTexture){if(re)if(kt)e.texStorage2D(r.TEXTURE_2D,Ft,_t,Z.width,Z.height);else{let nt=Z.width,P=Z.height;for(let st=0;st<Ft;st++)e.texImage2D(r.TEXTURE_2D,st,_t,nt,P,0,Bt,yt,null),nt>>=1,P>>=1}}else if(Pt.length>0&&Wt){kt&&re&&e.texStorage2D(r.TEXTURE_2D,Ft,_t,Pt[0].width,Pt[0].height);for(let nt=0,P=Pt.length;nt<P;nt++)ut=Pt[nt],kt?e.texSubImage2D(r.TEXTURE_2D,nt,0,0,Bt,yt,ut):e.texImage2D(r.TEXTURE_2D,nt,_t,Bt,yt,ut);S.generateMipmaps=!1}else kt?(re&&e.texStorage2D(r.TEXTURE_2D,Ft,_t,Z.width,Z.height),e.texSubImage2D(r.TEXTURE_2D,0,0,0,Bt,yt,Z)):e.texImage2D(r.TEXTURE_2D,0,_t,Bt,yt,Z);M(S,Wt)&&x(J),ft.__version=Q.version,S.onUpdate&&S.onUpdate(S)}b.__version=S.version}function mt(b,S,z){if(S.image.length!==6)return;const J=K(b,S),$=S.source;e.bindTexture(r.TEXTURE_CUBE_MAP,b.__webglTexture,r.TEXTURE0+z);const Q=n.get($);if($.version!==Q.__version||J===!0){e.activeTexture(r.TEXTURE0+z);const ft=Xt.getPrimaries(Xt.workingColorSpace),ot=S.colorSpace===rn?null:Xt.getPrimaries(S.colorSpace),ct=S.colorSpace===rn||ft===ot?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,S.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,S.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,ct);const Mt=S.isCompressedTexture||S.image[0].isCompressedTexture,It=S.image[0]&&S.image[0].isDataTexture,Z=[];for(let nt=0;nt<6;nt++)!Mt&&!It?Z[nt]=_(S.image[nt],!1,!0,i.maxCubemapSize):Z[nt]=It?S.image[nt].image:S.image[nt],Z[nt]=Dt(S,Z[nt]);const Wt=Z[0],Bt=p(Wt)||a,yt=s.convert(S.format,S.colorSpace),_t=s.convert(S.type),ut=E(S.internalFormat,yt,_t,S.colorSpace),Pt=a&&S.isVideoTexture!==!0,kt=Q.__version===void 0||J===!0;let re=R(S,Wt,Bt);k(r.TEXTURE_CUBE_MAP,S,Bt);let Ft;if(Mt){Pt&&kt&&e.texStorage2D(r.TEXTURE_CUBE_MAP,re,ut,Wt.width,Wt.height);for(let nt=0;nt<6;nt++){Ft=Z[nt].mipmaps;for(let P=0;P<Ft.length;P++){const st=Ft[P];S.format!==1023?yt!==null?Pt?e.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+nt,P,0,0,st.width,st.height,yt,st.data):e.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+nt,P,ut,st.width,st.height,0,st.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Pt?e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+nt,P,0,0,st.width,st.height,yt,_t,st.data):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+nt,P,ut,st.width,st.height,0,yt,_t,st.data)}}}else{Ft=S.mipmaps,Pt&&kt&&(Ft.length>0&&re++,e.texStorage2D(r.TEXTURE_CUBE_MAP,re,ut,Z[0].width,Z[0].height));for(let nt=0;nt<6;nt++)if(It){Pt?e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,0,0,Z[nt].width,Z[nt].height,yt,_t,Z[nt].data):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,ut,Z[nt].width,Z[nt].height,0,yt,_t,Z[nt].data);for(let P=0;P<Ft.length;P++){const at=Ft[P].image[nt].image;Pt?e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+nt,P+1,0,0,at.width,at.height,yt,_t,at.data):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+nt,P+1,ut,at.width,at.height,0,yt,_t,at.data)}}else{Pt?e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,0,0,yt,_t,Z[nt]):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,ut,yt,_t,Z[nt]);for(let P=0;P<Ft.length;P++){const st=Ft[P];Pt?e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+nt,P+1,0,0,yt,_t,st.image[nt]):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+nt,P+1,ut,yt,_t,st.image[nt])}}}M(S,Bt)&&x(r.TEXTURE_CUBE_MAP),Q.__version=$.version,S.onUpdate&&S.onUpdate(S)}b.__version=S.version}function pt(b,S,z,J,$,Q){const ft=s.convert(z.format,z.colorSpace),ot=s.convert(z.type),ct=E(z.internalFormat,ft,ot,z.colorSpace);if(!n.get(S).__hasExternalTextures){const It=Math.max(1,S.width>>Q),Z=Math.max(1,S.height>>Q);$===r.TEXTURE_3D||$===r.TEXTURE_2D_ARRAY?e.texImage3D($,Q,ct,It,Z,S.depth,0,ft,ot,null):e.texImage2D($,Q,ct,It,Z,0,ft,ot,null)}e.bindFramebuffer(r.FRAMEBUFFER,b),ht(S)?l.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,J,$,n.get(z).__webglTexture,0,At(S)):($===r.TEXTURE_2D||$>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&$<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,J,$,n.get(z).__webglTexture,Q),e.bindFramebuffer(r.FRAMEBUFFER,null)}function wt(b,S,z){if(r.bindRenderbuffer(r.RENDERBUFFER,b),S.depthBuffer&&!S.stencilBuffer){let J=a===!0?r.DEPTH_COMPONENT24:r.DEPTH_COMPONENT16;if(z||ht(S)){const $=S.depthTexture;$&&$.isDepthTexture&&($.type===1015?J=r.DEPTH_COMPONENT32F:$.type===1014&&(J=r.DEPTH_COMPONENT24));const Q=At(S);ht(S)?l.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,Q,J,S.width,S.height):r.renderbufferStorageMultisample(r.RENDERBUFFER,Q,J,S.width,S.height)}else r.renderbufferStorage(r.RENDERBUFFER,J,S.width,S.height);r.framebufferRenderbuffer(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.RENDERBUFFER,b)}else if(S.depthBuffer&&S.stencilBuffer){const J=At(S);z&&ht(S)===!1?r.renderbufferStorageMultisample(r.RENDERBUFFER,J,r.DEPTH24_STENCIL8,S.width,S.height):ht(S)?l.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,J,r.DEPTH24_STENCIL8,S.width,S.height):r.renderbufferStorage(r.RENDERBUFFER,r.DEPTH_STENCIL,S.width,S.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.RENDERBUFFER,b)}else{const J=S.isWebGLMultipleRenderTargets===!0?S.texture:[S.texture];for(let $=0;$<J.length;$++){const Q=J[$],ft=s.convert(Q.format,Q.colorSpace),ot=s.convert(Q.type),ct=E(Q.internalFormat,ft,ot,Q.colorSpace),Mt=At(S);z&&ht(S)===!1?r.renderbufferStorageMultisample(r.RENDERBUFFER,Mt,ct,S.width,S.height):ht(S)?l.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,Mt,ct,S.width,S.height):r.renderbufferStorage(r.RENDERBUFFER,ct,S.width,S.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function Ct(b,S){if(S&&S.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(r.FRAMEBUFFER,b),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(S.depthTexture).__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),O(S.depthTexture,0);const J=n.get(S.depthTexture).__webglTexture,$=At(S);if(S.depthTexture.format===1026)ht(S)?l.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,J,0,$):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,J,0);else if(S.depthTexture.format===1027)ht(S)?l.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,J,0,$):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,J,0);else throw new Error("Unknown depthTexture format")}function St(b){const S=n.get(b),z=b.isWebGLCubeRenderTarget===!0;if(b.depthTexture&&!S.__autoAllocateDepthBuffer){if(z)throw new Error("target.depthTexture not supported in Cube render targets");Ct(S.__webglFramebuffer,b)}else if(z){S.__webglDepthbuffer=[];for(let J=0;J<6;J++)e.bindFramebuffer(r.FRAMEBUFFER,S.__webglFramebuffer[J]),S.__webglDepthbuffer[J]=r.createRenderbuffer(),wt(S.__webglDepthbuffer[J],b,!1)}else e.bindFramebuffer(r.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer=r.createRenderbuffer(),wt(S.__webglDepthbuffer,b,!1);e.bindFramebuffer(r.FRAMEBUFFER,null)}function zt(b,S,z){const J=n.get(b);S!==void 0&&pt(J.__webglFramebuffer,b,b.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),z!==void 0&&St(b)}function B(b){const S=b.texture,z=n.get(b),J=n.get(S);b.addEventListener("dispose",L),b.isWebGLMultipleRenderTargets!==!0&&(J.__webglTexture===void 0&&(J.__webglTexture=r.createTexture()),J.__version=S.version,o.memory.textures++);const $=b.isWebGLCubeRenderTarget===!0,Q=b.isWebGLMultipleRenderTargets===!0,ft=p(b)||a;if($){z.__webglFramebuffer=[];for(let ot=0;ot<6;ot++)if(a&&S.mipmaps&&S.mipmaps.length>0){z.__webglFramebuffer[ot]=[];for(let ct=0;ct<S.mipmaps.length;ct++)z.__webglFramebuffer[ot][ct]=r.createFramebuffer()}else z.__webglFramebuffer[ot]=r.createFramebuffer()}else{if(a&&S.mipmaps&&S.mipmaps.length>0){z.__webglFramebuffer=[];for(let ot=0;ot<S.mipmaps.length;ot++)z.__webglFramebuffer[ot]=r.createFramebuffer()}else z.__webglFramebuffer=r.createFramebuffer();if(Q)if(i.drawBuffers){const ot=b.texture;for(let ct=0,Mt=ot.length;ct<Mt;ct++){const It=n.get(ot[ct]);It.__webglTexture===void 0&&(It.__webglTexture=r.createTexture(),o.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(a&&b.samples>0&&ht(b)===!1){const ot=Q?S:[S];z.__webglMultisampledFramebuffer=r.createFramebuffer(),z.__webglColorRenderbuffer=[],e.bindFramebuffer(r.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let ct=0;ct<ot.length;ct++){const Mt=ot[ct];z.__webglColorRenderbuffer[ct]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,z.__webglColorRenderbuffer[ct]);const It=s.convert(Mt.format,Mt.colorSpace),Z=s.convert(Mt.type),Wt=E(Mt.internalFormat,It,Z,Mt.colorSpace,b.isXRRenderTarget===!0),Bt=At(b);r.renderbufferStorageMultisample(r.RENDERBUFFER,Bt,Wt,b.width,b.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+ct,r.RENDERBUFFER,z.__webglColorRenderbuffer[ct])}r.bindRenderbuffer(r.RENDERBUFFER,null),b.depthBuffer&&(z.__webglDepthRenderbuffer=r.createRenderbuffer(),wt(z.__webglDepthRenderbuffer,b,!0)),e.bindFramebuffer(r.FRAMEBUFFER,null)}}if($){e.bindTexture(r.TEXTURE_CUBE_MAP,J.__webglTexture),k(r.TEXTURE_CUBE_MAP,S,ft);for(let ot=0;ot<6;ot++)if(a&&S.mipmaps&&S.mipmaps.length>0)for(let ct=0;ct<S.mipmaps.length;ct++)pt(z.__webglFramebuffer[ot][ct],b,S,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+ot,ct);else pt(z.__webglFramebuffer[ot],b,S,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0);M(S,ft)&&x(r.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Q){const ot=b.texture;for(let ct=0,Mt=ot.length;ct<Mt;ct++){const It=ot[ct],Z=n.get(It);e.bindTexture(r.TEXTURE_2D,Z.__webglTexture),k(r.TEXTURE_2D,It,ft),pt(z.__webglFramebuffer,b,It,r.COLOR_ATTACHMENT0+ct,r.TEXTURE_2D,0),M(It,ft)&&x(r.TEXTURE_2D)}e.unbindTexture()}else{let ot=r.TEXTURE_2D;if((b.isWebGL3DRenderTarget||b.isWebGLArrayRenderTarget)&&(a?ot=b.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(ot,J.__webglTexture),k(ot,S,ft),a&&S.mipmaps&&S.mipmaps.length>0)for(let ct=0;ct<S.mipmaps.length;ct++)pt(z.__webglFramebuffer[ct],b,S,r.COLOR_ATTACHMENT0,ot,ct);else pt(z.__webglFramebuffer,b,S,r.COLOR_ATTACHMENT0,ot,0);M(S,ft)&&x(ot),e.unbindTexture()}b.depthBuffer&&St(b)}function Pe(b){const S=p(b)||a,z=b.isWebGLMultipleRenderTargets===!0?b.texture:[b.texture];for(let J=0,$=z.length;J<$;J++){const Q=z[J];if(M(Q,S)){const ft=b.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:r.TEXTURE_2D,ot=n.get(Q).__webglTexture;e.bindTexture(ft,ot),x(ft),e.unbindTexture()}}}function gt(b){if(a&&b.samples>0&&ht(b)===!1){const S=b.isWebGLMultipleRenderTargets?b.texture:[b.texture],z=b.width,J=b.height;let $=r.COLOR_BUFFER_BIT;const Q=[],ft=b.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,ot=n.get(b),ct=b.isWebGLMultipleRenderTargets===!0;if(ct)for(let Mt=0;Mt<S.length;Mt++)e.bindFramebuffer(r.FRAMEBUFFER,ot.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Mt,r.RENDERBUFFER,null),e.bindFramebuffer(r.FRAMEBUFFER,ot.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+Mt,r.TEXTURE_2D,null,0);e.bindFramebuffer(r.READ_FRAMEBUFFER,ot.__webglMultisampledFramebuffer),e.bindFramebuffer(r.DRAW_FRAMEBUFFER,ot.__webglFramebuffer);for(let Mt=0;Mt<S.length;Mt++){Q.push(r.COLOR_ATTACHMENT0+Mt),b.depthBuffer&&Q.push(ft);const It=ot.__ignoreDepthValues!==void 0?ot.__ignoreDepthValues:!1;if(It===!1&&(b.depthBuffer&&($|=r.DEPTH_BUFFER_BIT),b.stencilBuffer&&($|=r.STENCIL_BUFFER_BIT)),ct&&r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,ot.__webglColorRenderbuffer[Mt]),It===!0&&(r.invalidateFramebuffer(r.READ_FRAMEBUFFER,[ft]),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[ft])),ct){const Z=n.get(S[Mt]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,Z,0)}r.blitFramebuffer(0,0,z,J,0,0,z,J,$,r.NEAREST),c&&r.invalidateFramebuffer(r.READ_FRAMEBUFFER,Q)}if(e.bindFramebuffer(r.READ_FRAMEBUFFER,null),e.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),ct)for(let Mt=0;Mt<S.length;Mt++){e.bindFramebuffer(r.FRAMEBUFFER,ot.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Mt,r.RENDERBUFFER,ot.__webglColorRenderbuffer[Mt]);const It=n.get(S[Mt]).__webglTexture;e.bindFramebuffer(r.FRAMEBUFFER,ot.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+Mt,r.TEXTURE_2D,It,0)}e.bindFramebuffer(r.DRAW_FRAMEBUFFER,ot.__webglMultisampledFramebuffer)}}function At(b){return Math.min(i.maxSamples,b.samples)}function ht(b){const S=n.get(b);return a&&b.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function Qt(b){const S=o.render.frame;u.get(b)!==S&&(u.set(b,S),b.update())}function Dt(b,S){const z=b.colorSpace,J=b.format,$=b.type;return b.isCompressedTexture===!0||b.isVideoTexture===!0||b.format===1035||z!==Rn&&z!==rn&&(Xt.getTransfer(z)===$t?a===!1?t.has("EXT_sRGB")===!0&&J===1023?(b.format=1035,b.minFilter=1006,b.generateMipmaps=!1):S=jl.sRGBToLinear(S):(J!==1023||$!==1009)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",z)),S}this.allocateTextureUnit=C,this.resetTextureUnits=q,this.setTexture2D=O,this.setTexture2DArray=W,this.setTexture3D=X,this.setTextureCube=Y,this.rebindTextures=zt,this.setupRenderTarget=B,this.updateRenderTargetMipmap=Pe,this.updateMultisampleRenderTarget=gt,this.setupDepthRenderbuffer=St,this.setupFrameBufferTexture=pt,this.useMultisampledRTT=ht}function Am(r,t,e){const n=e.isWebGL2;function i(s,o=rn){let a;const l=Xt.getTransfer(o);if(s===1009)return r.UNSIGNED_BYTE;if(s===1017)return r.UNSIGNED_SHORT_4_4_4_4;if(s===1018)return r.UNSIGNED_SHORT_5_5_5_1;if(s===1010)return r.BYTE;if(s===1011)return r.SHORT;if(s===1012)return r.UNSIGNED_SHORT;if(s===1013)return r.INT;if(s===1014)return r.UNSIGNED_INT;if(s===1015)return r.FLOAT;if(s===1016)return n?r.HALF_FLOAT:(a=t.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(s===1021)return r.ALPHA;if(s===1023)return r.RGBA;if(s===1024)return r.LUMINANCE;if(s===1025)return r.LUMINANCE_ALPHA;if(s===1026)return r.DEPTH_COMPONENT;if(s===1027)return r.DEPTH_STENCIL;if(s===1035)return a=t.get("EXT_sRGB"),a!==null?a.SRGB_ALPHA_EXT:null;if(s===1028)return r.RED;if(s===1029)return r.RED_INTEGER;if(s===1030)return r.RG;if(s===1031)return r.RG_INTEGER;if(s===1033)return r.RGBA_INTEGER;if(s===33776||s===33777||s===33778||s===33779)if(l===$t)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(s===33776)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(s===33777)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(s===33778)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(s===33779)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(s===33776)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(s===33777)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(s===33778)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(s===33779)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(s===35840||s===35841||s===35842||s===35843)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(s===35840)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(s===35841)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(s===35842)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(s===35843)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(s===36196)return a=t.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if(s===37492||s===37496)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(s===37492)return l===$t?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(s===37496)return l===$t?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(s===37808||s===37809||s===37810||s===37811||s===37812||s===37813||s===37814||s===37815||s===37816||s===37817||s===37818||s===37819||s===37820||s===37821)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(s===37808)return l===$t?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(s===37809)return l===$t?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(s===37810)return l===$t?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(s===37811)return l===$t?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(s===37812)return l===$t?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(s===37813)return l===$t?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(s===37814)return l===$t?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(s===37815)return l===$t?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(s===37816)return l===$t?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(s===37817)return l===$t?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(s===37818)return l===$t?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(s===37819)return l===$t?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(s===37820)return l===$t?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(s===37821)return l===$t?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(s===36492||s===36494||s===36495)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(s===36492)return l===$t?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(s===36494)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(s===36495)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(s===36283||s===36284||s===36285||s===36286)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(s===36492)return a.COMPRESSED_RED_RGTC1_EXT;if(s===36284)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(s===36285)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(s===36286)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return s===1020?n?r.UNSIGNED_INT_24_8:(a=t.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null):r[s]!==void 0?r[s]:null}return{convert:i}}class bm extends nn{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Nn extends we{constructor(){super(),this.isGroup=!0,this.type="Group"}}const wm={type:"move"};class $s{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Nn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Nn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new N,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new N),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Nn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new N,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new N),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,s=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const _ of t.hand.values()){const p=e.getJointPose(_,n),d=this._getHandJoint(c,_);p!==null&&(d.matrix.fromArray(p.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=p.radius),d.visible=p!==null}const u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],f=u.position.distanceTo(h.position),m=.02,g=.005;c.inputState.pinching&&f>m+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&f<=m-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,n),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&s!==null&&(i=s),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(wm)))}return a!==null&&(a.visible=i!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Nn;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class Rm extends Ki{constructor(t,e){super();const n=this;let i=null,s=1,o=null,a="local-floor",l=1,c=null,u=null,h=null,f=null,m=null,g=null;const _=e.getContextAttributes();let p=null,d=null;const M=[],x=[],E=new Vt;let R=null;const w=new nn;w.layers.enable(1),w.viewport=new ve;const A=new nn;A.layers.enable(2),A.viewport=new ve;const L=[w,A],v=new bm;v.layers.enable(1),v.layers.enable(2);let y=null,U=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(k){let K=M[k];return K===void 0&&(K=new $s,M[k]=K),K.getTargetRaySpace()},this.getControllerGrip=function(k){let K=M[k];return K===void 0&&(K=new $s,M[k]=K),K.getGripSpace()},this.getHand=function(k){let K=M[k];return K===void 0&&(K=new $s,M[k]=K),K.getHandSpace()};function F(k){const K=x.indexOf(k.inputSource);if(K===-1)return;const rt=M[K];rt!==void 0&&(rt.update(k.inputSource,k.frame,c||o),rt.dispatchEvent({type:k.type,data:k.inputSource}))}function q(){i.removeEventListener("select",F),i.removeEventListener("selectstart",F),i.removeEventListener("selectend",F),i.removeEventListener("squeeze",F),i.removeEventListener("squeezestart",F),i.removeEventListener("squeezeend",F),i.removeEventListener("end",q),i.removeEventListener("inputsourceschange",C);for(let k=0;k<M.length;k++){const K=x[k];K!==null&&(x[k]=null,M[k].disconnect(K))}y=null,U=null,t.setRenderTarget(p),m=null,f=null,h=null,i=null,d=null,et.stop(),n.isPresenting=!1,t.setPixelRatio(R),t.setSize(E.width,E.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(k){s=k,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(k){a=k,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(k){c=k},this.getBaseLayer=function(){return f!==null?f:m},this.getBinding=function(){return h},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=function(k){return uo(this,null,function*(){if(i=k,i!==null){if(p=t.getRenderTarget(),i.addEventListener("select",F),i.addEventListener("selectstart",F),i.addEventListener("selectend",F),i.addEventListener("squeeze",F),i.addEventListener("squeezestart",F),i.addEventListener("squeezeend",F),i.addEventListener("end",q),i.addEventListener("inputsourceschange",C),_.xrCompatible!==!0&&(yield e.makeXRCompatible()),R=t.getPixelRatio(),t.getSize(E),i.renderState.layers===void 0||t.capabilities.isWebGL2===!1){const K={antialias:i.renderState.layers===void 0?_.antialias:!0,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:s};m=new XRWebGLLayer(i,e,K),i.updateRenderState({baseLayer:m}),t.setPixelRatio(1),t.setSize(m.framebufferWidth,m.framebufferHeight,!1),d=new fi(m.framebufferWidth,m.framebufferHeight,{format:1023,type:1009,colorSpace:t.outputColorSpace,stencilBuffer:_.stencil})}else{let K=null,rt=null,mt=null;_.depth&&(mt=_.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,K=_.stencil?1027:1026,rt=_.stencil?1020:1014);const pt={colorFormat:e.RGBA8,depthFormat:mt,scaleFactor:s};h=new XRWebGLBinding(i,e),f=h.createProjectionLayer(pt),i.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),d=new fi(f.textureWidth,f.textureHeight,{format:1023,type:1009,depthTexture:new oc(f.textureWidth,f.textureHeight,rt,void 0,void 0,void 0,void 0,void 0,void 0,K),stencilBuffer:_.stencil,colorSpace:t.outputColorSpace,samples:_.antialias?4:0});const wt=t.properties.get(d);wt.__ignoreDepthValues=f.ignoreDepthValues}d.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=yield i.requestReferenceSpace(a),et.setContext(i),et.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}})},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode};function C(k){for(let K=0;K<k.removed.length;K++){const rt=k.removed[K],mt=x.indexOf(rt);mt>=0&&(x[mt]=null,M[mt].disconnect(rt))}for(let K=0;K<k.added.length;K++){const rt=k.added[K];let mt=x.indexOf(rt);if(mt===-1){for(let wt=0;wt<M.length;wt++)if(wt>=x.length){x.push(rt),mt=wt;break}else if(x[wt]===null){x[wt]=rt,mt=wt;break}if(mt===-1)break}const pt=M[mt];pt&&pt.connect(rt)}}const I=new N,O=new N;function W(k,K,rt){I.setFromMatrixPosition(K.matrixWorld),O.setFromMatrixPosition(rt.matrixWorld);const mt=I.distanceTo(O),pt=K.projectionMatrix.elements,wt=rt.projectionMatrix.elements,Ct=pt[14]/(pt[10]-1),St=pt[14]/(pt[10]+1),zt=(pt[9]+1)/pt[5],B=(pt[9]-1)/pt[5],Pe=(pt[8]-1)/pt[0],gt=(wt[8]+1)/wt[0],At=Ct*Pe,ht=Ct*gt,Qt=mt/(-Pe+gt),Dt=Qt*-Pe;K.matrixWorld.decompose(k.position,k.quaternion,k.scale),k.translateX(Dt),k.translateZ(Qt),k.matrixWorld.compose(k.position,k.quaternion,k.scale),k.matrixWorldInverse.copy(k.matrixWorld).invert();const b=Ct+Qt,S=St+Qt,z=At-Dt,J=ht+(mt-Dt),$=zt*St/S*b,Q=B*St/S*b;k.projectionMatrix.makePerspective(z,J,$,Q,b,S),k.projectionMatrixInverse.copy(k.projectionMatrix).invert()}function X(k,K){K===null?k.matrixWorld.copy(k.matrix):k.matrixWorld.multiplyMatrices(K.matrixWorld,k.matrix),k.matrixWorldInverse.copy(k.matrixWorld).invert()}this.updateCamera=function(k){if(i===null)return;v.near=A.near=w.near=k.near,v.far=A.far=w.far=k.far,(y!==v.near||U!==v.far)&&(i.updateRenderState({depthNear:v.near,depthFar:v.far}),y=v.near,U=v.far);const K=k.parent,rt=v.cameras;X(v,K);for(let mt=0;mt<rt.length;mt++)X(rt[mt],K);rt.length===2?W(v,w,A):v.projectionMatrix.copy(w.projectionMatrix),Y(k,v,K)};function Y(k,K,rt){rt===null?k.matrix.copy(K.matrixWorld):(k.matrix.copy(rt.matrixWorld),k.matrix.invert(),k.matrix.multiply(K.matrixWorld)),k.matrix.decompose(k.position,k.quaternion,k.scale),k.updateMatrixWorld(!0),k.projectionMatrix.copy(K.projectionMatrix),k.projectionMatrixInverse.copy(K.projectionMatrixInverse),k.isPerspectiveCamera&&(k.fov=fa*2*Math.atan(1/k.projectionMatrix.elements[5]),k.zoom=1)}this.getCamera=function(){return v},this.getFoveation=function(){if(!(f===null&&m===null))return l},this.setFoveation=function(k){l=k,f!==null&&(f.fixedFoveation=k),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=k)};let j=null;function tt(k,K){if(u=K.getViewerPose(c||o),g=K,u!==null){const rt=u.views;m!==null&&(t.setRenderTargetFramebuffer(d,m.framebuffer),t.setRenderTarget(d));let mt=!1;rt.length!==v.cameras.length&&(v.cameras.length=0,mt=!0);for(let pt=0;pt<rt.length;pt++){const wt=rt[pt];let Ct=null;if(m!==null)Ct=m.getViewport(wt);else{const zt=h.getViewSubImage(f,wt);Ct=zt.viewport,pt===0&&(t.setRenderTargetTextures(d,zt.colorTexture,f.ignoreDepthValues?void 0:zt.depthStencilTexture),t.setRenderTarget(d))}let St=L[pt];St===void 0&&(St=new nn,St.layers.enable(pt),St.viewport=new ve,L[pt]=St),St.matrix.fromArray(wt.transform.matrix),St.matrix.decompose(St.position,St.quaternion,St.scale),St.projectionMatrix.fromArray(wt.projectionMatrix),St.projectionMatrixInverse.copy(St.projectionMatrix).invert(),St.viewport.set(Ct.x,Ct.y,Ct.width,Ct.height),pt===0&&(v.matrix.copy(St.matrix),v.matrix.decompose(v.position,v.quaternion,v.scale)),mt===!0&&v.cameras.push(St)}}for(let rt=0;rt<M.length;rt++){const mt=x[rt],pt=M[rt];mt!==null&&pt!==void 0&&pt.update(mt,K,c||o)}j&&j(k,K),K.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:K}),g=null}const et=new sc;et.setAnimationLoop(tt),this.setAnimationLoop=function(k){j=k},this.dispose=function(){}}}function Cm(r,t){function e(p,d){p.matrixAutoUpdate===!0&&p.updateMatrix(),d.value.copy(p.matrix)}function n(p,d){d.color.getRGB(p.fogColor.value,nc(r)),d.isFog?(p.fogNear.value=d.near,p.fogFar.value=d.far):d.isFogExp2&&(p.fogDensity.value=d.density)}function i(p,d,M,x,E){d.isMeshBasicMaterial||d.isMeshLambertMaterial?s(p,d):d.isMeshToonMaterial?(s(p,d),h(p,d)):d.isMeshPhongMaterial?(s(p,d),u(p,d)):d.isMeshStandardMaterial?(s(p,d),f(p,d),d.isMeshPhysicalMaterial&&m(p,d,E)):d.isMeshMatcapMaterial?(s(p,d),g(p,d)):d.isMeshDepthMaterial?s(p,d):d.isMeshDistanceMaterial?(s(p,d),_(p,d)):d.isMeshNormalMaterial?s(p,d):d.isLineBasicMaterial?(o(p,d),d.isLineDashedMaterial&&a(p,d)):d.isPointsMaterial?l(p,d,M,x):d.isSpriteMaterial?c(p,d):d.isShadowMaterial?(p.color.value.copy(d.color),p.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function s(p,d){p.opacity.value=d.opacity,d.color&&p.diffuse.value.copy(d.color),d.emissive&&p.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(p.map.value=d.map,e(d.map,p.mapTransform)),d.alphaMap&&(p.alphaMap.value=d.alphaMap,e(d.alphaMap,p.alphaMapTransform)),d.bumpMap&&(p.bumpMap.value=d.bumpMap,e(d.bumpMap,p.bumpMapTransform),p.bumpScale.value=d.bumpScale,d.side===1&&(p.bumpScale.value*=-1)),d.normalMap&&(p.normalMap.value=d.normalMap,e(d.normalMap,p.normalMapTransform),p.normalScale.value.copy(d.normalScale),d.side===1&&p.normalScale.value.negate()),d.displacementMap&&(p.displacementMap.value=d.displacementMap,e(d.displacementMap,p.displacementMapTransform),p.displacementScale.value=d.displacementScale,p.displacementBias.value=d.displacementBias),d.emissiveMap&&(p.emissiveMap.value=d.emissiveMap,e(d.emissiveMap,p.emissiveMapTransform)),d.specularMap&&(p.specularMap.value=d.specularMap,e(d.specularMap,p.specularMapTransform)),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest);const M=t.get(d).envMap;if(M&&(p.envMap.value=M,p.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=d.reflectivity,p.ior.value=d.ior,p.refractionRatio.value=d.refractionRatio),d.lightMap){p.lightMap.value=d.lightMap;const x=r._useLegacyLights===!0?Math.PI:1;p.lightMapIntensity.value=d.lightMapIntensity*x,e(d.lightMap,p.lightMapTransform)}d.aoMap&&(p.aoMap.value=d.aoMap,p.aoMapIntensity.value=d.aoMapIntensity,e(d.aoMap,p.aoMapTransform))}function o(p,d){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,d.map&&(p.map.value=d.map,e(d.map,p.mapTransform))}function a(p,d){p.dashSize.value=d.dashSize,p.totalSize.value=d.dashSize+d.gapSize,p.scale.value=d.scale}function l(p,d,M,x){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,p.size.value=d.size*M,p.scale.value=x*.5,d.map&&(p.map.value=d.map,e(d.map,p.uvTransform)),d.alphaMap&&(p.alphaMap.value=d.alphaMap,e(d.alphaMap,p.alphaMapTransform)),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest)}function c(p,d){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,p.rotation.value=d.rotation,d.map&&(p.map.value=d.map,e(d.map,p.mapTransform)),d.alphaMap&&(p.alphaMap.value=d.alphaMap,e(d.alphaMap,p.alphaMapTransform)),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest)}function u(p,d){p.specular.value.copy(d.specular),p.shininess.value=Math.max(d.shininess,1e-4)}function h(p,d){d.gradientMap&&(p.gradientMap.value=d.gradientMap)}function f(p,d){p.metalness.value=d.metalness,d.metalnessMap&&(p.metalnessMap.value=d.metalnessMap,e(d.metalnessMap,p.metalnessMapTransform)),p.roughness.value=d.roughness,d.roughnessMap&&(p.roughnessMap.value=d.roughnessMap,e(d.roughnessMap,p.roughnessMapTransform)),t.get(d).envMap&&(p.envMapIntensity.value=d.envMapIntensity)}function m(p,d,M){p.ior.value=d.ior,d.sheen>0&&(p.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),p.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(p.sheenColorMap.value=d.sheenColorMap,e(d.sheenColorMap,p.sheenColorMapTransform)),d.sheenRoughnessMap&&(p.sheenRoughnessMap.value=d.sheenRoughnessMap,e(d.sheenRoughnessMap,p.sheenRoughnessMapTransform))),d.clearcoat>0&&(p.clearcoat.value=d.clearcoat,p.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(p.clearcoatMap.value=d.clearcoatMap,e(d.clearcoatMap,p.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,e(d.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(p.clearcoatNormalMap.value=d.clearcoatNormalMap,e(d.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===1&&p.clearcoatNormalScale.value.negate())),d.iridescence>0&&(p.iridescence.value=d.iridescence,p.iridescenceIOR.value=d.iridescenceIOR,p.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(p.iridescenceMap.value=d.iridescenceMap,e(d.iridescenceMap,p.iridescenceMapTransform)),d.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=d.iridescenceThicknessMap,e(d.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),d.transmission>0&&(p.transmission.value=d.transmission,p.transmissionSamplerMap.value=M.texture,p.transmissionSamplerSize.value.set(M.width,M.height),d.transmissionMap&&(p.transmissionMap.value=d.transmissionMap,e(d.transmissionMap,p.transmissionMapTransform)),p.thickness.value=d.thickness,d.thicknessMap&&(p.thicknessMap.value=d.thicknessMap,e(d.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=d.attenuationDistance,p.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(p.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(p.anisotropyMap.value=d.anisotropyMap,e(d.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=d.specularIntensity,p.specularColor.value.copy(d.specularColor),d.specularColorMap&&(p.specularColorMap.value=d.specularColorMap,e(d.specularColorMap,p.specularColorMapTransform)),d.specularIntensityMap&&(p.specularIntensityMap.value=d.specularIntensityMap,e(d.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,d){d.matcap&&(p.matcap.value=d.matcap)}function _(p,d){const M=t.get(d).light;p.referencePosition.value.setFromMatrixPosition(M.matrixWorld),p.nearDistance.value=M.shadow.camera.near,p.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function Pm(r,t,e,n){let i={},s={},o=[];const a=e.isWebGL2?r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(M,x){const E=x.program;n.uniformBlockBinding(M,E)}function c(M,x){let E=i[M.id];E===void 0&&(g(M),E=u(M),i[M.id]=E,M.addEventListener("dispose",p));const R=x.program;n.updateUBOMapping(M,R);const w=t.render.frame;s[M.id]!==w&&(f(M),s[M.id]=w)}function u(M){const x=h();M.__bindingPointIndex=x;const E=r.createBuffer(),R=M.__size,w=M.usage;return r.bindBuffer(r.UNIFORM_BUFFER,E),r.bufferData(r.UNIFORM_BUFFER,R,w),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,x,E),E}function h(){for(let M=0;M<a;M++)if(o.indexOf(M)===-1)return o.push(M),M;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(M){const x=i[M.id],E=M.uniforms,R=M.__cache;r.bindBuffer(r.UNIFORM_BUFFER,x);for(let w=0,A=E.length;w<A;w++){const L=Array.isArray(E[w])?E[w]:[E[w]];for(let v=0,y=L.length;v<y;v++){const U=L[v];if(m(U,w,v,R)===!0){const F=U.__offset,q=Array.isArray(U.value)?U.value:[U.value];let C=0;for(let I=0;I<q.length;I++){const O=q[I],W=_(O);typeof O=="number"||typeof O=="boolean"?(U.__data[0]=O,r.bufferSubData(r.UNIFORM_BUFFER,F+C,U.__data)):O.isMatrix3?(U.__data[0]=O.elements[0],U.__data[1]=O.elements[1],U.__data[2]=O.elements[2],U.__data[3]=0,U.__data[4]=O.elements[3],U.__data[5]=O.elements[4],U.__data[6]=O.elements[5],U.__data[7]=0,U.__data[8]=O.elements[6],U.__data[9]=O.elements[7],U.__data[10]=O.elements[8],U.__data[11]=0):(O.toArray(U.__data,C),C+=W.storage/Float32Array.BYTES_PER_ELEMENT)}r.bufferSubData(r.UNIFORM_BUFFER,F,U.__data)}}}r.bindBuffer(r.UNIFORM_BUFFER,null)}function m(M,x,E,R){const w=M.value,A=x+"_"+E;if(R[A]===void 0)return typeof w=="number"||typeof w=="boolean"?R[A]=w:R[A]=w.clone(),!0;{const L=R[A];if(typeof w=="number"||typeof w=="boolean"){if(L!==w)return R[A]=w,!0}else if(L.equals(w)===!1)return L.copy(w),!0}return!1}function g(M){const x=M.uniforms;let E=0;const R=16;for(let A=0,L=x.length;A<L;A++){const v=Array.isArray(x[A])?x[A]:[x[A]];for(let y=0,U=v.length;y<U;y++){const F=v[y],q=Array.isArray(F.value)?F.value:[F.value];for(let C=0,I=q.length;C<I;C++){const O=q[C],W=_(O),X=E%R;X!==0&&R-X<W.boundary&&(E+=R-X),F.__data=new Float32Array(W.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=E,E+=W.storage}}}const w=E%R;return w>0&&(E+=R-w),M.__size=E,M.__cache={},this}function _(M){const x={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(x.boundary=4,x.storage=4):M.isVector2?(x.boundary=8,x.storage=8):M.isVector3||M.isColor?(x.boundary=16,x.storage=12):M.isVector4?(x.boundary=16,x.storage=16):M.isMatrix3?(x.boundary=48,x.storage=48):M.isMatrix4?(x.boundary=64,x.storage=64):M.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",M),x}function p(M){const x=M.target;x.removeEventListener("dispose",p);const E=o.indexOf(x.__bindingPointIndex);o.splice(E,1),r.deleteBuffer(i[x.id]),delete i[x.id],delete s[x.id]}function d(){for(const M in i)r.deleteBuffer(i[M]);o=[],i={},s={}}return{bind:l,update:c,dispose:d}}class dc{constructor(t={}){const{canvas:e=yu(),context:n=null,depth:i=!0,stencil:s=!0,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1}=t;this.isWebGLRenderer=!0;let f;n!==null?f=n.getContextAttributes().alpha:f=o;const m=new Uint32Array(4),g=new Int32Array(4);let _=null,p=null;const d=[],M=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Me,this._useLegacyLights=!1,this.toneMapping=0,this.toneMappingExposure=1;const x=this;let E=!1,R=0,w=0,A=null,L=-1,v=null;const y=new ve,U=new ve;let F=null;const q=new Ht(0);let C=0,I=e.width,O=e.height,W=1,X=null,Y=null;const j=new ve(0,0,I,O),tt=new ve(0,0,I,O);let et=!1;const k=new Da;let K=!1,rt=!1,mt=null;const pt=new fe,wt=new Vt,Ct=new N,St={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function zt(){return A===null?W:1}let B=n;function Pe(T,D){for(let V=0;V<T.length;V++){const H=T[V],G=e.getContext(H,D);if(G!==null)return G}return null}try{const T={alpha:!0,depth:i,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Ca}`),e.addEventListener("webglcontextlost",nt,!1),e.addEventListener("webglcontextrestored",P,!1),e.addEventListener("webglcontextcreationerror",st,!1),B===null){const D=["webgl2","webgl","experimental-webgl"];if(x.isWebGL1Renderer===!0&&D.shift(),B=Pe(D,T),B===null)throw Pe(D)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext!="undefined"&&B instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),B.getShaderPrecisionFormat===void 0&&(B.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(T){throw console.error("THREE.WebGLRenderer: "+T.message),T}let gt,At,ht,Qt,Dt,b,S,z,J,$,Q,ft,ot,ct,Mt,It,Z,Wt,Bt,yt,_t,ut,Pt,kt;function re(){gt=new zd(B),At=new Ud(B,gt,t),gt.init(At),ut=new Am(B,gt,At),ht=new Tm(B,gt,At),Qt=new kd(B),Dt=new cm,b=new ym(B,gt,ht,Dt,At,ut,Qt),S=new Nd(x),z=new Gd(x),J=new Zu(B,At),Pt=new Dd(B,gt,J,At),$=new Vd(B,J,Qt,Pt),Q=new Yd(B,$,J,Qt),Bt=new qd(B,At,b),It=new Fd(Dt),ft=new lm(x,S,z,gt,At,Pt,It),ot=new Cm(x,Dt),ct=new hm,Mt=new gm(gt,At),Wt=new Ld(x,S,z,ht,Q,f,l),Z=new Em(x,Q,At),kt=new Pm(B,Qt,At,ht),yt=new Id(B,gt,Qt,At),_t=new Hd(B,gt,Qt,At),Qt.programs=ft.programs,x.capabilities=At,x.extensions=gt,x.properties=Dt,x.renderLists=ct,x.shadowMap=Z,x.state=ht,x.info=Qt}re();const Ft=new Rm(x,B);this.xr=Ft,this.getContext=function(){return B},this.getContextAttributes=function(){return B.getContextAttributes()},this.forceContextLoss=function(){const T=gt.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=gt.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return W},this.setPixelRatio=function(T){T!==void 0&&(W=T,this.setSize(I,O,!1))},this.getSize=function(T){return T.set(I,O)},this.setSize=function(T,D,V=!0){if(Ft.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}I=T,O=D,e.width=Math.floor(T*W),e.height=Math.floor(D*W),V===!0&&(e.style.width=T+"px",e.style.height=D+"px"),this.setViewport(0,0,T,D)},this.getDrawingBufferSize=function(T){return T.set(I*W,O*W).floor()},this.setDrawingBufferSize=function(T,D,V){I=T,O=D,W=V,e.width=Math.floor(T*V),e.height=Math.floor(D*V),this.setViewport(0,0,T,D)},this.getCurrentViewport=function(T){return T.copy(y)},this.getViewport=function(T){return T.copy(j)},this.setViewport=function(T,D,V,H){T.isVector4?j.set(T.x,T.y,T.z,T.w):j.set(T,D,V,H),ht.viewport(y.copy(j).multiplyScalar(W).floor())},this.getScissor=function(T){return T.copy(tt)},this.setScissor=function(T,D,V,H){T.isVector4?tt.set(T.x,T.y,T.z,T.w):tt.set(T,D,V,H),ht.scissor(U.copy(tt).multiplyScalar(W).floor())},this.getScissorTest=function(){return et},this.setScissorTest=function(T){ht.setScissorTest(et=T)},this.setOpaqueSort=function(T){X=T},this.setTransparentSort=function(T){Y=T},this.getClearColor=function(T){return T.copy(Wt.getClearColor())},this.setClearColor=function(){Wt.setClearColor.apply(Wt,arguments)},this.getClearAlpha=function(){return Wt.getClearAlpha()},this.setClearAlpha=function(){Wt.setClearAlpha.apply(Wt,arguments)},this.clear=function(T=!0,D=!0,V=!0){let H=0;if(T){let G=!1;if(A!==null){const lt=A.texture.format;G=lt===1033||lt===1031||lt===1029}if(G){const lt=A.texture.type,dt=lt===1009||lt===1014||lt===1012||lt===1020||lt===1017||lt===1018,xt=Wt.getClearColor(),Tt=Wt.getClearAlpha(),Ut=xt.r,bt=xt.g,Rt=xt.b;dt?(m[0]=Ut,m[1]=bt,m[2]=Rt,m[3]=Tt,B.clearBufferuiv(B.COLOR,0,m)):(g[0]=Ut,g[1]=bt,g[2]=Rt,g[3]=Tt,B.clearBufferiv(B.COLOR,0,g))}else H|=B.COLOR_BUFFER_BIT}D&&(H|=B.DEPTH_BUFFER_BIT),V&&(H|=B.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),B.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",nt,!1),e.removeEventListener("webglcontextrestored",P,!1),e.removeEventListener("webglcontextcreationerror",st,!1),ct.dispose(),Mt.dispose(),Dt.dispose(),S.dispose(),z.dispose(),Q.dispose(),Pt.dispose(),kt.dispose(),ft.dispose(),Ft.dispose(),Ft.removeEventListener("sessionstart",Le),Ft.removeEventListener("sessionend",Zt),mt&&(mt.dispose(),mt=null),De.stop()};function nt(T){T.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),E=!0}function P(){console.log("THREE.WebGLRenderer: Context Restored."),E=!1;const T=Qt.autoReset,D=Z.enabled,V=Z.autoUpdate,H=Z.needsUpdate,G=Z.type;re(),Qt.autoReset=T,Z.enabled=D,Z.autoUpdate=V,Z.needsUpdate=H,Z.type=G}function st(T){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function at(T){const D=T.target;D.removeEventListener("dispose",at),Et(D)}function Et(T){vt(T),Dt.remove(T)}function vt(T){const D=Dt.get(T).programs;D!==void 0&&(D.forEach(function(V){ft.releaseProgram(V)}),T.isShaderMaterial&&ft.releaseShaderCache(T))}this.renderBufferDirect=function(T,D,V,H,G,lt){D===null&&(D=St);const dt=G.isMesh&&G.matrixWorld.determinant()<0,xt=pu(T,D,V,H,G);ht.setMaterial(H,dt);let Tt=V.index,Ut=1;if(H.wireframe===!0){if(Tt=$.getWireframeAttribute(V),Tt===void 0)return;Ut=2}const bt=V.drawRange,Rt=V.attributes.position;let le=bt.start*Ut,He=(bt.start+bt.count)*Ut;lt!==null&&(le=Math.max(le,lt.start*Ut),He=Math.min(He,(lt.start+lt.count)*Ut)),Tt!==null?(le=Math.max(le,0),He=Math.min(He,Tt.count)):Rt!=null&&(le=Math.max(le,0),He=Math.min(He,Rt.count));const _e=He-le;if(_e<0||_e===1/0)return;Pt.setup(G,H,xt,V,Tt);let Mn,te=yt;if(Tt!==null&&(Mn=J.get(Tt),te=_t,te.setIndex(Mn)),G.isMesh)H.wireframe===!0?(ht.setLineWidth(H.wireframeLinewidth*zt()),te.setMode(B.LINES)):te.setMode(B.TRIANGLES);else if(G.isLine){let Nt=H.linewidth;Nt===void 0&&(Nt=1),ht.setLineWidth(Nt*zt()),G.isLineSegments?te.setMode(B.LINES):G.isLineLoop?te.setMode(B.LINE_LOOP):te.setMode(B.LINE_STRIP)}else G.isPoints?te.setMode(B.POINTS):G.isSprite&&te.setMode(B.TRIANGLES);if(G.isBatchedMesh)te.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else if(G.isInstancedMesh)te.renderInstances(le,_e,G.count);else if(V.isInstancedBufferGeometry){const Nt=V._maxInstanceCount!==void 0?V._maxInstanceCount:1/0,Ss=Math.min(V.instanceCount,Nt);te.renderInstances(le,_e,Ss)}else te.render(le,_e)};function Kt(T,D,V){T.transparent===!0&&T.side===2&&T.forceSinglePass===!1?(T.side=1,T.needsUpdate=!0,Rr(T,D,V),T.side=0,T.needsUpdate=!0,Rr(T,D,V),T.side=2):Rr(T,D,V)}this.compile=function(T,D,V=null){V===null&&(V=T),p=Mt.get(V),p.init(),M.push(p),V.traverseVisible(function(G){G.isLight&&G.layers.test(D.layers)&&(p.pushLight(G),G.castShadow&&p.pushShadow(G))}),T!==V&&T.traverseVisible(function(G){G.isLight&&G.layers.test(D.layers)&&(p.pushLight(G),G.castShadow&&p.pushShadow(G))}),p.setupLights(x._useLegacyLights);const H=new Set;return T.traverse(function(G){const lt=G.material;if(lt)if(Array.isArray(lt))for(let dt=0;dt<lt.length;dt++){const xt=lt[dt];Kt(xt,V,G),H.add(xt)}else Kt(lt,V,G),H.add(lt)}),M.pop(),p=null,H},this.compileAsync=function(T,D,V=null){const H=this.compile(T,D,V);return new Promise(G=>{function lt(){if(H.forEach(function(dt){Dt.get(dt).currentProgram.isReady()&&H.delete(dt)}),H.size===0){G(T);return}setTimeout(lt,10)}gt.get("KHR_parallel_shader_compile")!==null?lt():setTimeout(lt,10)})};let jt=null;function me(T){jt&&jt(T)}function Le(){De.stop()}function Zt(){De.start()}const De=new sc;De.setAnimationLoop(me),typeof self!="undefined"&&De.setContext(self),this.setAnimationLoop=function(T){jt=T,Ft.setAnimationLoop(T),T===null?De.stop():De.start()},Ft.addEventListener("sessionstart",Le),Ft.addEventListener("sessionend",Zt),this.render=function(T,D){if(D!==void 0&&D.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(E===!0)return;T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),D.parent===null&&D.matrixWorldAutoUpdate===!0&&D.updateMatrixWorld(),Ft.enabled===!0&&Ft.isPresenting===!0&&(Ft.cameraAutoUpdate===!0&&Ft.updateCamera(D),D=Ft.getCamera()),T.isScene===!0&&T.onBeforeRender(x,T,D,A),p=Mt.get(T,M.length),p.init(),M.push(p),pt.multiplyMatrices(D.projectionMatrix,D.matrixWorldInverse),k.setFromProjectionMatrix(pt),rt=this.localClippingEnabled,K=It.init(this.clippingPlanes,rt),_=ct.get(T,d.length),_.init(),d.push(_),fn(T,D,0,x.sortObjects),_.finish(),x.sortObjects===!0&&_.sort(X,Y),this.info.render.frame++,K===!0&&It.beginShadows();const V=p.state.shadowsArray;if(Z.render(V,T,D),K===!0&&It.endShadows(),this.info.autoReset===!0&&this.info.reset(),Wt.render(_,T),p.setupLights(x._useLegacyLights),D.isArrayCamera){const H=D.cameras;for(let G=0,lt=H.length;G<lt;G++){const dt=H[G];eo(_,T,dt,dt.viewport)}}else eo(_,T,D);A!==null&&(b.updateMultisampleRenderTarget(A),b.updateRenderTargetMipmap(A)),T.isScene===!0&&T.onAfterRender(x,T,D),Pt.resetDefaultState(),L=-1,v=null,M.pop(),M.length>0?p=M[M.length-1]:p=null,d.pop(),d.length>0?_=d[d.length-1]:_=null};function fn(T,D,V,H){if(T.visible===!1)return;if(T.layers.test(D.layers)){if(T.isGroup)V=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(D);else if(T.isLight)p.pushLight(T),T.castShadow&&p.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||k.intersectsSprite(T)){H&&Ct.setFromMatrixPosition(T.matrixWorld).applyMatrix4(pt);const dt=Q.update(T),xt=T.material;xt.visible&&_.push(T,dt,xt,V,Ct.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||k.intersectsObject(T))){const dt=Q.update(T),xt=T.material;if(H&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),Ct.copy(T.boundingSphere.center)):(dt.boundingSphere===null&&dt.computeBoundingSphere(),Ct.copy(dt.boundingSphere.center)),Ct.applyMatrix4(T.matrixWorld).applyMatrix4(pt)),Array.isArray(xt)){const Tt=dt.groups;for(let Ut=0,bt=Tt.length;Ut<bt;Ut++){const Rt=Tt[Ut],le=xt[Rt.materialIndex];le&&le.visible&&_.push(T,dt,le,V,Ct.z,Rt)}}else xt.visible&&_.push(T,dt,xt,V,Ct.z,null)}}const lt=T.children;for(let dt=0,xt=lt.length;dt<xt;dt++)fn(lt[dt],D,V,H)}function eo(T,D,V,H){const G=T.opaque,lt=T.transmissive,dt=T.transparent;p.setupLightsView(V),K===!0&&It.setGlobalState(x.clippingPlanes,V),lt.length>0&&du(G,lt,D,V),H&&ht.viewport(y.copy(H)),G.length>0&&wr(G,D,V),lt.length>0&&wr(lt,D,V),dt.length>0&&wr(dt,D,V),ht.buffers.depth.setTest(!0),ht.buffers.depth.setMask(!0),ht.buffers.color.setMask(!0),ht.setPolygonOffset(!1)}function du(T,D,V,H){if((V.isScene===!0?V.overrideMaterial:null)!==null)return;const lt=At.isWebGL2;mt===null&&(mt=new fi(1,1,{generateMipmaps:!0,type:gt.has("EXT_color_buffer_half_float")?1016:1009,minFilter:1008,samples:lt?4:0})),x.getDrawingBufferSize(wt),lt?mt.setSize(wt.x,wt.y):mt.setSize(da(wt.x),da(wt.y));const dt=x.getRenderTarget();x.setRenderTarget(mt),x.getClearColor(q),C=x.getClearAlpha(),C<1&&x.setClearColor(16777215,.5),x.clear();const xt=x.toneMapping;x.toneMapping=0,wr(T,V,H),b.updateMultisampleRenderTarget(mt),b.updateRenderTargetMipmap(mt);let Tt=!1;for(let Ut=0,bt=D.length;Ut<bt;Ut++){const Rt=D[Ut],le=Rt.object,He=Rt.geometry,_e=Rt.material,Mn=Rt.group;if(_e.side===2&&le.layers.test(H.layers)){const te=_e.side;_e.side=1,_e.needsUpdate=!0,no(le,V,H,He,_e,Mn),_e.side=te,_e.needsUpdate=!0,Tt=!0}}Tt===!0&&(b.updateMultisampleRenderTarget(mt),b.updateRenderTargetMipmap(mt)),x.setRenderTarget(dt),x.setClearColor(q,C),x.toneMapping=xt}function wr(T,D,V){const H=D.isScene===!0?D.overrideMaterial:null;for(let G=0,lt=T.length;G<lt;G++){const dt=T[G],xt=dt.object,Tt=dt.geometry,Ut=H===null?dt.material:H,bt=dt.group;xt.layers.test(V.layers)&&no(xt,D,V,Tt,Ut,bt)}}function no(T,D,V,H,G,lt){T.onBeforeRender(x,D,V,H,G,lt),T.modelViewMatrix.multiplyMatrices(V.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),G.onBeforeRender(x,D,V,H,T,lt),G.transparent===!0&&G.side===2&&G.forceSinglePass===!1?(G.side=1,G.needsUpdate=!0,x.renderBufferDirect(V,D,H,G,T,lt),G.side=0,G.needsUpdate=!0,x.renderBufferDirect(V,D,H,G,T,lt),G.side=2):x.renderBufferDirect(V,D,H,G,T,lt),T.onAfterRender(x,D,V,H,G,lt)}function Rr(T,D,V){D.isScene!==!0&&(D=St);const H=Dt.get(T),G=p.state.lights,lt=p.state.shadowsArray,dt=G.state.version,xt=ft.getParameters(T,G.state,lt,D,V),Tt=ft.getProgramCacheKey(xt);let Ut=H.programs;H.environment=T.isMeshStandardMaterial?D.environment:null,H.fog=D.fog,H.envMap=(T.isMeshStandardMaterial?z:S).get(T.envMap||H.environment),Ut===void 0&&(T.addEventListener("dispose",at),Ut=new Map,H.programs=Ut);let bt=Ut.get(Tt);if(bt!==void 0){if(H.currentProgram===bt&&H.lightsStateVersion===dt)return ro(T,xt),bt}else xt.uniforms=ft.getUniforms(T),T.onBuild(V,xt,x),T.onBeforeCompile(xt,x),bt=ft.acquireProgram(xt,Tt),Ut.set(Tt,bt),H.uniforms=xt.uniforms;const Rt=H.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(Rt.clippingPlanes=It.uniform),ro(T,xt),H.needsLights=_u(T),H.lightsStateVersion=dt,H.needsLights&&(Rt.ambientLightColor.value=G.state.ambient,Rt.lightProbe.value=G.state.probe,Rt.directionalLights.value=G.state.directional,Rt.directionalLightShadows.value=G.state.directionalShadow,Rt.spotLights.value=G.state.spot,Rt.spotLightShadows.value=G.state.spotShadow,Rt.rectAreaLights.value=G.state.rectArea,Rt.ltc_1.value=G.state.rectAreaLTC1,Rt.ltc_2.value=G.state.rectAreaLTC2,Rt.pointLights.value=G.state.point,Rt.pointLightShadows.value=G.state.pointShadow,Rt.hemisphereLights.value=G.state.hemi,Rt.directionalShadowMap.value=G.state.directionalShadowMap,Rt.directionalShadowMatrix.value=G.state.directionalShadowMatrix,Rt.spotShadowMap.value=G.state.spotShadowMap,Rt.spotLightMatrix.value=G.state.spotLightMatrix,Rt.spotLightMap.value=G.state.spotLightMap,Rt.pointShadowMap.value=G.state.pointShadowMap,Rt.pointShadowMatrix.value=G.state.pointShadowMatrix),H.currentProgram=bt,H.uniformsList=null,bt}function io(T){if(T.uniformsList===null){const D=T.currentProgram.getUniforms();T.uniformsList=Qr.seqWithValue(D.seq,T.uniforms)}return T.uniformsList}function ro(T,D){const V=Dt.get(T);V.outputColorSpace=D.outputColorSpace,V.batching=D.batching,V.instancing=D.instancing,V.instancingColor=D.instancingColor,V.skinning=D.skinning,V.morphTargets=D.morphTargets,V.morphNormals=D.morphNormals,V.morphColors=D.morphColors,V.morphTargetsCount=D.morphTargetsCount,V.numClippingPlanes=D.numClippingPlanes,V.numIntersection=D.numClipIntersection,V.vertexAlphas=D.vertexAlphas,V.vertexTangents=D.vertexTangents,V.toneMapping=D.toneMapping}function pu(T,D,V,H,G){D.isScene!==!0&&(D=St),b.resetTextureUnits();const lt=D.fog,dt=H.isMeshStandardMaterial?D.environment:null,xt=A===null?x.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:Rn,Tt=(H.isMeshStandardMaterial?z:S).get(H.envMap||dt),Ut=H.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,bt=!!V.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),Rt=!!V.morphAttributes.position,le=!!V.morphAttributes.normal,He=!!V.morphAttributes.color;let _e=0;H.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(_e=x.toneMapping);const Mn=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,te=Mn!==void 0?Mn.length:0,Nt=Dt.get(H),Ss=p.state.lights;if(K===!0&&(rt===!0||T!==v)){const Qe=T===v&&H.id===L;It.setState(H,T,Qe)}let se=!1;H.version===Nt.__version?(Nt.needsLights&&Nt.lightsStateVersion!==Ss.state.version||Nt.outputColorSpace!==xt||G.isBatchedMesh&&Nt.batching===!1||!G.isBatchedMesh&&Nt.batching===!0||G.isInstancedMesh&&Nt.instancing===!1||!G.isInstancedMesh&&Nt.instancing===!0||G.isSkinnedMesh&&Nt.skinning===!1||!G.isSkinnedMesh&&Nt.skinning===!0||G.isInstancedMesh&&Nt.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&Nt.instancingColor===!1&&G.instanceColor!==null||Nt.envMap!==Tt||H.fog===!0&&Nt.fog!==lt||Nt.numClippingPlanes!==void 0&&(Nt.numClippingPlanes!==It.numPlanes||Nt.numIntersection!==It.numIntersection)||Nt.vertexAlphas!==Ut||Nt.vertexTangents!==bt||Nt.morphTargets!==Rt||Nt.morphNormals!==le||Nt.morphColors!==He||Nt.toneMapping!==_e||At.isWebGL2===!0&&Nt.morphTargetsCount!==te)&&(se=!0):(se=!0,Nt.__version=H.version);let qn=Nt.currentProgram;se===!0&&(qn=Rr(H,D,G));let so=!1,$i=!1,Es=!1;const Te=qn.getUniforms(),Yn=Nt.uniforms;if(ht.useProgram(qn.program)&&(so=!0,$i=!0,Es=!0),H.id!==L&&(L=H.id,$i=!0),so||v!==T){Te.setValue(B,"projectionMatrix",T.projectionMatrix),Te.setValue(B,"viewMatrix",T.matrixWorldInverse);const Qe=Te.map.cameraPosition;Qe!==void 0&&Qe.setValue(B,Ct.setFromMatrixPosition(T.matrixWorld)),At.logarithmicDepthBuffer&&Te.setValue(B,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&Te.setValue(B,"isOrthographic",T.isOrthographicCamera===!0),v!==T&&(v=T,$i=!0,Es=!0)}if(G.isSkinnedMesh){Te.setOptional(B,G,"bindMatrix"),Te.setOptional(B,G,"bindMatrixInverse");const Qe=G.skeleton;Qe&&(At.floatVertexTextures?(Qe.boneTexture===null&&Qe.computeBoneTexture(),Te.setValue(B,"boneTexture",Qe.boneTexture,b)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}G.isBatchedMesh&&(Te.setOptional(B,G,"batchingTexture"),Te.setValue(B,"batchingTexture",G._matricesTexture,b));const Ts=V.morphAttributes;if((Ts.position!==void 0||Ts.normal!==void 0||Ts.color!==void 0&&At.isWebGL2===!0)&&Bt.update(G,V,qn),($i||Nt.receiveShadow!==G.receiveShadow)&&(Nt.receiveShadow=G.receiveShadow,Te.setValue(B,"receiveShadow",G.receiveShadow)),H.isMeshGouraudMaterial&&H.envMap!==null&&(Yn.envMap.value=Tt,Yn.flipEnvMap.value=Tt.isCubeTexture&&Tt.isRenderTargetTexture===!1?-1:1),$i&&(Te.setValue(B,"toneMappingExposure",x.toneMappingExposure),Nt.needsLights&&mu(Yn,Es),lt&&H.fog===!0&&ot.refreshFogUniforms(Yn,lt),ot.refreshMaterialUniforms(Yn,H,W,O,mt),Qr.upload(B,io(Nt),Yn,b)),H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(Qr.upload(B,io(Nt),Yn,b),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&Te.setValue(B,"center",G.center),Te.setValue(B,"modelViewMatrix",G.modelViewMatrix),Te.setValue(B,"normalMatrix",G.normalMatrix),Te.setValue(B,"modelMatrix",G.matrixWorld),H.isShaderMaterial||H.isRawShaderMaterial){const Qe=H.uniformsGroups;for(let ys=0,gu=Qe.length;ys<gu;ys++)if(At.isWebGL2){const ao=Qe[ys];kt.update(ao,qn),kt.bind(ao,qn)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return qn}function mu(T,D){T.ambientLightColor.needsUpdate=D,T.lightProbe.needsUpdate=D,T.directionalLights.needsUpdate=D,T.directionalLightShadows.needsUpdate=D,T.pointLights.needsUpdate=D,T.pointLightShadows.needsUpdate=D,T.spotLights.needsUpdate=D,T.spotLightShadows.needsUpdate=D,T.rectAreaLights.needsUpdate=D,T.hemisphereLights.needsUpdate=D}function _u(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(T,D,V){Dt.get(T.texture).__webglTexture=D,Dt.get(T.depthTexture).__webglTexture=V;const H=Dt.get(T);H.__hasExternalTextures=!0,H.__hasExternalTextures&&(H.__autoAllocateDepthBuffer=V===void 0,H.__autoAllocateDepthBuffer||gt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),H.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(T,D){const V=Dt.get(T);V.__webglFramebuffer=D,V.__useDefaultFramebuffer=D===void 0},this.setRenderTarget=function(T,D=0,V=0){A=T,R=D,w=V;let H=!0,G=null,lt=!1,dt=!1;if(T){const Tt=Dt.get(T);Tt.__useDefaultFramebuffer!==void 0?(ht.bindFramebuffer(B.FRAMEBUFFER,null),H=!1):Tt.__webglFramebuffer===void 0?b.setupRenderTarget(T):Tt.__hasExternalTextures&&b.rebindTextures(T,Dt.get(T.texture).__webglTexture,Dt.get(T.depthTexture).__webglTexture);const Ut=T.texture;(Ut.isData3DTexture||Ut.isDataArrayTexture||Ut.isCompressedArrayTexture)&&(dt=!0);const bt=Dt.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(bt[D])?G=bt[D][V]:G=bt[D],lt=!0):At.isWebGL2&&T.samples>0&&b.useMultisampledRTT(T)===!1?G=Dt.get(T).__webglMultisampledFramebuffer:Array.isArray(bt)?G=bt[V]:G=bt,y.copy(T.viewport),U.copy(T.scissor),F=T.scissorTest}else y.copy(j).multiplyScalar(W).floor(),U.copy(tt).multiplyScalar(W).floor(),F=et;if(ht.bindFramebuffer(B.FRAMEBUFFER,G)&&At.drawBuffers&&H&&ht.drawBuffers(T,G),ht.viewport(y),ht.scissor(U),ht.setScissorTest(F),lt){const Tt=Dt.get(T.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_CUBE_MAP_POSITIVE_X+D,Tt.__webglTexture,V)}else if(dt){const Tt=Dt.get(T.texture),Ut=D||0;B.framebufferTextureLayer(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,Tt.__webglTexture,V||0,Ut)}L=-1},this.readRenderTargetPixels=function(T,D,V,H,G,lt,dt){if(!(T&&T.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let xt=Dt.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&dt!==void 0&&(xt=xt[dt]),xt){ht.bindFramebuffer(B.FRAMEBUFFER,xt);try{const Tt=T.texture,Ut=Tt.format,bt=Tt.type;if(Ut!==1023&&ut.convert(Ut)!==B.getParameter(B.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const Rt=bt===1016&&(gt.has("EXT_color_buffer_half_float")||At.isWebGL2&&gt.has("EXT_color_buffer_float"));if(bt!==1009&&ut.convert(bt)!==B.getParameter(B.IMPLEMENTATION_COLOR_READ_TYPE)&&!(bt===1015&&(At.isWebGL2||gt.has("OES_texture_float")||gt.has("WEBGL_color_buffer_float")))&&!Rt){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}D>=0&&D<=T.width-H&&V>=0&&V<=T.height-G&&B.readPixels(D,V,H,G,ut.convert(Ut),ut.convert(bt),lt)}finally{const Tt=A!==null?Dt.get(A).__webglFramebuffer:null;ht.bindFramebuffer(B.FRAMEBUFFER,Tt)}}},this.copyFramebufferToTexture=function(T,D,V=0){const H=Math.pow(2,-V),G=Math.floor(D.image.width*H),lt=Math.floor(D.image.height*H);b.setTexture2D(D,0),B.copyTexSubImage2D(B.TEXTURE_2D,V,0,0,T.x,T.y,G,lt),ht.unbindTexture()},this.copyTextureToTexture=function(T,D,V,H=0){const G=D.image.width,lt=D.image.height,dt=ut.convert(V.format),xt=ut.convert(V.type);b.setTexture2D(V,0),B.pixelStorei(B.UNPACK_FLIP_Y_WEBGL,V.flipY),B.pixelStorei(B.UNPACK_PREMULTIPLY_ALPHA_WEBGL,V.premultiplyAlpha),B.pixelStorei(B.UNPACK_ALIGNMENT,V.unpackAlignment),D.isDataTexture?B.texSubImage2D(B.TEXTURE_2D,H,T.x,T.y,G,lt,dt,xt,D.image.data):D.isCompressedTexture?B.compressedTexSubImage2D(B.TEXTURE_2D,H,T.x,T.y,D.mipmaps[0].width,D.mipmaps[0].height,dt,D.mipmaps[0].data):B.texSubImage2D(B.TEXTURE_2D,H,T.x,T.y,dt,xt,D.image),H===0&&V.generateMipmaps&&B.generateMipmap(B.TEXTURE_2D),ht.unbindTexture()},this.copyTextureToTexture3D=function(T,D,V,H,G=0){if(x.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const lt=T.max.x-T.min.x+1,dt=T.max.y-T.min.y+1,xt=T.max.z-T.min.z+1,Tt=ut.convert(H.format),Ut=ut.convert(H.type);let bt;if(H.isData3DTexture)b.setTexture3D(H,0),bt=B.TEXTURE_3D;else if(H.isDataArrayTexture||H.isCompressedArrayTexture)b.setTexture2DArray(H,0),bt=B.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}B.pixelStorei(B.UNPACK_FLIP_Y_WEBGL,H.flipY),B.pixelStorei(B.UNPACK_PREMULTIPLY_ALPHA_WEBGL,H.premultiplyAlpha),B.pixelStorei(B.UNPACK_ALIGNMENT,H.unpackAlignment);const Rt=B.getParameter(B.UNPACK_ROW_LENGTH),le=B.getParameter(B.UNPACK_IMAGE_HEIGHT),He=B.getParameter(B.UNPACK_SKIP_PIXELS),_e=B.getParameter(B.UNPACK_SKIP_ROWS),Mn=B.getParameter(B.UNPACK_SKIP_IMAGES),te=V.isCompressedTexture?V.mipmaps[G]:V.image;B.pixelStorei(B.UNPACK_ROW_LENGTH,te.width),B.pixelStorei(B.UNPACK_IMAGE_HEIGHT,te.height),B.pixelStorei(B.UNPACK_SKIP_PIXELS,T.min.x),B.pixelStorei(B.UNPACK_SKIP_ROWS,T.min.y),B.pixelStorei(B.UNPACK_SKIP_IMAGES,T.min.z),V.isDataTexture||V.isData3DTexture?B.texSubImage3D(bt,G,D.x,D.y,D.z,lt,dt,xt,Tt,Ut,te.data):V.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),B.compressedTexSubImage3D(bt,G,D.x,D.y,D.z,lt,dt,xt,Tt,te.data)):B.texSubImage3D(bt,G,D.x,D.y,D.z,lt,dt,xt,Tt,Ut,te),B.pixelStorei(B.UNPACK_ROW_LENGTH,Rt),B.pixelStorei(B.UNPACK_IMAGE_HEIGHT,le),B.pixelStorei(B.UNPACK_SKIP_PIXELS,He),B.pixelStorei(B.UNPACK_SKIP_ROWS,_e),B.pixelStorei(B.UNPACK_SKIP_IMAGES,Mn),G===0&&H.generateMipmaps&&B.generateMipmap(bt),ht.unbindTexture()},this.initTexture=function(T){T.isCubeTexture?b.setTextureCube(T,0):T.isData3DTexture?b.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?b.setTexture2DArray(T,0):b.setTexture2D(T,0),ht.unbindTexture()},this.resetState=function(){R=0,w=0,A=null,ht.reset(),Pt.reset()},typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return 2e3}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===Pa?"display-p3":"srgb",e.unpackColorSpace=Xt.workingColorSpace===ps?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Me?3001:3e3}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===3001?Me:Rn}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}}class Lm extends dc{}Lm.prototype.isWebGL1Renderer=!0;class Fa{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new Ht(t),this.near=e,this.far=n}clone(){return new Fa(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Dm extends we{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}}class Na extends xn{constructor(t=1,e=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:i},e=Math.max(3,e);const s=[],o=[],a=[],l=[],c=new N,u=new Vt;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let h=0,f=3;h<=e;h++,f+=3){const m=n+h/e*i;c.x=t*Math.cos(m),c.y=t*Math.sin(m),o.push(c.x,c.y,c.z),a.push(0,0,1),u.x=(o[f]/t+1)/2,u.y=(o[f+1]/t+1)/2,l.push(u.x,u.y)}for(let h=1;h<=e;h++)s.push(h,h+1,0);this.setIndex(s),this.setAttribute("position",new Re(o,3)),this.setAttribute("normal",new Re(a,3)),this.setAttribute("uv",new Re(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Na(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class gs extends xn{constructor(t=1,e=1,n=1,i=32,s=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:i,heightSegments:s,openEnded:o,thetaStart:a,thetaLength:l};const c=this;i=Math.floor(i),s=Math.floor(s);const u=[],h=[],f=[],m=[];let g=0;const _=[],p=n/2;let d=0;M(),o===!1&&(t>0&&x(!0),e>0&&x(!1)),this.setIndex(u),this.setAttribute("position",new Re(h,3)),this.setAttribute("normal",new Re(f,3)),this.setAttribute("uv",new Re(m,2));function M(){const E=new N,R=new N;let w=0;const A=(e-t)/n;for(let L=0;L<=s;L++){const v=[],y=L/s,U=y*(e-t)+t;for(let F=0;F<=i;F++){const q=F/i,C=q*l+a,I=Math.sin(C),O=Math.cos(C);R.x=U*I,R.y=-y*n+p,R.z=U*O,h.push(R.x,R.y,R.z),E.set(I,A,O).normalize(),f.push(E.x,E.y,E.z),m.push(q,1-y),v.push(g++)}_.push(v)}for(let L=0;L<i;L++)for(let v=0;v<s;v++){const y=_[v][L],U=_[v+1][L],F=_[v+1][L+1],q=_[v][L+1];u.push(y,U,q),u.push(U,F,q),w+=6}c.addGroup(d,w,0),d+=w}function x(E){const R=g,w=new Vt,A=new N;let L=0;const v=E===!0?t:e,y=E===!0?1:-1;for(let F=1;F<=i;F++)h.push(0,p*y,0),f.push(0,y,0),m.push(.5,.5),g++;const U=g;for(let F=0;F<=i;F++){const C=F/i*l+a,I=Math.cos(C),O=Math.sin(C);A.x=v*O,A.y=p*y,A.z=v*I,h.push(A.x,A.y,A.z),f.push(0,y,0),w.x=I*.5+.5,w.y=O*.5*y+.5,m.push(w.x,w.y),g++}for(let F=0;F<i;F++){const q=R+F,C=U+F;E===!0?u.push(C,C+1,q):u.push(C+1,C,q),L+=3}c.addGroup(d,L,E===!0?1:2),d+=L}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new gs(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class ai extends xn{constructor(t=1,e=32,n=16,i=0,s=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:i,phiLength:s,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(o+a,Math.PI);let c=0;const u=[],h=new N,f=new N,m=[],g=[],_=[],p=[];for(let d=0;d<=n;d++){const M=[],x=d/n;let E=0;d===0&&o===0?E=.5/e:d===n&&l===Math.PI&&(E=-.5/e);for(let R=0;R<=e;R++){const w=R/e;h.x=-t*Math.cos(i+w*s)*Math.sin(o+x*a),h.y=t*Math.cos(o+x*a),h.z=t*Math.sin(i+w*s)*Math.sin(o+x*a),g.push(h.x,h.y,h.z),f.copy(h).normalize(),_.push(f.x,f.y,f.z),p.push(w+E,1-x),M.push(c++)}u.push(M)}for(let d=0;d<n;d++)for(let M=0;M<e;M++){const x=u[d][M+1],E=u[d][M],R=u[d+1][M],w=u[d+1][M+1];(d!==0||o>0)&&m.push(x,E,w),(d!==n-1||l<Math.PI)&&m.push(E,R,w)}this.setIndex(m),this.setAttribute("position",new Re(g,3)),this.setAttribute("normal",new Re(_,3)),this.setAttribute("uv",new Re(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ai(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class pr extends Ar{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Ht(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ht(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new Vt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class pc extends we{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Ht(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),e}}const Js=new fe,Jo=new N,Qo=new N;class Im{constructor(t){this.camera=t,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Vt(512,512),this.map=null,this.mapPass=null,this.matrix=new fe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Da,this._frameExtents=new Vt(1,1),this._viewportCount=1,this._viewports=[new ve(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Jo.setFromMatrixPosition(t.matrixWorld),e.position.copy(Jo),Qo.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Qo),e.updateMatrixWorld(),Js.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Js),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Js)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class Um extends Im{constructor(){super(new ac(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Fm extends pc{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(we.DEFAULT_UP),this.updateMatrix(),this.target=new we,this.shadow=new Um}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class Nm extends pc{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}}typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ca}}));typeof window!="undefined"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ca);function bn(r){if(r===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return r}function mc(r,t){r.prototype=Object.create(t.prototype),r.prototype.constructor=r,r.__proto__=t}/*!
 * GSAP 3.14.2
 * https://gsap.com
 *
 * @license Copyright 2008-2025, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/var Ze={autoSleep:120,force3D:"auto",nullTargetWarn:1,units:{lineHeight:""}},Hi={duration:.5,overwrite:!1,delay:0},Oa,Ee,Jt,sn=1e8,Yt=1/sn,ma=Math.PI*2,Om=ma/4,Bm=0,_c=Math.sqrt,Gm=Math.cos,zm=Math.sin,xe=function(t){return typeof t=="string"},oe=function(t){return typeof t=="function"},Cn=function(t){return typeof t=="number"},Ba=function(t){return typeof t=="undefined"},vn=function(t){return typeof t=="object"},Oe=function(t){return t!==!1},Ga=function(){return typeof window!="undefined"},$r=function(t){return oe(t)||xe(t)},gc=typeof ArrayBuffer=="function"&&ArrayBuffer.isView||function(){},Ce=Array.isArray,Vm=/random\([^)]+\)/g,Hm=/,\s*/g,tl=/(?:-?\.?\d|\.)+/gi,vc=/[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g,Ii=/[-+=.]*\d+[.e-]*\d*[a-z%]*/g,Qs=/[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi,xc=/[+-]=-?[.\d]+/,km=/[^,'"\[\]\s]+/gi,Wm=/^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i,ne,dn,_a,za,$e={},os={},Mc,Sc=function(t){return(os=ki(t,$e))&&Ve},Va=function(t,e){return console.warn("Invalid property",t,"set to",e,"Missing plugin? gsap.registerPlugin()")},mr=function(t,e){return!e&&console.warn(t)},Ec=function(t,e){return t&&($e[t]=e)&&os&&(os[t]=e)||$e},_r=function(){return 0},Xm={suppressEvents:!0,isStart:!0,kill:!1},ts={suppressEvents:!0,kill:!1},qm={suppressEvents:!0},Ha={},zn=[],ga={},Tc,Xe={},ta={},el=30,es=[],ka="",Wa=function(t){var e=t[0],n,i;if(vn(e)||oe(e)||(t=[t]),!(n=(e._gsap||{}).harness)){for(i=es.length;i--&&!es[i].targetTest(e););n=es[i]}for(i=t.length;i--;)t[i]&&(t[i]._gsap||(t[i]._gsap=new Yc(t[i],n)))||t.splice(i,1);return t},oi=function(t){return t._gsap||Wa(an(t))[0]._gsap},yc=function(t,e,n){return(n=t[e])&&oe(n)?t[e]():Ba(n)&&t.getAttribute&&t.getAttribute(e)||n},Be=function(t,e){return(t=t.split(",")).forEach(e)||t},ce=function(t){return Math.round(t*1e5)/1e5||0},ee=function(t){return Math.round(t*1e7)/1e7||0},Bi=function(t,e){var n=e.charAt(0),i=parseFloat(e.substr(2));return t=parseFloat(t),n==="+"?t+i:n==="-"?t-i:n==="*"?t*i:t/i},Ym=function(t,e){for(var n=e.length,i=0;t.indexOf(e[i])<0&&++i<n;);return i<n},ls=function(){var t=zn.length,e=zn.slice(0),n,i;for(ga={},zn.length=0,n=0;n<t;n++)i=e[n],i&&i._lazy&&(i.render(i._lazy[0],i._lazy[1],!0)._lazy=0)},Xa=function(t){return!!(t._initted||t._startAt||t.add)},Ac=function(t,e,n,i){zn.length&&!Ee&&ls(),t.render(e,n,!!(Ee&&e<0&&Xa(t))),zn.length&&!Ee&&ls()},bc=function(t){var e=parseFloat(t);return(e||e===0)&&(t+"").match(km).length<2?e:xe(t)?t.trim():t},wc=function(t){return t},Je=function(t,e){for(var n in e)n in t||(t[n]=e[n]);return t},Km=function(t){return function(e,n){for(var i in n)i in e||i==="duration"&&t||i==="ease"||(e[i]=n[i])}},ki=function(t,e){for(var n in e)t[n]=e[n];return t},nl=function r(t,e){for(var n in e)n!=="__proto__"&&n!=="constructor"&&n!=="prototype"&&(t[n]=vn(e[n])?r(t[n]||(t[n]={}),e[n]):e[n]);return t},cs=function(t,e){var n={},i;for(i in t)i in e||(n[i]=t[i]);return n},ur=function(t){var e=t.parent||ne,n=t.keyframes?Km(Ce(t.keyframes)):Je;if(Oe(t.inherit))for(;e;)n(t,e.vars.defaults),e=e.parent||e._dp;return t},jm=function(t,e){for(var n=t.length,i=n===e.length;i&&n--&&t[n]===e[n];);return n<0},Rc=function(t,e,n,i,s){var o=t[i],a;if(s)for(a=e[s];o&&o[s]>a;)o=o._prev;return o?(e._next=o._next,o._next=e):(e._next=t[n],t[n]=e),e._next?e._next._prev=e:t[i]=e,e._prev=o,e.parent=e._dp=t,e},vs=function(t,e,n,i){n===void 0&&(n="_first"),i===void 0&&(i="_last");var s=e._prev,o=e._next;s?s._next=o:t[n]===e&&(t[n]=o),o?o._prev=s:t[i]===e&&(t[i]=s),e._next=e._prev=e.parent=null},Hn=function(t,e){t.parent&&(!e||t.parent.autoRemoveChildren)&&t.parent.remove&&t.parent.remove(t),t._act=0},li=function(t,e){if(t&&(!e||e._end>t._dur||e._start<0))for(var n=t;n;)n._dirty=1,n=n.parent;return t},Zm=function(t){for(var e=t.parent;e&&e.parent;)e._dirty=1,e.totalDuration(),e=e.parent;return t},va=function(t,e,n,i){return t._startAt&&(Ee?t._startAt.revert(ts):t.vars.immediateRender&&!t.vars.autoRevert||t._startAt.render(e,!0,i))},$m=function r(t){return!t||t._ts&&r(t.parent)},il=function(t){return t._repeat?Wi(t._tTime,t=t.duration()+t._rDelay)*t:0},Wi=function(t,e){var n=Math.floor(t=ee(t/e));return t&&n===t?n-1:n},us=function(t,e){return(t-e._start)*e._ts+(e._ts>=0?0:e._dirty?e.totalDuration():e._tDur)},xs=function(t){return t._end=ee(t._start+(t._tDur/Math.abs(t._ts||t._rts||Yt)||0))},Ms=function(t,e){var n=t._dp;return n&&n.smoothChildTiming&&t._ts&&(t._start=ee(n._time-(t._ts>0?e/t._ts:((t._dirty?t.totalDuration():t._tDur)-e)/-t._ts)),xs(t),n._dirty||li(n,t)),t},Cc=function(t,e){var n;if((e._time||!e._dur&&e._initted||e._start<t._time&&(e._dur||!e.add))&&(n=us(t.rawTime(),e),(!e._dur||br(0,e.totalDuration(),n)-e._tTime>Yt)&&e.render(n,!0)),li(t,e)._dp&&t._initted&&t._time>=t._dur&&t._ts){if(t._dur<t.duration())for(n=t;n._dp;)n.rawTime()>=0&&n.totalTime(n._tTime),n=n._dp;t._zTime=-Yt}},mn=function(t,e,n,i){return e.parent&&Hn(e),e._start=ee((Cn(n)?n:n||t!==ne?en(t,n,e):t._time)+e._delay),e._end=ee(e._start+(e.totalDuration()/Math.abs(e.timeScale())||0)),Rc(t,e,"_first","_last",t._sort?"_start":0),xa(e)||(t._recent=e),i||Cc(t,e),t._ts<0&&Ms(t,t._tTime),t},Pc=function(t,e){return($e.ScrollTrigger||Va("scrollTrigger",e))&&$e.ScrollTrigger.create(e,t)},Lc=function(t,e,n,i,s){if(Ya(t,e,s),!t._initted)return 1;if(!n&&t._pt&&!Ee&&(t._dur&&t.vars.lazy!==!1||!t._dur&&t.vars.lazy)&&Tc!==qe.frame)return zn.push(t),t._lazy=[s,i],1},Jm=function r(t){var e=t.parent;return e&&e._ts&&e._initted&&!e._lock&&(e.rawTime()<0||r(e))},xa=function(t){var e=t.data;return e==="isFromStart"||e==="isStart"},Qm=function(t,e,n,i){var s=t.ratio,o=e<0||!e&&(!t._start&&Jm(t)&&!(!t._initted&&xa(t))||(t._ts<0||t._dp._ts<0)&&!xa(t))?0:1,a=t._rDelay,l=0,c,u,h;if(a&&t._repeat&&(l=br(0,t._tDur,e),u=Wi(l,a),t._yoyo&&u&1&&(o=1-o),u!==Wi(t._tTime,a)&&(s=1-o,t.vars.repeatRefresh&&t._initted&&t.invalidate())),o!==s||Ee||i||t._zTime===Yt||!e&&t._zTime){if(!t._initted&&Lc(t,e,i,n,l))return;for(h=t._zTime,t._zTime=e||(n?Yt:0),n||(n=e&&!h),t.ratio=o,t._from&&(o=1-o),t._time=0,t._tTime=l,c=t._pt;c;)c.r(o,c.d),c=c._next;e<0&&va(t,e,n,!0),t._onUpdate&&!n&&Ye(t,"onUpdate"),l&&t._repeat&&!n&&t.parent&&Ye(t,"onRepeat"),(e>=t._tDur||e<0)&&t.ratio===o&&(o&&Hn(t,1),!n&&!Ee&&(Ye(t,o?"onComplete":"onReverseComplete",!0),t._prom&&t._prom()))}else t._zTime||(t._zTime=e)},t_=function(t,e,n){var i;if(n>e)for(i=t._first;i&&i._start<=n;){if(i.data==="isPause"&&i._start>e)return i;i=i._next}else for(i=t._last;i&&i._start>=n;){if(i.data==="isPause"&&i._start<e)return i;i=i._prev}},Xi=function(t,e,n,i){var s=t._repeat,o=ee(e)||0,a=t._tTime/t._tDur;return a&&!i&&(t._time*=o/t._dur),t._dur=o,t._tDur=s?s<0?1e10:ee(o*(s+1)+t._rDelay*s):o,a>0&&!i&&Ms(t,t._tTime=t._tDur*a),t.parent&&xs(t),n||li(t.parent,t),t},rl=function(t){return t instanceof Ue?li(t):Xi(t,t._dur)},e_={_start:0,endTime:_r,totalDuration:_r},en=function r(t,e,n){var i=t.labels,s=t._recent||e_,o=t.duration()>=sn?s.endTime(!1):t._dur,a,l,c;return xe(e)&&(isNaN(e)||e in i)?(l=e.charAt(0),c=e.substr(-1)==="%",a=e.indexOf("="),l==="<"||l===">"?(a>=0&&(e=e.replace(/=/,"")),(l==="<"?s._start:s.endTime(s._repeat>=0))+(parseFloat(e.substr(1))||0)*(c?(a<0?s:n).totalDuration()/100:1)):a<0?(e in i||(i[e]=o),i[e]):(l=parseFloat(e.charAt(a-1)+e.substr(a+1)),c&&n&&(l=l/100*(Ce(n)?n[0]:n).totalDuration()),a>1?r(t,e.substr(0,a-1),n)+l:o+l)):e==null?o:+e},hr=function(t,e,n){var i=Cn(e[1]),s=(i?2:1)+(t<2?0:1),o=e[s],a,l;if(i&&(o.duration=e[1]),o.parent=n,t){for(a=o,l=n;l&&!("immediateRender"in a);)a=l.vars.defaults||{},l=Oe(l.vars.inherit)&&l.parent;o.immediateRender=Oe(a.immediateRender),t<2?o.runBackwards=1:o.startAt=e[s-1]}return new he(e[0],o,e[s+1])},Xn=function(t,e){return t||t===0?e(t):e},br=function(t,e,n){return n<t?t:n>e?e:n},be=function(t,e){return!xe(t)||!(e=Wm.exec(t))?"":e[1]},n_=function(t,e,n){return Xn(n,function(i){return br(t,e,i)})},Ma=[].slice,Dc=function(t,e){return t&&vn(t)&&"length"in t&&(!e&&!t.length||t.length-1 in t&&vn(t[0]))&&!t.nodeType&&t!==dn},i_=function(t,e,n){return n===void 0&&(n=[]),t.forEach(function(i){var s;return xe(i)&&!e||Dc(i,1)?(s=n).push.apply(s,an(i)):n.push(i)})||n},an=function(t,e,n){return Jt&&!e&&Jt.selector?Jt.selector(t):xe(t)&&!n&&(_a||!qi())?Ma.call((e||za).querySelectorAll(t),0):Ce(t)?i_(t,n):Dc(t)?Ma.call(t,0):t?[t]:[]},Sa=function(t){return t=an(t)[0]||mr("Invalid scope")||{},function(e){var n=t.current||t.nativeElement||t;return an(e,n.querySelectorAll?n:n===t?mr("Invalid scope")||za.createElement("div"):t)}},Ic=function(t){return t.sort(function(){return .5-Math.random()})},Uc=function(t){if(oe(t))return t;var e=vn(t)?t:{each:t},n=ci(e.ease),i=e.from||0,s=parseFloat(e.base)||0,o={},a=i>0&&i<1,l=isNaN(i)||a,c=e.axis,u=i,h=i;return xe(i)?u=h={center:.5,edges:.5,end:1}[i]||0:!a&&l&&(u=i[0],h=i[1]),function(f,m,g){var _=(g||e).length,p=o[_],d,M,x,E,R,w,A,L,v;if(!p){if(v=e.grid==="auto"?0:(e.grid||[1,sn])[1],!v){for(A=-sn;A<(A=g[v++].getBoundingClientRect().left)&&v<_;);v<_&&v--}for(p=o[_]=[],d=l?Math.min(v,_)*u-.5:i%v,M=v===sn?0:l?_*h/v-.5:i/v|0,A=0,L=sn,w=0;w<_;w++)x=w%v-d,E=M-(w/v|0),p[w]=R=c?Math.abs(c==="y"?E:x):_c(x*x+E*E),R>A&&(A=R),R<L&&(L=R);i==="random"&&Ic(p),p.max=A-L,p.min=L,p.v=_=(parseFloat(e.amount)||parseFloat(e.each)*(v>_?_-1:c?c==="y"?_/v:v:Math.max(v,_/v))||0)*(i==="edges"?-1:1),p.b=_<0?s-_:s,p.u=be(e.amount||e.each)||0,n=n&&_<0?Wc(n):n}return _=(p[f]-p.min)/p.max||0,ee(p.b+(n?n(_):_)*p.v)+p.u}},Ea=function(t){var e=Math.pow(10,((t+"").split(".")[1]||"").length);return function(n){var i=ee(Math.round(parseFloat(n)/t)*t*e);return(i-i%1)/e+(Cn(n)?0:be(n))}},Fc=function(t,e){var n=Ce(t),i,s;return!n&&vn(t)&&(i=n=t.radius||sn,t.values?(t=an(t.values),(s=!Cn(t[0]))&&(i*=i)):t=Ea(t.increment)),Xn(e,n?oe(t)?function(o){return s=t(o),Math.abs(s-o)<=i?s:o}:function(o){for(var a=parseFloat(s?o.x:o),l=parseFloat(s?o.y:0),c=sn,u=0,h=t.length,f,m;h--;)s?(f=t[h].x-a,m=t[h].y-l,f=f*f+m*m):f=Math.abs(t[h]-a),f<c&&(c=f,u=h);return u=!i||c<=i?t[u]:o,s||u===o||Cn(o)?u:u+be(o)}:Ea(t))},Nc=function(t,e,n,i){return Xn(Ce(t)?!e:n===!0?!!(n=0):!i,function(){return Ce(t)?t[~~(Math.random()*t.length)]:(n=n||1e-5)&&(i=n<1?Math.pow(10,(n+"").length-2):1)&&Math.floor(Math.round((t-n/2+Math.random()*(e-t+n*.99))/n)*n*i)/i})},r_=function(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];return function(i){return e.reduce(function(s,o){return o(s)},i)}},s_=function(t,e){return function(n){return t(parseFloat(n))+(e||be(n))}},a_=function(t,e,n){return Bc(t,e,0,1,n)},Oc=function(t,e,n){return Xn(n,function(i){return t[~~e(i)]})},o_=function r(t,e,n){var i=e-t;return Ce(t)?Oc(t,r(0,t.length),e):Xn(n,function(s){return(i+(s-t)%i)%i+t})},l_=function r(t,e,n){var i=e-t,s=i*2;return Ce(t)?Oc(t,r(0,t.length-1),e):Xn(n,function(o){return o=(s+(o-t)%s)%s||0,t+(o>i?s-o:o)})},gr=function(t){return t.replace(Vm,function(e){var n=e.indexOf("[")+1,i=e.substring(n||7,n?e.indexOf("]"):e.length-1).split(Hm);return Nc(n?i:+i[0],n?0:+i[1],+i[2]||1e-5)})},Bc=function(t,e,n,i,s){var o=e-t,a=i-n;return Xn(s,function(l){return n+((l-t)/o*a||0)})},c_=function r(t,e,n,i){var s=isNaN(t+e)?0:function(m){return(1-m)*t+m*e};if(!s){var o=xe(t),a={},l,c,u,h,f;if(n===!0&&(i=1)&&(n=null),o)t={p:t},e={p:e};else if(Ce(t)&&!Ce(e)){for(u=[],h=t.length,f=h-2,c=1;c<h;c++)u.push(r(t[c-1],t[c]));h--,s=function(g){g*=h;var _=Math.min(f,~~g);return u[_](g-_)},n=e}else i||(t=ki(Ce(t)?[]:{},t));if(!u){for(l in e)qa.call(a,t,l,"get",e[l]);s=function(g){return Za(g,a)||(o?t.p:t)}}}return Xn(n,s)},sl=function(t,e,n){var i=t.labels,s=sn,o,a,l;for(o in i)a=i[o]-e,a<0==!!n&&a&&s>(a=Math.abs(a))&&(l=o,s=a);return l},Ye=function(t,e,n){var i=t.vars,s=i[e],o=Jt,a=t._ctx,l,c,u;if(s)return l=i[e+"Params"],c=i.callbackScope||t,n&&zn.length&&ls(),a&&(Jt=a),u=l?s.apply(c,l):s.call(c),Jt=o,u},ar=function(t){return Hn(t),t.scrollTrigger&&t.scrollTrigger.kill(!!Ee),t.progress()<1&&Ye(t,"onInterrupt"),t},Ui,Gc=[],zc=function(t){if(t)if(t=!t.name&&t.default||t,Ga()||t.headless){var e=t.name,n=oe(t),i=e&&!n&&t.init?function(){this._props=[]}:t,s={init:_r,render:Za,add:qa,kill:A_,modifier:y_,rawVars:0},o={targetTest:0,get:0,getSetter:ja,aliases:{},register:0};if(qi(),t!==i){if(Xe[e])return;Je(i,Je(cs(t,s),o)),ki(i.prototype,ki(s,cs(t,o))),Xe[i.prop=e]=i,t.targetTest&&(es.push(i),Ha[e]=1),e=(e==="css"?"CSS":e.charAt(0).toUpperCase()+e.substr(1))+"Plugin"}Ec(e,i),t.register&&t.register(Ve,i,Ge)}else Gc.push(t)},qt=255,or={aqua:[0,qt,qt],lime:[0,qt,0],silver:[192,192,192],black:[0,0,0],maroon:[128,0,0],teal:[0,128,128],blue:[0,0,qt],navy:[0,0,128],white:[qt,qt,qt],olive:[128,128,0],yellow:[qt,qt,0],orange:[qt,165,0],gray:[128,128,128],purple:[128,0,128],green:[0,128,0],red:[qt,0,0],pink:[qt,192,203],cyan:[0,qt,qt],transparent:[qt,qt,qt,0]},ea=function(t,e,n){return t+=t<0?1:t>1?-1:0,(t*6<1?e+(n-e)*t*6:t<.5?n:t*3<2?e+(n-e)*(2/3-t)*6:e)*qt+.5|0},Vc=function(t,e,n){var i=t?Cn(t)?[t>>16,t>>8&qt,t&qt]:0:or.black,s,o,a,l,c,u,h,f,m,g;if(!i){if(t.substr(-1)===","&&(t=t.substr(0,t.length-1)),or[t])i=or[t];else if(t.charAt(0)==="#"){if(t.length<6&&(s=t.charAt(1),o=t.charAt(2),a=t.charAt(3),t="#"+s+s+o+o+a+a+(t.length===5?t.charAt(4)+t.charAt(4):"")),t.length===9)return i=parseInt(t.substr(1,6),16),[i>>16,i>>8&qt,i&qt,parseInt(t.substr(7),16)/255];t=parseInt(t.substr(1),16),i=[t>>16,t>>8&qt,t&qt]}else if(t.substr(0,3)==="hsl"){if(i=g=t.match(tl),!e)l=+i[0]%360/360,c=+i[1]/100,u=+i[2]/100,o=u<=.5?u*(c+1):u+c-u*c,s=u*2-o,i.length>3&&(i[3]*=1),i[0]=ea(l+1/3,s,o),i[1]=ea(l,s,o),i[2]=ea(l-1/3,s,o);else if(~t.indexOf("="))return i=t.match(vc),n&&i.length<4&&(i[3]=1),i}else i=t.match(tl)||or.transparent;i=i.map(Number)}return e&&!g&&(s=i[0]/qt,o=i[1]/qt,a=i[2]/qt,h=Math.max(s,o,a),f=Math.min(s,o,a),u=(h+f)/2,h===f?l=c=0:(m=h-f,c=u>.5?m/(2-h-f):m/(h+f),l=h===s?(o-a)/m+(o<a?6:0):h===o?(a-s)/m+2:(s-o)/m+4,l*=60),i[0]=~~(l+.5),i[1]=~~(c*100+.5),i[2]=~~(u*100+.5)),n&&i.length<4&&(i[3]=1),i},Hc=function(t){var e=[],n=[],i=-1;return t.split(Vn).forEach(function(s){var o=s.match(Ii)||[];e.push.apply(e,o),n.push(i+=o.length+1)}),e.c=n,e},al=function(t,e,n){var i="",s=(t+i).match(Vn),o=e?"hsla(":"rgba(",a=0,l,c,u,h;if(!s)return t;if(s=s.map(function(f){return(f=Vc(f,e,1))&&o+(e?f[0]+","+f[1]+"%,"+f[2]+"%,"+f[3]:f.join(","))+")"}),n&&(u=Hc(t),l=n.c,l.join(i)!==u.c.join(i)))for(c=t.replace(Vn,"1").split(Ii),h=c.length-1;a<h;a++)i+=c[a]+(~l.indexOf(a)?s.shift()||o+"0,0,0,0)":(u.length?u:s.length?s:n).shift());if(!c)for(c=t.split(Vn),h=c.length-1;a<h;a++)i+=c[a]+s[a];return i+c[h]},Vn=function(){var r="(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b",t;for(t in or)r+="|"+t+"\\b";return new RegExp(r+")","gi")}(),u_=/hsl[a]?\(/,kc=function(t){var e=t.join(" "),n;if(Vn.lastIndex=0,Vn.test(e))return n=u_.test(e),t[1]=al(t[1],n),t[0]=al(t[0],n,Hc(t[1])),!0},vr,qe=function(){var r=Date.now,t=500,e=33,n=r(),i=n,s=1e3/240,o=s,a=[],l,c,u,h,f,m,g=function _(p){var d=r()-i,M=p===!0,x,E,R,w;if((d>t||d<0)&&(n+=d-e),i+=d,R=i-n,x=R-o,(x>0||M)&&(w=++h.frame,f=R-h.time*1e3,h.time=R=R/1e3,o+=x+(x>=s?4:s-x),E=1),M||(l=c(_)),E)for(m=0;m<a.length;m++)a[m](R,f,w,p)};return h={time:0,frame:0,tick:function(){g(!0)},deltaRatio:function(p){return f/(1e3/(p||60))},wake:function(){Mc&&(!_a&&Ga()&&(dn=_a=window,za=dn.document||{},$e.gsap=Ve,(dn.gsapVersions||(dn.gsapVersions=[])).push(Ve.version),Sc(os||dn.GreenSockGlobals||!dn.gsap&&dn||{}),Gc.forEach(zc)),u=typeof requestAnimationFrame!="undefined"&&requestAnimationFrame,l&&h.sleep(),c=u||function(p){return setTimeout(p,o-h.time*1e3+1|0)},vr=1,g(2))},sleep:function(){(u?cancelAnimationFrame:clearTimeout)(l),vr=0,c=_r},lagSmoothing:function(p,d){t=p||1/0,e=Math.min(d||33,t)},fps:function(p){s=1e3/(p||240),o=h.time*1e3+s},add:function(p,d,M){var x=d?function(E,R,w,A){p(E,R,w,A),h.remove(x)}:p;return h.remove(p),a[M?"unshift":"push"](x),qi(),x},remove:function(p,d){~(d=a.indexOf(p))&&a.splice(d,1)&&m>=d&&m--},_listeners:a},h}(),qi=function(){return!vr&&qe.wake()},Gt={},h_=/^[\d.\-M][\d.\-,\s]/,f_=/["']/g,d_=function(t){for(var e={},n=t.substr(1,t.length-3).split(":"),i=n[0],s=1,o=n.length,a,l,c;s<o;s++)l=n[s],a=s!==o-1?l.lastIndexOf(","):l.length,c=l.substr(0,a),e[i]=isNaN(c)?c.replace(f_,"").trim():+c,i=l.substr(a+1).trim();return e},p_=function(t){var e=t.indexOf("(")+1,n=t.indexOf(")"),i=t.indexOf("(",e);return t.substring(e,~i&&i<n?t.indexOf(")",n+1):n)},m_=function(t){var e=(t+"").split("("),n=Gt[e[0]];return n&&e.length>1&&n.config?n.config.apply(null,~t.indexOf("{")?[d_(e[1])]:p_(t).split(",").map(bc)):Gt._CE&&h_.test(t)?Gt._CE("",t):n},Wc=function(t){return function(e){return 1-t(1-e)}},Xc=function r(t,e){for(var n=t._first,i;n;)n instanceof Ue?r(n,e):n.vars.yoyoEase&&(!n._yoyo||!n._repeat)&&n._yoyo!==e&&(n.timeline?r(n.timeline,e):(i=n._ease,n._ease=n._yEase,n._yEase=i,n._yoyo=e)),n=n._next},ci=function(t,e){return t&&(oe(t)?t:Gt[t]||m_(t))||e},pi=function(t,e,n,i){n===void 0&&(n=function(l){return 1-e(1-l)}),i===void 0&&(i=function(l){return l<.5?e(l*2)/2:1-e((1-l)*2)/2});var s={easeIn:e,easeOut:n,easeInOut:i},o;return Be(t,function(a){Gt[a]=$e[a]=s,Gt[o=a.toLowerCase()]=n;for(var l in s)Gt[o+(l==="easeIn"?".in":l==="easeOut"?".out":".inOut")]=Gt[a+"."+l]=s[l]}),s},qc=function(t){return function(e){return e<.5?(1-t(1-e*2))/2:.5+t((e-.5)*2)/2}},na=function r(t,e,n){var i=e>=1?e:1,s=(n||(t?.3:.45))/(e<1?e:1),o=s/ma*(Math.asin(1/i)||0),a=function(u){return u===1?1:i*Math.pow(2,-10*u)*zm((u-o)*s)+1},l=t==="out"?a:t==="in"?function(c){return 1-a(1-c)}:qc(a);return s=ma/s,l.config=function(c,u){return r(t,c,u)},l},ia=function r(t,e){e===void 0&&(e=1.70158);var n=function(o){return o?--o*o*((e+1)*o+e)+1:0},i=t==="out"?n:t==="in"?function(s){return 1-n(1-s)}:qc(n);return i.config=function(s){return r(t,s)},i};Be("Linear,Quad,Cubic,Quart,Quint,Strong",function(r,t){var e=t<5?t+1:t;pi(r+",Power"+(e-1),t?function(n){return Math.pow(n,e)}:function(n){return n},function(n){return 1-Math.pow(1-n,e)},function(n){return n<.5?Math.pow(n*2,e)/2:1-Math.pow((1-n)*2,e)/2})});Gt.Linear.easeNone=Gt.none=Gt.Linear.easeIn;pi("Elastic",na("in"),na("out"),na());(function(r,t){var e=1/t,n=2*e,i=2.5*e,s=function(a){return a<e?r*a*a:a<n?r*Math.pow(a-1.5/t,2)+.75:a<i?r*(a-=2.25/t)*a+.9375:r*Math.pow(a-2.625/t,2)+.984375};pi("Bounce",function(o){return 1-s(1-o)},s)})(7.5625,2.75);pi("Expo",function(r){return Math.pow(2,10*(r-1))*r+r*r*r*r*r*r*(1-r)});pi("Circ",function(r){return-(_c(1-r*r)-1)});pi("Sine",function(r){return r===1?1:-Gm(r*Om)+1});pi("Back",ia("in"),ia("out"),ia());Gt.SteppedEase=Gt.steps=$e.SteppedEase={config:function(t,e){t===void 0&&(t=1);var n=1/t,i=t+(e?0:1),s=e?1:0,o=1-Yt;return function(a){return((i*br(0,o,a)|0)+s)*n}}};Hi.ease=Gt["quad.out"];Be("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt",function(r){return ka+=r+","+r+"Params,"});var Yc=function(t,e){this.id=Bm++,t._gsap=this,this.target=t,this.harness=e,this.get=e?e.get:yc,this.set=e?e.getSetter:ja},xr=function(){function r(e){this.vars=e,this._delay=+e.delay||0,(this._repeat=e.repeat===1/0?-2:e.repeat||0)&&(this._rDelay=e.repeatDelay||0,this._yoyo=!!e.yoyo||!!e.yoyoEase),this._ts=1,Xi(this,+e.duration,1,1),this.data=e.data,Jt&&(this._ctx=Jt,Jt.data.push(this)),vr||qe.wake()}var t=r.prototype;return t.delay=function(n){return n||n===0?(this.parent&&this.parent.smoothChildTiming&&this.startTime(this._start+n-this._delay),this._delay=n,this):this._delay},t.duration=function(n){return arguments.length?this.totalDuration(this._repeat>0?n+(n+this._rDelay)*this._repeat:n):this.totalDuration()&&this._dur},t.totalDuration=function(n){return arguments.length?(this._dirty=0,Xi(this,this._repeat<0?n:(n-this._repeat*this._rDelay)/(this._repeat+1))):this._tDur},t.totalTime=function(n,i){if(qi(),!arguments.length)return this._tTime;var s=this._dp;if(s&&s.smoothChildTiming&&this._ts){for(Ms(this,n),!s._dp||s.parent||Cc(s,this);s&&s.parent;)s.parent._time!==s._start+(s._ts>=0?s._tTime/s._ts:(s.totalDuration()-s._tTime)/-s._ts)&&s.totalTime(s._tTime,!0),s=s.parent;!this.parent&&this._dp.autoRemoveChildren&&(this._ts>0&&n<this._tDur||this._ts<0&&n>0||!this._tDur&&!n)&&mn(this._dp,this,this._start-this._delay)}return(this._tTime!==n||!this._dur&&!i||this._initted&&Math.abs(this._zTime)===Yt||!this._initted&&this._dur&&n||!n&&!this._initted&&(this.add||this._ptLookup))&&(this._ts||(this._pTime=n),Ac(this,n,i)),this},t.time=function(n,i){return arguments.length?this.totalTime(Math.min(this.totalDuration(),n+il(this))%(this._dur+this._rDelay)||(n?this._dur:0),i):this._time},t.totalProgress=function(n,i){return arguments.length?this.totalTime(this.totalDuration()*n,i):this.totalDuration()?Math.min(1,this._tTime/this._tDur):this.rawTime()>=0&&this._initted?1:0},t.progress=function(n,i){return arguments.length?this.totalTime(this.duration()*(this._yoyo&&!(this.iteration()&1)?1-n:n)+il(this),i):this.duration()?Math.min(1,this._time/this._dur):this.rawTime()>0?1:0},t.iteration=function(n,i){var s=this.duration()+this._rDelay;return arguments.length?this.totalTime(this._time+(n-1)*s,i):this._repeat?Wi(this._tTime,s)+1:1},t.timeScale=function(n,i){if(!arguments.length)return this._rts===-Yt?0:this._rts;if(this._rts===n)return this;var s=this.parent&&this._ts?us(this.parent._time,this):this._tTime;return this._rts=+n||0,this._ts=this._ps||n===-Yt?0:this._rts,this.totalTime(br(-Math.abs(this._delay),this.totalDuration(),s),i!==!1),xs(this),Zm(this)},t.paused=function(n){return arguments.length?(this._ps!==n&&(this._ps=n,n?(this._pTime=this._tTime||Math.max(-this._delay,this.rawTime()),this._ts=this._act=0):(qi(),this._ts=this._rts,this.totalTime(this.parent&&!this.parent.smoothChildTiming?this.rawTime():this._tTime||this._pTime,this.progress()===1&&Math.abs(this._zTime)!==Yt&&(this._tTime-=Yt)))),this):this._ps},t.startTime=function(n){if(arguments.length){this._start=ee(n);var i=this.parent||this._dp;return i&&(i._sort||!this.parent)&&mn(i,this,this._start-this._delay),this}return this._start},t.endTime=function(n){return this._start+(Oe(n)?this.totalDuration():this.duration())/Math.abs(this._ts||1)},t.rawTime=function(n){var i=this.parent||this._dp;return i?n&&(!this._ts||this._repeat&&this._time&&this.totalProgress()<1)?this._tTime%(this._dur+this._rDelay):this._ts?us(i.rawTime(n),this):this._tTime:this._tTime},t.revert=function(n){n===void 0&&(n=qm);var i=Ee;return Ee=n,Xa(this)&&(this.timeline&&this.timeline.revert(n),this.totalTime(-.01,n.suppressEvents)),this.data!=="nested"&&n.kill!==!1&&this.kill(),Ee=i,this},t.globalTime=function(n){for(var i=this,s=arguments.length?n:i.rawTime();i;)s=i._start+s/(Math.abs(i._ts)||1),i=i._dp;return!this.parent&&this._sat?this._sat.globalTime(n):s},t.repeat=function(n){return arguments.length?(this._repeat=n===1/0?-2:n,rl(this)):this._repeat===-2?1/0:this._repeat},t.repeatDelay=function(n){if(arguments.length){var i=this._time;return this._rDelay=n,rl(this),i?this.time(i):this}return this._rDelay},t.yoyo=function(n){return arguments.length?(this._yoyo=n,this):this._yoyo},t.seek=function(n,i){return this.totalTime(en(this,n),Oe(i))},t.restart=function(n,i){return this.play().totalTime(n?-this._delay:0,Oe(i)),this._dur||(this._zTime=-Yt),this},t.play=function(n,i){return n!=null&&this.seek(n,i),this.reversed(!1).paused(!1)},t.reverse=function(n,i){return n!=null&&this.seek(n||this.totalDuration(),i),this.reversed(!0).paused(!1)},t.pause=function(n,i){return n!=null&&this.seek(n,i),this.paused(!0)},t.resume=function(){return this.paused(!1)},t.reversed=function(n){return arguments.length?(!!n!==this.reversed()&&this.timeScale(-this._rts||(n?-Yt:0)),this):this._rts<0},t.invalidate=function(){return this._initted=this._act=0,this._zTime=-Yt,this},t.isActive=function(){var n=this.parent||this._dp,i=this._start,s;return!!(!n||this._ts&&this._initted&&n.isActive()&&(s=n.rawTime(!0))>=i&&s<this.endTime(!0)-Yt)},t.eventCallback=function(n,i,s){var o=this.vars;return arguments.length>1?(i?(o[n]=i,s&&(o[n+"Params"]=s),n==="onUpdate"&&(this._onUpdate=i)):delete o[n],this):o[n]},t.then=function(n){var i=this,s=i._prom;return new Promise(function(o){var a=oe(n)?n:wc,l=function(){var u=i.then;i.then=null,s&&s(),oe(a)&&(a=a(i))&&(a.then||a===i)&&(i.then=u),o(a),i.then=u};i._initted&&i.totalProgress()===1&&i._ts>=0||!i._tTime&&i._ts<0?l():i._prom=l})},t.kill=function(){ar(this)},r}();Je(xr.prototype,{_time:0,_start:0,_end:0,_tTime:0,_tDur:0,_dirty:0,_repeat:0,_yoyo:!1,parent:null,_initted:!1,_rDelay:0,_ts:1,_dp:0,ratio:0,_zTime:-Yt,_prom:0,_ps:!1,_rts:1});var Ue=function(r){mc(t,r);function t(n,i){var s;return n===void 0&&(n={}),s=r.call(this,n)||this,s.labels={},s.smoothChildTiming=!!n.smoothChildTiming,s.autoRemoveChildren=!!n.autoRemoveChildren,s._sort=Oe(n.sortChildren),ne&&mn(n.parent||ne,bn(s),i),n.reversed&&s.reverse(),n.paused&&s.paused(!0),n.scrollTrigger&&Pc(bn(s),n.scrollTrigger),s}var e=t.prototype;return e.to=function(i,s,o){return hr(0,arguments,this),this},e.from=function(i,s,o){return hr(1,arguments,this),this},e.fromTo=function(i,s,o,a){return hr(2,arguments,this),this},e.set=function(i,s,o){return s.duration=0,s.parent=this,ur(s).repeatDelay||(s.repeat=0),s.immediateRender=!!s.immediateRender,new he(i,s,en(this,o),1),this},e.call=function(i,s,o){return mn(this,he.delayedCall(0,i,s),o)},e.staggerTo=function(i,s,o,a,l,c,u){return o.duration=s,o.stagger=o.stagger||a,o.onComplete=c,o.onCompleteParams=u,o.parent=this,new he(i,o,en(this,l)),this},e.staggerFrom=function(i,s,o,a,l,c,u){return o.runBackwards=1,ur(o).immediateRender=Oe(o.immediateRender),this.staggerTo(i,s,o,a,l,c,u)},e.staggerFromTo=function(i,s,o,a,l,c,u,h){return a.startAt=o,ur(a).immediateRender=Oe(a.immediateRender),this.staggerTo(i,s,a,l,c,u,h)},e.render=function(i,s,o){var a=this._time,l=this._dirty?this.totalDuration():this._tDur,c=this._dur,u=i<=0?0:ee(i),h=this._zTime<0!=i<0&&(this._initted||!c),f,m,g,_,p,d,M,x,E,R,w,A;if(this!==ne&&u>l&&i>=0&&(u=l),u!==this._tTime||o||h){if(a!==this._time&&c&&(u+=this._time-a,i+=this._time-a),f=u,E=this._start,x=this._ts,d=!x,h&&(c||(a=this._zTime),(i||!s)&&(this._zTime=i)),this._repeat){if(w=this._yoyo,p=c+this._rDelay,this._repeat<-1&&i<0)return this.totalTime(p*100+i,s,o);if(f=ee(u%p),u===l?(_=this._repeat,f=c):(R=ee(u/p),_=~~R,_&&_===R&&(f=c,_--),f>c&&(f=c)),R=Wi(this._tTime,p),!a&&this._tTime&&R!==_&&this._tTime-R*p-this._dur<=0&&(R=_),w&&_&1&&(f=c-f,A=1),_!==R&&!this._lock){var L=w&&R&1,v=L===(w&&_&1);if(_<R&&(L=!L),a=L?0:u%c?c:u,this._lock=1,this.render(a||(A?0:ee(_*p)),s,!c)._lock=0,this._tTime=u,!s&&this.parent&&Ye(this,"onRepeat"),this.vars.repeatRefresh&&!A&&(this.invalidate()._lock=1,R=_),a&&a!==this._time||d!==!this._ts||this.vars.onRepeat&&!this.parent&&!this._act)return this;if(c=this._dur,l=this._tDur,v&&(this._lock=2,a=L?c:-1e-4,this.render(a,!0),this.vars.repeatRefresh&&!A&&this.invalidate()),this._lock=0,!this._ts&&!d)return this;Xc(this,A)}}if(this._hasPause&&!this._forcing&&this._lock<2&&(M=t_(this,ee(a),ee(f)),M&&(u-=f-(f=M._start))),this._tTime=u,this._time=f,this._act=!x,this._initted||(this._onUpdate=this.vars.onUpdate,this._initted=1,this._zTime=i,a=0),!a&&u&&c&&!s&&!R&&(Ye(this,"onStart"),this._tTime!==u))return this;if(f>=a&&i>=0)for(m=this._first;m;){if(g=m._next,(m._act||f>=m._start)&&m._ts&&M!==m){if(m.parent!==this)return this.render(i,s,o);if(m.render(m._ts>0?(f-m._start)*m._ts:(m._dirty?m.totalDuration():m._tDur)+(f-m._start)*m._ts,s,o),f!==this._time||!this._ts&&!d){M=0,g&&(u+=this._zTime=-Yt);break}}m=g}else{m=this._last;for(var y=i<0?i:f;m;){if(g=m._prev,(m._act||y<=m._end)&&m._ts&&M!==m){if(m.parent!==this)return this.render(i,s,o);if(m.render(m._ts>0?(y-m._start)*m._ts:(m._dirty?m.totalDuration():m._tDur)+(y-m._start)*m._ts,s,o||Ee&&Xa(m)),f!==this._time||!this._ts&&!d){M=0,g&&(u+=this._zTime=y?-Yt:Yt);break}}m=g}}if(M&&!s&&(this.pause(),M.render(f>=a?0:-Yt)._zTime=f>=a?1:-1,this._ts))return this._start=E,xs(this),this.render(i,s,o);this._onUpdate&&!s&&Ye(this,"onUpdate",!0),(u===l&&this._tTime>=this.totalDuration()||!u&&a)&&(E===this._start||Math.abs(x)!==Math.abs(this._ts))&&(this._lock||((i||!c)&&(u===l&&this._ts>0||!u&&this._ts<0)&&Hn(this,1),!s&&!(i<0&&!a)&&(u||a||!l)&&(Ye(this,u===l&&i>=0?"onComplete":"onReverseComplete",!0),this._prom&&!(u<l&&this.timeScale()>0)&&this._prom())))}return this},e.add=function(i,s){var o=this;if(Cn(s)||(s=en(this,s,i)),!(i instanceof xr)){if(Ce(i))return i.forEach(function(a){return o.add(a,s)}),this;if(xe(i))return this.addLabel(i,s);if(oe(i))i=he.delayedCall(0,i);else return this}return this!==i?mn(this,i,s):this},e.getChildren=function(i,s,o,a){i===void 0&&(i=!0),s===void 0&&(s=!0),o===void 0&&(o=!0),a===void 0&&(a=-sn);for(var l=[],c=this._first;c;)c._start>=a&&(c instanceof he?s&&l.push(c):(o&&l.push(c),i&&l.push.apply(l,c.getChildren(!0,s,o)))),c=c._next;return l},e.getById=function(i){for(var s=this.getChildren(1,1,1),o=s.length;o--;)if(s[o].vars.id===i)return s[o]},e.remove=function(i){return xe(i)?this.removeLabel(i):oe(i)?this.killTweensOf(i):(i.parent===this&&vs(this,i),i===this._recent&&(this._recent=this._last),li(this))},e.totalTime=function(i,s){return arguments.length?(this._forcing=1,!this._dp&&this._ts&&(this._start=ee(qe.time-(this._ts>0?i/this._ts:(this.totalDuration()-i)/-this._ts))),r.prototype.totalTime.call(this,i,s),this._forcing=0,this):this._tTime},e.addLabel=function(i,s){return this.labels[i]=en(this,s),this},e.removeLabel=function(i){return delete this.labels[i],this},e.addPause=function(i,s,o){var a=he.delayedCall(0,s||_r,o);return a.data="isPause",this._hasPause=1,mn(this,a,en(this,i))},e.removePause=function(i){var s=this._first;for(i=en(this,i);s;)s._start===i&&s.data==="isPause"&&Hn(s),s=s._next},e.killTweensOf=function(i,s,o){for(var a=this.getTweensOf(i,o),l=a.length;l--;)On!==a[l]&&a[l].kill(i,s);return this},e.getTweensOf=function(i,s){for(var o=[],a=an(i),l=this._first,c=Cn(s),u;l;)l instanceof he?Ym(l._targets,a)&&(c?(!On||l._initted&&l._ts)&&l.globalTime(0)<=s&&l.globalTime(l.totalDuration())>s:!s||l.isActive())&&o.push(l):(u=l.getTweensOf(a,s)).length&&o.push.apply(o,u),l=l._next;return o},e.tweenTo=function(i,s){s=s||{};var o=this,a=en(o,i),l=s,c=l.startAt,u=l.onStart,h=l.onStartParams,f=l.immediateRender,m,g=he.to(o,Je({ease:s.ease||"none",lazy:!1,immediateRender:!1,time:a,overwrite:"auto",duration:s.duration||Math.abs((a-(c&&"time"in c?c.time:o._time))/o.timeScale())||Yt,onStart:function(){if(o.pause(),!m){var p=s.duration||Math.abs((a-(c&&"time"in c?c.time:o._time))/o.timeScale());g._dur!==p&&Xi(g,p,0,1).render(g._time,!0,!0),m=1}u&&u.apply(g,h||[])}},s));return f?g.render(0):g},e.tweenFromTo=function(i,s,o){return this.tweenTo(s,Je({startAt:{time:en(this,i)}},o))},e.recent=function(){return this._recent},e.nextLabel=function(i){return i===void 0&&(i=this._time),sl(this,en(this,i))},e.previousLabel=function(i){return i===void 0&&(i=this._time),sl(this,en(this,i),1)},e.currentLabel=function(i){return arguments.length?this.seek(i,!0):this.previousLabel(this._time+Yt)},e.shiftChildren=function(i,s,o){o===void 0&&(o=0);var a=this._first,l=this.labels,c;for(i=ee(i);a;)a._start>=o&&(a._start+=i,a._end+=i),a=a._next;if(s)for(c in l)l[c]>=o&&(l[c]+=i);return li(this)},e.invalidate=function(i){var s=this._first;for(this._lock=0;s;)s.invalidate(i),s=s._next;return r.prototype.invalidate.call(this,i)},e.clear=function(i){i===void 0&&(i=!0);for(var s=this._first,o;s;)o=s._next,this.remove(s),s=o;return this._dp&&(this._time=this._tTime=this._pTime=0),i&&(this.labels={}),li(this)},e.totalDuration=function(i){var s=0,o=this,a=o._last,l=sn,c,u,h;if(arguments.length)return o.timeScale((o._repeat<0?o.duration():o.totalDuration())/(o.reversed()?-i:i));if(o._dirty){for(h=o.parent;a;)c=a._prev,a._dirty&&a.totalDuration(),u=a._start,u>l&&o._sort&&a._ts&&!o._lock?(o._lock=1,mn(o,a,u-a._delay,1)._lock=0):l=u,u<0&&a._ts&&(s-=u,(!h&&!o._dp||h&&h.smoothChildTiming)&&(o._start+=ee(u/o._ts),o._time-=u,o._tTime-=u),o.shiftChildren(-u,!1,-1/0),l=0),a._end>s&&a._ts&&(s=a._end),a=c;Xi(o,o===ne&&o._time>s?o._time:s,1,1),o._dirty=0}return o._tDur},t.updateRoot=function(i){if(ne._ts&&(Ac(ne,us(i,ne)),Tc=qe.frame),qe.frame>=el){el+=Ze.autoSleep||120;var s=ne._first;if((!s||!s._ts)&&Ze.autoSleep&&qe._listeners.length<2){for(;s&&!s._ts;)s=s._next;s||qe.sleep()}}},t}(xr);Je(Ue.prototype,{_lock:0,_hasPause:0,_forcing:0});var __=function(t,e,n,i,s,o,a){var l=new Ge(this._pt,t,e,0,1,Qc,null,s),c=0,u=0,h,f,m,g,_,p,d,M;for(l.b=n,l.e=i,n+="",i+="",(d=~i.indexOf("random("))&&(i=gr(i)),o&&(M=[n,i],o(M,t,e),n=M[0],i=M[1]),f=n.match(Qs)||[];h=Qs.exec(i);)g=h[0],_=i.substring(c,h.index),m?m=(m+1)%5:_.substr(-5)==="rgba("&&(m=1),g!==f[u++]&&(p=parseFloat(f[u-1])||0,l._pt={_next:l._pt,p:_||u===1?_:",",s:p,c:g.charAt(1)==="="?Bi(p,g)-p:parseFloat(g)-p,m:m&&m<4?Math.round:0},c=Qs.lastIndex);return l.c=c<i.length?i.substring(c,i.length):"",l.fp=a,(xc.test(i)||d)&&(l.e=0),this._pt=l,l},qa=function(t,e,n,i,s,o,a,l,c,u){oe(i)&&(i=i(s||0,t,o));var h=t[e],f=n!=="get"?n:oe(h)?c?t[e.indexOf("set")||!oe(t["get"+e.substr(3)])?e:"get"+e.substr(3)](c):t[e]():h,m=oe(h)?c?S_:$c:Ka,g;if(xe(i)&&(~i.indexOf("random(")&&(i=gr(i)),i.charAt(1)==="="&&(g=Bi(f,i)+(be(f)||0),(g||g===0)&&(i=g))),!u||f!==i||Ta)return!isNaN(f*i)&&i!==""?(g=new Ge(this._pt,t,e,+f||0,i-(f||0),typeof h=="boolean"?T_:Jc,0,m),c&&(g.fp=c),a&&g.modifier(a,this,t),this._pt=g):(!h&&!(e in t)&&Va(e,i),__.call(this,t,e,f,i,m,l||Ze.stringFilter,c))},g_=function(t,e,n,i,s){if(oe(t)&&(t=fr(t,s,e,n,i)),!vn(t)||t.style&&t.nodeType||Ce(t)||gc(t))return xe(t)?fr(t,s,e,n,i):t;var o={},a;for(a in t)o[a]=fr(t[a],s,e,n,i);return o},Kc=function(t,e,n,i,s,o){var a,l,c,u;if(Xe[t]&&(a=new Xe[t]).init(s,a.rawVars?e[t]:g_(e[t],i,s,o,n),n,i,o)!==!1&&(n._pt=l=new Ge(n._pt,s,t,0,1,a.render,a,0,a.priority),n!==Ui))for(c=n._ptLookup[n._targets.indexOf(s)],u=a._props.length;u--;)c[a._props[u]]=l;return a},On,Ta,Ya=function r(t,e,n){var i=t.vars,s=i.ease,o=i.startAt,a=i.immediateRender,l=i.lazy,c=i.onUpdate,u=i.runBackwards,h=i.yoyoEase,f=i.keyframes,m=i.autoRevert,g=t._dur,_=t._startAt,p=t._targets,d=t.parent,M=d&&d.data==="nested"?d.vars.targets:p,x=t._overwrite==="auto"&&!Oa,E=t.timeline,R,w,A,L,v,y,U,F,q,C,I,O,W;if(E&&(!f||!s)&&(s="none"),t._ease=ci(s,Hi.ease),t._yEase=h?Wc(ci(h===!0?s:h,Hi.ease)):0,h&&t._yoyo&&!t._repeat&&(h=t._yEase,t._yEase=t._ease,t._ease=h),t._from=!E&&!!i.runBackwards,!E||f&&!i.stagger){if(F=p[0]?oi(p[0]).harness:0,O=F&&i[F.prop],R=cs(i,Ha),_&&(_._zTime<0&&_.progress(1),e<0&&u&&a&&!m?_.render(-1,!0):_.revert(u&&g?ts:Xm),_._lazy=0),o){if(Hn(t._startAt=he.set(p,Je({data:"isStart",overwrite:!1,parent:d,immediateRender:!0,lazy:!_&&Oe(l),startAt:null,delay:0,onUpdate:c&&function(){return Ye(t,"onUpdate")},stagger:0},o))),t._startAt._dp=0,t._startAt._sat=t,e<0&&(Ee||!a&&!m)&&t._startAt.revert(ts),a&&g&&e<=0&&n<=0){e&&(t._zTime=e);return}}else if(u&&g&&!_){if(e&&(a=!1),A=Je({overwrite:!1,data:"isFromStart",lazy:a&&!_&&Oe(l),immediateRender:a,stagger:0,parent:d},R),O&&(A[F.prop]=O),Hn(t._startAt=he.set(p,A)),t._startAt._dp=0,t._startAt._sat=t,e<0&&(Ee?t._startAt.revert(ts):t._startAt.render(-1,!0)),t._zTime=e,!a)r(t._startAt,Yt,Yt);else if(!e)return}for(t._pt=t._ptCache=0,l=g&&Oe(l)||l&&!g,w=0;w<p.length;w++){if(v=p[w],U=v._gsap||Wa(p)[w]._gsap,t._ptLookup[w]=C={},ga[U.id]&&zn.length&&ls(),I=M===p?w:M.indexOf(v),F&&(q=new F).init(v,O||R,t,I,M)!==!1&&(t._pt=L=new Ge(t._pt,v,q.name,0,1,q.render,q,0,q.priority),q._props.forEach(function(X){C[X]=L}),q.priority&&(y=1)),!F||O)for(A in R)Xe[A]&&(q=Kc(A,R,t,I,v,M))?q.priority&&(y=1):C[A]=L=qa.call(t,v,A,"get",R[A],I,M,0,i.stringFilter);t._op&&t._op[w]&&t.kill(v,t._op[w]),x&&t._pt&&(On=t,ne.killTweensOf(v,C,t.globalTime(e)),W=!t.parent,On=0),t._pt&&l&&(ga[U.id]=1)}y&&tu(t),t._onInit&&t._onInit(t)}t._onUpdate=c,t._initted=(!t._op||t._pt)&&!W,f&&e<=0&&E.render(sn,!0,!0)},v_=function(t,e,n,i,s,o,a,l){var c=(t._pt&&t._ptCache||(t._ptCache={}))[e],u,h,f,m;if(!c)for(c=t._ptCache[e]=[],f=t._ptLookup,m=t._targets.length;m--;){if(u=f[m][e],u&&u.d&&u.d._pt)for(u=u.d._pt;u&&u.p!==e&&u.fp!==e;)u=u._next;if(!u)return Ta=1,t.vars[e]="+=0",Ya(t,a),Ta=0,l?mr(e+" not eligible for reset"):1;c.push(u)}for(m=c.length;m--;)h=c[m],u=h._pt||h,u.s=(i||i===0)&&!s?i:u.s+(i||0)+o*u.c,u.c=n-u.s,h.e&&(h.e=ce(n)+be(h.e)),h.b&&(h.b=u.s+be(h.b))},x_=function(t,e){var n=t[0]?oi(t[0]).harness:0,i=n&&n.aliases,s,o,a,l;if(!i)return e;s=ki({},e);for(o in i)if(o in s)for(l=i[o].split(","),a=l.length;a--;)s[l[a]]=s[o];return s},M_=function(t,e,n,i){var s=e.ease||i||"power1.inOut",o,a;if(Ce(e))a=n[t]||(n[t]=[]),e.forEach(function(l,c){return a.push({t:c/(e.length-1)*100,v:l,e:s})});else for(o in e)a=n[o]||(n[o]=[]),o==="ease"||a.push({t:parseFloat(t),v:e[o],e:s})},fr=function(t,e,n,i,s){return oe(t)?t.call(e,n,i,s):xe(t)&&~t.indexOf("random(")?gr(t):t},jc=ka+"repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,autoRevert",Zc={};Be(jc+",id,stagger,delay,duration,paused,scrollTrigger",function(r){return Zc[r]=1});var he=function(r){mc(t,r);function t(n,i,s,o){var a;typeof i=="number"&&(s.duration=i,i=s,s=null),a=r.call(this,o?i:ur(i))||this;var l=a.vars,c=l.duration,u=l.delay,h=l.immediateRender,f=l.stagger,m=l.overwrite,g=l.keyframes,_=l.defaults,p=l.scrollTrigger,d=l.yoyoEase,M=i.parent||ne,x=(Ce(n)||gc(n)?Cn(n[0]):"length"in i)?[n]:an(n),E,R,w,A,L,v,y,U;if(a._targets=x.length?Wa(x):mr("GSAP target "+n+" not found. https://gsap.com",!Ze.nullTargetWarn)||[],a._ptLookup=[],a._overwrite=m,g||f||$r(c)||$r(u)){if(i=a.vars,E=a.timeline=new Ue({data:"nested",defaults:_||{},targets:M&&M.data==="nested"?M.vars.targets:x}),E.kill(),E.parent=E._dp=bn(a),E._start=0,f||$r(c)||$r(u)){if(A=x.length,y=f&&Uc(f),vn(f))for(L in f)~jc.indexOf(L)&&(U||(U={}),U[L]=f[L]);for(R=0;R<A;R++)w=cs(i,Zc),w.stagger=0,d&&(w.yoyoEase=d),U&&ki(w,U),v=x[R],w.duration=+fr(c,bn(a),R,v,x),w.delay=(+fr(u,bn(a),R,v,x)||0)-a._delay,!f&&A===1&&w.delay&&(a._delay=u=w.delay,a._start+=u,w.delay=0),E.to(v,w,y?y(R,v,x):0),E._ease=Gt.none;E.duration()?c=u=0:a.timeline=0}else if(g){ur(Je(E.vars.defaults,{ease:"none"})),E._ease=ci(g.ease||i.ease||"none");var F=0,q,C,I;if(Ce(g))g.forEach(function(O){return E.to(x,O,">")}),E.duration();else{w={};for(L in g)L==="ease"||L==="easeEach"||M_(L,g[L],w,g.easeEach);for(L in w)for(q=w[L].sort(function(O,W){return O.t-W.t}),F=0,R=0;R<q.length;R++)C=q[R],I={ease:C.e,duration:(C.t-(R?q[R-1].t:0))/100*c},I[L]=C.v,E.to(x,I,F),F+=I.duration;E.duration()<c&&E.to({},{duration:c-E.duration()})}}c||a.duration(c=E.duration())}else a.timeline=0;return m===!0&&!Oa&&(On=bn(a),ne.killTweensOf(x),On=0),mn(M,bn(a),s),i.reversed&&a.reverse(),i.paused&&a.paused(!0),(h||!c&&!g&&a._start===ee(M._time)&&Oe(h)&&$m(bn(a))&&M.data!=="nested")&&(a._tTime=-Yt,a.render(Math.max(0,-u)||0)),p&&Pc(bn(a),p),a}var e=t.prototype;return e.render=function(i,s,o){var a=this._time,l=this._tDur,c=this._dur,u=i<0,h=i>l-Yt&&!u?l:i<Yt?0:i,f,m,g,_,p,d,M,x,E;if(!c)Qm(this,i,s,o);else if(h!==this._tTime||!i||o||!this._initted&&this._tTime||this._startAt&&this._zTime<0!==u||this._lazy){if(f=h,x=this.timeline,this._repeat){if(_=c+this._rDelay,this._repeat<-1&&u)return this.totalTime(_*100+i,s,o);if(f=ee(h%_),h===l?(g=this._repeat,f=c):(p=ee(h/_),g=~~p,g&&g===p?(f=c,g--):f>c&&(f=c)),d=this._yoyo&&g&1,d&&(E=this._yEase,f=c-f),p=Wi(this._tTime,_),f===a&&!o&&this._initted&&g===p)return this._tTime=h,this;g!==p&&(x&&this._yEase&&Xc(x,d),this.vars.repeatRefresh&&!d&&!this._lock&&f!==_&&this._initted&&(this._lock=o=1,this.render(ee(_*g),!0).invalidate()._lock=0))}if(!this._initted){if(Lc(this,u?i:f,o,s,h))return this._tTime=0,this;if(a!==this._time&&!(o&&this.vars.repeatRefresh&&g!==p))return this;if(c!==this._dur)return this.render(i,s,o)}if(this._tTime=h,this._time=f,!this._act&&this._ts&&(this._act=1,this._lazy=0),this.ratio=M=(E||this._ease)(f/c),this._from&&(this.ratio=M=1-M),!a&&h&&!s&&!p&&(Ye(this,"onStart"),this._tTime!==h))return this;for(m=this._pt;m;)m.r(M,m.d),m=m._next;x&&x.render(i<0?i:x._dur*x._ease(f/this._dur),s,o)||this._startAt&&(this._zTime=i),this._onUpdate&&!s&&(u&&va(this,i,s,o),Ye(this,"onUpdate")),this._repeat&&g!==p&&this.vars.onRepeat&&!s&&this.parent&&Ye(this,"onRepeat"),(h===this._tDur||!h)&&this._tTime===h&&(u&&!this._onUpdate&&va(this,i,!0,!0),(i||!c)&&(h===this._tDur&&this._ts>0||!h&&this._ts<0)&&Hn(this,1),!s&&!(u&&!a)&&(h||a||d)&&(Ye(this,h===l?"onComplete":"onReverseComplete",!0),this._prom&&!(h<l&&this.timeScale()>0)&&this._prom()))}return this},e.targets=function(){return this._targets},e.invalidate=function(i){return(!i||!this.vars.runBackwards)&&(this._startAt=0),this._pt=this._op=this._onUpdate=this._lazy=this.ratio=0,this._ptLookup=[],this.timeline&&this.timeline.invalidate(i),r.prototype.invalidate.call(this,i)},e.resetTo=function(i,s,o,a,l){vr||qe.wake(),this._ts||this.play();var c=Math.min(this._dur,(this._dp._time-this._start)*this._ts),u;return this._initted||Ya(this,c),u=this._ease(c/this._dur),v_(this,i,s,o,a,u,c,l)?this.resetTo(i,s,o,a,1):(Ms(this,0),this.parent||Rc(this._dp,this,"_first","_last",this._dp._sort?"_start":0),this.render(0))},e.kill=function(i,s){if(s===void 0&&(s="all"),!i&&(!s||s==="all"))return this._lazy=this._pt=0,this.parent?ar(this):this.scrollTrigger&&this.scrollTrigger.kill(!!Ee),this;if(this.timeline){var o=this.timeline.totalDuration();return this.timeline.killTweensOf(i,s,On&&On.vars.overwrite!==!0)._first||ar(this),this.parent&&o!==this.timeline.totalDuration()&&Xi(this,this._dur*this.timeline._tDur/o,0,1),this}var a=this._targets,l=i?an(i):a,c=this._ptLookup,u=this._pt,h,f,m,g,_,p,d;if((!s||s==="all")&&jm(a,l))return s==="all"&&(this._pt=0),ar(this);for(h=this._op=this._op||[],s!=="all"&&(xe(s)&&(_={},Be(s,function(M){return _[M]=1}),s=_),s=x_(a,s)),d=a.length;d--;)if(~l.indexOf(a[d])){f=c[d],s==="all"?(h[d]=s,g=f,m={}):(m=h[d]=h[d]||{},g=s);for(_ in g)p=f&&f[_],p&&((!("kill"in p.d)||p.d.kill(_)===!0)&&vs(this,p,"_pt"),delete f[_]),m!=="all"&&(m[_]=1)}return this._initted&&!this._pt&&u&&ar(this),this},t.to=function(i,s){return new t(i,s,arguments[2])},t.from=function(i,s){return hr(1,arguments)},t.delayedCall=function(i,s,o,a){return new t(s,0,{immediateRender:!1,lazy:!1,overwrite:!1,delay:i,onComplete:s,onReverseComplete:s,onCompleteParams:o,onReverseCompleteParams:o,callbackScope:a})},t.fromTo=function(i,s,o){return hr(2,arguments)},t.set=function(i,s){return s.duration=0,s.repeatDelay||(s.repeat=0),new t(i,s)},t.killTweensOf=function(i,s,o){return ne.killTweensOf(i,s,o)},t}(xr);Je(he.prototype,{_targets:[],_lazy:0,_startAt:0,_op:0,_onInit:0});Be("staggerTo,staggerFrom,staggerFromTo",function(r){he[r]=function(){var t=new Ue,e=Ma.call(arguments,0);return e.splice(r==="staggerFromTo"?5:4,0,0),t[r].apply(t,e)}});var Ka=function(t,e,n){return t[e]=n},$c=function(t,e,n){return t[e](n)},S_=function(t,e,n,i){return t[e](i.fp,n)},E_=function(t,e,n){return t.setAttribute(e,n)},ja=function(t,e){return oe(t[e])?$c:Ba(t[e])&&t.setAttribute?E_:Ka},Jc=function(t,e){return e.set(e.t,e.p,Math.round((e.s+e.c*t)*1e6)/1e6,e)},T_=function(t,e){return e.set(e.t,e.p,!!(e.s+e.c*t),e)},Qc=function(t,e){var n=e._pt,i="";if(!t&&e.b)i=e.b;else if(t===1&&e.e)i=e.e;else{for(;n;)i=n.p+(n.m?n.m(n.s+n.c*t):Math.round((n.s+n.c*t)*1e4)/1e4)+i,n=n._next;i+=e.c}e.set(e.t,e.p,i,e)},Za=function(t,e){for(var n=e._pt;n;)n.r(t,n.d),n=n._next},y_=function(t,e,n,i){for(var s=this._pt,o;s;)o=s._next,s.p===i&&s.modifier(t,e,n),s=o},A_=function(t){for(var e=this._pt,n,i;e;)i=e._next,e.p===t&&!e.op||e.op===t?vs(this,e,"_pt"):e.dep||(n=1),e=i;return!n},b_=function(t,e,n,i){i.mSet(t,e,i.m.call(i.tween,n,i.mt),i)},tu=function(t){for(var e=t._pt,n,i,s,o;e;){for(n=e._next,i=s;i&&i.pr>e.pr;)i=i._next;(e._prev=i?i._prev:o)?e._prev._next=e:s=e,(e._next=i)?i._prev=e:o=e,e=n}t._pt=s},Ge=function(){function r(e,n,i,s,o,a,l,c,u){this.t=n,this.s=s,this.c=o,this.p=i,this.r=a||Jc,this.d=l||this,this.set=c||Ka,this.pr=u||0,this._next=e,e&&(e._prev=this)}var t=r.prototype;return t.modifier=function(n,i,s){this.mSet=this.mSet||this.set,this.set=b_,this.m=n,this.mt=s,this.tween=i},r}();Be(ka+"parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger",function(r){return Ha[r]=1});$e.TweenMax=$e.TweenLite=he;$e.TimelineLite=$e.TimelineMax=Ue;ne=new Ue({sortChildren:!1,defaults:Hi,autoRemoveChildren:!0,id:"root",smoothChildTiming:!0});Ze.stringFilter=kc;var ui=[],ns={},w_=[],ol=0,R_=0,ra=function(t){return(ns[t]||w_).map(function(e){return e()})},ya=function(){var t=Date.now(),e=[];t-ol>2&&(ra("matchMediaInit"),ui.forEach(function(n){var i=n.queries,s=n.conditions,o,a,l,c;for(a in i)o=dn.matchMedia(i[a]).matches,o&&(l=1),o!==s[a]&&(s[a]=o,c=1);c&&(n.revert(),l&&e.push(n))}),ra("matchMediaRevert"),e.forEach(function(n){return n.onMatch(n,function(i){return n.add(null,i)})}),ol=t,ra("matchMedia"))},eu=function(){function r(e,n){this.selector=n&&Sa(n),this.data=[],this._r=[],this.isReverted=!1,this.id=R_++,e&&this.add(e)}var t=r.prototype;return t.add=function(n,i,s){oe(n)&&(s=i,i=n,n=oe);var o=this,a=function(){var c=Jt,u=o.selector,h;return c&&c!==o&&c.data.push(o),s&&(o.selector=Sa(s)),Jt=o,h=i.apply(o,arguments),oe(h)&&o._r.push(h),Jt=c,o.selector=u,o.isReverted=!1,h};return o.last=a,n===oe?a(o,function(l){return o.add(null,l)}):n?o[n]=a:a},t.ignore=function(n){var i=Jt;Jt=null,n(this),Jt=i},t.getTweens=function(){var n=[];return this.data.forEach(function(i){return i instanceof r?n.push.apply(n,i.getTweens()):i instanceof he&&!(i.parent&&i.parent.data==="nested")&&n.push(i)}),n},t.clear=function(){this._r.length=this.data.length=0},t.kill=function(n,i){var s=this;if(n?function(){for(var a=s.getTweens(),l=s.data.length,c;l--;)c=s.data[l],c.data==="isFlip"&&(c.revert(),c.getChildren(!0,!0,!1).forEach(function(u){return a.splice(a.indexOf(u),1)}));for(a.map(function(u){return{g:u._dur||u._delay||u._sat&&!u._sat.vars.immediateRender?u.globalTime(0):-1/0,t:u}}).sort(function(u,h){return h.g-u.g||-1/0}).forEach(function(u){return u.t.revert(n)}),l=s.data.length;l--;)c=s.data[l],c instanceof Ue?c.data!=="nested"&&(c.scrollTrigger&&c.scrollTrigger.revert(),c.kill()):!(c instanceof he)&&c.revert&&c.revert(n);s._r.forEach(function(u){return u(n,s)}),s.isReverted=!0}():this.data.forEach(function(a){return a.kill&&a.kill()}),this.clear(),i)for(var o=ui.length;o--;)ui[o].id===this.id&&ui.splice(o,1)},t.revert=function(n){this.kill(n||{})},r}(),C_=function(){function r(e){this.contexts=[],this.scope=e,Jt&&Jt.data.push(this)}var t=r.prototype;return t.add=function(n,i,s){vn(n)||(n={matches:n});var o=new eu(0,s||this.scope),a=o.conditions={},l,c,u;Jt&&!o.selector&&(o.selector=Jt.selector),this.contexts.push(o),i=o.add("onMatch",i),o.queries=n;for(c in n)c==="all"?u=1:(l=dn.matchMedia(n[c]),l&&(ui.indexOf(o)<0&&ui.push(o),(a[c]=l.matches)&&(u=1),l.addListener?l.addListener(ya):l.addEventListener("change",ya)));return u&&i(o,function(h){return o.add(null,h)}),this},t.revert=function(n){this.kill(n||{})},t.kill=function(n){this.contexts.forEach(function(i){return i.kill(n,!0)})},r}(),hs={registerPlugin:function(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];e.forEach(function(i){return zc(i)})},timeline:function(t){return new Ue(t)},getTweensOf:function(t,e){return ne.getTweensOf(t,e)},getProperty:function(t,e,n,i){xe(t)&&(t=an(t)[0]);var s=oi(t||{}).get,o=n?wc:bc;return n==="native"&&(n=""),t&&(e?o((Xe[e]&&Xe[e].get||s)(t,e,n,i)):function(a,l,c){return o((Xe[a]&&Xe[a].get||s)(t,a,l,c))})},quickSetter:function(t,e,n){if(t=an(t),t.length>1){var i=t.map(function(u){return Ve.quickSetter(u,e,n)}),s=i.length;return function(u){for(var h=s;h--;)i[h](u)}}t=t[0]||{};var o=Xe[e],a=oi(t),l=a.harness&&(a.harness.aliases||{})[e]||e,c=o?function(u){var h=new o;Ui._pt=0,h.init(t,n?u+n:u,Ui,0,[t]),h.render(1,h),Ui._pt&&Za(1,Ui)}:a.set(t,l);return o?c:function(u){return c(t,l,n?u+n:u,a,1)}},quickTo:function(t,e,n){var i,s=Ve.to(t,Je((i={},i[e]="+=0.1",i.paused=!0,i.stagger=0,i),n||{})),o=function(l,c,u){return s.resetTo(e,l,c,u)};return o.tween=s,o},isTweening:function(t){return ne.getTweensOf(t,!0).length>0},defaults:function(t){return t&&t.ease&&(t.ease=ci(t.ease,Hi.ease)),nl(Hi,t||{})},config:function(t){return nl(Ze,t||{})},registerEffect:function(t){var e=t.name,n=t.effect,i=t.plugins,s=t.defaults,o=t.extendTimeline;(i||"").split(",").forEach(function(a){return a&&!Xe[a]&&!$e[a]&&mr(e+" effect requires "+a+" plugin.")}),ta[e]=function(a,l,c){return n(an(a),Je(l||{},s),c)},o&&(Ue.prototype[e]=function(a,l,c){return this.add(ta[e](a,vn(l)?l:(c=l)&&{},this),c)})},registerEase:function(t,e){Gt[t]=ci(e)},parseEase:function(t,e){return arguments.length?ci(t,e):Gt},getById:function(t){return ne.getById(t)},exportRoot:function(t,e){t===void 0&&(t={});var n=new Ue(t),i,s;for(n.smoothChildTiming=Oe(t.smoothChildTiming),ne.remove(n),n._dp=0,n._time=n._tTime=ne._time,i=ne._first;i;)s=i._next,(e||!(!i._dur&&i instanceof he&&i.vars.onComplete===i._targets[0]))&&mn(n,i,i._start-i._delay),i=s;return mn(ne,n,0),n},context:function(t,e){return t?new eu(t,e):Jt},matchMedia:function(t){return new C_(t)},matchMediaRefresh:function(){return ui.forEach(function(t){var e=t.conditions,n,i;for(i in e)e[i]&&(e[i]=!1,n=1);n&&t.revert()})||ya()},addEventListener:function(t,e){var n=ns[t]||(ns[t]=[]);~n.indexOf(e)||n.push(e)},removeEventListener:function(t,e){var n=ns[t],i=n&&n.indexOf(e);i>=0&&n.splice(i,1)},utils:{wrap:o_,wrapYoyo:l_,distribute:Uc,random:Nc,snap:Fc,normalize:a_,getUnit:be,clamp:n_,splitColor:Vc,toArray:an,selector:Sa,mapRange:Bc,pipe:r_,unitize:s_,interpolate:c_,shuffle:Ic},install:Sc,effects:ta,ticker:qe,updateRoot:Ue.updateRoot,plugins:Xe,globalTimeline:ne,core:{PropTween:Ge,globals:Ec,Tween:he,Timeline:Ue,Animation:xr,getCache:oi,_removeLinkedListItem:vs,reverting:function(){return Ee},context:function(t){return t&&Jt&&(Jt.data.push(t),t._ctx=Jt),Jt},suppressOverwrites:function(t){return Oa=t}}};Be("to,from,fromTo,delayedCall,set,killTweensOf",function(r){return hs[r]=he[r]});qe.add(Ue.updateRoot);Ui=hs.to({},{duration:0});var P_=function(t,e){for(var n=t._pt;n&&n.p!==e&&n.op!==e&&n.fp!==e;)n=n._next;return n},L_=function(t,e){var n=t._targets,i,s,o;for(i in e)for(s=n.length;s--;)o=t._ptLookup[s][i],o&&(o=o.d)&&(o._pt&&(o=P_(o,i)),o&&o.modifier&&o.modifier(e[i],t,n[s],i))},sa=function(t,e){return{name:t,headless:1,rawVars:1,init:function(i,s,o){o._onInit=function(a){var l,c;if(xe(s)&&(l={},Be(s,function(u){return l[u]=1}),s=l),e){l={};for(c in s)l[c]=e(s[c]);s=l}L_(a,s)}}}},Ve=hs.registerPlugin({name:"attr",init:function(t,e,n,i,s){var o,a,l;this.tween=n;for(o in e)l=t.getAttribute(o)||"",a=this.add(t,"setAttribute",(l||0)+"",e[o],i,s,0,0,o),a.op=o,a.b=l,this._props.push(o)},render:function(t,e){for(var n=e._pt;n;)Ee?n.set(n.t,n.p,n.b,n):n.r(t,n.d),n=n._next}},{name:"endArray",headless:1,init:function(t,e){for(var n=e.length;n--;)this.add(t,n,t[n]||0,e[n],0,0,0,0,0,1)}},sa("roundProps",Ea),sa("modifiers"),sa("snap",Fc))||hs;he.version=Ue.version=Ve.version="3.14.2";Mc=1;Ga()&&qi();Gt.Power0;Gt.Power1;Gt.Power2;Gt.Power3;Gt.Power4;Gt.Linear;Gt.Quad;Gt.Cubic;Gt.Quart;Gt.Quint;Gt.Strong;Gt.Elastic;Gt.Back;Gt.SteppedEase;Gt.Bounce;Gt.Sine;Gt.Expo;Gt.Circ;/*!
 * CSSPlugin 3.14.2
 * https://gsap.com
 *
 * Copyright 2008-2025, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/var ll,Bn,Gi,$a,si,cl,Ja,D_=function(){return typeof window!="undefined"},Pn={},ii=180/Math.PI,zi=Math.PI/180,Pi=Math.atan2,ul=1e8,Qa=/([A-Z])/g,I_=/(left|right|width|margin|padding|x)/i,U_=/[\s,\(]\S/,_n={autoAlpha:"opacity,visibility",scale:"scaleX,scaleY",alpha:"opacity"},Aa=function(t,e){return e.set(e.t,e.p,Math.round((e.s+e.c*t)*1e4)/1e4+e.u,e)},F_=function(t,e){return e.set(e.t,e.p,t===1?e.e:Math.round((e.s+e.c*t)*1e4)/1e4+e.u,e)},N_=function(t,e){return e.set(e.t,e.p,t?Math.round((e.s+e.c*t)*1e4)/1e4+e.u:e.b,e)},O_=function(t,e){return e.set(e.t,e.p,t===1?e.e:t?Math.round((e.s+e.c*t)*1e4)/1e4+e.u:e.b,e)},B_=function(t,e){var n=e.s+e.c*t;e.set(e.t,e.p,~~(n+(n<0?-.5:.5))+e.u,e)},nu=function(t,e){return e.set(e.t,e.p,t?e.e:e.b,e)},iu=function(t,e){return e.set(e.t,e.p,t!==1?e.b:e.e,e)},G_=function(t,e,n){return t.style[e]=n},z_=function(t,e,n){return t.style.setProperty(e,n)},V_=function(t,e,n){return t._gsap[e]=n},H_=function(t,e,n){return t._gsap.scaleX=t._gsap.scaleY=n},k_=function(t,e,n,i,s){var o=t._gsap;o.scaleX=o.scaleY=n,o.renderTransform(s,o)},W_=function(t,e,n,i,s){var o=t._gsap;o[e]=n,o.renderTransform(s,o)},ie="transform",ze=ie+"Origin",X_=function r(t,e){var n=this,i=this.target,s=i.style,o=i._gsap;if(t in Pn&&s){if(this.tfm=this.tfm||{},t!=="transform")t=_n[t]||t,~t.indexOf(",")?t.split(",").forEach(function(a){return n.tfm[a]=wn(i,a)}):this.tfm[t]=o.x?o[t]:wn(i,t),t===ze&&(this.tfm.zOrigin=o.zOrigin);else return _n.transform.split(",").forEach(function(a){return r.call(n,a,e)});if(this.props.indexOf(ie)>=0)return;o.svg&&(this.svgo=i.getAttribute("data-svg-origin"),this.props.push(ze,e,"")),t=ie}(s||e)&&this.props.push(t,e,s[t])},ru=function(t){t.translate&&(t.removeProperty("translate"),t.removeProperty("scale"),t.removeProperty("rotate"))},q_=function(){var t=this.props,e=this.target,n=e.style,i=e._gsap,s,o;for(s=0;s<t.length;s+=3)t[s+1]?t[s+1]===2?e[t[s]](t[s+2]):e[t[s]]=t[s+2]:t[s+2]?n[t[s]]=t[s+2]:n.removeProperty(t[s].substr(0,2)==="--"?t[s]:t[s].replace(Qa,"-$1").toLowerCase());if(this.tfm){for(o in this.tfm)i[o]=this.tfm[o];i.svg&&(i.renderTransform(),e.setAttribute("data-svg-origin",this.svgo||"")),s=Ja(),(!s||!s.isStart)&&!n[ie]&&(ru(n),i.zOrigin&&n[ze]&&(n[ze]+=" "+i.zOrigin+"px",i.zOrigin=0,i.renderTransform()),i.uncache=1)}},su=function(t,e){var n={target:t,props:[],revert:q_,save:X_};return t._gsap||Ve.core.getCache(t),e&&t.style&&t.nodeType&&e.split(",").forEach(function(i){return n.save(i)}),n},au,ba=function(t,e){var n=Bn.createElementNS?Bn.createElementNS((e||"http://www.w3.org/1999/xhtml").replace(/^https/,"http"),t):Bn.createElement(t);return n&&n.style?n:Bn.createElement(t)},Ke=function r(t,e,n){var i=getComputedStyle(t);return i[e]||i.getPropertyValue(e.replace(Qa,"-$1").toLowerCase())||i.getPropertyValue(e)||!n&&r(t,Yi(e)||e,1)||""},hl="O,Moz,ms,Ms,Webkit".split(","),Yi=function(t,e,n){var i=e||si,s=i.style,o=5;if(t in s&&!n)return t;for(t=t.charAt(0).toUpperCase()+t.substr(1);o--&&!(hl[o]+t in s););return o<0?null:(o===3?"ms":o>=0?hl[o]:"")+t},wa=function(){D_()&&window.document&&(ll=window,Bn=ll.document,Gi=Bn.documentElement,si=ba("div")||{style:{}},ba("div"),ie=Yi(ie),ze=ie+"Origin",si.style.cssText="border-width:0;line-height:0;position:absolute;padding:0",au=!!Yi("perspective"),Ja=Ve.core.reverting,$a=1)},fl=function(t){var e=t.ownerSVGElement,n=ba("svg",e&&e.getAttribute("xmlns")||"http://www.w3.org/2000/svg"),i=t.cloneNode(!0),s;i.style.display="block",n.appendChild(i),Gi.appendChild(n);try{s=i.getBBox()}catch(o){}return n.removeChild(i),Gi.removeChild(n),s},dl=function(t,e){for(var n=e.length;n--;)if(t.hasAttribute(e[n]))return t.getAttribute(e[n])},ou=function(t){var e,n;try{e=t.getBBox()}catch(i){e=fl(t),n=1}return e&&(e.width||e.height)||n||(e=fl(t)),e&&!e.width&&!e.x&&!e.y?{x:+dl(t,["x","cx","x1"])||0,y:+dl(t,["y","cy","y1"])||0,width:0,height:0}:e},lu=function(t){return!!(t.getCTM&&(!t.parentNode||t.ownerSVGElement)&&ou(t))},kn=function(t,e){if(e){var n=t.style,i;e in Pn&&e!==ze&&(e=ie),n.removeProperty?(i=e.substr(0,2),(i==="ms"||e.substr(0,6)==="webkit")&&(e="-"+e),n.removeProperty(i==="--"?e:e.replace(Qa,"-$1").toLowerCase())):n.removeAttribute(e)}},Gn=function(t,e,n,i,s,o){var a=new Ge(t._pt,e,n,0,1,o?iu:nu);return t._pt=a,a.b=i,a.e=s,t._props.push(n),a},pl={deg:1,rad:1,turn:1},Y_={grid:1,flex:1},Wn=function r(t,e,n,i){var s=parseFloat(n)||0,o=(n+"").trim().substr((s+"").length)||"px",a=si.style,l=I_.test(e),c=t.tagName.toLowerCase()==="svg",u=(c?"client":"offset")+(l?"Width":"Height"),h=100,f=i==="px",m=i==="%",g,_,p,d;if(i===o||!s||pl[i]||pl[o])return s;if(o!=="px"&&!f&&(s=r(t,e,n,"px")),d=t.getCTM&&lu(t),(m||o==="%")&&(Pn[e]||~e.indexOf("adius")))return g=d?t.getBBox()[l?"width":"height"]:t[u],ce(m?s/g*h:s/100*g);if(a[l?"width":"height"]=h+(f?o:i),_=i!=="rem"&&~e.indexOf("adius")||i==="em"&&t.appendChild&&!c?t:t.parentNode,d&&(_=(t.ownerSVGElement||{}).parentNode),(!_||_===Bn||!_.appendChild)&&(_=Bn.body),p=_._gsap,p&&m&&p.width&&l&&p.time===qe.time&&!p.uncache)return ce(s/p.width*h);if(m&&(e==="height"||e==="width")){var M=t.style[e];t.style[e]=h+i,g=t[u],M?t.style[e]=M:kn(t,e)}else(m||o==="%")&&!Y_[Ke(_,"display")]&&(a.position=Ke(t,"position")),_===t&&(a.position="static"),_.appendChild(si),g=si[u],_.removeChild(si),a.position="absolute";return l&&m&&(p=oi(_),p.time=qe.time,p.width=_[u]),ce(f?g*s/h:g&&s?h/g*s:0)},wn=function(t,e,n,i){var s;return $a||wa(),e in _n&&e!=="transform"&&(e=_n[e],~e.indexOf(",")&&(e=e.split(",")[0])),Pn[e]&&e!=="transform"?(s=Sr(t,i),s=e!=="transformOrigin"?s[e]:s.svg?s.origin:ds(Ke(t,ze))+" "+s.zOrigin+"px"):(s=t.style[e],(!s||s==="auto"||i||~(s+"").indexOf("calc("))&&(s=fs[e]&&fs[e](t,e,n)||Ke(t,e)||yc(t,e)||(e==="opacity"?1:0))),n&&!~(s+"").trim().indexOf(" ")?Wn(t,e,s,n)+n:s},K_=function(t,e,n,i){if(!n||n==="none"){var s=Yi(e,t,1),o=s&&Ke(t,s,1);o&&o!==n?(e=s,n=o):e==="borderColor"&&(n=Ke(t,"borderTopColor"))}var a=new Ge(this._pt,t.style,e,0,1,Qc),l=0,c=0,u,h,f,m,g,_,p,d,M,x,E,R;if(a.b=n,a.e=i,n+="",i+="",i.substring(0,6)==="var(--"&&(i=Ke(t,i.substring(4,i.indexOf(")")))),i==="auto"&&(_=t.style[e],t.style[e]=i,i=Ke(t,e)||i,_?t.style[e]=_:kn(t,e)),u=[n,i],kc(u),n=u[0],i=u[1],f=n.match(Ii)||[],R=i.match(Ii)||[],R.length){for(;h=Ii.exec(i);)p=h[0],M=i.substring(l,h.index),g?g=(g+1)%5:(M.substr(-5)==="rgba("||M.substr(-5)==="hsla(")&&(g=1),p!==(_=f[c++]||"")&&(m=parseFloat(_)||0,E=_.substr((m+"").length),p.charAt(1)==="="&&(p=Bi(m,p)+E),d=parseFloat(p),x=p.substr((d+"").length),l=Ii.lastIndex-x.length,x||(x=x||Ze.units[e]||E,l===i.length&&(i+=x,a.e+=x)),E!==x&&(m=Wn(t,e,_,x)||0),a._pt={_next:a._pt,p:M||c===1?M:",",s:m,c:d-m,m:g&&g<4||e==="zIndex"?Math.round:0});a.c=l<i.length?i.substring(l,i.length):""}else a.r=e==="display"&&i==="none"?iu:nu;return xc.test(i)&&(a.e=0),this._pt=a,a},ml={top:"0%",bottom:"100%",left:"0%",right:"100%",center:"50%"},j_=function(t){var e=t.split(" "),n=e[0],i=e[1]||"50%";return(n==="top"||n==="bottom"||i==="left"||i==="right")&&(t=n,n=i,i=t),e[0]=ml[n]||n,e[1]=ml[i]||i,e.join(" ")},Z_=function(t,e){if(e.tween&&e.tween._time===e.tween._dur){var n=e.t,i=n.style,s=e.u,o=n._gsap,a,l,c;if(s==="all"||s===!0)i.cssText="",l=1;else for(s=s.split(","),c=s.length;--c>-1;)a=s[c],Pn[a]&&(l=1,a=a==="transformOrigin"?ze:ie),kn(n,a);l&&(kn(n,ie),o&&(o.svg&&n.removeAttribute("transform"),i.scale=i.rotate=i.translate="none",Sr(n,1),o.uncache=1,ru(i)))}},fs={clearProps:function(t,e,n,i,s){if(s.data!=="isFromStart"){var o=t._pt=new Ge(t._pt,e,n,0,0,Z_);return o.u=i,o.pr=-10,o.tween=s,t._props.push(n),1}}},Mr=[1,0,0,1,0,0],cu={},uu=function(t){return t==="matrix(1, 0, 0, 1, 0, 0)"||t==="none"||!t},_l=function(t){var e=Ke(t,ie);return uu(e)?Mr:e.substr(7).match(vc).map(ce)},to=function(t,e){var n=t._gsap||oi(t),i=t.style,s=_l(t),o,a,l,c;return n.svg&&t.getAttribute("transform")?(l=t.transform.baseVal.consolidate().matrix,s=[l.a,l.b,l.c,l.d,l.e,l.f],s.join(",")==="1,0,0,1,0,0"?Mr:s):(s===Mr&&!t.offsetParent&&t!==Gi&&!n.svg&&(l=i.display,i.display="block",o=t.parentNode,(!o||!t.offsetParent&&!t.getBoundingClientRect().width)&&(c=1,a=t.nextElementSibling,Gi.appendChild(t)),s=_l(t),l?i.display=l:kn(t,"display"),c&&(a?o.insertBefore(t,a):o?o.appendChild(t):Gi.removeChild(t))),e&&s.length>6?[s[0],s[1],s[4],s[5],s[12],s[13]]:s)},Ra=function(t,e,n,i,s,o){var a=t._gsap,l=s||to(t,!0),c=a.xOrigin||0,u=a.yOrigin||0,h=a.xOffset||0,f=a.yOffset||0,m=l[0],g=l[1],_=l[2],p=l[3],d=l[4],M=l[5],x=e.split(" "),E=parseFloat(x[0])||0,R=parseFloat(x[1])||0,w,A,L,v;n?l!==Mr&&(A=m*p-g*_)&&(L=E*(p/A)+R*(-_/A)+(_*M-p*d)/A,v=E*(-g/A)+R*(m/A)-(m*M-g*d)/A,E=L,R=v):(w=ou(t),E=w.x+(~x[0].indexOf("%")?E/100*w.width:E),R=w.y+(~(x[1]||x[0]).indexOf("%")?R/100*w.height:R)),i||i!==!1&&a.smooth?(d=E-c,M=R-u,a.xOffset=h+(d*m+M*_)-d,a.yOffset=f+(d*g+M*p)-M):a.xOffset=a.yOffset=0,a.xOrigin=E,a.yOrigin=R,a.smooth=!!i,a.origin=e,a.originIsAbsolute=!!n,t.style[ze]="0px 0px",o&&(Gn(o,a,"xOrigin",c,E),Gn(o,a,"yOrigin",u,R),Gn(o,a,"xOffset",h,a.xOffset),Gn(o,a,"yOffset",f,a.yOffset)),t.setAttribute("data-svg-origin",E+" "+R)},Sr=function(t,e){var n=t._gsap||new Yc(t);if("x"in n&&!e&&!n.uncache)return n;var i=t.style,s=n.scaleX<0,o="px",a="deg",l=getComputedStyle(t),c=Ke(t,ze)||"0",u,h,f,m,g,_,p,d,M,x,E,R,w,A,L,v,y,U,F,q,C,I,O,W,X,Y,j,tt,et,k,K,rt;return u=h=f=_=p=d=M=x=E=0,m=g=1,n.svg=!!(t.getCTM&&lu(t)),l.translate&&((l.translate!=="none"||l.scale!=="none"||l.rotate!=="none")&&(i[ie]=(l.translate!=="none"?"translate3d("+(l.translate+" 0 0").split(" ").slice(0,3).join(", ")+") ":"")+(l.rotate!=="none"?"rotate("+l.rotate+") ":"")+(l.scale!=="none"?"scale("+l.scale.split(" ").join(",")+") ":"")+(l[ie]!=="none"?l[ie]:"")),i.scale=i.rotate=i.translate="none"),A=to(t,n.svg),n.svg&&(n.uncache?(X=t.getBBox(),c=n.xOrigin-X.x+"px "+(n.yOrigin-X.y)+"px",W=""):W=!e&&t.getAttribute("data-svg-origin"),Ra(t,W||c,!!W||n.originIsAbsolute,n.smooth!==!1,A)),R=n.xOrigin||0,w=n.yOrigin||0,A!==Mr&&(U=A[0],F=A[1],q=A[2],C=A[3],u=I=A[4],h=O=A[5],A.length===6?(m=Math.sqrt(U*U+F*F),g=Math.sqrt(C*C+q*q),_=U||F?Pi(F,U)*ii:0,M=q||C?Pi(q,C)*ii+_:0,M&&(g*=Math.abs(Math.cos(M*zi))),n.svg&&(u-=R-(R*U+w*q),h-=w-(R*F+w*C))):(rt=A[6],k=A[7],j=A[8],tt=A[9],et=A[10],K=A[11],u=A[12],h=A[13],f=A[14],L=Pi(rt,et),p=L*ii,L&&(v=Math.cos(-L),y=Math.sin(-L),W=I*v+j*y,X=O*v+tt*y,Y=rt*v+et*y,j=I*-y+j*v,tt=O*-y+tt*v,et=rt*-y+et*v,K=k*-y+K*v,I=W,O=X,rt=Y),L=Pi(-q,et),d=L*ii,L&&(v=Math.cos(-L),y=Math.sin(-L),W=U*v-j*y,X=F*v-tt*y,Y=q*v-et*y,K=C*y+K*v,U=W,F=X,q=Y),L=Pi(F,U),_=L*ii,L&&(v=Math.cos(L),y=Math.sin(L),W=U*v+F*y,X=I*v+O*y,F=F*v-U*y,O=O*v-I*y,U=W,I=X),p&&Math.abs(p)+Math.abs(_)>359.9&&(p=_=0,d=180-d),m=ce(Math.sqrt(U*U+F*F+q*q)),g=ce(Math.sqrt(O*O+rt*rt)),L=Pi(I,O),M=Math.abs(L)>2e-4?L*ii:0,E=K?1/(K<0?-K:K):0),n.svg&&(W=t.getAttribute("transform"),n.forceCSS=t.setAttribute("transform","")||!uu(Ke(t,ie)),W&&t.setAttribute("transform",W))),Math.abs(M)>90&&Math.abs(M)<270&&(s?(m*=-1,M+=_<=0?180:-180,_+=_<=0?180:-180):(g*=-1,M+=M<=0?180:-180)),e=e||n.uncache,n.x=u-((n.xPercent=u&&(!e&&n.xPercent||(Math.round(t.offsetWidth/2)===Math.round(-u)?-50:0)))?t.offsetWidth*n.xPercent/100:0)+o,n.y=h-((n.yPercent=h&&(!e&&n.yPercent||(Math.round(t.offsetHeight/2)===Math.round(-h)?-50:0)))?t.offsetHeight*n.yPercent/100:0)+o,n.z=f+o,n.scaleX=ce(m),n.scaleY=ce(g),n.rotation=ce(_)+a,n.rotationX=ce(p)+a,n.rotationY=ce(d)+a,n.skewX=M+a,n.skewY=x+a,n.transformPerspective=E+o,(n.zOrigin=parseFloat(c.split(" ")[2])||!e&&n.zOrigin||0)&&(i[ze]=ds(c)),n.xOffset=n.yOffset=0,n.force3D=Ze.force3D,n.renderTransform=n.svg?J_:au?hu:$_,n.uncache=0,n},ds=function(t){return(t=t.split(" "))[0]+" "+t[1]},aa=function(t,e,n){var i=be(e);return ce(parseFloat(e)+parseFloat(Wn(t,"x",n+"px",i)))+i},$_=function(t,e){e.z="0px",e.rotationY=e.rotationX="0deg",e.force3D=0,hu(t,e)},Jn="0deg",ir="0px",Qn=") ",hu=function(t,e){var n=e||this,i=n.xPercent,s=n.yPercent,o=n.x,a=n.y,l=n.z,c=n.rotation,u=n.rotationY,h=n.rotationX,f=n.skewX,m=n.skewY,g=n.scaleX,_=n.scaleY,p=n.transformPerspective,d=n.force3D,M=n.target,x=n.zOrigin,E="",R=d==="auto"&&t&&t!==1||d===!0;if(x&&(h!==Jn||u!==Jn)){var w=parseFloat(u)*zi,A=Math.sin(w),L=Math.cos(w),v;w=parseFloat(h)*zi,v=Math.cos(w),o=aa(M,o,A*v*-x),a=aa(M,a,-Math.sin(w)*-x),l=aa(M,l,L*v*-x+x)}p!==ir&&(E+="perspective("+p+Qn),(i||s)&&(E+="translate("+i+"%, "+s+"%) "),(R||o!==ir||a!==ir||l!==ir)&&(E+=l!==ir||R?"translate3d("+o+", "+a+", "+l+") ":"translate("+o+", "+a+Qn),c!==Jn&&(E+="rotate("+c+Qn),u!==Jn&&(E+="rotateY("+u+Qn),h!==Jn&&(E+="rotateX("+h+Qn),(f!==Jn||m!==Jn)&&(E+="skew("+f+", "+m+Qn),(g!==1||_!==1)&&(E+="scale("+g+", "+_+Qn),M.style[ie]=E||"translate(0, 0)"},J_=function(t,e){var n=e||this,i=n.xPercent,s=n.yPercent,o=n.x,a=n.y,l=n.rotation,c=n.skewX,u=n.skewY,h=n.scaleX,f=n.scaleY,m=n.target,g=n.xOrigin,_=n.yOrigin,p=n.xOffset,d=n.yOffset,M=n.forceCSS,x=parseFloat(o),E=parseFloat(a),R,w,A,L,v;l=parseFloat(l),c=parseFloat(c),u=parseFloat(u),u&&(u=parseFloat(u),c+=u,l+=u),l||c?(l*=zi,c*=zi,R=Math.cos(l)*h,w=Math.sin(l)*h,A=Math.sin(l-c)*-f,L=Math.cos(l-c)*f,c&&(u*=zi,v=Math.tan(c-u),v=Math.sqrt(1+v*v),A*=v,L*=v,u&&(v=Math.tan(u),v=Math.sqrt(1+v*v),R*=v,w*=v)),R=ce(R),w=ce(w),A=ce(A),L=ce(L)):(R=h,L=f,w=A=0),(x&&!~(o+"").indexOf("px")||E&&!~(a+"").indexOf("px"))&&(x=Wn(m,"x",o,"px"),E=Wn(m,"y",a,"px")),(g||_||p||d)&&(x=ce(x+g-(g*R+_*A)+p),E=ce(E+_-(g*w+_*L)+d)),(i||s)&&(v=m.getBBox(),x=ce(x+i/100*v.width),E=ce(E+s/100*v.height)),v="matrix("+R+","+w+","+A+","+L+","+x+","+E+")",m.setAttribute("transform",v),M&&(m.style[ie]=v)},Q_=function(t,e,n,i,s){var o=360,a=xe(s),l=parseFloat(s)*(a&&~s.indexOf("rad")?ii:1),c=l-i,u=i+c+"deg",h,f;return a&&(h=s.split("_")[1],h==="short"&&(c%=o,c!==c%(o/2)&&(c+=c<0?o:-o)),h==="cw"&&c<0?c=(c+o*ul)%o-~~(c/o)*o:h==="ccw"&&c>0&&(c=(c-o*ul)%o-~~(c/o)*o)),t._pt=f=new Ge(t._pt,e,n,i,c,F_),f.e=u,f.u="deg",t._props.push(n),f},gl=function(t,e){for(var n in e)t[n]=e[n];return t},tg=function(t,e,n){var i=gl({},n._gsap),s="perspective,force3D,transformOrigin,svgOrigin",o=n.style,a,l,c,u,h,f,m,g;i.svg?(c=n.getAttribute("transform"),n.setAttribute("transform",""),o[ie]=e,a=Sr(n,1),kn(n,ie),n.setAttribute("transform",c)):(c=getComputedStyle(n)[ie],o[ie]=e,a=Sr(n,1),o[ie]=c);for(l in Pn)c=i[l],u=a[l],c!==u&&s.indexOf(l)<0&&(m=be(c),g=be(u),h=m!==g?Wn(n,l,c,g):parseFloat(c),f=parseFloat(u),t._pt=new Ge(t._pt,a,l,h,f-h,Aa),t._pt.u=g||0,t._props.push(l));gl(a,i)};Be("padding,margin,Width,Radius",function(r,t){var e="Top",n="Right",i="Bottom",s="Left",o=(t<3?[e,n,i,s]:[e+s,e+n,i+n,i+s]).map(function(a){return t<2?r+a:"border"+a+r});fs[t>1?"border"+r:r]=function(a,l,c,u,h){var f,m;if(arguments.length<4)return f=o.map(function(g){return wn(a,g,c)}),m=f.join(" "),m.split(f[0]).length===5?f[0]:m;f=(u+"").split(" "),m={},o.forEach(function(g,_){return m[g]=f[_]=f[_]||f[(_-1)/2|0]}),a.init(l,m,h)}});var fu={name:"css",register:wa,targetTest:function(t){return t.style&&t.nodeType},init:function(t,e,n,i,s){var o=this._props,a=t.style,l=n.vars.startAt,c,u,h,f,m,g,_,p,d,M,x,E,R,w,A,L,v;$a||wa(),this.styles=this.styles||su(t),L=this.styles.props,this.tween=n;for(_ in e)if(_!=="autoRound"&&(u=e[_],!(Xe[_]&&Kc(_,e,n,i,t,s)))){if(m=typeof u,g=fs[_],m==="function"&&(u=u.call(n,i,t,s),m=typeof u),m==="string"&&~u.indexOf("random(")&&(u=gr(u)),g)g(this,t,_,u,n)&&(A=1);else if(_.substr(0,2)==="--")c=(getComputedStyle(t).getPropertyValue(_)+"").trim(),u+="",Vn.lastIndex=0,Vn.test(c)||(p=be(c),d=be(u),d?p!==d&&(c=Wn(t,_,c,d)+d):p&&(u+=p)),this.add(a,"setProperty",c,u,i,s,0,0,_),o.push(_),L.push(_,0,a[_]);else if(m!=="undefined"){if(l&&_ in l?(c=typeof l[_]=="function"?l[_].call(n,i,t,s):l[_],xe(c)&&~c.indexOf("random(")&&(c=gr(c)),be(c+"")||c==="auto"||(c+=Ze.units[_]||be(wn(t,_))||""),(c+"").charAt(1)==="="&&(c=wn(t,_))):c=wn(t,_),f=parseFloat(c),M=m==="string"&&u.charAt(1)==="="&&u.substr(0,2),M&&(u=u.substr(2)),h=parseFloat(u),_ in _n&&(_==="autoAlpha"&&(f===1&&wn(t,"visibility")==="hidden"&&h&&(f=0),L.push("visibility",0,a.visibility),Gn(this,a,"visibility",f?"inherit":"hidden",h?"inherit":"hidden",!h)),_!=="scale"&&_!=="transform"&&(_=_n[_],~_.indexOf(",")&&(_=_.split(",")[0]))),x=_ in Pn,x){if(this.styles.save(_),v=u,m==="string"&&u.substring(0,6)==="var(--"){if(u=Ke(t,u.substring(4,u.indexOf(")"))),u.substring(0,5)==="calc("){var y=t.style.perspective;t.style.perspective=u,u=Ke(t,"perspective"),y?t.style.perspective=y:kn(t,"perspective")}h=parseFloat(u)}if(E||(R=t._gsap,R.renderTransform&&!e.parseTransform||Sr(t,e.parseTransform),w=e.smoothOrigin!==!1&&R.smooth,E=this._pt=new Ge(this._pt,a,ie,0,1,R.renderTransform,R,0,-1),E.dep=1),_==="scale")this._pt=new Ge(this._pt,R,"scaleY",R.scaleY,(M?Bi(R.scaleY,M+h):h)-R.scaleY||0,Aa),this._pt.u=0,o.push("scaleY",_),_+="X";else if(_==="transformOrigin"){L.push(ze,0,a[ze]),u=j_(u),R.svg?Ra(t,u,0,w,0,this):(d=parseFloat(u.split(" ")[2])||0,d!==R.zOrigin&&Gn(this,R,"zOrigin",R.zOrigin,d),Gn(this,a,_,ds(c),ds(u)));continue}else if(_==="svgOrigin"){Ra(t,u,1,w,0,this);continue}else if(_ in cu){Q_(this,R,_,f,M?Bi(f,M+u):u);continue}else if(_==="smoothOrigin"){Gn(this,R,"smooth",R.smooth,u);continue}else if(_==="force3D"){R[_]=u;continue}else if(_==="transform"){tg(this,u,t);continue}}else _ in a||(_=Yi(_)||_);if(x||(h||h===0)&&(f||f===0)&&!U_.test(u)&&_ in a)p=(c+"").substr((f+"").length),h||(h=0),d=be(u)||(_ in Ze.units?Ze.units[_]:p),p!==d&&(f=Wn(t,_,c,d)),this._pt=new Ge(this._pt,x?R:a,_,f,(M?Bi(f,M+h):h)-f,!x&&(d==="px"||_==="zIndex")&&e.autoRound!==!1?B_:Aa),this._pt.u=d||0,x&&v!==u?(this._pt.b=c,this._pt.e=v,this._pt.r=O_):p!==d&&d!=="%"&&(this._pt.b=c,this._pt.r=N_);else if(_ in a)K_.call(this,t,_,c,M?M+u:u);else if(_ in t)this.add(t,_,c||t[_],M?M+u:u,i,s);else if(_!=="parseTransform"){Va(_,u);continue}x||(_ in a?L.push(_,0,a[_]):typeof t[_]=="function"?L.push(_,2,t[_]()):L.push(_,1,c||t[_])),o.push(_)}}A&&tu(this)},render:function(t,e){if(e.tween._time||!Ja())for(var n=e._pt;n;)n.r(t,n.d),n=n._next;else e.styles.revert()},get:wn,aliases:_n,getSetter:function(t,e,n){var i=_n[e];return i&&i.indexOf(",")<0&&(e=i),e in Pn&&e!==ze&&(t._gsap.x||wn(t,"x"))?n&&cl===n?e==="scale"?H_:V_:(cl=n||{})&&(e==="scale"?k_:W_):t.style&&!Ba(t.style[e])?G_:~e.indexOf("-")?z_:ja(t,e)},core:{_removeProperty:kn,_getMatrix:to}};Ve.utils.checkPrefix=Yi;Ve.core.getStyleSaver=su;(function(r,t,e,n){var i=Be(r+","+t+","+e,function(s){Pn[s]=1});Be(t,function(s){Ze.units[s]="deg",cu[s]=1}),_n[i[13]]=r+","+t,Be(n,function(s){var o=s.split(":");_n[o[1]]=i[o[0]]})})("x,y,z,scale,scaleX,scaleY,xPercent,yPercent","rotation,rotationX,rotationY,skewX,skewY","transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective","0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");Be("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective",function(r){Ze.units[r]="px"});Ve.registerPlugin(fu);var ae=Ve.registerPlugin(fu)||Ve;ae.core.Tween;function hi(r,t,e){return r+(t-r)*e}function ti(r,t,e){return Math.max(t,Math.min(e,r))}function rr(r,t){return r+Math.random()*(t-r)}function dr(r){const t=Math.PI*2;let e=r%t;return e<0&&(e+=t),e}function vl(r,t,e){const n=dr(r),i=dr(t),s=i+e;return s<=Math.PI*2?n>=i&&n<=s:n>=i||n<=s-Math.PI*2}const sr=3,xl=.5,eg=32,ng=1.2,ig=2.5,oa=.28,rg=5,sg=9,ag=.07,Ml=.35;class og{constructor(t,e,n,i=0,s=0){this.group=new Nn,this.group.position.y=t,this.group.rotation.y=i,this.posicaoY=t,this.spiralAngle=i,this.paleta=e,this.difficulty=n,this.floorIndex=s,this.segments=[],this.isBroken=!1,this.passed=!1,this._buildSegments()}_buildSegments(){var u;const t=Math.floor(rr(6,9)),e=this.difficulty.holeSize,n=rr(0,Math.PI*2),s=(Math.PI*2-e)/t,o=this.difficulty.killerChance,a=Array.from({length:t},()=>Math.random()<o);o<1&&a.every(Boolean)&&(a[Math.floor(Math.random()*t)]=!1);const l=this.floorIndex%2===0?this.paleta.platforms:this.paleta.platformsAlt||this.paleta.platforms;for(let h=0;h<t;h++){const f=n+e+h*s,m=dr(f),g=new gs(sr,sr,xl,eg,1,!1,m,s),_=a[h],p=_?(u=this.paleta.killer)!=null?u:2960685:l,d=new pr({color:p,roughness:.5,metalness:.05,side:0}),M=new Se(g,d);M.userData.isKiller=_,this.group.add(M),this.segments.push({mesh:M,startAngle:m,endAngle:m+s,isKiller:_})}this.holeStart=n,this.holeSize=e;const c=new pr({color:l,roughness:.45,metalness:.05,side:2});[n,n+e].forEach(h=>{const f=dr(h),m=new ji(sr,xl,.07),g=new Se(m,c.clone());g.position.set(Math.sin(f)*sr*.5,0,Math.cos(f)*sr*.5),g.rotation.y=f-Math.PI/2,this.group.add(g),this._walls=this._walls||[],this._walls.push(g)})}dispose(){this.segments.forEach(({mesh:t})=>{var e,n;(e=t.geometry)==null||e.dispose(),(n=t.material)==null||n.dispose()}),(this._walls||[]).forEach(t=>{var e,n;(e=t.geometry)==null||e.dispose(),(n=t.material)==null||n.dispose()})}getSegmentAtAngle(t){const e=dr(t);if(vl(e,this.holeStart,this.holeSize))return null;for(const n of this.segments)if(vl(e,n.startAngle,n.endAngle-n.startAngle))return{mesh:n.mesh,isKiller:n.isKiller};return null}break(){if(this.isBroken)return;this.isBroken=!0;const t=this.paleta.platforms,e=Math.floor(rr(rg,sg+1));for(let n=0;n<e;n++){const i=new ai(ag,6,6),s=new Oi({color:t,transparent:!0,opacity:1}),o=new Se(i,s);this.group.add(o);const a=Math.random()*Math.PI*2,l=Math.random()*Math.PI*.5,c=rr(.5,2);ae.to(o.position,{x:Math.sin(l)*Math.cos(a)*c,y:Math.cos(l)*c*.4,z:Math.sin(l)*Math.sin(a)*c,duration:Ml,ease:"power2.out"}),ae.to(o.material,{opacity:0,duration:Ml,ease:"power2.in",onComplete:()=>{o.geometry.dispose(),o.material.dispose(),this.group.remove(o)}})}this.segments.forEach(n=>{const i=(n.startAngle+n.endAngle)/2,s=rr(ng,ig),o=n.mesh.material.clone();o.transparent=!0,n.mesh.material=o,ae.to(n.mesh.position,{x:Math.cos(i)*s,z:Math.sin(i)*s,y:(Math.random()-.3)*.6,duration:oa,ease:"power2.out"}),ae.to(o,{opacity:0,duration:oa,ease:"power1.in",onComplete:()=>{n.mesh.geometry.dispose(),o.dispose(),this.group.remove(n.mesh)}})}),ae.delayedCall(oa+.05,()=>{var n;(n=this.group.parent)==null||n.remove(this.group)})}}const Sl=4,El=-2,lg=25,cg=20,ug=30,hg=35*Math.PI/180,Tl=1,yl=5e3;class fg{constructor(t,e){this.scene=t,this.levelManager=e,this.group=new Nn,t.add(this.group),this.platforms=[],this.lowestY=0,this._floorCount=0,this._createPost()}_createPost(){var i;const t=new gs(Tl,Tl,yl,32),e=this.levelManager.getCurrentPalette(),n=(i=e==null?void 0:e.pole)!=null?i:12720219;this.postMesh=new Se(t,new pr({color:n,roughness:.4,metalness:.3})),this.postMesh.position.y=-yl/2,this.group.add(this.postMesh)}updatePoleColor(t){this.postMesh&&(t==null?void 0:t.pole)!==void 0&&this.postMesh.material.color.setHex(t.pole)}init(){var t,e,n,i,s,o;for(const{platform:a}of this.platforms)a.dispose(),this.group.remove(a.group);this.platforms=[],this._floorCount=0,this.lowestY=El;for(let a=0;a<lg;a++)this._addPlatform(El-a*Sl);if(console.log("[Helix] init: platforms criadas:",this.platforms.length),this.platforms.length>0){const a=this.platforms[0].platform;console.log("[Helix] primeiro andar y:",this.platforms[0].y,"| segmentos:",a.segments.length,"| visible:",(e=(t=a.segments[0])==null?void 0:t.mesh)==null?void 0:e.visible,"| color:",(o=(s=(i=(n=a.segments[0])==null?void 0:n.mesh)==null?void 0:i.material)==null?void 0:s.color)==null?void 0:o.getHexString())}}_addPlatform(t){const e=this.levelManager.getCurrentPalette(),n=this.levelManager.getDifficulty(),i=this._floorCount*hg,s=this._floorCount===0?co(bs({},n),{killerChance:0}):n,o=new og(t,e,s,i);this.group.add(o.group),this.platforms.push({platform:o,y:t}),t<this.lowestY&&(this.lowestY=t),this._floorCount++}update(t,e){for(;this.lowestY>t-cg;)this.lowestY-=Sl,this._addPlatform(this.lowestY);const n=e+ug;this.platforms=this.platforms.filter(({platform:i,y:s})=>s>n?(i.dispose(),this.group.remove(i.group),!1):!0)}getNextPlatformBelow(t,e=.6){let n=null,i=-1/0;for(const{platform:s,y:o}of this.platforms)s.isBroken||s.passed||o>t+e||o>i&&(i=o,n=s);return n}get rotation(){return this.group.rotation}}const Fi=[{name:"Rose",platforms:16739229,platformsAlt:16747720,ball:16727423,pole:12720219,bgTop:"#FFE4EE",bgBottom:"#FFB3CB",killer:4849696},{name:"Aqua",platforms:2541274,platformsAlt:5099745,ball:44225,pole:33679,bgTop:"#E0F7FA",bgBottom:"#B2EBF2",killer:15173},{name:"Lime",platforms:10275941,platformsAlt:11457921,ball:8172354,pole:5606191,bgTop:"#F1F8E9",bgBottom:"#DCEDC8",killer:1793568},{name:"Violet",platforms:11225020,platformsAlt:13538264,ball:9315498,pole:6953882,bgTop:"#F3E5F5",bgBottom:"#E1BEE7",killer:2949185},{name:"Amber",platforms:16754470,platformsAlt:16758605,ball:16088064,pole:15094016,bgTop:"#FFF8E1",bgBottom:"#FFECB3",killer:4071424},{name:"Indigo",platforms:6056896,platformsAlt:7964363,ball:3754411,pole:2635155,bgTop:"#E8EAF6",bgBottom:"#C5CAE9",killer:856663},{name:"Coral",platforms:16740419,platformsAlt:16747109,ball:16011550,pole:12531212,bgTop:"#FBE9E7",bgBottom:"#FFCCBC",killer:4065792}],dg=8,Al=.4,la=8,bl=.28,pg=.08,wl=.7,mg=.05,_g=.12,gg=.6,vg=.55,Rl=4;class xg{constructor(t,e=Fi[0]){this.scene=t,this.paleta=e,this.velocityY=0,this._posHistory=[],this.group=new Nn,t.add(this.group),this._createMesh(),this._createTrail()}_createMesh(){const t=new ai(Al,32,32),e=new pr({color:this.paleta.ball,metalness:.25,roughness:.35});this.mesh=new Se(t,e),this.mesh.scale.set(1,1,1),this.group.add(this.mesh)}_createTrail(){this.trailMeshes=[];for(let t=0;t<la;t++){const e=t/(la-1),n=bl-(bl-pg)*e,i=wl-(wl-mg)*e,s=new ai(n,8,8),o=new Oi({color:this.paleta.ball,transparent:!0,opacity:i}),a=new Se(s,o);a.visible=!1,this.group.add(a),this.trailMeshes.push(a)}}update(t,e){this.velocityY+=e*t,this.velocityY<-40&&(this.velocityY=-40),this.mesh.position.x=0,this.mesh.position.z=1.6,this.mesh.position.y+=this.velocityY*t,this.mesh.rotation.x+=this.velocityY*t*.5,this.mesh.rotation.z+=.02,this._posHistory.unshift(this.mesh.position.y),this._posHistory.length>la&&this._posHistory.pop();const n=this.velocityY<-2;for(let i=0;i<this.trailMeshes.length;i++){const s=this._posHistory[i+1];s!==void 0&&n?(this.trailMeshes[i].position.set(0,s,1.6),this.trailMeshes[i].visible=!0):this.trailMeshes[i].visible=!1}}bounce(){this.velocityY=dg,ae.killTweensOf(this.mesh.scale),ae.fromTo(this.mesh.scale,{y:gg},{y:1,duration:_g,ease:"back.out(2)"}),this._spawnImpact()}_spawnImpact(){const t=this.paleta.ball,e=this.mesh.position.x,n=this.mesh.position.y-Al*.8,i=this.mesh.position.z,s=new Na(vg,20),o=new Oi({color:t,transparent:!0,opacity:.55,side:2,depthWrite:!1}),a=new Se(s,o);a.rotation.x=-Math.PI/2,a.position.set(e,n,i),this.scene.add(a),a.scale.set(.1,.1,.1),ae.to(a.scale,{x:1.8,y:1.8,z:1.8,duration:.25,ease:"power2.out"}),ae.to(o,{opacity:0,duration:.35,delay:.1,ease:"power2.in",onComplete:()=>{this.scene.remove(a),s.dispose(),o.dispose()}});for(let l=0;l<Rl;l++){const c=new ai(.055,6,6),u=new Oi({color:t,transparent:!0,opacity:.85}),h=new Se(c,u);h.position.set(e,n,i),this.scene.add(h);const f=l/Rl*Math.PI*2+Math.random()*.6,m=.3+Math.random()*.5;ae.to(h.position,{x:e+Math.cos(f)*m,y:n+.08+Math.random()*.18,z:i+Math.sin(f)*m,duration:.3,ease:"power2.out"}),ae.to(u,{opacity:0,duration:.35,ease:"power2.in",onComplete:()=>{this.scene.remove(h),c.dispose(),u.dispose()}})}}reset(t,e){this.mesh.position.set(0,t,1.6),this.mesh.rotation.set(0,0,0),this.mesh.scale.set(1,1,1),this.velocityY=0,this._posHistory=[],this.trailMeshes.forEach(n=>n.visible=!1),e&&this.updatePalette(e)}updatePalette(t){t&&(this.paleta=t,this.mesh.material.color.setHex(t.ball),this.trailMeshes.forEach(e=>e.material.color.setHex(t.ball)))}get y(){return this.mesh.position.y}set y(t){this.mesh.position.y=t}}const Mg=.06,Sg=.25,Eg=.3,Tg=20,yg=1200,ca=6,ua=10,Ag=-4,bg=.15,Cl=400;class wg{constructor(t,e){var n,i;this.camera=t,this.ball=e,this.currentY=(i=(n=e==null?void 0:e.position)==null?void 0:n.y)!=null?i:0+ca,this.jumpEndTime=0,this.shakeEndTime=0}update(t){var s;if(!((s=this.ball)!=null&&s.position))return;const e=this.ball.position.y+ca,n=Math.abs(this.currentY-e);let i;if(n>Tg?i=Eg:t<this.jumpEndTime?i=Sg:i=Mg,this.currentY=hi(this.currentY,e,i),t<this.shakeEndTime){const o=(this.shakeEndTime-t)/Cl,a=bg*o;this.camera.position.set((Math.random()-.5)*2*a,this.currentY+(Math.random()-.5)*a,ua+(Math.random()-.5)*a*.3)}else this.camera.position.set(0,this.currentY,ua);this.camera.lookAt(0,this.ball.position.y+Ag,0)}shake(t=performance.now()){this.shakeEndTime=t+Cl}jumpTo(t,e=performance.now()){this.currentY=t+ca,this.camera.position.set(0,this.currentY,ua),this.jumpEndTime=e+yg}}const Pl=.012;class Rg{constructor(t,e,n){this.element=t,this.helixRotation=e,this.onInteraction=n||(()=>{}),this.enabled=!0,this._lastX=null,this._boundHandlers={mouseDown:this._onMouseDown.bind(this),mouseMove:this._onMouseMove.bind(this),mouseUp:this._onMouseUp.bind(this),touchStart:this._onTouchStart.bind(this),touchMove:this._onTouchMove.bind(this),touchEnd:this._onTouchEnd.bind(this)},this._setupListeners()}_setupListeners(){this.element.addEventListener("mousedown",this._boundHandlers.mouseDown),window.addEventListener("mousemove",this._boundHandlers.mouseMove),window.addEventListener("mouseup",this._boundHandlers.mouseUp),this.element.addEventListener("touchstart",this._boundHandlers.touchStart,{passive:!1}),this.element.addEventListener("touchmove",this._boundHandlers.touchMove,{passive:!1}),this.element.addEventListener("touchend",this._boundHandlers.touchEnd)}_onMouseDown(t){this.enabled&&(this._lastX=t.clientX)}_onMouseMove(t){if(!this.enabled||this._lastX===null)return;const e=t.clientX-this._lastX;this.helixRotation&&(this.helixRotation.y+=e*Pl),this._lastX=t.clientX}_onMouseUp(){this._lastX=null}_onTouchStart(t){this.enabled&&t.touches.length>0&&(this._lastX=t.touches[0].clientX,this.onInteraction())}_onTouchMove(t){if(!(!this.enabled||this._lastX===null)&&(t.preventDefault(),t.touches.length>0)){const e=t.touches[0].clientX-this._lastX;this.helixRotation&&(this.helixRotation.y+=e*Pl),this._lastX=t.touches[0].clientX,this.onInteraction()}}_onTouchEnd(t){t.touches.length===0?this._lastX=null:this._lastX=t.touches[0].clientX}enable(){this.enabled=!0}disable(){this.enabled=!1,this._lastX=null}}const Ll="helix-jump-record";class Cg{constructor(t){var e;this.game=t,this.scoreEl=document.getElementById("score"),this.comboEl=document.getElementById("combo"),this.pointsPopupEl=document.getElementById("points-popup"),this.gameOverEl=document.getElementById("game-over"),this.finalScoreEl=document.getElementById("final-score"),this.platformsBrokenEl=document.getElementById("platforms-broken"),this.recordEl=document.getElementById("record"),this.restartBtn=(e=this.gameOverEl)==null?void 0:e.querySelector(".restart-btn"),this.idleHintEl=document.getElementById("idle-hint"),this.comboTween=null,this._setupRestartButton()}_setupRestartButton(){this.restartBtn&&this.game&&this.restartBtn.addEventListener("click",()=>{this.game.restart()})}updateScore(t){const e=window._getGE?window._getGE():window.gameEvents;if(e!=null&&e.partidaAtiva){this.scoreEl&&(this.scoreEl.style.display="none"),this.comboEl&&(this.comboEl.style.display="none"),this.pointsPopupEl&&(this.pointsPopupEl.style.display="none");return}this.scoreEl&&(this.scoreEl.style.display="",this.scoreEl.style.color="",this.scoreEl.style.fontSize="",this.scoreEl.textContent=t)}showCombo(t){this.comboEl&&(this.comboEl.textContent=`${t}x combo!`,this.comboEl.classList.add("visible"),this.comboTween&&this.comboTween.kill(),this.comboTween=ae.to(this.comboEl,{scale:1.15,duration:.4,yoyo:!0,repeat:-1,ease:"sine.inOut"}))}hideCombo(){this.comboEl&&(this.comboTween&&(this.comboTween.kill(),this.comboTween=null),this.comboEl.classList.remove("visible"),ae.set(this.comboEl,{scale:1}))}showPointsPopup(t,e){if(!this.pointsPopupEl)return;this.pointsPopupEl.textContent=`+${t}!`;const n=e!=null?Math.max(60,Math.min(e,window.innerHeight-100)):window.innerHeight*.35;this.pointsPopupEl.style.top=`${n}px`,this.pointsPopupEl.style.left="50%",this.pointsPopupEl.style.transform="translateX(-50%)",this.pointsPopupEl.classList.add("visible"),ae.killTweensOf(this.pointsPopupEl),ae.set(this.pointsPopupEl,{y:0,opacity:1}),ae.to(this.pointsPopupEl,{y:-50,opacity:0,duration:.7,ease:"power2.out",onComplete:()=>{this.pointsPopupEl.classList.remove("visible")}})}showGameOver(t){const e=window._getGE?window._getGE():window.gameEvents;if(e!=null&&e.onMorreu||!this.gameOverEl)return;const n=this._getRecord(),i=t>n,s=i?t:n;i&&this._setRecord(t),this.finalScoreEl.textContent=t,this.recordEl.textContent=s,ae.set(this.gameOverEl,{scale:.8,opacity:0}),this.gameOverEl.classList.add("visible"),ae.to(this.gameOverEl,{scale:1,opacity:1,duration:.4,ease:"back.out(1.2)"})}hideGameOver(){this.gameOverEl&&(ae.killTweensOf(this.gameOverEl),ae.set(this.gameOverEl,{scale:1,opacity:1}),this.gameOverEl.classList.remove("visible"))}showMoneyPopup(t,e=null){const n=document.createElement("div"),i=(Math.random()-.5)*60,s=Math.max(60,Math.min(t-20,window.innerHeight-120));n.style.cssText=["position:fixed",`left:calc(50% + ${i}px)`,`top:${s}px`,"transform:translateX(-50%)","display:flex","flex-direction:column","align-items:center","gap:2px","pointer-events:none","z-index:9999","user-select:none"].join(";"),n.innerHTML=`
      <div style="
        width:42px;height:42px;
        border-radius:50%;
        background:linear-gradient(135deg,#facc15,#f59e0b);
        box-shadow:0 3px 12px rgba(0,0,0,0.3),inset 0 1px 2px rgba(255,255,255,0.5);
        display:flex;align-items:center;justify-content:center;
        font-size:22px;font-weight:900;color:#78350f;
        line-height:1;
      ">$</div>
    `,document.body.appendChild(n),ae.fromTo(n,{y:0,opacity:1,scale:.5},{y:-85,opacity:0,scale:1.1,duration:1,ease:"power2.out",onComplete:()=>n.remove()})}showIdleHint(){this.idleHintEl&&this.idleHintEl.classList.add("visible")}hideIdleHint(){this.idleHintEl&&this.idleHintEl.classList.remove("visible")}_getRecord(){try{return parseInt(localStorage.getItem(Ll)||"0",10)}catch(t){return 0}}_setRecord(t){try{localStorage.setItem(Ll,String(t))}catch(e){}}}class Pg{constructor(){this.ctx=null,this._initialized=!1,this._whiteNoiseBuffer=null,this._initOnInteraction=this._initOnInteraction.bind(this)}init(t=document){t.addEventListener("click",this._initOnInteraction,{once:!0}),t.addEventListener("touchstart",this._initOnInteraction,{once:!0,passive:!0})}_initOnInteraction(){this._initialized||(this.ctx=new(window.AudioContext||window.webkitAudioContext),this._whiteNoiseBuffer=this._createWhiteNoiseBuffer(4096),this._initialized=!0)}_createWhiteNoiseBuffer(t){if(!this.ctx)return null;const e=this.ctx.createBuffer(1,t,this.ctx.sampleRate),n=e.getChannelData(0);for(let i=0;i<t;i++)n[i]=Math.random()*2-1;return e}playBounce(){if(!this.ctx)return;const t=this.ctx.createOscillator(),e=this.ctx.createGain();t.connect(e),e.connect(this.ctx.destination),t.type="sine",t.frequency.setValueAtTime(300,this.ctx.currentTime),t.frequency.exponentialRampToValueAtTime(150,this.ctx.currentTime+.15),e.gain.setValueAtTime(.15,this.ctx.currentTime),e.gain.exponentialRampToValueAtTime(.001,this.ctx.currentTime+.15),t.start(this.ctx.currentTime),t.stop(this.ctx.currentTime+.15)}playBreak(){if(!this.ctx||!this._whiteNoiseBuffer)return;const t=this.ctx.createBufferSource(),e=this.ctx.createGain();t.buffer=this._whiteNoiseBuffer,t.connect(e),e.connect(this.ctx.destination),e.gain.setValueAtTime(.2,this.ctx.currentTime),e.gain.exponentialRampToValueAtTime(.001,this.ctx.currentTime+.08),t.start(this.ctx.currentTime),t.stop(this.ctx.currentTime+.08)}playCombo(t){if(!this.ctx)return;const e=400+(t-1)*80,n=.15+(t-1)*.05,i=this.ctx.createOscillator(),s=this.ctx.createGain();i.connect(s),s.connect(this.ctx.destination),i.type="sine",i.frequency.setValueAtTime(e,this.ctx.currentTime),s.gain.setValueAtTime(.12,this.ctx.currentTime),s.gain.exponentialRampToValueAtTime(.001,this.ctx.currentTime+n),i.start(this.ctx.currentTime),i.stop(this.ctx.currentTime+n)}playCoin(){if(!this.ctx)return;const t=this.ctx.currentTime;[{freq:988,start:0,dur:.12},{freq:1319,start:.07,dur:.2}].forEach(({freq:n,start:i,dur:s})=>{const o=this.ctx.createOscillator(),a=this.ctx.createGain();o.connect(a),a.connect(this.ctx.destination),o.type="sine",o.frequency.setValueAtTime(n,t+i),a.gain.setValueAtTime(.16,t+i),a.gain.exponentialRampToValueAtTime(.001,t+i+s),o.start(t+i),o.stop(t+i+s)})}playGameOver(){if(!this.ctx)return;const t=[400,320,240],e=.12,n=this.ctx.currentTime;t.forEach((i,s)=>{const o=this.ctx.createOscillator(),a=this.ctx.createGain();o.connect(a),a.connect(this.ctx.destination),o.type="sine",o.frequency.setValueAtTime(i,n+s*e);const l=n+s*e;a.gain.setValueAtTime(.15,l),a.gain.exponentialRampToValueAtTime(.001,l+.1),o.start(l),o.stop(l+.1)})}}const Lg=.12,Dg=40,Ig=16,ha=[220,261.63,293.66,329.63,392,440,523.25,587.33,659.25,783.99,880],Ug=[[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],[1,0,0,0,1,0,0,1,1,0,0,0,1,0,0,0],[1,0,0,1,1,0,1,0,1,0,0,1,1,0,0,0],[1,1,0,0,1,0,1,1,1,0,0,1,1,1,0,1]],Fg=[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0],[0,0,1,0,0,1,0,0,0,0,1,0,0,1,1,0],[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]],Dl=[110,82.41,98,73.42,146.83],Ng=[null,[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,-1,-1,-1,1,-1,-1,-1,0,-1,-1,-1,2,-1,-1,-1],[0,-1,-1,2,1,-1,0,-1,3,-1,-1,1,0,-1,2,-1],[0,-1,2,-1,1,-1,3,-1,0,2,-1,1,4,-1,0,-1]],Il=[[5,7,6,5,4,5,6,5],[5,6,7,9,7,6,5,4],[4,5,7,6,5,7,9,7],[9,7,6,5,4,5,6,7],[5,5,7,9,9,7,5,5]],Ul=[[2,4,3,2],[4,3,2,1],[1,2,4,3],[3,4,2,1]];class Fl{constructor(){this.ctx=null,this._playing=!1,this._step=0,this._bar=0,this._nextStepTime=0,this._timerID=null,this._platforms=0,this._layer=0,this._bpm=112,this._masterGain=null,this._lpFilter=null,this._compressor=null,this._noiseBuffer=null,this._hatBuffer=null,this._phraseIndex=0,this._counterIndex=0}setContext(t){t&&(this.ctx=t,this._compressor=t.createDynamicsCompressor(),this._compressor.threshold.value=-14,this._compressor.knee.value=6,this._compressor.ratio.value=4,this._compressor.attack.value=.003,this._compressor.release.value=.25,this._lpFilter=t.createBiquadFilter(),this._lpFilter.type="lowpass",this._lpFilter.frequency.value=600,this._lpFilter.Q.value=1.2,this._masterGain=t.createGain(),this._masterGain.gain.value=0,this._masterGain.connect(this._lpFilter),this._lpFilter.connect(this._compressor),this._compressor.connect(t.destination),this._noiseBuffer=this._makeNoise(.25),this._hatBuffer=this._makeNoise(.06))}start(){!this.ctx||this._playing||(this._playing=!0,this._step=0,this._bar=0,this._nextStepTime=this.ctx.currentTime+.05,this._masterGain.gain.setTargetAtTime(.35,this.ctx.currentTime,.8),this._schedule())}stop(){this._playing&&(this._playing=!1,clearTimeout(this._timerID),this._masterGain&&this._masterGain.gain.setTargetAtTime(0,this.ctx.currentTime,.25))}onPlatformPassed(t){this._platforms=t;const e=Math.min(4,t<10?0:t<20?1:t<35?2:t<55?3:4);e!==this._layer&&(this._layer=e,this._applyLayerTransition()),this._bpm=Math.min(168,112+t*.9)}_applyLayerTransition(){if(!this.ctx)return;const t=this.ctx.currentTime,e=this._layer,n=[600,1200,2800,6e3,12e3];this._lpFilter.frequency.setTargetAtTime(n[e],t,1.5);const i=[.35,.39,.42,.46,.5];this._masterGain.gain.setTargetAtTime(i[e],t,.6),this._playTransitionSweep(t)}_playTransitionSweep(t){if(!this.ctx)return;const e=this.ctx.createOscillator(),n=this.ctx.createGain(),i=this.ctx.createBiquadFilter();i.type="bandpass",i.frequency.value=400,i.Q.value=2,e.connect(i),i.connect(n),n.connect(this._masterGain),e.type="sawtooth",e.frequency.setValueAtTime(100,t),e.frequency.exponentialRampToValueAtTime(1200,t+.6),i.frequency.setValueAtTime(200,t),i.frequency.exponentialRampToValueAtTime(3e3,t+.6),n.gain.setValueAtTime(.08,t),n.gain.exponentialRampToValueAtTime(.001,t+.6),e.start(t),e.stop(t+.6)}get _stepDuration(){return 60/this._bpm/4}_schedule(){if(!this._playing)return;const t=this.ctx.currentTime+Lg;for(;this._nextStepTime<t;)this._scheduleStep(this._step,this._nextStepTime),this._step++,this._step>=Ig&&(this._step=0,this._bar++,this._bar%2===0&&(this._phraseIndex=(this._phraseIndex+1)%Il.length,this._counterIndex=(this._counterIndex+1)%Ul.length)),this._nextStepTime+=this._stepDuration;this._timerID=setTimeout(()=>this._schedule(),Dg)}_scheduleStep(t,e){var o;const n=this._layer,i=Ug[n][t],s=Fg[n][t];if(i&&this._kick(e),s&&this._hihat(e,n>=4?.07:.11),n>=1&&(t===4||t===12)&&this._snare(e),n>=4&&(t===6||t===10||t===14)&&this._snare(e,.15),n>=1){if(n===1&&t===0)this._bass(e,Dl[0],this._stepDuration*3);else if(n>=2){const a=Ng[n];if(a&&a[t]>=0){const l=Dl[a[t]];this._bass(e,l,this._stepDuration*(n>=4?1.5:2))}}}if(n>=2){const a=Il[this._phraseIndex],l=n>=3?t:t/2;if(n>=3&&t%2===0||n===2&&t%2===0){const c=a[Math.floor(l)%a.length],u=(o=ha[c])!=null?o:440,h=this._stepDuration*(n>=4?1.2:1.8),f=.07+(n-2)*.015;this._melody(e,u,h,f,"triangle")}}if(n>=3&&t%4===2){const a=Ul[this._counterIndex],l=t/4%a.length,c=ha[a[Math.floor(l)]]*2;this._melody(e,c,this._stepDuration*1.5,.04,"sine")}if(n>=4&&t%3===1){const a=[5,7,9,10],l=t%12/3,c=ha[a[Math.floor(l)%a.length]]*2;this._melody(e,c,this._stepDuration*.6,.035,"square")}}_kick(t){const e=this.ctx,n=e.createOscillator(),i=e.createGain();n.connect(i),i.connect(this._masterGain),n.frequency.setValueAtTime(180,t),n.frequency.exponentialRampToValueAtTime(38,t+.18),i.gain.setValueAtTime(1.4,t),i.gain.exponentialRampToValueAtTime(.001,t+.45),n.start(t),n.stop(t+.45);const s=e.createOscillator(),o=e.createGain();s.connect(o),o.connect(this._masterGain),s.frequency.value=55,o.gain.setValueAtTime(.35,t),o.gain.exponentialRampToValueAtTime(.001,t+.12),s.start(t),s.stop(t+.12)}_snare(t,e=.45){const n=this.ctx,i=n.createBufferSource(),s=n.createBiquadFilter(),o=n.createGain();i.buffer=this._noiseBuffer,s.type="bandpass",s.frequency.value=1400,s.Q.value=.7,i.connect(s),s.connect(o),o.connect(this._masterGain),o.gain.setValueAtTime(e,t),o.gain.exponentialRampToValueAtTime(.001,t+.14),i.start(t),i.stop(t+.14);const a=n.createOscillator(),l=n.createGain();a.connect(l),l.connect(this._masterGain),a.frequency.setValueAtTime(200,t),a.frequency.exponentialRampToValueAtTime(140,t+.06),l.gain.setValueAtTime(e*.4,t),l.gain.exponentialRampToValueAtTime(.001,t+.08),a.start(t),a.stop(t+.08)}_hihat(t,e=.11){const n=this.ctx,i=n.createBufferSource(),s=n.createBiquadFilter(),o=n.createGain();i.buffer=this._hatBuffer,s.type="highpass",s.frequency.value=8e3,i.connect(s),s.connect(o),o.connect(this._masterGain),o.gain.setValueAtTime(e,t),o.gain.exponentialRampToValueAtTime(.001,t+.04),i.start(t),i.stop(t+.04)}_bass(t,e,n){const i=this.ctx,s=i.createOscillator(),o=i.createGain(),a=i.createBiquadFilter();s.type="sawtooth",s.frequency.value=e,a.type="lowpass",a.frequency.value=500,a.Q.value=.8,s.connect(a),a.connect(o),o.connect(this._masterGain),o.gain.setValueAtTime(.55,t),o.gain.setValueAtTime(.4,t+n*.6),o.gain.exponentialRampToValueAtTime(.001,t+n),s.start(t),s.stop(t+n)}_melody(t,e,n,i=.08,s="triangle"){const o=this.ctx,a=o.createOscillator(),l=o.createGain();a.type=s,a.frequency.value=e,a.connect(l),l.connect(this._masterGain),l.gain.setValueAtTime(i,t),l.gain.setValueAtTime(i*.6,t+n*.55),l.gain.exponentialRampToValueAtTime(.001,t+n),a.start(t),a.stop(t+n)}playFail(){if(!this.ctx)return;const t=this.ctx,e=t.currentTime;this.stop();const n=t.createGain();n.gain.value=.75,n.connect(t.destination);const i=t.createOscillator(),s=t.createGain();i.type="sine",i.frequency.setValueAtTime(55,e),i.frequency.exponentialRampToValueAtTime(22,e+.18),s.gain.setValueAtTime(.001,e),s.gain.linearRampToValueAtTime(1,e+.006),s.gain.exponentialRampToValueAtTime(.001,e+.18),i.connect(s),s.connect(n),i.start(e),i.stop(e+.2);const o=t.sampleRate*.12,a=t.createBuffer(1,o,t.sampleRate),l=a.getChannelData(0);for(let p=0;p<o;p++)l[p]=Math.random()*2-1;const c=t.createBufferSource();c.buffer=a;const u=t.createBiquadFilter();u.type="lowpass",u.frequency.value=180;const h=t.createGain();h.gain.setValueAtTime(.001,e),h.gain.linearRampToValueAtTime(.55,e+.005),h.gain.exponentialRampToValueAtTime(.001,e+.12),c.connect(u),u.connect(h),h.connect(n),c.start(e),c.stop(e+.13);const f=t.createOscillator(),m=t.createGain();f.type="sine",f.frequency.setValueAtTime(120,e),f.frequency.exponentialRampToValueAtTime(45,e+.14),m.gain.setValueAtTime(.001,e),m.gain.linearRampToValueAtTime(.65,e+.007),m.gain.exponentialRampToValueAtTime(.001,e+.14),f.connect(m),m.connect(n),f.start(e),f.stop(e+.16);const g=t.createOscillator(),_=t.createGain();g.type="sawtooth",g.frequency.setValueAtTime(320,e+.62),g.frequency.exponentialRampToValueAtTime(48,e+.92),_.gain.setValueAtTime(.001,e+.62),_.gain.linearRampToValueAtTime(.45,e+.635),_.gain.exponentialRampToValueAtTime(.001,e+.92),g.connect(_),_.connect(n),g.start(e+.62),g.stop(e+.95)}playVictory(){if(!this.ctx)return;const t=this.ctx,e=t.currentTime;this.stop();const n=t.createGain();n.gain.value=.45,n.connect(t.destination);const i=[261.63,329.63,392,523.25,659.25,783.99,1046.5];i.forEach((s,o)=>{const a=t.createOscillator(),l=t.createGain(),c=o*.075,u=o<i.length-1?.2:.7;a.type="triangle",a.frequency.setValueAtTime(s,e+c),l.gain.setValueAtTime(.001,e+c),l.gain.linearRampToValueAtTime(.32,e+c+.02),l.gain.exponentialRampToValueAtTime(.001,e+c+u),a.connect(l),l.connect(n),a.start(e+c),a.stop(e+c+u+.05)}),[130.81,196,261.63].forEach((s,o)=>{const a=t.createOscillator(),l=t.createGain();a.type="sine",a.frequency.value=s,l.gain.setValueAtTime(.001,e+.1),l.gain.linearRampToValueAtTime(.18-o*.04,e+.2),l.gain.exponentialRampToValueAtTime(.001,e+1.1),a.connect(l),l.connect(n),a.start(e+.1),a.stop(e+1.15)});for(let s=0;s<14;s++){const o=.4+s*.065+Math.random()*.04,a=1400+Math.random()*1600,l=t.createOscillator(),c=t.createGain();l.type="sine",l.frequency.value=a,c.gain.setValueAtTime(.1,e+o),c.gain.exponentialRampToValueAtTime(.001,e+o+.18),l.connect(c),c.connect(n),l.start(e+o),l.stop(e+o+.22)}}_makeNoise(t){if(!this.ctx)return null;const e=this.ctx.sampleRate,n=Math.floor(e*t),i=this.ctx.createBuffer(1,n,e),s=i.getChannelData(0);for(let o=0;o<n;o++)s[o]=Math.random()*2-1;return i}}const Nl=10,Ol=60,Og=6,Bl=39*Math.PI/180,Bg=22*Math.PI/180,Gl=.16,Gg=.8,zl=-36,zg=-76,Vl={demo:{holeMult:1.55,killerMult:.08,gravMult:.65},super_facil:{holeMult:1.1,killerMult:.9,gravMult:.9},facil:{holeMult:1.05,killerMult:.95,gravMult:.95},normal:{holeMult:1,killerMult:1,gravMult:1},dificil:{holeMult:.95,killerMult:1.05,gravMult:1.05},super_dificil:{holeMult:.9,killerMult:1.1,gravMult:1.1},impossivel:{holeMult:.8,killerMult:1.2,gravMult:1.2},muito_facil:{holeMult:1.1,killerMult:.9,gravMult:.9},muito_dificil:{holeMult:.9,killerMult:1.1,gravMult:1.1},influencer_super_facil:{holeMult:1.3,killerMult:.045,gravMult:.72,_influencer:!0},influencer_facil:{holeMult:1.25,killerMult:.068,gravMult:.77,_influencer:!0},influencer_normal:{holeMult:1.2,killerMult:.09,gravMult:.82,_influencer:!0},influencer_dificil:{holeMult:1.15,killerMult:.135,gravMult:.87,_influencer:!0},influencer_super_dificil:{holeMult:1.1,killerMult:.18,gravMult:.92,_influencer:!0}};function Hl(r){return{r:(r>>16&255)/255,g:(r>>8&255)/255,b:(r&255)/255}}function Vg(r,t,e){return Math.round(r*255)<<16|Math.round(t*255)<<8|Math.round(e*255)}function lr(r,t,e){const n=Hl(r),i=Hl(t);return Vg(hi(n.r,i.r,e),hi(n.g,i.g,e),hi(n.b,i.b,e))}function kl(r,t,e){const n=parseInt(r.replace("#",""),16),i=parseInt(t.replace("#",""),16),s=lr(n,i,e);return"#"+Math.max(0,Math.min(16777215,s)).toString(16).padStart(6,"0")}class Hg{constructor(t){this.scene=t,this.platformsBroken=0,this.paletteIndex=0,this.transitionFrame=0,this.transitionFromPalette=null}onPlatformBroken(){this.platformsBroken++;const t=Math.floor(this.platformsBroken/Nl),e=Math.min(t,Fi.length-1);e>this.paletteIndex&&(this.transitionFromPalette=bs({},Fi[this.paletteIndex]),this.paletteIndex=e,this.transitionFrame=0)}update(){this.transitionFromPalette!==null&&(this.transitionFrame++,this.transitionFrame>=Ol&&(this.transitionFromPalette=null))}getCurrentPalette(){if(this.transitionFromPalette===null)return Fi[this.paletteIndex];const t=ti(this.transitionFrame/Ol,0,1),e=this.transitionFromPalette,n=Fi[this.paletteIndex];return{name:n.name,platforms:lr(e.platforms,n.platforms,t),platformsAlt:lr(e.platformsAlt||e.platforms,n.platformsAlt||n.platforms,t),ball:lr(e.ball,n.ball,t),bg:lr(e.bg,n.bg,t),killer:n.killer,bgTop:e.bgTop&&n.bgTop?kl(e.bgTop,n.bgTop,t):n.bgTop,bgBottom:e.bgBottom&&n.bgBottom?kl(e.bgBottom,n.bgBottom,t):n.bgBottom}}getDifficulty(){const t=Math.floor(this.platformsBroken/Nl),e=ti(t/Og,0,1),n=hi(Bl,Bg,e),i=hi(Gl,Gg,e),s=hi(zl,zg,e),o=(typeof window._getGE=="function"?window._getGE():null)||window.gameEvents,a=(o==null?void 0:o.dificuldade)||"normal",l=Vl[a]||Vl.normal;if(l._influencer){const p=ti(Bl*l.holeMult,5*Math.PI/180,90*Math.PI/180),d=zl*l.gravMult,M=ti(Math.max(Gl*l.killerMult,.07),0,1);return{holeSize:p,killerChance:M,gravity:d}}const c=!!(o!=null&&o.is_influencer),u=c?l.holeMult+.1:l.holeMult,h=c?Math.max(l.gravMult-.08,.55):l.gravMult,f=c?l.killerMult*.1:l.killerMult,m=ti(n*u,5*Math.PI/180,90*Math.PI/180),g=s*h,_=ti(c?Math.max(i*f,.1):i*f,0,1);return{holeSize:m,killerChance:_,gravity:g}}reset(){this.platformsBroken=0,this.paletteIndex=0,this.transitionFrame=0,this.transitionFromPalette=null}}const kg=-20,Wl=.033,Xl=100,un=2,Wg=3,Xg=.5,qg=.5,Yg=3;function Jr(r,t=!1){const e=document.getElementById("game-container");!e||!(r!=null&&r.bgTop)||!(r!=null&&r.bgBottom)||(e.style.transition=t?"background 1s ease":"none",e.style.background=`linear-gradient(to bottom, ${r.bgTop}, ${r.bgBottom})`)}class Kg{constructor(){this.state="idle",this.score=0,this.comboCount=0,this.currentPlatform=null,this._prevBallY=un;const t=document.getElementById("game-container"),e=document.getElementById("canvas");if(!t||!e)return;const n=window.innerWidth,i=window.innerHeight;this.scene=new Dm,this.scene.fog=new Fa(13691135,25,80),this.camera=new nn(65,n/i,.1,1e3),this.camera.position.set(0,8,18),this.renderer=new dc({canvas:e,antialias:!0,alpha:!0}),this.renderer.setClearColor(0,0),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setSize(n,i),this.scene.add(new Nm(16777215,.9));const s=new Fm(16777215,.5);s.position.set(5,15,8),this.scene.add(s),this.levelManager=new Hg(this.scene),this.helix=new fg(this.scene,this.levelManager),this.ball=new xg(this.scene,this.levelManager.getCurrentPalette()),this.cameraCtrl=new wg(this.camera,this.ball.mesh),this.input=new Rg(t,this.helix.group.rotation),this.ui=new Cg(this),this.audio=new Pg,this.music=new Fl,this.audio.init(),window._gameMusic=this.music,this.helix.init(),this.ball.reset(un,this.levelManager.getCurrentPalette()),this.cameraCtrl.jumpTo(un),Jr(Fi[0],!1),this.lastInteractionTime=0,this._setupResize(),this._setupStartScreen(),this._createClouds()}_createClouds(){const t=[[9,5,-3,1.4,.75],[-10,3,-2,1.1,.7],[8,-3,3,1,.68],[-11,-8,-3,1.3,.72],[9,-14,2,.9,.65],[-10,-20,-2,1.2,.7],[11,-27,3,1,.68],[-9,-34,-1,1.35,.73],[10,-42,2,1.1,.67],[-11,-50,-3,.95,.65],[8,-58,1,1.2,.7],[-10,-66,-2,1,.68],[11,-75,3,1.3,.72],[-9,-84,-1,.9,.65]],e=[[0,0,0,1],[1.3,.1,.1,.85],[-1.2,.15,0,.8],[.55,.7,0,.72],[-.5,.65,.1,.68],[2.3,0,0,.65],[-2.1,.05,0,.62],[1.1,1.1,0,.58],[-.9,1.05,.1,.55],[.1,1.3,0,.52]];this._clouds=t.map(([n,i,s,o,a])=>{const l=new pr({color:16777215,transparent:!0,opacity:a,roughness:1,metalness:0,depthWrite:!1}),c=new Nn;return c.position.set(n,i,s),e.forEach(([u,h,f,m])=>{const g=new Se(new ai(m*o,16,12),l.clone());g.position.set(u*o,h*o,f*o),c.add(g)}),this.scene.add(c),{group:c,baseY:i,x:n,drift:Math.random()*Math.PI*2}})}_updateClouds(t){if(!this._clouds)return;const e=performance.now()*25e-5;this._clouds.forEach(n=>{const i=t+n.baseY+6;n.group.position.y+=(i-n.group.position.y)*.0015,n.group.position.x=n.x+Math.sin(e+n.drift)*.6})}_setupStartScreen(){const t=document.getElementById("start-screen");if(!t){this.start();return}const e=()=>{t.classList.add("hidden"),t.removeEventListener("click",e),t.removeEventListener("touchstart",e),this.start()};t.addEventListener("click",e),t.addEventListener("touchstart",e,{passive:!0})}_setupResize(){window.addEventListener("resize",()=>{const t=window.innerWidth,e=window.innerHeight;this.camera.aspect=t/e,this.camera.updateProjectionMatrix(),this.renderer.setSize(t,e)})}start(){var e;this.state="playing",this.score=0,this.comboCount=0,this.lastInteractionTime=performance.now()/1e3,this.levelManager.reset(),this.helix.init();const t=this.levelManager.getCurrentPalette();this.ball.reset(un,t),this._prevBallY=un,this.currentPlatform=this.helix.getNextPlatformBelow(un),console.log("[Game] start — ball y:",this.ball.y,"| currentPlatform y:",(e=this.currentPlatform)==null?void 0:e.posicaoY),this.cameraCtrl.jumpTo(un),this.input.enable(),this.ui.updateScore(0),this.ui.hideCombo(),this.ui.hideGameOver(),Jr(t,!1),setTimeout(()=>{this.audio.ctx&&!this.music._playing&&(this.music.setContext(this.audio.ctx),this.music.start())},80)}restart(){this.state="playing",this.score=0,this.comboCount=0,this.lastInteractionTime=performance.now()/1e3,this.levelManager.reset(),this.helix.init();const t=this.levelManager.getCurrentPalette();this.ball.reset(un,t),this._prevBallY=un,this.currentPlatform=this.helix.getNextPlatformBelow(un),this.cameraCtrl.jumpTo(un),this.input.enable(),this.ui.updateScore(0),this.ui.hideCombo(),this.ui.hideGameOver(),this.ui.hideIdleHint(),Jr(t,!1),this.music.stop(),setTimeout(()=>{this.audio.ctx&&(this.music=new Fl,this.music.setContext(this.audio.ctx),this.music.start())},80)}_onGameOver(){this.state="gameover",this.audio.playGameOver(),this.music.playFail(),this.input.disable();const t=window._getGE?window._getGE():window.gameEvents;if(t&&t.onMorreu){t.partidaAtiva&&(t.partidaAtiva=!1,t.onMorreu());return}this.ui.showGameOver(this.score)}_onHolePassed(){var i;this.levelManager.onPlatformBroken(),this.audio.playBreak(),this.audio.playCoin(),Jr(this.levelManager.getCurrentPalette(),!0);const t=this._getBallScreenY(),e=window._getGE?window._getGE():window.gameEvents;if(!!(e&&e.partidaAtiva)){e._plataformasPassadas=(e._plataformasPassadas||0)+1;const s=e._plataformasPassadas;this.ui.showMoneyPopup(t,(i=e.valorPorPlataforma)!=null?i:null),this.ui.updateScore(0),this.music.onPlatformPassed(s),typeof e.onPlataformaPassada=="function"&&e.onPlataformaPassada(s),s>=e.metaPlataformas&&(e.partidaAtiva=!1,typeof e.onMetaAtingida=="function"&&e.onMetaAtingida())}else{this.comboCount++;const s=Xl*this.comboCount;this.score+=s,this.ui.updateScore(this.score),this.ui.showCombo(this.comboCount),this.ui.showPointsPopup(s,t),this.ui.showMoneyPopup(t,null),this.comboCount>1&&this.audio.playCombo(this.comboCount),this.music.onPlatformPassed(this.score/Xl)}}_getBallScreenY(){var e;return!((e=this.ball)!=null&&e.mesh)||!this.camera?window.innerHeight*.3:(1-this.ball.mesh.position.clone().project(this.camera).y)/2*window.innerHeight}_checkPlatformCollision(){if((!this.currentPlatform||this.currentPlatform.isBroken||this.currentPlatform.passed)&&(this.currentPlatform=this.helix.getNextPlatformBelow(this.ball.y),!this.currentPlatform)||this.ball.velocityY>=0)return;const t=this.ball.y,e=this.currentPlatform.posicaoY,n=e+Xg,i=e-qg,s=e-Yg;if(t<s){this.currentPlatform=this.helix.getNextPlatformBelow(t);return}this._prevBallY>n&&t<i&&(this.ball.y=n-.01);const o=this.ball.y;if(o>n||o<i)return;const l=(-this.helix.group.rotation.y%(Math.PI*2)+Math.PI*2)%(Math.PI*2),c=this.currentPlatform.spiralAngle||0,u=((l-c)%(Math.PI*2)+Math.PI*2)%(Math.PI*2),h=this.currentPlatform.getSegmentAtAngle(u);h===null?(this.currentPlatform.passed=!0,this.currentPlatform.break(),this._onHolePassed(),this.currentPlatform=this.helix.getNextPlatformBelow(o-.1)):h.isKiller?this._onGameOver():(this.ball.y=n-.02,this.ball.bounce(),this.comboCount>0&&(this.comboCount=0,this.ui.hideCombo()))}update(t){var s,o;if(!this.renderer)return;t>Wl&&(t=Wl);const e=performance.now();if(this.state==="idle"){this.camera.position.set(0,4,10),this.camera.lookAt(0,-6,0),this.renderer.render(this.scene,this.camera);return}if(this.cameraCtrl.update(e),this.state==="gameover"){this.renderer.render(this.scene,this.camera);return}if(!((s=this.ball)!=null&&s.mesh))return;this._prevBallY=this.ball.y;const n=this.levelManager.getCurrentPalette(),i=(o=this.levelManager.getDifficulty().gravity)!=null?o:kg;this.ball.update(t,i),this.ball.updatePalette(n),this.helix.updatePoleColor(n),this._checkPlatformCollision(),this._updateClouds(this.ball.y),this.helix.update(this.ball.y,this.camera.position.y),this.levelManager.update(),this._checkIdleHint(),this.renderer.render(this.scene,this.camera)}_checkIdleHint(){if(this.state!=="playing")return;performance.now()/1e3-this.lastInteractionTime>Wg&&this.ui.showIdleHint()}}window._getGE=function(){try{if(window.parent!==window&&window.parent.gameEvents)return window.parent.gameEvents}catch(r){}return window.gameEvents||null};window.gameEvents=window.gameEvents||{onPlataformaPassada:null,onMorreu:null,onMetaAtingida:null,metaPlataformas:14,partidaAtiva:!1,_plataformasPassadas:0};(function(){let t=!1;const e=setInterval(()=>{const n=window._getGE();if(n&&n.onMorreu&&!t){t=!0,clearInterval(e),["combo","points-popup"].forEach(s=>{const o=document.getElementById(s);o&&(o.style.display="none")});const i=document.getElementById("score");i&&(i.style.color="#00C97A",i.style.fontSize="44px",i.textContent="R$ 0,00")}},100);setTimeout(()=>clearInterval(e),3e4)})();const ql=.05;function Yl(){const r=document.getElementById("game-container"),t=document.getElementById("canvas");if(!r||!t)return;const e=new Kg;let n=performance.now();function i(){requestAnimationFrame(i);const s=performance.now();let o=(s-n)/1e3;n=s,o>ql&&(o=ql),e.update(o)}i()}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Yl):Yl();
