export const formatDate = (isoDate: string) => {
  var d = new Date(isoDate);
  
  return d.toLocaleDateString('pt-BR');
}