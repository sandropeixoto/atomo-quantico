angular.module("atomo_quantico.controllers", [])



// TODO: indexCtrl --|-- 
.controller("indexCtrl", function($ionicConfig,$scope,$rootScope,$state,$location,$ionicScrollDelegate,$ionicListDelegate,$http,$httpParamSerializer,$stateParams,$timeout,$interval,$ionicLoading,$ionicPopup,$ionicPopover,$ionicActionSheet,$ionicSlideBoxDelegate,$ionicHistory,ionicMaterialInk,ionicMaterialMotion,$window,$ionicModal,base64,md5,$document,$sce,$ionicGesture,$translate,tmhDynamicLocale){
	
	$rootScope.headerExists = true;

	// TODO: indexCtrl --|-- $rootScope.exitApp
	$rootScope.exitApp = function(){
		var confirmPopup = $ionicPopup.confirm({
			title: "Confirm Exit",
			template: "Are you sure you want to exit?"
		});
		confirmPopup.then(function (close){
			if(close){
				ionic.Platform.exitApp();
			}
			$rootScope.closeMenuPopover();
		});
	};
	
	// TODO: indexCtrl --|-- $rootScope.changeLanguage
	$rootScope.changeLanguage = function(langKey){
		if(typeof langKey !== null){
			$translate.use(langKey);
			tmhDynamicLocale.set(langKey);
			try {
				$rootScope.language_option = langKey;
				localforage.setItem("language_option",langKey);
			}catch(e){
				localforage.setItem("language_option","pt-br");
			}
		}
	};
	
	// TODO: indexCtrl --|-- $rootScope.showLanguageDialog
	var modal_language = "";
	modal_language += "<ion-modal-view>";
	modal_language += "<ion-header-bar class=\"bar bar-header bar-positive-900\">";
	modal_language += "<h1 class=\"title\">{{ 'Language' | translate }}</h1>";
	modal_language += "</ion-header-bar>";
	modal_language += "<ion-content class=\"padding\">";
	modal_language += "<div class=\"list\">";
	modal_language += "<ion-radio icon=\"icon ion-android-radio-button-on\" ng-model=\"language_option\" ng-value=\"'pt-br'\" ng-click=\"tryChangeLanguage('pt-br')\">Portuguese - Brazil</ion-radio>";
	modal_language += "<button class=\"button button-full button-positive-900\" ng-click=\"closeLanguageDialog()\">{{ 'Close' | translate }}</button>";
	modal_language += "</div>";
	modal_language += "</ion-content>";
	modal_language += "</ion-modal-view>";
	
	$rootScope.languageDialog = $ionicModal.fromTemplate(modal_language,{
		scope: $scope,
		animation: "slide-in-up"
	});
	
	$rootScope.showLanguageDialog = function(){
		$rootScope.languageDialog.show();
		localforage.getItem("language_option", function(err, value){
			$rootScope.language_option = value;
		}).then(function(value){
			$rootScope.language_option = value;
		}).catch(function (err){
			$rootScope.language_option = "pt-br";
		})
	};
	
	$rootScope.closeLanguageDialog = function(){
		$rootScope.languageDialog.hide();
		$rootScope.closeMenuPopover();
	};
	
	$rootScope.tryChangeLanguage = function(langKey){
		$rootScope.changeLanguage(langKey);
	};
	
	localforage.getItem("language_option", function(err, value){
		if(value === null){
			localforage.setItem("language_option","pt-br");
		}else{
			$rootScope.changeLanguage(value);
		}
	}).then(function(value){
		if(value === null){
			localforage.setItem("language_option","pt-br");
		}else{
			$rootScope.changeLanguage(value);
		}
	}).catch(function (err){
		localforage.setItem("language_option","pt-br");
	})
	// TODO: indexCtrl --|-- $rootScope.changeFontSize
	$rootScope.changeFontSize = function(fontSize){
		if(typeof fontSize !== null){
			try {
				$rootScope.fontsize_option = $rootScope.fontsize = fontSize;
				localforage.setItem("fontsize_option",fontSize);
			}catch(e){
				localforage.setItem("fontsize_option","normal");
			}
		}
	};
	
	// TODO: indexCtrl --|-- $rootScope.showFontSizeDialog
	var modal_fontsize = "";
	modal_fontsize += "<ion-modal-view>";
	modal_fontsize += "<ion-header-bar class=\"bar bar-header bar-positive-900\">";
	modal_fontsize += "<h1 class=\"title\">{{ 'Font Size' | translate }}</h1>";
	modal_fontsize += "</ion-header-bar>";
	modal_fontsize += "<ion-content class=\"padding\">";
	modal_fontsize += "<div class=\"list\">";
	modal_fontsize += "<ion-radio icon=\"icon ion-android-radio-button-on\" ng-model=\"fontsize_option\" ng-value=\"'small'\" ng-click=\"tryChangeFontSize('small');\">{{ 'Small' | translate }}</ion-radio>";
	modal_fontsize += "<ion-radio icon=\"icon ion-android-radio-button-on\" ng-model=\"fontsize_option\" ng-value=\"'normal'\" ng-click=\"tryChangeFontSize('normal');\">{{ 'Normal' | translate }}</ion-radio>";
	modal_fontsize += "<ion-radio icon=\"icon ion-android-radio-button-on\" ng-model=\"fontsize_option\" ng-value=\"'large'\" ng-click=\"tryChangeFontSize('large');\">{{ 'Large' | translate }}</ion-radio>";
	modal_fontsize += "<button class=\"button button-full button-positive-900\" ng-click=\"closeFontSizeDialog()\">{{ 'Close' | translate }}</button>";
	modal_fontsize += "</div>";
	modal_fontsize += "</ion-content>";
	modal_fontsize += "</ion-modal-view>";
	
	$rootScope.fontSizeDialog = $ionicModal.fromTemplate(modal_fontsize,{
		scope: $scope,
		animation: "slide-in-up"
	});
	
	$rootScope.showFontSizeDialog = function(){
		$rootScope.fontSizeDialog.show();
		localforage.getItem("fontsize_option", function(err, value){
			$rootScope.fontsize_option = $rootScope.fontsize = value;
		}).then(function(value){
			$rootScope.fontsize_option = $rootScope.fontsize = value;
		}).catch(function (err){
			$rootScope.fontsize_option = $rootScope.fontsize = "normal";
		})
	};
	
	$rootScope.closeFontSizeDialog = function(){
		$rootScope.fontSizeDialog.hide();
		$rootScope.closeMenuPopover();
	};
	
	localforage.getItem("fontsize_option", function(err, value){
		if(value === null){
			localforage.setItem("fontsize_option","normal");
		}else{
			$rootScope.changeFontSize(value);
		}
	}).then(function(value){
		if(value === null){
			localforage.setItem("fontsize_option","normal");
		}else{
			$rootScope.changeFontSize(value);
		}
	}).catch(function (err){
		console.log(err);
		localforage.setItem("fontsize_option","normal");
	})
	
	
	$rootScope.tryChangeFontSize = function(val){
		$rootScope.changeFontSize(val);
	};
	
	// TODO: indexCtrl --|-- $rootScope.modal_notification
	var modal_notification = "";
	$rootScope.disable_notification_option = false;
	modal_notification += "<ion-modal-view>";
	modal_notification += "<ion-header-bar class=\"bar bar-header bar-positive-900\">";
	modal_notification += "<h1 class=\"title\">{{ 'Notifications' | translate }}</h1>";
	modal_notification += "</ion-header-bar>";
	modal_notification += "<ion-content class=\"\">";
	modal_notification += "<div class=\"list\">";
	modal_notification += "<ion-toggle ng-model=\"disable_notification_option\"  ng-click=\"tryChangeNotification(disable_notification_option)\">";
	modal_notification += "{{ 'Disable Alerts' | translate }}";
	modal_notification += "</ion-toggle>";
	modal_notification += "<div class=\"item\">";
	modal_notification += "<button class=\"button button-full button-positive-900\" ng-click=\"closeNotificationDialog()\">{{ 'Close' | translate }}</button>";
	modal_notification += "</div>";
	modal_notification += "</div>";
	modal_notification += "</ion-content>";
	modal_notification += "</ion-modal-view>";
	
	$rootScope.notificationDialog = $ionicModal.fromTemplate(modal_notification,{
		scope: $scope,
		animation: "slide-in-up"
	});
	
	$rootScope.showNotificationDialog = function(){
		get_notification();
		$rootScope.notificationDialog.show();
	};
	
	$rootScope.closeNotificationDialog = function(){
		$rootScope.notificationDialog.hide();
		$rootScope.closeMenuPopover();
	};
	
	var get_notification =  function(){
		localforage.getItem("disable_notification_option", function(err, value){
			var notification_value = false ;
			if(value === null){
				notification_value = false ;
			}
			if(value === true){
				notification_value = true ;
			}else{
				notification_value = false ;
			}
			localforage.setItem("disable_notification_option",notification_value);
			$rootScope.disable_notification_option = notification_value ;
		}).then(function(value){
			var notification_value = false ;
			if(value === null){
				notification_value = false ;
			}
			if(value === true){
				notification_value = true ;
			}else{
				notification_value = false ;
			}
			localforage.setItem("disable_notification_option",notification_value);
			$rootScope.disable_notification_option = notification_value ;
		}).catch(function (err){
			localforage.setItem("disable_notification_option",false);
			$rootScope.disable_notification_option = false ;
		})
	
	}
	
	get_notification();
	
	
	$rootScope.tryChangeNotification = function(val){
		$rootScope.changeNotification(val);
	};
	
	
	$rootScope.changeNotification = function(val){
		$rootScope.disable_notification_option = val;
		localforage.setItem("disable_notification_option",val);
	};
	
	
	$scope.$watch("disable_notification_option", function (newValue, oldValue, scope) {
		if(window.plugins && window.plugins.OneSignal){
			if(newValue == true){
				window.plugins.OneSignal.setSubscription(false);
			}else{
				window.plugins.OneSignal.setSubscription(true);
			}
		}
	});
	
	// TODO: indexCtrl --|-- $rootScope.clearCacheApp
	$rootScope.clearCacheApp = function(){
		var confirmPopup = $ionicPopup.confirm({
			title: "Confirm",
			template: "Are you sure you want to clear cache?"
		});
		confirmPopup.then(function (close){
			if(close){
				localforage.keys().then(function(keys) {
					for(var e = 0; e < keys.length ; e++) {
						localforage.setItem(keys[e],[]);
					}
					$state.go("atomo_quantico.principal");
				}).catch(function(err) {
					$state.go("atomo_quantico.principal");
				});
			}
			$rootScope.closeMenuPopover();
		});
	};
	$rootScope.last_edit = "-" ;
	$scope.$on("$ionicView.afterEnter", function (){
		var page_id = $state.current.name ;
		$rootScope.page_id = page_id.replace(".","-") ;
	});
	if($rootScope.headerShrink == true){
		$scope.$on("$ionicView.enter", function(){
			$scope.scrollTop();
		});
	};
	// TODO: indexCtrl --|-- $scope.scrollTop
	$rootScope.scrollTop = function(){
		$timeout(function(){
			$ionicScrollDelegate.$getByHandle("top").scrollTop();
		},100);
	};
	// TODO: indexCtrl --|-- $scope.openURL
	// open external browser 
	$rootScope.openURL = function($url){
		window.open($url,"_system","location=yes");
	};
	// TODO: indexCtrl --|-- $scope.openAppBrowser
	// open AppBrowser
	$rootScope.openAppBrowser = function($url){
		var appBrowser = window.open($url,"_blank","hardwareback=Done,hardwareback=Done,toolbarposition=top,location=yes");
	
		appBrowser.addEventListener("loadstart",function(){
			navigator.notification.activityStart("Please Wait", "Its loading....");
		});
	
	
		appBrowser.addEventListener("loadstop",function(){
			navigator.notification.activityStop();
		});
	
	
		appBrowser.addEventListener("loaderror",function(){
			navigator.notification.activityStop();
			window.location = "retry.html";
		});
	
	
		appBrowser.addEventListener("exit",function(){
			navigator.notification.activityStop();
		});
	
	};
	
	
	// TODO: indexCtrl --|-- $scope.openWebView
	// open WebView
	$rootScope.openWebView = function($url){
		var appWebview = window.open($url,"_blank","location=no,toolbar=no");
	
		appWebview.addEventListener("loadstart",function(){
			navigator.notification.activityStart("Please Wait", "Its loading....");
		});
	
	
		appWebview.addEventListener("loadstop",function(){
			navigator.notification.activityStop();
		});
	
	
		appWebview.addEventListener("loaderror",function(){
			navigator.notification.activityStop();
			window.location = "retry.html";
		});
	
	
		appWebview.addEventListener("exit",function(){
			navigator.notification.activityStop();
		});
	
	};
	
	
	// TODO: indexCtrl --|-- $scope.toggleGroup
	$scope.toggleGroup = function(group) {
		if ($scope.isGroupShown(group)) {
			$scope.shownGroup = null;
		} else {
			$scope.shownGroup = group;
		}
	};
	
	$scope.isGroupShown = function(group) {
		return $scope.shownGroup === group;
	};
	
	// TODO: indexCtrl --|-- $scope.redirect
	// redirect
	$scope.redirect = function($url){
		$window.location.href = $url;
	};
	
	// Set Motion
	$timeout(function(){
		ionicMaterialMotion.slideUp({
			selector: ".slide-up"
		});
	}, 300);
	// code 

	// TODO: indexCtrl --|-- controller_by_user
	// controller by user 
	function controller_by_user(){
		try {
			
			
		} catch(e){
			console.log("%cerror: %cPage: `index` and field: `Custom Controller`","color:blue;font-size:18px","color:red;font-size:18px");
			console.dir(e);
		}
	}
	$scope.rating = {};
	$scope.rating.max = 5;
	
	// animation ink (ionic-material)
	ionicMaterialInk.displayEffect();
	controller_by_user();
})

// TODO: side_menusCtrl --|-- 
.controller("side_menusCtrl", function($ionicConfig,$scope,$rootScope,$state,$location,$ionicScrollDelegate,$ionicListDelegate,$http,$httpParamSerializer,$stateParams,$timeout,$interval,$ionicLoading,$ionicPopup,$ionicPopover,$ionicActionSheet,$ionicSlideBoxDelegate,$ionicHistory,ionicMaterialInk,ionicMaterialMotion,$window,$ionicModal,base64,md5,$document,$sce,$ionicGesture,$translate,tmhDynamicLocale){
	
	$rootScope.headerExists = true;
	$rootScope.ionWidth = $document[0].body.querySelector(".view-container").offsetWidth || 412;
	$rootScope.grid64 = parseInt($rootScope.ionWidth / 64) ;
	$rootScope.grid80 = parseInt($rootScope.ionWidth / 80) ;
	$rootScope.grid128 = parseInt($rootScope.ionWidth / 128) ;
	$rootScope.grid256 = parseInt($rootScope.ionWidth / 256) ;
	$rootScope.last_edit = "-" ;
	$scope.$on("$ionicView.afterEnter", function (){
		var page_id = $state.current.name ;
		$rootScope.page_id = page_id.replace(".","-") ;
	});
	if($rootScope.headerShrink == true){
		$scope.$on("$ionicView.enter", function(){
			$scope.scrollTop();
		});
	};
	// TODO: side_menusCtrl --|-- $scope.scrollTop
	$rootScope.scrollTop = function(){
		$timeout(function(){
			$ionicScrollDelegate.$getByHandle("top").scrollTop();
		},100);
	};
	// TODO: side_menusCtrl --|-- $scope.toggleGroup
	$scope.toggleGroup = function(group) {
		if ($scope.isGroupShown(group)) {
			$scope.shownGroup = null;
		} else {
			$scope.shownGroup = group;
		}
	};
	
	$scope.isGroupShown = function(group) {
		return $scope.shownGroup === group;
	};
	
	// TODO: side_menusCtrl --|-- $scope.redirect
	// redirect
	$scope.redirect = function($url){
		$window.location.href = $url;
	};
	
	// Set Motion
	$timeout(function(){
		ionicMaterialMotion.slideUp({
			selector: ".slide-up"
		});
	}, 300);
	// code 
	
	var popover_template = "";
	popover_template += "<ion-popover-view class=\"fit\">";
	popover_template += "	<ion-content>";
	popover_template += "		<ion-list>";
	popover_template += "			<a  class=\"item dark-ink\" ng-href=\"#/atomo_quantico/sobre\" ng-click=\"popover.hide()\">";
	popover_template += "			{{ 'Sobre' | translate }}";
	popover_template += "			</a>";
	popover_template += "			<a  class=\"item dark-ink\" ng-click=\"showLanguageDialog()\" >";
	popover_template += "			{{ 'Language' | translate }}";
	popover_template += "			</a>";
	popover_template += "		</ion-list>";
	popover_template += "	</ion-content>";
	popover_template += "</ion-popover-view>";
	
	
	$scope.popover = $ionicPopover.fromTemplate(popover_template,{
		scope: $scope
	});
	
	$scope.closePopover = function(){
		$scope.popover.hide();
	};
	
	$rootScope.closeMenuPopover = function(){
		$scope.popover.hide();
	};
	
	$scope.$on("$destroy", function(){
		$scope.popover.remove();
	});

	// TODO: side_menusCtrl --|-- controller_by_user
	// controller by user 
	function controller_by_user(){
		try {
			
			
		} catch(e){
			console.log("%cerror: %cPage: `side_menus` and field: `Custom Controller`","color:blue;font-size:18px","color:red;font-size:18px");
			console.dir(e);
		}
	}
	$scope.rating = {};
	$scope.rating.max = 5;
	
	// animation ink (ionic-material)
	ionicMaterialInk.displayEffect();
	controller_by_user();
})

// TODO: about_usCtrl --|-- 
.controller("about_usCtrl", function($ionicConfig,$scope,$rootScope,$state,$location,$ionicScrollDelegate,$ionicListDelegate,$http,$httpParamSerializer,$stateParams,$timeout,$interval,$ionicLoading,$ionicPopup,$ionicPopover,$ionicActionSheet,$ionicSlideBoxDelegate,$ionicHistory,ionicMaterialInk,ionicMaterialMotion,$window,$ionicModal,base64,md5,$document,$sce,$ionicGesture,$translate,tmhDynamicLocale){
	
	$rootScope.headerExists = true;
	$rootScope.ionWidth = $document[0].body.querySelector(".view-container").offsetWidth || 412;
	$rootScope.grid64 = parseInt($rootScope.ionWidth / 64) ;
	$rootScope.grid80 = parseInt($rootScope.ionWidth / 80) ;
	$rootScope.grid128 = parseInt($rootScope.ionWidth / 128) ;
	$rootScope.grid256 = parseInt($rootScope.ionWidth / 256) ;
	$rootScope.last_edit = "menu" ;
	$scope.$on("$ionicView.afterEnter", function (){
		var page_id = $state.current.name ;
		$rootScope.page_id = page_id.replace(".","-") ;
	});
	if($rootScope.headerShrink == true){
		$scope.$on("$ionicView.enter", function(){
			$scope.scrollTop();
		});
	};
	// TODO: about_usCtrl --|-- $scope.scrollTop
	$rootScope.scrollTop = function(){
		$timeout(function(){
			$ionicScrollDelegate.$getByHandle("top").scrollTop();
		},100);
	};
	// TODO: about_usCtrl --|-- $scope.toggleGroup
	$scope.toggleGroup = function(group) {
		if ($scope.isGroupShown(group)) {
			$scope.shownGroup = null;
		} else {
			$scope.shownGroup = group;
		}
	};
	
	$scope.isGroupShown = function(group) {
		return $scope.shownGroup === group;
	};
	
	// TODO: about_usCtrl --|-- $scope.redirect
	// redirect
	$scope.redirect = function($url){
		$window.location.href = $url;
	};
	
	// Set Motion
	$timeout(function(){
		ionicMaterialMotion.slideUp({
			selector: ".slide-up"
		});
	}, 300);
	// code 

	// TODO: about_usCtrl --|-- controller_by_user
	// controller by user 
	function controller_by_user(){
		try {
			
$ionicConfig.backButton.text("");			
		} catch(e){
			console.log("%cerror: %cPage: `about_us` and field: `Custom Controller`","color:blue;font-size:18px","color:red;font-size:18px");
			console.dir(e);
		}
	}
	$scope.rating = {};
	$scope.rating.max = 5;
	
	// animation ink (ionic-material)
	ionicMaterialInk.displayEffect();
	controller_by_user();
})

// TODO: aplicacoes_prticasCtrl --|-- 
.controller("aplicacoes_prticasCtrl", function($ionicConfig,$scope,$rootScope,$state,$location,$ionicScrollDelegate,$ionicListDelegate,$http,$httpParamSerializer,$stateParams,$timeout,$interval,$ionicLoading,$ionicPopup,$ionicPopover,$ionicActionSheet,$ionicSlideBoxDelegate,$ionicHistory,ionicMaterialInk,ionicMaterialMotion,$window,$ionicModal,base64,md5,$document,$sce,$ionicGesture,$translate,tmhDynamicLocale){
	
	$rootScope.headerExists = true;
	$rootScope.ionWidth = $document[0].body.querySelector(".view-container").offsetWidth || 412;
	$rootScope.grid64 = parseInt($rootScope.ionWidth / 64) ;
	$rootScope.grid80 = parseInt($rootScope.ionWidth / 80) ;
	$rootScope.grid128 = parseInt($rootScope.ionWidth / 128) ;
	$rootScope.grid256 = parseInt($rootScope.ionWidth / 256) ;
	$rootScope.last_edit = "-" ;
	$scope.$on("$ionicView.afterEnter", function (){
		var page_id = $state.current.name ;
		$rootScope.page_id = page_id.replace(".","-") ;
	});
	if($rootScope.headerShrink == true){
		$scope.$on("$ionicView.enter", function(){
			$scope.scrollTop();
		});
	};
	// TODO: aplicacoes_prticasCtrl --|-- $scope.scrollTop
	$rootScope.scrollTop = function(){
		$timeout(function(){
			$ionicScrollDelegate.$getByHandle("top").scrollTop();
		},100);
	};
	// TODO: aplicacoes_prticasCtrl --|-- $scope.toggleGroup
	$scope.toggleGroup = function(group) {
		if ($scope.isGroupShown(group)) {
			$scope.shownGroup = null;
		} else {
			$scope.shownGroup = group;
		}
	};
	
	$scope.isGroupShown = function(group) {
		return $scope.shownGroup === group;
	};
	
	// TODO: aplicacoes_prticasCtrl --|-- $scope.redirect
	// redirect
	$scope.redirect = function($url){
		$window.location.href = $url;
	};
	
	// Set Motion
	$timeout(function(){
		ionicMaterialMotion.slideUp({
			selector: ".slide-up"
		});
	}, 300);
	// TODO: aplicacoes_prticasCtrl --|-- $scope.showAuthentication
	$scope.showAuthentication  = function(){
		var authPopup = $ionicPopup.show({
			template: ' This page required login',
			title: "Authorization",
			subTitle: "Authorization is required",
			scope: $scope,
			buttons: [
				{text:"Cancel",onTap: function(e){
					$state.go("atomo_quantico.principal");
				}},
			],
		}).then(function(form){
		},function(err){
		},function(msg){
		});
	};
	
	// set default parameter http
	var http_params = {};
	
	// set HTTP Header 
	var http_header = {
		headers: {
		},
		params: http_params
	};
	var targetQuery = ""; //default param
	var raplaceWithQuery = "";
	//fix url Aplicações Práticas
	targetQuery = "maxResults=50"; //default param
	raplaceWithQuery = "maxResults=50";
	
	
	// TODO: aplicacoes_prticasCtrl --|-- $scope.splitArray
	$scope.splitArray = function(items,cols,maxItem) {
		var newItems = [];
		if(maxItem == 0){
			maxItem = items.length;
		}
		if(items){
			for (var i=0; i < maxItem; i+=cols) {
				newItems.push(items.slice(i, i+cols));
			}
		}
		return newItems;
	}
	$scope.gmapOptions = {options: { scrollwheel: false }};
	
	var fetch_per_scroll = 1;
	// animation loading 
	$ionicLoading.show();
	
	
	// TODO: aplicacoes_prticasCtrl --|-- $scope.fetchURL
	$scope.fetchURL = "https://www.googleapis.com/youtube/v3/playlistItems?maxResults=50&part=id,snippet&playlistId=PLgyqWKH4bwdRma6amkB-_dUA2IWPeB5kT&key=AIzaSyAXlht6H5iRdt7bgxvx4m-W0QkEkk-depk";
	// TODO: aplicacoes_prticasCtrl --|-- $scope.fetchURLp
	$scope.fetchURLp = "https://www.googleapis.com/youtube/v3/playlistItems?maxResults=50&part=id,snippet&playlistId=PLgyqWKH4bwdRma6amkB-_dUA2IWPeB5kT&key=AIzaSyAXlht6H5iRdt7bgxvx4m-W0QkEkk-depk&callback=JSON_CALLBACK";
	// TODO: aplicacoes_prticasCtrl --|-- $scope.hashURL
	$scope.hashURL = md5.createHash( $scope.fetchURL.replace(targetQuery,raplaceWithQuery));
	
	
	$scope.noMoreItemsAvailable = false; //readmore status
	var lastPush = 0;
	var data_aplicacoes_prticass = [];
	
	localforage.getItem("data_aplicacoes_prticass_" + $scope.hashURL, function(err, get_aplicacoes_prticass){
		if(get_aplicacoes_prticass === null){
			data_aplicacoes_prticass =[];
		}else{
			data_aplicacoes_prticass = JSON.parse(get_aplicacoes_prticass);
			$scope.data_aplicacoes_prticass =JSON.parse( get_aplicacoes_prticass);
			$scope.aplicacoes_prticass = [];
			for(lastPush = 0; lastPush < 100; lastPush++) {
				if (angular.isObject(data_aplicacoes_prticass[lastPush])){
					$scope.aplicacoes_prticass.push(data_aplicacoes_prticass[lastPush]);
				};
			}
			$timeout(function() {
				$ionicLoading.hide();
				controller_by_user();
			},200);
		}
	}).then(function(value){
	}).catch(function (err){
	})
	if(data_aplicacoes_prticass === null ){
		data_aplicacoes_prticass =[];
	}
	if(data_aplicacoes_prticass.length === 0 ){
		$timeout(function() {
			var url_request = $scope.fetchURL.replace(targetQuery,raplaceWithQuery);
			// overwrite HTTP Header 
			http_header = {
				headers: {
				},
				params: http_params
			};
			// TODO: aplicacoes_prticasCtrl --|-- $http.get
			$http.get(url_request,http_header).then(function(response) {
				data_aplicacoes_prticass = response.data.items;
				$scope.data_aplicacoes_prticass = response.data.items;
				// TODO: aplicacoes_prticasCtrl --|---------- set:localforage
				localforage.setItem("data_aplicacoes_prticass_" + $scope.hashURL, JSON.stringify(data_aplicacoes_prticass));
				$scope.aplicacoes_prticass = [];
				for(lastPush = 0; lastPush < 100; lastPush++) {
					if (angular.isObject(data_aplicacoes_prticass[lastPush])){
						$scope.aplicacoes_prticass.push(data_aplicacoes_prticass[lastPush]);
					};
				}
			},function(response) {
			
				$timeout(function() {
					var url_request = $scope.fetchURLp.replace(targetQuery,raplaceWithQuery);
					// overwrite HTTP Header 
					http_header = {
						headers: {
						},
						params: http_params
					};
					// TODO: aplicacoes_prticasCtrl --|------ $http.jsonp
					$http.jsonp(url_request,http_header).success(function(data){
						data_aplicacoes_prticass = data.items;
						$scope.data_aplicacoes_prticass = data.items;
						$ionicLoading.hide();
						// TODO: aplicacoes_prticasCtrl --|---------- set:localforage
						localforage.setItem("data_aplicacoes_prticass_" + $scope.hashURL,JSON.stringify(data_aplicacoes_prticass));
						controller_by_user();
						$scope.aplicacoes_prticass = [];
						for(lastPush = 0; lastPush < 100; lastPush++) {
							if (angular.isObject(data_aplicacoes_prticass[lastPush])){
								$scope.aplicacoes_prticass.push(data_aplicacoes_prticass[lastPush]);
							};
						}
					}).error(function(data){
					if(response.status ===401){
						// TODO: aplicacoes_prticasCtrl --|------------ error:Unauthorized
						$scope.showAuthentication();
					}else{
						// TODO: aplicacoes_prticasCtrl --|------------ error:Message
						var data = { statusText:response.statusText, status:response.status };
						var alertPopup = $ionicPopup.alert({
							title: "Network Error" + " (" + data.status + ")",
							template: "An error occurred while collecting data.",
						});
						$timeout(function() {
							alertPopup.close();
						}, 2000);
					}
					});
				}, 200);
		}).finally(function() {
			$scope.$broadcast("scroll.refreshComplete");
			// event done, hidden animation loading
			$timeout(function() {
				$ionicLoading.hide();
				controller_by_user();
				if(angular.isDefined($scope.data_aplicacoes_prticass.data)){
					if($scope.data_aplicacoes_prticass.data.status ===401){
						$scope.showAuthentication();
						return false;
					}
				}
			}, 200);
		});
	
		}, 200);
	}
	
	
	// TODO: aplicacoes_prticasCtrl --|-- $scope.doRefresh
	$scope.doRefresh = function(){
		var url_request = $scope.fetchURL.replace(targetQuery,raplaceWithQuery);
		// retry retrieving data
		// overwrite http_header 
		http_header = {
			headers: {
			},
			params: http_params
		};
		// TODO: aplicacoes_prticasCtrl --|------ $http.get
		$http.get(url_request,http_header).then(function(response) {
			data_aplicacoes_prticass = response.data.items;
			$scope.data_aplicacoes_prticass = response.data.items;
			// TODO: aplicacoes_prticasCtrl --|---------- set:localforage
			localforage.setItem("data_aplicacoes_prticass_" + $scope.hashURL,JSON.stringify(data_aplicacoes_prticass));
			$scope.aplicacoes_prticass = [];
			for(lastPush = 0; lastPush < 100; lastPush++) {
				if (angular.isObject(data_aplicacoes_prticass[lastPush])){
					$scope.aplicacoes_prticass.push(data_aplicacoes_prticass[lastPush]);
				};
			}
		},function(response){
			
		// retrieving data with jsonp
			$timeout(function() {
			var url_request =$scope.fetchURLp.replace(targetQuery,raplaceWithQuery);
				// overwrite http_header 
				http_header = {
					headers: {
					},
					params: http_params
				};
				// TODO: aplicacoes_prticasCtrl --|---------- $http.jsonp
				$http.jsonp(url_request,http_header).success(function(data){
					data_aplicacoes_prticass = data.items;
					$scope.data_aplicacoes_prticass = data.items;
					$ionicLoading.hide();
					controller_by_user();
					// TODO: aplicacoes_prticasCtrl --|---------- set:localforage
					localforage.setItem("data_aplicacoes_prticass_"+ $scope.hashURL,JSON.stringify(data_aplicacoes_prticass));
					$scope.aplicacoes_prticass = [];
					for(lastPush = 0; lastPush < 100; lastPush++) {
						if (angular.isObject(data_aplicacoes_prticass[lastPush])){
							$scope.aplicacoes_prticass.push(data_aplicacoes_prticass[lastPush]);
						};
					}
				}).error(function(resp){
					if(response.status ===401){
						// TODO: aplicacoes_prticasCtrl --|------------ error:Unauthorized
						$scope.showAuthentication();
					}else{
						// TODO: aplicacoes_prticasCtrl --|------------ error:Message
						var data = { statusText:response.statusText, status:response.status };
						var alertPopup = $ionicPopup.alert({
							title: "Network Error" + " (" + data.status + ")",
							template: "An error occurred while collecting data.",
						});
					};
				});
			}, 200);
		}).finally(function() {
			$scope.$broadcast("scroll.refreshComplete");
			// event done, hidden animation loading
			$timeout(function() {
				$ionicLoading.hide();
				controller_by_user();
			}, 500);
		});
	
	};
	if (data_aplicacoes_prticass === null){
		data_aplicacoes_prticass = [];
	};
	// animation readmore
	var fetchItems = function() {
		for(var z=0;z<fetch_per_scroll;z++){
			if (angular.isObject(data_aplicacoes_prticass[lastPush])){
				$scope.aplicacoes_prticass.push(data_aplicacoes_prticass[lastPush]);
				lastPush++;
			}else{;
				$scope.noMoreItemsAvailable = true;
			}
		}
		$scope.$broadcast("scroll.infiniteScrollComplete");
	};
	
	// event readmore
	$scope.onInfinite = function() {
		$timeout(fetchItems, 500);
	};
	
	// create animation fade slide in right (ionic-material)
	$scope.fireEvent = function(){
		ionicMaterialInk.displayEffect();
	};
	// code 

	// TODO: aplicacoes_prticasCtrl --|-- controller_by_user
	// controller by user 
	function controller_by_user(){
		try {
			
$ionicConfig.backButton.text("");			
		} catch(e){
			console.log("%cerror: %cPage: `aplicacoes_prticas` and field: `Custom Controller`","color:blue;font-size:18px","color:red;font-size:18px");
			console.dir(e);
		}
	}
	$scope.rating = {};
	$scope.rating.max = 5;
	
	// animation ink (ionic-material)
	ionicMaterialInk.displayEffect();
	controller_by_user();
})

// TODO: aplicacoes_prticas_singlesCtrl --|-- 
.controller("aplicacoes_prticas_singlesCtrl", function($ionicConfig,$scope,$rootScope,$state,$location,$ionicScrollDelegate,$ionicListDelegate,$http,$httpParamSerializer,$stateParams,$timeout,$interval,$ionicLoading,$ionicPopup,$ionicPopover,$ionicActionSheet,$ionicSlideBoxDelegate,$ionicHistory,ionicMaterialInk,ionicMaterialMotion,$window,$ionicModal,base64,md5,$document,$sce,$ionicGesture,$translate,tmhDynamicLocale){
	
	$rootScope.headerExists = true;
	$rootScope.ionWidth = $document[0].body.querySelector(".view-container").offsetWidth || 412;
	$rootScope.grid64 = parseInt($rootScope.ionWidth / 64) ;
	$rootScope.grid80 = parseInt($rootScope.ionWidth / 80) ;
	$rootScope.grid128 = parseInt($rootScope.ionWidth / 128) ;
	$rootScope.grid256 = parseInt($rootScope.ionWidth / 256) ;
	$rootScope.last_edit = "page-builder" ;
	$scope.$on("$ionicView.afterEnter", function (){
		var page_id = $state.current.name ;
		$rootScope.page_id = page_id.replace(".","-") ;
	});
	if($rootScope.headerShrink == true){
		$scope.$on("$ionicView.enter", function(){
			$scope.scrollTop();
		});
	};
	// TODO: aplicacoes_prticas_singlesCtrl --|-- $scope.scrollTop
	$rootScope.scrollTop = function(){
		$timeout(function(){
			$ionicScrollDelegate.$getByHandle("top").scrollTop();
		},100);
	};
	// TODO: aplicacoes_prticas_singlesCtrl --|-- $scope.toggleGroup
	$scope.toggleGroup = function(group) {
		if ($scope.isGroupShown(group)) {
			$scope.shownGroup = null;
		} else {
			$scope.shownGroup = group;
		}
	};
	
	$scope.isGroupShown = function(group) {
		return $scope.shownGroup === group;
	};
	
	// TODO: aplicacoes_prticas_singlesCtrl --|-- $scope.redirect
	// redirect
	$scope.redirect = function($url){
		$window.location.href = $url;
	};
	
	// Set Motion
	$timeout(function(){
		ionicMaterialMotion.slideUp({
			selector: ".slide-up"
		});
	}, 300);
	// TODO: aplicacoes_prticas_singlesCtrl --|-- $scope.showAuthentication
	$scope.showAuthentication  = function(){
		var authPopup = $ionicPopup.show({
			template: ' This page required login',
			title: "Authorization",
			subTitle: "Authorization is required",
			scope: $scope,
			buttons: [
				{text:"Cancel",onTap: function(e){
					$state.go("atomo_quantico.principal");
				}},
			],
		}).then(function(form){
		},function(err){
		},function(msg){
		});
	};
	
	// set default parameter http
	var http_params = {};

	// set HTTP Header 
	var http_header = {
		headers: {
		},
		params: http_params
	};
	// animation loading 
	$ionicLoading.show();
	
	// Retrieving data
	var itemID = $stateParams.snippetresourceIdvideoId;
	// TODO: aplicacoes_prticas_singlesCtrl --|-- $scope.fetchURL
	$scope.fetchURL = "https://www.googleapis.com/youtube/v3/playlistItems?maxResults=50&part=id,snippet&playlistId=PLgyqWKH4bwdRma6amkB-_dUA2IWPeB5kT&key=AIzaSyAXlht6H5iRdt7bgxvx4m-W0QkEkk-depk";
	// TODO: aplicacoes_prticas_singlesCtrl --|-- $scope.fetchURLp
	$scope.fetchURLp = "https://www.googleapis.com/youtube/v3/playlistItems?maxResults=50&part=id,snippet&playlistId=PLgyqWKH4bwdRma6amkB-_dUA2IWPeB5kT&key=AIzaSyAXlht6H5iRdt7bgxvx4m-W0QkEkk-depk&callback=JSON_CALLBACK";
	// TODO: aplicacoes_prticas_singlesCtrl --|-- $scope.hashURL
	$scope.hashURL = md5.createHash($scope.fetchURL);
	
	var current_item = [];
	localforage.getItem("data_aplicacoes_prticass_" + $scope.hashURL, function(err, get_datas){
		if(get_datas === null){
			current_item = [];
		}else{
			if(get_datas !== null){
				var datas = JSON.parse(get_datas);
				for (var i = 0; i < datas.length; i++) {
					if((datas[i].snippet.resourceId.videoId ===  parseInt(itemID)) || (datas[i].snippet.resourceId.videoId === itemID.toString())) {
						current_item = datas[i] ;
					}
				}
			}
			// event done, hidden animation loading
			$timeout(function(){
				$ionicLoading.hide();
				$scope.aplicacoes_prticas = current_item ;
				controller_by_user();
			}, 100);
		};
	}).then(function(value){
	}).catch(function (err){
	})
	if( current_item.length === 0 ){
		var itemID = $stateParams.snippetresourceIdvideoId;
		var current_item = [];
	
		// set HTTP Header 
		http_header = {
			headers: {
			},
			params: http_params
		};
		// TODO: aplicacoes_prticas_singlesCtrl --|-- $http.get
		$http.get($scope.fetchURL,http_header).then(function(response) {
			// Get data single
			var datas = response.data;
			// TODO: aplicacoes_prticas_singlesCtrl --|---------- set:localforage
			localforage.setItem("data_aplicacoes_prticass_"+ $scope.hashURL,JSON.stringify(datas));
			for (var i = 0; i < datas.length; i++) {
				if((datas[i].snippet.resourceId.videoId ===  parseInt(itemID)) || (datas[i].snippet.resourceId.videoId === itemID.toString())) {
					current_item = datas[i] ;
				}
			}
		},function(data) {
					// Error message
					var alertPopup = $ionicPopup.alert({
						title: "Network Error" + " (" + data.status + ")",
						template: "An error occurred while collecting data.",
					});
					$timeout(function() {
						alertPopup.close();
					}, 2000);
		}).finally(function() {
			$scope.$broadcast("scroll.refreshComplete");
			// event done, hidden animation loading
			$timeout(function() {
				$ionicLoading.hide();
				$scope.aplicacoes_prticas = current_item ;
				controller_by_user();
			}, 500);
		});
	}
	
	
		// TODO: aplicacoes_prticas_singlesCtrl --|-- $scope.doRefresh
	$scope.doRefresh = function(){
		// Retrieving data
		var itemID = $stateParams.snippetresourceIdvideoId;
		var current_item = [];
		// overwrite http_header 
		http_header = {
			headers: {
			},
			params: http_params
		};
		// TODO: aplicacoes_prticas_singlesCtrl --|------ $http.get
		$http.get($scope.fetchURL,http_header).then(function(response) {
			// Get data single
			var datas = response.data.items;
			// TODO: aplicacoes_prticas_singlesCtrl --|---------- set:localforage
			localforage.setItem("data_aplicacoes_prticass_"+ $scope.hashURL,JSON.stringify(datas));
			for (var i = 0; i < datas.length; i++) {
				if((datas[i].snippet.resourceId.videoId ===  parseInt(itemID)) || (datas[i].snippet.resourceId.videoId === itemID.toString())) {
					current_item = datas[i] ;
				}
			}
		},function(data) {
			// Error message
		// TODO: aplicacoes_prticas_singlesCtrl --|---------- $http.jsonp
				$http.jsonp($scope.fetchURLp,http_header).success(function(response){
					// Get data single
					var datas = response.items;
			// TODO: aplicacoes_prticas_singlesCtrl --|---------- set:localforage
			localforage.setItem("data_aplicacoes_prticass_"+ $scope.hashURL,JSON.stringify(datas));
					for (var i = 0; i < datas.length; i++) {
						if((datas[i].snippetresourceIdvideoId ===  parseInt(itemID)) || (datas[i].snippetresourceIdvideoId === itemID.toString())) {
							current_item = datas[i] ;
						}
					}
						$scope.$broadcast("scroll.refreshComplete");
						// event done, hidden animation loading
						$timeout(function() {
							$ionicLoading.hide();
							$scope.aplicacoes_prticas = current_item ;
							controller_by_user();
						}, 500);
					}).error(function(resp){
						var alertPopup = $ionicPopup.alert({
							title: "Network Error" + " (" + data.status + ")",
							template: "An error occurred while collecting data.",
						});
					});
		}).finally(function() {
			$scope.$broadcast("scroll.refreshComplete");
			// event done, hidden animation loading
			$timeout(function() {
				$ionicLoading.hide();
				$scope.aplicacoes_prticas = current_item ;
				controller_by_user();
			}, 500);
		});
	};
	// code 

	// TODO: aplicacoes_prticas_singlesCtrl --|-- controller_by_user
	// controller by user 
	function controller_by_user(){
		try {
			

    
$ionicConfig.backButton.text("");
$scope.pauseVideo = function() {
    var iframe = document.getElementsByTagName("iframe")[0].contentWindow;
    iframe.postMessage('{"event":"command","func":"' + 'pauseVideo' +   '","args":""}', '*');
}


$scope.playVideo = function() {
    var iframe = document.getElementsByTagName("iframe")[0].contentWindow;
   iframe.postMessage('{"event":"command","func":"' + 'playVideo' +   '","args":""}', '*');
}

$scope.$on("$ionicView.beforeLeave", function(){
	$scope.pauseVideo();
});

$scope.$on("$ionicView.enter", function(){
	$scope.playVideo();
});
			
		} catch(e){
			console.log("%cerror: %cPage: `aplicacoes_prticas_singles` and field: `Custom Controller`","color:blue;font-size:18px","color:red;font-size:18px");
			console.dir(e);
		}
	}
	$scope.rating = {};
	$scope.rating.max = 5;
	
	// animation ink (ionic-material)
	ionicMaterialInk.displayEffect();
	controller_by_user();
})

// TODO: curso_de_mq_e_rhCtrl --|-- 
.controller("curso_de_mq_e_rhCtrl", function($ionicConfig,$scope,$rootScope,$state,$location,$ionicScrollDelegate,$ionicListDelegate,$http,$httpParamSerializer,$stateParams,$timeout,$interval,$ionicLoading,$ionicPopup,$ionicPopover,$ionicActionSheet,$ionicSlideBoxDelegate,$ionicHistory,ionicMaterialInk,ionicMaterialMotion,$window,$ionicModal,base64,md5,$document,$sce,$ionicGesture,$translate,tmhDynamicLocale){
	
	$rootScope.headerExists = true;
	$rootScope.ionWidth = $document[0].body.querySelector(".view-container").offsetWidth || 412;
	$rootScope.grid64 = parseInt($rootScope.ionWidth / 64) ;
	$rootScope.grid80 = parseInt($rootScope.ionWidth / 80) ;
	$rootScope.grid128 = parseInt($rootScope.ionWidth / 128) ;
	$rootScope.grid256 = parseInt($rootScope.ionWidth / 256) ;
	$rootScope.last_edit = "-" ;
	$scope.$on("$ionicView.afterEnter", function (){
		var page_id = $state.current.name ;
		$rootScope.page_id = page_id.replace(".","-") ;
	});
	if($rootScope.headerShrink == true){
		$scope.$on("$ionicView.enter", function(){
			$scope.scrollTop();
		});
	};
	// TODO: curso_de_mq_e_rhCtrl --|-- $scope.scrollTop
	$rootScope.scrollTop = function(){
		$timeout(function(){
			$ionicScrollDelegate.$getByHandle("top").scrollTop();
		},100);
	};
	// TODO: curso_de_mq_e_rhCtrl --|-- $scope.toggleGroup
	$scope.toggleGroup = function(group) {
		if ($scope.isGroupShown(group)) {
			$scope.shownGroup = null;
		} else {
			$scope.shownGroup = group;
		}
	};
	
	$scope.isGroupShown = function(group) {
		return $scope.shownGroup === group;
	};
	
	// TODO: curso_de_mq_e_rhCtrl --|-- $scope.redirect
	// redirect
	$scope.redirect = function($url){
		$window.location.href = $url;
	};
	
	// Set Motion
	$timeout(function(){
		ionicMaterialMotion.slideUp({
			selector: ".slide-up"
		});
	}, 300);
	// TODO: curso_de_mq_e_rhCtrl --|-- $scope.showAuthentication
	$scope.showAuthentication  = function(){
		var authPopup = $ionicPopup.show({
			template: ' This page required login',
			title: "Authorization",
			subTitle: "Authorization is required",
			scope: $scope,
			buttons: [
				{text:"Cancel",onTap: function(e){
					$state.go("atomo_quantico.principal");
				}},
			],
		}).then(function(form){
		},function(err){
		},function(msg){
		});
	};
	
	// set default parameter http
	var http_params = {};
	
	// set HTTP Header 
	var http_header = {
		headers: {
		},
		params: http_params
	};
	var targetQuery = ""; //default param
	var raplaceWithQuery = "";
	//fix url Curso MQ e RH
	targetQuery = "maxResults=50"; //default param
	raplaceWithQuery = "maxResults=50";
	
	
	// TODO: curso_de_mq_e_rhCtrl --|-- $scope.splitArray
	$scope.splitArray = function(items,cols,maxItem) {
		var newItems = [];
		if(maxItem == 0){
			maxItem = items.length;
		}
		if(items){
			for (var i=0; i < maxItem; i+=cols) {
				newItems.push(items.slice(i, i+cols));
			}
		}
		return newItems;
	}
	$scope.gmapOptions = {options: { scrollwheel: false }};
	
	var fetch_per_scroll = 1;
	// animation loading 
	$ionicLoading.show();
	
	
	// TODO: curso_de_mq_e_rhCtrl --|-- $scope.fetchURL
	$scope.fetchURL = "https://www.googleapis.com/youtube/v3/playlistItems?maxResults=50&part=id,snippet&playlistId=PLgyqWKH4bwdRrePXE99jqqPloupw_Nneg&key=AIzaSyAXlht6H5iRdt7bgxvx4m-W0QkEkk-depk";
	// TODO: curso_de_mq_e_rhCtrl --|-- $scope.fetchURLp
	$scope.fetchURLp = "https://www.googleapis.com/youtube/v3/playlistItems?maxResults=50&part=id,snippet&playlistId=PLgyqWKH4bwdRrePXE99jqqPloupw_Nneg&key=AIzaSyAXlht6H5iRdt7bgxvx4m-W0QkEkk-depk&callback=JSON_CALLBACK";
	// TODO: curso_de_mq_e_rhCtrl --|-- $scope.hashURL
	$scope.hashURL = md5.createHash( $scope.fetchURL.replace(targetQuery,raplaceWithQuery));
	
	
	$scope.noMoreItemsAvailable = false; //readmore status
	var lastPush = 0;
	var data_curso_de_mq_e_rhs = [];
	
	localforage.getItem("data_curso_de_mq_e_rhs_" + $scope.hashURL, function(err, get_curso_de_mq_e_rhs){
		if(get_curso_de_mq_e_rhs === null){
			data_curso_de_mq_e_rhs =[];
		}else{
			data_curso_de_mq_e_rhs = JSON.parse(get_curso_de_mq_e_rhs);
			$scope.data_curso_de_mq_e_rhs =JSON.parse( get_curso_de_mq_e_rhs);
			$scope.curso_de_mq_e_rhs = [];
			for(lastPush = 0; lastPush < 100; lastPush++) {
				if (angular.isObject(data_curso_de_mq_e_rhs[lastPush])){
					$scope.curso_de_mq_e_rhs.push(data_curso_de_mq_e_rhs[lastPush]);
				};
			}
			$timeout(function() {
				$ionicLoading.hide();
				controller_by_user();
			},200);
		}
	}).then(function(value){
	}).catch(function (err){
	})
	if(data_curso_de_mq_e_rhs === null ){
		data_curso_de_mq_e_rhs =[];
	}
	if(data_curso_de_mq_e_rhs.length === 0 ){
		$timeout(function() {
			var url_request = $scope.fetchURL.replace(targetQuery,raplaceWithQuery);
			// overwrite HTTP Header 
			http_header = {
				headers: {
				},
				params: http_params
			};
			// TODO: curso_de_mq_e_rhCtrl --|-- $http.get
			$http.get(url_request,http_header).then(function(response) {
				data_curso_de_mq_e_rhs = response.data.items;
				$scope.data_curso_de_mq_e_rhs = response.data.items;
				// TODO: curso_de_mq_e_rhCtrl --|---------- set:localforage
				localforage.setItem("data_curso_de_mq_e_rhs_" + $scope.hashURL, JSON.stringify(data_curso_de_mq_e_rhs));
				$scope.curso_de_mq_e_rhs = [];
				for(lastPush = 0; lastPush < 100; lastPush++) {
					if (angular.isObject(data_curso_de_mq_e_rhs[lastPush])){
						$scope.curso_de_mq_e_rhs.push(data_curso_de_mq_e_rhs[lastPush]);
					};
				}
			},function(response) {
			
				$timeout(function() {
					var url_request = $scope.fetchURLp.replace(targetQuery,raplaceWithQuery);
					// overwrite HTTP Header 
					http_header = {
						headers: {
						},
						params: http_params
					};
					// TODO: curso_de_mq_e_rhCtrl --|------ $http.jsonp
					$http.jsonp(url_request,http_header).success(function(data){
						data_curso_de_mq_e_rhs = data.items;
						$scope.data_curso_de_mq_e_rhs = data.items;
						$ionicLoading.hide();
						// TODO: curso_de_mq_e_rhCtrl --|---------- set:localforage
						localforage.setItem("data_curso_de_mq_e_rhs_" + $scope.hashURL,JSON.stringify(data_curso_de_mq_e_rhs));
						controller_by_user();
						$scope.curso_de_mq_e_rhs = [];
						for(lastPush = 0; lastPush < 100; lastPush++) {
							if (angular.isObject(data_curso_de_mq_e_rhs[lastPush])){
								$scope.curso_de_mq_e_rhs.push(data_curso_de_mq_e_rhs[lastPush]);
							};
						}
					}).error(function(data){
					if(response.status ===401){
						// TODO: curso_de_mq_e_rhCtrl --|------------ error:Unauthorized
						$scope.showAuthentication();
					}else{
						// TODO: curso_de_mq_e_rhCtrl --|------------ error:Message
						var data = { statusText:response.statusText, status:response.status };
						var alertPopup = $ionicPopup.alert({
							title: "Network Error" + " (" + data.status + ")",
							template: "An error occurred while collecting data.",
						});
						$timeout(function() {
							alertPopup.close();
						}, 2000);
					}
					});
				}, 200);
		}).finally(function() {
			$scope.$broadcast("scroll.refreshComplete");
			// event done, hidden animation loading
			$timeout(function() {
				$ionicLoading.hide();
				controller_by_user();
				if(angular.isDefined($scope.data_curso_de_mq_e_rhs.data)){
					if($scope.data_curso_de_mq_e_rhs.data.status ===401){
						$scope.showAuthentication();
						return false;
					}
				}
			}, 200);
		});
	
		}, 200);
	}
	
	
	// TODO: curso_de_mq_e_rhCtrl --|-- $scope.doRefresh
	$scope.doRefresh = function(){
		var url_request = $scope.fetchURL.replace(targetQuery,raplaceWithQuery);
		// retry retrieving data
		// overwrite http_header 
		http_header = {
			headers: {
			},
			params: http_params
		};
		// TODO: curso_de_mq_e_rhCtrl --|------ $http.get
		$http.get(url_request,http_header).then(function(response) {
			data_curso_de_mq_e_rhs = response.data.items;
			$scope.data_curso_de_mq_e_rhs = response.data.items;
			// TODO: curso_de_mq_e_rhCtrl --|---------- set:localforage
			localforage.setItem("data_curso_de_mq_e_rhs_" + $scope.hashURL,JSON.stringify(data_curso_de_mq_e_rhs));
			$scope.curso_de_mq_e_rhs = [];
			for(lastPush = 0; lastPush < 100; lastPush++) {
				if (angular.isObject(data_curso_de_mq_e_rhs[lastPush])){
					$scope.curso_de_mq_e_rhs.push(data_curso_de_mq_e_rhs[lastPush]);
				};
			}
		},function(response){
			
		// retrieving data with jsonp
			$timeout(function() {
			var url_request =$scope.fetchURLp.replace(targetQuery,raplaceWithQuery);
				// overwrite http_header 
				http_header = {
					headers: {
					},
					params: http_params
				};
				// TODO: curso_de_mq_e_rhCtrl --|---------- $http.jsonp
				$http.jsonp(url_request,http_header).success(function(data){
					data_curso_de_mq_e_rhs = data.items;
					$scope.data_curso_de_mq_e_rhs = data.items;
					$ionicLoading.hide();
					controller_by_user();
					// TODO: curso_de_mq_e_rhCtrl --|---------- set:localforage
					localforage.setItem("data_curso_de_mq_e_rhs_"+ $scope.hashURL,JSON.stringify(data_curso_de_mq_e_rhs));
					$scope.curso_de_mq_e_rhs = [];
					for(lastPush = 0; lastPush < 100; lastPush++) {
						if (angular.isObject(data_curso_de_mq_e_rhs[lastPush])){
							$scope.curso_de_mq_e_rhs.push(data_curso_de_mq_e_rhs[lastPush]);
						};
					}
				}).error(function(resp){
					if(response.status ===401){
						// TODO: curso_de_mq_e_rhCtrl --|------------ error:Unauthorized
						$scope.showAuthentication();
					}else{
						// TODO: curso_de_mq_e_rhCtrl --|------------ error:Message
						var data = { statusText:response.statusText, status:response.status };
						var alertPopup = $ionicPopup.alert({
							title: "Network Error" + " (" + data.status + ")",
							template: "An error occurred while collecting data.",
						});
					};
				});
			}, 200);
		}).finally(function() {
			$scope.$broadcast("scroll.refreshComplete");
			// event done, hidden animation loading
			$timeout(function() {
				$ionicLoading.hide();
				controller_by_user();
			}, 500);
		});
	
	};
	if (data_curso_de_mq_e_rhs === null){
		data_curso_de_mq_e_rhs = [];
	};
	// animation readmore
	var fetchItems = function() {
		for(var z=0;z<fetch_per_scroll;z++){
			if (angular.isObject(data_curso_de_mq_e_rhs[lastPush])){
				$scope.curso_de_mq_e_rhs.push(data_curso_de_mq_e_rhs[lastPush]);
				lastPush++;
			}else{;
				$scope.noMoreItemsAvailable = true;
			}
		}
		$scope.$broadcast("scroll.infiniteScrollComplete");
	};
	
	// event readmore
	$scope.onInfinite = function() {
		$timeout(fetchItems, 500);
	};
	
	// create animation fade slide in right (ionic-material)
	$scope.fireEvent = function(){
		ionicMaterialInk.displayEffect();
	};
	// code 

	// TODO: curso_de_mq_e_rhCtrl --|-- controller_by_user
	// controller by user 
	function controller_by_user(){
		try {
			
$ionicConfig.backButton.text("");			
		} catch(e){
			console.log("%cerror: %cPage: `curso_de_mq_e_rh` and field: `Custom Controller`","color:blue;font-size:18px","color:red;font-size:18px");
			console.dir(e);
		}
	}
	$scope.rating = {};
	$scope.rating.max = 5;
	
	// animation ink (ionic-material)
	ionicMaterialInk.displayEffect();
	controller_by_user();
})

// TODO: curso_de_mq_e_rh_singlesCtrl --|-- 
.controller("curso_de_mq_e_rh_singlesCtrl", function($ionicConfig,$scope,$rootScope,$state,$location,$ionicScrollDelegate,$ionicListDelegate,$http,$httpParamSerializer,$stateParams,$timeout,$interval,$ionicLoading,$ionicPopup,$ionicPopover,$ionicActionSheet,$ionicSlideBoxDelegate,$ionicHistory,ionicMaterialInk,ionicMaterialMotion,$window,$ionicModal,base64,md5,$document,$sce,$ionicGesture,$translate,tmhDynamicLocale){
	
	$rootScope.headerExists = true;
	$rootScope.ionWidth = $document[0].body.querySelector(".view-container").offsetWidth || 412;
	$rootScope.grid64 = parseInt($rootScope.ionWidth / 64) ;
	$rootScope.grid80 = parseInt($rootScope.ionWidth / 80) ;
	$rootScope.grid128 = parseInt($rootScope.ionWidth / 128) ;
	$rootScope.grid256 = parseInt($rootScope.ionWidth / 256) ;
	$rootScope.last_edit = "page-builder" ;
	$scope.$on("$ionicView.afterEnter", function (){
		var page_id = $state.current.name ;
		$rootScope.page_id = page_id.replace(".","-") ;
	});
	if($rootScope.headerShrink == true){
		$scope.$on("$ionicView.enter", function(){
			$scope.scrollTop();
		});
	};
	// TODO: curso_de_mq_e_rh_singlesCtrl --|-- $scope.scrollTop
	$rootScope.scrollTop = function(){
		$timeout(function(){
			$ionicScrollDelegate.$getByHandle("top").scrollTop();
		},100);
	};
	// TODO: curso_de_mq_e_rh_singlesCtrl --|-- $scope.toggleGroup
	$scope.toggleGroup = function(group) {
		if ($scope.isGroupShown(group)) {
			$scope.shownGroup = null;
		} else {
			$scope.shownGroup = group;
		}
	};
	
	$scope.isGroupShown = function(group) {
		return $scope.shownGroup === group;
	};
	
	// TODO: curso_de_mq_e_rh_singlesCtrl --|-- $scope.redirect
	// redirect
	$scope.redirect = function($url){
		$window.location.href = $url;
	};
	
	// Set Motion
	$timeout(function(){
		ionicMaterialMotion.slideUp({
			selector: ".slide-up"
		});
	}, 300);
	// TODO: curso_de_mq_e_rh_singlesCtrl --|-- $scope.showAuthentication
	$scope.showAuthentication  = function(){
		var authPopup = $ionicPopup.show({
			template: ' This page required login',
			title: "Authorization",
			subTitle: "Authorization is required",
			scope: $scope,
			buttons: [
				{text:"Cancel",onTap: function(e){
					$state.go("atomo_quantico.principal");
				}},
			],
		}).then(function(form){
		},function(err){
		},function(msg){
		});
	};
	
	// set default parameter http
	var http_params = {};

	// set HTTP Header 
	var http_header = {
		headers: {
		},
		params: http_params
	};
	// animation loading 
	$ionicLoading.show();
	
	// Retrieving data
	var itemID = $stateParams.snippetresourceIdvideoId;
	// TODO: curso_de_mq_e_rh_singlesCtrl --|-- $scope.fetchURL
	$scope.fetchURL = "https://www.googleapis.com/youtube/v3/playlistItems?maxResults=50&part=id,snippet&playlistId=PLgyqWKH4bwdRrePXE99jqqPloupw_Nneg&key=AIzaSyAXlht6H5iRdt7bgxvx4m-W0QkEkk-depk";
	// TODO: curso_de_mq_e_rh_singlesCtrl --|-- $scope.fetchURLp
	$scope.fetchURLp = "https://www.googleapis.com/youtube/v3/playlistItems?maxResults=50&part=id,snippet&playlistId=PLgyqWKH4bwdRrePXE99jqqPloupw_Nneg&key=AIzaSyAXlht6H5iRdt7bgxvx4m-W0QkEkk-depk&callback=JSON_CALLBACK";
	// TODO: curso_de_mq_e_rh_singlesCtrl --|-- $scope.hashURL
	$scope.hashURL = md5.createHash($scope.fetchURL);
	
	var current_item = [];
	localforage.getItem("data_curso_de_mq_e_rhs_" + $scope.hashURL, function(err, get_datas){
		if(get_datas === null){
			current_item = [];
		}else{
			if(get_datas !== null){
				var datas = JSON.parse(get_datas);
				for (var i = 0; i < datas.length; i++) {
					if((datas[i].snippet.resourceId.videoId ===  parseInt(itemID)) || (datas[i].snippet.resourceId.videoId === itemID.toString())) {
						current_item = datas[i] ;
					}
				}
			}
			// event done, hidden animation loading
			$timeout(function(){
				$ionicLoading.hide();
				$scope.curso_de_mq_e_rh = current_item ;
				controller_by_user();
			}, 100);
		};
	}).then(function(value){
	}).catch(function (err){
	})
	if( current_item.length === 0 ){
		var itemID = $stateParams.snippetresourceIdvideoId;
		var current_item = [];
	
		// set HTTP Header 
		http_header = {
			headers: {
			},
			params: http_params
		};
		// TODO: curso_de_mq_e_rh_singlesCtrl --|-- $http.get
		$http.get($scope.fetchURL,http_header).then(function(response) {
			// Get data single
			var datas = response.data;
			// TODO: curso_de_mq_e_rh_singlesCtrl --|---------- set:localforage
			localforage.setItem("data_curso_de_mq_e_rhs_"+ $scope.hashURL,JSON.stringify(datas));
			for (var i = 0; i < datas.length; i++) {
				if((datas[i].snippet.resourceId.videoId ===  parseInt(itemID)) || (datas[i].snippet.resourceId.videoId === itemID.toString())) {
					current_item = datas[i] ;
				}
			}
		},function(data) {
					// Error message
					var alertPopup = $ionicPopup.alert({
						title: "Network Error" + " (" + data.status + ")",
						template: "An error occurred while collecting data.",
					});
					$timeout(function() {
						alertPopup.close();
					}, 2000);
		}).finally(function() {
			$scope.$broadcast("scroll.refreshComplete");
			// event done, hidden animation loading
			$timeout(function() {
				$ionicLoading.hide();
				$scope.curso_de_mq_e_rh = current_item ;
				controller_by_user();
			}, 500);
		});
	}
	
	
		// TODO: curso_de_mq_e_rh_singlesCtrl --|-- $scope.doRefresh
	$scope.doRefresh = function(){
		// Retrieving data
		var itemID = $stateParams.snippetresourceIdvideoId;
		var current_item = [];
		// overwrite http_header 
		http_header = {
			headers: {
			},
			params: http_params
		};
		// TODO: curso_de_mq_e_rh_singlesCtrl --|------ $http.get
		$http.get($scope.fetchURL,http_header).then(function(response) {
			// Get data single
			var datas = response.data.items;
			// TODO: curso_de_mq_e_rh_singlesCtrl --|---------- set:localforage
			localforage.setItem("data_curso_de_mq_e_rhs_"+ $scope.hashURL,JSON.stringify(datas));
			for (var i = 0; i < datas.length; i++) {
				if((datas[i].snippet.resourceId.videoId ===  parseInt(itemID)) || (datas[i].snippet.resourceId.videoId === itemID.toString())) {
					current_item = datas[i] ;
				}
			}
		},function(data) {
			// Error message
		// TODO: curso_de_mq_e_rh_singlesCtrl --|---------- $http.jsonp
				$http.jsonp($scope.fetchURLp,http_header).success(function(response){
					// Get data single
					var datas = response.items;
			// TODO: curso_de_mq_e_rh_singlesCtrl --|---------- set:localforage
			localforage.setItem("data_curso_de_mq_e_rhs_"+ $scope.hashURL,JSON.stringify(datas));
					for (var i = 0; i < datas.length; i++) {
						if((datas[i].snippetresourceIdvideoId ===  parseInt(itemID)) || (datas[i].snippetresourceIdvideoId === itemID.toString())) {
							current_item = datas[i] ;
						}
					}
						$scope.$broadcast("scroll.refreshComplete");
						// event done, hidden animation loading
						$timeout(function() {
							$ionicLoading.hide();
							$scope.curso_de_mq_e_rh = current_item ;
							controller_by_user();
						}, 500);
					}).error(function(resp){
						var alertPopup = $ionicPopup.alert({
							title: "Network Error" + " (" + data.status + ")",
							template: "An error occurred while collecting data.",
						});
					});
		}).finally(function() {
			$scope.$broadcast("scroll.refreshComplete");
			// event done, hidden animation loading
			$timeout(function() {
				$ionicLoading.hide();
				$scope.curso_de_mq_e_rh = current_item ;
				controller_by_user();
			}, 500);
		});
	};
	// code 

	// TODO: curso_de_mq_e_rh_singlesCtrl --|-- controller_by_user
	// controller by user 
	function controller_by_user(){
		try {
			

    
$ionicConfig.backButton.text("");
$scope.pauseVideo = function() {
    var iframe = document.getElementsByTagName("iframe")[0].contentWindow;
    iframe.postMessage('{"event":"command","func":"' + 'pauseVideo' +   '","args":""}', '*');
}


$scope.playVideo = function() {
    var iframe = document.getElementsByTagName("iframe")[0].contentWindow;
   iframe.postMessage('{"event":"command","func":"' + 'playVideo' +   '","args":""}', '*');
}

$scope.$on("$ionicView.beforeLeave", function(){
	$scope.pauseVideo();
});

$scope.$on("$ionicView.enter", function(){
	$scope.playVideo();
});
			
		} catch(e){
			console.log("%cerror: %cPage: `curso_de_mq_e_rh_singles` and field: `Custom Controller`","color:blue;font-size:18px","color:red;font-size:18px");
			console.dir(e);
		}
	}
	$scope.rating = {};
	$scope.rating.max = 5;
	
	// animation ink (ionic-material)
	ionicMaterialInk.displayEffect();
	controller_by_user();
})

// TODO: dashboardCtrl --|-- 
.controller("dashboardCtrl", function($ionicConfig,$scope,$rootScope,$state,$location,$ionicScrollDelegate,$ionicListDelegate,$http,$httpParamSerializer,$stateParams,$timeout,$interval,$ionicLoading,$ionicPopup,$ionicPopover,$ionicActionSheet,$ionicSlideBoxDelegate,$ionicHistory,ionicMaterialInk,ionicMaterialMotion,$window,$ionicModal,base64,md5,$document,$sce,$ionicGesture,$translate,tmhDynamicLocale){
	
	$rootScope.headerExists = true;
	$rootScope.ionWidth = $document[0].body.querySelector(".view-container").offsetWidth || 412;
	$rootScope.grid64 = parseInt($rootScope.ionWidth / 64) ;
	$rootScope.grid80 = parseInt($rootScope.ionWidth / 80) ;
	$rootScope.grid128 = parseInt($rootScope.ionWidth / 128) ;
	$rootScope.grid256 = parseInt($rootScope.ionWidth / 256) ;
	$rootScope.last_edit = "menu" ;
	$scope.$on("$ionicView.afterEnter", function (){
		var page_id = $state.current.name ;
		$rootScope.page_id = page_id.replace(".","-") ;
	});
	if($rootScope.headerShrink == true){
		$scope.$on("$ionicView.enter", function(){
			$scope.scrollTop();
		});
	};
	// TODO: dashboardCtrl --|-- $scope.scrollTop
	$rootScope.scrollTop = function(){
		$timeout(function(){
			$ionicScrollDelegate.$getByHandle("top").scrollTop();
		},100);
	};
	// TODO: dashboardCtrl --|-- $scope.toggleGroup
	$scope.toggleGroup = function(group) {
		if ($scope.isGroupShown(group)) {
			$scope.shownGroup = null;
		} else {
			$scope.shownGroup = group;
		}
	};
	
	$scope.isGroupShown = function(group) {
		return $scope.shownGroup === group;
	};
	
	// TODO: dashboardCtrl --|-- $scope.redirect
	// redirect
	$scope.redirect = function($url){
		$window.location.href = $url;
	};
	
	// Set Motion
	$timeout(function(){
		ionicMaterialMotion.slideUp({
			selector: ".slide-up"
		});
	}, 300);
	// code 

	// TODO: dashboardCtrl --|-- controller_by_user
	// controller by user 
	function controller_by_user(){
		try {
			
$ionicConfig.backButton.text("");			
		} catch(e){
			console.log("%cerror: %cPage: `dashboard` and field: `Custom Controller`","color:blue;font-size:18px","color:red;font-size:18px");
			console.dir(e);
		}
	}
	$scope.rating = {};
	$scope.rating.max = 5;
	
	// animation ink (ionic-material)
	ionicMaterialInk.displayEffect();
	controller_by_user();
})

// TODO: entrevistasCtrl --|-- 
.controller("entrevistasCtrl", function($ionicConfig,$scope,$rootScope,$state,$location,$ionicScrollDelegate,$ionicListDelegate,$http,$httpParamSerializer,$stateParams,$timeout,$interval,$ionicLoading,$ionicPopup,$ionicPopover,$ionicActionSheet,$ionicSlideBoxDelegate,$ionicHistory,ionicMaterialInk,ionicMaterialMotion,$window,$ionicModal,base64,md5,$document,$sce,$ionicGesture,$translate,tmhDynamicLocale){
	
	$rootScope.headerExists = true;
	$rootScope.ionWidth = $document[0].body.querySelector(".view-container").offsetWidth || 412;
	$rootScope.grid64 = parseInt($rootScope.ionWidth / 64) ;
	$rootScope.grid80 = parseInt($rootScope.ionWidth / 80) ;
	$rootScope.grid128 = parseInt($rootScope.ionWidth / 128) ;
	$rootScope.grid256 = parseInt($rootScope.ionWidth / 256) ;
	$rootScope.last_edit = "-" ;
	$scope.$on("$ionicView.afterEnter", function (){
		var page_id = $state.current.name ;
		$rootScope.page_id = page_id.replace(".","-") ;
	});
	if($rootScope.headerShrink == true){
		$scope.$on("$ionicView.enter", function(){
			$scope.scrollTop();
		});
	};
	// TODO: entrevistasCtrl --|-- $scope.scrollTop
	$rootScope.scrollTop = function(){
		$timeout(function(){
			$ionicScrollDelegate.$getByHandle("top").scrollTop();
		},100);
	};
	// TODO: entrevistasCtrl --|-- $scope.toggleGroup
	$scope.toggleGroup = function(group) {
		if ($scope.isGroupShown(group)) {
			$scope.shownGroup = null;
		} else {
			$scope.shownGroup = group;
		}
	};
	
	$scope.isGroupShown = function(group) {
		return $scope.shownGroup === group;
	};
	
	// TODO: entrevistasCtrl --|-- $scope.redirect
	// redirect
	$scope.redirect = function($url){
		$window.location.href = $url;
	};
	
	// Set Motion
	$timeout(function(){
		ionicMaterialMotion.slideUp({
			selector: ".slide-up"
		});
	}, 300);
	// TODO: entrevistasCtrl --|-- $scope.showAuthentication
	$scope.showAuthentication  = function(){
		var authPopup = $ionicPopup.show({
			template: ' This page required login',
			title: "Authorization",
			subTitle: "Authorization is required",
			scope: $scope,
			buttons: [
				{text:"Cancel",onTap: function(e){
					$state.go("atomo_quantico.principal");
				}},
			],
		}).then(function(form){
		},function(err){
		},function(msg){
		});
	};
	
	// set default parameter http
	var http_params = {};
	
	// set HTTP Header 
	var http_header = {
		headers: {
		},
		params: http_params
	};
	var targetQuery = ""; //default param
	var raplaceWithQuery = "";
	//fix url Entrevistas
	targetQuery = "maxResults=50"; //default param
	raplaceWithQuery = "maxResults=50";
	
	
	// TODO: entrevistasCtrl --|-- $scope.splitArray
	$scope.splitArray = function(items,cols,maxItem) {
		var newItems = [];
		if(maxItem == 0){
			maxItem = items.length;
		}
		if(items){
			for (var i=0; i < maxItem; i+=cols) {
				newItems.push(items.slice(i, i+cols));
			}
		}
		return newItems;
	}
	$scope.gmapOptions = {options: { scrollwheel: false }};
	
	var fetch_per_scroll = 1;
	// animation loading 
	$ionicLoading.show();
	
	
	// TODO: entrevistasCtrl --|-- $scope.fetchURL
	$scope.fetchURL = "https://www.googleapis.com/youtube/v3/playlistItems?maxResults=50&part=id,snippet&playlistId=PLgyqWKH4bwdRH4n0vlF3hgyJlBWJVixtv&key=AIzaSyAXlht6H5iRdt7bgxvx4m-W0QkEkk-depk";
	// TODO: entrevistasCtrl --|-- $scope.fetchURLp
	$scope.fetchURLp = "https://www.googleapis.com/youtube/v3/playlistItems?maxResults=50&part=id,snippet&playlistId=PLgyqWKH4bwdRH4n0vlF3hgyJlBWJVixtv&key=AIzaSyAXlht6H5iRdt7bgxvx4m-W0QkEkk-depk&callback=JSON_CALLBACK";
	// TODO: entrevistasCtrl --|-- $scope.hashURL
	$scope.hashURL = md5.createHash( $scope.fetchURL.replace(targetQuery,raplaceWithQuery));
	
	
	$scope.noMoreItemsAvailable = false; //readmore status
	var lastPush = 0;
	var data_entrevistass = [];
	
	localforage.getItem("data_entrevistass_" + $scope.hashURL, function(err, get_entrevistass){
		if(get_entrevistass === null){
			data_entrevistass =[];
		}else{
			data_entrevistass = JSON.parse(get_entrevistass);
			$scope.data_entrevistass =JSON.parse( get_entrevistass);
			$scope.entrevistass = [];
			for(lastPush = 0; lastPush < 100; lastPush++) {
				if (angular.isObject(data_entrevistass[lastPush])){
					$scope.entrevistass.push(data_entrevistass[lastPush]);
				};
			}
			$timeout(function() {
				$ionicLoading.hide();
				controller_by_user();
			},200);
		}
	}).then(function(value){
	}).catch(function (err){
	})
	if(data_entrevistass === null ){
		data_entrevistass =[];
	}
	if(data_entrevistass.length === 0 ){
		$timeout(function() {
			var url_request = $scope.fetchURL.replace(targetQuery,raplaceWithQuery);
			// overwrite HTTP Header 
			http_header = {
				headers: {
				},
				params: http_params
			};
			// TODO: entrevistasCtrl --|-- $http.get
			$http.get(url_request,http_header).then(function(response) {
				data_entrevistass = response.data.items;
				$scope.data_entrevistass = response.data.items;
				// TODO: entrevistasCtrl --|---------- set:localforage
				localforage.setItem("data_entrevistass_" + $scope.hashURL, JSON.stringify(data_entrevistass));
				$scope.entrevistass = [];
				for(lastPush = 0; lastPush < 100; lastPush++) {
					if (angular.isObject(data_entrevistass[lastPush])){
						$scope.entrevistass.push(data_entrevistass[lastPush]);
					};
				}
			},function(response) {
			
				$timeout(function() {
					var url_request = $scope.fetchURLp.replace(targetQuery,raplaceWithQuery);
					// overwrite HTTP Header 
					http_header = {
						headers: {
						},
						params: http_params
					};
					// TODO: entrevistasCtrl --|------ $http.jsonp
					$http.jsonp(url_request,http_header).success(function(data){
						data_entrevistass = data.items;
						$scope.data_entrevistass = data.items;
						$ionicLoading.hide();
						// TODO: entrevistasCtrl --|---------- set:localforage
						localforage.setItem("data_entrevistass_" + $scope.hashURL,JSON.stringify(data_entrevistass));
						controller_by_user();
						$scope.entrevistass = [];
						for(lastPush = 0; lastPush < 100; lastPush++) {
							if (angular.isObject(data_entrevistass[lastPush])){
								$scope.entrevistass.push(data_entrevistass[lastPush]);
							};
						}
					}).error(function(data){
					if(response.status ===401){
						// TODO: entrevistasCtrl --|------------ error:Unauthorized
						$scope.showAuthentication();
					}else{
						// TODO: entrevistasCtrl --|------------ error:Message
						var data = { statusText:response.statusText, status:response.status };
						var alertPopup = $ionicPopup.alert({
							title: "Network Error" + " (" + data.status + ")",
							template: "An error occurred while collecting data.",
						});
						$timeout(function() {
							alertPopup.close();
						}, 2000);
					}
					});
				}, 200);
		}).finally(function() {
			$scope.$broadcast("scroll.refreshComplete");
			// event done, hidden animation loading
			$timeout(function() {
				$ionicLoading.hide();
				controller_by_user();
				if(angular.isDefined($scope.data_entrevistass.data)){
					if($scope.data_entrevistass.data.status ===401){
						$scope.showAuthentication();
						return false;
					}
				}
			}, 200);
		});
	
		}, 200);
	}
	
	
	// TODO: entrevistasCtrl --|-- $scope.doRefresh
	$scope.doRefresh = function(){
		var url_request = $scope.fetchURL.replace(targetQuery,raplaceWithQuery);
		// retry retrieving data
		// overwrite http_header 
		http_header = {
			headers: {
			},
			params: http_params
		};
		// TODO: entrevistasCtrl --|------ $http.get
		$http.get(url_request,http_header).then(function(response) {
			data_entrevistass = response.data.items;
			$scope.data_entrevistass = response.data.items;
			// TODO: entrevistasCtrl --|---------- set:localforage
			localforage.setItem("data_entrevistass_" + $scope.hashURL,JSON.stringify(data_entrevistass));
			$scope.entrevistass = [];
			for(lastPush = 0; lastPush < 100; lastPush++) {
				if (angular.isObject(data_entrevistass[lastPush])){
					$scope.entrevistass.push(data_entrevistass[lastPush]);
				};
			}
		},function(response){
			
		// retrieving data with jsonp
			$timeout(function() {
			var url_request =$scope.fetchURLp.replace(targetQuery,raplaceWithQuery);
				// overwrite http_header 
				http_header = {
					headers: {
					},
					params: http_params
				};
				// TODO: entrevistasCtrl --|---------- $http.jsonp
				$http.jsonp(url_request,http_header).success(function(data){
					data_entrevistass = data.items;
					$scope.data_entrevistass = data.items;
					$ionicLoading.hide();
					controller_by_user();
					// TODO: entrevistasCtrl --|---------- set:localforage
					localforage.setItem("data_entrevistass_"+ $scope.hashURL,JSON.stringify(data_entrevistass));
					$scope.entrevistass = [];
					for(lastPush = 0; lastPush < 100; lastPush++) {
						if (angular.isObject(data_entrevistass[lastPush])){
							$scope.entrevistass.push(data_entrevistass[lastPush]);
						};
					}
				}).error(function(resp){
					if(response.status ===401){
						// TODO: entrevistasCtrl --|------------ error:Unauthorized
						$scope.showAuthentication();
					}else{
						// TODO: entrevistasCtrl --|------------ error:Message
						var data = { statusText:response.statusText, status:response.status };
						var alertPopup = $ionicPopup.alert({
							title: "Network Error" + " (" + data.status + ")",
							template: "An error occurred while collecting data.",
						});
					};
				});
			}, 200);
		}).finally(function() {
			$scope.$broadcast("scroll.refreshComplete");
			// event done, hidden animation loading
			$timeout(function() {
				$ionicLoading.hide();
				controller_by_user();
			}, 500);
		});
	
	};
	if (data_entrevistass === null){
		data_entrevistass = [];
	};
	// animation readmore
	var fetchItems = function() {
		for(var z=0;z<fetch_per_scroll;z++){
			if (angular.isObject(data_entrevistass[lastPush])){
				$scope.entrevistass.push(data_entrevistass[lastPush]);
				lastPush++;
			}else{;
				$scope.noMoreItemsAvailable = true;
			}
		}
		$scope.$broadcast("scroll.infiniteScrollComplete");
	};
	
	// event readmore
	$scope.onInfinite = function() {
		$timeout(fetchItems, 500);
	};
	
	// create animation fade slide in right (ionic-material)
	$scope.fireEvent = function(){
		ionicMaterialInk.displayEffect();
	};
	// code 

	// TODO: entrevistasCtrl --|-- controller_by_user
	// controller by user 
	function controller_by_user(){
		try {
			
$ionicConfig.backButton.text("");			
		} catch(e){
			console.log("%cerror: %cPage: `entrevistas` and field: `Custom Controller`","color:blue;font-size:18px","color:red;font-size:18px");
			console.dir(e);
		}
	}
	$scope.rating = {};
	$scope.rating.max = 5;
	
	// animation ink (ionic-material)
	ionicMaterialInk.displayEffect();
	controller_by_user();
})

// TODO: entrevistas_singlesCtrl --|-- 
.controller("entrevistas_singlesCtrl", function($ionicConfig,$scope,$rootScope,$state,$location,$ionicScrollDelegate,$ionicListDelegate,$http,$httpParamSerializer,$stateParams,$timeout,$interval,$ionicLoading,$ionicPopup,$ionicPopover,$ionicActionSheet,$ionicSlideBoxDelegate,$ionicHistory,ionicMaterialInk,ionicMaterialMotion,$window,$ionicModal,base64,md5,$document,$sce,$ionicGesture,$translate,tmhDynamicLocale){
	
	$rootScope.headerExists = true;
	$rootScope.ionWidth = $document[0].body.querySelector(".view-container").offsetWidth || 412;
	$rootScope.grid64 = parseInt($rootScope.ionWidth / 64) ;
	$rootScope.grid80 = parseInt($rootScope.ionWidth / 80) ;
	$rootScope.grid128 = parseInt($rootScope.ionWidth / 128) ;
	$rootScope.grid256 = parseInt($rootScope.ionWidth / 256) ;
	$rootScope.last_edit = "page-builder" ;
	$scope.$on("$ionicView.afterEnter", function (){
		var page_id = $state.current.name ;
		$rootScope.page_id = page_id.replace(".","-") ;
	});
	if($rootScope.headerShrink == true){
		$scope.$on("$ionicView.enter", function(){
			$scope.scrollTop();
		});
	};
	// TODO: entrevistas_singlesCtrl --|-- $scope.scrollTop
	$rootScope.scrollTop = function(){
		$timeout(function(){
			$ionicScrollDelegate.$getByHandle("top").scrollTop();
		},100);
	};
	// TODO: entrevistas_singlesCtrl --|-- $scope.toggleGroup
	$scope.toggleGroup = function(group) {
		if ($scope.isGroupShown(group)) {
			$scope.shownGroup = null;
		} else {
			$scope.shownGroup = group;
		}
	};
	
	$scope.isGroupShown = function(group) {
		return $scope.shownGroup === group;
	};
	
	// TODO: entrevistas_singlesCtrl --|-- $scope.redirect
	// redirect
	$scope.redirect = function($url){
		$window.location.href = $url;
	};
	
	// Set Motion
	$timeout(function(){
		ionicMaterialMotion.slideUp({
			selector: ".slide-up"
		});
	}, 300);
	// TODO: entrevistas_singlesCtrl --|-- $scope.showAuthentication
	$scope.showAuthentication  = function(){
		var authPopup = $ionicPopup.show({
			template: ' This page required login',
			title: "Authorization",
			subTitle: "Authorization is required",
			scope: $scope,
			buttons: [
				{text:"Cancel",onTap: function(e){
					$state.go("atomo_quantico.principal");
				}},
			],
		}).then(function(form){
		},function(err){
		},function(msg){
		});
	};
	
	// set default parameter http
	var http_params = {};

	// set HTTP Header 
	var http_header = {
		headers: {
		},
		params: http_params
	};
	// animation loading 
	$ionicLoading.show();
	
	// Retrieving data
	var itemID = $stateParams.snippetresourceIdvideoId;
	// TODO: entrevistas_singlesCtrl --|-- $scope.fetchURL
	$scope.fetchURL = "https://www.googleapis.com/youtube/v3/playlistItems?maxResults=50&part=id,snippet&playlistId=PLgyqWKH4bwdRH4n0vlF3hgyJlBWJVixtv&key=AIzaSyAXlht6H5iRdt7bgxvx4m-W0QkEkk-depk";
	// TODO: entrevistas_singlesCtrl --|-- $scope.fetchURLp
	$scope.fetchURLp = "https://www.googleapis.com/youtube/v3/playlistItems?maxResults=50&part=id,snippet&playlistId=PLgyqWKH4bwdRH4n0vlF3hgyJlBWJVixtv&key=AIzaSyAXlht6H5iRdt7bgxvx4m-W0QkEkk-depk&callback=JSON_CALLBACK";
	// TODO: entrevistas_singlesCtrl --|-- $scope.hashURL
	$scope.hashURL = md5.createHash($scope.fetchURL);
	
	var current_item = [];
	localforage.getItem("data_entrevistass_" + $scope.hashURL, function(err, get_datas){
		if(get_datas === null){
			current_item = [];
		}else{
			if(get_datas !== null){
				var datas = JSON.parse(get_datas);
				for (var i = 0; i < datas.length; i++) {
					if((datas[i].snippet.resourceId.videoId ===  parseInt(itemID)) || (datas[i].snippet.resourceId.videoId === itemID.toString())) {
						current_item = datas[i] ;
					}
				}
			}
			// event done, hidden animation loading
			$timeout(function(){
				$ionicLoading.hide();
				$scope.entrevistas = current_item ;
				controller_by_user();
			}, 100);
		};
	}).then(function(value){
	}).catch(function (err){
	})
	if( current_item.length === 0 ){
		var itemID = $stateParams.snippetresourceIdvideoId;
		var current_item = [];
	
		// set HTTP Header 
		http_header = {
			headers: {
			},
			params: http_params
		};
		// TODO: entrevistas_singlesCtrl --|-- $http.get
		$http.get($scope.fetchURL,http_header).then(function(response) {
			// Get data single
			var datas = response.data;
			// TODO: entrevistas_singlesCtrl --|---------- set:localforage
			localforage.setItem("data_entrevistass_"+ $scope.hashURL,JSON.stringify(datas));
			for (var i = 0; i < datas.length; i++) {
				if((datas[i].snippet.resourceId.videoId ===  parseInt(itemID)) || (datas[i].snippet.resourceId.videoId === itemID.toString())) {
					current_item = datas[i] ;
				}
			}
		},function(data) {
					// Error message
					var alertPopup = $ionicPopup.alert({
						title: "Network Error" + " (" + data.status + ")",
						template: "An error occurred while collecting data.",
					});
					$timeout(function() {
						alertPopup.close();
					}, 2000);
		}).finally(function() {
			$scope.$broadcast("scroll.refreshComplete");
			// event done, hidden animation loading
			$timeout(function() {
				$ionicLoading.hide();
				$scope.entrevistas = current_item ;
				controller_by_user();
			}, 500);
		});
	}
	
	
		// TODO: entrevistas_singlesCtrl --|-- $scope.doRefresh
	$scope.doRefresh = function(){
		// Retrieving data
		var itemID = $stateParams.snippetresourceIdvideoId;
		var current_item = [];
		// overwrite http_header 
		http_header = {
			headers: {
			},
			params: http_params
		};
		// TODO: entrevistas_singlesCtrl --|------ $http.get
		$http.get($scope.fetchURL,http_header).then(function(response) {
			// Get data single
			var datas = response.data.items;
			// TODO: entrevistas_singlesCtrl --|---------- set:localforage
			localforage.setItem("data_entrevistass_"+ $scope.hashURL,JSON.stringify(datas));
			for (var i = 0; i < datas.length; i++) {
				if((datas[i].snippet.resourceId.videoId ===  parseInt(itemID)) || (datas[i].snippet.resourceId.videoId === itemID.toString())) {
					current_item = datas[i] ;
				}
			}
		},function(data) {
			// Error message
		// TODO: entrevistas_singlesCtrl --|---------- $http.jsonp
				$http.jsonp($scope.fetchURLp,http_header).success(function(response){
					// Get data single
					var datas = response.items;
			// TODO: entrevistas_singlesCtrl --|---------- set:localforage
			localforage.setItem("data_entrevistass_"+ $scope.hashURL,JSON.stringify(datas));
					for (var i = 0; i < datas.length; i++) {
						if((datas[i].snippetresourceIdvideoId ===  parseInt(itemID)) || (datas[i].snippetresourceIdvideoId === itemID.toString())) {
							current_item = datas[i] ;
						}
					}
						$scope.$broadcast("scroll.refreshComplete");
						// event done, hidden animation loading
						$timeout(function() {
							$ionicLoading.hide();
							$scope.entrevistas = current_item ;
							controller_by_user();
						}, 500);
					}).error(function(resp){
						var alertPopup = $ionicPopup.alert({
							title: "Network Error" + " (" + data.status + ")",
							template: "An error occurred while collecting data.",
						});
					});
		}).finally(function() {
			$scope.$broadcast("scroll.refreshComplete");
			// event done, hidden animation loading
			$timeout(function() {
				$ionicLoading.hide();
				$scope.entrevistas = current_item ;
				controller_by_user();
			}, 500);
		});
	};
	// code 

	// TODO: entrevistas_singlesCtrl --|-- controller_by_user
	// controller by user 
	function controller_by_user(){
		try {
			

    
$ionicConfig.backButton.text("");
$scope.pauseVideo = function() {
    var iframe = document.getElementsByTagName("iframe")[0].contentWindow;
    iframe.postMessage('{"event":"command","func":"' + 'pauseVideo' +   '","args":""}', '*');
}


$scope.playVideo = function() {
    var iframe = document.getElementsByTagName("iframe")[0].contentWindow;
   iframe.postMessage('{"event":"command","func":"' + 'playVideo' +   '","args":""}', '*');
}

$scope.$on("$ionicView.beforeLeave", function(){
	$scope.pauseVideo();
});

$scope.$on("$ionicView.enter", function(){
	$scope.playVideo();
});
			
		} catch(e){
			console.log("%cerror: %cPage: `entrevistas_singles` and field: `Custom Controller`","color:blue;font-size:18px","color:red;font-size:18px");
			console.dir(e);
		}
	}
	$scope.rating = {};
	$scope.rating.max = 5;
	
	// animation ink (ionic-material)
	ionicMaterialInk.displayEffect();
	controller_by_user();
})

// TODO: minutosCtrl --|-- 
.controller("minutosCtrl", function($ionicConfig,$scope,$rootScope,$state,$location,$ionicScrollDelegate,$ionicListDelegate,$http,$httpParamSerializer,$stateParams,$timeout,$interval,$ionicLoading,$ionicPopup,$ionicPopover,$ionicActionSheet,$ionicSlideBoxDelegate,$ionicHistory,ionicMaterialInk,ionicMaterialMotion,$window,$ionicModal,base64,md5,$document,$sce,$ionicGesture,$translate,tmhDynamicLocale){
	
	$rootScope.headerExists = true;
	$rootScope.ionWidth = $document[0].body.querySelector(".view-container").offsetWidth || 412;
	$rootScope.grid64 = parseInt($rootScope.ionWidth / 64) ;
	$rootScope.grid80 = parseInt($rootScope.ionWidth / 80) ;
	$rootScope.grid128 = parseInt($rootScope.ionWidth / 128) ;
	$rootScope.grid256 = parseInt($rootScope.ionWidth / 256) ;
	$rootScope.last_edit = "-" ;
	$scope.$on("$ionicView.afterEnter", function (){
		var page_id = $state.current.name ;
		$rootScope.page_id = page_id.replace(".","-") ;
	});
	if($rootScope.headerShrink == true){
		$scope.$on("$ionicView.enter", function(){
			$scope.scrollTop();
		});
	};
	// TODO: minutosCtrl --|-- $scope.scrollTop
	$rootScope.scrollTop = function(){
		$timeout(function(){
			$ionicScrollDelegate.$getByHandle("top").scrollTop();
		},100);
	};
	// TODO: minutosCtrl --|-- $scope.toggleGroup
	$scope.toggleGroup = function(group) {
		if ($scope.isGroupShown(group)) {
			$scope.shownGroup = null;
		} else {
			$scope.shownGroup = group;
		}
	};
	
	$scope.isGroupShown = function(group) {
		return $scope.shownGroup === group;
	};
	
	// TODO: minutosCtrl --|-- $scope.redirect
	// redirect
	$scope.redirect = function($url){
		$window.location.href = $url;
	};
	
	// Set Motion
	$timeout(function(){
		ionicMaterialMotion.slideUp({
			selector: ".slide-up"
		});
	}, 300);
	// TODO: minutosCtrl --|-- $scope.showAuthentication
	$scope.showAuthentication  = function(){
		var authPopup = $ionicPopup.show({
			template: ' This page required login',
			title: "Authorization",
			subTitle: "Authorization is required",
			scope: $scope,
			buttons: [
				{text:"Cancel",onTap: function(e){
					$state.go("atomo_quantico.principal");
				}},
			],
		}).then(function(form){
		},function(err){
		},function(msg){
		});
	};
	
	// set default parameter http
	var http_params = {};
	
	// set HTTP Header 
	var http_header = {
		headers: {
		},
		params: http_params
	};
	var targetQuery = ""; //default param
	var raplaceWithQuery = "";
	//fix url Minutos com Hélio Couto
	targetQuery = "maxResults=50"; //default param
	raplaceWithQuery = "maxResults=50";
	
	
	// TODO: minutosCtrl --|-- $scope.splitArray
	$scope.splitArray = function(items,cols,maxItem) {
		var newItems = [];
		if(maxItem == 0){
			maxItem = items.length;
		}
		if(items){
			for (var i=0; i < maxItem; i+=cols) {
				newItems.push(items.slice(i, i+cols));
			}
		}
		return newItems;
	}
	$scope.gmapOptions = {options: { scrollwheel: false }};
	
	var fetch_per_scroll = 1;
	// animation loading 
	$ionicLoading.show();
	
	
	// TODO: minutosCtrl --|-- $scope.fetchURL
	$scope.fetchURL = "https://www.googleapis.com/youtube/v3/playlistItems?maxResults=50&part=id,snippet&playlistId=PLgyqWKH4bwdR8k9m59x1G-ahCHPCjKVXU&key=AIzaSyAXlht6H5iRdt7bgxvx4m-W0QkEkk-depk";
	// TODO: minutosCtrl --|-- $scope.fetchURLp
	$scope.fetchURLp = "https://www.googleapis.com/youtube/v3/playlistItems?maxResults=50&part=id,snippet&playlistId=PLgyqWKH4bwdR8k9m59x1G-ahCHPCjKVXU&key=AIzaSyAXlht6H5iRdt7bgxvx4m-W0QkEkk-depk&callback=JSON_CALLBACK";
	// TODO: minutosCtrl --|-- $scope.hashURL
	$scope.hashURL = md5.createHash( $scope.fetchURL.replace(targetQuery,raplaceWithQuery));
	
	
	$scope.noMoreItemsAvailable = false; //readmore status
	var lastPush = 0;
	var data_minutoss = [];
	
	localforage.getItem("data_minutoss_" + $scope.hashURL, function(err, get_minutoss){
		if(get_minutoss === null){
			data_minutoss =[];
		}else{
			data_minutoss = JSON.parse(get_minutoss);
			$scope.data_minutoss =JSON.parse( get_minutoss);
			$scope.minutoss = [];
			for(lastPush = 0; lastPush < 100; lastPush++) {
				if (angular.isObject(data_minutoss[lastPush])){
					$scope.minutoss.push(data_minutoss[lastPush]);
				};
			}
			$timeout(function() {
				$ionicLoading.hide();
				controller_by_user();
			},200);
		}
	}).then(function(value){
	}).catch(function (err){
	})
	if(data_minutoss === null ){
		data_minutoss =[];
	}
	if(data_minutoss.length === 0 ){
		$timeout(function() {
			var url_request = $scope.fetchURL.replace(targetQuery,raplaceWithQuery);
			// overwrite HTTP Header 
			http_header = {
				headers: {
				},
				params: http_params
			};
			// TODO: minutosCtrl --|-- $http.get
			$http.get(url_request,http_header).then(function(response) {
				data_minutoss = response.data.items;
				$scope.data_minutoss = response.data.items;
				// TODO: minutosCtrl --|---------- set:localforage
				localforage.setItem("data_minutoss_" + $scope.hashURL, JSON.stringify(data_minutoss));
				$scope.minutoss = [];
				for(lastPush = 0; lastPush < 100; lastPush++) {
					if (angular.isObject(data_minutoss[lastPush])){
						$scope.minutoss.push(data_minutoss[lastPush]);
					};
				}
			},function(response) {
			
				$timeout(function() {
					var url_request = $scope.fetchURLp.replace(targetQuery,raplaceWithQuery);
					// overwrite HTTP Header 
					http_header = {
						headers: {
						},
						params: http_params
					};
					// TODO: minutosCtrl --|------ $http.jsonp
					$http.jsonp(url_request,http_header).success(function(data){
						data_minutoss = data.items;
						$scope.data_minutoss = data.items;
						$ionicLoading.hide();
						// TODO: minutosCtrl --|---------- set:localforage
						localforage.setItem("data_minutoss_" + $scope.hashURL,JSON.stringify(data_minutoss));
						controller_by_user();
						$scope.minutoss = [];
						for(lastPush = 0; lastPush < 100; lastPush++) {
							if (angular.isObject(data_minutoss[lastPush])){
								$scope.minutoss.push(data_minutoss[lastPush]);
							};
						}
					}).error(function(data){
					if(response.status ===401){
						// TODO: minutosCtrl --|------------ error:Unauthorized
						$scope.showAuthentication();
					}else{
						// TODO: minutosCtrl --|------------ error:Message
						var data = { statusText:response.statusText, status:response.status };
						var alertPopup = $ionicPopup.alert({
							title: "Network Error" + " (" + data.status + ")",
							template: "An error occurred while collecting data.",
						});
						$timeout(function() {
							alertPopup.close();
						}, 2000);
					}
					});
				}, 200);
		}).finally(function() {
			$scope.$broadcast("scroll.refreshComplete");
			// event done, hidden animation loading
			$timeout(function() {
				$ionicLoading.hide();
				controller_by_user();
				if(angular.isDefined($scope.data_minutoss.data)){
					if($scope.data_minutoss.data.status ===401){
						$scope.showAuthentication();
						return false;
					}
				}
			}, 200);
		});
	
		}, 200);
	}
	
	
	// TODO: minutosCtrl --|-- $scope.doRefresh
	$scope.doRefresh = function(){
		var url_request = $scope.fetchURL.replace(targetQuery,raplaceWithQuery);
		// retry retrieving data
		// overwrite http_header 
		http_header = {
			headers: {
			},
			params: http_params
		};
		// TODO: minutosCtrl --|------ $http.get
		$http.get(url_request,http_header).then(function(response) {
			data_minutoss = response.data.items;
			$scope.data_minutoss = response.data.items;
			// TODO: minutosCtrl --|---------- set:localforage
			localforage.setItem("data_minutoss_" + $scope.hashURL,JSON.stringify(data_minutoss));
			$scope.minutoss = [];
			for(lastPush = 0; lastPush < 100; lastPush++) {
				if (angular.isObject(data_minutoss[lastPush])){
					$scope.minutoss.push(data_minutoss[lastPush]);
				};
			}
		},function(response){
			
		// retrieving data with jsonp
			$timeout(function() {
			var url_request =$scope.fetchURLp.replace(targetQuery,raplaceWithQuery);
				// overwrite http_header 
				http_header = {
					headers: {
					},
					params: http_params
				};
				// TODO: minutosCtrl --|---------- $http.jsonp
				$http.jsonp(url_request,http_header).success(function(data){
					data_minutoss = data.items;
					$scope.data_minutoss = data.items;
					$ionicLoading.hide();
					controller_by_user();
					// TODO: minutosCtrl --|---------- set:localforage
					localforage.setItem("data_minutoss_"+ $scope.hashURL,JSON.stringify(data_minutoss));
					$scope.minutoss = [];
					for(lastPush = 0; lastPush < 100; lastPush++) {
						if (angular.isObject(data_minutoss[lastPush])){
							$scope.minutoss.push(data_minutoss[lastPush]);
						};
					}
				}).error(function(resp){
					if(response.status ===401){
						// TODO: minutosCtrl --|------------ error:Unauthorized
						$scope.showAuthentication();
					}else{
						// TODO: minutosCtrl --|------------ error:Message
						var data = { statusText:response.statusText, status:response.status };
						var alertPopup = $ionicPopup.alert({
							title: "Network Error" + " (" + data.status + ")",
							template: "An error occurred while collecting data.",
						});
					};
				});
			}, 200);
		}).finally(function() {
			$scope.$broadcast("scroll.refreshComplete");
			// event done, hidden animation loading
			$timeout(function() {
				$ionicLoading.hide();
				controller_by_user();
			}, 500);
		});
	
	};
	if (data_minutoss === null){
		data_minutoss = [];
	};
	// animation readmore
	var fetchItems = function() {
		for(var z=0;z<fetch_per_scroll;z++){
			if (angular.isObject(data_minutoss[lastPush])){
				$scope.minutoss.push(data_minutoss[lastPush]);
				lastPush++;
			}else{;
				$scope.noMoreItemsAvailable = true;
			}
		}
		$scope.$broadcast("scroll.infiniteScrollComplete");
	};
	
	// event readmore
	$scope.onInfinite = function() {
		$timeout(fetchItems, 500);
	};
	
	// create animation fade slide in right (ionic-material)
	$scope.fireEvent = function(){
		ionicMaterialInk.displayEffect();
	};
	// code 

	// TODO: minutosCtrl --|-- controller_by_user
	// controller by user 
	function controller_by_user(){
		try {
			
$ionicConfig.backButton.text("");			
		} catch(e){
			console.log("%cerror: %cPage: `minutos` and field: `Custom Controller`","color:blue;font-size:18px","color:red;font-size:18px");
			console.dir(e);
		}
	}
	$scope.rating = {};
	$scope.rating.max = 5;
	
	// animation ink (ionic-material)
	ionicMaterialInk.displayEffect();
	controller_by_user();
})

// TODO: minutos_singlesCtrl --|-- 
.controller("minutos_singlesCtrl", function($ionicConfig,$scope,$rootScope,$state,$location,$ionicScrollDelegate,$ionicListDelegate,$http,$httpParamSerializer,$stateParams,$timeout,$interval,$ionicLoading,$ionicPopup,$ionicPopover,$ionicActionSheet,$ionicSlideBoxDelegate,$ionicHistory,ionicMaterialInk,ionicMaterialMotion,$window,$ionicModal,base64,md5,$document,$sce,$ionicGesture,$translate,tmhDynamicLocale){
	
	$rootScope.headerExists = true;
	$rootScope.ionWidth = $document[0].body.querySelector(".view-container").offsetWidth || 412;
	$rootScope.grid64 = parseInt($rootScope.ionWidth / 64) ;
	$rootScope.grid80 = parseInt($rootScope.ionWidth / 80) ;
	$rootScope.grid128 = parseInt($rootScope.ionWidth / 128) ;
	$rootScope.grid256 = parseInt($rootScope.ionWidth / 256) ;
	$rootScope.last_edit = "page-builder" ;
	$scope.$on("$ionicView.afterEnter", function (){
		var page_id = $state.current.name ;
		$rootScope.page_id = page_id.replace(".","-") ;
	});
	if($rootScope.headerShrink == true){
		$scope.$on("$ionicView.enter", function(){
			$scope.scrollTop();
		});
	};
	// TODO: minutos_singlesCtrl --|-- $scope.scrollTop
	$rootScope.scrollTop = function(){
		$timeout(function(){
			$ionicScrollDelegate.$getByHandle("top").scrollTop();
		},100);
	};
	// TODO: minutos_singlesCtrl --|-- $scope.toggleGroup
	$scope.toggleGroup = function(group) {
		if ($scope.isGroupShown(group)) {
			$scope.shownGroup = null;
		} else {
			$scope.shownGroup = group;
		}
	};
	
	$scope.isGroupShown = function(group) {
		return $scope.shownGroup === group;
	};
	
	// TODO: minutos_singlesCtrl --|-- $scope.redirect
	// redirect
	$scope.redirect = function($url){
		$window.location.href = $url;
	};
	
	// Set Motion
	$timeout(function(){
		ionicMaterialMotion.slideUp({
			selector: ".slide-up"
		});
	}, 300);
	// TODO: minutos_singlesCtrl --|-- $scope.showAuthentication
	$scope.showAuthentication  = function(){
		var authPopup = $ionicPopup.show({
			template: ' This page required login',
			title: "Authorization",
			subTitle: "Authorization is required",
			scope: $scope,
			buttons: [
				{text:"Cancel",onTap: function(e){
					$state.go("atomo_quantico.principal");
				}},
			],
		}).then(function(form){
		},function(err){
		},function(msg){
		});
	};
	
	// set default parameter http
	var http_params = {};

	// set HTTP Header 
	var http_header = {
		headers: {
		},
		params: http_params
	};
	// animation loading 
	$ionicLoading.show();
	
	// Retrieving data
	var itemID = $stateParams.snippetresourceIdvideoId;
	// TODO: minutos_singlesCtrl --|-- $scope.fetchURL
	$scope.fetchURL = "https://www.googleapis.com/youtube/v3/playlistItems?maxResults=50&part=id,snippet&playlistId=PLgyqWKH4bwdR8k9m59x1G-ahCHPCjKVXU&key=AIzaSyAXlht6H5iRdt7bgxvx4m-W0QkEkk-depk";
	// TODO: minutos_singlesCtrl --|-- $scope.fetchURLp
	$scope.fetchURLp = "https://www.googleapis.com/youtube/v3/playlistItems?maxResults=50&part=id,snippet&playlistId=PLgyqWKH4bwdR8k9m59x1G-ahCHPCjKVXU&key=AIzaSyAXlht6H5iRdt7bgxvx4m-W0QkEkk-depk&callback=JSON_CALLBACK";
	// TODO: minutos_singlesCtrl --|-- $scope.hashURL
	$scope.hashURL = md5.createHash($scope.fetchURL);
	
	var current_item = [];
	localforage.getItem("data_minutoss_" + $scope.hashURL, function(err, get_datas){
		if(get_datas === null){
			current_item = [];
		}else{
			if(get_datas !== null){
				var datas = JSON.parse(get_datas);
				for (var i = 0; i < datas.length; i++) {
					if((datas[i].snippet.resourceId.videoId ===  parseInt(itemID)) || (datas[i].snippet.resourceId.videoId === itemID.toString())) {
						current_item = datas[i] ;
					}
				}
			}
			// event done, hidden animation loading
			$timeout(function(){
				$ionicLoading.hide();
				$scope.minutos = current_item ;
				controller_by_user();
			}, 100);
		};
	}).then(function(value){
	}).catch(function (err){
	})
	if( current_item.length === 0 ){
		var itemID = $stateParams.snippetresourceIdvideoId;
		var current_item = [];
	
		// set HTTP Header 
		http_header = {
			headers: {
			},
			params: http_params
		};
		// TODO: minutos_singlesCtrl --|-- $http.get
		$http.get($scope.fetchURL,http_header).then(function(response) {
			// Get data single
			var datas = response.data;
			// TODO: minutos_singlesCtrl --|---------- set:localforage
			localforage.setItem("data_minutoss_"+ $scope.hashURL,JSON.stringify(datas));
			for (var i = 0; i < datas.length; i++) {
				if((datas[i].snippet.resourceId.videoId ===  parseInt(itemID)) || (datas[i].snippet.resourceId.videoId === itemID.toString())) {
					current_item = datas[i] ;
				}
			}
		},function(data) {
					// Error message
					var alertPopup = $ionicPopup.alert({
						title: "Network Error" + " (" + data.status + ")",
						template: "An error occurred while collecting data.",
					});
					$timeout(function() {
						alertPopup.close();
					}, 2000);
		}).finally(function() {
			$scope.$broadcast("scroll.refreshComplete");
			// event done, hidden animation loading
			$timeout(function() {
				$ionicLoading.hide();
				$scope.minutos = current_item ;
				controller_by_user();
			}, 500);
		});
	}
	
	
		// TODO: minutos_singlesCtrl --|-- $scope.doRefresh
	$scope.doRefresh = function(){
		// Retrieving data
		var itemID = $stateParams.snippetresourceIdvideoId;
		var current_item = [];
		// overwrite http_header 
		http_header = {
			headers: {
			},
			params: http_params
		};
		// TODO: minutos_singlesCtrl --|------ $http.get
		$http.get($scope.fetchURL,http_header).then(function(response) {
			// Get data single
			var datas = response.data.items;
			// TODO: minutos_singlesCtrl --|---------- set:localforage
			localforage.setItem("data_minutoss_"+ $scope.hashURL,JSON.stringify(datas));
			for (var i = 0; i < datas.length; i++) {
				if((datas[i].snippet.resourceId.videoId ===  parseInt(itemID)) || (datas[i].snippet.resourceId.videoId === itemID.toString())) {
					current_item = datas[i] ;
				}
			}
		},function(data) {
			// Error message
		// TODO: minutos_singlesCtrl --|---------- $http.jsonp
				$http.jsonp($scope.fetchURLp,http_header).success(function(response){
					// Get data single
					var datas = response.items;
			// TODO: minutos_singlesCtrl --|---------- set:localforage
			localforage.setItem("data_minutoss_"+ $scope.hashURL,JSON.stringify(datas));
					for (var i = 0; i < datas.length; i++) {
						if((datas[i].snippetresourceIdvideoId ===  parseInt(itemID)) || (datas[i].snippetresourceIdvideoId === itemID.toString())) {
							current_item = datas[i] ;
						}
					}
						$scope.$broadcast("scroll.refreshComplete");
						// event done, hidden animation loading
						$timeout(function() {
							$ionicLoading.hide();
							$scope.minutos = current_item ;
							controller_by_user();
						}, 500);
					}).error(function(resp){
						var alertPopup = $ionicPopup.alert({
							title: "Network Error" + " (" + data.status + ")",
							template: "An error occurred while collecting data.",
						});
					});
		}).finally(function() {
			$scope.$broadcast("scroll.refreshComplete");
			// event done, hidden animation loading
			$timeout(function() {
				$ionicLoading.hide();
				$scope.minutos = current_item ;
				controller_by_user();
			}, 500);
		});
	};
	// code 

	// TODO: minutos_singlesCtrl --|-- controller_by_user
	// controller by user 
	function controller_by_user(){
		try {
			

    
$ionicConfig.backButton.text("");
$scope.pauseVideo = function() {
    var iframe = document.getElementsByTagName("iframe")[0].contentWindow;
    iframe.postMessage('{"event":"command","func":"' + 'pauseVideo' +   '","args":""}', '*');
}


$scope.playVideo = function() {
    var iframe = document.getElementsByTagName("iframe")[0].contentWindow;
   iframe.postMessage('{"event":"command","func":"' + 'playVideo' +   '","args":""}', '*');
}

$scope.$on("$ionicView.beforeLeave", function(){
	$scope.pauseVideo();
});

$scope.$on("$ionicView.enter", function(){
	$scope.playVideo();
});
			
		} catch(e){
			console.log("%cerror: %cPage: `minutos_singles` and field: `Custom Controller`","color:blue;font-size:18px","color:red;font-size:18px");
			console.dir(e);
		}
	}
	$scope.rating = {};
	$scope.rating.max = 5;
	
	// animation ink (ionic-material)
	ionicMaterialInk.displayEffect();
	controller_by_user();
})

// TODO: principalCtrl --|-- 
.controller("principalCtrl", function($ionicConfig,$scope,$rootScope,$state,$location,$ionicScrollDelegate,$ionicListDelegate,$http,$httpParamSerializer,$stateParams,$timeout,$interval,$ionicLoading,$ionicPopup,$ionicPopover,$ionicActionSheet,$ionicSlideBoxDelegate,$ionicHistory,ionicMaterialInk,ionicMaterialMotion,$window,$ionicModal,base64,md5,$document,$sce,$ionicGesture,$translate,tmhDynamicLocale){
	
	$rootScope.headerExists = true;
	$rootScope.ionWidth = $document[0].body.querySelector(".view-container").offsetWidth || 412;
	$rootScope.grid64 = parseInt($rootScope.ionWidth / 64) ;
	$rootScope.grid80 = parseInt($rootScope.ionWidth / 80) ;
	$rootScope.grid128 = parseInt($rootScope.ionWidth / 128) ;
	$rootScope.grid256 = parseInt($rootScope.ionWidth / 256) ;
	$rootScope.last_edit = "page_builder" ;
	$scope.$on("$ionicView.afterEnter", function (){
		var page_id = $state.current.name ;
		$rootScope.page_id = page_id.replace(".","-") ;
	});
	if($rootScope.headerShrink == true){
		$scope.$on("$ionicView.enter", function(){
			$scope.scrollTop();
		});
	};
	// TODO: principalCtrl --|-- $scope.scrollTop
	$rootScope.scrollTop = function(){
		$timeout(function(){
			$ionicScrollDelegate.$getByHandle("top").scrollTop();
		},100);
	};
	// TODO: principalCtrl --|-- $scope.toggleGroup
	$scope.toggleGroup = function(group) {
		if ($scope.isGroupShown(group)) {
			$scope.shownGroup = null;
		} else {
			$scope.shownGroup = group;
		}
	};
	
	$scope.isGroupShown = function(group) {
		return $scope.shownGroup === group;
	};
	
	// TODO: principalCtrl --|-- $scope.redirect
	// redirect
	$scope.redirect = function($url){
		$window.location.href = $url;
	};
	
	// Set Motion
	$timeout(function(){
		ionicMaterialMotion.slideUp({
			selector: ".slide-up"
		});
	}, 300);
	// code 

	// TODO: principalCtrl --|-- controller_by_user
	// controller by user 
	function controller_by_user(){
		try {
			
			
		} catch(e){
			console.log("%cerror: %cPage: `principal` and field: `Custom Controller`","color:blue;font-size:18px","color:red;font-size:18px");
			console.dir(e);
		}
	}
	$scope.rating = {};
	$scope.rating.max = 5;
	
	// animation ink (ionic-material)
	ionicMaterialInk.displayEffect();
	controller_by_user();
})

// TODO: prosperidadeCtrl --|-- 
.controller("prosperidadeCtrl", function($ionicConfig,$scope,$rootScope,$state,$location,$ionicScrollDelegate,$ionicListDelegate,$http,$httpParamSerializer,$stateParams,$timeout,$interval,$ionicLoading,$ionicPopup,$ionicPopover,$ionicActionSheet,$ionicSlideBoxDelegate,$ionicHistory,ionicMaterialInk,ionicMaterialMotion,$window,$ionicModal,base64,md5,$document,$sce,$ionicGesture,$translate,tmhDynamicLocale){
	
	$rootScope.headerExists = true;
	$rootScope.ionWidth = $document[0].body.querySelector(".view-container").offsetWidth || 412;
	$rootScope.grid64 = parseInt($rootScope.ionWidth / 64) ;
	$rootScope.grid80 = parseInt($rootScope.ionWidth / 80) ;
	$rootScope.grid128 = parseInt($rootScope.ionWidth / 128) ;
	$rootScope.grid256 = parseInt($rootScope.ionWidth / 256) ;
	$rootScope.last_edit = "-" ;
	$scope.$on("$ionicView.afterEnter", function (){
		var page_id = $state.current.name ;
		$rootScope.page_id = page_id.replace(".","-") ;
	});
	if($rootScope.headerShrink == true){
		$scope.$on("$ionicView.enter", function(){
			$scope.scrollTop();
		});
	};
	// TODO: prosperidadeCtrl --|-- $scope.scrollTop
	$rootScope.scrollTop = function(){
		$timeout(function(){
			$ionicScrollDelegate.$getByHandle("top").scrollTop();
		},100);
	};
	// TODO: prosperidadeCtrl --|-- $scope.toggleGroup
	$scope.toggleGroup = function(group) {
		if ($scope.isGroupShown(group)) {
			$scope.shownGroup = null;
		} else {
			$scope.shownGroup = group;
		}
	};
	
	$scope.isGroupShown = function(group) {
		return $scope.shownGroup === group;
	};
	
	// TODO: prosperidadeCtrl --|-- $scope.redirect
	// redirect
	$scope.redirect = function($url){
		$window.location.href = $url;
	};
	
	// Set Motion
	$timeout(function(){
		ionicMaterialMotion.slideUp({
			selector: ".slide-up"
		});
	}, 300);
	// TODO: prosperidadeCtrl --|-- $scope.showAuthentication
	$scope.showAuthentication  = function(){
		var authPopup = $ionicPopup.show({
			template: ' This page required login',
			title: "Authorization",
			subTitle: "Authorization is required",
			scope: $scope,
			buttons: [
				{text:"Cancel",onTap: function(e){
					$state.go("atomo_quantico.principal");
				}},
			],
		}).then(function(form){
		},function(err){
		},function(msg){
		});
	};
	
	// set default parameter http
	var http_params = {};
	
	// set HTTP Header 
	var http_header = {
		headers: {
		},
		params: http_params
	};
	var targetQuery = ""; //default param
	var raplaceWithQuery = "";
	//fix url Prosperidade
	targetQuery = "maxResults=50"; //default param
	raplaceWithQuery = "maxResults=50";
	
	
	// TODO: prosperidadeCtrl --|-- $scope.splitArray
	$scope.splitArray = function(items,cols,maxItem) {
		var newItems = [];
		if(maxItem == 0){
			maxItem = items.length;
		}
		if(items){
			for (var i=0; i < maxItem; i+=cols) {
				newItems.push(items.slice(i, i+cols));
			}
		}
		return newItems;
	}
	$scope.gmapOptions = {options: { scrollwheel: false }};
	
	var fetch_per_scroll = 1;
	// animation loading 
	$ionicLoading.show();
	
	
	// TODO: prosperidadeCtrl --|-- $scope.fetchURL
	$scope.fetchURL = "https://www.googleapis.com/youtube/v3/playlistItems?maxResults=50&part=id,snippet&playlistId=PLgyqWKH4bwdQ4U24s77CcabDjXcY4wXbo&key=AIzaSyAXlht6H5iRdt7bgxvx4m-W0QkEkk-depk";
	// TODO: prosperidadeCtrl --|-- $scope.fetchURLp
	$scope.fetchURLp = "https://www.googleapis.com/youtube/v3/playlistItems?maxResults=50&part=id,snippet&playlistId=PLgyqWKH4bwdQ4U24s77CcabDjXcY4wXbo&key=AIzaSyAXlht6H5iRdt7bgxvx4m-W0QkEkk-depk&callback=JSON_CALLBACK";
	// TODO: prosperidadeCtrl --|-- $scope.hashURL
	$scope.hashURL = md5.createHash( $scope.fetchURL.replace(targetQuery,raplaceWithQuery));
	
	
	$scope.noMoreItemsAvailable = false; //readmore status
	var lastPush = 0;
	var data_prosperidades = [];
	
	localforage.getItem("data_prosperidades_" + $scope.hashURL, function(err, get_prosperidades){
		if(get_prosperidades === null){
			data_prosperidades =[];
		}else{
			data_prosperidades = JSON.parse(get_prosperidades);
			$scope.data_prosperidades =JSON.parse( get_prosperidades);
			$scope.prosperidades = [];
			for(lastPush = 0; lastPush < 100; lastPush++) {
				if (angular.isObject(data_prosperidades[lastPush])){
					$scope.prosperidades.push(data_prosperidades[lastPush]);
				};
			}
			$timeout(function() {
				$ionicLoading.hide();
				controller_by_user();
			},200);
		}
	}).then(function(value){
	}).catch(function (err){
	})
	if(data_prosperidades === null ){
		data_prosperidades =[];
	}
	if(data_prosperidades.length === 0 ){
		$timeout(function() {
			var url_request = $scope.fetchURL.replace(targetQuery,raplaceWithQuery);
			// overwrite HTTP Header 
			http_header = {
				headers: {
				},
				params: http_params
			};
			// TODO: prosperidadeCtrl --|-- $http.get
			$http.get(url_request,http_header).then(function(response) {
				data_prosperidades = response.data.items;
				$scope.data_prosperidades = response.data.items;
				// TODO: prosperidadeCtrl --|---------- set:localforage
				localforage.setItem("data_prosperidades_" + $scope.hashURL, JSON.stringify(data_prosperidades));
				$scope.prosperidades = [];
				for(lastPush = 0; lastPush < 100; lastPush++) {
					if (angular.isObject(data_prosperidades[lastPush])){
						$scope.prosperidades.push(data_prosperidades[lastPush]);
					};
				}
			},function(response) {
			
				$timeout(function() {
					var url_request = $scope.fetchURLp.replace(targetQuery,raplaceWithQuery);
					// overwrite HTTP Header 
					http_header = {
						headers: {
						},
						params: http_params
					};
					// TODO: prosperidadeCtrl --|------ $http.jsonp
					$http.jsonp(url_request,http_header).success(function(data){
						data_prosperidades = data.items;
						$scope.data_prosperidades = data.items;
						$ionicLoading.hide();
						// TODO: prosperidadeCtrl --|---------- set:localforage
						localforage.setItem("data_prosperidades_" + $scope.hashURL,JSON.stringify(data_prosperidades));
						controller_by_user();
						$scope.prosperidades = [];
						for(lastPush = 0; lastPush < 100; lastPush++) {
							if (angular.isObject(data_prosperidades[lastPush])){
								$scope.prosperidades.push(data_prosperidades[lastPush]);
							};
						}
					}).error(function(data){
					if(response.status ===401){
						// TODO: prosperidadeCtrl --|------------ error:Unauthorized
						$scope.showAuthentication();
					}else{
						// TODO: prosperidadeCtrl --|------------ error:Message
						var data = { statusText:response.statusText, status:response.status };
						var alertPopup = $ionicPopup.alert({
							title: "Network Error" + " (" + data.status + ")",
							template: "An error occurred while collecting data.",
						});
						$timeout(function() {
							alertPopup.close();
						}, 2000);
					}
					});
				}, 200);
		}).finally(function() {
			$scope.$broadcast("scroll.refreshComplete");
			// event done, hidden animation loading
			$timeout(function() {
				$ionicLoading.hide();
				controller_by_user();
				if(angular.isDefined($scope.data_prosperidades.data)){
					if($scope.data_prosperidades.data.status ===401){
						$scope.showAuthentication();
						return false;
					}
				}
			}, 200);
		});
	
		}, 200);
	}
	
	
	// TODO: prosperidadeCtrl --|-- $scope.doRefresh
	$scope.doRefresh = function(){
		var url_request = $scope.fetchURL.replace(targetQuery,raplaceWithQuery);
		// retry retrieving data
		// overwrite http_header 
		http_header = {
			headers: {
			},
			params: http_params
		};
		// TODO: prosperidadeCtrl --|------ $http.get
		$http.get(url_request,http_header).then(function(response) {
			data_prosperidades = response.data.items;
			$scope.data_prosperidades = response.data.items;
			// TODO: prosperidadeCtrl --|---------- set:localforage
			localforage.setItem("data_prosperidades_" + $scope.hashURL,JSON.stringify(data_prosperidades));
			$scope.prosperidades = [];
			for(lastPush = 0; lastPush < 100; lastPush++) {
				if (angular.isObject(data_prosperidades[lastPush])){
					$scope.prosperidades.push(data_prosperidades[lastPush]);
				};
			}
		},function(response){
			
		// retrieving data with jsonp
			$timeout(function() {
			var url_request =$scope.fetchURLp.replace(targetQuery,raplaceWithQuery);
				// overwrite http_header 
				http_header = {
					headers: {
					},
					params: http_params
				};
				// TODO: prosperidadeCtrl --|---------- $http.jsonp
				$http.jsonp(url_request,http_header).success(function(data){
					data_prosperidades = data.items;
					$scope.data_prosperidades = data.items;
					$ionicLoading.hide();
					controller_by_user();
					// TODO: prosperidadeCtrl --|---------- set:localforage
					localforage.setItem("data_prosperidades_"+ $scope.hashURL,JSON.stringify(data_prosperidades));
					$scope.prosperidades = [];
					for(lastPush = 0; lastPush < 100; lastPush++) {
						if (angular.isObject(data_prosperidades[lastPush])){
							$scope.prosperidades.push(data_prosperidades[lastPush]);
						};
					}
				}).error(function(resp){
					if(response.status ===401){
						// TODO: prosperidadeCtrl --|------------ error:Unauthorized
						$scope.showAuthentication();
					}else{
						// TODO: prosperidadeCtrl --|------------ error:Message
						var data = { statusText:response.statusText, status:response.status };
						var alertPopup = $ionicPopup.alert({
							title: "Network Error" + " (" + data.status + ")",
							template: "An error occurred while collecting data.",
						});
					};
				});
			}, 200);
		}).finally(function() {
			$scope.$broadcast("scroll.refreshComplete");
			// event done, hidden animation loading
			$timeout(function() {
				$ionicLoading.hide();
				controller_by_user();
			}, 500);
		});
	
	};
	if (data_prosperidades === null){
		data_prosperidades = [];
	};
	// animation readmore
	var fetchItems = function() {
		for(var z=0;z<fetch_per_scroll;z++){
			if (angular.isObject(data_prosperidades[lastPush])){
				$scope.prosperidades.push(data_prosperidades[lastPush]);
				lastPush++;
			}else{;
				$scope.noMoreItemsAvailable = true;
			}
		}
		$scope.$broadcast("scroll.infiniteScrollComplete");
	};
	
	// event readmore
	$scope.onInfinite = function() {
		$timeout(fetchItems, 500);
	};
	
	// create animation fade slide in right (ionic-material)
	$scope.fireEvent = function(){
		ionicMaterialInk.displayEffect();
	};
	// code 

	// TODO: prosperidadeCtrl --|-- controller_by_user
	// controller by user 
	function controller_by_user(){
		try {
			
$ionicConfig.backButton.text("");			
		} catch(e){
			console.log("%cerror: %cPage: `prosperidade` and field: `Custom Controller`","color:blue;font-size:18px","color:red;font-size:18px");
			console.dir(e);
		}
	}
	$scope.rating = {};
	$scope.rating.max = 5;
	
	// animation ink (ionic-material)
	ionicMaterialInk.displayEffect();
	controller_by_user();
})

// TODO: prosperidade_singlesCtrl --|-- 
.controller("prosperidade_singlesCtrl", function($ionicConfig,$scope,$rootScope,$state,$location,$ionicScrollDelegate,$ionicListDelegate,$http,$httpParamSerializer,$stateParams,$timeout,$interval,$ionicLoading,$ionicPopup,$ionicPopover,$ionicActionSheet,$ionicSlideBoxDelegate,$ionicHistory,ionicMaterialInk,ionicMaterialMotion,$window,$ionicModal,base64,md5,$document,$sce,$ionicGesture,$translate,tmhDynamicLocale){
	
	$rootScope.headerExists = true;
	$rootScope.ionWidth = $document[0].body.querySelector(".view-container").offsetWidth || 412;
	$rootScope.grid64 = parseInt($rootScope.ionWidth / 64) ;
	$rootScope.grid80 = parseInt($rootScope.ionWidth / 80) ;
	$rootScope.grid128 = parseInt($rootScope.ionWidth / 128) ;
	$rootScope.grid256 = parseInt($rootScope.ionWidth / 256) ;
	$rootScope.last_edit = "page-builder" ;
	$scope.$on("$ionicView.afterEnter", function (){
		var page_id = $state.current.name ;
		$rootScope.page_id = page_id.replace(".","-") ;
	});
	if($rootScope.headerShrink == true){
		$scope.$on("$ionicView.enter", function(){
			$scope.scrollTop();
		});
	};
	// TODO: prosperidade_singlesCtrl --|-- $scope.scrollTop
	$rootScope.scrollTop = function(){
		$timeout(function(){
			$ionicScrollDelegate.$getByHandle("top").scrollTop();
		},100);
	};
	// TODO: prosperidade_singlesCtrl --|-- $scope.toggleGroup
	$scope.toggleGroup = function(group) {
		if ($scope.isGroupShown(group)) {
			$scope.shownGroup = null;
		} else {
			$scope.shownGroup = group;
		}
	};
	
	$scope.isGroupShown = function(group) {
		return $scope.shownGroup === group;
	};
	
	// TODO: prosperidade_singlesCtrl --|-- $scope.redirect
	// redirect
	$scope.redirect = function($url){
		$window.location.href = $url;
	};
	
	// Set Motion
	$timeout(function(){
		ionicMaterialMotion.slideUp({
			selector: ".slide-up"
		});
	}, 300);
	// TODO: prosperidade_singlesCtrl --|-- $scope.showAuthentication
	$scope.showAuthentication  = function(){
		var authPopup = $ionicPopup.show({
			template: ' This page required login',
			title: "Authorization",
			subTitle: "Authorization is required",
			scope: $scope,
			buttons: [
				{text:"Cancel",onTap: function(e){
					$state.go("atomo_quantico.principal");
				}},
			],
		}).then(function(form){
		},function(err){
		},function(msg){
		});
	};
	
	// set default parameter http
	var http_params = {};

	// set HTTP Header 
	var http_header = {
		headers: {
		},
		params: http_params
	};
	// animation loading 
	$ionicLoading.show();
	
	// Retrieving data
	var itemID = $stateParams.snippetresourceIdvideoId;
	// TODO: prosperidade_singlesCtrl --|-- $scope.fetchURL
	$scope.fetchURL = "https://www.googleapis.com/youtube/v3/playlistItems?maxResults=50&part=id,snippet&playlistId=PLgyqWKH4bwdQ4U24s77CcabDjXcY4wXbo&key=AIzaSyAXlht6H5iRdt7bgxvx4m-W0QkEkk-depk";
	// TODO: prosperidade_singlesCtrl --|-- $scope.fetchURLp
	$scope.fetchURLp = "https://www.googleapis.com/youtube/v3/playlistItems?maxResults=50&part=id,snippet&playlistId=PLgyqWKH4bwdQ4U24s77CcabDjXcY4wXbo&key=AIzaSyAXlht6H5iRdt7bgxvx4m-W0QkEkk-depk&callback=JSON_CALLBACK";
	// TODO: prosperidade_singlesCtrl --|-- $scope.hashURL
	$scope.hashURL = md5.createHash($scope.fetchURL);
	
	var current_item = [];
	localforage.getItem("data_prosperidades_" + $scope.hashURL, function(err, get_datas){
		if(get_datas === null){
			current_item = [];
		}else{
			if(get_datas !== null){
				var datas = JSON.parse(get_datas);
				for (var i = 0; i < datas.length; i++) {
					if((datas[i].snippet.resourceId.videoId ===  parseInt(itemID)) || (datas[i].snippet.resourceId.videoId === itemID.toString())) {
						current_item = datas[i] ;
					}
				}
			}
			// event done, hidden animation loading
			$timeout(function(){
				$ionicLoading.hide();
				$scope.prosperidade = current_item ;
				controller_by_user();
			}, 100);
		};
	}).then(function(value){
	}).catch(function (err){
	})
	if( current_item.length === 0 ){
		var itemID = $stateParams.snippetresourceIdvideoId;
		var current_item = [];
	
		// set HTTP Header 
		http_header = {
			headers: {
			},
			params: http_params
		};
		// TODO: prosperidade_singlesCtrl --|-- $http.get
		$http.get($scope.fetchURL,http_header).then(function(response) {
			// Get data single
			var datas = response.data;
			// TODO: prosperidade_singlesCtrl --|---------- set:localforage
			localforage.setItem("data_prosperidades_"+ $scope.hashURL,JSON.stringify(datas));
			for (var i = 0; i < datas.length; i++) {
				if((datas[i].snippet.resourceId.videoId ===  parseInt(itemID)) || (datas[i].snippet.resourceId.videoId === itemID.toString())) {
					current_item = datas[i] ;
				}
			}
		},function(data) {
					// Error message
					var alertPopup = $ionicPopup.alert({
						title: "Network Error" + " (" + data.status + ")",
						template: "An error occurred while collecting data.",
					});
					$timeout(function() {
						alertPopup.close();
					}, 2000);
		}).finally(function() {
			$scope.$broadcast("scroll.refreshComplete");
			// event done, hidden animation loading
			$timeout(function() {
				$ionicLoading.hide();
				$scope.prosperidade = current_item ;
				controller_by_user();
			}, 500);
		});
	}
	
	
		// TODO: prosperidade_singlesCtrl --|-- $scope.doRefresh
	$scope.doRefresh = function(){
		// Retrieving data
		var itemID = $stateParams.snippetresourceIdvideoId;
		var current_item = [];
		// overwrite http_header 
		http_header = {
			headers: {
			},
			params: http_params
		};
		// TODO: prosperidade_singlesCtrl --|------ $http.get
		$http.get($scope.fetchURL,http_header).then(function(response) {
			// Get data single
			var datas = response.data.items;
			// TODO: prosperidade_singlesCtrl --|---------- set:localforage
			localforage.setItem("data_prosperidades_"+ $scope.hashURL,JSON.stringify(datas));
			for (var i = 0; i < datas.length; i++) {
				if((datas[i].snippet.resourceId.videoId ===  parseInt(itemID)) || (datas[i].snippet.resourceId.videoId === itemID.toString())) {
					current_item = datas[i] ;
				}
			}
		},function(data) {
			// Error message
		// TODO: prosperidade_singlesCtrl --|---------- $http.jsonp
				$http.jsonp($scope.fetchURLp,http_header).success(function(response){
					// Get data single
					var datas = response.items;
			// TODO: prosperidade_singlesCtrl --|---------- set:localforage
			localforage.setItem("data_prosperidades_"+ $scope.hashURL,JSON.stringify(datas));
					for (var i = 0; i < datas.length; i++) {
						if((datas[i].snippetresourceIdvideoId ===  parseInt(itemID)) || (datas[i].snippetresourceIdvideoId === itemID.toString())) {
							current_item = datas[i] ;
						}
					}
						$scope.$broadcast("scroll.refreshComplete");
						// event done, hidden animation loading
						$timeout(function() {
							$ionicLoading.hide();
							$scope.prosperidade = current_item ;
							controller_by_user();
						}, 500);
					}).error(function(resp){
						var alertPopup = $ionicPopup.alert({
							title: "Network Error" + " (" + data.status + ")",
							template: "An error occurred while collecting data.",
						});
					});
		}).finally(function() {
			$scope.$broadcast("scroll.refreshComplete");
			// event done, hidden animation loading
			$timeout(function() {
				$ionicLoading.hide();
				$scope.prosperidade = current_item ;
				controller_by_user();
			}, 500);
		});
	};
	// code 

	// TODO: prosperidade_singlesCtrl --|-- controller_by_user
	// controller by user 
	function controller_by_user(){
		try {
			

    
$ionicConfig.backButton.text("");
$scope.pauseVideo = function() {
    var iframe = document.getElementsByTagName("iframe")[0].contentWindow;
    iframe.postMessage('{"event":"command","func":"' + 'pauseVideo' +   '","args":""}', '*');
}


$scope.playVideo = function() {
    var iframe = document.getElementsByTagName("iframe")[0].contentWindow;
   iframe.postMessage('{"event":"command","func":"' + 'playVideo' +   '","args":""}', '*');
}

$scope.$on("$ionicView.beforeLeave", function(){
	$scope.pauseVideo();
});

$scope.$on("$ionicView.enter", function(){
	$scope.playVideo();
});
			
		} catch(e){
			console.log("%cerror: %cPage: `prosperidade_singles` and field: `Custom Controller`","color:blue;font-size:18px","color:red;font-size:18px");
			console.dir(e);
		}
	}
	$scope.rating = {};
	$scope.rating.max = 5;
	
	// animation ink (ionic-material)
	ionicMaterialInk.displayEffect();
	controller_by_user();
})

// TODO: slide_tab_menuCtrl --|-- 
.controller("slide_tab_menuCtrl", function($ionicConfig,$scope,$rootScope,$state,$location,$ionicScrollDelegate,$ionicListDelegate,$http,$httpParamSerializer,$stateParams,$timeout,$interval,$ionicLoading,$ionicPopup,$ionicPopover,$ionicActionSheet,$ionicSlideBoxDelegate,$ionicHistory,ionicMaterialInk,ionicMaterialMotion,$window,$ionicModal,base64,md5,$document,$sce,$ionicGesture,$translate,tmhDynamicLocale){
	
	$rootScope.headerExists = true;
	$rootScope.ionWidth = $document[0].body.querySelector(".view-container").offsetWidth || 412;
	$rootScope.grid64 = parseInt($rootScope.ionWidth / 64) ;
	$rootScope.grid80 = parseInt($rootScope.ionWidth / 80) ;
	$rootScope.grid128 = parseInt($rootScope.ionWidth / 128) ;
	$rootScope.grid256 = parseInt($rootScope.ionWidth / 256) ;
	$rootScope.last_edit = "menu" ;
	$scope.$on("$ionicView.afterEnter", function (){
		var page_id = $state.current.name ;
		$rootScope.page_id = page_id.replace(".","-") ;
	});
	if($rootScope.headerShrink == true){
		$scope.$on("$ionicView.enter", function(){
			$scope.scrollTop();
		});
	};
	// TODO: slide_tab_menuCtrl --|-- $scope.scrollTop
	$rootScope.scrollTop = function(){
		$timeout(function(){
			$ionicScrollDelegate.$getByHandle("top").scrollTop();
		},100);
	};
	// TODO: slide_tab_menuCtrl --|-- $scope.toggleGroup
	$scope.toggleGroup = function(group) {
		if ($scope.isGroupShown(group)) {
			$scope.shownGroup = null;
		} else {
			$scope.shownGroup = group;
		}
	};
	
	$scope.isGroupShown = function(group) {
		return $scope.shownGroup === group;
	};
	
	// TODO: slide_tab_menuCtrl --|-- $scope.redirect
	// redirect
	$scope.redirect = function($url){
		$window.location.href = $url;
	};
	
	// Set Motion
	$timeout(function(){
		ionicMaterialMotion.slideUp({
			selector: ".slide-up"
		});
	}, 300);
	// code 

	// TODO: slide_tab_menuCtrl --|-- controller_by_user
	// controller by user 
	function controller_by_user(){
		try {
			
$ionicConfig.backButton.text("");			
		} catch(e){
			console.log("%cerror: %cPage: `slide_tab_menu` and field: `Custom Controller`","color:blue;font-size:18px","color:red;font-size:18px");
			console.dir(e);
		}
	}
	$scope.rating = {};
	$scope.rating.max = 5;
	
	// animation ink (ionic-material)
	ionicMaterialInk.displayEffect();
	controller_by_user();
})

// TODO: sobreCtrl --|-- 
.controller("sobreCtrl", function($ionicConfig,$scope,$rootScope,$state,$location,$ionicScrollDelegate,$ionicListDelegate,$http,$httpParamSerializer,$stateParams,$timeout,$interval,$ionicLoading,$ionicPopup,$ionicPopover,$ionicActionSheet,$ionicSlideBoxDelegate,$ionicHistory,ionicMaterialInk,ionicMaterialMotion,$window,$ionicModal,base64,md5,$document,$sce,$ionicGesture,$translate,tmhDynamicLocale){
	
	$rootScope.headerExists = true;
	$rootScope.ionWidth = $document[0].body.querySelector(".view-container").offsetWidth || 412;
	$rootScope.grid64 = parseInt($rootScope.ionWidth / 64) ;
	$rootScope.grid80 = parseInt($rootScope.ionWidth / 80) ;
	$rootScope.grid128 = parseInt($rootScope.ionWidth / 128) ;
	$rootScope.grid256 = parseInt($rootScope.ionWidth / 256) ;
	$rootScope.last_edit = "page_builder" ;
	$scope.$on("$ionicView.afterEnter", function (){
		var page_id = $state.current.name ;
		$rootScope.page_id = page_id.replace(".","-") ;
	});
	if($rootScope.headerShrink == true){
		$scope.$on("$ionicView.enter", function(){
			$scope.scrollTop();
		});
	};
	// TODO: sobreCtrl --|-- $scope.scrollTop
	$rootScope.scrollTop = function(){
		$timeout(function(){
			$ionicScrollDelegate.$getByHandle("top").scrollTop();
		},100);
	};
	// TODO: sobreCtrl --|-- $scope.toggleGroup
	$scope.toggleGroup = function(group) {
		if ($scope.isGroupShown(group)) {
			$scope.shownGroup = null;
		} else {
			$scope.shownGroup = group;
		}
	};
	
	$scope.isGroupShown = function(group) {
		return $scope.shownGroup === group;
	};
	
	// TODO: sobreCtrl --|-- $scope.redirect
	// redirect
	$scope.redirect = function($url){
		$window.location.href = $url;
	};
	
	// Set Motion
	$timeout(function(){
		ionicMaterialMotion.slideUp({
			selector: ".slide-up"
		});
	}, 300);
	// code 

	// TODO: sobreCtrl --|-- controller_by_user
	// controller by user 
	function controller_by_user(){
		try {
			
			
		} catch(e){
			console.log("%cerror: %cPage: `sobre` and field: `Custom Controller`","color:blue;font-size:18px","color:red;font-size:18px");
			console.dir(e);
		}
	}
	$scope.rating = {};
	$scope.rating.max = 5;
	
	// animation ink (ionic-material)
	ionicMaterialInk.displayEffect();
	controller_by_user();
})

// TODO: vdeos_iiCtrl --|-- 
.controller("vdeos_iiCtrl", function($ionicConfig,$scope,$rootScope,$state,$location,$ionicScrollDelegate,$ionicListDelegate,$http,$httpParamSerializer,$stateParams,$timeout,$interval,$ionicLoading,$ionicPopup,$ionicPopover,$ionicActionSheet,$ionicSlideBoxDelegate,$ionicHistory,ionicMaterialInk,ionicMaterialMotion,$window,$ionicModal,base64,md5,$document,$sce,$ionicGesture,$translate,tmhDynamicLocale){
	
	$rootScope.headerExists = true;
	$rootScope.ionWidth = $document[0].body.querySelector(".view-container").offsetWidth || 412;
	$rootScope.grid64 = parseInt($rootScope.ionWidth / 64) ;
	$rootScope.grid80 = parseInt($rootScope.ionWidth / 80) ;
	$rootScope.grid128 = parseInt($rootScope.ionWidth / 128) ;
	$rootScope.grid256 = parseInt($rootScope.ionWidth / 256) ;
	$rootScope.last_edit = "-" ;
	$scope.$on("$ionicView.afterEnter", function (){
		var page_id = $state.current.name ;
		$rootScope.page_id = page_id.replace(".","-") ;
	});
	if($rootScope.headerShrink == true){
		$scope.$on("$ionicView.enter", function(){
			$scope.scrollTop();
		});
	};
	// TODO: vdeos_iiCtrl --|-- $scope.scrollTop
	$rootScope.scrollTop = function(){
		$timeout(function(){
			$ionicScrollDelegate.$getByHandle("top").scrollTop();
		},100);
	};
	// TODO: vdeos_iiCtrl --|-- $scope.toggleGroup
	$scope.toggleGroup = function(group) {
		if ($scope.isGroupShown(group)) {
			$scope.shownGroup = null;
		} else {
			$scope.shownGroup = group;
		}
	};
	
	$scope.isGroupShown = function(group) {
		return $scope.shownGroup === group;
	};
	
	// TODO: vdeos_iiCtrl --|-- $scope.redirect
	// redirect
	$scope.redirect = function($url){
		$window.location.href = $url;
	};
	
	// Set Motion
	$timeout(function(){
		ionicMaterialMotion.slideUp({
			selector: ".slide-up"
		});
	}, 300);
	// TODO: vdeos_iiCtrl --|-- $scope.showAuthentication
	$scope.showAuthentication  = function(){
		var authPopup = $ionicPopup.show({
			template: ' This page required login',
			title: "Authorization",
			subTitle: "Authorization is required",
			scope: $scope,
			buttons: [
				{text:"Cancel",onTap: function(e){
					$state.go("atomo_quantico.principal");
				}},
			],
		}).then(function(form){
		},function(err){
		},function(msg){
		});
	};
	
	// set default parameter http
	var http_params = {};
	
	// set HTTP Header 
	var http_header = {
		headers: {
		},
		params: http_params
	};
	var targetQuery = ""; //default param
	var raplaceWithQuery = "";
	//fix url Vídeos II
	targetQuery = "maxResults=50"; //default param
	raplaceWithQuery = "maxResults=50";
	
	
	// TODO: vdeos_iiCtrl --|-- $scope.splitArray
	$scope.splitArray = function(items,cols,maxItem) {
		var newItems = [];
		if(maxItem == 0){
			maxItem = items.length;
		}
		if(items){
			for (var i=0; i < maxItem; i+=cols) {
				newItems.push(items.slice(i, i+cols));
			}
		}
		return newItems;
	}
	$scope.gmapOptions = {options: { scrollwheel: false }};
	
	var fetch_per_scroll = 1;
	// animation loading 
	$ionicLoading.show();
	
	
	// TODO: vdeos_iiCtrl --|-- $scope.fetchURL
	$scope.fetchURL = "https://www.googleapis.com/youtube/v3/playlistItems?maxResults=50&part=id,snippet&playlistId=PLgyqWKH4bwdTEFHpC-ZTvXqCDOO9T-E21&key=AIzaSyAXlht6H5iRdt7bgxvx4m-W0QkEkk-depk";
	// TODO: vdeos_iiCtrl --|-- $scope.fetchURLp
	$scope.fetchURLp = "https://www.googleapis.com/youtube/v3/playlistItems?maxResults=50&part=id,snippet&playlistId=PLgyqWKH4bwdTEFHpC-ZTvXqCDOO9T-E21&key=AIzaSyAXlht6H5iRdt7bgxvx4m-W0QkEkk-depk&callback=JSON_CALLBACK";
	// TODO: vdeos_iiCtrl --|-- $scope.hashURL
	$scope.hashURL = md5.createHash( $scope.fetchURL.replace(targetQuery,raplaceWithQuery));
	
	
	$scope.noMoreItemsAvailable = false; //readmore status
	var lastPush = 0;
	var data_vdeos_iis = [];
	
	localforage.getItem("data_vdeos_iis_" + $scope.hashURL, function(err, get_vdeos_iis){
		if(get_vdeos_iis === null){
			data_vdeos_iis =[];
		}else{
			data_vdeos_iis = JSON.parse(get_vdeos_iis);
			$scope.data_vdeos_iis =JSON.parse( get_vdeos_iis);
			$scope.vdeos_iis = [];
			for(lastPush = 0; lastPush < 100; lastPush++) {
				if (angular.isObject(data_vdeos_iis[lastPush])){
					$scope.vdeos_iis.push(data_vdeos_iis[lastPush]);
				};
			}
			$timeout(function() {
				$ionicLoading.hide();
				controller_by_user();
			},200);
		}
	}).then(function(value){
	}).catch(function (err){
	})
	if(data_vdeos_iis === null ){
		data_vdeos_iis =[];
	}
	if(data_vdeos_iis.length === 0 ){
		$timeout(function() {
			var url_request = $scope.fetchURL.replace(targetQuery,raplaceWithQuery);
			// overwrite HTTP Header 
			http_header = {
				headers: {
				},
				params: http_params
			};
			// TODO: vdeos_iiCtrl --|-- $http.get
			$http.get(url_request,http_header).then(function(response) {
				data_vdeos_iis = response.data.items;
				$scope.data_vdeos_iis = response.data.items;
				// TODO: vdeos_iiCtrl --|---------- set:localforage
				localforage.setItem("data_vdeos_iis_" + $scope.hashURL, JSON.stringify(data_vdeos_iis));
				$scope.vdeos_iis = [];
				for(lastPush = 0; lastPush < 100; lastPush++) {
					if (angular.isObject(data_vdeos_iis[lastPush])){
						$scope.vdeos_iis.push(data_vdeos_iis[lastPush]);
					};
				}
			},function(response) {
			
				$timeout(function() {
					var url_request = $scope.fetchURLp.replace(targetQuery,raplaceWithQuery);
					// overwrite HTTP Header 
					http_header = {
						headers: {
						},
						params: http_params
					};
					// TODO: vdeos_iiCtrl --|------ $http.jsonp
					$http.jsonp(url_request,http_header).success(function(data){
						data_vdeos_iis = data.items;
						$scope.data_vdeos_iis = data.items;
						$ionicLoading.hide();
						// TODO: vdeos_iiCtrl --|---------- set:localforage
						localforage.setItem("data_vdeos_iis_" + $scope.hashURL,JSON.stringify(data_vdeos_iis));
						controller_by_user();
						$scope.vdeos_iis = [];
						for(lastPush = 0; lastPush < 100; lastPush++) {
							if (angular.isObject(data_vdeos_iis[lastPush])){
								$scope.vdeos_iis.push(data_vdeos_iis[lastPush]);
							};
						}
					}).error(function(data){
					if(response.status ===401){
						// TODO: vdeos_iiCtrl --|------------ error:Unauthorized
						$scope.showAuthentication();
					}else{
						// TODO: vdeos_iiCtrl --|------------ error:Message
						var data = { statusText:response.statusText, status:response.status };
						var alertPopup = $ionicPopup.alert({
							title: "Network Error" + " (" + data.status + ")",
							template: "An error occurred while collecting data.",
						});
						$timeout(function() {
							alertPopup.close();
						}, 2000);
					}
					});
				}, 200);
		}).finally(function() {
			$scope.$broadcast("scroll.refreshComplete");
			// event done, hidden animation loading
			$timeout(function() {
				$ionicLoading.hide();
				controller_by_user();
				if(angular.isDefined($scope.data_vdeos_iis.data)){
					if($scope.data_vdeos_iis.data.status ===401){
						$scope.showAuthentication();
						return false;
					}
				}
			}, 200);
		});
	
		}, 200);
	}
	
	
	// TODO: vdeos_iiCtrl --|-- $scope.doRefresh
	$scope.doRefresh = function(){
		var url_request = $scope.fetchURL.replace(targetQuery,raplaceWithQuery);
		// retry retrieving data
		// overwrite http_header 
		http_header = {
			headers: {
			},
			params: http_params
		};
		// TODO: vdeos_iiCtrl --|------ $http.get
		$http.get(url_request,http_header).then(function(response) {
			data_vdeos_iis = response.data.items;
			$scope.data_vdeos_iis = response.data.items;
			// TODO: vdeos_iiCtrl --|---------- set:localforage
			localforage.setItem("data_vdeos_iis_" + $scope.hashURL,JSON.stringify(data_vdeos_iis));
			$scope.vdeos_iis = [];
			for(lastPush = 0; lastPush < 100; lastPush++) {
				if (angular.isObject(data_vdeos_iis[lastPush])){
					$scope.vdeos_iis.push(data_vdeos_iis[lastPush]);
				};
			}
		},function(response){
			
		// retrieving data with jsonp
			$timeout(function() {
			var url_request =$scope.fetchURLp.replace(targetQuery,raplaceWithQuery);
				// overwrite http_header 
				http_header = {
					headers: {
					},
					params: http_params
				};
				// TODO: vdeos_iiCtrl --|---------- $http.jsonp
				$http.jsonp(url_request,http_header).success(function(data){
					data_vdeos_iis = data.items;
					$scope.data_vdeos_iis = data.items;
					$ionicLoading.hide();
					controller_by_user();
					// TODO: vdeos_iiCtrl --|---------- set:localforage
					localforage.setItem("data_vdeos_iis_"+ $scope.hashURL,JSON.stringify(data_vdeos_iis));
					$scope.vdeos_iis = [];
					for(lastPush = 0; lastPush < 100; lastPush++) {
						if (angular.isObject(data_vdeos_iis[lastPush])){
							$scope.vdeos_iis.push(data_vdeos_iis[lastPush]);
						};
					}
				}).error(function(resp){
					if(response.status ===401){
						// TODO: vdeos_iiCtrl --|------------ error:Unauthorized
						$scope.showAuthentication();
					}else{
						// TODO: vdeos_iiCtrl --|------------ error:Message
						var data = { statusText:response.statusText, status:response.status };
						var alertPopup = $ionicPopup.alert({
							title: "Network Error" + " (" + data.status + ")",
							template: "An error occurred while collecting data.",
						});
					};
				});
			}, 200);
		}).finally(function() {
			$scope.$broadcast("scroll.refreshComplete");
			// event done, hidden animation loading
			$timeout(function() {
				$ionicLoading.hide();
				controller_by_user();
			}, 500);
		});
	
	};
	if (data_vdeos_iis === null){
		data_vdeos_iis = [];
	};
	// animation readmore
	var fetchItems = function() {
		for(var z=0;z<fetch_per_scroll;z++){
			if (angular.isObject(data_vdeos_iis[lastPush])){
				$scope.vdeos_iis.push(data_vdeos_iis[lastPush]);
				lastPush++;
			}else{;
				$scope.noMoreItemsAvailable = true;
			}
		}
		$scope.$broadcast("scroll.infiniteScrollComplete");
	};
	
	// event readmore
	$scope.onInfinite = function() {
		$timeout(fetchItems, 500);
	};
	
	// create animation fade slide in right (ionic-material)
	$scope.fireEvent = function(){
		ionicMaterialInk.displayEffect();
	};
	// code 

	// TODO: vdeos_iiCtrl --|-- controller_by_user
	// controller by user 
	function controller_by_user(){
		try {
			
$ionicConfig.backButton.text("");			
		} catch(e){
			console.log("%cerror: %cPage: `vdeos_ii` and field: `Custom Controller`","color:blue;font-size:18px","color:red;font-size:18px");
			console.dir(e);
		}
	}
	$scope.rating = {};
	$scope.rating.max = 5;
	
	// animation ink (ionic-material)
	ionicMaterialInk.displayEffect();
	controller_by_user();
})

// TODO: vdeos_ii_singlesCtrl --|-- 
.controller("vdeos_ii_singlesCtrl", function($ionicConfig,$scope,$rootScope,$state,$location,$ionicScrollDelegate,$ionicListDelegate,$http,$httpParamSerializer,$stateParams,$timeout,$interval,$ionicLoading,$ionicPopup,$ionicPopover,$ionicActionSheet,$ionicSlideBoxDelegate,$ionicHistory,ionicMaterialInk,ionicMaterialMotion,$window,$ionicModal,base64,md5,$document,$sce,$ionicGesture,$translate,tmhDynamicLocale){
	
	$rootScope.headerExists = true;
	$rootScope.ionWidth = $document[0].body.querySelector(".view-container").offsetWidth || 412;
	$rootScope.grid64 = parseInt($rootScope.ionWidth / 64) ;
	$rootScope.grid80 = parseInt($rootScope.ionWidth / 80) ;
	$rootScope.grid128 = parseInt($rootScope.ionWidth / 128) ;
	$rootScope.grid256 = parseInt($rootScope.ionWidth / 256) ;
	$rootScope.last_edit = "page-builder" ;
	$scope.$on("$ionicView.afterEnter", function (){
		var page_id = $state.current.name ;
		$rootScope.page_id = page_id.replace(".","-") ;
	});
	if($rootScope.headerShrink == true){
		$scope.$on("$ionicView.enter", function(){
			$scope.scrollTop();
		});
	};
	// TODO: vdeos_ii_singlesCtrl --|-- $scope.scrollTop
	$rootScope.scrollTop = function(){
		$timeout(function(){
			$ionicScrollDelegate.$getByHandle("top").scrollTop();
		},100);
	};
	// TODO: vdeos_ii_singlesCtrl --|-- $scope.toggleGroup
	$scope.toggleGroup = function(group) {
		if ($scope.isGroupShown(group)) {
			$scope.shownGroup = null;
		} else {
			$scope.shownGroup = group;
		}
	};
	
	$scope.isGroupShown = function(group) {
		return $scope.shownGroup === group;
	};
	
	// TODO: vdeos_ii_singlesCtrl --|-- $scope.redirect
	// redirect
	$scope.redirect = function($url){
		$window.location.href = $url;
	};
	
	// Set Motion
	$timeout(function(){
		ionicMaterialMotion.slideUp({
			selector: ".slide-up"
		});
	}, 300);
	// TODO: vdeos_ii_singlesCtrl --|-- $scope.showAuthentication
	$scope.showAuthentication  = function(){
		var authPopup = $ionicPopup.show({
			template: ' This page required login',
			title: "Authorization",
			subTitle: "Authorization is required",
			scope: $scope,
			buttons: [
				{text:"Cancel",onTap: function(e){
					$state.go("atomo_quantico.principal");
				}},
			],
		}).then(function(form){
		},function(err){
		},function(msg){
		});
	};
	
	// set default parameter http
	var http_params = {};

	// set HTTP Header 
	var http_header = {
		headers: {
		},
		params: http_params
	};
	// animation loading 
	$ionicLoading.show();
	
	// Retrieving data
	var itemID = $stateParams.snippetresourceIdvideoId;
	// TODO: vdeos_ii_singlesCtrl --|-- $scope.fetchURL
	$scope.fetchURL = "https://www.googleapis.com/youtube/v3/playlistItems?maxResults=50&part=id,snippet&playlistId=PLgyqWKH4bwdTEFHpC-ZTvXqCDOO9T-E21&key=AIzaSyAXlht6H5iRdt7bgxvx4m-W0QkEkk-depk";
	// TODO: vdeos_ii_singlesCtrl --|-- $scope.fetchURLp
	$scope.fetchURLp = "https://www.googleapis.com/youtube/v3/playlistItems?maxResults=50&part=id,snippet&playlistId=PLgyqWKH4bwdTEFHpC-ZTvXqCDOO9T-E21&key=AIzaSyAXlht6H5iRdt7bgxvx4m-W0QkEkk-depk&callback=JSON_CALLBACK";
	// TODO: vdeos_ii_singlesCtrl --|-- $scope.hashURL
	$scope.hashURL = md5.createHash($scope.fetchURL);
	
	var current_item = [];
	localforage.getItem("data_vdeos_iis_" + $scope.hashURL, function(err, get_datas){
		if(get_datas === null){
			current_item = [];
		}else{
			if(get_datas !== null){
				var datas = JSON.parse(get_datas);
				for (var i = 0; i < datas.length; i++) {
					if((datas[i].snippet.resourceId.videoId ===  parseInt(itemID)) || (datas[i].snippet.resourceId.videoId === itemID.toString())) {
						current_item = datas[i] ;
					}
				}
			}
			// event done, hidden animation loading
			$timeout(function(){
				$ionicLoading.hide();
				$scope.vdeos_ii = current_item ;
				controller_by_user();
			}, 100);
		};
	}).then(function(value){
	}).catch(function (err){
	})
	if( current_item.length === 0 ){
		var itemID = $stateParams.snippetresourceIdvideoId;
		var current_item = [];
	
		// set HTTP Header 
		http_header = {
			headers: {
			},
			params: http_params
		};
		// TODO: vdeos_ii_singlesCtrl --|-- $http.get
		$http.get($scope.fetchURL,http_header).then(function(response) {
			// Get data single
			var datas = response.data;
			// TODO: vdeos_ii_singlesCtrl --|---------- set:localforage
			localforage.setItem("data_vdeos_iis_"+ $scope.hashURL,JSON.stringify(datas));
			for (var i = 0; i < datas.length; i++) {
				if((datas[i].snippet.resourceId.videoId ===  parseInt(itemID)) || (datas[i].snippet.resourceId.videoId === itemID.toString())) {
					current_item = datas[i] ;
				}
			}
		},function(data) {
					// Error message
					var alertPopup = $ionicPopup.alert({
						title: "Network Error" + " (" + data.status + ")",
						template: "An error occurred while collecting data.",
					});
					$timeout(function() {
						alertPopup.close();
					}, 2000);
		}).finally(function() {
			$scope.$broadcast("scroll.refreshComplete");
			// event done, hidden animation loading
			$timeout(function() {
				$ionicLoading.hide();
				$scope.vdeos_ii = current_item ;
				controller_by_user();
			}, 500);
		});
	}
	
	
		// TODO: vdeos_ii_singlesCtrl --|-- $scope.doRefresh
	$scope.doRefresh = function(){
		// Retrieving data
		var itemID = $stateParams.snippetresourceIdvideoId;
		var current_item = [];
		// overwrite http_header 
		http_header = {
			headers: {
			},
			params: http_params
		};
		// TODO: vdeos_ii_singlesCtrl --|------ $http.get
		$http.get($scope.fetchURL,http_header).then(function(response) {
			// Get data single
			var datas = response.data.items;
			// TODO: vdeos_ii_singlesCtrl --|---------- set:localforage
			localforage.setItem("data_vdeos_iis_"+ $scope.hashURL,JSON.stringify(datas));
			for (var i = 0; i < datas.length; i++) {
				if((datas[i].snippet.resourceId.videoId ===  parseInt(itemID)) || (datas[i].snippet.resourceId.videoId === itemID.toString())) {
					current_item = datas[i] ;
				}
			}
		},function(data) {
			// Error message
		// TODO: vdeos_ii_singlesCtrl --|---------- $http.jsonp
				$http.jsonp($scope.fetchURLp,http_header).success(function(response){
					// Get data single
					var datas = response.items;
			// TODO: vdeos_ii_singlesCtrl --|---------- set:localforage
			localforage.setItem("data_vdeos_iis_"+ $scope.hashURL,JSON.stringify(datas));
					for (var i = 0; i < datas.length; i++) {
						if((datas[i].snippetresourceIdvideoId ===  parseInt(itemID)) || (datas[i].snippetresourceIdvideoId === itemID.toString())) {
							current_item = datas[i] ;
						}
					}
						$scope.$broadcast("scroll.refreshComplete");
						// event done, hidden animation loading
						$timeout(function() {
							$ionicLoading.hide();
							$scope.vdeos_ii = current_item ;
							controller_by_user();
						}, 500);
					}).error(function(resp){
						var alertPopup = $ionicPopup.alert({
							title: "Network Error" + " (" + data.status + ")",
							template: "An error occurred while collecting data.",
						});
					});
		}).finally(function() {
			$scope.$broadcast("scroll.refreshComplete");
			// event done, hidden animation loading
			$timeout(function() {
				$ionicLoading.hide();
				$scope.vdeos_ii = current_item ;
				controller_by_user();
			}, 500);
		});
	};
	// code 

	// TODO: vdeos_ii_singlesCtrl --|-- controller_by_user
	// controller by user 
	function controller_by_user(){
		try {
			

    
$ionicConfig.backButton.text("");
$scope.pauseVideo = function() {
    var iframe = document.getElementsByTagName("iframe")[0].contentWindow;
    iframe.postMessage('{"event":"command","func":"' + 'pauseVideo' +   '","args":""}', '*');
}


$scope.playVideo = function() {
    var iframe = document.getElementsByTagName("iframe")[0].contentWindow;
   iframe.postMessage('{"event":"command","func":"' + 'playVideo' +   '","args":""}', '*');
}

$scope.$on("$ionicView.beforeLeave", function(){
	$scope.pauseVideo();
});

$scope.$on("$ionicView.enter", function(){
	$scope.playVideo();
});
			
		} catch(e){
			console.log("%cerror: %cPage: `vdeos_ii_singles` and field: `Custom Controller`","color:blue;font-size:18px","color:red;font-size:18px");
			console.dir(e);
		}
	}
	$scope.rating = {};
	$scope.rating.max = 5;
	
	// animation ink (ionic-material)
	ionicMaterialInk.displayEffect();
	controller_by_user();
})

// TODO: videos2Ctrl --|-- 
.controller("videos2Ctrl", function($ionicConfig,$scope,$rootScope,$state,$location,$ionicScrollDelegate,$ionicListDelegate,$http,$httpParamSerializer,$stateParams,$timeout,$interval,$ionicLoading,$ionicPopup,$ionicPopover,$ionicActionSheet,$ionicSlideBoxDelegate,$ionicHistory,ionicMaterialInk,ionicMaterialMotion,$window,$ionicModal,base64,md5,$document,$sce,$ionicGesture,$translate,tmhDynamicLocale){
	
	$rootScope.headerExists = true;
	$rootScope.ionWidth = $document[0].body.querySelector(".view-container").offsetWidth || 412;
	$rootScope.grid64 = parseInt($rootScope.ionWidth / 64) ;
	$rootScope.grid80 = parseInt($rootScope.ionWidth / 80) ;
	$rootScope.grid128 = parseInt($rootScope.ionWidth / 128) ;
	$rootScope.grid256 = parseInt($rootScope.ionWidth / 256) ;
	$rootScope.last_edit = "menu" ;
	$scope.$on("$ionicView.afterEnter", function (){
		var page_id = $state.current.name ;
		$rootScope.page_id = page_id.replace(".","-") ;
	});
	if($rootScope.headerShrink == true){
		$scope.$on("$ionicView.enter", function(){
			$scope.scrollTop();
		});
	};
	// TODO: videos2Ctrl --|-- $scope.scrollTop
	$rootScope.scrollTop = function(){
		$timeout(function(){
			$ionicScrollDelegate.$getByHandle("top").scrollTop();
		},100);
	};
	// TODO: videos2Ctrl --|-- $scope.toggleGroup
	$scope.toggleGroup = function(group) {
		if ($scope.isGroupShown(group)) {
			$scope.shownGroup = null;
		} else {
			$scope.shownGroup = group;
		}
	};
	
	$scope.isGroupShown = function(group) {
		return $scope.shownGroup === group;
	};
	
	// TODO: videos2Ctrl --|-- $scope.redirect
	// redirect
	$scope.redirect = function($url){
		$window.location.href = $url;
	};
	
	// Set Motion
	$timeout(function(){
		ionicMaterialMotion.slideUp({
			selector: ".slide-up"
		});
	}, 300);
	// TODO: videos2Ctrl --|-- $scope.showAuthentication
	$scope.showAuthentication  = function(){
		var authPopup = $ionicPopup.show({
			template: ' This page required login',
			title: "Authorization",
			subTitle: "Authorization is required",
			scope: $scope,
			buttons: [
				{text:"Cancel",onTap: function(e){
					$state.go("atomo_quantico.principal");
				}},
			],
		}).then(function(form){
		},function(err){
		},function(msg){
		});
	};
	
	// set default parameter http
	var http_params = {};
	
	// set HTTP Header 
	var http_header = {
		headers: {
		},
		params: http_params
	};
	var targetQuery = ""; //default param
	var raplaceWithQuery = "";
	//fix url Vídeos II
	targetQuery = "maxResults=50"; //default param
	raplaceWithQuery = "maxResults=50";
	
	
	// TODO: videos2Ctrl --|-- $scope.splitArray
	$scope.splitArray = function(items,cols,maxItem) {
		var newItems = [];
		if(maxItem == 0){
			maxItem = items.length;
		}
		if(items){
			for (var i=0; i < maxItem; i+=cols) {
				newItems.push(items.slice(i, i+cols));
			}
		}
		return newItems;
	}
	$scope.gmapOptions = {options: { scrollwheel: false }};
	
	var fetch_per_scroll = 1;
	// animation loading 
	$ionicLoading.show();
	
	
	// TODO: videos2Ctrl --|-- $scope.fetchURL
	$scope.fetchURL = "https://www.googleapis.com/youtube/v3/playlistItems?maxResults=50&part=id,snippet&playlistId=PLgyqWKH4bwdTEFHpC-ZTvXqCDOO9T-E21&key=AIzaSyAXlht6H5iRdt7bgxvx4m-W0QkEkk-depk";
	// TODO: videos2Ctrl --|-- $scope.fetchURLp
	$scope.fetchURLp = "https://www.googleapis.com/youtube/v3/playlistItems?maxResults=50&part=id,snippet&playlistId=PLgyqWKH4bwdTEFHpC-ZTvXqCDOO9T-E21&key=AIzaSyAXlht6H5iRdt7bgxvx4m-W0QkEkk-depk&callback=JSON_CALLBACK";
	// TODO: videos2Ctrl --|-- $scope.hashURL
	$scope.hashURL = md5.createHash( $scope.fetchURL.replace(targetQuery,raplaceWithQuery));
	
	
	$scope.noMoreItemsAvailable = false; //readmore status
	var lastPush = 0;
	var data_videos2s = [];
	
	localforage.getItem("data_videos2s_" + $scope.hashURL, function(err, get_videos2s){
		if(get_videos2s === null){
			data_videos2s =[];
		}else{
			data_videos2s = JSON.parse(get_videos2s);
			$scope.data_videos2s =JSON.parse( get_videos2s);
			$scope.videos2s = [];
			for(lastPush = 0; lastPush < 100; lastPush++) {
				if (angular.isObject(data_videos2s[lastPush])){
					$scope.videos2s.push(data_videos2s[lastPush]);
				};
			}
			$timeout(function() {
				$ionicLoading.hide();
				controller_by_user();
			},200);
		}
	}).then(function(value){
	}).catch(function (err){
	})
	if(data_videos2s === null ){
		data_videos2s =[];
	}
	if(data_videos2s.length === 0 ){
		$timeout(function() {
			var url_request = $scope.fetchURL.replace(targetQuery,raplaceWithQuery);
			// overwrite HTTP Header 
			http_header = {
				headers: {
				},
				params: http_params
			};
			// TODO: videos2Ctrl --|-- $http.get
			$http.get(url_request,http_header).then(function(response) {
				data_videos2s = response.data.items;
				$scope.data_videos2s = response.data.items;
				// TODO: videos2Ctrl --|---------- set:localforage
				localforage.setItem("data_videos2s_" + $scope.hashURL, JSON.stringify(data_videos2s));
				$scope.videos2s = [];
				for(lastPush = 0; lastPush < 100; lastPush++) {
					if (angular.isObject(data_videos2s[lastPush])){
						$scope.videos2s.push(data_videos2s[lastPush]);
					};
				}
			},function(response) {
			
				$timeout(function() {
					var url_request = $scope.fetchURLp.replace(targetQuery,raplaceWithQuery);
					// overwrite HTTP Header 
					http_header = {
						headers: {
						},
						params: http_params
					};
					// TODO: videos2Ctrl --|------ $http.jsonp
					$http.jsonp(url_request,http_header).success(function(data){
						data_videos2s = data.items;
						$scope.data_videos2s = data.items;
						$ionicLoading.hide();
						// TODO: videos2Ctrl --|---------- set:localforage
						localforage.setItem("data_videos2s_" + $scope.hashURL,JSON.stringify(data_videos2s));
						controller_by_user();
						$scope.videos2s = [];
						for(lastPush = 0; lastPush < 100; lastPush++) {
							if (angular.isObject(data_videos2s[lastPush])){
								$scope.videos2s.push(data_videos2s[lastPush]);
							};
						}
					}).error(function(data){
					if(response.status ===401){
						// TODO: videos2Ctrl --|------------ error:Unauthorized
						$scope.showAuthentication();
					}else{
						// TODO: videos2Ctrl --|------------ error:Message
						var data = { statusText:response.statusText, status:response.status };
						var alertPopup = $ionicPopup.alert({
							title: "Network Error" + " (" + data.status + ")",
							template: "An error occurred while collecting data.",
						});
						$timeout(function() {
							alertPopup.close();
						}, 2000);
					}
					});
				}, 200);
		}).finally(function() {
			$scope.$broadcast("scroll.refreshComplete");
			// event done, hidden animation loading
			$timeout(function() {
				$ionicLoading.hide();
				controller_by_user();
				if(angular.isDefined($scope.data_videos2s.data)){
					if($scope.data_videos2s.data.status ===401){
						$scope.showAuthentication();
						return false;
					}
				}
			}, 200);
		});
	
		}, 200);
	}
	
	
	// TODO: videos2Ctrl --|-- $scope.doRefresh
	$scope.doRefresh = function(){
		var url_request = $scope.fetchURL.replace(targetQuery,raplaceWithQuery);
		// retry retrieving data
		// overwrite http_header 
		http_header = {
			headers: {
			},
			params: http_params
		};
		// TODO: videos2Ctrl --|------ $http.get
		$http.get(url_request,http_header).then(function(response) {
			data_videos2s = response.data.items;
			$scope.data_videos2s = response.data.items;
			// TODO: videos2Ctrl --|---------- set:localforage
			localforage.setItem("data_videos2s_" + $scope.hashURL,JSON.stringify(data_videos2s));
			$scope.videos2s = [];
			for(lastPush = 0; lastPush < 100; lastPush++) {
				if (angular.isObject(data_videos2s[lastPush])){
					$scope.videos2s.push(data_videos2s[lastPush]);
				};
			}
		},function(response){
			
		// retrieving data with jsonp
			$timeout(function() {
			var url_request =$scope.fetchURLp.replace(targetQuery,raplaceWithQuery);
				// overwrite http_header 
				http_header = {
					headers: {
					},
					params: http_params
				};
				// TODO: videos2Ctrl --|---------- $http.jsonp
				$http.jsonp(url_request,http_header).success(function(data){
					data_videos2s = data.items;
					$scope.data_videos2s = data.items;
					$ionicLoading.hide();
					controller_by_user();
					// TODO: videos2Ctrl --|---------- set:localforage
					localforage.setItem("data_videos2s_"+ $scope.hashURL,JSON.stringify(data_videos2s));
					$scope.videos2s = [];
					for(lastPush = 0; lastPush < 100; lastPush++) {
						if (angular.isObject(data_videos2s[lastPush])){
							$scope.videos2s.push(data_videos2s[lastPush]);
						};
					}
				}).error(function(resp){
					if(response.status ===401){
						// TODO: videos2Ctrl --|------------ error:Unauthorized
						$scope.showAuthentication();
					}else{
						// TODO: videos2Ctrl --|------------ error:Message
						var data = { statusText:response.statusText, status:response.status };
						var alertPopup = $ionicPopup.alert({
							title: "Network Error" + " (" + data.status + ")",
							template: "An error occurred while collecting data.",
						});
					};
				});
			}, 200);
		}).finally(function() {
			$scope.$broadcast("scroll.refreshComplete");
			// event done, hidden animation loading
			$timeout(function() {
				$ionicLoading.hide();
				controller_by_user();
			}, 500);
		});
	
	};
	if (data_videos2s === null){
		data_videos2s = [];
	};
	// animation readmore
	var fetchItems = function() {
		for(var z=0;z<fetch_per_scroll;z++){
			if (angular.isObject(data_videos2s[lastPush])){
				$scope.videos2s.push(data_videos2s[lastPush]);
				lastPush++;
			}else{;
				$scope.noMoreItemsAvailable = true;
			}
		}
		$scope.$broadcast("scroll.infiniteScrollComplete");
	};
	
	// event readmore
	$scope.onInfinite = function() {
		$timeout(fetchItems, 500);
	};
	
	// create animation fade slide in right (ionic-material)
	$scope.fireEvent = function(){
		ionicMaterialInk.displayEffect();
	};
	// code 

	// TODO: videos2Ctrl --|-- controller_by_user
	// controller by user 
	function controller_by_user(){
		try {
			
$ionicConfig.backButton.text("");			
		} catch(e){
			console.log("%cerror: %cPage: `videos2` and field: `Custom Controller`","color:blue;font-size:18px","color:red;font-size:18px");
			console.dir(e);
		}
	}
	$scope.rating = {};
	$scope.rating.max = 5;
	
	// animation ink (ionic-material)
	ionicMaterialInk.displayEffect();
	controller_by_user();
})

// TODO: videos3Ctrl --|-- 
.controller("videos3Ctrl", function($ionicConfig,$scope,$rootScope,$state,$location,$ionicScrollDelegate,$ionicListDelegate,$http,$httpParamSerializer,$stateParams,$timeout,$interval,$ionicLoading,$ionicPopup,$ionicPopover,$ionicActionSheet,$ionicSlideBoxDelegate,$ionicHistory,ionicMaterialInk,ionicMaterialMotion,$window,$ionicModal,base64,md5,$document,$sce,$ionicGesture,$translate,tmhDynamicLocale){
	
	$rootScope.headerExists = true;
	$rootScope.ionWidth = $document[0].body.querySelector(".view-container").offsetWidth || 412;
	$rootScope.grid64 = parseInt($rootScope.ionWidth / 64) ;
	$rootScope.grid80 = parseInt($rootScope.ionWidth / 80) ;
	$rootScope.grid128 = parseInt($rootScope.ionWidth / 128) ;
	$rootScope.grid256 = parseInt($rootScope.ionWidth / 256) ;
	$rootScope.last_edit = "menu" ;
	$scope.$on("$ionicView.afterEnter", function (){
		var page_id = $state.current.name ;
		$rootScope.page_id = page_id.replace(".","-") ;
	});
	if($rootScope.headerShrink == true){
		$scope.$on("$ionicView.enter", function(){
			$scope.scrollTop();
		});
	};
	// TODO: videos3Ctrl --|-- $scope.scrollTop
	$rootScope.scrollTop = function(){
		$timeout(function(){
			$ionicScrollDelegate.$getByHandle("top").scrollTop();
		},100);
	};
	// TODO: videos3Ctrl --|-- $scope.toggleGroup
	$scope.toggleGroup = function(group) {
		if ($scope.isGroupShown(group)) {
			$scope.shownGroup = null;
		} else {
			$scope.shownGroup = group;
		}
	};
	
	$scope.isGroupShown = function(group) {
		return $scope.shownGroup === group;
	};
	
	// TODO: videos3Ctrl --|-- $scope.redirect
	// redirect
	$scope.redirect = function($url){
		$window.location.href = $url;
	};
	
	// Set Motion
	$timeout(function(){
		ionicMaterialMotion.slideUp({
			selector: ".slide-up"
		});
	}, 300);
	// TODO: videos3Ctrl --|-- $scope.showAuthentication
	$scope.showAuthentication  = function(){
		var authPopup = $ionicPopup.show({
			template: ' This page required login',
			title: "Authorization",
			subTitle: "Authorization is required",
			scope: $scope,
			buttons: [
				{text:"Cancel",onTap: function(e){
					$state.go("atomo_quantico.principal");
				}},
			],
		}).then(function(form){
		},function(err){
		},function(msg){
		});
	};
	
	// set default parameter http
	var http_params = {};
	
	// set HTTP Header 
	var http_header = {
		headers: {
		},
		params: http_params
	};
	var targetQuery = ""; //default param
	var raplaceWithQuery = "";
	//fix url Vídeos III
	targetQuery = "maxResults=50"; //default param
	raplaceWithQuery = "maxResults=50";
	
	
	// TODO: videos3Ctrl --|-- $scope.splitArray
	$scope.splitArray = function(items,cols,maxItem) {
		var newItems = [];
		if(maxItem == 0){
			maxItem = items.length;
		}
		if(items){
			for (var i=0; i < maxItem; i+=cols) {
				newItems.push(items.slice(i, i+cols));
			}
		}
		return newItems;
	}
	$scope.gmapOptions = {options: { scrollwheel: false }};
	
	var fetch_per_scroll = 1;
	// animation loading 
	$ionicLoading.show();
	
	
	// TODO: videos3Ctrl --|-- $scope.fetchURL
	$scope.fetchURL = "https://www.googleapis.com/youtube/v3/playlistItems?maxResults=50&part=id,snippet&playlistId=PLgyqWKH4bwdSIe9LjvzxffNaCLT8nDQ9R&key=AIzaSyAXlht6H5iRdt7bgxvx4m-W0QkEkk-depk";
	// TODO: videos3Ctrl --|-- $scope.fetchURLp
	$scope.fetchURLp = "https://www.googleapis.com/youtube/v3/playlistItems?maxResults=50&part=id,snippet&playlistId=PLgyqWKH4bwdSIe9LjvzxffNaCLT8nDQ9R&key=AIzaSyAXlht6H5iRdt7bgxvx4m-W0QkEkk-depk&callback=JSON_CALLBACK";
	// TODO: videos3Ctrl --|-- $scope.hashURL
	$scope.hashURL = md5.createHash( $scope.fetchURL.replace(targetQuery,raplaceWithQuery));
	
	
	$scope.noMoreItemsAvailable = false; //readmore status
	var lastPush = 0;
	var data_videos3s = [];
	
	localforage.getItem("data_videos3s_" + $scope.hashURL, function(err, get_videos3s){
		if(get_videos3s === null){
			data_videos3s =[];
		}else{
			data_videos3s = JSON.parse(get_videos3s);
			$scope.data_videos3s =JSON.parse( get_videos3s);
			$scope.videos3s = [];
			for(lastPush = 0; lastPush < 100; lastPush++) {
				if (angular.isObject(data_videos3s[lastPush])){
					$scope.videos3s.push(data_videos3s[lastPush]);
				};
			}
			$timeout(function() {
				$ionicLoading.hide();
				controller_by_user();
			},200);
		}
	}).then(function(value){
	}).catch(function (err){
	})
	if(data_videos3s === null ){
		data_videos3s =[];
	}
	if(data_videos3s.length === 0 ){
		$timeout(function() {
			var url_request = $scope.fetchURL.replace(targetQuery,raplaceWithQuery);
			// overwrite HTTP Header 
			http_header = {
				headers: {
				},
				params: http_params
			};
			// TODO: videos3Ctrl --|-- $http.get
			$http.get(url_request,http_header).then(function(response) {
				data_videos3s = response.data.items;
				$scope.data_videos3s = response.data.items;
				// TODO: videos3Ctrl --|---------- set:localforage
				localforage.setItem("data_videos3s_" + $scope.hashURL, JSON.stringify(data_videos3s));
				$scope.videos3s = [];
				for(lastPush = 0; lastPush < 100; lastPush++) {
					if (angular.isObject(data_videos3s[lastPush])){
						$scope.videos3s.push(data_videos3s[lastPush]);
					};
				}
			},function(response) {
			
				$timeout(function() {
					var url_request = $scope.fetchURLp.replace(targetQuery,raplaceWithQuery);
					// overwrite HTTP Header 
					http_header = {
						headers: {
						},
						params: http_params
					};
					// TODO: videos3Ctrl --|------ $http.jsonp
					$http.jsonp(url_request,http_header).success(function(data){
						data_videos3s = data.items;
						$scope.data_videos3s = data.items;
						$ionicLoading.hide();
						// TODO: videos3Ctrl --|---------- set:localforage
						localforage.setItem("data_videos3s_" + $scope.hashURL,JSON.stringify(data_videos3s));
						controller_by_user();
						$scope.videos3s = [];
						for(lastPush = 0; lastPush < 100; lastPush++) {
							if (angular.isObject(data_videos3s[lastPush])){
								$scope.videos3s.push(data_videos3s[lastPush]);
							};
						}
					}).error(function(data){
					if(response.status ===401){
						// TODO: videos3Ctrl --|------------ error:Unauthorized
						$scope.showAuthentication();
					}else{
						// TODO: videos3Ctrl --|------------ error:Message
						var data = { statusText:response.statusText, status:response.status };
						var alertPopup = $ionicPopup.alert({
							title: "Network Error" + " (" + data.status + ")",
							template: "An error occurred while collecting data.",
						});
						$timeout(function() {
							alertPopup.close();
						}, 2000);
					}
					});
				}, 200);
		}).finally(function() {
			$scope.$broadcast("scroll.refreshComplete");
			// event done, hidden animation loading
			$timeout(function() {
				$ionicLoading.hide();
				controller_by_user();
				if(angular.isDefined($scope.data_videos3s.data)){
					if($scope.data_videos3s.data.status ===401){
						$scope.showAuthentication();
						return false;
					}
				}
			}, 200);
		});
	
		}, 200);
	}
	
	
	// TODO: videos3Ctrl --|-- $scope.doRefresh
	$scope.doRefresh = function(){
		var url_request = $scope.fetchURL.replace(targetQuery,raplaceWithQuery);
		// retry retrieving data
		// overwrite http_header 
		http_header = {
			headers: {
			},
			params: http_params
		};
		// TODO: videos3Ctrl --|------ $http.get
		$http.get(url_request,http_header).then(function(response) {
			data_videos3s = response.data.items;
			$scope.data_videos3s = response.data.items;
			// TODO: videos3Ctrl --|---------- set:localforage
			localforage.setItem("data_videos3s_" + $scope.hashURL,JSON.stringify(data_videos3s));
			$scope.videos3s = [];
			for(lastPush = 0; lastPush < 100; lastPush++) {
				if (angular.isObject(data_videos3s[lastPush])){
					$scope.videos3s.push(data_videos3s[lastPush]);
				};
			}
		},function(response){
			
		// retrieving data with jsonp
			$timeout(function() {
			var url_request =$scope.fetchURLp.replace(targetQuery,raplaceWithQuery);
				// overwrite http_header 
				http_header = {
					headers: {
					},
					params: http_params
				};
				// TODO: videos3Ctrl --|---------- $http.jsonp
				$http.jsonp(url_request,http_header).success(function(data){
					data_videos3s = data.items;
					$scope.data_videos3s = data.items;
					$ionicLoading.hide();
					controller_by_user();
					// TODO: videos3Ctrl --|---------- set:localforage
					localforage.setItem("data_videos3s_"+ $scope.hashURL,JSON.stringify(data_videos3s));
					$scope.videos3s = [];
					for(lastPush = 0; lastPush < 100; lastPush++) {
						if (angular.isObject(data_videos3s[lastPush])){
							$scope.videos3s.push(data_videos3s[lastPush]);
						};
					}
				}).error(function(resp){
					if(response.status ===401){
						// TODO: videos3Ctrl --|------------ error:Unauthorized
						$scope.showAuthentication();
					}else{
						// TODO: videos3Ctrl --|------------ error:Message
						var data = { statusText:response.statusText, status:response.status };
						var alertPopup = $ionicPopup.alert({
							title: "Network Error" + " (" + data.status + ")",
							template: "An error occurred while collecting data.",
						});
					};
				});
			}, 200);
		}).finally(function() {
			$scope.$broadcast("scroll.refreshComplete");
			// event done, hidden animation loading
			$timeout(function() {
				$ionicLoading.hide();
				controller_by_user();
			}, 500);
		});
	
	};
	if (data_videos3s === null){
		data_videos3s = [];
	};
	// animation readmore
	var fetchItems = function() {
		for(var z=0;z<fetch_per_scroll;z++){
			if (angular.isObject(data_videos3s[lastPush])){
				$scope.videos3s.push(data_videos3s[lastPush]);
				lastPush++;
			}else{;
				$scope.noMoreItemsAvailable = true;
			}
		}
		$scope.$broadcast("scroll.infiniteScrollComplete");
	};
	
	// event readmore
	$scope.onInfinite = function() {
		$timeout(fetchItems, 500);
	};
	
	// create animation fade slide in right (ionic-material)
	$scope.fireEvent = function(){
		ionicMaterialInk.displayEffect();
	};
	// code 

	// TODO: videos3Ctrl --|-- controller_by_user
	// controller by user 
	function controller_by_user(){
		try {
			
$ionicConfig.backButton.text("");			
		} catch(e){
			console.log("%cerror: %cPage: `videos3` and field: `Custom Controller`","color:blue;font-size:18px","color:red;font-size:18px");
			console.dir(e);
		}
	}
	$scope.rating = {};
	$scope.rating.max = 5;
	
	// animation ink (ionic-material)
	ionicMaterialInk.displayEffect();
	controller_by_user();
})

// TODO: videos_iCtrl --|-- 
.controller("videos_iCtrl", function($ionicConfig,$scope,$rootScope,$state,$location,$ionicScrollDelegate,$ionicListDelegate,$http,$httpParamSerializer,$stateParams,$timeout,$interval,$ionicLoading,$ionicPopup,$ionicPopover,$ionicActionSheet,$ionicSlideBoxDelegate,$ionicHistory,ionicMaterialInk,ionicMaterialMotion,$window,$ionicModal,base64,md5,$document,$sce,$ionicGesture,$translate,tmhDynamicLocale){
	
	$rootScope.headerExists = true;
	$rootScope.ionWidth = $document[0].body.querySelector(".view-container").offsetWidth || 412;
	$rootScope.grid64 = parseInt($rootScope.ionWidth / 64) ;
	$rootScope.grid80 = parseInt($rootScope.ionWidth / 80) ;
	$rootScope.grid128 = parseInt($rootScope.ionWidth / 128) ;
	$rootScope.grid256 = parseInt($rootScope.ionWidth / 256) ;
	$rootScope.last_edit = "-" ;
	$scope.$on("$ionicView.afterEnter", function (){
		var page_id = $state.current.name ;
		$rootScope.page_id = page_id.replace(".","-") ;
	});
	if($rootScope.headerShrink == true){
		$scope.$on("$ionicView.enter", function(){
			$scope.scrollTop();
		});
	};
	// TODO: videos_iCtrl --|-- $scope.scrollTop
	$rootScope.scrollTop = function(){
		$timeout(function(){
			$ionicScrollDelegate.$getByHandle("top").scrollTop();
		},100);
	};
	// TODO: videos_iCtrl --|-- $scope.toggleGroup
	$scope.toggleGroup = function(group) {
		if ($scope.isGroupShown(group)) {
			$scope.shownGroup = null;
		} else {
			$scope.shownGroup = group;
		}
	};
	
	$scope.isGroupShown = function(group) {
		return $scope.shownGroup === group;
	};
	
	// TODO: videos_iCtrl --|-- $scope.redirect
	// redirect
	$scope.redirect = function($url){
		$window.location.href = $url;
	};
	
	// Set Motion
	$timeout(function(){
		ionicMaterialMotion.slideUp({
			selector: ".slide-up"
		});
	}, 300);
	// TODO: videos_iCtrl --|-- $scope.showAuthentication
	$scope.showAuthentication  = function(){
		var authPopup = $ionicPopup.show({
			template: ' This page required login',
			title: "Authorization",
			subTitle: "Authorization is required",
			scope: $scope,
			buttons: [
				{text:"Cancel",onTap: function(e){
					$state.go("atomo_quantico.principal");
				}},
			],
		}).then(function(form){
		},function(err){
		},function(msg){
		});
	};
	
	// set default parameter http
	var http_params = {};
	
	// set HTTP Header 
	var http_header = {
		headers: {
		},
		params: http_params
	};
	var targetQuery = ""; //default param
	var raplaceWithQuery = "";
	//fix url Vídeos I
	targetQuery = "maxResults=50"; //default param
	raplaceWithQuery = "maxResults=50";
	
	
	// TODO: videos_iCtrl --|-- $scope.splitArray
	$scope.splitArray = function(items,cols,maxItem) {
		var newItems = [];
		if(maxItem == 0){
			maxItem = items.length;
		}
		if(items){
			for (var i=0; i < maxItem; i+=cols) {
				newItems.push(items.slice(i, i+cols));
			}
		}
		return newItems;
	}
	$scope.gmapOptions = {options: { scrollwheel: false }};
	
	var fetch_per_scroll = 1;
	// animation loading 
	$ionicLoading.show();
	
	
	// TODO: videos_iCtrl --|-- $scope.fetchURL
	$scope.fetchURL = "https://www.googleapis.com/youtube/v3/playlistItems?maxResults=50&part=id,snippet&playlistId=PLgyqWKH4bwdQXGHkuLbhFJaZlCeDmdJdh&key=AIzaSyAXlht6H5iRdt7bgxvx4m-W0QkEkk-depk";
	// TODO: videos_iCtrl --|-- $scope.fetchURLp
	$scope.fetchURLp = "https://www.googleapis.com/youtube/v3/playlistItems?maxResults=50&part=id,snippet&playlistId=PLgyqWKH4bwdQXGHkuLbhFJaZlCeDmdJdh&key=AIzaSyAXlht6H5iRdt7bgxvx4m-W0QkEkk-depk&callback=JSON_CALLBACK";
	// TODO: videos_iCtrl --|-- $scope.hashURL
	$scope.hashURL = md5.createHash( $scope.fetchURL.replace(targetQuery,raplaceWithQuery));
	
	
	$scope.noMoreItemsAvailable = false; //readmore status
	var lastPush = 0;
	var data_videos_is = [];
	
	localforage.getItem("data_videos_is_" + $scope.hashURL, function(err, get_videos_is){
		if(get_videos_is === null){
			data_videos_is =[];
		}else{
			data_videos_is = JSON.parse(get_videos_is);
			$scope.data_videos_is =JSON.parse( get_videos_is);
			$scope.videos_is = [];
			for(lastPush = 0; lastPush < 100; lastPush++) {
				if (angular.isObject(data_videos_is[lastPush])){
					$scope.videos_is.push(data_videos_is[lastPush]);
				};
			}
			$timeout(function() {
				$ionicLoading.hide();
				controller_by_user();
			},200);
		}
	}).then(function(value){
	}).catch(function (err){
	})
	if(data_videos_is === null ){
		data_videos_is =[];
	}
	if(data_videos_is.length === 0 ){
		$timeout(function() {
			var url_request = $scope.fetchURL.replace(targetQuery,raplaceWithQuery);
			// overwrite HTTP Header 
			http_header = {
				headers: {
				},
				params: http_params
			};
			// TODO: videos_iCtrl --|-- $http.get
			$http.get(url_request,http_header).then(function(response) {
				data_videos_is = response.data.items;
				$scope.data_videos_is = response.data.items;
				// TODO: videos_iCtrl --|---------- set:localforage
				localforage.setItem("data_videos_is_" + $scope.hashURL, JSON.stringify(data_videos_is));
				$scope.videos_is = [];
				for(lastPush = 0; lastPush < 100; lastPush++) {
					if (angular.isObject(data_videos_is[lastPush])){
						$scope.videos_is.push(data_videos_is[lastPush]);
					};
				}
			},function(response) {
			
				$timeout(function() {
					var url_request = $scope.fetchURLp.replace(targetQuery,raplaceWithQuery);
					// overwrite HTTP Header 
					http_header = {
						headers: {
						},
						params: http_params
					};
					// TODO: videos_iCtrl --|------ $http.jsonp
					$http.jsonp(url_request,http_header).success(function(data){
						data_videos_is = data.items;
						$scope.data_videos_is = data.items;
						$ionicLoading.hide();
						// TODO: videos_iCtrl --|---------- set:localforage
						localforage.setItem("data_videos_is_" + $scope.hashURL,JSON.stringify(data_videos_is));
						controller_by_user();
						$scope.videos_is = [];
						for(lastPush = 0; lastPush < 100; lastPush++) {
							if (angular.isObject(data_videos_is[lastPush])){
								$scope.videos_is.push(data_videos_is[lastPush]);
							};
						}
					}).error(function(data){
					if(response.status ===401){
						// TODO: videos_iCtrl --|------------ error:Unauthorized
						$scope.showAuthentication();
					}else{
						// TODO: videos_iCtrl --|------------ error:Message
						var data = { statusText:response.statusText, status:response.status };
						var alertPopup = $ionicPopup.alert({
							title: "Network Error" + " (" + data.status + ")",
							template: "An error occurred while collecting data.",
						});
						$timeout(function() {
							alertPopup.close();
						}, 2000);
					}
					});
				}, 200);
		}).finally(function() {
			$scope.$broadcast("scroll.refreshComplete");
			// event done, hidden animation loading
			$timeout(function() {
				$ionicLoading.hide();
				controller_by_user();
				if(angular.isDefined($scope.data_videos_is.data)){
					if($scope.data_videos_is.data.status ===401){
						$scope.showAuthentication();
						return false;
					}
				}
			}, 200);
		});
	
		}, 200);
	}
	
	
	// TODO: videos_iCtrl --|-- $scope.doRefresh
	$scope.doRefresh = function(){
		var url_request = $scope.fetchURL.replace(targetQuery,raplaceWithQuery);
		// retry retrieving data
		// overwrite http_header 
		http_header = {
			headers: {
			},
			params: http_params
		};
		// TODO: videos_iCtrl --|------ $http.get
		$http.get(url_request,http_header).then(function(response) {
			data_videos_is = response.data.items;
			$scope.data_videos_is = response.data.items;
			// TODO: videos_iCtrl --|---------- set:localforage
			localforage.setItem("data_videos_is_" + $scope.hashURL,JSON.stringify(data_videos_is));
			$scope.videos_is = [];
			for(lastPush = 0; lastPush < 100; lastPush++) {
				if (angular.isObject(data_videos_is[lastPush])){
					$scope.videos_is.push(data_videos_is[lastPush]);
				};
			}
		},function(response){
			
		// retrieving data with jsonp
			$timeout(function() {
			var url_request =$scope.fetchURLp.replace(targetQuery,raplaceWithQuery);
				// overwrite http_header 
				http_header = {
					headers: {
					},
					params: http_params
				};
				// TODO: videos_iCtrl --|---------- $http.jsonp
				$http.jsonp(url_request,http_header).success(function(data){
					data_videos_is = data.items;
					$scope.data_videos_is = data.items;
					$ionicLoading.hide();
					controller_by_user();
					// TODO: videos_iCtrl --|---------- set:localforage
					localforage.setItem("data_videos_is_"+ $scope.hashURL,JSON.stringify(data_videos_is));
					$scope.videos_is = [];
					for(lastPush = 0; lastPush < 100; lastPush++) {
						if (angular.isObject(data_videos_is[lastPush])){
							$scope.videos_is.push(data_videos_is[lastPush]);
						};
					}
				}).error(function(resp){
					if(response.status ===401){
						// TODO: videos_iCtrl --|------------ error:Unauthorized
						$scope.showAuthentication();
					}else{
						// TODO: videos_iCtrl --|------------ error:Message
						var data = { statusText:response.statusText, status:response.status };
						var alertPopup = $ionicPopup.alert({
							title: "Network Error" + " (" + data.status + ")",
							template: "An error occurred while collecting data.",
						});
					};
				});
			}, 200);
		}).finally(function() {
			$scope.$broadcast("scroll.refreshComplete");
			// event done, hidden animation loading
			$timeout(function() {
				$ionicLoading.hide();
				controller_by_user();
			}, 500);
		});
	
	};
	if (data_videos_is === null){
		data_videos_is = [];
	};
	// animation readmore
	var fetchItems = function() {
		for(var z=0;z<fetch_per_scroll;z++){
			if (angular.isObject(data_videos_is[lastPush])){
				$scope.videos_is.push(data_videos_is[lastPush]);
				lastPush++;
			}else{;
				$scope.noMoreItemsAvailable = true;
			}
		}
		$scope.$broadcast("scroll.infiniteScrollComplete");
	};
	
	// event readmore
	$scope.onInfinite = function() {
		$timeout(fetchItems, 500);
	};
	
	// create animation fade slide in right (ionic-material)
	$scope.fireEvent = function(){
		ionicMaterialInk.displayEffect();
	};
	// code 

	// TODO: videos_iCtrl --|-- controller_by_user
	// controller by user 
	function controller_by_user(){
		try {
			
$ionicConfig.backButton.text("");			
		} catch(e){
			console.log("%cerror: %cPage: `videos_i` and field: `Custom Controller`","color:blue;font-size:18px","color:red;font-size:18px");
			console.dir(e);
		}
	}
	$scope.rating = {};
	$scope.rating.max = 5;
	
	// animation ink (ionic-material)
	ionicMaterialInk.displayEffect();
	controller_by_user();
})

// TODO: videos_i_singlesCtrl --|-- 
.controller("videos_i_singlesCtrl", function($ionicConfig,$scope,$rootScope,$state,$location,$ionicScrollDelegate,$ionicListDelegate,$http,$httpParamSerializer,$stateParams,$timeout,$interval,$ionicLoading,$ionicPopup,$ionicPopover,$ionicActionSheet,$ionicSlideBoxDelegate,$ionicHistory,ionicMaterialInk,ionicMaterialMotion,$window,$ionicModal,base64,md5,$document,$sce,$ionicGesture,$translate,tmhDynamicLocale){
	
	$rootScope.headerExists = true;
	$rootScope.ionWidth = $document[0].body.querySelector(".view-container").offsetWidth || 412;
	$rootScope.grid64 = parseInt($rootScope.ionWidth / 64) ;
	$rootScope.grid80 = parseInt($rootScope.ionWidth / 80) ;
	$rootScope.grid128 = parseInt($rootScope.ionWidth / 128) ;
	$rootScope.grid256 = parseInt($rootScope.ionWidth / 256) ;
	$rootScope.last_edit = "page-builder" ;
	$scope.$on("$ionicView.afterEnter", function (){
		var page_id = $state.current.name ;
		$rootScope.page_id = page_id.replace(".","-") ;
	});
	if($rootScope.headerShrink == true){
		$scope.$on("$ionicView.enter", function(){
			$scope.scrollTop();
		});
	};
	// TODO: videos_i_singlesCtrl --|-- $scope.scrollTop
	$rootScope.scrollTop = function(){
		$timeout(function(){
			$ionicScrollDelegate.$getByHandle("top").scrollTop();
		},100);
	};
	// TODO: videos_i_singlesCtrl --|-- $scope.toggleGroup
	$scope.toggleGroup = function(group) {
		if ($scope.isGroupShown(group)) {
			$scope.shownGroup = null;
		} else {
			$scope.shownGroup = group;
		}
	};
	
	$scope.isGroupShown = function(group) {
		return $scope.shownGroup === group;
	};
	
	// TODO: videos_i_singlesCtrl --|-- $scope.redirect
	// redirect
	$scope.redirect = function($url){
		$window.location.href = $url;
	};
	
	// Set Motion
	$timeout(function(){
		ionicMaterialMotion.slideUp({
			selector: ".slide-up"
		});
	}, 300);
	// TODO: videos_i_singlesCtrl --|-- $scope.showAuthentication
	$scope.showAuthentication  = function(){
		var authPopup = $ionicPopup.show({
			template: ' This page required login',
			title: "Authorization",
			subTitle: "Authorization is required",
			scope: $scope,
			buttons: [
				{text:"Cancel",onTap: function(e){
					$state.go("atomo_quantico.principal");
				}},
			],
		}).then(function(form){
		},function(err){
		},function(msg){
		});
	};
	
	// set default parameter http
	var http_params = {};

	// set HTTP Header 
	var http_header = {
		headers: {
		},
		params: http_params
	};
	// animation loading 
	$ionicLoading.show();
	
	// Retrieving data
	var itemID = $stateParams.snippetresourceIdvideoId;
	// TODO: videos_i_singlesCtrl --|-- $scope.fetchURL
	$scope.fetchURL = "https://www.googleapis.com/youtube/v3/playlistItems?maxResults=50&part=id,snippet&playlistId=PLgyqWKH4bwdQXGHkuLbhFJaZlCeDmdJdh&key=AIzaSyAXlht6H5iRdt7bgxvx4m-W0QkEkk-depk";
	// TODO: videos_i_singlesCtrl --|-- $scope.fetchURLp
	$scope.fetchURLp = "https://www.googleapis.com/youtube/v3/playlistItems?maxResults=50&part=id,snippet&playlistId=PLgyqWKH4bwdQXGHkuLbhFJaZlCeDmdJdh&key=AIzaSyAXlht6H5iRdt7bgxvx4m-W0QkEkk-depk&callback=JSON_CALLBACK";
	// TODO: videos_i_singlesCtrl --|-- $scope.hashURL
	$scope.hashURL = md5.createHash($scope.fetchURL);
	
	var current_item = [];
	localforage.getItem("data_videos_is_" + $scope.hashURL, function(err, get_datas){
		if(get_datas === null){
			current_item = [];
		}else{
			if(get_datas !== null){
				var datas = JSON.parse(get_datas);
				for (var i = 0; i < datas.length; i++) {
					if((datas[i].snippet.resourceId.videoId ===  parseInt(itemID)) || (datas[i].snippet.resourceId.videoId === itemID.toString())) {
						current_item = datas[i] ;
					}
				}
			}
			// event done, hidden animation loading
			$timeout(function(){
				$ionicLoading.hide();
				$scope.videos_i = current_item ;
				controller_by_user();
			}, 100);
		};
	}).then(function(value){
	}).catch(function (err){
	})
	if( current_item.length === 0 ){
		var itemID = $stateParams.snippetresourceIdvideoId;
		var current_item = [];
	
		// set HTTP Header 
		http_header = {
			headers: {
			},
			params: http_params
		};
		// TODO: videos_i_singlesCtrl --|-- $http.get
		$http.get($scope.fetchURL,http_header).then(function(response) {
			// Get data single
			var datas = response.data;
			// TODO: videos_i_singlesCtrl --|---------- set:localforage
			localforage.setItem("data_videos_is_"+ $scope.hashURL,JSON.stringify(datas));
			for (var i = 0; i < datas.length; i++) {
				if((datas[i].snippet.resourceId.videoId ===  parseInt(itemID)) || (datas[i].snippet.resourceId.videoId === itemID.toString())) {
					current_item = datas[i] ;
				}
			}
		},function(data) {
					// Error message
					var alertPopup = $ionicPopup.alert({
						title: "Network Error" + " (" + data.status + ")",
						template: "An error occurred while collecting data.",
					});
					$timeout(function() {
						alertPopup.close();
					}, 2000);
		}).finally(function() {
			$scope.$broadcast("scroll.refreshComplete");
			// event done, hidden animation loading
			$timeout(function() {
				$ionicLoading.hide();
				$scope.videos_i = current_item ;
				controller_by_user();
			}, 500);
		});
	}
	
	
		// TODO: videos_i_singlesCtrl --|-- $scope.doRefresh
	$scope.doRefresh = function(){
		// Retrieving data
		var itemID = $stateParams.snippetresourceIdvideoId;
		var current_item = [];
		// overwrite http_header 
		http_header = {
			headers: {
			},
			params: http_params
		};
		// TODO: videos_i_singlesCtrl --|------ $http.get
		$http.get($scope.fetchURL,http_header).then(function(response) {
			// Get data single
			var datas = response.data.items;
			// TODO: videos_i_singlesCtrl --|---------- set:localforage
			localforage.setItem("data_videos_is_"+ $scope.hashURL,JSON.stringify(datas));
			for (var i = 0; i < datas.length; i++) {
				if((datas[i].snippet.resourceId.videoId ===  parseInt(itemID)) || (datas[i].snippet.resourceId.videoId === itemID.toString())) {
					current_item = datas[i] ;
				}
			}
		},function(data) {
			// Error message
		// TODO: videos_i_singlesCtrl --|---------- $http.jsonp
				$http.jsonp($scope.fetchURLp,http_header).success(function(response){
					// Get data single
					var datas = response.items;
			// TODO: videos_i_singlesCtrl --|---------- set:localforage
			localforage.setItem("data_videos_is_"+ $scope.hashURL,JSON.stringify(datas));
					for (var i = 0; i < datas.length; i++) {
						if((datas[i].snippetresourceIdvideoId ===  parseInt(itemID)) || (datas[i].snippetresourceIdvideoId === itemID.toString())) {
							current_item = datas[i] ;
						}
					}
						$scope.$broadcast("scroll.refreshComplete");
						// event done, hidden animation loading
						$timeout(function() {
							$ionicLoading.hide();
							$scope.videos_i = current_item ;
							controller_by_user();
						}, 500);
					}).error(function(resp){
						var alertPopup = $ionicPopup.alert({
							title: "Network Error" + " (" + data.status + ")",
							template: "An error occurred while collecting data.",
						});
					});
		}).finally(function() {
			$scope.$broadcast("scroll.refreshComplete");
			// event done, hidden animation loading
			$timeout(function() {
				$ionicLoading.hide();
				$scope.videos_i = current_item ;
				controller_by_user();
			}, 500);
		});
	};
	// code 

	// TODO: videos_i_singlesCtrl --|-- controller_by_user
	// controller by user 
	function controller_by_user(){
		try {
			

    
$ionicConfig.backButton.text("");
$scope.pauseVideo = function() {
    var iframe = document.getElementsByTagName("iframe")[0].contentWindow;
    iframe.postMessage('{"event":"command","func":"' + 'pauseVideo' +   '","args":""}', '*');
}


$scope.playVideo = function() {
    var iframe = document.getElementsByTagName("iframe")[0].contentWindow;
   iframe.postMessage('{"event":"command","func":"' + 'playVideo' +   '","args":""}', '*');
}

$scope.$on("$ionicView.beforeLeave", function(){
	$scope.pauseVideo();
});

$scope.$on("$ionicView.enter", function(){
	$scope.playVideo();
});
			
		} catch(e){
			console.log("%cerror: %cPage: `videos_i_singles` and field: `Custom Controller`","color:blue;font-size:18px","color:red;font-size:18px");
			console.dir(e);
		}
	}
	$scope.rating = {};
	$scope.rating.max = 5;
	
	// animation ink (ionic-material)
	ionicMaterialInk.displayEffect();
	controller_by_user();
})

// TODO: videos_iiiCtrl --|-- 
.controller("videos_iiiCtrl", function($ionicConfig,$scope,$rootScope,$state,$location,$ionicScrollDelegate,$ionicListDelegate,$http,$httpParamSerializer,$stateParams,$timeout,$interval,$ionicLoading,$ionicPopup,$ionicPopover,$ionicActionSheet,$ionicSlideBoxDelegate,$ionicHistory,ionicMaterialInk,ionicMaterialMotion,$window,$ionicModal,base64,md5,$document,$sce,$ionicGesture,$translate,tmhDynamicLocale){
	
	$rootScope.headerExists = true;
	$rootScope.ionWidth = $document[0].body.querySelector(".view-container").offsetWidth || 412;
	$rootScope.grid64 = parseInt($rootScope.ionWidth / 64) ;
	$rootScope.grid80 = parseInt($rootScope.ionWidth / 80) ;
	$rootScope.grid128 = parseInt($rootScope.ionWidth / 128) ;
	$rootScope.grid256 = parseInt($rootScope.ionWidth / 256) ;
	$rootScope.last_edit = "-" ;
	$scope.$on("$ionicView.afterEnter", function (){
		var page_id = $state.current.name ;
		$rootScope.page_id = page_id.replace(".","-") ;
	});
	if($rootScope.headerShrink == true){
		$scope.$on("$ionicView.enter", function(){
			$scope.scrollTop();
		});
	};
	// TODO: videos_iiiCtrl --|-- $scope.scrollTop
	$rootScope.scrollTop = function(){
		$timeout(function(){
			$ionicScrollDelegate.$getByHandle("top").scrollTop();
		},100);
	};
	// TODO: videos_iiiCtrl --|-- $scope.toggleGroup
	$scope.toggleGroup = function(group) {
		if ($scope.isGroupShown(group)) {
			$scope.shownGroup = null;
		} else {
			$scope.shownGroup = group;
		}
	};
	
	$scope.isGroupShown = function(group) {
		return $scope.shownGroup === group;
	};
	
	// TODO: videos_iiiCtrl --|-- $scope.redirect
	// redirect
	$scope.redirect = function($url){
		$window.location.href = $url;
	};
	
	// Set Motion
	$timeout(function(){
		ionicMaterialMotion.slideUp({
			selector: ".slide-up"
		});
	}, 300);
	// TODO: videos_iiiCtrl --|-- $scope.showAuthentication
	$scope.showAuthentication  = function(){
		var authPopup = $ionicPopup.show({
			template: ' This page required login',
			title: "Authorization",
			subTitle: "Authorization is required",
			scope: $scope,
			buttons: [
				{text:"Cancel",onTap: function(e){
					$state.go("atomo_quantico.principal");
				}},
			],
		}).then(function(form){
		},function(err){
		},function(msg){
		});
	};
	
	// set default parameter http
	var http_params = {};
	
	// set HTTP Header 
	var http_header = {
		headers: {
		},
		params: http_params
	};
	var targetQuery = ""; //default param
	var raplaceWithQuery = "";
	//fix url Vídeos III
	targetQuery = "maxResults=50"; //default param
	raplaceWithQuery = "maxResults=50";
	
	
	// TODO: videos_iiiCtrl --|-- $scope.splitArray
	$scope.splitArray = function(items,cols,maxItem) {
		var newItems = [];
		if(maxItem == 0){
			maxItem = items.length;
		}
		if(items){
			for (var i=0; i < maxItem; i+=cols) {
				newItems.push(items.slice(i, i+cols));
			}
		}
		return newItems;
	}
	$scope.gmapOptions = {options: { scrollwheel: false }};
	
	var fetch_per_scroll = 1;
	// animation loading 
	$ionicLoading.show();
	
	
	// TODO: videos_iiiCtrl --|-- $scope.fetchURL
	$scope.fetchURL = "https://www.googleapis.com/youtube/v3/playlistItems?maxResults=50&part=id,snippet&playlistId=PLgyqWKH4bwdSIe9LjvzxffNaCLT8nDQ9R&key=AIzaSyAXlht6H5iRdt7bgxvx4m-W0QkEkk-depk";
	// TODO: videos_iiiCtrl --|-- $scope.fetchURLp
	$scope.fetchURLp = "https://www.googleapis.com/youtube/v3/playlistItems?maxResults=50&part=id,snippet&playlistId=PLgyqWKH4bwdSIe9LjvzxffNaCLT8nDQ9R&key=AIzaSyAXlht6H5iRdt7bgxvx4m-W0QkEkk-depk&callback=JSON_CALLBACK";
	// TODO: videos_iiiCtrl --|-- $scope.hashURL
	$scope.hashURL = md5.createHash( $scope.fetchURL.replace(targetQuery,raplaceWithQuery));
	
	
	$scope.noMoreItemsAvailable = false; //readmore status
	var lastPush = 0;
	var data_videos_iiis = [];
	
	localforage.getItem("data_videos_iiis_" + $scope.hashURL, function(err, get_videos_iiis){
		if(get_videos_iiis === null){
			data_videos_iiis =[];
		}else{
			data_videos_iiis = JSON.parse(get_videos_iiis);
			$scope.data_videos_iiis =JSON.parse( get_videos_iiis);
			$scope.videos_iiis = [];
			for(lastPush = 0; lastPush < 100; lastPush++) {
				if (angular.isObject(data_videos_iiis[lastPush])){
					$scope.videos_iiis.push(data_videos_iiis[lastPush]);
				};
			}
			$timeout(function() {
				$ionicLoading.hide();
				controller_by_user();
			},200);
		}
	}).then(function(value){
	}).catch(function (err){
	})
	if(data_videos_iiis === null ){
		data_videos_iiis =[];
	}
	if(data_videos_iiis.length === 0 ){
		$timeout(function() {
			var url_request = $scope.fetchURL.replace(targetQuery,raplaceWithQuery);
			// overwrite HTTP Header 
			http_header = {
				headers: {
				},
				params: http_params
			};
			// TODO: videos_iiiCtrl --|-- $http.get
			$http.get(url_request,http_header).then(function(response) {
				data_videos_iiis = response.data.items;
				$scope.data_videos_iiis = response.data.items;
				// TODO: videos_iiiCtrl --|---------- set:localforage
				localforage.setItem("data_videos_iiis_" + $scope.hashURL, JSON.stringify(data_videos_iiis));
				$scope.videos_iiis = [];
				for(lastPush = 0; lastPush < 100; lastPush++) {
					if (angular.isObject(data_videos_iiis[lastPush])){
						$scope.videos_iiis.push(data_videos_iiis[lastPush]);
					};
				}
			},function(response) {
			
				$timeout(function() {
					var url_request = $scope.fetchURLp.replace(targetQuery,raplaceWithQuery);
					// overwrite HTTP Header 
					http_header = {
						headers: {
						},
						params: http_params
					};
					// TODO: videos_iiiCtrl --|------ $http.jsonp
					$http.jsonp(url_request,http_header).success(function(data){
						data_videos_iiis = data.items;
						$scope.data_videos_iiis = data.items;
						$ionicLoading.hide();
						// TODO: videos_iiiCtrl --|---------- set:localforage
						localforage.setItem("data_videos_iiis_" + $scope.hashURL,JSON.stringify(data_videos_iiis));
						controller_by_user();
						$scope.videos_iiis = [];
						for(lastPush = 0; lastPush < 100; lastPush++) {
							if (angular.isObject(data_videos_iiis[lastPush])){
								$scope.videos_iiis.push(data_videos_iiis[lastPush]);
							};
						}
					}).error(function(data){
					if(response.status ===401){
						// TODO: videos_iiiCtrl --|------------ error:Unauthorized
						$scope.showAuthentication();
					}else{
						// TODO: videos_iiiCtrl --|------------ error:Message
						var data = { statusText:response.statusText, status:response.status };
						var alertPopup = $ionicPopup.alert({
							title: "Network Error" + " (" + data.status + ")",
							template: "An error occurred while collecting data.",
						});
						$timeout(function() {
							alertPopup.close();
						}, 2000);
					}
					});
				}, 200);
		}).finally(function() {
			$scope.$broadcast("scroll.refreshComplete");
			// event done, hidden animation loading
			$timeout(function() {
				$ionicLoading.hide();
				controller_by_user();
				if(angular.isDefined($scope.data_videos_iiis.data)){
					if($scope.data_videos_iiis.data.status ===401){
						$scope.showAuthentication();
						return false;
					}
				}
			}, 200);
		});
	
		}, 200);
	}
	
	
	// TODO: videos_iiiCtrl --|-- $scope.doRefresh
	$scope.doRefresh = function(){
		var url_request = $scope.fetchURL.replace(targetQuery,raplaceWithQuery);
		// retry retrieving data
		// overwrite http_header 
		http_header = {
			headers: {
			},
			params: http_params
		};
		// TODO: videos_iiiCtrl --|------ $http.get
		$http.get(url_request,http_header).then(function(response) {
			data_videos_iiis = response.data.items;
			$scope.data_videos_iiis = response.data.items;
			// TODO: videos_iiiCtrl --|---------- set:localforage
			localforage.setItem("data_videos_iiis_" + $scope.hashURL,JSON.stringify(data_videos_iiis));
			$scope.videos_iiis = [];
			for(lastPush = 0; lastPush < 100; lastPush++) {
				if (angular.isObject(data_videos_iiis[lastPush])){
					$scope.videos_iiis.push(data_videos_iiis[lastPush]);
				};
			}
		},function(response){
			
		// retrieving data with jsonp
			$timeout(function() {
			var url_request =$scope.fetchURLp.replace(targetQuery,raplaceWithQuery);
				// overwrite http_header 
				http_header = {
					headers: {
					},
					params: http_params
				};
				// TODO: videos_iiiCtrl --|---------- $http.jsonp
				$http.jsonp(url_request,http_header).success(function(data){
					data_videos_iiis = data.items;
					$scope.data_videos_iiis = data.items;
					$ionicLoading.hide();
					controller_by_user();
					// TODO: videos_iiiCtrl --|---------- set:localforage
					localforage.setItem("data_videos_iiis_"+ $scope.hashURL,JSON.stringify(data_videos_iiis));
					$scope.videos_iiis = [];
					for(lastPush = 0; lastPush < 100; lastPush++) {
						if (angular.isObject(data_videos_iiis[lastPush])){
							$scope.videos_iiis.push(data_videos_iiis[lastPush]);
						};
					}
				}).error(function(resp){
					if(response.status ===401){
						// TODO: videos_iiiCtrl --|------------ error:Unauthorized
						$scope.showAuthentication();
					}else{
						// TODO: videos_iiiCtrl --|------------ error:Message
						var data = { statusText:response.statusText, status:response.status };
						var alertPopup = $ionicPopup.alert({
							title: "Network Error" + " (" + data.status + ")",
							template: "An error occurred while collecting data.",
						});
					};
				});
			}, 200);
		}).finally(function() {
			$scope.$broadcast("scroll.refreshComplete");
			// event done, hidden animation loading
			$timeout(function() {
				$ionicLoading.hide();
				controller_by_user();
			}, 500);
		});
	
	};
	if (data_videos_iiis === null){
		data_videos_iiis = [];
	};
	// animation readmore
	var fetchItems = function() {
		for(var z=0;z<fetch_per_scroll;z++){
			if (angular.isObject(data_videos_iiis[lastPush])){
				$scope.videos_iiis.push(data_videos_iiis[lastPush]);
				lastPush++;
			}else{;
				$scope.noMoreItemsAvailable = true;
			}
		}
		$scope.$broadcast("scroll.infiniteScrollComplete");
	};
	
	// event readmore
	$scope.onInfinite = function() {
		$timeout(fetchItems, 500);
	};
	
	// create animation fade slide in right (ionic-material)
	$scope.fireEvent = function(){
		ionicMaterialInk.displayEffect();
	};
	// code 

	// TODO: videos_iiiCtrl --|-- controller_by_user
	// controller by user 
	function controller_by_user(){
		try {
			
$ionicConfig.backButton.text("");			
		} catch(e){
			console.log("%cerror: %cPage: `videos_iii` and field: `Custom Controller`","color:blue;font-size:18px","color:red;font-size:18px");
			console.dir(e);
		}
	}
	$scope.rating = {};
	$scope.rating.max = 5;
	
	// animation ink (ionic-material)
	ionicMaterialInk.displayEffect();
	controller_by_user();
})

// TODO: videos_iii_singlesCtrl --|-- 
.controller("videos_iii_singlesCtrl", function($ionicConfig,$scope,$rootScope,$state,$location,$ionicScrollDelegate,$ionicListDelegate,$http,$httpParamSerializer,$stateParams,$timeout,$interval,$ionicLoading,$ionicPopup,$ionicPopover,$ionicActionSheet,$ionicSlideBoxDelegate,$ionicHistory,ionicMaterialInk,ionicMaterialMotion,$window,$ionicModal,base64,md5,$document,$sce,$ionicGesture,$translate,tmhDynamicLocale){
	
	$rootScope.headerExists = true;
	$rootScope.ionWidth = $document[0].body.querySelector(".view-container").offsetWidth || 412;
	$rootScope.grid64 = parseInt($rootScope.ionWidth / 64) ;
	$rootScope.grid80 = parseInt($rootScope.ionWidth / 80) ;
	$rootScope.grid128 = parseInt($rootScope.ionWidth / 128) ;
	$rootScope.grid256 = parseInt($rootScope.ionWidth / 256) ;
	$rootScope.last_edit = "page-builder" ;
	$scope.$on("$ionicView.afterEnter", function (){
		var page_id = $state.current.name ;
		$rootScope.page_id = page_id.replace(".","-") ;
	});
	if($rootScope.headerShrink == true){
		$scope.$on("$ionicView.enter", function(){
			$scope.scrollTop();
		});
	};
	// TODO: videos_iii_singlesCtrl --|-- $scope.scrollTop
	$rootScope.scrollTop = function(){
		$timeout(function(){
			$ionicScrollDelegate.$getByHandle("top").scrollTop();
		},100);
	};
	// TODO: videos_iii_singlesCtrl --|-- $scope.toggleGroup
	$scope.toggleGroup = function(group) {
		if ($scope.isGroupShown(group)) {
			$scope.shownGroup = null;
		} else {
			$scope.shownGroup = group;
		}
	};
	
	$scope.isGroupShown = function(group) {
		return $scope.shownGroup === group;
	};
	
	// TODO: videos_iii_singlesCtrl --|-- $scope.redirect
	// redirect
	$scope.redirect = function($url){
		$window.location.href = $url;
	};
	
	// Set Motion
	$timeout(function(){
		ionicMaterialMotion.slideUp({
			selector: ".slide-up"
		});
	}, 300);
	// TODO: videos_iii_singlesCtrl --|-- $scope.showAuthentication
	$scope.showAuthentication  = function(){
		var authPopup = $ionicPopup.show({
			template: ' This page required login',
			title: "Authorization",
			subTitle: "Authorization is required",
			scope: $scope,
			buttons: [
				{text:"Cancel",onTap: function(e){
					$state.go("atomo_quantico.principal");
				}},
			],
		}).then(function(form){
		},function(err){
		},function(msg){
		});
	};
	
	// set default parameter http
	var http_params = {};

	// set HTTP Header 
	var http_header = {
		headers: {
		},
		params: http_params
	};
	// animation loading 
	$ionicLoading.show();
	
	// Retrieving data
	var itemID = $stateParams.snippetresourceIdvideoId;
	// TODO: videos_iii_singlesCtrl --|-- $scope.fetchURL
	$scope.fetchURL = "https://www.googleapis.com/youtube/v3/playlistItems?maxResults=50&part=id,snippet&playlistId=PLgyqWKH4bwdSIe9LjvzxffNaCLT8nDQ9R&key=AIzaSyAXlht6H5iRdt7bgxvx4m-W0QkEkk-depk";
	// TODO: videos_iii_singlesCtrl --|-- $scope.fetchURLp
	$scope.fetchURLp = "https://www.googleapis.com/youtube/v3/playlistItems?maxResults=50&part=id,snippet&playlistId=PLgyqWKH4bwdSIe9LjvzxffNaCLT8nDQ9R&key=AIzaSyAXlht6H5iRdt7bgxvx4m-W0QkEkk-depk&callback=JSON_CALLBACK";
	// TODO: videos_iii_singlesCtrl --|-- $scope.hashURL
	$scope.hashURL = md5.createHash($scope.fetchURL);
	
	var current_item = [];
	localforage.getItem("data_videos_iiis_" + $scope.hashURL, function(err, get_datas){
		if(get_datas === null){
			current_item = [];
		}else{
			if(get_datas !== null){
				var datas = JSON.parse(get_datas);
				for (var i = 0; i < datas.length; i++) {
					if((datas[i].snippet.resourceId.videoId ===  parseInt(itemID)) || (datas[i].snippet.resourceId.videoId === itemID.toString())) {
						current_item = datas[i] ;
					}
				}
			}
			// event done, hidden animation loading
			$timeout(function(){
				$ionicLoading.hide();
				$scope.videos_iii = current_item ;
				controller_by_user();
			}, 100);
		};
	}).then(function(value){
	}).catch(function (err){
	})
	if( current_item.length === 0 ){
		var itemID = $stateParams.snippetresourceIdvideoId;
		var current_item = [];
	
		// set HTTP Header 
		http_header = {
			headers: {
			},
			params: http_params
		};
		// TODO: videos_iii_singlesCtrl --|-- $http.get
		$http.get($scope.fetchURL,http_header).then(function(response) {
			// Get data single
			var datas = response.data;
			// TODO: videos_iii_singlesCtrl --|---------- set:localforage
			localforage.setItem("data_videos_iiis_"+ $scope.hashURL,JSON.stringify(datas));
			for (var i = 0; i < datas.length; i++) {
				if((datas[i].snippet.resourceId.videoId ===  parseInt(itemID)) || (datas[i].snippet.resourceId.videoId === itemID.toString())) {
					current_item = datas[i] ;
				}
			}
		},function(data) {
					// Error message
					var alertPopup = $ionicPopup.alert({
						title: "Network Error" + " (" + data.status + ")",
						template: "An error occurred while collecting data.",
					});
					$timeout(function() {
						alertPopup.close();
					}, 2000);
		}).finally(function() {
			$scope.$broadcast("scroll.refreshComplete");
			// event done, hidden animation loading
			$timeout(function() {
				$ionicLoading.hide();
				$scope.videos_iii = current_item ;
				controller_by_user();
			}, 500);
		});
	}
	
	
		// TODO: videos_iii_singlesCtrl --|-- $scope.doRefresh
	$scope.doRefresh = function(){
		// Retrieving data
		var itemID = $stateParams.snippetresourceIdvideoId;
		var current_item = [];
		// overwrite http_header 
		http_header = {
			headers: {
			},
			params: http_params
		};
		// TODO: videos_iii_singlesCtrl --|------ $http.get
		$http.get($scope.fetchURL,http_header).then(function(response) {
			// Get data single
			var datas = response.data.items;
			// TODO: videos_iii_singlesCtrl --|---------- set:localforage
			localforage.setItem("data_videos_iiis_"+ $scope.hashURL,JSON.stringify(datas));
			for (var i = 0; i < datas.length; i++) {
				if((datas[i].snippet.resourceId.videoId ===  parseInt(itemID)) || (datas[i].snippet.resourceId.videoId === itemID.toString())) {
					current_item = datas[i] ;
				}
			}
		},function(data) {
			// Error message
		// TODO: videos_iii_singlesCtrl --|---------- $http.jsonp
				$http.jsonp($scope.fetchURLp,http_header).success(function(response){
					// Get data single
					var datas = response.items;
			// TODO: videos_iii_singlesCtrl --|---------- set:localforage
			localforage.setItem("data_videos_iiis_"+ $scope.hashURL,JSON.stringify(datas));
					for (var i = 0; i < datas.length; i++) {
						if((datas[i].snippetresourceIdvideoId ===  parseInt(itemID)) || (datas[i].snippetresourceIdvideoId === itemID.toString())) {
							current_item = datas[i] ;
						}
					}
						$scope.$broadcast("scroll.refreshComplete");
						// event done, hidden animation loading
						$timeout(function() {
							$ionicLoading.hide();
							$scope.videos_iii = current_item ;
							controller_by_user();
						}, 500);
					}).error(function(resp){
						var alertPopup = $ionicPopup.alert({
							title: "Network Error" + " (" + data.status + ")",
							template: "An error occurred while collecting data.",
						});
					});
		}).finally(function() {
			$scope.$broadcast("scroll.refreshComplete");
			// event done, hidden animation loading
			$timeout(function() {
				$ionicLoading.hide();
				$scope.videos_iii = current_item ;
				controller_by_user();
			}, 500);
		});
	};
	// code 

	// TODO: videos_iii_singlesCtrl --|-- controller_by_user
	// controller by user 
	function controller_by_user(){
		try {
			

    
$ionicConfig.backButton.text("");
$scope.pauseVideo = function() {
    var iframe = document.getElementsByTagName("iframe")[0].contentWindow;
    iframe.postMessage('{"event":"command","func":"' + 'pauseVideo' +   '","args":""}', '*');
}


$scope.playVideo = function() {
    var iframe = document.getElementsByTagName("iframe")[0].contentWindow;
   iframe.postMessage('{"event":"command","func":"' + 'playVideo' +   '","args":""}', '*');
}

$scope.$on("$ionicView.beforeLeave", function(){
	$scope.pauseVideo();
});

$scope.$on("$ionicView.enter", function(){
	$scope.playVideo();
});
			
		} catch(e){
			console.log("%cerror: %cPage: `videos_iii_singles` and field: `Custom Controller`","color:blue;font-size:18px","color:red;font-size:18px");
			console.dir(e);
		}
	}
	$scope.rating = {};
	$scope.rating.max = 5;
	
	// animation ink (ionic-material)
	ionicMaterialInk.displayEffect();
	controller_by_user();
})
