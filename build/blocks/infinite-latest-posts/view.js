!function(){var t=document.querySelector(".wp-block-occ-rather-simple-infinite-latest-posts .load-more"),e=sessionStorage.getItem("posts-offset"),s=sessionStorage.getItem("posts-total");null!==e&&(t.dataset.offset=e),null!==s&&(t.dataset.total=s);var o=document.querySelector(".wp-block-occ-rather-simple-infinite-latest-posts .infinite-posts");window.addEventListener("beforeunload",(()=>{sessionStorage.setItem("posts-offset",t.dataset.offset),sessionStorage.setItem("posts-total",t.dataset.total),sessionStorage.setItem("posts-html",o.innerHTML)})),document.addEventListener("DOMContentLoaded",(function(){var t=document.querySelector(".sidebar"),e=document.querySelector(".wp-block-occ-rather-simple-infinite-latest-posts .load-more");if(e){var s=new XMLHttpRequest;s.addEventListener("load",(function(){for(var s="",o=JSON.parse(this.response),n=o.posts,a=o.numposts,r=0;r<n.length;r++){var i=n[r];s+='<article id="post-'+i.ID+'" class="wp-block-occ-rather-simple-infinite-latest-posts__post">',s+='<h2 class="wp-block-occ-rather-simple-infinite-latest-posts__post-title">'+i.post_title+"</h2>",s+='<div class="wp-block-occ-rather-simple-infinite-latest-posts__post-content">'+i.post_content+"</div>",i.post_edit_link&&(s+='<div class="wp-block-occ-rather-simple-infinite-latest-posts__post-meta"><span class="edit-link">'+i.post_edit_link+"</span></div>"),s+="</article>"}document.querySelector(".wp-block-occ-rather-simple-infinite-latest-posts .infinite-posts").insertAdjacentHTML("beforeend",s);var l=sessionStorage.getItem("sidebar-scroll");null!==l&&(t.scrollTop=parseInt(l,10)),parseInt(e.getAttribute("data-total"))<=a&&(e.style.display="block")})),s.addEventListener("error",(function(){}));var o="?category="+encodeURIComponent(e.getAttribute("data-category"))+"&number="+encodeURIComponent(e.getAttribute("data-number"))+"&offset=0&total="+encodeURIComponent(e.getAttribute("data-total"));s.open("GET",rsilp_params_rest.rest_url+"rsilp/v1/posts/"+o),s.setRequestHeader("X-WP-Nonce",rsilp_params_rest.rest_nonce),s.send()}window.addEventListener("beforeunload",(()=>{sessionStorage.setItem("sidebar-scroll",t.scrollTop)})),(e=document.querySelector(".wp-block-occ-rather-simple-infinite-latest-posts .load-more"))&&e.addEventListener("click",(function(t){t.preventDefault();var s=new XMLHttpRequest;s.addEventListener("load",(function(){for(var t="",s=JSON.parse(this.response),o=s.posts,n=s.numposts,a=0;a<o.length;a++){var r=o[a];t+='<article id="post-'+r.ID+'" class="wp-block-occ-rather-simple-infinite-latest-posts__post">',t+='<h2 class="wp-block-occ-rather-simple-infinite-latest-posts__post-title">'+r.post_title+"</h2>",t+='<div class="wp-block-occ-rather-simple-infinite-latest-posts__post-content">'+r.post_content+"</div>",r.post_edit_link&&(t+='<div class="wp-block-occ-rather-simple-infinite-latest-posts__post-meta"><span class="edit-link">'+r.post_edit_link+"</span></div>"),t+="</article>"}document.querySelector(".wp-block-occ-rather-simple-infinite-latest-posts .infinite-posts").insertAdjacentHTML("beforeend",t),e.setAttribute("data-offset",parseInt(e.getAttribute("data-offset"))+parseInt(e.getAttribute("data-number")));var i=parseInt(e.getAttribute("data-total"))+parseInt(e.getAttribute("data-number"));e.setAttribute("data-total",i),i>=n&&(e.style.display="none")})),s.addEventListener("error",(function(){}));var o="?category="+encodeURIComponent(e.getAttribute("data-category"))+"&number="+encodeURIComponent(e.getAttribute("data-number"))+"&offset="+encodeURIComponent(e.getAttribute("data-offset"))+"&total="+encodeURIComponent(e.getAttribute("data-number"));s.open("GET",rsilp_params_rest.rest_url+"rsilp/v1/posts/"+o),s.setRequestHeader("X-WP-Nonce",rsilp_params_rest.rest_nonce),s.send()}))}))}();