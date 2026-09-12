import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Standard font options supported in the certificate designer.
 */
export const CERTIFICATE_FONTS = [
  { id: 'georgia', name: 'Georgia — Classical Serif', value: 'Georgia, serif' },
  { id: 'times', name: 'Times New Roman — Traditional Formal', value: "'Times New Roman', Times, serif" },
  { id: 'arial', name: 'Arial — Clean Sans', value: 'Arial, Helvetica, sans-serif' },
  { id: 'playfair', name: 'Playfair Display — Luxury & Elegant', value: "'Playfair Display', Georgia, serif" },
  { id: 'montserrat', name: 'Montserrat — Bold Geometric', value: "'Montserrat', sans-serif" },
  { id: 'roboto', name: 'Roboto — Balanced Contemporary', value: "'Roboto', sans-serif" },
  { id: 'poppins', name: 'Poppins — Modern Display', value: "'Poppins', sans-serif" },
  { id: 'great-vibes', name: 'Great Vibes — Luxury Script', value: "'Great Vibes', cursive" },
  { id: 'inter', name: 'Inter — Modern Clean & Tech', value: "Inter, system-ui, sans-serif" },
  { id: 'cinzel', name: 'Cinzel — Monumental & Classical', value: "'Cinzel', Georgia, serif" },
];

export const CERTIFICATE_BORDER_STYLES = [
  { id: 'solid', name: 'Solid Clean' },
  { id: 'double', name: 'Double Luxury' },
  { id: 'dashed', name: 'Dashed Modern' },
  { id: 'dotted', name: 'Dotted Classical' },
  { id: 'groove', name: 'Groove Chiseled' },
  { id: 'ridge', name: 'Ridge Frame' },
];

export const CERTIFICATE_EMBLEMS = [
  { id: 'rocket', name: 'Launch Rocket (Fast-Track Tech)', icon: '🚀' }
];

export const CERTIFICATE_SIGNATURE_STYLES = [
  { id: 'cursive', name: 'Formal Cursive Script', font: "'Dancing Script', 'Brush Script MT', cursive" },
  { id: 'calligraphy', name: 'Luxury Calligraphy', font: "'Great Vibes', 'Allura', cursive" },
  { id: 'modern', name: 'Modern Designer Script', font: "'Caveat', 'Segoe Script', cursive" },
  { id: 'formal', name: 'Traditional Serif Print', font: "'Georgia', serif" },
];

export const DEFAULT_CERTIFICATE_ELEMENTS = {
  title: {
    content: 'CERTIFICATE OF COMPLETION',
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 26,
    fontWeight: 800,
    fontStyle: 'normal',
    letterSpacing: 2,
    textAlign: 'center',
    color: '#1e293b',
    yPosition: 0,
    xOffset: 0,
    visible: true,
  },
  subtitle: {
    content: 'This is proudly presented to',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: 14,
    fontWeight: 500,
    fontStyle: 'normal',
    letterSpacing: 1,
    textAlign: 'center',
    color: '#64748b',
    yPosition: 0,
    xOffset: 0,
    visible: true,
  },
  studentName: {
    content: '{{studentName}}',
    fontFamily: 'Georgia, serif',
    fontSize: 34,
    fontWeight: 800,
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'center',
    color: '#15803D',
    yPosition: 0,
    xOffset: 0,
    visible: true,
  },
  courseName: {
    content: '{{courseName}}',
    fontFamily: 'Georgia, serif',
    fontSize: 20,
    fontWeight: 700,
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'center',
    color: '#0f172a',
    yPosition: 0,
    xOffset: 0,
    visible: true,
  },
  completionLine: {
    content: 'for successfully completing all curriculum requirements, practical assessments, and capstone projects for',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: 13,
    fontWeight: 400,
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'center',
    color: '#64748b',
    yPosition: 0,
    xOffset: 0,
    visible: true,
  },
  date: {
    content: 'Issued: {{date}}',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: 13,
    fontWeight: 700,
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#0f172a',
    yPosition: 0,
    xOffset: 0,
    visible: true,
  },
  certificateId: {
    content: 'ID: {{certificateId}}',
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: 700,
    fontStyle: 'normal',
    letterSpacing: 1,
    textAlign: 'center',
    color: '#64748b',
    yPosition: 0,
    xOffset: 0,
    visible: true,
  },
  signatureName: {
    content: 'Vikram Nair',
    fontFamily: "'Great Vibes', cursive",
    fontSize: 24,
    fontWeight: 600,
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'right',
    color: '#15803D',
    yPosition: 0,
    xOffset: 0,
    visible: true,
  },
  signatureTitle: {
    content: 'Director of Academic Affairs',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: 12,
    fontWeight: 500,
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'right',
    color: '#64748b',
    yPosition: 0,
    xOffset: 0,
    visible: true,
  },
};

/**
 * Resolves the complete design configuration for a given certificate,
 * dynamically inheriting active template settings so admin customizations
 * are directly and instantly respected in student certificates.
 */
export function getCertificateDesign(cert, certificateTemplates = []) {
  const activeTemplate = certificateTemplates.find(t => t.isActive) || certificateTemplates[0] || {};
  const templateForCert = cert?.templateId
    ? certificateTemplates.find(t => t.id === cert.templateId) || activeTemplate
    : activeTemplate;

  // Inherit design from active/referenced template, allowing custom certificate overrides if present
  const templateDesign = templateForCert?.design || {};
  const rawDesign = {
    ...templateDesign,
    ...(cert?.design || cert?.customDesign || {})
  };

  const accentColor = rawDesign.accentColor || '#15803D';
  const gradientStart = rawDesign.gradientStart || '#f0fdf4';
  const gradientEnd = rawDesign.gradientEnd || '#ffffff';
  const gradientAngle = rawDesign.gradientAngle !== undefined ? Number(rawDesign.gradientAngle) : 135;

  return {
    accentColor,
    paperSize: rawDesign.paperSize || 'a4-landscape',
    padding: rawDesign.padding !== undefined ? Number(rawDesign.padding) : 36,
    bgType: rawDesign.bgType || (rawDesign.bgStyle?.includes('linear-gradient') ? 'gradient' : 'solid'),
    backgroundColor: rawDesign.backgroundColor || '#ffffff',
    gradientStart,
    gradientEnd,
    gradientAngle,
    bgStyle: rawDesign.bgStyle || (rawDesign.bgType === 'solid' ? (rawDesign.backgroundColor || '#ffffff') : `linear-gradient(${gradientAngle}deg, ${gradientStart} 0%, ${gradientEnd} 100%)`),
    bgImage: rawDesign.bgImage || '',
    fontFamily: rawDesign.fontFamily || 'Georgia, serif',
    borderStyle: rawDesign.borderStyle || 'double',
    borderWidth: rawDesign.borderWidth !== undefined ? Number(rawDesign.borderWidth) : 4,
    borderColor: rawDesign.borderColor || accentColor,
    borderRadius: rawDesign.borderRadius !== undefined ? Number(rawDesign.borderRadius) : 8,
    isDark: Boolean(rawDesign.isDark),
    textColor: rawDesign.textColor || (rawDesign.isDark ? '#F1F5F9' : '#1e293b'),
    subtitleColor: rawDesign.subtitleColor || (rawDesign.isDark ? '#94A3B8' : '#64748b'),

    // Inner Border
    innerBorder: {
      enabled: Boolean(rawDesign.innerBorder?.enabled ?? rawDesign.innerBorderEnabled),
      style: rawDesign.innerBorder?.style || rawDesign.innerBorderStyle || 'solid',
      width: rawDesign.innerBorder?.width !== undefined ? Number(rawDesign.innerBorder.width) : (rawDesign.innerBorderWidth !== undefined ? Number(rawDesign.innerBorderWidth) : 2),
      color: rawDesign.innerBorder?.color || rawDesign.innerBorderColor || accentColor,
      offset: rawDesign.innerBorder?.offset !== undefined ? Number(rawDesign.innerBorder.offset) : (rawDesign.innerBorderOffset !== undefined ? Number(rawDesign.innerBorderOffset) : 12),
    },

    // Ribbon Settings
    ribbon: {
      enabled: Boolean(rawDesign.ribbon?.enabled ?? rawDesign.showRibbon),
      position: rawDesign.ribbon?.position || rawDesign.ribbonPosition || 'top-center',
      style: rawDesign.ribbon?.style || rawDesign.ribbonStyle || 'straight',
      color: rawDesign.ribbon?.color || rawDesign.ribbonColor || accentColor,
      text: rawDesign.ribbon?.text || rawDesign.ribbonText || 'VERIFIED CREDENTIAL',
      textColor: rawDesign.ribbon?.textColor || rawDesign.ribbonTextColor || '#ffffff',
      textSize: rawDesign.ribbon?.textSize !== undefined ? Number(rawDesign.ribbon.textSize) : (rawDesign.ribbonTextSize !== undefined ? Number(rawDesign.ribbonTextSize) : 12),
    },

    // Side Ribbon Settings
    sideRibbon: {
      enabled: Boolean(rawDesign.sideRibbon?.enabled ?? rawDesign.sideRibbonEnabled),
      position: rawDesign.sideRibbon?.position || rawDesign.sideRibbonPosition || 'left',
      color: rawDesign.sideRibbon?.color || rawDesign.sideRibbonColor || accentColor,
      text: rawDesign.sideRibbon?.text || rawDesign.sideRibbonText || 'CODELIFT ACADEMY',
    },

    // Logo Settings
    logo: {
      enabled: Boolean(rawDesign.logo?.enabled ?? rawDesign.logoEnabled),
      url: rawDesign.logo?.url || rawDesign.logoUrl || '',
      size: rawDesign.logo?.size !== undefined ? Number(rawDesign.logo.size) : (rawDesign.logoSize !== undefined ? Number(rawDesign.logoSize) : 60),
      position: rawDesign.logo?.position || rawDesign.logoPosition || 'top-left',
    },

    // Seal Settings
    seal: {
      enabled: rawDesign.seal?.enabled !== undefined ? Boolean(rawDesign.seal.enabled) : (rawDesign.sealEnabled !== undefined ? Boolean(rawDesign.sealEnabled) : true),
      image: rawDesign.seal?.image || rawDesign.sealImage || '',
      size: rawDesign.seal?.size !== undefined ? Number(rawDesign.seal.size) : (rawDesign.sealSize !== undefined ? Number(rawDesign.sealSize) : 60),
      position: rawDesign.seal?.position || rawDesign.sealPosition || 'bottom-center',
    },

    // Text Elements Editor
    elements: {
      ...DEFAULT_CERTIFICATE_ELEMENTS,
      ...(rawDesign.elements || {}),
      title: {
        ...DEFAULT_CERTIFICATE_ELEMENTS.title,
        ...(rawDesign.elements?.title || {}),
        content: rawDesign.elements?.title?.content || templateForCert?.certTitle || cert?.certTitle || DEFAULT_CERTIFICATE_ELEMENTS.title.content,
        color: rawDesign.elements?.title?.color || (rawDesign.isDark ? '#F1F5F9' : '#1e293b'),
      },
      studentName: {
        ...DEFAULT_CERTIFICATE_ELEMENTS.studentName,
        ...(rawDesign.elements?.studentName || {}),
        color: rawDesign.elements?.studentName?.color || accentColor,
      },
      signatureName: {
        ...DEFAULT_CERTIFICATE_ELEMENTS.signatureName,
        ...(rawDesign.elements?.signatureName || {}),
        content: rawDesign.elements?.signatureName?.content || templateForCert?.signatoryName || cert?.signatoryName || DEFAULT_CERTIFICATE_ELEMENTS.signatureName.content,
        color: rawDesign.elements?.signatureName?.color || accentColor,
      },
      signatureTitle: {
        ...DEFAULT_CERTIFICATE_ELEMENTS.signatureTitle,
        ...(rawDesign.elements?.signatureTitle || {}),
        content: rawDesign.elements?.signatureTitle?.content || templateForCert?.signatoryTitle || cert?.signatoryTitle || DEFAULT_CERTIFICATE_ELEMENTS.signatureTitle.content,
      }
    },

    showRibbon: Boolean(rawDesign.showRibbon ?? rawDesign.ribbon?.enabled),
    ribbonText: rawDesign.ribbonText || rawDesign.ribbon?.text || 'VERIFIED CREDENTIAL',
    ribbonColor: rawDesign.ribbonColor || rawDesign.ribbon?.color || accentColor,
    showCorners: rawDesign.showCorners !== undefined ? Boolean(rawDesign.showCorners) : true,
    showBadge: rawDesign.showBadge !== undefined ? Boolean(rawDesign.showBadge) : true,
    badgeText: rawDesign.badgeText || 'ACADEMIC EXCELLENCE',
    titleSize: rawDesign.titleSize || '1.45rem',
    nameSize: rawDesign.nameSize || '2.1rem',
    courseSize: rawDesign.courseSize || '1.25rem',
    titleAlign: rawDesign.titleAlign || 'center',
    nameAlign: rawDesign.nameAlign || 'center',

    // Enhanced Customizations
    emblemType: rawDesign.emblemType || templateForCert?.emblemType || 'cap',
    signatureStyle: rawDesign.signatureStyle || templateForCert?.signatureStyle || 'cursive',
    showWatermark: rawDesign.showWatermark !== undefined ? Boolean(rawDesign.showWatermark) : true,

    // Template properties take precedence so admin modifications propagate immediately to student certificates
    instituteName: templateForCert?.instituteName || cert?.instituteName || 'CodeLift Engineering Academy',
    signatoryName: templateForCert?.signatoryName || cert?.signatoryName || 'Vikram Nair',
    signatoryTitle: templateForCert?.signatoryTitle || cert?.signatoryTitle || 'Director of Academic Affairs',
    certTitle: templateForCert?.certTitle || cert?.certTitle || 'CERTIFICATE OF COMPLETION',
  };
}

/**
 * Generates and downloads a full-bleed A4 landscape PDF with zero margins.
 * Renders into an isolated, clean offscreen sandbox container (1123px x 794px, A4 1.414 ratio)
 * to guarantee that sticky panels, scroll offsets, or responsive parents NEVER distort or clip the output.
 *
 * @param {HTMLElement} element - The DOM node of the certificate
 * @param {Object} options - Metadata for naming and fallback styling
 */
export async function generateCertificatePDF(element, options = {}) {
  if (!element) {
    throw new Error('Certificate DOM element is required for PDF generation.');
  }

  const {
    studentName = 'Student',
    courseName = 'Course',
    certId = 'CERT',
    backgroundColor = '#ffffff',
    paperSize = 'a4-landscape'
  } = options;

  let widthPx = 1123;
  let heightPx = 794;
  let pdfWidth = 297;
  let pdfHeight = 210;
  let orientation = 'landscape';
  let format = 'a4';

  if (paperSize === 'a4-portrait') {
    widthPx = 794;
    heightPx = 1123;
    pdfWidth = 210;
    pdfHeight = 297;
    orientation = 'portrait';
    format = 'a4';
  } else if (paperSize === 'letter') {
    widthPx = 1100;
    heightPx = 850;
    pdfWidth = 279.4;
    pdfHeight = 215.9;
    orientation = 'landscape';
    format = 'letter';
  }

  // Build clean offscreen sandbox container
  const sandbox = document.createElement('div');
  sandbox.style.position = 'fixed';
  sandbox.style.left = '-9999px';
  sandbox.style.top = '0';
  sandbox.style.width = `${widthPx}px`;
  sandbox.style.height = `${heightPx}px`;
  sandbox.style.zIndex = '-9999';
  sandbox.style.overflow = 'hidden';
  sandbox.style.backgroundColor = backgroundColor || '#ffffff';

  // Deep clone certificate element into sandbox
  const clone = element.cloneNode(true);
  clone.style.width = `${widthPx}px`;
  clone.style.height = `${heightPx}px`;
  clone.style.maxWidth = `${widthPx}px`;
  clone.style.maxHeight = `${heightPx}px`;
  clone.style.boxShadow = 'none';
  clone.style.transform = 'none';
  clone.style.margin = '0';

  sandbox.appendChild(clone);
  document.body.appendChild(sandbox);

  try {
    const canvas = await html2canvas(clone, {
      scale: 2.5,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: backgroundColor || '#ffffff',
      width: widthPx,
      height: heightPx,
      scrollX: 0,
      scrollY: 0,
      windowWidth: widthPx,
      windowHeight: heightPx,
    });

    const imgData = canvas.toDataURL('image/png', 1.0);

    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format,
      compress: true
    });

    // Full-bleed: top-left (0,0) to bottom-right (pdfWidth, pdfHeight), zero margins
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

    // Clean sanitized filename
    const safeStudent = (studentName || 'Student').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
    const safeCourse = (courseName || 'Course').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `Certificate_${safeStudent}_${safeCourse}.pdf`;

    pdf.save(fileName);
    return fileName;
  } finally {
    // Always clean up sandbox
    if (document.body.contains(sandbox)) {
      document.body.removeChild(sandbox);
    }
  }
}

