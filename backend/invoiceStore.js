export const invoices = {};
let counter = 0;

export function createInvoice(data) {
  counter++;
  invoices[counter] = {
    id: counter,
    ...data,
    votes: [],
    status: "PENDING"
  };
  return invoices[counter];
}

export function vote(invoiceId, admin) {
  const inv = invoices[invoiceId];
  if (!inv.votes.includes(admin)) {
    inv.votes.push(admin);
  }
  return inv;
}
