(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{579:function(t,e,n){"use strict";n.r(e);var r=n(249),o=n(525),c=n(574),l=n(182),d=n(187),m=n(524),f=n(24),h=(n(81),n(3),n(11),{name:"ContactPage",data:function(){return{data:[],headers:null}},methods:{getAllContactInformation:function(){var t=this;return Object(f.a)(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",fetch("https://consultingweb.duckdns.org/api/v1/application/list",{headers:{AUTHORIZATION:"Bearer ".concat(JSON.parse(localStorage.getItem("user")).data.token)}}).then((function(t){return t.json()})).then((function(e){return t.data=e.data.content})).catch((function(t){return console.log(t)})));case 1:case"end":return e.stop()}}),e)})))()},deleteContact:function(t){var e=this;return Object(f.a)(regeneratorRuntime.mark((function n(){return regeneratorRuntime.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,fetch("https://consultingweb.duckdns.org/api/v1/application/delete/   ".concat(t),{method:"DELETE",headers:{AUTHORIZATION:"Bearer ".concat(JSON.parse(localStorage.getItem("user")).data.token)}}).then((function(t){return t.json()})).then((function(n){e.data=e.data.filter((function(e){return e.id!==t}))})).catch((function(t){return console.log(t.message)}));case 2:case"end":return n.stop()}}),n)})))()}},mounted:function(){this.getAllContactInformation()},beforeMount:function(){this.headers=[{text:this.$root.$t("contactPage.dataTable.name"),align:"start",sortable:!1,value:"fullName",width:200},{text:this.$root.$t("contactPage.dataTable.description"),align:"start",sortable:!1,width:200,value:"description"},{text:this.$root.$t("contactPage.dataTable.phoneNumber"),align:"center",sortable:!1,width:200,value:"phoneNumber"},{text:this.$root.$t("contactPage.dataTable.email"),align:"center",sortable:!1,width:200,value:"email"},{text:this.$root.$t("contactPage.dataTable.action"),align:"center",sortable:!1,value:"action",width:180}]}}),v=n(90),component=Object(v.a)(h,(function(){var t=this,e=t._self._c;return e(m.a,[e(o.a,{staticClass:"mt-5 col-12 overflow-hidden"},[t.data.length>0?e(c.a,{attrs:{headers:t.headers,items:t.data},scopedSlots:t._u([{key:"item.name",fn:function(n){var r=n.value;n.item;return[e("span",[t._v("\n          "+t._s(r)+"\n        ")])]}},{key:"item.description",fn:function(n){var r=n.value;n.item;return[e("span",[t._v("\n          "+t._s(r)+"\n        ")])]}},{key:"item.phoneNumber",fn:function(n){var r=n.value;n.item;return[e("span",[t._v(" "+t._s(r)+" ")])]}},{key:"item.email",fn:function(n){var r=n.value;n.item;return[e("span",[t._v("\n          "+t._s(r)+"\n        ")])]}},{key:"item.action",fn:function(n){var o=n.item;return[e(r.a,{staticClass:"mx-2",attrs:{color:"red",dark:""},on:{click:function(e){return t.deleteContact(o.id)}}},[e(l.a,[t._v("mdi-delete")])],1)]}}],null,!1,2029636353)}):e(o.a,{attrs:{align:"center"}},[e(d.a,{attrs:{"lazy-src":"https://img.freepik.com/premium-vector/folder-found_22110-498.jpg?w=2000","max-height":"350","max-width":"350",src:"https://img.freepik.com/premium-vector/folder-found_22110-498.jpg?w=2000"}})],1)],1)],1)}),[],!1,null,null,null);e.default=component.exports}}]);