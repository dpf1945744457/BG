<template>
  <div style="height:100%;position: relative;">
    <!-- <div>
      经度：
      <input type name id="address_lng" value="经度" v-model="lngtxt" />
      纬度：
      <input type name id="address_lat" value="纬度" v-model="lattxt" />
      地址：
      <input type name id="address" v-model="addresstxt" class="r-address" />
    </div> -->

    <input id="pac-input" class="controls" type="text" placeholder="Search Box">
    <div id="Gmaps"></div>

    <remote-js
      js-url="https://maps.googleapis.com/maps/api/js?v=3&key=AIzaSyDZVJc-6k3k2Q6bFkCouDCBuCerr2ZqWe0&libraries=places"
      :js-load-call-back="loadRongJs"
    ></remote-js>
  </div>
</template>
<script>
import RemoteJs from './remote';
export default {
  components: { RemoteJs },
  data() {
    return {
      map: '',
      lngtxt: '114.055513',
      lattxt: '22.53333',
      addresstxt: '中国广东省深圳市福田区福田ＣＢＤCBD的核心',
      infowindow: '',
      geocoder: '',
      marker: '',
      markersArray: []
    };
  },
  created() {
    // this.setiInit();
  },
  methods: {
    loadRongJs() {
      const that = this;
      var latlng = new google.maps.LatLng(this.lattxt, this.lngtxt);
      var myOptions = {
        zoom: 13,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      const map = new google.maps.Map(
        document.getElementById('Gmaps'),
        myOptions
      );
      this.map = map;
      const geocoder = new google.maps.Geocoder(); // 实例化地址解析
      this.geocoder = geocoder;
      // 监听点击地图事件
      google.maps.event.addListener(map, 'click', function(event) {
        that.placeMarker(event.latLng);
      });
      // Create the search box and link it to the UI element.
      var input = document.getElementById('pac-input');
      var searchBox = new google.maps.places.SearchBox(input);
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

      // Bias the SearchBox results towards current map's viewport.
      map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
      });

      var markers = [];
      // Listen for the event fired when the user selects a prediction and retrieve
      // more details for that place.
      searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
          return;
        }

        // Clear out the old markers.
        markers.forEach(function(marker) {
          marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
          if (!place.geometry) {
            console.log('Returned place contains no geometry');
            return;
          }
          var icon = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
          };
          // console.log(place.geometry.location.lat());
          that.mapClick(
            place.geometry.location.lng(),
            place.geometry.location.lat(),
            place.name
          );
          // Create a marker for each place.
          markers.push(
            new google.maps.Marker({
              map: map,
              icon: icon,
              title: place.name,
              position: place.geometry.location
            })
          );

          if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
        map.fitBounds(bounds);
      });
    },

    placeMarker(location) {
      const that = this;
      this.clearOverlays(this.infowindow); // 清除地图中的标记
      const marker = new google.maps.Marker({
        position: location,
        map: this.map
      });
      this.markersArray.push(marker);
      // 根据经纬度获取地址
      if (this.geocoder) {
        this.geocoder.geocode(
          {
            location: location
          },
          function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              if (results[0]) {
                that.attachSecretMessage(
                  marker,
                  results[0].geometry.location,
                  results[0].formatted_address
                );
              }
            } else {
              alert('Geocoder failed due to: ' + status);
            }
          }
        );
      }
    },
    attachSecretMessage(marker, piont, address) {
      //  lngtxt: "101.686855",
      // lattxt: "3.139003",
      // addresstxt: "吉隆坡",
      this.lngtxt = piont.lng();
      this.lattxt = piont.lat();
      this.addresstxt = address;
      var message =
        '<b>坐标:</b>' +
        piont.lat() +
        ' , ' +
        piont.lng() +
        '<br />' +
        '<b>地址:</b>' +
        address;
      var infowindow = new google.maps.InfoWindow({
        content: message,
        size: new google.maps.Size(50, 50)
      });
      this.infowindow = infowindow;
      infowindow.open(this.map, marker);
      if (typeof mapClick === 'function') { that.mapClick(piont.lng(), piont.lat(), address); }
    },
    // 删除所有标记阵列中消除对它们的引用
    clearOverlays(infowindow) {
      if (this.markersArray && this.markersArray.length > 0) {
        for (var i = 0; i < this.markersArray.length; i++) {
          this.markersArray[i].setMap(null);
        }
        this.markersArray.length = 0;
      }
      if (infowindow) {
        infowindow.close();
      }
    },
    mapClick(lng, lat, address) {
      this.lngtxt = lng;
      this.lattxt = lat;
      this.addresstxt = address;
    },
    callMethod() {
      const address = {
        lon: this.lngtxt,
        lat: this.lattxt,
        address: this.addresstxt
      };
      this.$emit('getlat', address)
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" >
#Gmaps {
  width: 100%;
  height: 550px;
  border-radius: 5px;
}
#pac-input {
  width: 400px;
  height: 40px;
  margin-top: 20px;
}
.pac-container.pac-logo {
  z-index: 99999999;
}
</style>
