const Booking = require('../models/booking');

exports.createBooking = async (req, res) => {
  try {
    await Booking.create(req.body);
    res.status(201).send('Booking created successfully');
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    // Get the userId from the auth middleware
    const userId = req.userId;
    const bookings = await Booking.getByUserId(userId);
    res.send(bookings);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.deleteBookings = async (req, res) => {
  try {
    // Get the userId from the auth middleware
    const userId = req.userId;
    const { bookingId } = req.body
    const bookings = await Booking.remove(userId, bookingId);
    res.send(bookings);
  } catch (err) {
    res.status(400).send(err.message);
  }
}