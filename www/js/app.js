angular.module("atomo_quantico", ["ngCordova","ionic","ionMdInput","ionic-material","ion-datetime-picker","ionic.rating","utf8-base64","angular-md5","chart.js","pascalprecht.translate","tmh.dynamicLocale","atomo_quantico.controllers", "atomo_quantico.services"])
	.run(function($ionicPlatform,$window,$interval,$timeout,$ionicHistory,$ionicPopup,$state,$rootScope){

		$rootScope.appName = "Atomo Quantico" ;
		$rootScope.appLogo = "data/images/icon/xxxhdpi.png" ;
		$rootScope.appVersion = "1.0" ;
		$rootScope.headerShrink = false ;

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


		});
		$ionicPlatform.registerBackButtonAction(function (e){
			if($ionicHistory.backView()){
				$ionicHistory.goBack();
			}else{
				$state.go("atomo_quantico.dashboard");
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

	.state("atomo_quantico.faqs", {
		url: "/faqs",
		cache:false,
		views: {
			"atomo_quantico-side_menus" : {
						templateUrl:"templates/atomo_quantico-faqs.html",
						controller: "faqsCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("atomo_quantico.faqs_singles", {
		url: "/faqs_singles/:snippetresourceIdvideoId",
		cache:false,
		views: {
			"atomo_quantico-side_menus" : {
						templateUrl:"templates/atomo_quantico-faqs_singles.html",
						controller: "faqs_singlesCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("atomo_quantico.menu_one", {
		url: "/menu_one",
		views: {
			"atomo_quantico-side_menus" : {
						templateUrl:"templates/atomo_quantico-menu_one.html",
						controller: "menu_oneCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("atomo_quantico.menu_two", {
		url: "/menu_two",
		views: {
			"atomo_quantico-side_menus" : {
						templateUrl:"templates/atomo_quantico-menu_two.html",
						controller: "menu_twoCtrl"
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

	.state("atomo_quantico.videos1", {
		url: "/videos1",
		cache:false,
		views: {
			"atomo_quantico-side_menus" : {
						templateUrl:"templates/atomo_quantico-videos1.html",
						controller: "videos1Ctrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("atomo_quantico.videos2", {
		url: "/videos2",
		cache:false,
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
		cache:false,
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

	$urlRouterProvider.otherwise("/atomo_quantico/dashboard");
});
