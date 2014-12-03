/* pageHandler.js
 * handles tweens and page-loading
 * 2014.11.02
 * kristof aldenderfer
 */
function pageHandler(obj) {
	tweening = true;
	var e = document.getElementById('container');
	console.log("obj.name:",obj.name);
	if (obj.name == "system") { // unload page and transition back home, then show footer
		new TWEEN.Tween(camera.target).to({
			x: 0,
			y: 0,
			z: 0
			},1000).easing(TWEEN.Easing.Linear.None).onStart(function() {
			}).onUpdate(function() {
				camera.lookAt(camera.target);
			}).onComplete(function() {
				$('.nav').each(function() { //remove all scrollspy props
					var id = $(this).attr('id');
					$('a#'+id).css("margin-left", "0px");
					$('a#'+id).css("border-left", "none");
				});
				camera.lookAt(camera.target);
				tweening = false;
				$("#footer").fadeIn(1000);
				controls.enabled = true;
			}).start();

		$("#container").fadeOut(400, function() {
			e.innerHTML="";
		});
	}
	else { // hide footer, transition to body, load page
		$("#footer").fadeOut(1000);
		pos.setFromMatrixPosition(cameraTarget.matrixWorld);
		var tween = new TWEEN.Tween(camera.target).to({
				x: pos.x,
				y: pos.y,
				z: pos.z
			},1000).easing(TWEEN.Easing.Linear.None).onUpdate(function() {
				camera.lookAt(camera.target);
			}).onComplete(function () {
				camera.lookAt(camera.target);
			}).start();

		var tween2 = new TWEEN.Tween(camera.position).to({
				x: pos.x-cameraTarget.geometry.radius*2,
				y: pos.y-cameraTarget.geometry.radius*2,
				z: pos.z-cameraTarget.geometry.radius*2
			},1000).easing(TWEEN.Easing.Linear.None).onUpdate(function() {
				camera.lookAt(camera.target);
			}).onComplete(function() {
				camera.lookAt(camera.target);
				tweening = false;

				$("#container").load("html/"+obj.name+".html", function() {
					$('.nav').each(function() {
						var id = $(this).attr('id');
						var txt = $(this).children('h1,h2,h3,h4,h5,h6');
						var spacing = new Array(parseInt(( txt.prop('tagName').slice(1,2)  )-1)*4).join(" ");
						txt = spacing + txt.text();
						if (txt.length>24) txt = txt.slice(0,20)+" ...";
						$("#navlist").append("<a id='"+id+"' href='#"+id+"'>"+txt+"</a>");
					});
					$("#navlist").append("<a id='home'>(return home)</a>");
					$("#home").css("margin-top","+20px");
					$("#home").click(function() {
						cameraTarget = system;
						pageHandler(cameraTarget);
					});
					$('.nav').on('scrollSpy:enter', function() {
						var id = $(this).attr('id');
						$('a#'+id).css("margin-left", "-2px");
						$('a#'+id).css("border-left", "2px solid #CCFFFF");
					});
					$('.nav').on('scrollSpy:exit', function() {
						var id = $(this).attr('id');
						$('a#'+id).css("margin-left", "0px");
						$('a#'+id).css("border-left", "none");
					});
					$('.nav').scrollSpy();
					$(window).scroll(function() {
						$('.rowright').css('top', $(window).scrollTop() + "px");
					});
				});
				$("#container").fadeTo(1000,1);

			}).start();
	}
}