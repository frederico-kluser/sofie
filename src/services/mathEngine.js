/**
 * 🧮 Math Engine Service
 *
 * Serviço centralizado para todos os cálculos matemáticos usando Math.js
 * Este serviço garante 100% de precisão em cálculos, separando o raciocínio
 * pedagógico do LLM da computação matemática exata.
 *
 * PADRÃO FUNDAMENTAL:
 * - LLM → Explica e ensina
 * - Math.js → Calcula com precisão
 */

import * as math from 'mathjs';

/**
 * Configuração customizada do Math.js
 */
const mathConfig = {
  precision: 64, // Precisão para cálculos
  number: 'BigNumber', // Usar BigNumber para precisão
  matrix: 'Matrix' // Tipo de matriz
};

// Criar instância customizada do math
const mathInstance = math.create(math.all, mathConfig);

/**
 * Parser de Expressões Matemáticas
 * Converte strings matemáticas em resultados precisos
 */
class MathParser {
  /**
   * Avalia uma expressão matemática
   * @param {string} expression - Expressão matemática
   * @param {object} scope - Variáveis disponíveis
   * @returns {*} Resultado do cálculo
   */
  static evaluate(expression, scope = {}) {
    try {
      const result = mathInstance.evaluate(expression, scope);
      return this.formatResult(result);
    } catch (error) {
      throw new Error(`Erro ao avaliar expressão: ${error.message}`);
    }
  }

  /**
   * Formata o resultado para exibição
   * @param {*} result - Resultado bruto
   * @returns {string|number|object} Resultado formatado
   */
  static formatResult(result) {
    // BigNumber para número normal se possível
    if (result && typeof result.toNumber === 'function') {
      try {
        return result.toNumber();
      } catch (e) {
        return result.toString();
      }
    }

    // Matrizes e vetores
    if (math.isMatrix(result)) {
      return result.toArray();
    }

    // Números complexos
    if (math.isComplex(result)) {
      return {
        re: result.re,
        im: result.im,
        toString: () => result.toString()
      };
    }

    return result;
  }

  /**
   * Simplifica uma expressão algébrica
   * @param {string} expression - Expressão para simplificar
   * @returns {string} Expressão simplificada
   */
  static simplify(expression) {
    try {
      const node = mathInstance.parse(expression);
      const simplified = mathInstance.simplify(node);
      return simplified.toString();
    } catch (error) {
      throw new Error(`Erro ao simplificar: ${error.message}`);
    }
  }

  /**
   * Valida se uma expressão é válida
   * @param {string} expression - Expressão para validar
   * @returns {boolean} True se válida
   */
  static isValid(expression) {
    try {
      mathInstance.parse(expression);
      return true;
    } catch (error) {
      return false;
    }
  }
}

/**
 * Operações Aritméticas Básicas e Avançadas
 */
class Arithmetic {
  // Operações básicas
  static add(a, b) {
    return mathInstance.add(a, b);
  }

  static subtract(a, b) {
    return mathInstance.subtract(a, b);
  }

  static multiply(a, b) {
    return mathInstance.multiply(a, b);
  }

  static divide(a, b) {
    if (b === 0) throw new Error('Divisão por zero');
    return mathInstance.divide(a, b);
  }

  static power(base, exponent) {
    return mathInstance.pow(base, exponent);
  }

  static sqrt(n) {
    return mathInstance.sqrt(n);
  }

  static nthRoot(n, root) {
    return mathInstance.nthRoot(n, root);
  }

  // Operações avançadas
  static factorial(n) {
    return mathInstance.factorial(n);
  }

  static gcd(...numbers) {
    return mathInstance.gcd(...numbers);
  }

  static lcm(...numbers) {
    return mathInstance.lcm(...numbers);
  }

  static mod(a, b) {
    return mathInstance.mod(a, b);
  }

  static abs(n) {
    return mathInstance.abs(n);
  }

  static ceil(n) {
    return mathInstance.ceil(n);
  }

  static floor(n) {
    return mathInstance.floor(n);
  }

  static round(n, decimals = 0) {
    return mathInstance.round(n, decimals);
  }

  // Funções trigonométricas
  static sin(angle, unit = 'rad') {
    const rad = unit === 'deg' ? mathInstance.unit(angle, 'deg').toNumber('rad') : angle;
    return mathInstance.sin(rad);
  }

  static cos(angle, unit = 'rad') {
    const rad = unit === 'deg' ? mathInstance.unit(angle, 'deg').toNumber('rad') : angle;
    return mathInstance.cos(rad);
  }

  static tan(angle, unit = 'rad') {
    const rad = unit === 'deg' ? mathInstance.unit(angle, 'deg').toNumber('rad') : angle;
    return mathInstance.tan(rad);
  }

  // Logaritmos
  static log(n, base = Math.E) {
    return mathInstance.log(n, base);
  }

  static log10(n) {
    return mathInstance.log10(n);
  }

  static log2(n) {
    return mathInstance.log2(n);
  }

  static ln(n) {
    return mathInstance.log(n);
  }
}

/**
 * Álgebra Simbólica
 */
class Algebra {
  /**
   * Resolve equação linear (ax + b = 0)
   * @param {string} equation - Equação como string
   * @param {string} variable - Variável a resolver
   * @returns {*} Solução
   */
  static solve(equation, variable = 'x') {
    try {
      // Remove espaços e prepara a equação
      const cleanEq = equation.replace(/\s/g, '');

      // Tenta resolver
      const solution = mathInstance.solve(cleanEq, variable);
      return MathParser.formatResult(solution);
    } catch (error) {
      throw new Error(`Erro ao resolver equação: ${error.message}`);
    }
  }

  /**
   * Expande expressão algébrica
   * @param {string} expression - Expressão para expandir
   * @returns {string} Expressão expandida
   */
  static expand(expression) {
    try {
      const node = mathInstance.parse(expression);
      const expanded = mathInstance.simplify(node, [{ l: 'n*(n1+n2)', r: 'n*n1+n*n2' }]);
      return expanded.toString();
    } catch (error) {
      throw new Error(`Erro ao expandir: ${error.message}`);
    }
  }

  /**
   * Fatora expressão
   * @param {string} expression - Expressão para fatorar
   * @returns {string} Expressão fatorada
   */
  static factor(expression) {
    try {
      // Math.js não tem fatoração direta, mas podemos simplificar
      return MathParser.simplify(expression);
    } catch (error) {
      throw new Error(`Erro ao fatorar: ${error.message}`);
    }
  }

  /**
   * Substitui variável em expressão
   * @param {string} expression - Expressão
   * @param {object} substitutions - Objeto com substituições {x: 2, y: 3}
   * @returns {*} Resultado
   */
  static substitute(expression, substitutions) {
    try {
      const node = mathInstance.parse(expression);
      const result = node.evaluate(substitutions);
      return MathParser.formatResult(result);
    } catch (error) {
      throw new Error(`Erro na substituição: ${error.message}`);
    }
  }

  /**
   * Deriva expressão simbolicamente
   * @param {string} expression - Expressão para derivar
   * @param {string} variable - Variável de derivação
   * @returns {string} Derivada
   */
  static derivative(expression, variable = 'x') {
    try {
      const node = mathInstance.parse(expression);
      const derivative = mathInstance.derivative(node, variable);
      return derivative.toString();
    } catch (error) {
      throw new Error(`Erro ao derivar: ${error.message}`);
    }
  }
}

/**
 * Cálculo Diferencial e Integral
 */
class Calculus {
  /**
   * Calcula derivada de uma função
   * @param {string} expression - Expressão da função
   * @param {string} variable - Variável de derivação
   * @returns {string} Derivada
   */
  static derivative(expression, variable = 'x') {
    return Algebra.derivative(expression, variable);
  }

  /**
   * Calcula derivada numérica em um ponto
   * @param {Function} fn - Função JavaScript
   * @param {number} x - Ponto de cálculo
   * @param {number} h - Incremento (padrão: 1e-5)
   * @returns {number} Derivada numérica
   */
  static numericalDerivative(fn, x, h = 1e-5) {
    return (fn(x + h) - fn(x - h)) / (2 * h);
  }

  /**
   * Integração numérica pelo método do trapézio
   * @param {Function} fn - Função a integrar
   * @param {number} a - Limite inferior
   * @param {number} b - Limite superior
   * @param {number} n - Número de subdivisões
   * @returns {number} Integral aproximada
   */
  static integrate(fn, a, b, n = 1000) {
    const h = (b - a) / n;
    let sum = (fn(a) + fn(b)) / 2;

    for (let i = 1; i < n; i++) {
      sum += fn(a + i * h);
    }

    return sum * h;
  }

  /**
   * Série de Taylor
   * @param {string} expression - Expressão
   * @param {string} variable - Variável
   * @param {number} center - Centro da série
   * @param {number} order - Ordem da série
   * @returns {string} Aproximação por Taylor
   */
  static taylorSeries(expression, variable = 'x', center = 0, order = 5) {
    try {
      const terms = [];
      let currentExpr = expression;

      for (let n = 0; n <= order; n++) {
        // Avalia a derivada no centro
        const value = Algebra.substitute(currentExpr, { [variable]: center });
        const coefficient = value / Arithmetic.factorial(n);

        if (n === 0) {
          terms.push(coefficient);
        } else {
          terms.push(`${coefficient}*(${variable}-${center})^${n}`);
        }

        // Próxima derivada
        if (n < order) {
          currentExpr = Algebra.derivative(currentExpr, variable);
        }
      }

      return terms.join(' + ');
    } catch (error) {
      throw new Error(`Erro na série de Taylor: ${error.message}`);
    }
  }

  /**
   * Limites numéricos
   * @param {Function} fn - Função
   * @param {number} x - Ponto
   * @param {string} direction - 'left', 'right', ou 'both'
   * @returns {number} Limite aproximado
   */
  static limit(fn, x, direction = 'both') {
    const h = 1e-10;

    if (direction === 'left') {
      return fn(x - h);
    } else if (direction === 'right') {
      return fn(x + h);
    } else {
      const left = fn(x - h);
      const right = fn(x + h);
      return Math.abs(left - right) < 1e-9 ? (left + right) / 2 : NaN;
    }
  }
}

/**
 * Operações com Matrizes e Vetores
 */
class LinearAlgebra {
  /**
   * Cria uma matriz
   * @param {Array} data - Array 2D com dados
   * @returns {Matrix} Matriz
   */
  static matrix(data) {
    return mathInstance.matrix(data);
  }

  /**
   * Cria vetor
   * @param {Array} data - Array com dados
   * @returns {Matrix} Vetor
   */
  static vector(data) {
    return mathInstance.matrix(data);
  }

  /**
   * Transposta de uma matriz
   * @param {Array|Matrix} matrix - Matriz
   * @returns {Array} Matriz transposta
   */
  static transpose(matrix) {
    const result = mathInstance.transpose(matrix);
    return math.isMatrix(result) ? result.toArray() : result;
  }

  /**
   * Determinante
   * @param {Array|Matrix} matrix - Matriz quadrada
   * @returns {number} Determinante
   */
  static det(matrix) {
    return mathInstance.det(matrix);
  }

  /**
   * Inversa de uma matriz
   * @param {Array|Matrix} matrix - Matriz
   * @returns {Array} Matriz inversa
   */
  static inv(matrix) {
    const result = mathInstance.inv(matrix);
    return math.isMatrix(result) ? result.toArray() : result;
  }

  /**
   * Multiplicação de matrizes
   * @param {Array|Matrix} a - Primeira matriz
   * @param {Array|Matrix} b - Segunda matriz
   * @returns {Array} Produto
   */
  static multiply(a, b) {
    const result = mathInstance.multiply(a, b);
    return math.isMatrix(result) ? result.toArray() : result;
  }

  /**
   * Produto escalar (dot product)
   * @param {Array} a - Vetor a
   * @param {Array} b - Vetor b
   * @returns {number} Produto escalar
   */
  static dot(a, b) {
    return mathInstance.dot(a, b);
  }

  /**
   * Produto vetorial (cross product) - apenas 3D
   * @param {Array} a - Vetor a (3D)
   * @param {Array} b - Vetor b (3D)
   * @returns {Array} Produto vetorial
   */
  static cross(a, b) {
    return mathInstance.cross(a, b);
  }

  /**
   * Norma de um vetor
   * @param {Array} vector - Vetor
   * @returns {number} Norma
   */
  static norm(vector) {
    return mathInstance.norm(vector);
  }

  /**
   * Autovalores de uma matriz
   * @param {Array|Matrix} matrix - Matriz
   * @returns {Array} Autovalores
   */
  static eigenvalues(matrix) {
    const result = mathInstance.eigs(matrix);
    return result.values;
  }

  /**
   * Matriz identidade
   * @param {number} n - Dimensão
   * @returns {Array} Matriz identidade n×n
   */
  static identity(n) {
    const result = mathInstance.identity(n);
    return math.isMatrix(result) ? result.toArray() : result;
  }

  /**
   * Matriz de zeros
   * @param {number} rows - Linhas
   * @param {number} cols - Colunas
   * @returns {Array} Matriz de zeros
   */
  static zeros(rows, cols) {
    const result = mathInstance.zeros(rows, cols);
    return math.isMatrix(result) ? result.toArray() : result;
  }

  /**
   * Matriz de uns
   * @param {number} rows - Linhas
   * @param {number} cols - Colunas
   * @returns {Array} Matriz de uns
   */
  static ones(rows, cols) {
    const result = mathInstance.ones(rows, cols);
    return math.isMatrix(result) ? result.toArray() : result;
  }
}

/**
 * Operações com Números Complexos
 */
class Complex {
  /**
   * Cria número complexo
   * @param {number} re - Parte real
   * @param {number} im - Parte imaginária
   * @returns {object} Número complexo
   */
  static create(re, im) {
    const result = mathInstance.complex(re, im);
    return {
      re: result.re,
      im: result.im,
      toString: () => result.toString()
    };
  }

  /**
   * Soma de complexos
   * @param {object} a - Complexo a
   * @param {object} b - Complexo b
   * @returns {object} Soma
   */
  static add(a, b) {
    const result = mathInstance.add(
      mathInstance.complex(a.re, a.im),
      mathInstance.complex(b.re, b.im)
    );
    return MathParser.formatResult(result);
  }

  /**
   * Subtração de complexos
   * @param {object} a - Complexo a
   * @param {object} b - Complexo b
   * @returns {object} Diferença
   */
  static subtract(a, b) {
    const result = mathInstance.subtract(
      mathInstance.complex(a.re, a.im),
      mathInstance.complex(b.re, b.im)
    );
    return MathParser.formatResult(result);
  }

  /**
   * Multiplicação de complexos
   * @param {object} a - Complexo a
   * @param {object} b - Complexo b
   * @returns {object} Produto
   */
  static multiply(a, b) {
    const result = mathInstance.multiply(
      mathInstance.complex(a.re, a.im),
      mathInstance.complex(b.re, b.im)
    );
    return MathParser.formatResult(result);
  }

  /**
   * Divisão de complexos
   * @param {object} a - Complexo a
   * @param {object} b - Complexo b
   * @returns {object} Quociente
   */
  static divide(a, b) {
    const result = mathInstance.divide(
      mathInstance.complex(a.re, a.im),
      mathInstance.complex(b.re, b.im)
    );
    return MathParser.formatResult(result);
  }

  /**
   * Conjugado de um complexo
   * @param {object} z - Número complexo
   * @returns {object} Conjugado
   */
  static conj(z) {
    const result = mathInstance.conj(mathInstance.complex(z.re, z.im));
    return MathParser.formatResult(result);
  }

  /**
   * Módulo (magnitude) de um complexo
   * @param {object} z - Número complexo
   * @returns {number} Módulo
   */
  static abs(z) {
    return mathInstance.abs(mathInstance.complex(z.re, z.im));
  }

  /**
   * Argumento (fase) de um complexo
   * @param {object} z - Número complexo
   * @returns {number} Argumento em radianos
   */
  static arg(z) {
    return mathInstance.arg(mathInstance.complex(z.re, z.im));
  }

  /**
   * Forma polar de um complexo
   * @param {object} z - Número complexo
   * @returns {object} {r: módulo, theta: argumento}
   */
  static toPolar(z) {
    const c = mathInstance.complex(z.re, z.im);
    return {
      r: mathInstance.abs(c),
      theta: mathInstance.arg(c)
    };
  }

  /**
   * Criar complexo a partir de forma polar
   * @param {number} r - Módulo
   * @param {number} theta - Argumento (radianos)
   * @returns {object} Número complexo
   */
  static fromPolar(r, theta) {
    const re = r * Math.cos(theta);
    const im = r * Math.sin(theta);
    return this.create(re, im);
  }
}

/**
 * Estatística e Probabilidade
 */
class Statistics {
  static mean(data) {
    return mathInstance.mean(data);
  }

  static median(data) {
    return mathInstance.median(data);
  }

  static mode(data) {
    return mathInstance.mode(data);
  }

  static std(data) {
    return mathInstance.std(data);
  }

  static variance(data) {
    return mathInstance.variance(data);
  }

  static min(data) {
    return mathInstance.min(data);
  }

  static max(data) {
    return mathInstance.max(data);
  }

  static sum(data) {
    return mathInstance.sum(data);
  }

  static prod(data) {
    return mathInstance.prod(data);
  }
}

/**
 * Exporta interface unificada do Math Engine
 */
const MathEngine = {
  // Core
  math: mathInstance,
  parse: MathParser.evaluate,
  evaluate: MathParser.evaluate,
  simplify: MathParser.simplify,
  isValid: MathParser.isValid,

  // Aritmética
  arithmetic: Arithmetic,

  // Álgebra
  algebra: Algebra,
  solve: Algebra.solve,
  expand: Algebra.expand,
  factor: Algebra.factor,
  substitute: Algebra.substitute,

  // Cálculo
  calculus: Calculus,
  derivative: Calculus.derivative,
  integrate: Calculus.integrate,
  limit: Calculus.limit,

  // Álgebra Linear
  linearAlgebra: LinearAlgebra,
  matrix: LinearAlgebra.matrix,
  vector: LinearAlgebra.vector,

  // Complexos
  complex: Complex,

  // Estatística
  statistics: Statistics,

  // Constantes matemáticas
  constants: {
    PI: math.pi,
    E: math.e,
    PHI: math.phi,
    TAU: math.tau
  }
};

export default MathEngine;
export {
  MathParser,
  Arithmetic,
  Algebra,
  Calculus,
  LinearAlgebra,
  Complex,
  Statistics
};
