let popop;
mapboxgl.accessToken = 'pk.eyJ1IjoiYmhhZ2FzIiwiYSI6ImNsZnNlaXRqNjA1ZDAzY2wydzhkNndpbWEifQ.7fH0v4wHwHD9n1dJFM8gXA';
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/traffic-night-v2', // style URL
center: [110.416664, -6.966667], // starting position [lng, lat]
zoom: 9, // starting zoom
});
map.on('load', () => {
    map.loadImage('https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',(error, image) => {
                if (error) throw error;
                map.addImage('custom-marker', image,  { sdf: true });
    map.addSource('route', {
    'type': 'geojson',
        'data': {
            "type": "FeatureCollection",
            "features": []
            }
});
    map.addLayer({
    'id': 'route',
    'type': 'line',
    'source': 'route',
    'paint': {
        'line-width': ['get', 'stroke-width'],
        // Use a get expression (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-get)
        // to set the line-color to a feature property value.
        'line-color': ['get', 'stroke']
        },
        'filter': ['==', '$type', 'LineString']
    });
    map.addLayer({
            'id': 'titik',
            'type': 'symbol',
            'source': 'route',
            'layout': {
                // get the title name from the source's "title" property
                'icon-allow-overlap': true,
                'text-field': ['get', 'marker-symbol'],
                'icon-image': 'custom-marker',
                'text-font': [
                'Open Sans Semibold',
                'Arial Unicode MS Bold'
                ],
                'text-offset': [0, 1.25],
                'text-anchor': 'top'
                },
            'paint':{
                'text-color': ['get', 'marker-color'],
                'icon-color': ['get', 'marker-color'],
            },
            'filter': ['==', '$type', 'Point']
            });

            map.on('click', 'route', (e) => {
                // Copy coordinates array.
                let description = "";
                // console.log(e.features[0]);
                   let waktu_tempuh = new Date(e.features[0].properties.duration * 1000).toISOString().substring(11, 16).split(":")
                    description+="rute untuk mobil ke: "+ e.features[0].properties.route;
                    description+="</br>Jarak PP: "+ (e.features[0].properties.distance / 1000).toFixed(2)+" Km"
                    description+="</br>Waktu tempuh PP: "+ waktu_tempuh[0]+' Jam'+" "+waktu_tempuh[1]+' Menit'
                
             
               
                
               popop= new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML(description)
                .addTo(map);
                });

                map.on('click', 'titik', (e) => {
                // Copy coordinates array.
                let description = "";
                console.log(e.features[0]);
               
                description+="pemberhentian ke: "+ e.features[0].properties.stop
                
             
               
                
               popop= new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML(description)
                .addTo(map);
                });
                            map.on('mouseenter', 'route', () => {
                            map.getCanvas().style.cursor = 'pointer';
                            });
                            
                            // Change it back to a pointer when it leaves.
                            map.on('mouseleave', 'route', () => {
                            map.getCanvas().style.cursor = '';
                            });

                            map.on('mouseenter', 'titik', () => {
                            map.getCanvas().style.cursor = 'pointer';
                            });
                            
                            // Change it back to a pointer when it leaves.
                            map.on('mouseleave', 'titik', () => {
                            map.getCanvas().style.cursor = '';
                            });
        })

        map.on('click', (e) => {
            if (map.queryRenderedFeatures(e.point).filter(feature => feature.source === 'route').length === 0 && map.queryRenderedFeatures(e.point).filter(feature => feature.source === 'titik').length === 0) {
                // console.log(e);
          let html = `${e.lngLat.lng} ${e.lngLat.lat}
          <div>
            <button type="submit" id="jadikan_depot" x="${e.lngLat.lng}" y="${e.lngLat.lat}" class="btn btn-primary btn-block">Jadikan Depot</button>
            <button type="submit" id="jadikan_tujuan" x="${e.lngLat.lng}" y="${e.lngLat.lat}" class="btn btn-primary btn-block">Tambahkan ke Tujuan</button>
            </div>
          `;
          popop= new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML(html)
                .addTo(map);
        }
         
               
            });
        })


$('#tambah').click(function() {
    $('#tabelnya').append(`<tr><td><input type="text" class="lng form-control"></td><td><input type="text" class="lat form-control"></td><td><input type="text" class="volume form-control"></td><td><input type="text" class="berat form-control"></td></tr>`)
})

$('#selesaikan').click(async function() {
    var lng = $('.lng').map((_,el) => el.value).get();
    var lat = $('.lat').map((_,el) => el.value).get();
    var volume = $('.volume').map((_,el) => el.value).get();
    var berat = $('.berat').map((_,el) => el.value).get();

    let koordinat =[[Number($('#depot_long').val()), Number($('#depot_lat').val())]];
    let demands = [0];
    for (let i = 0; i < lng.length; i++) {
        let total_berat = (berat[i] * 100) / Number($('#berat_max').val())
        let total_volume = (volume[i] *100) / Number($('#volume_max').val())
        let demand = Math.max(total_berat, total_volume);
        console.log(demand);
       koordinat.push([Number(lng[i]), Number(lat[i])])
        demands.push(Number(demand))
    }
    let final = {
                "locations": koordinat,
                "depotIndex": 0,
                "numVehicles": Number($('#jumlah_kendaraan').val()),
                "vehicleCapacity": 100,
                "demands":demands,
                "computeTimeLimit": 1500,
                "waktu_antar":Number($('#waktu_antar').val())
            }
            // console.log(final);
  let data = await  axios.post('http://fosan.id:8854/selesaikan', final);
            if(data){
           
                map.getSource('route').setData(data.data.geojson);
            }
            

})



$("#map").on("click", "#jadikan_depot", function() {
    $('#depot_long').val($(this).attr("x"))
    $('#depot_lat').val($( this ).attr("y"))
    popop.remove();
})
$("#map").on("click", "#jadikan_tujuan", function() {
    $('#tabelnya').append(`<tr><td><input type="text" class="lng form-control" value="${$( this ).attr("x")}"></td><td><input type="text" value="${$( this ).attr("y")}" class="lat form-control"></td>
    <td><input type="text" class="volume form-control"></td><td><input type="text" class="berat form-control"></td>
        <td><a href="#" class="DeleteButton">Hapus</a></td>
        </tr>`)
        popop.remove();
})


$("#tabelnya").on("click", ".DeleteButton", function() {
$(this).closest("tr").remove();
});