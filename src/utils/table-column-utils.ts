export const getTableColumnsWidth = (key: string) => {
  switch (key) {
    case 'app_id':
      return 'max-width:150px;min-width:150px;';
    case 'lan_number':
      return 'max-width:200px;min-width:200px;';
    case 'customer_id':
      return 'max-width:170px;min-width:170px;';
    case 'customer_name':
      return 'max-width:150px;min-width:150px;';
    case 'loan_amount':
      return 'max-width:150px;min-width:150px;';
    case 'disbursement_approval_date':
      return 'max-width:150px;min-width:150px;';
    case 'disb_date':
      return 'max-width:150px;min-width:150px;';

    default:
      return 'max-width:150px;min-width:150px;';
  }
};
