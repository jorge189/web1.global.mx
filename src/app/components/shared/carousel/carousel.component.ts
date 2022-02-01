import { Component, OnInit } from '@angular/core';
import { GlobalpaqService } from '../../../services/globalpaq.service';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {
 images:any = [];
  constructor( private gp : GlobalpaqService) { }

  ngOnInit() {
    this.gp.getImages().subscribe((data:any)=>{
      //console.log(data.data);
      for (let index = 0; index < data.data.length; index++) {
      
        if (data.data[index].id_ubicacion == 1) {
          data.data[index].nomImage = "https://sistema.globalpaq.mx/images/"+data.data[index].carouselcol;
          console.log(data.data[index].nomImage);
          this.images.push(data.data[index]);
        }
      }
      
    })
  }
    // var Split = function() {
    // this.$t = $(".split");
    // this.gridX = 6;
    // this.gridY = 4;
    // this.w = this.$t.width();
    // this.h = this.$t.height();
    // this.img = $("img", this.$t).attr("src");
    // this.delay = 0.05;
  
  //   this.create = function() {
  //     $("div", this.$t).remove();
  
  //     for (var x = 0; x < this.gridX; x++) {
  //       for (var y = 0; y < this.gridY; y++) {
  //         var width = this.w / this.gridX * 101 / this.w + "%",
  //             height = this.h / this.gridY * 101 / this.h + "%",
  //             top = this.h / this.gridY * y * 100 / this.h + "%",
  //             left = this.w / this.gridX * x * 100 / this.w + "%",
  //             bgPosX = -(this.w / this.gridX * x) + "px",
  //             bgPosY = -(this.h / this.gridY * y) + "px";
  
  //         $("<div />")
  //           .css({
  //           top: top,
  //           left: left,
  //           width: width,
  //           height: height,
  //           backgroundImage: "url(" + this.img + ")",
  //           backgroundPosition: bgPosX + " " + bgPosY,
  //           backgroundSize: this.w + "px",
  //           transitionDelay: x * this.delay + y * this.delay + "s"
  //         })
  //           .appendTo(this.$t);
  //       }
  //     }
  //   };
  
  //   this.create();
  
  //   this.$t
  //     .on("click", function() {
  //     $(this).toggleClass("active");
  //   })
  //     .click();
  // };
  
  // window.onload = function() {
  //   var split = new Split();
  //   var gui = (function datgui() {
  //     var gui = new dat.GUI();
  //     gui.add(split, "gridX", 1, 20).step(1).onChange(function(newValue) {
  //       split.create();
  //     });
  //     gui.add(split, "gridY", 1, 20).step(1).onChange(function(newValue) {
  //       split.create();
  //     });
  //     gui.add(split, "delay", 0, 0.3).step(0.01).onChange(function(newValue) {
  //       split.create();
  //     });
  //     return gui;
  //   })();
  // };
}
