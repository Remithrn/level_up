import{$ as f,bw as o,r,bx as K,by as c}from"./index-DdC0FHAS.js";class u{*[Symbol.iterator](){yield*this.iterable}get size(){return this.keyMap.size}getKeys(){return this.keyMap.keys()}getKeyBefore(t){let e=this.keyMap.get(t);return e?e.prevKey:null}getKeyAfter(t){let e=this.keyMap.get(t);return e?e.nextKey:null}getFirstKey(){return this.firstKey}getLastKey(){return this.lastKey}getItem(t){return this.keyMap.get(t)}at(t){const e=[...this.getKeys()];return this.getItem(e[t])}constructor(t,{expandedKeys:e}={}){this.keyMap=new Map,this.iterable=t,e=e||new Set;let l=a=>{if(this.keyMap.set(a.key,a),a.childNodes&&(a.type==="section"||e.has(a.key)))for(let n of a.childNodes)l(n)};for(let a of t)l(a);let s,i=0;for(let[a,n]of this.keyMap)s?(s.nextKey=a,n.prevKey=s.key):(this.firstKey=a,n.prevKey=void 0),n.type==="item"&&(n.index=i++),s=n,s.nextKey=void 0;this.lastKey=s==null?void 0:s.key}}function h(d){let{onExpandedChange:t}=d,[e,l]=f(d.expandedKeys?new Set(d.expandedKeys):void 0,d.defaultExpandedKeys?new Set(d.defaultExpandedKeys):new Set,t),s=o(d),i=r.useMemo(()=>d.disabledKeys?new Set(d.disabledKeys):new Set,[d.disabledKeys]),a=K(d,r.useCallback(y=>new u(y,{expandedKeys:e}),[e]),null);return r.useEffect(()=>{s.focusedKey!=null&&!a.getItem(s.focusedKey)&&s.setFocusedKey(null)},[a,s.focusedKey]),{collection:a,expandedKeys:e,disabledKeys:i,toggleKey:y=>{l(g(e,y))},setExpandedKeys:l,selectionManager:new c(a,s)}}function g(d,t){let e=new Set(d);return e.has(t)?e.delete(t):e.add(t),e}export{h as $};
