# Átomo Quântico - Seu Santuário Pessoal de Gratidão

O Átomo Quântico é uma aplicação web de código aberto, construída para ser um espaço seguro e acolhedor onde os usuários podem cultivar o hábito da gratidão. Através de um diário pessoal, é possível registrar pensamentos e momentos pelos quais se é grato, com a opção de compartilhar essas reflexões com a comunidade.

## Funcionalidades Implementadas

*   **✍️ Diário de Gratidão Pessoal:** Escreva e guarde suas anotações de gratidão em um espaço privado e seguro.
*   **🌐 Feed Público Opcional:** Escolha tornar suas anotações públicas e compartilhá-las com a comunidade no feed principal. Por padrão, a opção de compartilhar já vem marcada para encorajar a interação.
*   **❤️ Interação da Comunidade:** Curta e comente as reflexões de gratidão compartilhadas por outros usuários.
*   **🔐 Autenticação Segura:** Login rápido e seguro utilizando a autenticação do Google.
*   **🏠 Feed Principal:** A página inicial apresenta as 10 postagens públicas mais recentes para todos os visitantes.
*   **📖 Feed Completo:** Uma página dedicada (`/public-feed`) exibe todas as postagens públicas já compartilhadas.

## Tecnologias Utilizadas

*   **Frontend:**
    *   **React:** Biblioteca para construção da interface de usuário.
    *   **TypeScript:** Superset de JavaScript que adiciona tipagem estática.
    *   **Vite:** Ferramenta de build para um desenvolvimento frontend mais rápido.
    *   **Tailwind CSS:** Framework de CSS utility-first para estilização.
*   **Backend & Infraestrutura:**
    *   **Firebase:** Plataforma do Google utilizada para:
        *   **Firestore:** Banco de dados NoSQL para armazenar as anotações, curtidas e comentários.
        *   **Authentication:** Gerenciamento de autenticação de usuários.
        *   **Hosting:** Hospedagem e deploy da aplicação.

## Como Executar o Projeto Localmente

1.  **Clone o repositório:**
    ```bash
    git clone <URL_DO_REPOSITORIO>
    ```
2.  **Instale as dependências:**
    ```bash
    npm install
    ```
3.  **Configure o Firebase:**
    *   Crie um projeto no [console do Firebase](https://console.firebase.google.com/).
    *   Crie um arquivo `.env.local` na raiz do projeto com as credenciais do seu projeto Firebase. Você pode encontrá-las nas configurações do seu projeto no console do Firebase.
    ```
    VITE_FIREBASE_API_KEY=sua_api_key
    VITE_FIREBASE_AUTH_DOMAIN=seu_auth_domain
    VITE_FIREBASE_PROJECT_ID=seu_project_id
    VITE_FIREBASE_STORAGE_BUCKET=seu_storage_bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id
    VITE_FIREBASE_APP_ID=seu_app_id
    ```
4.  **Execute o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

## Deploy

O deploy da aplicação é feito através do Firebase Hosting. Para publicar as alterações, utilize o seguinte comando:

```bash
firebase deploy
```

Para publicar apenas as regras e índices do Firestore:

```bash
firebase deploy --only firestore
```
