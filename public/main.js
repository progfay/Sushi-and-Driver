console.log(hiyari);


const VSS_SPEED     = 'Signal.Drivetrain.Transmission.Speed',
      GPS_LATITUDE  = 'Signal.Cabin.Infortainment.Navigation.Currentlocation.Latitude',
      GPS_LONGITUDE = 'Signal.Cabin.Infortainment.Navigation.Currentlocation.Longitude',
      DRV_ATTENTIVENESS = 'Private.Signal.Driver.Attentiveness',
      VISS_IP    = '52.200.145.70',
      VISS_PORT  = '3001',
      ROOM_ID    = 'Turtle';

const viscOption = {
  'host': VISS_IP
  ,'protocol': 'ws://'
  ,'port': VISS_PORT
  ,'roomId': ROOM_ID
};

var vias = new VISClient( viscOption );

let hiyariPoints = [];

let vm = new Vue({
    el : "#app",
    data : {
        message : "hello world",
        isLogin : false,
        isDriving : false,
        token : "",
        user : {
            name : "",
            coins : "",
            sushi : {}
        },
        car : {
            lat : 0,
            lon : 0,
            speed : 0,
            attentiveness : 0,
        },
        loginData : {
            name : "",
            password : ""
        },
        signupData : {
            name : "",
            password : ""
        }
    },
    beforeCreate(){
        let token = localStorage.getItem("sushi-token");
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
        axios.get("/api/user")
            .then( res => {
                this.user = res.data;
                this.isLogin = true;
                console.log(res);
            }).catch( err => {
                console.log(err);
            });

        vias.connect( () => {
            vias.subscribe(VSS_SPEED, val => {
                    this.car.speed = val;
                }, err => { console.log(err);
            });
            vias.subscribe(GPS_LATITUDE, val => {
                    this.car.lat = val;
                }, err => { console.log(err);
            });
            vias.subscribe(GPS_LONGITUDE, val => {
                    this.car.lon = val;
                }, err => { console.log(err);
            });

            vias.subscribe(DRV_ATTENTIVENESS, val => {
                    this.car.attentiveness = val;
                }, err =>  { console.log(err);
            });
              },
              (_err) => {
                // Connect error
                err => {console.log(err)};
            });
        
    },
    methods : {
        login(){
            axios.post("/login",{
                    name : this.loginData.name,
                    password : this.loginData.password
                }).then( res => {
                    this.token = res.data.token;
                    axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.token;

                    axios.get("/api/user")
                        .then( res => {
                            this.user = res.data;
                            localStorage.setItem("sushi-token", this.token)
                            this.isLogin = true;
                            console.log(res);
                        }).catch( err => {
                            console.log(err);
                        });

                }).catch( err => {
                    console.log(err);
                }).then( () => {
                    this.loginData.name = "";
                    this.loginData.password = "";
                });
        },
        signup(){
            axios.post("/signup",{
                    name : this.signupData.name,
                    password : this.signupData.password
                }).then( res => {
                    console.log(res);
                }).catch( err => {
                    console.log(err);
                });
        },
        logout(){
            localStorage.removeItem("sushi-token");
            this.user = {};
            this.isLogin = false;
        },
        getCoin(){
            axios.put("/api/coin")
                .then( res => {
                    this.user.coins = res.data.coins;
                }).catch( err => {
                    console.log(err);
                });
        },
        getSushi(){
            axios.put("/api/sushi")
                .then( res => {
                    this.user.coins = res.data.coins;
                    this.user.sushi = res.data.sushi;
                }).catch( err => {
                    console.log(err);
                });
        },
        startDrive(){
            listenStart();
            console.log(this.car.lat, this.car.lon, this.car.speed);

            let lat = this.car.lat;
            let lon = this.car.lon;

            hiyariPoints = hiyari.result.list.filter( pos => (pos.latitude > lat - 0.5 &&  pos.latitude < lat + 0.5 && pos.longitude > lon - 0.5 && pos.longitude < lon + 0.5));
            console.log(hiyariPoints);
            resizeMovieExp();
            this.isDriving = true;
        },
        stopDrive(){
            listenStop();
            this.isDriving = false;
        },
        nearHiyari(near){
            let lat = this.car.lat;
            let lon = this.car.lon;
            return hiyariPoints.filter( pos => (pos.latitude > lat - near &&  pos.latitude < lat + near && pos.longitude > lon - near && pos.longitude < lon + near)).length;
        }
    }
});