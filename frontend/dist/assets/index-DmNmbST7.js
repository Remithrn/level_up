import{r as e,as as v,$ as x,a9 as g}from"./index-DdC0FHAS.js";function O(c,r=[]){const o=e.useRef(c);return v(()=>{o.current=c}),e.useCallback((...t)=>{var l;return(l=o.current)==null?void 0:l.call(o,...t)},r)}function h(c={}){const{id:r,defaultOpen:o,isOpen:t,onClose:l,onOpen:k,onChange:P=()=>{}}=c,i=O(k),u=O(l),[n,C]=x(t,o||!1,P),$=e.useId(),d=r||$,s=t!==void 0,p=e.useCallback(()=>{s||C(!1),u==null||u()},[s,u]),f=e.useCallback(()=>{s||C(!0),i==null||i()},[s,i]),b=e.useCallback(()=>{(n?p:f)()},[n,f,p]);return{isOpen:!!n,onOpen:f,onClose:p,onOpenChange:b,isControlled:s,getButtonProps:(a={})=>({...a,"aria-expanded":n,"aria-controls":d,onClick:g(a.onClick,b)}),getDisclosureProps:(a={})=>({...a,hidden:!n,id:d})}}export{O as a,h as u};
