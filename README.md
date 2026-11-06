# Notificações com React Native e Expo

Aplicativo de uma tela que exibe uma notificação local ao tocar em **Enviar notificação**. O objetivo é demonstrar como solicitar permissão e apresentar uma notificação no celular com a biblioteca `expo-notifications`.

A notificação é gerada pelo próprio aplicativo. Este exemplo não utiliza servidor, banco de dados ou envio de notificações para outros aparelhos.

## Pré-requisitos

- [Node.js](https://nodejs.org/) 24 LTS (versão usada no teste: `24.22.0`).
- [Bun](https://bun.sh/) instalado, pois o projeto utiliza `bun.lock` para registrar as versões das dependências.
- Aplicativo **Expo Go** instalado no celular e compatível com o SDK 58.
- Computador e celular conectados à mesma rede Wi-Fi.
- Internet para instalar as dependências e o Expo Go.

Confira se as ferramentas estão disponíveis no terminal:

```bash
node --version
bun --version
```

As principais dependências declaradas no projeto são Expo `~58.0.23`, React Native `0.88.1`, React `19.3.0` e `expo-notifications` `~58.1.8`. Elas precisam permanecer compatíveis entre si: não atualize somente o Expo para outro SDK.

## Como executar no celular

### 1. Abra a pasta do projeto

Baixe e extraia o projeto, ou clone o repositório fornecido pelo grupo. Abra um terminal dentro da pasta `atividade-notificacao`, onde está o arquivo `package.json`.

Se o terminal estiver na pasta que contém o projeto, execute:

```bash
cd atividade-notificacao
```

### 2. Instale as dependências

```bash
bun install --frozen-lockfile
```

Esse comando instala as dependências seguindo as versões registradas no `bun.lock`. A biblioteca de notificações já faz parte do projeto; não é preciso instalá-la separadamente.

### 3. Inicie o projeto

```bash
bun run start
```

Mantenha o terminal aberto durante o teste. Ele exibirá um QR code.

### 4. Abra no Expo Go

- **Android:** abra o Expo Go e use a opção de ler o QR code.
- **iPhone:** leia o QR code com a câmera e abra o link no Expo Go. No dispositivo físico, entre na mesma conta Expo no aplicativo e no terminal. Para entrar pelo terminal, use `bunx expo login`.

Aguarde o carregamento. A tela deve mostrar o título **Notificações** e o botão **Enviar notificação**.

### 5. Teste a notificação

1. Com o aplicativo aberto, toque em **Enviar notificação**.
2. Caso o sistema solicite autorização, permita o envio de notificações.
3. Confira a notificação no celular. Ela deve conter:
   - **Título:** Olá!
   - **Mensagem:** Esta é uma notificação de teste.
4. Toque no botão novamente para repetir o teste. A autorização normalmente não é solicitada a cada toque.

A notificação é solicitada para exibição imediata. A apresentação do banner e o som dependem também das configurações do sistema. Se o banner não aparecer, confira a central de notificações.

Para encerrar o servidor, pressione `Ctrl+C` no terminal.

## Como a implementação funciona

O código completo está em [App.js](./App.js). Os passos abaixo explicam como o recurso foi implementado nesse arquivo.

### 1. Instalar e importar a biblioteca

Em um projeto Expo compatível que ainda não tenha a biblioteca, a instalação é feita com:

```bash
bunx expo install expo-notifications
```

Neste projeto ela já está instalada como dependência. Em `App.js`, o acesso às funções é feito por:

```js
import * as Notifications from 'expo-notifications';
```

### 2. Definir a apresentação com o aplicativo aberto

Antes da função `App`, o código registra o tratamento das notificações recebidas em primeiro plano:

```js
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
```

Essa configuração solicita a exibição do banner, a inclusão na lista de notificações e a reprodução de som, sem alterar o contador do ícone.

### 3. Solicitar permissão

Dentro da função `enviarNotificacao`, o aplicativo solicita autorização:

```js
const permissao = await Notifications.requestPermissionsAsync();

if (!permissao.granted) {
  Alert.alert('Permissão negada');
  return;
}
```

Se a permissão não for concedida, o aplicativo mostra um aviso e interrompe o envio. Para manter o exemplo simples, usamos o canal padrão criado automaticamente pela biblioteca no Android, chamado **Miscellaneous**, sem configurar um canal personalizado.

### 4. Solicitar a notificação imediata

Com a permissão concedida, a função define o conteúdo e solicita a notificação:

```js
await Notifications.scheduleNotificationAsync({
  content: {
    title: 'Olá!',
    body: 'Esta é uma notificação de teste.',
    sound: 'default',
  },
  trigger: null,
});
```

O valor `trigger: null` indica que a notificação deve ser disparada imediatamente. Para personalizar o texto, altere `title` e `body` em `App.js`.

### 5. Ligar a função ao botão

Na tela, o botão chama a função ao ser pressionado:

```jsx
<Button title="Enviar notificação" onPress={enviarNotificacao} />
```

No arquivo completo, as operações assíncronas estão dentro de um `try/catch`. Se ocorrer uma falha, um alerta exibe **Erro ao enviar** e a mensagem do erro.

## Estrutura do projeto

```text
atividade-notificacao/
├── assets/         # Ícones e imagens
├── App.js          # Tela e lógica da notificação
├── app.json        # Configurações do Expo
├── index.js        # Registro do componente principal
├── package.json    # Dependências e comandos
├── bun.lock        # Versões das dependências
├── eslint.config.js # Configuração da verificação de código
└── README.md       # Tutorial e instruções de execução
```

## Problemas comuns

| Problema | O que fazer |
| --- | --- |
| `bun` não é reconhecido | Instale o Bun e abra um novo terminal. |
| O celular não conecta ao projeto | Verifique se os dois aparelhos estão na mesma rede e se o firewall permite a conexão do servidor. |
| A rede da instituição bloqueia a conexão | Encerre o servidor e execute `bunx expo start --tunnel`. Aceite a instalação do recurso de túnel se solicitada e leia o novo QR code. Esse modo exige internet nos dois aparelhos. |
| O Expo Go informa incompatibilidade de SDK | Confira se a versão instalada suporta o SDK 58. Consulte as opções oficiais em [expo.dev/go](https://expo.dev/go); no iPhone físico, a App Store disponibiliza apenas a versão atual do Expo Go. |
| Aparece um aviso sobre push notifications ou development build | A biblioteca avisa que notificações remotas não estão disponíveis no Expo Go para Android. Esse aviso não impede as notificações locais deste exemplo e não exige criar um development build para esta atividade. |
| Aparece “Permissão negada” | Nas configurações do celular, procure o Expo Go e habilite suas notificações. Depois volte ao projeto e tente novamente. |
| Não aparece banner ou não há som | Confira a central de notificações, as permissões do Expo Go e os modos silencioso, Foco ou Não Perturbe. No Android, verifique também os canais de notificação. |
| As alterações não aparecem | Salve o arquivo. Se necessário, encerre o servidor e execute `bunx expo start --clear`. |

## Escopo e validação

Este tutorial utiliza **notificações locais**, disponíveis no Expo Go. O teste deve ser feito no aplicativo móvel; abrir a versão web não valida esse recurso. Notificações remotas (push) exigem outra configuração e não fazem parte deste exemplo.

Teste realizado em **06/11/2026** em um **Samsung Galaxy A54 (SM-A546E), Android 16, Expo Go 58.0.5**, com Bun `1.4.4` e Node.js `24.22.0` no computador. O projeto foi aberto por USB com encaminhamento da porta do servidor. A solicitação de permissão apareceu e, após permitir, o toque no botão gerou a notificação com o título e a mensagem esperados. Um segundo envio também foi confirmado. O teste no iPhone e a conexão por Wi-Fi não foram realizados nesta validação.

Para conferir a compatibilidade das dependências e verificar o código no computador:

```bash
bunx expo install --check
bun run lint
```

### Teste por USB no Android (opcional)

Se a conexão por Wi-Fi estiver bloqueada e você já tiver o [ADB](https://developer.android.com/tools/adb) instalado, ative a depuração USB no celular, conecte o cabo e autorize o computador na tela do aparelho.

No terminal, dentro da pasta do projeto:

```bash
adb devices
adb reverse tcp:8081 tcp:8081
bunx expo start --localhost --port 8081
```

O aparelho precisa aparecer com o estado `device` na lista do primeiro comando. Com o servidor aberto, use **outro terminal** para iniciar o projeto no Expo Go:

```bash
adb shell am start -a android.intent.action.VIEW -d exp://127.0.0.1:8081 -p host.exp.exponent
```

Mantenha o cabo conectado durante o teste por USB. Esse procedimento é uma alternativa de conexão; não é necessário para o fluxo por Wi-Fi.

## Referências

- [Expo Notifications — documentação do SDK 58](https://docs.expo.dev/versions/v58.0.0/sdk/notifications/)
- [Expo — executar o projeto no dispositivo](https://docs.expo.dev/get-started/start-developing/)
- [Expo Go — versões e instalação](https://expo.dev/go)
- [Bun — instalação](https://bun.sh/docs/installation)
