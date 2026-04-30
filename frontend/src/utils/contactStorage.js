
export const saveContact = (contact) => {
  const contacts = JSON.parse(localStorage.getItem("contacts")) || [];
  contacts.push(contact);
  localStorage.setItem("contacts", JSON.stringify(contacts));
};

export const getContacts = () => {
  return JSON.parse(localStorage.getItem("contacts")) || [];
};