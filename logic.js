$('#files').bind('change', handleDialog);
let popop;
let data_sj=[];
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
    $('#tabelnya').append(`<tr><td><input type="text" class="lng form-control"></td><td><input type="text" class="lat form-control"></td><td><input type="text" class="volume form-control"></td><td><input type="text" class="berat form-control"></td> <td><a href="#" class="DeleteButton">Hapus</a></td></tr>`)
})

$('#selesaikan').click(async function() {
    var lng = $('.lng').map((_,el) => el.value).get();
    var lat = $('.lat').map((_,el) => el.value).get();
    var volume = $('.volume').map((_,el) => el.value).get();
    var berat = $('.berat').map((_,el) => el.value).get();

    let koordinat =[[Number($('#depot_long').val()), Number($('#depot_lat').val())]];
    let demands = [0];
    for (let i = 0; i < lng.length; i++) {
        // let total_berat = (berat[i] * 100) / Number($('#berat_max').val())
        // let total_volume = (volume[i] *100) / Number($('#volume_max').val())
        // let max = Math.max(total_berat, total_volume);
        // let demand = 0;
        // if(max>100){
        //     // alert('1 tujuan melebihi kapasitas 1 kendaraan');
        //     demand =100;
        // }
        //  demand = (total_berat + total_volume)/2;
        // if(demand>50){
        //     // alert('1 tujuan melebihi kapasitas 1 kendaraan');
        //     demand = 100;
        // }
        // console.log(demand, total_berat, total_volume);
        let demand = Math.round(0.5 * berat[i]) + Math.round(0.5 * volume[i])
       koordinat.push([Number(lng[i]), Number(lat[i])])
        demands.push(Number(demand))
    }
    let final = {
                "locations": koordinat,
                "depotIndex": 0,
                "numVehicles": Number($('#jumlah_kendaraan').val()),
                "vehicleCapacity": (0.5 * Number($('#berat_max').val())) + (0.5 * Number($('#volume_max').val())),
                "demands":demands,
                "computeTimeLimit": 5000,
                "waktu_antar":Number($('#waktu_antar').val())
            }
            // console.log(final);
  let data = await  axios.post('http://fosan.id:8854/selesaikan', final);
//   console.log(data);
  $('#isi_tabel').empty();
            if(data){
                
                if(data_sj.length){
                    let no =0;
                    // console.log(data_sj, 'data_sj');
                    for (let u = 0; u < data.data.result.routes.length; u++) {
                        for (let x = 0; x < data.data.result.routes[u].length; x++) {
                            // console.log(data.data.result.routes[u][x]);
                            let inde=(data.data.result.routes[u][x]-1);
                            $('#isi_tabel').append(  `      <tr>
                            <td>${no++}</td>
                            <td>${u+1}</td>
                            <td>${data_sj[inde]['No SJ']}</td>
                            <td>${data_sj[inde]['Nama Customer']}</td>
                            <td>${data_sj[inde].M2}</td>
                            <td>${data_sj[inde].KG}</td>
                            <td>${x+1}</td>
                        </tr>`)
                            
                        }
                        
                    }
                  
                }
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

function handleDialog(event) {
    var files = event.target.files;
    var file = files[0];

    var fileInfo = `
      <span style="font-weight:bold;">${escape(file.name)}</span><br>
      - FileType: ${file.type || 'n/a'}<br>
      - FileSize: ${file.size} bytes<br>
      - LastModified: ${file.lastModifiedDate ? file.lastModifiedDate.toLocaleDateString() : 'n/a'}
    `;
    // $('#file-info').append(fileInfo);
    console.log(fileInfo);

    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(event){
      var csv = event.target.result;
       data_sj = $.csv.toObjects(csv);
    //   $('#result').empty();
    //   $('#result').html(JSON.stringify(data, null, 2));
  
    for (let i = 0; i < data_sj.length; i++) {
        data_sj[i].Latitude = data_sj[i].Latitude.replace(',','.');
        data_sj[i].Longitude = data_sj[i].Longitude.replace(',','.');
        data_sj[i].KG = data_sj[i].KG.replace(',','.');
        data_sj[i].M2 = data_sj[i].M2.replace(',','.');
        $('#tabelnya').append(`<tr><td><input type="text" class="lng form-control" value="${data_sj[i].Latitude}"></td>
        <td><input type="text" class="lat form-control" value="${data_sj[i].Longitude}"></td>
        <td><input type="text" class="volume form-control" value="${data_sj[i].M2}"></td>
        <td><input type="text" class="berat form-control" value="${data_sj[i].KG}"></td>
        <td><a href="#" class="DeleteButton">Hapus</a></td></tr>`)
    }
    console.log(data_sj);
    }
  }