"use strict";var sjcl={cipher:{},hash:{},keyexchange:{},mode:{},misc:{},codec:{},exception:{corrupt:function(a){this.toString=function(){return"CORRUPT: "+this.message};this.message=a},invalid:function(a){this.toString=function(){return"INVALID: "+this.message};this.message=a},bug:function(a){this.toString=function(){return"BUG: "+this.message};this.message=a},notReady:function(a){this.toString=function(){return"NOT READY: "+this.message};this.message=a}}};
if(typeof module!="undefined"&&module.exports)module.exports=sjcl;
sjcl.cipher.aes=function(a){this.i[0][0][0]||this.z();var b,c,d,e,g=this.i[0][4],f=this.i[1];b=a.length;var h=1;if(b!==4&&b!==6&&b!==8)throw new sjcl.exception.invalid("invalid aes key size");this.a=[d=a.slice(0),e=[]];for(a=b;a<4*b+28;a++){c=d[a-1];if(a%b===0||b===8&&a%b===4){c=g[c>>>24]<<24^g[c>>16&255]<<16^g[c>>8&255]<<8^g[c&255];if(a%b===0){c=c<<8^c>>>24^h<<24;h=h<<1^(h>>7)*283}}d[a]=d[a-b]^c}for(b=0;a;b++,a--){c=d[b&3?a:a-4];e[b]=a<=4||b<4?c:f[0][g[c>>>24]]^f[1][g[c>>16&255]]^f[2][g[c>>8&255]]^
f[3][g[c&255]]}};
sjcl.cipher.aes.prototype={encrypt:function(a){return this.F(a,0)},decrypt:function(a){return this.F(a,1)},i:[[[],[],[],[],[]],[[],[],[],[],[]]],z:function(){var a=this.i[0],b=this.i[1],c=a[4],d=b[4],e,g,f,h=[],i=[],l,j,k,m;for(e=0;e<0x100;e++)i[(h[e]=e<<1^(e>>7)*283)^e]=e;for(g=f=0;!c[g];g^=l||1,f=i[f]||1){k=f^f<<1^f<<2^f<<3^f<<4;k=k>>8^k&255^99;c[g]=k;d[k]=g;j=h[e=h[l=h[g]]];m=j*0x1010101^e*0x10001^l*0x101^g*0x1010100;j=h[k]*0x101^k*0x1010100;for(e=0;e<4;e++){a[e][g]=j=j<<24^j>>>8;b[e][k]=m=m<<24^m>>>8}}for(e=
0;e<5;e++){a[e]=a[e].slice(0);b[e]=b[e].slice(0)}},F:function(a,b){if(a.length!==4)throw new sjcl.exception.invalid("invalid aes block size");var c=this.a[b],d=a[0]^c[0],e=a[b?3:1]^c[1],g=a[2]^c[2];a=a[b?1:3]^c[3];var f,h,i,l=c.length/4-2,j,k=4,m=[0,0,0,0];f=this.i[b];var n=f[0],o=f[1],p=f[2],q=f[3],r=f[4];for(j=0;j<l;j++){f=n[d>>>24]^o[e>>16&255]^p[g>>8&255]^q[a&255]^c[k];h=n[e>>>24]^o[g>>16&255]^p[a>>8&255]^q[d&255]^c[k+1];i=n[g>>>24]^o[a>>16&255]^p[d>>8&255]^q[e&255]^c[k+2];a=n[a>>>24]^o[d>>16&
255]^p[e>>8&255]^q[g&255]^c[k+3];k+=4;d=f;e=h;g=i}for(j=0;j<4;j++){m[b?3&-j:j]=r[d>>>24]<<24^r[e>>16&255]<<16^r[g>>8&255]<<8^r[a&255]^c[k++];f=d;d=e;e=g;g=a;a=f}return m}};
sjcl.bitArray={bitSlice:function(a,b,c){a=sjcl.bitArray.K(a.slice(b/32),32-(b&31)).slice(1);return c===undefined?a:sjcl.bitArray.clamp(a,c-b)},extract:function(a,b,c){var d=Math.floor(-b-c&31);return((b+c-1^b)&-32?a[b/32|0]<<32-d^a[b/32+1|0]>>>d:a[b/32|0]>>>d)&(1<<c)-1},concat:function(a,b){if(a.length===0||b.length===0)return a.concat(b);var c=a[a.length-1],d=sjcl.bitArray.getPartial(c);return d===32?a.concat(b):sjcl.bitArray.K(b,d,c|0,a.slice(0,a.length-1))},bitLength:function(a){var b=a.length;
if(b===0)return 0;return(b-1)*32+sjcl.bitArray.getPartial(a[b-1])},clamp:function(a,b){if(a.length*32<b)return a;a=a.slice(0,Math.ceil(b/32));var c=a.length;b&=31;if(c>0&&b)a[c-1]=sjcl.bitArray.partial(b,a[c-1]&2147483648>>b-1,1);return a},partial:function(a,b,c){if(a===32)return b;return(c?b|0:b<<32-a)+a*0x10000000000},getPartial:function(a){return Math.round(a/0x10000000000)||32},equal:function(a,b){if(sjcl.bitArray.bitLength(a)!==sjcl.bitArray.bitLength(b))return false;var c=0,d;for(d=0;d<a.length;d++)c|=
a[d]^b[d];return c===0},K:function(a,b,c,d){var e;e=0;if(d===undefined)d=[];for(;b>=32;b-=32){d.push(c);c=0}if(b===0)return d.concat(a);for(e=0;e<a.length;e++){d.push(c|a[e]>>>b);c=a[e]<<32-b}e=a.length?a[a.length-1]:0;a=sjcl.bitArray.getPartial(e);d.push(sjcl.bitArray.partial(b+a&31,b+a>32?c:d.pop(),1));return d},Q:function(a,b){return[a[0]^b[0],a[1]^b[1],a[2]^b[2],a[3]^b[3]]}};
sjcl.codec.utf8String={fromBits:function(a){var b="",c=sjcl.bitArray.bitLength(a),d,e;for(d=0;d<c/8;d++){if((d&3)===0)e=a[d/4];b+=String.fromCharCode(e>>>24);e<<=8}return decodeURIComponent(escape(b))},toBits:function(a){a=unescape(encodeURIComponent(a));var b=[],c,d=0;for(c=0;c<a.length;c++){d=d<<8|a.charCodeAt(c);if((c&3)===3){b.push(d);d=0}}c&3&&b.push(sjcl.bitArray.partial(8*(c&3),d));return b}};
sjcl.codec.base64={C:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",fromBits:function(a,b,c){var d="",e=0,g=sjcl.codec.base64.C,f=0,h=sjcl.bitArray.bitLength(a);if(c)g=g.substr(0,62)+"-_";for(c=0;d.length*6<h;){d+=g.charAt((f^a[c]>>>e)>>>26);if(e<6){f=a[c]<<6-e;e+=26;c++}else{f<<=6;e-=6}}for(;d.length&3&&!b;)d+="=";return d},toBits:function(a,b){a=a.replace(/\s|=/g,"");var c=[],d=0,e=sjcl.codec.base64.C,g=0,f;if(b)e=e.substr(0,62)+"-_";for(b=0;b<a.length;b++){f=e.indexOf(a.charAt(b));
if(f<0)throw new sjcl.exception.invalid("this isn't base64!");if(d>26){d-=26;c.push(g^f>>>d);g=f<<32-d}else{d+=6;g^=f<<32-d}}d&56&&c.push(sjcl.bitArray.partial(d&56,g,1));return c}};sjcl.codec.base64url={fromBits:function(a){return sjcl.codec.base64.fromBits(a,1,1)},toBits:function(a){return sjcl.codec.base64.toBits(a,1)}};sjcl.hash.sha256=function(a){this.a[0]||this.z();if(a){this.d=a.d.slice(0);this.c=a.c.slice(0);this.b=a.b}else this.reset()};sjcl.hash.sha256.hash=function(a){return(new sjcl.hash.sha256).update(a).finalize()};
sjcl.hash.sha256.prototype={blockSize:512,reset:function(){this.d=this.n.slice(0);this.c=[];this.b=0;return this},update:function(a){if(typeof a==="string")a=sjcl.codec.utf8String.toBits(a);var b,c=this.c=sjcl.bitArray.concat(this.c,a);b=this.b;a=this.b=b+sjcl.bitArray.bitLength(a);for(b=512+b&-512;b<=a;b+=512)this.j(c.splice(0,16));return this},finalize:function(){var a,b=this.c,c=this.d;b=sjcl.bitArray.concat(b,[sjcl.bitArray.partial(1,1)]);for(a=b.length+2;a&15;a++)b.push(0);b.push(Math.floor(this.b/
4294967296));for(b.push(this.b|0);b.length;)this.j(b.splice(0,16));this.reset();return c},n:[],a:[],z:function(){function a(e){return(e-Math.floor(e))*0x100000000|0}var b=0,c=2,d;a:for(;b<64;c++){for(d=2;d*d<=c;d++)if(c%d===0)continue a;if(b<8)this.n[b]=a(Math.pow(c,0.5));this.a[b]=a(Math.pow(c,1/3));b++}},j:function(a){var b,c,d=a.slice(0),e=this.d,g=this.a,f=e[0],h=e[1],i=e[2],l=e[3],j=e[4],k=e[5],m=e[6],n=e[7];for(a=0;a<64;a++){if(a<16)b=d[a];else{b=d[a+1&15];c=d[a+14&15];b=d[a&15]=(b>>>7^b>>>18^
b>>>3^b<<25^b<<14)+(c>>>17^c>>>19^c>>>10^c<<15^c<<13)+d[a&15]+d[a+9&15]|0}b=b+n+(j>>>6^j>>>11^j>>>25^j<<26^j<<21^j<<7)+(m^j&(k^m))+g[a];n=m;m=k;k=j;j=l+b|0;l=i;i=h;h=f;f=b+(h&i^l&(h^i))+(h>>>2^h>>>13^h>>>22^h<<30^h<<19^h<<10)|0}e[0]=e[0]+f|0;e[1]=e[1]+h|0;e[2]=e[2]+i|0;e[3]=e[3]+l|0;e[4]=e[4]+j|0;e[5]=e[5]+k|0;e[6]=e[6]+m|0;e[7]=e[7]+n|0}};sjcl.hash.sha1=function(a){if(a){this.d=a.d.slice(0);this.c=a.c.slice(0);this.b=a.b}else this.reset()};sjcl.hash.sha1.hash=function(a){return(new sjcl.hash.sha1).update(a).finalize()};
sjcl.hash.sha1.prototype={blockSize:512,reset:function(){this.d=this.n.slice(0);this.c=[];this.b=0;return this},update:function(a){if(typeof a==="string")a=sjcl.codec.utf8String.toBits(a);var b,c=this.c=sjcl.bitArray.concat(this.c,a);b=this.b;a=this.b=b+sjcl.bitArray.bitLength(a);for(b=this.blockSize+b&-this.blockSize;b<=a;b+=this.blockSize)this.j(c.splice(0,16));return this},finalize:function(){var a,b=this.c,c=this.d;b=sjcl.bitArray.concat(b,[sjcl.bitArray.partial(1,1)]);for(a=b.length+2;a&15;a++)b.push(0);
b.push(Math.floor(this.b/0x100000000));for(b.push(this.b|0);b.length;)this.j(b.splice(0,16));this.reset();return c},n:[1732584193,4023233417,2562383102,271733878,3285377520],a:[1518500249,1859775393,2400959708,3395469782],N:function(a,b,c,d){if(a<=19)return b&c|~b&d;else if(a<=39)return b^c^d;else if(a<=59)return b&c|b&d|c&d;else if(a<=79)return b^c^d},r:function(a,b){return b<<a|b>>>32-a},j:function(a){var b,c,d,e,g,f,h=a.slice(0),i=this.d;c=i[0];d=i[1];e=i[2];g=i[3];f=i[4];for(a=0;a<=79;a++){if(a>=
16)h[a]=this.r(1,h[a-3]^h[a-8]^h[a-14]^h[a-16]);b=this.r(5,c)+this.N(a,d,e,g)+f+h[a]+this.a[Math.floor(a/20)]|0;f=g;g=e;e=this.r(30,d);d=c;c=b}i[0]=i[0]+c|0;i[1]=i[1]+d|0;i[2]=i[2]+e|0;i[3]=i[3]+g|0;i[4]=i[4]+f|0}};sjcl.misc.hmac=function(a,b){this.I=b=b||sjcl.hash.sha256;var c=[[],[]],d=b.prototype.blockSize/32;this.l=[new b,new b];if(a.length>d)a=b.hash(a);for(b=0;b<d;b++){c[0][b]=a[b]^909522486;c[1][b]=a[b]^1549556828}this.l[0].update(c[0]);this.l[1].update(c[1])};
sjcl.misc.hmac.prototype.encrypt=sjcl.misc.hmac.prototype.mac=function(a){a=(new this.I(this.l[0])).update(a).finalize();return(new this.I(this.l[1])).update(a).finalize()};
sjcl.misc.pbkdf2=function(a,b,c,d,e){c=c||1E3;if(d<0||c<0)throw sjcl.exception.invalid("invalid params to pbkdf2");if(typeof a==="string")a=sjcl.codec.utf8String.toBits(a);e=e||sjcl.misc.hmac;a=new e(a);var g,f,h,i,l=[],j=sjcl.bitArray;for(i=1;32*l.length<(d||1);i++){e=g=a.encrypt(j.concat(b,[i]));for(f=1;f<c;f++){g=a.encrypt(g);for(h=0;h<g.length;h++)e[h]^=g[h]}l=l.concat(e)}if(d)l=j.clamp(l,d);return l};
sjcl.random={randomWords:function(a,b){var c=[];b=this.isReady(b);var d;if(b===0)throw new sjcl.exception.notReady("generator isn't seeded");else b&2&&this.P(!(b&1));for(b=0;b<a;b+=4){(b+1)%0x10000===0&&this.H();d=this.w();c.push(d[0],d[1],d[2],d[3])}this.H();return c.slice(0,a)},setDefaultParanoia:function(a){this.u=a},addEntropy:function(a,b,c){c=c||"user";var d,e,g=(new Date).valueOf(),f=this.q[c],h=this.isReady(),i=0;d=this.D[c];if(d===undefined)d=this.D[c]=this.M++;if(f===undefined)f=this.q[c]=
0;this.q[c]=(this.q[c]+1)%this.e.length;switch(typeof a){case "number":if(b===undefined)b=1;this.e[f].update([d,this.v++,1,b,g,1,a|0]);break;case "object":c=Object.prototype.toString.call(a);if(c==="[object Uint32Array]"){e=[];for(c=0;c<a.length;c++)e.push(a[c]);a=e}else{if(c!=="[object Array]")i=1;for(c=0;c<a.length&&!i;c++)if(typeof a[c]!="number")i=1}if(!i){if(b===undefined)for(c=b=0;c<a.length;c++)for(e=a[c];e>0;){b++;e>>>=1}this.e[f].update([d,this.v++,2,b,g,a.length].concat(a))}break;case "string":if(b===
undefined)b=a.length;this.e[f].update([d,this.v++,3,b,g,a.length]);this.e[f].update(a);break;default:i=1}if(i)throw new sjcl.exception.bug("random: addEntropy only supports number, array of numbers or string");this.k[f]+=b;this.g+=b;if(h===0){this.isReady()!==0&&this.G("seeded",Math.max(this.h,this.g));this.G("progress",this.getProgress())}},isReady:function(a){a=this.B[a!==undefined?a:this.u];return this.h&&this.h>=a?this.k[0]>80&&(new Date).valueOf()>this.J?3:1:this.g>=a?2:0},getProgress:function(a){a=
this.B[a?a:this.u];return this.h>=a?1:this.g>a?1:this.g/a},startCollectors:function(){if(!this.m){if(window.addEventListener){window.addEventListener("load",this.o,false);window.addEventListener("mousemove",this.p,false)}else if(document.attachEvent){document.attachEvent("onload",this.o);document.attachEvent("onmousemove",this.p)}else throw new sjcl.exception.bug("can't attach event");this.m=true}},stopCollectors:function(){if(this.m){if(window.removeEventListener){window.removeEventListener("load",
this.o,false);window.removeEventListener("mousemove",this.p,false)}else if(window.detachEvent){window.detachEvent("onload",this.o);window.detachEvent("onmousemove",this.p)}this.m=false}},addEventListener:function(a,b){this.s[a][this.L++]=b},removeEventListener:function(a,b){var c;a=this.s[a];var d=[];for(c in a)a.hasOwnProperty(c)&&a[c]===b&&d.push(c);for(b=0;b<d.length;b++){c=d[b];delete a[c]}},e:[new sjcl.hash.sha256],k:[0],A:0,q:{},v:0,D:{},M:0,h:0,g:0,J:0,a:[0,0,0,0,0,0,0,0],f:[0,0,0,0],t:undefined,
u:6,m:false,s:{progress:{},seeded:{}},L:0,B:[0,48,64,96,128,192,0x100,384,512,768,1024],w:function(){for(var a=0;a<4;a++){this.f[a]=this.f[a]+1|0;if(this.f[a])break}return this.t.encrypt(this.f)},H:function(){this.a=this.w().concat(this.w());this.t=new sjcl.cipher.aes(this.a)},O:function(a){this.a=sjcl.hash.sha256.hash(this.a.concat(a));this.t=new sjcl.cipher.aes(this.a);for(a=0;a<4;a++){this.f[a]=this.f[a]+1|0;if(this.f[a])break}},P:function(a){var b=[],c=0,d;this.J=b[0]=(new Date).valueOf()+3E4;for(d=
0;d<16;d++)b.push(Math.random()*0x100000000|0);for(d=0;d<this.e.length;d++){b=b.concat(this.e[d].finalize());c+=this.k[d];this.k[d]=0;if(!a&&this.A&1<<d)break}if(this.A>=1<<this.e.length){this.e.push(new sjcl.hash.sha256);this.k.push(0)}this.g-=c;if(c>this.h)this.h=c;this.A++;this.O(b)},p:function(a){sjcl.random.addEntropy([a.x||a.clientX||a.offsetX||0,a.y||a.clientY||a.offsetY||0],2,"mouse")},o:function(){sjcl.random.addEntropy((new Date).valueOf(),2,"loadtime")},G:function(a,b){var c;a=sjcl.random.s[a];
var d=[];for(c in a)a.hasOwnProperty(c)&&d.push(a[c]);for(c=0;c<d.length;c++)d[c](b)}};try{var s=new Uint32Array(32);crypto.getRandomValues(s);sjcl.random.addEntropy(s,1024,"crypto['getRandomValues']")}catch(t){};
