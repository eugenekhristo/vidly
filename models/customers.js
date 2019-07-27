const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 30 },
  phone: { type: String, required: true, minlength: 5, maxlength: 30 },
  isGold: { type: Boolean, required: true }
});

const Customer = mongoose.model('Customer', schema);

const getCustomers = async () => {
  const customers = await Customer.find().sort('name');
  return customers;
};

const getCustomerById = async id => {
  try {
    const customer = await Customer.findById(id);
    return customer;
  } catch (err) {
    throw new Error(err.message);
  }
};

const saveCustomer = async customer => {
  let newCustomer = new Customer(customer);
  newCustomer = await newCustomer.save();
  return newCustomer;
};

const deleteCustomer = async id => {
  const customer = await Customer.findByIdAndDelete(id);
  return customer;
};

const updateCustomer = async (id, customer) => {
  const updatedCustomer = await Customer.findByIdAndUpdate(id, customer, {
    new: true
  });
  return updatedCustomer;
};

module.exports = {
  Customer,
  getCustomers,
  getCustomerById,
  saveCustomer,
  deleteCustomer,
  updateCustomer
};
