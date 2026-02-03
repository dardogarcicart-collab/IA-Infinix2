/**
 * Code Generator - Sistema inteligente de generación de código
 * Analiza peticiones, detecta lenguaje y genera código funcional
 */
(function(global){
    const CodeGenerator = {
        // Variables de inteligencia
        nivelProgramacion: 'intermedio', // basico, intermedio, avanzado
        complejidadCodigo: 0.5, // 0-1
        lenguajeObjetivo: 'javascript',
        estiloCodigo: 'moderno', // clasico, moderno, funcional
        profundidadExplicacion: 'media', // basica, media, profunda
        coherenciaSintactica: 0.9,
        riesgoError: 0.1,

        // Lenguajes soportados
        LENGUAJES: ['javascript', 'java', 'python', 'cpp', 'html', 'css'],

        // Analizar una petición de usuario para detectar si quiere código
        analizarPeticion(texto){
            const lower = texto.toLowerCase();
            const patterns = {
                generarCodigo: /genera|crea|escribe|implementa|código|program|función|function|class|clase|método|method/i,
                java: /\bjava\b|\.jar|public class|main\(/i,
                javascript: /\bjs\b|javascript|async|await|const |let |var /i,
                python: /\bpython\b|\.py\b|def |import |async |await /i,
                cpp: /c\+\+|\bcpp\b|#include|std::|cout|cin/i,
                html: /\bhtml\b|<div|<html|<head|<body|<!doctype/i,
                modificar: /modifica|edita|cambia|mejora|optimiza|refactoriza/i,
                explicar: /explica|qué\s+es|cómo\s+funciona|entiend|analiza/i,
                optimizar: /optimiza|mejora|haz más rápido|eficiencia|performance/i
            };

            const resultado = {
                esCodigoReq: patterns.generarCodigo.test(lower),
                tipo: 'generar', // generar, modificar, explicar, optimizar
                lenguajes: [],
                conceptos: [],
                estructuras: [],
                descripcion: texto
            };

            if (patterns.modificar.test(lower)) resultado.tipo = 'modificar';
            if (patterns.explicar.test(lower)) resultado.tipo = 'explicar';
            if (patterns.optimizar.test(lower)) resultado.tipo = 'optimizar';

            // detectar lenguajes
            for (const [lang, pattern] of Object.entries(patterns)){
                if (lang !== 'generarCodigo' && lang !== 'modificar' && lang !== 'explicar' && lang !== 'optimizar'){
                    if (pattern.test(lower)) resultado.lenguajes.push(lang);
                }
            }

            // detectar conceptos: loop, function, class, etc.
            const conceptPatterns = {
                loop: /loop|bucle|for|while|iterate|recorrer/i,
                funcion: /función|function|procedimiento|método/i,
                clase: /class|clase|objeto|oop/i,
                array: /array|lista|vector|colección/i,
                archivo: /archivo|file|guardar|lectura/i,
                api: /api|request|http|get|post|fetch/i,
                base_datos: /base de datos|database|sql|orm|query/i
            };
            for (const [concept, pattern] of Object.entries(conceptPatterns)){
                if (pattern.test(lower)) resultado.conceptos.push(concept);
            }

            return resultado;
        },

        // Generar código basado en análisis
        generarCodigo(analisis){
            // Elegir lenguaje: usar el detectado o default
            const lang = analisis.lenguajes.length > 0 ? analisis.lenguajes[0] : 'javascript';
            this.lenguajeObjetivo = lang;

            // Ajustar complejidad según conceptos
            this.complejidadCodigo = Math.min(1, 0.3 + (analisis.conceptos.length * 0.15));

            // Generar según tipo
            let codigo = '';
            if (analisis.tipo === 'generar'){
                codigo = this.generarDesdeDesc(analisis, lang);
            } else if (analisis.tipo === 'modificar'){
                codigo = '// modificación solicitada\n' + this.generarDesdeDesc(analisis, lang);
            } else if (analisis.tipo === 'optimizar'){
                codigo = '// versión optimizada\n' + this.generarDesdeDesc(analisis, lang);
            }

            // Calcular métricas
            const lineas = codigo.split('\n').length;
            this.coherenciaSintactica = Math.max(0.7, 1 - (lineas > 100 ? 0.1 : 0));
            this.riesgoError = Math.min(0.5, 0.1 + this.complejidadCodigo * 0.3);

            return {
                lenguaje: lang,
                codigo: codigo,
                lineas: lineas,
                complejidad: this.complejidadCodigo,
                riesgo: this.riesgoError,
                explicacion: this.generarExplicacion(analisis, codigo)
            };
        },

        // Generar código según descripción y lenguaje
        generarDesdeDesc(analisis, lang){
            const desc = analisis.descripcion.toLowerCase();
            const conceptos = analisis.conceptos;

            if (lang === 'java') return this.generarJava(analisis, desc, conceptos);
            if (lang === 'python') return this.generarPython(analisis, desc, conceptos);
            if (lang === 'cpp') return this.generarCpp(analisis, desc, conceptos);
            if (lang === 'html') return this.generarHTML(analisis, desc, conceptos);
            if (lang === 'css') return this.generarCSS(analisis, desc, conceptos);
            // default javascript
            return this.generarJavaScript(analisis, desc, conceptos);
        },

        generarJavaScript(analisis, desc, conceptos){
            let code = '// Código JavaScript generado automáticamente\n\n';
            if (conceptos.includes('funcion') || desc.includes('función') || desc.includes('calcul')){
                code += `/**
 * Función ejemplo - ${analisis.descripcion}
 */
function procesarDatos(entrada) {
    // validar entrada
    if (!entrada || typeof entrada !== 'object') {
        throw new Error('Entrada inválida');
    }
    
    // procesar
    const resultado = {
        entrada: entrada,
        procesado: true,
        timestamp: Date.now()
    };
    
    return resultado;
}

// uso
try {
    const res = procesarDatos({valor: 42});
    console.log(res);
} catch(e) {
    console.error('Error:', e.message);
}`;
            } else if (conceptos.includes('class')){
                code += `class ${this.extraerNombreClase(desc)} {
    constructor(datos) {
        this.datos = datos;
        this.creado = new Date();
    }
    
    procesar() {
        // lógica aquí
        return this.datos;
    }
    
    obtenerInfo() {
        return {
            datos: this.datos,
            creado: this.creado
        };
    }
}

// uso
const obj = new ${this.extraerNombreClase(desc)}({valor: 1});
console.log(obj.obtenerInfo());`;
            } else if (conceptos.includes('loop')){
                code += `// Loop para procesar colección
const items = [1, 2, 3, 4, 5];

// Opción 1: for...of (moderno)
for (const item of items) {
    console.log('Procesando:', item);
}

// Opción 2: map (funcional)
const procesados = items.map(item => item * 2);
console.log(procesados);

// Opción 3: forEach
items.forEach((item, index) => {
    console.log(\`Item \${index}: \${item}\`);
});`;
            } else {
                code += `// Módulo ejemplo
const modulo = {
    datos: [],
    
    agregar(item) {
        this.datos.push(item);
    },
    
    obtener() {
        return this.datos;
    }
};

// uso
modulo.agregar('ejemplo');
console.log(modulo.obtener());`;
            }
            return code;
        },

        generarJava(analisis, desc, conceptos){
            const nombreClase = this.extraerNombreClase(desc) || 'Programa';
            let code = `// Código Java generado automáticamente
// ${analisis.descripcion}

public class ${nombreClase} {
    private String dato;
    
    public ${nombreClase}(String dato) {
        this.dato = dato;
    }
    
    public String procesar() {
        // lógica aquí
        return "Procesando: " + this.dato;
    }
    
    public static void main(String[] args) {
        ${nombreClase} prog = new ${nombreClase}("ejemplo");
        System.out.println(prog.procesar());
    }
}`;
            return code;
        },

        generarPython(analisis, desc, conceptos){
            let code = `# Código Python generado automáticamente
# ${analisis.descripcion}

def procesar(entrada):
    """
    Procesa la entrada según descripción.
    """
    if not isinstance(entrada, (dict, list)):
        raise ValueError("Entrada inválida")
    
    resultado = {
        "entrada": entrada,
        "procesado": True,
        "status": "ok"
    }
    return resultado

class Procesador:
    def __init__(self, datos):
        self.datos = datos
    
    def ejecutar(self):
        return procesar(self.datos)

# uso
if __name__ == "__main__":
    resultado = procesar({"valor": 42})
    print(resultado)`;
            return code;
        },

        generarCpp(analisis, desc, conceptos){
            let code = `// Código C++ generado automáticamente
// ${analisis.descripcion}

#include <iostream>
#include <string>
#include <vector>

using namespace std;

class Procesador {
private:
    string dato;
public:
    Procesador(const string& d) : dato(d) {}
    
    string procesar() {
        return "Procesando: " + dato;
    }
};

int main() {
    Procesador prog("ejemplo");
    cout << prog.procesar() << endl;
    return 0;
}`;
            return code;
        },

        generarHTML(analisis, desc, conceptos){
            let code = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${analisis.descripcion}</title>
    <style>
        body { font-family: sans-serif; margin: 20px; }
        .container { max-width: 800px; margin: 0 auto; }
        button { padding: 10px 20px; cursor: pointer; }
    </style>
</head>
<body>
    <div class="container">
        <h1>${analisis.descripcion}</h1>
        <p>Contenido generado automáticamente.</p>
        <button onclick="alert('Acción ejecutada')">Ejecutar</button>
    </div>
</body>
</html>`;
            return code;
        },

        generarCSS(analisis, desc, conceptos){
            let code = `/* CSS generado automáticamente */
/* ${analisis.descripcion} */

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #333;
    margin: 0;
    padding: 20px;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.1);
}

h1 {
    color: #667eea;
    border-bottom: 3px solid #667eea;
    padding-bottom: 10px;
}

button {
    background: #667eea;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s;
}

button:hover {
    background: #764ba2;
    transform: translateY(-2px);
}`;
            return code;
        },

        generarExplicacion(analisis, codigo){
            let exp = `### Explicación del código generado\n\n`;
            exp += `**Descripción**: ${analisis.descripcion}\n`;
            exp += `**Lenguaje**: ${this.lenguajeObjetivo.toUpperCase()}\n`;
            exp += `**Complejidad**: ${Math.round(this.complejidadCodigo*100)}%\n`;
            exp += `**Conceptos**: ${analisis.conceptos.join(', ') || 'básico'}\n\n`;
            exp += `**Estructura**:\n`;
            analisis.conceptos.forEach(c=>{
                exp += `- ${c}: Incluido para cumplir requisito\n`;
            });
            exp += `\n**Notas**: El código es funcional pero puede adaptarse según necesidades específicas.`;
            return exp;
        },

        extraerNombreClase(desc){
            const match = desc.match(/\b([A-Z][a-z]+(?:[A-Z][a-z]+)*)\b/);
            return match ? match[1] : 'Clase';
        }
    };

    global.CodeGenerator = CodeGenerator;
})(window);
