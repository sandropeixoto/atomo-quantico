angular.module("atomo_quantico", ["ngCordova","ionic","ionMdInput","ionic-material","ion-datetime-picker","ionic.rating","utf8-base64","angular-md5","chart.js","pascalprecht.translate","tmh.dynamicLocale","atomo_quantico.controllers", "atomo_quantico.services"])
	.run(function($ionicPlatform,$window,$interval,$timeout,$ionicHistory,$ionicPopup,$state,$rootScope){

		$rootScope.appName = "Atomo Quantico" ;
		$rootScope.appLogo = "data/images/icon/xxxhdpi.png" ;
		$rootScope.appVersion = "1.0" ;
		$rootScope.headerShrink = false ;

		$rootScope.liveStatus = "pause" ;
		$ionicPlatform.ready(function(){
			$rootScope.liveStatus = "run" ;
		});
		$ionicPlatform.on("pause",function(){
			$rootScope.liveStatus = "pause" ;
		});
		$ionicPlatform.on("resume",function(){
			$rootScope.liveStatus = "run" ;
		});

		$ionicPlatform.ready(function() {

			localforage.config({
				driver : [localforage.WEBSQL,localforage.INDEXEDDB,localforage.LOCALSTORAGE],
				name : "atomo_quantico",
				storeName : "atomo_quantico",
				description : "The offline datastore for Atomo Quantico app"
			});

			if(window.cordova){
				$rootScope.exist_cordova = true ;
			}else{
				$rootScope.exist_cordova = false ;
			}
			//required: cordova plugin add ionic-plugin-keyboard --save
			if(window.cordova && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				cordova.plugins.Keyboard.disableScroll(true);
			}

			//required: cordova plugin add cordova-plugin-statusbar --save
			if(window.StatusBar) {
				StatusBar.styleDefault();
			}
			// this will create a banner on startup
			//required: cordova plugin add cordova-plugin-admob-free --save
			if (typeof admob !== "undefined"){
				var admobid = {};
				admobid = {
					banner: "",
					interstitial: "",
				};
				
				// banner
				try{
					admob.banner.config({
						id: admobid.banner,
						autoShow: false
					});
					admob.banner.prepare();
				}catch(err){ 
					//alert(err.message);
				}
				
				$ionicPlatform.on("pause",function(){
					try{
						admob.banner.hide();
					}catch(err){ 
						//alert(err.message);
					}
				});
				
				// interstitial
				try{
					admob.interstitial.config({
						id: admobid.interstitial,
						autoShow: false
					});
					admob.interstitial.prepare();
				}catch(err){ 
					//alert(err.message);
				}
			}


			//required: cordova plugin add onesignal-cordova-plugin --save
			if(window.plugins && window.plugins.OneSignal){
				window.plugins.OneSignal.enableNotificationsWhenActive(true);
				var notificationOpenedCallback = function(jsonData){
					try {
						$timeout(function(){
							$window.location = "#/atomo_quantico/" + jsonData.notification.payload.additionalData.page ;
						},200);
					} catch(e){
						console.log("onesignal:" + e);
					}
				}
				window.plugins.OneSignal.startInit("e8c2c921-1050-4aef-9652-9b58cca09b09").handleNotificationOpened(notificationOpenedCallback).endInit();
			}


		});
		$ionicPlatform.registerBackButtonAction(function (e){
			if($ionicHistory.backView()){
				$ionicHistory.goBack();
			}else{
				$state.go("atomo_quantico.principal");
			}
			e.preventDefault();
			return false;
		},101);
	})


	.filter("to_trusted", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])

	.filter("trustUrl", function($sce) {
		return function(url) {
			return $sce.trustAsResourceUrl(url);
		};
	})

	.filter("trustJs", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsJs(text);
		};
	}])

	.filter("strExplode", function() {
		return function($string,$delimiter) {
			if(!$string.length ) return;
			var $_delimiter = $delimiter || "|";
			return $string.split($_delimiter);
		};
	})

	.filter("strDate", function(){
		return function (input) {
			return new Date(input);
		}
	})
	.filter("phpTime", function(){
		return function (input) {
			var timeStamp = parseInt(input) * 1000;
			return timeStamp ;
		}
	})
	.filter("strHTML", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])
	.filter("strEscape",function(){
		return window.encodeURIComponent;
	})
	.filter("strUnscape", ["$sce", function($sce) {
		var div = document.createElement("div");
		return function(text) {
			div.innerHTML = text;
			return $sce.trustAsHtml(div.textContent);
		};
	}])

	.filter("stripTags", ["$sce", function($sce){
		return function(text) {
			return text.replace(/(<([^>]+)>)/ig,"");
		};
	}])

	.filter("chartData", function(){
		return function (obj) {
			var new_items = [];
			angular.forEach(obj, function(child) {
				var new_item = [];
				var indeks = 0;
				angular.forEach(child, function(v){
						if ((indeks !== 0) && (indeks !== 1)){
							new_item.push(v);
						}
						indeks++;
					});
					new_items.push(new_item);
				});
			return new_items;
		}
	})

	.filter("chartLabels", function(){
		return function (obj){
			var new_item = [];
			angular.forEach(obj, function(child) {
			var indeks = 0;
			new_item = [];
			angular.forEach(child, function(v,l) {
				if ((indeks !== 0) && (indeks !== 1)) {
					new_item.push(l);
				}
				indeks++;
			});
			});
			return new_item;
		}
	})
	.filter("chartSeries", function(){
		return function (obj) {
			var new_items = [];
			angular.forEach(obj, function(child) {
				var new_item = [];
				var indeks = 0;
				angular.forEach(child, function(v){
						if (indeks === 1){
							new_item.push(v);
						}
						indeks++;
					});
					new_items.push(new_item);
				});
			return new_items;
		}
	})



.config(["$translateProvider", function ($translateProvider){
	$translateProvider.preferredLanguage("pt-br");
	$translateProvider.useStaticFilesLoader({
		prefix: "translations/",
		suffix: ".json"
	});
	$translateProvider.useSanitizeValueStrategy("escapeParameters");
}])


.config(function(tmhDynamicLocaleProvider){
	tmhDynamicLocaleProvider.localeLocationPattern("lib/ionic/js/i18n/angular-locale_{{locale}}.js");
	tmhDynamicLocaleProvider.defaultLocale("pt-br");
})


.config(function($stateProvider, $urlRouterProvider,$sceDelegateProvider,$httpProvider,$ionicConfigProvider){
	try{
		// Domain Whitelist
		$sceDelegateProvider.resourceUrlWhitelist([
			"self",
			new RegExp('^(http[s]?):\/\/(w{3}.)?youtube\.com/.+$'),
			new RegExp('^(http[s]?):\/\/(w{3}.)?w3schools\.com/.+$'),
		]);
	}catch(err){
		console.log("%cerror: %cdomain whitelist","color:blue;font-size:16px;","color:red;font-size:16px;");
	}
	$stateProvider
	.state("atomo_quantico",{
		url: "/atomo_quantico",
			abstract: true,
			templateUrl: "templates/atomo_quantico-side_menus.html",
			controller: "side_menusCtrl",
	})

	.state("atomo_quantico.about_us", {
		url: "/about_us",
		views: {
			"atomo_quantico-side_menus" : {
						templateUrl:"templates/atomo_quantico-about_us.html",
						controller: "about_usCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("atomo_quantico.aplicacoes_prticas", {
		url: "/aplicacoes_prticas",
		cache:false,
		views: {
			"atomo_quantico-side_menus" : {
						templateUrl:"templates/atomo_quantico-aplicacoes_prticas.html",
						controller: "aplicacoes_prticasCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("atomo_quantico.aplicacoes_prticas_singles", {
		url: "/aplicacoes_prticas_singles/:snippetresourceIdvideoId",
		cache:false,
		views: {
			"atomo_quantico-side_menus" : {
						templateUrl:"templates/atomo_quantico-aplicacoes_prticas_singles.html",
						controller: "aplicacoes_prticas_singlesCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("atomo_quantico.curso_de_mq_e_rh", {
		url: "/curso_de_mq_e_rh",
		cache:false,
		views: {
			"atomo_quantico-side_menus" : {
						templateUrl:"templates/atomo_quantico-curso_de_mq_e_rh.html",
						controller: "curso_de_mq_e_rhCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("atomo_quantico.curso_de_mq_e_rh_singles", {
		url: "/curso_de_mq_e_rh_singles/:snippetresourceIdvideoId",
		cache:false,
		views: {
			"atomo_quantico-side_menus" : {
						templateUrl:"templates/atomo_quantico-curso_de_mq_e_rh_singles.html",
						controller: "curso_de_mq_e_rh_singlesCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("atomo_quantico.dashboard", {
		url: "/dashboard",
		views: {
			"atomo_quantico-side_menus" : {
						templateUrl:"templates/atomo_quantico-dashboard.html",
						controller: "dashboardCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("atomo_quantico.entrevistas", {
		url: "/entrevistas",
		cache:false,
		views: {
			"atomo_quantico-side_menus" : {
						templateUrl:"templates/atomo_quantico-entrevistas.html",
						controller: "entrevistasCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("atomo_quantico.entrevistas_singles", {
		url: "/entrevistas_singles/:snippetresourceIdvideoId",
		cache:false,
		views: {
			"atomo_quantico-side_menus" : {
						templateUrl:"templates/atomo_quantico-entrevistas_singles.html",
						controller: "entrevistas_singlesCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("atomo_quantico.minutos", {
		url: "/minutos",
		cache:false,
		views: {
			"atomo_quantico-side_menus" : {
						templateUrl:"templates/atomo_quantico-minutos.html",
						controller: "minutosCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("atomo_quantico.minutos_singles", {
		url: "/minutos_singles/:snippetresourceIdvideoId",
		cache:false,
		views: {
			"atomo_quantico-side_menus" : {
						templateUrl:"templates/atomo_quantico-minutos_singles.html",
						controller: "minutos_singlesCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("atomo_quantico.principal", {
		url: "/principal",
		views: {
			"atomo_quantico-side_menus" : {
						templateUrl:"templates/atomo_quantico-principal.html",
						controller: "principalCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("atomo_quantico.prosperidade", {
		url: "/prosperidade",
		cache:false,
		views: {
			"atomo_quantico-side_menus" : {
						templateUrl:"templates/atomo_quantico-prosperidade.html",
						controller: "prosperidadeCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("atomo_quantico.prosperidade_singles", {
		url: "/prosperidade_singles/:snippetresourceIdvideoId",
		cache:false,
		views: {
			"atomo_quantico-side_menus" : {
						templateUrl:"templates/atomo_quantico-prosperidade_singles.html",
						controller: "prosperidade_singlesCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("atomo_quantico.slide_tab_menu", {
		url: "/slide_tab_menu",
		views: {
			"atomo_quantico-side_menus" : {
						templateUrl:"templates/atomo_quantico-slide_tab_menu.html",
						controller: "slide_tab_menuCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("atomo_quantico.sobre", {
		url: "/sobre",
		cache:false,
		views: {
			"atomo_quantico-side_menus" : {
						templateUrl:"templates/atomo_quantico-sobre.html",
						controller: "sobreCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("atomo_quantico.vdeos_ii", {
		url: "/vdeos_ii",
		cache:false,
		views: {
			"atomo_quantico-side_menus" : {
						templateUrl:"templates/atomo_quantico-vdeos_ii.html",
						controller: "vdeos_iiCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("atomo_quantico.vdeos_ii_singles", {
		url: "/vdeos_ii_singles/:snippetresourceIdvideoId",
		cache:false,
		views: {
			"atomo_quantico-side_menus" : {
						templateUrl:"templates/atomo_quantico-vdeos_ii_singles.html",
						controller: "vdeos_ii_singlesCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("atomo_quantico.videos2", {
		url: "/videos2",
		views: {
			"atomo_quantico-side_menus" : {
						templateUrl:"templates/atomo_quantico-videos2.html",
						controller: "videos2Ctrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("atomo_quantico.videos3", {
		url: "/videos3",
		views: {
			"atomo_quantico-side_menus" : {
						templateUrl:"templates/atomo_quantico-videos3.html",
						controller: "videos3Ctrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("atomo_quantico.videos_i", {
		url: "/videos_i",
		cache:false,
		views: {
			"atomo_quantico-side_menus" : {
						templateUrl:"templates/atomo_quantico-videos_i.html",
						controller: "videos_iCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("atomo_quantico.videos_i_singles", {
		url: "/videos_i_singles/:snippetresourceIdvideoId",
		cache:false,
		views: {
			"atomo_quantico-side_menus" : {
						templateUrl:"templates/atomo_quantico-videos_i_singles.html",
						controller: "videos_i_singlesCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("atomo_quantico.videos_iii", {
		url: "/videos_iii",
		cache:false,
		views: {
			"atomo_quantico-side_menus" : {
						templateUrl:"templates/atomo_quantico-videos_iii.html",
						controller: "videos_iiiCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("atomo_quantico.videos_iii_singles", {
		url: "/videos_iii_singles/:snippetresourceIdvideoId",
		cache:false,
		views: {
			"atomo_quantico-side_menus" : {
						templateUrl:"templates/atomo_quantico-videos_iii_singles.html",
						controller: "videos_iii_singlesCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	$urlRouterProvider.otherwise("/atomo_quantico/principal");
});
