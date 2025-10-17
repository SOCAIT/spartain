// Fill these with your Sahha sandbox credentials or inject at build time
export const SAHHA_APP_ID = 'pp7Nx9wkoLSVEpxBlJHqgtnFFiu9RlHZ';
export const SAHHA_APP_SECRET = 'yLVAPwaJd7hy8PuAl7jDNizjkP3GQm7HcT0NWd2h0kPbZvcxEXFBS5zTdFm7jhwy';
export const SAHHA_EXTERNAL_ID = 'SampleProfile-23c9312e-fa9f-4da5-8383-e98d27b35c4e';


export function hasSahhaCredentials(): boolean {
  return Boolean(SAHHA_APP_ID && SAHHA_APP_SECRET && SAHHA_EXTERNAL_ID);
}


