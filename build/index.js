(window.webpackJsonp_rather_simple_infinite_latest_posts=window.webpackJsonp_rather_simple_infinite_latest_posts||[]).push([[1],{7:function(e,t,n){}}]),function(e){function t(t){for(var r,s,l=t[0],a=t[1],c=t[2],u=0,f=[];u<l.length;u++)s=l[u],Object.prototype.hasOwnProperty.call(i,s)&&i[s]&&f.push(i[s][0]),i[s]=0;for(r in a)Object.prototype.hasOwnProperty.call(a,r)&&(e[r]=a[r]);for(p&&p(t);f.length;)f.shift()();return o.push.apply(o,c||[]),n()}function n(){for(var e,t=0;t<o.length;t++){for(var n=o[t],r=!0,l=1;l<n.length;l++){var a=n[l];0!==i[a]&&(r=!1)}r&&(o.splice(t--,1),e=s(s.s=n[0]))}return e}var r={},i={0:0},o=[];function s(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,s),n.l=!0,n.exports}s.m=e,s.c=r,s.d=function(e,t,n){s.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},s.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,t){if(1&t&&(e=s(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(s.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)s.d(n,r,function(t){return e[t]}.bind(null,r));return n},s.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="";var l=window.webpackJsonp_rather_simple_infinite_latest_posts=window.webpackJsonp_rather_simple_infinite_latest_posts||[],a=l.push.bind(l);l.push=t,l=l.slice();for(var c=0;c<l.length;c++)t(l[c]);var p=a;o.push([8,1]),n()}([function(e,t){e.exports=window.wp.element},function(e,t){e.exports=window.wp.i18n},function(e,t){e.exports=window.wp.components},function(e,t){e.exports=window.wp.blocks},function(e,t){e.exports=window.wp.blockEditor},function(e,t){e.exports=window.wp.data},function(e,t){e.exports=window.wp.serverSideRender},,function(e,t,n){"use strict";n.r(t);var r=n(0),i=n(1),o=n(3),s=n(4),l=n(2),a=n(5),c=n(6),p=n.n(c);const u={title:Object(i.__)("Rather Simple Infinite Latest Posts","rather-simple-infinite-latest-posts"),description:Object(i.__)("Display latest posts.","rather-simple-infinite-latest-posts"),icon:Object(r.createElement)(l.SVG,{viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg"},Object(r.createElement)(l.Path,{fill:"none",d:"M0 0h24v24H0V0z"}),Object(r.createElement)(l.G,null,Object(r.createElement)(l.Path,{d:"M20 4v12H8V4h12m0-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 9.67l1.69 2.26 2.48-3.1L19 15H9zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z"}))),category:"common",keywords:[Object(i.__)("posts","rather-simple-infinite-latest-posts")],attributes:{id:{type:"integer",default:0}},edit:e=>{const{attributes:t,className:n}=e,o=Object(a.useSelect)(e=>e("core").getEntityRecords("taxonomy","category",{per_page:-1}),[]);if(!o)return Object(i.__)("Loading...","rather-simple-infinite-latest-posts");if(0===o.length)return Object(i.__)("No categories found","rather-simple-infinite-latest-posts");var c=[];c.push({label:Object(i.__)("Select a category...","rather-simple-infinite-latest-posts"),value:""});for(var u=0;u<o.length;u++)c.push({label:o[u].name,value:o[u].id});return Object(r.createElement)(Fragment,null,Object(r.createElement)(s.InspectorControls,null,Object(r.createElement)(l.PanelBody,{title:Object(i.__)("Settings","rather-simple-infinite-latest-posts"),initialOpen:!1},Object(r.createElement)(l.SelectControl,{label:Object(i.__)("Select a category:","rather-simple-infinite-latest-posts"),value:t.id,options:c,onChange:t=>{e.setAttributes({id:Number(t)})}}))),Object(r.createElement)(p.a,{block:"occ/rather-simple-infinite-latest-posts",attributes:t}))},save:()=>null};Object(o.registerBlockType)("occ/rather-simple-infinite-latest-posts",u),n(7)}]);