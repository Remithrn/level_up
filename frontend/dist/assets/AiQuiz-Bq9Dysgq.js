import{bJ as $e,r as i,X as xe,a3 as se,V as P,bn as ge,U as Te,bK as we,bh as ye,a0 as je,b3 as Pe,bL as Ce,bM as Oe,as as Ae,bN as Ne,bO as X,a4 as De,a6 as A,bP as Y,a5 as Ie,bQ as Se,aa as _e,j as e,aq as Ee,ab as Re,ac as ze,ad as ke,af as qe,bb as He,bR as G,ae as Le,e as Qe,u as Be,a as Me,b as Ve,bS as Fe,C as Ke,q as Ue,t as We,v as Z,s as Je,c as ee,a$ as Q,bH as Xe,bI as Ye}from"./index-DdC0FHAS.js";import{m as Ge}from"./chunk-CIZQCQPA-Be68kzJk.js";import{c as Ze}from"./chunk-JHUBASYZ-C2D0YoIm.js";const et=1500,te=500;let y={},tt=0,I=!1,T=null,j=null;function st(t={}){let{delay:s=et,closeDelay:c=te}=t,{isOpen:n,open:d,close:m}=$e(t),a=i.useMemo(()=>`${++tt}`,[]),o=i.useRef(),v=()=>{y[a]=p},f=()=>{for(let r in y)r!==a&&(y[r](!0),delete y[r])},b=()=>{clearTimeout(o.current),o.current=null,f(),v(),I=!0,d(),T&&(clearTimeout(T),T=null),j&&(clearTimeout(j),j=null)},p=r=>{r||c<=0?(clearTimeout(o.current),o.current=null,m()):o.current||(o.current=setTimeout(()=>{o.current=null,m()},c)),T&&(clearTimeout(T),T=null),I&&(j&&clearTimeout(j),j=setTimeout(()=>{delete y[a],j=null,I=!1},Math.max(te,c)))},h=()=>{f(),v(),!n&&!T&&!I?T=setTimeout(()=>{T=null,I=!0,b()},s):n||b()};return i.useEffect(()=>()=>{clearTimeout(o.current),y[a]&&delete y[a]},[a]),{isOpen:n,open:r=>{!r&&s>0&&!o.current?h():b()},close:p}}function ot(t,s){let c=xe(t,{labelable:!0}),{hoverProps:n}=se({onHoverStart:()=>s==null?void 0:s.open(!0),onHoverEnd:()=>s==null?void 0:s.close()});return{tooltipProps:P(c,n,{role:"tooltip"})}}function rt(t,s,c){let{isDisabled:n,trigger:d}=t,m=ge(),a=i.useRef(!1),o=i.useRef(!1),v=()=>{(a.current||o.current)&&s.open(o.current)},f=u=>{!a.current&&!o.current&&s.close(u)};i.useEffect(()=>{let u=O=>{c&&c.current&&O.key==="Escape"&&(O.stopPropagation(),s.close(!0))};if(s.isOpen)return document.addEventListener("keydown",u,!0),()=>{document.removeEventListener("keydown",u,!0)}},[c,s]);let b=()=>{d!=="focus"&&(we()==="pointer"?a.current=!0:a.current=!1,v())},p=()=>{d!=="focus"&&(o.current=!1,a.current=!1,f())},h=()=>{o.current=!1,a.current=!1,f(!0)},r=()=>{ye()&&(o.current=!0,v())},g=()=>{o.current=!1,a.current=!1,f(!0)},{hoverProps:l}=se({isDisabled:n,onHoverStart:b,onHoverEnd:p}),{focusableProps:C}=Te({isDisabled:n,onFocus:r,onBlur:g},c);return{triggerProps:{"aria-describedby":s.isOpen?m:void 0,...P(C,l,{onPointerDown:h,onKeyDown:h})},tooltipProps:{id:m}}}function lt(t){var s,c;const n=je(),[d,m]=Pe(t,X.variantKeys),{ref:a,as:o,isOpen:v,content:f,children:b,defaultOpen:p,onOpenChange:h,isDisabled:r,trigger:g,shouldFlip:l=!0,containerPadding:C=12,placement:u="top",delay:O=0,closeDelay:q=500,showArrow:$=!1,offset:B=7,crossOffset:re=0,isDismissable:le,shouldCloseOnBlur:ne=!0,portalContainer:ae,isKeyboardDismissDisabled:ie=!1,updatePositionDeps:M=[],shouldCloseOnInteractOutside:ce,className:de,onClose:V,motionProps:ue,classNames:N,...H}=d,fe=o||"div",L=(c=(s=t==null?void 0:t.disableAnimation)!=null?s:n==null?void 0:n.disableAnimation)!=null?c:!1,D=st({delay:O,closeDelay:q,isDisabled:r,defaultOpen:p,isOpen:v,onOpenChange:w=>{h==null||h(w),w||V==null||V()}}),S=i.useRef(null),_=i.useRef(null),E=i.useId(),x=D.isOpen&&!r;i.useImperativeHandle(a,()=>Ce(_));const{triggerProps:F,tooltipProps:pe}=rt({isDisabled:r,trigger:g},D,S),{tooltipProps:K}=ot({isOpen:x,...P(d,pe)},D),{overlayProps:U,placement:R,updatePosition:be}=Oe({isOpen:x,targetRef:S,placement:Se(u),overlayRef:_,offset:$?B+3:B,crossOffset:re,shouldFlip:l,containerPadding:C});Ae(()=>{M.length&&be()},M);const{overlayProps:W}=Ne({isOpen:x,onClose:D.close,isDismissable:le,shouldCloseOnBlur:ne,isKeyboardDismissDisabled:ie,shouldCloseOnInteractOutside:ce},_),z=i.useMemo(()=>{var w,k,J;return X({...m,disableAnimation:L,radius:(w=t==null?void 0:t.radius)!=null?w:"md",size:(k=t==null?void 0:t.size)!=null?k:"md",shadow:(J=t==null?void 0:t.shadow)!=null?J:"sm"})},[De(m),L,t==null?void 0:t.radius,t==null?void 0:t.size,t==null?void 0:t.shadow]),me=i.useCallback((w={},k=null)=>({...P(F,w),ref:Ge(k,S),"aria-describedby":x?E:void 0}),[F,x,E,D]),he=i.useCallback(()=>({ref:_,"data-slot":"base","data-open":A(x),"data-arrow":A($),"data-disabled":A(r),"data-placement":Y(R,u),...P(K,W,H),style:P(U.style,H.style,d.style),className:z.base({class:N==null?void 0:N.base}),id:E}),[z,x,$,r,R,u,K,W,H,U,d,E]),ve=i.useCallback(()=>({"data-slot":"content","data-open":A(x),"data-arrow":A($),"data-disabled":A(r),"data-placement":Y(R,u),className:z.content({class:Ie(N==null?void 0:N.content,de)})}),[z,x,$,r,R,u,N]);return{Component:fe,content:f,children:b,isOpen:x,triggerRef:S,showArrow:$,portalContainer:ae,placement:u,disableAnimation:L,isDisabled:r,motionProps:ue,getTooltipContentProps:ve,getTriggerProps:me,getTooltipProps:he}}var oe=_e((t,s)=>{const{Component:c,children:n,content:d,isOpen:m,portalContainer:a,placement:o,disableAnimation:v,motionProps:f,getTriggerProps:b,getTooltipProps:p,getTooltipContentProps:h}=lt({...t,ref:s});let r;try{if(i.Children.count(n)!==1)throw new Error;if(!i.isValidElement(n))r=e.jsx("p",{...b(),children:n});else{const $=n;r=i.cloneElement($,b($.props,$.ref))}}catch{r=e.jsx("span",{}),Ee("Tooltip must have only one child node. Please, check your code.")}const{ref:g,id:l,style:C,...u}=p(),O=e.jsx("div",{ref:g,id:l,style:C,children:e.jsx(Re,{features:ze,children:e.jsx(ke.div,{animate:"enter",exit:"exit",initial:"exit",variants:qe.scaleSpring,...P(f,u),style:{...He(o)},children:e.jsx(c,{...h(),children:d})})})});return e.jsxs(e.Fragment,{children:[r,v&&m?e.jsx(G,{portalContainer:a,children:e.jsx("div",{ref:g,id:l,style:C,...u,children:e.jsx(c,{...h(),children:d})})}):e.jsx(Le,{children:m?e.jsx(G,{portalContainer:a,children:O}):null})]})});oe.displayName="NextUI.Tooltip";var nt=oe;const dt=()=>{var g;const{id:t}=Qe(),s=Be(),c=Me(),{aiQuizes:n,quizScore:d,quizId:m,loading:a}=Ve(l=>l.interview),[o,v]=i.useState(0),[f,b]=i.useState(null);if(i.useEffect(()=>{s(Fe({id:t}))},[s,t]),a)return e.jsx("div",{children:"Loading..."});const p=(g=n==null?void 0:n.quiz)==null?void 0:g.quiz[o];if(!p)return e.jsx("div",{children:"No question available."});const h=l=>{b(l)},r=()=>{if(f===null){Q.error("Please select an answer before confirming.");return}const l=p.correct_answer;f===l?(Q.success("Correct! The answer is: "+l),s(Xe(1))):Q.error("Incorrect! The correct answer is: "+l),o<n.quiz.quiz.length-1?(v(o+1),b(null)):(s(Ye({score:d,id:t})),c(`/ai/quiz/score/${t}`))};return e.jsx(Ke,{children:e.jsxs("div",{className:"mt-5",children:[e.jsxs("h3",{className:"text-xl font-bold mb-4",children:["Question ",o+1,": ",p.question]}),e.jsxs(Ue,{className:"mb-4",children:[e.jsxs(We,{className:"flex justify-between items-center",children:[e.jsx("h4",{className:"font-semibold",children:"Choose an option:"}),e.jsxs("h2",{children:["Score: ",d]})]}),e.jsx(Z,{}),e.jsx(Je,{children:e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4 pl-4 p-2",children:["A","B","C","D"].map(l=>e.jsx(nt,{content:`${l}: ${p.options[l]}`,children:e.jsxs(ee,{className:`flex items-center gap-2 rounded-2xl border-b-4 border-x-1 border-t-1 px-5 py-6 font-bold break-words transition hover:brightness-110 ${f===l?"bg-violet-500 text-white":"bg-white text-violet-500 border-violet-500"}`,onClick:()=>h(l),children:[l,": ",p.options[l]]},l)},l))})}),e.jsx(Z,{}),e.jsx(Ze,{className:"flex justify-end",children:e.jsx(ee,{color:"primary",variant:"ghost",size:"lg",onClick:r,children:"Confirm Answer"})})]})]})})};export{dt as default};
