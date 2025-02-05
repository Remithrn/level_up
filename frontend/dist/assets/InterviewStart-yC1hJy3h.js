import{r as M,az as Pe,aA as Ne,G as We,j as b,c as ue,u as Ce,a as je,b as pe,aB as Ie,i as Le,aQ as He,e as Be,aS as Fe,C as Ve}from"./index-DdC0FHAS.js";var Ue=function(){return(Ue=Object.assign||function(d){for(var s,a=1,i=arguments.length;a<i;a++)for(var e in s=arguments[a])Object.prototype.hasOwnProperty.call(s,e)&&(d[e]=s[e]);return d}).apply(this,arguments)};function xe(d,s,a,i){return new(a||(a=Promise))(function(e,o){function r(C){try{x(i.next(C))}catch(f){o(f)}}function l(C){try{x(i.throw(C))}catch(f){o(f)}}function x(C){var f;C.done?e(C.value):(f=C.value,f instanceof a?f:new a(function(S){S(f)})).then(r,l)}x((i=i.apply(d,[])).next())})}function ke(d,s){var a,i,e,o,r={label:0,sent:function(){if(1&e[0])throw e[1];return e[1]},trys:[],ops:[]};return o={next:l(0),throw:l(1),return:l(2)},typeof Symbol=="function"&&(o[Symbol.iterator]=function(){return this}),o;function l(x){return function(C){return function(f){if(a)throw new TypeError("Generator is already executing.");for(;r;)try{if(a=1,i&&(e=2&f[0]?i.return:f[0]?i.throw||((e=i.return)&&e.call(i),0):i.next)&&!(e=e.call(i,f[1])).done)return e;switch(i=0,e&&(f=[2&f[0],e.value]),f[0]){case 0:case 1:e=f;break;case 4:return r.label++,{value:f[1],done:!1};case 5:r.label++,i=f[1],f=[0];continue;case 7:f=r.ops.pop(),r.trys.pop();continue;default:if(e=r.trys,!((e=e.length>0&&e[e.length-1])||f[0]!==6&&f[0]!==2)){r=0;continue}if(f[0]===3&&(!e||f[1]>e[0]&&f[1]<e[3])){r.label=f[1];break}if(f[0]===6&&r.label<e[1]){r.label=e[1],e=f;break}if(e&&r.label<e[2]){r.label=e[2],r.ops.push(f);break}e[2]&&r.ops.pop(),r.trys.pop();continue}f=s.call(d,r)}catch(S){f=[6,S],i=0}finally{a=e=0}if(5&f[0])throw f[1];return{value:f[0]?f[1]:void 0,done:!0}}([x,C])}}}function ee(){for(var d=0,s=0,a=arguments.length;s<a;s++)d+=arguments[s].length;var i=Array(d),e=0;for(s=0;s<a;s++)for(var o=arguments[s],r=0,l=o.length;r<l;r++,e++)i[e]=o[r];return i}var be,qe=he;function he(){}he.mixin=function(d){var s=d.prototype||d;s.isWildEmitter=!0,s.on=function(a,i,e){this.callbacks=this.callbacks||{};var o=arguments.length===3,r=o?arguments[1]:void 0,l=o?arguments[2]:arguments[1];return l._groupName=r,(this.callbacks[a]=this.callbacks[a]||[]).push(l),this},s.once=function(a,i,e){var o=this,r=arguments.length===3,l=r?arguments[1]:void 0,x=r?arguments[2]:arguments[1];function C(){o.off(a,C),x.apply(this,arguments)}return this.on(a,l,C),this},s.releaseGroup=function(a){var i,e,o,r;for(i in this.callbacks=this.callbacks||{},this.callbacks)for(e=0,o=(r=this.callbacks[i]).length;e<o;e++)r[e]._groupName===a&&(r.splice(e,1),e--,o--);return this},s.off=function(a,i){this.callbacks=this.callbacks||{};var e,o=this.callbacks[a];return o?arguments.length===1?(delete this.callbacks[a],this):((e=o.indexOf(i))!==-1&&(o.splice(e,1),o.length===0&&delete this.callbacks[a]),this):this},s.emit=function(a){this.callbacks=this.callbacks||{};var i,e,o,r=[].slice.call(arguments,1),l=this.callbacks[a],x=this.getWildcardCallbacks(a);if(l)for(i=0,e=(o=l.slice()).length;i<e&&o[i];++i)o[i].apply(this,r);if(x)for(e=x.length,i=0,e=(o=x.slice()).length;i<e&&o[i];++i)o[i].apply(this,[a].concat(r));return this},s.getWildcardCallbacks=function(a){this.callbacks=this.callbacks||{};var i,e,o=[];for(i in this.callbacks)e=i.split("*"),(i==="*"||e.length===2&&a.slice(0,e[0].length)===e[0])&&(o=o.concat(this.callbacks[i]));return o}},he.mixin(he),typeof window<"u"&&(be=window.AudioContext||window.webkitAudioContext);var L=null,$=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},ze=!!($===$.window&&$.URL&&$.Blob&&$.Worker);function Ae(d,s){var a,i=this;if(s=s||{},ze)return a=d.toString().trim().match(/^function\s*\w*\s*\([\w\s,]*\)\s*{([\w\W]*?)}$/)[1],new $.Worker($.URL.createObjectURL(new $.Blob([a],{type:"text/javascript"})));this.self=s,this.self.postMessage=function(e){setTimeout(function(){i.onmessage({data:e})},0)},setTimeout(d.bind(s,s),0)}Ae.prototype.postMessage=function(d){var s=this;setTimeout(function(){s.self.onmessage({data:d})},0)};var Qe=Ae;class Oe{constructor(s,a){this.config={bufferLen:4096,numChannels:1,mimeType:"audio/wav",...a},this.recording=!1,this.callbacks={getBuffer:[],exportWAV:[]},this.context=s.context,this.node=(this.context.createScriptProcessor||this.context.createJavaScriptNode).call(this.context,this.config.bufferLen,this.config.numChannels,this.config.numChannels),this.node.onaudioprocess=i=>{if(this.recording){for(var e=[],o=0;o<this.config.numChannels;o++)e.push(i.inputBuffer.getChannelData(o));this.worker.postMessage({command:"record",buffer:e})}},s.connect(this.node),this.node.connect(this.context.destination),this.worker=new Qe(function(){let i,e,o,r=0,l=[];function x(){for(let S=0;S<e;S++)l[S]=[]}function C(S,k){let u=new Float32Array(k),t=0;for(let n=0;n<S.length;n++)u.set(S[n],t),t+=S[n].length;return u}function f(S,k,u){for(let t=0;t<u.length;t++)S.setUint8(k+t,u.charCodeAt(t))}this.onmessage=function(S){switch(S.data.command){case"init":k=S.data.config,i=k.sampleRate,e=k.numChannels,x(),o=i>48e3?48e3:i;break;case"record":(function(u){for(var t=0;t<e;t++)l[t].push(u[t]);r+=u[0].length})(S.data.buffer);break;case"exportWAV":(function(u){let t,n=[];for(let g=0;g<e;g++)n.push(C(l[g],r));t=e===2?function(g,m){let c=g.length+m.length,j=new Float32Array(c),y=0,v=0;for(;y<c;)j[y++]=g[v],j[y++]=m[v],v++;return j}(n[0],n[1]):n[0];let p=function(g){let m=new ArrayBuffer(44+2*g.length),c=new DataView(m);return f(c,0,"RIFF"),c.setUint32(4,36+2*g.length,!0),f(c,8,"WAVE"),f(c,12,"fmt "),c.setUint32(16,16,!0),c.setUint16(20,1,!0),c.setUint16(22,e,!0),c.setUint32(24,o,!0),c.setUint32(28,4*o,!0),c.setUint16(32,2*e,!0),c.setUint16(34,16,!0),f(c,36,"data"),c.setUint32(40,2*g.length,!0),function(j,y,v){for(let O=0;O<v.length;O++,y+=2){let P=Math.max(-1,Math.min(1,v[O]));j.setInt16(y,P<0?32768*P:32767*P,!0)}}(c,44,g),c}(function(g,m){if(m==i)return g;if(m>i)throw"downsampling rate show be smaller than original sample rate";for(var c=i/m,j=Math.round(g.length/c),y=new Float32Array(j),v=0,O=0;v<y.length;){for(var P=Math.round((v+1)*c),V=0,z=0,q=O;q<P&&q<g.length;q++)V+=g[q],z++;y[v]=V/z,v++,O=P}return y}(t,o)),h=new Blob([p],{type:u});this.postMessage({command:"exportWAV",data:h})})(S.data.type);break;case"getBuffer":(function(){let u=[];for(let t=0;t<e;t++)u.push(C(l[t],r));this.postMessage({command:"getBuffer",data:u})})();break;case"clear":r=0,l=[],x()}var k}},{}),this.worker.postMessage({command:"init",config:{sampleRate:this.context.sampleRate,numChannels:this.config.numChannels}}),this.worker.onmessage=i=>{let e=this.callbacks[i.data.command].pop();typeof e=="function"&&e(i.data.data)}}record(){this.recording=!0}stop(){this.recording=!1}clear(){this.worker.postMessage({command:"clear"})}getBuffer(s){if(!(s=s||this.config.callback))throw new Error("Callback not set");this.callbacks.getBuffer.push(s),this.worker.postMessage({command:"getBuffer"})}exportWAV(s,a){if(a=a||this.config.mimeType,!(s=s||this.config.callback))throw new Error("Callback not set");this.callbacks.exportWAV.push(s),this.worker.postMessage({command:"exportWAV",type:a})}static forceDownload(s,a){let i=(window.URL||window.webkitURL).createObjectURL(s),e=window.document.createElement("a");e.href=i,e.download=a||"output.wav";let o=document.createEvent("Event");o.initEvent("click",!0,!0),e.dispatchEvent(o)}}let Ee,Se,le=Oe;async function Ge({audioContext:d,errHandler:s,onStreamLoad:a}){try{const i=await navigator.mediaDevices.getUserMedia({audio:!0});return a&&a(),Ee=i,Se=d.createMediaStreamSource(i),le=new Oe(Se),le.record(),i}catch(i){console.log(i),s&&s()}}function ve({exportWAV:d,wavCallback:s}){le.stop(),Ee.getAudioTracks()[0].stop(),d&&s&&le.exportWAV(a=>s(a)),le.clear()}var _,De=navigator.userAgent.indexOf("Edg/")!==-1,Je=window.AudioContext||window.webkitAudioContext,Me=window.SpeechRecognition||window.webkitSpeechRecognition;function $e(d){var s=this,a=d.continuous,i=d.crossBrowser,e=d.googleApiKey,o=d.googleCloudRecognitionConfig,r=d.onStartSpeaking,l=d.onStoppedSpeaking,x=d.speechRecognitionProperties,C=x===void 0?{interimResults:!0}:x,f=d.timeout,S=f===void 0?1e4:f,k=d.useOnlyGoogleCloud,u=k!==void 0&&k,t=d.useLegacyResults,n=t===void 0||t,p=M.useState(!1),h=p[0],g=p[1],m=M.useRef(),c=M.useState([]),j=c[0],y=c[1],v=M.useState([]),O=v[0],P=v[1],V=M.useState(),z=V[0],q=V[1],de=M.useState(""),ge=de[0],te=de[1],ne=M.useRef(),re=M.useRef();M.useEffect(function(){var E;i||_||te("Speech Recognition API is only available on Chrome"),!((E=navigator==null?void 0:navigator.mediaDevices)===null||E===void 0)&&E.getUserMedia||te("getUserMedia is not supported on this device/browser :("),!i&&!u||e||console.error("No google cloud API key was passed, google API will not be able to process speech"),m.current||(m.current=new Je),n&&console.warn("react-hook-speech-to-text is using legacy results, pass useLegacyResults: false to the hook to use the new array of objects results. Legacy array of strings results will be removed in a future version.")},[]);var U=function(){return xe(s,void 0,void 0,function(){var E,ie,oe,X;return ke(this,function(Z){switch(Z.label){case 0:return!u&&_?(function(){if(_){_.continuous=!0;var A=C||{},W=A.grammars,w=A.interimResults,H=A.lang,G=A.maxAlternatives;W&&(_.grammars=W),H&&(_.lang=H),_.interimResults=w||!1,_.maxAlternatives=G||1,_.start(),_.onresult=function(R){var D=R.results[R.results.length-1],I=D[0].transcript,T=Math.floor(Date.now()/1e3);if(w)if(D.isFinal)q(void 0),P(function(F){return ee(F,[{transcript:I,timestamp:T}])}),y(function(F){return ee(F,[I])});else{for(var B="",ae=R.resultIndex;ae<R.results.length;ae++)B+=R.results[ae][0].transcript;q(B)}else P(function(F){return ee(F,[{transcript:I,timestamp:T}])}),y(function(F){return ee(F,[I])})},_.onaudiostart=function(){return g(!0)},_.onend=function(){g(!1)}}}(),[2]):i||u?(((oe=m.current)===null||oe===void 0?void 0:oe.state)==="suspended"&&((X=m.current)===null||X===void 0||X.resume()),[4,Ge({errHandler:function(){return te("Microphone permission was denied")},audioContext:m.current})]):[2];case 1:return E=Z.sent(),g(!0),S&&(clearTimeout(ne.current),N()),re.current&&Q(),re.current=E.clone(),(ie=function(A,W){var w=new qe;if(!be)return w;var H,G,R,D=(W=W||{}).smoothing||.1,I=W.interval||50,T=W.threshold,B=W.play,ae=W.history||10,F=!0;L=W.audioContext||L||new be,(R=L.createAnalyser()).fftSize=512,R.smoothingTimeConstant=D,G=new Float32Array(R.frequencyBinCount),A.jquery&&(A=A[0]),A instanceof HTMLAudioElement||A instanceof HTMLVideoElement?(H=L.createMediaElementSource(A),B===void 0&&(B=!0),T=T||-50):(H=L.createMediaStreamSource(A),T=T||-50),H.connect(R),B&&R.connect(L.destination),w.speaking=!1,w.suspend=function(){return L.suspend()},w.resume=function(){return L.resume()},Object.defineProperty(w,"state",{get:function(){return L.state}}),L.onstatechange=function(){w.emit("state_change",L.state)},w.setThreshold=function(J){T=J},w.setInterval=function(J){I=J},w.stop=function(){F=!1,w.emit("volume_change",-100,T),w.speaking&&(w.speaking=!1,w.emit("stopped_speaking")),R.disconnect(),H.disconnect()},w.speakingHistory=[];for(var ye=0;ye<ae;ye++)w.speakingHistory.push(0);var we=function(){setTimeout(function(){if(F){var J=function(Te,se){var me=-1/0;Te.getFloatFrequencyData(se);for(var ce=4,_e=se.length;ce<_e;ce++)se[ce]>me&&se[ce]<0&&(me=se[ce]);return me}(R,G);w.emit("volume_change",J,T);var fe=0;if(J>T&&!w.speaking){for(var Y=w.speakingHistory.length-3;Y<w.speakingHistory.length;Y++)fe+=w.speakingHistory[Y];fe>=2&&(w.speaking=!0,w.emit("speaking"))}else if(J<T&&w.speaking){for(Y=0;Y<w.speakingHistory.length;Y++)fe+=w.speakingHistory[Y];fe==0&&(w.speaking=!1,w.emit("stopped_speaking"))}w.speakingHistory.shift(),w.speakingHistory.push(0+(J>T)),we()}},I)};return we(),w}(re.current,{audioContext:m.current})).on("speaking",function(){r&&r(),clearTimeout(ne.current)}),ie.on("stopped_speaking",function(){l&&l(),ve({exportWAV:!0,wavCallback:function(A){return K({blob:A,continuous:a})}})}),[2]}})})},N=function(){ne.current=window.setTimeout(function(){g(!1),Q(),ve({exportWAV:!1})},S)},K=function(E){var ie=E.blob,oe=E.continuous,X=new FileReader;X.readAsDataURL(ie),X.onloadend=function(){return xe(s,void 0,void 0,function(){var Z,A,W,w,H,G,R,D,I;return ke(this,function(T){switch(T.label){case 0:return Z=X.result,(A=(D=m.current)===null||D===void 0?void 0:D.sampleRate)&&A>48e3&&(A=48e3),W={content:""},w=Ue({encoding:"LINEAR16",languageCode:"en-US",sampleRateHertz:A},o),H={config:w,audio:W},W.content=Z.substr(Z.indexOf(",")+1),[4,fetch("https://speech.googleapis.com/v1/speech:recognize?key="+e,{method:"POST",body:JSON.stringify(H)})];case 1:return[4,T.sent().json()];case 2:return G=T.sent(),((I=G.results)===null||I===void 0?void 0:I.length)>0&&(R=G.results[0].alternatives[0].transcript,y(function(B){return ee(B,[R])}),P(function(B){return ee(B,[{speechBlob:ie,transcript:R,timestamp:Math.floor(Date.now()/1e3)}])})),oe?U():(Q(),g(!1)),[2]}})})}},Q=function(){var E;(E=re.current)===null||E===void 0||E.getAudioTracks()[0].stop()};return{error:ge,interimResult:z,isRecording:h,results:n?j:O,setResults:P,startSpeechToText:U,stopSpeechToText:function(){_&&!u?_.stop():(g(!1),Q(),ve({exportWAV:!0,wavCallback:function(E){return K({blob:E,continuous:!1})}}))}}}navigator.brave&&navigator.brave.isBrave().then(function(d){d&&(_=null)}),!De&&Me&&(_=new Me);var Re={exports:{}};(function(d,s){(function(i,e){d.exports=e(M)})(Pe,function(a){return function(i){var e={};function o(r){if(e[r])return e[r].exports;var l=e[r]={i:r,l:!1,exports:{}};return i[r].call(l.exports,l,l.exports,o),l.l=!0,l.exports}return o.m=i,o.c=e,o.d=function(r,l,x){o.o(r,l)||Object.defineProperty(r,l,{enumerable:!0,get:x})},o.r=function(r){typeof Symbol<"u"&&Symbol.toStringTag&&Object.defineProperty(r,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(r,"__esModule",{value:!0})},o.t=function(r,l){if(l&1&&(r=o(r)),l&8||l&4&&typeof r=="object"&&r&&r.__esModule)return r;var x=Object.create(null);if(o.r(x),Object.defineProperty(x,"default",{enumerable:!0,value:r}),l&2&&typeof r!="string")for(var C in r)o.d(x,C,(function(f){return r[f]}).bind(null,C));return x},o.n=function(r){var l=r&&r.__esModule?function(){return r.default}:function(){return r};return o.d(l,"a",l),l},o.o=function(r,l){return Object.prototype.hasOwnProperty.call(r,l)},o.p="",o(o.s="./src/react-webcam.tsx")}({"./src/react-webcam.tsx":function(i,e,o){o.r(e);var r=o("react"),l=function(){var k=function(u,t){return k=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,p){n.__proto__=p}||function(n,p){for(var h in p)p.hasOwnProperty(h)&&(n[h]=p[h])},k(u,t)};return function(u,t){k(u,t);function n(){this.constructor=u}u.prototype=t===null?Object.create(t):(n.prototype=t.prototype,new n)}}(),x=function(){return x=Object.assign||function(k){for(var u,t=1,n=arguments.length;t<n;t++){u=arguments[t];for(var p in u)Object.prototype.hasOwnProperty.call(u,p)&&(k[p]=u[p])}return k},x.apply(this,arguments)},C=function(k,u){var t={};for(var n in k)Object.prototype.hasOwnProperty.call(k,n)&&u.indexOf(n)<0&&(t[n]=k[n]);if(k!=null&&typeof Object.getOwnPropertySymbols=="function")for(var p=0,n=Object.getOwnPropertySymbols(k);p<n.length;p++)u.indexOf(n[p])<0&&Object.prototype.propertyIsEnumerable.call(k,n[p])&&(t[n[p]]=k[n[p]]);return t};(function(){typeof window>"u"||(navigator.mediaDevices===void 0&&(navigator.mediaDevices={}),navigator.mediaDevices.getUserMedia===void 0&&(navigator.mediaDevices.getUserMedia=function(u){var t=navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia||navigator.msGetUserMedia;return t?new Promise(function(n,p){t.call(navigator,u,n,p)}):Promise.reject(new Error("getUserMedia is not implemented in this browser"))}))})();function f(){return!!(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia)}var S=function(k){l(u,k);function u(t){var n=k.call(this,t)||this;return n.canvas=null,n.ctx=null,n.requestUserMediaId=0,n.unmounted=!1,n.state={hasUserMedia:!1},n}return u.prototype.componentDidMount=function(){var t=this,n=t.state,p=t.props;if(this.unmounted=!1,!f()){p.onUserMediaError("getUserMedia not supported");return}n.hasUserMedia||this.requestUserMedia(),p.children&&typeof p.children!="function"&&console.warn("children must be a function")},u.prototype.componentDidUpdate=function(t){var n=this.props;if(!f()){n.onUserMediaError("getUserMedia not supported");return}var p=JSON.stringify(t.audioConstraints)!==JSON.stringify(n.audioConstraints),h=JSON.stringify(t.videoConstraints)!==JSON.stringify(n.videoConstraints),g=t.minScreenshotWidth!==n.minScreenshotWidth,m=t.minScreenshotHeight!==n.minScreenshotHeight;(h||g||m)&&(this.canvas=null,this.ctx=null),(p||h)&&(this.stopAndCleanup(),this.requestUserMedia())},u.prototype.componentWillUnmount=function(){this.unmounted=!0,this.stopAndCleanup()},u.stopMediaStream=function(t){t&&(t.getVideoTracks&&t.getAudioTracks?(t.getVideoTracks().map(function(n){t.removeTrack(n),n.stop()}),t.getAudioTracks().map(function(n){t.removeTrack(n),n.stop()})):t.stop())},u.prototype.stopAndCleanup=function(){var t=this.state;t.hasUserMedia&&(u.stopMediaStream(this.stream),t.src&&window.URL.revokeObjectURL(t.src))},u.prototype.getScreenshot=function(t){var n=this,p=n.state,h=n.props;if(!p.hasUserMedia)return null;var g=this.getCanvas(t);return g&&g.toDataURL(h.screenshotFormat,h.screenshotQuality)},u.prototype.getCanvas=function(t){var n=this,p=n.state,h=n.props;if(!this.video||!p.hasUserMedia||!this.video.videoHeight)return null;if(!this.ctx){var g=this.video.videoWidth,m=this.video.videoHeight;if(!this.props.forceScreenshotSourceSize){var c=g/m;g=h.minScreenshotWidth||this.video.clientWidth,m=g/c,h.minScreenshotHeight&&m<h.minScreenshotHeight&&(m=h.minScreenshotHeight,g=m*c)}this.canvas=document.createElement("canvas"),this.canvas.width=(t==null?void 0:t.width)||g,this.canvas.height=(t==null?void 0:t.height)||m,this.ctx=this.canvas.getContext("2d")}var j=this,y=j.ctx,v=j.canvas;return y&&v&&(v.width=(t==null?void 0:t.width)||v.width,v.height=(t==null?void 0:t.height)||v.height,h.mirrored&&(y.translate(v.width,0),y.scale(-1,1)),y.imageSmoothingEnabled=h.imageSmoothing,y.drawImage(this.video,0,0,(t==null?void 0:t.width)||v.width,(t==null?void 0:t.height)||v.height),h.mirrored&&(y.scale(-1,1),y.translate(-v.width,0))),v},u.prototype.requestUserMedia=function(){var t=this,n=this.props,p=function(m,c){var j={video:typeof c<"u"?c:!0};n.audio&&(j.audio=typeof m<"u"?m:!0),t.requestUserMediaId++;var y=t.requestUserMediaId;navigator.mediaDevices.getUserMedia(j).then(function(v){t.unmounted||y!==t.requestUserMediaId?u.stopMediaStream(v):t.handleUserMedia(null,v)}).catch(function(v){t.handleUserMedia(v)})};if("mediaDevices"in navigator)p(n.audioConstraints,n.videoConstraints);else{var h=function(m){return{optional:[{sourceId:m}]}},g=function(m){var c=m.deviceId;return typeof c=="string"?c:Array.isArray(c)&&c.length>0?c[0]:typeof c=="object"&&c.ideal?c.ideal:null};MediaStreamTrack.getSources(function(m){var c=null,j=null;m.forEach(function(O){O.kind==="audio"?c=O.id:O.kind==="video"&&(j=O.id)});var y=g(n.audioConstraints);y&&(c=y);var v=g(n.videoConstraints);v&&(j=v),p(h(c),h(j))})}},u.prototype.handleUserMedia=function(t,n){var p=this.props;if(t||!n){this.setState({hasUserMedia:!1}),p.onUserMediaError(t);return}this.stream=n;try{this.video&&(this.video.srcObject=n),this.setState({hasUserMedia:!0})}catch{this.setState({hasUserMedia:!0,src:window.URL.createObjectURL(n)})}p.onUserMedia(n)},u.prototype.render=function(){var t=this,n=this,p=n.state,h=n.props,g=h.audio;h.forceScreenshotSourceSize;var m=h.disablePictureInPicture;h.onUserMedia,h.onUserMediaError,h.screenshotFormat,h.screenshotQuality,h.minScreenshotWidth,h.minScreenshotHeight,h.audioConstraints,h.videoConstraints,h.imageSmoothing;var c=h.mirrored,j=h.style,y=j===void 0?{}:j,v=h.children,O=C(h,["audio","forceScreenshotSourceSize","disablePictureInPicture","onUserMedia","onUserMediaError","screenshotFormat","screenshotQuality","minScreenshotWidth","minScreenshotHeight","audioConstraints","videoConstraints","imageSmoothing","mirrored","style","children"]),P=c?x(x({},y),{transform:(y.transform||"")+" scaleX(-1)"}):y,V={getScreenshot:this.getScreenshot.bind(this)};return r.createElement(r.Fragment,null,r.createElement("video",x({autoPlay:!0,disablePictureInPicture:m,src:p.src,muted:!g,playsInline:!0,ref:function(z){t.video=z},style:P},O)),v&&v(V))},u.defaultProps={audio:!1,disablePictureInPicture:!1,forceScreenshotSourceSize:!1,imageSmoothing:!0,mirrored:!1,onUserMedia:function(){},onUserMediaError:function(){},screenshotFormat:"image/webp",screenshotQuality:.92},u}(r.Component);e.default=S},react:function(i,e){i.exports=a}}).default})})(Re);var Ke=Re.exports;const Xe=Ne(Ke);function Ye(d){return We({tag:"svg",attr:{fill:"currentColor",viewBox:"0 0 16 16"},child:[{tag:"path",attr:{d:"M0 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H9.269c.144.162.33.324.531.475a7 7 0 0 0 .907.57l.014.006.003.002A.5.5 0 0 1 10.5 13h-5a.5.5 0 0 1-.224-.947l.003-.002.014-.007a5 5 0 0 0 .268-.148 7 7 0 0 0 .639-.421c.2-.15.387-.313.531-.475H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1z"},child:[]},{tag:"path",attr:{d:"M8 6.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0m7 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"},child:[]}]})(d)}const Ze=({webcamEnabled:d,setWebcamEnabled:s,webcamSize:a,handleDisableWebcam:i,handleEnableWebcam:e})=>b.jsx("div",{className:"p-4 flex flex-col items-center",children:d?b.jsxs("div",{className:"flex flex-col items-center",children:[b.jsx("div",{children:b.jsxs("div",{class:"bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4",role:"alert",children:[b.jsx("p",{class:"font-bold",children:"Alert"}),b.jsx("p",{children:"Webcam is turned on for your convenience. This is not being recorded and is just for you to monitor your speaking.."})]})}),b.jsxs("div",{className:"flex flex-col items-center space-y-4 bg-gray-200 p-6 rounded-lg shadow-md",style:{width:a,height:a},children:[b.jsx(Xe,{mirrored:!0,className:"rounded-lg border-4 border-blue-500",onUserMedia:()=>s(!0),onUserMediaError:()=>s(!1),style:{width:"100%",height:"100%"}}),b.jsx(ue,{onClick:i,color:"danger",className:"w-full",children:"Disable Webcam"})]})]}):b.jsxs("div",{className:"flex flex-col items-center justify-center space-y-4 bg-slate-300 p-4 rounded-lg",style:{width:a,height:a},children:[b.jsx(Ye,{size:96,className:"text-black"}),b.jsx(ue,{onClick:e,color:"primary",children:"Enable Webcam and Microphone"})]})}),et=({mockData:d})=>{const s=Ce(),a=je(),[i,e]=M.useState(""),{loading:o,feedbackId:r}=pe(U=>U.interview),[l,x]=M.useState(!1),[C,f]=M.useState(!1),[S,k]=M.useState(""),u=M.useMemo(()=>JSON.parse(d.questions),[d.questions]),{interimResult:t,isRecording:n,startSpeechToText:p,stopSpeechToText:h}=$e({continuous:!0,useLegacyResults:!1}),[g,m]=M.useState(!1),[c,j]=M.useState(0),[y,v]=M.useState(()=>Array(u.length).fill("")),{access:O}=pe(U=>U.auth);M.useEffect(()=>{typeof r=="number"&&l&&a(`/ai/feedback/${r}`)},[r,l,a]);const P=async(U,N,K)=>{try{const Q={"Content-Type":"application/json",Authorization:`Bearer ${K}`},E=await He.post(`http://localhost/ai/submit-interview-answers/${U}/`,{answers:N},{headers:Q});e(E.data.feedbackid),a(`/ai/feedback/${E.data}`)}catch(Q){throw console.error("An error occurred while submitting answers:",Q),new Error("An error occurred while submitting answers.")}};M.useEffect(()=>{n&&t&&k(t)},[t,n]);const V=M.useCallback(()=>{m(!0)},[]),z=M.useCallback(()=>{m(!1)},[]),q=M.useCallback(U=>{n&&(h(),v(N=>{const K=[...N];return K[c]=S||N[c],K})),j(U),k(y[U]||"")},[n,h,c,S,y]),de=M.useCallback(async()=>{if(n)h(),v(U=>{const N=[...U];return N[c]=S||U[c],N});else try{await navigator.mediaDevices.getUserMedia({audio:!0}),k(""),p()}catch(U){console.error("Microphone access denied or error occurred:",U),alert("Please enable microphone access in your browser settings.")}},[n,h,p,c,S]),ge=M.useCallback(()=>{x(!0),s(Ie()),P(d.mockId,y,O)},[s,d.mockId,y,O]),te=y.some(U=>U===""),ne=()=>{f(U=>!U)};return b.jsxs(b.Fragment,{children:[b.jsxs("div",{className:"p-4",children:[b.jsxs("div",{className:"mb-4",children:[b.jsx("h2",{className:"text-2xl font-bold",children:d.JobPosition}),b.jsx("p",{className:"text-gray-600",children:d.JobDescription})]}),b.jsx("div",{className:"flex space-x-4 mb-6 justify-center",children:u.map((U,N)=>b.jsxs("button",{onClick:()=>q(N),className:`px-4 py-2 border ${c===N?"border-blue-500 bg-blue-100":""} rounded`,children:["Question ",N+1]},N))}),b.jsxs("div",{className:"p-4 border rounded bg-gray-50",children:[b.jsxs("h3",{className:"text-lg font-semibold",children:["Question ",c+1]}),b.jsx("p",{children:u[c]}),b.jsx("h4",{className:"mt-4 font-semibold",children:"Your Answer:"}),C?b.jsx(Le,{type:"text",value:S,onChange:U=>k(U.target.value),fullWidth:!0,placeholder:"Type your answer here"}):b.jsx("p",{children:n?S:y[c]||"No answer recorded yet."})]})]}),b.jsx(Ze,{webcamEnabled:g,setWebcamEnabled:m,webcamSize:"380px",handleDisableWebcam:z,handleEnableWebcam:V}),b.jsxs("div",{className:"mt-4 flex gap-2 justify-center items-center mx-auto",children:[b.jsx(ue,{className:"btn-custom-blue ",onClick:de,children:n?"Stop Recording":"Start Recording"}),b.jsx(ue,{className:"btn-custom-yellow    ",onClick:ne,children:C?"Switch to Speaking":"Switch to Typing"}),n&&b.jsxs("p",{children:["Current input: ",S]})]}),b.jsx("div",{className:"mt-4",children:b.jsx(ue,{className:"btn-custom-green mx-auto",onClick:ge,disabled:te,children:"Submit Answers"})})]})},nt=()=>{const{questionz:d,loading:s,feedback:a,feedbackId:i}=pe(l=>l.interview),{access:e}=pe(l=>l.auth),o=Ce();je();const{mockId:r}=Be();return M.useEffect(()=>{o(Fe(r))},[o,r,e]),s?b.jsx("div",{children:"Loading..."}):b.jsx(Ve,{noPadding:!0,children:b.jsxs("div",{className:"my-4 flex flex-col items-center space-y-8",children:[b.jsx("div",{className:"w-full",children:d.questions&&b.jsx(et,{mockData:d})}),a&&b.jsx("div",{children:"JSON.parse(feedback)"})]})})};export{nt as default};
