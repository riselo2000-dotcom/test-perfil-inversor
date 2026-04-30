import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, Download, ExternalLink, RotateCcw, Copy, Check, TrendingUp, AlertCircle } from 'lucide-react';

// =============================================================================
// CUESTIONARIO VANGUARD - 11 PREGUNTAS OFICIALES
// Adaptado para audiencia hispanohablante europea
// =============================================================================
const QUESTIONS = [
  {
    id: 1,
    block: 'Horizonte temporal',
    title: '¿Cuándo planeas comenzar a retirar dinero de esta inversión?',
    context: 'Esta es la pregunta más importante del cuestionario. Tu horizonte temporal determina cuánta volatilidad puedes asumir: si tienes 20 años por delante, una caída del 30% es ruido temporal; si necesitas el dinero en 2 años, esa misma caída es catastrófica.',
    options: [
      { label: 'En menos de 3 años', points: 0 },
      { label: 'Entre 3 y 5 años', points: 1 },
      { label: 'Entre 6 y 10 años', points: 3 },
      { label: 'Entre 11 y 15 años', points: 5 },
      { label: 'En 16 años o más', points: 7 },
    ],
  },
  {
    id: 2,
    block: 'Horizonte temporal',
    title: 'Una vez empieces a retirar dinero, ¿durante cuánto tiempo lo harás?',
    context: 'No es lo mismo retirar todo el capital de golpe (ej. compra de vivienda) que ir consumiéndolo poco a poco durante décadas (ej. jubilación). En el segundo caso, la cartera sigue invertida y puede mantener un perfil más agresivo.',
    options: [
      { label: 'Necesitaré todo el dinero de golpe', points: 0 },
      { label: 'Durante 1-2 años', points: 1 },
      { label: 'Durante 3-5 años', points: 3 },
      { label: 'Durante 6-10 años', points: 5 },
      { label: 'Durante más de 10 años', points: 7 },
    ],
  },
  {
    id: 3,
    block: 'Tolerancia subjetiva al riesgo',
    title: 'Generalmente, prefiero inversiones con poca o ninguna fluctuación de valor, aceptando rentabilidades menores.',
    context: 'Aquí Vanguard mide tu preferencia psicológica por la estabilidad. No hay respuesta correcta: se trata de conocerte. Un inversor que valora mucho la tranquilidad sufrirá más con una cartera 100% renta variable, aunque "racionalmente" sea óptima para su horizonte.',
    options: [
      { label: 'Totalmente de acuerdo', points: 0 },
      { label: 'De acuerdo', points: 2 },
      { label: 'En desacuerdo', points: 5 },
      { label: 'Totalmente en desacuerdo', points: 8 },
    ],
  },
  {
    id: 4,
    block: 'Tolerancia subjetiva al riesgo',
    title: '¿Cómo te sentirías ante un cambio brusco en el valor de tu cuenta, sea positivo o negativo?',
    context: 'Esta pregunta evalúa tu reacción emocional ante la volatilidad. Las pérdidas en libros (papel) no son pérdidas reales hasta que se materializan, pero el dolor psicológico es real. Conocer tu reacción evita decisiones impulsivas en mercados bajistas.',
    options: [
      { label: 'Muy incómodo, evitaría inversiones volátiles', points: 0 },
      { label: 'Algo incómodo', points: 3 },
      { label: 'Neutral, lo asumiría como parte del proceso', points: 6 },
      { label: 'Cómodo, las oscilaciones son una oportunidad', points: 8 },
    ],
  },
  {
    id: 5,
    block: 'Capacidad financiera',
    title: 'Cuando se trata de invertir en acciones, bonos o ETFs, me describiría como...',
    context: 'La experiencia previa importa. No por arrogancia, sino porque haber vivido un mercado bajista (2008, 2020, 2022) sin vender en pánico es la mejor escuela. Los inversores nuevos tienden a sobreestimar su tolerancia al riesgo hasta que sufren la primera caída real.',
    options: [
      { label: 'Sin experiencia, principiante', points: 0 },
      { label: 'Poca experiencia (algún fondo, plan de pensiones)', points: 2 },
      { label: 'Experiencia moderada (cartera diversificada propia)', points: 4 },
      { label: 'Experiencia amplia (he vivido al menos un mercado bajista invertido)', points: 6 },
    ],
  },
  {
    id: 6,
    block: 'Capacidad financiera',
    title: 'Mi situación financiera actual la describiría como...',
    context: 'La capacidad para asumir riesgo no es solo psicológica: depende de tu colchón financiero. Tener fondo de emergencia, ingresos estables y poca deuda permite asumir más riesgo en la cartera de inversión sin comprometer tu situación vital ante un imprevisto.',
    options: [
      { label: 'Inestable: ingresos variables o deuda significativa', points: 0 },
      { label: 'Aceptable: cubro gastos pero sin gran margen', points: 2 },
      { label: 'Estable: tengo fondo de emergencia y ahorro mensualmente', points: 5 },
      { label: 'Muy sólida: ahorro elevado, sin deudas problemáticas', points: 7 },
    ],
  },
  {
    id: 7,
    block: 'Capacidad financiera',
    title: 'Mis fuentes de ingresos actuales y futuras (salario, pensión, alquileres...) son...',
    context: 'Los ingresos estables actúan como un "bono" implícito en tu balance personal. Quien tiene un salario seguro o pensión vitalicia puede permitirse más renta variable en su cartera, porque sus necesidades inmediatas están cubiertas por flujos previsibles.',
    options: [
      { label: 'Muy inestables', points: 0 },
      { label: 'Algo inestables', points: 2 },
      { label: 'Estables', points: 5 },
      { label: 'Muy estables y diversificadas', points: 7 },
    ],
  },
  {
    id: 8,
    block: 'Reacción ante mercados bajistas',
    title: 'Entre septiembre y noviembre de 2008, las acciones cayeron más del 31% en 3 meses. Si hubieras tenido una inversión así, ¿qué habrías hecho?',
    context: 'Esta es una pregunta clave: la diferencia entre el inversor exitoso y el que pierde dinero a largo plazo no es la rentabilidad bruta de su cartera, sino su comportamiento en los peores momentos. Vender en mínimos cristaliza pérdidas; mantener o comprar más es la disciplina que recompensa el mercado.',
    options: [
      { label: 'Habría vendido todo para evitar más pérdidas', points: 0 },
      { label: 'Habría vendido una parte', points: 2 },
      { label: 'No habría hecho nada', points: 5 },
      { label: 'Habría comprado más aprovechando la caída', points: 8 },
    ],
  },
  {
    id: 9,
    block: 'Reacción ante mercados bajistas',
    title: 'Entre septiembre y octubre de 2008, los bonos cayeron un 4% en dos meses. Si hubieras tenido bonos en esa situación, ¿qué habrías hecho?',
    context: 'Los bonos suelen percibirse como activos seguros, pero también caen (lo vimos dramáticamente en 2022 con la subida de tipos). Tu reacción ante una caída en la parte conservadora de la cartera dice mucho sobre tu disciplina y comprensión del riesgo de tipos de interés.',
    options: [
      { label: 'Habría vendido todos los bonos', points: 0 },
      { label: 'Habría vendido una parte', points: 2 },
      { label: 'No habría hecho nada', points: 5 },
      { label: 'Habría comprado más bonos', points: 7 },
    ],
  },
  {
    id: 10,
    block: 'Tolerancia al riesgo cuantitativa',
    title: 'Considerando ganancia y pérdida potencial en un año, invertiría mi dinero en...',
    context: 'Vanguard usa esta pregunta con tres carteras hipotéticas de 10.000 € para hacer tangible el concepto de volatilidad. La opción C ofrece la mayor rentabilidad esperada, pero también la mayor pérdida posible. La asimetría psicológica entre ganar 4.229 € y perder 3.639 € no es trivial.',
    options: [
      { label: 'Cartera A: pérdida máx. -164 € / ganancia máx. +593 €', points: 0 },
      { label: 'Cartera B: pérdida máx. -1.020 € / ganancia máx. +1.921 €', points: 4 },
      { label: 'Cartera C: pérdida máx. -3.639 € / ganancia máx. +4.229 €', points: 8 },
    ],
  },
  {
    id: 11,
    block: 'Disciplina inversora',
    title: 'Invertiría en un fondo o ETF basándome únicamente en una breve conversación con un amigo, compañero o familiar.',
    context: 'Pregunta de disciplina: el inversor sólido toma decisiones basadas en análisis y proceso, no en el "tip caliente" de la sobremesa. Esta pregunta detecta a quienes son susceptibles a sesgos sociales (FOMO, herd behavior) que arruinan rentabilidades a largo plazo.',
    options: [
      { label: 'Totalmente de acuerdo', points: 0 },
      { label: 'De acuerdo', points: 2 },
      { label: 'En desacuerdo', points: 5 },
      { label: 'Totalmente en desacuerdo', points: 7 },
    ],
  },
];

// =============================================================================
// PERFILES VANGUARD - 9 ALLOCATIONS OFICIALES
// Mapeo de score a perfil: rangos calibrados sobre puntuación máxima ~80
// =============================================================================
const PROFILES = [
  {
    id: 'income',
    name: 'Ingresos (Income)',
    range: [0, 8],
    allocation: { stocks: 0, bonds: 80, cash: 20 },
    description: 'Preservación del capital y generación de ingresos. Volatilidad mínima, rentabilidad esperada baja. Adecuado para horizontes muy cortos o aversión extrema al riesgo.',
    expectedReturn: '2-4% anual',
    maxDrawdown: '~5-8%',
    color: '#1e40af',
  },
  {
    id: 'income-growth',
    name: 'Ingresos con Crecimiento',
    range: [9, 16],
    allocation: { stocks: 20, bonds: 70, cash: 10 },
    description: 'Énfasis en ingresos y estabilidad, con un componente menor de crecimiento. Cartera muy conservadora.',
    expectedReturn: '3-5% anual',
    maxDrawdown: '~10-15%',
    color: '#2563eb',
  },
  {
    id: 'conservative-growth',
    name: 'Crecimiento Conservador',
    range: [17, 24],
    allocation: { stocks: 30, bonds: 65, cash: 5 },
    description: 'Cartera equilibrada hacia la estabilidad pero con exposición moderada a renta variable para batir la inflación a largo plazo.',
    expectedReturn: '4-6% anual',
    maxDrawdown: '~15-20%',
    color: '#3b82f6',
  },
  {
    id: 'balanced',
    name: 'Equilibrado (Balanced)',
    range: [25, 32],
    allocation: { stocks: 40, bonds: 60, cash: 0 },
    description: 'Equilibrio clásico entre crecimiento y estabilidad. Adecuado para horizontes medios y aversión moderada al riesgo.',
    expectedReturn: '5-7% anual',
    maxDrawdown: '~20-25%',
    color: '#6366f1',
  },
  {
    id: 'moderate-growth',
    name: 'Crecimiento Moderado',
    range: [33, 40],
    allocation: { stocks: 50, bonds: 50, cash: 0 },
    description: 'Cartera 50/50 clásica. Ofrece diversificación robusta entre activos descorrelacionados, equilibrando crecimiento y volatilidad.',
    expectedReturn: '5-7% anual',
    maxDrawdown: '~25-30%',
    color: '#8b5cf6',
  },
  {
    id: 'growth',
    name: 'Crecimiento (Growth)',
    range: [41, 48],
    allocation: { stocks: 60, bonds: 40, cash: 0 },
    description: 'Inclinación hacia el crecimiento. Es la asignación 60/40 tradicional, base de la mayoría de carteras institucionales.',
    expectedReturn: '6-8% anual',
    maxDrawdown: '~30-35%',
    color: '#a855f7',
  },
  {
    id: 'aggressive-growth',
    name: 'Crecimiento Agresivo',
    range: [49, 56],
    allocation: { stocks: 70, bonds: 30, cash: 0 },
    description: 'Foco claro en revalorización a largo plazo. Volatilidad elevada compensada por horizontes largos.',
    expectedReturn: '7-9% anual',
    maxDrawdown: '~35-40%',
    color: '#c026d3',
  },
  {
    id: 'all-growth',
    name: 'Crecimiento Total',
    range: [57, 64],
    allocation: { stocks: 80, bonds: 20, cash: 0 },
    description: 'Cartera fuertemente orientada a renta variable, con un colchón de bonos para mitigar drawdowns severos.',
    expectedReturn: '7-9% anual',
    maxDrawdown: '~40-45%',
    color: '#db2777',
  },
  {
    id: 'all-equity',
    name: '100% Renta Variable',
    range: [65, 100],
    allocation: { stocks: 100, bonds: 0, cash: 0 },
    description: 'Máxima exposición a crecimiento. Solo apropiado para horizontes muy largos (15+ años), alta tolerancia psicológica y capacidad financiera demostrada.',
    expectedReturn: '8-10% anual',
    maxDrawdown: '~50-55%',
    color: '#e11d48',
  },
];

// =============================================================================
// CARTERAS DE ETFs UCITS POR PERFIL
// Datos verificados en justETF.com (abril 2026)
// Criterios: ≥1.000 M€ AUM, mayor liquidez, menor TER en su categoría, acumulación
// =============================================================================
const PORTFOLIOS = {
  'income': [
    { ticker: 'EUNA', isin: 'IE00B3VTMJ91', name: 'iShares € Govt Bond 1-3yr', ter: 0.15, aum: 2200, weight: 40, category: 'Bono gobierno EUR corto' },
    { ticker: 'VGEA', isin: 'IE00BH04GL39', name: 'Vanguard EUR Eurozone Govt Bond Acc', ter: 0.07, aum: 3437, weight: 25, category: 'Bono gobierno EUR' },
    { ticker: 'AGGH', isin: 'IE00BG47KH54', name: 'Vanguard Global Aggregate Bond EUR-H', ter: 0.08, aum: 1953, weight: 15, category: 'Bono global EUR-hedged' },
    { ticker: 'XEON', isin: 'LU0290358497', name: 'Xtrackers EUR Overnight Rate Swap', ter: 0.10, aum: 14000, weight: 20, category: 'Money market EUR' },
  ],
  'income-growth': [
    { ticker: 'EUNA', isin: 'IE00B3VTMJ91', name: 'iShares € Govt Bond 1-3yr', ter: 0.15, aum: 2200, weight: 25, category: 'Bono gobierno EUR corto' },
    { ticker: 'VGEA', isin: 'IE00BH04GL39', name: 'Vanguard EUR Eurozone Govt Bond Acc', ter: 0.07, aum: 3437, weight: 25, category: 'Bono gobierno EUR' },
    { ticker: 'AGGH', isin: 'IE00BG47KH54', name: 'Vanguard Global Aggregate Bond EUR-H', ter: 0.08, aum: 1953, weight: 20, category: 'Bono global EUR-hedged' },
    { ticker: 'XEON', isin: 'LU0290358497', name: 'Xtrackers EUR Overnight Rate Swap', ter: 0.10, aum: 14000, weight: 10, category: 'Money market EUR' },
    { ticker: 'IWDA', isin: 'IE00B4L5Y983', name: 'iShares Core MSCI World Acc', ter: 0.20, aum: 115689, weight: 15, category: 'RV global desarrollados' },
    { ticker: 'EIMI', isin: 'IE00BKM4GZ66', name: 'iShares Core MSCI EM IMI Acc', ter: 0.18, aum: 33974, weight: 5, category: 'RV emergentes' },
  ],
  'conservative-growth': [
    { ticker: 'VGEA', isin: 'IE00BH04GL39', name: 'Vanguard EUR Eurozone Govt Bond Acc', ter: 0.07, aum: 3437, weight: 25, category: 'Bono gobierno EUR' },
    { ticker: 'AGGH', isin: 'IE00BG47KH54', name: 'Vanguard Global Aggregate Bond EUR-H', ter: 0.08, aum: 1953, weight: 25, category: 'Bono global EUR-hedged' },
    { ticker: 'EUNA', isin: 'IE00B3VTMJ91', name: 'iShares € Govt Bond 1-3yr', ter: 0.15, aum: 2200, weight: 15, category: 'Bono gobierno EUR corto' },
    { ticker: 'XEON', isin: 'LU0290358497', name: 'Xtrackers EUR Overnight Rate Swap', ter: 0.10, aum: 14000, weight: 5, category: 'Money market EUR' },
    { ticker: 'IWDA', isin: 'IE00B4L5Y983', name: 'iShares Core MSCI World Acc', ter: 0.20, aum: 115689, weight: 22, category: 'RV global desarrollados' },
    { ticker: 'EIMI', isin: 'IE00BKM4GZ66', name: 'iShares Core MSCI EM IMI Acc', ter: 0.18, aum: 33974, weight: 8, category: 'RV emergentes' },
  ],
  'balanced': [
    { ticker: 'VGEA', isin: 'IE00BH04GL39', name: 'Vanguard EUR Eurozone Govt Bond Acc', ter: 0.07, aum: 3437, weight: 25, category: 'Bono gobierno EUR' },
    { ticker: 'AGGH', isin: 'IE00BG47KH54', name: 'Vanguard Global Aggregate Bond EUR-H', ter: 0.08, aum: 1953, weight: 25, category: 'Bono global EUR-hedged' },
    { ticker: 'EUNA', isin: 'IE00B3VTMJ91', name: 'iShares € Govt Bond 1-3yr', ter: 0.15, aum: 2200, weight: 10, category: 'Bono gobierno EUR corto' },
    { ticker: 'IWDA', isin: 'IE00B4L5Y983', name: 'iShares Core MSCI World Acc', ter: 0.20, aum: 115689, weight: 25, category: 'RV global desarrollados' },
    { ticker: 'MEUD', isin: 'LU0908500753', name: 'Amundi Core MSCI Europe Acc', ter: 0.07, aum: 5500, weight: 7, category: 'RV Europa' },
    { ticker: 'EIMI', isin: 'IE00BKM4GZ66', name: 'iShares Core MSCI EM IMI Acc', ter: 0.18, aum: 33974, weight: 8, category: 'RV emergentes' },
  ],
  'moderate-growth': [
    { ticker: 'VGEA', isin: 'IE00BH04GL39', name: 'Vanguard EUR Eurozone Govt Bond Acc', ter: 0.07, aum: 3437, weight: 25, category: 'Bono gobierno EUR' },
    { ticker: 'AGGH', isin: 'IE00BG47KH54', name: 'Vanguard Global Aggregate Bond EUR-H', ter: 0.08, aum: 1953, weight: 25, category: 'Bono global EUR-hedged' },
    { ticker: 'IWDA', isin: 'IE00B4L5Y983', name: 'iShares Core MSCI World Acc', ter: 0.20, aum: 115689, weight: 30, category: 'RV global desarrollados' },
    { ticker: 'MEUD', isin: 'LU0908500753', name: 'Amundi Core MSCI Europe Acc', ter: 0.07, aum: 5500, weight: 10, category: 'RV Europa' },
    { ticker: 'EIMI', isin: 'IE00BKM4GZ66', name: 'iShares Core MSCI EM IMI Acc', ter: 0.18, aum: 33974, weight: 10, category: 'RV emergentes' },
  ],
  'growth': [
    { ticker: 'VGEA', isin: 'IE00BH04GL39', name: 'Vanguard EUR Eurozone Govt Bond Acc', ter: 0.07, aum: 3437, weight: 20, category: 'Bono gobierno EUR' },
    { ticker: 'AGGH', isin: 'IE00BG47KH54', name: 'Vanguard Global Aggregate Bond EUR-H', ter: 0.08, aum: 1953, weight: 20, category: 'Bono global EUR-hedged' },
    { ticker: 'IWDA', isin: 'IE00B4L5Y983', name: 'iShares Core MSCI World Acc', ter: 0.20, aum: 115689, weight: 35, category: 'RV global desarrollados' },
    { ticker: 'MEUD', isin: 'LU0908500753', name: 'Amundi Core MSCI Europe Acc', ter: 0.07, aum: 5500, weight: 12, category: 'RV Europa' },
    { ticker: 'EIMI', isin: 'IE00BKM4GZ66', name: 'iShares Core MSCI EM IMI Acc', ter: 0.18, aum: 33974, weight: 13, category: 'RV emergentes' },
  ],
  'aggressive-growth': [
    { ticker: 'VGEA', isin: 'IE00BH04GL39', name: 'Vanguard EUR Eurozone Govt Bond Acc', ter: 0.07, aum: 3437, weight: 15, category: 'Bono gobierno EUR' },
    { ticker: 'AGGH', isin: 'IE00BG47KH54', name: 'Vanguard Global Aggregate Bond EUR-H', ter: 0.08, aum: 1953, weight: 15, category: 'Bono global EUR-hedged' },
    { ticker: 'IWDA', isin: 'IE00B4L5Y983', name: 'iShares Core MSCI World Acc', ter: 0.20, aum: 115689, weight: 40, category: 'RV global desarrollados' },
    { ticker: 'MEUD', isin: 'LU0908500753', name: 'Amundi Core MSCI Europe Acc', ter: 0.07, aum: 5500, weight: 15, category: 'RV Europa' },
    { ticker: 'EIMI', isin: 'IE00BKM4GZ66', name: 'iShares Core MSCI EM IMI Acc', ter: 0.18, aum: 33974, weight: 15, category: 'RV emergentes' },
  ],
  'all-growth': [
    { ticker: 'AGGH', isin: 'IE00BG47KH54', name: 'Vanguard Global Aggregate Bond EUR-H', ter: 0.08, aum: 1953, weight: 20, category: 'Bono global EUR-hedged' },
    { ticker: 'IWDA', isin: 'IE00B4L5Y983', name: 'iShares Core MSCI World Acc', ter: 0.20, aum: 115689, weight: 45, category: 'RV global desarrollados' },
    { ticker: 'MEUD', isin: 'LU0908500753', name: 'Amundi Core MSCI Europe Acc', ter: 0.07, aum: 5500, weight: 15, category: 'RV Europa' },
    { ticker: 'EIMI', isin: 'IE00BKM4GZ66', name: 'iShares Core MSCI EM IMI Acc', ter: 0.18, aum: 33974, weight: 20, category: 'RV emergentes' },
  ],
  'all-equity': [
    { ticker: 'VWCE', isin: 'IE00BK5BQT80', name: 'Vanguard FTSE All-World Acc', ter: 0.22, aum: 22000, weight: 50, category: 'RV global (incl. emergentes)' },
    { ticker: 'IWDA', isin: 'IE00B4L5Y983', name: 'iShares Core MSCI World Acc', ter: 0.20, aum: 115689, weight: 20, category: 'RV global desarrollados' },
    { ticker: 'MEUD', isin: 'LU0908500753', name: 'Amundi Core MSCI Europe Acc', ter: 0.07, aum: 5500, weight: 15, category: 'RV Europa' },
    { ticker: 'EIMI', isin: 'IE00BKM4GZ66', name: 'iShares Core MSCI EM IMI Acc', ter: 0.18, aum: 33974, weight: 15, category: 'RV emergentes' },
  ],
};

// =============================================================================
// COMPONENTES UI
// =============================================================================

// Pie chart SVG inline
function PieChart({ allocation, profileColor }) {
  const data = [
    { label: 'Renta variable', value: allocation.stocks, color: profileColor },
    { label: 'Renta fija', value: allocation.bonds, color: '#475569' },
    { label: 'Liquidez', value: allocation.cash, color: '#cbd5e1' },
  ].filter(d => d.value > 0);

  const total = data.reduce((sum, d) => sum + d.value, 0);
  let cumulativeAngle = -90;

  const radius = 80;
  const cx = 100;
  const cy = 100;

  const slices = data.map((d, i) => {
    const angle = (d.value / total) * 360;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;
    cumulativeAngle = endAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;

    if (data.length === 1) {
      return (
        <circle key={i} cx={cx} cy={cy} r={radius} fill={d.color} />
      );
    }

    const path = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    return <path key={i} d={path} fill={d.color} stroke="#fff" strokeWidth="2" />;
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <svg viewBox="0 0 200 200" className="w-44 h-44">
        {slices}
      </svg>
      <div className="flex flex-col gap-2 text-sm">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: d.color }}></div>
            <span className="font-mono text-stone-700">{d.label}</span>
            <span className="font-bold text-stone-900 ml-auto">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Barra de progreso
function ProgressBar({ current, total }) {
  const pct = (current / total) * 100;
  return (
    <div className="w-full">
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-xs uppercase tracking-widest text-stone-500 font-medium">Pregunta {current} de {total}</span>
        <span className="text-xs font-mono text-stone-500">{Math.round(pct)}%</span>
      </div>
      <div className="w-full h-1 bg-stone-200 overflow-hidden">
        <div
          className="h-full bg-stone-900 transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        ></div>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN APP
// =============================================================================
export default function InvestorProfileTest() {
  const [phase, setPhase] = useState('welcome'); // welcome | quiz | result
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: { optionIdx, points } }
  const [copied, setCopied] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentQ, phase]);

  const totalScore = Object.values(answers).reduce((sum, a) => sum + a.points, 0);

  const profile = PROFILES.find(
    p => totalScore >= p.range[0] && totalScore <= p.range[1]
  ) || PROFILES[PROFILES.length - 1];

  const portfolio = PORTFOLIOS[profile.id] || [];
  const weightedTER = portfolio.reduce((sum, etf) => sum + (etf.ter * etf.weight) / 100, 0);

  const handleAnswer = (optionIdx, points) => {
    const qId = QUESTIONS[currentQ].id;
    setAnswers(prev => ({ ...prev, [qId]: { optionIdx, points } }));
    setTimeout(() => {
      if (currentQ < QUESTIONS.length - 1) {
        setCurrentQ(currentQ + 1);
      } else {
        setPhase('result');
      }
    }, 250);
  };

  const handleBack = () => {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1);
    } else {
      setPhase('welcome');
    }
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentQ(0);
    setPhase('welcome');
  };

  const generateExport = () => {
    const date = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    let md = `# Test de Perfil de Inversor — Resultados\n\n`;
    md += `**Fecha:** ${date}\n`;
    md += `**Metodología:** Cuestionario de Vanguard adaptado (11 preguntas)\n`;
    md += `**Puntuación total:** ${totalScore} puntos\n\n`;
    md += `---\n\n## Perfil resultante: ${profile.name}\n\n`;
    md += `${profile.description}\n\n`;
    md += `**Asset Allocation recomendada:**\n`;
    md += `- Renta variable: ${profile.allocation.stocks}%\n`;
    md += `- Renta fija: ${profile.allocation.bonds}%\n`;
    md += `- Liquidez / Money market: ${profile.allocation.cash}%\n\n`;
    md += `**Rentabilidad esperada anualizada:** ${profile.expectedReturn}\n`;
    md += `**Drawdown máximo esperado:** ${profile.maxDrawdown}\n\n`;
    md += `---\n\n## Cartera implementación con ETFs UCITS\n\n`;
    md += `TER ponderado de la cartera: **${weightedTER.toFixed(3)}%**\n\n`;
    md += `| Ticker | ISIN | Nombre | Categoría | Peso | TER | AUM (M€) |\n`;
    md += `|--------|------|--------|-----------|------|-----|----------|\n`;
    portfolio.forEach(e => {
      md += `| ${e.ticker} | ${e.isin} | ${e.name} | ${e.category} | ${e.weight}% | ${e.ter.toFixed(2)}% | ${e.aum.toLocaleString('es-ES')} |\n`;
    });
    md += `\n---\n\n## Respuestas al cuestionario\n\n`;
    QUESTIONS.forEach((q, i) => {
      const a = answers[q.id];
      if (a !== undefined) {
        md += `**${i + 1}. ${q.title}**\n`;
        md += `→ ${q.options[a.optionIdx].label} *(${a.points} pts)*\n\n`;
      }
    });
    md += `---\n\n## Disclaimers\n\n`;
    md += `- Esta herramienta NO constituye asesoramiento financiero personalizado bajo MiFID II.\n`;
    md += `- El cuestionario es una adaptación del Investor Questionnaire público de Vanguard Group.\n`;
    md += `- Los ETFs propuestos son UCITS domiciliados en Irlanda/Luxemburgo, seleccionados por TER y AUM.\n`;
    md += `- Datos de TER y AUM verificados en justETF.com (abril 2026). Sujetos a cambios.\n`;
    md += `- Rentabilidades pasadas no garantizan rentabilidades futuras.\n`;
    md += `- Considera tu situación fiscal personal (IRPF, Modelos 720/721 si aplica) antes de invertir.\n`;
    return md;
  };

  const handleDownload = () => {
    const md = generateExport();
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `perfil-inversor-${profile.id}-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyPortfolio = () => {
    const text = portfolio.map(e => `${e.ticker} (${e.isin}) — ${e.weight}%`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ========================================================================
  // RENDER
  // ========================================================================
  return (
    <div className="min-h-screen bg-stone-50" style={{ fontFamily: '"Inter", system-ui, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;0,9..144,800;0,9..144,900;1,9..144,400&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
        .font-display { font-family: 'Fraunces', Georgia, serif; font-optical-sizing: auto; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .fade-in { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .slide-in { animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>

      <div ref={scrollRef} className="max-w-3xl mx-auto px-4 py-8 md:py-12">

        {/* HEADER */}
        <header className="mb-10 fade-in">
          <div className="flex items-baseline gap-3 mb-2">
            <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
            <span className="text-xs uppercase tracking-[0.2em] text-stone-500 font-medium">Test de Perfil de Inversor</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-light text-stone-900 leading-tight">
            ¿Qué tipo de <span className="italic font-medium">inversor</span> eres?
          </h1>
          <p className="text-stone-600 mt-3 max-w-xl">
            Basado en el cuestionario oficial de Vanguard. 11 preguntas, ~5 minutos.
          </p>
        </header>

        {/* WELCOME PHASE */}
        {phase === 'welcome' && (
          <div className="fade-in space-y-6">
            <div className="bg-white border border-stone-200 p-8 md:p-10">
              <h2 className="font-display text-2xl text-stone-900 mb-4">¿Por qué hacer este test?</h2>
              <p className="text-stone-700 leading-relaxed mb-4">
                La asignación de activos (cuánto en renta variable, cuánto en renta fija) es <strong>el factor que más explica</strong> la rentabilidad y volatilidad de tu cartera a largo plazo, por encima de la elección concreta de activos.
              </p>
              <p className="text-stone-700 leading-relaxed">
                Este cuestionario evalúa tres dimensiones de tu perfil: <em className="font-display">horizonte temporal</em>, <em className="font-display">capacidad financiera</em> y <em className="font-display">tolerancia al riesgo</em>. El resultado te dará una asignación recomendada y una cartera concreta de ETFs UCITS para implementarla.
              </p>
            </div>

            <div className="bg-amber-50/50 border-l-2 border-amber-600 p-6">
              <div className="flex gap-3 items-start">
                <AlertCircle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-stone-700 space-y-2">
                  <p><strong>Disclaimer:</strong> Esta herramienta es educativa y <strong>no constituye asesoramiento financiero personalizado</strong> bajo MiFID II. No considera tu situación fiscal completa (IRPF, Modelos 720/721) ni tus objetivos vitales específicos.</p>
                  <p>Los ETFs propuestos son UCITS domiciliados en Irlanda/Luxemburgo, seleccionados por TER bajo y AUM elevado. Datos verificados en justETF.com (abril 2026).</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setPhase('quiz')}
              className="w-full md:w-auto bg-stone-900 text-stone-50 px-8 py-4 font-medium tracking-wide hover:bg-stone-800 transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              Comenzar cuestionario
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* QUIZ PHASE */}
        {phase === 'quiz' && (
          <div className="space-y-8">
            <ProgressBar current={currentQ + 1} total={QUESTIONS.length} />

            <div key={currentQ} className="slide-in space-y-6">
              <div>
                <span className="inline-block text-xs uppercase tracking-widest text-amber-700 font-medium mb-3">
                  {QUESTIONS[currentQ].block}
                </span>
                <h2 className="font-display text-2xl md:text-3xl text-stone-900 leading-tight font-light">
                  {QUESTIONS[currentQ].title}
                </h2>
              </div>

              <div className="bg-stone-100/70 border-l-2 border-stone-400 p-5 text-sm text-stone-700 leading-relaxed">
                <span className="font-mono text-xs uppercase tracking-widest text-stone-500 block mb-2">¿Por qué se pregunta esto?</span>
                {QUESTIONS[currentQ].context}
              </div>

              <div className="space-y-2">
                {QUESTIONS[currentQ].options.map((opt, i) => {
                  const isSelected = answers[QUESTIONS[currentQ].id]?.optionIdx === i;
                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i, opt.points)}
                      className={`w-full text-left p-4 md:p-5 border transition-all duration-150 group ${
                        isSelected
                          ? 'bg-stone-900 text-stone-50 border-stone-900'
                          : 'bg-white border-stone-200 hover:border-stone-900 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <span className={`font-mono text-xs ${isSelected ? 'text-amber-300' : 'text-stone-400 group-hover:text-amber-600'}`}>
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="flex-1 text-sm md:text-base">{opt.label}</span>
                        <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'translate-x-1' : 'group-hover:translate-x-1'}`} />
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-stone-200">
                <button
                  onClick={handleBack}
                  className="text-sm text-stone-600 hover:text-stone-900 flex items-center gap-1 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Atrás
                </button>
                <span className="text-xs font-mono text-stone-400">
                  Puntuación acumulada: {totalScore}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* RESULT PHASE */}
        {phase === 'result' && (
          <div className="fade-in space-y-8">
            {/* Profile header */}
            <div className="border-t-4 pt-8" style={{ borderColor: profile.color }}>
              <span className="text-xs uppercase tracking-[0.2em] font-medium" style={{ color: profile.color }}>
                Tu perfil resultante
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-light text-stone-900 mt-2 mb-3">
                {profile.name}
              </h2>
              <div className="flex items-baseline gap-6 text-sm font-mono text-stone-500">
                <span>Score: <strong className="text-stone-900">{totalScore} pts</strong></span>
                <span>Rango: {profile.range[0]}–{profile.range[1]}</span>
              </div>
            </div>

            <p className="text-stone-700 leading-relaxed text-lg">
              {profile.description}
            </p>

            {/* Allocation */}
            <div className="bg-white border border-stone-200 p-6 md:p-8">
              <h3 className="font-display text-xl text-stone-900 mb-6">Asignación de activos recomendada</h3>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <PieChart allocation={profile.allocation} profileColor={profile.color} />
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between border-b border-stone-200 pb-3">
                    <span className="text-stone-600">Rentabilidad esperada anualizada</span>
                    <span className="font-bold text-stone-900 font-mono">{profile.expectedReturn}</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-200 pb-3">
                    <span className="text-stone-600">Drawdown máximo esperado</span>
                    <span className="font-bold text-stone-900 font-mono">{profile.maxDrawdown}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">Horizonte mínimo recomendado</span>
                    <span className="font-bold text-stone-900 font-mono">
                      {profile.allocation.stocks >= 70 ? '10+ años' : profile.allocation.stocks >= 40 ? '5-10 años' : '3-5 años'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ETF Portfolio */}
            <div className="bg-white border border-stone-200 p-6 md:p-8">
              <div className="flex justify-between items-baseline mb-6">
                <h3 className="font-display text-xl text-stone-900">Cartera de implementación</h3>
                <span className="text-xs font-mono text-stone-500">
                  TER ponderado: <strong className="text-stone-900">{weightedTER.toFixed(3)}%</strong>
                </span>
              </div>

              <div className="space-y-3">
                {portfolio.map((etf, i) => (
                  <div key={i} className="border-l-2 border-stone-200 hover:border-amber-600 transition-colors pl-4 py-2">
                    <div className="flex justify-between items-baseline gap-3 mb-1">
                      <div className="flex items-baseline gap-3 flex-wrap">
                        <span className="font-mono font-bold text-stone-900">{etf.ticker}</span>
                        <span className="text-xs font-mono text-stone-400">{etf.isin}</span>
                      </div>
                      <span className="font-display text-2xl font-light text-stone-900">{etf.weight}%</span>
                    </div>
                    <div className="text-sm text-stone-700">{etf.name}</div>
                    <div className="flex gap-4 text-xs text-stone-500 mt-1 font-mono">
                      <span>{etf.category}</span>
                      <span>TER {etf.ter.toFixed(2)}%</span>
                      <span>AUM {etf.aum.toLocaleString('es-ES')} M€</span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleCopyPortfolio}
                className="mt-6 text-sm text-stone-700 hover:text-stone-900 flex items-center gap-2 transition-colors"
              >
                {copied ? <><Check className="w-4 h-4 text-green-600" /> Copiado al portapapeles</> : <><Copy className="w-4 h-4" /> Copiar cartera (ticker + ISIN + peso)</>}
              </button>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <a
                href="https://curvo.eu/backtest"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-stone-900 text-stone-50 px-6 py-4 font-medium hover:bg-stone-800 transition-all flex items-center justify-center gap-2 group"
              >
                <TrendingUp className="w-4 h-4" />
                Hacer backtesting de esta cartera en Curvo.eu
                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
              <p className="text-xs text-stone-500 text-center px-4">
                Curvo no permite carga directa por URL. Copia la cartera con el botón de arriba y pégala manualmente al construir el portafolio.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleDownload}
                  className="border border-stone-300 px-6 py-3 text-sm hover:bg-stone-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Descargar resumen
                </button>
                <button
                  onClick={handleRestart}
                  className="border border-stone-300 px-6 py-3 text-sm hover:bg-stone-100 transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Repetir test
                </button>
              </div>
            </div>

            {/* Final disclaimer */}
            <div className="bg-stone-100 p-6 text-xs text-stone-600 leading-relaxed">
              <strong className="text-stone-900 block mb-2">Disclaimer importante</strong>
              <p className="mb-2">
                Esta herramienta es educativa. No constituye asesoramiento financiero personalizado bajo MiFID II. La selección de ETFs prioriza criterios objetivos (TER, AUM, replicación física, domicilio fiscal) pero no considera tu situación fiscal completa, objetivos vitales o restricciones específicas.
              </p>
              <p className="mb-2">
                Antes de invertir, consulta el KID/PRIIPs de cada producto, revisa tu situación fiscal (IRPF, Modelo 720/721 si aplica) y considera la disponibilidad del ETF en tu broker (Folionet, IBKR, Trade Republic, eToro, Revolut). Los ETFs UCITS irlandeses suelen ofrecer eficiencia fiscal vía retención del 15% en origen sobre dividendos USA.
              </p>
              <p>
                Datos de ETFs verificados en justETF.com (abril 2026). TER y AUM sujetos a cambios. Rentabilidades pasadas no garantizan rentabilidades futuras.
              </p>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <footer className="mt-16 pt-8 border-t border-stone-200 text-xs font-mono text-stone-400 flex flex-wrap justify-between gap-2">
          <span>Vanguard Investor Questionnaire · Adaptación ES</span>
          <span>v1.0 · 2026</span>
        </footer>
      </div>
    </div>
  );
}
