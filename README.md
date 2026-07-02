# Sistema de Reservas de Hotel

API para cadastro de clientes, quartos, reservas, usuarios e logs.

## Como rodar

```bash
npm install
npm run migrate
npm run db:seed
npm run dev
```

A API roda em:

```text
http://localhost:3000
```

## Usuario inicial

```json
{
  "email": "admin@hotel.com",
  "senha": "Admin@123"
}
```

## Rotas principais

### Usuarios

| Metodo | Rota | Funcao |
| --- | --- | --- |
| GET | `/usuarios` | Lista usuarios |
| POST | `/usuarios` | Cria usuario |
| GET | `/usuarios/ativar/:codigo` | Ativa usuario |

### Login e senha

| Metodo | Rota | Funcao |
| --- | --- | --- |
| POST | `/auth/login` | Login com token |
| POST | `/auth/recuperar-senha` | Envia codigo de recuperacao |
| POST | `/auth/alterar-senha-recuperacao` | Altera senha com codigo |
| POST | `/auth/alterar-senha` | Altera senha do usuario logado |

### Logs

| Metodo | Rota | Funcao |
| --- | --- | --- |
| GET | `/logs` | Lista logs com nome do usuario |
| GET | `/logs/usuario/:usuarioId` | Lista logs por usuario |

## Seguranca

Recursos implementados:

- senha salva com hash
- e-mail unico para usuario
- senha forte com minimo 8 caracteres, letra maiuscula, letra minuscula, numero e simbolo
- login com token
- middleware de autenticacao
- controle de nivel de acesso
- usuario criado como `INATIVO`
- ativacao de conta por link enviado por e-mail
- bloqueio por 3 tentativas invalidas
- registro de ultimo login
- recuperacao de senha por e-mail
- alteracao de senha do usuario logado
- logs de login, login invalido, cadastro, ativacao, recuperacao, troca de senha e acao suspeita

Rotas protegidas por token:

- `GET /logs`
- `GET /logs/usuario/:usuarioId`
- `GET /usuarios`
- `POST /reservas`
- `DELETE /reservas/:id`

Para usar rotas protegidas, envie:

```text
Authorization: Bearer token_do_login
```
