/**
 * Created by lindsayhampton on 9/17/15.
 */

window.addEventListener("load", function(){
    var game = new Game();
});

var Game = (function(){
    function Game(){
        console.log("game created");
        //this.updateAll();
        this.screen = document.querySelector("#canvas");
        this.scoreTxt = document.querySelector("#score");
        this.score = 0;
        this.snd_shoot= new Audio("sounds/asteriods_shoot.wav");
        this.player = null;
        this.rocks = [];
        this.images = [];
        Game.ctx = this.screen.getContext("2d"); // access drawing api
        this.loadAssets(["player2.png", "rock1.png", "sf1.jpg"]);
    }
    Game.prototype.loadAssets = function(list){
      var that = this;
      var count = 0;
        (function loadAsset(){
            var img= new Image();
            img.src = "imgs/"+list[count];
            img.addEventListener("load", function(e){
                that.images.push(img);
                console.log("image loaded");
                count++;
                if (count<list.length){
                    loadAsset();
                } else {
                    console.log("All images loaded");
                    that.init();
                }
            });
        })();
    };

    Game.prototype.init = function(){
        Key.init();
        this.screen.style.background = "url("+this.images[2].src+")";
        this.player = new Player(this.images[0]);
        this.player.x = 400;
        this.player.y = 300;
        this.updateAll();
    };

    Game.prototype.createRocks = function(n,s,x,y){
        for (var i = 0; i < n; i++){
            var rock = new Rock(this.images[1]);
            rock.x=x;
            rock.y=y;
            rock.setScale(s);
            rock.ele.addEventListener("rockhit",this.rockHit.bind(this));
            this.rocks.push(rock);
        }
    };

    Game.prototype.updateAll = function(){
        var that = this;
        (function drawFrame(){
            window.requestAnimationFrame(drawFrame);
            Game.ctx.clearRect(0,0,screen.width, screen.height);
            that.player.update();
        })()
    };
    return Game;
})();

var Sprite = (function(){
    function Sprite(img){
        this.x=0;
        this.y=0;
        this.scale=1;
        this.width= img.width;
        this.height = img.height;
        this.ctx = Game.ctx;
        this.ele = document.createElement("null");
        if (img!=false){
            this.image= img;
        }
        this.rotate = 0;
        console.log("sprite created");
    }
    Sprite.prototype.setScale = function(value){
        this.scale = value;
        this.width = this.image.width*this.scale;
        this.height= this.image.height*this.scale;
    };
    Sprite.prototype.stageWrap = function(){
        if (this.x>800+this.width*.5){
            this.x = -this.width*.5
        } else if (this.x<-this.width*.5){
            this.x = 800+this.width*.5;
        } else if (this.y>600+this.height*.5){
            this.y = -this.height*.5;
        } else if (this.y<-this.height*.5){
            this.y = 600+this.height*.5
        }
    };
    Sprite.prototype.draw = function(){
        this.ctx.save();
        this.rotate = this.rotate%360;
        var rad = this.rotate*.01745; //PI div 180
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(rad);
        this.ctx.scale(this.scale,this.scale);
        if (this.image!=undefined) this.ctx.drawImage(this.image, -(this.image.width *.5), -(this.image.height *.5));
        this.ctx.restore();
    };
    Sprite.prototype.drawBullet = function(){
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 5, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = "red";
        this.ctx.fill();
        this.ctx.restore();
    };
    return Sprite;
})();

var Player = (function(){
    Player.prototype = Object.create(Sprite.prototype);
    function Player(img){
        Sprite.call(this, img);
        this.speedX=0;
        this.speedY=0;
        this.shotClock=0;
        this.state="normal";
        console.log("player created");
    }
    Player.prototype.update = function(){
        if(Key.keys[37]){
            this.rotate-=5;
        }
        if(Key.keys[39]){
            this.rotate+=5;
        }
        if(Key.keys[38]){
            var a = this.rotate*.01745;
            this.speedX+=Math.cos(a)*.4;
            this.speedY+=Math.sin(a)*.4;
            var m = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY);
            if (m > 5){
                this.speedX = this.speedX / m * 5;
                this.speedY = this.speedY / m * 5;
            }
        }
        if(Key.keys[39]){
            this.rotate+=5;
        }
        this.x += this.speedX;
        this.y += this.speedY;

        this.stageWrap();
        this.draw();
    };
    return Player;
})();

var Rock = (function(){
    Rock.prototype = Object.create(Sprite.prototype);
    function Rock(img){
        Sprite.call(this, img);
        this.speed=~(Math.random()*5+3);
        this.alive = true;
        var a = Math.random()*6.28;
        this.vx = Math.cos(a);
        this.vy = Math.sin(a);
        this.points = 25;
        console.log("rock created");
    }

    return Rock;
})();

var Key = (function(){
    function Key(){
        console.log("key created");
    }
    Key.init = function(){
        Key.keys = [];
        window.addEventListener("keydown", Key.onKeyDown);
        window.addEventListener("keyup", Key.onKeyUp);
    };
    Key.onKeyDown = function(e){
        Key.keys[e.keyCode]=1;
    };
    Key.onKeyUp = function(e){
        Key.keys[e.keyCode]=0;
    };
    return Key;
})();

var Bullet = (function(){
    function Bullet(){
        console.log("bullet created");
    }
    return Bullet;
})();