/**
 * 📚 EJEMPLOS DE USO - Sistema de Zona de Ideas
 * 
 * Este archivo contiene ejemplos prácticos de cómo usar IdeasSystem
 * en diferentes escenarios.
 */

// ============================================
// 1. ANÁLISIS BÁSICO DE MENSAJES
// ============================================

console.log("=== EJEMPLO 1: Análisis Básico ===");

// Usuario pregunta sobre matemáticas
const mensaje1 = "¿Cómo sumo 5 + 3?";
const ideas1 = IdeasSystem.analizarMensaje(mensaje1);

console.log("Mensaje:", mensaje1);
console.log("Ideas encontradas:", ideas1);
console.log("Cantidad:", ideas1.length);
// Output:
// Ideas encontradas: [
//   { tema: "Matemáticas Básica", puntaje: 1, ... },
//   ...
// ]


// ============================================
// 2. ENRIQUECER RESPUESTA CON SUGERENCIAS
// ============================================

console.log("\n=== EJEMPLO 2: Enriquecer Respuesta ===");

const mensaje2 = "¿Cómo hago un bucle en JavaScript?";
const ideas2 = IdeasSystem.analizarMensaje(mensaje2);

const respuestaOriginal = "Un bucle for permite repetir código múltiples veces.";
const respuestaMejorada = IdeasSystem.enriquecerRespuesta(
    respuestaOriginal,
    ideas2
);

console.log("Respuesta Original:");
console.log(respuestaOriginal);
console.log("\nRespuesta Mejorada:");
console.log(respuestaMejorada);


// ============================================
// 3. OBTENER SUGERENCIAS ESPECÍFICAS
// ============================================

console.log("\n=== EJEMPLO 3: Obtener Sugerencias ===");

const mensaje3 = "No entiendo derivadas";
const ideas3 = IdeasSystem.analizarMensaje(mensaje3);
const sugerencias = IdeasSystem.obtenerSugerencias(ideas3);

console.log("Mensaje:", mensaje3);
console.log("Sugerencias para esta pregunta:");
sugerencias.forEach((sug, index) => {
    console.log(`  ${index + 1}. ${sug}`);
});


// ============================================
// 4. AGREGAR IDEAS PERSONALIZADAS
// ============================================

console.log("\n=== EJEMPLO 4: Agregar Idea Personalizada ===");

// Agregar idea sobre Historia
const miIdea = {
    tema: "Historia",
    keywords: ["historia", "acontecimiento", "revolución", "siglo", "napoleón"],
    sugerencias: [
        "Proporciona contexto histórico",
        "Menciona fechas importantes",
        "Explica causas y consecuencias",
        "Relaciona con eventos posteriores"
    ],
    tipoRespuesta: "educativo",
    ejemplo: "La Revolución Francesa (1789) cambió Europa para siempre"
};

const agregada = IdeasSystem.agregarIdea(miIdea);
console.log("¿Idea agregada?", agregada); // true

// Ahora las preguntas sobre Historia tendrán sugerencias
const mensajeHistoria = "¿Quién fue Napoleón?";
const ideasHistoria = IdeasSystem.analizarMensaje(mensajeHistoria);
console.log("Ideas para pregunta de Historia:", ideasHistoria.length > 0 ? "✓ Encontradas" : "✗ No encontradas");


// ============================================
// 5. ACTUALIZAR IDEAS EXISTENTES
// ============================================

console.log("\n=== EJEMPLO 5: Actualizar Idea ===");

// Agregar más keywords a la idea de Programación
const actualizada = IdeasSystem.actualizarIdea("Programación", {
    keywords: ["código", "javascript", "python", "java", "golang", "rust", "función"]
});

console.log("¿Idea actualizada?", actualizada);

// Verificar que el cambio se aplicó
const ideasProg = IdeasSystem.analizarMensaje("¿Cómo hago una función en Rust?");
console.log("Detectó Programación en pregunta Rust?", ideasProg.length > 0 ? "✓ Sí" : "✗ No");


// ============================================
// 6. VER ESTADÍSTICAS
// ============================================

console.log("\n=== EJEMPLO 6: Estadísticas ===");

// Realizar varios análisis para generar estadísticas
IdeasSystem.analizarMensaje("¿Cómo sumo?");
IdeasSystem.analizarMensaje("¿Código JavaScript?");
IdeasSystem.analizarMensaje("¿Fórmula de física?");

const stats = IdeasSystem.obtenerEstadísticas();
console.log("Estadísticas del Sistema:");
console.log(`  Mensajes analizados: ${stats.mensajesAnalizados}`);
console.log(`  Ideas utilizadas: ${stats.ideasUtilizadas}`);
console.log(`  Total de ideas: ${stats.totalIdeas}`);
console.log(`  Temas comunes:`, stats.temasComunes);


// ============================================
// 7. MODO DEBUG
// ============================================

console.log("\n=== EJEMPLO 7: Modo Debug ===");

IdeasSystem.setDebugMode(true);
console.log("Debug activado. Próximos análisis mostrarán detalles...");

IdeasSystem.analizarMensaje("¿Cómo integro una función?");
// En consola verás: 💡 Ideas encontradas: [...]

IdeasSystem.setDebugMode(false);
console.log("Debug desactivado.");


// ============================================
// 8. CASO COMPLETO: CHAT CON IDEAS
// ============================================

console.log("\n=== EJEMPLO 8: Simulación de Chat ===");

function simularchatConIdeas(preguntaUsuario) {
    console.log(`\nUsuario: ${preguntaUsuario}`);
    
    // 1. Analizar
    const ideas = IdeasSystem.analizarMensaje(preguntaUsuario);
    console.log(`Tema detectado: ${ideas[0]?.tema || "General"}`);
    
    // 2. Generar respuesta base
    let respuesta = "Esta es una respuesta base a tu pregunta.";
    
    // 3. Enriquecer con ideas
    if (ideas.length > 0) {
        respuesta = IdeasSystem.enriquecerRespuesta(respuesta, ideas);
    }
    
    // 4. Mostrar respuesta
    console.log(`\nIA: ${respuesta}`);
}

// Simular varios chats
simularchatConIdeas("¿Cómo resto 10 - 3?");
simularchatConIdeas("¿Para qué sirve el método map en JavaScript?");
simularchatConIdeas("¿Cuál es la velocidad de la luz?");


// ============================================
// 9. FILTRAR IDEAS POR TIPO
// ============================================

console.log("\n=== EJEMPLO 9: Filtrar por Tipo ===");

const mensaje = "¿Cómo hago una función?";
const todasLasIdeas = IdeasSystem.analizarMensaje(mensaje);

// Filtrar solo ideas técnicas
const ideasTecnicas = todasLasIdeas.filter(
    idea => idea.tipoRespuesta === "técnico"
);

console.log(`Total de ideas: ${todasLasIdeas.length}`);
console.log(`Ideas técnicas: ${ideasTecnicas.length}`);

if (ideasTecnicas.length > 0) {
    const respuestaConTecnicas = IdeasSystem.enriquecerRespuesta(
        "Una función es un bloque de código reutilizable.",
        ideasTecnicas
    );
    console.log("\nRespuesta con tips técnicos:");
    console.log(respuestaConTecnicas);
}


// ============================================
// 10. CREAR PANEL DE SUGERENCIAS EN UI
// ============================================

console.log("\n=== EJEMPLO 10: Panel de Sugerencias UI ===");

function crearPanelSugerencias(mensaje) {
    const ideas = IdeasSystem.analizarMensaje(mensaje);
    const sugerencias = IdeasSystem.obtenerSugerencias(ideas);
    
    if (sugerencias.length === 0) {
        return "<p>No hay sugerencias disponibles.</p>";
    }
    
    let html = "<div class='sugerencias-panel'>";
    html += `<h4>💡 Sugerencias para tu pregunta:</h4>`;
    html += "<ul>";
    
    sugerencias.forEach(sug => {
        html += `<li>${sug}</li>`;
    });
    
    html += "</ul></div>";
    return html;
}

// Uso en HTML
const panelHTML = crearPanelSugerencias("¿Cómo hago un if en JavaScript?");
console.log("\nHTML del panel:");
console.log(panelHTML);


// ============================================
// 11. REGISTRAR EFECTIVIDAD DE IDEAS
// ============================================

console.log("\n=== EJEMPLO 11: Efectividad de Ideas ===");

// Simular que usuario estuvo satisfecho con la respuesta
function registrarIdeasEfectivas(pregunta, usuarioSatisfecho) {
    const ideas = IdeasSystem.analizarMensaje(pregunta);
    
    ideas.forEach(idea => {
        if (!idea.efectividad) idea.efectividad = 0;
        if (usuarioSatisfecho) {
            idea.efectividad++;
        }
    });
    
    console.log(`Pregunta: ${pregunta}`);
    console.log(`Usuario satisfecho: ${usuarioSatisfecho}`);
    console.log(`Ideas registradas:`, ideas.map(i => i.tema));
}

registrarIdeasEfectivas("¿Cómo sumo?", true);
registrarIdeasEfectivas("¿Código Python?", true);
registrarIdeasEfectivas("Pregunta rara", false);


// ============================================
// 12. EXPORTAR IDEAS A JSON
// ============================================

console.log("\n=== EJEMPLO 12: Exportar Ideas ===");

function exportarIdeasAJSON() {
    const todasLasIdeas = IdeasSystem.obtenerTodasLasIdeas();
    const json = JSON.stringify(todasLasIdeas, null, 2);
    
    // En navegador: descargar archivo
    // const blob = new Blob([json], {type: 'application/json'});
    // const url = URL.createObjectURL(blob);
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = 'ideas-infinix.json';
    // a.click();
    
    console.log("Ideas exportadas (primeras 2):");
    console.log(json.substring(0, 300) + "...");
}

exportarIdeasAJSON();


// ============================================
// 13. IMPORTAR IDEAS DESDE JSON
// ============================================

console.log("\n=== EJEMPLO 13: Importar Ideas ===");

function importarIdeasDesdeJSON(jsonString) {
    try {
        const ideas = JSON.parse(jsonString);
        let agregadas = 0;
        
        ideas.forEach(idea => {
            if (IdeasSystem.agregarIdea(idea)) {
                agregadas++;
            }
        });
        
        console.log(`✓ ${agregadas} ideas importadas exitosamente`);
        return true;
    } catch (error) {
        console.error("✗ Error al importar:", error);
        return false;
    }
}

// Simulación
const jsonSimulado = `[
    {
        "tema": "Importada Tema 1",
        "keywords": ["test"],
        "sugerencias": ["Sugerencia test"],
        "tipoRespuesta": "educativo"
    }
]`;

importarIdeasDesdeJSON(jsonSimulado);


// ============================================
// 14. LIMPIAR Y RESETEAR
// ============================================

console.log("\n=== EJEMPLO 14: Limpiar Estado ===");

// Ver estado actual
console.log("Ideas actuales antes:", IdeasSystem.obtenerIdeasActuales().length);
console.log("Stats antes:", IdeasSystem.obtenerEstadísticas().mensajesAnalizados);

// Analizar algo
IdeasSystem.analizarMensaje("Una pregunta");
console.log("Ideas actuales después de análisis:", IdeasSystem.obtenerIdeasActuales().length);

// Limpiar
IdeasSystem.limpiarIdeasActuales();
console.log("Ideas actuales después de limpiar:", IdeasSystem.obtenerIdeasActuales().length);

// Resetear estadísticas
IdeasSystem.resetearEstadísticas();
console.log("Stats después de resetear:", IdeasSystem.obtenerEstadísticas().mensajesAnalizados);


// ============================================
// RESUMEN
// ============================================

console.log("\n" + "=".repeat(50));
console.log("✅ EJEMPLOS COMPLETADOS");
console.log("=".repeat(50));
console.log("\nIdeasSystem está listo para usar en tu aplicación.");
console.log("Métodos disponibles:");
console.log("  • analizarMensaje()");
console.log("  • enriquecerRespuesta()");
console.log("  • obtenerSugerencias()");
console.log("  • agregarIdea()");
console.log("  • actualizarIdea()");
console.log("  • obtenerEstadísticas()");
console.log("  • setDebugMode()");
console.log("  • resetearEstadísticas()");
console.log("\nLee SISTEMA_ZONA_IDEAS.md para documentación completa.");
