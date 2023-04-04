(()=>{let t;mapboxgl.accessToken="pk.eyJ1IjoiYmhhZ2FzIiwiYSI6ImNsZnNlaXRqNjA1ZDAzY2wydzhkNndpbWEifQ.7fH0v4wHwHD9n1dJFM8gXA";const e=new mapboxgl.Map({container:"map",style:"mapbox://styles/mapbox/traffic-night-v2",center:[110.416664,-6.966667],zoom:9});e.on("load",(()=>{e.loadImage("https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png",((a,o)=>{if(a)throw a;e.addImage("custom-marker",o,{sdf:!0}),e.addSource("route",{type:"geojson",data:{type:"FeatureCollection",features:[]}}),e.addLayer({id:"route",type:"line",source:"route",paint:{"line-width":["get","stroke-width"],"line-color":["get","stroke"]},filter:["==","$type","LineString"]}),e.addLayer({id:"titik",type:"symbol",source:"route",layout:{"icon-allow-overlap":!0,"text-field":["get","marker-symbol"],"icon-image":"custom-marker","text-font":["Open Sans Semibold","Arial Unicode MS Bold"],"text-offset":[0,1.25],"text-anchor":"top"},paint:{"text-color":["get","marker-color"],"icon-color":["get","marker-color"]},filter:["==","$type","Point"]}),e.on("click","route",(a=>{let o="",n=new Date(1e3*a.features[0].properties.duration).toISOString().substring(11,16).split(":");o+="rute untuk mobil ke: "+a.features[0].properties.route,o+="</br>Jarak PP: "+(a.features[0].properties.distance/1e3).toFixed(2)+" Km",o+="</br>Waktu tempuh PP: "+n[0]+" Jam "+n[1]+" Menit",t=(new mapboxgl.Popup).setLngLat(a.lngLat).setHTML(o).addTo(e)})),e.on("click","titik",(a=>{let o="";console.log(a.features[0]),o+="pemberhentian ke: "+a.features[0].properties.stop,t=(new mapboxgl.Popup).setLngLat(a.lngLat).setHTML(o).addTo(e)})),e.on("mouseenter","route",(()=>{e.getCanvas().style.cursor="pointer"})),e.on("mouseleave","route",(()=>{e.getCanvas().style.cursor=""})),e.on("mouseenter","titik",(()=>{e.getCanvas().style.cursor="pointer"})),e.on("mouseleave","titik",(()=>{e.getCanvas().style.cursor=""}))})),e.on("click",(a=>{if(0===e.queryRenderedFeatures(a.point).filter((t=>"route"===t.source)).length&&0===e.queryRenderedFeatures(a.point).filter((t=>"titik"===t.source)).length){let o=`${a.lngLat.lng} ${a.lngLat.lat}\n          <div>\n            <button type="submit" id="jadikan_depot" x="${a.lngLat.lng}" y="${a.lngLat.lat}" class="btn btn-primary btn-block">Jadikan Depot</button>\n            <button type="submit" id="jadikan_tujuan" x="${a.lngLat.lng}" y="${a.lngLat.lat}" class="btn btn-primary btn-block">Tambahkan ke Tujuan</button>\n            </div>\n          `;t=(new mapboxgl.Popup).setLngLat(a.lngLat).setHTML(o).addTo(e)}}))})),$("#tambah").click((function(){$("#tabelnya").append('<tr><td><input type="text" class="lng form-control"></td><td><input type="text" class="lat form-control"></td><td><input type="text" class="volume form-control"></td><td><input type="text" class="berat form-control"></td></tr>')})),$("#selesaikan").click((async function(){var t=$(".lng").map(((t,e)=>e.value)).get(),a=$(".lat").map(((t,e)=>e.value)).get(),o=$(".volume").map(((t,e)=>e.value)).get(),n=$(".berat").map(((t,e)=>e.value)).get();let l=[[Number($("#depot_long").val()),Number($("#depot_lat").val())]],r=[0];for(let e=0;e<t.length;e++){let s=100*n[e]/Number($("#berat_max").val()),i=100*o[e]/Number($("#volume_max").val()),u=Math.max(s,i);console.log(u),l.push([Number(t[e]),Number(a[e])]),r.push(Number(u))}let s={locations:l,depotIndex:0,numVehicles:Number($("#jumlah_kendaraan").val()),vehicleCapacity:100,demands:r,computeTimeLimit:1500,waktu_antar:Number($("#waktu_antar").val())},i=await axios.post("http://fosan.id:8854/selesaikan",s);i&&e.getSource("route").setData(i.data.geojson)})),$("#map").on("click","#jadikan_depot",(function(){$("#depot_long").val($(this).attr("x")),$("#depot_lat").val($(this).attr("y")),t.remove()})),$("#map").on("click","#jadikan_tujuan",(function(){$("#tabelnya").append(`<tr><td><input type="text" class="lng form-control" value="${$(this).attr("x")}"></td><td><input type="text" value="${$(this).attr("y")}" class="lat form-control"></td>\n    <td><input type="text" class="volume form-control"></td><td><input type="text" class="berat form-control"></td>\n        <td><a href="#" class="DeleteButton">Hapus</a></td>\n        </tr>`),t.remove()})),$("#tabelnya").on("click",".DeleteButton",(function(){$(this).closest("tr").remove()}))})();