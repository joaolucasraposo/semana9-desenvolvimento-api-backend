const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const repository = require('../repositories/LivrariaRepository');
// Importa o JWT_SECRET definido no authMiddleware
const { JWT_SECRET } = require('../middlewares/authMiddleware');

const SALT_ROUNDS = 10;

class AuthService {
  async registrar({ nome, email, senha, role }) {
    if (!nome || !email || !senha) {
      throw { status: 400, message: "Campos obrigatórios ausentes: nome, email ou senha." };
    }

    const usuarioExistente = repository.buscarUsuarioPorEmail(email);
    if (usuarioExistente) {
      throw { status: 409, message: "E-mail já cadastrado no sistema." };
    }

    // Hash da senha com BCrypt (Salt + Work Factor = 10)
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const senha_hash = await bcrypt.hash(senha, salt);

    const novoUsuario = repository.salvarUsuario({
      nome,
      email,
      senha_hash,
      role: role ? role.toUpperCase() : "USER"
    });

    const { senha_hash: _, ...usuarioRetorno } = novoUsuario;
    return usuarioRetorno;
  }

  async login({ email, senha }) {
    if (!email || !senha) {
      throw { status: 400, message: "E-mail e senha são obrigatórios." };
    }

    const usuario = repository.buscarUsuarioPorEmail(email);
    if (!usuario) {
      throw { status: 401, message: "Credenciais inválidas." };
    }

    // Conferência da senha com o hash criptográfico
    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaValida) {
      throw { status: 401, message: "Credenciais inválidas." };
    }

    // Emissão do JWT usando o JWT_SECRET importado do authMiddleware
    const token = jwt.sign(
      {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    return {
      usuario: { id: usuario.id, nome: usuario.nome, role: usuario.role },
      token
    };
  }
}

module.exports = new AuthService();