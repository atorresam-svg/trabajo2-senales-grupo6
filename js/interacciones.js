function iniciarLaboratorio() {
    const canvas = document.getElementById("graficaLineal");
    const selector = document.getElementById("tipoSistema");
    const amplitud = document.getElementById("amplitud");
    const valorAmplitud = document.getElementById("valorAmplitud");
    const conclusion = document.getElementById("conclusion");
    const diferenciaTexto = document.getElementById("diferencia");

    if (!canvas || !selector || !amplitud) return;

    const ctx = canvas.getContext("2d");

    function dibujarGrafica() {
        const a = Number(amplitud.value);
        const lineal = selector.value === "lineal";
        const ancho = canvas.width;
        const alto = canvas.height;

        if (valorAmplitud) valorAmplitud.textContent = a;

        const ymin = lineal ? -7 : 0;
        const ymax = lineal ? 7 : 10;

        ctx.clearRect(0, 0, ancho, alto);
        ctx.fillStyle = "#111827";
        ctx.fillRect(0, 0, ancho, alto);

        function X(t) {
            return 55 + (t / (2 * Math.PI)) * (ancho - 85);
        }

        function Y(y) {
            return alto - 35 -
                ((y - ymin) / (ymax - ymin)) * (alto - 65);
        }

        // Cuadrícula.
        ctx.strokeStyle = "#334155";
        ctx.lineWidth = 1;

        for (let i = 0; i <= 5; i++) {
            const y = 30 + i * (alto - 65) / 5;
            ctx.beginPath();
            ctx.moveTo(55, y);
            ctx.lineTo(ancho - 30, y);
            ctx.stroke();
        }

        // Ejes.
        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(55, Y(0));
        ctx.lineTo(ancho - 30, Y(0));
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(55, 20);
        ctx.lineTo(55, alto - 35);
        ctx.stroke();

        // Etiquetas.
        ctx.fillStyle = "#cbd5e1";
        ctx.font = "15px Arial";
        ctx.fillText("0", 35, Y(0) + 5);
        ctx.fillText("2π", ancho - 55, Y(0) + 22);
        ctx.fillText("t", ancho - 20, Y(0) + 22);
        ctx.fillText("y(t)", 10, 20);

        function curva(color, funcion) {
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = 4;

            for (let i = 0; i <= 500; i++) {
                const t = (i / 500) * 2 * Math.PI;
                const px = X(t);
                const py = Y(funcion(t));

                if (i === 0) {
                    ctx.moveTo(px, py);
                } else {
                    ctx.lineTo(px, py);
                }
            }

            ctx.stroke();
        }

        let funcion1;
        let funcion2;

        if (lineal) {
            // T{x} = 2x.
            funcion1 = t => 2 * a * Math.sin(t);
            funcion2 = t => a * (2 * Math.sin(t));
        } else {
            // T{x} = x².
            funcion1 = t => Math.pow(a * Math.sin(t), 2);
            funcion2 = t => a * Math.pow(Math.sin(t), 2);
        }

        curva("#38bdf8", funcion1);
        curva("#fb923c", funcion2);

        // Diferencia máxima entre ambas expresiones.
        let error = 0;

        for (let i = 0; i <= 1000; i++) {
            const t = (i / 1000) * 2 * Math.PI;
            error = Math.max(
                error,
                Math.abs(funcion1(t) - funcion2(t))
            );
        }

        if (diferenciaTexto) {
            diferenciaTexto.textContent =
                "Diferencia máxima: " + error.toFixed(4);
        }

        if (error < 0.0001) {
            conclusion.textContent =
                "✓ LAS DOS EXPRESIONES COINCIDEN PARA ESTE VALOR DE a";
            conclusion.style.color = "#4ade80";
        } else {
            conclusion.textContent =
                "✗ LAS DOS EXPRESIONES NO COINCIDEN: NO CUMPLE HOMOGENEIDAD";
            conclusion.style.color = "#fb7185";
        }
    }

    selector.addEventListener("change", dibujarGrafica);
    amplitud.addEventListener("input", dibujarGrafica);
    dibujarGrafica();

    if (typeof Reveal !== "undefined" && typeof Reveal.on === "function") {
        Reveal.on("slidechanged", dibujarGrafica);
    }

    window.addEventListener("resize", dibujarGrafica);
}


/* ==========================================
   SEÑAL DE ENTRADA
   Pulso rectangular: 1 entre 0 ≤ t < 1
========================================== */

function entrada(t) {
    return (t >= 0 && t < 1) ? 1 : 0;
}


function dibujarGraficaClasificacion(
    id,
    xmin,
    xmax,
    ymin,
    ymax,
    curvas
) {
    const canvas = document.getElementById(id);
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const ancho = canvas.width;
    const alto = canvas.height;

    const margenIzq = 65;
    const margenDer = 30;
    const margenSup = 25;
    const margenInf = 45;

    ctx.clearRect(0, 0, ancho, alto);
    ctx.fillStyle = "#111827";
    ctx.fillRect(0, 0, ancho, alto);

    function X(t) {
        return margenIzq +
            ((t - xmin) / (xmax - xmin)) *
            (ancho - margenIzq - margenDer);
    }

    function Y(y) {
        return alto - margenInf -
            ((y - ymin) / (ymax - ymin)) *
            (alto - margenSup - margenInf);
    }

    // Cuadrícula vertical.
    ctx.strokeStyle = "#263548";
    ctx.lineWidth = 1;

    for (let i = 0; i <= 8; i++) {
        const x = margenIzq +
            i * (ancho - margenIzq - margenDer) / 8;

        ctx.beginPath();
        ctx.moveTo(x, margenSup);
        ctx.lineTo(x, alto - margenInf);
        ctx.stroke();
    }

    // Cuadrícula horizontal.
    for (let i = 0; i <= 4; i++) {
        const y = margenSup +
            i * (alto - margenSup - margenInf) / 4;

        ctx.beginPath();
        ctx.moveTo(margenIzq, y);
        ctx.lineTo(ancho - margenDer, y);
        ctx.stroke();
    }

    // Ejes coordenados.
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 2;

    if (ymin <= 0 && ymax >= 0) {
        ctx.beginPath();
        ctx.moveTo(margenIzq, Y(0));
        ctx.lineTo(ancho - margenDer, Y(0));
        ctx.stroke();
    }

    if (xmin <= 0 && xmax >= 0) {
        ctx.beginPath();
        ctx.moveTo(X(0), margenSup);
        ctx.lineTo(X(0), alto - margenInf);
        ctx.stroke();
    }

    // Marcas del eje temporal.
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "15px Arial";
    ctx.textAlign = "center";

    for (let i = 0; i <= 8; i++) {
        const t = xmin + i * (xmax - xmin) / 8;
        ctx.fillText(t.toFixed(1), X(t), alto - 17);
    }

    ctx.textAlign = "left";
    ctx.fillText("Amplitud", 10, 18);
    ctx.fillText("Tiempo (t)", ancho - 105, alto - 5);

    // Dibujar curvas, conservando los saltos de las señales rectangulares.
    curvas.forEach(curva => {
        ctx.beginPath();
        ctx.strokeStyle = curva.color;
        ctx.lineWidth = curva.lineWidth || 4;
        ctx.lineJoin = "round";
        ctx.setLineDash(curva.dash || []);

        const muestras = 2400;
        const saltoMaximo = (ymax - ymin) * 0.12;
        let valorAnterior = null;

        for (let i = 0; i <= muestras; i++) {
            const t = xmin + (i / muestras) * (xmax - xmin);
            const valor = curva.funcion(t);
            const px = X(t);
            const py = Y(valor);

            if (valorAnterior === null) {
                ctx.moveTo(px, py);
            } else {
                const salto = Math.abs(valor - valorAnterior);

                if (salto > saltoMaximo) {
                    // Tramo horizontal hasta la discontinuidad y salto vertical.
                    ctx.lineTo(px, Y(valorAnterior));
                    ctx.lineTo(px, py);
                } else {
                    ctx.lineTo(px, py);
                }
            }

            valorAnterior = valor;
        }

        ctx.stroke();
        ctx.setLineDash([]);
    });
}

const graficasClasificacion = [
    {
        id: "graficaCausal",
        xmin: -1,
        xmax: 3,
        ymin: -0.3,
        ymax: 2.5,
        curvas: [
            {
                color: "#38bdf8",
                funcion: t => entrada(t)
            },
            {
                color: "#fb923c",
                funcion: t => entrada(t) + entrada(t - 1)
            }
        ]
    },
    {
        id: "graficaNoCausal",
        xmin: -2,
        xmax: 3,
        ymin: -0.3,
        ymax: 1.5,
        curvas: [
            {
                color: "#38bdf8",
                funcion: t => entrada(t)
            },
            {
                color: "#fb923c",
                funcion: t => entrada(t + 1)
            }
        ]
    },
    {
        id: "graficaSinMemoria",
        xmin: -1,
        xmax: 3,
        ymin: -0.3,
        ymax: 2.5,
        curvas: [
            {
                color: "#38bdf8",
                funcion: t => entrada(t)
            },
            {
                color: "#fb923c",
                funcion: t => 2 * entrada(t)
            }
        ]
    },
    {
        id: "graficaConMemoria",
        xmin: -1,
        xmax: 3,
        ymin: -0.3,
        ymax: 2.5,
        curvas: [
            {
                color: "#38bdf8",
                funcion: t => entrada(t)
            },
            {
                color: "#fb923c",
                funcion: t => entrada(t) + entrada(t - 1)
            }
        ]
    }
];


function dibujarTodasLasClasificaciones() {
    graficasClasificacion.forEach(grafica => {
        dibujarGraficaClasificacion(
            grafica.id,
            grafica.xmin,
            grafica.xmax,
            grafica.ymin,
            grafica.ymax,
            grafica.curvas
        );
    });
}

document.addEventListener("DOMContentLoaded", () => {
    iniciarLaboratorio();
    dibujarTodasLasClasificaciones();

    window.addEventListener("resize", dibujarTodasLasClasificaciones);

    if (typeof Reveal !== "undefined" && typeof Reveal.on === "function") {
        Reveal.on("slidechanged", () => {
            dibujarTodasLasClasificaciones();
        });
    }
});


function iniciarLaboratorioClasificacion() {
    const propiedad = document.getElementById("propiedadInteractiva");
    const sistema = document.getElementById("sistemaInteractivo");
    const amplitud = document.getElementById("amplitudInteractiva");
    const amplitudValor = document.getElementById("amplitudInteractivaValor");
    const retardo = document.getElementById("retardoInteractivo");
    const retardoValor = document.getElementById("retardoInteractivoValor");
    const controlRetardo = document.getElementById("controlRetardo");
    const formula = document.getElementById("formulaInteractiva");
    const explicacion = document.getElementById("explicacionInteractiva");
    const canvas = document.getElementById("graficaInteractiva");
    if (!propiedad || !sistema || !canvas) return;

    const opciones = {
        causalidad: [["causal", "Causal: presente y pasado"], ["no-causal", "No causal: valor futuro"]],
        memoria: [["sin-memoria", "Sin memoria: solo presente"], ["con-memoria", "Con memoria: usa el pasado"]],
        estabilidad: [["estable", "Estable BIBO"], ["inestable", "Inestable BIBO"]]
    };

    function actualizarOpciones() {
        sistema.replaceChildren(...opciones[propiedad.value].map(([value, label]) => {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = label;
            return option;
        }));
        controlRetardo.hidden = propiedad.value === "estabilidad";
        dibujar();
    }

    function dibujar() {
        const ctx = canvas.getContext("2d");
        const w = canvas.width, h = canvas.height;
        const a = Number(amplitud.value), tau = Number(retardo.value);
        const tipo = propiedad.value, caso = sistema.value;
        const xmin = -2, xmax = 4;
        const ymin = tipo === "estabilidad" && caso === "inestable" ? -2 * a : -0.5;
        const ymax = tipo === "estabilidad" ? Math.max(4, a * 4) : Math.max(2.5, a * 2.5);
        const left = 62, right = 24, top = 24, bottom = 42;
        const X = t => left + (t - xmin) / (xmax - xmin) * (w - left - right);
        const Y = y => h - bottom - (y - ymin) / (ymax - ymin) * (h - top - bottom);
        const x = t => tipo === "estabilidad" ? a : ((t >= 0 && t < 1) ? a : 0);
        let y, formulaTexto, detalle;

        if (tipo === "causalidad" && caso === "causal") {
            y = t => x(t) + x(t - tau);
            formulaTexto = `y(t) = x(t) + x(t − ${tau})`;
            detalle = "La salida combina el valor actual con uno pasado; no necesita conocer el futuro.";
        } else if (tipo === "causalidad") {
            y = t => x(t + tau);
            formulaTexto = `y(t) = x(t + ${tau})`;
            detalle = `La salida en t necesita la entrada futura x(t + ${tau}); por eso no es causal.`;
        } else if (tipo === "memoria" && caso === "sin-memoria") {
            y = t => 2 * x(t);
            formulaTexto = "y(t) = 2x(t)";
            detalle = "La salida depende solo del valor presente; no necesita almacenar valores anteriores.";
        } else if (tipo === "memoria") {
            y = t => x(t) + x(t - tau);
            formulaTexto = `y(t) = x(t) + x(t − ${tau})`;
            detalle = "La salida usa también un valor pasado; puede continuar después del pulso de entrada.";
        } else if (caso === "estable") {
            y = t => 2 * x(t);
            formulaTexto = "y(t) = 2x(t)";
            detalle = `La entrada constante está acotada en ${a}; la salida permanece acotada en ${2 * a}.`;
        } else {
            y = t => (t + 2) * x(t);
            formulaTexto = "y(t) = t x(t)";
            detalle = "La entrada permanece acotada, pero la salida crece con el tiempo; el sistema no es BIBO estable.";
        }

        amplitudValor.value = a; amplitudValor.textContent = a;
        retardoValor.value = tau; retardoValor.textContent = tau;
        formula.textContent = formulaTexto;
        explicacion.textContent = detalle;
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = "#111827"; ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = "#263548"; ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const gy = top + i * (h - top - bottom) / 4;
            ctx.beginPath(); ctx.moveTo(left, gy); ctx.lineTo(w - right, gy); ctx.stroke();
        }
        ctx.strokeStyle = "#cbd5e1"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(left, Y(0)); ctx.lineTo(w - right, Y(0)); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(X(0), top); ctx.lineTo(X(0), h - bottom); ctx.stroke();
        ctx.fillStyle = "#cbd5e1"; ctx.font = "15px Arial"; ctx.textAlign = "center";
        for (let i = 0; i <= 6; i++) ctx.fillText(String(i - 2), X(i - 2), h - 14);
        ctx.textAlign = "left"; ctx.fillText("Amplitud", 8, 18); ctx.fillText("Tiempo (t)", w - 110, h - 5);

        function curva(color, fn) {
            ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = 4;
            const steps = 1000; let previous = null;
            for (let i = 0; i <= steps; i++) {
                const t = xmin + i / steps * (xmax - xmin), value = fn(t);
                const px = X(t), py = Y(Math.max(ymin, Math.min(ymax, value)));
                if (previous === null) ctx.moveTo(px, py);
                else if (Math.abs(value - previous) > (ymax - ymin) * 0.12) {
                    ctx.lineTo(px, Y(previous)); ctx.lineTo(px, py);
                } else ctx.lineTo(px, py);
                previous = value;
            }
            ctx.stroke();
        }
        curva("#38bdf8", x);
        curva("#fb923c", y);
    }

    propiedad.addEventListener("change", actualizarOpciones);
    sistema.addEventListener("change", dibujar);
    amplitud.addEventListener("input", dibujar);
    retardo.addEventListener("input", dibujar);
    window.addEventListener("resize", dibujar);
    actualizarOpciones();
}

document.addEventListener("DOMContentLoaded", iniciarLaboratorioClasificacion);
