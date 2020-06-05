const required = value => (value ? undefined : 'Required');

const phoneCheck = value => {
    if (value === undefined) return 'Required';
    const patt = new RegExp(/^((\+7|7|8)+([0-9]){10})$/gm);
    if (!patt.test(value)) return 'Phone number should be 11 digits and begin from +7, 7, or 8';
};

const getFields = (formValues = {}) => [
  {
    id: 1,
    name: "name",
    type: "text",
    validate: required,
    placeholder: "Enter your name",
    label: "Name",
  },
  { 
    id: 2,
    name: "phone",
    type: "tel",
    validate: phoneCheck,
    placeholder: "Enter Your phone",
    label: "Phone",
  },
  { 
    id: 3,
    name: "comment",
    type: "text",
    validate: required,
    placeholder: "Comment to order",
    label: "Comment",
  },
  { 
    id: 4,
    name: "delivery",
    type: "checkbox",
    label: "Delivery",
  },
  formValues.delivery ? 
  { 
    id: 5,
    name: "address",
    type: "text",
    validate: required,
    placeholder: "Enter your address",
    label: "Address",
  } : false,
];

export { getFields };