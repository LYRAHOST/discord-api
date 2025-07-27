![Banner](https://i.imgur.com/5hdUh8P.png)

# discord-api

Conecte a sua conta do Game Server ao seu BOT no Discord para receber notificações de status, eventos de jogadores e outras informações diretamente nos seus canais.

## Índice

- [Funcionalidades](#funcionalidades)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [Agendamento](#agendamento)
- [Contribuição](#contribuição)
- [Licença](#licença)

## Funcionalidades

- Envia status do servidor (online/offline, número de jogadores) periodicamente.
- Notificações de eventos (jogadores conectando/desconectando, erros, atualizações).
- Payloads personalizáveis via webhook do Discord.

## Pré-requisitos

- Node.js v14+ (ou versão compatível).
- NPM ou Yarn.
- Conta no Discord com permissão para criar Webhooks.

## Instalação

1. Clone o repositório:
   ```bash
   git clone git@github.com:lyrahost/discord-api.git
   cd discord-api
   ```

2. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn install
   ```

## Configuração

Renomeie o arquivo `.env.example` para `.env` e defina as variáveis:

```ini
DISCORD_TOKEN=seu_token_de_bot
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/ID/TOKEN
SERVER_API=https://api-server.lyrahost.com.br/ID/TOKEN/
INTERVAL_MINUTES=5
```

## Uso

Inicie o bot:

```bash
npm start
# ou
node index.js
```

O bot irá:

1. Conectar ao Discord usando `DISCORD_TOKEN`.
2. Buscar o status do servidor em `SERVER_API`.
3. Postar no webhook definido em `DISCORD_WEBHOOK_URL` a cada `INTERVAL_MINUTES`.


## Agendamento

Defina `INTERVAL_MINUTES` no arquivo `.env` para determinar o intervalo (em minutos) entre as verificações do servidor e os envios para o Discord. O valor padrão é 5 minutos.


## Contribuição

1. Fork este repositório.
2. Crie uma branch com sua feature: `git checkout -b feature/nova-funcionalidade`.
3. Faça commit das suas alterações: `git commit -m 'Adiciona nova funcionalidade'`.
4. Envie para o branch: `git push origin feature/nova-funcionalidade`.
5. Abra um Pull Request.

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).
