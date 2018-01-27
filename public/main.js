console.log(hiyari);


const VSS_SPEED  = 'Signal.Drivetrain.Transmission.Speed',
      VISS_IP = '52.200.145.70',
      VISS_PORT='3001',
      ROOM_ID = 'Turtle';

const viscOption = {
  'host': VISS_IP
  ,'protocol': 'ws://'
  ,'port': VISS_PORT
  ,'roomId': ROOM_ID
};

var vias = new VISClient( viscOption );


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
            this.isDriving = true;
        },
        stopDrive(){
            listenStop();
            this.isDriving = false;
        }
    }
});