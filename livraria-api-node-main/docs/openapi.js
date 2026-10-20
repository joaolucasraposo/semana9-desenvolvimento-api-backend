const openapiSpecification = {
  openapi: '3.0.3',
  info: {
    title: 'Livraria Comunitária API - Gestão de Livros, Autores e Avaliações',
    version: '1.0.0',
    description:
      'API RESTful para gerenciamento de catálogo de livros, autores e comentários de leitores. ' +
      'Conta com autenticação stateless baseada em tokens JWT (JSON Web Token), senhas criptografadas com BCrypt ' +
      'e controle de acesso baseado em papéis (RBAC - Role-Based Access Control) para perfis **USER** e **ADMIN**.\n\n' +
      '### Credenciais Padrão para Teste Rápido:\n' +
      '- **Administrador (`ADMIN`)**: `admin@livraria.com` | Senha: `123456`\n' +
      '- **Leitor Comum (`USER`)**: `leitor@gmail.com` | Senha: `123456`\n\n' +
      '### Como autenticar e testar rotas protegidas no Swagger UI:\n' +
      '1. Utilize uma das credenciais padrão acima ou crie uma nova conta em `POST /api/v1/auth/register`.\n' +
      '2. Realize o login na rota `POST /api/v1/auth/login` para obter o token JWT.\n' +
      '3. Copie o valor da propriedade `token` retornado no corpo da resposta.\n' +
      '4. Clique no botão **Authorize** (cadeado no topo direito desta página), cole o token JWT no campo **Value** e confirme.\n' +
      '5. Agora o cabeçalho `Authorization: Bearer <token>` será enviado automaticamente em todas as requisições autenticadas.',
    contact: {
      name: 'Equipe de Engenharia Backend - Livraria Comunitária',
      email: 'contato@livraria.com'
    },
    license: {
      name: 'ISC'
    }
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor de Desenvolvimento Local'
    }
  ],
  tags: [
    {
      name: 'Autenticação',
      description: 'Registro de novos usuários e emissão de tokens JWT (Acesso Público)'
    },
    {
      name: 'Livros',
      description: 'Consulta pública do catálogo, cadastro administrativo de obras e envio de comentários por usuários autenticados'
    },
    {
      name: 'Autores',
      description: 'Listagem e cadastro administrativo de autores da livraria'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description:
          'Insira apenas o token JWT obtido no endpoint `/api/v1/auth/login`. O prefixo `Bearer ` será adicionado automaticamente no cabeçalho `Authorization`.'
      }
    },
    schemas: {
      RegistroUsuarioInput: {
        type: 'object',
        required: ['nome', 'email', 'senha'],
        properties: {
          nome: {
            type: 'string',
            description: 'Nome completo do usuário.',
            example: 'Clarice Lispector'
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'Endereço de e-mail único para autenticação.',
            example: 'clarice@livraria.com'
          },
          senha: {
            type: 'string',
            format: 'password',
            description: 'Senha em texto plano (será armazenada com hash seguro BCrypt).',
            example: 'SenhaSegura@123'
          },
          role: {
            type: 'string',
            enum: ['USER', 'ADMIN'],
            default: 'USER',
            description: 'Perfil de acesso do usuário no controle RBAC (opcional, padrão: USER).',
            example: 'ADMIN'
          }
        }
      },
      UsuarioRegistradoResponse: {
        type: 'object',
        required: ['id', 'nome', 'email', 'role'],
        properties: {
          id: {
            type: 'integer',
            description: 'Identificador único gerado para o usuário.',
            example: 1710000000001
          },
          nome: {
            type: 'string',
            description: 'Nome completo do usuário.',
            example: 'Clarice Lispector'
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'E-mail cadastrado do usuário.',
            example: 'clarice@livraria.com'
          },
          role: {
            type: 'string',
            enum: ['USER', 'ADMIN'],
            description: 'Perfil de permissão atribuído ao usuário.',
            example: 'ADMIN'
          }
        }
      },
      LoginInput: {
        type: 'object',
        required: ['email', 'senha'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            description: 'E-mail cadastrado do usuário.',
            example: 'admin@livraria.com'
          },
          senha: {
            type: 'string',
            format: 'password',
            description: 'Senha do usuário.',
            example: '123456'
          }
        }
      },
      LoginResponse: {
        type: 'object',
        required: ['usuario', 'token'],
        properties: {
          usuario: {
            type: 'object',
            required: ['id', 'nome', 'role'],
            properties: {
              id: {
                type: 'integer',
                description: 'Identificador único do usuário autenticado.',
                example: 1710000000001
              },
              nome: {
                type: 'string',
                description: 'Nome do usuário autenticado.',
                example: 'Clarice Lispector'
              },
              role: {
                type: 'string',
                enum: ['USER', 'ADMIN'],
                description: 'Perfil de acesso (RBAC) contido nas claims do token.',
                example: 'ADMIN'
              }
            }
          },
          token: {
            type: 'string',
            description: 'Token JWT assinado digitalmente com validade de 8 horas para uso no header Authorization: Bearer <token>.',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibm9tZSI6IkFkbWluIiwiZW1haWwiOiJhZG1pbkBsaXZyYXJpYS5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3MTAwMDAwMDAsImV4cCI6MTcxMDAyODgwMH0.assinatura_exemplo'
          }
        }
      },
      Comentario: {
        type: 'object',
        required: ['id', 'autor_nome', 'texto'],
        properties: {
          id: {
            type: 'integer',
            description: 'Identificador único do comentário.',
            example: 1
          },
          autor_nome: {
            type: 'string',
            description: 'Nome do usuário autenticado que realizou o comentário (extraído do token JWT).',
            example: 'Leitor'
          },
          texto: {
            type: 'string',
            description: 'Conteúdo textual da avaliação/comentário sobre o livro.',
            example: 'Clássico indispensável.'
          }
        }
      },
      ComentarioInput: {
        type: 'object',
        required: ['texto'],
        properties: {
          texto: {
            type: 'string',
            description: 'Texto da avaliação ou comentário sobre a obra (não pode ser vazio).',
            example: 'Uma obra-prima da literatura brasileira com narrativa envolvente!'
          }
        }
      },
      Livro: {
        type: 'object',
        required: ['id', 'titulo', 'ano', 'autor_id', 'autor_nome', 'comentarios'],
        properties: {
          id: {
            type: 'integer',
            description: 'Identificador único do livro.',
            example: 1
          },
          titulo: {
            type: 'string',
            description: 'Título da obra literária.',
            example: 'Dom Casmurro'
          },
          ano: {
            type: 'integer',
            description: 'Ano de publicação do livro.',
            example: 1899
          },
          autor_id: {
            type: 'integer',
            description: 'ID de referência do autor cadastrado no sistema.',
            example: 1
          },
          autor_nome: {
            type: 'string',
            description: 'Nome resolvido do autor associado ao livro.',
            example: 'Machado de Assis'
          },
          comentarios: {
            type: 'array',
            description: 'Lista de comentários e avaliações realizados pelos leitores.',
            items: {
              $ref: '#/components/schemas/Comentario'
            }
          }
        }
      },
      LivroCriadoResponse: {
        type: 'object',
        required: ['id', 'titulo', 'ano', 'autor_id', 'comentarios'],
        properties: {
          id: {
            type: 'integer',
            description: 'Identificador único gerado para o livro.',
            example: 1710000005000
          },
          titulo: {
            type: 'string',
            description: 'Título do livro cadastrado.',
            example: 'Memórias Póstumas de Brás Cubas'
          },
          ano: {
            type: 'integer',
            description: 'Ano de publicação do livro.',
            example: 1881
          },
          autor_id: {
            type: 'integer',
            description: 'ID do autor vinculado à obra.',
            example: 1
          },
          comentarios: {
            type: 'array',
            description: 'Lista inicial de comentários do livro recém-criado (vazia por padrão).',
            items: {
              $ref: '#/components/schemas/Comentario'
            },
            example: []
          }
        }
      },
      LivroInput: {
        type: 'object',
        required: ['titulo', 'autor_id'],
        properties: {
          titulo: {
            type: 'string',
            description: 'Título completo do livro.',
            example: 'Memórias Póstumas de Brás Cubas'
          },
          ano: {
            type: 'integer',
            description: 'Ano de lançamento da obra (opcional; caso omitido, assume o ano atual).',
            example: 1881
          },
          autor_id: {
            type: 'integer',
            description: 'Identificador numérico de um autor previamente cadastrado.',
            example: 1
          }
        }
      },
      Autor: {
        type: 'object',
        required: ['id', 'nome', 'nacionalidade'],
        properties: {
          id: {
            type: 'integer',
            description: 'Identificador único do autor.',
            example: 1
          },
          nome: {
            type: 'string',
            description: 'Nome completo ou literário do autor.',
            example: 'Machado de Assis'
          },
          nacionalidade: {
            type: 'string',
            description: 'Nacionalidade de origem do autor.',
            example: 'Brasileiro'
          }
        }
      },
      AutorInput: {
        type: 'object',
        required: ['nome'],
        properties: {
          nome: {
            type: 'string',
            description: 'Nome completo do autor (obrigatório e não vazio).',
            example: 'Jorge Amado'
          },
          nacionalidade: {
            type: 'string',
            description: 'Nacionalidade do autor (opcional; caso omitida, assume "Não informada").',
            example: 'Brasileiro'
          }
        }
      },
      ErroResponse: {
        type: 'object',
        required: ['erro'],
        properties: {
          erro: {
            type: 'string',
            description: 'Mensagem descritiva detalhando o motivo da falha na requisição.',
            example: 'Descrição detalhada do erro ocorrido.'
          }
        }
      }
    }
  },
  paths: {
    '/api/v1/livros': {
      get: {
        tags: ['Livros'],
        summary: 'Listar todos os livros do catálogo',
        description:
          '**Perfil de Acesso:** Público (Não requer autenticação).\n\n' +
          'Retorna a listagem completa de livros disponíveis na livraria, enriquecida com o nome do autor (`autor_nome`) e a lista de comentários (`comentarios`) de cada obra.',
        responses: {
          200: {
            description: 'Lista de livros retornada com sucesso.',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Livro'
                  }
                },
                example: [
                  {
                    id: 1,
                    titulo: 'Dom Casmurro',
                    ano: 1899,
                    autor_id: 1,
                    comentarios: [
                      {
                        id: 1,
                        autor_nome: 'Leitor',
                        texto: 'Clássico indispensável.'
                      }
                    ],
                    autor_nome: 'Machado de Assis'
                  }
                ]
              }
            }
          },
          500: {
            description: 'Erro interno no servidor ao processar a listagem do catálogo.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErroResponse'
                },
                example: {
                  erro: 'Ocorreu um erro interno no servidor.'
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Livros'],
        summary: 'Cadastrar um novo livro no catálogo',
        description:
          '**Perfil de Acesso:** Exclusivo `ADMIN` (Requer token JWT válido no header `Authorization: Bearer <token>` com claim `role: "ADMIN"`).\n\n' +
          'Cria um novo livro no acervo associando-o a um autor existente através do campo `autor_id`. ' +
          'Usuários com perfil `USER` receberão status `403 Forbidden`.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          description: 'Dados para criação do novo livro.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/LivroInput'
              },
              examples: {
                livroClassico: {
                  summary: 'Exemplo de cadastro de obra clássica',
                  value: {
                    titulo: 'Memórias Póstumas de Brás Cubas',
                    ano: 1881,
                    autor_id: 1
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Livro cadastrado com sucesso.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/LivroCriadoResponse'
                },
                example: {
                  id: 1710000005000,
                  titulo: 'Memórias Póstumas de Brás Cubas',
                  ano: 1881,
                  autor_id: 1,
                  comentarios: []
                }
              }
            }
          },
          400: {
            description: 'Falha de validação: campos obrigatórios (`titulo` ou `autor_id`) ausentes ou inválidos.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErroResponse'
                },
                example: {
                  erro: 'O título e o autor_id são obrigatórios.'
                }
              }
            }
          },
          401: {
            description: 'Não autenticado: Token JWT ausente, malformado, inválido ou expirado.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErroResponse'
                },
                examples: {
                  tokenAusente: {
                    summary: 'Token não enviado no header Authorization',
                    value: {
                      erro: 'Token de autenticação não fornecido.'
                    }
                  },
                  tokenInvalido: {
                    summary: 'Token expirado ou assinatura inválida',
                    value: {
                      erro: 'Token inválido ou expirado.'
                    }
                  }
                }
              }
            }
          },
          403: {
            description: 'Acesso proibido: O usuário está autenticado, mas possui perfil `USER` e não tem privilégio de `ADMIN`.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErroResponse'
                },
                example: {
                  erro: 'Acesso proibido: privilégio de ADMIN exigido.'
                }
              }
            }
          },
          404: {
            description: 'Autor informado no campo `autor_id` não foi encontrado no banco de dados.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErroResponse'
                },
                example: {
                  erro: 'O autor informado não existe.'
                }
              }
            }
          },
          422: {
            description: 'Entidade improcessável: Os dados enviados no corpo da requisição violam regras de validação.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErroResponse'
                },
                example: {
                  erro: 'O título e o autor_id são obrigatórios.'
                }
              }
            }
          }
        }
      }
    },
    '/api/v1/livros/{id}': {
      get: {
        tags: ['Livros'],
        summary: 'Buscar detalhes de um livro específico por ID',
        description:
          '**Perfil de Acesso:** Público (Não requer autenticação).\n\n' +
          'Recupera os dados detalhados de um único livro pelo seu identificador numérico `id`, incluindo o nome do autor e todos os seus comentários.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID numérico do livro que se deseja consultar.',
            schema: {
              type: 'integer',
              example: 1
            }
          }
        ],
        responses: {
          200: {
            description: 'Livro encontrado e retornado com sucesso.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Livro'
                },
                example: {
                  id: 1,
                  titulo: 'Dom Casmurro',
                  ano: 1899,
                  autor_id: 1,
                  comentarios: [
                    {
                      id: 1,
                      autor_nome: 'Leitor',
                      texto: 'Clássico indispensável.'
                    }
                  ],
                  autor_nome: 'Machado de Assis'
                }
              }
            }
          },
          404: {
            description: 'Livro não encontrado para o ID informado.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErroResponse'
                },
                example: {
                  erro: 'Livro não localizado.'
                }
              }
            }
          }
        }
      }
    },
    '/api/v1/livros/{id}/comentarios': {
      post: {
        tags: ['Livros'],
        summary: 'Adicionar um comentário/avaliação a um livro',
        description:
          '**Perfil de Acesso:** Autenticado (`USER` ou `ADMIN`).\n\n' +
          'Permite que qualquer usuário autenticado com um token JWT válido registre uma avaliação textual em um livro existente. ' +
          'O nome do autor do comentário (`autor_nome`) é extraído automaticamente das claims do token JWT do usuário logado.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID numérico do livro que receberá o comentário.',
            schema: {
              type: 'integer',
              example: 1
            }
          }
        ],
        requestBody: {
          required: true,
          description: 'Objeto contendo o texto do comentário.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ComentarioInput'
              },
              example: {
                texto: 'Excelente edição! A construção psicológica de Bentinho e Capitu é genial.'
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Comentário registrado e vinculado ao livro com sucesso.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Comentario'
                },
                example: {
                  id: 1710000009000,
                  autor_nome: 'Clarice Lispector',
                  texto: 'Excelente edição! A construção psicológica de Bentinho e Capitu é genial.'
                }
              }
            }
          },
          400: {
            description: 'Falha de validação: O campo `texto` está ausente ou vazio.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErroResponse'
                },
                example: {
                  erro: 'O texto do comentário não pode estar vazio.'
                }
              }
            }
          },
          401: {
            description: 'Não autenticado: Token JWT ausente, inválido ou expirado.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErroResponse'
                },
                examples: {
                  tokenAusente: {
                    summary: 'Token não fornecido',
                    value: {
                      erro: 'Token de autenticação não fornecido.'
                    }
                  },
                  tokenInvalido: {
                    summary: 'Token inválido ou expirado',
                    value: {
                      erro: 'Token inválido ou expirado.'
                    }
                  }
                }
              }
            }
          },
          404: {
            description: 'O livro especificado pelo parâmetro `{id}` não foi encontrado.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErroResponse'
                },
                example: {
                  erro: 'Livro não localizado.'
                }
              }
            }
          },
          422: {
            description: 'Entidade improcessável: O payload enviado não atende aos critérios de validação.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErroResponse'
                },
                example: {
                  erro: 'O texto do comentário não pode estar vazio.'
                }
              }
            }
          }
        }
      }
    },
    '/api/v1/auth/register': {
      post: {
        tags: ['Autenticação'],
        summary: 'Registrar um novo usuário no sistema',
        description:
          '**Perfil de Acesso:** Público (Não requer autenticação).\n\n' +
          'Realiza o cadastro de um novo usuário aplicando hash criptográfico **BCrypt** (Salt rounds = 10) sobre a senha antes de persistir. ' +
          'Caso o campo `role` não seja informado, o usuário receberá automaticamente o perfil padrão `USER`. ' +
          'Não retorna o `senha_hash` no payload de resposta por segurança.',
        requestBody: {
          required: true,
          description: 'Dados cadastrais do novo usuário.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/RegistroUsuarioInput'
              },
              examples: {
                registroAdmin: {
                  summary: 'Cadastro de usuário Administrador (ADMIN)',
                  value: {
                    nome: 'Clarice Lispector',
                    email: 'clarice@livraria.com',
                    senha: 'SenhaSegura@123',
                    role: 'ADMIN'
                  }
                },
                registroLeitor: {
                  summary: 'Cadastro de usuário Leitor Comum (USER)',
                  value: {
                    nome: 'Carlos Drummond',
                    email: 'drummond@livraria.com',
                    senha: 'Leitor@123',
                    role: 'USER'
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Usuário registrado com sucesso.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UsuarioRegistradoResponse'
                },
                example: {
                  id: 1710000000001,
                  nome: 'Clarice Lispector',
                  email: 'clarice@livraria.com',
                  role: 'ADMIN'
                }
              }
            }
          },
          400: {
            description: 'Dados obrigatórios (`nome`, `email` ou `senha`) não fornecidos.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErroResponse'
                },
                example: {
                  erro: 'Campos obrigatórios ausentes: nome, email ou senha.'
                }
              }
            }
          },
          409: {
            description: 'Conflito: O endereço de e-mail informado já está cadastrado no sistema.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErroResponse'
                },
                example: {
                  erro: 'E-mail já cadastrado no sistema.'
                }
              }
            }
          },
          422: {
            description: 'Entidade improcessável: Falha na validação dos campos de cadastro.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErroResponse'
                },
                example: {
                  erro: 'Campos obrigatórios ausentes: nome, email ou senha.'
                }
              }
            }
          }
        }
      }
    },
    '/api/v1/auth/login': {
      post: {
        tags: ['Autenticação'],
        summary: 'Autenticar usuário e emitir token JWT',
        description:
          '**Perfil de Acesso:** Público (Não requer autenticação).\n\n' +
          'Valida as credenciais (`email` e `senha`) comparando a senha enviada com o hash BCrypt armazenado. ' +
          'Em caso de sucesso, retorna os dados básicos do usuário e um token **JWT (Bearer)** assinado com tempo de expiração de 8 horas.',
        requestBody: {
          required: true,
          description: 'Credenciais de acesso do usuário.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/LoginInput'
              },
              examples: {
                loginAdmin: {
                  summary: 'Login como Administrador (ADMIN)',
                  value: {
                    email: 'admin@livraria.com',
                    senha: '123456'
                  }
                },
                loginLeitor: {
                  summary: 'Login como Leitor Comum (USER)',
                  value: {
                    email: 'leitor@gmail.com',
                    senha: '123456'
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Autenticação bem-sucedida. Retorna o perfil do usuário e o token JWT.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/LoginResponse'
                },
                example: {
                  usuario: {
                    id: 1710000000001,
                    nome: 'Clarice Lispector',
                    role: 'ADMIN'
                  },
                  token:
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcxMDAwMDAwMDAwMSwibm9tZSI6IkNsYXJpY2UgTGlzcGVjdG9yIiwiZW1haWwiOiJjbGFyaWNlQGxpdnJhcmlhLmNvbSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTcxMDAwMDAwMCwiZXhwIjoxNzEwMDI4ODAwfQ.exemplo'
                }
              }
            }
          },
          400: {
            description: 'Requisição inválida: E-mail ou senha não foram informados no corpo da requisição.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErroResponse'
                },
                example: {
                  erro: 'E-mail e senha são obrigatórios.'
                }
              }
            }
          },
          401: {
            description: 'Não autorizado: E-mail inexistente ou senha incorreta.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErroResponse'
                },
                example: {
                  erro: 'Credenciais inválidas.'
                }
              }
            }
          },
          422: {
            description: 'Entidade improcessável: Os campos obrigatórios de login não puderam ser validados.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErroResponse'
                },
                example: {
                  erro: 'E-mail e senha são obrigatórios.'
                }
              }
            }
          }
        }
      }
    },
    '/api/v1/autores': {
      get: {
        tags: ['Autores'],
        summary: 'Listar todos os autores cadastrados',
        description:
          '**Perfil de Acesso:** Público (Não requer autenticação).\n\n' +
          'Retorna a lista de todos os autores registrados na livraria.',
        responses: {
          200: {
            description: 'Lista de autores retornada com sucesso.',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Autor'
                  }
                },
                example: [
                  {
                    id: 1,
                    nome: 'Machado de Assis',
                    nacionalidade: 'Brasileiro'
                  }
                ]
              }
            }
          },
          500: {
            description: 'Erro interno no servidor.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErroResponse'
                },
                example: {
                  erro: 'Ocorreu um erro interno no servidor.'
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Autores'],
        summary: 'Cadastrar um novo autor',
        description:
          '**Perfil de Acesso:** Exclusivo `ADMIN` (Requer token JWT válido com claim `role: "ADMIN"`).\n\n' +
          'Registra um novo autor no sistema para que seus livros possam ser catalogados posteriormente. ' +
          'Caso um usuário autenticado com perfil `USER` tente acessar esta rota, o middleware RBAC bloqueará a ação com `403 Forbidden`.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          description: 'Dados do novo autor a ser cadastrado.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AutorInput'
              },
              example: {
                nome: 'Jorge Amado',
                nacionalidade: 'Brasileiro'
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Autor cadastrado com sucesso.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Autor'
                },
                example: {
                  id: 1710000002000,
                  nome: 'Jorge Amado',
                  nacionalidade: 'Brasileiro'
                }
              }
            }
          },
          400: {
            description: 'Falha de validação: O campo obrigatório `nome` está ausente ou em branco.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErroResponse'
                },
                example: {
                  erro: 'O nome do autor é obrigatório.'
                }
              }
            }
          },
          401: {
            description: 'Não autenticado: Token JWT não fornecido, inválido ou expirado.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErroResponse'
                },
                examples: {
                  tokenAusente: {
                    summary: 'Header Authorization ausente',
                    value: {
                      erro: 'Token de autenticação não fornecido.'
                    }
                  },
                  tokenInvalido: {
                    summary: 'Token JWT inválido ou expirado',
                    value: {
                      erro: 'Token inválido ou expirado.'
                    }
                  }
                }
              }
            }
          },
          403: {
            description: 'Acesso negado: O usuário autenticado não possui privilégio de `ADMIN`.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErroResponse'
                },
                example: {
                  erro: 'Acesso proibido: privilégio de ADMIN exigido.'
                }
              }
            }
          },
          422: {
            description: 'Entidade improcessável: Os dados fornecidos para criação do autor são inválidos.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErroResponse'
                },
                example: {
                  erro: 'O nome do autor é obrigatório.'
                }
              }
            }
          }
        }
      }
    }
  }
};

module.exports = openapiSpecification;
