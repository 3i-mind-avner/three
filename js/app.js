'use strict';

(function() {
    var STEREO= false;
    var PLAY_MUSIC=false;

    if(PLAY_MUSIC){
        var audio = new Audio('music/doiwannaknow.mp3');
        audio.play();
    }



    var camera, scene, renderer;
    var effect, controls;
    var element, container;
    var words =[
        {
            time:5,
            text:'Have you got colour '
        },
        {
            time:10,
            text:'in your cheeks?'
        },


        {
            time:14,
            text:'Have you got colour in your cheeks?'
        },
        {
            time:5,
            text:"Do you ever get that fear "
        },
        {
            time:2,
            text:"that you can't shift the type that"
        },
        {
            time:2,
            text:"sticks around like"
        },
        {
            time:2,
            text:" summat in your teeth?"
        }
    ]

    var clock = new THREE.Clock();

    init();
    animate();

    function init() {


        function createPlane(){
            var texture = THREE.ImageUtils.loadTexture(
                'textures/patterns/checker.png'
            );
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat = new THREE.Vector2(50, 150);
            texture.anisotropy = renderer.getMaxAnisotropy();

            var material = new THREE.MeshPhongMaterial({
                color: 0xafffff,
                specular: 0xffffff,
                shininess: 20,
                shading: THREE.FlatShading,
                map: texture
            });

            var geometry = new THREE.PlaneGeometry(1000, 1000);

            var mesh = new THREE.Mesh(geometry, material);
            mesh.rotation.x = -Math.PI / 2;
           // scene.add(mesh);
            return mesh;
        }



        function createSphere(radius, segments) {
            return new THREE.Mesh(
                new THREE.SphereGeometry(radius, segments, segments),
                new THREE.MeshPhongMaterial({
                    map:         THREE.ImageUtils.loadTexture('images/2_no_clouds_4k.jpg'),
                    bumpMap:     THREE.ImageUtils.loadTexture('images/elev_bump_4k.jpg'),
                    bumpScale:   0.005,
                    specularMap: THREE.ImageUtils.loadTexture('images/water_4k.png'),
                    specular:    new THREE.Color('grey')
                })
            );
        }

        function createClouds(radius, segments) {
            return new THREE.Mesh(
                new THREE.SphereGeometry(radius + 0.003, segments, segments),
                new THREE.MeshPhongMaterial({
                    map:         THREE.ImageUtils.loadTexture('images/fair_clouds_4k.png'),
                    transparent: true
                })
            );
        }

        function createStars(radius, segments) {
            return new THREE.Mesh(
                new THREE.SphereGeometry(radius, segments, segments),
                new THREE.MeshBasicMaterial({
                    map:  THREE.ImageUtils.loadTexture('images/galaxy_starfield.png'),
                    side: THREE.BackSide
                })
            );
        }
        var radius   =10,
            segments = 32,
            rotation = 6;


        renderer = new THREE.WebGLRenderer();
        element = renderer.domElement;
        container = document.getElementById('example');
        container.appendChild(element);

        if(STEREO){
            effect = new THREE.StereoEffect(renderer);
        }


        scene = new THREE.Scene();

       camera = new THREE.PerspectiveCamera(90, 1, 0.001, 700);
        camera.position.set(12, 15, 0);

        var width  = window.innerWidth,
            height = window.innerHeight;

      //  camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
       // camera.position.z = 1.5;

        scene.add(camera);

        controls = new THREE.OrbitControls(camera, element);
      //  controls.rotateUp(Math.PI / 4);
       /* controls.target.set(
            camera.position.x + 0.1,
            camera.position.y,
            camera.position.z
        );*/
        controls.noZoom = true;
        controls.noPan = true;

        controls.enabled=false;


     /*   var sphere = createSphere(radius, segments);
        sphere.rotation.y = rotation;
      //  sphere.position.y=3
        scene.add(sphere)

        var clouds = createClouds(radius, segments);
        clouds.rotation.y = rotation;
     //   clouds.position.y=3
        scene.add(clouds)*/
        var stars = createStars(90, 64);
        scene.add(stars);


     //   createTextMY()


/*
        var plane= createPlane()
        scene.add(plane);*/

        function setOrientationControls(e) {
            if (!e.alpha) {
                return;
            }

            controls = new THREE.DeviceOrientationControls(camera, true);
            controls.connect();
            controls.update();

            element.addEventListener('click', fullscreen, false);

            window.removeEventListener('deviceorientation', setOrientationControls, true);
        }
        window.addEventListener('deviceorientation', setOrientationControls, true);


        var light = new THREE.HemisphereLight(0x777777, 0x000000, 0.5);
        scene.add(light);


        window.addEventListener('resize', resize, false);
        setTimeout(resize, 1);
    }

    function resize() {
        var width = container.offsetWidth;
        var height = container.offsetHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
        if(STEREO){
             effect.setSize(width, height);
        }
    }

    function update(dt) {
        resize();

        camera.updateProjectionMatrix();

        controls.update(dt);
    }

    function render(dt) {
        if(STEREO) {
            effect.render(scene, camera);
        }else{
            renderer.render(scene, camera);
        }
    }

    function createTextMY(text){


        function createText() {

            textGeo = new THREE.TextGeometry( text, {

                size: size,
                height: height,
                curveSegments: curveSegments,

                font: font,
                weight: weight,
                style: style,

                bevelThickness: bevelThickness,
                bevelSize: bevelSize,
                bevelEnabled: bevelEnabled,

                material: 0,
                extrudeMaterial: 1

            });

            textGeo.computeBoundingBox();
            textGeo.computeVertexNormals();

            // "fix" side normals by removing z-component of normals for side faces
            // (this doesn't work well for beveled geometry as then we lose nice curvature around z-axis)

            if ( ! bevelEnabled ) {

                var triangleAreaHeuristics = 0.1 * ( height * size );

                for ( var i = 0; i < textGeo.faces.length; i ++ ) {

                    var face = textGeo.faces[ i ];

                    if ( face.materialIndex == 1 ) {

                        for ( var j = 0; j < face.vertexNormals.length; j ++ ) {

                            face.vertexNormals[ j ].z = 0;
                            face.vertexNormals[ j ].normalize();

                        }

                        var va = textGeo.vertices[ face.a ];
                        var vb = textGeo.vertices[ face.b ];
                        var vc = textGeo.vertices[ face.c ];

                        var s = THREE.GeometryUtils.triangleArea( va, vb, vc );

                        if ( s > triangleAreaHeuristics ) {

                            for ( var j = 0; j < face.vertexNormals.length; j ++ ) {

                                face.vertexNormals[ j ].copy( face.normal );

                            }

                        }

                    }

                }

            }

            var centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

            textMesh1 = new THREE.Mesh( textGeo, material );

            textMesh1.position.x = centerOffset;
            textMesh1.position.y = hover;
            textMesh1.position.z = 0;

            textMesh1.rotation.x = 0;
            textMesh1.rotation.y = Math.PI * 2;

            group.add( textMesh1 );

            if ( mirror ) {

                textMesh2 = new THREE.Mesh( textGeo, material );

                textMesh2.position.x = centerOffset;
                textMesh2.position.y = -hover;
                textMesh2.position.z = height;

                textMesh2.rotation.x = Math.PI;
                textMesh2.rotation.y = Math.PI * 2;

                group.add( textMesh2 );

            }

        }



        var group, textMesh1, textMesh2, textGeo, material;

        var firstLetter = true;

      //  var text = "Avner Kafri",

           var   height = 20,
            size = 70,
            hover = 30,

            curveSegments = 4,

            bevelThickness = 2,
            bevelSize = 1.5,
            bevelSegments = 3,
            bevelEnabled = true,

            font = "optimer", // helvetiker, optimer, gentilis, droid sans, droid serif
            weight = "bold", // normal bold
            style = "normal"; // normal italic

        var mirror = false;

        var fontMap = {

            "helvetiker": 0,
            "optimer": 1,
            "gentilis": 2,
            "droid sans": 3,
            "droid serif": 4

        };

        var weightMap = {

            "normal": 0,
            "bold": 1

        };

        var reverseFontMap = {};
        var reverseWeightMap = {};

        for ( var i in fontMap ) reverseFontMap[ fontMap[i] ] = i;
        for ( var i in weightMap ) reverseWeightMap[ weightMap[i] ] = i;


        var postprocessing = { enabled : false };


        return init();


        function init() {





            // Get text from hash

            var hash = document.location.hash.substr( 1 );

            if ( hash.length !== 0 ) {

                var colorhash  = hash.substring( 0, 6 );
                var fonthash   = hash.substring( 6, 7 );
                var weighthash = hash.substring( 7, 8 );
                var pphash 	   = hash.substring( 8, 9 );
                var bevelhash  = hash.substring( 9, 10 );
                var texthash   = hash.substring( 10 );

               // hex = colorhash;
                // pointLight.color.setHex( parseInt( colorhash, 16 ) );

                font = reverseFontMap[ parseInt( fonthash ) ];
                weight = reverseWeightMap[ parseInt( weighthash ) ];

                postprocessing.enabled = parseInt( pphash );
                bevelEnabled = parseInt( bevelhash );

                text = decodeURI( texthash );

                // updatePermalink();

            } else {

                // pointLight.color.setHSL( Math.random(), 1, 0.5 );
                //  hex = decimalToHex( pointLight.color.getHex() );

            }

            material = new THREE.MeshFaceMaterial( [
                new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.FlatShading } ), // front
                new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.SmoothShading } ) // side
            ] );

            group = new THREE.Group();
            //   group.position.y = -20;
            //  group.rotation.x = 1.57079633;



            group.scale.set(0.005,0.005,0.005)
            group.rotation.y=1.5;

           /* group.position.set( 0, 0, - 1 )
            group.position.applyMatrix4( camera.matrixWorld );*/

           // scene.add( group );

            createText();
            return group;



        }

    }

    var nextTextTime =words[0].time;
    function handelSubtitle(){

        if(words.length&& (clock.getElapsedTime() ) >nextTextTime){
            var word=words.shift();
            var next=words[0];
            if(next){
                nextTextTime += next.time;
            }

            var group=createTextMY(word.text);
            group.position.set( 0, 0, - 2 )
            group.position.applyMatrix4( camera.matrixWorld );

            group.rotation.x=camera.rotation.x
            group.rotation.y=camera.rotation.y



            scene.add( group );
        }


    }

    function animate(t) {
        requestAnimationFrame(animate);
        camera.position.y-= 0.01
       var dt=clock.getDelta()
        handelSubtitle()

        update(dt);
        render(dt);
    }

    function fullscreen() {
        if (container.requestFullscreen) {
            container.requestFullscreen();
        } else if (container.msRequestFullscreen) {
            container.msRequestFullscreen();
        } else if (container.mozRequestFullScreen) {
            container.mozRequestFullScreen();
        } else if (container.webkitRequestFullscreen) {
            container.webkitRequestFullscreen();
        }
    }
}());