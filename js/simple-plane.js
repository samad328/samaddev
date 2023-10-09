

import {Curtains, Plane, RenderTarget,Vec2, ShaderPass} from 'https://cdn.jsdelivr.net/npm/curtainsjs@8.1.2/src/index.mjs';
import {TextTexture} from 'https://gistcdn.githack.com/martinlaxenaire/549b3b01ff4bd9d29ce957edd8b56f16/raw/2f111abf99c8dc63499e894af080c198755d1b7a/TextTexture.js';




function init(){

    const tl = gsap.timeline();

    tl.to("body", {
      overflow: "hidden"
    })
      .to(".preloader .text-container", {
        duration: 0,
        opacity: 1,
        ease: "Power3.easeOut"
      })
      .from(".preloader .text-container h1", {
        duration: 1.5,
        delay: 1,
        y: 70,
        skewY: 10,
        stagger: 0.4,
        ease: "Power3.easeOut"
      })
      .to(".preloader .text-container h1", {
        duration: 1.2,
        y: 70,
        skewY: -20,
        stagger: 0.2,
        ease: "Power3.easeOut"
      })
      .to(".preloader", {
        duration: 1.5,
        height: "0vh",
        ease: "Power3.easeOut"
      })
      .to(
        "body",
        {
          overflow: "auto"
        },
        "-=2"
      )
      .to(".preloader", {
        display: "none"
      });

   
}

window.addEventListener('load',function(e){
    init()
    navDropDown()
    cursor()
    horizentalLines()
})


// Nav DropDown Function

function navDropDown(){
    const dropdownBtn = document.getElementById("btn");
const dropdownMenu = document.getElementById("dropdown");
const toggleArrow = document.getElementById("arrow");

// Toggle dropdown function
const toggleDropdown = function () {
  dropdownMenu.classList.toggle("show");
  toggleArrow.classList.toggle("arrow");
};

// Toggle dropdown open/close when dropdown button is clicked
dropdownBtn.addEventListener("click", function (e) {
  e.stopPropagation();
  toggleDropdown();
});

// Close dropdown when dom element is clicked
document.documentElement.addEventListener("click", function () {
  if (dropdownMenu.classList.contains("show")) {
    toggleDropdown();
  }
});

}



// cursor function
function cursor(){
    
var cursor = document.querySelector('.cursor');
var cursorinner = document.querySelector('.cursor2');
var a = document.querySelectorAll('span');

document.addEventListener('mousemove', function(e){
  var x = e.clientX;
  var y = e.clientY;
  cursor.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`
});

document.addEventListener('mousemove', function(e){
  var x = e.clientX;
  var y = e.clientY;
  cursorinner.style.left = x + 'px';
  cursorinner.style.top = y + 'px';
});

document.addEventListener('mousedown', function(){
  cursor.classList.add('click');
  cursorinner.classList.add('cursorinnerhover')
});

document.addEventListener('mouseup', function(){
  cursor.classList.remove('click')
  cursorinner.classList.remove('cursorinnerhover')
});

a.forEach(item => {
  item.addEventListener('mouseover', () => {
    cursor.classList.add('hover');
  });
  item.addEventListener('mouseleave', () => {
    cursor.classList.remove('hover');
  });
})
}



// function navBar(){
//     var lastScrollTop; // This Varibale will store the top position

// let navbar = document.getElementById('header'); // Get The NavBar

// window.addEventListener('scroll',function(){
//  //on every scroll this funtion will be called
  
//   var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
//   //This line will get the location on scroll
  
//   if(scrollTop > lastScrollTop){ //if it will be greater than the previous
//     navbar.style.top='-80px';
//     //set the value to the negetive of height of navbar 
//   }
  
//   else{
//     navbar.style.top='0';
//   }
  
//   lastScrollTop = scrollTop; //New Position Stored
// });
// }
// navBar()


// big name Marquee
function bigName(){

    
    let direction = 1; // 1 = forward, -1 = backward scroll
   
    const roll1 = roll(".big-name .name-wrap", {duration: 60}),
          roll2 = roll(".rollingText02", {duration: 60}, true),
          scroll = ScrollTrigger.create({
            trigger: document.querySelector('[data-scroll-container]'),
            onUpdate(self) {
              if (self.direction !== direction) {
                direction *= -1;
                gsap.to([roll1, roll2], {timeScale: direction, overwrite: true});
              }
            }
          });
   
    // helper function that clones the targets, places them next to the original, then animates the xPercent in a loop to make it appear to roll across the screen in a seamless loop.
    function roll(targets, vars, reverse) {
      vars = vars || {};
      vars.ease || (vars.ease = "none");
      const tl = gsap.timeline({
              repeat: -1,
              onReverseComplete() { 
                this.totalTime(this.rawTime() + this.duration() * 10); // otherwise when the playhead gets back to the beginning, it'd stop. So push the playhead forward 10 iterations (it could be any number)
              }
            }), 
            elements = gsap.utils.toArray(targets),
            clones = elements.map(el => {
              let clone = el.cloneNode(true);
              el.parentNode.appendChild(clone);
              return clone;
            }),
            positionClones = () => elements.forEach((el, i) => gsap.set(clones[i], {position: "absolute", overwrite: false, top: el.offsetTop, left: el.offsetLeft + (reverse ? -el.offsetWidth : el.offsetWidth)}));
      positionClones();
      elements.forEach((el, i) => tl.to([el, clones[i]], {xPercent: reverse ? 100 : -100, ...vars}, 0));
      window.addEventListener("resize", () => {
        let time = tl.totalTime(); // record the current time
        tl.totalTime(0); // rewind and clear out the timeline
        positionClones(); // reposition
        tl.totalTime(time); // jump back to the proper time
      });
      return tl;
    }
   
   }
  
// canvas
  const curtains = new Curtains({
    container: "canvas",
    pixelRatio: Math.min(1.5, window.devicePixelRatio)
});


const scrollFs = `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif

    varying vec3 vVertexPosition;
    varying vec2 vTextureCoord;

    uniform sampler2D uRenderTexture;

    // lerped scroll deltas
    // negative when scrolling down, positive when scrolling up
    uniform float uScrollEffect;

    // default to 2.5
    uniform float uScrollStrength;


    void main() {
        vec2 scrollTextCoords = vTextureCoord;
        float horizontalStretch;

        // branching on an uniform is ok
        if(uScrollEffect >= 0.0) {
            scrollTextCoords.y *= 1.0 + -uScrollEffect * 0.00625 * uScrollStrength;
            horizontalStretch = sin(scrollTextCoords.y);
        }
        else if(uScrollEffect < 0.0) {
            scrollTextCoords.y += (scrollTextCoords.y - 1.0) * uScrollEffect * 0.00625 * uScrollStrength;
            horizontalStretch = sin(-1.0 * (1.0 - scrollTextCoords.y));
        }

        scrollTextCoords.x = scrollTextCoords.x * 2.0 - 1.0;
        scrollTextCoords.x *= 1.0 + uScrollEffect * 0.0035 * horizontalStretch * uScrollStrength;
        scrollTextCoords.x = (scrollTextCoords.x + 1.0) * 0.5;

        gl_FragColor = texture2D(uRenderTexture, scrollTextCoords);
    }
`;

const vs = `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif

    // default mandatory variables
    attribute vec3 aVertexPosition;
    attribute vec2 aTextureCoord;

    uniform mat4 uMVMatrix;
    uniform mat4 uPMatrix;

    // custom variables
    varying vec3 vVertexPosition;
    varying vec2 vTextureCoord;

    void main() {
        gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);

        // varyings
        vVertexPosition = aVertexPosition;
        vTextureCoord = aTextureCoord;
    }
`;

const fs = `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif

    varying vec3 vVertexPosition;
    varying vec2 vTextureCoord;

    uniform sampler2D uTexture;

    void main( void ) {
        gl_FragColor = texture2D(uTexture, vTextureCoord);
    }
`;


    // create curtains instance
  
    // track scroll values
    const scroll = {
        value: 0,
        lastValue: 0,
        effect: 0,
    };

    // on success
    curtains.onSuccess(() => {
        const fonts = {
            list: [
                'normal 400 1em "Archivo Black", sans-serif',
                'normal 300 1em "Merriweather Sans", sans-serif',
            ],
            loaded: 0
        };

        // load the fonts first
        fonts.list.forEach(font => {
            document.fonts.load(font).then(() => {
                fonts.loaded++;

                if(fonts.loaded === fonts.list.length) {

                    // create our shader pass
                    const scrollPass = new ShaderPass(curtains, {
                        fragmentShader: scrollFs,
                        depth: false,
                        uniforms: {
                            scrollEffect: {
                                name: "uScrollEffect",
                                type: "1f",
                                value: scroll.effect,
                            },
                            scrollStrength: {
                                name: "uScrollStrength",
                                type: "1f",
                                value: 2.5,
                            },
                        }
                    });

                    // calculate the lerped scroll effect
                    scrollPass.onRender(() => {
                        scroll.lastValue = scroll.value;
                        scroll.value = curtains.getScrollValues().y;

                        // clamp delta
                        scroll.delta = Math.max(-30, Math.min(30, scroll.lastValue - scroll.value));

                        scroll.effect = curtains.lerp(scroll.effect, scroll.delta, 0.05);
                        scrollPass.uniforms.scrollEffect.value = scroll.effect;
                    });

                    // create our text planes
                    const textEls = document.querySelectorAll('.text-plane');
                    textEls.forEach(textEl => {
                        const textPlane = new Plane(curtains, textEl, {
                            vertexShader: vs,
                            fragmentShader: fs
                        });

                        // create the text texture and... that's it!
                        const textTexture = new TextTexture({
                            plane: textPlane,
                            textElement: textPlane.htmlElement,
                            sampler: "uTexture",
                            resolution: 1.5,
                            skipFontLoading: true, // we've already loaded the fonts
                        });

                       
                    });
                }
            })
        })
    });

   

  




    window.addEventListener("load", () => {
        // set up our WebGL context and append the canvas to our wrapper
        bigName()
        curtains.onRender(() => {
            // update our planes deformation
            // increase/decrease the effect
            planesDeformations = curtains.lerp(planesDeformations, 0, 0.1);
        }).onScroll(() => {
            // get scroll deltas to apply the effect on scroll
            const delta = curtains.getScrollDeltas();
    
            // invert value for the effect
            delta.y = -delta.y;
    
            // threshold
            if(delta.y > 60) {
                delta.y = 60;
            }
            else if(delta.y < -60) {
                delta.y = -60;
            }
    
            if(Math.abs(delta.y) > Math.abs(planesDeformations)) {
                planesDeformations = curtains.lerp(planesDeformations, delta.y, 0.5);
            }
        }).onError(() => {
            // we will add a class to the document body to display original images
            document.body.classList.add("no-curtains", "planes-loaded");
        }).onContextLost(() => {
            // on context lost, try to restore the context
            curtains.restoreContext();
        });
    
        // we will keep track of all our planes in an array
        const planes = [];
        let planesDeformations = 0;
    
        // get our planes elements
        let planeElements = document.getElementsByClassName("plane");
    
    
        const vs = `
            precision mediump float;
        
            // default mandatory variables
            attribute vec3 aVertexPosition;
            attribute vec2 aTextureCoord;
        
            uniform mat4 uMVMatrix;
            uniform mat4 uPMatrix;
        
            uniform mat4 planeTextureMatrix;
        
            // custom variables
            varying vec3 vVertexPosition;
            varying vec2 vTextureCoord;
        
            uniform float uPlaneDeformation;
        
            void main() {
        
                vec3 vertexPosition = aVertexPosition;
        
                // cool effect on scroll
                vertexPosition.y += sin(((vertexPosition.x + 1.0) / 2.0) * 3.141592) * (sin(uPlaneDeformation / 90.0));
        
                gl_Position = uPMatrix * uMVMatrix * vec4(vertexPosition, 1.0);
        
                // varyings
                vVertexPosition = vertexPosition;
                vTextureCoord = (planeTextureMatrix * vec4(aTextureCoord, 0.0, 1.0)).xy;
            }
        `;
    
        const fs = `
            precision mediump float;
        
            varying vec3 vVertexPosition;
            varying vec2 vTextureCoord;
        
            uniform sampler2D planeTexture;
        
            void main() {
                // just display our texture
                gl_FragColor = texture2D(planeTexture, vTextureCoord);
            }
        `;
    
        // all planes will have the same parameters
        const params = {
            vertexShader: vs,
            fragmentShader: fs,
            widthSegments: 10,
            heightSegments: 10,
            drawCheckMargins: {
                top: 100,
                right: 0,
                bottom: 100,
                left: 0,
            },
            uniforms: {
                planeDeformation: {
                    name: "uPlaneDeformation",
                    type: "1f",
                    value: 0,
                },
            }
        };
    
        // add our planes and handle them
        for(let i = 0; i < planeElements.length; i++) {
            //planes.push(curtains.addPlane(planeElements[i], params));
            planes.push(new Plane(curtains, planeElements[i], params));
    
            handlePlanes(i);
        }
    
    
        // handle all the planes
        function handlePlanes(index) {
            const plane = planes[index];
    
            // check if our plane is defined and use it
            plane.onError(() => {
                console.log("plane error", plane);
            }).onReady(() => {
                // once everything is ready, display everything
                if(index === planes.length - 1) {
                    document.body.classList.add("planes-loaded");
                }
            }).onRender(() => {
                // update the uniform
                plane.uniforms.planeDeformation.value = planesDeformations;
            });
        }
    
        // this will simulate an ajax lazy load call
        // additionnalPlanes string could be the response of our AJAX call
        document.getElementById("add-more-planes").addEventListener("click", function() {
            const additionnalPlanes = '<div class="plane-wrapper"><span class="plane-title">Title ' + (planes.length + 1) + '</span><div class="plane-inner"><div class="landscape-wrapper"><div class="landscape-inner"><div class="plane"><img src="../medias/plane-small-texture-1.jpg" crossorigin="" data-sampler="planeTexture" /></div></div></div></div></div><div class="plane-wrapper"><span class="plane-title">Title ' + (planes.length + 2) + '</span><div class="plane-inner"><div class="landscape-wrapper"><div class="landscape-inner"><div class="plane"><img src="../medias/plane-small-texture-2.jpg" crossorigin="" data-sampler="planeTexture" /></div></div></div></div></div><div class="plane-wrapper"><span class="plane-title">Title ' + (planes.length + 3) + '</span><div class="plane-inner"><div class="landscape-wrapper"><div class="landscape-inner"><div class="plane"><img src="../medias/plane-small-texture-3.jpg" crossorigin="" data-sampler="planeTexture" /></div></div></div></div></div><div class="plane-wrapper"><span class="plane-title">Title ' + (planes.length + 4) + '</span><div class="plane-inner"><div class="landscape-wrapper"><div class="landscape-inner"><div class="plane"><img src="../medias/plane-small-texture-4.jpg" crossorigin="" data-sampler="planeTexture" /></div></div></div></div></div>';
    
            // append the response
            document.getElementById("planes").insertAdjacentHTML("beforeend", additionnalPlanes);
    
            // reselect our plane elements
            planeElements = document.getElementsByClassName("plane");
    
            // we need a timeout because insertAdjacentHTML could take some time to append the content
            setTimeout(() => {
                // we will create the planes that don't already exist
                // basically the same thing as above
                for(let i = planes.length; i < planeElements.length; i++) {
    
                    planes.push(new Plane(curtains, planeElements[i], params));
    
                    handlePlanes(i);
    
                    // 30 planes are enough, right ?
                    if(planes.length >= 28) {
                        document.getElementById("add-more-planes").style.display = "none";
                    }
                }
            }, 50);
    
        });
    
    
        // post processing
        const shaderPassFs = `
            precision mediump float;
        
            varying vec3 vVertexPosition;
            varying vec2 vTextureCoord;
        
            uniform sampler2D uRenderTexture;
            uniform sampler2D displacementTexture;
        
            uniform float uDisplacement;
        
            void main( void ) {
                vec2 textureCoords = vTextureCoord;
                vec4 displacement = texture2D(displacementTexture, textureCoords);
        
                // displace along Y axis
                textureCoords.y += (sin(displacement.r) / 5.0) * uDisplacement;
                
                gl_FragColor = texture2D(uRenderTexture, textureCoords);
            }
        `;
    
    
        const shaderPassParams = {
            fragmentShader: shaderPassFs, // we'll be using the lib default vertex shader
            uniforms: {
                displacement: {
                    name: "uDisplacement",
                    type: "1f",
                    value: 0,
                },
            },
    
            texturesOptions: {
                anisotropy: 10,
            }
        };
    
        const shaderPass = new ShaderPass(curtains, shaderPassParams);
    
        // we will need to load a new image
        const image = new Image();
        image.src = "../Images/samad.webp";
        // set its data-sampler attribute to use in fragment shader
        image.setAttribute("data-sampler", "displacementTexture");
    
        // if our shader pass has been successfully created
        if(shaderPass) {
            // load our displacement image
            shaderPass.loader.loadImage(image);
            shaderPass.onLoading((texture) => {
                console.log("shader pass image has been loaded and texture has been created:", texture);
            }).onReady(() => {
                console.log("shader pass is ready");
            }).onRender(() => {
                // update the uniforms
                shaderPass.uniforms.displacement.value = planesDeformations / 60;
            }).onError(() => {
                console.log('shader pass error');
            });
        }
    });




/***
 Here we create a CacheManager class object
 This will store geometries attributes arrays, textures and WebGL programs in arrays
 This helps speed up slow synchronous CPU operations such as WebGL shaders compilations, images decoding, etc.

 returns :
 @this: our CacheManager class object
 ***/
 export class CacheManager {
    constructor() {
        // never clear cached geometries
        this.geometries = [];

        this.clear();
    }

    /***
     Clear WebGL context depending cache arrays (used on init and context restoration)
     ***/
    clear() {
        // only cache images textures for now
        this.textures = [];

        // cached programs
        this.programs = [];
    }


    /*** GEOMETRIES ***/

    /***
     Check if this geometry is already in our cached geometries array

     params:
     @definitionID (integer): the geometry ID
     ***/
    getGeometryFromID(definitionID) {
        return this.geometries.find(element => element.id === definitionID);
    }

    /***
     Add a geometry to our cache if not already in it

     params:
     @definitionID  (integer): the geometry ID to add to our cache
     @vertices (array): vertices coordinates array to add to our cache
     @uvs (array): uvs coordinates array to add to our cache
     ***/
    addGeometry(definitionID, vertices, uvs) {
        this.geometries.push({
            id: definitionID,
            vertices: vertices,
            uvs: uvs
        });
    }


    /*** PROGRAMS ***/

    /***
     Compare two shaders strings to detect whether they are equal or not

     params:
     @firstShader (string): shader code
     @secondShader (string): shader code

     returns:
     @isSameShader (bool): whether both shaders are equal or not
     ***/
    isSameShader(firstShader, secondShader) {
        return firstShader.localeCompare(secondShader) === 0;
    }

    /***
     Returns a program from our cache if this program's vertex and fragment shaders code are the same as the one provided

     params:
     @vsCode (string): vertex shader code
     @fsCode (string): fragment shader code

     returns:
     @program (Program class object or null): our program if it has been found
     ***/
    getProgramFromShaders(vsCode, fsCode) {
        return this.programs.find((element) => {
            return this.isSameShader(element.vsCode, vsCode) && this.isSameShader(element.fsCode, fsCode);
        });
    }

    /***
     Add a program to our cache

     params :
     @program (Program class object) : program to add to our cache
     ***/
    addProgram(program) {
        this.programs.push(program);
    }


    /*** TEXTURES ***/

    /***
     Check if this source is already in our cached textures array

     params :
     @source (HTML element) : html image, video or canvas element (only images for now)
     ***/
    getTextureFromSource(source) {
        const src = typeof source === "string" ? source : source.src;
        // return the texture if the source is the same and if it's not the same texture
        return this.textures.find(element => element.source && element.source.src === src);
    }

    /***
     Add a texture to our cache if not already in it

     params :
     @texture (Texture class object) : texture to add to our cache
     ***/
    addTexture(texture) {
        const cachedTexture = this.getTextureFromSource(texture.source);

        if(!cachedTexture) {
            this.textures.push(texture);
        }
    }

    /***
     Removes a texture from the cache array

     params :
     @texture (Texture class object) : texture to remove from our cache
     ***/
    removeTexture(texture) {
        // remove from our textures array
        this.textures = this.textures.filter(element => element.uuid !== texture.uuid);
    }
}



/***
 Here we create a ScrollManager class object
 This keeps track of our scroll position, scroll deltas and triggers an onScroll callback
 Could either listen to the native scroll event or be hooked to any scroll (natural or virtual) scroll event

 params:
 @xOffset (float): scroll along X axis
 @yOffset (float): scroll along Y axis
 @lastXDelta (float): last scroll delta along X axis
 @lastYDelta (float): last scroll delta along Y axis

 @shouldWatch (bool): if the scroll manager should listen to the scroll event or not. Default to true.

 @onScroll (function): callback to execute each time the scroll values changed

 returns:
 @this: our ScrollManager class object
 ***/
 export class ScrollManager {
    constructor({
        xOffset = 0,
        yOffset = 0,
        lastXDelta = 0,
        lastYDelta = 0,

        shouldWatch = true,

        onScroll = () => {},
    } = {}) {
        this.xOffset = xOffset;
        this.yOffset = yOffset;
        this.lastXDelta = lastXDelta;
        this.lastYDelta = lastYDelta;
        this.shouldWatch = shouldWatch;

        this.onScroll = onScroll;

        // keep a ref to our scroll event
        this.handler = this.scroll.bind(this, true);
        if(this.shouldWatch) {
            window.addEventListener("scroll", this.handler, {
                passive: true
            });
        }
    }


    /***
     Called by the scroll event listener
     ***/
    scroll() {
        this.updateScrollValues(window.pageXOffset, window.pageYOffset)
    }


    /***
     Updates the scroll manager X and Y scroll values as well as last X and Y deltas
     Internally called by the scroll handler
     Could be called externally as well if the user wants to handle the scroll by himself

     params:
     @x (float): scroll value along X axis
     @y (float): scroll value along Y axis
     ***/
    updateScrollValues(x, y) {
        // get our scroll delta values
        const lastScrollXValue = this.xOffset;
        this.xOffset = x;
        this.lastXDelta = lastScrollXValue - this.xOffset;

        const lastScrollYValue = this.yOffset;
        this.yOffset = y;
        this.lastYDelta = lastScrollYValue - this.yOffset;

        if(this.onScroll) {
            this.onScroll(this.lastXDelta, this.lastYDelta);
        }
    }


    /***
     Dispose our scroll manager (just remove our event listner if it had been added previously)
     ***/
    dispose() {
        if(this.shouldWatch) {
            window.removeEventListener("scroll", this.handler, {
                passive: true
            });
        }
    }
}


function horizentalLines(){

gsap.utils.toArray(".hr-plane").forEach(line => {
    gsap.from(line, {
      scaleX: 0,
      duration: 2,
      
      transformOrigin: "left center",
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: line,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });
  
  });

}
  










