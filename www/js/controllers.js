angular.module("atomo_quantico.controllers", [])

.controller("indexCtrl", function($ionicConfig,$scope,$rootScope,$state,$location,$ionicScrollDelegate,$ionicListDelegate,$http,$httpParamSerializer,$stateParams,$timeout,$interval,$ionicLoading,$ionicPopup,$ionicPopover,$ionicActionSheet,$ionicSlideBoxDelegate,$ionicHistory,ionicMaterialInk,ionicMaterialMotion,$window,$ionicModal,base64,md5,$document,$sce,$ionicGesture,$translate,tmhDynamicLocale){
	
	$rootScope.headerExists = true;

	$rootScope.exitApp = function(){
		var confirmPopup = $ionicPopup.confirm({
			title: "Sair",
			template: "Tem certeza que deseja sair?"
		});
		confirmPopup.then(function (close){
			if(close){
				ionic.Platform.exitApp();
			}
		});
	};
    
    // Simplificando o controlador principal
    $rootScope.appName = "Atomo Quantico";
})

.controller("side_menusCtrl", function($scope, $rootScope, $state, ionicMaterialInk){
    // Keep basic functionality if needed
    ionicMaterialInk.displayEffect();
})

.controller("dashboardCtrl", function($scope, $state, ionicMaterialInk){
    ionicMaterialInk.displayEffect();
})

.controller("principalCtrl", function($scope){
})

.controller("sobreCtrl", function($scope){
})

// Novos Controladores

.controller("horoscopoCtrl", function($scope, $ionicPopup){
    $scope.dataHoje = new Date();
    
    var previsoes = [
        "Hoje é um dia de renovação espiritual. Conecte-se com sua essência.",
        "A energia cósmica favorece a introspecção e o autoconhecimento.",
        "Seja grato pelas pequenas coisas, o universo retribuirá.",
        "Momento ideal para perdoar e seguir em frente.",
        "Sua luz interior brilhará forte hoje, contagiando a todos.",
        "O universo conspira a seu favor. Mantenha o pensamento positivo.",
        "Abra seu coração para novas oportunidades espirituais."
    ];
    
    // Seleciona uma previsão baseada no dia (para ser consistente no mesmo dia)
    var dia = $scope.dataHoje.getDate();
    var index = dia % previsoes.length;
    $scope.horoscopoDoDia = previsoes[index];
    
    $scope.compartilhar = function() {
        $ionicPopup.alert({
            title: 'Compartilhar',
            template: 'Função de compartilhamento em breve!'
        });
    };
})

.controller("mensagensCtrl", function($scope, $ionicPopup){
    var mensagens = [
        {texto: "A fé move montanhas.", autor: "Mateus 17:20"},
        {texto: "Tudo posso naquele que me fortalece.", autor: "Filipenses 4:13"},
        {texto: "A gratidão é a memória do coração.", autor: "Antístenes"},
        {texto: "O senhor é meu pastor e nada me faltará.", autor: "Salmos 23"},
        {texto: "A paz vem de dentro de você. Não a procure à sua volta.", autor: "Buda"},
        {texto: "Deus não escolhe os capacitados, capacita os escolhidos.", autor: "Albert Einstein"},
        {texto: "Amai-vos uns aos outros, como eu vos amei.", autor: "Jesus Cristo"}
    ];
    
    $scope.novaMensagem = function() {
        var rand = Math.floor(Math.random() * mensagens.length);
        $scope.mensagemAtual = mensagens[rand];
    };
    
    // Carrega a primeira mensagem
    $scope.novaMensagem();

    $scope.compartilharMensagem = function() {
        $ionicPopup.alert({
            title: 'Compartilhar',
            template: 'Mensagem copiada para a área de transferência!'
        });
    };
})

.controller("chatCtrl", function($scope, $timeout, $ionicScrollDelegate){
    $scope.mensagensChat = [
        {texto: "Olá! Como podemos ajudar em sua jornada espiritual hoje?", hora: "10:00", eu: false}
    ];

    $scope.input = { mensagem: "" };

    $scope.enviarMensagem = function() {
        if($scope.input.mensagem.trim() === "") return;

        var novaMsg = {
            texto: $scope.input.mensagem,
            hora: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            eu: true
        };

        $scope.mensagensChat.push(novaMsg);
        $scope.input.mensagem = "";
        $ionicScrollDelegate.scrollBottom(true);

        // Simula resposta
        $timeout(function(){
            $scope.mensagensChat.push({
                texto: "Obrigado por sua mensagem. Um de nossos atendentes espirituais responderá em breve. Paz e luz!",
                hora: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                eu: false
            });
            $ionicScrollDelegate.scrollBottom(true);
        }, 2000);
    };
})

.controller("agradecimentosCtrl", function($scope, $ionicPopup){
    $scope.listaAgradecimentos = [
        {texto: "Grato pela saúde da minha família.", data: new Date()},
        {texto: "Grato pelo dia de sol maravilhoso.", data: new Date(new Date().setDate(new Date().getDate()-1))},
        {texto: "Grato pela oportunidade de aprender algo novo.", data: new Date(new Date().setDate(new Date().getDate()-2))}
    ];
    
    $scope.novoAgradecimento = "";

    $scope.adicionarAgradecimento = function() {
        if($scope.novoAgradecimento.trim() === "") return;

        $scope.listaAgradecimentos.unshift({
            texto: $scope.novoAgradecimento,
            data: new Date()
        });

        $scope.novoAgradecimento = "";

        $ionicPopup.alert({
            title: 'Gratidão',
            template: 'Seu agradecimento foi registrado no universo!'
        });
    };
})

.controller("postagensCtrl", function($scope){
    $scope.postagens = [
        {
            autor: "Mestre Espiritual",
            data: "Há 2 horas",
            titulo: "A Importância da Meditação",
            conteudo: "Meditar não é apenas fechar os olhos, é abrir a alma para o universo. Tire 5 minutos do seu dia para respirar fundo.",
            imagem: "https://placehold.co/600x400/e0e0e0/000000?text=Meditacao"
        },
        {
            autor: "Equipe Atomo",
            data: "Ontem",
            titulo: "Evento Beneficente",
            conteudo: "Neste fim de semana teremos nossa distribuição de sopa fraterna. Participe e doe amor.",
            imagem: "https://placehold.co/600x400/e0e0e0/000000?text=Caridade"
        },
        {
            autor: "Guia Astral",
            data: "2 dias atrás",
            titulo: "Alinhamento dos Chakras",
            conteudo: "Manter seus chakras alinhados é fundamental para o fluxo de energia vital (Prana) em seu corpo.",
            imagem: "https://placehold.co/600x400/e0e0e0/000000?text=Chakras"
        }
    ];
});
