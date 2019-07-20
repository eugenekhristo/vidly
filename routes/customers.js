const router = require('express').Router();
const validateCustomer = require('../utils/validators/customer');
const Customer = require('../models/customers');

router.get('/', async (req, res) => {
  const customers = await Customer.getCustomers();
  res.send(customers);
});

router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.getCustomerById(req.params.id);

    if (!customer)
      return res
        .status(404)
        .send(`There's no customer with id of ${req.params.id}`);

    res.send(customer);
  } catch (err) {
    res.send(`Invalid ID format`);
  }
});

router.post('/', async (req, res) => {
  const errorMessage = validateCustomer(req.body);
  if (errorMessage) return res.status(400).send(errorMessage);

  const customer = await Customer.saveCustomer(req.body);
  res.send(customer);
});

router.delete('/:id', async (req, res) => {
  const customer = await Customer.deleteCustomer(req.params.id);

  if (!customer)
    res.status(404).send(`There's no customer with id of ${req.params.id}`);

  res.send(customer);
});

router.put('/:id', async (req, res) => {
  const errorMessage = validateCustomer(req.body);

  if (errorMessage) return res.status(400).send(errorMessage);

  const customer = await Customer.updateCustomer(req.params.id, req.body);

  if (!customer)
    res.status(404).send(`There's no customer with id of ${req.params.id}`);

  res.send(customer);
});

module.exports = router;
