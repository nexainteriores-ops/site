/**
 * Meta Pixel — Helper de Eventos de Conversão
 * Encapsula fbq com segurança (TypeScript + fallback se pixel não estiver carregado)
 */

// Declaração global para o TypeScript reconhecer window.fbq
declare global {
  interface Window {
    fbq: (action: string, event: string, params?: Record<string, unknown>) => void;
  }
}

const fbq = (action: string, event: string, params?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq(action, event, params);
  }
};

/**
 * Lead — Clique no botão de Agendar Curadoria Gratuita (WhatsApp)
 * Localização: Hero CTA principal + VisitSection
 */
export const trackLead = (source: string = 'hero') => {
  fbq('track', 'Lead', {
    content_name: 'Curadoria Gratuita',
    content_category: 'WhatsApp CTA',
    source,
  });
};

/**
 * Contact — Clique em "Entrar no Grupo VIP"
 * Localização: VIPSection
 */
export const trackContact = () => {
  fbq('track', 'Contact', {
    content_name: 'Grupo VIP Nexa',
    content_category: 'WhatsApp Group',
  });
};

/**
 * ViewContent — Abertura de uma categoria do catálogo
 * Localização: Collections — ao clicar em Sofás, Poltronas ou Salas de Jantar
 */
export const trackViewContent = (categoryTitle: string, categoryId: string) => {
  fbq('track', 'ViewContent', {
    content_name: categoryTitle,
    content_category: 'Catalogo',
    content_ids: [categoryId],
    content_type: 'product_group',
  });
};

/**
 * FindLocation — Clique em "Abrir no Google Maps"
 * Localização: VisitSection
 */
export const trackFindLocation = () => {
  fbq('track', 'FindLocation', {
    content_name: 'Nexa Interiores - Ribeirão Preto',
  });
};

/**
 * CustomEvent — Visualização do Instagram (catálogo completo)
 * Localização: Collections — link para Instagram
 */
export const trackInstagramClick = () => {
  fbq('trackCustom', 'InstagramCatalogClick', {
    content_name: 'Ver Catálogo Completo',
    platform: 'Instagram',
  });
};
