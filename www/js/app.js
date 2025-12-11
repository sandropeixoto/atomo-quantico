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

    .filter("strHTML", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])

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

	.state("atomo_quantico.dashboard", {
		url: "/dashboard",
		views: {
			"atomo_quantico-side_menus" : {
						templateUrl:"templates/atomo_quantico-dashboard.html",
						controller: "dashboardCtrl"
					}
		}
	})

    .state("atomo_quantico.principal", {
		url: "/principal",
		views: {
			"atomo_quantico-side_menus" : {
						templateUrl:"templates/atomo_quantico-principal.html",
						controller: "principalCtrl"
					}
		}
	})

    .state("atomo_quantico.sobre", {
		url: "/sobre",
		views: {
			"atomo_quantico-side_menus" : {
						templateUrl:"templates/atomo_quantico-sobre.html",
						controller: "sobreCtrl"
					}
		}
	})

    // NOVOS MODULOS
    .state("atomo_quantico.horoscopo", {
		url: "/horoscopo",
		views: {
			"atomo_quantico-side_menus" : {
						templateUrl:"templates/atomo_quantico-horoscopo.html",
						controller: "horoscopoCtrl"
					}
		}
	})

    .state("atomo_quantico.mensagens", {
		url: "/mensagens",
		views: {
			"atomo_quantico-side_menus" : {
						templateUrl:"templates/atomo_quantico-mensagens.html",
						controller: "mensagensCtrl"
					}
		}
	})

    .state("atomo_quantico.chat", {
		url: "/chat",
		views: {
			"atomo_quantico-side_menus" : {
						templateUrl:"templates/atomo_quantico-chat.html",
						controller: "chatCtrl"
					}
		}
	})

    .state("atomo_quantico.agradecimentos", {
		url: "/agradecimentos",
		views: {
			"atomo_quantico-side_menus" : {
						templateUrl:"templates/atomo_quantico-agradecimentos.html",
						controller: "agradecimentosCtrl"
					}
		}
	})

    .state("atomo_quantico.postagens", {
		url: "/postagens",
		views: {
			"atomo_quantico-side_menus" : {
						templateUrl:"templates/atomo_quantico-postagens.html",
						controller: "postagensCtrl"
					}
		}
	})

	$urlRouterProvider.otherwise("/atomo_quantico/dashboard");
});
