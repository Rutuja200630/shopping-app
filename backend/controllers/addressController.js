import Address from '../models/Address.js';
import asyncHandler from '../utils/asyncHandler.js';

// ── Get All Addresses ────────────────────────────────────────────────────────
export const getAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
  res.status(200).json({ addresses });
});

// ── Create Address ───────────────────────────────────────────────────────────
export const createAddress = asyncHandler(async (req, res) => {
  const { label, street, city, state, zipCode, phone, isDefault } = req.body;

  // If set to default, reset other addresses for this user
  if (isDefault) {
    await Address.updateMany({ user: req.user._id }, { isDefault: false });
  }

  // Check if this is the first address, default it automatically
  const addressCount = await Address.countDocuments({ user: req.user._id });
  const shouldBeDefault = addressCount === 0 ? true : !!isDefault;

  const address = await Address.create({
    user: req.user._id,
    label: label || 'Home',
    street,
    city,
    state,
    zipCode,
    phone,
    isDefault: shouldBeDefault
  });

  res.status(201).json({ address });
});

// ── Update Address ───────────────────────────────────────────────────────────
export const updateAddress = asyncHandler(async (req, res) => {
  const { label, street, city, state, zipCode, phone, isDefault } = req.body;

  const address = await Address.findOne({ _id: req.params.id, user: req.user._id });
  if (!address) {
    res.status(404);
    throw new Error('Address not found or unauthorized.');
  }

  // If updated to default, reset other addresses for this user
  if (isDefault && !address.isDefault) {
    await Address.updateMany({ user: req.user._id }, { isDefault: false });
    address.isDefault = true;
  } else if (isDefault === false && address.isDefault) {
    // Cannot unset default if it is the only address
    const totalAddresses = await Address.countDocuments({ user: req.user._id });
    if (totalAddresses > 1) {
      address.isDefault = false;
      // Set the first other address as default
      const another = await Address.findOne({ user: req.user._id, _id: { $ne: address._id } });
      if (another) {
        another.isDefault = true;
        await another.save();
      }
    }
  }

  address.label = label || address.label;
  address.street = street || address.street;
  address.city = city || address.city;
  address.state = state || address.state;
  address.zipCode = zipCode || address.zipCode;
  address.phone = phone || address.phone;

  await address.save();

  res.status(200).json({ address });
});

// ── Delete Address ───────────────────────────────────────────────────────────
export const deleteAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOne({ _id: req.params.id, user: req.user._id });
  if (!address) {
    res.status(404);
    throw new Error('Address not found or unauthorized.');
  }

  const wasDefault = address.isDefault;
  await Address.deleteOne({ _id: req.params.id });

  // If we deleted the default address, set another one as default (if any exists)
  if (wasDefault) {
    const another = await Address.findOne({ user: req.user._id });
    if (another) {
      another.isDefault = true;
      await another.save();
    }
  }

  res.status(200).json({ message: 'Address deleted successfully.' });
});
