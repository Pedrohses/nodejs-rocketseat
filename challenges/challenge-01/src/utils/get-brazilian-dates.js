export function getBrazilianDate() {
  return new Date().toLocaleString('sv-SE', {
    timeZone: 'America/Sao_Paulo'
  }).replace(' ', 'T') + '.000Z'
}