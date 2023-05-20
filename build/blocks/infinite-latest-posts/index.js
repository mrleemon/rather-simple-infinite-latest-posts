!function(){"use strict";var e,t={847:function(){var e=window.wp.element,t=window.wp.i18n,n=window.wp.blocks,r=window.wp.components,s=window.wp.blockEditor,i=window.wp.data,o=window.wp.htmlEntities,a=(window.wp.serverSideRender,JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":2,"name":"occ/rather-simple-infinite-latest-posts","title":"Rather Simple Infinite Latest Posts","description":"Display latest posts.","textdomain":"rather-simple-infinite-latest-posts","category":"common","attributes":{"category":{"type":"integer","default":0},"number":{"type":"integer","default":5}},"supports":{"spacing":{"margin":true,"padding":true}},"editorScript":"file:./index.js","style":"file:./style-index.css"}'));const{name:l}=a,p={icon:(0,e.createElement)(r.SVG,{viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg"},(0,e.createElement)(r.Path,{fill:"none",d:"M0 0h24v24H0V0z"}),(0,e.createElement)(r.G,null,(0,e.createElement)(r.Path,{d:"M20 4v12H8V4h12m0-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 9.67l1.69 2.26 2.48-3.1L19 15H9zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z"}))),edit:n=>{const a=(0,s.useBlockProps)(),{attributes:l,className:p}=n,c=(0,i.useSelect)((e=>e("core").getEntityRecords("taxonomy","category",{per_page:-1})),[]),u=(0,i.useSelect)((e=>e("core").getEntityRecords("postType","post",{order:"desc",orderby:"date",status:"publish",categories:l.category?l.category:[],per_page:l.number})),[l.category,l.number]);if(!c)return(0,t.__)("Loading...","rather-simple-infinite-latest-posts");if(0===c.length)return(0,t.__)("No categories found","rather-simple-infinite-latest-posts");var m=[];m.push({label:(0,t.__)("Select a category...","rather-simple-infinite-latest-posts"),value:""});for(var d=0;d<c.length;d++)m.push({label:c[d].name,value:c[d].id});return u?0===u.length?(0,t.__)("No posts found","rather-simple-infinite-latest-posts"):(0,e.createElement)(e.Fragment,null,(0,e.createElement)(s.InspectorControls,null,(0,e.createElement)(r.PanelBody,{title:(0,t.__)("Settings","rather-simple-infinite-latest-posts")},(0,e.createElement)(r.SelectControl,{label:(0,t.__)("Select a category:","rather-simple-infinite-latest-posts"),value:l.category,options:m,onChange:e=>{n.setAttributes({category:parseInt(e)})}}),(0,e.createElement)(r.RangeControl,{label:(0,t.__)("Number of posts to show:","rather-simple-infinite-latest-posts"),value:l.number,onChange:e=>{n.setAttributes({number:parseInt(e)})},min:1,max:20}))),u.length&&(0,e.createElement)("div",a,(n=>n.map(((n,r)=>(0,e.createElement)("article",{id:`post-${n.id}`,className:"post",key:r},(0,e.createElement)("h2",{className:"wp-block-occ-rather-simple-infinite-latest-posts__post-title"},n.title.rendered?(0,o.decodeEntities)(n.title.rendered):(0,t.__)("(no title)","rather-simple-infinite-latest-posts")),(0,e.createElement)("div",{className:"wp-block-occ-rather-simple-infinite-latest-posts__post-content",dangerouslySetInnerHTML:{__html:n.content.rendered}})))))(u),(0,e.createElement)("input",{type:"button",class:"wp-element-button",value:"Load More"}))):(0,t.__)("Loading...","rather-simple-infinite-latest-posts")},save:()=>null};(0,n.registerBlockType)(l,p)}},n={};function r(e){var s=n[e];if(void 0!==s)return s.exports;var i=n[e]={exports:{}};return t[e](i,i.exports,r),i.exports}r.m=t,e=[],r.O=function(t,n,s,i){if(!n){var o=1/0;for(c=0;c<e.length;c++){n=e[c][0],s=e[c][1],i=e[c][2];for(var a=!0,l=0;l<n.length;l++)(!1&i||o>=i)&&Object.keys(r.O).every((function(e){return r.O[e](n[l])}))?n.splice(l--,1):(a=!1,i<o&&(o=i));if(a){e.splice(c--,1);var p=s();void 0!==p&&(t=p)}}return t}i=i||0;for(var c=e.length;c>0&&e[c-1][2]>i;c--)e[c]=e[c-1];e[c]=[n,s,i]},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},function(){var e={973:0,880:0};r.O.j=function(t){return 0===e[t]};var t=function(t,n){var s,i,o=n[0],a=n[1],l=n[2],p=0;if(o.some((function(t){return 0!==e[t]}))){for(s in a)r.o(a,s)&&(r.m[s]=a[s]);if(l)var c=l(r)}for(t&&t(n);p<o.length;p++)i=o[p],r.o(e,i)&&e[i]&&e[i][0](),e[i]=0;return r.O(c)},n=self.webpackChunkrather_simple_infinite_latest_posts=self.webpackChunkrather_simple_infinite_latest_posts||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))}();var s=r.O(void 0,[880],(function(){return r(847)}));s=r.O(s)}();